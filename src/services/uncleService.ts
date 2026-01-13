// Uncle Service - 아조씨 조회 클라이언트 서비스
import { getUncles as getUnclesAction, getUncleById as getUncleByIdAction } from '@/app/actions/uncle';
import type {
  UncleListItem,
  UncleDetail,
  GetUnclesResponse,
  GetUncleByIdResponse,
} from '@/types/booking';

// ============================================
// 아조씨 목록 조회
// ============================================
export async function fetchUncles(
  limit = 20,
  lastDocId?: string
): Promise<GetUnclesResponse> {
  try {
    const response = await getUnclesAction(limit, lastDocId);
    return response;
  } catch (error) {
    console.error('Error fetching uncles:', error);
    return {
      success: false,
      error: '아조씨 목록을 불러오는 중 오류가 발생했습니다.',
    };
  }
}

// ============================================
// 아조씨 상세 조회
// ============================================
export async function fetchUncleById(
  uncleId: string
): Promise<GetUncleByIdResponse> {
  try {
    const response = await getUncleByIdAction(uncleId);
    return response;
  } catch (error) {
    console.error('Error fetching uncle:', error);
    return {
      success: false,
      error: '아조씨 정보를 불러오는 중 오류가 발생했습니다.',
    };
  }
}

// ============================================
// 유틸리티 함수
// ============================================

// 아조씨 메인 프로필 이미지 URL 가져오기
export function getUncleMainImage(uncle: UncleListItem | UncleDetail): string {
  if (!uncle.profileImages || uncle.profileImages.length === 0) {
    return '/images/default-profile.png'; // 기본 이미지
  }
  const index = uncle.mainImageIndex ?? 0;
  return uncle.profileImages[index] || uncle.profileImages[0];
}

// 아조씨 요금 포맷팅
export function formatHourlyRate(rate: number): string {
  return new Intl.NumberFormat('ko-KR').format(rate) + '원/시간';
}

// 아조씨 전문성 태그 필터링 (상위 N개)
export function getTopExpertise(
  uncle: UncleListItem | UncleDetail,
  count = 3
): string[] {
  return uncle.expertise.slice(0, count);
}
