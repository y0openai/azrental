'use client';

import { useState, useCallback, useMemo } from 'react';
import { createBooking } from '@/services/bookingService';
import type {
  CreateBookingInput,
  ServiceType,
  LocationType,
} from '@/types/booking';
import {
  BOOKING_MIN_ADVANCE_HOURS,
  BOOKING_MAX_ADVANCE_DAYS,
  BOOKING_MIN_DURATION,
  BOOKING_MAX_DURATION,
  CUSTOMER_NOTE_MAX_LENGTH,
  SERVICE_TYPES,
  LOCATION_TYPES,
} from '@/types/booking';

// ============================================
// 폼 상태 타입
// ============================================
interface BookingFormState {
  uncleId: string;
  services: ServiceType[];
  requestedDate: Date | null;
  requestedTime: string;
  duration: number;
  locationType: LocationType;
  locationAddress: string;
  preferredArea: string;
  customerNote: string;
}

interface BookingFormErrors {
  services?: string;
  requestedDate?: string;
  requestedTime?: string;
  duration?: string;
  locationType?: string;
  locationAddress?: string;
  preferredArea?: string;
  customerNote?: string;
  general?: string;
}

interface UseBookingFormOptions {
  uncleId: string;
  hourlyRate: number;
  onSuccess?: (bookingId: string) => void;
  onError?: (error: string) => void;
}

interface UseBookingFormReturn {
  // State
  formState: BookingFormState;
  errors: BookingFormErrors;
  isSubmitting: boolean;
  estimatedPrice: number;
  isValid: boolean;

  // Actions
  setServices: (services: ServiceType[]) => void;
  toggleService: (service: ServiceType) => void;
  setRequestedDate: (date: Date | null) => void;
  setRequestedTime: (time: string) => void;
  setDuration: (duration: number) => void;
  setLocationType: (type: LocationType) => void;
  setLocationAddress: (address: string) => void;
  setPreferredArea: (area: string) => void;
  setCustomerNote: (note: string) => void;

  // Validation
  validate: () => boolean;
  clearErrors: () => void;

  // Submit
  submit: () => Promise<boolean>;
  reset: () => void;
}

// ============================================
// 초기 상태
// ============================================
const createInitialState = (uncleId: string): BookingFormState => ({
  uncleId,
  services: [],
  requestedDate: null,
  requestedTime: '',
  duration: 1,
  locationType: 'cafe',
  locationAddress: '',
  preferredArea: '',
  customerNote: '',
});

// ============================================
// useBookingForm Hook
// ============================================
export function useBookingForm(options: UseBookingFormOptions): UseBookingFormReturn {
  const { uncleId, hourlyRate, onSuccess, onError } = options;

  const [formState, setFormState] = useState<BookingFormState>(() =>
    createInitialState(uncleId)
  );
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 예상 금액 계산
  const estimatedPrice = useMemo(() => {
    return hourlyRate * formState.duration;
  }, [hourlyRate, formState.duration]);

  // 개별 필드 업데이트 함수들
  const setServices = useCallback((services: ServiceType[]) => {
    setFormState(prev => ({ ...prev, services }));
    setErrors(prev => ({ ...prev, services: undefined }));
  }, []);

  const toggleService = useCallback((service: ServiceType) => {
    setFormState(prev => {
      const exists = prev.services.includes(service);
      const services = exists
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
    setErrors(prev => ({ ...prev, services: undefined }));
  }, []);

  const setRequestedDate = useCallback((date: Date | null) => {
    setFormState(prev => ({ ...prev, requestedDate: date }));
    setErrors(prev => ({ ...prev, requestedDate: undefined }));
  }, []);

  const setRequestedTime = useCallback((time: string) => {
    setFormState(prev => ({ ...prev, requestedTime: time }));
    setErrors(prev => ({ ...prev, requestedTime: undefined }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setFormState(prev => ({ ...prev, duration }));
    setErrors(prev => ({ ...prev, duration: undefined }));
  }, []);

  const setLocationType = useCallback((locationType: LocationType) => {
    setFormState(prev => ({ ...prev, locationType }));
    setErrors(prev => ({ ...prev, locationType: undefined }));
  }, []);

  const setLocationAddress = useCallback((locationAddress: string) => {
    setFormState(prev => ({ ...prev, locationAddress }));
    setErrors(prev => ({ ...prev, locationAddress: undefined }));
  }, []);

  const setPreferredArea = useCallback((preferredArea: string) => {
    setFormState(prev => ({ ...prev, preferredArea }));
    setErrors(prev => ({ ...prev, preferredArea: undefined }));
  }, []);

  const setCustomerNote = useCallback((customerNote: string) => {
    setFormState(prev => ({ ...prev, customerNote }));
    setErrors(prev => ({ ...prev, customerNote: undefined }));
  }, []);

  // 유효성 검사
  const validate = useCallback((): boolean => {
    const newErrors: BookingFormErrors = {};

    // 서비스 검사
    if (formState.services.length === 0) {
      newErrors.services = '최소 1개 이상의 서비스를 선택해주세요.';
    } else {
      const invalidServices = formState.services.filter(
        s => !SERVICE_TYPES.includes(s)
      );
      if (invalidServices.length > 0) {
        newErrors.services = '유효하지 않은 서비스가 포함되어 있습니다.';
      }
    }

    // 날짜 검사
    if (!formState.requestedDate) {
      newErrors.requestedDate = '희망 날짜를 선택해주세요.';
    } else {
      const now = new Date();
      const minDate = new Date(now.getTime() + BOOKING_MIN_ADVANCE_HOURS * 60 * 60 * 1000);
      const maxDate = new Date(now.getTime() + BOOKING_MAX_ADVANCE_DAYS * 24 * 60 * 60 * 1000);

      if (formState.requestedDate < minDate) {
        newErrors.requestedDate = `최소 ${BOOKING_MIN_ADVANCE_HOURS}시간 후부터 예약 가능합니다.`;
      } else if (formState.requestedDate > maxDate) {
        newErrors.requestedDate = `최대 ${BOOKING_MAX_ADVANCE_DAYS}일 이내로 예약해주세요.`;
      }
    }

    // 시간 검사
    if (!formState.requestedTime) {
      newErrors.requestedTime = '희망 시간을 선택해주세요.';
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formState.requestedTime)) {
      newErrors.requestedTime = '올바른 시간 형식이 아닙니다.';
    }

    // 이용 시간 검사
    if (formState.duration < BOOKING_MIN_DURATION) {
      newErrors.duration = `최소 ${BOOKING_MIN_DURATION}시간 이상 이용해야 합니다.`;
    } else if (formState.duration > BOOKING_MAX_DURATION) {
      newErrors.duration = `최대 ${BOOKING_MAX_DURATION}시간까지 이용 가능합니다.`;
    }

    // 장소 유형 검사
    if (!LOCATION_TYPES.includes(formState.locationType)) {
      newErrors.locationType = '올바른 장소 유형을 선택해주세요.';
    }

    // 고객 지정 장소인 경우 주소 필수
    if (formState.locationType === 'customer_location' && !formState.locationAddress.trim()) {
      newErrors.locationAddress = '상세 주소를 입력해주세요.';
    }

    // 선호 지역 검사
    if (!formState.preferredArea.trim()) {
      newErrors.preferredArea = '선호 지역을 입력해주세요.';
    }

    // 요청사항 글자 수 검사
    if (formState.customerNote.length > CUSTOMER_NOTE_MAX_LENGTH) {
      newErrors.customerNote = `요청사항은 ${CUSTOMER_NOTE_MAX_LENGTH}자 이내로 입력해주세요.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  // 에러 초기화
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // 폼 유효성 상태
  const isValid = useMemo(() => {
    return (
      formState.services.length > 0 &&
      formState.requestedDate !== null &&
      formState.requestedTime !== '' &&
      formState.duration >= BOOKING_MIN_DURATION &&
      formState.duration <= BOOKING_MAX_DURATION &&
      formState.preferredArea.trim() !== '' &&
      (formState.locationType !== 'customer_location' || formState.locationAddress.trim() !== '')
    );
  }, [formState]);

  // 제출
  const submit = useCallback(async (): Promise<boolean> => {
    if (!validate()) {
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const input: CreateBookingInput = {
        uncleId: formState.uncleId,
        services: formState.services,
        requestedDate: formState.requestedDate!,
        requestedTime: formState.requestedTime,
        duration: formState.duration,
        locationType: formState.locationType,
        locationAddress: formState.locationType === 'customer_location'
          ? formState.locationAddress
          : undefined,
        preferredArea: formState.preferredArea,
        customerNote: formState.customerNote,
      };

      const response = await createBooking(input);

      if (response.success && response.data) {
        onSuccess?.(response.data.bookingId);
        return true;
      } else {
        const errorMsg = response.error || '예약 요청에 실패했습니다.';
        setErrors({ general: errorMsg });
        onError?.(errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg = '예약 요청 중 오류가 발생했습니다.';
      setErrors({ general: errorMsg });
      onError?.(errorMsg);
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, validate, onSuccess, onError]);

  // 리셋
  const reset = useCallback(() => {
    setFormState(createInitialState(uncleId));
    setErrors({});
  }, [uncleId]);

  return {
    formState,
    errors,
    isSubmitting,
    estimatedPrice,
    isValid,
    setServices,
    toggleService,
    setRequestedDate,
    setRequestedTime,
    setDuration,
    setLocationType,
    setLocationAddress,
    setPreferredArea,
    setCustomerNote,
    validate,
    clearErrors,
    submit,
    reset,
  };
}

// ============================================
// 유틸리티: 가능한 날짜 범위 계산
// ============================================
export function getAvailableDateRange(): { minDate: Date; maxDate: Date } {
  const now = new Date();
  const minDate = new Date(now.getTime() + BOOKING_MIN_ADVANCE_HOURS * 60 * 60 * 1000);
  const maxDate = new Date(now.getTime() + BOOKING_MAX_ADVANCE_DAYS * 24 * 60 * 60 * 1000);

  // 시간을 00:00:00으로 설정 (날짜만 비교하기 위해)
  minDate.setHours(0, 0, 0, 0);
  maxDate.setHours(23, 59, 59, 999);

  return { minDate, maxDate };
}

// ============================================
// 유틸리티: 특정 날짜가 예약 가능한지 확인
// ============================================
export function isDateAvailable(date: Date): boolean {
  const { minDate, maxDate } = getAvailableDateRange();
  return date >= minDate && date <= maxDate;
}
