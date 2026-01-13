'use client';

import React, { useCallback, useId, useState } from 'react';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // bytes
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  preview?: string | null;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  error,
  helperText,
  required,
  disabled,
  preview,
  onFileSelect,
  onRemove,
}) => {
  const id = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const validateAndSelect = useCallback(
    (file: File) => {
      setLocalError(null);

      if (maxSize && file.size > maxSize) {
        setLocalError(`파일 크기가 ${formatFileSize(maxSize)}를 초과합니다.`);
        return;
      }

      if (accept && accept !== '*') {
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const isValid = acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', ''));
          }
          return file.type === type || file.name.endsWith(type);
        });

        if (!isValid) {
          setLocalError('지원하지 않는 파일 형식입니다.');
          return;
        }
      }

      onFileSelect(file);
    },
    [accept, maxSize, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSelect(file);
      }
    },
    [disabled, validateAndSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndSelect(file);
      }
      e.target.value = '';
    },
    [validateAndSelect]
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {preview ? (
        <div className="relative rounded-lg border border-gray-300 overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {onRemove && !disabled && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <label
          htmlFor={id}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            flex flex-col items-center justify-center w-full h-48
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${
              isDragging
                ? 'border-primary bg-primary/5'
                : displayError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {displayError ? (
              <AlertCircle className="w-10 h-10 mb-3 text-red-400" />
            ) : (
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">클릭하여 업로드</span> 또는 드래그
              앤 드롭
            </p>
            <p className="text-xs text-gray-400">
              {accept === 'image/*'
                ? 'PNG, JPG'
                : accept.replace(/\./g, '').toUpperCase()}{' '}
              (최대 {formatFileSize(maxSize)})
            </p>
          </div>
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}

      {displayError && <p className="mt-1 text-sm text-red-500">{displayError}</p>}
      {helperText && !displayError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';
