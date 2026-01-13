'use client';

import { useState, useCallback, useMemo } from 'react';

export interface UseMultiStepFormOptions<T> {
  totalSteps: number;
  initialData?: Partial<T>;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  validateStep?: (step: number, data: Partial<T>) => boolean | Promise<boolean>;
}

export interface UseMultiStepFormReturn<T> {
  // 현재 상태
  currentStep: number;
  totalSteps: number;
  formData: Partial<T>;

  // 단계 정보
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number; // 0-100

  // 네비게이션
  next: () => Promise<boolean>;
  prev: () => void;
  goToStep: (step: number) => void;

  // 데이터 관리
  updateFormData: (data: Partial<T>) => void;
  updateStepData: (step: number, data: Partial<T>) => void;
  resetForm: () => void;

  // 유틸리티
  getStepData: (step: number) => Partial<T>;
  isStepCompleted: (step: number) => boolean;
  completedSteps: number[];
}

export function useMultiStepForm<T extends Record<string, unknown>>({
  totalSteps,
  initialData = {},
  initialStep = 1,
  onStepChange,
  validateStep,
}: UseMultiStepFormOptions<T>): UseMultiStepFormReturn<T> {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<Partial<T>>(initialData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // 단계 정보
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progress = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  // 다음 단계로
  const next = useCallback(async (): Promise<boolean> => {
    if (currentStep >= totalSteps) return false;

    // 유효성 검사
    if (validateStep) {
      const isValid = await validateStep(currentStep, formData);
      if (!isValid) return false;
    }

    // 현재 단계를 완료로 표시
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep];
      }
      return prev;
    });

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    onStepChange?.(nextStep);
    return true;
  }, [currentStep, totalSteps, formData, validateStep, onStepChange]);

  // 이전 단계로
  const prev = useCallback(() => {
    if (currentStep <= 1) return;

    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    onStepChange?.(prevStep);
  }, [currentStep, onStepChange]);

  // 특정 단계로 이동
  const goToStep = useCallback(
    (step: number) => {
      if (step < 1 || step > totalSteps) return;

      // 완료된 단계거나 바로 다음 단계만 이동 가능
      const maxAccessibleStep = Math.max(...completedSteps, 0) + 1;
      if (step > maxAccessibleStep) return;

      setCurrentStep(step);
      onStepChange?.(step);
    },
    [totalSteps, completedSteps, onStepChange]
  );

  // 폼 데이터 업데이트
  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  // 특정 단계 데이터 업데이트
  const updateStepData = useCallback((step: number, data: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setCurrentStep(initialStep);
    setFormData(initialData);
    setCompletedSteps([]);
  }, [initialStep, initialData]);

  // 단계별 데이터 가져오기 (필요에 따라 커스터마이즈)
  const getStepData = useCallback(
    (step: number): Partial<T> => {
      // 기본적으로 전체 formData 반환
      // 필요 시 단계별 필드 매핑 로직 추가 가능
      return formData;
    },
    [formData]
  );

  // 단계 완료 여부 확인
  const isStepCompleted = useCallback(
    (step: number): boolean => {
      return completedSteps.includes(step);
    },
    [completedSteps]
  );

  return {
    // 현재 상태
    currentStep,
    totalSteps,
    formData,

    // 단계 정보
    isFirstStep,
    isLastStep,
    progress,

    // 네비게이션
    next,
    prev,
    goToStep,

    // 데이터 관리
    updateFormData,
    updateStepData,
    resetForm,

    // 유틸리티
    getStepData,
    isStepCompleted,
    completedSteps,
  };
}
