'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';
import { useAuthContext } from '@/contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const { sendPasswordReset, loading, error, setError } = useAuthContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    const result = await sendPasswordReset(data.email);

    if (result.success) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          이메일을 확인해주세요
        </h1>

        <p className="text-gray-600 mb-6">
          <span className="font-medium text-primary">{email}</span>로
          <br />
          비밀번호 재설정 링크를 발송했습니다.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          이메일이 도착하지 않았다면 스팸함을 확인해주세요.
        </p>

        <Link href="/login">
          <Button variant="outline" fullWidth>
            로그인으로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">비밀번호 찾기</h1>
        <p className="mt-2 text-gray-600">
          가입한 이메일 주소를 입력하시면
          <br />
          비밀번호 재설정 링크를 보내드립니다.
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

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth loading={loading}>
          재설정 링크 받기
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        비밀번호가 기억나셨나요?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
