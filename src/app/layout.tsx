import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '아조씨렌탈 | 믿을 수 있는 아저씨를 빌려드립니다',
  description: '집수리, 이사 도움, 가전 설치 등 다양한 생활 서비스를 전문 아저씨와 연결해드립니다.',
  keywords: ['아조씨렌탈', '생활서비스', '집수리', '이사도움', '가전설치', 'P2P서비스'],
  openGraph: {
    title: '아조씨렌탈 | 믿을 수 있는 아저씨를 빌려드립니다',
    description: '집수리, 이사 도움, 가전 설치 등 다양한 생활 서비스를 전문 아저씨와 연결해드립니다.',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
