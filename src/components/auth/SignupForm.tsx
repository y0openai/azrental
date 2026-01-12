'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmailVerification } from './EmailVerification';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { AgreementCheckboxes } from './AgreementCheckboxes';
import { SocialLoginButtons } from './SocialLoginButtons';
import { signupSchema, SignupInput } from '@/lib/validations/auth';
import { useAuthContext } from '@/contexts/AuthContext';

type SignupStep = 'email' | 'verification' | 'password' | 'profile' | 'agreements';

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [step, setStep] = useState<SignupStep>('email');
  const { sendVerification, verifyCode, signUp, loading, error, setError } = useAuthContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreements: {
        terms: false,
        privacy: false,
        marketing: false,
      },
    },
  });

  const email = watch('email');
  const password = watch('password');
  const agreements = watch('agreements');

  const allAgreementsChecked =
    agreements?.terms && agreements?.privacy && agreements?.marketing;

  // Step 1: 이메일 입력 및 인증 코드 발송
  const handleEmailSubmit = async () => {
    const isValid = await trigger('email');
    if (!isValid) return;

    const result = await sendVerification(email);
    if (result.success) {
      setStep('verification');
    }
  };

  // Step 2: 인증 코드 확인
  const handleVerification = async (code: string) => {
    const result = await verifyCode(email, code);
    if (result.success) {
      setStep('password');
    }
  };

  // Step 3: 비밀번호 입력
  const handlePasswordSubmit = async () => {
    const isValid = await trigger(['password', 'passwordConfirm']);
    if (isValid) {
      setStep('agreements');
    }
  };

  // Step 4: 약관 동의 및 회원가입 완료
  const onSubmit = async (data: SignupInput) => {
    setError(null);

    const result = await signUp({
      email: data.email,
      password: data.password,
      displayName: data.displayName || undefined,
      phone: data.phone || undefined,
      agreements: data.agreements,
    });

    if (result.success) {
      onSuccess?.();
    }
  };

  // 전체 동의 토글
  const handleAllCheck = (checked: boolean) => {
    setValue('agreements.terms', checked);
    setValue('agreements.privacy', checked);
    setValue('agreements.marketing', checked);
  };

  // 단계별 렌더링
  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              label="이메일"
              placeholder="example@email.com"
              error={errors.email?.message}
              disabled={loading}
              autoComplete="email"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="button"
              fullWidth
              loading={loading}
              onClick={handleEmailSubmit}
            >
              인증 코드 받기
            </Button>

            <SocialLoginButtons
              disabled={loading}
              onKakaoLogin={() => console.log('Kakao signup')}
              onNaverLogin={() => console.log('Naver signup')}
            />
          </div>
        );

      case 'verification':
        return (
          <EmailVerification
            email={email}
            onVerify={handleVerification}
            onResend={() => sendVerification(email)}
            loading={loading}
            error={error || undefined}
          />
        );

      case 'password':
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">비밀번호 설정</h2>
              <p className="mt-2 text-sm text-gray-600">
                안전한 비밀번호를 설정해주세요
              </p>
            </div>

            <div>
              <Input
                {...register('password')}
                type="password"
                label="비밀번호"
                placeholder="8자 이상, 영문/숫자/특수문자 포함"
                error={errors.password?.message}
                disabled={loading}
                autoComplete="new-password"
              />
              <PasswordStrengthIndicator password={password || ''} />
            </div>

            <Input
              {...register('passwordConfirm')}
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.passwordConfirm?.message}
              disabled={loading}
              autoComplete="new-password"
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('email')}
                disabled={loading}
              >
                이전
              </Button>
              <Button
                type="button"
                fullWidth
                loading={loading}
                onClick={handlePasswordSubmit}
              >
                다음
              </Button>
            </div>
          </div>
        );

      case 'agreements':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">약관 동의</h2>
              <p className="mt-2 text-sm text-gray-600">
                서비스 이용을 위해 약관에 동의해주세요
              </p>
            </div>

            <AgreementCheckboxes
              register={register}
              errors={errors}
              allChecked={!!allAgreementsChecked}
              onAllCheck={handleAllCheck}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('password')}
                disabled={loading}
              >
                이전
              </Button>
              <Button type="submit" fullWidth loading={loading}>
                회원가입 완료
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 진행 상태 표시
  const steps = ['이메일', '인증', '비밀번호', '약관'];
  const currentStepIndex = {
    email: 0,
    verification: 1,
    password: 2,
    profile: 2,
    agreements: 3,
  }[step];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        <p className="mt-2 text-gray-600">
          아조씨 렌탈에 가입하고 다양한 서비스를 이용하세요
        </p>
      </div>

      {/* 진행 상태 바 */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, index) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    index <= currentStepIndex
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index + 1}
              </div>
              <span className="mt-1 text-xs text-gray-500">{label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2
                  ${index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>{renderStep()}</form>

      <p className="mt-6 text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
