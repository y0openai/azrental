# 아조씨 렌탈 - Agent Context

```yaml
v: 5.2
date: 2026-01-12
project: P2P-marketplace(uncle↔customer)
tech: Next.js14+/TS/Tailwind/Firebase/Vercel

status:
  phase0_foundation: ✅
  phase1_planning: ✅
  phase1_feature_hubs: 🔄
    landing-page: {prd:✅, rfc:❌, orch:❌}
    customer-auth: {prd:✅, rfc:❌, orch:❌}
    uncle-auth: {prd:✅, rfc:❌, orch:❌}
  phase2_dev: ⏳

next_action: "RFC작성 OR 개발시작 (PM결정대기)"
```

---

## onboarding

```yaml
ask_first: "[A]기능개발 [B]버그 [C]리팩 [D]QA [E]문서 [F]PR [G]자유"
docs:
  A: [docs/engineering/onboarding/new-feature.md, docs/engineering/guides/agent-roles.md]
  B: docs/engineering/onboarding/bug-fix.md
  C: docs/engineering/onboarding/refactoring.md
  D: docs/engineering/onboarding/testing.md
  E: docs/engineering/onboarding/documentation.md
  F: docs/engineering/onboarding/pr-deployment.md
mode_select: docs/engineering/guides/orchestration-selection-guide.md
```

## wave_orchestration

```yaml
spec: docs/engineering/WAVE-ORCHESTRATION-SPECIFICATION.md
complexity: (modules×0.3)+(days×0.2)+(api×0.25)+(ui×0.15)+(ext×0.1)
agents: {1-2:2agents, 2.1-3.5:3agents, 3.6-5:4agents, 5.1+:5-8agents}
hub_docs: [PRD,RFC,ORCHESTRATION,CONTEXT,POLICY-SETUP,REFERENCES]
```

## assets

```yaml
foundation: docs/foundation/[01-website,02-tech,03-business,04-landing,05-legal,06-policies].md
planning: docs/planning/[01-ia,02-design,03-content].md
wireframes: docs/wireframes/*.html (16files)
templates: docs/engineering/templates/0[1-7]-*.md
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
hosting: Vercel+Firebase #Next.js최적화,GitHubActions
```

## arch

```yaml
frontend: {fw:Next.js14+AppRouter, lang:TS, style:Tailwind+shadcn, state:Zustand+ReactQuery, build:Turbopack}
backend: {platform:Firebase, auth:Email/Phone+Kakao/Naver, db:Firestore+RealtimeDB, fn:CloudFunctions, storage:CloudStorage, push:FCM}
infra: {fe:Vercel-Seoul, be:Firebase-Seoul, ci:GitHubActions, pay:TossEscrow}
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
rollback: "git checkout v0.1-pre-pipeline"
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
