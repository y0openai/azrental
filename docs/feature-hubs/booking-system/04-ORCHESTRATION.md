# 04-ORCHESTRATION.md - 예약 시스템 Task 분배

> **Agent Task Distribution Plan**
> **작성일**: 2026-01-13
> **작성자**: Orchestrator Agent
> **모드**: Wave Orchestration (복잡도 5.8)

---

## 1. 복잡도 분석

### 1.1 복잡도 점수 계산
```
영향 모듈 수: 4 × 0.3 = 1.2
  (uncleService, bookingService, hooks×3, contexts×1)
예상 일수: 5 × 0.2 = 1.0
  (아조씨목록 1일 + 예약폼 2일 + 예약관리 2일)
신규 API 수: 8 × 0.25 = 2.0
  (getUncles, getUncleById, createBooking, getBookings, getBookingById, acceptBooking, rejectBooking, cancelBooking, completeBooking)
UI 화면 수: 10 × 0.15 = 1.5
  (UncleCard, UncleGrid, UncleProfile, BookingForm 5steps, BookingCard, BookingDetail, BookingStatus, PaymentGuide)
외부 연동: 1 × 0.1 = 0.1
  (Kakao 주소 API)
─────────────────────────
총 복잡도 점수: 5.8
```

### 1.2 에이전트 할당
| 복잡도 점수 | 에이전트 수 | 이 기능 |
|------------|------------|--------|
| 1.0-2.0 | 1명 (Single) | |
| 2.1-3.5 | 2-3명 | |
| 3.6-5.0 | 3-4명 | |
| 5.1+ | 5-8명 | ✅ |

**결정**: 5명 에이전트 투입 (Wave 구조)
- **Wave 1**: Foundation (Backend + Types)
- **Wave 2**: Core Logic (Hooks + Services)
- **Wave 3**: UI Components
- **Wave 4**: Pages & Integration
- **Wave 5**: QA & Polish

---

## 2. Wave 분배

### Wave 1: Foundation (Backend + Types)

**목표**: 데이터 스키마, API, 보안 규칙 구축

#### Task 1.1: 타입 정의
- **설명**: booking.ts 타입 정의 파일 생성
- **산출물**: `src/types/booking.ts`
- **예상 시간**: 30분
- **의존성**: 없음

#### Task 1.2: Cloud Functions - Uncle APIs
- **설명**: getUncles, getUncleById 구현
- **산출물**: `functions/src/uncles.ts`
- **예상 시간**: 2시간
- **의존성**: Task 1.1

#### Task 1.3: Cloud Functions - Booking APIs
- **설명**: createBooking, getBookings, getBookingById, acceptBooking, rejectBooking, cancelBooking, completeBooking
- **산출물**: `functions/src/bookings.ts`
- **예상 시간**: 4시간
- **의존성**: Task 1.1

#### Task 1.4: Security Rules
- **설명**: bookings, uncle_bank_accounts 규칙 추가
- **산출물**: `firestore.rules` 업데이트
- **예상 시간**: 1시간
- **의존성**: Task 1.1

#### Task 1.5: Backend 단위 테스트
- **설명**: Functions 단위 테스트
- **산출물**: `functions/__tests__/bookings.test.ts`
- **예상 시간**: 2시간
- **의존성**: Task 1.2, 1.3

**Wave 1 산출물 체크리스트**:
- [ ] `src/types/booking.ts` 생성
- [ ] `functions/src/uncles.ts` 배포
- [ ] `functions/src/bookings.ts` 배포
- [ ] `firestore.rules` 배포
- [ ] Backend 테스트 통과

---

### Wave 2: Core Logic (Services + Hooks)

**목표**: 프론트엔드 서비스 레이어와 상태 관리

#### Task 2.1: Uncle Service
- **설명**: 아조씨 API 호출 서비스
- **산출물**: `src/services/uncleService.ts`
- **예상 시간**: 1시간
- **의존성**: Wave 1 완료

#### Task 2.2: Booking Service
- **설명**: 예약 API 호출 서비스
- **산출물**: `src/services/bookingService.ts`
- **예상 시간**: 2시간
- **의존성**: Wave 1 완료

#### Task 2.3: useUncles Hook
- **설명**: 아조씨 목록/상세 조회 훅
- **산출물**: `src/hooks/useUncles.ts`
- **예상 시간**: 1시간
- **의존성**: Task 2.1

#### Task 2.4: useBooking Hook
- **설명**: 예약 CRUD 훅
- **산출물**: `src/hooks/useBooking.ts`
- **예상 시간**: 2시간
- **의존성**: Task 2.2

#### Task 2.5: useBookingForm Hook
- **설명**: Multi-step 폼 상태 관리 훅
- **산출물**: `src/hooks/useBookingForm.ts`
- **예상 시간**: 2시간
- **의존성**: Task 2.2

#### Task 2.6: BookingContext
- **설명**: 예약 폼 컨텍스트 (상태 공유)
- **산출물**: `src/contexts/BookingContext.tsx`
- **예상 시간**: 1시간
- **의존성**: Task 2.5

#### Task 2.7: Hooks 단위 테스트
- **설명**: 훅 테스트 (msw mock 사용)
- **산출물**: `src/__tests__/hooks/useBooking.test.ts`
- **예상 시간**: 2시간
- **의존성**: Task 2.3, 2.4, 2.5

**Wave 2 산출물 체크리스트**:
- [ ] `src/services/uncleService.ts` 생성
- [ ] `src/services/bookingService.ts` 생성
- [ ] `src/hooks/useUncles.ts` 생성
- [ ] `src/hooks/useBooking.ts` 생성
- [ ] `src/hooks/useBookingForm.ts` 생성
- [ ] `src/contexts/BookingContext.tsx` 생성
- [ ] Hooks 테스트 통과

---

### Wave 3: UI Components

**목표**: 재사용 가능한 UI 컴포넌트 구축

#### Task 3.1: Uncle Components
- **설명**: UncleCard, UncleGrid, UncleProfile
- **산출물**: `src/components/booking/Uncle*.tsx`
- **예상 시간**: 3시간
- **의존성**: Wave 2 완료

#### Task 3.2: Booking Form Steps
- **설명**: ServiceStep, DateTimeStep, LocationStep, NoteStep, ConfirmStep
- **산출물**: `src/components/booking/BookingForm/*.tsx`
- **예상 시간**: 4시간
- **의존성**: Wave 2 완료

#### Task 3.3: Booking Management Components
- **설명**: BookingCard, BookingDetail, BookingStatus, PaymentGuide
- **산출물**: `src/components/booking/*.tsx`
- **예상 시간**: 3시간
- **의존성**: Wave 2 완료

#### Task 3.4: 컴포넌트 스토리북 (선택)
- **설명**: 컴포넌트 문서화
- **산출물**: `src/components/booking/*.stories.tsx`
- **예상 시간**: 2시간
- **의존성**: Task 3.1, 3.2, 3.3

**Wave 3 산출물 체크리스트**:
- [ ] `src/components/booking/UncleCard.tsx` 생성
- [ ] `src/components/booking/UncleGrid.tsx` 생성
- [ ] `src/components/booking/UncleProfile.tsx` 생성
- [ ] `src/components/booking/BookingForm/` 디렉토리 (5 steps)
- [ ] `src/components/booking/BookingCard.tsx` 생성
- [ ] `src/components/booking/BookingDetail.tsx` 생성
- [ ] `src/components/booking/BookingStatus.tsx` 생성
- [ ] `src/components/booking/PaymentGuide.tsx` 생성

---

### Wave 4: Pages & Integration

**목표**: 페이지 통합 및 라우팅

#### Task 4.1: 아조씨 목록 페이지
- **설명**: /uncles 라우트
- **산출물**: `src/app/(customer)/uncles/page.tsx`
- **예상 시간**: 1.5시간
- **의존성**: Wave 3 완료

#### Task 4.2: 아조씨 상세 페이지
- **설명**: /uncles/[uncleId] 라우트
- **산출물**: `src/app/(customer)/uncles/[uncleId]/page.tsx`
- **예상 시간**: 1.5시간
- **의존성**: Wave 3 완료

#### Task 4.3: 예약 요청 페이지
- **설명**: /booking/new 라우트 (Multi-step)
- **산출물**: `src/app/(customer)/booking/new/page.tsx`
- **예상 시간**: 2시간
- **의존성**: Wave 3 완료

#### Task 4.4: 고객 예약 목록/상세 페이지
- **설명**: /bookings, /bookings/[bookingId] 라우트
- **산출물**: `src/app/(customer)/bookings/` 디렉토리
- **예상 시간**: 2시간
- **의존성**: Wave 3 완료

#### Task 4.5: 아조씨 예약 관리 페이지
- **설명**: /uncle/bookings, /uncle/bookings/[bookingId] 라우트
- **산출물**: `src/app/(uncle)/uncle/bookings/` 디렉토리
- **예상 시간**: 2시간
- **의존성**: Wave 3 완료

#### Task 4.6: 네비게이션 업데이트
- **설명**: Header, BottomNav에 예약 관련 메뉴 추가
- **산출물**: 기존 컴포넌트 수정
- **예상 시간**: 1시간
- **의존성**: Task 4.1-4.5

**Wave 4 산출물 체크리스트**:
- [ ] `src/app/(customer)/uncles/page.tsx` 생성
- [ ] `src/app/(customer)/uncles/[uncleId]/page.tsx` 생성
- [ ] `src/app/(customer)/booking/new/page.tsx` 생성
- [ ] `src/app/(customer)/bookings/page.tsx` 생성
- [ ] `src/app/(customer)/bookings/[bookingId]/page.tsx` 생성
- [ ] `src/app/(uncle)/uncle/bookings/page.tsx` 생성
- [ ] `src/app/(uncle)/uncle/bookings/[bookingId]/page.tsx` 생성
- [ ] Header, BottomNav 업데이트

---

### Wave 5: QA & Polish

**목표**: 통합 테스트, E2E, 버그 수정, 배포

#### Task 5.1: 통합 테스트
- **설명**: Frontend-Backend 통합 테스트
- **산출물**: `tests/integration/booking.integration.test.ts`
- **예상 시간**: 3시간
- **의존성**: Wave 4 완료

#### Task 5.2: E2E 테스트
- **설명**: 전체 사용자 플로우 테스트
- **산출물**: `e2e/booking.spec.ts`
- **예상 시간**: 3시간
- **의존성**: Wave 4 완료

#### Task 5.3: 버그 수정 및 Polish
- **설명**: 테스트 중 발견된 이슈 수정
- **산출물**: 수정된 코드
- **예상 시간**: 3시간
- **의존성**: Task 5.1, 5.2

#### Task 5.4: 배포 및 검증
- **설명**: Firebase 배포 및 프로덕션 검증
- **산출물**: 배포 완료 + 검증 리포트
- **예상 시간**: 2시간
- **의존성**: Task 5.3

**Wave 5 산출물 체크리스트**:
- [ ] 통합 테스트 통과
- [ ] E2E 테스트 통과
- [ ] 버그 수정 완료
- [ ] Firebase 배포 완료
- [ ] 프로덕션 검증 완료

---

## 3. 의존성 다이어그램

```
Wave 1: Foundation
┌─────────────────────────────────────────────────────────────────┐
│  Task 1.1 Types                                                 │
│       ↓                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 1.2 Uncle   │  │ 1.3 Booking │  │ 1.4 Rules   │             │
│  │ Functions   │  │ Functions   │  │             │             │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘             │
│         └────────────────┼────────────────────────┐             │
│                          ↓                        ↓             │
│                    Task 1.5 Tests                               │
└─────────────────────────────────────────────────────────────────┘
                           ↓
Wave 2: Core Logic
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐                              │
│  │ 2.1 Uncle   │  │ 2.2 Booking │                              │
│  │ Service     │  │ Service     │                              │
│  └──────┬──────┘  └──────┬──────┘                              │
│         ↓                ↓                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 2.3 useUncles│ │ 2.4 useBooking│ │2.5 useForm  │             │
│  └─────────────┘  └──────┬──────┘  └──────┬──────┘             │
│                          │                 │                    │
│                          └─────────────────┼──────┐             │
│                                            ↓      ↓             │
│                                      Task 2.6 Context           │
│                                            ↓                    │
│                                      Task 2.7 Tests             │
└─────────────────────────────────────────────────────────────────┘
                           ↓
Wave 3: UI Components (병렬 작업)
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 3.1 Uncle   │  │ 3.2 Form    │  │ 3.3 Booking │             │
│  │ Components  │  │ Steps       │  │ Components  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         └──────────────────┼────────────────┘                   │
│                            ↓                                    │
│                      Task 3.4 Stories (optional)                │
└─────────────────────────────────────────────────────────────────┘
                           ↓
Wave 4: Pages (병렬 작업)
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐       │
│  │4.1 목록   │ │4.2 상세   │ │4.3 예약폼 │ │4.4 고객예약│       │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘       │
│         │           │             │              │              │
│         │           │             │       ┌──────┴──────┐       │
│         │           │             │       │4.5 아조씨예약│       │
│         │           │             │       └─────────────┘       │
│         └───────────┴─────────────┴─────────────┘               │
│                            ↓                                    │
│                      Task 4.6 Navigation                        │
└─────────────────────────────────────────────────────────────────┘
                           ↓
Wave 5: QA & Polish
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐                              │
│  │ 5.1 통합    │  │ 5.2 E2E     │                              │
│  │ 테스트     │  │ 테스트     │                              │
│  └──────┬──────┘  └──────┬──────┘                              │
│         └────────────────┼────────────────┐                     │
│                          ↓                ↓                     │
│                    Task 5.3 Bug Fix                             │
│                          ↓                                      │
│                    Task 5.4 Deploy                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Mock 인터페이스 정의

### 4.1 Backend Mock (Wave 2가 사용)
```typescript
// __mocks__/bookingService.ts
export const mockBookingService = {
  getUncles: jest.fn().mockResolvedValue({
    success: true,
    data: {
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
      ],
      hasMore: false,
      lastDocId: null,
    },
  }),

  getUncleById: jest.fn().mockResolvedValue({
    success: true,
    data: {
      uncle: {
        uid: 'uncle-1',
        displayName: '김철수',
        shortIntro: '30년 직장생활 경험의 조언자',
        bio: '저는 30년간 대기업에서 근무하며...',
        profileImages: ['/mock/uncle1.jpg'],
        mainImageIndex: 0,
        expertise: ['career_counseling', 'life_advice'],
        hourlyRate: 50000,
        status: 'approved',
        availability: { /* ... */ },
      },
    },
  }),

  createBooking: jest.fn().mockResolvedValue({
    success: true,
    data: {
      bookingId: 'booking-123',
      estimatedPrice: 100000,
      message: '예약 요청이 완료되었습니다.',
    },
  }),

  getBookings: jest.fn().mockResolvedValue({
    success: true,
    data: {
      bookings: [],
      hasMore: false,
      lastDocId: null,
    },
  }),

  acceptBooking: jest.fn().mockResolvedValue({
    success: true,
    data: { status: 'confirmed' },
  }),

  rejectBooking: jest.fn().mockResolvedValue({
    success: true,
    data: { status: 'cancelled' },
  }),

  cancelBooking: jest.fn().mockResolvedValue({
    success: true,
    data: { status: 'cancelled' },
  }),

  completeBooking: jest.fn().mockResolvedValue({
    success: true,
    data: { status: 'completed' },
  }),
};
```

### 4.2 Hook Mock (Wave 3가 사용)
```typescript
// __mocks__/useBooking.ts
export const mockUseBooking = () => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  hasMore: false,

  fetchBookings: jest.fn(),
  fetchBookingById: jest.fn(),
  createBooking: jest.fn().mockResolvedValue('booking-123'),
  acceptBooking: jest.fn(),
  rejectBooking: jest.fn(),
  cancelBooking: jest.fn(),
  completeBooking: jest.fn(),
  loadMore: jest.fn(),
});

export const mockUseUncles = () => ({
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
  ],
  loading: false,
  error: null,
  hasMore: false,

  fetchUncles: jest.fn(),
  loadMore: jest.fn(),
  refresh: jest.fn(),
});

export const mockUseBookingForm = () => ({
  currentStep: 1,
  formData: {},
  uncle: null,
  isSubmitting: false,
  error: null,

  nextStep: jest.fn(),
  prevStep: jest.fn(),
  goToStep: jest.fn(),
  updateFormData: jest.fn(),
  setUncle: jest.fn(),
  submit: jest.fn().mockResolvedValue('booking-123'),

  estimatedPrice: 0,
  isStepValid: true,
  canSubmit: false,
});
```

---

## 5. 완료 기준 (Definition of Done)

### 5.1 Wave 1 완료 조건
- [ ] `src/types/booking.ts` 생성 완료
- [ ] Cloud Functions 배포 완료 (uncles, bookings)
- [ ] Firestore Security Rules 배포 완료
- [ ] Backend 단위 테스트 통과

### 5.2 Wave 2 완료 조건
- [ ] 모든 Service 파일 생성 완료
- [ ] 모든 Hook 파일 생성 완료
- [ ] BookingContext 생성 완료
- [ ] Hook 단위 테스트 통과

### 5.3 Wave 3 완료 조건
- [ ] 모든 컴포넌트 생성 완료
- [ ] Mock 데이터로 컴포넌트 렌더링 확인
- [ ] 반응형 디자인 확인 (Mobile First)

### 5.4 Wave 4 완료 조건
- [ ] 모든 페이지 라우트 생성 완료
- [ ] 페이지 간 네비게이션 동작 확인
- [ ] 폼 제출 플로우 동작 확인

### 5.5 Wave 5 완료 조건
- [ ] 통합 테스트 통과
- [ ] E2E 테스트 통과
- [ ] Firebase 배포 완료
- [ ] 프로덕션 환경 검증 완료

---

## 6. 일정 요약

| Wave | 주요 작업 | 예상 시간 |
|------|----------|----------|
| Wave 1 | Foundation (Types, Functions, Rules) | 9.5시간 |
| Wave 2 | Core Logic (Services, Hooks, Context) | 11시간 |
| Wave 3 | UI Components | 12시간 |
| Wave 4 | Pages & Integration | 10시간 |
| Wave 5 | QA & Polish | 11시간 |

**총 예상 시간**: 53.5시간 (약 7일, 8시간/일 기준)

---

## 7. 위험 관리

| 위험 | 확률 | 영향 | 대응 |
|------|------|------|------|
| Kakao API 연동 지연 | 중 | 중 | 직접 입력 fallback 먼저 구현 |
| 복잡한 상태 전이 버그 | 높 | 높 | 상태 전이 테스트 강화 |
| 성능 이슈 (목록 로딩) | 중 | 중 | 페이지네이션, 가상화 적용 |
| 동시 예약 충돌 | 낮 | 높 | 트랜잭션 + 낙관적 잠금 |

---

*문서 버전: 1.0*
*최종 수정: 2026-01-13*
