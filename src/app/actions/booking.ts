'use server';

import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type {
  Booking,
  BookingListItem,
  BookingStatus,
  CreateBookingInput,
  CreateBookingResponse,
  GetBookingsResponse,
  GetBookingByIdResponse,
  BookingActionResponse,
  ServiceType,
  LocationType,
} from '@/types/booking';
import {
  BOOKING_MIN_DURATION,
  BOOKING_MAX_DURATION,
  CUSTOMER_NOTE_MAX_LENGTH,
} from '@/types/booking';

// ============================================
// 유틸리티 함수
// ============================================

// 인증된 사용자 확인
async function verifyAuth(token: string): Promise<string | null> {
  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid;
  } catch {
    return null;
  }
}

// 예약 ID 생성
function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `BK${timestamp}${random}`.toUpperCase();
}

// ============================================
// 예약 생성
// ============================================
export async function createBooking(
  token: string,
  input: CreateBookingInput
): Promise<CreateBookingResponse> {
  try {
    const uid = await verifyAuth(token);
    if (!uid) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    const db = getAdminDb();

    // 입력값 검증
    if (!input.uncleId) {
      return { success: false, error: '아조씨를 선택해주세요.' };
    }
    if (!input.services || input.services.length === 0) {
      return { success: false, error: '서비스를 선택해주세요.' };
    }
    if (input.duration < BOOKING_MIN_DURATION || input.duration > BOOKING_MAX_DURATION) {
      return { success: false, error: `이용 시간은 ${BOOKING_MIN_DURATION}~${BOOKING_MAX_DURATION}시간이어야 합니다.` };
    }
    if (input.customerNote && input.customerNote.length > CUSTOMER_NOTE_MAX_LENGTH) {
      return { success: false, error: `요청사항은 ${CUSTOMER_NOTE_MAX_LENGTH}자 이내로 입력해주세요.` };
    }

    // 아조씨 정보 조회
    const uncleDoc = await db.collection('uncles').doc(input.uncleId).get();
    if (!uncleDoc.exists) {
      return { success: false, error: '아조씨를 찾을 수 없습니다.' };
    }
    const uncleData = uncleDoc.data()!;
    if (uncleData.status !== 'approved') {
      return { success: false, error: '해당 아조씨는 현재 예약을 받지 않습니다.' };
    }

    // 고객 정보 조회
    const customerDoc = await db.collection('customers').doc(uid).get();
    if (!customerDoc.exists) {
      return { success: false, error: '고객 정보를 찾을 수 없습니다.' };
    }
    const customerData = customerDoc.data()!;

    // 예상 금액 계산
    const hourlyRate = uncleData.hourlyRate || 50000;
    const estimatedPrice = hourlyRate * input.duration;

    // 예약 생성
    const bookingId = generateBookingId();
    const now = Timestamp.now();

    const bookingData = {
      bookingId,
      customerId: uid,
      uncleId: input.uncleId,

      uncleSnapshot: {
        displayName: uncleData.displayName,
        profileImage: uncleData.profileImages?.[uncleData.mainImageIndex || 0] || '',
        hourlyRate,
      },

      customerSnapshot: {
        displayName: customerData.displayName || null,
        email: customerData.email,
      },

      services: input.services as ServiceType[],
      requestedDate: Timestamp.fromDate(new Date(input.requestedDate)),
      requestedTime: input.requestedTime,
      duration: input.duration,
      locationType: input.locationType as LocationType,
      locationAddress: input.locationAddress || undefined,
      preferredArea: input.preferredArea,
      customerNote: input.customerNote || '',

      hourlyRate,
      estimatedPrice,

      status: 'pending' as const,
      createdAt: now,
    };

    await db.collection('bookings').doc(bookingId).set(bookingData);

    // TODO: 아조씨에게 알림 전송 (FCM)

    return {
      success: true,
      data: {
        bookingId,
        estimatedPrice,
        message: '예약 요청이 완료되었습니다. 아조씨의 수락을 기다려주세요.',
      },
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: '예약 요청 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 목록 조회
// ============================================
export async function getBookings(
  token: string,
  role: 'customer' | 'uncle',
  status?: BookingStatus[],
  limit = 20,
  lastDocId?: string
): Promise<GetBookingsResponse> {
  try {
    const uid = await verifyAuth(token);
    if (!uid) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    const db = getAdminDb();

    // 역할에 따라 쿼리 필터링
    const fieldName = role === 'customer' ? 'customerId' : 'uncleId';
    let query = db.collection('bookings')
      .where(fieldName, '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit + 1);

    // 상태 필터
    if (status && status.length > 0) {
      query = query.where('status', 'in', status);
    }

    // 페이징
    if (lastDocId) {
      const lastDoc = await db.collection('bookings').doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const bookings: BookingListItem[] = [];
    let hasMore = false;

    snapshot.docs.forEach((doc, index) => {
      if (index < limit) {
        const data = doc.data();
        bookings.push({
          bookingId: data.bookingId,
          uncleId: data.uncleId,
          customerId: data.customerId,
          uncleSnapshot: data.uncleSnapshot,
          customerSnapshot: data.customerSnapshot,
          services: data.services,
          requestedDate: data.requestedDate,
          requestedTime: data.requestedTime,
          duration: data.duration,
          estimatedPrice: data.estimatedPrice,
          status: data.status,
          createdAt: data.createdAt,
        });
      } else {
        hasMore = true;
      }
    });

    return {
      success: true,
      data: {
        bookings,
        hasMore,
        lastDocId: bookings.length > 0 ? bookings[bookings.length - 1].bookingId : null,
      },
    };
  } catch (error) {
    console.error('Error getting bookings:', error);
    return { success: false, error: '예약 목록을 불러오는 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 상세 조회
// ============================================
export async function getBookingById(
  token: string,
  bookingId: string
): Promise<GetBookingByIdResponse> {
  try {
    const uid = await verifyAuth(token);
    if (!uid) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    const db = getAdminDb();
    const doc = await db.collection('bookings').doc(bookingId).get();

    if (!doc.exists) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    const data = doc.data()!;

    // 본인 예약인지 확인
    if (data.customerId !== uid && data.uncleId !== uid) {
      return { success: false, error: '접근 권한이 없습니다.' };
    }

    return {
      success: true,
      data: {
        booking: data as Booking,
      },
    };
  } catch (error) {
    console.error('Error getting booking:', error);
    return { success: false, error: '예약 정보를 불러오는 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 수락 (아조씨)
// ============================================
export async function acceptBooking(
  token: string,
  bookingId: string
): Promise<BookingActionResponse> {
  try {
    const uid = await verifyAuth(token);
    if (!uid) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    const db = getAdminDb();
    const doc = await db.collection('bookings').doc(bookingId).get();

    if (!doc.exists) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    const data = doc.data()!;

    // 아조씨 본인인지 확인
    if (data.uncleId !== uid) {
      return { success: false, error: '접근 권한이 없습니다.' };
    }

    // 상태 확인
    if (data.status !== 'pending') {
      return { success: false, error: '이미 처리된 예약입니다.' };
    }

    // 예약 수락
    await db.collection('bookings').doc(bookingId).update({
      status: 'confirmed',
      confirmedAt: FieldValue.serverTimestamp(),
    });

    // TODO: 고객에게 알림 전송 (FCM)

    return {
      success: true,
      data: {
        bookingId,
        status: 'confirmed',
        message: '예약을 수락했습니다. 고객에게 알림이 전송됩니다.',
      },
    };
  } catch (error) {
    console.error('Error accepting booking:', error);
    return { success: false, error: '예약 수락 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 거절 (아조씨)
// ============================================
export async function rejectBooking(
  token: string,
  bookingId: string,
  reason?: string
): Promise<BookingActionResponse> {
  try {
    const uid = await verifyAuth(token);
    if (!uid) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    const db = getAdminDb();
    const doc = await db.collection('bookings').doc(bookingId).get();

    if (!doc.exists) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    const data = doc.data()!;

    // 아조씨 본인인지 확인
    if (data.uncleId !== uid) {
      return { success: false, error: '접근 권한이 없습니다.' };
    }

    // 상태 확인
    if (data.status !== 'pending') {
      return { success: false, error: '이미 처리된 예약입니다.' };
    }

    // 예약 거절
    await db.collection('bookings').doc(bookingId).update({
      status: 'cancelled',
      rejectReason: reason || '아조씨가 예약을 거절했습니다.',
      cancelledBy: 'uncle',
      cancelledAt: FieldValue.serverTimestamp(),
    });

    // TODO: 고객에게 알림 전송 (FCM)

    return {
      success: true,
      data: {
        bookingId,
        status: 'cancelled',
        message: '예약을 거절했습니다.',
      },
    };
  } catch (error) {
    console.error('Error rejecting booking:', error);
    return { success: false, error: '예약 거절 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 취소 (고객/아조씨)
// ============================================
export async function cancelBooking(
  token: string,
  bookingId: string,
  reason: string
): Promise<BookingActionResponse> {
  try {
    const uid = await verifyAuth(token);
    if (!uid) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    const db = getAdminDb();
    const doc = await db.collection('bookings').doc(bookingId).get();

    if (!doc.exists) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    const data = doc.data()!;

    // 본인 예약인지 확인
    const isCustomer = data.customerId === uid;
    const isUncle = data.uncleId === uid;
    if (!isCustomer && !isUncle) {
      return { success: false, error: '접근 권한이 없습니다.' };
    }

    // 취소 가능 상태 확인
    if (!['pending', 'confirmed'].includes(data.status)) {
      return { success: false, error: '취소할 수 없는 예약입니다.' };
    }

    // 예약 취소
    await db.collection('bookings').doc(bookingId).update({
      status: 'cancelled',
      cancelReason: reason,
      cancelledBy: isCustomer ? 'customer' : 'uncle',
      cancelledAt: FieldValue.serverTimestamp(),
    });

    // TODO: 상대방에게 알림 전송 (FCM)

    return {
      success: true,
      data: {
        bookingId,
        status: 'cancelled',
        message: '예약이 취소되었습니다.',
      },
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { success: false, error: '예약 취소 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 서비스 시작 (아조씨) - 자동 또는 수동
// ============================================
export async function startBooking(
  token: string,
  bookingId: string
): Promise<BookingActionResponse> {
  try {
    const uid = await verifyAuth(token);
    if (!uid) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    const db = getAdminDb();
    const doc = await db.collection('bookings').doc(bookingId).get();

    if (!doc.exists) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    const data = doc.data()!;

    // 아조씨 본인인지 확인
    if (data.uncleId !== uid) {
      return { success: false, error: '접근 권한이 없습니다.' };
    }

    // 상태 확인
    if (data.status !== 'confirmed') {
      return { success: false, error: '확정된 예약만 시작할 수 있습니다.' };
    }

    // 서비스 시작
    await db.collection('bookings').doc(bookingId).update({
      status: 'in_progress',
      startedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      data: {
        bookingId,
        status: 'in_progress',
        message: '서비스가 시작되었습니다.',
      },
    };
  } catch (error) {
    console.error('Error starting booking:', error);
    return { success: false, error: '서비스 시작 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 서비스 완료 (아조씨)
// ============================================
export async function completeBooking(
  token: string,
  bookingId: string
): Promise<BookingActionResponse> {
  try {
    const uid = await verifyAuth(token);
    if (!uid) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    const db = getAdminDb();
    const doc = await db.collection('bookings').doc(bookingId).get();

    if (!doc.exists) {
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    const data = doc.data()!;

    // 아조씨 본인인지 확인
    if (data.uncleId !== uid) {
      return { success: false, error: '접근 권한이 없습니다.' };
    }

    // 상태 확인
    if (!['confirmed', 'in_progress'].includes(data.status)) {
      return { success: false, error: '완료할 수 없는 예약입니다.' };
    }

    // 서비스 완료
    await db.collection('bookings').doc(bookingId).update({
      status: 'completed',
      completedAt: FieldValue.serverTimestamp(),
    });

    // TODO: 고객에게 매너 평가 요청 알림 전송 (FCM)

    return {
      success: true,
      data: {
        bookingId,
        status: 'completed',
        message: '서비스가 완료되었습니다. 고객에게 매너 평가 요청이 전송됩니다.',
      },
    };
  } catch (error) {
    console.error('Error completing booking:', error);
    return { success: false, error: '서비스 완료 처리 중 오류가 발생했습니다.' };
  }
}
