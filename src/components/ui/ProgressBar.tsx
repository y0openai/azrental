'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  variant?: 'default' | 'uncle';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
  variant = 'default',
}) => {
  const accentColor = variant === 'uncle' ? 'red' : 'primary';

  return (
    <div className="w-full">
      {/* Progress line */}
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div
            className={`h-full transition-all duration-300 ${
              variant === 'uncle' ? 'bg-red-600' : 'bg-primary'
            }`}
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-medium text-sm transition-all duration-300 z-10
                    ${
                      isCompleted
                        ? variant === 'uncle'
                          ? 'bg-red-600 text-white'
                          : 'bg-primary text-white'
                        : isCurrent
                        ? variant === 'uncle'
                          ? 'bg-red-600 text-white ring-4 ring-red-100'
                          : 'bg-primary text-white ring-4 ring-primary/20'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? <Check size={20} /> : stepNumber}
                </div>

                {/* Label */}
                <p
                  className={`
                    mt-2 text-xs font-medium text-center
                    ${isCurrent ? 'text-gray-900' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </p>

                {/* Description - only show on larger screens */}
                {step.description && (
                  <p className="hidden sm:block mt-1 text-xs text-gray-400 text-center max-w-[100px]">
                    {step.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Current step indicator */}
      <div className="mt-4 sm:hidden text-center">
        <p className="text-sm text-gray-500">
          {currentStep} / {steps.length}단계
        </p>
        <p className="font-medium text-gray-900">
          {steps[currentStep - 1]?.label}
        </p>
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
