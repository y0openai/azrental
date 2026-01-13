'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { useBookingDetail } from '@/hooks/useBooking';
import {
  formatDate,
  formatDateTime,
  formatServices,
  formatPrice,
  getStatusLabel,
  getLocationLabel,
  canCancel,
  canRespond,
} from '@/services/bookingService';
import { BOOKING_STATUS_COLORS } from '@/types/booking';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;
  const isSuccess = searchParams.get('success') === 'true';

  const { user, loading: authLoading } = useAuthContext();
  // TODO: 아조씨 역할 추가 시 동적으로 변경
  const [role] = useState<'customer' | 'uncle'>('customer');
  const {
    booking,
    loading,
    error,
    fetch,
    accept,
    reject,
    cancel,
    start,
    complete,
  } = useBookingDetail();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/bookings/${bookingId}`);
    }
  }, [user, authLoading, router, bookingId]);

  // 예약 정보 로드
  useEffect(() => {
    if (user && bookingId) {
      fetch(bookingId);
    }
  }, [user, bookingId, fetch]);

  if (authLoading || loading) {
    return <BookingDetailSkeleton />;
  }

  if (!user) {
    return null;
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error || '예약 정보를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.push('/bookings')}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
          >
            예약 목록으로
          </button>
        </div>
      </div>
    );
  }

  const userRole = role;
  const isUncle = role === 'uncle';
  const statusColor = BOOKING_STATUS_COLORS[booking.status];

  // 액션 핸들러
  const handleAccept = async () => {
    setActionLoading(true);
    setActionError(null);
    const success = await accept();
    if (!success) {
      setActionError('예약 수락에 실패했습니다.');
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    setActionLoading(true);
    setActionError(null);
    const success = await reject();
    if (!success) {
      setActionError('예약 거절에 실패했습니다.');
    }
    setActionLoading(false);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setActionLoading(true);
    setActionError(null);
    const success = await cancel(cancelReason);
    if (success) {
      setShowCancelModal(false);
      setCancelReason('');
    } else {
      setActionError('예약 취소에 실패했습니다.');
    }
    setActionLoading(false);
  };

  const handleStart = async () => {
    setActionLoading(true);
    setActionError(null);
    const success = await start();
    if (!success) {
      setActionError('서비스 시작에 실패했습니다.');
    }
    setActionLoading(false);
  };

  const handleComplete = async () => {
    setActionLoading(true);
    setActionError(null);
    const success = await complete();
    if (!success) {
      setActionError('서비스 완료에 실패했습니다.');
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 성공 배너 */}
      {isSuccess && (
        <div className="bg-green-500 text-white py-3 text-center">
          <span className="font-medium">예약이 성공적으로 요청되었습니다!</span>
        </div>
      )}

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/bookings')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            예약 목록
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 에러 메시지 */}
        {actionError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {actionError}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 상태 헤더 */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                {getStatusLabel(booking.status)}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(booking.createdAt)} 요청
              </span>
            </div>
          </div>

          {/* 상대방 정보 */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={booking.uncleSnapshot.profileImage || '/images/default-profile.png'}
                  alt={booking.uncleSnapshot.displayName}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">
                  {isUncle
                    ? booking.customerSnapshot.displayName || '고객'
                    : booking.uncleSnapshot.displayName}
                </h2>
                {isUncle && (
                  <p className="text-sm text-gray-500">
                    {booking.customerSnapshot.email}
                  </p>
                )}
                {!isUncle && (
                  <Link
                    href={`/uncles/${booking.uncleId}`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    프로필 보기
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 예약 정보 */}
          <div className="px-6 py-4 space-y-4">
            <div>
              <span className="text-sm text-gray-500">서비스</span>
              <p className="font-medium text-gray-900 mt-1">
                {formatServices(booking.services)}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">일시</span>
              <p className="font-medium text-gray-900 mt-1">
                {formatDateTime(booking.requestedDate, booking.requestedTime)}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">이용 시간</span>
              <p className="font-medium text-gray-900 mt-1">
                {booking.duration}시간
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">장소</span>
              <p className="font-medium text-gray-900 mt-1">
                {getLocationLabel(booking.locationType)}
                {booking.locationAddress && ` - ${booking.locationAddress}`}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">선호 지역</span>
              <p className="font-medium text-gray-900 mt-1">
                {booking.preferredArea}
              </p>
            </div>

            {booking.customerNote && (
              <div>
                <span className="text-sm text-gray-500">요청사항</span>
                <p className="font-medium text-gray-900 mt-1 whitespace-pre-wrap">
                  {booking.customerNote}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">예상 금액</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(booking.estimatedPrice)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {booking.hourlyRate.toLocaleString()}원 × {booking.duration}시간
              </p>
            </div>
          </div>

          {/* 취소/거절 사유 */}
          {(booking.cancelReason || booking.rejectReason) && (
            <div className="px-6 py-4 bg-red-50 border-t border-red-100">
              <span className="text-sm text-red-700 font-medium">
                {booking.status === 'cancelled' ? '취소 사유' : '거절 사유'}
              </span>
              <p className="text-red-600 mt-1">
                {booking.cancelReason || booking.rejectReason}
              </p>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="px-6 py-4 border-t border-gray-100">
            {/* 아조씨: 수락/거절 (pending) */}
            {isUncle && canRespond(booking) && (
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  거절
                </button>
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="flex-1 py-3 text-white bg-primary-500 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50"
                >
                  수락
                </button>
              </div>
            )}

            {/* 아조씨: 시작/완료 (confirmed/in_progress) */}
            {isUncle && booking.status === 'confirmed' && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={actionLoading}
                  className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleStart}
                  disabled={actionLoading}
                  className="flex-1 py-3 text-white bg-green-500 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
                >
                  서비스 시작
                </button>
              </div>
            )}

            {isUncle && booking.status === 'in_progress' && (
              <button
                onClick={handleComplete}
                disabled={actionLoading}
                className="w-full py-3 text-white bg-blue-500 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
              >
                서비스 완료
              </button>
            )}

            {/* 고객: 취소 (pending/confirmed) */}
            {!isUncle && canCancel(booking) && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={actionLoading}
                className="w-full py-3 text-red-600 bg-red-50 rounded-lg font-medium hover:bg-red-100 disabled:opacity-50"
              >
                예약 취소
              </button>
            )}

            {/* 완료/취소된 예약 */}
            {(booking.status === 'completed' || booking.status === 'cancelled') && (
              <Link
                href="/bookings"
                className="block w-full py-3 text-center text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200"
              >
                목록으로 돌아가기
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 취소 모달 */}
      {showCancelModal && (
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
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200"
              >
                닫기
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason.trim() || actionLoading}
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
function BookingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 w-16 bg-gray-200 rounded mb-1" />
                <div className="h-5 w-48 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="h-12 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
