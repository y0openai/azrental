# 리팩토링 에이전트 (Refactoring Agent)

> **대상**: 코드 품질 개선, 기술 부채 해소, 아키텍처 개선을 담당하는 에이전트
> **소요 시간**: 2분 (Quick Reference)
> **난이도**: ⭐⭐ (중간)

---

## 🎯 이 가이드를 읽어야 하는 경우

- [ ] 코드 품질 개선 (복잡도 감소, 가독성 향상)
- [ ] 중복 코드 제거 (DRY 원칙 적용)
- [ ] 레거시 코드 현대화 (예: Class Component → Hooks)
- [ ] 성능 최적화 (렌더링, 쿼리 최적화)
- [ ] 아키텍처 개선 (모듈화, 정책 분리)

**읽지 않아도 되는 경우**: 신규 기능 개발, 긴급 버그 수정

---

## ⚡ Quick Start (2분 체크리스트)

### 1. 리팩토링 범위 정의 (Scope)
- [ ] 대상 파일/모듈 식별
- [ ] 리팩토링 목표 명확화 (성능? 가독성? 유지보수성?)
- [ ] 영향 범위 분석 (다른 컴포넌트/서비스 의존성)
- [ ] **⭐ 구조 변경 확인**: DB 스키마 / Firestore 컬렉션 / API 파라미터 변경?
  - YES → [documentation-sync-protocol.md](../development/documentation-sync-protocol.md) 참조
  - NO → 바로 Step 2 진행

### 2. 테스트 준비 (Safety Net)
- [ ] 기존 동작 문서화 (스크린샷, 동작 시나리오)
- [ ] 테스트 케이스 작성 (선택적, 복잡한 로직만)
- [ ] Backup 브랜치 생성: `git checkout -b refactor/{목적}`

### 3. 리팩토링 실행 (Execution)
- [ ] 단계별 점진적 변경 (한 번에 모든 것을 바꾸지 말 것)
- [ ] 각 단계마다 로컬 테스트
- [ ] 커밋 주기: 논리적 단위마다 커밋

### 4. 검증 (Validation)
- [ ] 기존 동작과 동일한지 확인
- [ ] 성능 측정 (개선되었는지 확인)
- [ ] Staging 배포 후 회귀 테스트

### 5. 배포 (Deployment)
- [ ] Git Commit: `refactor: {목적 간략 설명}`
  - 예: `refactor: Modularize strike service into functions/services/`
- [ ] PR 생성 및 코드 리뷰 요청 (선택적)
- [ ] Production 배포: `npm run deploy`

---

## 📖 리팩토링 유형별 가이드

### 1. 정책 기반 아키텍처 마이그레이션 ⭐⭐⭐
**목표**: 하드코딩된 설정 값을 `policy_configs/`로 이동

#### Before (❌ Bad)
```javascript
// src/utils/creditConfig.js
const SIGNUP_BONUS = 50;  // 하드코딩
const REFERRAL_REWARD = 30;

export const calculateReward = (type) => {
  if (type === 'signup') return SIGNUP_BONUS;
  if (type === 'referral') return REFERRAL_REWARD;
};
```

#### After (✅ Good)
```javascript
// src/services/creditService.js
import { getPolicyConfig } from './policyService';

export const calculateReward = async (type) => {
  const policy = await getPolicyConfig('credit');
  if (type === 'signup') return policy.signupBonus;
  if (type === 'referral') return policy.referralReward;
};
```

#### Firestore 설정 (policy_configs/credit)
```json
{
  "signupBonus": 50,
  "referralReward": 30,
  "version": "1.0",
  "updatedAt": "2025-12-21T00:00:00Z"
}
```

**참고 문서**: [정책 기반 아키텍처 - 섹션 6 (마이그레이션)](../design/policy-driven.md#6-레거시-코드-마이그레이션-전략)

**⭐ Documentation Sync 필수**:
- [ ] `policy_configs/{도메인}` 문서 구조 변경 시: [documentation-sync-protocol.md](../development/documentation-sync-protocol.md) 참조
- [ ] Firestore 스키마 변경 있는가? (YES → 문서 업데이트 필수)
- [ ] API 파라미터 시그니처 변경 있는가? (YES → 문서 업데이트 필수)

---

### 2. Backend 모듈화 ⭐⭐⭐
**목표**: `functions/index.js`에 있는 비즈니스 로직을 `functions/services/`로 분리

#### Before (❌ Bad)
```javascript
// functions/index.js (500줄)
exports.handleStrike = functions.https.onCall(async (data, context) => {
  const { userId, severity, reason } = data;

  // 50줄의 비즈니스 로직...
  const policy = await admin.firestore().collection('policy_configs').doc('trust_safety').get();
  const threshold = policy.data().strikeThresholds[severity];

  // Strike 부여, Ban 체크, 알림 전송...
  // 총 100줄의 로직
});
```

#### After (✅ Good)
```javascript
// functions/services/strikeService.js (100줄)
const admin = require('firebase-admin');
const { getPolicyConfig } = require('./policyService');

exports.handleStrike = async (data) => {
  const { userId, severity, reason } = data;

  const policy = await getPolicyConfig('trust_safety');
  const threshold = policy.strikeThresholds[severity];

  // Strike 부여, Ban 체크, 알림 전송...
  return { success: true };
};

// functions/index.js (1줄만 추가)
const strikeService = require('./services/strikeService');
exports.handleStrike = functions.https.onCall(strikeService.handleStrike);
```

**참고 문서**: [코딩 표준 - 섹션 10 (Backend 모듈화)](../development/coding-conventions.md#10-cloud-functions-개발-규칙-backend)

**⭐ Documentation Sync 필수** (Cloud Functions 시그니처 변경 시):
- [ ] 기존 함수 시그니처가 변경되었는가? (YES → 문서 업데이트 필수)
  - 예: `exports.handleStrike`의 파라미터 구조 변경 (`data` 형태 변경)
  - 예: 새로운 Cloud Function 추가 (`strikeService` 기능 확장 시)
- [ ] 새로운 서비스 모듈 추가했는가? (YES → [documentation-sync-protocol.md](../development/documentation-sync-protocol.md#step-2-설계-단계-문서-우선-원칙) 참조)
  - 문서화할 내용: 함수 명, 파라미터, 반환값, 의존성 (policyService, Firestore 컬렉션)
  - 위치: `docs/reference/backend/cloud-functions-reference.md`의 해당 카테고리
- [ ] `policyService` 등 공유 서비스에 의존성 추가했는가? (YES → 관련 문서 검토 필수)

---

### 3. Frontend Component 모듈화 ⭐⭐
**목표**: 거대한 컴포넌트를 작은 단위로 분리

#### Before (❌ Bad)
```jsx
// src/pages/ExperienceDetail.jsx (500줄)
function ExperienceDetail() {
  // 이미지 갤러리 로직 (100줄)
  // 예약 폼 로직 (150줄)
  // 리뷰 섹션 로직 (100줄)
  // 호스트 정보 로직 (50줄)

  return (
    <div>
      {/* 500줄의 JSX */}
    </div>
  );
}
```

#### After (✅ Good)
```jsx
// src/pages/ExperienceDetail.jsx (100줄)
import ImageGallery from '../components/experience/ImageGallery';
import BookingForm from '../components/experience/BookingForm';
import ReviewSection from '../components/experience/ReviewSection';
import HostInfo from '../components/experience/HostInfo';

function ExperienceDetail() {
  return (
    <div>
      <ImageGallery images={experience.images} />
      <BookingForm experienceId={id} />
      <ReviewSection experienceId={id} />
      <HostInfo hostId={experience.hostId} />
    </div>
  );
}

// src/components/experience/ImageGallery.jsx (100줄)
// src/components/experience/BookingForm.jsx (150줄)
// ...
```

**참고 문서**: [코딩 표준 - 섹션 4 (컴포넌트 작성법)](../development/coding-conventions.md#4-컴포넌트-작성법)

**⭐ Documentation Sync 필수** (새로운 컴포넌트 폴더 생성 시):
- [ ] 새로운 컴포넌트 폴더 생성했는가? (YES → [documentation-sync-protocol.md](../development/documentation-sync-protocol.md#step-2-설계-단계-문서-우선-원칙) 참조)
  - 예: `/src/components/experience/` 폴더 신규 생성
  - 문서화할 내용: 컴포넌트 목적, Props 타입, 사용 예시, 의존성
- [ ] 컴포넌트 Props 구조가 변경되었는가? (YES → 문서 업데이트 필수)
  - 예: `<ImageGallery images={...} onSelect={...} />`로 새로운 Prop 추가
  - 위치: `docs/reference/frontend/component-reference.md`의 해당 컴포넌트
- [ ] 새로운 라우트나 페이지 구조가 변경되었는가? (YES → 라우팅 문서 검토 필수)
  - [routing-structure-reference.md](../reference/frontend/routing-structure-reference.md) 업데이트 필수

---

### 4. 성능 최적화 ⭐⭐
**목표**: 불필요한 렌더링, 쿼리 비용 감소

#### React 렌더링 최적화
```jsx
// Before (❌ Bad)
function ExperienceList({ experiences }) {
  return experiences.map(exp => (
    <ExperienceCard key={exp.id} experience={exp} />
  ));
}

// After (✅ Good)
import { memo } from 'react';

const ExperienceCard = memo(({ experience }) => {
  // ...
});

function ExperienceList({ experiences }) {
  return experiences.map(exp => (
    <ExperienceCard key={exp.id} experience={exp} />
  ));
}
```

#### Firestore 쿼리 최적화
```javascript
// Before (❌ Bad) - 모든 문서 읽기
const snapshot = await db.collection('experiences').get();
const active = snapshot.docs.filter(doc => doc.data().status === 'active');

// After (✅ Good) - 필터링된 쿼리
const snapshot = await db.collection('experiences')
  .where('status', '==', 'active')
  .get();
```

**참고 문서**: [Firestore 최적화](../reference/firestore-optimization.md)

**📝 Documentation Note** (성능 최적화는 구조 변경 없음):
- 일반적으로 성능 최적화는 **내부 구현 개선**이므로 documentation-sync가 불필요합니다.
- 단, 새로운 환경 변수나 성능 설정 추가 시에만 문서 업데이트 필요합니다.
  - 예: `BATCH_SIZE`, `CACHE_TTL` 등 성능 튜닝 상수 추가

---

## 🚨 리팩토링 주의 사항

### ❌ 하지 말아야 할 것
1. **기능 추가와 리팩토링 동시 진행**: 한 PR에 한 가지만 하세요.
2. **테스트 없는 대규모 변경**: 100줄 이상 변경 시 반드시 테스트 작성.
3. **정책 변경 무시**: 정책 기반 설정 값을 코드로 다시 하드코딩하지 마세요.
4. **Breaking Changes**: 기존 API 시그니처 변경 금지 (필요 시 Deprecated 먼저).

### ✅ 해야 할 것
1. **점진적 변경**: 작은 단위로 나누어 리팩토링.
2. **커밋 분리**: 논리적 단위마다 커밋 (예: "Step 1: Extract service", "Step 2: Update imports").
3. **문서 동기화**: 코드 변경 시 관련 문서 업데이트.
4. **성능 측정**: 최적화 전후 성능 비교 (Lighthouse, Firebase Console).

---

## 📊 리팩토링 체크리스트

### 코드 품질
- [ ] 복잡도 감소 (Cyclomatic Complexity < 10)
- [ ] 중복 코드 제거 (DRY 원칙)
- [ ] 의미 있는 변수/함수명
- [ ] 주석 제거 (자명한 코드는 주석 불필요)

### 아키텍처
- [ ] 모듈화 (200줄 이상 파일은 분리)
- [ ] 정책 분리 (하드코딩 제거)
- [ ] 의존성 최소화 (Loose Coupling)
- [ ] 단일 책임 원칙 (SRP)

### 성능
- [ ] 불필요한 렌더링 제거 (React.memo, useMemo)
- [ ] Firestore 쿼리 최적화 (인덱스 활용)
- [ ] 번들 크기 감소 (Code Splitting)
- [ ] 이미지 최적화 (WebP, Lazy Loading)

### 테스트
- [ ] 기존 동작 검증
- [ ] 회귀 테스트 통과
- [ ] 성능 개선 확인

---

## 📚 관련 가이드

- **정책 기반 아키텍처**: [Implementation Guide](../design/policy-driven.md)
- **Backend 모듈화**: [코딩 표준 - 섹션 10](../development/coding-conventions.md#10-cloud-functions-개발-규칙-backend)
- **성능 최적화**: [Firestore 최적화](../reference/firestore-optimization.md)

---

## 🤔 리팩토링 대상을 못 찾을 때 프로토콜 (Agent Self-Diagnosis)

### 상황: 리팩토링 범위 정의 단계에서 막힐 때

**확인 항목** (이 중 1개 이상이 "아직 안 함"이면 더 시도하세요):

```
⚠️ 이 단계를 스킵하면 안 됩니다!

1️⃣ 기본 코드 분석 (5분)
   - [ ] 대상 파일을 직접 읽고 라인 수, 함수 수 파악?
   - [ ] 복잡도 도구 사용? (VS Code: Sonarqube, JavaScript: eslint-plugin-complexity)
   - [ ] 이 파일이 정말 리팩토링 대상인지 확실?
   → 못 찾음 → "리팩토링 불필요" 결론 가능

2️⃣ 성능/품질 측정 (3분)
   - [ ] Lighthouse 실행 (성능 병목)?
   - [ ] Test Coverage 확인 (낮으면 리팩토링 위험)?
   - [ ] 실제로 성능 문제가 보이나? (느린가, 메모리 누수가 있나?)
   → 측정 데이터 없음 → "추측 리팩토링" 중단

3️⃣ 영향 범위 분석 (5분)
   - [ ] 이 파일/모듈을 사용하는 다른 곳 찾음? (Grep으로 import 검색)
   - [ ] 변경 시 영향받을 컴포넌트 목록 작성?
   - [ ] 의존성 그래프 그려봤나?
   → 영향 범위 모름 → "무분별한 변경" 위험

4️⃣ 리팩토링 유형 분류 (3분)
   - [ ] 이게 정책 분리? 모듈화? 성능 최적화? 가독성 개선? 중 어디?
   - [ ] 해당 유형의 가이드 읽음? (위의 "리팩토링 유형별 가이드" 참고)
   - [ ] Before/After 패턴 이해?
   → 유형 불명확 → 범위 축소하거나 다시 분류

5️⃣ 컨텍스트 검색 (3분)
   - [ ] 같은 파일/모듈이 이미 리팩토링되었나? (Git 히스토리)
   - [ ] 관련 PR/Issue에서 논의된 내용 있나?
   - [ ] 해당 모듈의 "기술 부채" 문서화된 게 있나?
```

### 만약 위의 5단계를 모두 했는데도 못 찾았다면?

**정직하게 보고하세요. 이게 전문가의 방식입니다:**

```markdown
## 🤔 리팩토링 진단 보고서

### 현황
- 리팩토링 대상: [파일명 또는 모듈명]
- 초기 의도: [가독성 개선? 성능 최적화? 정책 분리?]

### 시도한 것 (✓ 완료)
- ✓ 코드 분석 (라인 수, 함수 수, 복잡도 측정)
- ✓ 성능 측정 (Lighthouse 스코어, Test Coverage %)
- ✓ 영향 범위 분석 (dependent files: 3개, API contract changes: 0)
- ✓ 리팩토링 유형 분류 (모듈화 리팩토링)

### 발견한 것
1. **코드 분석 결과**:
   - 파일 크기: 250줄
   - 함수 수: 8개
   - 복잡도: 평균 7 (문제 있음)

2. **성능 측정**:
   - Lighthouse 점수: 85/100 (문제 없음)
   - Test Coverage: 45% (위험)

3. **의존성**:
   - Import하는 파일: 2개 (AdminReport.jsx, AdminTrustSafety.jsx)
   - Breaking Change 위험: 낮음

4. **의심 영역** (100% 확실 아님):
   - A. 복잡한 조건문 (strikeLogic.js:45-80)이 별도 함수로 분리 가능?
   - B. Policy 설정 하드코딩 (strikeLogic.js:20-30) 제거 가능?
   - C. Test Coverage 부족 (현 45%) 때문에 리팩토링 위험?

### 내 질문
1. A/B/C 중 우선순위는?
2. 이 리팩토링이 이번 스프린트에 꼭 필요한가?
3. Test Coverage를 먼저 올리고 리팩토링해야 할까?
```

**이렇게 보고하면:**
- ✅ 당신의 진행 상황이 명확함
- ✅ 사용자가 "아, 이 부분부터 시작하세요" 또는 "이건 나중에"라고 가이드 가능
- ✅ 전문가처럼 보임 (vs "몰라요, 뭐 하면 좋을까요?")

---

## ❓ 자주 묻는 질문 (FAQ)

**Q1: 리팩토링 중 새 기능을 추가해도 되나요?**
A: ❌ 안 됩니다. 리팩토링과 기능 추가를 분리하세요. 리팩토링 PR이 거대해지면 리뷰가 어려워집니다.

**Q2: 레거시 코드를 모두 리팩토링해야 하나요?**
A: ❌ 필요한 부분만 점진적으로 리팩토링하세요. "Boy Scout Rule": 수정할 때마다 조금씩 개선.

**Q3: 리팩토링 후 버그가 발생하면 어떻게 하나요?**
A: Backup 브랜치로 돌아가서 다시 시작하거나, Hotfix로 긴급 수정 후 리팩토링 재시도.

---

**다음 단계**: 리팩토링 완료 후 [배포 절차](../deployment/procedure.md)를 따라 Staging 검증 → Production 배포하세요.
