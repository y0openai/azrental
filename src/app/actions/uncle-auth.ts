'use server';

import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { createHash } from 'crypto';
import {
  Uncle,
  UncleSignupData,
  UncleStatus,
  ApplicationStatusData,
  UncleApplication,
} from '@/types/uncle';
import { Timestamp } from 'firebase-admin/firestore';

// 액션 결과 타입
export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 아조씨 에러 메시지
const UNCLE_ERROR_MESSAGES: Record<string, string> = {
  'uncle/email-already-in-use': '이미 등록된 이메일입니다.',
  'uncle/age-requirement': '만 40세 이상만 신청 가능합니다.',
  'uncle/bio-too-short': '자기소개는 100자 이상 작성해주세요.',
  'uncle/no-expertise': '최소 1개의 전문성을 선택해주세요.',
  'uncle/image-too-large': '이미지 크기가 5MB를 초과합니다.',
  'uncle/invalid-image-type': 'JPG 또는 PNG 파일만 업로드 가능합니다.',
  'uncle/invalid-id-card': '유효하지 않은 신분증입니다.',
  'uncle/not-approved': '아직 승인되지 않은 계정입니다.',
  'uncle/account-suspended': '활동 정지된 계정입니다.',
  'uncle/application-rejected': '신청이 반려되었습니다.',
  'uncle/invalid-ssn': '유효하지 않은 주민등록번호입니다.',
  'uncle/rate-out-of-range': '요금은 20,000원~100,000원 범위로 설정해주세요.',
  'uncle/unknown': '알 수 없는 오류가 발생했습니다.',
};

// SSN 해싱 함수
function hashSSN(ssn: string): string {
  return createHash('sha256').update(ssn).digest('hex');
}

// 임시 저장
export async function saveDraft(
  email: string,
  step: number,
  data: Partial<UncleSignupData>
): Promise<ActionResult<{ applicationId: string }>> {
  try {
    const db = getAdminDb();
    const now = Timestamp.now();

    // 기존 draft 조회
    const existingQuery = await db
      .collection('uncle_applications')
      .where('email', '==', email)
      .where('status', '==', 'draft')
      .limit(1)
      .get();

    let applicationId: string;

    if (!existingQuery.empty) {
      // 기존 draft 업데이트
      applicationId = existingQuery.docs[0].id;
      const existingData = existingQuery.docs[0].data() as UncleApplication;

      await db.collection('uncle_applications').doc(applicationId).update({
        draftData: { ...existingData.draftData, ...data },
        currentStep: step,
        updatedAt: now,
      });
    } else {
      // 새 draft 생성
      const docRef = await db.collection('uncle_applications').add({
        email,
        draftData: data,
        currentStep: step,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      });
      applicationId = docRef.id;
    }

    return { success: true, data: { applicationId } };
  } catch (error) {
    console.error('Error saving draft:', error);
    return { success: false, error: 'uncle/unknown' };
  }
}

// 임시 저장 불러오기
export async function loadDraft(
  email: string
): Promise<ActionResult<{ draftData: Partial<UncleSignupData>; currentStep: number }>> {
  try {
    const db = getAdminDb();

    const query = await db
      .collection('uncle_applications')
      .where('email', '==', email)
      .where('status', '==', 'draft')
      .limit(1)
      .get();

    if (query.empty) {
      return { success: true, data: { draftData: {}, currentStep: 1 } };
    }

    const doc = query.docs[0].data() as UncleApplication;
    return {
      success: true,
      data: {
        draftData: doc.draftData || {},
        currentStep: doc.currentStep || 1,
      },
    };
  } catch (error) {
    console.error('Error loading draft:', error);
    return { success: false, error: 'uncle/unknown' };
  }
}

// 아조씨 신청
export async function applyAsUncle(
  data: UncleSignupData
): Promise<ActionResult<{ uid: string }>> {
  try {
    const auth = getAdminAuth();
    const db = getAdminDb();
    const now = Timestamp.now();

    // 나이 검증
    if (data.age < 40) {
      return { success: false, error: 'uncle/age-requirement' };
    }

    // 자기소개 길이 검증
    if (data.bio.length < 100) {
      return { success: false, error: 'uncle/bio-too-short' };
    }

    // 전문성 선택 검증
    if (!data.expertise || data.expertise.length === 0) {
      return { success: false, error: 'uncle/no-expertise' };
    }

    // 요금 범위 검증
    if (data.hourlyRate < 20000 || data.hourlyRate > 100000) {
      return { success: false, error: 'uncle/rate-out-of-range' };
    }

    // Firebase Auth에 사용자 생성
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      emailVerified: false, // 아조씨는 심사 후 승인
    });

    // Firestore에 아조씨 정보 저장
    const uncleData: Omit<Uncle, 'createdAt' | 'updatedAt'> & {
      createdAt: Timestamp;
      updatedAt: Timestamp;
    } = {
      uid: userRecord.uid,
      email: data.email,
      displayName: data.displayName,
      phone: data.phone,
      age: data.age,
      bio: data.bio,
      shortIntro: data.shortIntro,
      profileImages: data.profileImages,
      mainImageIndex: data.mainImageIndex,
      expertise: data.expertise,
      hourlyRate: data.hourlyRate,
      availability: data.availability,
      verification: {
        idCardImageUrl: data.idCardImageUrl,
        ssnHash: hashSSN(data.ssn),
      },
      agreedTerms: data.agreedTerms,
      agreedPrivacy: data.agreedPrivacy,
      agreedCodeOfConduct: data.agreedCodeOfConduct,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('uncles').doc(userRecord.uid).set(uncleData);

    // 기존 draft 상태 업데이트
    const draftQuery = await db
      .collection('uncle_applications')
      .where('email', '==', data.email)
      .where('status', '==', 'draft')
      .limit(1)
      .get();

    if (!draftQuery.empty) {
      await db.collection('uncle_applications').doc(draftQuery.docs[0].id).update({
        status: 'submitted',
        submittedAt: now,
        updatedAt: now,
      });
    }

    return { success: true, data: { uid: userRecord.uid } };
  } catch (error: unknown) {
    console.error('Error applying as uncle:', error);
    const errorCode = (error as { code?: string })?.code;
    if (errorCode === 'auth/email-already-exists') {
      return { success: false, error: 'uncle/email-already-in-use' };
    }
    return { success: false, error: 'uncle/unknown' };
  }
}

// 아조씨 로그인
export async function signInAsUncle(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<ActionResult<{ uid: string; status: UncleStatus; customToken?: string }>> {
  try {
    const auth = getAdminAuth();
    const db = getAdminDb();

    // 이메일로 사용자 조회
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch {
      return {
        success: false,
        error: 'uncle/unknown',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
    }

    // 아조씨 정보 조회
    const uncleDoc = await db.collection('uncles').doc(userRecord.uid).get();
    if (!uncleDoc.exists) {
      return {
        success: false,
        error: 'uncle/unknown',
        message: '아조씨 계정이 아닙니다.',
      };
    }

    const uncleData = uncleDoc.data() as Uncle;

    // 상태 확인
    if (uncleData.status === 'suspended') {
      return {
        success: false,
        error: 'uncle/account-suspended',
        message: UNCLE_ERROR_MESSAGES['uncle/account-suspended'],
      };
    }

    if (uncleData.status === 'rejected') {
      return {
        success: false,
        error: 'uncle/application-rejected',
        message: UNCLE_ERROR_MESSAGES['uncle/application-rejected'],
      };
    }

    // 미승인 상태도 로그인은 허용 (상태 페이지로 이동)
    // Custom token 생성
    const customToken = await auth.createCustomToken(userRecord.uid);

    // 마지막 로그인 시간 업데이트
    await db.collection('uncles').doc(userRecord.uid).update({
      lastLoginAt: Timestamp.now(),
    });

    return {
      success: true,
      data: {
        uid: userRecord.uid,
        status: uncleData.status,
        customToken,
      },
    };
  } catch (error) {
    console.error('Error signing in as uncle:', error);
    return {
      success: false,
      error: 'uncle/unknown',
      message: '로그인에 실패했습니다.',
    };
  }
}

// 신청 상태 확인
export async function getApplicationStatus(
  email: string
): Promise<ActionResult<ApplicationStatusData>> {
  try {
    const db = getAdminDb();

    // uncles 컬렉션에서 먼저 조회
    const uncleQuery = await db
      .collection('uncles')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!uncleQuery.empty) {
      const uncleData = uncleQuery.docs[0].data() as Uncle;
      return {
        success: true,
        data: {
          status: uncleData.status,
          submittedAt: uncleData.createdAt?.toDate(),
          rejectionReason: uncleData.rejectionReason,
        },
      };
    }

    // uncle_applications에서 조회
    const appQuery = await db
      .collection('uncle_applications')
      .where('email', '==', email)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (appQuery.empty) {
      return {
        success: false,
        error: 'uncle/unknown',
        message: '신청 내역이 없습니다.',
      };
    }

    const appData = appQuery.docs[0].data() as UncleApplication;
    return {
      success: true,
      data: {
        status: appData.status === 'draft' ? 'pending' : (appData.status as UncleStatus),
        submittedAt: appData.submittedAt?.toDate(),
        rejectionReason: appData.rejectionReason,
      },
    };
  } catch (error) {
    console.error('Error getting application status:', error);
    return { success: false, error: 'uncle/unknown' };
  }
}

// 비밀번호 재설정 이메일 발송
export async function sendUnclePasswordResetEmail(
  email: string
): Promise<ActionResult> {
  try {
    const auth = getAdminAuth();
    const db = getAdminDb();

    // 아조씨 계정 존재 여부 확인
    const uncleQuery = await db
      .collection('uncles')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (uncleQuery.empty) {
      // 보안상 성공으로 응답
      return { success: true };
    }

    // 비밀번호 재설정 링크 생성
    const resetLink = await auth.generatePasswordResetLink(email);

    // TODO: 실제 이메일 발송 로직 구현
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Uncle password reset link for ${email}: ${resetLink}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending uncle password reset email:', error);
    return { success: true }; // 보안상 성공으로 응답
  }
}

// 프로필 이미지 URL 업데이트 (클라이언트에서 업로드 후 호출)
export async function updateProfileImageUrl(
  uid: string,
  imageUrl: string,
  index: number
): Promise<ActionResult> {
  try {
    const db = getAdminDb();

    const uncleRef = db.collection('uncles').doc(uid);
    const uncleDoc = await uncleRef.get();

    if (!uncleDoc.exists) {
      return { success: false, error: 'uncle/unknown' };
    }

    const uncleData = uncleDoc.data() as Uncle;
    const profileImages = [...(uncleData.profileImages || [])];

    // 인덱스 위치에 이미지 URL 추가/업데이트
    if (index < profileImages.length) {
      profileImages[index] = imageUrl;
    } else {
      profileImages.push(imageUrl);
    }

    await uncleRef.update({
      profileImages,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating profile image URL:', error);
    return { success: false, error: 'uncle/unknown' };
  }
}

// 프로필 이미지 삭제
export async function removeProfileImage(
  uid: string,
  index: number
): Promise<ActionResult> {
  try {
    const db = getAdminDb();

    const uncleRef = db.collection('uncles').doc(uid);
    const uncleDoc = await uncleRef.get();

    if (!uncleDoc.exists) {
      return { success: false, error: 'uncle/unknown' };
    }

    const uncleData = uncleDoc.data() as Uncle;
    const profileImages = [...(uncleData.profileImages || [])];

    if (index >= 0 && index < profileImages.length) {
      profileImages.splice(index, 1);

      // mainImageIndex 조정
      let mainImageIndex = uncleData.mainImageIndex;
      if (mainImageIndex === index) {
        mainImageIndex = 0;
      } else if (mainImageIndex > index) {
        mainImageIndex--;
      }

      await uncleRef.update({
        profileImages,
        mainImageIndex,
        updatedAt: Timestamp.now(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing profile image:', error);
    return { success: false, error: 'uncle/unknown' };
  }
}

// 메인 이미지 설정
export async function setMainProfileImage(
  uid: string,
  index: number
): Promise<ActionResult> {
  try {
    const db = getAdminDb();

    await db.collection('uncles').doc(uid).update({
      mainImageIndex: index,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error setting main profile image:', error);
    return { success: false, error: 'uncle/unknown' };
  }
}
