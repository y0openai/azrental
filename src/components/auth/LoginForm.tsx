'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SocialLoginButtons } from './SocialLoginButtons';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { useAuthContext } from '@/contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, loading, error, setError } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    const result = await signIn(data.email, data.password);

    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
        <p className="mt-2 text-gray-600">
          아조씨 렌탈에 오신 것을 환영합니다
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label="이메일"
          placeholder="example@email.com"
          error={errors.email?.message}
          disabled={loading}
          autoComplete="email"
        />

        <Input
          {...register('password')}
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          error={errors.password?.message}
          disabled={loading}
          autoComplete="current-password"
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          로그인
        </Button>
      </form>

      <SocialLoginButtons
        disabled={loading}
        onKakaoLogin={() => {
          // TODO: Kakao OAuth 구현 (Phase 1.5)
          console.log('Kakao login');
        }}
        onNaverLogin={() => {
          // TODO: Naver OAuth 구현 (Phase 1.5)
          console.log('Naver login');
        }}
      />

      <p className="mt-6 text-center text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
