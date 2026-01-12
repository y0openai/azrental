// Auth 관련 타입 정의
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  provider: 'email' | 'kakao' | 'naver';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  passwordConfirm: string;
  displayName?: string;
  phone?: string;
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: AuthErrorCode;
  message?: string;
}

export type AuthErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/operation-not-allowed'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/invalid-verification-code'
  | 'auth/code-expired'
  | 'auth/unknown';

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  'auth/invalid-email': '유효하지 않은 이메일 형식입니다.',
  'auth/user-disabled': '비활성화된 계정입니다.',
  'auth/user-not-found': '등록되지 않은 이메일입니다.',
  'auth/wrong-password': '비밀번호가 일치하지 않습니다.',
  'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
  'auth/weak-password': '비밀번호는 8자 이상이어야 합니다.',
  'auth/operation-not-allowed': '허용되지 않은 작업입니다.',
  'auth/too-many-requests': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
  'auth/network-request-failed': '네트워크 오류가 발생했습니다.',
  'auth/invalid-verification-code': '인증 코드가 올바르지 않습니다.',
  'auth/code-expired': '인증 코드가 만료되었습니다.',
  'auth/unknown': '알 수 없는 오류가 발생했습니다.',
};

// Validation constants
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;
export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_CODE_EXPIRY_MINUTES = 5;
