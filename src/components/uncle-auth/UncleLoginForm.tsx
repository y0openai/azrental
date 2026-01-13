'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Checkbox } from '@/components/ui';
import { useUncleAuthContext } from '@/contexts/UncleAuthContext';
import { uncleLoginSchema } from '@/lib/validations/uncle-auth';
import { ZodError } from 'zod';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

interface UncleLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const UncleLoginForm: React.FC<UncleLoginFormProps> = ({
  onSuccess,
  redirectTo = '/uncle/dashboard',
}) => {
  const router = useRouter();
  const { signIn, loading, error: authError, setError } = useUncleAuthContext();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate
      await uncleLoginSchema.parseAsync(formData);

      // Sign in
      const result = await signIn(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (result.success) {
        onSuccess?.();
        router.push(redirectTo);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e) => {
          const path = e.path.join('.');
          newErrors[path] = e.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">아조씨 로그인</h1>
          <p className="text-gray-500 mt-2">
            아조씨 계정으로 로그인해주세요
          </p>
        </div>

        {/* Error Message */}
        {authError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{authError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="이메일"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            required
            disabled={loading}
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            required
            disabled={loading}
          />

          <div className="flex items-center justify-between">
            <Checkbox
              checked={formData.rememberMe}
              onChange={handleChange('rememberMe')}
              label="로그인 상태 유지"
              disabled={loading}
            />
            <Link
              href="/uncle/forgot-password"
              className="text-sm text-red-600 hover:text-red-700"
            >
              비밀번호 찾기
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            로그인
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            아직 아조씨 계정이 없으신가요?{' '}
            <Link
              href="/uncle/signup"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              신청하기
            </Link>
          </p>
        </div>

        {/* Check Status */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <Link
            href="/uncle/status"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            신청 상태 확인하기
          </Link>
        </div>
      </div>

      {/* Customer Link */}
      <p className="text-center text-sm text-gray-500 mt-6">
        일반 사용자이신가요?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80">
          일반 로그인
        </Link>
      </p>
    </div>
  );
};

UncleLoginForm.displayName = 'UncleLoginForm';
