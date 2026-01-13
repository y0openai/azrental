'use client';

import React from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { UncleStatus } from '@/types/uncle';

interface ApplicationStatusProps {
  status: UncleStatus;
  submittedAt?: Date;
  rejectionReason?: string;
  onRetry?: () => void;
}

const STATUS_CONFIG: Record<
  UncleStatus,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    bgColor: string;
  }
> = {
  pending: {
    icon: <Clock className="w-12 h-12" />,
    title: '심사 대기 중',
    description: '신청서가 접수되었습니다. 심사는 영업일 기준 2-3일 소요됩니다.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  under_review: {
    icon: <Loader2 className="w-12 h-12 animate-spin" />,
    title: '심사 진행 중',
    description: '담당자가 신청서를 검토하고 있습니다. 곧 결과를 안내드리겠습니다.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  approved: {
    icon: <CheckCircle className="w-12 h-12" />,
    title: '승인 완료',
    description: '축하합니다! 아조씨로 활동을 시작할 수 있습니다.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  rejected: {
    icon: <XCircle className="w-12 h-12" />,
    title: '승인 거절',
    description: '신청이 승인되지 않았습니다. 사유를 확인해주세요.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  suspended: {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: '활동 정지',
    description: '계정이 일시적으로 정지되었습니다. 고객센터에 문의해주세요.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
};

export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({
  status,
  submittedAt,
  rejectionReason,
  onRetry,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`
          p-8 rounded-2xl text-center
          ${config.bgColor}
        `}
      >
        <div className={`${config.color} flex justify-center mb-4`}>
          {config.icon}
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${config.color}`}>
          {config.title}
        </h2>

        <p className="text-gray-600 mb-4">{config.description}</p>

        {submittedAt && (
          <p className="text-sm text-gray-500">
            신청일: {submittedAt.toLocaleDateString('ko-KR')}
          </p>
        )}

        {status === 'rejected' && rejectionReason && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-700 mb-1">거절 사유</p>
            <p className="text-sm text-gray-700">{rejectionReason}</p>
          </div>
        )}

        {status === 'rejected' && onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            다시 신청하기
          </button>
        )}

        {status === 'approved' && (
          <a
            href="/uncle/dashboard"
            className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            대시보드로 이동
          </a>
        )}

        {(status === 'pending' || status === 'under_review') && (
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span>처리 중...</span>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">자주 묻는 질문</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-700">심사는 얼마나 걸리나요?</p>
            <p className="text-gray-500">
              영업일 기준 2-3일 내에 결과를 안내드립니다.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">
              심사 결과는 어떻게 확인하나요?
            </p>
            <p className="text-gray-500">
              등록하신 이메일로 결과가 발송되며, 이 페이지에서도 확인 가능합니다.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">문의는 어디로 하나요?</p>
            <p className="text-gray-500">
              고객센터(1588-0000) 또는 help@azrental.com으로 문의해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ApplicationStatus.displayName = 'ApplicationStatus';
