'use client';

import { HERO_CONTENT } from '@/constants/landing';

interface HeroSectionProps {
  onOpenStoryModal: () => void;
}

export default function HeroSection({ onOpenStoryModal }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#154FB3] to-[#2B6BE6] overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-[1]" />

      {/* Content */}
      <div className="relative z-[2] text-center text-white max-w-[800px] px-8 mx-auto">
        <h1 className="text-4xl md:text-[3.5rem] font-bold mb-6 leading-tight">
          {HERO_CONTENT.mainTitle}
        </h1>

        <p className="text-lg md:text-xl text-white/95 mb-4 leading-relaxed">
          {HERO_CONTENT.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mt-10">
          <a
            href={HERO_CONTENT.ctaPrimary.href}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-[#154FB3] font-semibold text-lg rounded-lg hover:bg-gray-100 transition-all hover:-translate-y-0.5 shadow-lg"
          >
            <span>{HERO_CONTENT.ctaPrimary.icon}</span>
            <span>{HERO_CONTENT.ctaPrimary.label}</span>
          </a>
          <a
            href={HERO_CONTENT.ctaSecondary.href}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-lg hover:bg-white/10 transition-all hover:-translate-y-0.5"
          >
            <span>{HERO_CONTENT.ctaSecondary.icon}</span>
            <span>{HERO_CONTENT.ctaSecondary.label}</span>
          </a>
        </div>

        {/* Story Button */}
        <button
          onClick={onOpenStoryModal}
          className="mt-6 px-6 py-3 bg-white/20 text-white border-2 border-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-all hover:-translate-y-0.5"
        >
          💭 {HERO_CONTENT.storyButtonLabel}
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] animate-bounce text-2xl">
        👇
      </div>
    </section>
  );
}
