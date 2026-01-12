'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface SocialLoginButtonsProps {
  onKakaoLogin?: () => void;
  onNaverLogin?: () => void;
  disabled?: boolean;
}

export function SocialLoginButtons({
  onKakaoLogin,
  onNaverLogin,
  disabled = false,
}: SocialLoginButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">또는</span>
        </div>
      </div>

      <Button
        type="button"
        variant="kakao"
        fullWidth
        disabled={disabled}
        onClick={onKakaoLogin}
        className="gap-3"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 2C5.02944 2 1 5.25 1 9.22222C1 11.6389 2.55556 13.7778 4.88889 15.0556L4.11111 17.8333C4.05556 18.0556 4.33333 18.2222 4.5 18.0556L7.77778 15.8889C8.5 16 9.22222 16.0556 10 16.0556C14.9706 16.0556 19 12.8056 19 8.83333C19 4.86111 14.9706 2 10 2Z"
            fill="#000000"
          />
        </svg>
        카카오로 시작하기
      </Button>

      <Button
        type="button"
        variant="naver"
        fullWidth
        disabled={disabled}
        onClick={onNaverLogin}
        className="gap-3"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M13.3 10.6L6.5 2H2V18H6.7V9.4L13.5 18H18V2H13.3V10.6Z"
            fill="white"
          />
        </svg>
        네이버로 시작하기
      </Button>
    </div>
  );
}
