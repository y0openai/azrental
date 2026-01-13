'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { BookingCard, BookingCardSkeleton } from './BookingCard';
import { useBookings } from '@/hooks/useBooking';
import type { BookingListItem, BookingStatus } from '@/types/booking';
import { BOOKING_STATUS_LABELS } from '@/types/booking';

// ============================================
// Props
// ============================================
interface BookingListProps {
  role: 'customer' | 'uncle';
  statusFilter?: BookingStatus[];
  onSelect?: (booking: BookingListItem) => void;
  onAccept?: (bookingId: string) => Promise<void>;
  onReject?: (bookingId: string) => Promise<void>;
  onCancel?: (bookingId: string) => Promise<void>;
  onStart?: (bookingId: string) => Promise<void>;
  onComplete?: (bookingId: string) => Promise<void>;
  variant?: 'grid' | 'list';
  initialLimit?: number;
  showStatusTabs?: boolean;
}

// ============================================
// 상태 탭 옵션
// ============================================
const STATUS_TAB_OPTIONS: { value: BookingStatus[] | undefined; label: string }[] = [
  { value: undefined, label: '전체' },
  { value: ['pending'], label: '대기 중' },
  { value: ['confirmed', 'in_progress'], label: '진행 중' },
  { value: ['completed'], label: '완료' },
  { value: ['cancelled'], label: '취소됨' },
];

// ============================================
// BookingList Component
// ============================================
export function BookingList({
  role,
  statusFilter: initialStatusFilter,
  onSelect,
  onAccept,
  onReject,
  onCancel,
  onStart,
  onComplete,
  variant = 'list',
  initialLimit = 10,
  showStatusTabs = true,
}: BookingListProps) {
  const [statusFilter, setStatusFilter] = useState<BookingStatus[] | undefined>(
    initialStatusFilter
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { bookings, loading, error, hasMore, loadMore, refresh } = useBookings({
    role,
    status: statusFilter,
    initialLimit,
    autoFetch: true,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    [hasMore, loading, loadMore]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // 상태 필터 변경 시 새로고침
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // 액션 핸들러
  const handleAccept = async (bookingId: string) => {
    if (!onAccept || actionLoading) return;
    setActionLoading(bookingId);
    try {
      await onAccept(bookingId);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    if (!onReject || actionLoading) return;
    setActionLoading(bookingId);
    try {
      await onReject(bookingId);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!onCancel || actionLoading) return;
    setActionLoading(bookingId);
    try {
      await onCancel(bookingId);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleStart = async (bookingId: string) => {
    if (!onStart || actionLoading) return;
    setActionLoading(bookingId);
    try {
      await onStart(bookingId);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (bookingId: string) => {
    if (!onComplete || actionLoading) return;
    setActionLoading(bookingId);
    try {
      await onComplete(bookingId);
      refresh();
    } finally {
      setActionLoading(null);
    }
  };

  // 에러 상태
  if (error && bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 상태 필터 탭 */}
      {showStatusTabs && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {STATUS_TAB_OPTIONS.map(option => (
            <button
              key={option.label}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                JSON.stringify(statusFilter) === JSON.stringify(option.value)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-gray-600">
            {statusFilter
              ? `${statusFilter.map(s => BOOKING_STATUS_LABELS[s]).join(', ')} 예약이 없습니다.`
              : '예약 내역이 없습니다.'}
          </p>
        </div>
      )}

      {/* 그리드 레이아웃 */}
      {variant === 'grid' && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map(booking => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              role={role}
              onClick={onSelect}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              onStart={handleStart}
              onComplete={handleComplete}
            />
          ))}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <BookingCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>
      )}

      {/* 리스트 레이아웃 */}
      {variant === 'list' && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map(booking => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              role={role}
              onClick={onSelect}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              onStart={handleStart}
              onComplete={handleComplete}
            />
          ))}
          {loading &&
            Array.from({ length: 2 }).map((_, i) => (
              <BookingCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>
      )}

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-4" />

      {/* Loading indicator */}
      {loading && bookings.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
