# Documentation Sync Protocol (문서 동기화 프로토콜)

> **문제**: 코드와 문서가 분리되어 시간이 지남에 따라 점점 더 괴리됨
> **원인**: 문서 동기화를 사후(After-Fix)로 처리하면, 기술 부채가 눈덩이처럼 불어남
> **솔루션**: 동기화를 사전(Before-Fix)으로 강제하는 프로토콜

---

## 📌 핵심 원칙

### "Documentation First, Code Second"

모든 **구조 변경**(DB 스키마, 설정, API 인터페이스)은:

```
1️⃣ 문서 변경 먼저 (PR/Commit 전)
   ↓
2️⃣ 코드 변경 (문서와 일치하도록)
   ↓
3️⃣ 테스트 (문서 + 코드 동기화 검증)
   ↓
4️⃣ Commit (한 번에)
```

---

## 🎯 언제 문서 동기화가 필요한가?

### ✅ "반드시" 문서 동기화 필요

| 변경 유형 | 영향도 | 행동 | 문서 |
|----------|--------|------|------|
| **Firestore 컬렉션 추가/삭제** | 🔴 Critical | 🚫 금지 | `firestore-schema-reference.md` |
| **Firestore 필드 추가/변경/삭제** | 🔴 Critical | 🚫 금지 | `firestore-schema-reference.md` |
| **Cloud Functions 추가/삭제** | 🔴 Critical | 🚫 금지 | `system-architecture-reference.md` |
| **Cloud Functions 파라미터 변경** | 🔴 Critical | 🚫 금지 | `system-architecture-reference.md` |
| **policy_configs 도메인 추가** | 🔴 Critical | 🚫 금지 | `policy-driven.md` |
| **API 엔드포인트 추가/변경** | 🔴 Critical | 🚫 금지 | `system-architecture-reference.md` |
| **보안 규칙 변경** | 🟠 High | ⚠️ 강력 권장 | `firestore-schema-reference.md` |
| **라우팅 구조 변경** | 🟠 High | ⚠️ 강력 권장 | `routing-structure-reference.md` |
| **환경 설정 추가** | 🟠 High | ⚠️ 강력 권장 | `.env.example` + 문서 |
| **데이터 마이그레이션** | 🟡 Medium | ✅ 권장 | `deployment/migrations.md` |

### ❌ "불필요" 문서 동기화

```
- 함수 내부 로직 리팩토링 (인터페이스 변경 없음)
- 변수명 리네이밍 (외부 영향 없음)
- 성능 최적화 (동작 불변)
- 스타일 개선
- 주석 추가
```

---

## 🔄 실제 프로토콜: "Documentation Sync Checklist"

### Phase 1: Bug Fix 시작 전 (1분)

```
버그 분석 완료 후, 수정을 시작하기 전:

[ ] "이 버그 수정이 구조 변경을 동반하는가?"
    ├─ [ ] DB 스키마 변경?
    ├─ [ ] 정책 설정 추가/변경?
    ├─ [ ] API 파라미터 변경?
    ├─ [ ] 라우팅 구조 변경?
    └─ [ ] 환경 설정 추가?

    NO (모두 체크 안 함) → Phase 3로 진행
    YES (1개 이상 체크) → Phase 2로 진행
```

### Phase 2: Documentation 먼저 (5-10분)

**선택된 각 문서마다:**

```
1️⃣ 문서 파일 열기
   예: firestore-schema-reference.md

2️⃣ 변경 내용 정확히 기록
   - 추가: 새로운 필드명, 타입, 설명
   - 변경: Before → After
   - 삭제: 삭제된 항목 명시

3️⃣ 관련 섹션 모두 업데이트
   예: 필드 추가 시 → 타입, 보안규칙, 인덱스도 동시 업데이트

4️⃣ 최소 2곳에서 검색해서 다른 곳에도 동일하게 적용
   예: "users" 컬렉션 변경 시
   - firestore-schema-reference.md 업데이트
   - firestore-quick-guide.md의 예시도 동기화
   - KB.md의 관련 섹션도 동기화

5️⃣ 문서 커밋 (선택) 또는 같은 커밋에 포함
```

**예시: Firestore 필드 추가**

```markdown
// Before
## users 컬렉션
| 필드 | 타입 | 설명 |
| --- | --- | --- |
| uid | string | 사용자 고유 ID |
| email | string | 이메일 주소 |

// After (문서 변경)
## users 컬렉션
| 필드 | 타입 | 설명 |
| --- | --- | --- |
| uid | string | 사용자 고유 ID |
| email | string | 이메일 주소 |
| **suspensionUntil** | **timestamp** | **계정 정지 기한** |
| **suspensionReason** | **string** | **정지 사유** |
```

### Phase 3: Code Fix (실제 수정)

```
이제 안전하게 코드를 수정합니다:
- 문서와 코드가 일치하도록 수정
- 테스트 작성 (코드 + 문서 동기화 검증)
```

### Phase 4: Single Commit (최종 커밋)

```bash
# 좋은 예: 문서 + 코드를 한 커밋에
git add docs/engineering/guides/reference/firestore-schema-reference.md
git add src/pages/admin/AdminPolicyConfig.jsx
git commit -m "fix: Add suspension fields to users collection"

# 나쁜 예: 분리된 커밋 (추적 어려움)
git commit -m "docs: Update firestore schema"  # 첫 커밋
git commit -m "fix: Add suspension logic"      # 두 번째 커밋 (관계 불명확)
```

---

## 🛡️ "Documentation Debt" 방지 전략

### 1️⃣ **자동화된 검증 (CI/CD)**

```yaml
# .github/workflows/doc-sync-check.yml
name: Documentation Sync Check

on: [pull_request]

jobs:
  doc-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # 1. Firestore 스키마 변경 검사
      - name: Check Firestore Schema Consistency
        run: |
          # functions/src/init/initFirestore.js의 컬렉션 정의와
          # docs/.../firestore-schema-reference.md가 일치하는지 검증
          node scripts/validate-firestore-schema.js

      # 2. Cloud Functions 매핑 검사
      - name: Check Cloud Functions Mapping
        run: |
          # functions/index.js의 exports와
          # docs/.../system-architecture-reference.md가 일치하는지 검증
          node scripts/validate-cloud-functions.js

      # 3. Policy Configs 검사
      - name: Check Policy Configs
        run: |
          # policyService.js의 기본값과
          # docs/.../policy-driven.md가 일치하는지 검증
          node scripts/validate-policies.js
```

**검증 스크립트 예시** (`scripts/validate-firestore-schema.js`):

```javascript
/**
 * Firestore 스키마를 자동으로 검증
 * - functions/src/init/initFirestore.js의 컬렉션 정의를 읽음
 * - docs/.../firestore-schema-reference.md의 표와 비교
 * - 불일치 시 CI 실패
 */

const fs = require('fs');
const path = require('path');

// 1. 코드에서 컬렉션 정의 추출
const initFirestoreCode = fs.readFileSync(
  'functions/src/init/initFirestore.js',
  'utf8'
);
const codeCollections = extractCollectionsFromCode(initFirestoreCode);

// 2. 문서에서 컬렉션 정의 추출
const docContent = fs.readFileSync(
  'docs/engineering/guides/reference/backend/firestore-schema-reference.md',
  'utf8'
);
const docCollections = extractCollectionsFromDoc(docContent);

// 3. 비교
const diff = compareCollections(codeCollections, docCollections);

if (diff.mismatches.length > 0) {
  console.error('❌ Documentation sync failed!');
  console.error('Mismatches:');
  diff.mismatches.forEach(m => {
    console.error(`  - ${m.collection}.${m.field}: ${m.issue}`);
  });
  process.exit(1);
} else {
  console.log('✅ Documentation is in sync with code');
  process.exit(0);
}
```

### 2️⃣ **"Documentation Debt" 추적**

**새 파일**: `docs/engineering/guides/development/DOCUMENTATION-DEBT.md`

```markdown
# Documentation Debt Tracker

> 문서와 코드의 괴리를 추적하는 "기술부채" 관리

## 현재 상태: ✅ 동기화됨 (2025-12-23)

최근 수정:
- 2025-12-23: Refund 정책 UI 추가 (Admin 수정 권한) ✅
- 2025-12-22: QA Agent 역할 명확화 ✅

---

## 알려진 불일치 (0개)

| 항목 | 코드 | 문서 | 상태 | 기한 |
|------|------|------|------|------|
| (없음) | - | - | ✅ | - |

---

## 동기화 체크리스트

매주 금요일 PM 5시에 다음을 확인:

- [ ] Firestore 스키마 일치 여부
- [ ] Cloud Functions 목록 일치 여부
- [ ] 정책 설정 일치 여부
- [ ] API 문서 최신화
- [ ] 라우팅 구조 일치 여부
```

### 3️⃣ **Code Review 체크리스트**

```markdown
# PR 검토 시 Documentation Sync 확인

## 구조 변경이 있는 경우:

- [ ] Firestore 스키마 변경? → `firestore-schema-reference.md` 동기화 확인
- [ ] Cloud Function 추가/삭제? → `system-architecture-reference.md` 동기화 확인
- [ ] Policy 추가? → `policy-driven.md` 동기화 확인
- [ ] API 파라미터 변경? → `system-architecture-reference.md` 동기화 확인
- [ ] 라우팅 변경? → `routing-structure-reference.md` 동기화 확인

## 확인 방법:

```bash
# 문서 변경이 있는지 확인
git diff --name-only | grep -E "docs/.*reference"

# 이 결과가 비어있으면 → 구조 변경인데 문서 미업데이트! 🚨
```
```

---

## 🚀 실제 적용: Bug Fix 시나리오

### 시나리오: "Deposit Amount 변경 버그"

**발견**: Admin이 5 → 10 credit으로 변경했는데, 신규 Request에 미적용

**Step 1: 분석 (1분)**
```
✅ "이 버그가 구조 변경을 동반하나?"

문제: Refund 정책의 depositAmount 필드 UI가 없어서 수정 불가능

분석:
- DB 스키마 변경? ❌ (이미 depositAmount 필드 존재)
- 정책 설정 추가? ❌ (이미 policyService.js에 기본값 있음)
- API 변경? ❌ (이미 updatePolicyConfig() 존재)
- UI 추가? ✅ (AdminPolicyConfig.jsx에 refund 정책 필드 없음)

결론: 구조 변경 없음 → Phase 2 스킵, Phase 3으로 직진
```

**Step 2: 코드 수정 (10분)**
```
AdminPolicyConfig.jsx에 refund 정책 필드 추가:
- depositAmount
- refundRates
- compensationCredits
```

**Step 3: 코드 리뷰 (검증)**
```
✅ 문서 + 코드 동기화 확인:

- policyService.js의 기본값 (refund.depositAmount: 5) 확인 ✓
- KB.md에서 정책 설명 확인 ✓
- firestore-schema-reference.md에서 policy_configs 구조 확인 ✓

→ 모두 일치함! 문서 수정 불필요
```

**Step 4: Commit**
```bash
git commit -m "fix: Enable Admin to modify refund policy settings"
```

---

## 📊 대규모 구조 변경: Documentation Sync 프로세스

### 예: "Loyalty System 추가 (새 Cloud Function + DB)"

#### Week 1: Design + Documentation Phase

**Day 1-2: RFC 작성**
```
docs/feature-hubs/loyalty-system/02-RFC.md
- Loyalty System 아키텍처 설계
- 새 Cloud Functions 3개 정의 (grantLoyaltyBonus, checkLoyaltyTier, etc.)
- 새 Firestore 컬렉션 정의 (user_loyalty)
```

**Day 3: Reference 문서 사전 작성**
```
docs/engineering/guides/reference/backend/system-architecture-reference.md
- 새 함수 3개 추가 (updatePending 상태)

docs/engineering/guides/reference/backend/firestore-schema-reference.md
- user_loyalty 컬렉션 추가 (updatePending 상태)
```

**Day 4: Code Review (설계 검증)**
```
문서 기반 PR Review:
- RFC가 명확한가?
- 새 함수 정의가 명확한가?
- DB 스키마가 정규화되었는가?

모두 YES → Code Phase로 진행
```

#### Week 2-3: Implementation Phase

**Day 1-7: 개발**
```
4명 에이전트 병렬 개발:
- Backend Agent: Cloud Functions 구현
- Frontend Core: Loyalty Service Hook 구현
- Frontend UI: UI 컴포넌트 구현
- QA Agent: 테스트 작성

모두 동일한 RFC + 미리 작성된 문서 기반으로 개발
```

**Day 8: Documentation Sync (최종)**
```
모든 개발 완료 후 문서 최종 검증:

[ ] 새 Cloud Functions 3개 모두 system-architecture-reference.md에 있나?
    └─ 있나? → ✅ (이미 사전에 작성함)

[ ] 새 Firestore 컬렉션 firestore-schema-reference.md에 있나?
    └─ 있나? → ✅ (이미 사전에 작성함)

[ ] 코드의 함수 시그니처 = 문서의 정의?
    └─ 같나? → ✅ (이미 일치함)

결론: 문서 수정 불필요 (Week 1에서 이미 작성됨)
```

#### Week 4: Deployment

```
✅ 문서와 코드가 100% 동기화된 상태로 배포
```

---

## 🎯 핵심 체크리스트: "언제 어떤 문서를 수정할까?"

| 수정 유형 | 문서 | 언제 | 누가 |
|----------|------|------|------|
| **Firestore 필드 추가** | `firestore-schema-reference.md` | Before Code | 설계 단계 |
| **Cloud Function 추가** | `system-architecture-reference.md` | Before Code | 설계 단계 |
| **Policy 추가** | `policy-driven.md` | Before Code | 설계 단계 |
| **라우팅 변경** | `routing-structure-reference.md` | Before Code | 설계 단계 |
| **보안 규칙 변경** | `firestore-schema-reference.md` | After Code | 구현 단계 |
| **함수 로직 변경** | (문서 수정 불필요) | N/A | N/A |
| **성능 최적화** | (문서 수정 불필요) | N/A | N/A |

---

## 🏆 Best Practice: Documentation as Code (DaC)

### 문서를 "Live" 상태로 유지하는 방법

```javascript
/**
 * 아이디어: 문서 내용을 코드와 함께 검증
 *
 * 예: Firestore 스키마 정의
 */

// src/types/firestore.schema.ts
export const FIRESTORE_SCHEMA = {
  users: {
    description: 'User profiles and account data',
    fields: {
      uid: { type: 'string', required: true, desc: 'Unique user ID' },
      email: { type: 'string', required: true, desc: 'Email address' },
      role: { type: 'string', enum: ['local', 'crew', 'admin'] },
      // ... 모든 필드
    },
    indexes: [
      { fields: ['role', 'createdAt'] },
      // ... 모든 인덱스
    ]
  }
};

// 이제 문서는 이 정의를 자동으로 생성할 수 있음
// → 코드와 문서가 자동으로 동기화!

// docs/generate-firestore-reference.js
const schema = require('../src/types/firestore.schema');
const markdown = generateMarkdownTable(schema.users);
// markdown을 firestore-schema-reference.md에 자동 생성
```

---

## 📋 최종 체크리스트

### 모든 Bug Fix 전에:

```
✅ 5분 체크리스트

[ ] 이 버그가 구조 변경을 동반하는가?

    NO → 코드 수정만 진행
    YES → 다음을 확인:

    [ ] 해당 문서 파일을 열었는가?
    [ ] 변경 내용을 정확히 기록했는가?
    [ ] 다른 곳에서도 동일 정보를 찾아 동기화했는가?
    [ ] 관련 섹션을 모두 업데이트했는가?

    모두 YES → 코드 수정 진행 후 한 Commit에 포함
```

---

## 🌍 세계적 팀이 사용하는 도구

| 도구 | 용도 | 예시 |
|------|------|------|
| **Notion/Confluence** | 중앙 문서 저장소 | Google, Meta |
| **OpenAPI/Swagger** | API 문서 자동생성 | Apple, Amazon |
| **Docusaurus** | 문서 자동화 | Meta, Stripe |
| **MkDocs** | CI 기반 문서 생성 | Kubernetes, Docker |
| **GitHub Pages** | 배포 자동화 | Linux Foundation |
| **Document as Code** | Git + Markdown 기반 | Netflix, Uber |

---

## 💡 최종 조언

**"문서 동기화의 고통을 피하는 가장 좋은 방법은 처음부터 문서를 코드처럼 취급하는 것입니다."**

```
나쁜 방법: 코드 수정 → 문서 수정 (선택)
좋은 방법: 문서 수정 → 코드 수정 (필수)
최고 방법: 문서와 코드를 함께 생성 (자동화)
```

이를 실현하려면:
1. **Design Phase**에서 문서를 먼저 작성
2. **CI/CD**에서 문서 동기화 검증
3. **Code Review**에서 문서 확인을 필수 항목으로 포함
4. **매주/매월** "Documentation Debt" 검토 회의 (15분)

---

**다음 단계**: 팀의 규모와 현황에 맞춰 이 프로토콜을 커스터마이즈하세요.

