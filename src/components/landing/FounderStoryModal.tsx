'use client';

import { useEffect, useCallback } from 'react';
import { FOUNDER_STORY } from '@/constants/landing';

interface FounderStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FounderStoryModal({ isOpen, onClose }: FounderStoryModalProps) {
  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4 md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl max-w-[700px] w-full max-h-[80vh] overflow-y-auto p-8 md:p-12 relative animate-slideUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 text-2xl transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* Title */}
        <h2
          id="modal-title"
          className="text-2xl md:text-3xl font-bold text-[#154FB3] mb-8 text-center"
        >
          창업자의 생각
        </h2>

        {/* Story Sections */}
        <div className="space-y-8">
          {FOUNDER_STORY.map((section, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold text-[#154FB3] mb-4 flex items-center gap-2">
                <span>{section.emoji}</span>
                <span>{section.title}</span>
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
