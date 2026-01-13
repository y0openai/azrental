'use client';

import React, { useState, useCallback } from 'react';
import { Plus, X, Star, Loader2 } from 'lucide-react';
import { MAX_PROFILE_IMAGES } from '@/types/uncle';

interface ProfileImageUploadProps {
  images: string[];
  mainImageIndex: number;
  maxImages?: number;
  onUpload: (file: File, index: number) => Promise<void>;
  onRemove: (index: number, imageUrl: string) => Promise<void>;
  onSetMain: (index: number) => void;
  disabled?: boolean;
  error?: string;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  images,
  mainImageIndex,
  maxImages = MAX_PROFILE_IMAGES,
  onUpload,
  onRemove,
  onSetMain,
  disabled,
  error,
}) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }

      setUploadingIndex(index);
      try {
        await onUpload(file, index);
      } finally {
        setUploadingIndex(null);
      }

      e.target.value = '';
    },
    [onUpload]
  );

  const handleRemove = useCallback(
    async (index: number, imageUrl: string) => {
      if (window.confirm('이 이미지를 삭제하시겠습니까?')) {
        setRemovingIndex(index);
        try {
          await onRemove(index, imageUrl);
        } finally {
          setRemovingIndex(null);
        }
      }
    },
    [onRemove]
  );

  const slots = Array.from({ length: maxImages }, (_, i) => i);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          프로필 이미지 <span className="text-red-500">*</span>
        </label>
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages}장
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        첫 번째 이미지가 대표 이미지로 설정됩니다. 별 아이콘을 클릭하여 대표
        이미지를 변경할 수 있습니다.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {slots.map((index) => {
          const imageUrl = images[index];
          const isUploading = uploadingIndex === index;
          const isRemoving = removingIndex === index;
          const isMain = mainImageIndex === index;

          return (
            <div
              key={index}
              className={`
                relative aspect-square rounded-lg border-2 overflow-hidden
                ${
                  imageUrl
                    ? isMain
                      ? 'border-red-500'
                      : 'border-gray-300'
                    : 'border-dashed border-gray-300'
                }
              `}
            >
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={`프로필 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Main badge */}
                  {isMain && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded">
                      대표
                    </div>
                  )}

                  {/* Action buttons */}
                  {!disabled && !isRemoving && (
                    <div className="absolute top-1 right-1 flex gap-1">
                      {!isMain && (
                        <button
                          type="button"
                          onClick={() => onSetMain(index)}
                          className="p-1 bg-white/80 hover:bg-white rounded-full transition-colors"
                          title="대표 이미지로 설정"
                        >
                          <Star size={14} className="text-gray-600" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(index, imageUrl)}
                        className="p-1 bg-white/80 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                        title="삭제"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {/* Removing overlay */}
                  {isRemoving && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </>
              ) : (
                <label
                  className={`
                    w-full h-full flex flex-col items-center justify-center cursor-pointer
                    hover:bg-gray-50 transition-colors
                    ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-1">추가</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, index)}
                    disabled={disabled || isUploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

ProfileImageUpload.displayName = 'ProfileImageUpload';
