import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* 로고 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">아조씨 렌탈</h1>
          </div>

          {/* 컨텐츠 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {children}
          </div>

          {/* 푸터 */}
          <p className="mt-8 text-center text-xs text-gray-500">
            © 2024 아조씨 렌탈. All rights reserved.
          </p>
        </div>
      </div>
    </AuthProvider>
  );
}
