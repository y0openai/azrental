'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UncleAuthProvider } from '@/contexts/UncleAuthContext';
import { UncleSignupForm } from '@/components/uncle-auth/UncleSignupForm';
import { ArrowLeft } from 'lucide-react';

export default function UncleSignupPage() {
  const router = useRouter();

  const handleSuccess = (uid: string) => {
    router.push('/uncle/status');
  };

  return (
    <UncleAuthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                홈으로
              </Link>
              <div className="text-center">
                <h1 className="text-xl font-bold text-red-600">
                  아조씨렌탈
                </h1>
                <p className="text-xs text-gray-500">아조씨 신청</p>
              </div>
              <Link
                href="/uncle/login"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                로그인
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Info Banner */}
            <div className="mb-8 p-6 bg-red-50 rounded-2xl border border-red-100">
              <h2 className="text-lg font-bold text-red-800 mb-2">
                아조씨가 되어 조카들에게 인생 경험을 나눠주세요
              </h2>
              <p className="text-red-700 text-sm">
                만 40세 이상의 성인이라면 누구나 신청할 수 있습니다.
                신청 후 심사를 거쳐 승인되면 활동을 시작할 수 있습니다.
              </p>
            </div>

            {/* Signup Form */}
            <UncleSignupForm onSuccess={handleSuccess} />

            {/* Footer Info */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                이미 신청하셨나요?{' '}
                <Link href="/uncle/status" className="text-red-600 hover:text-red-700">
                  신청 상태 확인
                </Link>
              </p>
              <p className="mt-2">
                문의사항이 있으시면{' '}
                <a
                  href="mailto:uncle@azrental.com"
                  className="text-red-600 hover:text-red-700"
                >
                  uncle@azrental.com
                </a>
                으로 연락해주세요.
              </p>
            </div>
          </div>
        </main>
      </div>
    </UncleAuthProvider>
  );
}
