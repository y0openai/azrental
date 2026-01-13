'use client';

import React from 'react';
import { ExpertiseTags } from '../ExpertiseTags';
import { UncleSignupData, ExpertiseTag } from '@/types/uncle';

interface ExpertiseStepProps {
  data: Partial<UncleSignupData>;
  onChange: (data: Partial<UncleSignupData>) => void;
  errors: Record<string, string>;
}

export const ExpertiseStep: React.FC<ExpertiseStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleTagChange = (tags: ExpertiseTag[]) => {
    onChange({ expertise: tags });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">전문 분야</h2>
        <p className="text-gray-500">
          본인의 경험과 지식을 바탕으로 조카들에게 도움을 줄 수 있는 분야를
          선택해주세요.
        </p>
      </div>

      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
        <h3 className="font-medium text-red-800 mb-2">
          전문 분야 선택 가이드
        </h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• 실제 경험이 있는 분야만 선택해주세요</li>
          <li>• 최대 5개까지 선택 가능합니다</li>
          <li>• 선택한 분야에 대해 조카들의 상담 요청이 올 수 있습니다</li>
          <li>• 승인 후에도 분야 변경이 가능합니다</li>
        </ul>
      </div>

      <ExpertiseTags
        selected={(data.expertise as ExpertiseTag[]) || []}
        onChange={handleTagChange}
        maxSelection={5}
        error={errors.expertise}
      />
    </div>
  );
};

ExpertiseStep.displayName = 'ExpertiseStep';
