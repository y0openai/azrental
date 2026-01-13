// Uncle 인터페이스 - 아조씨 데이터 타입 정의
import { Timestamp } from 'firebase/firestore';

// 아조씨 상태 타입
export type UncleStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';

// 전문성 태그 타입
export type ExpertiseTag =
  | 'career_counseling'     // 직업 상담
  | 'emotional_support'     // 감정 상담
  | 'travel_companion'      // 여행 동반
  | 'job_mentoring'         // 취업 멘토
  | 'dining_companion'      // 식사 동반
  | 'cultural_activities'   // 문화 생활
  | 'life_advice'           // 인생 조언
  | 'hobby_sharing'         // 취미 공유
  | 'tech_help'             // 기술 도움
  | 'language_exchange';    // 언어 교환

// 전문성 태그 한글 매핑 (alias for backwards compatibility)
export const EXPERTISE_TAG_LABELS: Record<ExpertiseTag, string> = {
  career_counseling: '직업 상담',
  emotional_support: '감정 상담',
  travel_companion: '여행 동반',
  job_mentoring: '취업 멘토',
  dining_companion: '식사 동반',
  cultural_activities: '문화 생활',
  life_advice: '인생 조언',
  hobby_sharing: '취미 공유',
  tech_help: '기술 도움',
  language_exchange: '언어 교환',
};

export const EXPERTISE_LABELS: Record<ExpertiseTag, string> = {
  career_counseling: '직업 상담',
  emotional_support: '감정 상담',
  travel_companion: '여행 동반',
  job_mentoring: '취업 멘토',
  dining_companion: '식사 동반',
  cultural_activities: '문화 생활',
  life_advice: '인생 조언',
  hobby_sharing: '취미 공유',
  tech_help: '기술 도움',
  language_exchange: '언어 교환',
};

// 요일 타입
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

// 요일 한글 매핑
export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
};

// 시간대 타입
export interface TimeSlot {
  morning: boolean;   // 오전
  afternoon: boolean; // 오후
  evening: boolean;   // 저녁
}

// 주간 가용 시간 타입
export type WeeklyAvailability = Record<DayOfWeek, TimeSlot>;

// 신원 확인 정보
export interface UncleVerification {
  idCardImageUrl?: string;  // 신분증 이미지 (심사 후 삭제)
  ssnHash: string;          // 주민번호 해시
  verifiedAt?: Timestamp;   // 검증 완료 시간
}

// 아조씨 통계
export interface UncleStats {
  totalBookings: number;
  rating: number;
  reviewCount: number;
}

// Uncle 메인 인터페이스
export interface Uncle {
  uid: string;              // Firebase Auth UID
  email: string;            // 이메일
  displayName: string;      // 표시 이름
  phone: string;            // 전화번호 (010-XXXX-XXXX)
  age: number;              // 만 나이 (40+)

  // 프로필 정보
  bio: string;              // 자기소개 (100자 이상)
  shortIntro: string;       // 짧은 소개문 (고객에게 표시)
  profileImages: string[];  // 프로필 이미지 URLs (최대 5장)
  mainImageIndex: number;   // 메인 이미지 인덱스

  // 전문성 및 서비스
  expertise: ExpertiseTag[]; // 전문성 태그 (최소 1개)
  hourlyRate: number;        // 시간당 요금 (원)

  // 가용 일정
  availability: WeeklyAvailability;

  // 신원 확인 (민감 정보)
  verification: UncleVerification;

  // 동의 내역
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  agreedCodeOfConduct: boolean;

  // 상태
  status: UncleStatus;
  rejectionReason?: string;   // 반려 사유

  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedAt?: Timestamp;
  lastLoginAt?: Timestamp;

  // 통계 (활동 후)
  stats?: UncleStats;
}

// 아조씨 신청서 상태
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

// 아조씨 신청서 인터페이스
export interface UncleApplication {
  applicationId: string;    // 자동 생성 ID (PK)
  email: string;            // 이메일 (신청자 식별)

  // 임시 저장 데이터
  draftData?: Partial<UncleSignupData>;
  currentStep: number;      // 현재 단계 (1-6)

  // 심사 정보
  status: ApplicationStatus;
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;      // 관리자 UID
  rejectionReason?: string;

  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Step 1: 기본 정보 입력 데이터
export interface BasicInfoData {
  displayName: string;
  age: number;
  bio: string;
  profileImages: string[];
  mainImageIndex: number;
}

// Step 2: 전문성 선택 데이터
export interface ExpertiseData {
  expertise: ExpertiseTag[];
}

// Step 3: 요금 설정 데이터
export interface PricingData {
  hourlyRate: number;
  shortIntro: string;
}

// Step 4: 일정 설정 데이터
export interface AvailabilityData {
  availability: WeeklyAvailability;
}

// Step 5: 신원 확인 데이터
export interface VerificationData {
  ssn: string;          // 주민등록번호 (서버에서 해싱)
  phone: string;
  email: string;
  password: string;
  passwordConfirm: string;
  idCardImageUrl: string;
}

// Step 6: 동의 데이터
export interface AgreementData {
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  agreedCodeOfConduct: boolean;
}

// 전체 회원가입 데이터
export interface UncleSignupData extends
  BasicInfoData,
  ExpertiseData,
  PricingData,
  AvailabilityData,
  VerificationData,
  AgreementData {
  [key: string]: unknown; // For generic form handling
}

// 신청 상태 데이터
export interface ApplicationStatusData {
  status: UncleStatus;
  submittedAt?: Date;
  rejectionReason?: string;
}

// 아조씨 로그인 입력
export interface UncleLoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

// 기본 가용 시간 (모두 false)
export const DEFAULT_TIME_SLOT: TimeSlot = {
  morning: false,
  afternoon: false,
  evening: false,
};

// 기본 주간 가용 시간
export const DEFAULT_AVAILABILITY: WeeklyAvailability = {
  mon: { ...DEFAULT_TIME_SLOT },
  tue: { ...DEFAULT_TIME_SLOT },
  wed: { ...DEFAULT_TIME_SLOT },
  thu: { ...DEFAULT_TIME_SLOT },
  fri: { ...DEFAULT_TIME_SLOT },
  sat: { ...DEFAULT_TIME_SLOT },
  sun: { ...DEFAULT_TIME_SLOT },
};

// Alias for backwards compatibility
export const DEFAULT_WEEKLY_AVAILABILITY = DEFAULT_AVAILABILITY;

// 요금 범위 상수
export const HOURLY_RATE_MIN = 20000;
export const HOURLY_RATE_MAX = 100000;
export const HOURLY_RATE_DEFAULT = 50000;

// 나이 제한 상수
export const UNCLE_MIN_AGE = 40;

// 프로필 이미지 제한
export const MAX_PROFILE_IMAGES = 5;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// 자기소개 최소 글자수
export const MIN_BIO_LENGTH = 100;
