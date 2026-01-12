'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'kakao' | 'naver';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50',
  outline: 'border-2 border-primary text-primary hover:bg-primary/5 disabled:border-primary/50 disabled:text-primary/50',
  ghost: 'text-gray-700 hover:bg-gray-100 disabled:text-gray-400',
  kakao: 'bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 disabled:bg-[#FEE500]/50',
  naver: 'bg-[#00C73C] text-white hover:bg-[#00C73C]/90 disabled:bg-[#00C73C]/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-lg transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
