'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UncleAuthProvider, useUncleAuthContext } from '@/contexts/UncleAuthContext';
import { Input, Button } from '@/components/ui';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

function ForgotPasswordContent() {
  const { sendPasswordReset, loading } = useUncleAuthContext();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    const result = await sendPasswordReset(email);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || '오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/uncle/login"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-2" />
              로그인으로
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-red-600">
                아조씨렌탈
              </h1>
            </div>
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {isSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  이메일 발송 완료
                </h2>
                <p className="text-gray-500 mb-6">
                  비밀번호 재설정 링크를 {email}로 발송했습니다.
                  이메일을 확인해주세요.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  이메일이 오지 않았다면 스팸함을 확인해주세요.
                </p>
                <Link
                  href="/uncle/login"
                  className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  로그인으로 돌아가기
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    비밀번호 찾기
                  </h2>
                  <p className="text-gray-500 mt-2">
                    가입한 이메일을 입력하시면
                    <br />
                    비밀번호 재설정 링크를 보내드립니다.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="이메일"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error || undefined}
                    required
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    재설정 링크 받기
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>© 2024 아조씨렌탈. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function UncleForgotPasswordPage() {
  return (
    <UncleAuthProvider>
      <ForgotPasswordContent />
    </UncleAuthProvider>
  );
}
