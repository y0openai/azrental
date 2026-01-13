'use client';

import React, { useCallback } from 'react';
import { Input } from '@/components/ui';
import { IdCardUpload } from '../IdCardUpload';
import { UncleSignupData } from '@/types/uncle';
import { Shield, Lock } from 'lucide-react';

interface VerificationStepProps {
  data: Partial<UncleSignupData>;
  onChange: (data: Partial<UncleSignupData>) => void;
  onUploadIdCard: (file: File) => Promise<void>;
  onRemoveIdCard?: () => void;
  errors: Record<string, string>;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  data,
  onChange,
  onUploadIdCard,
  onRemoveIdCard,
  errors,
}) => {
  const handleChange = useCallback(
    (field: keyof UncleSignupData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ [field]: e.target.value });
      },
    [onChange]
  );

  // SSN 포맷팅 (XXXXXX-X******)
  const formatSSN = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length <= 6) {
      return cleaned;
    }
    return `${cleaned.slice(0, 6)}-${cleaned.slice(6, 13)}`;
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    onChange({ ssn: formatted.replace('-', '') });
  };

  // Phone 포맷팅 (010-XXXX-XXXX)
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length <= 3) {
      return cleaned;
    }
    if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onChange({ phone: formatted.replace(/-/g, '') });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">본인 인증</h2>
        <p className="text-gray-500">
          안전한 서비스를 위해 본인 인증이 필요합니다.
        </p>
      </div>

      {/* Security Notice */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">개인정보 보호 안내</p>
            <ul className="mt-1 text-blue-700 space-y-0.5">
              <li>• 주민등록번호는 암호화되어 저장됩니다</li>
              <li>• 신분증 사진은 본인 확인 후 안전하게 폐기됩니다</li>
              <li>• 수집된 정보는 본인 인증 외 목적으로 사용되지 않습니다</li>
            </ul>
          </div>
        </div>
      </div>

      <IdCardUpload
        imageUrl={data.idCardImageUrl || null}
        onUpload={onUploadIdCard}
        onRemove={onRemoveIdCard}
        error={errors.idCardImageUrl}
      />

      <Input
        label="주민등록번호"
        type="text"
        placeholder="XXXXXX-XXXXXXX"
        value={formatSSN(data.ssn || '')}
        onChange={handleSSNChange}
        error={errors.ssn}
        required
        maxLength={14}
        helperText="본인 확인용으로만 사용됩니다"
      />

      <Input
        label="휴대폰 번호"
        type="tel"
        placeholder="010-0000-0000"
        value={formatPhone(data.phone || '')}
        onChange={handlePhoneChange}
        error={errors.phone}
        required
        maxLength={13}
        helperText="예약 알림 및 긴급 연락용으로 사용됩니다"
      />

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          계정 정보
        </h3>

        <div className="space-y-4">
          <Input
            label="이메일"
            type="email"
            placeholder="example@email.com"
            value={data.email || ''}
            onChange={handleChange('email')}
            error={errors.email}
            required
            helperText="로그인 및 중요 알림 수신용 이메일입니다"
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            value={data.password || ''}
            onChange={handleChange('password')}
            error={errors.password}
            required
            minLength={8}
          />

          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={data.passwordConfirm || ''}
            onChange={handleChange('passwordConfirm')}
            error={errors.passwordConfirm}
            required
          />
        </div>
      </div>
    </div>
  );
};

VerificationStep.displayName = 'VerificationStep';
