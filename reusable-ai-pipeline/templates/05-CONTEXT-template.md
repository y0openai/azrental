# 05-CONTEXT.md - {기능명} 배경 지식

> **Sub-agent Context Document**
> **목적**: Sub-agent가 전체 문서를 읽지 않고도 필요한 배경 지식을 빠르게 습득
> **작성일**: {YYYY-MM-DD}
> **작성자**: Orchestrator Agent

---

## 🎯 이 문서의 목적

당신은 **{Agent 역할}**입니다. 이 문서는 Orchestrator가 당신에게 전달하는 **핵심 배경 지식**입니다.

**읽는 시간**: 5분
**읽은 후**: `03-ORCHESTRATION.md`에서 당신의 Task를 확인하세요.

---

## 1. 기능 개요 (1분)

### 1.1 한 줄 요약
> {기능을 한 줄로 설명}

### 1.2 왜 만드는가?
- **문제**: {해결하려는 문제}
- **목표**: {달성 목표}
- **영향**: {영향받는 사용자/시스템}

### 1.3 핵심 용어
| 용어 | 의미 |
|------|------|
| {용어1} | {의미} |
| {용어2} | {의미} |
| {용어3} | {의미} |

---

## 2. 기존 시스템 이해 (2분)

### 2.1 관련 코드 위치
```
📁 현재 프로젝트 구조에서 관련 부분:

Frontend:
├── src/components/{관련 폴더}/   ← 기존 컴포넌트
├── src/hooks/{관련 훅}.js        ← 기존 훅
└── src/services/{관련 서비스}.js ← 기존 서비스

Backend:
├── functions/services/{관련 서비스}.js  ← 기존 함수
└── functions/__tests__/                  ← 테스트 위치
```

### 2.2 기존 패턴 (따라야 할 것)
```javascript
// 이 프로젝트에서 사용하는 패턴 예시

// Hook 패턴
function use{Feature}() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ... 로직

  return { data, loading, actions };
}

// Service 패턴
export async function {method}(params) {
  const result = await httpsCallable(functions, '{functionName}')(params);
  return result.data;
}
```

### 2.3 주의사항
- ⚠️ {주의사항 1}
- ⚠️ {주의사항 2}
- ⚠️ {주의사항 3}

---

## 3. 이번 기능의 핵심 결정사항 (1분)

### 3.1 아키텍처 결정
| 결정 | 선택 | 이유 |
|------|------|------|
| {결정1} | {선택} | {이유} |
| {결정2} | {선택} | {이유} |

### 3.2 데이터 흐름
```
사용자 Action
     ↓
[Frontend Component]
     ↓
[Hook: use{Feature}]
     ↓
[Service: {feature}Service]
     ↓
[Cloud Function: {functionName}]
     ↓
[Firestore: {collection}]
```

### 3.3 신규 스키마 요약
```javascript
// 새로 추가되는 데이터 구조
{collection_name}: {
  id: string,
  {field1}: {type},  // {용도}
  {field2}: {type},  // {용도}
  createdAt: timestamp
}
```

---

## 4. 당신의 역할 요약 (1분)

### Backend Agent인 경우:
- **담당**: Cloud Functions + Firestore
- **산출물**: `functions/services/{feature}Service.js`
- **테스트**: `functions/__tests__/{feature}Service.test.js`
- **참고**: `development/coding-conventions.md` 섹션 10

### Frontend Core Agent인 경우:
- **담당**: Hooks + Services
- **산출물**: `src/hooks/use{Feature}.js`, `src/services/{feature}Service.js`
- **테스트**: `src/__tests__/hooks/use{Feature}.test.js`
- **참고**: `development/coding-conventions.md` 섹션 4-6

### Frontend UI Agent인 경우:
- **담당**: Components + Styling
- **산출물**: `src/components/{category}/{Component}.jsx`
- **테스트**: `src/__tests__/components/{Component}.test.jsx`
- **참고**: Design System 가이드

### QA Agent인 경우:
- **담당**: 통합 테스트 + E2E + Staging 검증
- **산출물**: `tests/integration/`, `tests/e2e/`
- **참고**: `onboarding/testing.md`

---

## 5. Quick Links

### 5.1 다음으로 읽을 문서
- 📋 `03-ORCHESTRATION.md` - 당신의 Task 목록

### 5.2 필요 시 참고
- 📖 `KB.md` - TDD 원칙
- 📖 `development/coding-conventions.md` - 코딩 규칙
- 📖 `02-RFC.md` - 상세 기술 설계

---

## 6. 질문이 있다면?

Orchestrator에게 다음 형식으로 질문하세요:

```
❓ 질문: {질문 내용}
📍 맥락: {어떤 Task를 하다가 궁금해졌는지}
🔍 시도한 것: {이미 확인한 문서나 코드}
```

---

*이 문서는 Orchestrator가 자동 생성했습니다.*
*문서 버전: 1.0*
