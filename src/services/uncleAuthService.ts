import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
  saveDraft as saveDraftAction,
  loadDraft as loadDraftAction,
  applyAsUncle as applyAction,
  signInAsUncle as signInAction,
  getApplicationStatus as getStatusAction,
  sendUnclePasswordResetEmail as sendResetAction,
  updateProfileImageUrl,
  removeProfileImage as removeImageAction,
  setMainProfileImage,
  ActionResult,
} from '@/app/actions/uncle-auth';
import {
  uploadProfileImage as uploadProfileImageStorage,
  uploadIdCardImage,
  deleteProfileImageByUrl,
} from '@/lib/firebase/storage';
import {
  Uncle,
  UncleSignupData,
  UncleStatus,
  ApplicationStatusData,
} from '@/types/uncle';

// 아조씨 유저 타입
export interface UncleUser {
  uid: string;
  email: string;
  displayName: string;
  status: UncleStatus;
}

// Firebase User를 UncleUser로 변환 (기본값)
function toUncleUser(user: User, status: UncleStatus = 'pending'): UncleUser {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    status,
  };
}

// 임시 저장
export async function saveDraft(
  email: string,
  step: number,
  data: Partial<UncleSignupData>
): Promise<ActionResult<{ applicationId: string }>> {
  return saveDraftAction(email, step, data);
}

// 임시 저장 불러오기
export async function loadDraft(
  email: string
): Promise<ActionResult<{ draftData: Partial<UncleSignupData>; currentStep: number }>> {
  return loadDraftAction(email);
}

// 아조씨 신청
export async function apply(
  data: UncleSignupData
): Promise<ActionResult<{ uid: string }>> {
  return applyAction(data);
}

// 프로필 이미지 업로드
export async function uploadProfileImage(
  uid: string,
  file: File,
  index: number
): Promise<ActionResult<{ url: string }>> {
  // Storage에 업로드
  const uploadResult = await uploadProfileImageStorage(uid, file, index);
  if (!uploadResult.success || !uploadResult.url) {
    return { success: false, error: uploadResult.error };
  }

  // Firestore 업데이트
  const updateResult = await updateProfileImageUrl(uid, uploadResult.url, index);
  if (!updateResult.success) {
    return { success: false, error: updateResult.error };
  }

  return { success: true, data: { url: uploadResult.url } };
}

// 신분증 이미지 업로드
export async function uploadIdCard(
  uid: string,
  file: File
): Promise<ActionResult<{ url: string }>> {
  const uploadResult = await uploadIdCardImage(uid, file);
  if (!uploadResult.success || !uploadResult.url) {
    return { success: false, error: uploadResult.error };
  }

  return { success: true, data: { url: uploadResult.url } };
}

// 프로필 이미지 삭제
export async function removeProfileImage(
  uid: string,
  index: number,
  imageUrl: string
): Promise<ActionResult> {
  // Storage에서 삭제
  await deleteProfileImageByUrl(imageUrl);

  // Firestore 업데이트
  return removeImageAction(uid, index);
}

// 메인 이미지 설정
export async function setMainImage(
  uid: string,
  index: number
): Promise<ActionResult> {
  return setMainProfileImage(uid, index);
}

// 아조씨 로그인
export async function signIn(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<ActionResult<{ user: UncleUser }>> {
  // 서버 액션으로 인증
  const result = await signInAction(email, password, rememberMe);
  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error,
      message: result.message,
    };
  }

  // Custom token으로 클라이언트 로그인
  if (result.data.customToken) {
    try {
      const credential = await signInWithCustomToken(auth, result.data.customToken);
      return {
        success: true,
        data: {
          user: toUncleUser(credential.user, result.data.status),
        },
      };
    } catch (error) {
      console.error('Client sign in error:', error);
      return {
        success: false,
        error: 'uncle/unknown',
        message: '로그인에 실패했습니다.',
      };
    }
  }

  return {
    success: true,
    data: {
      user: {
        uid: result.data.uid,
        email,
        displayName: '',
        status: result.data.status,
      },
    },
  };
}

// 로그아웃
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: '로그아웃에 실패했습니다.' };
  }
}

// 신청 상태 확인
export async function checkStatus(
  email: string
): Promise<ActionResult<ApplicationStatusData>> {
  return getStatusAction(email);
}

// 비밀번호 재설정 이메일 발송
export async function sendPasswordReset(
  email: string
): Promise<ActionResult> {
  return sendResetAction(email);
}

// 인증 상태 변경 리스너
export function onUncleAuthStateChanged(
  callback: (user: UncleUser | null) => void
): () => void {
  return onAuthStateChanged(auth, (user) => {
    // 여기서는 기본 상태만 반환, 실제 상태는 별도로 조회 필요
    callback(user ? toUncleUser(user) : null);
  });
}

// 현재 사용자 가져오기
export function getCurrentUncle(): UncleUser | null {
  const user = auth.currentUser;
  return user ? toUncleUser(user) : null;
}
