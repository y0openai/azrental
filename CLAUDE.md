# 아조씨 렌탈 프로젝트 - Agent Handoff Reference

> **Root Anchor**: 이 문서는 아조씨 렌탈 프로젝트의 단일 진실 공급원입니다.
> **Date**: 2026-01-12
> **Version**: 5.0 (Wave Orchestration 통합)

**Project**: Korean "아조씨 렌탈" (Ajoasi Rental) - Two-sided marketplace connecting middle-aged men ("아조씨") with customers seeking emotional support, advice, and companionship.

**Status**: Phase 0 (Foundation) ✅ COMPLETE | Phase 1 (Planning) ✅ COMPLETE | Phase 2 (Development) 🔄 READY TO START

---

## 🚀 신규 에이전트 온보딩 프로토콜

**IMPORTANT**: 신규 에이전트는 **Step 0**부터 순서대로 진행해야 합니다.

---

### Step 0: 프로젝트 유형 선택

**에이전트 행동**: CLAUDE.md를 읽은 직후, **반드시** 아래 질문을 먼저 출력하세요:

```
🎯 이 세션에서 수행할 작업을 선택해주세요:

[A] 🚀 신규 기능 개발 - Wave Orchestration으로 병렬 개발
[B] 🔧 버그 수정 - 기존 기능의 버그 수정
[C] 📝 리팩토링 - 코드 품질 개선
[D] 🧪 테스트/QA - 품질 보증
[E] 📖 문서화 - 문서 작성/업데이트
[F] 🚢 PR 검토 & 배포 - 코드 검토, 배포
[G] 💬 자유 대화 - 질문/상담만

선택 (A-G):
```

**분기 처리**:
- **[A] 선택 시**: Step 1(기능 개발 모드 선택)으로 진행
- **[B-F] 선택 시**: 해당 온보딩 문서 로드 → 작업 시작
- **[G] 선택 시**: 온보딩 스킵 → 자유 대화 모드

---

### Step 1: 기능 개발 모드 선택 (A 선택 시)

**필수 문서 읽기**: `docs/engineering/guides/orchestration-selection-guide.md`

```
📊 개발 모드를 선택해주세요:

| 모드 | 적합한 경우 | 에이전트 | 예상 시간 |
|------|------------|---------|----------|
| **Mode 1** (병렬) | 복잡한 기능, 3일+ 작업 | 2-8명 동시 | 3-5일 |
| **Mode 2** (순차) | 단순한 기능, 1-2일 작업 | 1명 순차 | 1-2일 |

선택 (1/2):
```

---

### Step 2: 역할별 온보딩 문서 로드

**에이전트 행동**: 선택에 따라 해당 문서를 **자동으로 Read 도구로 읽고** 요약 보고:

| 선택 | 필수 문서 |
|------|----------|
| A (기능 개발) | `docs/engineering/onboarding/new-feature.md` + `docs/engineering/guides/agent-roles.md` |
| B (버그 수정) | `docs/engineering/onboarding/bug-fix.md` |
| C (리팩토링) | `docs/engineering/onboarding/refactoring.md` |
| D (테스트/QA) | `docs/engineering/onboarding/testing.md` |
| E (문서화) | `docs/engineering/onboarding/documentation.md` |
| F (PR & 배포) | `docs/engineering/onboarding/pr-deployment.md` |

---

### Step 3: 온보딩 완료 보고

**에이전트 행동**: 문서를 읽은 후, **반드시** 아래 형식으로 보고:

```
✅ 온보딩 완료 보고

선택한 역할: {역할명}
읽은 문서: {문서 목록}

이해한 핵심 개념 3가지:
1. {핵심 1}
2. {핵심 2}
3. {핵심 3}

준비 상태: ✅ 작업 요구사항 수집 대기 중
```

---

## 🌊 Wave Orchestration 프로토콜

> **전체 기술 명세**: `docs/engineering/WAVE-ORCHESTRATION-SPECIFICATION.md` 참조

### 복잡도 점수 공식

```
복잡도 = (영향 모듈 수 × 0.3) + (예상 일수 × 0.2) + (신규 API × 0.25) + (UI 화면 × 0.15) + (외부 연동 × 0.1)
```

### 에이전트 수 결정

| 복잡도 | 에이전트 수 | Phase 수 |
|--------|-----------|---------|
| 1.0-2.0 | 2명 | 2-3 |
| 2.1-3.5 | 3명 | 3-4 |
| 3.6-5.0 | 4명 | 4-5 |
| 5.1+ | 5-8명 | 5-6 |

### Phase 기반 실행 구조

```
Phase 0: 기획 & 설계 (Orchestrator + PM)
   ├─ 복잡도 점수 계산
   ├─ Phase 수 & Sub-agent 수 결정
   └─ 확장 문서 작성 (6개: PRD, RFC, ORCHESTRATION, CONTEXT, POLICY-SETUP, REFERENCES)

Phase 1+: 병렬 실행 (Sub-agent N명)
   ├─ Task 도구로 Sub-agent 자동 생성
   ├─ 각 Sub-agent는 CONTEXT + ORCHESTRATION + KB.md 로드
   ├─ 병렬 작업 (동시 실행)
   └─ 결과 JSON 형식 + Hash 기반 압축

Orchestrator 분석 (Phase 간 통합)
   ├─ Sub-agent 결과 수신
   ├─ 충돌 검사 (동일 파일 수정 여부)
   └─ Phase N+1 계획 수립

최종 통합 & 배포
   ├─ 전체 통합 테스트
   ├─ PR 생성
   └─ Staging/Production 배포
```

---

## 📋 프로젝트 현재 상태

### 완료된 문서 (Foundation + Planning)

| 문서 | 위치 | 내용 |
|------|------|------|
| 웹사이트 기획 | `docs/foundation/01-website-planning.md` | 사이트맵, 유저 저니, 40+ 페이지 |
| 기술 스펙 | `docs/foundation/02-technical-spec.md` | Firebase, Next.js 14+, 아키텍처 |
| 비즈니스 기획 | `docs/foundation/03-business-planning.md` | 시장 분석, 수익 모델 |
| 랜딩 스토리텔링 | `docs/foundation/04-landing-page-storytelling.md` | 11섹션 패럴랙스, 창업자 스토리 |
| 법적 컴플라이언스 | `docs/foundation/05-legal-compliance.md` | 법적 분류, 신고, 리스크 |
| IA & 유저 플로우 | `docs/planning/01-ia-user-flows.md` | 사이트맵, 태스크 플로우 |
| 디자인 시스템 | `docs/planning/02-design-system.md` | LINE DS 기반, 색상, 타이포 |
| 콘텐츠 전략 | `docs/planning/03-content-strategy.md` | 톤앤매너, 마이크로카피 |

### 완료된 와이어프레임 (16개 페이지)

```
docs/wireframes/
├── index.html              # 메인 네비게이션
├── landing.html            # 11섹션 패럴랙스 랜딩
├── search.html             # 검색 & 필터링
├── profile.html            # 아조씨 프로필 상세
├── booking.html            # 예약 플로우
├── checkout.html           # 결제 체크아웃
├── dashboard-customer.html # 고객 대시보드
├── dashboard-uncle.html    # 아조씨 대시보드
├── home-customer.html      # 고객 홈
├── home-uncle.html         # 아조씨 홈
├── messages.html           # 메시징
├── review.html             # 리뷰 작성
├── customer-signup.html    # 고객 회원가입
├── customer-login.html     # 고객 로그인
├── uncle-signup.html       # 아조씨 신청
├── uncle-login.html        # 아조씨 로그인
└── admin.html              # 관리자 검증
```

### 다음 단계: Feature Hub 생성

개발을 위해 아래 기능별 문서 허브 생성 필요:

```
docs/feature-hubs/
├── _MASTER-CONTEXT.md      # 전체 기능 공통 배경지식
├── landing-page/           # 랜딩 페이지 (11섹션 패럴랙스)
├── auth/                   # 인증 (회원가입/로그인)
├── search-booking/         # 검색 + 예약
├── payment/                # 결제 (Toss Escrow)
├── messaging/              # 실시간 채팅
├── uncle-dashboard/        # 아조씨 대시보드
├── customer-dashboard/     # 고객 대시보드
├── admin-verification/     # 관리자 신원검증
└── review-system/          # 리뷰 시스템
```

---

## 🔑 핵심 결정 사항 (Locked)

| 요소 | 결정 | 이유 |
|------|------|------|
| **브랜드명** | 아조씨 렌탈 | 2025 트렌드 단어, 친근함 |
| **백엔드** | Firebase only | 실시간 DB, 한국 결제 연동, MVP 비용 효율 |
| **창업자 스토리** | YouTube "영포티" 조롱 | 한국 2025 사회문제 (일본 모델 복사 아님) |
| **랜딩 페이지** | 패럴랙스 스크롤 | 11섹션, 깊이감, 감정적 여정 |
| **결제** | Toss (주) + Kakao/Naver | 한국 시장 선호 순서 |
| **호스팅** | Vercel + Firebase | Next.js 최적화, GitHub Actions 자동 배포 |

---

## 🏗️ Architecture & Tech Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query
- **Build**: Turbopack

### Backend

- **Platform**: Google Firebase
- **Auth**: Firebase Auth (Email/Phone + Kakao/Naver OAuth)
- **Database**: Firestore (Main) + Realtime DB (Chat)
- **Functions**: Cloud Functions (Node.js)
- **Storage**: Cloud Storage
- **Notifications**: FCM

### Infrastructure

- **Frontend Hosting**: Vercel (Seoul region)
- **Backend Hosting**: Firebase (Seoul region)
- **CI/CD**: GitHub Actions
- **Payment**: Toss Payments (Escrow)

---

## 📊 Database Schema (v1.0)

### Core Collections

```
users
├─ uid (string) - Primary Key
├─ email (string) - User email
├─ phone (string) - Phone number
├─ displayName (string) - Display name
├─ role (string) - 'customer' | 'uncle' | 'admin'
├─ profileImage (string) - Profile image URL
└─ createdAt (timestamp) - Account creation date

uncle_profiles
├─ uid (string) - Reference to users
├─ bio (string) - Self introduction
├─ skills (array) - Skill tags
├─ hourlyRate (number) - Price per hour
├─ rating (number) - Average rating
├─ reviewCount (number) - Total reviews
├─ verified (boolean) - Admin verified
└─ availability (map) - Weekly schedule

bookings
├─ bookingId (string) - Primary Key
├─ customerId (string) - Reference to users
├─ uncleId (string) - Reference to users
├─ date (timestamp) - Booking date
├─ duration (number) - Hours
├─ totalPrice (number) - Total amount
├─ status (string) - 'pending' | 'confirmed' | 'completed' | 'cancelled'
├─ escrowStatus (string) - Payment escrow state
└─ createdAt (timestamp)

reviews
├─ reviewId (string) - Primary Key
├─ bookingId (string) - Reference to bookings
├─ customerId (string) - Reviewer
├─ uncleId (string) - Reviewee
├─ rating (number) - 1-5 stars
├─ comment (string) - Review text
├─ tags (array) - Quick feedback tags
└─ createdAt (timestamp)

messages
├─ messageId (string) - Primary Key
├─ conversationId (string) - Chat room ID
├─ senderId (string) - Sender
├─ receiverId (string) - Receiver
├─ content (string) - Message text
├─ read (boolean) - Read status
└─ createdAt (timestamp)
```

---

## Essential Commands

### Development

```bash
npm run dev          # 로컬 개발 서버 시작 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 시작
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 타입 체크
```

### Testing

```bash
npm run test         # Jest 단위 테스트
npm run test:watch   # 워치 모드
npm run test:cov     # 커버리지 리포트
npm run e2e          # Playwright E2E 테스트
```

### Firebase

```bash
firebase deploy --only functions    # Cloud Functions 배포
firebase deploy --only firestore:rules  # Firestore 규칙 배포
firebase emulators:start            # 로컬 에뮬레이터
```

---

## 📚 Important References

### Wave Orchestration System

- **기술 명세**: `docs/engineering/WAVE-ORCHESTRATION-SPECIFICATION.md`
- **개요**: `docs/engineering/WAVE-ORCHESTRATION-OVERVIEW.md`

### Development Guides

모든 가이드는 `docs/engineering/guides/`에 위치:

**설계 (Design)**:
- `orchestration-selection-guide.md` - Mode 1/2 선택 기준
- `interface-contracts.md` - Mock 인터페이스 정의
- `policy-driven.md` - 정책 기반 아키텍처

**개발 (Development)**:
- `agent-roles.md` - Mode별 에이전트 역할
- `orchestrator-knowledge-transfer.md` - Orchestrator 가이드
- `multi-agent-context-passing.md` - 병렬 협업 방식
- `tdd-workflow.md` - TDD 워크플로
- `coding-conventions.md` - 코딩 규칙

**기획 (Planning)**:
- `prd-writing-full.md` - PRD 작성 가이드
- `feature-hub-structure.md` - 기능 문서 구조

### Document Templates

`docs/engineering/templates/` 폴더의 템플릿:

- `01-PRD-template.md` - Product Requirements
- `02-WIREFRAME-template.md` - Wireframe 가이드
- `03-RFC-template.md` - Request for Comments
- `04-ORCHESTRATION-template.md` - Task 정의
- `05-CONTEXT-template.md` - Background knowledge
- `06-POLICY-SETUP-template.md` - Dynamic configuration
- `07-AGENT-REFERENCES-template.md` - Reference links

### Onboarding Guides

`docs/engineering/onboarding/` 폴더:

- `new-feature.md` - 신규 기능 개발
- `bug-fix.md` - 버그 수정
- `refactoring.md` - 리팩토링
- `testing.md` - 테스트/QA
- `documentation.md` - 문서화
- `pr-deployment.md` - PR & 배포

---

## ✋ 원상복귀 방법

파이프라인 도입 전 상태로 복귀하려면:

```bash
git checkout v0.1-pre-pipeline
```

---

## 📅 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 5.0 | 2026-01-12 | Wave Orchestration 파이프라인 통합 |
| 4.0 | 2026-01-11 | 와이어프레임 16개 완성 |
| 3.0 | 2026-01-11 | Phase 1 콘텐츠 전략 완성 |
| 2.0 | 2026-01-10 | Phase 1 디자인 시스템 완성 |
| 1.0 | 2026-01-09 | Phase 0 기초 문서 완성 |

---

*Made with Claude Code Agent Swarm & Wave Orchestration*
*Last updated: 2026-01-12*
