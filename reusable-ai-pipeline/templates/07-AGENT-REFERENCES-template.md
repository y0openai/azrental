# 07-AGENT-REFERENCES.md - {기능명} 참고 링크

> **Agent Quick Reference Guide**
> **목적**: 각 Agent가 자신의 역할에 맞는 문서를 빠르게 찾도록 안내
> **작성일**: {YYYY-MM-DD}
> **작성자**: Orchestrator Agent

---

## 🎯 빠른 찾기

### 당신의 역할에 따라 아래 섹션을 확인하세요:

| 역할 | 바로가기 |
|------|---------|
| Backend Agent | [섹션 1](#1-backend-agent-references) |
| Frontend Core Agent | [섹션 2](#2-frontend-core-agent-references) |
| Frontend UI Agent | [섹션 3](#3-frontend-ui-agent-references) |
| QA Agent | [섹션 4](#4-qa-agent-references) |

---

## 1. Backend Agent References

### 1.1 필수 읽기
| 문서 | 읽는 섹션 | 목적 |
|------|----------|------|
| `KB.md` | 전체 | TDD 원칙 |
| `development/coding-conventions.md` | 섹션 10 | Cloud Functions 규칙 |
| `design/policy-driven.md` | 전체 | 정책 기반 설정 |

### 1.2 참고 코드
```
functions/
├── index.js                    ← 라우팅 패턴 참고
├── services/
│   └── {existingService}.js    ← 기존 서비스 패턴 참고
└── utils/
    └── policyService.js        ← 정책 접근 유틸
```

### 1.3 테스트 패턴
```
functions/__tests__/
└── {existingService}.test.js   ← 테스트 패턴 참고
```

### 1.4 Quick Tips
- ✅ 모든 비즈니스 로직은 `functions/services/`에 모듈화
- ✅ `index.js`는 라우팅만 (200줄 이하 유지)
- ✅ 정책 값은 하드코딩 금지 → `getPolicyConfig()` 사용
- ✅ 트랜잭션 필요 시 `db.runTransaction()` 사용

---

## 2. Frontend Core Agent References

### 2.1 필수 읽기
| 문서 | 읽는 섹션 | 목적 |
|------|----------|------|
| `KB.md` | 전체 | TDD 원칙 |
| `development/coding-conventions.md` | 섹션 4-6 | Hook/Service 규칙 |
| `design/interface-contracts.md` | 전체 | Mock 사용법 |

### 2.2 참고 코드
```
src/
├── hooks/
│   └── {existingHook}.js       ← Hook 패턴 참고
├── services/
│   └── {existingService}.js    ← Service 패턴 참고
└── contexts/
    └── {existingContext}.jsx   ← Context 패턴 참고
```

### 2.3 Mock 패턴
```javascript
// src/services/__mocks__/{service}.mock.js
export const mock{Service} = {
  {method1}: jest.fn().mockResolvedValue({/* mock data */}),
  {method2}: jest.fn()
};
```

### 2.4 Quick Tips
- ✅ Hook은 `use{Feature}` 네이밍
- ✅ Service는 `{feature}Service` 네이밍
- ✅ Mock 먼저 정의 → Agent 3가 병렬 작업 가능
- ✅ 에러 핸들링은 Hook 레벨에서

---

## 3. Frontend UI Agent References

### 3.1 필수 읽기
| 문서 | 읽는 섹션 | 목적 |
|------|----------|------|
| `development/coding-conventions.md` | 섹션 4 | 컴포넌트 규칙 |
| Design System Guide | 전체 | 스타일링 |
| Component Library | 전체 | 기존 컴포넌트 |

### 3.2 참고 코드
```
src/
├── components/
│   ├── common/                 ← 공통 컴포넌트
│   └── {category}/             ← 도메인별 컴포넌트
├── pages/
│   └── {existingPage}.jsx      ← 페이지 패턴 참고
└── styles/
    └── tokens/                 ← Design Token
```

### 3.3 스타일 패턴
```css
/* Material Design 3 토큰 사용 */
.component-name {
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
}
```

### 3.4 Quick Tips
- ✅ CSS 변수 사용 (하드코딩 금지)
- ✅ 컴포넌트는 Props Interface 먼저 정의
- ✅ Mock Hook 사용하여 병렬 개발
- ✅ 접근성 고려 (aria-*, semantic HTML)

---

## 4. QA Agent References

### 4.1 필수 읽기
| 문서 | 읽는 섹션 | 목적 |
|------|----------|------|
| `onboarding/testing.md` | 전체 | 테스트 전략 |
| `04-TEST-SCENARIOS.md` | 전체 | 이 기능 테스트 케이스 |

### 4.2 참고 코드
```
tests/
├── integration/
│   └── {existing}.integration.test.js
├── e2e/
│   └── {existing}.e2e.test.js
└── fixtures/
    └── {existing}Fixtures.js
```

### 4.3 테스트 구조
```javascript
// 통합 테스트 패턴
describe('{Feature} Integration', () => {
  beforeAll(async () => {
    // Setup
  });

  test('시나리오 1: {설명}', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### 4.4 Quick Tips
- ✅ Phase 1: Mock 기반 테스트 (병렬 중)
- ✅ Phase 2: Mock 제거 → 실제 연결
- ✅ Staging 검증은 실제 환경에서
- ✅ 버그 발견 시 해당 Agent에 피드백

---

## 5. 공통 참고 자료

### 5.1 프로젝트 구조
```
{PROJECT_ROOT}/
├── CLAUDE.md              ← 프로젝트 진입점
├── KB.md                  ← TDD 원칙
├── docs/
│   ├── feature-hubs/      ← 기능별 문서
│   └── engineering/       ← 기술 가이드
├── src/                   ← Frontend
├── functions/             ← Backend
└── tests/                 ← 테스트
```

### 5.2 커밋 규칙
```
feat: 새 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링 (기능 변경 없음)
test: 테스트 추가/수정
docs: 문서 업데이트
```

### 5.3 브랜치 전략
```
main (production)
  └── dev (staging)
        └── feat/{feature-name} (개발 중)
```

---

## 6. 문제 해결

### 6.1 막혔을 때
1. 먼저 관련 문서 다시 확인
2. 기존 코드에서 유사 패턴 찾기
3. Orchestrator에게 질문 (아래 형식)

### 6.2 질문 형식
```
❓ 질문: {질문 내용}
📍 맥락: Task {번호}를 진행 중
🔍 확인한 것: {이미 본 문서/코드}
💡 시도한 것: {시도한 해결책}
```

---

*이 문서는 Orchestrator가 자동 생성했습니다.*
*문서 버전: 1.0*
