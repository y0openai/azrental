'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUncleDetail } from '@/hooks/useUncles';
import { useAuthContext } from '@/contexts/AuthContext';
import { BookingForm } from '@/components/booking';
import { getUncleMainImage, formatHourlyRate } from '@/services/uncleService';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const uncleId = params.id as string;
  const { user, loading: authLoading } = useAuthContext();

  const { uncle, loading, error, fetch } = useUncleDetail();

  useEffect(() => {
    if (uncleId) {
      fetch(uncleId);
    }
  }, [uncleId, fetch]);

  // 인증 체크
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/uncles/${uncleId}/book`);
    }
  }, [user, authLoading, router, uncleId]);

  // 로딩 중
  if (authLoading || loading) {
    return <BookingPageSkeleton />;
  }

  // 로그인 필요
  if (!user) {
    return null; // 리다이렉트 중
  }

  // 에러 또는 아조씨 없음
  if (error || !uncle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error || '아조씨 정보를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const mainImage = getUncleMainImage(uncle);

  const handleSuccess = (bookingId: string) => {
    router.push(`/bookings/${bookingId}?success=true`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 아조씨 정보 요약 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={mainImage}
                alt={uncle.displayName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">
                {uncle.displayName}
              </h2>
              <p className="text-sm text-gray-500 truncate">
                {uncle.shortIntro}
              </p>
              <p className="text-sm font-medium text-primary-600 mt-1">
                {formatHourlyRate(uncle.hourlyRate)}
              </p>
            </div>
          </div>
        </div>

        {/* 예약 폼 */}
        <BookingForm
          uncle={uncle}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

// Skeleton
function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-gray-100">
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
              <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
