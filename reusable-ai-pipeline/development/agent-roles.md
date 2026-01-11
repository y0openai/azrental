# 에이전트 역할 가이드

> **목적**: 4명 에이전트 각자의 역할과 책임 명확화 (Mode별 상세 안내)
> **대상**: 모든 에이전트
> **읽는 시간**: 10분 (일반) + Mode별 5분

---

## ℹ️ Mode 1 (병렬)을 선택했다면

**중요**: Mode 1 (4명 병렬)으로 개발하기로 결정되었다면 먼저 이 문서를 읽으세요:

→ **[multi-agent-context-passing.md](multi-agent-context-passing.md)**
- 복수 에이전트가 어떻게 협업하는지
- 컨텍스트가 어떻게 공유되는지
- 실제로는 어떤 프로세스로 진행되는지

이 문서를 읽으면:
- 당신이 왜 이 세션을 받게 되었는지
- `03-ORCHESTRATION.md`가 무엇인지
- 당신이 해야 할 역할이 무엇인지

이해할 수 있습니다.

---

## 🚀 먼저 확인: 당신의 개발 모드는?

**당신이 어느 모드로 개발하는지 먼저 확인하세요**:

- **Mode 1: 병렬 개발** → 4명이 동시에 작업
  - 각 Agent가 자신의 섹션만 읽기
  - "### Mode 1" 섹션만 확인
  - 👉 [multi-agent-context-passing.md](multi-agent-context-passing.md) 필독

- **Mode 2: 순차 개발** → 1명이 순서대로 작업
  - 전체 에이전트가 하나씩 작업
  - "### Mode 2" 섹션 확인

모르겠다면 → `orchestration-selection-guide.md` 참조

---

## 🎭 4명 에이전트 역할 (Mode 1: 병렬 개발)

| Agent | 역할 | 주요 책임 | Mock 사용 |
|-------|------|----------|----------|
| Agent 1 | Backend | Cloud Functions, Firestore | ❌ 실제 DB |
| Agent 2 | Frontend Core | Hooks, Services | ✅ Mock Backend |
| Agent 3 | Frontend UI | Components, Styling | ✅ Mock Hooks |
| Agent 4 | QA | Tests, Coverage | ✅ Mock All |

---

## 🔧 Agent 1: Backend

### 책임 영역

```
functions/
├─ index.js          ← 라우팅만 (200줄 이하)
├─ services/
│   └─ {도메인}Service.js  ← 비즈니스 로직
└─ __tests__/
    └─ {도메인}Service.test.js
```

### 필수 읽기

| 문서 | 섹션 |
|------|------|
| `development/coding-conventions.md` | 섹션 10: Cloud Functions 개발 규칙 |
| `design/policy-driven.md` | 전체 (정책 기반 설정) |
| `reference/folder-structure.md` | 전체 |

### Day 1-7 체크리스트

- [ ] Day 1: Firestore 스키마 설계 + Security Rules
- [ ] Day 2-5: Cloud Functions 구현 (TDD)
  - [ ] 테스트 먼저 작성 (Red)
  - [ ] 최소 코드 구현 (Green)
  - [ ] 리팩토링 (Refactor)
- [ ] Day 6: 정책 설정 (`policy_configs/{도메인}`)
- [ ] Day 7: 단위 테스트 완료 (90%+ 커버리지)

### 코드 패턴

```javascript
// functions/services/{domain}Service.js
const { getPolicyConfig } = require('../utils/policyService');

async function processAction(requestId, userId) {
  // 1. 정책에서 설정 로드 (하드코딩 금지)
  const policy = await getPolicyConfig('{domain}');
  const config = policy.{configKey};  // 예: 정책에서 값 로드

  // 2. 트랜잭션으로 원자적 업데이트
  await db.runTransaction(async (t) => {
    // ...
  });
}

module.exports = { processAction };
```

---

## 🎣 Agent 2: Frontend Core

### 책임 영역

```
src/
├─ hooks/
│   ├─ use{기능}.js
│   └─ __mocks__/
│       └─ use{기능}.mock.js  ← Agent 3용 Mock
├─ services/
│   ├─ {도메인}Service.js
│   └─ __mocks__/
│       └─ {도메인}Service.mock.js
└─ __tests__/
    └─ hooks/
        └─ use{기능}.test.js
```

### 필수 읽기

| 문서 | 섹션 |
|------|------|
| `development/coding-conventions.md` | 섹션 4-6: 컴포넌트, 서비스, 상태 관리 |
| `design/interface-contracts.md` | Mock 사용법 |

### Day 1-7 체크리스트

- [ ] Day 1: Hook 인터페이스 정의 + Mock 생성
- [ ] Day 2-5: Hook 구현 (TDD, Mock Backend 사용)
  - [ ] 테스트 먼저 작성 (Red)
  - [ ] 최소 코드 구현 (Green)
  - [ ] 리팩토링 (Refactor)
- [ ] Day 6: Service 레이어 완성
- [ ] Day 7: 단위 테스트 완료 (85%+ 커버리지)

### Mock 패턴

```javascript
// src/services/__mocks__/{domain}Service.mock.js
export const mock{Domain}Service = {
  processAction: jest.fn().mockResolvedValue({
    success: true,
    newBalance: 5,
    heldAmount: 5
  }),
  releaseDeposit: jest.fn().mockResolvedValue({
    success: true,
    newBalance: 10
  })
};
```

---

## 🎨 Agent 3: Frontend UI

### 책임 영역

```
src/
├─ components/
│   ├─ {카테고리}/
│   │   ├─ {컴포넌트}.jsx
│   │   └─ {컴포넌트}.css
│   └─ __tests__/
│       └─ {컴포넌트}.test.jsx
└─ styles/
    └─ tokens/  ← Material Design 3 토큰
```

### 필수 읽기

| 문서 | 섹션 |
|------|------|
| `development/coding-conventions.md` | 섹션 4: 컴포넌트 개발 규칙 |
| `design/interface-contracts.md` | UI Props Interface |

### Day 1-7 체크리스트

- [ ] Day 1: 컴포넌트 Props 인터페이스 정의
- [ ] Day 2-5: 컴포넌트 구현 (TDD, Mock Hooks 사용)
  - [ ] 테스트 먼저 작성 (Red)
  - [ ] 최소 코드 구현 (Green)
  - [ ] 리팩토링 (Refactor)
- [ ] Day 6: 스타일링 (Material Design 3)
- [ ] Day 7: 컴포넌트 테스트 완료 (80%+ 커버리지)

### 스타일 패턴

```css
/* src/components/deposit/DepositStatus.css */
.deposit-status {
  /* Material Design 3 토큰 사용 */
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
}

.deposit-status--held {
  background: var(--md-sys-color-warning-container);
}
```

---

## 🧪 Agent 4: QA

> **중요**: QA Agent는 Mode 1 (병렬 개발)에서 **의도적으로 필수 역할**입니다.
> - ❓ Q1: "테스터는 누락했어?" → **아니요, 명시적으로 포함**
> - ❓ Q2: "TDD라서 테스터 불필요?" → **아니요, 보완적 역할 (아래 설명)**
> - ❓ Q3: "스테이징 테스트 누구의 역할?" → **QA Agent (Day 8-14에서)**

---

### 📌 TDD vs QA Testing: 보완적 관계

**❌ 잘못된 이해**:
- "TDD를 하니까 따로 테스터가 필요없다"

**✅ 올바른 이해**:

| 단계 | 담당 | 목적 | 범위 | 예시 |
|------|------|------|------|------|
| **Unit Test (TDD)** | Agent 1-3 | 개별 함수/컴포넌트 검증 | 단일 레이어 | `holdDeposit()` 함수 테스트 |
| **Integration Test** | Agent 4 | 여러 레이어 상호작용 검증 | 크로스 레이어 | "depositService + DB + Hook" |
| **E2E Test** | Agent 4 | 사용자 시나리오 검증 | 전체 플로우 | "선금 → 예약 → 완료 → 환불" |
| **Staging Deployment Test** | Agent 4 | 실제 환경 검증 | 프로덕션 환경 | "Staging에서 실제 함수 실행" |

**핵심**:
- **Unit Test** (TDD): 개별 부품이 제대로 작동하는가?
- **Integration/E2E Test** (QA): 부품들이 함께 제대로 작동하는가?
- **Staging Test** (QA): 실제 환경에서 제대로 작동하는가?

---

### 📋 책임 영역

```
tests/
├─ integration/
│   └─ {기능}.integration.test.js      ← Day 5-6 (병렬 중)
├─ e2e/
│   └─ {기능}.e2e.test.js              ← Day 7 (병렬 중)
├─ staging-deployment/                 ← Day 9-12 (통합 중)
│   └─ {기능}.staging.test.js
└─ fixtures/
    └─ {도메인}Fixtures.js
```

---

### 📅 Day 1-7 체크리스트 (병렬 단계: Mock 모두 사용)

**목표**: 다른 3명 에이전트가 완료되기 전에 테스트 인프라 준비 완료

- [ ] Day 1-2: 테스트 인프라 설정 (Jest, Vitest, E2E 프레임워크)
- [ ] Day 3-4: 단위 테스트 템플릿 작성 (Agent 1-3의 테스트 리뷰)
- [ ] Day 5-6: 통합 테스트 시나리오 작성 (실제 코드 없이 인터페이스 기반)
- [ ] Day 7: E2E 테스트 스크립트 준비 (시뮬레이션 기반)

> **주의**: Day 1-7은 **아직 실제 구현 코드가 없음**. Mock과 Interface Contracts를 기반으로 테스트를 작성.

---

### 📅 Day 8-14 체크리스트 (통합 단계: 실제 코드 + Staging)

**목표**: Mock 제거 → 실제 코드 연결 → Staging 검증

- [ ] Day 8-10: 백엔드 + 프론트엔드 단위 테스트 실행
  - Agent 1-3이 작성한 TDD 테스트 실행 및 통과 확인
  - 단위 테스트 커버리지 90%+ 검증

- [ ] Day 11-12: 통합 테스트 실행
  - Mock 제거 → 실제 코드 연결
  - Integration 테스트 실행
  - 버그 발견 시 각 Agent에 피드백

- [ ] **Day 13: Staging Deployment Test 실행** ⭐ (QA의 최종 책임)
  - Staging Firestore 연동 (실제 Cloud Functions)
  - E2E 테스트 실행
  - 실제 FCM 알림 검증
  - 실제 결제/환불 로직 검증

- [ ] Day 14: 커버리지 리포트 생성 + Production 배포 권고

---

### 필수 읽기

| 문서 | 섹션 | 읽는 시간 |
|------|------|----------|
| `04-TEST-SCENARIOS.md` | 전체 (해당 기능) | 30분 |
| `testing/integration-checklist.md` | 전체 | 20분 |
| `testing/staging-deployment-guide.md` | ⭐ Staging 테스트 가이드 | 25분 |

---

### 코드 패턴

```javascript
// tests/integration/depositFlow.integration.test.js
// Day 5-6: Mock 기반 통합 테스트 (병렬 중)
import { mockCreditService } from '../../src/services/__mocks__/creditService.mock';

describe('Deposit Flow Integration (Mock)', () => {
  test('선금 → 예약 → 완료 → 환불 플로우', async () => {
    const result = await completeDepositFlow(mockCreditService);
    expect(result.status).toBe('completed');
  });
});

// tests/staging-deployment/depositFlow.staging.test.js
// Day 13: 실제 코드 + Staging Firestore (통합 중)
import { initializeTestingModule } from '@firebase/testing-utils';

describe('Deposit Flow (Staging + Real Functions)', () => {
  beforeAll(async () => {
    // 실제 Staging Firestore 연결
    const firestore = await initializeTestingModule({
      projectId: '{project}-staging'
    });
  });

  test('선금 → 예약 → 완료 → 환불 플로우 (실제)', async () => {
    // 실제 holdDeposit() Cloud Function 호출
    const result = await callFunction('holdDeposit', {
      requestId: 'req123',
      crewId: 'crew456'
    });
    expect(result.success).toBe(true);
  });
});
```

---

### Mock vs Real 테스트 비교

| 시점 | Mock 테스트 | Real 테스트 |
|------|-----------|-----------|
| **Day 5-6** | ✅ Agent 4 진행 | ❌ 아직 실제 코드 없음 |
| **Day 8-12** | ❌ 제거됨 | ✅ 실제 코드 연결 |
| **Day 13** | - | ✅ Staging 환경에서 실제 실행 |
| **목적** | 인터페이스 검증 | 통합 검증 + 환경 검증 |

---

## 🔄 병렬 개발 규칙

### Days 1-7: 독립 개발 (각자 Mock 사용)

```
Agent 1 (Backend):
  - 실제 Firestore 스키마 설계
  - Cloud Functions 구현 (TDD)
  - 단위 테스트 작성 + 실행

Agent 2 (Frontend Core):
  - Mock Backend 사용 → Agent 1 차단 없음
  - Hook 구현 (TDD)
  - 단위 테스트 작성 + 실행

Agent 3 (Frontend UI):
  - Mock Hooks 사용 → Agent 2 차단 없음
  - 컴포넌트 구현 (TDD)
  - 단위 테스트 작성 + 실행

Agent 4 (QA): ⭐ 동시에 병렬 진행
  - 테스트 인프라 설정
  - 통합 테스트 시나리오 작성 (Mock 기반)
  - E2E 테스트 스크립트 준비
  - 모든 Mock 사용 → 다른 Agent와 무관하게 독립 진행
```

### Days 8-14: 통합 + Staging 검증

```
Day 8-10:
  - Mock 제거 → 실제 코드 연결
  - Agent 1-3의 단위 테스트 실행 (90%+ 통과)

Day 11-12:
  - Agent 4의 통합 테스트 실행 (Mock 제거)
  - 버그 발견 시 각 Agent에 피드백

Day 13: ⭐ Staging Deployment Test (QA의 최종 책임)
  - Staging Firestore + 실제 Cloud Functions
  - E2E 테스트 실행 (실제 환경)
  - 실제 결제/환불/알림 로직 검증

Day 14:
  - 커버리지 리포트
  - Production 배포 권고
```

---

## ✅ 공통 체크리스트

모든 Agent:

- [ ] KB.md 읽고 TDD 원칙 이해
- [ ] Interface Contracts 확인
- [ ] 테스트 먼저 작성 (Red)
- [ ] 최소 코드 구현 (Green)
- [ ] 리팩토링 후 테스트 재실행 (Refactor)
- [ ] 구조/기능 변경 분리 커밋

---

---

## 🎭 순차 개발 (Mode 2: 순차 개발)

> **적용 시기**: 리소스 제한, 짧은 기간 (1-2일), 단순한 기능
> **에이전트**: 1명이 모든 역할을 순차적으로 수행
> **Duration**: Days 1-14 (Phase별 진행)

### 구조

```
단일 Agent가 다음 순서로 역할 전환:
Day 1-2:    Agent 1 (Backend) - 스키마 및 API 설계
Day 3-5:    Agent 2 (Frontend Core) - Hooks 및 Services 구현
Day 6-8:    Agent 3 (Frontend UI) - 컴포넌트 및 스타일링
Day 9-12:   Agent 4 (QA) - 테스트 및 검증
Day 13-14:  통합 및 배포
```

### 단계별 역할 전환

#### Phase 1: Backend (Day 1-2) - Agent 1 역할 수행

**책임**:
- Firestore 스키마 설계
- Security Rules 작성
- Cloud Functions 골격 구현 (라우팅)

**필수 읽기**:
- `development/coding-conventions.md` | 섹션 10: Cloud Functions 개발 규칙
- `design/policy-driven.md` | 전체
- `reference/backend/folder-structure.md`

**Day 1-2 체크리스트**:
- [ ] Day 1: Firestore 스키마 정의 (users, experiences, requests, credit_transactions)
- [ ] Day 1: Security Rules 작성 (인증, 인가, 데이터 접근 제어)
- [ ] Day 2: Cloud Functions 라우팅 구현 (index.js)
- [ ] Day 2: 기본 서비스 레이어 구조 설정 (functions/services/)
- [ ] Mock Backend 데이터 정의 (Agent 2가 사용할 interface contracts)

---

#### Phase 2: Frontend Core (Day 3-5) - Agent 2 역할 수행

**책임**:
- Custom Hooks 설계 및 구현
- Services 레이어 구현 (API 호출 로직)
- Mock Backend 기반 테스트

**필수 읽기**:
- `development/coding-conventions.md` | 섹션 4-6
- `design/interface-contracts.md`
- `reference/frontend/design-system-guide.md` (Quick Reference)

**Day 3-5 체크리스트**:
- [ ] Day 3: Hook 인터페이스 정의 (Props, Return types)
- [ ] Day 3: Mock Backend 확인 (Day 1에서 정의된 interface contracts)
- [ ] Day 4: Hook 구현 (TDD: Red → Green → Refactor)
  - [ ] 테스트 작성
  - [ ] 최소 구현
  - [ ] 리팩토링
- [ ] Day 5: Service 레이어 완성 + Mock 제공
- [ ] Day 5: Hook 단위 테스트 커버리지 85%+

**준비 사항** (Agent 3을 위해):
- [ ] Hook Interface 문서화 (Props, Return types, Error handling)
- [ ] Mock Hooks 패턴 정의

---

#### Phase 3: Frontend UI (Day 6-8) - Agent 3 역할 수행

**책임**:
- 컴포넌트 설계 및 구현
- Material Design 3 토큰 기반 스타일링
- Mock Hooks 기반 컴포넌트 테스트

**필수 읽기**:
- `development/coding-conventions.md` | 섹션 4
- `reference/frontend/design-system-guide.md`
- `reference/frontend/component-library.md` (컴포넌트 선택)
- `reference/frontend/patterns.md` (레이아웃 패턴)

**Day 6-8 체크리스트**:
- [ ] Day 6: 컴포넌트 Props 인터페이스 정의
- [ ] Day 6: 기존 컴포넌트 검토 (component-library.md)
- [ ] Day 7: 컴포넌트 구현 (TDD, Mock Hooks 사용)
  - [ ] 테스트 작성
  - [ ] 최소 구현
  - [ ] 리팩토링
- [ ] Day 7-8: Material Design 3 스타일링 (토큰 사용)
- [ ] Day 8: 컴포넌트 단위 테스트 커버리지 80%+

**준비 사항** (Agent 4을 위해):
- [ ] 컴포넌트 Props 인터페이스 문서화

---

#### Phase 4: Testing & QA (Day 9-12) - Agent 4 역할 수행

**책임**:
- Mock 제거 및 실제 연결
- 통합 테스트 실행
- E2E 테스트 작성 및 실행
- 버그 수정

**필수 읽기**:
- `04-TEST-SCENARIOS.md` | 해당 기능
- `testing/integration-checklist.md`

**Day 9-12 체크리스트**:
- [ ] Day 9: Mock 제거 → 실제 Backend 연결
- [ ] Day 9: 백엔드 + 프론트엔드 단위 테스트 전체 실행
- [ ] Day 10-11: 통합 테스트 시나리오 작성 및 실행
  - [ ] 주요 사용자 여정 (User Journey) 테스트
  - [ ] 에러 케이스 테스트
  - [ ] 경계값 테스트
- [ ] Day 11: E2E 테스트 작성 및 실행
- [ ] Day 12: 버그 수정 및 회귀 테스트
- [ ] Day 12: 전체 테스트 커버리지 리포트 생성

---

#### Phase 5: 통합 및 배포 (Day 13-14)

**책임** (모든 Phase 완료 후):
- Staging 배포
- Final QA
- Production 배포

**Day 13-14 체크리스트**:
- [ ] Day 13: Staging 배포 및 smoke test
- [ ] Day 13: 팀 리뷰 및 최종 버그 수정
- [ ] Day 14: Production 배포
- [ ] Day 14: 배포 후 모니터링 (에러율, 성능)

---

### Mode 2 개발 규칙

#### 의존성 관리

```
Backend (Day 1-2) → Interface Contracts 정의
    ↓
Frontend Core (Day 3-5) → Hook Interface 구현
    ↓
Frontend UI (Day 6-8) → 컴포넌트 구현
    ↓
QA (Day 9-12) → 통합 테스트 및 버그 수정
    ↓
배포 (Day 13-14)
```

#### Mock 사용 전략

```
Phase 1 (Backend): 실제 Firestore + Mock Frontend (필요시)
Phase 2 (Frontend Core): Mock Backend 사용 (Day 1 interface contracts)
Phase 3 (Frontend UI): Mock Hooks 사용 (Day 3-5 interface contracts)
Phase 4 (QA): Mock 제거 → 실제 모든 레이어 연결
```

#### 커밋 및 PR 관리

```
Day 1-2: Backend PR 제출 → 리뷰 및 Merge
Day 3-5: Frontend Core PR 제출 → 리뷰 및 Merge (Backend 이후)
Day 6-8: Frontend UI PR 제출 → 리뷰 및 Merge
Day 9-12: QA/Integration PR 제출 → 리뷰 및 Merge
Day 13-14: Staging → Production 배포
```

---

### Mode 2 vs Mode 1 선택 기준

| 기준 | Mode 1 (병렬) | Mode 2 (순차) |
|------|------------|-----------|
| **기간** | 3+ 일 | 1-2 일 |
| **에이전트** | 4명 | 1명 |
| **복잡도** | 높음 (다중 도메인) | 낮음 (단순 기능) |
| **리소스** | 풍부 | 제한적 |
| **의존성** | 명확하고 분리됨 | 순차적 (blocking) |
| **테스트 기간** | 병렬 (Days 8-14) | 순차적 (Days 9-12) |

자세한 선택 기준은 → `orchestration-selection-guide.md` 참조

---

## 🔗 다음 단계

1. Mode 선택이 불명확하면 → `design/orchestration-selection-guide.md` 참조
2. 통합 및 배포 전략 → `testing/integration-checklist.md`

---

## 🏢 대규모 프로젝트 가이드라인 (Enterprise Scale)

> **목적**: 복잡도가 높은 대규모 프로젝트에서 에이전트 수 관리 및 분할 전략 제시
> **추가일**: 2025-12-27
> **적용 기준**: 복잡도 5.0+, 에이전트 6명 이상, 2주 이상 프로젝트

### 에이전트 수 상한 및 분할 기준

#### 권장 상한: 8명

```
복잡도 vs 에이전트 수:
├─ 1.0-2.0 (Simple):     2-3명 (1 Wave)
├─ 2.1-3.5 (Moderate):   3-4명 (2-3 Waves)
├─ 3.6-5.0 (Complex):    4-6명 (3-5 Waves)
├─ 5.1-7.0 (Large):      6-8명 (5-7 Waves, 분할 권장)
└─ 7.0+ (Enterprise):    8명 상한 (반드시 분할)
```

#### 왜 8명이 상한인가?

```
문제점 (8명 초과 시):
├─ 커뮤니케이션 오버헤드 급증 (O(n²))
├─ Orchestrator 병목 발생
├─ 에러 전파 추적 복잡도 증가
├─ 버전 충돌 확률 급증
└─ PM 인지 부하 초과

권장:
8명 초과 시 → 프로젝트를 여러 Wave로 분할
```

### 대규모 프로젝트 분할 전략

#### 전략 1: 도메인 기반 분할 (Domain-Based)

```
예시: 전체 플랫폼 리뉴얼 (복잡도 8.5)

분할 전:
├─ 단일 Wave로 시도
├─ 에이전트 12명 필요
└─ ❌ 관리 불가능

분할 후:
┌─────────────────────────────────────────────────┐
│  Wave A: 사용자 인증 시스템 (복잡도 3.2)        │
│  ├─ 에이전트 4명                                │
│  ├─ 기간: 1주                                   │
│  └─ 산출물: Auth 모듈                           │
├─────────────────────────────────────────────────┤
│  Wave B: 결제 시스템 (복잡도 4.0)               │
│  ├─ 에이전트 5명                                │
│  ├─ 기간: 1.5주                                 │
│  ├─ 의존성: Wave A 완료 후                      │
│  └─ 산출물: Payment 모듈                        │
├─────────────────────────────────────────────────┤
│  Wave C: 대시보드 (복잡도 3.5)                  │
│  ├─ 에이전트 4명                                │
│  ├─ 기간: 1주                                   │
│  ├─ 의존성: Wave A, B 완료 후                   │
│  └─ 산출물: Dashboard 모듈                      │
└─────────────────────────────────────────────────┘

총 기간: 3.5주 (순차) 또는 2.5주 (부분 병렬)
```

#### 전략 2: 레이어 기반 분할 (Layer-Based)

```
예시: 마이크로서비스 전환 (복잡도 7.2)

분할:
┌─────────────────────────────────────────────────┐
│  Wave 1: Infrastructure Layer                   │
│  ├─ Database 마이그레이션                       │
│  ├─ API Gateway 설정                            │
│  ├─ 에이전트 3명                                │
│  └─ 기간: 1주                                   │
├─────────────────────────────────────────────────┤
│  Wave 2: Backend Services Layer                 │
│  ├─ 마이크로서비스 분리                         │
│  ├─ 서비스 간 통신 구현                         │
│  ├─ 에이전트 5명                                │
│  ├─ 의존성: Wave 1                              │
│  └─ 기간: 2주                                   │
├─────────────────────────────────────────────────┤
│  Wave 3: Frontend Integration Layer             │
│  ├─ API 클라이언트 업데이트                     │
│  ├─ UI 컴포넌트 조정                            │
│  ├─ 에이전트 4명                                │
│  ├─ 의존성: Wave 2                              │
│  └─ 기간: 1주                                   │
└─────────────────────────────────────────────────┘
```

#### 전략 3: 기능 기반 분할 (Feature-Based)

```
예시: 신규 기능 대규모 출시 (복잡도 6.8)

분할:
┌─────────────────────────────────────────────────┐
│  Wave 1: Core Feature (MVP)                     │
│  ├─ 핵심 기능만 구현                            │
│  ├─ 에이전트 4명                                │
│  └─ 기간: 1주                                   │
├─────────────────────────────────────────────────┤
│  Wave 2: Enhanced Features                      │
│  ├─ 부가 기능 추가                              │
│  ├─ 에이전트 4명                                │
│  ├─ 의존성: Wave 1                              │
│  └─ 기간: 1주                                   │
├─────────────────────────────────────────────────┤
│  Wave 3: Polish & Optimization                  │
│  ├─ 성능 최적화, UX 개선                        │
│  ├─ 에이전트 3명                                │
│  ├─ 의존성: Wave 2                              │
│  └─ 기간: 0.5주                                 │
└─────────────────────────────────────────────────┘
```

### 다중 Wave 조율 (Multi-Wave Coordination)

#### Master Orchestrator 패턴

```
대규모 프로젝트 (8명+ 필요):

         ┌─────────────────┐
         │ Master          │
         │ Orchestrator    │
         │ (프로젝트 전체) │
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    ↓             ↓             ↓
┌───────┐   ┌───────┐   ┌───────┐
│Wave A │   │Wave B │   │Wave C │
│Orch.  │   │Orch.  │   │Orch.  │
└───┬───┘   └───┬───┘   └───┬───┘
    │           │           │
  4명 Agent   5명 Agent   4명 Agent
```

#### Master Orchestrator 책임

```
1. 프로젝트 전체 진행률 관리
2. Wave 간 의존성 조율
3. 공유 리소스 충돌 방지
4. Wave 간 인터페이스 표준화
5. PM에게 통합 보고
```

### Wave 간 의존성 관리

```json
{
  "project_id": "platform-renewal",
  "waves": [
    {
      "wave_id": "wave_a_auth",
      "dependencies": [],
      "provides": ["AuthModule", "UserSchema"]
    },
    {
      "wave_id": "wave_b_payment",
      "dependencies": ["wave_a_auth.AuthModule"],
      "provides": ["PaymentModule", "TransactionSchema"]
    },
    {
      "wave_id": "wave_c_dashboard",
      "dependencies": [
        "wave_a_auth.AuthModule",
        "wave_b_payment.TransactionSchema"
      ],
      "provides": ["DashboardModule"]
    }
  ],
  "critical_path": ["wave_a", "wave_b", "wave_c"],
  "parallelizable": {
    "wave_a": true,
    "wave_b": false,
    "wave_c": false
  }
}
```

### 대규모 프로젝트 체크리스트

```
Phase 0 (분할 결정):
- [ ] 전체 복잡도 계산
- [ ] 8명 초과 여부 확인
- [ ] 분할 전략 선택 (Domain/Layer/Feature)
- [ ] Wave 수 결정
- [ ] Wave 간 의존성 매핑
- [ ] Master Orchestrator 필요 여부 결정

Phase 0 (각 Wave):
- [ ] Wave별 복잡도 재계산 (5.0 이하 권장)
- [ ] Wave별 에이전트 수 결정 (8명 이하)
- [ ] Wave별 6개 문서 작성

실행 중:
- [ ] Wave 진행률 추적
- [ ] Wave 간 인터페이스 검증
- [ ] 공유 리소스 충돌 모니터링
- [ ] 통합 에러 대시보드 유지

완료 시:
- [ ] 모든 Wave 완료 확인
- [ ] Wave 간 통합 테스트
- [ ] 전체 시스템 검증
- [ ] 프로젝트 회고 및 개선점 기록
```

### 성능 벤치마크 및 리소스 가이드 (v1.2 추가)

> **목적**: PM이 리소스 계획 시 참고할 정량적 기준 제공
> **기준**: Gallery Refactor 프로젝트 실측 데이터 + 산업 표준 추정

#### 에이전트 수별 예상 소요 시간

| 복잡도 | 에이전트 수 | Phase 수 | 예상 소요 시간 | 권장 토큰 예산 |
|--------|------------|---------|---------------|---------------|
| 🟢 Simple (1.0-2.0) | 2-3명 | 2-3 | **2-4시간** | 30-50K tokens |
| 🟡 Moderate (2.1-3.5) | 3-4명 | 3-4 | **4-8시간** | 50-80K tokens |
| 🟠 Complex (3.6-5.0) | 4-6명 | 4-5 | **1-2일** | 80-120K tokens |
| 🔴 Large (5.1-7.0) | 6-8명 | 5-7 | **3-5일** | 120-180K tokens |
| 🟣 Enterprise (7.0+) | 8명 (분할) | 7+ | **1-2주** | 200K+ tokens |

#### Phase별 토큰 배분 권장

```
Phase 0 (Spec & Plan):     15-20% of total budget
├─ 6개 문서 작성
├─ 복잡도 분석
└─ Sub-agent 할당

Phase 1-N (Execution):     60-70% of total budget
├─ 에이전트당 평균 15-25K tokens
├─ Phase당 병렬 에이전트 수 × 20K
└─ 에러 재시도 버퍼 10%

Phase Final (Integration): 15-20% of total budget
├─ 통합 테스트
├─ PR 생성
└─ 배포 및 검증
```

#### Checkpoint 빈도 권고 (LangGraph Durable Execution 참고)

| 작업 유형 | Checkpoint 간격 | 캐시 저장 시점 |
|----------|----------------|---------------|
| **핵심 API 변경** | 매 함수 완료 시 | 즉시 저장 |
| **UI 컴포넌트** | 매 컴포넌트 완료 시 | 10분마다 |
| **테스트 작성** | 테스트 스위트 완료 시 | 15분마다 |
| **문서 작성** | 섹션 완료 시 | 20분마다 |
| **일반 코드** | 의미 있는 변경 후 | 30분마다 |

#### 실측 데이터: Gallery Refactor 프로젝트

```
프로젝트: Gallery Refactor (복잡도 2.3 → Moderate)
에이전트: 4명 (Backend, Frontend Core, Frontend UI, QA)

Phase 0:
├─ 소요 시간: 45분
├─ 토큰 사용: 12K
└─ 산출물: 6개 문서

Phase 1 (병렬 실행):
├─ 소요 시간: 3시간
├─ 토큰 사용: 68K (에이전트당 평균 17K)
└─ 산출물: 2,863 lines of code

Phase 2 (통합):
├─ 소요 시간: 1시간
├─ 토큰 사용: 15K
└─ 산출물: 104 tests passing

총계:
├─ 총 소요 시간: 4.75시간
├─ 총 토큰 사용: 95K
├─ 토큰 효율: 30 lines/K token
└─ 에러 발생: 2건 (모두 자동 해결)
```

#### 리소스 계획 공식

```
예상 토큰 = (복잡도 × 20K) + (에이전트 수 × 15K) + (Phase 수 × 10K)

예시 1: Simple 프로젝트
= (1.5 × 20K) + (3 × 15K) + (2 × 10K)
= 30K + 45K + 20K = 95K → 권장 예산: 50K (여유 포함)

예시 2: Complex 프로젝트
= (4.0 × 20K) + (5 × 15K) + (4 × 10K)
= 80K + 75K + 40K = 195K → 권장 예산: 120K (여유 포함)
```

---

### 대규모 프로젝트 성공 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| **Wave 완료율** | 100% | 완료 Wave / 전체 Wave |
| **일정 준수** | ±15% | 실제 기간 / 예상 기간 |
| **에이전트 활용도** | >80% | 활성 작업 시간 / 전체 시간 |
| **Wave 간 충돌** | <3건 | 통합 시 발생한 충돌 수 |
| **롤백 횟수** | <2회 | 전체 프로젝트 중 롤백 발생 |
| **PM 에스컬레이션** | <5건 | Decision Report 발생 수 |
| **토큰 예산 준수** | ±20% | 실제 사용 / 예상 예산 |

### 예시: 대규모 프로젝트 타임라인

```
프로젝트: 전체 플랫폼 리뉴얼 (복잡도 8.5, 13명 필요 → 3 Wave 분할)

Week 1:
├─ Wave A 시작 (Auth, 4명)
└─ Wave A Phase 0-2 완료

Week 2:
├─ Wave A Phase 3-4 완료 ✅
├─ Wave B 시작 (Payment, 5명)
└─ Wave B Phase 0-2 진행

Week 3:
├─ Wave B Phase 3-4 완료 ✅
├─ Wave C 시작 (Dashboard, 4명)
└─ Wave C Phase 0-3 진행

Week 4:
├─ Wave C Phase 4 완료 ✅
├─ 전체 통합 테스트
└─ Production 배포 ✅

총 기간: 4주
총 에이전트: 13명 (동시 최대 5명)
Wave 수: 3
성공률: 100%
```

### 경고 신호 및 대응

| 경고 신호 | 원인 | 대응 |
|----------|------|------|
| Wave 지연 2일+ | 복잡도 과소평가 | 에이전트 추가 또는 범위 축소 |
| 에이전트 대기 30%+ | 의존성 병목 | 병렬화 가능 작업 찾기 |
| Wave 간 충돌 3건+ | 인터페이스 불명확 | Interface Contract 강화 |
| PM 에스컬레이션 5건+ | 자동화 부족 | 의사결정 권한 위임 확대 |
| 롤백 2회+ | 설계 결함 | Phase 0 재검토 |
