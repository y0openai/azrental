# 01-PRD.md - 아조씨 인증 (Uncle Auth)

> **Product Requirements Document**
> **작성일**: 2026-01-12
> **작성자**: Orchestrator Agent
> **상태**: Draft

---

## 1. 개요 (Overview)

### 1.1 기능 요약
> 아조씨(서비스 제공자)가 신원 검증을 포함한 가입 과정을 거쳐 플랫폼에서 활동할 수 있도록 하는 공급자 인증 시스템입니다.

### 1.2 배경 및 목적

- **문제점**: 고객 신뢰 확보를 위해 아조씨에 대한 철저한 신원 검증이 필수적이며, 단순 회원가입으로는 부족함
- **기회**: 검증된 아조씨만 활동하게 하여 플랫폼 신뢰도 및 안전성 확보
- **목표**: 안전한 신원 검증 프로세스 구축, 양질의 아조씨 공급자 확보

### 1.3 성공 지표 (Success Metrics)

| 지표 | 현재 | 목표 | 측정 방법 |
|------|------|------|----------|
| 신청 완료율 | N/A | 60% 이상 | 신청 시작 → 제출 완료 비율 |
| 승인율 | N/A | 80% 이상 | 신청 → 승인 비율 |
| 승인 소요 시간 | N/A | 3-5일 | 신청 → 승인 평균 일수 |
| 검증 통과율 | N/A | 95% 이상 | 신원확인 통과 비율 |

---

## 2. 사용자 스토리 (User Stories)

### 2.1 주요 사용자

- **아조씨 지원자**: 서비스 제공자로 활동하려는 40세 이상 남성
- **승인된 아조씨**: 신원 검증을 완료한 활동 중인 아조씨
- **플랫폼 관리자**: 아조씨 신청을 심사하는 관리자

### 2.2 사용자 스토리

#### 스토리 1: 아조씨 신청
```
AS A 경험을 나누고 싶은 중년 남성
I WANT 아조씨로 신청하여 신원 검증을 받고
SO THAT 플랫폼에서 고객을 만나 서비스를 제공할 수 있다
```
- **사용자**: 40세 이상 남성, 은퇴자 또는 경력자
- **행동**: 기본정보 입력 → 전문성 선택 → 요금 설정 → 일정 설정 → 신원 확인 서류 제출 → 동의 → 신청
- **결과**: 신청 완료, 심사 대기 상태

#### 스토리 2: 아조씨 로그인
```
AS A 승인된 아조씨
I WANT 아조씨 전용 계정으로 로그인하고
SO THAT 예약 관리 및 고객과 소통할 수 있다
```
- **사용자**: 신원 검증 완료된 아조씨
- **행동**: 이메일/비밀번호 입력 → 로그인
- **결과**: 아조씨 대시보드로 이동

#### 스토리 3: 신청 상태 확인
```
AS A 신청을 완료한 지원자
I WANT 내 신청 상태를 확인하고
SO THAT 승인 여부를 알 수 있다
```
- **사용자**: 신청 완료 후 대기 중인 지원자
- **행동**: 로그인 시도 → 상태 확인 페이지 표시
- **결과**: 심사 중/승인/반려 상태 확인

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 필수 기능 (Must Have)

#### 아조씨 신청 (Uncle Signup)

##### Step 1: 기본 정보
- [ ] 이름 입력 (필수)
- [ ] 나이 입력 (만 40세 이상 제한)
- [ ] 자기소개 텍스트 (필수, 100자 이상)
- [ ] 프로필 사진 업로드 (최소 1장, 최대 5장)
  - [ ] 드래그 앤 드롭 업로드
  - [ ] 메인 사진 지정
  - [ ] JPG/PNG, 최대 5MB

##### Step 2: 전문성 선택
- [ ] 전문성 태그 복수 선택 (최소 1개)
  - 직업 상담, 감정 상담, 여행 동반, 취업 멘토, 식사 동반, 문화 생활 등
- [ ] 선택/해제 토글 UI

##### Step 3: 요금 설정
- [ ] 시간당 요금 입력 (원/시간)
- [ ] 짧은 소개문 작성 (고객에게 표시)

##### Step 4: 일정 설정
- [ ] 주간 가용 시간 선택 (요일 × 시간대)
  - 시간대: 오전/오후/저녁
  - 요일: 월~일
- [ ] 클릭으로 선택/해제

##### Step 5: 신원 확인
- [ ] 주민등록번호 입력 (마스킹, 확인용)
- [ ] 휴대폰 번호 입력 (필수)
- [ ] 이메일 입력 (필수)
- [ ] 비밀번호 설정 (필수)
- [ ] 신분증 사진 업로드 (필수)
  - 주민등록증, 운전면허증, 여권 중 1개
  - 안심 메시지: "확인 후 즉시 삭제"

##### Step 6: 동의 및 제출
- [ ] 이용약관 동의 (필수)
- [ ] 개인정보처리방침 동의 (필수)
- [ ] 아조씨 행동규칙 동의 (필수)
- [ ] 신청하기 버튼
- [ ] 취소 버튼 (홈으로 이동)

#### 아조씨 로그인 (Uncle Login)
- [ ] 이메일 입력
- [ ] 비밀번호 입력
- [ ] 로그인 유지 체크박스
- [ ] 로그인 버튼 (빨간색 테마: #DC2626)
- [ ] 비밀번호 찾기 링크
- [ ] 아조씨 신청 링크
- [ ] 고객 로그인 링크
- [ ] 미승인 상태 접근 시 대기 화면 표시

#### 신청 상태 관리
- [ ] 신청 상태: pending → under_review → approved/rejected
- [ ] 상태별 안내 메시지
- [ ] 승인 시 이메일/SMS 알림
- [ ] 반려 시 사유 안내

### 3.2 권장 기능 (Should Have)
- [ ] 신청 중간 저장 (임시 저장)
- [ ] 프로필 미리보기
- [ ] 요금 권장 범위 안내
- [ ] 반려 시 재신청 기능

### 3.3 선택 기능 (Nice to Have)
- [ ] 영상 면접 예약 시스템
- [ ] 배경 조회 외부 API 연동
- [ ] 자동 OCR 신분증 인식
- [ ] 신청 진행률 표시 (Progress Bar)

---

## 4. 비기능 요구사항 (Non-Functional Requirements)

### 4.1 성능
- 이미지 업로드: 5MB 이내, 3초 이내 완료
- 폼 제출 응답: < 2초
- 동시 신청 처리: 100 req/s

### 4.2 보안
- 신분증 이미지: 암호화 저장 (AES-256)
- 심사 완료 후 신분증 이미지 영구 삭제
- 주민등록번호: 마스킹 표시, 해싱 저장
- HTTPS 필수
- 관리자만 심사 데이터 접근

### 4.3 접근성
- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 파일 업로드 대안 제공 (버튼 클릭)

### 4.4 개인정보 보호
- 개인정보 최소 수집 원칙
- 목적 외 사용 금지
- 신분증 이미지 저장 기간: 심사 완료까지 (최대 7일)
- 심사 완료 후 신분증 이미지 완전 삭제

---

## 5. UI/UX 요구사항

### 5.1 화면 목록

| 화면명 | 설명 | 우선순위 |
|-------|------|---------|
| 아조씨 신청 페이지 | 멀티 섹션 폼 | High |
| 아조씨 로그인 페이지 | 전용 로그인 (빨간 테마) | High |
| 신청 대기 페이지 | 심사 중 상태 표시 | High |
| 반려 안내 페이지 | 반려 사유 및 재신청 안내 | Medium |

### 5.2 인터랙티브 와이어프레임

> **도구**: HTML/Tailwind 인터랙티브 프로토타입
> **위치**: `docs/wireframes/`

#### 프로토타입 링크
- **신청**: `docs/wireframes/uncle-signup.html` ✅
- **로그인**: `docs/wireframes/uncle-login.html` ✅

#### User Flow
```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│   랜딩 페이지  │ ──▶ │  아조씨 신청   │ ──▶ │   신청 완료   │
│ (아조씨 되기)  │     │   (6 Steps)   │     │   (대기 중)   │
└──────────────┘     └───────────────┘     └──────────────┘
                                                   │
                            ┌──────────────────────┤
                            ▼                      ▼
                     ┌──────────────┐     ┌──────────────┐
                     │    승인      │     │    반려      │
                     │ (로그인 가능) │     │ (재신청 안내) │
                     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐     ┌──────────────┐
                     │ 아조씨 로그인 │ ──▶ │ 아조씨 대시보드│
                     └──────────────┘     └──────────────┘
```

#### 와이어프레임 검증 체크리스트
- [x] 아조씨 신청 화면 HTML 파일 생성 완료
- [x] 아조씨 로그인 화면 HTML 파일 생성 완료
- [x] 화면 간 이동 (링크) 동작 확인
- [x] Mobile First (375px) 레이아웃 확인
- [ ] PM/이해관계자 리뷰 완료
- [ ] 피드백 반영 완료

### 5.3 디자인 토큰 (from Design System)

#### 아조씨 전용 색상 (Uncle Theme)
- **Uncle Primary**: #DC2626 (빨간색 - 구분 목적)
- **Uncle Primary Hover**: #B91C1C
- **Uncle Light**: #FEE2E2 (배경)
- **Uncle Dark**: #991B1B (텍스트)

#### 고객 vs 아조씨 UI 구분
| 요소 | 고객 | 아조씨 |
|------|------|--------|
| Primary Color | #2B6BE6 (파랑) | #DC2626 (빨강) |
| 버튼 | 파란 버튼 | 빨간 버튼 |
| 포커스 | 파란 테두리 | 빨간 테두리 |
| 배지 | 파란 배지 | 빨간 배지 |

#### 폼 요소
- Input 높이: 44px
- Textarea 최소 높이: 100px
- 파일 업로드 영역: Dashed border, hover highlight
- 전문성 버튼: 토글 스타일 (selected: filled)

---

## 6. 제약사항 및 의존성

### 6.1 기술적 제약
- Firebase Authentication 사용
- Firebase Storage: 이미지 업로드
- Next.js 14+ App Router
- 클라이언트 컴포넌트 필요 (파일 업로드, 폼 인터랙션)

### 6.2 외부 의존성
- **Firebase Auth**: 이메일/비밀번호 인증
- **Firebase Storage**: 프로필 사진, 신분증 이미지 저장
- **Firebase Functions**: 신청 처리, 알림 발송
- **SendGrid/Firebase Email**: 승인/반려 알림 이메일

### 6.3 일정 제약
- Phase 1 내 완료 필요
- 관리자 심사 UI는 Phase 2로 연기 가능 (수동 Firestore 처리)

---

## 7. 범위 외 (Out of Scope)

> 이번 버전에서 **하지 않을** 것들

- 관리자 심사 대시보드 (Phase 2)
- 영상 면접 기능
- 자동 배경 조회 API 연동
- OCR 신분증 자동 인식
- 아조씨 등급 시스템
- 수수료 정산 시스템

---

## 8. 데이터 모델

### 8.1 Uncle (Firestore)
```typescript
interface Uncle {
  uid: string;              // Firebase Auth UID
  email: string;            // 이메일
  displayName: string;      // 표시 이름
  phone: string;            // 전화번호
  age: number;              // 나이 (40+)

  // 프로필 정보
  bio: string;              // 자기소개
  shortIntro: string;       // 짧은 소개문
  profileImages: string[];  // 프로필 이미지 URLs (최대 5장)
  mainImageIndex: number;   // 메인 이미지 인덱스

  // 전문성 및 서비스
  expertise: string[];      // 전문성 태그
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
```

### 8.2 API Endpoints (Next.js Server Actions)

```typescript
// 아조씨 신청
'use server'
async function applyAsUncle(data: UncleApplicationData): Promise<Result>

// 이미지 업로드
async function uploadProfileImage(file: File): Promise<{ url: string }>
async function uploadIdCard(file: File): Promise<{ url: string }>

// 로그인
async function signInAsUncle(email: string, password: string): Promise<Result>

// 신청 상태 확인
async function getApplicationStatus(uid: string): Promise<ApplicationStatus>

// 비밀번호 재설정
async function sendPasswordResetEmail(email: string): Promise<Result>

// 관리자용 (Phase 2)
async function approveUncle(uid: string): Promise<Result>
async function rejectUncle(uid: string, reason: string): Promise<Result>
```

---

## 9. 신청 프로세스 상세

### 9.1 신청 상태 흐름
```
[신청 전] → [pending] → [under_review] → [approved] / [rejected]
                                              ↓
                                        [재신청 가능]
```

### 9.2 심사 기준 (관리자용)
| 항목 | 기준 | 필수 |
|------|------|------|
| 나이 | 만 40세 이상 | ✅ |
| 프로필 사진 | 얼굴 식별 가능, 부적절 이미지 없음 | ✅ |
| 자기소개 | 100자 이상, 성실한 내용 | ✅ |
| 신분증 | 본인 확인 가능, 유효 기간 내 | ✅ |
| 전문성 | 최소 1개 선택 | ✅ |
| 요금 | 합리적 범위 (20,000~100,000원) | ⚠️ |

### 9.3 반려 사유 예시
- 신분증 불일치 또는 판독 불가
- 프로필 사진 부적절 (선정적, 폭력적 등)
- 자기소개 내용 미흡 또는 부적절
- 나이 미충족 (40세 미만)
- 연락처 확인 불가

---

## 10. 에러 처리

### 10.1 에러 코드

| 코드 | 메시지 | 원인 |
|------|--------|------|
| `uncle/email-already-in-use` | 이미 등록된 이메일입니다 | 중복 이메일 |
| `uncle/age-requirement` | 만 40세 이상만 신청 가능합니다 | 나이 미충족 |
| `uncle/image-too-large` | 이미지 크기가 5MB를 초과합니다 | 파일 크기 초과 |
| `uncle/invalid-id-card` | 유효하지 않은 신분증입니다 | 신분증 판독 불가 |
| `uncle/not-approved` | 아직 승인되지 않은 계정입니다 | 미승인 로그인 시도 |
| `uncle/account-suspended` | 활동 정지된 계정입니다 | 정지 계정 로그인 |
| `uncle/application-rejected` | 신청이 반려되었습니다 | 반려된 신청 |

### 10.2 사용자 피드백
- 각 섹션별 유효성 검사 (필수 항목 누락 시 강조)
- 이미지 업로드 진행률 표시
- 신청 완료 후 확인 메시지 및 다음 단계 안내

---

## 11. 가이드라인 (신청자용)

### 11.1 신청 가이드라인
- 신청자는 만 40세 이상이어야 합니다
- 정직하고 명확한 정보를 제공해주세요
- 신원 확인 과정을 거치게 됩니다 (3-5일 소요)
- 승인 후 즉시 고객 예약을 받을 수 있습니다
- 이용약관 위반 시 계정이 제한될 수 있습니다

### 11.2 행동 규칙 (Code of Conduct)
- 고객에게 성실하고 예의 바르게 대합니다
- 신체 접촉, 연애/성인 서비스는 엄격히 금지됩니다
- 예약 시간을 준수하고, 불가피한 취소는 사전에 알립니다
- 고객의 개인정보를 보호합니다
- 플랫폼 외부 거래는 금지됩니다

---

## 12. 승인

| 역할 | 이름 | 승인 일자 | 서명 |
|------|------|----------|------|
| PM | | | |
| Tech Lead | | | |

---

*문서 버전: 1.0*
*최종 수정: 2026-01-12*
