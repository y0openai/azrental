# 03-RFC.md - {기능명} 기술 설계

> **Request for Comments (Technical Design)**
> **작성일**: {YYYY-MM-DD}
> **작성자**: Orchestrator Agent
> **상태**: Draft | Review | Approved

---

## 1. 개요

### 1.1 목적
이 문서는 {기능명} 구현을 위한 기술적 설계를 정의합니다.

### 1.2 관련 문서
- PRD: `01-PRD.md`
- WIREFRAME: `02-WIREFRAME.md`
- ORCHESTRATION: `04-ORCHESTRATION.md`

---

## 2. 시스템 아키텍처

### 2.1 전체 구조
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Backend   │────▶│  Database   │
│  (Frontend) │     │  (Functions)│     │ (Firestore) │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 2.2 컴포넌트 다이어그램
```
Frontend:
├── components/
│   └── {ComponentName}/
│       ├── {Component}.jsx
│       └── {Component}.css
├── hooks/
│   └── use{Feature}.js
└── services/
    └── {feature}Service.js

Backend:
├── functions/
│   ├── index.js
│   └── services/
│       └── {feature}Service.js
```

---

## 3. 데이터 모델

### 3.1 스키마 변경
```javascript
// 신규 컬렉션: {collection_name}
{
  id: string,           // PK
  userId: string,       // FK -> users
  {field1}: {type},     // {설명}
  {field2}: {type},     // {설명}
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3.2 기존 스키마 수정
```javascript
// users 컬렉션 수정
{
  // 기존 필드...
  + {newField}: {type}  // 신규 추가: {설명}
}
```

---

## 4. API 설계

### 4.1 Cloud Functions

#### `{functionName}`
```javascript
// 호출 방법
const result = await httpsCallable(functions, '{functionName}')(data);

// Request
{
  {param1}: {type},  // {설명}
  {param2}: {type}   // {설명}
}

// Response
{
  success: boolean,
  data: {
    {field1}: {type}
  },
  error?: string
}
```

### 4.2 에러 코드
| 코드 | 설명 | 처리 방법 |
|------|------|----------|
| `{ERROR_CODE_1}` | {설명} | {처리 방법} |
| `{ERROR_CODE_2}` | {설명} | {처리 방법} |

---

## 5. 보안

### 5.1 Security Rules
```javascript
// Firestore Rules
match /{collection}/{docId} {
  allow read: if {조건};
  allow write: if {조건};
}
```

### 5.2 인증/인가
- {인증 요구사항}
- {인가 요구사항}

---

## 6. Frontend 설계

### 6.1 컴포넌트 계층
```
{PageComponent}
├── {ContainerComponent}
│   ├── {PresentationalComponent1}
│   └── {PresentationalComponent2}
└── {SidebarComponent}
```

### 6.2 상태 관리
```javascript
// Hook Interface
function use{Feature}() {
  return {
    // State
    data: {type},
    loading: boolean,
    error: Error | null,

    // Actions
    {action1}: () => Promise<void>,
    {action2}: (param: {type}) => void
  };
}
```

### 6.3 Mock 인터페이스
```javascript
// Mock for parallel development
export const mock{Feature} = {
  {action1}: jest.fn().mockResolvedValue({mockData}),
  {action2}: jest.fn()
};
```

---

## 7. 정책 설정 (Policy Config)

### 7.1 동적 설정
```javascript
// policy_configs/{domain}
{
  {configKey1}: {value},  // {설명}
  {configKey2}: {value},  // {설명}
  updatedAt: timestamp
}
```

### 7.2 기본값
| 키 | 기본값 | 설명 |
|----|--------|------|
| `{key1}` | `{value}` | {설명} |
| `{key2}` | `{value}` | {설명} |

---

## 8. 테스트 전략

### 8.1 단위 테스트
- Backend: `{service}.test.js`
- Frontend: `use{Feature}.test.js`

### 8.2 통합 테스트
- `{feature}.integration.test.js`

### 8.3 E2E 테스트
- `{feature}.e2e.test.js`

---

## 9. 마이그레이션 계획

### 9.1 데이터 마이그레이션
```javascript
// 마이그레이션 스크립트
// scripts/migrations/{migration_name}.js
```

### 9.2 배포 순서
1. Backend 배포
2. Frontend 배포
3. 데이터 마이그레이션
4. 검증

---

## 10. 리스크 및 대안

| 리스크 | 영향 | 대안 |
|--------|------|------|
| {리스크1} | High/Medium/Low | {대안} |
| {리스크2} | High/Medium/Low | {대안} |

---

*문서 버전: 1.0*
*최종 수정: {YYYY-MM-DD}*
