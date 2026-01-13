'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  UncleDetail,
  ServiceType,
  LocationType,
  BookingListItem,
} from '@/types/booking';

// ============================================
// 예약 플로우 단계
// ============================================
export type BookingStep =
  | 'select_uncle'      // 1. 아조씨 선택
  | 'select_service'    // 2. 서비스 선택
  | 'select_datetime'   // 3. 날짜/시간 선택
  | 'select_location'   // 4. 장소 선택
  | 'enter_details'     // 5. 상세 정보 입력
  | 'confirm'           // 6. 확인 및 결제 안내
  | 'complete';         // 7. 완료

export const BOOKING_STEPS: BookingStep[] = [
  'select_uncle',
  'select_service',
  'select_datetime',
  'select_location',
  'enter_details',
  'confirm',
  'complete',
];

export const BOOKING_STEP_LABELS: Record<BookingStep, string> = {
  select_uncle: '아조씨 선택',
  select_service: '서비스 선택',
  select_datetime: '날짜/시간',
  select_location: '장소 선택',
  enter_details: '상세 정보',
  confirm: '확인',
  complete: '완료',
};

// ============================================
// 예약 데이터 (플로우 중 수집)
// ============================================
interface BookingData {
  // Step 1: 아조씨 정보
  selectedUncle: UncleDetail | null;

  // Step 2: 서비스
  services: ServiceType[];

  // Step 3: 날짜/시간
  requestedDate: Date | null;
  requestedTime: string;
  duration: number;

  // Step 4: 장소
  locationType: LocationType;
  locationAddress: string;

  // Step 5: 상세 정보
  preferredArea: string;
  customerNote: string;

  // Step 7: 완료 후
  bookingId: string | null;
}

// ============================================
// Context 타입
// ============================================
interface BookingContextValue {
  // 현재 상태
  currentStep: BookingStep;
  bookingData: BookingData;
  isLoading: boolean;

  // 진행률
  progress: number;
  stepIndex: number;

  // 네비게이션
  goToStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;

  // 데이터 업데이트
  setSelectedUncle: (uncle: UncleDetail | null) => void;
  setServices: (services: ServiceType[]) => void;
  toggleService: (service: ServiceType) => void;
  setDateTime: (date: Date | null, time: string) => void;
  setDuration: (duration: number) => void;
  setLocation: (type: LocationType, address?: string) => void;
  setDetails: (preferredArea: string, customerNote: string) => void;
  setBookingId: (id: string) => void;

  // 예상 금액
  estimatedPrice: number;

  // 리셋
  reset: () => void;

  // 최근 예약 (완료 후 표시용)
  recentBooking: BookingListItem | null;
  setRecentBooking: (booking: BookingListItem | null) => void;
}

// ============================================
// 초기 상태
// ============================================
const initialBookingData: BookingData = {
  selectedUncle: null,
  services: [],
  requestedDate: null,
  requestedTime: '',
  duration: 1,
  locationType: 'cafe',
  locationAddress: '',
  preferredArea: '',
  customerNote: '',
  bookingId: null,
};

// ============================================
// Context 생성
// ============================================
const BookingContext = createContext<BookingContextValue | null>(null);

// ============================================
// Provider 컴포넌트
// ============================================
interface BookingProviderProps {
  children: ReactNode;
  initialStep?: BookingStep;
  initialUncle?: UncleDetail;
}

export function BookingProvider({
  children,
  initialStep = 'select_uncle',
  initialUncle,
}: BookingProviderProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>(initialStep);
  const [bookingData, setBookingData] = useState<BookingData>(() => ({
    ...initialBookingData,
    selectedUncle: initialUncle || null,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [recentBooking, setRecentBooking] = useState<BookingListItem | null>(null);

  // 현재 단계 인덱스
  const stepIndex = useMemo(() => {
    return BOOKING_STEPS.indexOf(currentStep);
  }, [currentStep]);

  // 진행률 (0~100)
  const progress = useMemo(() => {
    return Math.round((stepIndex / (BOOKING_STEPS.length - 1)) * 100);
  }, [stepIndex]);

  // 예상 금액
  const estimatedPrice = useMemo(() => {
    if (!bookingData.selectedUncle) return 0;
    return bookingData.selectedUncle.hourlyRate * bookingData.duration;
  }, [bookingData.selectedUncle, bookingData.duration]);

  // 다음 단계 가능 여부
  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 'select_uncle':
        return bookingData.selectedUncle !== null;
      case 'select_service':
        return bookingData.services.length > 0;
      case 'select_datetime':
        return bookingData.requestedDate !== null && bookingData.requestedTime !== '';
      case 'select_location':
        return (
          bookingData.locationType !== 'customer_location' ||
          bookingData.locationAddress.trim() !== ''
        );
      case 'enter_details':
        return bookingData.preferredArea.trim() !== '';
      case 'confirm':
        return true;
      case 'complete':
        return false;
      default:
        return false;
    }
  }, [currentStep, bookingData]);

  // 이전 단계 가능 여부
  const canGoPrev = useMemo(() => {
    return stepIndex > 0 && currentStep !== 'complete';
  }, [stepIndex, currentStep]);

  // 특정 단계로 이동
  const goToStep = useCallback((step: BookingStep) => {
    setCurrentStep(step);
  }, []);

  // 다음 단계
  const nextStep = useCallback(() => {
    if (!canGoNext) return;
    const nextIndex = stepIndex + 1;
    if (nextIndex < BOOKING_STEPS.length) {
      setCurrentStep(BOOKING_STEPS[nextIndex]);
    }
  }, [canGoNext, stepIndex]);

  // 이전 단계
  const prevStep = useCallback(() => {
    if (!canGoPrev) return;
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(BOOKING_STEPS[prevIndex]);
    }
  }, [canGoPrev, stepIndex]);

  // 데이터 업데이트 함수들
  const setSelectedUncle = useCallback((uncle: UncleDetail | null) => {
    setBookingData(prev => ({ ...prev, selectedUncle: uncle }));
  }, []);

  const setServices = useCallback((services: ServiceType[]) => {
    setBookingData(prev => ({ ...prev, services }));
  }, []);

  const toggleService = useCallback((service: ServiceType) => {
    setBookingData(prev => {
      const exists = prev.services.includes(service);
      const services = exists
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  }, []);

  const setDateTime = useCallback((date: Date | null, time: string) => {
    setBookingData(prev => ({
      ...prev,
      requestedDate: date,
      requestedTime: time,
    }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setBookingData(prev => ({ ...prev, duration }));
  }, []);

  const setLocation = useCallback((type: LocationType, address?: string) => {
    setBookingData(prev => ({
      ...prev,
      locationType: type,
      locationAddress: address || '',
    }));
  }, []);

  const setDetails = useCallback((preferredArea: string, customerNote: string) => {
    setBookingData(prev => ({
      ...prev,
      preferredArea,
      customerNote,
    }));
  }, []);

  const setBookingId = useCallback((id: string) => {
    setBookingData(prev => ({ ...prev, bookingId: id }));
  }, []);

  // 리셋
  const reset = useCallback(() => {
    setCurrentStep('select_uncle');
    setBookingData(initialBookingData);
    setRecentBooking(null);
  }, []);

  const value: BookingContextValue = {
    currentStep,
    bookingData,
    isLoading,
    progress,
    stepIndex,
    goToStep,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    setSelectedUncle,
    setServices,
    toggleService,
    setDateTime,
    setDuration,
    setLocation,
    setDetails,
    setBookingId,
    estimatedPrice,
    reset,
    recentBooking,
    setRecentBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

// ============================================
// Hook
// ============================================
export function useBookingContext(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
}

// ============================================
// 옵셔널 Hook (Provider 외부에서도 사용 가능)
// ============================================
export function useOptionalBookingContext(): BookingContextValue | null {
  return useContext(BookingContext);
}
