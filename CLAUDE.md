# 아조씨 렌탈 - Agent Context

```yaml
v: 5.4
date: 2026-01-12
project: P2P-marketplace(uncle↔customer)
tech: Next.js14+/TS/Tailwind/Firebase/Vercel

status:
  phase0_foundation: ✅
  phase1_planning: ✅
  phase1_feature_hubs: 🔄
    landing-page: {prd:✅, rfc:❌, orch:❌, dev:✅}
    customer-auth: {prd:✅, rfc:✅, orch:✅, dev:✅, deploy:✅}
    uncle-auth: {prd:✅, rfc:❌, orch:❌}
  phase2_dev: ⏳

deploy:
  url: https://azrental-842a8.web.app
  platform: Firebase Hosting + Cloud Functions
  region: asia-northeast3
```

---

## ⚠️ 필수 실행 프로토콜 (MANDATORY)

```yaml
# 새 세션 시작 시 반드시 실행

step_1_read:
  - "CLAUDE.md (이 파일)"
  - ".handoff.md (세션 컨텍스트)"

step_2_ask:
  prompt: "작업 유형을 선택하세요: [A]기능개발 [B]버그 [C]리팩 [D]QA [E]문서 [F]PR [G]자유"

step_3_execute:
  on_select:
    A:
      action: "Read docs/engineering/onboarding/new-feature.md"
      then: "복잡도 계산 (아래 공식 사용)"
      gate: "complexity ≥ 2.0 → Wave Orchestration 강제"
    B:
      action: "Read docs/engineering/onboarding/bug-fix.md"
    C:
      action: "Read docs/engineering/onboarding/refactoring.md"
    D:
      action: "Read docs/engineering/onboarding/testing.md"
    E:
      action: "Read docs/engineering/onboarding/documentation.md"
    F:
      action: "Read docs/engineering/onboarding/pr-deployment.md"
    G:
      action: "자유 대화 (프로토콜 스킵 허용)"

step_4_report:
  format: |
    ✅ 온보딩 완료
    - 선택: {A~G}
    - 읽은 문서: {경로}
    - 복잡도: {점수} (A 선택 시)
    - 실행 모드: {Single/Wave}
    - 준비 상태: 작업 대기 중
```

---

## rules

```yaml
commit_protocol:
  - "커밋 전 .handoff.md 필수 업데이트"
  - "WIP/pending/context/next_action 갱신"
  - "PM 별도 요청 불필요 (자동 실행)"

execution_protocol:
  - "[A] 선택 시 복잡도 계산 필수"
  - "complexity < 2.0 → Single Agent 허용"
  - "complexity ≥ 2.0 → Wave Orchestration 강제"
  - "Wave 시 03-ORCHESTRATION.md 작성 후 PM 승인 → 실행"
```

## wave_orchestration

```yaml
spec: docs/engineering/WAVE-ORCHESTRATION-SPECIFICATION.md
guide: docs/engineering/guides/orchestration-selection-guide.md

complexity_formula: (modules×0.3)+(days×0.2)+(api×0.25)+(ui×0.15)+(ext×0.1)

threshold:
  single: "< 2.0"
  wave: "≥ 2.0"

agents_by_complexity:
  1.0-2.0: 1 agent (Single)
  2.1-3.5: 2-3 agents
  3.6-5.0: 3-4 agents
  5.1+: 5-8 agents

hub_docs: [PRD, RFC, ORCHESTRATION, CONTEXT, POLICY-SETUP, REFERENCES]
templates: docs/engineering/templates/0[1-7]-*.md
```

## assets

```yaml
foundation: docs/foundation/[01-website,02-tech,03-business,04-landing,05-legal,06-policies].md
planning: docs/planning/[01-ia,02-design,03-content].md
wireframes: docs/wireframes/*.html (16files)
feature_hubs:
  landing-page: docs/feature-hubs/landing-page/
  customer-auth: docs/feature-hubs/customer-auth/
  uncle-auth: docs/feature-hubs/uncle-auth/
```

---

## locked_decisions

```yaml
brand: 아조씨렌탈 #2025트렌드,친근함
backend: Firebase #실시간DB,결제연동,MVP효율
founder_story: YouTube영포티조롱 #한국2025사회문제
landing: 패럴랙스11섹션 #깊이감,감정여정
payment: Toss+Kakao/Naver #한국시장선호순
hosting: Firebase #App Hosting+Cloud Functions,asia-northeast3
```

## arch

```yaml
frontend: {fw:Next.js14+AppRouter, lang:TS, style:Tailwind+shadcn, state:Zustand+ReactQuery, build:Turbopack}
backend: {platform:Firebase, auth:Email/Phone, db:Firestore+RealtimeDB, fn:CloudFunctions, storage:CloudStorage, push:FCM}
infra: {fe:Firebase-Seoul, be:Firebase-Seoul, ci:GitHubActions, pay:TossEscrow}
```

## db_schema

```yaml
users: {uid*, email, phone, displayName, role[customer|uncle|admin], profileImage, createdAt}
uncle_profiles: {uid→users, bio, skills[], hourlyRate, rating, reviewCount, verified, availability{}}
bookings: {bookingId*, customerId→users, uncleId→users, date, duration, totalPrice, status[pending|confirmed|completed|cancelled], escrowStatus, createdAt}
reviews: {reviewId*, bookingId→bookings, customerId, uncleId, rating[1-5], comment, tags[], createdAt}
messages: {messageId*, conversationId, senderId, receiverId, content, read, createdAt}
```

## commands

```yaml
dev: {dev:"npm run dev", build:"npm run build", start:"npm run start", lint:"npm run lint", typecheck:"npm run type-check"}
test: {unit:"npm run test", watch:"npm run test:watch", cov:"npm run test:cov", e2e:"npm run e2e"}
firebase: {fn:"firebase deploy --only functions", rules:"firebase deploy --only firestore:rules", emu:"firebase emulators:start"}
```

## refs

```yaml
wave: [docs/engineering/WAVE-ORCHESTRATION-SPECIFICATION.md, docs/engineering/WAVE-ORCHESTRATION-OVERVIEW.md]
guides:
  design: [orchestration-selection-guide, interface-contracts, policy-driven]
  dev: [agent-roles, orchestrator-knowledge-transfer, multi-agent-context-passing, tdd-workflow, coding-conventions]
  plan: [prd-writing-full, feature-hub-structure]
templates: docs/engineering/templates/0[1-7]-*.md
onboarding: docs/engineering/onboarding/[new-feature,bug-fix,refactoring,testing,documentation,pr-deployment].md
```

## changelog

```yaml
- {v:5.5, d:2026-01-13, c:"Firebase 배포 완료, 소셜 로그인 제거, customer-auth 완료"}
- {v:5.4, d:2026-01-12, c:"필수 실행 프로토콜 추가 (온보딩 강제화)"}
- {v:5.3, d:2026-01-12, c:"commit_protocol 규칙 추가, Next.js 초기세팅"}
- {v:5.2, d:2026-01-12, c:"CLAUDE.md AI압축포맷 전환"}
- {v:5.1, d:2026-01-12, c:"Phase1 PRD 3개 완성"}
- {v:5.0, d:2026-01-12, c:"Wave Orchestration 통합"}
- {v:4.0, d:2026-01-11, c:"와이어프레임 16개"}
- {v:3.0, d:2026-01-11, c:"Phase1 콘텐츠전략"}
- {v:2.0, d:2026-01-10, c:"Phase1 디자인시스템"}
- {v:1.0, d:2026-01-09, c:"Phase0 기초문서"}
```

---
*Claude Code Agent Swarm & Wave Orchestration | 2026-01-12*
