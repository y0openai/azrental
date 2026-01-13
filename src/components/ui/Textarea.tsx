'use client';

import React, { forwardRef, TextareaHTMLAttributes, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCount = false,
      maxLength,
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            className={`
              w-full px-4 py-3 rounded-lg border transition-colors resize-none
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300'}
              ${className}
            `}
            {...props}
          />
        </div>
        <div className="flex justify-between mt-1">
          <div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
          {showCount && maxLength && (
            <p
              className={`text-sm ${
                currentLength >= maxLength ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
