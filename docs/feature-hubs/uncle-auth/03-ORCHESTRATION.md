# 03-ORCHESTRATION.md - 아조씨 인증 (Uncle Auth) Task 분배

> **Agent Task Distribution Plan**
> **작성일**: 2026-01-13
> **작성자**: Orchestrator Agent
> **모드**: Wave Orchestration (🔴 Large)

---

## 1. 복잡도 분석

### 1.1 복잡도 점수 계산
```
영향 모듈 수: 5 × 0.3 = 1.5   (types, lib, actions, components, pages)
예상 일수: 3 × 0.2 = 0.6      (3일)
신규 API 수: 6 × 0.25 = 1.5   (saveDraft, uploadProfileImage, uploadIdCard, applyAsUncle, signInAsUncle, getApplicationStatus)
UI 화면 수: 8 × 0.15 = 1.2    (6-step signup + login + status)
외부 연동: 3 × 0.1 = 0.3      (Firebase Auth, Storage, Functions)
─────────────────────────
총 복잡도 점수: 5.1
```

### 1.2 복잡도 등급
| 복잡도 점수 | 등급 | Agent 수 | 이 기능 |
|------------|------|----------|--------|
| 1.0-2.0 | 🟢 Simple | 1 | |
| 2.1-3.5 | 🟡 Moderate | 2-3 | |
| 3.6-5.0 | 🟠 Complex | 3-4 | |
| 5.1+ | 🔴 Large | 5-8 | ✅ |

### 1.3 에이전트 할당
**결정**: 5명 에이전트 투입 (🔴 Large 기준)

| Agent | 역할 | 담당 영역 |
|-------|------|----------|
| Agent 1 | Backend Core | Firebase Admin, Server Actions, Storage |
| Agent 2 | Types & Validation | TypeScript 타입, Zod 스키마, 보안 규칙 |
| Agent 3 | Frontend Core | Hooks, Services, Context |
| Agent 4 | UI Components | 공통 UI, 폼 컴포넌트 |
| Agent 5 | Pages & Integration | 페이지 조립, 라우팅, 스타일링 |

> **참고**: Customer Auth 코드 재사용 최대화 (UI 컴포넌트, 패턴)

---

## 2. Wave 구조

```
Wave 0: Specification (완료)
├─ PRD 작성 ✅
├─ RFC 작성 ✅
└─ ORCHESTRATION 작성 ✅ (현재)

Wave 1: Foundation (병렬, 5명)
├─ Agent 1: Backend 인프라 구축
├─ Agent 2: Types & Validation
├─ Agent 3: Frontend Core 로직
├─ Agent 4: UI 컴포넌트
└─ Agent 5: 페이지 구조

Wave 2: Integration (순차)
├─ Mock 제거 → 실제 연결
├─ 6단계 폼 통합 테스트
└─ 버그 수정

Wave 3: Testing & Deploy (순차)
├─ E2E 테스트
├─ Staging 배포
└─ 검증

예상 총 소요: 12-15시간 (병렬로 단축)
```

---

## 3. Wave 1: Foundation (병렬)

### 3.1 Agent 1: Backend Core

**담당 영역**: Firebase Admin, Server Actions, Storage 설정

#### Task 1.1: Storage 유틸리티 구현
- **설명**: Firebase Storage 업로드/삭제 유틸리티
- **산출물**: `src/lib/firebase/storage.ts`
- **예상 시간**: 45분
- **의존성**: 없음

#### Task 1.2: Server Actions 구현 (Part 1 - 이미지)
- **설명**: 이미지 업로드 관련 Server Actions
- **산출물**: `src/app/actions/uncle-auth.ts`
  - `uploadProfileImage`
  - `uploadIdCard`
  - `removeProfileImage`
- **예상 시간**: 1.5시간
- **의존성**: Task 1.1

#### Task 1.3: Server Actions 구현 (Part 2 - 인증)
- **설명**: 인증/신청 관련 Server Actions
- **산출물**: `src/app/actions/uncle-auth.ts` (추가)
  - `saveDraft`
  - `loadDraft`
  - `applyAsUncle`
  - `signInAsUncle`
  - `getApplicationStatus`
  - `sendUnclePasswordResetEmail`
- **예상 시간**: 2시간
- **의존성**: Task 1.1

#### Task 1.4: Policy Config 설정
- **설명**: 아조씨 인증 정책 설정
- **산출물**: `policy_configs/uncle-auth` 문서 (Firestore Console)
- **예상 시간**: 15분
- **의존성**: 없음

---

### 3.2 Agent 2: Types & Validation

**담당 영역**: TypeScript 타입, Zod 스키마, Firestore/Storage 규칙

#### Task 2.1: Uncle 타입 정의
- **설명**: Uncle, UncleApplication 인터페이스
- **산출물**: `src/types/uncle.ts`
- **예상 시간**: 45분
- **의존성**: 없음

#### Task 2.2: types/index.ts 업데이트
- **설명**: 타입 re-export
- **산출물**: `src/types/index.ts` 업데이트
- **예상 시간**: 10분
- **의존성**: Task 2.1

#### Task 2.3: Zod Validation 스키마
- **설명**: 6단계 폼 검증 스키마
- **산출물**: `src/lib/validations/uncle-auth.ts`
- **예상 시간**: 1시간
- **의존성**: Task 2.1

#### Task 2.4: Firestore Security Rules 업데이트
- **설명**: uncles, uncle_applications 컬렉션 규칙
- **산출물**: `firestore.rules` 업데이트
- **예상 시간**: 30분
- **의존성**: Task 2.1

#### Task 2.5: Storage Security Rules 업데이트
- **설명**: 이미지 업로드 보안 규칙
- **산출물**: `storage.rules` 업데이트
- **예상 시간**: 20분
- **의존성**: 없음

---

### 3.3 Agent 3: Frontend Core

**담당 영역**: Hooks, Services, Context

#### Task 3.1: Uncle Auth Service 구현
- **설명**: Server Actions 래퍼 + 에러 핸들링
- **산출물**: `src/services/uncleAuthService.ts`
- **예상 시간**: 1시간
- **의존성**: 없음 (Mock 사용)

#### Task 3.2: useUncleAuth Hook 구현
- **설명**: 아조씨 인증 상태 관리 Hook
- **산출물**: `src/hooks/useUncleAuth.ts`
- **예상 시간**: 1.5시간
- **의존성**: Task 3.1

#### Task 3.3: Uncle Auth Context/Provider 구현
- **설명**: 전역 아조씨 인증 상태 관리
- **산출물**: `src/contexts/UncleAuthContext.tsx`
- **예상 시간**: 45분
- **의존성**: Task 3.2

#### Task 3.4: useMultiStepForm Hook 구현
- **설명**: 멀티스텝 폼 상태 관리 (재사용 가능)
- **산출물**: `src/hooks/useMultiStepForm.ts`
- **예상 시간**: 45분
- **의존성**: 없음

---

### 3.4 Agent 4: UI Components

**담당 영역**: 공통 UI, 폼 컴포넌트

#### Task 4.1: 신규 공통 UI 컴포넌트
- **설명**: Uncle Auth에 필요한 신규 UI 컴포넌트
- **산출물**:
  - `src/components/ui/Textarea.tsx`
  - `src/components/ui/FileUpload.tsx`
  - `src/components/ui/ProgressBar.tsx`
  - `src/components/ui/index.ts` 업데이트
- **예상 시간**: 1.5시간
- **의존성**: 없음

#### Task 4.2: 프로필 이미지 업로드 컴포넌트
- **설명**: 드래그앤드롭, 미리보기, 메인 사진 지정
- **산출물**: `src/components/uncle-auth/ProfileImageUpload.tsx`
- **예상 시간**: 1.5시간
- **의존성**: Task 4.1

#### Task 4.3: 신분증 업로드 컴포넌트
- **설명**: 신분증 업로드 + 안심 메시지
- **산출물**: `src/components/uncle-auth/IdCardUpload.tsx`
- **예상 시간**: 45분
- **의존성**: Task 4.1

#### Task 4.4: 전문성 태그 컴포넌트
- **설명**: 토글 버튼 그리드 (복수 선택)
- **산출물**: `src/components/uncle-auth/ExpertiseTags.tsx`
- **예상 시간**: 45분
- **의존성**: 없음

#### Task 4.5: 주간 일정 컴포넌트
- **설명**: 요일 × 시간대 그리드 (클릭 선택)
- **산출물**: `src/components/uncle-auth/WeeklySchedule.tsx`
- **예상 시간**: 1시간
- **의존성**: 없음

#### Task 4.6: 신청 상태 컴포넌트
- **설명**: 상태 배지, 메시지, 반려 사유
- **산출물**: `src/components/uncle-auth/ApplicationStatus.tsx`
- **예상 시간**: 30분
- **의존성**: 없음

---

### 3.5 Agent 5: Pages & Integration

**담당 영역**: 페이지 조립, 스텝 컴포넌트, 라우팅

#### Task 5.1: 6단계 스텝 컴포넌트
- **설명**: 각 단계별 폼 컴포넌트
- **산출물**:
  - `src/components/uncle-auth/BasicInfoStep.tsx`
  - `src/components/uncle-auth/ExpertiseStep.tsx`
  - `src/components/uncle-auth/PricingStep.tsx`
  - `src/components/uncle-auth/AvailabilityStep.tsx`
  - `src/components/uncle-auth/VerificationStep.tsx`
  - `src/components/uncle-auth/AgreementStep.tsx`
- **예상 시간**: 2.5시간
- **의존성**: Task 4.1-4.5 (UI 컴포넌트)

#### Task 5.2: Uncle Signup Form 조립
- **설명**: 멀티스텝 폼 메인 컴포넌트
- **산출물**: `src/components/uncle-auth/UncleSignupForm.tsx`
- **예상 시간**: 1시간
- **의존성**: Task 5.1

#### Task 5.3: Uncle Login Form 컴포넌트
- **설명**: 아조씨 전용 로그인 폼 (빨간 테마)
- **산출물**: `src/components/uncle-auth/UncleLoginForm.tsx`
- **예상 시간**: 45분
- **의존성**: 없음 (Customer LoginForm 참고)

#### Task 5.4: Uncle Auth Pages 구현
- **설명**: 페이지 레이아웃 및 라우팅
- **산출물**:
  - `src/app/(uncle-auth)/layout.tsx`
  - `src/app/(uncle-auth)/uncle-signup/page.tsx`
  - `src/app/(uncle-auth)/uncle-login/page.tsx`
  - `src/app/(uncle-auth)/uncle-status/page.tsx`
  - `src/app/(uncle-auth)/uncle-forgot-password/page.tsx`
- **예상 시간**: 1.5시간
- **의존성**: Task 5.2, 5.3

#### Task 5.5: 컴포넌트 index 파일 생성
- **설명**: 컴포넌트 re-export
- **산출물**: `src/components/uncle-auth/index.ts`
- **예상 시간**: 15분
- **의존성**: Task 5.1-5.4

---

## 4. Wave 2: Integration (순차)

### 4.1 Mock 제거 및 실제 연결
- **담당**: Orchestrator
- **설명**: Agent 1-5 결과물 통합
- **작업**:
  - Mock 데이터 제거
  - Server Actions ↔ Frontend 연결
  - 이미지 업로드 실제 연동
  - 에러 핸들링 확인
- **예상 시간**: 1.5시간

### 4.2 6단계 폼 통합 테스트
- **담당**: Orchestrator
- **설명**: 전체 신청 플로우 검증
- **작업**:
  - Step 1-6 순차 입력 테스트
  - 임시 저장/불러오기 테스트
  - 이미지 업로드 테스트
  - 유효성 검사 테스트
  - 제출 및 상태 확인 테스트
- **예상 시간**: 1.5시간

### 4.3 버그 수정
- **담당**: Orchestrator
- **설명**: 발견된 버그 수정
- **예상 시간**: 1시간

---

## 5. Wave 3: Testing & Deploy (순차)

### 5.1 E2E 테스트
- **담당**: Orchestrator
- **설명**: Playwright E2E 테스트
- **산출물**: `e2e/uncle-auth.spec.ts`
- **테스트 케이스**:
  - 6단계 신청 완료 플로우
  - 이미지 업로드 플로우
  - 로그인 (승인된 계정)
  - 로그인 (미승인 계정 → 상태 페이지)
  - 상태 확인 플로우
  - 비밀번호 재설정 플로우
- **예상 시간**: 1.5시간

### 5.2 Staging 배포
- **담당**: Orchestrator
- **설명**: Firebase Hosting 배포 및 검증
- **작업**:
  - `npm run build` 성공 확인
  - `npm run lint` 통과 확인
  - Firebase 배포
  - 실제 환경 테스트
- **예상 시간**: 30분

### 5.3 최종 검증 및 문서화
- **담당**: Orchestrator
- **설명**: 최종 점검 및 .handoff.md 업데이트
- **작업**:
  - 체크리스트 완료 확인
  - CLAUDE.md 상태 업데이트
  - .handoff.md 업데이트
  - git commit & push
- **예상 시간**: 30분

---

## 6. 의존성 다이어그램

```
Wave 1 (병렬 작업):
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Agent 1        Agent 2        Agent 3        Agent 4        Agent 5       │
│  (Backend)      (Types)        (Core)         (UI)           (Pages)       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   ┌──────────┐    │
│  │1.1 Store │  │2.1 Types │  │3.1 Svc   │  │4.1 UI    │   │5.1 Steps │    │
│  │    ↓     │  │    ↓     │  │    ↓     │  │    ↓     │   │    ↓     │    │
│  │1.2 Image │  │2.2 Index │  │3.2 Hook  │  │4.2 Prof  │   │5.2 Form  │    │
│  │    ↓     │  │    ↓     │  │    ↓     │  │4.3 ID    │   │    ↓     │    │
│  │1.3 Auth  │  │2.3 Zod   │  │3.3 Ctx   │  │4.4 Tags  │   │5.3 Login │    │
│  │    ↓     │  │    ↓     │  │    ↓     │  │4.5 Sched │   │    ↓     │    │
│  │1.4 Policy│  │2.4 Rules │  │3.4 Multi │  │4.6 Status│   │5.4 Pages │    │
│  └──────────┘  │    ↓     │  └──────────┘  └──────────┘   │    ↓     │    │
│                │2.5 Store │                               │5.5 Index │    │
│                └──────────┘                               └──────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
Wave 2 (통합):
┌─────────────────────────────────────────────────────────────────────────────┐
│  Orchestrator                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Mock 제거 → 실제 연결 → 6단계 통합 테스트 → 버그 수정                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
Wave 3 (배포):
┌─────────────────────────────────────────────────────────────────────────────┐
│  Orchestrator                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ E2E 테스트 → Staging 배포 → 최종 검증                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Mock 인터페이스 정의

### 7.1 Backend Mock (Agent 3, 4, 5가 사용)
```typescript
// Agent 3, 4, 5가 Agent 1 완료 전 사용
export const mockUncleAuthActions = {
  uploadProfileImage: async (formData: FormData) => ({
    success: true,
    data: {
      url: 'https://mock-storage.com/profile-1.jpg',
      index: 0
    }
  }),

  uploadIdCard: async (formData: FormData) => ({
    success: true,
    data: { url: 'https://mock-storage.com/id-card.jpg' }
  }),

  saveDraft: async (email: string, step: number, data: any) => ({
    success: true,
    applicationId: 'mock-app-id'
  }),

  applyAsUncle: async (data: UncleSignupData) => ({
    success: true,
    uid: 'mock-uncle-uid'
  }),

  signInAsUncle: async (email: string, password: string) => ({
    success: email === 'approved@test.com',
    user: email === 'approved@test.com' ? {
      uid: 'mock-uncle-uid',
      email,
      displayName: '테스트 아조씨',
      status: 'approved'
    } : undefined,
    status: email === 'pending@test.com' ? 'pending' : 'approved',
    error: email !== 'approved@test.com' ? '승인되지 않은 계정입니다' : undefined
  }),

  getApplicationStatus: async (email: string) => ({
    success: true,
    data: {
      status: 'pending',
      submittedAt: new Date(),
      rejectionReason: undefined
    }
  })
};
```

### 7.2 Hook Mock (Agent 5가 사용)
```typescript
// Agent 5가 Agent 3 완료 전 사용
export const mockUseUncleAuth = () => ({
  uncle: null,
  loading: false,
  error: null,
  applicationStatus: null,

  saveDraft: jest.fn().mockResolvedValue({ success: true }),
  loadDraft: jest.fn().mockResolvedValue({ success: true, data: {} }),
  apply: jest.fn().mockResolvedValue({ success: true }),

  uploadProfileImage: jest.fn().mockResolvedValue({
    success: true,
    data: { url: 'https://mock.com/image.jpg' }
  }),
  uploadIdCard: jest.fn().mockResolvedValue({
    success: true,
    data: { url: 'https://mock.com/id.jpg' }
  }),
  removeProfileImage: jest.fn().mockResolvedValue({ success: true }),

  signIn: jest.fn().mockResolvedValue({ success: true }),
  signOut: jest.fn().mockResolvedValue(undefined),

  checkStatus: jest.fn().mockResolvedValue({
    success: true,
    data: { status: 'pending' }
  }),

  sendPasswordReset: jest.fn().mockResolvedValue({ success: true })
});
```

---

## 8. 완료 기준 (Definition of Done)

### 8.1 Wave 1 완료 조건
- [ ] Agent 1: 모든 Server Actions 구현 및 타입 안전
- [ ] Agent 2: 타입, Zod 스키마, 보안 규칙 완료
- [ ] Agent 3: useUncleAuth Hook 동작 확인 (Mock 환경)
- [ ] Agent 4: 모든 UI 컴포넌트 렌더링 확인
- [ ] Agent 5: 모든 페이지 라우팅 및 렌더링 확인

### 8.2 Wave 2 완료 조건
- [ ] Mock 제거 완료
- [ ] 6단계 신청 플로우 동작
- [ ] 이미지 업로드 동작 (프로필 + 신분증)
- [ ] 로그인 플로우 동작 (승인/미승인 분기)
- [ ] 에러 핸들링 정상 동작

### 8.3 Wave 3 완료 조건
- [ ] `npm run build` 성공
- [ ] `npm run lint` 통과
- [ ] E2E 테스트 통과 (최소 80%)
- [ ] Firebase Hosting 배포 완료
- [ ] 실제 환경 검증 완료

---

## 9. 일정 요약

| Wave | Agent | Task | 예상 시간 |
|------|-------|------|----------|
| 1 | Agent 1 | Task 1.1-1.4 | 4.5시간 |
| 1 | Agent 2 | Task 2.1-2.5 | 2.75시간 |
| 1 | Agent 3 | Task 3.1-3.4 | 4시간 |
| 1 | Agent 4 | Task 4.1-4.6 | 6시간 |
| 1 | Agent 5 | Task 5.1-5.5 | 6시간 |
| 2 | Orchestrator | 통합 | 4시간 |
| 3 | Orchestrator | 테스트/배포 | 2.5시간 |

**Wave 1 (병렬)**: ~6시간 (가장 긴 Agent 기준)
**Wave 2+3 (순차)**: ~6.5시간
**총 예상 시간**: ~12.5시간

---

## 10. Customer Auth 코드 재사용

### 10.1 재사용 가능한 컴포넌트
| 컴포넌트 | 위치 | 재사용 방법 |
|---------|------|-------------|
| Input | `src/components/ui/Input.tsx` | 그대로 사용 |
| Button | `src/components/ui/Button.tsx` | 테마 색상만 변경 |
| Checkbox | `src/components/ui/Checkbox.tsx` | 그대로 사용 |
| PasswordStrengthIndicator | `src/components/auth/` | 복사 후 수정 또는 공통화 |
| AgreementCheckboxes | `src/components/auth/` | 패턴 참고 |

### 10.2 재사용 가능한 로직
| 로직 | 위치 | 재사용 방법 |
|------|------|-------------|
| Firebase Admin | `src/lib/firebase/admin.ts` | 그대로 사용 |
| 비밀번호 검증 | `src/lib/validations/auth.ts` | import하여 사용 |
| 이메일 검증 | `src/lib/validations/auth.ts` | import하여 사용 |

---

## 11. 리스크 및 대응

| 리스크 | 영향 | 확률 | 대응 |
|--------|------|------|------|
| 이미지 업로드 실패 | High | Medium | 재시도 로직, 오류 메시지 |
| 6단계 폼 복잡성 | High | Medium | 단계별 유효성 검사, 임시 저장 |
| Storage 보안 규칙 | High | Low | 테스트 환경에서 충분히 검증 |
| 타입 불일치 | Medium | Medium | Mock 인터페이스 사전 정의 |
| 관리자 심사 부재 | Medium | High | Phase 1은 수동 Firestore 처리 |

---

## 12. PM 승인 요청

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   📋 Uncle Auth Wave Orchestration Plan                         │
│                                                                 │
│   복잡도: 5.1 (🔴 Large)                                        │
│   에이전트: 5명                                                 │
│   Wave 수: 3개 (Foundation → Integration → Deploy)             │
│   예상 시간: 12.5시간                                           │
│                                                                 │
│   ⚠️ 참고:                                                      │
│   - 관리자 심사 UI는 Phase 2로 연기                            │
│   - Phase 1에서는 수동 Firestore 처리                          │
│   - Customer Auth 코드 최대 재사용                             │
│                                                                 │
│   승인 후 Wave 1 병렬 실행을 시작합니다.                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

승인하시겠습니까? [Y/N]
```

---

*문서 버전: 1.0*
*최종 수정: 2026-01-13*
