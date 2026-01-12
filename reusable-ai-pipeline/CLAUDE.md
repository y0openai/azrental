# CLAUDE.md - 프로젝트 설정 템플릿

> **Root Anchor**: 이 문서는 {PROJECT_NAME} 프로젝트의 단일 진실 공급원입니다.
> **Date**: {YYYY-MM-DD}
> **Version**: 4.1 (Wave Orchestration + Project Router)

---

## 🚀 신규 에이전트 온보딩 프로토콜

**IMPORTANT**: 신규 에이전트는 **Step 0**부터 순서대로 진행해야 합니다. 사용자의 선택에 따라 적절한 경로로 안내합니다.

---

### Step 0: 프로젝트 유형 선택 (Project Type Selection) ⭐

**에이전트 행동**: CLAUDE.md를 읽은 직후, **반드시** 아래 질문을 먼저 출력하세요:

```
🎯 프로젝트 유형을 선택해주세요:

[A] 🌱 신규 프로젝트 - 코드 없음, 처음부터 시작
[B] 🔧 기존 프로젝트 - 유지보수, 기능 추가
[C] 💬 자유 대화 - 질문/상담만

선택 (A/B/C):
```

**분기 처리**:
- **[A] 선택 시**: `AGENT-ONBOARDING-GREENFIELD.md` 읽기 → 신규 프로젝트 온보딩 시작
- **[B] 선택 시**: `AGENT-ONBOARDING-EXISTING.md` 읽기 → Step 1(역할 선택)으로 진행
- **[C] 선택 시**: 온보딩 스킵 → 자유 대화 모드 (사용자 질문 대기)

---

### ✨ 핵심 기능

이 프로젝트는 **Wave Orchestration** 시스템을 사용합니다:

- **🌊 Wave Orchestration** (Step 6)
  - 동적 멀티 페이즈 오케스트레이션 → 무제한 프로젝트 크기 대응
  - Sub-agent를 페이즈마다 새로 생성 (Task 도구 활용)
  - PM은 시작 지시 + 최종 승인만 (정보 허브 역할 제거)

- **🧠 복잡도 자동 판단**
  - 복잡도 점수로 Phase 수 자동 결정 (2-6 phases)
  - Sub-agent 수 자동 할당 (2-8명)

- **📊 JSON 극한 압축 + 역추적**
  - 1000 토큰 → 100 토큰 (90% 압축)
  - Hash + Cache로 100% 역추적 가능

- **🔄 자동 에러 처리**
  - Sub-agent 에러 시 자동 재시도 (최대 2회)
  - 실패 시 PM에게 Decision Report + 대안 제시

- **📈 Progress Dashboard**
  - 실시간 진행 현황 자동 생성
  - Sub-agent별 진행률 & 최근 활동 표시

---

### Step 1: 역할 선택 (Role Selection)

**에이전트 행동**: CLAUDE.md를 읽은 직후, 사용자에게 다음 질문을 출력하세요:

```
✅ CLAUDE.md 읽기 완료.

이 세션에서 수행할 주요 임무를 선택해주세요:

| 번호 | 역할 | 설명 | 소요 시간 | 난이도 |
|------|------|------|----------|--------|
| **1** | **신규 기능 개발** | 완전히 새로운 기능을 처음부터 끝까지 개발 | 3-4시간 | ⭐⭐⭐ |
| **2** | **버그 수정** | 기존 기능의 명확한 버그를 빠르게 수정 | 30분 | ⭐ |
| **3** | **리팩토링** | 코드 품질 개선, 기술 부채 해소 | 1-2시간 | ⭐⭐ |
| **4** | **테스트/QA** | 품질 보증, 테스트 자동화 | 1-2시간 | ⭐⭐ |
| **5** | **문서화** | 제품/기술 문서 작성/업데이트 | 1-2시간 | ⭐ |
| **6** | **PR 검토 & 배포** | 완성된 코드 검토, 배포 | 30분 | ⭐⭐ |

번호를 입력해주세요 (1-6):
```

**사용자 입력 대기** → 역할 선택 → Step 2로 자동 진행

---

### Step 2: 역할별 학습 경로 (Auto-Execution)

**에이전트 행동**: 사용자가 번호를 선택하면, 해당 역할의 필수 문서를 **자동으로 Read 도구로 읽고**, 핵심 개념을 요약한 후 대기 상태를 보고하세요.

#### 1번: 신규 기능 개발 (New Feature Development)

**필수 문서**:
- `docs/engineering/guides/onboarding/new-feature.md`
- 개발 모드 선택: `docs/engineering/guides/design/orchestration-selection-guide.md`
- 에이전트 역할: `docs/engineering/guides/development/agent-roles.md`

**⚠️ 강제 실행 Gate (MANDATORY)**:
```yaml
step_1: "PRD 읽기"
step_2: "복잡도 계산 (아래 공식 사용)"
step_3: "결과에 따라 자동 분기"
  gate:
    complexity < 2.0: "Single Agent 허용"
    complexity ≥ 2.0: "Wave Orchestration 강제"
step_4: "Wave 선택 시 03-ORCHESTRATION.md 작성 → PM 승인 → 실행"

warning: "복잡도 계산 없이 코딩 시작 금지"
```

**프로세스**:
1. **복잡도 계산** (필수)
2. complexity < 2.0 → Single Agent Mode
3. complexity ≥ 2.0 → Wave Orchestration:
   - Phase 0: 확장 문서 작성 (2.5-3시간) - 6개 문서
   - Phase 1+: Sub-agent 병렬 생성 (Task 도구)
   - Phase별 자동 완료 & 다음 Phase 준비

#### 2번: 버그 수정 (Bug Fix)

**필수 문서**: `docs/engineering/guides/onboarding/bug-fix.md`

**프로세스**:
1. 버그 재현 확인
2. 원인 분석 (최소 변경)
3. 코드 수정
4. 로컬 테스트
5. PR 생성 & 배포

#### 3번: 리팩토링 (Refactoring)

**필수 문서**: `docs/engineering/guides/onboarding/refactoring.md`

#### 4번: 테스트/QA (Testing & QA)

**필수 문서**: `docs/engineering/guides/onboarding/testing.md`

#### 5번: 문서화 (Documentation)

**필수 문서**: `docs/engineering/guides/onboarding/documentation.md`

#### 6번: PR 검토 & 배포 (PR Review & Deployment)

**필수 문서**: `docs/engineering/guides/onboarding/pr-deployment.md`

---

### Step 3: 온보딩 완료 보고 (Mandatory Report)

**에이전트 행동**: Step 2에서 문서를 읽은 후, **반드시** 아래 형식으로 보고하세요:

```
✅ 온보딩 완료 보고

선택한 역할: {역할명}

읽은 문서:
- {문서 경로 1}
- {문서 경로 2 (있다면)}

복잡도 계산 (1번 선택 시 필수):
- 공식: (modules×0.3)+(days×0.2)+(api×0.25)+(ui×0.15)+(ext×0.1)
- 계산: ({값}×0.3)+({값}×0.2)+({값}×0.25)+({값}×0.15)+({값}×0.1) = {총점}
- 결과: {Single Agent / Wave Orchestration}

이해한 핵심 개념 3가지:
1. {핵심 개념 1}
2. {핵심 개념 2}
3. {핵심 개념 3}

실행 모드: {Single / Wave}
준비 상태: ✅ 작업 요구사항 수집 대기 중
```

**⚠️ 1번(신규 기능 개발) 선택 시 복잡도 계산은 필수입니다. 스킵 금지.**

---

## 🌊 Wave Orchestration 프로토콜 (Step 6)

> **참고**: 전체 기술 명세는 `WAVE-ORCHESTRATION-SPECIFICATION.md` 참조

### 6.1 동적 에이전트 할당

**복잡도 점수 공식**:
```
복잡도 = (영향 모듈 수 × 0.3) + (예상 일수 × 0.2) + (신규 API × 0.25) + (UI 화면 × 0.15) + (외부 연동 × 0.1)
```

**에이전트 수 결정**:
| 복잡도 | 에이전트 수 | Phase 수 |
|--------|-----------|---------|
| 1.0-2.0 | 2명 | 2-3 |
| 2.1-3.5 | 3명 | 3-4 |
| 3.6-5.0 | 4명 | 4-5 |
| 5.1+ | 5-8명 | 5-6 |

### 6.2 Phase 기반 실행 구조

```
Phase 0: 기획 & 설계 (Orchestrator + PM)
   ├─ 복잡도 점수 계산
   ├─ Phase 수 & Sub-agent 수 결정
   └─ 확장 문서 작성 (6개: PRD, RFC, ORCHESTRATION, CONTEXT, POLICY-SETUP, REFERENCES)

Phase 1: 병렬 실행 (Sub-agent N명)
   ├─ Task 도구로 Sub-agent 자동 생성
   ├─ 각 Sub-agent는 04-CONTEXT.md + 03-ORCHESTRATION.md + KB.md 로드
   ├─ 병렬 작업 (동시 실행)
   └─ 결과 JSON 형식 + Hash 기반 압축

Orchestrator 분석 (Phase 간 통합)
   ├─ Sub-agent 결과 수신
   ├─ 충돌 검사 (동일 파일 수정 여부)
   ├─ 의존성 자동 검증
   └─ Phase N+1 계획 수립

Phase 2..N: 반복 (필요 시)
   ├─ 새로운 Sub-agent 배치 생성
   ├─ Phase 1 결과 + Context 포함
   └─ 점진적 개선 진행

최종 통합 & 배포
   ├─ 전체 통합 테스트
   ├─ PR 생성
   └─ Staging/Production 배포
```

### 6.3 컨텍스트 관리: JSON 극한 압축

**문제**: Phase 누적 시 토큰 폭증 (100K+ tokens)

**해결**:
```json
{
  "phase": 2,
  "complexity": 2.8,
  "summary": "Backend: 3 APIs, Frontend: 5 components, integration 80%",
  "critical_changes": ["firestore_schema_v2", "auth_flow_updated"],
  "phase1_outputs": {
    "backend_hash": "abc123",
    "frontend_hash": "def456",
    "integration_hash": "ghi789"
  },
  "blockers": "None",
  "next_phase_inputs": ["backend.apis", "frontend.hooks"]
}
```

**효과**: 1000 토큰 → 100 토큰 (90% 절약)

**역추적**: Hash + Cache 메커니즘으로 100% 복구 가능

### 6.4 Progress Dashboard (자동 생성)

**Orchestrator가 실시간 업데이트**:
```
📊 진행 현황 Dashboard

┌─────────────────────────────────────────┐
│  기능: {기능명}                          │
│  시작: {시작 시간} | 예상 완료: {예상}   │
├─────────────────────────────────────────┤
│  [Backend]    ████████░░░░░░░░  50%    │
│  [Frontend]   ██████░░░░░░░░░░░  30%    │
│  [QA]         ░░░░░░░░░░░░░░░░░░  대기 │
│  전체 진행률: ███████░░░░░░░░░░░  40%   │
├─────────────────────────────────────────┤
│  최근 활동:                              │
│  • 10:30 - Backend: Schema 완료         │
│  • 10:25 - Frontend: Hooks 시작         │
└─────────────────────────────────────────┘
```

### 6.5 에러 처리 (Self-Healing)

**Sub-agent 에러 발생 시**:
1. Orchestrator가 에러 감지
2. 자동 재시도 (최대 2회)
3. 실패 시 PM에게 Decision Report:
   ```
   ⚠️ Sub-agent 에러

   에이전트: Frontend Agent
   에러: {구체적 내용}

   제시된 대안:
   A) 다른 접근 방식으로 재시도
   B) 해당 Task를 다른 Agent에게 재할당
   C) PM 직접 개입 요청

   선택해주세요 (A/B/C):
   ```

---

## Project Status

### 프로젝트 정보

**프로젝트명**: {PROJECT_NAME}
**버전**: v{VERSION}
**상태**: {STATUS}

### 배포 환경

```
┌─ Development (Localhost)
│  └─ `npm run dev` → localhost:5173
│
├─ Staging
│  └─ {STAGING_URL}
│
└─ Production
   └─ {PRODUCTION_URL}
```

### 최근 진행 상황

**완료된 기능**:
- {기능 1}
- {기능 2}

**현재 진행 중**:
- {기능 3}

**다음 예정**:
- {기능 4}

---

## Essential Commands

### Development

```bash
npm run dev          # 로컬 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
```

### Testing

```bash
npm run test         # 단위 테스트 실행
npm run test:cov     # 커버리지 리포트
```

### Deployment

```bash
npm run deploy       # Production 배포
npm run deploy:stag  # Staging 배포
```

---

## Architecture & Tech Stack

### Frontend

**Framework**: {FRAMEWORK} (e.g., React, Vue, Angular)
**Build Tool**: {BUILD_TOOL} (e.g., Vite, Webpack)
**Styling**: {STYLING_SOLUTION}
**State Management**: {STATE_MANAGEMENT}

### Backend

**Platform**: {BACKEND_PLATFORM} (e.g., Firebase, AWS, Supabase)
**Authentication**: {AUTH_SOLUTION}
**Database**: {DATABASE_TYPE}
**Serverless**: {SERVERLESS_PLATFORM}

### Infrastructure

**Hosting**: {HOSTING_SERVICE}
**CI/CD**: {CI_CD_PLATFORM}
**Monitoring**: {MONITORING_TOOL}

---

## Database Schema (v{VERSION})

### Collections/Tables

```
{COLLECTION_NAME}
├─ {field1} (type) - {description}
├─ {field2} (type) - {description}
└─ {field3} (type) - {description}
```

**예시 (Firebase Firestore)**:
```
users
├─ uid (string) - Primary Key
├─ email (string) - User email
├─ displayName (string) - Display name
├─ role (string) - 'admin' | 'user' | 'guest'
└─ createdAt (timestamp) - Account creation date
```

---

## Important References

### 🌊 Wave Orchestration System

- **기술 명세**: `WAVE-ORCHESTRATION-SPECIFICATION.md` (완전한 기술 문서)
- **진화 로드맵**: `PIPELINE-EVOLUTION-ROADMAP.md` (향후 업그레이드 계획)

### 📚 Development Guides

모든 가이드는 `docs/engineering/guides/`에 위치:

**계획 (Planning)**:
- `planning/prd-writing-full.md` - PRD 작성 가이드
- `planning/feature-hub-structure.md` - 기능 문서 구조

**설계 (Design)**:
- `design/orchestration-selection-guide.md` - Mode 1/2 선택 기준
- `design/interface-contracts.md` - Mock 인터페이스 정의
- `design/policy-driven.md` - 정책 기반 아키텍처

**개발 (Development)**:
- `development/agent-roles.md` - Mode별 에이전트 역할
- `development/orchestrator-knowledge-transfer.md` - Orchestrator 가이드
- `development/multi-agent-context-passing.md` - 병렬 협업 방식
- `development/documentation-sync-protocol.md` - ⭐ 문서-코드 동기화 프로토콜
- `development/tdd-workflow.md` - TDD 워크플로
- `development/coding-conventions.md` - 코딩 규칙

**온보딩 (Onboarding)**:
- `onboarding/new-feature.md` - 신규 기능 개발
- `onboarding/bug-fix.md` - 버그 수정
- `onboarding/refactoring.md` - 리팩토링
- `onboarding/testing.md` - 테스트/QA
- `onboarding/documentation.md` - 문서화
- `onboarding/pr-deployment.md` - PR & 배포

### 📋 Document Templates

`templates/` 폴더의 템플릿들을 사용하여 Phase 0 문서 작성:
- `templates/01-PRD-template.md` - Product Requirements
- `templates/02-RFC-template.md` - Request for Comments
- `templates/03-ORCHESTRATION-template.md` - Task 정의
- `templates/04-CONTEXT-template.md` - Background knowledge
- `templates/05-POLICY-SETUP-template.md` - Dynamic configuration
- `templates/06-AGENT-REFERENCES-template.md` - Reference links

---

*Made with Claude Code Agent Swarm & Wave Orchestration*
*Last updated: {YYYY-MM-DD}*
