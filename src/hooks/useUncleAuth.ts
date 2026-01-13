'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Uncle,
  UncleSignupData,
  UncleStatus,
  ApplicationStatusData,
} from '@/types/uncle';
import {
  saveDraft,
  loadDraft,
  apply,
  uploadProfileImage,
  uploadIdCard,
  removeProfileImage,
  setMainImage,
  signIn as signInService,
  signOut as signOutService,
  checkStatus,
  sendPasswordReset,
  onUncleAuthStateChanged,
  UncleUser,
} from '@/services/uncleAuthService';
import { ActionResult } from '@/app/actions/uncle-auth';

// 아조씨 인증 상태
export interface UncleAuthState {
  uncle: UncleUser | null;
  loading: boolean;
  error: string | null;
  applicationStatus: UncleStatus | null;
}

export function useUncleAuth() {
  const [state, setState] = useState<UncleAuthState>({
    uncle: null,
    loading: true,
    error: null,
    applicationStatus: null,
  });

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onUncleAuthStateChanged((user) => {
      setState((prev) => ({
        ...prev,
        uncle: user,
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

  // 임시 저장
  const handleSaveDraft = useCallback(
    async (
      email: string,
      step: number,
      data: Partial<UncleSignupData>
    ): Promise<ActionResult<{ applicationId: string }>> => {
      setLoading(true);
      setError(null);

      const result = await saveDraft(email, step, data);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '임시 저장에 실패했습니다.');
      }

      return result;
    },
    [setError, setLoading]
  );

  // 임시 저장 불러오기
  const handleLoadDraft = useCallback(
    async (
      email: string
    ): Promise<ActionResult<{ draftData: Partial<UncleSignupData>; currentStep: number }>> => {
      setLoading(true);
      setError(null);

      const result = await loadDraft(email);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '임시 저장 불러오기에 실패했습니다.');
      }

      return result;
    },
    [setError, setLoading]
  );

  // 아조씨 신청
  const handleApply = useCallback(
    async (data: UncleSignupData): Promise<ActionResult<{ uid: string }>> => {
      setLoading(true);
      setError(null);

      const result = await apply(data);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '신청에 실패했습니다.');
      }

      return result;
    },
    [setError, setLoading]
  );

  // 프로필 이미지 업로드
  const handleUploadProfileImage = useCallback(
    async (
      uid: string,
      file: File,
      index: number
    ): Promise<ActionResult<{ url: string }>> => {
      setLoading(true);
      setError(null);

      const result = await uploadProfileImage(uid, file, index);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '이미지 업로드에 실패했습니다.');
      }

      return result;
    },
    [setError, setLoading]
  );

  // 신분증 이미지 업로드
  const handleUploadIdCard = useCallback(
    async (uid: string, file: File): Promise<ActionResult<{ url: string }>> => {
      setLoading(true);
      setError(null);

      const result = await uploadIdCard(uid, file);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '신분증 업로드에 실패했습니다.');
      }

      return result;
    },
    [setError, setLoading]
  );

  // 프로필 이미지 삭제
  const handleRemoveProfileImage = useCallback(
    async (uid: string, index: number, imageUrl: string): Promise<ActionResult> => {
      setLoading(true);
      setError(null);

      const result = await removeProfileImage(uid, index, imageUrl);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '이미지 삭제에 실패했습니다.');
      }

      return result;
    },
    [setError, setLoading]
  );

  // 메인 이미지 설정
  const handleSetMainImage = useCallback(
    async (uid: string, index: number): Promise<ActionResult> => {
      setLoading(true);
      setError(null);

      const result = await setMainImage(uid, index);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '메인 이미지 설정에 실패했습니다.');
      }

      return result;
    },
    [setError, setLoading]
  );

  // 로그인
  const handleSignIn = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean = false
    ): Promise<ActionResult<{ user: UncleUser }>> => {
      setLoading(true);
      setError(null);

      const result = await signInService(email, password, rememberMe);

      setLoading(false);
      if (!result.success) {
        setError(result.message || result.error || '로그인에 실패했습니다.');
      } else if (result.data) {
        setState((prev) => ({
          ...prev,
          uncle: result.data!.user,
          applicationStatus: result.data!.user.status,
        }));
      }

      return result;
    },
    [setError, setLoading]
  );

  // 로그아웃
  const handleSignOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await signOutService();

    setLoading(false);
    if (!result.success) {
      setError(result.error || '로그아웃에 실패했습니다.');
    } else {
      setState((prev) => ({
        ...prev,
        uncle: null,
        applicationStatus: null,
      }));
    }

    return result;
  }, [setError, setLoading]);

  // 신청 상태 확인
  const handleCheckStatus = useCallback(
    async (email: string): Promise<ActionResult<ApplicationStatusData>> => {
      setLoading(true);
      setError(null);

      const result = await checkStatus(email);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '상태 확인에 실패했습니다.');
      } else if (result.data) {
        setState((prev) => ({
          ...prev,
          applicationStatus: result.data!.status,
        }));
      }

      return result;
    },
    [setError, setLoading]
  );

  // 비밀번호 재설정 이메일 발송
  const handleSendPasswordReset = useCallback(
    async (email: string): Promise<ActionResult> => {
      setLoading(true);
      setError(null);

      const result = await sendPasswordReset(email);

      setLoading(false);
      if (!result.success) {
        setError(result.error || '비밀번호 재설정 이메일 발송에 실패했습니다.');
      }

      return result;
    },
    [setError, setLoading]
  );

  return {
    // State
    uncle: state.uncle,
    loading: state.loading,
    error: state.error,
    applicationStatus: state.applicationStatus,
    isAuthenticated: !!state.uncle,
    isApproved: state.uncle?.status === 'approved',

    // Actions
    saveDraft: handleSaveDraft,
    loadDraft: handleLoadDraft,
    apply: handleApply,
    uploadProfileImage: handleUploadProfileImage,
    uploadIdCard: handleUploadIdCard,
    removeProfileImage: handleRemoveProfileImage,
    setMainImage: handleSetMainImage,
    signIn: handleSignIn,
    signOut: handleSignOut,
    checkStatus: handleCheckStatus,
    sendPasswordReset: handleSendPasswordReset,
    setError,
  };
}
