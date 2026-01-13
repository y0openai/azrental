'use client';

import { BOOKING_STEPS, BOOKING_STEP_LABELS, type BookingStep } from '@/contexts/BookingContext';

// ============================================
// Props
// ============================================
interface BookingStepIndicatorProps {
  currentStep: BookingStep;
  completedSteps?: BookingStep[];
  variant?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  onStepClick?: (step: BookingStep) => void;
}

// ============================================
// BookingStepIndicator Component
// ============================================
export function BookingStepIndicator({
  currentStep,
  completedSteps = [],
  variant = 'horizontal',
  showLabels = true,
  onStepClick,
}: BookingStepIndicatorProps) {
  const currentIndex = BOOKING_STEPS.indexOf(currentStep);

  const getStepStatus = (step: BookingStep, index: number) => {
    if (completedSteps.includes(step) || index < currentIndex) {
      return 'completed';
    }
    if (step === currentStep) {
      return 'current';
    }
    return 'upcoming';
  };

  // 수평 레이아웃
  if (variant === 'horizontal') {
    return (
      <div className="w-full">
        {/* 진행 바 */}
        <div className="relative">
          {/* 배경 선 */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />

          {/* 진행 선 */}
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary-500 transition-all duration-300"
            style={{
              width: `${(currentIndex / (BOOKING_STEPS.length - 1)) * 100}%`,
            }}
          />

          {/* 단계 점들 */}
          <div className="relative flex justify-between">
            {BOOKING_STEPS.map((step, index) => {
              const status = getStepStatus(step, index);
              const isClickable = onStepClick && index < currentIndex;

              return (
                <div
                  key={step}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / BOOKING_STEPS.length}%` }}
                >
                  {/* 점 */}
                  <button
                    onClick={() => isClickable && onStepClick(step)}
                    disabled={!isClickable}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all z-10 ${
                      status === 'completed'
                        ? 'bg-primary-500 text-white'
                        : status === 'current'
                        ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                        : 'bg-gray-200 text-gray-500'
                    } ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-primary-200' : ''}`}
                  >
                    {status === 'completed' ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </button>

                  {/* 레이블 */}
                  {showLabels && (
                    <span
                      className={`mt-2 text-xs text-center ${
                        status === 'current'
                          ? 'text-primary-600 font-medium'
                          : status === 'completed'
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {BOOKING_STEP_LABELS[step]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 수직 레이아웃
  return (
    <div className="space-y-4">
      {BOOKING_STEPS.map((step, index) => {
        const status = getStepStatus(step, index);
        const isLast = index === BOOKING_STEPS.length - 1;
        const isClickable = onStepClick && index < currentIndex;

        return (
          <div key={step} className="flex items-start gap-4">
            {/* 점과 선 */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => isClickable && onStepClick(step)}
                disabled={!isClickable}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  status === 'completed'
                    ? 'bg-primary-500 text-white'
                    : status === 'current'
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                    : 'bg-gray-200 text-gray-500'
                } ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-primary-200' : ''}`}
              >
                {status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </button>
              {!isLast && (
                <div
                  className={`w-0.5 h-8 ${
                    status === 'completed' ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>

            {/* 레이블 */}
            <div className="pt-1">
              <span
                className={`text-sm ${
                  status === 'current'
                    ? 'text-primary-600 font-medium'
                    : status === 'completed'
                    ? 'text-gray-700'
                    : 'text-gray-400'
                }`}
              >
                {BOOKING_STEP_LABELS[step]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Simple Progress Bar (간단한 진행바)
// ============================================
interface SimpleProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export function SimpleProgressBar({
  current,
  total,
  showLabel = true,
}: SimpleProgressBarProps) {
  const progress = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{current}/{total} 단계</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
