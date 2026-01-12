# 06-POLICY-SETUP.md - {기능명} 정책 설정

> **Dynamic Configuration Setup**
> **목적**: 하드코딩 없이 동적으로 변경 가능한 설정 정의
> **작성일**: {YYYY-MM-DD}
> **작성자**: Orchestrator Agent

---

## 1. 정책 기반 아키텍처 개요

### 1.1 원칙
> "정책이 변해도 코드는 재배포하지 않는다"

- 모든 동적 설정은 `policy_configs/{도메인}` 컬렉션에 저장
- Backend는 `policyService.getPolicyConfig()`로 접근
- Frontend는 필요 시 API 호출 또는 Context로 접근

### 1.2 이 기능의 정책 도메인
```
policy_configs/{DOMAIN_NAME}
```

---

## 2. 정책 설정 목록

### 2.1 필수 정책
| 키 | 타입 | 기본값 | 설명 | 변경 빈도 |
|----|------|--------|------|----------|
| `{key1}` | {type} | `{default}` | {설명} | 낮음/중간/높음 |
| `{key2}` | {type} | `{default}` | {설명} | 낮음/중간/높음 |
| `{key3}` | {type} | `{default}` | {설명} | 낮음/중간/높음 |

### 2.2 선택 정책
| 키 | 타입 | 기본값 | 설명 | 변경 빈도 |
|----|------|--------|------|----------|
| `{key4}` | {type} | `{default}` | {설명} | 낮음/중간/높음 |

---

## 3. Firestore 문서 구조

### 3.1 전체 스키마
```javascript
// policy_configs/{DOMAIN_NAME}
{
  // 필수 정책
  {key1}: {default_value},
  {key2}: {default_value},
  {key3}: {default_value},

  // 선택 정책
  {key4}: {default_value},

  // 메타데이터
  version: "1.0",
  updatedAt: serverTimestamp(),
  updatedBy: "{admin_uid}"
}
```

### 3.2 예시 데이터
```javascript
// 실제 저장될 데이터 예시
{
  {key1}: {example_value},
  {key2}: {example_value},
  {key3}: {example_value},
  version: "1.0",
  updatedAt: Timestamp.now(),
  updatedBy: "admin123"
}
```

---

## 4. 초기화 스크립트

### 4.1 스크립트 위치
```
scripts/setup/initialize-{feature}-policy.cjs
```

### 4.2 스크립트 내용
```javascript
// scripts/setup/initialize-{feature}-policy.cjs
const admin = require('firebase-admin');

// 환경 설정
const environment = process.argv.includes('--production') ? 'production' : 'staging';
const serviceAccountPath = environment === 'production'
  ? './serviceAccountKey.json'
  : './serviceAccountKey-staging.json';

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath))
});

const db = admin.firestore();

async function initializePolicy() {
  const policyRef = db.collection('policy_configs').doc('{DOMAIN_NAME}');

  const policyData = {
    // 필수 정책
    {key1}: {default_value},
    {key2}: {default_value},
    {key3}: {default_value},

    // 선택 정책
    {key4}: {default_value},

    // 메타데이터
    version: "1.0",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: "system-init"
  };

  await policyRef.set(policyData, { merge: true });
  console.log(`✅ Policy initialized for ${environment}`);
}

initializePolicy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
```

### 4.3 실행 방법
```bash
# Staging
node scripts/setup/initialize-{feature}-policy.cjs

# Production
node scripts/setup/initialize-{feature}-policy.cjs --production
```

---

## 5. Backend 사용법

### 5.1 Policy Service 호출
```javascript
// functions/services/{feature}Service.js
const { getPolicyConfig } = require('../utils/policyService');

async function {functionName}(params) {
  // 정책 로드
  const policy = await getPolicyConfig('{DOMAIN_NAME}');

  // 정책 값 사용
  const {key1} = policy.{key1};
  const {key2} = policy.{key2};

  // 비즈니스 로직
  // ...
}
```

### 5.2 캐싱 고려
```javascript
// 정책은 자주 변경되지 않으므로 캐싱 권장
let cachedPolicy = null;
let cacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5분

async function getCachedPolicy() {
  if (cachedPolicy && Date.now() - cacheTime < CACHE_TTL) {
    return cachedPolicy;
  }
  cachedPolicy = await getPolicyConfig('{DOMAIN_NAME}');
  cacheTime = Date.now();
  return cachedPolicy;
}
```

---

## 6. Admin Console 연동 (선택)

### 6.1 Admin UI 위치
```
src/pages/admin/Admin{Feature}Config.jsx
```

### 6.2 편집 가능 필드
| 필드 | UI 타입 | 검증 규칙 |
|------|---------|----------|
| `{key1}` | {input/select/toggle} | {규칙} |
| `{key2}` | {input/select/toggle} | {규칙} |

---

## 7. 테스트

### 7.1 정책 Mock
```javascript
// __mocks__/policyService.js
export const mockGetPolicyConfig = jest.fn().mockResolvedValue({
  {key1}: {test_value},
  {key2}: {test_value},
  {key3}: {test_value}
});
```

### 7.2 테스트 케이스
- [ ] 기본값으로 정상 동작
- [ ] 정책 값 변경 시 동작 변화 확인
- [ ] 정책 누락 시 fallback 동작

---

## 8. 배포 체크리스트

### 8.1 Staging 배포 전
- [ ] 초기화 스크립트 실행 (`--staging`)
- [ ] Cloud Functions 배포
- [ ] 정책 값 확인 (Firestore Console)

### 8.2 Production 배포 전
- [ ] 초기화 스크립트 실행 (`--production`)
- [ ] Cloud Functions 배포
- [ ] 정책 값 확인 (Firestore Console)
- [ ] 롤백 계획 수립

---

*문서 버전: 1.0*
*최종 수정: {YYYY-MM-DD}*
