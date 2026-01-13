'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui';
import { UncleSignupData } from '@/types/uncle';
import { ChevronDown, ChevronUp, FileText, Shield, UserCheck } from 'lucide-react';

interface AgreementStepProps {
  data: Partial<UncleSignupData>;
  onChange: (data: Partial<UncleSignupData>) => void;
  errors: Record<string, string>;
}

interface AgreementItemProps {
  icon: React.ReactNode;
  title: string;
  required: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  error?: string;
}

const AgreementItem: React.FC<AgreementItemProps> = ({
  icon,
  title,
  required,
  checked,
  onChange,
  children,
  error,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`
        border rounded-lg overflow-hidden
        ${error ? 'border-red-300' : 'border-gray-200'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            label={
              <span className="flex items-center">
                {icon}
                <span className="ml-2">
                  {title}
                  {required && (
                    <span className="text-red-500 ml-1">(필수)</span>
                  )}
                </span>
              </span>
            }
          />
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-500 ml-6">{error}</p>}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto text-sm text-gray-600">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const AgreementStep: React.FC<AgreementStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  const allChecked =
    data.agreedTerms && data.agreedPrivacy && data.agreedCodeOfConduct;

  const handleAllChange = (checked: boolean) => {
    onChange({
      agreedTerms: checked,
      agreedPrivacy: checked,
      agreedCodeOfConduct: checked,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">약관 동의</h2>
        <p className="text-gray-500">
          서비스 이용을 위해 아래 약관에 동의해주세요.
        </p>
      </div>

      {/* All Agree */}
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <Checkbox
          checked={allChecked || false}
          onChange={(e) => handleAllChange(e.target.checked)}
          label={
            <span className="font-medium text-red-800">
              모든 약관에 동의합니다
            </span>
          }
        />
      </div>

      <div className="space-y-3">
        <AgreementItem
          icon={<FileText size={18} className="text-gray-500" />}
          title="서비스 이용약관"
          required
          checked={data.agreedTerms || false}
          onChange={(checked) => onChange({ agreedTerms: checked })}
          error={errors.agreedTerms}
        >
          <h4 className="font-medium mb-2">제1조 (목적)</h4>
          <p className="mb-3">
            이 약관은 아조씨렌탈(이하 &quot;회사&quot;)이 제공하는 아조씨 서비스의 이용과
            관련하여 회사와 아조씨 회원 간의 권리, 의무 및 책임사항, 기타 필요한
            사항을 규정함을 목적으로 합니다.
          </p>
          <h4 className="font-medium mb-2">제2조 (정의)</h4>
          <p className="mb-3">
            1. &quot;서비스&quot;란 회사가 제공하는 온라인 플랫폼을 통해 아조씨 회원이
            이용자에게 상담, 동행 등의 서비스를 제공하는 것을 말합니다.
            <br />
            2. &quot;아조씨 회원&quot;이란 회사와 서비스 이용계약을 체결하고 서비스를
            제공하는 만 40세 이상의 성인을 말합니다.
          </p>
          <h4 className="font-medium mb-2">제3조 (약관의 효력)</h4>
          <p>
            이 약관은 아조씨 회원이 약관의 내용에 동의하고 회원가입을 완료한
            시점부터 효력이 발생합니다.
          </p>
        </AgreementItem>

        <AgreementItem
          icon={<Shield size={18} className="text-gray-500" />}
          title="개인정보 처리방침"
          required
          checked={data.agreedPrivacy || false}
          onChange={(checked) => onChange({ agreedPrivacy: checked })}
          error={errors.agreedPrivacy}
        >
          <h4 className="font-medium mb-2">1. 수집하는 개인정보 항목</h4>
          <p className="mb-3">
            회사는 아조씨 회원가입 및 서비스 제공을 위해 다음 정보를 수집합니다:
            <br />- 필수항목: 이름, 이메일, 휴대폰 번호, 생년월일, 주민등록번호,
            신분증 사본
            <br />- 선택항목: 프로필 사진, 자기소개
          </p>
          <h4 className="font-medium mb-2">2. 개인정보의 수집 및 이용목적</h4>
          <p className="mb-3">
            - 본인 확인 및 연령 확인
            <br />
            - 서비스 제공 및 요금 정산
            <br />- 고객 상담 및 불만 처리
          </p>
          <h4 className="font-medium mb-2">3. 개인정보의 보유 및 이용기간</h4>
          <p>
            회원 탈퇴 시까지 보관하며, 탈퇴 후 30일 이내 파기합니다. 단, 법령에
            의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
          </p>
        </AgreementItem>

        <AgreementItem
          icon={<UserCheck size={18} className="text-gray-500" />}
          title="아조씨 행동강령"
          required
          checked={data.agreedCodeOfConduct || false}
          onChange={(checked) => onChange({ agreedCodeOfConduct: checked })}
          error={errors.agreedCodeOfConduct}
        >
          <h4 className="font-medium mb-2">아조씨 행동강령</h4>
          <p className="mb-3">
            아조씨 회원은 다음의 행동강령을 준수해야 합니다:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>존중과 예의:</strong> 조카(이용자)를 존중하고 예의 바르게
              대합니다.
            </li>
            <li>
              <strong>안전한 환경:</strong> 조카가 안전하다고 느낄 수 있는 환경을
              조성합니다.
            </li>
            <li>
              <strong>경계 존중:</strong> 조카의 개인적 경계를 존중하고
              불쾌감을 주는 행동을 하지 않습니다.
            </li>
            <li>
              <strong>정직한 소통:</strong> 솔직하고 진정성 있는 대화를 나눕니다.
            </li>
            <li>
              <strong>비밀 유지:</strong> 상담 내용을 제3자에게 공개하지
              않습니다.
            </li>
            <li>
              <strong>전문성 유지:</strong> 본인의 경험과 지식 범위 내에서
              조언합니다.
            </li>
            <li>
              <strong>금지 행위:</strong> 성적 접근, 금전 거래, 개인 연락처 교환
              등을 하지 않습니다.
            </li>
          </ol>
          <p className="mt-3 text-red-600 font-medium">
            행동강령 위반 시 서비스 이용이 영구 정지될 수 있습니다.
          </p>
        </AgreementItem>
      </div>
    </div>
  );
};

AgreementStep.displayName = 'AgreementStep';
