'use client';

import React from 'react';
import { WeeklySchedule } from '../WeeklySchedule';
import { UncleSignupData, WeeklyAvailability, DEFAULT_WEEKLY_AVAILABILITY } from '@/types/uncle';

interface AvailabilityStepProps {
  data: Partial<UncleSignupData>;
  onChange: (data: Partial<UncleSignupData>) => void;
  errors: Record<string, string>;
}

export const AvailabilityStep: React.FC<AvailabilityStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleAvailabilityChange = (availability: WeeklyAvailability) => {
    onChange({ availability });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">활동 가능 시간</h2>
        <p className="text-gray-500">
          조카들과 만날 수 있는 시간대를 설정해주세요.
        </p>
      </div>

      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
        <h3 className="font-medium text-red-800 mb-2">활동 시간 안내</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• 최소 주 3회 이상의 활동 시간을 설정해주세요</li>
          <li>• 설정한 시간에 예약 요청이 들어올 수 있습니다</li>
          <li>• 활동 시간은 승인 후에도 언제든 변경 가능합니다</li>
          <li>• 개인 일정에 따라 특정 날짜 예약을 차단할 수 있습니다</li>
        </ul>
      </div>

      <WeeklySchedule
        availability={data.availability || DEFAULT_WEEKLY_AVAILABILITY}
        onChange={handleAvailabilityChange}
        error={errors.availability}
      />
    </div>
  );
};

AvailabilityStep.displayName = 'AvailabilityStep';
