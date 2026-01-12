/**
 * 에셋 경로 중앙 관리
 *
 * 사용법:
 * import { ASSETS } from '@/constants/assets';
 * <Image src={ASSETS.hero.background} ... />
 *
 * 에셋 교체 시:
 * public/assets/images/hero-bg.webp 파일만 교체하면 됨
 */

export const ASSETS = {
  // 랜딩페이지 - Hero 섹션
  hero: {
    background: '/assets/images/hero-bg.webp',
    video: '/assets/videos/hero-intro.mp4',
    videoPoster: '/assets/images/hero-video-poster.webp',
  },

  // 랜딩페이지 - Founder Story 섹션
  founder: {
    photo: '/assets/images/founder-photo.webp',
    youtubeThumb: '/assets/images/youtube-thumbnail.webp',
  },

  // 랜딩페이지 - Service 섹션
  services: {
    repair: '/assets/images/service-repair.webp',
    moving: '/assets/images/service-moving.webp',
    installation: '/assets/images/service-installation.webp',
    cleaning: '/assets/images/service-cleaning.webp',
  },

  // 랜딩페이지 - Uncle 소개 섹션
  uncles: {
    profile1: '/assets/images/uncle-profile-1.webp',
    profile2: '/assets/images/uncle-profile-2.webp',
    profile3: '/assets/images/uncle-profile-3.webp',
  },

  // 랜딩페이지 - 신뢰/인증 섹션
  trust: {
    badge: '/assets/images/trust-badge.webp',
    certification: '/assets/images/certification.webp',
  },

  // 공통
  brand: {
    logo: '/assets/images/logo.svg',
    logoWhite: '/assets/images/logo-white.svg',
    favicon: '/favicon.ico',
  },

  // 플레이스홀더 (개발용)
  placeholder: {
    square: 'https://via.placeholder.com/400x400/e2e8f0/64748b?text=Image',
    wide: 'https://via.placeholder.com/800x400/e2e8f0/64748b?text=Image',
    portrait: 'https://via.placeholder.com/400x600/e2e8f0/64748b?text=Image',
    hero: 'https://via.placeholder.com/1920x1080/1e3a8a/ffffff?text=Hero+Background',
    profile: 'https://via.placeholder.com/200x200/e2e8f0/64748b?text=Profile',
  },
} as const;

// 타입 추출 (필요 시 사용)
export type Assets = typeof ASSETS;
