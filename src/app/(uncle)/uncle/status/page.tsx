'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UncleAuthProvider, useUncleAuthContext } from '@/contexts/UncleAuthContext';
import { ApplicationStatus } from '@/components/uncle-auth';
import { Input, Button } from '@/components/ui';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { UncleStatus, ApplicationStatusData } from '@/types/uncle';

function StatusContent() {
  const router = useRouter();
  const { checkStatus, loading } = useUncleAuthContext();

  const [email, setEmail] = useState('');
  const [statusData, setStatusData] = useState<ApplicationStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Check for saved email from draft
  useEffect(() => {
    const savedEmail = localStorage.getItem('uncle_draft_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusData(null);

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkStatus(email);
      if (result.success && result.data) {
        setStatusData(result.data);
      } else {
        setError(result.message || '신청 내역을 찾을 수 없습니다.');
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetry = () => {
    router.push('/uncle/signup');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
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
              <p className="text-xs text-gray-500">신청 상태 확인</p>
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
      <main className="flex-1 py-12 px-4">
        <div className="max-w-md mx-auto">
          {statusData ? (
            <ApplicationStatus
              status={statusData.status}
              submittedAt={statusData.submittedAt}
              rejectionReason={statusData.rejectionReason}
              onRetry={handleRetry}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  신청 상태 확인
                </h2>
                <p className="text-gray-500 mt-2">
                  신청 시 입력한 이메일로 확인하세요
                </p>
              </div>

              <form onSubmit={handleCheck} className="space-y-6">
                <Input
                  label="이메일"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error || undefined}
                  required
                  disabled={isChecking}
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={isChecking}
                  className="bg-red-600 hover:bg-red-700"
                >
                  확인하기
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-500 text-sm">
                  아직 신청하지 않으셨나요?{' '}
                  <Link
                    href="/uncle/signup"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    아조씨 신청하기
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Back button when showing status */}
          {statusData && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setStatusData(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                다른 이메일로 확인하기
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>© 2024 아조씨렌탈. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function UncleStatusPage() {
  return (
    <UncleAuthProvider>
      <StatusContent />
    </UncleAuthProvider>
  );
}
