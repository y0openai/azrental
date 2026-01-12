'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface EmailVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<{ success: boolean; error?: string } | void>;
  loading?: boolean;
  error?: string;
}

export function EmailVerification({
  email,
  onVerify,
  onResend,
  loading = false,
  error,
}: EmailVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(180); // 3분
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 재전송 타이머
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // 코드 입력 처리
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // 다음 입력으로 이동
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // 모든 코드 입력 완료시 자동 제출
    if (newCode.every((c) => c) && !newCode.includes('')) {
      onVerify(newCode.join(''));
    }
  };

  // 백스페이스 처리
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 붙여넣기 처리
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      onVerify(pastedData);
    }
  };

  // 재전송
  const handleResend = async () => {
    await onResend();
    setResendTimer(180);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">이메일 인증</h2>
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-primary">{email}</span>로 전송된
          <br />
          6자리 인증 코드를 입력해주세요.
        </p>
      </div>

      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={loading}
            className={`
              w-12 h-14 text-center text-xl font-bold rounded-lg border-2
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-colors
              ${error ? 'border-red-500' : 'border-gray-300'}
              disabled:bg-gray-100 disabled:cursor-not-allowed
            `}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">
          코드를 받지 못하셨나요?
        </p>
        {resendTimer > 0 ? (
          <p className="text-sm text-gray-600">
            <span className="font-medium">{formatTime(resendTimer)}</span> 후 재전송 가능
          </p>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={loading}
          >
            인증 코드 재전송
          </Button>
        )}
      </div>

      <Button
        type="button"
        fullWidth
        loading={loading}
        onClick={() => onVerify(code.join(''))}
        disabled={code.some((c) => !c)}
      >
        확인
      </Button>
    </div>
  );
}
