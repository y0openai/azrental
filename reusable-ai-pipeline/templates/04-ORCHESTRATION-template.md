# 04-ORCHESTRATION.md - {기능명} Task 분배

> **Agent Task Distribution Plan**
> **작성일**: {YYYY-MM-DD}
> **작성자**: Orchestrator Agent
> **모드**: Mode 1 (병렬 개발)

---

## 1. 복잡도 분석

### 1.1 복잡도 점수 계산
```
영향 모듈 수: {N} × 0.3 = {점수}
예상 일수: {N} × 0.2 = {점수}
신규 API 수: {N} × 0.25 = {점수}
UI 화면 수: {N} × 0.15 = {점수}
외부 연동: {N} × 0.1 = {점수}
─────────────────────────
총 복잡도 점수: {총점}
```

### 1.2 에이전트 할당
| 복잡도 점수 | 에이전트 수 | 이 기능 |
|------------|------------|--------|
| 1.0-2.0 | 2명 | |
| 2.1-3.5 | 3명 | |
| 3.6-5.0 | 4명 | ✅ |
| 5.1+ | 5-8명 | |

**결정**: {N}명 에이전트 투입
- Agent 1: Backend
- Agent 2: Frontend Core
- Agent 3: Frontend UI
- Agent 4: QA

---

## 2. Task 분배

### 2.1 Agent 1: Backend

**담당 영역**: Cloud Functions, Database, Security Rules

#### Task 1.1: 스키마 설계
- **설명**: {상세 설명}
- **산출물**: Firestore 스키마 문서
- **예상 시간**: {시간}
- **의존성**: 없음

#### Task 1.2: Cloud Functions 구현
- **설명**: {상세 설명}
- **산출물**: `functions/services/{feature}Service.js`
- **예상 시간**: {시간}
- **의존성**: Task 1.1

#### Task 1.3: Security Rules
- **설명**: {상세 설명}
- **산출물**: `firestore.rules` 업데이트
- **예상 시간**: {시간}
- **의존성**: Task 1.1

#### Task 1.4: 단위 테스트
- **설명**: Backend 로직 테스트
- **산출물**: `functions/__tests__/{feature}Service.test.js`
- **예상 시간**: {시간}
- **의존성**: Task 1.2

---

### 2.2 Agent 2: Frontend Core

**담당 영역**: Hooks, Services, State Management

#### Task 2.1: Hook 인터페이스 정의
- **설명**: {상세 설명}
- **산출물**: Hook interface + Mock
- **예상 시간**: {시간}
- **의존성**: 없음 (Mock 사용)

#### Task 2.2: Service 레이어 구현
- **설명**: {상세 설명}
- **산출물**: `src/services/{feature}Service.js`
- **예상 시간**: {시간}
- **의존성**: Task 2.1

#### Task 2.3: Hook 구현
- **설명**: {상세 설명}
- **산출물**: `src/hooks/use{Feature}.js`
- **예상 시간**: {시간}
- **의존성**: Task 2.2

#### Task 2.4: 단위 테스트
- **설명**: Hook 테스트
- **산출물**: `src/__tests__/hooks/use{Feature}.test.js`
- **예상 시간**: {시간}
- **의존성**: Task 2.3

---

### 2.3 Agent 3: Frontend UI

**담당 영역**: Components, Styling, Pages

#### Task 3.1: 컴포넌트 인터페이스 정의
- **설명**: Props 인터페이스 정의
- **산출물**: Component Props Interface
- **예상 시간**: {시간}
- **의존성**: 없음 (Mock Hooks 사용)

#### Task 3.2: 컴포넌트 구현
- **설명**: {상세 설명}
- **산출물**: `src/components/{category}/{Component}.jsx`
- **예상 시간**: {시간}
- **의존성**: Task 3.1

#### Task 3.3: 스타일링
- **설명**: Material Design 3 토큰 사용
- **산출물**: `src/components/{category}/{Component}.css`
- **예상 시간**: {시간}
- **의존성**: Task 3.2

#### Task 3.4: 페이지 통합
- **설명**: {상세 설명}
- **산출물**: `src/pages/{PageName}.jsx`
- **예상 시간**: {시간}
- **의존성**: Task 3.2, 3.3

---

### 2.4 Agent 4: QA

**담당 영역**: Integration Test, E2E Test, Staging Validation

#### Task 4.1: 테스트 시나리오 작성
- **설명**: 테스트 케이스 정의
- **산출물**: `04-TEST-SCENARIOS.md`
- **예상 시간**: {시간}
- **의존성**: 없음

#### Task 4.2: 통합 테스트 준비
- **설명**: Mock 기반 통합 테스트
- **산출물**: `tests/integration/{feature}.integration.test.js`
- **예상 시간**: {시간}
- **의존성**: Task 4.1

#### Task 4.3: E2E 테스트 스크립트
- **설명**: E2E 테스트 작성
- **산출물**: `tests/e2e/{feature}.e2e.test.js`
- **예상 시간**: {시간}
- **의존성**: Task 4.1

#### Task 4.4: Staging 검증 (Phase 2)
- **설명**: 실제 환경 테스트
- **산출물**: 테스트 리포트
- **예상 시간**: {시간}
- **의존성**: 모든 Agent 완료 후

---

## 3. 의존성 다이어그램

```
Phase 1 (병렬 작업):
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Agent 1 (Backend)     Agent 2 (Core)     Agent 3 (UI)     │
│  ┌───────────────┐    ┌───────────────┐   ┌───────────────┐│
│  │ 1.1 스키마    │    │ 2.1 Interface │   │ 3.1 Props     ││
│  │      ↓        │    │      ↓        │   │      ↓        ││
│  │ 1.2 Functions │    │ 2.2 Service   │   │ 3.2 Component ││
│  │      ↓        │    │      ↓        │   │      ↓        ││
│  │ 1.3 Rules     │    │ 2.3 Hook      │   │ 3.3 Styling   ││
│  │      ↓        │    │      ↓        │   │      ↓        ││
│  │ 1.4 Test      │    │ 2.4 Test      │   │ 3.4 Page      ││
│  └───────────────┘    └───────────────┘   └───────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
Phase 2 (통합):
┌─────────────────────────────────────────────────────────────┐
│  Agent 4 (QA)                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 4.4 Mock 제거 → 실제 연결 → 통합 테스트 → E2E      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Mock 인터페이스 정의

### 4.1 Backend Mock (Agent 2가 사용)
```javascript
// Agent 1이 제공, Agent 2가 사용
export const mock{Feature}Service = {
  {method1}: jest.fn().mockResolvedValue({
    success: true,
    data: { /* mock data */ }
  }),
  {method2}: jest.fn().mockResolvedValue({
    success: true
  })
};
```

### 4.2 Hook Mock (Agent 3가 사용)
```javascript
// Agent 2가 제공, Agent 3가 사용
export const mockUse{Feature} = () => ({
  data: { /* mock data */ },
  loading: false,
  error: null,
  {action1}: jest.fn(),
  {action2}: jest.fn()
});
```

---

## 5. 완료 기준 (Definition of Done)

### 5.1 Phase 1 완료 조건
- [ ] 모든 Agent가 자신의 Task 완료
- [ ] 단위 테스트 통과 (각 Agent)
- [ ] Mock 인터페이스 제공 완료

### 5.2 Phase 2 완료 조건
- [ ] Mock 제거, 실제 코드 연결
- [ ] 통합 테스트 통과
- [ ] E2E 테스트 통과
- [ ] Staging 검증 완료

---

## 6. 일정

| Phase | Agent | Task | 예상 시간 |
|-------|-------|------|----------|
| 1 | Agent 1 | Task 1.1-1.4 | {시간} |
| 1 | Agent 2 | Task 2.1-2.4 | {시간} |
| 1 | Agent 3 | Task 3.1-3.4 | {시간} |
| 1 | Agent 4 | Task 4.1-4.3 | {시간} |
| 2 | Agent 4 | Task 4.4 | {시간} |

**총 예상 시간**: {Phase 1} + {Phase 2} = {총 시간}

---

*문서 버전: 1.0*
*최종 수정: {YYYY-MM-DD}*
