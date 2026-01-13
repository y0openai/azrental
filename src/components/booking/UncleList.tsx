'use client';

import { useEffect, useRef, useCallback } from 'react';
import { UncleCard, UncleCardSkeleton } from './UncleCard';
import { useUncles } from '@/hooks/useUncles';
import type { UncleListItem } from '@/types/booking';

// ============================================
// Props
// ============================================
interface UncleListProps {
  onSelect?: (uncle: UncleListItem) => void;
  variant?: 'grid' | 'list';
  showBookButton?: boolean;
  initialLimit?: number;
}

// ============================================
// UncleList Component
// ============================================
export function UncleList({
  onSelect,
  variant = 'grid',
  showBookButton = true,
  initialLimit = 12,
}: UncleListProps) {
  const { uncles, loading, error, hasMore, loadMore, refresh } = useUncles({
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

  // 에러 상태
  if (error && uncles.length === 0) {
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

  // 빈 상태
  if (!loading && uncles.length === 0) {
    return (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <p className="text-gray-600">등록된 아조씨가 없습니다.</p>
      </div>
    );
  }

  // 그리드 레이아웃
  if (variant === 'grid') {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {uncles.map(uncle => (
            <UncleCard
              key={uncle.uid}
              uncle={uncle}
              onClick={onSelect}
              showBookButton={showBookButton}
            />
          ))}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <UncleCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>

        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-4" />

        {/* Loading indicator */}
        {loading && uncles.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  // 리스트 레이아웃
  return (
    <div>
      <div className="space-y-3">
        {uncles.map(uncle => (
          <UncleCard
            key={uncle.uid}
            uncle={uncle}
            onClick={onSelect}
            variant="compact"
            showBookButton={false}
          />
        ))}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <UncleCardSkeleton key={`skeleton-${i}`} variant="compact" />
          ))}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-4" />

      {/* Loading indicator */}
      {loading && uncles.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
