# AGENT-ONBOARDING-GREENFIELD.md
# 신규 프로젝트 에이전트 온보딩 시뮬레이션

> **목적**: 0부터 시작하는 신규 프로젝트에서 Wave Orchestration이 어떻게 작동하는지 PM/기획자가 이해할 수 있도록 시뮬레이션합니다.
> **대상**: PM, 기획자, 비개발자
> **시뮬레이션 시나리오**: "카페 리뷰 웹사이트" 신규 구축

---

## 📋 시뮬레이션 개요

### 프로젝트: 카페 리뷰 웹사이트

**목표**: 사용자가 카페를 검색하고, 리뷰를 작성하고, 별점을 남길 수 있는 웹사이트

**주요 기능**:
- 사용자 회원가입/로그인
- 카페 목록 조회 및 검색
- 리뷰 작성/수정/삭제
- 별점 시스템

**디자인 시스템** (Phase 1에서 결정):
- Design System: Shadcn/ui (모던하고 미니멀한 스타일)
- Color Scheme: Neutral + Warm accents (카페 분위기)

**기술 스택** (Phase 2에서 결정, 디자인 시스템 기반):
- Frontend: React + Vite (Shadcn/ui 호환)
- Backend: Firebase (Auth, Firestore, Hosting)
- Styling: TailwindCSS (Shadcn/ui 기반)

---

## 🎭 시뮬레이션 시작

### 🎬 Scene 1: PM의 프로젝트 시작 요청

```
👤 PM: "새로운 카페 리뷰 웹사이트를 만들고 싶어요.
       사용자가 카페를 검색하고 리뷰를 남길 수 있는 서비스예요.
       MVP로 2주 안에 런칭하고 싶습니다."

🤖 Orchestrator: "신규 프로젝트군요. 복잡도를 먼저 계산하겠습니다.

   📊 복잡도 분석:
   ├─ 모듈 수: 4개 (Auth, Cafe, Review, Search) × 0.3 = 1.2
   ├─ 예상 일수: 10일 × 0.2 = 2.0
   ├─ 신규 API: 5개 × 0.25 = 1.25
   ├─ UI 화면: 6개 × 0.15 = 0.9
   └─ 외부 연동: 0개 × 0.1 = 0

   총점: 5.35 → 🔴 Large 규모

   ⚠️ 신규 프로젝트 특성:
   - Phase 1에서 디자인 시스템 먼저 결정
   - Phase 2에서 기술 스택 결정 (디자인 시스템 기반)
   - Phase 3부터 본격적인 병렬 작업 가능
   - 예상 Phase 수: 6개"
```

---

### 🎬 Scene 2: Phase 1 - 디자인 시스템 결정 (30분)

> 💡 **업계 표준 순서**: Discovery → Design System → Tech Stack → Implementation
> 디자인 시스템이 먼저 결정되어야 기술 스택을 올바르게 선택할 수 있습니다.

```
🤖 Orchestrator: "신규 프로젝트이므로 디자인 시스템부터 결정합니다.
                 Design System Agent를 투입합니다."

📊 에이전트 할당: 1명 (Design System Agent)

┌─────────────────────────────────────────────────────────────┐
│  Phase 1: 디자인 시스템 결정                                  │
│  ⏱️ 예상 소요: 30분                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎨 Design System Agent 역할:                               │
│  ├─ ✅ Producer에게 비기술적 질문을 통해 니즈 파악            │
│  ├─ ✅ 시각적 레퍼런스(스크린샷) 분석                         │
│  ├─ ✅ 기존 오픈소스 디자인 시스템 추천                       │
│  ├─ ❌ 새로운 비주얼 창작 (불가능)                            │
│  └─ ❌ 커스텀 디자인 토큰 생성 (범위 외)                      │
│                                                             │
│  📋 추천 가능한 디자인 시스템:                                │
│  ├─ Shadcn/ui (React) - 모던, 미니멀, 커스터마이징 용이       │
│  ├─ Chakra UI (React) - 접근성 우수, 다양한 컴포넌트          │
│  ├─ Material Design (React/Vue/Angular) - 구글 스타일        │
│  ├─ Ant Design (React) - 엔터프라이즈, 데이터 중심            │
│  └─ Tailwind + Headless UI (모든 프레임워크) - 유연성 최대    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Step 1: Producer 인터뷰 (15분)

```
🎨 Design System Agent: "프로젝트에 맞는 디자인 시스템을 추천해드리기 위해
                        몇 가지 질문을 드릴게요."

─────────────────────────────────────────────────────────────
질문 1️⃣: 서비스의 주요 사용자는 누구인가요?

   예시 답변:
   • "20-30대 카페 애호가"
   • "바쁜 직장인"
   • "카페 사장님들"

👤 PM: "20-30대 카페 애호가들이에요. SNS를 자주 쓰는 세대죠."

─────────────────────────────────────────────────────────────
질문 2️⃣: 서비스의 분위기를 단어로 표현하면요?

   선택지:
   A) 모던하고 깔끔한
   B) 따뜻하고 아늑한
   C) 전문적이고 신뢰감 있는
   D) 재미있고 활기찬

👤 PM: "A랑 B를 섞은 느낌이요. 깔끔하면서도 카페처럼 따뜻한 느낌."

─────────────────────────────────────────────────────────────
질문 3️⃣: 비슷한 느낌의 서비스나 웹사이트가 있나요?
          (스크린샷을 공유해주셔도 됩니다)

👤 PM: "네, 이런 느낌이에요." [스크린샷 공유]
       • 참고 이미지 1: 미니멀한 카드 레이아웃
       • 참고 이미지 2: 따뜻한 베이지 톤 배경
       • 참고 이미지 3: 깔끔한 타이포그래피

─────────────────────────────────────────────────────────────
질문 4️⃣: 서비스에서 가장 중요한 화면은 무엇인가요?

   예시:
   • 카페 목록 (사진이 많이 보이는)
   • 리뷰 작성 (글쓰기 편의성)
   • 검색 결과 (정보 밀도)

👤 PM: "카페 목록이요. 예쁜 사진이 잘 보여야 해요."
```

#### Step 2: 레퍼런스 분석 및 추천 (10분)

```
🎨 Design System Agent: "공유해주신 정보를 분석했습니다.

   📊 분석 결과:
   ├─ 타겟 사용자: 20-30대, SNS 친숙
   ├─ 분위기: 모던 + 따뜻함
   ├─ 레퍼런스 스타일: 미니멀 카드, 베이지 톤, 깔끔한 타이포
   └─ 핵심 화면: 이미지 중심 카드 레이아웃

   ✨ 추천 디자인 시스템:

   🥇 1순위: Shadcn/ui
      ├─ 이유: 모던하고 미니멀한 기본 스타일
      ├─ 장점: 커스터마이징 용이 (따뜻한 색상 적용 쉬움)
      ├─ 카드 컴포넌트: 이미지 중심 레이아웃에 최적
      └─ 기술 호환: React, TailwindCSS 기반

   🥈 2순위: Chakra UI
      ├─ 이유: 접근성 우수, 다양한 컴포넌트
      ├─ 장점: 테마 시스템으로 색상 변경 쉬움
      └─ 단점: Shadcn/ui보다 번들 크기 큼

   🥉 3순위: Tailwind + Headless UI
      ├─ 이유: 최대 유연성
      ├─ 장점: 완전한 커스터마이징
      └─ 단점: 컴포넌트를 직접 만들어야 함 (시간 소요)

   💡 최종 추천: Shadcn/ui
      → 모던함과 따뜻함 둘 다 표현 가능
      → 카드 기반 레이아웃에 최적화
      → 빠른 MVP 개발 가능"

👤 PM: "Shadcn/ui로 할게요!"
```

#### Step 3: 디자인 시스템 확정 (5분)

```
🎨 Design System Agent: "Shadcn/ui를 기반으로 다음과 같이 설정하겠습니다.

   ✅ 확정 사항:
   ├─ Base: Shadcn/ui
   ├─ Color Palette:
   │   ├─ Primary: Warm Neutral (#78716c → stone)
   │   ├─ Accent: Soft Orange (#f97316 → 따뜻한 포인트)
   │   └─ Background: Light Beige (#faf5f0)
   ├─ Typography: Inter (기본) + 한글 (Pretendard)
   └─ Card Style: 그림자 최소화, 둥근 모서리 (radius-lg)

   📁 산출물: DESIGN-SYSTEM.md
   ├─ 색상 팔레트 정의
   ├─ 사용할 Shadcn 컴포넌트 목록
   └─ 커스터마이징 가이드"

✅ Phase 1 완료

📊 투입: 1명 (Design System Agent)
✓ 완료: 3/3 Task
⏱️ 소요: 30분

[산출물]
• DESIGN-SYSTEM.md
• 선정된 시스템: Shadcn/ui
• 색상 팔레트: Warm Neutral + Soft Orange

[다음 Phase 준비]
• 기술 스택은 Shadcn/ui 호환으로 선택 예정
• React + TailwindCSS가 자동으로 결정됨

🚀 다음: Phase 2 시작 (프로젝트 설계)
```

---

### 🎬 Scene 3: Phase 2 - 프로젝트 설계 (1.5시간)

> 💡 **디자인 시스템 기반 기술 스택 결정**: Phase 1에서 Shadcn/ui가 선택되었으므로,
> 기술 스택은 자동으로 React + TailwindCSS로 결정됩니다.

```
🤖 Orchestrator: "Phase 2를 시작합니다.
                 Phase 1에서 결정된 디자인 시스템 기반으로 설계를 진행합니다."

📝 Phase 2 산출물:

1️⃣ 01-PRD.md (45분)
   ├─ 제품 비전: "누구나 쉽게 카페를 발견하고 경험을 공유하는 플랫폼"
   ├─ 사용자 페르소나: 카페 애호가 (20-30대)
   ├─ MVP 기능 범위
   │   ├─ 필수: 회원가입, 카페 목록, 리뷰 CRUD
   │   └─ 제외: 예약, 결제, 소셜 로그인
   └─ 성공 지표: MAU 1,000명, 리뷰 작성률 30%

2️⃣ 02-RFC.md (30분)
   ├─ 기술 스택 결정 (디자인 시스템 기반 ⭐)
   │   ├─ React 선택 이유: Shadcn/ui 호환, 빠른 개발
   │   ├─ Firebase 선택 이유: 백엔드 개발 시간 절약
   │   └─ TailwindCSS 선택 이유: Shadcn/ui 기반 필수
   ├─ Firestore 스키마 초안
   │   ├─ users: { uid, email, displayName, createdAt }
   │   ├─ cafes: { id, name, address, rating, reviewCount }
   │   └─ reviews: { id, cafeId, userId, content, rating, createdAt }
   └─ 폴더 구조 설계
       src/
       ├─ components/
       │   └─ ui/ (Shadcn 컴포넌트)
       ├─ pages/
       ├─ services/
       ├─ hooks/
       └─ utils/

3️⃣ 03-ORCHESTRATION.md (15분)
   ├─ Phase 3: 인프라 + 인증 (순차)
   ├─ Phase 4: 카페 + 리뷰 기능 (병렬!)
   ├─ Phase 5: 검색 + UI 완성 (병렬)
   ├─ Phase 6: 통합 테스트
   └─ Phase 7: 배포

4️⃣ 04-CONTEXT.md (15분)
   ├─ Shadcn/ui 설치 및 설정 방법
   ├─ Firebase 프로젝트 생성 방법
   ├─ React + Vite 초기 설정
   └─ 코딩 컨벤션 요약

5️⃣ 05-POLICY-SETUP.md (없음 - 신규 프로젝트)
   └─ "해당 없음 - 기존 정책 설정 필요 없음"

6️⃣ 06-AGENT-REFERENCES.md (10분)
   ├─ Shadcn/ui 공식 문서 링크 ⭐
   ├─ Firebase 공식 문서 링크
   ├─ React 공식 문서 링크
   └─ TailwindCSS 공식 문서 링크

7️⃣ 07-DESIGN-SYSTEM.md (Phase 1에서 생성됨)
   ├─ 선정된 시스템: Shadcn/ui
   ├─ 색상 팔레트: Warm Neutral + Soft Orange
   └─ 사용 컴포넌트 목록
```

---

### 🎬 Scene 4: Phase 3 - 인프라 + 인증 (2시간)

> ⚠️ **신규 프로젝트 특성**: Phase 3은 순차 의존성이 높아 병렬화가 제한적입니다.

```
🤖 Orchestrator: "Phase 3을 시작합니다.
                 신규 프로젝트이므로 인프라부터 구축해야 합니다.

                 ⚠️ 순차 의존성 경고:
                 Firebase 프로젝트 → SDK 설정 → Auth 구현 순서 필수"

📊 에이전트 할당: 2명 (순차 작업 위주)

┌─────────────────────────────────────────────────────────────┐
│  Phase 3: 인프라 + 인증                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [순차 작업 - 병렬화 불가]                                    │
│                                                             │
│  Step 1 (30분):                                             │
│  └─ Agent 1 (Infra): Firebase 프로젝트 생성                  │
│      ├─ Firebase Console에서 프로젝트 생성                   │
│      ├─ Firestore 데이터베이스 활성화                        │
│      ├─ Authentication 활성화 (Email/Password)              │
│      └─ 산출물: firebaseConfig 객체                         │
│                                                             │
│  Step 2 (30분):                                             │
│  └─ Agent 1 (Infra): React 프로젝트 초기화                   │
│      ├─ npm create vite@latest cafe-review -- --template react │
│      ├─ TailwindCSS 설치 및 설정                            │
│      ├─ Firebase SDK 설치                                   │
│      └─ 산출물: 프로젝트 기본 구조                           │
│                                                             │
│  Step 3 (45분):                                             │
│  └─ Agent 2 (Auth): 인증 시스템 구현                         │
│      ├─ src/services/firebase.js (SDK 초기화)               │
│      ├─ src/services/authService.js (로그인/회원가입)        │
│      ├─ src/contexts/AuthContext.jsx                        │
│      └─ src/pages/LoginPage.jsx, SignupPage.jsx             │
│                                                             │
│  [병렬 가능 구간]                                            │
│                                                             │
│  Step 4 (15분): 동시 진행 가능                               │
│  ├─ Agent 1: 라우팅 설정 (react-router-dom)                  │
│  └─ Agent 2: Auth Guard 컴포넌트                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

⏱️ 총 소요: 2시간
📈 병렬화율: 12.5% (8개 작업 중 1개만 병렬)
```

---

### 🎬 Scene 5: Phase 3 완료 보고

```
✅ Phase 3 완료

📊 투입: 2명
✓ 완료: 8/8 Task
⏱️ 소요: 2시간 (예상과 동일)

[산출물]
• Firebase 프로젝트: cafe-review-app
• React 프로젝트: /cafe-review (Vite + TailwindCSS)
• 인증 시스템: 회원가입/로그인/로그아웃 구현 완료
• 라우팅: / → /login → /signup → /home

[다음 Phase 준비]
• Firestore 스키마 확정
• Mock 데이터 준비 ← Phase 4 병렬화를 위해 필수!

🚀 다음: Phase 4 시작 (카페 + 리뷰 기능)
```

---

### 🎬 Scene 6: Phase 4 - 핵심 기능 (3시간)

> 💡 **병렬화 본격 시작**: Mock 데이터를 활용하여 Frontend/Backend 동시 개발

```
🤖 Orchestrator: "Phase 4를 시작합니다.

                 💡 병렬화 전략:
                 - Mock 데이터를 먼저 정의하여 Frontend가 Backend 완료를 기다리지 않음
                 - 3명의 에이전트가 동시 작업 가능"

📊 에이전트 할당: 3명 (본격 병렬!)

┌─────────────────────────────────────────────────────────────┐
│  Phase 4: 카페 + 리뷰 기능                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [사전 준비] Mock 데이터 정의 (15분)                          │
│  └─ Orchestrator가 직접 수행                                 │
│      mockCafes: [{ id, name, address, rating }, ...]        │
│      mockReviews: [{ id, cafeId, content, rating }, ...]    │
│                                                             │
│  [병렬 작업 - 3명 동시 진행!]                                 │
│                                                             │
│  Agent 1 (Backend):                           ⏱️ 1.5시간    │
│  ├─ Firestore 스키마 구현                                    │
│  │   └─ cafes, reviews 컬렉션 생성                          │
│  ├─ services/cafeService.js                                 │
│  │   └─ getCafes(), getCafeById(), searchCafes()           │
│  └─ services/reviewService.js                               │
│      └─ getReviews(), createReview(), updateReview()        │
│                                                             │
│  Agent 2 (Frontend Core):                     ⏱️ 1.5시간    │
│  ├─ 상태 관리 설정                                           │
│  │   └─ contexts/CafeContext.jsx                            │
│  ├─ 커스텀 훅 구현                                           │
│  │   └─ hooks/useCafes.js, hooks/useReviews.js             │
│  └─ ⚡ Mock 데이터로 개발 (Backend 완료 대기 불필요)           │
│                                                             │
│  Agent 3 (Frontend UI):                       ⏱️ 1.5시간    │
│  ├─ 페이지 컴포넌트                                          │
│  │   └─ CafeListPage, CafeDetailPage                        │
│  ├─ UI 컴포넌트                                              │
│  │   └─ CafeCard, ReviewCard, StarRating                    │
│  └─ ⚡ Mock 데이터로 UI 검증                                  │
│                                                             │
│  [통합 작업] (30분)                                          │
│  └─ Mock → 실제 서비스 연결                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

⏱️ 총 소요: 2시간 (순차 시 4.5시간 → 2시간 절약!)
📈 병렬화율: 66% (3명 동시 작업)
```

---

### 🎬 Scene 7: Phase 4 진행 중 문제 발생

```
⚠️ 타입 불일치 감지

🔴 심각도: HIGH
⏱️ 영향: 30분 지연 예상

[문제 설명]
Agent 1 (Backend)이 구현한 리뷰 스키마와
Agent 3 (Frontend UI)가 사용한 Mock 데이터의 필드명 불일치

Backend:  { reviewId, cafeRef, authorId, text, stars }
Mock:     { id, cafeId, userId, content, rating }

[발생 원인]
Mock 데이터 정의 시 Backend 스키마 최종 확정 전에 진행

[대안 분석]
A) Backend 스키마를 Mock에 맞춤
   → 결과: Backend 재작업 15분
   → 장점: Frontend 코드 변경 불필요

B) Frontend를 Backend 스키마에 맞춤
   → 결과: Frontend 재작업 20분
   → 장점: 스키마가 더 명확함 (reviewId vs id)

C) 어댑터 레이어 추가
   → 결과: 추가 개발 25분
   → 장점: 양쪽 코드 변경 최소화, 유연성 확보

[추천]
추천: B (Backend 스키마가 더 명시적이고 확장성 있음)

[결정 요청]
다음 중 선택: [A] [B] [C]
```

```
👤 PM: "B로 진행해주세요. 스키마는 명확한 게 좋아요."

🤖 Orchestrator: "확인했습니다. Frontend 필드명을 Backend 스키마에 맞춰 수정합니다.
                 Agent 3에게 재작업 지시 중..."
```

---

### 🎬 Scene 8: Phase 4 완료 보고

```
✅ Phase 4 완료

📊 투입: 3명 (병렬 작업)
✓ 완료: 12/12 Task
⏱️ 소요: 2시간 30분 (문제 해결 30분 포함)

[산출물]
• Backend 서비스: cafeService.js, reviewService.js
• Frontend 상태 관리: CafeContext, useCafes, useReviews
• UI 컴포넌트: CafeCard, ReviewCard, StarRating
• 페이지: CafeListPage, CafeDetailPage

[해결된 이슈]
• 스키마 불일치 → B안 적용 (Frontend 수정)

[학습 포인트]
⚡ 다음 프로젝트에서는 Mock 데이터 정의 전 스키마 합의 필수

🚀 다음: Phase 5 시작 (검색 + UI 완성)
```

---

### 🎬 Scene 9: Phase 5 - 검색 + UI 완성 (2시간)

```
🤖 Orchestrator: "Phase 5를 시작합니다.
                 2명의 에이전트가 병렬로 작업합니다."

📊 에이전트 할당: 2명

┌─────────────────────────────────────────────────────────────┐
│  Phase 5: 검색 + UI 완성                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [병렬 작업]                                                 │
│                                                             │
│  Agent 1 (Search + Features):                 ⏱️ 1.5시간    │
│  ├─ 검색 기능 구현                                           │
│  │   └─ SearchBar 컴포넌트                                  │
│  │   └─ Firestore 쿼리 최적화                               │
│  ├─ 필터링 기능                                              │
│  │   └─ 별점순, 최신순 정렬                                  │
│  └─ 리뷰 작성 폼                                             │
│      └─ ReviewForm 컴포넌트                                  │
│                                                             │
│  Agent 2 (UI Polish):                         ⏱️ 1.5시간    │
│  ├─ 반응형 디자인                                            │
│  │   └─ 모바일/태블릿/데스크톱 대응                          │
│  ├─ 로딩 상태 UI                                             │
│  │   └─ Skeleton, Spinner 컴포넌트                          │
│  ├─ 에러 처리 UI                                             │
│  │   └─ ErrorBoundary, Toast 알림                           │
│  └─ 빈 상태 UI                                               │
│      └─ EmptyState 컴포넌트                                  │
│                                                             │
│  [통합] (30분)                                               │
│  └─ 전체 페이지 연결 및 최종 검토                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

⏱️ 총 소요: 2시간
📈 병렬화율: 75%
```

---

### 🎬 Scene 10: Phase 5 완료 보고

```
✅ Phase 5 완료

📊 투입: 2명
✓ 완료: 8/8 Task
⏱️ 소요: 2시간

[산출물]
• 검색: SearchBar, 필터링 (별점순/최신순)
• UI 컴포넌트: Skeleton, Spinner, Toast, EmptyState
• 반응형: 모바일/태블릿/데스크톱 대응 완료

🚀 다음: Phase 6 (통합 테스트)
```

---

### 🎬 Scene 11: Phase 6 - 통합 테스트 (1시간)

```
🤖 Orchestrator: "Phase 6를 시작합니다.
                 QA 에이전트가 전체 플로우를 검증합니다."

📊 에이전트 할당: 1명 (QA)

┌─────────────────────────────────────────────────────────────┐
│  Phase 6: 통합 테스트                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Agent (QA):                                  ⏱️ 1시간      │
│                                                             │
│  [E2E 시나리오 테스트]                                       │
│  ├─ 시나리오 1: 신규 사용자 가입 → 카페 검색 → 리뷰 작성     │
│  ├─ 시나리오 2: 기존 사용자 로그인 → 내 리뷰 수정           │
│  ├─ 시나리오 3: 비로그인 사용자 → 카페 목록만 조회           │
│  └─ 시나리오 4: 검색 → 필터링 → 정렬 조합 테스트            │
│                                                             │
│  [크로스 브라우저 테스트]                                     │
│  ├─ Chrome (데스크톱)                                        │
│  ├─ Safari (모바일 시뮬레이터)                               │
│  └─ Firefox (데스크톱)                                       │
│                                                             │
│  [성능 테스트]                                               │
│  ├─ 초기 로딩 시간: < 3초 목표                               │
│  ├─ 검색 응답 시간: < 500ms 목표                             │
│  └─ 이미지 최적화 확인                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 🎬 Scene 12: Phase 6 테스트 결과

```
✅ Phase 6 완료 - 테스트 결과

📊 테스트 현황
├─ E2E 시나리오: 4/4 통과 ✅
├─ 크로스 브라우저: 3/3 통과 ✅
└─ 성능: 2/3 통과 ⚠️

[발견된 이슈]
⚠️ MEDIUM: 초기 로딩 시간 3.2초 (목표: 3초)
   원인: Firebase SDK 번들 크기
   권장: 코드 스플리팅 적용 (Phase 5에서 처리 가능)

[결정 요청]
성능 최적화를 Phase 7에서 진행할까요?
[A] 예, Phase 7에서 진행 [B] 지금 바로 수정
```

```
👤 PM: "A로 해주세요. 배포 먼저 하고 싶어요."

🤖 Orchestrator: "확인했습니다. Phase 7에서 성능 최적화를 포함합니다."
```

---

### 🎬 Scene 13: Phase 7 - 배포 (1시간)

```
🤖 Orchestrator: "최종 Phase를 시작합니다.
                 배포 및 성능 최적화를 진행합니다."

📊 에이전트 할당: 1명 (DevOps)

┌─────────────────────────────────────────────────────────────┐
│  Phase 7: 배포                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Agent (DevOps):                              ⏱️ 1시간      │
│                                                             │
│  [성능 최적화] (30분)                                        │
│  ├─ React.lazy() + Suspense 적용                            │
│  ├─ Firebase SDK 동적 임포트                                 │
│  └─ 결과: 로딩 시간 3.2초 → 2.1초 ✅                        │
│                                                             │
│  [배포 설정] (15분)                                          │
│  ├─ firebase.json 설정                                      │
│  ├─ Hosting 캐시 정책                                        │
│  └─ 환경 변수 설정                                           │
│                                                             │
│  [배포 실행] (15분)                                          │
│  ├─ npm run build                                           │
│  ├─ firebase deploy --only hosting                          │
│  └─ 배포 URL: https://cafe-review-app.web.app               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 🎬 Scene 14: 프로젝트 완료 최종 보고

```
┌─────────────────────────────────────────────────────────────┐
│  🎉 카페 리뷰 웹사이트 - 프로젝트 완료                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 전체 현황                                                │
│  ├─ 총 소요 시간: 10시간                                     │
│  │   (순차 진행 시 예상: 15시간 → 5시간 절약)               │
│  ├─ 총 에이전트 투입: 연인원 10명                            │
│  └─ 해결된 이슈: 2건                                         │
│                                                             │
│  📈 Phase별 요약                                             │
│  ├─ Phase 1 (디자인): 0.5시간 - Design System Agent ⭐       │
│  ├─ Phase 2 (설계): 1.5시간 - 7개 문서 완성                  │
│  ├─ Phase 3 (인프라): 2시간 - 병렬화 12%                     │
│  ├─ Phase 4 (핵심): 2.5시간 - 병렬화 66% ⭐                  │
│  ├─ Phase 5 (완성): 2시간 - 병렬화 75% ⭐                    │
│  ├─ Phase 6 (테스트): 1시간                                  │
│  └─ Phase 7 (배포): 0.5시간                                  │
│                                                             │
│  🌐 배포 URL                                                 │
│  └─ https://cafe-review-app.web.app                         │
│                                                             │
│  📝 학습 포인트                                              │
│  ├─ 디자인 시스템 먼저 → 기술 스택은 자동 결정              │
│  ├─ 신규 프로젝트는 Phase 3 (인프라) 병렬화 제한적          │
│  ├─ Mock 데이터 정의 전 스키마 합의 필수                     │
│  └─ Phase 4부터 본격적인 병렬화 효과 발휘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 기존 프로젝트 vs 신규 프로젝트 비교

| 항목 | 기존 프로젝트 (EXISTING) | 신규 프로젝트 (GREENFIELD) |
|------|-------------------------|---------------------------|
| 첫 번째 Phase | 즉시 개발 시작 | 디자인 시스템 결정 (Phase 1) |
| 디자인 시스템 | 기존 시스템 활용 | Design System Agent가 추천 |
| 인프라 Phase 병렬화 | 높음 (Mock 즉시 활용) | 낮음 (순차 구축 필요) |
| 핵심 기능 Phase 병렬화 | 매우 높음 | 높음 |
| 총 시간 절약 | 40-50% | 30-35% |
| 주요 리스크 | 기존 코드 호환성 | 스키마/인터페이스 불일치 |
| 추천 에이전트 수 | 4-6명 | 1명 (Phase 1), 2-4명 (초반), 4-6명 (후반) |

---

## 🔑 PM을 위한 핵심 요약

### 신규 프로젝트에서 Wave Orchestration의 가치

1. **🎨 디자인 시스템이 먼저입니다** (Phase 1)
   - Design System Agent가 비기술적 질문으로 니즈 파악
   - 스크린샷 분석 후 적합한 오픈소스 시스템 추천
   - 디자인 시스템이 기술 스택을 결정함 (예: Shadcn/ui → React 필수)

2. **Phase 3은 인내가 필요합니다** (인프라)
   - 인프라 구축은 순차 작업이 많아 병렬화 효과가 제한적
   - 하지만 이 투자가 Phase 4+의 병렬화를 가능하게 함

3. **Mock 데이터가 핵심입니다**
   - Mock 데이터 정의 = Frontend/Backend 동시 개발 가능
   - Mock 정의 전 스키마 합의 필수 (Scene 7 참조)

4. **시간 절약은 Phase 4부터**
   - Phase 4+에서 본격적인 병렬화 효과
   - 전체적으로 30-35% 시간 절약 가능

5. **이슈 발생 시 즉시 보고됩니다**
   - Decision Report로 명확한 선택지 제공
   - PM이 빠른 의사결정 가능

---

## 📚 관련 문서

- [PROJECT-ROUTER.md](./PROJECT-ROUTER.md) - **프로젝트 유형 분기 가이드** (시작점)
- [AGENT-ONBOARDING-EXISTING.md](./AGENT-ONBOARDING-EXISTING.md) - 기존 프로젝트 온보딩 시뮬레이션
- [WAVE-ORCHESTRATION-SPECIFICATION.md](./WAVE-ORCHESTRATION-SPECIFICATION.md) - Wave 시스템 기술 명세
- [development/agent-roles.md](./development/agent-roles.md) - 에이전트 역할 정의
