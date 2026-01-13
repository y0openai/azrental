'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  fetchBookings,
  fetchBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  startBooking,
  completeBooking,
} from '@/services/bookingService';
import type {
  Booking,
  BookingListItem,
  BookingStatus,
} from '@/types/booking';

// ============================================
// useBookings - 예약 목록 Hook
// ============================================
interface UseBookingsOptions {
  role: 'customer' | 'uncle';
  status?: BookingStatus[];
  initialLimit?: number;
  autoFetch?: boolean;
}

interface UseBookingsReturn {
  // State
  bookings: BookingListItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;

  // Actions
  fetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useBookings(options: UseBookingsOptions): UseBookingsReturn {
  const { role, status, initialLimit = 20, autoFetch = true } = options;

  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState<string | null>(null);

  // 초기 로드
  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchBookings(role, status, initialLimit);
      if (response.success && response.data) {
        setBookings(response.data.bookings);
        setHasMore(response.data.hasMore);
        setLastDocId(response.data.lastDocId);
      } else {
        setError(response.error || '예약 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('예약 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [role, status, initialLimit]);

  // 더 불러오기
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !lastDocId) return;

    setLoading(true);

    try {
      const response = await fetchBookings(role, status, initialLimit, lastDocId);
      if (response.success && response.data) {
        setBookings(prev => [...prev, ...response.data!.bookings]);
        setHasMore(response.data.hasMore);
        setLastDocId(response.data.lastDocId);
      } else {
        setError(response.error || '예약 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('예약 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastDocId, role, status, initialLimit]);

  // 새로고침
  const refresh = useCallback(async () => {
    setBookings([]);
    setLastDocId(null);
    setHasMore(true);
    await fetch();
  }, [fetch]);

  // 자동 로드
  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  return {
    bookings,
    loading,
    error,
    hasMore,
    fetch,
    loadMore,
    refresh,
  };
}

// ============================================
// useBookingDetail - 예약 상세 Hook
// ============================================
interface UseBookingDetailReturn {
  // State
  booking: Booking | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetch: (bookingId: string) => Promise<void>;
  refresh: () => Promise<void>;

  // Booking Actions
  accept: () => Promise<boolean>;
  reject: (reason?: string) => Promise<boolean>;
  cancel: (reason: string) => Promise<boolean>;
  start: () => Promise<boolean>;
  complete: () => Promise<boolean>;
}

export function useBookingDetail(initialBookingId?: string): UseBookingDetailReturn {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(initialBookingId || null);

  // 예약 상세 조회
  const fetch = useCallback(async (bookingId: string) => {
    setLoading(true);
    setError(null);
    setCurrentId(bookingId);

    try {
      const response = await fetchBookingById(bookingId);
      if (response.success && response.data) {
        setBooking(response.data.booking);
      } else {
        setError(response.error || '예약 정보를 불러오는데 실패했습니다.');
        setBooking(null);
      }
    } catch (err) {
      setError('예약 정보를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 새로고침
  const refresh = useCallback(async () => {
    if (currentId) {
      await fetch(currentId);
    }
  }, [currentId, fetch]);

  // 예약 수락 (아조씨)
  const accept = useCallback(async (): Promise<boolean> => {
    if (!currentId) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await acceptBooking(currentId);
      if (response.success) {
        await refresh();
        return true;
      } else {
        setError(response.error || '예약 수락에 실패했습니다.');
        return false;
      }
    } catch (err) {
      setError('예약 수락 중 오류가 발생했습니다.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentId, refresh]);

  // 예약 거절 (아조씨)
  const reject = useCallback(async (reason?: string): Promise<boolean> => {
    if (!currentId) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await rejectBooking(currentId, reason);
      if (response.success) {
        await refresh();
        return true;
      } else {
        setError(response.error || '예약 거절에 실패했습니다.');
        return false;
      }
    } catch (err) {
      setError('예약 거절 중 오류가 발생했습니다.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentId, refresh]);

  // 예약 취소 (고객/아조씨)
  const cancel = useCallback(async (reason: string): Promise<boolean> => {
    if (!currentId) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await cancelBooking(currentId, reason);
      if (response.success) {
        await refresh();
        return true;
      } else {
        setError(response.error || '예약 취소에 실패했습니다.');
        return false;
      }
    } catch (err) {
      setError('예약 취소 중 오류가 발생했습니다.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentId, refresh]);

  // 서비스 시작 (아조씨)
  const start = useCallback(async (): Promise<boolean> => {
    if (!currentId) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await startBooking(currentId);
      if (response.success) {
        await refresh();
        return true;
      } else {
        setError(response.error || '서비스 시작에 실패했습니다.');
        return false;
      }
    } catch (err) {
      setError('서비스 시작 중 오류가 발생했습니다.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentId, refresh]);

  // 서비스 완료 (아조씨)
  const complete = useCallback(async (): Promise<boolean> => {
    if (!currentId) return false;

    setLoading(true);
    setError(null);

    try {
      const response = await completeBooking(currentId);
      if (response.success) {
        await refresh();
        return true;
      } else {
        setError(response.error || '서비스 완료 처리에 실패했습니다.');
        return false;
      }
    } catch (err) {
      setError('서비스 완료 처리 중 오류가 발생했습니다.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentId, refresh]);

  // 초기 로드
  useEffect(() => {
    if (initialBookingId) {
      fetch(initialBookingId);
    }
  }, [initialBookingId, fetch]);

  return {
    booking,
    loading,
    error,
    fetch,
    refresh,
    accept,
    reject,
    cancel,
    start,
    complete,
  };
}
