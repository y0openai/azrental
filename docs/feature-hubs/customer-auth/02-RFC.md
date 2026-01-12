# 02-RFC.md - 고객 인증 (Customer Auth) 기술 설계

> **Request for Comments (Technical Design)**
> **작성일**: 2026-01-12
> **작성자**: Orchestrator Agent
> **상태**: Draft

---

## 1. 개요

### 1.1 목적
이 문서는 고객 인증(Customer Auth) 구현을 위한 기술적 설계를 정의합니다.
이메일/비밀번호 회원가입, 로그인, 비밀번호 재설정, 소셜 로그인(카카오/네이버)을 포함합니다.

### 1.2 관련 문서
- PRD: `01-PRD.md`
- WIREFRAME: `docs/wireframes/customer-login.html`, `customer-signup.html`
- ORCHESTRATION: `03-ORCHESTRATION.md`

---

## 2. 시스템 아키텍처

### 2.1 전체 구조
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Firebase Auth  │────▶│    Firestore    │
│   (Frontend)    │     │  (인증 처리)     │     │  (사용자 데이터) │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌─────────────────┐
        │               │ Cloud Functions │
        │               │ (이메일 발송 등) │
        │               └─────────────────┘
        │
        ▼
┌─────────────────┐
│  OAuth Provider │
│ (Kakao, Naver)  │
└─────────────────┘
```

### 2.2 컴포넌트 다이어그램
```
Frontend (src/):
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   └── layout.tsx
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       ├── SignupForm.tsx
│       ├── SocialLoginButtons.tsx
│       ├── EmailVerification.tsx
│       ├── PasswordStrengthIndicator.tsx
│       └── AgreementCheckboxes.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── authService.ts
└── lib/
    └── firebase.ts

Backend (functions/):
├── index.ts
└── services/
    └── authService.ts
```

---

## 3. 데이터 모델

### 3.1 Customer 컬렉션 (신규)
```typescript
// Collection: customers
interface Customer {
  uid: string;              // Firebase Auth UID (PK)
  email: string;            // 이메일
  displayName: string;      // 표시 이름
  phone: string;            // 전화번호 (010-XXXX-XXXX)
  age: number;              // 만 나이
  gender: 'male' | 'female' | 'other';
  profileImage?: string;    // 프로필 이미지 URL

  // OAuth 정보
  provider: 'email' | 'kakao' | 'naver';
  providerId?: string;      // OAuth provider ID

  // 동의 내역
  agreedTerms: boolean;     // 이용약관 동의
  agreedPrivacy: boolean;   // 개인정보처리방침 동의
  agreedMarketing: boolean; // 마케팅 수신 동의

  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;

  // 상태
  status: 'active' | 'suspended' | 'deleted';
}
```

### 3.2 Email Verification 컬렉션 (신규)
```typescript
// Collection: email_verifications
interface EmailVerification {
  email: string;           // 이메일 (PK)
  code: string;            // 6자리 인증코드 (해시)
  expiresAt: Timestamp;    // 만료 시간 (3분)
  attempts: number;        // 시도 횟수
  verified: boolean;       // 인증 완료 여부
  createdAt: Timestamp;
}
```

---

## 4. API 설계

### 4.1 Server Actions (Next.js 14)

#### `sendVerificationCode`
```typescript
// src/app/actions/auth.ts
'use server'

export async function sendVerificationCode(email: string): Promise<ActionResult> {
  // 1. 이메일 형식 검증
  // 2. 6자리 코드 생성
  // 3. Firestore에 저장 (3분 만료)
  // 4. 이메일 발송 (Firebase Extensions 또는 Cloud Functions)

  return {
    success: boolean,
    message?: string,
    error?: string
  };
}
```

#### `verifyCode`
```typescript
export async function verifyCode(
  email: string,
  code: string
): Promise<ActionResult> {
  // 1. Firestore에서 코드 조회
  // 2. 만료 여부 확인
  // 3. 코드 일치 확인
  // 4. verified = true 업데이트

  return {
    success: boolean,
    error?: string
  };
}
```

#### `signUpWithEmail`
```typescript
export async function signUpWithEmail(data: SignUpData): Promise<ActionResult> {
  // 1. 이메일 인증 완료 여부 확인
  // 2. Firebase Auth 계정 생성
  // 3. Firestore customers 문서 생성
  // 4. 세션 쿠키 설정

  return {
    success: boolean,
    user?: UserData,
    error?: string
  };
}

interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  agreedMarketing: boolean;
}
```

#### `signInWithEmail`
```typescript
export async function signInWithEmail(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<ActionResult> {
  // 1. Firebase Auth 로그인
  // 2. lastLoginAt 업데이트
  // 3. 세션 쿠키 설정 (rememberMe에 따라 기간 조정)

  return {
    success: boolean,
    user?: UserData,
    error?: string
  };
}
```

#### `sendPasswordResetEmail`
```typescript
export async function sendPasswordResetEmail(email: string): Promise<ActionResult> {
  // 1. Firebase Auth sendPasswordResetEmail 호출

  return {
    success: boolean,
    error?: string
  };
}
```

#### `signOut`
```typescript
export async function signOut(): Promise<ActionResult> {
  // 1. Firebase Auth signOut
  // 2. 세션 쿠키 삭제

  return {
    success: boolean
  };
}
```

### 4.2 에러 코드
| 코드 | 설명 | 사용자 메시지 |
|------|------|--------------|
| `auth/email-already-in-use` | 중복 이메일 | 이미 사용 중인 이메일입니다 |
| `auth/invalid-email` | 이메일 형식 오류 | 유효하지 않은 이메일 형식입니다 |
| `auth/weak-password` | 비밀번호 규칙 미충족 | 비밀번호가 너무 약합니다 |
| `auth/wrong-password` | 비밀번호 불일치 | 비밀번호가 일치하지 않습니다 |
| `auth/user-not-found` | 미등록 이메일 | 등록되지 않은 이메일입니다 |
| `auth/code-expired` | 인증코드 만료 | 인증코드가 만료되었습니다 |
| `auth/invalid-code` | 인증코드 불일치 | 잘못된 인증코드입니다 |
| `auth/too-many-requests` | Rate limit | 잠시 후 다시 시도해주세요 |

---

## 5. 보안

### 5.1 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // customers 컬렉션
    match /customers/{uid} {
      // 본인만 읽기 가능
      allow read: if request.auth != null && request.auth.uid == uid;

      // 생성: 인증된 사용자 + 본인 문서만
      allow create: if request.auth != null
                    && request.auth.uid == uid
                    && validateCustomerData(request.resource.data);

      // 수정: 본인만 + 특정 필드만
      allow update: if request.auth != null
                    && request.auth.uid == uid
                    && onlyAllowedFields();

      // 삭제 불가 (soft delete 사용)
      allow delete: if false;
    }

    // email_verifications (서버에서만 접근)
    match /email_verifications/{email} {
      allow read, write: if false; // 클라이언트 접근 불가
    }

    function validateCustomerData(data) {
      return data.email is string
          && data.displayName is string
          && data.phone is string
          && data.age is number
          && data.age >= 19
          && data.agreedTerms == true
          && data.agreedPrivacy == true;
    }

    function onlyAllowedFields() {
      let allowed = ['displayName', 'phone', 'profileImage', 'agreedMarketing', 'updatedAt'];
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(allowed);
    }
  }
}
```

### 5.2 인증/인가 요구사항
- **비밀번호 정책**: 8자 이상, 대문자 1개 이상, 숫자 1개 이상
- **세션 관리**:
  - 기본: 1시간 (Access Token)
  - Remember Me: 7일 (Refresh Token)
- **Rate Limiting**: 로그인 시도 5회/분, 인증코드 요청 3회/시간
- **인증코드**: 6자리 숫자, 3분 만료, 1회 사용

---

## 6. Frontend 설계

### 6.1 컴포넌트 계층
```
LoginPage
├── LoginForm
│   ├── Input (email)
│   ├── Input (password)
│   ├── Checkbox (remember me)
│   ├── Button (로그인)
│   └── Link (비밀번호 찾기, 회원가입)
└── SocialLoginButtons
    ├── KakaoLoginButton
    └── NaverLoginButton

SignupPage
├── SignupForm
│   ├── Step 1: EmailVerification
│   │   ├── Input (email)
│   │   ├── Button (인증코드 발송)
│   │   └── Input (인증코드)
│   ├── Step 2: PasswordInput
│   │   ├── Input (password)
│   │   ├── PasswordStrengthIndicator
│   │   └── Input (password confirm)
│   ├── Step 3: PersonalInfo
│   │   ├── Input (name)
│   │   ├── Input (phone)
│   │   ├── Input (age)
│   │   └── Select (gender)
│   └── Step 4: Agreements
│       └── AgreementCheckboxes
└── SocialLoginButtons
```

### 6.2 상태 관리 (useAuth Hook)
```typescript
// src/hooks/useAuth.ts
interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

interface AuthActions {
  // 이메일 인증
  sendVerificationCode: (email: string) => Promise<Result>;
  verifyCode: (email: string, code: string) => Promise<Result>;

  // 회원가입/로그인
  signUp: (data: SignUpData) => Promise<Result>;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<Result>;
  signOut: () => Promise<void>;

  // 비밀번호
  sendPasswordReset: (email: string) => Promise<Result>;

  // 소셜 로그인
  signInWithKakao: () => Promise<Result>;
  signInWithNaver: () => Promise<Result>;
}

export function useAuth(): AuthState & AuthActions {
  // Implementation
}
```

### 6.3 Form Validation (Zod)
```typescript
// src/lib/validations/auth.ts
import { z } from 'zod';

export const emailSchema = z.string()
  .email('유효하지 않은 이메일 형식입니다');

export const passwordSchema = z.string()
  .min(8, '비밀번호는 8자 이상이어야 합니다')
  .regex(/[A-Z]/, '대문자를 1개 이상 포함해야 합니다')
  .regex(/[0-9]/, '숫자를 1개 이상 포함해야 합니다');

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  passwordConfirm: z.string(),
  displayName: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다'),
  age: z.number().min(19, '만 19세 이상만 가입 가능합니다'),
  gender: z.enum(['male', 'female', 'other']),
  agreedTerms: z.literal(true, {
    errorMap: () => ({ message: '이용약관에 동의해주세요' })
  }),
  agreedPrivacy: z.literal(true, {
    errorMap: () => ({ message: '개인정보처리방침에 동의해주세요' })
  }),
  agreedMarketing: z.boolean(),
}).refine(data => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
});
```

---

## 7. 정책 설정 (Policy Config)

### 7.1 동적 설정
```typescript
// Collection: policy_configs/auth
{
  // 비밀번호 정책
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumber: true,
  passwordRequireSpecial: false,

  // 인증코드 정책
  verificationCodeLength: 6,
  verificationCodeExpiryMinutes: 3,
  verificationCodeMaxAttempts: 5,

  // Rate Limiting
  loginMaxAttempts: 5,
  loginLockoutMinutes: 15,
  verificationCodeMaxRequestsPerHour: 3,

  // 세션 정책
  sessionDurationHours: 1,
  rememberMeDurationDays: 7,

  // 나이 제한
  minimumAge: 19,

  updatedAt: Timestamp
}
```

### 7.2 기본값
| 키 | 기본값 | 설명 |
|----|--------|------|
| `passwordMinLength` | `8` | 비밀번호 최소 길이 |
| `verificationCodeExpiryMinutes` | `3` | 인증코드 만료 시간 |
| `loginMaxAttempts` | `5` | 로그인 최대 시도 횟수 |
| `minimumAge` | `19` | 가입 최소 나이 |

---

## 8. 테스트 전략

### 8.1 단위 테스트
- **Server Actions**: `src/app/actions/__tests__/auth.test.ts`
- **Hooks**: `src/hooks/__tests__/useAuth.test.ts`
- **Validations**: `src/lib/validations/__tests__/auth.test.ts`

### 8.2 통합 테스트
- Firebase Emulators 사용
- `tests/integration/auth.integration.test.ts`

### 8.3 E2E 테스트
- Playwright 사용
- `tests/e2e/auth.e2e.test.ts`
  - 회원가입 플로우
  - 로그인 플로우
  - 비밀번호 재설정 플로우

---

## 9. 소셜 로그인 (Phase 1.5)

### 9.1 카카오 로그인
```typescript
// Firebase Custom Token 방식
// 1. Kakao OAuth 인증
// 2. Cloud Function에서 Custom Token 생성
// 3. Firebase Auth signInWithCustomToken

// functions/services/socialAuthService.ts
export async function createKakaoCustomToken(kakaoAccessToken: string) {
  // 1. 카카오 API로 사용자 정보 조회
  // 2. Firebase Admin SDK로 Custom Token 생성
  // 3. 신규 사용자면 customers 문서 생성
}
```

### 9.2 네이버 로그인
```typescript
// 카카오와 동일한 패턴
export async function createNaverCustomToken(naverAccessToken: string) {
  // 1. 네이버 API로 사용자 정보 조회
  // 2. Firebase Admin SDK로 Custom Token 생성
  // 3. 신규 사용자면 customers 문서 생성
}
```

---

## 10. 리스크 및 대안

| 리스크 | 영향 | 대안 |
|--------|------|------|
| 이메일 발송 실패 | High | SendGrid fallback, 재시도 로직 |
| OAuth Provider 장애 | Medium | 이메일 로그인으로 안내 |
| Rate Limit 우회 시도 | High | IP 기반 추가 제한, CAPTCHA |
| 인증코드 브루트포스 | High | 시도 횟수 제한, 계정 잠금 |

---

*문서 버전: 1.0*
*최종 수정: 2026-01-12*
