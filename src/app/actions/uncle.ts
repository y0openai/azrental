'use server';

import { getAdminDb } from '@/lib/firebase/admin';
import {
  UncleListItem,
  UncleDetail,
  GetUnclesResponse,
  GetUncleByIdResponse,
} from '@/types/booking';

// ============================================
// 승인된 아조씨 목록 조회 (공개)
// ============================================
export async function getUncles(
  limit = 20,
  lastDocId?: string
): Promise<GetUnclesResponse> {
  try {
    const db = getAdminDb();

    // 승인된 아조씨만 조회
    let query = db.collection('uncles')
      .where('status', '==', 'approved')
      .orderBy('createdAt', 'desc')
      .limit(limit + 1);

    // 페이징
    if (lastDocId) {
      const lastDoc = await db.collection('uncles').doc(lastDocId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const uncles: UncleListItem[] = [];
    let hasMore = false;

    snapshot.docs.forEach((doc, index) => {
      if (index < limit) {
        const data = doc.data();
        uncles.push({
          uid: data.uid,
          displayName: data.displayName,
          shortIntro: data.shortIntro || '',
          profileImages: data.profileImages || [],
          mainImageIndex: data.mainImageIndex || 0,
          expertise: data.expertise || [],
          hourlyRate: data.hourlyRate || 50000,
          status: data.status,
        });
      } else {
        hasMore = true;
      }
    });

    return {
      success: true,
      data: {
        uncles,
        hasMore,
        lastDocId: uncles.length > 0 ? uncles[uncles.length - 1].uid : null,
      },
    };
  } catch (error) {
    console.error('Error getting uncles:', error);
    return { success: false, error: '아조씨 목록을 불러오는 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 아조씨 상세 조회 (공개)
// ============================================
export async function getUncleById(
  uncleId: string
): Promise<GetUncleByIdResponse> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('uncles').doc(uncleId).get();

    if (!doc.exists) {
      return { success: false, error: '아조씨를 찾을 수 없습니다.' };
    }

    const data = doc.data()!;

    // 승인된 아조씨만 공개
    if (data.status !== 'approved') {
      return { success: false, error: '해당 아조씨 프로필은 현재 비공개입니다.' };
    }

    // 상세 정보 구성
    const uncle: UncleDetail = {
      uid: data.uid,
      displayName: data.displayName,
      shortIntro: data.shortIntro || '',
      profileImages: data.profileImages || [],
      mainImageIndex: data.mainImageIndex || 0,
      expertise: data.expertise || [],
      hourlyRate: data.hourlyRate || 50000,
      status: data.status,
      bio: data.bio || '',
      availability: data.availability || {},
      stats: data.stats || { totalBookings: 0 },
    };

    // 계좌 정보 조회 (공개된 경우에만)
    let bankAccount;
    try {
      const bankDoc = await db.collection('uncle_bank_accounts').doc(uncleId).get();
      if (bankDoc.exists) {
        const bankData = bankDoc.data()!;
        if (bankData.isVisible) {
          bankAccount = {
            bankName: bankData.bankName,
            accountNumber: maskAccountNumber(bankData.accountNumber),
            accountHolder: bankData.accountHolder,
          };
        }
      }
    } catch {
      // 계좌 정보 없음 - 무시
    }

    return {
      success: true,
      data: {
        uncle,
        bankAccount,
      },
    };
  } catch (error) {
    console.error('Error getting uncle:', error);
    return { success: false, error: '아조씨 정보를 불러오는 중 오류가 발생했습니다.' };
  }
}

// ============================================
// 유틸리티 함수
// ============================================

// 계좌번호 마스킹
function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length < 6) {
    return '****';
  }
  // 앞 4자리와 뒤 4자리만 표시, 나머지 *
  const prefix = accountNumber.slice(0, 4);
  const suffix = accountNumber.slice(-4);
  const masked = '*'.repeat(Math.max(0, accountNumber.length - 8));
  return `${prefix}${masked}${suffix}`;
}
