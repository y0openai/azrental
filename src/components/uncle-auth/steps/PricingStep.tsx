'use client';

import React, { useCallback } from 'react';
import { Input, Textarea } from '@/components/ui';
import { UncleSignupData, HOURLY_RATE_MIN, HOURLY_RATE_MAX } from '@/types/uncle';

interface PricingStepProps {
  data: Partial<UncleSignupData>;
  onChange: (data: Partial<UncleSignupData>) => void;
  errors: Record<string, string>;
}

export const PricingStep: React.FC<PricingStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      onChange({ hourlyRate: value });
    },
    [onChange]
  );

  const handleIntroChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ shortIntro: e.target.value });
    },
    [onChange]
  );

  const presetRates = [20000, 30000, 40000, 50000];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">요금 설정</h2>
        <p className="text-gray-500">
          시간당 요금과 한 줄 소개를 설정해주세요.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          시간당 요금 <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap gap-2 mb-3">
          {presetRates.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => onChange({ hourlyRate: rate })}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  data.hourlyRate === rate
                    ? 'bg-red-100 text-red-700 border-2 border-red-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }
              `}
            >
              {rate.toLocaleString()}원
            </button>
          ))}
        </div>

        <div className="relative">
          <Input
            type="number"
            placeholder="직접 입력"
            value={data.hourlyRate || ''}
            onChange={handleRateChange}
            error={errors.hourlyRate}
            min={HOURLY_RATE_MIN}
            max={HOURLY_RATE_MAX}
            step={1000}
          />
          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">
            원/시간
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {HOURLY_RATE_MIN.toLocaleString()}원 ~ {HOURLY_RATE_MAX.toLocaleString()}원
          범위에서 설정 가능합니다
        </p>

        {data.hourlyRate && data.hourlyRate > 0 && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              예상 수익: 주 10시간 활동 시{' '}
              <span className="font-bold text-red-600">
                월 {((data.hourlyRate * 10 * 4) * 0.85).toLocaleString()}원
              </span>
              <span className="text-xs text-gray-400 ml-1">
                (플랫폼 수수료 15% 공제 후)
              </span>
            </p>
          </div>
        )}
      </div>

      <Textarea
        label="한 줄 소개"
        placeholder="조카들에게 보여질 한 줄 소개를 작성해주세요 (예: 20년차 IT 개발자, 진로 상담 전문)"
        value={data.shortIntro || ''}
        onChange={handleIntroChange}
        error={errors.shortIntro}
        required
        rows={2}
        maxLength={100}
        showCount
        helperText="검색 결과에 노출되는 짧은 소개입니다"
      />
    </div>
  );
};

PricingStep.displayName = 'PricingStep';
