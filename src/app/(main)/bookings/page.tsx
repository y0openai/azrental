'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { BookingList } from '@/components/booking';
import {
  acceptBooking,
  rejectBooking,
  cancelBooking,
  startBooking,
  completeBooking,
} from '@/services/bookingService';
import type { BookingListItem } from '@/types/booking';

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [cancelModalBookingId, setCancelModalBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // TODO: 아조씨 역할 추가 시 동적으로 변경
  const [role] = useState<'customer' | 'uncle'>('customer');

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/bookings');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <BookingsPageSkeleton />;
  }

  if (!user) {
    return null;
  }

  const userRole = role;

  // 예약 클릭
  const handleSelect = (booking: BookingListItem) => {
    router.push(`/bookings/${booking.bookingId}`);
  };

  // 예약 수락
  const handleAccept = async (bookingId: string) => {
    const response = await acceptBooking(bookingId);
    if (!response.success) {
      setActionError(response.error || '예약 수락에 실패했습니다.');
    }
  };

  // 예약 거절
  const handleReject = async (bookingId: string) => {
    // 간단한 거절 (사유 없이)
    const response = await rejectBooking(bookingId);
    if (!response.success) {
      setActionError(response.error || '예약 거절에 실패했습니다.');
    }
  };

  // 예약 취소 (모달 열기)
  const handleCancelClick = async (bookingId: string): Promise<void> => {
    setCancelModalBookingId(bookingId);
    setCancelReason('');
  };

  // 예약 취소 확정
  const handleCancelConfirm = async () => {
    if (!cancelModalBookingId || !cancelReason.trim()) return;

    const response = await cancelBooking(cancelModalBookingId, cancelReason);
    if (response.success) {
      setCancelModalBookingId(null);
      setCancelReason('');
    } else {
      setActionError(response.error || '예약 취소에 실패했습니다.');
    }
  };

  // 서비스 시작
  const handleStart = async (bookingId: string) => {
    const response = await startBooking(bookingId);
    if (!response.success) {
      setActionError(response.error || '서비스 시작에 실패했습니다.');
    }
  };

  // 서비스 완료
  const handleComplete = async (bookingId: string) => {
    const response = await completeBooking(bookingId);
    if (!response.success) {
      setActionError(response.error || '서비스 완료에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {userRole === 'uncle' ? '받은 예약' : '내 예약'}
          </h1>
          <p className="mt-2 text-gray-600">
            {userRole === 'uncle'
              ? '고객들이 요청한 예약을 관리하세요'
              : '예약 내역을 확인하고 관리하세요'}
          </p>
        </div>
      </div>

      {/* 에러 메시지 */}
      {actionError && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 예약 목록 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookingList
          role={userRole}
          onSelect={handleSelect}
          onAccept={handleAccept}
          onReject={handleReject}
          onCancel={handleCancelClick}
          onStart={handleStart}
          onComplete={handleComplete}
          variant="list"
          showStatusTabs={true}
        />
      </div>

      {/* 취소 모달 */}
      {cancelModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              예약 취소
            </h3>
            <p className="text-gray-600 mb-4">
              취소 사유를 입력해주세요.
            </p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="취소 사유를 입력해주세요"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalBookingId(null)}
                className="flex-1 py-2.5 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200"
              >
                닫기
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={!cancelReason.trim()}
                className="flex-1 py-2.5 text-white bg-red-500 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton
function BookingsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-20 animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
