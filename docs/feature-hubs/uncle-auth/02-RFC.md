# 02-RFC.md - 아조씨 인증 (Uncle Auth) 기술 설계

> **Request for Comments (Technical Design)**
> **작성일**: 2026-01-13
> **작성자**: Orchestrator Agent
> **상태**: Draft

---

## 1. 개요

### 1.1 목적
이 문서는 아조씨 인증(Uncle Auth) 구현을 위한 기술적 설계를 정의합니다.
6단계 멀티스텝 신청 폼, 이미지 업로드, 신원 검증, 로그인, 신청 상태 관리를 포함합니다.

### 1.2 관련 문서
- PRD: `01-PRD.md`
- WIREFRAME: `docs/wireframes/uncle-signup.html`, `uncle-login.html`
- ORCHESTRATION: `03-ORCHESTRATION.md`

### 1.3 Customer Auth 대비 주요 차이점
| 항목 | Customer Auth | Uncle Auth |
|------|---------------|------------|
| 가입 방식 | 4단계 간단 폼 | 6단계 멀티스텝 폼 |
| 신원 검증 | 이메일 인증 | 신분증 업로드 + 심사 |
| 이미지 업로드 | 없음 | 프로필 5장 + 신분증 1장 |
| 승인 프로세스 | 즉시 가입 | 심사 후 승인 |
| 테마 색상 | 파랑 (#2B6BE6) | 빨강 (#DC2626) |

---

## 2. 시스템 아키텍처

### 2.1 전체 구조
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Firebase Auth  │────▶│    Firestore    │
│   (Frontend)    │     │  (인증 처리)     │     │  (아조씨 데이터) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Firebase Storage│     │ Cloud Functions │     │  Admin Panel    │
│ (이미지 저장)    │     │ (심사 알림 등)   │     │ (Phase 2)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.2 컴포넌트 다이어그램
```
Frontend (src/):
├── app/
│   ├── (uncle-auth)/
│   │   ├── uncle-signup/
│   │   │   └── page.tsx
│   │   ├── uncle-login/
│   │   │   └── page.tsx
│   │   ├── uncle-status/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── actions/
│       └── uncle-auth.ts
├── components/
│   ├── ui/
│   │   ├── Input.tsx (재사용)
│   │   ├── Button.tsx (재사용)
│   │   ├── Checkbox.tsx (재사용)
│   │   ├── Textarea.tsx (신규)
│   │   ├── FileUpload.tsx (신규)
│   │   └── ProgressBar.tsx (신규)
│   └── uncle-auth/
│       ├── UncleSignupForm.tsx
│       ├── UncleLoginForm.tsx
│       ├── BasicInfoStep.tsx
│       ├── ExpertiseStep.tsx
│       ├── PricingStep.tsx
│       ├── AvailabilityStep.tsx
│       ├── VerificationStep.tsx
│       ├── AgreementStep.tsx
│       ├── ProfileImageUpload.tsx
│       ├── IdCardUpload.tsx
│       ├── ExpertiseTags.tsx
│       ├── WeeklySchedule.tsx
│       └── ApplicationStatus.tsx
├── hooks/
│   └── useUncleAuth.ts
├── services/
│   └── uncleAuthService.ts
├── contexts/
│   └── UncleAuthContext.tsx
└── lib/
    ├── firebase/
    │   ├── admin.ts (재사용)
    │   └── storage.ts (신규)
    └── validations/
        └── uncle-auth.ts

types/ (src/types/):
├── uncle.ts (신규)
└── index.ts (업데이트)
```

---

## 3. 데이터 모델

### 3.1 Uncle 컬렉션 (신규)
```typescript
// Collection: uncles
interface Uncle {
  uid: string;              // Firebase Auth UID (PK)
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
  expertise: string[];      // 전문성 태그 (최소 1개)
  hourlyRate: number;       // 시간당 요금 (원)

  // 가용 일정
  availability: {
    [day: string]: {        // 'mon', 'tue', ... 'sun'
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    }
  };

  // 신원 확인 (민감 정보)
  verification: {
    idCardImageUrl?: string;  // 신분증 이미지 (심사 후 삭제)
    ssnHash: string;          // 주민번호 해시
    verifiedAt?: Timestamp;   // 검증 완료 시간
  };

  // 동의 내역
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  agreedCodeOfConduct: boolean;

  // 상태
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  rejectionReason?: string;   // 반려 사유

  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedAt?: Timestamp;
  lastLoginAt?: Timestamp;

  // 통계 (활동 후)
  stats?: {
    totalBookings: number;
    rating: number;
    reviewCount: number;
  };
}

// 전문성 태그 목록 (미리 정의)
type ExpertiseTag =
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
```

### 3.2 Uncle Applications 컬렉션 (신규)
```typescript
// Collection: uncle_applications
// 신청 임시 저장 및 심사 이력 관리
interface UncleApplication {
  applicationId: string;    // 자동 생성 ID (PK)
  email: string;            // 이메일 (신청자 식별)

  // 임시 저장 데이터
  draftData?: Partial<UncleSignupData>;
  currentStep: number;      // 현재 단계 (1-6)

  // 심사 정보
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;      // 관리자 UID
  rejectionReason?: string;

  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 4. API 설계

### 4.1 Server Actions (Next.js 14)

#### `saveDraft` (임시 저장)
```typescript
// src/app/actions/uncle-auth.ts
'use server'

export async function saveDraft(
  email: string,
  step: number,
  data: Partial<UncleSignupData>
): Promise<ActionResult> {
  // 1. 기존 draft 조회 또는 생성
  // 2. 데이터 병합 및 저장
  // 3. 현재 단계 업데이트

  return {
    success: boolean,
    applicationId?: string,
    error?: string
  };
}
```

#### `uploadProfileImage`
```typescript
export async function uploadProfileImage(
  formData: FormData
): Promise<ActionResult<{ url: string; index: number }>> {
  // 1. 파일 검증 (JPG/PNG, 5MB 이하)
  // 2. Firebase Storage 업로드
  // 3. 썸네일 생성 (Cloud Functions)
  // 4. URL 반환

  return {
    success: boolean,
    data?: { url: string; index: number },
    error?: string
  };
}
```

#### `uploadIdCard`
```typescript
export async function uploadIdCard(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  // 1. 파일 검증
  // 2. 암호화 저장 (AES-256)
  // 3. 접근 제한 URL 생성

  return {
    success: boolean,
    data?: { url: string },
    error?: string
  };
}
```

#### `applyAsUncle`
```typescript
export async function applyAsUncle(
  data: UncleSignupData
): Promise<ActionResult> {
  // 1. 전체 데이터 검증
  // 2. Firebase Auth 계정 생성
  // 3. Firestore uncles 문서 생성 (status: 'pending')
  // 4. uncle_applications 업데이트
  // 5. 관리자 알림 발송 (Phase 2)

  return {
    success: boolean,
    uid?: string,
    error?: string
  };
}

interface UncleSignupData {
  // Step 1: 기본 정보
  displayName: string;
  age: number;
  bio: string;
  profileImages: string[];
  mainImageIndex: number;

  // Step 2: 전문성
  expertise: string[];

  // Step 3: 요금
  hourlyRate: number;
  shortIntro: string;

  // Step 4: 일정
  availability: Uncle['availability'];

  // Step 5: 신원 확인
  ssn: string;  // 주민등록번호 (서버에서 해싱)
  phone: string;
  email: string;
  password: string;
  idCardImageUrl: string;

  // Step 6: 동의
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  agreedCodeOfConduct: boolean;
}
```

#### `signInAsUncle`
```typescript
export async function signInAsUncle(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<ActionResult> {
  // 1. Firebase Auth 로그인
  // 2. uncles 컬렉션에서 status 확인
  // 3. status !== 'approved' → 에러 반환 (상태 페이지로 리다이렉트)
  // 4. lastLoginAt 업데이트
  // 5. 세션 쿠키 설정

  return {
    success: boolean,
    user?: UncleData,
    status?: Uncle['status'],
    error?: string
  };
}
```

#### `getApplicationStatus`
```typescript
export async function getApplicationStatus(
  email: string
): Promise<ActionResult<ApplicationStatusData>> {
  // 1. email로 uncles 또는 uncle_applications 조회
  // 2. 상태 정보 반환

  return {
    success: boolean,
    data?: {
      status: Uncle['status'],
      submittedAt?: Date,
      rejectionReason?: string
    },
    error?: string
  };
}
```

#### `sendPasswordResetEmail`
```typescript
export async function sendUnclePasswordResetEmail(
  email: string
): Promise<ActionResult> {
  // 1. uncles 컬렉션에 해당 이메일 존재 확인
  // 2. Firebase Auth sendPasswordResetEmail 호출

  return {
    success: boolean,
    error?: string
  };
}
```

### 4.2 에러 코드
| 코드 | 설명 | 사용자 메시지 |
|------|------|--------------|
| `uncle/email-already-in-use` | 중복 이메일 | 이미 등록된 이메일입니다 |
| `uncle/age-requirement` | 나이 미충족 | 만 40세 이상만 신청 가능합니다 |
| `uncle/bio-too-short` | 자기소개 부족 | 자기소개는 100자 이상 작성해주세요 |
| `uncle/no-expertise` | 전문성 미선택 | 최소 1개의 전문성을 선택해주세요 |
| `uncle/image-too-large` | 이미지 크기 초과 | 이미지 크기가 5MB를 초과합니다 |
| `uncle/invalid-image-type` | 이미지 형식 오류 | JPG 또는 PNG 파일만 업로드 가능합니다 |
| `uncle/invalid-id-card` | 신분증 오류 | 유효하지 않은 신분증입니다 |
| `uncle/not-approved` | 미승인 계정 | 아직 승인되지 않은 계정입니다 |
| `uncle/account-suspended` | 정지 계정 | 활동 정지된 계정입니다 |
| `uncle/application-rejected` | 신청 반려 | 신청이 반려되었습니다 |
| `uncle/invalid-ssn` | 주민번호 오류 | 유효하지 않은 주민등록번호입니다 |
| `uncle/rate-out-of-range` | 요금 범위 초과 | 요금은 20,000원~100,000원 범위로 설정해주세요 |

---

## 5. 보안

### 5.1 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // uncles 컬렉션
    match /uncles/{uid} {
      // 본인만 읽기 가능
      allow read: if request.auth != null && request.auth.uid == uid;

      // 생성: 인증된 사용자 + 본인 문서만
      allow create: if request.auth != null
                    && request.auth.uid == uid
                    && validateUncleData(request.resource.data);

      // 수정: 본인만 + 특정 필드만 (status 제외)
      allow update: if request.auth != null
                    && request.auth.uid == uid
                    && onlyAllowedUncleFields();

      // 삭제 불가
      allow delete: if false;
    }

    // uncle_applications (서버에서만 접근)
    match /uncle_applications/{appId} {
      allow read, write: if false; // 클라이언트 접근 불가
    }

    function validateUncleData(data) {
      return data.email is string
          && data.displayName is string
          && data.phone is string
          && data.age is number
          && data.age >= 40
          && data.bio is string
          && data.bio.size() >= 100
          && data.expertise is list
          && data.expertise.size() >= 1
          && data.hourlyRate is number
          && data.hourlyRate >= 20000
          && data.hourlyRate <= 100000
          && data.agreedTerms == true
          && data.agreedPrivacy == true
          && data.agreedCodeOfConduct == true;
    }

    function onlyAllowedUncleFields() {
      let allowed = [
        'displayName', 'bio', 'shortIntro', 'profileImages',
        'mainImageIndex', 'expertise', 'hourlyRate', 'availability',
        'updatedAt'
      ];
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(allowed);
    }
  }
}
```

### 5.2 Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 프로필 이미지
    match /uncles/{uid}/profile/{fileName} {
      allow read: if true;  // 공개
      allow write: if request.auth != null
                   && request.auth.uid == uid
                   && request.resource.size < 5 * 1024 * 1024  // 5MB
                   && request.resource.contentType.matches('image/(jpeg|png)');
    }

    // 신분증 이미지 (서버만 접근)
    match /uncles/{uid}/id-card/{fileName} {
      allow read, write: if false;  // 클라이언트 접근 불가
    }
  }
}
```

### 5.3 보안 요구사항
- **주민등록번호**: 마스킹 표시 (앞 6자리만), SHA-256 해싱 저장
- **신분증 이미지**: AES-256 암호화 저장, 심사 완료 후 7일 내 삭제
- **비밀번호 정책**: 8자 이상, 대문자 1개, 숫자 1개 이상
- **세션 관리**: 기본 1시간, Remember Me 7일
- **Rate Limiting**: 로그인 5회/분, 이미지 업로드 10회/시간

---

## 6. Frontend 설계

### 6.1 멀티스텝 폼 구조
```
UncleSignupPage
├── ProgressBar (1-6 단계)
├── UncleSignupForm
│   ├── Step 1: BasicInfoStep
│   │   ├── Input (name)
│   │   ├── Input (age) + 40세 이상 검증
│   │   ├── Textarea (bio) + 글자수 카운터
│   │   └── ProfileImageUpload (드래그앤드롭, 최대 5장)
│   │
│   ├── Step 2: ExpertiseStep
│   │   └── ExpertiseTags (토글 버튼 그리드)
│   │
│   ├── Step 3: PricingStep
│   │   ├── Input (hourlyRate) + 슬라이더
│   │   └── Textarea (shortIntro)
│   │
│   ├── Step 4: AvailabilityStep
│   │   └── WeeklySchedule (요일 × 시간대 그리드)
│   │
│   ├── Step 5: VerificationStep
│   │   ├── Input (ssn) + 마스킹
│   │   ├── Input (phone)
│   │   ├── Input (email)
│   │   ├── Input (password) + PasswordStrengthIndicator
│   │   ├── Input (passwordConfirm)
│   │   └── IdCardUpload + 안심 메시지
│   │
│   └── Step 6: AgreementStep
│       ├── Checkbox (이용약관) + 모달
│       ├── Checkbox (개인정보처리방침) + 모달
│       ├── Checkbox (행동규칙) + 모달
│       └── Button (신청하기)
│
└── NavigationButtons (이전/다음/임시저장)

UncleLoginPage
├── UncleLoginForm (빨간 테마)
│   ├── Input (email)
│   ├── Input (password)
│   ├── Checkbox (remember me)
│   ├── Button (로그인) - 빨간색
│   └── Links (비밀번호 찾기, 신청하기, 고객 로그인)
└── UncleThemeProvider (빨간 테마 적용)

UncleStatusPage
├── ApplicationStatus
│   ├── StatusBadge (pending/under_review/approved/rejected)
│   ├── StatusMessage
│   ├── SubmittedDate
│   └── RejectionReason (if rejected)
└── ActionButtons (재신청, 홈으로)
```

### 6.2 상태 관리 (useUncleAuth Hook)
```typescript
// src/hooks/useUncleAuth.ts
interface UncleAuthState {
  uncle: Uncle | null;
  loading: boolean;
  error: Error | null;
  applicationStatus: Uncle['status'] | null;
}

interface UncleAuthActions {
  // 신청 관련
  saveDraft: (step: number, data: Partial<UncleSignupData>) => Promise<Result>;
  loadDraft: (email: string) => Promise<Result<Partial<UncleSignupData>>>;
  apply: (data: UncleSignupData) => Promise<Result>;

  // 이미지 업로드
  uploadProfileImage: (file: File) => Promise<Result<{ url: string }>>;
  uploadIdCard: (file: File) => Promise<Result<{ url: string }>>;
  removeProfileImage: (index: number) => Promise<Result>;

  // 로그인/로그아웃
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<Result>;
  signOut: () => Promise<void>;

  // 상태 확인
  checkStatus: (email: string) => Promise<Result<ApplicationStatusData>>;

  // 비밀번호
  sendPasswordReset: (email: string) => Promise<Result>;
}

export function useUncleAuth(): UncleAuthState & UncleAuthActions {
  // Implementation
}
```

### 6.3 Form Validation (Zod)
```typescript
// src/lib/validations/uncle-auth.ts
import { z } from 'zod';

// Step 1: 기본 정보
export const basicInfoSchema = z.object({
  displayName: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  age: z.number()
    .min(40, '만 40세 이상만 신청 가능합니다')
    .max(100, '올바른 나이를 입력해주세요'),
  bio: z.string().min(100, '자기소개는 100자 이상 작성해주세요'),
  profileImages: z.array(z.string().url())
    .min(1, '프로필 사진을 1장 이상 업로드해주세요')
    .max(5, '프로필 사진은 최대 5장까지 가능합니다'),
  mainImageIndex: z.number().min(0).max(4),
});

// Step 2: 전문성
export const expertiseSchema = z.object({
  expertise: z.array(z.string())
    .min(1, '최소 1개의 전문성을 선택해주세요'),
});

// Step 3: 요금
export const pricingSchema = z.object({
  hourlyRate: z.number()
    .min(20000, '최소 요금은 20,000원입니다')
    .max(100000, '최대 요금은 100,000원입니다'),
  shortIntro: z.string()
    .min(10, '짧은 소개를 10자 이상 작성해주세요')
    .max(100, '짧은 소개는 100자 이내로 작성해주세요'),
});

// Step 4: 일정
const timeSlotSchema = z.object({
  morning: z.boolean(),
  afternoon: z.boolean(),
  evening: z.boolean(),
});

export const availabilitySchema = z.object({
  availability: z.object({
    mon: timeSlotSchema,
    tue: timeSlotSchema,
    wed: timeSlotSchema,
    thu: timeSlotSchema,
    fri: timeSlotSchema,
    sat: timeSlotSchema,
    sun: timeSlotSchema,
  }).refine(
    (data) => Object.values(data).some(day =>
      day.morning || day.afternoon || day.evening
    ),
    { message: '최소 1개의 가용 시간을 선택해주세요' }
  ),
});

// Step 5: 신원 확인
export const verificationSchema = z.object({
  ssn: z.string()
    .length(13, '주민등록번호 13자리를 입력해주세요')
    .regex(/^\d+$/, '숫자만 입력해주세요'),
  phone: z.string()
    .regex(/^010-\d{4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다'),
  email: z.string().email('유효하지 않은 이메일 형식입니다'),
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[A-Z]/, '대문자를 1개 이상 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 1개 이상 포함해야 합니다'),
  passwordConfirm: z.string(),
  idCardImageUrl: z.string().url('신분증을 업로드해주세요'),
}).refine(data => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
});

// Step 6: 동의
export const agreementSchema = z.object({
  agreedTerms: z.literal(true, {
    errorMap: () => ({ message: '이용약관에 동의해주세요' })
  }),
  agreedPrivacy: z.literal(true, {
    errorMap: () => ({ message: '개인정보처리방침에 동의해주세요' })
  }),
  agreedCodeOfConduct: z.literal(true, {
    errorMap: () => ({ message: '행동규칙에 동의해주세요' })
  }),
});

// 전체 스키마
export const uncleSignupSchema = basicInfoSchema
  .merge(expertiseSchema)
  .merge(pricingSchema)
  .merge(availabilitySchema)
  .merge(verificationSchema)
  .merge(agreementSchema);
```

---

## 7. 정책 설정 (Policy Config)

### 7.1 동적 설정
```typescript
// Collection: policy_configs/uncle-auth
{
  // 나이 제한
  minimumAge: 40,

  // 프로필 설정
  minBioLength: 100,
  maxProfileImages: 5,
  maxImageSizeMB: 5,

  // 요금 제한
  minHourlyRate: 20000,
  maxHourlyRate: 100000,
  recommendedHourlyRate: 50000,

  // 신분증 보관
  idCardRetentionDays: 7,

  // 비밀번호 정책
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumber: true,

  // 심사 설정
  autoApproveEnabled: false,  // Phase 2에서 활성화 가능
  reviewReminderDays: 3,

  // Rate Limiting
  loginMaxAttempts: 5,
  loginLockoutMinutes: 15,
  imageUploadMaxPerHour: 10,

  updatedAt: Timestamp
}
```

---

## 8. 테스트 전략

### 8.1 단위 테스트
- **Server Actions**: `src/app/actions/__tests__/uncle-auth.test.ts`
- **Hooks**: `src/hooks/__tests__/useUncleAuth.test.ts`
- **Validations**: `src/lib/validations/__tests__/uncle-auth.test.ts`
- **Components**: `src/components/uncle-auth/__tests__/*.test.tsx`

### 8.2 통합 테스트
- Firebase Emulators + Storage Emulator 사용
- `tests/integration/uncle-auth.integration.test.ts`

### 8.3 E2E 테스트
- Playwright 사용
- `e2e/uncle-auth.spec.ts`
  - 6단계 신청 플로우
  - 이미지 업로드 플로우
  - 로그인 플로우 (승인/미승인)
  - 상태 확인 플로우

---

## 9. 리스크 및 대안

| 리스크 | 영향 | 대안 |
|--------|------|------|
| 이미지 업로드 실패 | High | 재시도 로직, 오프라인 큐 |
| 신분증 저장 보안 | Critical | AES-256 암호화, 서버 전용 접근 |
| 멀티스텝 폼 이탈 | Medium | 임시 저장 기능, 이탈 경고 |
| 심사 지연 | Medium | 자동 알림, 예상 소요 시간 안내 |
| 관리자 심사 부재 | High | Phase 1은 수동 Firestore 처리, Phase 2 관리자 UI |

---

*문서 버전: 1.0*
*최종 수정: 2026-01-13*
