import { Metadata } from 'next';
import { UncleList } from '@/components/booking';

export const metadata: Metadata = {
  title: '아조씨 찾기 | 아조씨렌탈',
  description: '다양한 경험과 지혜를 가진 아조씨들을 만나보세요. 직업 상담, 인생 조언, 취미 공유 등 원하는 서비스를 선택하세요.',
};

export default function UnclesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            아조씨 찾기
          </h1>
          <p className="mt-2 text-gray-600">
            다양한 경험과 지혜를 가진 아조씨들을 만나보세요
          </p>
        </div>
      </div>

      {/* 아조씨 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UncleList variant="grid" showBookButton={true} initialLimit={12} />
      </div>
    </div>
  );
}
