import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  signInWithCustomToken,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { AuthResult, AuthUser, AUTH_ERROR_MESSAGES, AuthErrorCode } from '@/types/auth';

// Firebase User를 AuthUser로 변환
function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    provider: 'email', // TODO: provider 감지 로직 추가
  };
}

// 에러 코드 추출
function getErrorCode(error: unknown): AuthErrorCode {
  const code = (error as { code?: string })?.code;
  if (code && code in AUTH_ERROR_MESSAGES) {
    return code as AuthErrorCode;
  }
  return 'auth/unknown';
}

// 이메일/비밀번호 로그인 (클라이언트)
export async function signInWithEmailClient(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: toAuthUser(credential.user),
    };
  } catch (error) {
    const errorCode = getErrorCode(error);
    return {
      success: false,
      error: errorCode,
      message: AUTH_ERROR_MESSAGES[errorCode],
    };
  }
}

// Custom token으로 로그인 (서버 액션 응답 처리)
export async function signInWithToken(token: string): Promise<AuthResult> {
  try {
    const credential = await signInWithCustomToken(auth, token);
    return {
      success: true,
      user: toAuthUser(credential.user),
    };
  } catch (error) {
    const errorCode = getErrorCode(error);
    return {
      success: false,
      error: errorCode,
      message: AUTH_ERROR_MESSAGES[errorCode],
    };
  }
}

// 이메일/비밀번호 회원가입 (클라이언트 - 직접 사용 시)
export async function signUpWithEmailClient(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: toAuthUser(credential.user),
    };
  } catch (error) {
    const errorCode = getErrorCode(error);
    return {
      success: false,
      error: errorCode,
      message: AUTH_ERROR_MESSAGES[errorCode],
    };
  }
}

// 로그아웃
export async function signOutClient(): Promise<{ success: boolean; error?: string }> {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: '로그아웃에 실패했습니다.' };
  }
}

// 비밀번호 재설정 이메일 발송 (클라이언트)
export async function sendPasswordResetClient(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    const errorCode = getErrorCode(error);
    // 보안상 사용자 존재 여부를 노출하지 않음
    if (errorCode === 'auth/user-not-found') {
      return { success: true };
    }
    return { success: false, error: AUTH_ERROR_MESSAGES[errorCode] };
  }
}

// 인증 상태 변경 리스너
export function onAuthStateChangedListener(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAuthUser(user) : null);
  });
}

// 현재 사용자 가져오기
export function getCurrentUser(): AuthUser | null {
  const user = auth.currentUser;
  return user ? toAuthUser(user) : null;
}
