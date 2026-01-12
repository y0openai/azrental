# 01-PRD.md - 고객 인증 (Customer Auth)

> **Product Requirements Document**
> **작성일**: 2026-01-12
> **작성자**: Orchestrator Agent
> **상태**: Draft

---

## 1. 개요 (Overview)

### 1.1 기능 요약
> 고객이 이메일/비밀번호 또는 소셜 로그인(카카오, 네이버)을 통해 회원가입 및 로그인할 수 있는 인증 시스템입니다.

### 1.2 배경 및 목적

- **문제점**: 서비스 이용을 위해서는 고객 식별 및 인증이 필수적이며, 한국 시장에서 이메일 외 소셜 로그인 옵션이 필요함
- **기회**: 간편한 가입/로그인 경험으로 전환율 향상, 소셜 로그인을 통한 진입 장벽 감소
- **목표**: 안전하고 간편한 인증 시스템 구축, 가입 전환율 최대화

### 1.3 성공 지표 (Success Metrics)

| 지표 | 현재 | 목표 | 측정 방법 |
|------|------|------|----------|
| 가입 완료율 | N/A | 70% 이상 | 가입 시작 → 완료 비율 |
| 로그인 성공률 | N/A | 95% 이상 | 로그인 시도 → 성공 비율 |
| 소셜 로그인 비율 | N/A | 60% 이상 | 소셜 vs 이메일 가입 비율 |
| 이메일 인증 완료율 | N/A | 80% 이상 | 인증 요청 → 완료 비율 |

---

## 2. 사용자 스토리 (User Stories)

### 2.1 주요 사용자

- **신규 고객**: 서비스를 처음 이용하려는 사용자
- **기존 고객**: 이미 가입한 사용자
- **소셜 로그인 선호 사용자**: 빠른 가입/로그인을 원하는 사용자

### 2.2 사용자 스토리

#### 스토리 1: 이메일 회원가입
```
AS A 신규 방문자
I WANT 이메일과 비밀번호로 회원가입하고
SO THAT 서비스를 이용할 수 있다
```
- **사용자**: 소셜 로그인보다 이메일 가입을 선호하는 사용자
- **행동**: 이메일 입력 → 인증코드 확인 → 비밀번호 설정 → 개인정보 입력 → 약관 동의 → 가입 완료
- **결과**: 계정 생성 및 자동 로그인

#### 스토리 2: 소셜 로그인 (카카오/네이버)
```
AS A 빠른 가입을 원하는 사용자
I WANT 카카오 또는 네이버 계정으로 가입/로그인하고
SO THAT 복잡한 정보 입력 없이 바로 서비스를 이용할 수 있다
```
- **사용자**: 간편 로그인을 선호하는 사용자
- **행동**: 소셜 로그인 버튼 클릭 → OAuth 인증 → 추가 정보 입력(필요시) → 가입/로그인 완료
- **결과**: 계정 생성 또는 로그인 완료

#### 스토리 3: 로그인
```
AS A 기존 회원
I WANT 이메일/비밀번호로 로그인하고
SO THAT 내 계정으로 서비스를 이용할 수 있다
```
- **사용자**: 이미 가입한 고객
- **행동**: 이메일 입력 → 비밀번호 입력 → 로그인 버튼 클릭
- **결과**: 로그인 성공 및 대시보드/홈으로 리다이렉트

#### 스토리 4: 비밀번호 찾기
```
AS A 비밀번호를 잊은 사용자
I WANT 이메일을 통해 비밀번호를 재설정하고
SO THAT 다시 로그인할 수 있다
```
- **사용자**: 비밀번호를 분실한 사용자
- **행동**: 비밀번호 찾기 클릭 → 이메일 입력 → 재설정 링크 수신 → 새 비밀번호 설정
- **결과**: 비밀번호 변경 완료 및 로그인 가능

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 필수 기능 (Must Have)

#### 회원가입 (Signup)
- [ ] 이메일 입력 및 형식 검증
- [ ] 이메일 인증코드 발송 (6자리)
- [ ] 인증코드 확인 (3분 만료)
- [ ] 비밀번호 입력 (8자 이상, 대문자/숫자 포함)
- [ ] 비밀번호 확인 일치 검증
- [ ] 이름 입력 (필수)
- [ ] 전화번호 입력 (필수)
- [ ] 나이 입력 (만 19세 이상 제한)
- [ ] 성별 선택 (필수)
- [ ] 이용약관 동의 (필수)
- [ ] 개인정보처리방침 동의 (필수)
- [ ] 마케팅 수신 동의 (선택)
- [ ] 전체 동의 체크박스
- [ ] 가입 완료 후 자동 로그인

#### 로그인 (Login)
- [ ] 이메일 입력
- [ ] 비밀번호 입력
- [ ] 로그인 유지 체크박스 (Remember Me)
- [ ] 로그인 버튼
- [ ] 잘못된 자격 증명 에러 메시지
- [ ] 로그인 성공 시 리다이렉트 (홈 또는 이전 페이지)

#### 소셜 로그인 (OAuth) - Phase 1 제외 가능
- [ ] 카카오 로그인 버튼 (#FEE500)
- [ ] 네이버 로그인 버튼 (#00C73C)
- [ ] OAuth 리다이렉트 처리
- [ ] 신규 소셜 유저 추가 정보 수집 (이름, 전화번호, 나이, 성별)
- [ ] 기존 소셜 유저 자동 로그인

#### 비밀번호 찾기 (Password Reset)
- [ ] 이메일 입력 폼
- [ ] 비밀번호 재설정 이메일 발송
- [ ] 재설정 링크 클릭 → 새 비밀번호 입력 페이지
- [ ] 새 비밀번호 설정 및 확인

#### 로그아웃
- [ ] 로그아웃 버튼 (헤더/대시보드)
- [ ] 세션 종료 및 토큰 삭제
- [ ] 로그아웃 후 홈으로 리다이렉트

### 3.2 권장 기능 (Should Have)
- [ ] 비밀번호 강도 표시기
- [ ] 이메일 중복 실시간 체크
- [ ] 로그인 실패 횟수 제한 (5회)
- [ ] 계정 잠금 해제 이메일

### 3.3 선택 기능 (Nice to Have)
- [ ] 애플 로그인
- [ ] 구글 로그인
- [ ] 2단계 인증 (2FA)
- [ ] 세션 관리 (다른 기기에서 로그아웃)

---

## 4. 비기능 요구사항 (Non-Functional Requirements)

### 4.1 성능
- 인증 API 응답 시간: < 500ms
- 이메일 발송 시간: < 5초
- 동시 로그인 처리: 1000 req/s

### 4.2 보안
- 비밀번호 해싱: bcrypt (salt rounds: 10)
- JWT 토큰 만료: Access 1시간, Refresh 7일
- HTTPS 필수
- Rate Limiting: 로그인 시도 5회/분
- XSS/CSRF 방어
- 이메일 인증코드: 3분 만료, 1회 사용

### 4.3 접근성
- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 폼 필드 레이블 연결
- 에러 메시지 스크린 리더 호환

---

## 5. UI/UX 요구사항

### 5.1 화면 목록

| 화면명 | 설명 | 우선순위 |
|-------|------|---------|
| 로그인 페이지 | 이메일/비밀번호 + 소셜 로그인 | High |
| 회원가입 페이지 | 단계별 정보 입력 폼 | High |
| 비밀번호 찾기 | 이메일 입력 폼 | High |
| 비밀번호 재설정 | 새 비밀번호 입력 폼 | High |
| 소셜 추가정보 | 소셜 가입 시 추가 정보 수집 | Medium |

### 5.2 인터랙티브 와이어프레임

> **도구**: HTML/Tailwind 인터랙티브 프로토타입
> **위치**: `docs/wireframes/`

#### 프로토타입 링크
- **로그인**: `docs/wireframes/customer-login.html` ✅
- **회원가입**: `docs/wireframes/customer-signup.html` ✅

#### User Flow
```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│   랜딩/홈    │ ──▶ │   로그인      │ ──▶ │   대시보드   │
└──────────────┘     └───────────────┘     └──────────────┘
        │                   │
        │                   ▼
        │            ┌───────────────┐
        │            │  비밀번호찾기  │
        │            └───────────────┘
        │
        ▼
┌──────────────┐     ┌───────────────┐
│   회원가입    │ ──▶ │   이메일인증   │ ──▶ (가입완료)
└──────────────┘     └───────────────┘
```

#### 와이어프레임 검증 체크리스트
- [x] 로그인 화면 HTML 파일 생성 완료
- [x] 회원가입 화면 HTML 파일 생성 완료
- [x] 화면 간 이동 (링크) 동작 확인
- [x] Mobile First (375px) 레이아웃 확인
- [ ] PM/이해관계자 리뷰 완료
- [ ] 피드백 반영 완료

### 5.3 디자인 토큰 (from Design System)

#### 색상
- **Primary 500**: #2B6BE6 (기본 버튼)
- **Primary 700**: #154FB3 (버튼 호버)
- **Secondary 500**: #28A745 (확인 버튼)
- **Error**: #DC3545 (에러 메시지)
- **카카오**: #FEE500 (배경), #391B1B (텍스트)
- **네이버**: #00C73C (배경), #FFFFFF (텍스트)

#### 폼 요소
- Input 높이: 44px
- Input 보더: 1px solid Gray 300
- Input 포커스: 2px Primary 500 + 3px shadow
- Button 높이: 44px
- Border Radius: 8px

---

## 6. 제약사항 및 의존성

### 6.1 기술적 제약
- Firebase Authentication 사용
- Next.js 14+ App Router (서버 액션)
- 클라이언트 컴포넌트 최소화

### 6.2 외부 의존성
- **Firebase Auth**: 이메일/비밀번호, OAuth 인증
- **Firebase Functions**: 이메일 인증코드 발송
- **Kakao OAuth**: 카카오 개발자 앱 등록 필요
- **Naver OAuth**: 네이버 개발자 앱 등록 필요
- **SendGrid/Firebase Email**: 이메일 발송

### 6.3 일정 제약
- Phase 1 내 완료 필요
- 소셜 로그인은 Phase 1.5로 연기 가능

---

## 7. 범위 외 (Out of Scope)

> 이번 버전에서 **하지 않을** 것들

- 2단계 인증 (2FA)
- 애플/구글 로그인 (향후 추가)
- 소셜 계정 연동/해제
- 회원 탈퇴 (Phase 2)
- 프로필 사진 업로드 (Phase 2)
- 휴대폰 본인인증 (Pass 등)

---

## 8. 데이터 모델

### 8.1 Customer (Firestore)
```typescript
interface Customer {
  uid: string;              // Firebase Auth UID
  email: string;            // 이메일
  displayName: string;      // 표시 이름
  phone: string;            // 전화번호
  age: number;              // 나이
  gender: 'male' | 'female' | 'other';
  profileImage?: string;    // 프로필 이미지 URL

  // OAuth 정보
  provider: 'email' | 'kakao' | 'naver';
  providerId?: string;

  // 동의 내역
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  agreedMarketing: boolean;

  // 메타데이터
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;

  // 상태
  status: 'active' | 'suspended' | 'deleted';
}
```

### 8.2 API Endpoints (Next.js Server Actions)

```typescript
// 회원가입
'use server'
async function signUpWithEmail(data: SignUpData): Promise<Result>

// 이메일 인증코드 발송
async function sendVerificationCode(email: string): Promise<Result>

// 인증코드 확인
async function verifyCode(email: string, code: string): Promise<Result>

// 로그인
async function signInWithEmail(email: string, password: string): Promise<Result>

// 소셜 로그인
async function signInWithProvider(provider: 'kakao' | 'naver'): Promise<Result>

// 비밀번호 재설정
async function sendPasswordResetEmail(email: string): Promise<Result>
async function resetPassword(token: string, newPassword: string): Promise<Result>

// 로그아웃
async function signOut(): Promise<Result>
```

---

## 9. 에러 처리

### 9.1 에러 코드

| 코드 | 메시지 | 원인 |
|------|--------|------|
| `auth/email-already-in-use` | 이미 사용 중인 이메일입니다 | 중복 이메일 |
| `auth/invalid-email` | 유효하지 않은 이메일 형식입니다 | 이메일 형식 오류 |
| `auth/weak-password` | 비밀번호가 너무 약합니다 | 비밀번호 규칙 미충족 |
| `auth/wrong-password` | 비밀번호가 일치하지 않습니다 | 로그인 실패 |
| `auth/user-not-found` | 등록되지 않은 이메일입니다 | 존재하지 않는 계정 |
| `auth/code-expired` | 인증코드가 만료되었습니다 | 3분 초과 |
| `auth/invalid-code` | 잘못된 인증코드입니다 | 코드 불일치 |
| `auth/too-many-requests` | 잠시 후 다시 시도해주세요 | Rate limit 초과 |

### 9.2 사용자 피드백
- 실시간 입력 검증 (이메일 형식, 비밀번호 강도)
- 에러 메시지는 필드 하단에 빨간색으로 표시
- 성공 메시지는 초록색 토스트/알림

---

## 10. 승인

| 역할 | 이름 | 승인 일자 | 서명 |
|------|------|----------|------|
| PM | | | |
| Tech Lead | | | |

---

*문서 버전: 1.0*
*최종 수정: 2026-01-12*
