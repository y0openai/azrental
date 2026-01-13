'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  formatDate,
  formatServices,
  formatPrice,
  getStatusLabel,
  canCancel,
  canRespond,
  canComplete,
} from '@/services/bookingService';
import type { BookingListItem } from '@/types/booking';
import { BOOKING_STATUS_COLORS } from '@/types/booking';

// ============================================
// Props
// ============================================
interface BookingCardProps {
  booking: BookingListItem;
  role: 'customer' | 'uncle';
  onClick?: (booking: BookingListItem) => void;
  onAccept?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onStart?: (bookingId: string) => void;
  onComplete?: (bookingId: string) => void;
  variant?: 'default' | 'compact';
}

// ============================================
// BookingCard Component
// ============================================
export function BookingCard({
  booking,
  role,
  onClick,
  onAccept,
  onReject,
  onCancel,
  onStart,
  onComplete,
  variant = 'default',
}: BookingCardProps) {
  const handleClick = () => {
    onClick?.(booking);
  };

  const statusLabel = getStatusLabel(booking.status);
  const statusColor = BOOKING_STATUS_COLORS[booking.status];

  // 컴팩트 뷰
  if (variant === 'compact') {
    return (
      <div
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
        onClick={handleClick}
      >
        {/* 프로필 이미지 */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={booking.uncleSnapshot.profileImage || '/images/default-profile.png'}
            alt={booking.uncleSnapshot.displayName}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 truncate">
              {role === 'customer'
                ? booking.uncleSnapshot.displayName
                : booking.customerSnapshot.displayName || booking.customerSnapshot.email}
            </h4>
            <span className={`px-1.5 py-0.5 text-xs rounded ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {formatDate(booking.requestedDate)} {booking.requestedTime}
          </p>
        </div>

        {/* 금액 */}
        <span className="text-sm font-medium text-gray-700 flex-shrink-0">
          {formatPrice(booking.estimatedPrice)}
        </span>
      </div>
    );
  }

  // 기본 뷰
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div
        className="p-4 border-b border-gray-100 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          {/* 상대방 정보 */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={booking.uncleSnapshot.profileImage || '/images/default-profile.png'}
                alt={booking.uncleSnapshot.displayName}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {role === 'customer'
                  ? booking.uncleSnapshot.displayName
                  : booking.customerSnapshot.displayName || '고객'}
              </h3>
              {role === 'uncle' && (
                <p className="text-sm text-gray-500">
                  {booking.customerSnapshot.email}
                </p>
              )}
            </div>
          </div>

          {/* 상태 뱃지 */}
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* 예약 정보 */}
      <div className="p-4 space-y-3" onClick={handleClick}>
        {/* 서비스 */}
        <div className="flex items-start gap-2">
          <span className="text-gray-500 flex-shrink-0">📋</span>
          <span className="text-sm text-gray-700">
            {formatServices(booking.services)}
          </span>
        </div>

        {/* 날짜/시간 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📅</span>
          <span className="text-sm text-gray-700">
            {formatDate(booking.requestedDate)} {booking.requestedTime}
          </span>
        </div>

        {/* 이용시간 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">⏱️</span>
          <span className="text-sm text-gray-700">
            {booking.duration}시간
          </span>
        </div>

        {/* 금액 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">💰</span>
          <span className="text-sm font-medium text-primary-600">
            {formatPrice(booking.estimatedPrice)}
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="p-4 pt-0">
        {/* 아조씨: 수락/거절 버튼 (pending 상태) */}
        {role === 'uncle' && canRespond(booking) && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject?.(booking.bookingId)}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              거절
            </button>
            <button
              onClick={() => onAccept?.(booking.bookingId)}
              className="flex-1 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
            >
              수락
            </button>
          </div>
        )}

        {/* 아조씨: 시작/완료 버튼 (confirmed/in_progress 상태) */}
        {role === 'uncle' && booking.status === 'confirmed' && (
          <div className="flex gap-2">
            <button
              onClick={() => onCancel?.(booking.bookingId)}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => onStart?.(booking.bookingId)}
              className="flex-1 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              서비스 시작
            </button>
          </div>
        )}

        {role === 'uncle' && booking.status === 'in_progress' && (
          <button
            onClick={() => onComplete?.(booking.bookingId)}
            className="w-full py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            서비스 완료
          </button>
        )}

        {/* 고객: 취소 버튼 (pending/confirmed 상태) */}
        {role === 'customer' && canCancel(booking) && (
          <button
            onClick={() => onCancel?.(booking.bookingId)}
            className="w-full py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            예약 취소
          </button>
        )}

        {/* 상세 보기 링크 */}
        {(booking.status === 'completed' || booking.status === 'cancelled') && (
          <Link
            href={`/bookings/${booking.bookingId}`}
            className="block w-full py-2 text-center text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            상세 보기
          </Link>
        )}
      </div>
    </div>
  );
}

// ============================================
// Skeleton Component
// ============================================
export function BookingCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="p-4 pt-0">
        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
