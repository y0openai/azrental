'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { ExpertiseTag, EXPERTISE_TAG_LABELS } from '@/types/uncle';

interface ExpertiseTagsProps {
  selected: ExpertiseTag[];
  onChange: (tags: ExpertiseTag[]) => void;
  maxSelection?: number;
  disabled?: boolean;
  error?: string;
}

export const ExpertiseTags: React.FC<ExpertiseTagsProps> = ({
  selected,
  onChange,
  maxSelection = 5,
  disabled,
  error,
}) => {
  const allTags = Object.entries(EXPERTISE_TAG_LABELS) as [ExpertiseTag, string][];

  const handleToggle = (tag: ExpertiseTag) => {
    if (disabled) return;

    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      if (selected.length < maxSelection) {
        onChange([...selected, tag]);
      }
    }
  };

  const isMaxReached = selected.length >= maxSelection;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          전문 분야 <span className="text-red-500">*</span>
        </label>
        <span
          className={`text-sm ${
            isMaxReached ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {selected.length}/{maxSelection}개 선택
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        본인이 조카들에게 제공할 수 있는 전문 분야를 선택해주세요. (최대{' '}
        {maxSelection}개)
      </p>

      <div className="flex flex-wrap gap-2">
        {allTags.map(([tag, label]) => {
          const isSelected = selected.includes(tag);
          const isDisabledByMax = !isSelected && isMaxReached;

          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleToggle(tag)}
              disabled={disabled || isDisabledByMax}
              className={`
                inline-flex items-center px-3 py-2 rounded-full text-sm font-medium
                transition-all duration-200
                ${
                  isSelected
                    ? 'bg-red-100 text-red-700 border-2 border-red-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }
                ${isDisabledByMax ? 'opacity-50 cursor-not-allowed' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isSelected && <Check size={14} className="mr-1" />}
              {label}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {isMaxReached && !error && (
        <p className="mt-2 text-sm text-gray-500">
          최대 선택 개수에 도달했습니다. 다른 태그를 선택하려면 기존 태그를
          해제해주세요.
        </p>
      )}
    </div>
  );
};

ExpertiseTags.displayName = 'ExpertiseTags';
