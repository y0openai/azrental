'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { SignupInput } from '@/lib/validations/auth';

interface AgreementCheckboxesProps {
  register: UseFormRegister<SignupInput>;
  errors: FieldErrors<SignupInput>;
  allChecked: boolean;
  onAllCheck: (checked: boolean) => void;
}

export function AgreementCheckboxes({
  register,
  errors,
  allChecked,
  onAllCheck,
}: AgreementCheckboxesProps) {
  return (
    <div className="space-y-3">
      <Checkbox
        checked={allChecked}
        onChange={(e) => onAllCheck(e.target.checked)}
        label={
          <span className="font-medium">전체 동의</span>
        }
      />

      <div className="ml-2 space-y-2 border-l-2 border-gray-200 pl-4">
        <Checkbox
          {...register('agreements.terms')}
          label={
            <span>
              <span className="text-red-500">[필수]</span> 서비스 이용약관 동의
              <a href="/terms" className="ml-1 text-primary underline" target="_blank">
                보기
              </a>
            </span>
          }
          error={errors.agreements?.terms?.message}
        />

        <Checkbox
          {...register('agreements.privacy')}
          label={
            <span>
              <span className="text-red-500">[필수]</span> 개인정보 처리방침 동의
              <a href="/privacy" className="ml-1 text-primary underline" target="_blank">
                보기
              </a>
            </span>
          }
          error={errors.agreements?.privacy?.message}
        />

        <Checkbox
          {...register('agreements.marketing')}
          label={
            <span>
              <span className="text-gray-500">[선택]</span> 마케팅 정보 수신 동의
            </span>
          }
        />
      </div>
    </div>
  );
}
