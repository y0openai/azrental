'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchUncles, fetchUncleById } from '@/services/uncleService';
import type { UncleListItem, UncleDetail } from '@/types/booking';

// ============================================
// useUncles - 아조씨 목록 Hook
// ============================================
interface UseUnclesOptions {
  initialLimit?: number;
  autoFetch?: boolean;
}

interface UseUnclesReturn {
  // State
  uncles: UncleListItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;

  // Actions
  fetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useUncles(options: UseUnclesOptions = {}): UseUnclesReturn {
  const { initialLimit = 20, autoFetch = true } = options;

  const [uncles, setUncles] = useState<UncleListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState<string | null>(null);

  // 초기 로드
  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchUncles(initialLimit);
      if (response.success && response.data) {
        setUncles(response.data.uncles);
        setHasMore(response.data.hasMore);
        setLastDocId(response.data.lastDocId);
      } else {
        setError(response.error || '아조씨 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('아조씨 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  // 더 불러오기
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !lastDocId) return;

    setLoading(true);

    try {
      const response = await fetchUncles(initialLimit, lastDocId);
      if (response.success && response.data) {
        setUncles(prev => [...prev, ...response.data!.uncles]);
        setHasMore(response.data.hasMore);
        setLastDocId(response.data.lastDocId);
      } else {
        setError(response.error || '아조씨 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('아조씨 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastDocId, initialLimit]);

  // 새로고침
  const refresh = useCallback(async () => {
    setUncles([]);
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
    uncles,
    loading,
    error,
    hasMore,
    fetch,
    loadMore,
    refresh,
  };
}

// ============================================
// useUncleDetail - 아조씨 상세 Hook
// ============================================
interface UseUncleDetailReturn {
  // State
  uncle: UncleDetail | null;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  } | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetch: (uncleId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useUncleDetail(initialUncleId?: string): UseUncleDetailReturn {
  const [uncle, setUncle] = useState<UncleDetail | null>(null);
  const [bankAccount, setBankAccount] = useState<{
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(initialUncleId || null);

  const fetch = useCallback(async (uncleId: string) => {
    setLoading(true);
    setError(null);
    setCurrentId(uncleId);

    try {
      const response = await fetchUncleById(uncleId);
      if (response.success && response.data) {
        setUncle(response.data.uncle);
        setBankAccount(response.data.bankAccount || null);
      } else {
        setError(response.error || '아조씨 정보를 불러오는데 실패했습니다.');
        setUncle(null);
        setBankAccount(null);
      }
    } catch (err) {
      setError('아조씨 정보를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (currentId) {
      await fetch(currentId);
    }
  }, [currentId, fetch]);

  // 초기 로드
  useEffect(() => {
    if (initialUncleId) {
      fetch(initialUncleId);
    }
  }, [initialUncleId, fetch]);

  return {
    uncle,
    bankAccount,
    loading,
    error,
    fetch,
    refresh,
  };
}
