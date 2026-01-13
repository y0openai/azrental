// Booking Service - 예약 관리 클라이언트 서비스
import { auth } from '@/lib/firebase/config';
import {
  createBooking as createBookingAction,
  getBookings as getBookingsAction,
  getBookingById as getBookingByIdAction,
  acceptBooking as acceptBookingAction,
  rejectBooking as rejectBookingAction,
  cancelBooking as cancelBookingAction,
  startBooking as startBookingAction,
  completeBooking as completeBookingAction,
} from '@/app/actions/booking';
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
  FirestoreTimestamp,
} from '@/types/booking';
import { SERVICE_LABELS, BOOKING_STATUS_LABELS, LOCATION_LABELS } from '@/types/booking';

// ============================================
// 인증 토큰 가져오기
// ============================================
async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}

// ============================================
// 예약 생성
// ============================================
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const response = await createBookingAction(token, input);
    return response;
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: '예약 요청 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 목록 조회
// ============================================
export async function fetchBookings(
  role: 'customer' | 'uncle',
  status?: BookingStatus[],
  limit = 20,
  lastDocId?: string
): Promise<GetBookingsResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const response = await getBookingsAction(token, role, status, limit, lastDocId);
    return response;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { success: false, error: '예약 목록을 불러오는 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 상세 조회
// ============================================
export async function fetchBookingById(
  bookingId: string
): Promise<GetBookingByIdResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const response = await getBookingByIdAction(token, bookingId);
    return response;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return { success: false, error: '예약 정보를 불러오는 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 수락 (아조씨)
// ============================================
export async function acceptBooking(
  bookingId: string
): Promise<BookingActionResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const response = await acceptBookingAction(token, bookingId);
    return response;
  } catch (error) {
    console.error('Error accepting booking:', error);
    return { success: false, error: '예약 수락 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 거절 (아조씨)
// ============================================
export async function rejectBooking(
  bookingId: string,
  reason?: string
): Promise<BookingActionResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const response = await rejectBookingAction(token, bookingId, reason);
    return response;
  } catch (error) {
    console.error('Error rejecting booking:', error);
    return { success: false, error: '예약 거절 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 예약 취소 (고객/아조씨)
// ============================================
export async function cancelBooking(
  bookingId: string,
  reason: string
): Promise<BookingActionResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const response = await cancelBookingAction(token, bookingId, reason);
    return response;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { success: false, error: '예약 취소 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 서비스 시작 (아조씨)
// ============================================
export async function startBooking(
  bookingId: string
): Promise<BookingActionResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const response = await startBookingAction(token, bookingId);
    return response;
  } catch (error) {
    console.error('Error starting booking:', error);
    return { success: false, error: '서비스 시작 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 서비스 완료 (아조씨)
// ============================================
export async function completeBooking(
  bookingId: string
): Promise<BookingActionResponse> {
  const token = await getIdToken();
  if (!token) {
    return { success: false, error: '로그인이 필요합니다.' };
  }

  try {
    const response = await completeBookingAction(token, bookingId);
    return response;
  } catch (error) {
    console.error('Error completing booking:', error);
    return { success: false, error: '서비스 완료 처리 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 유틸리티 함수
// ============================================

// FirestoreTimestamp를 Date로 변환
export function timestampToDate(timestamp: FirestoreTimestamp): Date {
  if (timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp.seconds * 1000);
}

// 날짜 포맷팅 (YYYY.MM.DD)
export function formatDate(timestamp: FirestoreTimestamp): string {
  const date = timestampToDate(timestamp);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
}

// 날짜 + 시간 포맷팅
export function formatDateTime(timestamp: FirestoreTimestamp, time: string): string {
  const dateStr = formatDate(timestamp);
  return `${dateStr} ${time}`;
}

// 서비스 종류 레이블 변환
export function getServiceLabels(services: ServiceType[]): string[] {
  return services.map(s => SERVICE_LABELS[s] || s);
}

// 서비스 종류 문자열로 변환
export function formatServices(services: ServiceType[], separator = ', '): string {
  return getServiceLabels(services).join(separator);
}

// 상태 레이블 가져오기
export function getStatusLabel(status: BookingStatus): string {
  return BOOKING_STATUS_LABELS[status] || status;
}

// 장소 유형 레이블 가져오기
export function getLocationLabel(locationType: string): string {
  return LOCATION_LABELS[locationType as keyof typeof LOCATION_LABELS] || locationType;
}

// 금액 포맷팅
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
}

// 예상 금액 계산
export function calculateEstimatedPrice(hourlyRate: number, duration: number): number {
  return hourlyRate * duration;
}

// 취소 가능 여부 확인
export function canCancel(booking: Booking | BookingListItem): boolean {
  return ['pending', 'confirmed'].includes(booking.status);
}

// 수락/거절 가능 여부 확인 (아조씨)
export function canRespond(booking: Booking | BookingListItem): boolean {
  return booking.status === 'pending';
}

// 완료 처리 가능 여부 확인 (아조씨)
export function canComplete(booking: Booking | BookingListItem): boolean {
  return ['confirmed', 'in_progress'].includes(booking.status);
}
