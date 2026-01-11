# Interface Contracts 가이드

> **목적**: 4명 에이전트가 블로킹 없이 병렬 개발할 수 있도록 "계약" 정의
> **대상**: 모든 에이전트
> **읽는 시간**: 15분
> **Note**: 아래 예시는 일반적인 패턴입니다. 프로젝트 도메인에 맞게 수정하세요.

---

## 🎯 왜 Interface Contracts가 필요한가?

**문제**: 에이전트들이 서로의 작업 완료를 기다리면 병렬화 불가능

```
❌ 블로킹 발생:
Agent 2 (Frontend): "Backend API 구조를 모르니 개발 못 해요"
Agent 3 (UI): "Hook 데이터 구조를 모르니 개발 못 해요"
```

**해결**: Interface Contracts를 먼저 정의하면 Mock 데이터로 독립 개발 가능

```
✅ 병렬 개발:
Agent 1: 실제 Backend 구현
Agent 2: Mock Backend로 Hook 개발
Agent 3: Mock Hook으로 UI 개발
Agent 4: Interface 기반 테스트 작성
```

---

## 📋 02-RFC.md에 포함할 Interface Contracts

### 1. Backend API Interface

```typescript
// RFC 섹션 4.1: Backend Interfaces

/**
 * {기능명} API 예시
 * @trigger {트리거 조건}
 */
interface {Feature}Request {
  requestId: string;
  userId: string;
  amount: number;  // 기본값: {default_value}
}

interface {Feature}Response {
  success: boolean;
  newBalance: number;
  processedAmount: number;
  error?: string;
}

// Mock Response (Agent 2, 3, 4가 사용)
const mock{Feature}Response: {Feature}Response = {
  success: true,
  newBalance: 100,
  processedAmount: 10
};
```

### 2. Frontend Hook Interface

```typescript
// RFC 섹션 4.2: Frontend Hook Interfaces

/**
 * {도메인} 상태 추적 Hook 예시
 * @returns 현재 상태
 */
interface Use{Domain}Tracking {
  total: number;           // 총 수량
  available: number;       // 사용 가능
  reserved: number;        // 예약/보류 수량
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

// Mock Data (Agent 3이 사용)
const mock{Domain}Tracking: Use{Domain}Tracking = {
  total: 100,
  available: 80,
  reserved: 20,
  loading: false,
  error: null,
  refresh: async () => {}
};
```

### 3. UI Component Props Interface

```typescript
// RFC 섹션 4.3: UI Component Interfaces

/**
 * {기능} 상태 표시 컴포넌트 예시
 */
interface {Feature}StatusProps {
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  targetDate?: Date;
}

// Mock Props (Agent 3이 Storybook에서 사용)
const mock{Feature}StatusProps: {Feature}StatusProps = {
  amount: 100,
  status: 'active',
  targetDate: new Date('2025-01-15')
};
```

---

## 🔧 Mock 사용 규칙

### Agent 별 Mock 사용

| Agent | 역할 | Mock 대상 |
|-------|------|----------|
| Agent 1 | Backend | Mock 없음 (실제 Firestore 사용) |
| Agent 2 | Frontend Core | Backend API를 Mock |
| Agent 3 | Frontend UI | Hooks를 Mock |
| Agent 4 | QA | 모든 레이어를 Mock |

### Mock 파일 위치

```
src/
├─ services/
│   └─ __mocks__/
│       └─ {domain}Service.mock.js    ← Agent 2가 생성
├─ hooks/
│   └─ __mocks__/
│       └─ use{Domain}Tracking.mock.js ← Agent 3이 생성
└─ test/
    └─ fixtures/
        └─ {domain}Fixtures.js         ← Agent 4가 생성
```

---

## ✅ RFC 작성 체크리스트

02-RFC.md 작성 시:

- [ ] **섹션 3.2**: Firestore 스키마 변경사항 (TypeScript Interface)
- [ ] **섹션 4.1**: Backend API Interface + Mock Response
- [ ] **섹션 4.2**: Frontend Hook Interface + Mock Data
- [ ] **섹션 4.3**: UI Component Props Interface + Mock Props
- [ ] **섹션 5**: 각 Agent별 Mock 파일 위치 명시

---

## 📖 필수 읽기

Interface Contracts 작성 전에 반드시 읽어야 할 문서:

1. **정책 기반 아키텍처** → `design/policy-driven.md`
   - 동적 설정 vs 하드코딩 판단
   - `policy_configs/{도메인}` 구조

---

## 🔗 다음 단계

1. 오케스트레이션 작성 → `design/orchestration.md`
2. TDD 워크플로 → `development/tdd-workflow.md`
