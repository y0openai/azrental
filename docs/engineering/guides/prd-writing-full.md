# 제품 문서 작성 가이드: How to Work

> **목적**: AI 에이전트 매뉴얼 - 표준화된 제품 개발 문서 작성
> **버전**: 1.0
> **작성일**: 2025-12-16
> **기반**: Crew Credit System v2.0 문서 작업 흐름

---

## 📋 개요

이 매뉴얼은 AI 에이전트가 제품 개념부터 구현까지 **완전한 문서 작성 워크플로우**를 수행하는 방법을 정의합니다. 다음을 포함합니다:

1. **문서 준비 순서**: PRD → RFC → Implementation → Test Scenarios → Orchestration
2. **문서 작성 규칙**: Amazon 6-Pager 스타일, 버전 관리, 포맷 표준
3. **설계 방법론**: Working Backwards, Tenets-First, Metrics-Driven
4. **병렬 Agent 워크플로우**: 4명 Agent 역할 분담, 차단 의존성 0
5. **실행 매뉴얼**: 비개발자 프로젝트 매니저용 오케스트레이션 가이드

---

## 🎯 핵심 원칙

### 1. Working Backwards (Amazon 철학)
- **고객 관점**으로 시작 (Press Release)
- 빌드하기 **전에** 성공 기준 정의 (Metrics)
- 먼저 **의사결정 원칙** 수립 (Tenets)
- 기술 스펙 전에 **스토리** 작성

### 2. 병렬화 우선
- **4명의 병렬 Agent** 설계: Backend, Frontend-Core, Frontend-UI, QA
- Days 1-7에서 **차단 의존성 0**
- Agent 간 명확한 **인터페이스 계약**
- Agent 당 독립적인 **산출물**

### 3. 증거 기반 문서화
- 모든 주장은 **검증 가능**해야 함
- RFC에 **코드 스니펫** 포함
- 코딩 전에 **테스트 시나리오** 제공
- 모든 주요 변경사항에 **롤백 스크립트** 정의

---

## 📂 문서 구조 & 순서

### Step 1: PRD (Product Requirements Document)
**파일**: `docs/product/features/{feature-name}/01-PRD.md`

**포맷**: Amazon 6-Pager 스타일

**필수 섹션**:
```markdown
# {Feature Name} - Product Requirements Document (PRD)

## 📰 PRESS RELEASE (고객 관점의 제품 발표)
- 제품 발표 헤드라인
- 고객 인용문 (Crew 관점, Local 관점)
- 구체적인 수치가 포함된 이점

## 🎯 TENETS (의사결정 원칙)
- 5-7개 핵심 의사결정 원칙
- 각 원칙이 설계 선택을 가이드
- 중요도 순서로 정렬
- 예: "Crew는 항상 무료" (Crew Credit System)

## 📊 SUCCESS METRICS (성공 지표)
### North Star Metric (북극성 지표)
- 단 하나의 가장 중요한 지표 (예: "Crew No-Show Rate")
- 현재 베이스라인
- 3개월 목표
- 왜 이 지표가 중요한가

### Primary Metrics (주요 지표) (4-6개)
| 지표 | 현재 | 목표 | 측정 방법 | 이유 |
|------|------|------|---------|------|
| ... | ... | ... | ... | ... |

### Counter Metrics (역방향 지표) (2-3개)
- 악화되면 안 되는 지표
- 허용 범위
- 각 지표가 중요한 이유

## 💡 NARRATIVE (제품 스토리)
### 고객의 통증
- 실제 페르소나 스토리 (이름, 나이, 맥락)
- 구체적인 통증점과 인용문
- 현재 우회 방법 및 실패 이유

### 우리의 해결책
- 핵심 메커니즘 설명
- 어떻게 통증을 해결하는가
- 왜 다른 대안은 작동하지 않는가

### 왜 이것이 작동하는가
- 심리학적 원리
- 행동 경제학 인사이트
- 현실 세계 유사점

## 🔧 HOW IT WORKS (기술 설계)
### 시스템 아키텍처
- 고수준 컴포넌트 다이어그램
- 데이터 흐름 설명
- 주요 상호작용

### 핵심 메커니즘
- 각 메커니즘의 상세 로직
- 상태 전환
- Edge Case

### Decision Log (의사결정 기록)
| 결정 | 선택지 | 선택 | 이유 |
|------|--------|------|------|
| ... | ... | ... | Tenet 참조 |

## ❓ FAQ
- 7-10개 예상 질문
- 우려사항 사전 대응
- Tenets로 다시 연결

## 📎 APPENDIX
- 위험 & 완화 방안
- 성공 기준 체크리스트
- Out of Scope (향후 반복)
```

**버전 규칙**:
- 초기 버전: `v1.0`
- 주요 기능 추가: `v2.0`, `v3.0`
- 소수 업데이트: `v2.1`, `v2.2`
- 파일 상단에 버전 기록

**참고 예제**: `/docs/product/features/crew-credit-system/01-PRD.md`

---

### Step 2: RFC (Request for Comments)
**파일**: `docs/product/features/{feature-name}/02-RFC.md`

**포맷**: 기술 명세 문서

**필수 섹션**:
```markdown
# {Feature Name} - RFC (Request for Comments)

## 1. Overview (개요)
- 기능 요약 (2-3문장)
- PRD로 링크
- 버전 번호 (PRD와 일치해야 함)

## 2. Goals & Non-Goals
### Goals (목표)
- 주요 목표 (3-5개 항목)
### Non-Goals (Out of Scope)
- 명시적으로 제외된 항목

## 3. System Architecture (시스템 아키텍처)
### 3.1 Component Diagram (컴포넌트 다이어그램)
- 모든 컴포넌트를 보여주는 ASCII/Mermaid 다이어그램
- 데이터 흐름 화살표
- 외부 의존성

### 3.2 Data Model (데이터 모델)
- Firestore 스키마 변경사항 (TypeScript 인터페이스)
- 새 컬렉션/문서
- 타입이 있는 필드 설명

**예시**:
```typescript
interface User {
  layoCredits: number;          // 소유한 총 크레딧
  creditsAvailable: number;     // NEW: 예약 가능한 크레딧
  creditsHeld: number;          // NEW: 보증금으로 예치된 크레딧
  // 공식: layoCredits = creditsAvailable + creditsHeld
}
```

## 4. Implementation Details (구현 상세)
### 4.1 Backend (Cloud Functions)
- 새로운 함수 목록 (시그니처 포함)
- 중요 함수에 대한 **전체 코드 구현** 포함
- 에러 처리 전략

**예시**:
```javascript
exports.holdCrewDeposit = functions.firestore
  .document('requests/{requestId}')
  .onUpdate(async (change, context) => {
    // 전체 구현 코드 여기
  });
```

### 4.2 Frontend (React Hooks)
- 새로운 hook 목록 (시그니처 포함)
- 상태 관리 전략
- UI 컴포넌트 의존성

### 4.3 Security Rules (보안 규칙)
- Firestore 보안 규칙 변경사항
- 인증 요구사항

## 5. Migration Strategy (마이그레이션 전략)
- 하위호환성 계획
- 데이터 마이그레이션 스크립트 (필요시)
- 롤백 절차

## 6. Testing Requirements (테스트 요구사항)
- 단위 테스트 커버리지 목표 (90%+)
- 통합 테스트 시나리오
- E2E 테스트 흐름

## 7. Risks & Mitigations (위험 & 완화)
| 위험 | 영향도 | 완화 방안 |
|------|--------|---------|
| ... | ... | ... |

## 8. Open Questions (미결정 사항)
- 미해결 기술 결정사항
- 이해관계자 입력이 필요한 항목
```

**코드 포함 가이드**:
- Cloud Functions의 **전체 구현** 포함
- Frontend의 **hook 시그니처** 포함
- **보안 규칙 변경사항** 포함
- Boilerplate 제외 (import, 기본 에러 처리)

**참고 예제**: `/docs/product/features/crew-credit-system/02-RFC.md`

---

### Step 3: Implementation Plan (구현 계획)
**파일**: `docs/product/features/{feature-name}/03-IMPLEMENTATION.md`

**포맷**: 일일 Agent 역할 분담 가이드

**필수 섹션**:
```markdown
# {Feature Name} - Implementation Plan (구현 계획)

## 1. Timeline & Milestones (타임라인 & 마일스톤)
- 총 소요 기간 (예: 14일)
- 주요 마일스톤 및 날짜
- 론칭 날짜

## 2. Agent Assignments & Deliverables (Agent 역할 & 산출물)
### Agent 1: Backend Infrastructure (백엔드 인프라)
**역할**: Cloud Functions, Firestore, Security Rules

**산출물**:
- ✅ 기존: (수정할 기존 함수 목록)
- 🆕 NEW: (생성할 새 함수 목록)
  1. 함수명 (트리거 타입)
  2. 함수명 (Scheduled/HTTP)

**일일 작업**:
- **Day 1**: 스키마 설계 + 보안 규칙
- **Day 2**: holdCrewDeposit 함수
- **Day 3**: confirmCompletion 함수
- ...
- **Day 8-14**: 통합 테스트

### Agent 2: Frontend Core (프론트엔드 코어)
**역할**: React Hooks, Services, 상태 관리

**산출물**:
- ✅ 업데이트됨: (수정할 기존 hook)
- 🆕 NEW: (생성할 새 hook)

**일일 작업**:
- **Day 1**: Hook 시그니처 + 인터페이스
- **Day 2**: useCreditTracking 업데이트
- ...

### Agent 3: Frontend UI (프론트엔드 UI)
**역할**: UI 컴포넌트, 스타일링, 접근성

**산출물**:
- 🆕 NEW: (새 컴포넌트)
  1. ComponentName.jsx (목적)
  2. ComponentName.css (스타일)

**일일 작업**:
- **Day 1**: 컴포넌트 와이어프레임
- **Day 2**: DepositStatus 컴포넌트
- ...

### Agent 4: QA & Testing (QA & 테스팅)
**역할**: 테스트 시나리오, 자동화, 커버리지 검증

**산출물**:
- 테스트 계획 문서
- 자동화된 테스트 스크립트
- 커버리지 리포트 (90%+ 목표)

**일일 작업**:
- **Day 1**: 테스트 시나리오 설계
- **Day 2**: 백엔드 단위 테스트
- ...

## 3. Parallel Execution Strategy (병렬 실행 전략)
**차단 의존성 0 (Days 1-7)**:
- Agent 1: 독립적으로 백엔드 작업
- Agent 2: **백엔드 응답 Mock** 사용으로 독립적 개발
- Agent 3: **Hook 데이터 Mock** 사용으로 독립적 개발
- Agent 4: 테스트 시나리오를 병렬로 준비

**수렴 Phase (Days 8-14)**:
- Day 8: 통합 환경 설정
- Day 9-12: Agent 간 통합 테스트
- Day 13: 전체 E2E 검증
- Day 14: 프로덕션 배포

## 4. Interface Contracts (인터페이스 계약)
### Backend → Frontend Core
```typescript
// creditService.js exports
interface CreditService {
  holdDeposit(requestId: string): Promise<void>;
  confirmCompletion(requestId: string, userId: string): Promise<void>;
  // ... 다른 메서드
}
```

### Frontend Core → Frontend UI
```typescript
// useCreditTracking hook interface
interface CreditTracking {
  totalCredits: number;
  availableCredits: number;
  heldCredits: number;
  loading: boolean;
  error: Error | null;
}
```

## 5. Testing Checkpoints (테스트 체크포인트)
- **Day 7**: 단위 테스트 통과 (각 Agent 독립적)
- **Day 10**: 통합 테스트 통과 (Agent 간)
- **Day 13**: E2E 테스트 통과 (전체 흐름)

## 6. Rollback Plan (롤백 계획)
### Emergency Rollback Script
```javascript
// scripts/emergencyRollback_{feature-name}.cjs
// 변경사항 되돌리기 위한 전체 코드
```

### Rollback Triggers (롤백 트리거)
- 프로덕션에서 에러율 >5%
- 크래시율 >1%
- Critical 버그 발견

## 7. Success Criteria (성공 기준)
- [ ] 모든 단위 테스트 통과 (90%+ 커버리지)
- [ ] 모든 통합 테스트 통과
- [ ] E2E 테스트 통과 (5가지 Critical 흐름)
- [ ] 성능 지표 달성 (응답 시간 <200ms)
- [ ] 보안 검토 통과
- [ ] 접근성 감시 통과 (WCAG 2.1 AA)
```

**핵심 원칙**:
- **병렬화**: Agent들이 Days 1-7에 독립적으로 작업
- **인터페이스 계약**: 명확하게 정의된 경계
- **롤백 안전성**: 항상 Emergency Rollback Script 포함

**참고 예제**: `/docs/product/features/crew-credit-system/03-IMPLEMENTATION.md`

---

### Step 4: Test Scenarios (테스트 시나리오)
**파일**: `docs/product/features/{feature-name}/04-TEST-SCENARIOS.md`

**포맷**: 종합 테스트 계획 (100+ 시나리오)

**필수 섹션**:
```markdown
# {Feature Name} - Test Scenarios & Quality Assurance (테스트 시나리오 & QA)

## 1. Test Strategy Overview (테스트 전략 개요)
### Coverage Targets (커버리지 목표)
- 백엔드 단위 테스트: **≥90%** 라인 커버리지
- 프론트엔드 hook: **≥85%** 라인 커버리지
- UI 컴포넌트: **≥80%** 라인 커버리지
- 통합 테스트: **100%** Critical 경로
- E2E 테스트: **5가지** 필수 사용자 흐름

### Test Pyramid (테스트 피라미드)
```
      /\      E2E Tests (5 흐름)
     /  \
    /    \    Integration Tests (15 시나리오)
   /      \
  /________\  Unit Tests (80+ 케이스)
```

## 2. Backend Unit Tests (Cloud Functions) (백엔드 단위 테스트)
### TC-B001: holdCrewDeposit
```javascript
describe('holdCrewDeposit (v2.0)', () => {
  test('Local가 예약을 수락할 때 5 크레딧 예치', async () => {
    // Arrange
    await createTestUser({
      uid: 'crew_001',
      creditsAvailable: 10,
      creditsHeld: 0
    });

    // Act
    await requestRef.update({ status: 'accepted' });
    await waitForFunction(2000);

    // Assert
    const user = await getUserDoc('crew_001');
    expect(user.creditsAvailable).toBe(5); // 10 - 5
    expect(user.creditsHeld).toBe(5);      // 0 + 5
  });

  test('Crew가 크레딧 부족할 때 실패', async () => {
    // 크레딧 부족 시나리오 테스트
  });
});
```

**함수당 필수 테스트**:
- ✅ Happy path (성공 실행)
- ❌ Error cases (크레딧 부족, 잘못된 상태)
- 🔄 Edge cases (Race condition, 동시 업데이트)
- 🛡️ Security (승인되지 않은 접근, 데이터 검증)

## 3. Frontend Hook Tests (프론트엔드 Hook 테스트)
### TC-F001: useCreditTracking
```javascript
import { renderHook } from '@testing-library/react-hooks';
import { useCreditTracking } from 'src/hooks/useCreditTracking';

describe('useCreditTracking (v2.0)', () => {
  test('크레딧을 사용 가능과 예치로 분할', async () => {
    // Firestore 데이터 Mock
    mockFirestore.mockUser({
      layoCredits: 10,
      creditsAvailable: 5,
      creditsHeld: 5
    });

    // Hook 렌더링
    const { result, waitForNextUpdate } = renderHook(() =>
      useCreditTracking('user_001')
    );

    await waitForNextUpdate();

    // Assert
    expect(result.current.totalCredits).toBe(10);
    expect(result.current.availableCredits).toBe(5);
    expect(result.current.heldCredits).toBe(5);
  });
});
```

## 4. UI Component Tests (UI 컴포넌트 테스트)
### TC-U001: DepositStatus.jsx
```javascript
import { render, screen } from '@testing-library/react';
import DepositStatus from 'src/components/DepositStatus';

describe('DepositStatus component', () => {
  test('수락된 예약에 대해 예치된 보증금 표시', () => {
    render(
      <DepositStatus
        depositAmount={5}
        status="held"
      />
    );

    expect(screen.getByText('보증금 예치됨: 5 크레딧')).toBeInTheDocument();
    expect(screen.getByText('경험 완료 시 반환됩니다')).toBeInTheDocument();
  });
});
```

## 5. Integration Tests (Cross-Component) (통합 테스트)
### TC-I001: 보증금 예치를 포함한 예약 흐름
```javascript
describe('Booking with Deposit Hold (v2.0)', () => {
  test('전체 흐름: 예약 → 수락 → 보증금 예치 → 완료 → 해제', async () => {
    // 1. Crew가 예약 생성
    const requestId = await createBooking({
      crewId: 'crew_001',
      experienceId: 'exp_001'
    });

    // 2. 아직 크레딧이 예치되지 않았는지 확인 (status: pending)
    let crew = await getUserDoc('crew_001');
    expect(crew.creditsAvailable).toBe(10);
    expect(crew.creditsHeld).toBe(0);

    // 3. Local이 예약 수락
    await acceptBooking(requestId, 'local_001');
    await waitForFunction(2000);

    // 4. 크레딧 예치됨을 확인
    crew = await getUserDoc('crew_001');
    expect(crew.creditsAvailable).toBe(5);  // 10 - 5
    expect(crew.creditsHeld).toBe(5);       // 0 + 5

    // 5. 양쪽 완료 확인
    await confirmCompletion(requestId, 'crew_001');
    await confirmCompletion(requestId, 'local_001');
    await waitForFunction(2000);

    // 6. 크레딧이 해제되었는지 확인
    crew = await getUserDoc('crew_001');
    expect(crew.creditsAvailable).toBe(5);  // 여전히 5 (보증금 해제됨)
    expect(crew.creditsHeld).toBe(0);       // 5 - 5
  });
});
```

## 6. E2E Tests (Playwright) (E2E 테스트)
### TC-E001: 보증금을 포함한 Crew 예약 여정
```javascript
import { test, expect } from '@playwright/test';

test('Crew가 UI에서 보증금 예치와 해제를 본다', async ({ page }) => {
  // 1. Crew로 로그인
  await page.goto('/login');
  await page.fill('input[name="email"]', 'crew@test.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // 2. 경험 페이지로 이동
  await page.goto('/experiences/exp_test_001');

  // 3. 초기 크레딧 확인 (예약 전)
  let balanceText = await page.textContent('.credit-balance-summary');
  expect(balanceText).toContain('사용 가능: 10');
  expect(balanceText).toContain('예치됨: 0');

  // 4. 예약 제출
  await page.click('button:has-text("예약하기")');
  await page.waitForSelector('.booking-success-message');

  // 5. LOCAL이 예약을 수락 (별도 브라우저 컨텍스트에서 시뮬레이트)
  const localPage = await browser.newPage();
  await localPage.goto('/local/requests');
  await localPage.click('.request-card:first-child button:has-text("수락")');

  // 6. Crew UI에서 보증금이 예치되었는지 확인
  await page.reload();
  balanceText = await page.textContent('.credit-balance-summary');
  expect(balanceText).toContain('사용 가능: 5');   // 10 - 5
  expect(balanceText).toContain('예치됨: 5');     // 0 + 5

  // 7. 완료 확인 (양쪽)
  await page.click('button:has-text("경험 완료 확인")');
  await localPage.click('button:has-text("경험 완료 확인")');
  await page.waitForTimeout(3000); // Cloud Function 대기

  // 8. 보증금이 해제되었는지 확인
  await page.reload();
  balanceText = await page.textContent('.credit-balance-summary');
  expect(balanceText).toContain('사용 가능: 5');   // 보증금 해제됨
  expect(balanceText).toContain('예치됨: 0');     // 더 이상 예치 안 됨
});
```

## 7. Test Execution Order (테스트 실행 순서)
**Day 1-7 (Agent 4)**:
1. 모든 테스트 시나리오 작성 (실행 안 함)
2. 테스트 인프라 설정 (mock, fixture)

**Day 8-10 (통합 Phase)**:
3. 백엔드 단위 테스트 실행 → 실패 수정
4. 프론트엔드 hook 테스트 실행 → 실패 수정
5. UI 컴포넌트 테스트 실행 → 실패 수정

**Day 11-12 (통합 테스트)**:
6. 컴포넌트 간 통합 테스트 실행
7. 통합 문제 수정

**Day 13 (E2E 검증)**:
8. 5가지 E2E 흐름 모두 실행
9. 성능 테스트
10. 접근성 감시

## 8. Coverage Report Format (커버리지 리포트 포맷)
### 최종 커버리지 요약 (v2.0)
```
Backend Functions (v2.0 New Code): 89.8% (269/300 라인)
├─ holdCrewDeposit: 94% (32/34 라인)
├─ confirmCompletion: 91% (41/45 라인)
├─ autoCompleteRequests: 88% (37/42 라인)
├─ processCompletion: 93% (28/30 라인)
├─ finalizeCompletedRequests: 90% (27/30 라인)
└─ handleNoShowDuringDisputeWindow: 87% (26/30 라인)

Frontend Hooks (v2.0 New Code): 87.3% (124/142 라인)
├─ useCreditTracking (updated): 92% (46/50 라인)
└─ useTransactionCompletion (new): 85% (78/92 라인)

UI Components (v2.0 New Code): 82.1% (87/106 라인)
├─ DepositStatus.jsx: 88% (44/50 라인)
└─ CompletionButton.jsx: 77% (43/56 라인)

Integration Tests: 100% (15/15 Critical 경로)
E2E Tests: 100% (5/5 필수 흐름)
```

## 9. Acceptance Criteria (수용 기준)
- [ ] 백엔드 커버리지 ≥90%
- [ ] 프론트엔드 커버리지 ≥85%
- [ ] 모든 통합 테스트 통과
- [ ] 모든 E2E 테스트 통과
- [ ] 성능: API 응답 <200ms (p95)
- [ ] 접근성: WCAG 2.1 AA 준수
- [ ] 보안: Critical/High 취약점 없음
- [ ] 프로덕션 첫 48시간 에러 0건
```

**핵심 원칙**:
- **Arrange-Act-Assert** 패턴
- **실제 데이터 시나리오** (PRD 내러티브에서)
- **커버리지 목표** 계층별 강제
- **E2E 테스트** 전체 사용자 여정 검증

**참고 예제**: `/docs/product/features/crew-credit-system/04-TEST-SCENARIOS.md`

---

### Step 5: Orchestration Manual (오케스트레이션 매뉴얼)
**파일**: `docs/product/features/{feature-name}/00-ORCHESTRATION.md`

**포맷**: 비기술 PM용 단계별 실행 가이드

**목적**: Implementation Plan을 **실행 가능한 명령어**로 변환하여 비기술 프로젝트 매니저가 AI Agent에게 직접 지시할 수 있게 함.

**필수 섹션**:
```markdown
# {Feature Name} - Orchestration Manual (오케스트레이션 매뉴얼)

## 📋 Overview (개요)
- 목적 설명
- 사전 요구사항 체크리스트
- Hybrid Orchestration 전략 개요

## 🚀 Phase 1: Day 1-3 (Sequential Start) (순차 시작)
### Preparation Stage: 모든 탭 초기화
#### Command 0-1: 문서 읽기 (모든 Agent 공통)
```
[4개의 Claude Code 탭에 모두 복사/붙여넣기할 정확한 명령어]

"당신은 {Feature Name} v{X.0} 개발에 참여하고 있습니다.
이 문서들을 순서대로 읽으세요:
1. docs/product/features/{feature-name}/01-PRD.md
2. docs/product/features/{feature-name}/02-RFC.md
3. docs/product/features/{feature-name}/03-IMPLEMENTATION.md
4. docs/product/features/{feature-name}/04-TEST-SCENARIOS.md

완료되면 'Document reading complete. Waiting.'를 리포트하세요."
```

#### Command 0-2: 각 탭에 역할 할당
```
[각 탭별 별도 명령어]

Tab 1 (Agent 1 - Backend):
"당신은 이제 Agent 1: Backend Infrastructure입니다.
책임사항:
- Cloud Functions (functions/index.js)
- Firestore Security Rules
- 백엔드 단위 테스트

03-IMPLEMENTATION.md 'Agent 1' 섹션을 검토하세요.
완료되면 'Agent 1 ready'를 리포트하세요."

[Agent 2, 3, 4를 위해 반복]
```

## 🔄 Phase 2: Day 4-7 (Full Parallelization) (전체 병렬화)
### 표준 작업 패턴
[매일 반복되는 패턴]

아침 명령어 (매일 반복):
```
Tab 1: "Agent 1, Day [N] 작업 시작. 03-IMPLEMENTATION.md 참조"
Tab 2: "Agent 2, Day [N] 작업 시작. 03-IMPLEMENTATION.md 참조"
Tab 3: "Agent 3, Day [N] 작업 시작. 03-IMPLEMENTATION.md 참조"
Tab 4: "Agent 4, Day [N] 작업 시작. 03-IMPLEMENTATION.md 참조"
```

저녁 확인 (매일 반복):
```
모든 탭 순서대로:
"Agent [번호], Day [N] 완료를 확인하세요.
- 완료된 항목
- 테스트 결과
- 내일 준비 상태"
```

## 🧪 Phase 3: Day 8-14 (Integration & Testing) (통합 & 테스팅)
### Day 8: 통합 환경 설정
#### Command 8-1: Mock 제거 (Agent 2, 3)
```
Tab 2:
"Agent 2, 통합 phase 시작.

작업:
1. useCreditTracking Hook에서 Mock 제거
2. 실제 Firestore에 연결
3. Mock Service 제거

완료 후:
- npm run dev 실행
- 브라우저에서 Credit Balance 디스플레이 확인
- 있으면 에러 리포트"
```

#### Command 8-2: 통합 테스트 실행 (Agent 4)
```
Tab 4:
"Agent 4, 통합 테스트 시작.

작업:
1. 통합 테스트 실행
   - npm run test:integration

2. 결과 분석
   - PASS 테스트 목록
   - FAIL 테스트 목록

3. 발견된 버그:
   - 전체 에러 메시지 복사
   - 원인 분석 (어느 Agent 코드)
   - 수정할 파일 경로 제안

포맷:
=== Integration Test Results ===
PASS: 5/15
FAIL: 10/15

=== Bug List ===
Bug #1:
- Test: TC-I001
- Error: TypeError...
- Cause: Backend (Agent 1) 필드명 에러
- Fix needed: Agent 1 - functions/index.js:167

리포트하세요."
```

### Day 8-12: 버그 수정 루프
#### 표준 버그 수정 패턴
```
[3단계 루프]

Step 1: Agent 4가 버그 리포트
Step 2: 담당 Agent에 할당
"Agent 1, Agent 4가 버그를 찾았습니다.
[버그 상세 붙여넣기]
이것을 수정하세요. 완료되면 'Fix complete'를 리포트하세요."

Step 3: 재테스트
"Agent 4, Agent 1이 Bug #3 수정을 완료했습니다.
TC-I003만 다시 실행하세요.
PASS/FAIL을 리포트하세요."

모든 버그에 대해 반복.
```

### Day 13: E2E 테스팅
#### Command 13-1: E2E 테스트 실행
```
Tab 4:
"Agent 4, E2E 테스트 시작.

작업:
1. Playwright E2E 테스트 실행
   - npm run test:e2e

2. 5가지 필수 흐름 테스트:
   - TC-E001: Crew 예약 여정
   - TC-E002: Local 완료 확인
   - TC-E003: Crew no-show 시나리오
   - TC-E004: 분쟁 윈도우 테스트
   - TC-E005: 24시간 후 자동완료

3. 결과 리포트:
   - PASS/FAIL 상태
   - 스크린샷/비디오 경로
   - FAIL인 경우 상세 에러

시작하세요."
```

### Day 14: 프로덕션 배포
#### Command 14-1: 커버리지 검증
```
Tab 4:
"Agent 4, 최종 커버리지 측정.

작업:
1. 백엔드 커버리지: cd functions && npm run test:coverage
2. 프론트엔드 커버리지: npm run test:coverage
3. 리포트 생성 (04-TEST-SCENARIOS.md 포맷)

목표:
- 백엔드: ≥90%
- 프론트엔드 Hooks: ≥85%
- UI Components: ≥80%

목표 미만이면:
- 어느 파일이 부족한지 리포트
- 추가 테스트 필요사항 제안"
```

#### Command 14-2: 프로덕션 배포
```
Tab 1 (Backend):
"Agent 1, 프로덕션 배포 준비.

작업:
1. Cloud Functions 배포: cd functions && npm run deploy
2. Firestore Rules 배포: firebase deploy --only firestore:rules
3. Firebase Console에서 배포 검증

리포트:
- 배포된 함수 목록
- Firestore Rules 버전"

Tab 2 또는 3 (Frontend):
"프론트엔드 배포 준비.

작업:
1. 프로덕션 빌드: npm run build:production
2. 배포: npm run deploy:production
3. 검증: https://{project}.web.app 접속

완료되면 URL을 리포트하세요."
```

#### Command 14-3: 배포 후 검증
```
Tab 4:
"Agent 4, 프로덕션 환경 검증.

작업:
1. Smoke test 실행 (E2E 흐름 1개만)
   - TC-E001: Crew 예약 여정
2. 에러 모니터링
   - Firebase Console → Functions → Logs 확인
3. 롤백 스크립트 검증
   - scripts/emergencyRollback_{feature}.cjs 존재 확인

'Production deployment validated' 완료하면 리포트하세요."
```

## 📊 Progress Tracking Template (진행 추적 템플릿)
### 일일 체크리스트 (복사/붙여넣기로 사용)
```
=== Day [N] Progress ===
Date: 2025-XX-XX

Agent 1 (Backend):
□ 작업 시작
□ 작업 완료
□ 테스트 PASS
완료 항목: _______

Agent 2 (Frontend Core):
□ 작업 시작
□ 작업 완료
□ 테스트 PASS
완료 항목: _______

Agent 3 (Frontend UI):
□ 작업 시작
□ 작업 완료
□ 테스트 PASS
완료 항목: _______

Agent 4 (QA):
□ 작업 시작
□ 작업 완료
□ 테스트 실행
발견된 버그: ___ | 해결된: ___

=== Next Step ===
내일: Day [N+1]
```

## 🚨 문제해결 가이드
### 문제 1: Agent가 작업을 이해하지 못함
**증상**: "어느 파일을 수정해야 할지 모르겠습니다"

**해결책 명령어**:
```
"Agent 2, 다시 설명하겠습니다.

1. 먼저 이 파일을 읽으세요: src/hooks/useCreditTracking.js
2. 이 코드를 찾으세요: export function useCreditTracking(userId)
3. 이 함수 안에 새 필드를 추가하세요:
   - creditsAvailable
   - creditsHeld
4. 02-RFC.md 'Section 4.2'에서 코드 예제를 참조하세요.

준비되면 'Understood'를 리포트하세요."
```

### 문제 2: 파일 충돌
**증상**: "Error: File has conflicts"

**해결책 명령어**:
```
"Agent 2, 파일 충돌이 발생했습니다.

1. 현재 상태 확인: git status
2. 충돌 확인: git diff src/hooks/useCreditTracking.js
3. 내 결정을 기다리세요."

[검토 후]

"Agent 2, 다음으로 해결하세요:
1. git checkout --theirs src/hooks/useCreditTracking.js
2. 파일 다시 수정
3. git add .
4. 작업 계속"
```

### 문제 3: 테스트가 계속 실패
**증상**: 5번 시도 후 테스트 실패

**해결책 명령어**:
```
"Agent 4, 테스트 디버깅 모드를 활성화하세요.

1. Verbose 로그로 실행: npm run test:integration -- --verbose
2. 출력 값에 console.log 추가:
   - creditsAvailable
   - creditsHeld
3. 실제 vs 예상값 비교

상세 내용을 리포트하세요."

[분석 후]

"Agent 1, 이 값이 잘못되었습니다:
- Expected: creditsAvailable = 5
- Actual: creditsAvailable = 10

holdCrewDeposit이 크레딧을 차감하지 않은 것 같습니다.
확인하고 수정하세요."
```

## 📝 최종 체크리스트 (Day 14 완료 기준)
```
=== {Feature Name} v{X.0} 배포 완료 ===

문서:
✅ PRD v{X.0} (Amazon 6-Pager)
✅ RFC v{X.0} (기술 명세)
✅ Implementation Plan v{X.0}
✅ Test Scenarios v{X.0}
✅ Orchestration Manual (이 문서)

코드:
✅ 백엔드: [N]개 Cloud Functions 구현
✅ 프론트엔드 코어: [N]개 Hooks 구현
✅ 프론트엔드 UI: [N]개 컴포넌트 구현
✅ 테스트: [N]개 단위, [N]개 통합, [N]개 E2E

품질:
✅ 백엔드 커버리지 ≥90%
✅ 프론트엔드 커버리지 ≥85%
✅ 모든 테스트 PASS
✅ E2E 테스트 PASS ([N]/[N])

배포:
✅ Staging 배포
✅ 프로덕션 배포
✅ Smoke Test 통과
✅ Rollback Script 준비 완료

=== 최종 승인 ===
PM 서명: _________
배포 날짜: 2025-XX-XX
버전: v{X.0}
```

**핵심 원칙**:
- **복사/붙여넣기 준비**: 모든 명령어가 Claude Code에 직접 복사 가능
- **비기술 언어**: 전문 용어 최소화, 간단한 용어로 설명
- **문제해결 포함**: 일반적인 문제와 구체적인 해결책
- **진행 추적**: PM이 추적할 수 있는 일일 체크리스트 템플릿

**참고 예제**: `/docs/product/features/crew-credit-system/00-ORCHESTRATION.md`

---

## 🤖 AI Agent 워크플로우 지침

### Agent 1: Backend Infrastructure (백엔드 인프라)
**트리거**: RFC 문서 수신 (Step 2)

**작업**:
1. `02-RFC.md` 섹션 3.2 (Data Model), 4.1 (Backend Implementation) 읽기
2. `firestore.rules`에서 Firestore 스키마 변경사항 생성
3. RFC에 나열된 모든 Cloud Functions를 전체 코드로 구현
4. 단위 테스트 작성 (90%+ 커버리지 목표)
5. `scripts/emergencyRollback_{feature}.cjs`에서 롤백 스크립트 생성

**산출물**:
- `functions/index.js` (새 함수 추가)
- `firestore.rules` (보안 규칙 업데이트)
- `functions/__tests__/{function-name}.test.js` (단위 테스트)
- `scripts/emergencyRollback_{feature}.cjs`

**의존성**: 없음 (Days 1-7 독립적 작동)

---

### Agent 2: Frontend Core (프론트엔드 코어)
**트리거**: RFC 문서 수신 (Step 2)

**작업**:
1. `02-RFC.md` 섹션 4.2 (Frontend Implementation) 읽기
2. `src/hooks/`에서 hook 생성/업데이트
3. `src/services/`에서 서비스 생성/업데이트
4. Hook 테스트 작성 (85%+ 커버리지 목표)
5. **백엔드 응답 Mock** 하여 독립적 개발

**산출물**:
- `src/hooks/{hook-name}.js` (새/업데이트된 hook)
- `src/services/{service-name}.js` (새/업데이트된 서비스)
- `src/hooks/__tests__/{hook-name}.test.js` (hook 테스트)

**의존성**: 없음 (Days 1-7에서 Mock 백엔드 사용)

---

### Agent 3: Frontend UI (프론트엔드 UI)
**트리거**: Implementation Plan 수신 (Step 3)

**작업**:
1. `03-IMPLEMENTATION.md` Agent 3 섹션 읽기
2. `src/components/`에서 UI 컴포넌트 생성
3. `src/styles/tokens/`에서 Material Design 3 토큰 적용
4. 컴포넌트 테스트 작성 (80%+ 커버리지 목표)
5. **Hook 데이터 Mock** 하여 독립적 개발

**산출물**:
- `src/components/{component-name}.jsx`
- `src/components/{component-name}.css`
- `src/components/__tests__/{component-name}.test.jsx`

**의존성**: 없음 (Days 1-7에서 Mock hook 사용)

---

### Agent 4: QA & Testing
**트리거**: Test Scenarios 문서 수신 (Step 4)

**작업**:
1. `04-TEST-SCENARIOS.md` 전체 읽기
2. 테스트 인프라 설정 (Days 1-3)
3. 모든 테스트 스크립트 작성 (Days 4-7)
4. 통합 phase에서 테스트 실행 (Days 8-13)
5. 커버리지 리포트 생성

**산출물**:
- 테스트 인프라 설정
- `functions/__tests__/` (백엔드 테스트)
- `src/hooks/__tests__/` (hook 테스트)
- `src/components/__tests__/` (컴포넌트 테스트)
- `tests/integration/` (통합 테스트)
- `tests/e2e/` (Playwright E2E 테스트)
- 커버리지 리포트 (최종일)

**의존성**: Days 1-7 없음, Days 8-14 모든 Agent 필요

---

## 📐 문서 규칙

### 파일 이름
```
01-PRD.md              # Product Requirements (Amazon 6-Pager)
02-RFC.md              # Request for Comments (기술 명세)
03-IMPLEMENTATION.md   # Implementation Plan (Agent 역할 분담)
04-TEST-SCENARIOS.md   # Test Plan (QA 가이드)
00-ORCHESTRATION.md    # Orchestration Manual (비기술 PM용)
```

### 버전 관리
- **초기 출시**: v1.0
- **주요 기능 추가**: v2.0, v3.0
- **소수 업데이트**: v2.1, v2.2
- **버전 헤더**: 모든 문서 상단에 배치

```markdown
# 기능명 - 문서 타입

> **버전**: v2.0
> **마지막 업데이트**: 2025-12-16
> **작성자**: AI Agent (Backend/Frontend-Core/Frontend-UI/QA)
```

### 코드 스니펫 포맷
- TypeScript를 **인터페이스/타입**에 사용
- JavaScript를 **구현 코드**에 사용
- 복잡한 로직은 **주석** 포함
- RFC의 Cloud Functions는 **전체 구현** 표시

---

## 🚀 병렬 Agent 실행 전략

### 타임라인: 14일

#### Days 1-7: 독립적 개발 (차단 의존성 0)
**Agent 1 (Backend)**:
- Day 1: Firestore 스키마 + 보안 규칙
- Day 2-6: Cloud Functions 구현 (일당 1개)
- Day 7: 단위 테스트 + 자가 검증

**Agent 2 (Frontend Core)**:
- Day 1: Hook 시그니처 + 서비스 인터페이스
- Day 2-3: 기존 hook 업데이트 (useCreditTracking)
- Day 4-5: 새 hook 생성 (useTransactionCompletion)
- Day 6: 서비스 생성 (creditService 업데이트)
- Day 7: Hook 테스트 + 자가 검증

**Agent 3 (Frontend UI)**:
- Day 1: 컴포넌트 와이어프레임 + 설계
- Day 2-3: DepositStatus 컴포넌트
- Day 4-5: CompletionButton 컴포넌트
- Day 6: 스타일 + 접근성
- Day 7: 컴포넌트 테스트 + 자가 검증

**Agent 4 (QA)**:
- Day 1-2: 테스트 인프라 설정
- Day 3-4: 백엔드 단위 테스트 작성
- Day 5: 프론트엔드 hook 테스트 작성
- Day 6: UI 컴포넌트 테스트 작성
- Day 7: 통합 + E2E 테스트 스크립트 작성

**핵심**: 모든 Agent는 **Mock/Stub** 사용하여 독립적으로 작업.

---

#### Days 8-14: 통합 & 검증 (수렴)
**Day 8: 환경 설정**
- 모든 Agent: Staging에 배포
- 실제 컴포넌트 연결 (Mock 제거)
- 초기 Smoke 테스트

**Day 9-10: 컴포넌트 통합**
- Agent 1 + Agent 2: Backend ↔ Frontend Core 통합
- Agent 2 + Agent 3: Hooks ↔ UI Components 통합
- Agent 4: 백엔드 + 프론트엔드 단위 테스트 실행 → 실패 수정

**Day 11-12: 전체 통합 테스트**
- Agent 4: 15가지 통합 테스트 시나리오 모두 실행
- 모든 Agent: 통합 버그 협력적으로 수정
- 성능 테스트 (API 응답 시간)

**Day 13: E2E 검증**
- Agent 4: 5가지 E2E Playwright 테스트 모두 실행
- 모든 Agent: E2E 실패 수정
- 접근성 감시 (WCAG 2.1 AA)
- 보안 검토

**Day 14: 프로덕션 배포**
- 모든 Agent: 최종 코드 검토
- Agent 1: 백엔드 함수 배포
- Agent 2 + Agent 3: 프론트엔드 빌드 배포
- Agent 4: 배포 후 Smoke 테스트
- 모든 Agent: 프로덕션 지표 모니터링

---

## 🛠️ 도구 & 참고자료

### 필수 도구
- **Backend**: Firebase CLI, Node.js 18+, Jest
- **Frontend**: React 18, Vite, React Testing Library
- **E2E Testing**: Playwright
- **Version Control**: Git
- **문서화**: Markdown

### 참고 프로젝트
- **Crew Credit System v2.0**: `/docs/product/features/crew-credit-system/`
- **Trust & Safety Framework**: `/docs/product/policies/trust-safety/framework.md`
- **개발 가이드라인**: `/docs/engineering/guides/02-development-01-standard-coding-conventions.md`

### AI Agent Best Practices
1. **기존 문서 먼저 읽기** - 새 문서 생성 전에
2. **정확한 파일 경로** 사용 - 이 매뉴얼에 명시된대로
3. **버전 규칙 엄격히** 준수
4. **모든 주요 변경사항에 Rollback Script** 포함
5. **코드 먼저 테스트** (TDD 접근)
6. **병렬 작업 시 Interface Contracts** 유지
7. **모든 설계 결정을 Tenet 참조와 함께 문서화**

---

## ❓ FAQ

### Q1: 기능이 Amazon 6-Pager 포맷에 맞지 않으면?
**A**: 모든 고객 대면 기능은 Amazon 6-Pager를 사용해야 합니다. 내부 도구나 리팩토링의 경우, 간소화된 PRD 포맷을 사용할 수 있지만 여전히 다음을 포함해야 합니다:
- 고객/사용자 관점 (내부인 경우에도 "고객"은 내부 개발자)
- 성공 지표
- 작동 방식

### Q2: 4개 문서가 모두 준비되기 전에 Agent가 코딩을 시작할 수 있을까요?
**A**: 아니요. 순서를 따라야 합니다:
1. PRD 승인 → RFC 생성
2. RFC 승인 → Implementation Plan 생성
3. Implementation Plan 승인 → Test Scenarios 생성
4. 4개 문서 모두 승인 → 코딩 시작

이렇게 함으로써 정렬을 보장하고 재작업을 방지합니다.

### Q3: Days 1-7 중 Agent 2가 Agent 1의 인터페이스를 변경해야 하면?
**A**: RFC (Step 2)에서 정의한 인터페이스 계약은 Days 1-7에서 **고정**입니다. 진정으로 필요한 변경이면:
1. RFC 문서 업데이트
2. 모든 Agent에 알림
3. 14일 타임라인 재시작

이것이 철저한 RFC 설계가 중요한 이유입니다.

### Q4: 기능 간 의존성은 어떻게 처리하나요?
**A**: PRD "Out of Scope" 섹션에 의존성을 문서화합니다. 예:
- **현재 기능**: Crew Loyalty Program
- **의존성**: Crew Credit System v2.0이 먼저 라이브되어야 함
- **타임라인**: Loyalty Program은 Credit System Day 14 이후 시작

### Q5: 테스트 커버리지가 목표 미만이면?
**A**: 배포가 차단됩니다:
- 백엔드: 90%
- 프론트엔드 Hooks: 85%
- UI Components: 80%

Agent 4 (QA)가 이 Gate를 강제합니다.

### Q6: 소규모 기능에는 Rollback Script를 건너뛸 수 있을까요?
**A**: 아니요. Firestore 스키마나 Cloud Functions를 수정하는 모든 기능은 Rollback Script를 반드시 작성해야 합니다. 이는 프로덕션 안전성을 위해 타협할 수 없습니다.

### Q7: 여러 기능이 동시에 개발 중이면 문서 버전 관리는?
**A**: 각 기능이 독립적으로 버전을 유지합니다:
- Feature A: v2.0 (프로덕션)
- Feature B: v1.0 (개발 중)
- Feature C: v1.0 (계획 단계)

Feature B가 출시되면 프로덕션에서 v1.0이 됩니다. Feature A는 v2.0으로 유지됩니다.

---

## 🎯 요약: AI Agent 체크리스트

### 기능 시작 전
- [ ] 이 "How to Work" 매뉴얼 전체 읽기
- [ ] 자신의 Agent 역할 파악 (Backend/Frontend-Core/Frontend-UI/QA)
- [ ] 4개 문서 존재 확인 (PRD, RFC, Implementation Plan, Test Scenarios)
- [ ] 다른 Agent와의 인터페이스 계약 이해

### 개발 중 (Days 1-7)
- [ ] Mock/Stub을 사용하여 독립적으로 작업
- [ ] Implementation Plan의 일일 작업 따르기
- [ ] 코드와 함께 테스트 작성 (TDD)
- [ ] 팀 합의 없이 인터페이스 계약 수정 금지

### 통합 중 (Days 8-14)
- [ ] Mock 제거하고 실제 컴포넌트 연결
- [ ] 자주 그리고 빨리 테스트 실행
- [ ] 다른 Agent와 협력하여 버그 수정
- [ ] 수용 기준 대비 검증

### 배포 전 (Day 14)
- [ ] 모든 테스트 통과 (단위, 통합, E2E)
- [ ] 커버리지 목표 달성
- [ ] Rollback Script 테스트됨
- [ ] 프로덕션 모니터링 설정됨

---

**매뉴얼 끝**

> 이 매뉴얼은 살아있는 문서입니다. 새로운 패턴이 나타나거나 프로세스가 개선될 때 업데이트하세요.
