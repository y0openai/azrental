'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, ProgressBar } from '@/components/ui';
import { useUncleAuthContext } from '@/contexts/UncleAuthContext';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import {
  BasicInfoStep,
  ExpertiseStep,
  PricingStep,
  AvailabilityStep,
  VerificationStep,
  AgreementStep,
} from './steps';
import {
  UncleSignupData,
  DEFAULT_WEEKLY_AVAILABILITY,
} from '@/types/uncle';
import {
  basicInfoSchema,
  expertiseSchema,
  pricingSchema,
  availabilitySchema,
  verificationSchema,
  agreementSchema,
} from '@/lib/validations/uncle-auth';
import { ZodError } from 'zod';
import { ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react';

const STEPS = [
  { label: '기본 정보', description: '프로필 설정' },
  { label: '전문 분야', description: '경험 선택' },
  { label: '요금 설정', description: '시간당 요금' },
  { label: '활동 시간', description: '스케줄 설정' },
  { label: '본인 인증', description: '신분 확인' },
  { label: '약관 동의', description: '최종 확인' },
];

const STEP_SCHEMAS = [
  basicInfoSchema,
  expertiseSchema,
  pricingSchema,
  availabilitySchema,
  verificationSchema,
  agreementSchema,
];

const INITIAL_DATA: Partial<UncleSignupData> = {
  displayName: '',
  age: 0,
  bio: '',
  profileImages: [],
  mainImageIndex: 0,
  expertise: [],
  hourlyRate: 30000,
  shortIntro: '',
  availability: DEFAULT_WEEKLY_AVAILABILITY,
  ssn: '',
  phone: '',
  email: '',
  password: '',
  passwordConfirm: '',
  idCardImageUrl: '',
  agreedTerms: false,
  agreedPrivacy: false,
  agreedCodeOfConduct: false,
};

interface UncleSignupFormProps {
  onSuccess?: (uid: string) => void;
}

export const UncleSignupForm: React.FC<UncleSignupFormProps> = ({
  onSuccess,
}) => {
  const {
    saveDraft,
    loadDraft,
    apply,
    uploadProfileImage,
    uploadIdCard,
    removeProfileImage,
    setMainImage,
    loading,
    error: authError,
  } = useUncleAuthContext();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempUid, setTempUid] = useState<string | null>(null);

  const validateStep = useCallback(
    async (step: number, data: Partial<UncleSignupData>): Promise<boolean> => {
      try {
        const schema = STEP_SCHEMAS[step - 1];
        if (schema) {
          await schema.parseAsync(data);
        }
        setErrors({});
        return true;
      } catch (err) {
        if (err instanceof ZodError) {
          const newErrors: Record<string, string> = {};
          err.issues.forEach((e) => {
            const path = e.path.join('.');
            newErrors[path] = e.message;
          });
          setErrors(newErrors);
        }
        return false;
      }
    },
    []
  );

  const {
    currentStep,
    totalSteps,
    formData,
    isFirstStep,
    isLastStep,
    progress,
    next,
    prev,
    updateFormData,
    goToStep,
  } = useMultiStepForm<UncleSignupData>({
    totalSteps: 6,
    initialData: INITIAL_DATA as UncleSignupData,
    validateStep,
  });

  // Load draft on mount
  useEffect(() => {
    const loadSavedDraft = async () => {
      const email = localStorage.getItem('uncle_draft_email');
      if (email) {
        const result = await loadDraft(email);
        if (result.success && result.data) {
          updateFormData(result.data.draftData);
          if (result.data.currentStep > 1) {
            goToStep(result.data.currentStep);
          }
        }
      }
    };
    loadSavedDraft();
  }, [loadDraft, updateFormData, goToStep]);

  // Auto-save draft
  useEffect(() => {
    const saveDraftData = async () => {
      if (formData.email && currentStep > 1) {
        localStorage.setItem('uncle_draft_email', formData.email);
        await saveDraft(formData.email, currentStep, formData);
      }
    };

    const debounce = setTimeout(saveDraftData, 2000);
    return () => clearTimeout(debounce);
  }, [formData, currentStep, saveDraft]);

  const handleNext = async () => {
    const isValid = await validateStep(currentStep, formData);
    if (isValid) {
      next();
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateStep(currentStep, formData);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const result = await apply(formData as UncleSignupData);
      if (result.success && result.data) {
        localStorage.removeItem('uncle_draft_email');
        onSuccess?.(result.data.uid);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadImage = useCallback(
    async (file: File, index: number) => {
      // Generate temp UID if not exists
      let uid = tempUid;
      if (!uid) {
        uid = `temp_${Date.now()}`;
        setTempUid(uid);
      }

      const result = await uploadProfileImage(uid, file, index);
      if (result.success && result.data) {
        const newImages = [...(formData.profileImages || [])];
        newImages[index] = result.data.url;
        updateFormData({ profileImages: newImages });
      }
    },
    [tempUid, uploadProfileImage, formData.profileImages, updateFormData]
  );

  const handleRemoveImage = useCallback(
    async (index: number, imageUrl: string) => {
      if (!tempUid) return;

      const result = await removeProfileImage(tempUid, index, imageUrl);
      if (result.success) {
        const newImages = formData.profileImages?.filter((_, i) => i !== index) || [];
        let newMainIndex = formData.mainImageIndex || 0;
        if (newMainIndex === index) {
          newMainIndex = 0;
        } else if (newMainIndex > index) {
          newMainIndex--;
        }
        updateFormData({
          profileImages: newImages,
          mainImageIndex: newMainIndex,
        });
      }
    },
    [tempUid, removeProfileImage, formData.profileImages, formData.mainImageIndex, updateFormData]
  );

  const handleSetMainImage = useCallback(
    (index: number) => {
      updateFormData({ mainImageIndex: index });
      if (tempUid) {
        setMainImage(tempUid, index);
      }
    },
    [tempUid, setMainImage, updateFormData]
  );

  const handleUploadIdCard = useCallback(
    async (file: File) => {
      let uid = tempUid;
      if (!uid) {
        uid = `temp_${Date.now()}`;
        setTempUid(uid);
      }

      const result = await uploadIdCard(uid, file);
      if (result.success && result.data) {
        updateFormData({ idCardImageUrl: result.data.url });
      }
    },
    [tempUid, uploadIdCard, updateFormData]
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={formData}
            onChange={updateFormData}
            onUploadImage={handleUploadImage}
            onRemoveImage={handleRemoveImage}
            onSetMainImage={handleSetMainImage}
            errors={errors}
          />
        );
      case 2:
        return (
          <ExpertiseStep
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <PricingStep
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <AvailabilityStep
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      case 5:
        return (
          <VerificationStep
            data={formData}
            onChange={updateFormData}
            onUploadIdCard={handleUploadIdCard}
            errors={errors}
          />
        );
      case 6:
        return (
          <AgreementStep
            data={formData}
            onChange={updateFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <ProgressBar steps={STEPS} currentStep={currentStep} variant="uncle" />
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        {authError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {authError}
          </div>
        )}

        {renderStep()}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prev}
            disabled={isFirstStep || loading || isSubmitting}
          >
            <ArrowLeft size={18} className="mr-1" />
            이전
          </Button>

          {isLastStep ? (
            <Button
              type="button"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={loading || isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              <Send size={18} className="mr-1" />
              신청하기
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              다음
              <ArrowRight size={18} className="ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Auto-save indicator */}
      {formData.email && (
        <p className="text-center text-sm text-gray-400 mt-4">
          자동 저장 활성화됨
        </p>
      )}
    </div>
  );
};

UncleSignupForm.displayName = 'UncleSignupForm';
