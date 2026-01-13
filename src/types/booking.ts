// Booking 인터페이스 - 예약 시스템 타입 정의
import { ExpertiseTag, WeeklyAvailability, UncleStatus } from './uncle';

// Timestamp 타입: 클라이언트/서버 모두에서 사용 가능하도록 유연하게 정의
// 실제 Firestore에서 반환되는 Timestamp 객체 또는 직렬화된 형태 모두 허용
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
}

// ============================================
// 예약 상태
// ============================================
export type BookingStatus =
  | 'pending'      // 대기 (아조씨 응답 대기)
  | 'confirmed'    // 확정 (아조씨 수락)
  | 'in_progress'  // 진행 중
  | 'completed'    // 완료
  | 'cancelled';   // 취소됨

// 상태 레이블
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: '대기 중',
  confirmed: '예약 확정',
  in_progress: '진행 중',
  completed: '완료',
  cancelled: '취소됨',
};

// 상태 색상 (Tailwind 클래스용)
export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

// ============================================
// 장소 유형
// ============================================
export type LocationType = 'cafe' | 'park' | 'online' | 'customer_location';

export const LOCATION_LABELS: Record<LocationType, string> = {
  cafe: '카페',
  park: '공원',
  online: '온라인',
  customer_location: '고객 지정 장소',
};

export const LOCATION_ICONS: Record<LocationType, string> = {
  cafe: '☕',
  park: '🌳',
  online: '💻',
  customer_location: '📍',
};

// ============================================
// 서비스 종류 (12종)
// ============================================
export type ServiceType =
  | 'casual_talk'           // 잡담/대화
  | 'life_advice'           // 인생 조언
  | 'career_counseling'     // 직업 상담
  | 'job_interview_prep'    // 면접 준비
  | 'emotional_support'     // 감정 상담
  | 'dining_companion'      // 식사 동반
  | 'travel_companion'      // 여행 동반
  | 'hobby_sharing'         // 취미 공유
  | 'cultural_activities'   // 문화 생활
  | 'tech_help'             // 기술 도움
  | 'language_exchange'     // 언어 교환
  | 'other';                // 기타

export const SERVICE_LABELS: Record<ServiceType, string> = {
  casual_talk: '잡담/대화',
  life_advice: '인생 조언',
  career_counseling: '직업 상담',
  job_interview_prep: '면접 준비',
  emotional_support: '감정 상담',
  dining_companion: '식사 동반',
  travel_companion: '여행 동반',
  hobby_sharing: '취미 공유',
  cultural_activities: '문화 생활',
  tech_help: '기술 도움',
  language_exchange: '언어 교환',
  other: '기타',
};

export const SERVICE_ICONS: Record<ServiceType, string> = {
  casual_talk: '💬',
  life_advice: '🧭',
  career_counseling: '💼',
  job_interview_prep: '🎯',
  emotional_support: '🤗',
  dining_companion: '🍽️',
  travel_companion: '✈️',
  hobby_sharing: '🎨',
  cultural_activities: '🎭',
  tech_help: '🔧',
  language_exchange: '🗣️',
  other: '✨',
};

// ============================================
// 예약 인터페이스
// ============================================
export interface Booking {
  bookingId: string;           // 자동 생성 (PK)
  customerId: string;          // 고객 UID
  uncleId: string;             // 아조씨 UID

  // 아조씨 정보 스냅샷 (비정규화)
  uncleSnapshot: {
    displayName: string;
    profileImage: string;
    hourlyRate: number;
  };

  // 고객 정보 스냅샷
  customerSnapshot: {
    displayName: string | null;
    email: string;
  };

  // 예약 정보
  services: ServiceType[];       // 서비스 종류 (복수 선택)
  requestedDate: FirestoreTimestamp;      // 희망 날짜
  requestedTime: string;         // 희망 시간 (HH:mm)
  duration: number;              // 이용 시간 (1~4시간)
  locationType: LocationType;    // 장소 유형
  locationAddress?: string;      // 상세 주소 (customer_location인 경우)
  preferredArea: string;         // 선호 지역 (시/구)
  customerNote: string;          // 요청사항 (500자)

  // 금액 정보 (참고용)
  hourlyRate: number;            // 시간당 요금
  estimatedPrice: number;        // 예상 금액

  // 상태
  status: BookingStatus;
  cancelReason?: string;         // 취소 사유
  cancelledBy?: 'customer' | 'uncle';
  rejectReason?: string;         // 거절 사유 (아조씨)

  // 타임스탬프
  createdAt: FirestoreTimestamp;
  confirmedAt?: FirestoreTimestamp;       // 아조씨 수락 시간
  startedAt?: FirestoreTimestamp;         // 서비스 시작 시간
  completedAt?: FirestoreTimestamp;       // 서비스 완료 시간
  cancelledAt?: FirestoreTimestamp;
}

// ============================================
// 예약 생성 입력
// ============================================
export interface CreateBookingInput {
  uncleId: string;
  services: ServiceType[];
  requestedDate: Date;
  requestedTime: string;
  duration: number;
  locationType: LocationType;
  locationAddress?: string;
  preferredArea: string;
  customerNote: string;
}

// ============================================
// 예약 목록 아이템 (간략화)
// ============================================
export interface BookingListItem {
  bookingId: string;
  uncleId: string;
  customerId: string;
  uncleSnapshot: {
    displayName: string;
    profileImage: string;
  };
  customerSnapshot: {
    displayName: string | null;
    email: string;
  };
  services: ServiceType[];
  requestedDate: FirestoreTimestamp;
  requestedTime: string;
  duration: number;
  estimatedPrice: number;
  status: BookingStatus;
  createdAt: FirestoreTimestamp;
}

// ============================================
// 아조씨 목록 표시용 (read-only)
// ============================================
export interface UncleListItem {
  uid: string;
  displayName: string;
  shortIntro: string;
  profileImages: string[];
  mainImageIndex: number;
  expertise: ExpertiseTag[];
  hourlyRate: number;
  status: UncleStatus;  // 'approved'만 필터링
}

// 아조씨 상세 표시용
export interface UncleDetail extends UncleListItem {
  bio: string;
  availability: WeeklyAvailability;
  stats?: {
    totalBookings: number;
  };
}

// ============================================
// 계좌 정보 (오프라인 결제 안내용)
// ============================================
export interface UncleBankAccount {
  uid: string;                 // 아조씨 UID (PK)
  bankName: string;            // 은행명
  accountNumber: string;       // 계좌 번호 (마스킹)
  accountHolder: string;       // 예금주
  isVisible: boolean;          // 공개 여부
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// ============================================
// API 응답 타입
// ============================================
export interface GetUnclesResponse {
  success: boolean;
  data?: {
    uncles: UncleListItem[];
    hasMore: boolean;
    lastDocId: string | null;
  };
  error?: string;
}

export interface GetUncleByIdResponse {
  success: boolean;
  data?: {
    uncle: UncleDetail;
    bankAccount?: {
      bankName: string;
      accountNumber: string;
      accountHolder: string;
    };
  };
  error?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  data?: {
    bookingId: string;
    estimatedPrice: number;
    message: string;
  };
  error?: string;
}

export interface GetBookingsResponse {
  success: boolean;
  data?: {
    bookings: BookingListItem[];
    hasMore: boolean;
    lastDocId: string | null;
  };
  error?: string;
}

export interface GetBookingByIdResponse {
  success: boolean;
  data?: {
    booking: Booking;
  };
  error?: string;
}

export interface BookingActionResponse {
  success: boolean;
  data?: {
    bookingId: string;
    status: BookingStatus;
    message: string;
  };
  error?: string;
}

// ============================================
// 상수
// ============================================

// 예약 시간 제한
export const BOOKING_MIN_ADVANCE_HOURS = 24;  // 최소 24시간 전 예약
export const BOOKING_MAX_ADVANCE_DAYS = 30;   // 최대 30일 후까지

// 이용 시간 제한
export const BOOKING_MIN_DURATION = 1;        // 최소 1시간
export const BOOKING_MAX_DURATION = 4;        // 최대 4시간

// 취소 정책
export const FREE_CANCEL_HOURS = 24;          // 24시간 전 무료 취소

// 자동 완료
export const AUTO_COMPLETE_HOURS = 24;        // 24시간 후 자동 완료

// 요청사항 글자 제한
export const CUSTOMER_NOTE_MAX_LENGTH = 500;

// 시간 슬롯 (09:00 ~ 21:00)
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30',
  '21:00',
];

// 서비스 타입 배열 (유효성 검사용)
export const SERVICE_TYPES: ServiceType[] = [
  'casual_talk',
  'life_advice',
  'career_counseling',
  'job_interview_prep',
  'emotional_support',
  'dining_companion',
  'travel_companion',
  'hobby_sharing',
  'cultural_activities',
  'tech_help',
  'language_exchange',
  'other',
];

// 장소 타입 배열 (유효성 검사용)
export const LOCATION_TYPES: LocationType[] = [
  'cafe',
  'park',
  'online',
  'customer_location',
];
