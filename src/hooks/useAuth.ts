'use client';

import { useState, useEffect, useCallback } from 'react';
import { AuthState, AuthUser, AuthResult } from '@/types/auth';
import {
  signInWithEmailClient,
  signInWithToken,
  signOutClient,
  onAuthStateChangedListener,
} from '@/services/authService';
import {
  sendVerificationCode,
  verifyEmailCode,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordResetEmail,
} from '@/app/actions/auth';
import { CustomerCreateInput } from '@/types/customer';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setState((prev) => ({
        ...prev,
        user,
        loading: false,
      }));
    });

    return () => unsubscribe();
  }, []);

  // 에러 설정
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  // 로딩 설정
  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  // 이메일 인증 코드 발송
  const sendVerification = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    const result = await sendVerificationCode(email);

    setLoading(false);
    if (!result.success) {
      setError(result.error || '인증 코드 발송에 실패했습니다.');
    }

    return result;
  }, [setError, setLoading]);

  // 인증 코드 확인
  const verifyCode = useCallback(async (email: string, code: string) => {
    setLoading(true);
    setError(null);

    const result = await verifyEmailCode(email, code);

    setLoading(false);
    if (!result.success) {
      setError(result.error || '인증 코드가 올바르지 않습니다.');
    }

    return result;
  }, [setError, setLoading]);

  // 회원가입
  const signUp = useCallback(async (input: CustomerCreateInput): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    const result = await signUpWithEmail(input);

    if (result.success && result.message) {
      // 서버에서 받은 custom token으로 클라이언트 로그인
      await signInWithToken(result.message);
    }

    setLoading(false);
    if (!result.success) {
      setError(result.message || '회원가입에 실패했습니다.');
    }

    return result;
  }, [setError, setLoading]);

  // 로그인
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    setError(null);

    // 서버 액션으로 로그인 (custom token 생성)
    const result = await signInWithEmail(email, password);

    if (result.success && result.message) {
      // custom token으로 클라이언트 로그인
      const tokenResult = await signInWithToken(result.message);
      setLoading(false);
      return tokenResult;
    }

    // 서버 액션 실패 시 클라이언트 직접 로그인 시도
    const clientResult = await signInWithEmailClient(email, password);

    setLoading(false);
    if (!clientResult.success) {
      setError(clientResult.message || '로그인에 실패했습니다.');
    }

    return clientResult;
  }, [setError, setLoading]);

  // 로그아웃
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await signOutClient();

    setLoading(false);
    if (!result.success) {
      setError(result.error || '로그아웃에 실패했습니다.');
    }

    return result;
  }, [setError, setLoading]);

  // 비밀번호 재설정 이메일 발송
  const sendPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    const result = await sendPasswordResetEmail(email);

    setLoading(false);
    if (!result.success) {
      setError(result.error || '비밀번호 재설정 이메일 발송에 실패했습니다.');
    }

    return result;
  }, [setError, setLoading]);

  return {
    // State
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,

    // Actions
    sendVerification,
    verifyCode,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
    setError,
  };
}
