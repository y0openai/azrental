# 아조씨 렌탈 프로젝트 - Agent Handoff Reference

**Project**: Korean "아조씨 렌탈" (Ajoasi Rental) - Two-sided marketplace connecting middle-aged men ("아조씨") with customers seeking emotional support, advice, and companionship.

**Status**: Phase 0 (Foundation) ✅ COMPLETE | Phase 1 (Planning) 🔄 ENHANCEMENT PHASE | Step 3 콘텐츠 개선중 + Step 4 와이어프레임 피드백 & 반영중 | Legal Compliance ✅ COMPLETE

---

## 📋 Current Document State

### ✅ COMPLETED (5 docs)

1. **[01-website-planning.md](docs/PHASE%200/01-website-planning.md)** - 842 lines
   - Brand positioning: "아조씨 렌탈" (트렌드 단어, 친근함)
   - Complete sitemap: 40+ pages (public, customer portal, uncle portal, admin)
   - User journeys: Customer (10 steps) & Uncle/Provider (11 steps)
   - **CRITICAL**: Landing page wireframe with 10-section parallax scroll
   - **RECENT UPDATE**: Section 1 founder story changed from Japanese train incident → Korean YouTube "영포티" mockery context (lines 680-740)

2. **[02-technical-spec.md](docs/PHASE%200/02-technical-spec.md)** - 442 lines
   - **Backend**: Firebase (Firestore, Realtime DB, Cloud Functions, FCM, Storage, Auth)
   - **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind, shadcn/ui, Zustand, React Query
   - **Key Feature**: Parallax scroll landing page (Intersection Observer + CSS Transform)
   - **Hosting**: Vercel (frontend), Firebase (backend), Seoul region
   - **Payment**: Toss (primary), Kakao Pay, Naver Pay
   - **Phase 3 roadmap**: Possible migration to Cloud Run/PostgreSQL

3. **[03-business-planning.md](docs/PHASE%200/03-business-planning.md)** - Comprehensive business model
   - Benchmark: Japanese Ossan Rental (14y operation, 8.7/10 rating, 1/50 selection, 60% reuse)
   - Korean market: 10M single-person households, anti-aging trend, gender conflict context
   - Business model: 10% platform fee, Escrow payments
   - Y1: 6,000 users, ¥1.3억 won; Y3: 100,000 users (profitable)
   - Marketing: 4 target segments with specific messaging

4. **[04-landing-page-storytelling.md](docs/PHASE%200/04-landing-page-storytelling.md)** - ~650 lines
   - **11-section parallax scroll strategy** (Section 0 added)
   - **NEW Section 0** (lines 30-62): Service definition slogan with Japanese minimalism
     - "아조씨를 렌탈합니다. 상담 · 조언 · 동반 · 공감 당신의 이야기를 들어줄 믿을 수 있는 누군가"
   - **CRITICAL**: Section 1 founder story (lines 118-155) updated to Korean context:
     - OLD: Train incident with schoolgirls
     - NEW: YouTube "영포티" comments mocking middle-aged men
   - Detailed parallax speeds (updated with Section 0), React implementation, mobile optimization
   - KPI targets: 70% scroll depth, 5% CTA click, 2-3% conversion

5. **[05-legal-compliance.md](docs/PHASE%200/05-legal-compliance.md)** - 850+ lines ✅ COMPLETE (2026-01-11)
   - **법적 분류**: 숨고 모델 = 서비스 중개 플랫폼 (가사도우미 파견 아님)
   - **신원확인 승인**: ✅ 오프라인 서류 보관 허용 (본사 신분증 사본 + 신용조회)
   - **필수 신고**:
     * 사업자등록 (국세청) - 무료, 1-2일
     * 통신판매업신고 (지자체) - 무료, 1-2일
     * 이용약관/개인정보처리방침 (변호사 검토) - 100-300만원, 2-3주
   - **법적 리스크 & 회피 방법**:
     * 가짜 프리랜서 적발 금지 (지휘감독 금지 명시)
     * 불공정 약관 적발 금지 (변호사 검토 필수)
     * 신원정보 유출 금지 (암호화 + 접근 제한)
     * 성인 서비스 금지 (명확한 규칙)
   - **Timeline**: 2월 변호사자문 → 3월 법적문서 → 4월 결제시스템 → 5월 베타 → 공식론칭
   - **총 비용**: 1,000-2,000만원 (법적 대응 초기)

### 🔄 IN PROGRESS (2 docs - Step 2️⃣ COMPLETE)

1. **[01-ia-user-flows.md](docs/PHASE%201/01-ia-user-flows.md)** - 217 lines ✅ COMPLETE
   - Refined sitemap (Public, Customer Portal, Uncle Portal)
   - Core user flows (Customer booking, Uncle onboarding, Admin verification)
   - Task flows (Search, Booking, Payment, Review)
   - Mobile/Desktop UX specifications

2. **[02-design-system.md](docs/PHASE%201/02-design-system.md)** - 262 lines ✅ COMPLETE (USER APPROVED)
   - BASE: LINE Design System (https://designsystem.line.me)
   - Color palette: Primary Blue (신뢰), Secondary Green (안전), Accent Orange (따뜨함)
     ✅ **USER FEEDBACK**: MVP 후 필요하면 수정 가능 (확정)
   - Typography: Pretendard (한글) + Inter (영문), 9-level scale
     ✅ **USER FEEDBACK**: 동의 (확정)
   - Spacing: 8px Grid system (개발자 구현 세부사항 - 사용자 승인 불필요)
   - Component patterns: 버튼, 카드, 입력 필드 등 UI 모양 가이드 (개발자 구현 세부사항 - 사용자 승인 불필요)
   - Responsive design (Mobile/Tablet/Desktop) & 접근성 표준 (개발자 구현 품질 기준 - 자동 적용)

3. **[03-content-strategy.md](docs/PHASE%201/03-content-strategy.md)** - 1050+ lines ✅ COMPLETE (ENHANCED)
   - 톤앤매너: 따뜨함 + 신뢰 + 전문성 (Toss UX Writing Guide style - 존댓글, 짧은 문장, 해결책 중심)
   - 랜딩페이지 11섹션 최종 메시지
   - 주요 페이지별 콘텐츠 맵 (검색, 프로필, 예약, 메시지, 리뷰)
   - 마이크로카피 가이드 (에러, 확인, 알림 메시지)
   - **✅ 아조씨 정의 + 샘플 프로필 (Section 0.5-0.6)** - 신규 섹션:
     * "아조씨 ≠ 아저씨" 명확 구분 (검증 체계 시각화)
     * 개성 있는 3인 샘플 프로필 (영화/요리/사진 전문가)
     * 각 프로필 배경, 특기, 가격, 평점 포함
     * 각자의 철학/목소리를 따옴표로 표현
     * 일본식 프로필 스타일 자연스럽게 이식
   - **✅ 고객 후기 (Section 2.8)** - 리얼 기반 재작성:
     * 일본 Ossan Rental 벤치마크 분석 기반
     * 한국 맥락: 대입 스트레스, 이직 결정, 이혼 극복, 면접 준비, 일상 공감
     * 성별 균형: 여성 3명 + 남성 2명 + 다양한 연령대
     * 감정톤: 구체적 상황 + 감정적 변화 + 실제 결과 제시
   - **✅ 안전 경계선 명시 (Section 2.8-1)** - 신규 섹션:
     * "할 수 있어요" vs "할 수 없어요" 명확 구분
     * 신체적 접촉 금지, 연애/성인 서비스 불가 강조
     * 경계선 위반 시 즉시 활동 중단 + 환불 처리
   - **✅ FAQ 대폭 강화** (Section 2.10):
     * 검증 과정: 신분증 확인 → 배경조회 → 영상 면접 → 안전 교육
     * 합격률: 신청자 50명 중 1명 (엄격한 기준 강조)
     * 프라이버시: 아조씨가 알 수 있는 것/없는 것 명확 구분
     * 경계선 위반 시 자동 100% 환불 명시
   - CTA 전략 및 배치 규칙
   - A/B 테스트 전략

### 🔄 IN PROGRESS - ENHANCEMENT PHASE (2 docs)

1. **Wireframe collection** (Step 4️⃣) - 🔄 USER FEEDBACK & ITERATION IN PROGRESS
   - HTML/Tailwind 인터랙티브 프로토타입 생성 완료
   - 사용자 피드백 수집 중
   - 레이아웃, 색상, 상호작용 개선 진행 중
   - 예상 완료: 1-2주

2. **Content Strategy enhancement** (Step 3️⃣ - EXTENDED) - 🔄 CONTENT REFINEMENT IN PROGRESS
   - 기본 문서 완성 (1050+ 줄)
   - 새로운 섹션 추가:
     * 아조씨 정의 + 샘플 프로필 (3인 프로필 "아조씨 ≠ 아저씨" 명확 구분)
     * 고객 후기 재작성 (한국 맥락: 대입 스트레스, 이직, 이혼, 면접, 공감)
     * 안전 경계선 명시 ("할 수 있어요" vs "할 수 없어요")
     * FAQ 강화 (검증 과정, 합격률 50:1, 프라이버시, 100% 환불)
   - 예상 완료: 완료 → 최종 검토 단계

### ⏳ PENDING (1 doc - Step 5️⃣)

- **PRD Document** (Step 5️⃣) - User stories, acceptance criteria, complete specifications (Wireframe 완료 후 시작)

---

## 🔑 CRITICAL DECISIONS (Locked)

| Element | Decision | Rationale |
|---------|----------|-----------|
| **Brand Name** | 아조씨 렌탈 | "아조씨" = 2025 Korean trend word (appealing middle-aged men), more trendy than "렌탈 아재" |
| **Backend** | Google Firebase only | Real-time requirements, Korean payment gateway integration, cost-effective MVP |
| **Founder Story** | YouTube "영포티" mockery | Authentic Korean 2025 social problem (not copying Japanese model) |
| **Landing Page** | Parallax scroll | 10 sections, mixed video/photos/text, depth effect, section 1 = founder story |
| **Payment** | Toss primary + Kakao/Naver | Korean market preference order |
| **Hosting** | Vercel + Firebase | Next.js optimized, auto-deploy via GitHub Actions |

---

## 🎯 Key Content Updates (Most Recent)

### Section 0 Added + Founder Story Restructured (Both docs updated)

**Section 0 Message** (Service Definition Slogan - Japanese Minimalism):
```
"아조씨를 렌탈합니다.

상담 · 조언 · 동반 · 공감

당신의 이야기를 들어줄
믿을 수 있는 누군가"
```

**Location 1**: [01-website-planning.md:717-731](docs/PHASE%200/01-website-planning.md#L717-L731)
```
[동영상 배경: 서울 야경, 도시 장면]
"저는 유튜브를 봤습니다.
최근 몇 년, 댓글 창은 가득했습니다.
중년 남성을 조롱하는 영상들...
'영포티' '아재들' '구닥다리'

그 말들을 읽으면서 생각했습니다.

이게 정말 우리 사회의 모습일까?
중년 남성도 누군가의 아버지고
누군가를 돌보는 존재인데...

나는 그것을 바꾸고 싶었습니다."
```

**Location 2**: [04-landing-page-storytelling.md:34-69](docs/PHASE%200/04-landing-page-storytelling.md#L34-L69)
- Background: Changed to "서울 야경, 도시 장면 (밤)" (modern culture context)
- Emotional arc: 분노 → 공감 → 결심
- Story structure updated to reference online culture and social bias

---

## 🏗️ Architecture Summary

### Landing Page Structure (11 Sections)
```
Section 0: Service Definition (슬로건) - "아조씨를 렌탈합니다..."
Section 1: Founder Story (YouTube 영포티 context)
Section 2: Why We Created This (철학)
Section 3: Service Value (Hero CTA re-emphasis)
Sections 4-10: Trust Indicators → How It Works → Profiles → Testimonials → Safety → FAQ → Final CTA
```

### Three-Layer Tech Stack
```
[Next.js Frontend] → [Vercel CDN] → [Firebase Backend]
                           ↓
                    [Realtime DB] (Chat)
                    [Firestore] (Main DB)
                    [Cloud Functions] (Logic)
                    [FCM] (Notifications)
                    [Storage] (Images/Docs)
```

### MVP Features (P0)
1. User auth (Email/Phone + Kakao/Naver OAuth)
2. Uncle registration & verification (신원확인, admin approval)
3. Profile management (photos, skills, bio, availability)
4. Search & filtering (location, skills, price, rating)
5. Booking system (date/time selection, price calculation)
6. Payment integration (Toss Escrow)
7. Review system (5-star + text + tags)
8. Safety features (report button, guidelines)
9. Real-time messaging (Realtime DB)
10. Mobile responsive (bottom navigation, Korean UX)

### Database Schema (Firestore)
- `users` - Unified user (customer/uncle/admin)
- `uncle_profiles` - Bio, skills, hourly rate, rating
- `bookings` - Escrow state, date/time, price, location
- `payments` - Gateway transactions
- `reviews` - Ratings, comments, tags
- `messages` - Real-time chat
- `safety_reports` - Incident tracking
- `verification_documents` - ID, background checks
- `availability_slots` - Weekly schedule

---

## 📊 Market & Business Context

### Japanese Benchmark (Proven Model)
- **Service**: Ossan Rental (オッサンレンタル)
- **Operation**: 14 years, 1,500+ customers served, 100+ providers
- **Quality**: Tofugu rating 8.7/10, 60% reuse rate, 1/50 selection
- **Pricing**: ¥1,000/hour (currently $7 equivalent)
- **Founder Philosophy**: Founded on train incident, mission to change middle-aged men's image

### Korean Market Opportunity
- **Single-person households**: 10M+ (vs Japan 8M)
- **Aging crisis**: 고령화, 사회적 고립 증가
- **Gender conflict**: 남성혐오 문화 + YouTube "영포티" mockery (2025 trend)
- **Target segments**:
  1. Working women (상담, 조언 필요)
  2. Job seekers (면접준비, 커리어)
  3. Single households (정서적 지원)
  4. Middle-aged men (새로운 수익 창출)

### Revenue Model
- **Primary**: 10% platform fee per transaction
- **Phase 2**: Subscription tiers, premium profiles, featured listings
- **Phase 3**: Corporate packages, video consulting

---

## 🚀 Development Workflow (Document-Driven Agile)

**APPROVED APPROACH** (2026-01-10):
- **Owner**: Non-technical decision maker (user)
- **Executor**: Claude (full development responsibility)
- **Method**: Document-centric planning before code execution
- **Timeline**: Phase 1 (1 week planning) → Phase 2 (5-6 weeks development)

---

### PHASE 1: Document Planning & Strategy (User + Claude Collaboration)
**Timeline**: ~1 week | **Output**: Complete specification docs ready for development

#### Step 1️⃣: IA Refinement (1-2 days)
- Validate & enhance Sitemap from 01-website-planning.md
- Create detailed User Flow diagrams (Customer path vs Uncle path)
- Define Task flows (Search → Book → Payment → Review)
- Mobile vs Desktop UX specifications
- **Owner Decision**: User reviews diagrams, approves or requests changes
- **Claude**: Produces visual diagrams, documentation

#### Step 2️⃣: Design System Definition (1-2 days)
- Color palette strategy (trust blue, safety green, warm accent)
- Typography hierarchy (Korean + English, headings/body/labels)
- Spacing & grid system (8px base, 16px, 32px modules)
- Component patterns (button states, card layouts, form inputs, modals)
- Visual tone & imagery guidelines
- **Owner Decision**: Selects from 2-3 options presented for each element
- **Claude**: Proposes options with rationale, documents final decisions

#### Step 3️⃣: Content Strategy (1 day)
- Landing page parallax optimization (Section 0-10 content map)
- Key message per screen (landing, search, profile, booking, checkout, review)
- CTA placement & copy
- Microcopy guidelines (buttons, error states, confirmations, notifications)
- A/B testing strategy for landing page
- **Owner Decision**: Approves key messages and tone
- **Claude**: Writes comprehensive content guidelines

#### Step 4️⃣: Wireframe Sketches (2-3 days)
- Low-to-mid fidelity wireframes for 10-15 key pages:
  - Landing page (parallax structure)
  - Search & filtering (Customer perspective)
  - Uncle profile detail (with reviews, availability)
  - Booking flow (date/time selection, price calculation)
  - Payment checkout (Toss integration flow)
  - Order confirmation & messaging
  - Uncle dashboard (availability, bookings, earnings)
  - Review & rating submission
  - Mobile bottom navigation for both user types
  - Admin verification dashboard (minimal)
- Desktop + Mobile layouts
- Interaction indicators (what changes on click/scroll)
- **Owner Decision**: Reviews wireframes, requests layout changes
- **Claude**: Iterates based on feedback

#### Step 5️⃣: PRD Document Creation (2-3 days)
**Based on all above decisions**, create comprehensive PRD:
- Executive summary + business context
- User personas (3-5 distinct personas)
- User stories formatted as: "As [role], I want [action], so that [benefit]"
- Screen-by-screen requirements (linked to wireframes)
- Functional requirements per P0 feature (10 core features)
- Non-functional requirements:
  - Performance targets (page load <3s, API response <200ms)
  - Accessibility (WCAG 2.1 AA)
  - Security & data protection (한국 전자금융거래법 compliance)
  - Mobile responsiveness (iOS/Android viewport)
- Database schema requirements (Firestore collections + relationships)
- API endpoint specifications (Cloud Functions)
- Payment integration details (Toss, Kakao, Naver)
- Testing strategy (unit, integration, E2E)
- Success metrics & KPIs

---

### PHASE 2: Full Development Execution (Claude Solo)
**Timeline**: ~5-6 weeks | **Output**: Production-ready application

#### Week 1: Backend Infrastructure
- Firebase project setup (GCP, Firestore, Realtime DB, Auth, Functions, Storage)
- Database schema implementation (Firestore collections)
- Security rules (Row-level & document-level access control)
- Authentication setup (Email/Phone + Kakao/Naver OAuth)

#### Week 2: Backend APIs
- Cloud Functions development (User CRUD, Profile, Search, Booking, Payment, Review)
- Firestore queries optimization
- Admin verification workflows
- Error handling & logging

#### Week 3-4: Frontend Setup & Core Features
- Next.js 14+ setup (App Router, TypeScript, Tailwind CSS)
- shadcn/ui component library integration
- Zustand store configuration (user auth, filters, cart state)
- React Query setup (data fetching, caching)
- Layout components (header, navigation, footer)
- Authentication UI (login, signup, OAuth flows)
- Search & filtering UI (with real-time results)
- Uncle profile detail pages

#### Week 5: Payment & Advanced Features
- Toss payment integration (escrow flow)
- Booking system UI (calendar, time slots, price calculation)
- Review & rating system
- Real-time messaging (Firebase Realtime DB + UI)
- Safety reporting feature
- Availability management (uncle calendar)

#### Week 6: Polish & Testing
- Figma design system finalization (if needed for refinements)
- Responsive design verification (mobile/tablet/desktop)
- Performance optimization (image optimization, code splitting)
- E2E testing (critical paths)
- Bug fixes & edge case handling
- Deployment preparation (GitHub Actions CI/CD to Vercel)

#### Week 7: Quality Assurance & Launch
- Final security audit (Firestore rules, authentication)
- Load testing (concurrent users)
- Soft launch (limited beta)
- Production deployment

---

### Document Outputs Before Development

**These documents must be COMPLETE & APPROVED before any coding**:
1. ✅ IA & User Flow diagrams
2. ✅ Design System document (colors, typography, spacing, patterns)
3. ✅ Content Strategy guide
4. ✅ Wireframe collection (10-15 key pages)
5. ✅ Comprehensive PRD with acceptance criteria
6. ✅ Database schema design
7. ✅ API specifications

**Once approved**: No design changes during development (unless critical bugs)

---

### Role Clarity

| Task | Owner | Method |
|------|-------|--------|
| **Strategic decisions** | User | YES/NO, choose from options |
| **Document structure** | Claude | Creation + presentation |
| **Design direction** | User | Feedback + final approval |
| **Content approval** | User | Reviews key messages |
| **All coding** | Claude | Complete responsibility |
| **Quality gates** | Claude | Testing, optimization |
| **Launch readiness** | Claude | Final verification |

---

## 📝 File Organization (Phase-Based Numbering)

```
/Users/y/Workspace/papa-help-me/
├── .claude.md (this file - project handoff reference)
├── rental-ojisan-korea.md ✅ (initial Japanese research + benchmark)
│
└── docs/
    │
    ├── PHASE 0 (Foundation - Locked, never modify) ✅ COMPLETE
    │   ├── 01-website-planning.md (842 lines, brand, sitemap, user journeys)
    │   ├── 02-technical-spec.md (442 lines, Firebase, Next.js, architecture)
    │   ├── 03-business-planning.md (market analysis, business model)
    │   ├── 04-landing-page-storytelling.md (11-section parallax, founder story)
    │   └── 05-legal-compliance.md (850+ lines, 법적 분류, 신고, 리스크 회피) ⭐ NEW
    │
    ├── PHASE 1 (Planning) 🔄 IN PROGRESS
    │   ├── 01-ia-user-flows.md (CURRENT: user flow diagrams, task flows, mobile/desktop specs)
    │   ├── 02-design-system.md (NEXT: color palette, typography, spacing, components)
    │   ├── 03-content-strategy.md (key messages, CTAs, microcopy guidelines)
    │   ├── 04-wireframes.md (10-15 key pages: landing, search, profile, booking, etc.)
    │   └── 05-prd.md (comprehensive PRD: user stories, acceptance criteria, specs)
    │
    ├── PHASE 2 (Development) ⏳ NOT STARTED
    │   └── (Backend & Frontend implementation code - TBD)
    │
    └── Reference/ (supporting materials)
```

**Numbering Logic**:
- 📌 **PHASE 0**: Foundation (01-04) - Never changes, inputs for all phases
- 📌 **PHASE 1**: Planning (01-05) - New documents created in order, user approval at each step
- 📌 **PHASE 2**: Development (code repos) - Implementation

**Deleted**: `/reusable-ai-pipeline/` (removed per user request)

---

## 🌍 Documentation Language Standard

**APPROVED STANDARD (2026-01-10)**:
- **Primary Language**: 한글 (Korean)
- **All Phase 1-2 documents**: Write in Korean for clarity and accessibility
- **Code comments & technical specs**: Can include English where necessary (e.g., API names, technical terms)
- **Rationale**: User is Korean, easier comprehension, faster decision-making

**Application**:
- ✅ PHASE 1 documents (01-05): Write in Korean
- ✅ PHASE 2 code comments: Korean for business logic, English for technical terms
- ✅ Database schema: Column names in English, field descriptions in Korean
- ✅ API specs: Endpoint names in English, descriptions in Korean

---

## 💡 Key Insights & Decisions

### Why Not Supabase (Initially Considered)?
- Firebase chosen for: Real-time DB integration, better Kakao/Naver OAuth support, cost-effective for MVP

### Why Parallax Landing Page?
- Founder-centric storytelling required emotional engagement
- Parallax effect = "depth" = visual sophistication matches service positioning
- 10 sections = emotional journey (공감 → 감동 → 행동)

### Why Korean Context for Founder Story?
- Japanese train incident = inauthentic in Korean market
- YouTube "영포티" mockery = real 2025 Korean social problem
- Authentic founder narrative = stronger brand differentiation

### Phase 1 Scope Lock
- MVP focused on core booking flow (customer + uncle)
- Admin dashboard minimal (verification only)
- Chat system real-time (highest UX priority)
- No mobile app in Phase 1 (web-responsive only)

---

## 🔍 Cross-Document Dependencies

| Element | Primary Doc | Referenced In |
|---------|-------------|----------------|
| Founder story | 04-landing-page-storytelling | 01-website-planning (wireframe) |
| Tech stack | 02-technical-spec | 01-website-planning (brief mention) |
| MVP features | 01-website-planning | 03-business-planning (roadmap) |
| User journeys | 01-website-planning | 04-landing-page-storytelling (KPI targets) |
| Business model | 03-business-planning | 01-website-planning (revenue context) |

---

## ✋ Handoff Checklist for Next Agent

### When continuing Phase 1 (Document Planning):

**Critical Context**:
- [ ] Read .claude.md carefully (this file) - especially Development Workflow section
- [ ] Understand role division: Non-technical user makes decisions, Claude executes document planning & development
- [ ] Current status: Just approved Document-Driven Agile approach
- [ ] User is ready to invest 1 week in Phase 1 planning

**Current Tasks** (in order):
1. [x] Step 1️⃣: IA Refinement (validate sitemap, create user flow diagrams) ✅ COMPLETE
2. [x] Step 2️⃣: Design System Definition (LINE DS base, colors, typography, spacing) ✅ COMPLETE
3. [x] Step 3️⃣: Content Strategy (landing page + screen messaging) ✅ COMPLETE (🔄 ENHANCEMENT IN PROGRESS)
   └─ 아조씨 정의 + 샘플 프로필, 한국 맥락 고객 후기, 안전 경계선, FAQ 강화 추가 진행 중
4. [x] Step 4️⃣: Wireframe Sketches (10-15 key pages) 🔄 USER FEEDBACK & ITERATION IN PROGRESS
   └─ HTML/Tailwind 프로토타입 완성 → 사용자 피드백 수집 중 → 개선 반영 중
5. [ ] Step 5️⃣: PRD Document Creation (comprehensive specs for development) ← NEXT (Wireframe 완료 후)

**Do NOT**:
- ❌ Start any coding (Phase 2 = development only)
- ❌ Skip user feedback loops (they make strategic decisions)
- ❌ Change brand name (아조씨 렌탈 is locked)
- ❌ Modify tech stack (Firebase is locked)
- ❌ Delete or overwrite completed docs (01-04)
- ❌ Create PRD without completing steps 1-4 first

**Do**:
- ✅ Present options with rationale (especially Design System colors/typography)
- ✅ Ask for user approval/feedback before moving to next step
- ✅ Produce visual diagrams (user flows, task flows)
- ✅ Create wireframe mockups (low-fidelity, mobile + desktop)
- ✅ Write comprehensive PRD based on user-approved decisions
- ✅ Ask clarifying questions if requirements unclear

---

### When starting Phase 2 (Development):

**Prerequisites**:
- [ ] All Phase 1 documents complete & user-approved
- [ ] PRD signed off (no more design changes)
- [ ] Database schema finalized
- [ ] API specifications locked

**Then execute**:
- Week 1: Firebase infrastructure
- Week 2-7: Development per phase 2 timeline
- User role: Receives progress updates only, no decisions needed

---

**Last Updated**: 2026-01-11 21:00 (Step 4 와이어프레임 완성 + index.html 업데이트)
**Current Phase**: PHASE 1 - Step 4️⃣ Wireframe ✅ COMPLETE | Step 5️⃣ PRD 준비 중
**Next Milestone**: Step 5️⃣ PRD Document (User stories, Acceptance criteria) 시작

---

## 📈 병렬 처리 현황 (2026-01-11)

### 병렬 실행 중인 공정
```
Step 2️⃣ (Design) ✅ COMPLETE
Step 3️⃣ (Content) ✅ COMPLETE
Step 4️⃣ (Wireframe) 🔄 IN PROGRESS → 진행률 95% 이상

현재 상태 (2026-01-11 21:00):
  ✅ 16개 와이어프레임 페이지 완성
  ✅ index.html 업데이트 (페이지 목록 정리)
  ✅ 모든 페이지 내비게이션 연결
  🔄 사용자 피드백 수집 중
```

### 와이어프레임 완성 현황

**📱 총 16개 페이지 (4개 섹션)**

```
🔐 인증 (4개)
  1. 고객 회원가입 (customer-signup.html) ✅
  2. 고객 로그인 (customer-login.html) ✅
  3. 아조씨 신청 (uncle-signup.html) ✅
  4. 아조씨 로그인 (uncle-login.html) ✅

🏠 로그인 후 (2개) ✨ NEW SECTION
  5. 고객 홈 (home-customer.html) ✅ [블루 테마, 예약+추천]
  6. 아조씨 홈 (home-uncle.html) ✅ [레드 테마, 요청+통계]

⭐ 핵심 기능 (9개)
  7. 랜딩 페이지 (landing.html) ✅
  8. 검색 & 필터링 (search.html) ✅
  9. 아조씨 프로필 (profile.html) ✅
  10. 예약 플로우 (booking.html) ✅
  11. 결제 체크아웃 (checkout.html) ✅
  12. 고객 대시보드 (dashboard-customer.html) ✅
  13. 아조씨 대시보드 (dashboard-uncle.html) ✅
  14. 메시징 (messages.html) ✅
  15. 리뷰 작성 (review.html) ✅

👨‍💼 관리자 (1개)
  16. 신원 검증 관리 (admin.html) ✅
```

### 순차 진행 상태
```
Step 2️⃣ (Design) ✅ COMPLETE
Step 3️⃣ (Content) ✅ COMPLETE
    ↓
Step 4️⃣ Wireframe Sketches ✅ COMPLETE (16/16 pages)
    ├─ 포맷: HTML/Tailwind 인터랙티브 프로토타입
    ├─ 배포: `/docs/wireframes/` 폴더 (16 HTML 파일 + styles.css)
    ├─ 특징:
    │  • LINE DS 색상 체계 완전 적용
    │  • 모바일/데스크톱 반응형 설계
    │  • 모든 페이지 상호 링크 완성
    │  • 사용자 타입별 분리 (고객/아조씨)
    │  • 일관된 네비게이션 구조
    ├─ 완성도:
    │  • 비개발자 검토 가능 (브라우저에서 실시간 확인)
    │  • 모든 CTA 버튼 작동 가능
    │  • 레이아웃 및 색상 시스템 일관성 ✅
    │  • 모바일 하단 네비게이션 (모든 페이지) ✅
    └─ 다음 단계: 사용자 피드백 & 수정 반영
    ↓
Step 5️⃣ PRD Document (User stories, acceptance criteria) ← NEXT
```

---

## 🎨 Step 4️⃣ 와이어프레임 전략 (2026-01-11 결정)

### 포맷: HTML/Tailwind 인터랙티브 프로토타입

**선택 이유**:
1. **시각성**: 비개발자도 즉시 이해 가능한 웹페이지 형태
2. **상호작용**: 클릭해서 다음 화면으로 이동 등 실제 동작 시뮬레이션
3. **반응형**: 모바일/태블릿/데스크톱 동시 확인
4. **수정 용이**: CSS/HTML 수정만으로 빠른 반복
5. **설계 충실도**: 실제 디자인 시스템 적용

**산출물 구조**:
```
docs/
├── wireframes/
│   ├── index.html (메인 네비게이션 페이지)
│   ├── landing.html (11섹션 패럴랙스 랜딩)
│   ├── search.html (검색 & 필터링)
│   ├── profile.html (아조씨 프로필 상세)
│   ├── booking.html (예약 플로우)
│   ├── checkout.html (결제 체크아웃)
│   ├── dashboard-customer.html (고객 대시보드)
│   ├── dashboard-uncle.html (아조씨 대시보드)
│   ├── messages.html (메시징)
│   ├── review.html (리뷰 작성)
│   ├── admin.html (관리자 검증)
│   └── styles.css (LINE DS 색상 + Tailwind)
│
├── PHASE 1/
│   └── 04-wireframes.md (완성 후 마크다운으로 정리)
```

**개발 프로세스**:
1. HTML 프로토타입 생성 (4-6시간)
2. 사용자 검토 (실시간 피드백)
3. 수정 & 재검토 (iterative)
4. 최종 승인
5. 마크다운 문서화 (04-wireframes.md)
