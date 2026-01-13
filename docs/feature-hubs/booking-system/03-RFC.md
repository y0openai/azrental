# 03-RFC.md - 예약 시스템 (Booking System) 기술 설계

> **Request for Comments (Technical Design)**
> **작성일**: 2026-01-13
> **작성자**: Orchestrator Agent
> **상태**: Draft

---

## 1. 개요

### 1.1 목적
이 문서는 예약 시스템 (아조씨 목록 + 예약 요청/관리) 구현을 위한 기술적 설계를 정의합니다.

### 1.2 관련 문서
- PRD: `01-PRD.md`
- ORCHESTRATION: `04-ORCHESTRATION.md` (복잡도에 따라 작성)

### 1.3 범위
- 아조씨 목록 조회 (고객용)
- 아조씨 상세 프로필 페이지
- 예약 요청 (Multi-Step Form)
- 예약 수락/거절 (아조씨)
- 예약 관리 (목록/상세/취소/완료)
- 오프라인 결제 안내

---

## 2. 시스템 아키텍처

### 2.1 전체 구조
```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                       │
├────────────────┬────────────────┬───────────────────────────────┤
│  Uncle List    │  Booking Flow  │  Booking Management           │
│  /uncles       │  /booking/new  │  /bookings, /bookings/:id     │
└────────┬───────┴────────┬───────┴───────────────┬───────────────┘
         │                │                       │
         ▼                ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Firebase Cloud Functions                        │
├────────────────┬────────────────┬───────────────────────────────┤
│ getUncles      │ createBooking  │ acceptBooking, rejectBooking  │
│ getUncleById   │                │ cancelBooking, completeBooking│
└────────┬───────┴────────┬───────┴───────────────┬───────────────┘
         │                │                       │
         ▼                ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Firestore Database                          │
├────────────────┬────────────────┬───────────────────────────────┤
│ uncles         │ bookings       │ manner_reviews                │
│ (read)         │ (CRUD)         │ (후속 작업)                    │
└────────────────┴────────────────┴───────────────────────────────┘
```

### 2.2 컴포넌트 다이어그램
```
src/
├── app/
│   ├── (customer)/
│   │   ├── uncles/
│   │   │   ├── page.tsx                 # 아조씨 목록
│   │   │   └── [uncleId]/
│   │   │       └── page.tsx             # 아조씨 상세
│   │   ├── booking/
│   │   │   └── new/
│   │   │       └── page.tsx             # 예약 요청 폼
│   │   └── bookings/
│   │       ├── page.tsx                 # 내 예약 목록
│   │       └── [bookingId]/
│   │           └── page.tsx             # 예약 상세
│   └── (uncle)/
│       └── uncle/
│           └── bookings/
│               ├── page.tsx             # 받은 예약 요청 목록
│               └── [bookingId]/
│                   └── page.tsx         # 예약 상세 (수락/거절)
├── components/
│   ├── booking/
│   │   ├── UncleCard.tsx               # 아조씨 카드
│   │   ├── UncleGrid.tsx               # 아조씨 그리드
│   │   ├── UncleProfile.tsx            # 아조씨 상세 프로필
│   │   ├── BookingForm/
│   │   │   ├── ServiceStep.tsx         # Step 1: 서비스 선택
│   │   │   ├── DateTimeStep.tsx        # Step 2: 날짜/시간
│   │   │   ├── LocationStep.tsx        # Step 3: 장소
│   │   │   ├── NoteStep.tsx            # Step 4: 요청사항
│   │   │   └── ConfirmStep.tsx         # Step 5: 확인 및 요청
│   │   ├── BookingCard.tsx             # 예약 카드
│   │   ├── BookingDetail.tsx           # 예약 상세
│   │   ├── BookingStatus.tsx           # 상태 배지
│   │   └── PaymentGuide.tsx            # 오프라인 결제 안내
│   └── index.ts
├── hooks/
│   ├── useUncles.ts                    # 아조씨 목록/상세 조회
│   ├── useBooking.ts                   # 예약 CRUD
│   └── useBookingForm.ts               # 예약 폼 상태 관리
├── services/
│   ├── uncleService.ts                 # 아조씨 API 호출
│   └── bookingService.ts               # 예약 API 호출
├── types/
│   └── booking.ts                      # 예약 관련 타입
└── contexts/
    └── BookingContext.tsx              # 예약 폼 컨텍스트
```

---

## 3. 데이터 모델

### 3.1 신규 컬렉션: `bookings`
```typescript
// types/booking.ts

import { Timestamp } from 'firebase/firestore';

// 예약 상태
export type BookingStatus =
  | 'pending'      // 대기 (아조씨 응답 대기)
  | 'confirmed'    // 확정 (아조씨 수락)
  | 'in_progress'  // 진행 중
  | 'completed'    // 완료
  | 'cancelled';   // 취소됨

// 장소 유형
export type LocationType = 'cafe' | 'park' | 'online' | 'customer_location';

// 서비스 종류 (12종)
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

export const LOCATION_LABELS: Record<LocationType, string> = {
  cafe: '카페',
  park: '공원',
  online: '온라인',
  customer_location: '고객 지정 장소',
};

// 예약 인터페이스
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
  requestedDate: Timestamp;      // 희망 날짜
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
  createdAt: Timestamp;
  confirmedAt?: Timestamp;       // 아조씨 수락 시간
  startedAt?: Timestamp;         // 서비스 시작 시간
  completedAt?: Timestamp;       // 서비스 완료 시간
  cancelledAt?: Timestamp;
}

// 예약 생성 입력
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

// 예약 목록 아이템 (간략화)
export interface BookingListItem {
  bookingId: string;
  uncleSnapshot: {
    displayName: string;
    profileImage: string;
  };
  customerSnapshot: {
    displayName: string | null;
  };
  services: ServiceType[];
  requestedDate: Timestamp;
  requestedTime: string;
  duration: number;
  estimatedPrice: number;
  status: BookingStatus;
  createdAt: Timestamp;
}
```

### 3.2 기존 스키마 참조: `uncles`
```typescript
// 아조씨 목록 표시용 (read-only)
// 기존 src/types/uncle.ts의 Uncle 인터페이스 사용

// 목록 표시용 축약 타입
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

// 상세 표시용 타입
export interface UncleDetail extends UncleListItem {
  bio: string;
  availability: WeeklyAvailability;
  stats?: {
    totalBookings: number;
  };
}
```

### 3.3 신규 컬렉션: `uncle_bank_accounts` (선택적)
```typescript
// 오프라인 결제 안내용 계좌 정보
export interface UncleBankAccount {
  uid: string;                 // 아조씨 UID (PK)
  bankName: string;            // 은행명
  accountNumber: string;       // 계좌 번호 (마스킹)
  accountHolder: string;       // 예금주
  isVisible: boolean;          // 공개 여부
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 4. API 설계

### 4.1 Cloud Functions - 아조씨 목록/상세

#### `getUncles` - 승인된 아조씨 목록 조회
```typescript
// Request
{
  // 추후 필터/페이징 추가 가능
  limit?: number;      // 기본 20
  lastDocId?: string;  // 페이징용
}

// Response
{
  success: boolean;
  data: {
    uncles: UncleListItem[];
    hasMore: boolean;
    lastDocId: string | null;
  };
  error?: string;
}
```

#### `getUncleById` - 아조씨 상세 조회
```typescript
// Request
{
  uncleId: string;
}

// Response
{
  success: boolean;
  data: {
    uncle: UncleDetail;
    bankAccount?: {
      bankName: string;
      accountNumber: string;  // 마스킹
      accountHolder: string;
    };
  };
  error?: string;
}
```

### 4.2 Cloud Functions - 예약 관련

#### `createBooking` - 예약 요청 생성
```typescript
// Request (고객 인증 필요)
{
  uncleId: string;
  services: ServiceType[];
  requestedDate: string;       // ISO 8601
  requestedTime: string;       // HH:mm
  duration: number;            // 1-4
  locationType: LocationType;
  locationAddress?: string;
  preferredArea: string;
  customerNote: string;
}

// Response
{
  success: boolean;
  data: {
    bookingId: string;
    estimatedPrice: number;
    message: string;  // "예약 요청이 완료되었습니다. 아조씨의 수락을 기다려주세요."
  };
  error?: string;
}
```

#### `getBookings` - 예약 목록 조회
```typescript
// Request (인증 필요)
{
  role: 'customer' | 'uncle';  // 역할에 따라 필터링
  status?: BookingStatus[];    // 상태 필터 (선택)
  limit?: number;
  lastDocId?: string;
}

// Response
{
  success: boolean;
  data: {
    bookings: BookingListItem[];
    hasMore: boolean;
    lastDocId: string | null;
  };
  error?: string;
}
```

#### `getBookingById` - 예약 상세 조회
```typescript
// Request (인증 필요, 본인 예약만)
{
  bookingId: string;
}

// Response
{
  success: boolean;
  data: {
    booking: Booking;
  };
  error?: string;
}
```

#### `acceptBooking` - 예약 수락 (아조씨)
```typescript
// Request (아조씨 인증 필요)
{
  bookingId: string;
}

// Response
{
  success: boolean;
  data: {
    bookingId: string;
    status: 'confirmed';
    confirmedAt: string;
    message: string;  // "예약을 수락했습니다. 고객에게 알림이 전송됩니다."
  };
  error?: string;
}
```

#### `rejectBooking` - 예약 거절 (아조씨)
```typescript
// Request (아조씨 인증 필요)
{
  bookingId: string;
  reason?: string;  // 거절 사유 (선택)
}

// Response
{
  success: boolean;
  data: {
    bookingId: string;
    status: 'cancelled';
    message: string;
  };
  error?: string;
}
```

#### `cancelBooking` - 예약 취소 (고객/아조씨)
```typescript
// Request (인증 필요)
{
  bookingId: string;
  reason: string;
}

// Response
{
  success: boolean;
  data: {
    bookingId: string;
    status: 'cancelled';
    cancelledBy: 'customer' | 'uncle';
    message: string;
  };
  error?: string;
}
```

#### `completeBooking` - 서비스 완료 (아조씨)
```typescript
// Request (아조씨 인증 필요)
{
  bookingId: string;
}

// Response
{
  success: boolean;
  data: {
    bookingId: string;
    status: 'completed';
    completedAt: string;
    message: string;  // "서비스가 완료되었습니다. 고객에게 매너 평가 요청이 전송됩니다."
  };
  error?: string;
}
```

### 4.3 에러 코드
| 코드 | 설명 | 처리 방법 |
|------|------|----------|
| `UNCLE_NOT_FOUND` | 아조씨를 찾을 수 없음 | 목록으로 이동 |
| `UNCLE_NOT_AVAILABLE` | 아조씨가 해당 시간에 불가 | 다른 시간 선택 안내 |
| `BOOKING_NOT_FOUND` | 예약을 찾을 수 없음 | 목록으로 이동 |
| `BOOKING_ALREADY_CONFIRMED` | 이미 확정된 예약 | 상태 새로고침 |
| `BOOKING_CANNOT_CANCEL` | 취소 불가 상태 | 사유 안내 |
| `UNAUTHORIZED` | 인증 필요/권한 없음 | 로그인 페이지 이동 |
| `INVALID_DATE` | 유효하지 않은 날짜 | 유효한 날짜 선택 안내 |
| `INVALID_DURATION` | 유효하지 않은 시간 | 1-4시간 선택 안내 |

---

## 5. 보안

### 5.1 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 아조씨 컬렉션 (읽기: 승인된 아조씨만, 쓰기: 본인만)
    match /uncles/{uncleId} {
      // 승인된 아조씨 목록은 누구나 조회 가능
      allow read: if resource.data.status == 'approved' ||
                     request.auth.uid == uncleId;
      // 쓰기는 본인만
      allow write: if request.auth.uid == uncleId;
    }

    // 예약 컬렉션
    match /bookings/{bookingId} {
      // 읽기: 본인(고객/아조씨)만
      allow read: if request.auth != null &&
                    (request.auth.uid == resource.data.customerId ||
                     request.auth.uid == resource.data.uncleId);

      // 생성: 인증된 사용자만 (고객)
      allow create: if request.auth != null &&
                      request.auth.uid == request.resource.data.customerId &&
                      request.resource.data.status == 'pending';

      // 수정: 본인(고객/아조씨)만, 상태 전이 규칙 적용
      allow update: if request.auth != null &&
                      (request.auth.uid == resource.data.customerId ||
                       request.auth.uid == resource.data.uncleId);

      // 삭제 불가
      allow delete: if false;
    }

    // 계좌 정보
    match /uncle_bank_accounts/{uncleId} {
      // 읽기: 공개된 경우 누구나, 비공개면 본인만
      allow read: if resource.data.isVisible == true ||
                    request.auth.uid == uncleId;
      // 쓰기: 본인만
      allow write: if request.auth.uid == uncleId;
    }
  }
}
```

### 5.2 인증/인가 요구사항
- **아조씨 목록 조회**: 인증 불필요 (공개)
- **아조씨 상세 조회**: 인증 불필요 (공개)
- **예약 생성**: 고객 인증 필수
- **예약 수락/거절**: 아조씨 인증 필수 + 본인 예약만
- **예약 취소**: 인증 필수 + 본인 예약만
- **예약 완료**: 아조씨 인증 필수 + 본인 예약만

### 5.3 데이터 검증
```typescript
// 예약 생성 시 검증
const bookingValidation = {
  services: z.array(z.enum([...SERVICE_TYPES])).min(1),
  requestedDate: z.date().min(new Date()),  // 최소 내일
  requestedTime: z.string().regex(/^(0[9]|1[0-9]|2[0-1]):(00|30)$/),  // 09:00 ~ 21:00
  duration: z.number().min(1).max(4),
  locationType: z.enum(['cafe', 'park', 'online', 'customer_location']),
  locationAddress: z.string().max(200).optional(),
  preferredArea: z.string().min(2).max(50),
  customerNote: z.string().max(500),
};
```

---

## 6. Frontend 설계

### 6.1 라우트 구조
```
/(customer)
├── /uncles                    # 아조씨 목록
│   └── /[uncleId]             # 아조씨 상세
├── /booking/new               # 예약 요청 폼
│   └── ?uncleId={id}          # 쿼리스트링으로 아조씨 지정
└── /bookings                  # 내 예약 목록
    └── /[bookingId]           # 예약 상세

/(uncle)
└── /uncle/bookings            # 받은 예약 요청 목록
    └── /[bookingId]           # 예약 상세 (수락/거절)
```

### 6.2 컴포넌트 계층

#### 아조씨 목록 페이지
```
UnclesPage
├── Header (기존)
├── UncleGrid
│   └── UncleCard (반복)
│       ├── ProfileImage
│       ├── UncleInfo (이름, 소개, 요금)
│       └── ExpertiseTags
├── LoadMoreButton
└── BottomNav (기존)
```

#### 예약 요청 페이지
```
BookingNewPage
├── Header (기존)
├── ProgressBar (5 steps)
├── BookingForm
│   ├── ServiceStep
│   │   └── ServiceCard (12개, 복수 선택)
│   ├── DateTimeStep
│   │   ├── Calendar
│   │   ├── TimeSlots
│   │   └── DurationSelector
│   ├── LocationStep
│   │   ├── LocationTypeSelector
│   │   └── AddressInput (Kakao API)
│   ├── NoteStep
│   │   └── Textarea
│   └── ConfirmStep
│       ├── BookingSummary
│       ├── PriceDisplay
│       ├── PaymentGuide
│       └── SubmitButton
└── BottomNav (기존)
```

#### 예약 상세 페이지 (고객)
```
BookingDetailPage
├── Header (기존)
├── BookingDetail
│   ├── StatusBadge
│   ├── UncleInfo
│   ├── BookingInfo (서비스, 날짜, 시간, 장소)
│   ├── PriceInfo
│   ├── PaymentGuide (상태별 표시)
│   └── ActionButtons
│       ├── CancelButton (pending/confirmed)
│       └── CompleteButton (in_progress, 고객 확인)
└── BottomNav (기존)
```

### 6.3 상태 관리

#### `useUncles` Hook
```typescript
// hooks/useUncles.ts
interface UseUnclesReturn {
  // State
  uncles: UncleListItem[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;

  // Actions
  fetchUncles: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}
```

#### `useUncleDetail` Hook
```typescript
// hooks/useUncleDetail.ts
interface UseUncleDetailReturn {
  // State
  uncle: UncleDetail | null;
  bankAccount: UncleBankAccount | null;
  loading: boolean;
  error: Error | null;

  // Actions
  fetchUncle: (uncleId: string) => Promise<void>;
}
```

#### `useBooking` Hook
```typescript
// hooks/useBooking.ts
interface UseBookingReturn {
  // State
  bookings: BookingListItem[];
  currentBooking: Booking | null;
  loading: boolean;
  error: Error | null;
  hasMore: boolean;

  // Actions
  fetchBookings: (role: 'customer' | 'uncle', status?: BookingStatus[]) => Promise<void>;
  fetchBookingById: (bookingId: string) => Promise<void>;
  createBooking: (input: CreateBookingInput) => Promise<string>;
  acceptBooking: (bookingId: string) => Promise<void>;
  rejectBooking: (bookingId: string, reason?: string) => Promise<void>;
  cancelBooking: (bookingId: string, reason: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;
  loadMore: () => Promise<void>;
}
```

#### `useBookingForm` Hook (Multi-Step Form)
```typescript
// hooks/useBookingForm.ts
interface UseBookingFormReturn {
  // State
  currentStep: number;
  formData: Partial<CreateBookingInput>;
  uncle: UncleDetail | null;
  isSubmitting: boolean;
  error: Error | null;

  // Step Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Data
  updateFormData: (data: Partial<CreateBookingInput>) => void;
  setUncle: (uncle: UncleDetail) => void;

  // Submission
  submit: () => Promise<string>;  // returns bookingId

  // Computed
  estimatedPrice: number;
  isStepValid: boolean;
  canSubmit: boolean;
}
```

### 6.4 BookingContext (폼 상태 공유)
```typescript
// contexts/BookingContext.tsx
interface BookingContextValue {
  // 선택된 아조씨
  selectedUncle: UncleDetail | null;
  setSelectedUncle: (uncle: UncleDetail | null) => void;

  // 폼 데이터
  formData: Partial<CreateBookingInput>;
  updateFormData: (data: Partial<CreateBookingInput>) => void;
  resetFormData: () => void;

  // 스텝 관리
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // 계산값
  estimatedPrice: number;
}
```

### 6.5 Mock 인터페이스 (병렬 개발용)
```typescript
// __mocks__/bookingService.ts
export const mockBookingService = {
  getUncles: jest.fn().mockResolvedValue({
    uncles: [
      {
        uid: 'uncle-1',
        displayName: '김철수',
        shortIntro: '30년 직장생활 경험의 조언자',
        profileImages: ['/mock/uncle1.jpg'],
        mainImageIndex: 0,
        expertise: ['career_counseling', 'life_advice'],
        hourlyRate: 50000,
        status: 'approved',
      },
      // ... more mock uncles
    ],
    hasMore: false,
    lastDocId: null,
  }),

  createBooking: jest.fn().mockResolvedValue({
    bookingId: 'booking-123',
    estimatedPrice: 100000,
    message: '예약 요청이 완료되었습니다.',
  }),

  // ... more mock functions
};
```

---

## 7. 정책 설정 (Policy Config)

### 7.1 동적 설정
```typescript
// Firestore: policy_configs/booking
{
  // 예약 관련 설정
  minAdvanceHours: 24,          // 최소 예약 가능 시간 (시간 전)
  maxAdvanceDays: 30,           // 최대 예약 가능 기간 (일)
  minDuration: 1,               // 최소 이용 시간
  maxDuration: 4,               // 최대 이용 시간

  // 취소 정책
  freeCancelHours: 24,          // 무료 취소 가능 시간 (시간 전)

  // 자동 완료
  autoCompleteHours: 24,        // 고객 확인 없으면 자동 완료 (시간)

  // 알림 설정
  reminderHours: [24, 1],       // 리마인더 발송 시점 (시간 전)

  updatedAt: Timestamp
}
```

### 7.2 기본값
| 키 | 기본값 | 설명 |
|----|--------|------|
| `minAdvanceHours` | `24` | 최소 24시간 전 예약 |
| `maxAdvanceDays` | `30` | 최대 30일 후까지 예약 |
| `minDuration` | `1` | 최소 1시간 |
| `maxDuration` | `4` | 최대 4시간 |
| `freeCancelHours` | `24` | 24시간 전 무료 취소 |
| `autoCompleteHours` | `24` | 24시간 후 자동 완료 |

---

## 8. 테스트 전략

### 8.1 단위 테스트
- **Backend**: `bookingService.test.ts`
  - createBooking 검증 (입력 유효성)
  - 상태 전이 검증 (pending → confirmed → completed)
  - 권한 검증 (본인 예약만 조회/수정)

- **Frontend**:
  - `useBooking.test.ts` - API 호출 및 상태 관리
  - `useBookingForm.test.ts` - 폼 유효성 검사

### 8.2 통합 테스트
- `booking.integration.test.ts`
  - 예약 생성 → 수락 → 완료 플로우
  - 예약 생성 → 거절 플로우
  - 예약 생성 → 취소 플로우

### 8.3 E2E 테스트
- `booking.e2e.test.ts`
  - 아조씨 목록 → 상세 → 예약 폼 → 완료
  - 예약 수락/거절 (아조씨 관점)
  - 예약 취소/완료 (고객 관점)

---

## 9. 배포 계획

### 9.1 배포 순서
1. **Phase 1: 스키마 & 보안 규칙**
   - `bookings` 컬렉션 생성
   - Firestore Security Rules 배포
   - Policy configs 초기화

2. **Phase 2: Backend**
   - Cloud Functions 배포
   - API 테스트

3. **Phase 3: Frontend**
   - 아조씨 목록/상세 페이지
   - 예약 폼 페이지
   - 예약 목록/상세 페이지

4. **Phase 4: 통합 테스트**
   - E2E 테스트 실행
   - 버그 수정

### 9.2 롤백 계획
- Cloud Functions: 이전 버전으로 롤백
- Frontend: Vercel 이전 배포로 롤백
- Security Rules: 이전 규칙 재배포

---

## 10. 리스크 및 대안

| 리스크 | 영향 | 대안 |
|--------|------|------|
| 아조씨 가용 시간 충돌 | Medium | 실시간 가용 시간 체크, 중복 예약 방지 로직 |
| 무응답 아조씨 | High | 24시간 무응답 시 자동 취소, 고객 알림 |
| 악의적 예약 (노쇼) | Medium | 예약 이력 기반 제한, 매너온도 시스템 연계 |
| 결제 분쟁 | Low | 오프라인 결제이므로 서비스 외 분쟁, 안내 문구로 책임 제한 |
| Kakao 주소 API 장애 | Low | 직접 입력 fallback 제공 |

---

## 11. 오프라인 결제 안내 UI

### 11.1 안내 메시지 템플릿
```typescript
const PAYMENT_GUIDE = {
  // 예약 요청 완료 시
  onRequestComplete: {
    title: '예약 요청이 완료되었습니다',
    message: '아조씨의 수락을 기다려주세요.',
    paymentInfo: '결제는 서비스 당일 현장에서 직접 처리해주세요. (현금 또는 계좌이체)',
  },

  // 예약 확정 시
  onConfirmed: {
    title: '예약이 확정되었습니다',
    message: '아조씨가 예약을 수락했습니다.',
    paymentInfo: `
      💰 예상 금액: {estimatedPrice}원
      📍 결제 방법: 서비스 당일 현장에서 직접 결제
      • 현금 결제 가능
      • 계좌이체 가능 (아조씨 계좌 정보 확인)
    `,
  },

  // 서비스 완료 시
  onCompleted: {
    title: '서비스가 완료되었습니다',
    message: '이용해 주셔서 감사합니다.',
    action: '아조씨에 대한 매너 평가를 남겨주세요.',
  },
};
```

### 11.2 PaymentGuide 컴포넌트
```typescript
// components/booking/PaymentGuide.tsx
interface PaymentGuideProps {
  status: BookingStatus;
  estimatedPrice: number;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export function PaymentGuide({ status, estimatedPrice, bankAccount }: PaymentGuideProps) {
  // 상태에 따라 다른 안내 표시
  // pending: 수락 대기 안내
  // confirmed: 결제 안내 + 계좌 정보
  // in_progress: 결제 리마인더
  // completed: 감사 메시지
}
```

---

## 12. 알림 시스템 (FCM)

### 12.1 알림 트리거
| 이벤트 | 수신자 | 알림 내용 |
|--------|--------|----------|
| 예약 요청 | 아조씨 | "새로운 예약 요청이 있습니다" |
| 예약 수락 | 고객 | "예약이 확정되었습니다" |
| 예약 거절 | 고객 | "예약이 거절되었습니다" |
| 예약 취소 | 상대방 | "예약이 취소되었습니다" |
| 서비스 완료 | 고객 | "매너 평가를 남겨주세요" |
| 리마인더 (24h) | 양쪽 | "내일 예약이 있습니다" |
| 리마인더 (1h) | 양쪽 | "1시간 후 예약이 있습니다" |

### 12.2 알림 구현 (후속 작업)
```typescript
// functions/notifications/bookingNotifications.ts
// FCM 구현은 메시지 시스템과 함께 진행
```

---

*문서 버전: 1.0*
*최종 수정: 2026-01-13*
