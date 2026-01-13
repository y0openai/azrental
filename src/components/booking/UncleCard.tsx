'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getUncleMainImage, formatHourlyRate, getTopExpertise } from '@/services/uncleService';
import type { UncleListItem } from '@/types/booking';
import type { ExpertiseTag } from '@/types/uncle';
import { EXPERTISE_LABELS } from '@/types/uncle';

// ============================================
// Props
// ============================================
interface UncleCardProps {
  uncle: UncleListItem;
  onClick?: (uncle: UncleListItem) => void;
  variant?: 'default' | 'compact';
  showBookButton?: boolean;
}

// ============================================
// UncleCard Component
// ============================================
export function UncleCard({
  uncle,
  onClick,
  variant = 'default',
  showBookButton = true,
}: UncleCardProps) {
  const mainImage = getUncleMainImage(uncle);
  const topExpertise = getTopExpertise(uncle, 3);

  const handleClick = () => {
    onClick?.(uncle);
  };

  if (variant === 'compact') {
    return (
      <div
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
        onClick={handleClick}
      >
        {/* 프로필 이미지 */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={mainImage}
            alt={uncle.displayName}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {uncle.displayName}
          </h4>
          <p className="text-sm text-gray-500 truncate">
            {formatHourlyRate(uncle.hourlyRate)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* 프로필 이미지 */}
      <div
        className="relative aspect-[4/3] cursor-pointer"
        onClick={handleClick}
      >
        <Image
          src={mainImage}
          alt={uncle.displayName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* 정보 */}
      <div className="p-4">
        {/* 이름 & 요금 */}
        <div className="flex items-start justify-between mb-2">
          <h3
            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-primary-600"
            onClick={handleClick}
          >
            {uncle.displayName}
          </h3>
          <span className="text-sm font-medium text-primary-600">
            {formatHourlyRate(uncle.hourlyRate)}
          </span>
        </div>

        {/* 한 줄 소개 */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {uncle.shortIntro}
        </p>

        {/* 전문 분야 태그 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {topExpertise.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {EXPERTISE_LABELS[tag as ExpertiseTag] || tag}
            </span>
          ))}
          {uncle.expertise.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">
              +{uncle.expertise.length - 3}
            </span>
          )}
        </div>

        {/* 예약 버튼 */}
        {showBookButton && (
          <Link
            href={`/uncles/${uncle.uid}/book`}
            className="block w-full py-2.5 text-center text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
          >
            예약하기
          </Link>
        )}
      </div>
    </div>
  );
}

// ============================================
// Skeleton Component
// ============================================
export function UncleCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="flex gap-1.5 mb-4">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-14" />
          <div className="h-5 bg-gray-200 rounded-full w-12" />
        </div>
        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
