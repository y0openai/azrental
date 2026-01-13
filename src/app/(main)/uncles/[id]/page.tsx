'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUncleDetail } from '@/hooks/useUncles';
import { getUncleMainImage, formatHourlyRate } from '@/services/uncleService';
import type { ExpertiseTag } from '@/types/uncle';
import { EXPERTISE_LABELS, DAY_LABELS } from '@/types/uncle';

export default function UncleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const uncleId = params.id as string;

  const { uncle, bankAccount, loading, error, fetch } = useUncleDetail();

  useEffect(() => {
    if (uncleId) {
      fetch(uncleId);
    }
  }, [uncleId, fetch]);

  if (loading) {
    return <UncleDetailSkeleton />;
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 프로필 섹션 */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden mx-auto sm:mx-0">
                  <Image
                    src={mainImage}
                    alt={uncle.displayName}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {uncle.displayName}
                </h1>
                <p className="text-lg text-primary-600 font-medium mb-4">
                  {formatHourlyRate(uncle.hourlyRate)}
                </p>
                <p className="text-gray-600 mb-4">
                  {uncle.shortIntro}
                </p>

                {/* 전문 분야 태그 */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {uncle.expertise.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-full"
                    >
                      {EXPERTISE_LABELS[tag as ExpertiseTag] || tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 소개 */}
          <div className="px-6 sm:px-8 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">소개</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{uncle.bio}</p>
          </div>

          {/* 활동 가능 시간 */}
          {uncle.availability && (
            <div className="px-6 sm:px-8 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">활동 가능 시간</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(uncle.availability).map(([day, slots]) => {
                  if (!slots) return null;
                  const times: string[] = [];
                  if (slots.morning) times.push('오전');
                  if (slots.afternoon) times.push('오후');
                  if (slots.evening) times.push('저녁');
                  if (times.length === 0) return null;
                  return (
                    <div key={day} className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-700">
                        {DAY_LABELS[day as keyof typeof DAY_LABELS]}
                      </span>
                      <div className="mt-1 text-xs text-gray-500">
                        {times.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 통계 */}
          {uncle.stats && (
            <div className="px-6 sm:px-8 pb-6">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>총 예약 {uncle.stats.totalBookings}건</span>
              </div>
            </div>
          )}

          {/* 계좌 정보 (예약 확정 후 표시용 안내) */}
          {bankAccount && (
            <div className="px-6 sm:px-8 pb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  💰 결제 안내
                </h3>
                <p className="text-sm text-yellow-700">
                  예약 확정 후 아래 계좌로 입금해주세요.
                </p>
                <div className="mt-2 text-sm text-yellow-800">
                  <p>{bankAccount.bankName} {bankAccount.accountNumber}</p>
                  <p>예금주: {bankAccount.accountHolder}</p>
                </div>
              </div>
            </div>
          )}

          {/* 예약 버튼 */}
          <div className="px-6 sm:px-8 pb-8">
            <Link
              href={`/uncles/${uncle.uid}/book`}
              className="block w-full py-4 text-center text-lg font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors"
            >
              예약하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton
function UncleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 rounded-xl mx-auto sm:mx-0" />
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2 mx-auto sm:mx-0" />
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 mx-auto sm:mx-0" />
                <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                <div className="flex gap-2 justify-center sm:justify-start">
                  <div className="h-8 bg-gray-200 rounded-full w-20" />
                  <div className="h-8 bg-gray-200 rounded-full w-24" />
                  <div className="h-8 bg-gray-200 rounded-full w-16" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 sm:px-8 pb-6">
            <div className="h-6 bg-gray-200 rounded w-16 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
          <div className="px-6 sm:px-8 pb-8">
            <div className="h-14 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
