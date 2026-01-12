import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#154FB3]">
          <span>🎭</span>
          <span>아조씨 렌탈</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-[#2B6BE6] transition-colors">
            홈
          </Link>
          <Link href="/search" className="text-gray-700 hover:text-[#2B6BE6] transition-colors">
            검색
          </Link>
          <Link href="/login" className="text-gray-700 hover:text-[#2B6BE6] transition-colors">
            로그인
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-[#2B6BE6] text-white rounded-lg hover:bg-[#154FB3] transition-colors"
          >
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}
