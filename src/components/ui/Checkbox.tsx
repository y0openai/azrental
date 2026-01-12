'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              className={`
                peer appearance-none w-5 h-5 border-2 rounded
                transition-colors cursor-pointer
                checked:bg-primary checked:border-primary
                focus:outline-none focus:ring-2 focus:ring-primary/20
                disabled:cursor-not-allowed disabled:bg-gray-100
                ${error ? 'border-red-500' : 'border-gray-300'}
                ${className}
              `}
              {...props}
            />
            <Check
              className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
              strokeWidth={3}
            />
          </div>
          {label && (
            <span className="text-sm text-gray-700 select-none">{label}</span>
          )}
        </label>
        {error && <p className="mt-1 ml-8 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
