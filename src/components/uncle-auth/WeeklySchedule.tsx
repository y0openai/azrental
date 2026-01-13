'use client';

import React, { useCallback } from 'react';
import { Clock, Check } from 'lucide-react';
import { WeeklyAvailability, TimeSlot, DayOfWeek, DAY_LABELS } from '@/types/uncle';

interface WeeklyScheduleProps {
  availability: WeeklyAvailability;
  onChange: (availability: WeeklyAvailability) => void;
  disabled?: boolean;
  error?: string;
}

type TimeSlotKey = 'morning' | 'afternoon' | 'evening';

const TIME_SLOT_OPTIONS: { value: TimeSlotKey; label: string }[] = [
  { value: 'morning', label: '오전 (09-12시)' },
  { value: 'afternoon', label: '오후 (12-18시)' },
  { value: 'evening', label: '저녁 (18-21시)' },
];

const DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  availability,
  onChange,
  disabled,
  error,
}) => {
  const isDayAvailable = (day: DayOfWeek): boolean => {
    const daySlots = availability[day];
    return daySlots.morning || daySlots.afternoon || daySlots.evening;
  };

  const toggleDayAvailable = useCallback(
    (day: DayOfWeek) => {
      if (disabled) return;

      const currentDay = availability[day];
      const isCurrentlyAvailable = currentDay.morning || currentDay.afternoon || currentDay.evening;

      const newAvailability = {
        ...availability,
        [day]: {
          morning: !isCurrentlyAvailable,
          afternoon: !isCurrentlyAvailable,
          evening: !isCurrentlyAvailable,
        },
      };
      onChange(newAvailability);
    },
    [availability, disabled, onChange]
  );

  const toggleTimeSlot = useCallback(
    (day: DayOfWeek, slot: TimeSlotKey) => {
      if (disabled) return;

      const currentDay = availability[day];
      const newAvailability = {
        ...availability,
        [day]: {
          ...currentDay,
          [slot]: !currentDay[slot],
        },
      };
      onChange(newAvailability);
    },
    [availability, disabled, onChange]
  );

  const selectAllSlots = useCallback(
    (day: DayOfWeek) => {
      if (disabled) return;

      const currentDay = availability[day];
      const hasAllSlots = currentDay.morning && currentDay.afternoon && currentDay.evening;

      const newAvailability = {
        ...availability,
        [day]: {
          morning: !hasAllSlots,
          afternoon: !hasAllSlots,
          evening: !hasAllSlots,
        },
      };
      onChange(newAvailability);
    },
    [availability, disabled, onChange]
  );

  // Calculate total available slots
  const totalSlots = DAYS.reduce((sum, day) => {
    const dayData = availability[day];
    return sum + (dayData.morning ? 1 : 0) + (dayData.afternoon ? 1 : 0) + (dayData.evening ? 1 : 0);
  }, 0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          활동 가능 시간 <span className="text-red-500">*</span>
        </label>
        <span className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          주당 약 {totalSlots * 3}시간 가능
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        활동 가능한 요일과 시간대를 선택해주세요. 최소 주 3회 이상 선택해주세요.
      </p>

      <div className="space-y-3">
        {DAYS.map((day) => {
          const dayData = availability[day];
          const dayLabel = DAY_LABELS[day];
          const isWeekend = day === 'sat' || day === 'sun';
          const dayAvailable = isDayAvailable(day);

          return (
            <div
              key={day}
              className={`
                p-3 rounded-lg border transition-colors
                ${
                  dayAvailable
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => toggleDayAvailable(day)}
                  disabled={disabled}
                  className={`
                    flex items-center font-medium
                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div
                    className={`
                      w-5 h-5 rounded border-2 mr-2 flex items-center justify-center
                      transition-colors
                      ${
                        dayAvailable
                          ? 'bg-red-500 border-red-500'
                          : 'bg-white border-gray-300'
                      }
                    `}
                  >
                    {dayAvailable && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                  <span
                    className={
                      isWeekend ? 'text-red-600' : 'text-gray-900'
                    }
                  >
                    {dayLabel}요일
                  </span>
                </button>

                {dayAvailable && (
                  <button
                    type="button"
                    onClick={() => selectAllSlots(day)}
                    disabled={disabled}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    {dayData.morning && dayData.afternoon && dayData.evening ? '전체 해제' : '전체 선택'}
                  </button>
                )}
              </div>

              {dayAvailable && (
                <div className="flex flex-wrap gap-2 ml-7">
                  {TIME_SLOT_OPTIONS.map(({ value, label }) => {
                    const isSelected = dayData[value];

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleTimeSlot(day, value)}
                        disabled={disabled}
                        className={`
                          px-3 py-1.5 text-sm rounded-full transition-colors
                          ${
                            isSelected
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'
                          }
                          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                        `}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
};

WeeklySchedule.displayName = 'WeeklySchedule';
