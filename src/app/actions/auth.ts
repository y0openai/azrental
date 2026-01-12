'use server';

import { getAdminAuth, getAdminDb, saveVerificationCode, verifyCode, isEmailVerified } from '@/lib/firebase/admin';
import { AuthResult, AuthErrorCode, AUTH_ERROR_MESSAGES } from '@/types/auth';
import { CustomerCreateInput } from '@/types/customer';

// 랜덤 6자리 인증 코드 생성
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 이메일 인증 코드 발송
export async function sendVerificationCode(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const code = generateVerificationCode();
    await saveVerificationCode(email, code);

    // TODO: 실제 이메일 발송 로직 구현 (SendGrid, Nodemailer 등)
    // 개발 환경에서는 콘솔에 코드 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Verification code for ${email}: ${code}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false, error: 'auth/unknown' };
  }
}

// 인증 코드 확인
export async function verifyEmailCode(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  return verifyCode(email, code);
}

// 이메일/비밀번호 회원가입
export async function signUpWithEmail(
  input: CustomerCreateInput
): Promise<AuthResult> {
  try {
    const auth = getAdminAuth();
    const db = getAdminDb();

    // 이메일 인증 확인
    const emailVerified = await isEmailVerified(input.email);
    if (!emailVerified) {
      return {
        success: false,
        error: 'auth/invalid-verification-code',
        message: '이메일 인증이 필요합니다.',
      };
    }

    // Firebase Auth에 사용자 생성
    const userRecord = await auth.createUser({
      email: input.email,
      password: input.password,
      displayName: input.displayName,
      emailVerified: true,
    });

    // Firestore에 고객 정보 저장
    const now = new Date();
    await db.collection('customers').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: input.email,
      displayName: input.displayName || null,
      phone: input.phone || null,
      age: input.age || null,
      gender: input.gender || null,
      provider: 'email',
      agreements: input.agreements,
      createdAt: now,
      updatedAt: now,
    });

    // 인증 코드 문서 삭제
    await db.collection('verificationCodes').doc(input.email).delete();

    return {
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        emailVerified: true,
        provider: 'email',
      },
    };
  } catch (error: unknown) {
    console.error('Error signing up:', error);
    const errorCode = (error as { code?: string })?.code as AuthErrorCode || 'auth/unknown';
    return {
      success: false,
      error: errorCode,
      message: AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES['auth/unknown'],
    };
  }
}

// 이메일/비밀번호 로그인
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const auth = getAdminAuth();
    const db = getAdminDb();

    // 이메일로 사용자 조회
    const userRecord = await auth.getUserByEmail(email);

    // 고객 정보 조회
    const customerDoc = await db.collection('customers').doc(userRecord.uid).get();
    if (!customerDoc.exists) {
      return {
        success: false,
        error: 'auth/user-not-found',
        message: AUTH_ERROR_MESSAGES['auth/user-not-found'],
      };
    }

    // Custom token 생성 (클라이언트에서 signInWithCustomToken 사용)
    const customToken = await auth.createCustomToken(userRecord.uid);

    return {
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        emailVerified: userRecord.emailVerified,
        provider: 'email',
      },
      message: customToken, // 클라이언트에서 토큰으로 로그인
    };
  } catch (error: unknown) {
    console.error('Error signing in:', error);
    const errorCode = (error as { code?: string })?.code as AuthErrorCode || 'auth/unknown';
    return {
      success: false,
      error: errorCode,
      message: AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES['auth/unknown'],
    };
  }
}

// 비밀번호 재설정 이메일 발송
export async function sendPasswordResetEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getAdminAuth();

    // 사용자 존재 여부 확인
    await auth.getUserByEmail(email);

    // 비밀번호 재설정 링크 생성
    const resetLink = await auth.generatePasswordResetLink(email);

    // TODO: 실제 이메일 발송 로직 구현
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Error sending password reset email:', error);
    const errorCode = (error as { code?: string })?.code;
    if (errorCode === 'auth/user-not-found') {
      // 보안상 사용자 존재 여부를 노출하지 않음
      return { success: true };
    }
    return { success: false, error: 'auth/unknown' };
  }
}

// 로그아웃 (세션 무효화)
export async function signOut(uid: string): Promise<{ success: boolean }> {
  try {
    const auth = getAdminAuth();
    await auth.revokeRefreshTokens(uid);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false };
  }
}
