'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Shield, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface IdCardUploadProps {
  imageUrl: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => void;
  disabled?: boolean;
  error?: string;
}

export const IdCardUpload: React.FC<IdCardUploadProps> = ({
  imageUrl,
  onUpload,
  onRemove,
  disabled,
  error,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }

      setIsUploading(true);
      try {
        await onUpload(file);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      e.target.value = '';
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isUploading) {
        setIsDragging(true);
      }
    },
    [disabled, isUploading]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          신분증 사진 <span className="text-red-500">*</span>
        </label>
        {imageUrl && (
          <span className="flex items-center text-sm text-green-600">
            <CheckCircle size={14} className="mr-1" />
            업로드 완료
          </span>
        )}
      </div>

      {/* Security notice */}
      <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">개인정보 보호 안내</p>
            <p className="mt-1 text-yellow-700">
              신분증 사진은 본인 확인 후 즉시 암호화되어 저장되며,
              서비스 이용 종료 시 안전하게 폐기됩니다.
            </p>
          </div>
        </div>
      </div>

      {imageUrl ? (
        <div className="relative rounded-lg border border-gray-300 overflow-hidden">
          <div className="relative aspect-video bg-gray-100">
            {/* Blurred preview for privacy */}
            <img
              src={imageUrl}
              alt="신분증"
              className="w-full h-full object-contain blur-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="text-white text-center">
                <CheckCircle size={32} className="mx-auto mb-2" />
                <p className="text-sm font-medium">신분증 업로드 완료</p>
                <p className="text-xs opacity-80">보안을 위해 흐리게 표시됩니다</p>
              </div>
            </div>
          </div>
          {onRemove && !disabled && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            flex flex-col items-center justify-center w-full aspect-video
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${
              isDragging
                ? 'border-red-400 bg-red-50'
                : error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center py-6">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 mb-3 text-red-400 animate-spin" />
                <p className="text-sm text-gray-500">업로드 중...</p>
              </>
            ) : error ? (
              <>
                <AlertCircle className="w-10 h-10 mb-3 text-red-400" />
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">클릭하여 업로드</span> 또는 드래그
                  앤 드롭
                </p>
                <p className="text-xs text-gray-400">
                  주민등록증, 운전면허증, 여권 중 택1 (최대 5MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={disabled || isUploading}
            className="hidden"
          />
        </label>
      )}

      {error && !imageUrl && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

IdCardUpload.displayName = 'IdCardUpload';
