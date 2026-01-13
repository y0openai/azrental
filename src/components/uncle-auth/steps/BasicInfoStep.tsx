'use client';

import React, { useCallback } from 'react';
import { Input, Textarea } from '@/components/ui';
import { ProfileImageUpload } from '../ProfileImageUpload';
import { UncleSignupData, UNCLE_MIN_AGE } from '@/types/uncle';

interface BasicInfoStepProps {
  data: Partial<UncleSignupData>;
  onChange: (data: Partial<UncleSignupData>) => void;
  onUploadImage: (file: File, index: number) => Promise<void>;
  onRemoveImage: (index: number, imageUrl: string) => Promise<void>;
  onSetMainImage: (index: number) => void;
  errors: Record<string, string>;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onChange,
  onUploadImage,
  onRemoveImage,
  onSetMainImage,
  errors,
}) => {
  const handleChange = useCallback(
    (field: keyof UncleSignupData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = field === 'age' ? parseInt(e.target.value) || 0 : e.target.value;
        onChange({ [field]: value });
      },
    [onChange]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">기본 정보</h2>
        <p className="text-gray-500">
          조카들에게 보여질 기본 정보를 입력해주세요.
        </p>
      </div>

      <ProfileImageUpload
        images={data.profileImages || []}
        mainImageIndex={data.mainImageIndex || 0}
        onUpload={onUploadImage}
        onRemove={onRemoveImage}
        onSetMain={onSetMainImage}
        error={errors.profileImages}
      />

      <Input
        label="활동명"
        placeholder="조카들에게 보여질 이름을 입력해주세요"
        value={data.displayName || ''}
        onChange={handleChange('displayName')}
        error={errors.displayName}
        required
        maxLength={20}
      />

      <Input
        label="나이"
        type="number"
        placeholder="만 나이를 입력해주세요"
        value={data.age || ''}
        onChange={handleChange('age')}
        error={errors.age}
        required
        min={UNCLE_MIN_AGE}
        helperText={`만 ${UNCLE_MIN_AGE}세 이상만 신청 가능합니다`}
      />

      <Textarea
        label="자기소개"
        placeholder="조카들에게 본인을 소개해주세요. 어떤 경험과 이야기를 나눌 수 있는지 자세히 작성해주세요."
        value={data.bio || ''}
        onChange={handleChange('bio')}
        error={errors.bio}
        required
        rows={6}
        maxLength={1000}
        showCount
        helperText="100자 이상 작성해주세요"
      />
    </div>
  );
};

BasicInfoStep.displayName = 'BasicInfoStep';
