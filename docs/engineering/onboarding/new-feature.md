# 신규 기능 개발 워크플로 (New Feature Development Workflow)

> **대상**: 신규 기능을 처음부터 끝까지 개발하는 에이전트
> **소요 시간**: 3.5시간 (기획 30분 + 계획 1시간 + 코딩 2시간)
> **난이도**: ⭐⭐⭐ (높음)
> **막혔을 때**: 아래 "기획/설계 단계에서 막혔을 때 프로토콜" 참고

---

## 🎯 이 가이드를 읽어야 하는 경우

- [ ] 완전히 새로운 기능 개발 (예: "Referral System", "Interest Matching")
- [ ] PRD 문서를 기반으로 한 전체 워크플로 실행
- [ ] 기획 → 계획 → 코딩의 3단계를 모두 거쳐야 하는 작업

**읽지 않아도 되는 경우**: 기존 기능 수정, 버그 수정, 리팩토링 (각각의 전용 가이드 참조)

---

## 📋 3단계 워크플로 개요

```
1️⃣ 기획 (Planning)          30분
   ↓
2️⃣ 계획 (Design)             1시간
   ↓
3️⃣ 코딩 (Coding)             2시간
```

---

## 1️⃣ 기획 (Planning) - 30분

### 목표
PRD 문서를 분석하고 요구사항을 이해한다.

### 필수 읽기 자료
1. **[제품 문서 작성 가이드](../planning/prd-writing-full.md)** (30분)
   - PRD 구조 이해
   - 기능 요구사항 분석 방법
   - 제약 사항 및 비기능 요구사항 파악

### 체크리스트
- [ ] **PRD 문서 위치 결정 및 초안 작성** ⭐ 신규
  - [ ] 복잡도 평가 (3개 이상 Yes → Layer 1, 미만 → Layer 3):
    - [ ] 7단계 문서 구조 필요? (PRD/Design/Implementation/Operations/Testing/Policies/Launch)
    - [ ] 여러 컴포넌트/서비스 관련?
    - [ ] 장기 유지보수 필요 (6개월 이상)?
  - [ ] Layer 1 (복잡): `docs/feature-hubs/{기능명}/01-prd/`에 **PRD 초안 작성**
  - [ ] Layer 3 (간단): `docs/product/specs/{기능명}.md`에 **PRD 초안 작성**
- [ ] 핵심 요구사항 3-5개 추출
- [ ] 비기능 요구사항 확인 (성능, 보안, 확장성)
- [ ] 제약 사항 및 우선순위 파악
- [ ] **PRD 초안 사용자 승인 대기** ⭐ 신규

### 출력물
- **PRD 초안 문서** (Layer 1 또는 Layer 3)
- 요구사항 요약 (3-5문장)
- 핵심 사용자 시나리오 (1-2개)

---

## 2️⃣ 계획 (Design) - 1시간

### 목표
시스템 아키텍처와 구현 전략을 설계한다.

### 필수 읽기 자료
1. **[정책 기반 아키텍처 구현](../design/policy-driven.md)** (1시간)
   - 섹션 1-3: 핵심 개념 (30분)
   - 섹션 4-8: 실전 가이드 (30분)
   - ⭐ **핵심 원칙**: "동적 설정이 필요한 값은 `policy_configs/{도메인}`에 저장"

### 체크리스트
- [ ] **⭐ 구조 변경 확인** (Documentation Sync Protocol)
  - [ ] Firestore **새 컬렉션/필드** 추가하는가? (YES → 문서화 필수)
  - [ ] API **파라미터 시그니처** 변경하는가? (YES → 문서화 필수)
  - [ ] Cloud Functions **새 함수** 추가하는가? (YES → 문서화 필수)
  - YES가 1개 이상 → **[documentation-sync-protocol.md](../development/documentation-sync-protocol.md) 필독 후 진행**
    - 이 단계에서 설계 문서에 구조 변경 내용 명시
    - 구현 후 문서 업데이트 확인 필수

- [ ] Firestore 스키마 설계 (새 컬렉션/필드 정의)
  - 📝 **설계 문서에 기록**: 컬렉션명, 필드 목록, 보안 규칙
- [ ] 정책 기반 설정 항목 식별
  - 예: Credit 금액, Strike 임계값, Premium Tier 조건 등
  - 위치: `policy_configs/{도메인}` (예: `policy_configs/referral`)
  - 📝 **설계 문서에 기록**: Policy 필드명, 기본값, 설명
- [ ] Frontend/Backend 컴포넌트 분리
  - Frontend: `src/pages/`, `src/components/`, `src/services/`
  - Backend: `functions/services/` (모듈화 필수)
- [ ] 외부 의존성 확인 (Firebase, 타사 라이브러리)

### 출력물
- Firestore 스키마 다이어그램 (텍스트 형식)
  - **구조 변경 있는 경우**: [documentation-sync-protocol.md](../development/documentation-sync-protocol.md) 참고하여 문서화 방식 확정
- 정책 설정 목록 (`policy_configs/{도메인}` 문서 구조)
- 구현 파일 목록 (Frontend/Backend 구분)
- **설계 문서 작성** ⭐ 신규
  - Layer 1: `docs/feature-hubs/{기능명}/02-design/` 폴더에 아키텍처 문서 작성
    - ⭐ 필수 포함 사항: 구조 변경 내용 (새 컬렉션, Policy, API 시그니처)
  - Layer 3: PRD 파일에 "## 기술 사양" 섹션 추가
    - ⭐ 필수 포함 사항: Firestore 스키마, API 파라미터

---

## 3️⃣ 코딩 (Coding) - 2시간

### 목표
실제 코드를 작성하고 테스트한다.

### 필수 읽기 자료
1. **[코딩 표준](../development/coding-conventions.md)** (2시간)
   - 섹션 1-4: 파일 구조, 명명 규칙, 컴포넌트 작성법 (1시간)
   - 섹션 9: 정책 기반 아키텍처 (30분)
   - 섹션 10: Cloud Functions 개발 규칙 (30분)

2. **[스크립트 발견 프로토콜](../development/scripts-discovery.md)** (15분)
   - 테스트 스크립트 작성 전 필독

### 개발 순서
```
Step 1: Backend 구현 (1시간)
  ├─ 1.1 Policy 설정 생성 (Firestore Console)
  │      위치: policy_configs/{도메인}
  │      예: policy_configs/referral
  ├─ 1.2 Service 모듈 작성
  │      위치: functions/services/{도메인}Service.js
  │      예: functions/services/referralService.js
  └─ 1.3 Cloud Functions 라우팅 추가
         위치: functions/index.js (1-2줄만 추가)

Step 2: Frontend 구현 (45분)
  ├─ 2.1 Service 레이어 작성
  │      위치: src/services/{도메인}Service.js
  │      PolicyService 사용: getPolicyConfig('{도메인}')
  ├─ 2.2 UI 컴포넌트 작성
  │      위치: src/components/{카테고리}/{컴포넌트명}.jsx
  └─ 2.3 Page 통합
         위치: src/pages/{페이지명}.jsx

Step 3: 테스트 (15분)
  ├─ 3.1 로컬 테스트 (Firebase Emulators)
  │      $ firebase emulators:start
  ├─ 3.2 기능 검증 (스크립트 사용)
  │      $ npm run test:{테스트명}
  └─ 3.3 Staging 배포 후 재검증
         $ npm run deploy:staging
```

### 코딩 체크리스트

**Backend**:
- [ ] `policy_configs/{도메인}` 문서 생성 (Firestore Console)
- [ ] `functions/services/{도메인}Service.js` 모듈 작성
  - [ ] `getPolicyConfig()` 사용하여 정책 로드
  - [ ] 에러 핸들링 포함 (try-catch)
  - [ ] 로깅 추가 (`console.log`, `console.error`)
- [ ] `functions/index.js`에 1-2줄 라우팅 추가
  - 예: `exports.handleReferral = functions.https.onCall(referral.handleReferral);`
- [ ] Backend 테스트 스크립트 작성 (선택)

**Frontend**:
- [ ] `src/services/{도메인}Service.js` 작성
  - [ ] PolicyService 임포트 및 사용
  - [ ] Cloud Functions 호출 코드 추가
- [ ] UI 컴포넌트 작성 (`src/components/`)
  - [ ] Material 3 Design Tokens 사용 (`var(--md-sys-color-primary)`)
  - [ ] PropTypes 정의 (TypeScript 사용 시 Interface)
- [ ] Page 통합 (`src/pages/`)
  - [ ] Context/Hooks 사용 (상태 관리)
  - [ ] 에러 핸들링 UI (Toast, Alert)

**공통**:
- [ ] 다국어 처리 (`src/locales/`)
  - [ ] `ko.json`, `en.json`에 신규 키 추가
  - [ ] `useTranslation()` Hook 사용
- [ ] **문서 업데이트** ⭐ 신규
  - [ ] Layer 1: `03-implementation/` 폴더에 구현 상세 문서 작성
    - 파일 구조, 주요 함수, API 엔드포인트 명세
  - [ ] Layer 3: PRD 파일에 "## 구현 노트" 섹션 추가
  - [ ] 정책 변경 시: `docs/governance/policies/` 업데이트
  - [ ] 코드 주석에 문서 경로 명시 (예: `// 자세한 설명: docs/feature-hubs/...`)
- [ ] **문서 메타데이터 추가** ⭐ 신규
  - [ ] YAML frontmatter에 `related_docs`, `code_paths`, `last_sync` 추가 (Solution 2 참조)
- [ ] Git Commit
  - [ ] 커밋 메시지 규칙: `feat: Add {기능명} feature`
  - [ ] 예: `feat: Add referral system with credit rewards`
  - [ ] **문서 변경 포함 시**: `docs: Update {문서명} for {기능명}` 추가 커밋 ⭐ 신규

---

## 🚀 배포 및 검증

### Staging 배포
```bash
npm run deploy:staging
```

### Production 배포 (관리자 승인 후)
```bash
npm run deploy
```

### 배포 후 체크리스트

**⭐ Documentation Sync Protocol 최종 검증**:
- [ ] **구조 변경 문서화 완료 확인** (설계 단계에서 확인한 변경 사항)
  - [ ] Firestore 스키마 변경사항: 문서에 명시됨?
  - [ ] Policy 필드 추가: 문서에 명시됨?
  - [ ] API 시그니처 변경: 문서에 명시됨?
  - [ ] 참고: [documentation-sync-protocol.md](../development/documentation-sync-protocol.md) "Step 1: 검증" 섹션

**배포 프로세스**:
- [ ] Firestore 정책 설정 Production 동기화
  - Staging에서 테스트된 `policy_configs/{도메인}` 문서를 Production으로 복사
- [ ] Analytics 이벤트 추적 확인 (`analytics_events` 컬렉션)
- [ ] 사용자 피드백 모니터링 (첫 24시간)

**운영 문서 작성** ⭐ 신규:
- [ ] Layer 1: `04-operations/` 폴더에 모니터링, 알람, 롤백 절차 문서 작성
- [ ] Layer 3: PRD 파일에 "## 운영 체크리스트" 섹션 추가

**문서-코드 싱크 검증** ⭐ 신규:
- [ ] `npm run check:doc-sync` 실행 (수동 검증, Solution 4 구현 후 자동화)
- [ ] Layer 1 문서의 `code_paths`, `last_sync`, `related_docs` 메타데이터 업데이트 확인
- [ ] 모든 구조 변경 사항이 문서에 반영됨 확인

---

## 📚 참고 자료

### 실제 구현 사례 (학습용)
- **Referral System (v2.10)**:
  - PRD: `docs/product/specs/referral-system.md`
  - Backend: `functions/services/referralService.js`
  - Frontend: `src/services/referralService.js`
  - Policy: `policy_configs/referral`

- **Interest Matching (v2.9)**:
  - Feature Hub: `docs/feature-hubs/interest-matching-system/_index.md`
  - Algorithm: `src/utils/matchingScore.js`
  - Data: `src/data/interestsData.js`

### 추가 가이드
- [Backend Patterns](../../../patterns/backend-patterns.md) - 모듈화 패턴 상세
- [Firestore 최적화](../reference/firestore-optimization.md) - 사전 초기화 전략

---

## ❓ 자주 묻는 질문 (FAQ)

**Q1: 정책 설정을 코드에 하드코딩하면 안 되나요?**
A: ❌ 절대 안 됩니다. 정책 변화 시 코드 재배포가 필요하면 Policy-Driven Architecture의 이점이 사라집니다. 반드시 `policy_configs/{도메인}`에 저장하세요.

**Q2: Backend 로직을 `functions/index.js`에 직접 작성해도 되나요?**
A: ❌ 안 됩니다. `index.js`는 200줄 이하로 유지하고 라우팅만 담당합니다. 비즈니스 로직은 `functions/services/`로 분리하세요.

**Q3: 신규 기능 테스트는 어떻게 하나요?**
A: Firebase Emulators로 로컬 테스트 후, Staging 배포로 실제 환경 검증. 필요 시 `scripts/` 디렉토리에 테스트 스크립트 작성 (Scripts Discovery Protocol 참조).

**Q4: Layer 1과 Layer 3 중 어디에 문서를 작성해야 하나요?** ⭐ 신규
A: 복잡도 평가 체크리스트 사용. 3개 질문 중 3개 이상 Yes → Layer 1 (Feature Hub), 미만 → Layer 3 (Simple Spec). 불확실하면 Layer 3로 시작 후 필요시 Layer 1로 확장.

**Q5: 코드 수정 시 문서를 항상 업데이트해야 하나요?** ⭐ 신규
A: ✅ 필수입니다. "Boy Scout Rule": 코드 변경 시 관련 문서도 함께 업데이트. Git Pre-commit Hook이 자동으로 경고 (Solution 4 구현 후).

**Q6: 문서 메타데이터는 무엇이고 왜 필요한가요?** ⭐ 신규
A: YAML frontmatter로 문서 간 관계 추적 (`related_docs`, `code_paths`, `last_sync`). 자동화 스크립트가 문서-코드 싱크 불일치를 감지하는 데 사용.

---

## 🤔 "기획/설계 단계에서 막혔을 때" 프로토콜 (Agent Self-Diagnosis)

### 상황: 요구사항 분석 또는 아키텍처 설계 중 막힐 때

**확인 항목** (이 중 1개 이상이 "아직 안 함"이면 더 시도하세요):

```
⚠️ 이 단계를 스킵하면 안 됩니다!

1️⃣ 요구사항 명확화 (10분)
   - [ ] PRD 문서를 끝까지 읽었나?
   - [ ] "필수 기능"과 "선택 기능"을 구분했나?
   - [ ] 비기능 요구사항 확인? (성능, 보안, 확장성)
   - [ ] 사용자 시나리오 3개 이상 정의했나?
   → 명확 안 되면 → "요구사항 불명확"으로 보고

2️⃣ 아키텍처 패턴 검토 (10분)
   - [ ] 기존 유사 기능이 있나? (검색, 학습)
   - [ ] Firestore 컬렉션 구조 참고했나?
      (docs/engineering/guides/reference/backend/firestore-quick-guide.md)
   - [ ] Cloud Functions 패턴 확인했나?
      (docs/engineering/guides/reference/backend/system-architecture-reference.md)
   → 참고 자료 없음 → "아키텍처 패턴 필요"로 보고

3️⃣ 정책 설정 항목 식별 (5분)
   - [ ] 동적으로 변경할 값이 뭔가? (금액, 임계값, 조건)
   - [ ] 예: Credit 금액, Strike 임계값, Premium Tier 조건
   - [ ] policy_configs/{도메인} 구조 설계했나?
   → 명확 안 되면 → "정책 설정 스콥 불명확"으로 보고

4️⃣ 기술 스택 결정 (5분)
   - [ ] Frontend 기술: React Hooks? Context? 상태 관리?
   - [ ] Backend 기술: Cloud Functions? Firestore Triggers? 스케줄된 함수?
   - [ ] 외부 라이브러리 필요? (승인 필요함)
   → 결정 못 함 → "기술 스택 선택 필요"로 보고

5️⃣ 제약사항 및 의존성 검토 (5분)
   - [ ] 시간 제약? (개발 기한, 배포 일정)
   - [ ] 리소스 제약? (팀 규모, 기술 수준)
   - [ ] 다른 기능과의 의존성? (선행 완료 필요?)
   - [ ] 보안/규정 제약? (데이터 보호, 감시)
   → 확인 못 함 → "제약사항 질의 필요"로 보고
```

### 만약 위의 5단계를 모두 했는데도 막혔다면?

**정직하게 보고하세요. 이게 전문가의 방식입니다:**

```markdown
## 🤔 기획/설계 진단 보고서

### 기능
- 이름: [기능명]
- 목표: [한 문장 목표]

### 시도한 것 (✓ 완료)
- ✓ PRD 분석 (이해한 것 / 불명확한 것)
- ✓ 아키텍처 패턴 검토 (참고한 문서)
- ✓ 정책 설정 식별 (동적 값 목록)
- ✓ 기술 스택 검토 (선택한 스택)
- ✓ 제약사항 확인 (발견한 제약)

### 발견한 것
1. **요구사항**:
   - 명확한 것: [항목1, 항목2]
   - 불명확한 것: [항목3] (왜 불명확한지 설명)

2. **아키텍처 후보**:
   - Option A: [개요]
   - Option B: [개요]
   - 추천: Option A (이유: [근거])

3. **의문사항**:
   - Q1: [질문1]
   - Q2: [질문2]

### 내 질문
1. [질문1]
2. [질문2]
```

**이렇게 보고하면:**
- ✅ 사용자가 당신의 진행 상황을 알 수 있음
- ✅ 사용자가 "이 부분을 선택해" 라고 구체적 지시 가능
- ✅ 아키텍처 옵션 중 최적 선택을 함께 결정 가능

---

### ❌ 하지 말아야 할 것

```
❌ 나쁜 보고:
"뭘 해야 할지 모르겠어요. 어떤 기술 쓸까요?"
→ 사용자: "뭘 시도했어?" (답답함)

✅ 좋은 보고:
"이렇게 분석했는데 불명확한 부분이 있어요:
 - 요구사항: 1-4번은 명확한데 5번이 애매
 - 기술: Option A/B 중 A가 낫지만 확신 없음
 - 질문: [구체적 질문 2-3개]"
→ 사용자: "그럼 A로 진행하고, 5번은 이렇게..." (명확함)
```

---

## 💡 모든 역할에 적용되는 "막혔을 때" 프로토콜

이 프로토콜은 **신규 개발뿐만 아니라 모든 역할(버그 수정, 리팩토링, 테스트, 문서화, PR 검토)에 동일하게 적용됩니다:**

- **버그 수정**: [bug-fix.md의 "답을 못 찾았을 때" 프로토콜](./bug-fix.md#🤔-답을-못-찾았을-때-프로토콜-agent-self-diagnosis) 참고
- **리팩토링**: [refactoring.md의 "리팩토링 대상을 못 찾을 때" 프로토콜](./refactoring.md) 참고 (곧 추가 예정)
- **테스트**: [testing.md의 "테스트 전략을 못 짤 때" 프로토콜](./testing.md) 참고 (곧 추가 예정)
- **문서화**: [documentation.md의 "뭘 문서화할지 모를 때" 프로토콜](./documentation.md) 참고 (곧 추가 예정)
- **PR 검토**: [pr-deployment.md의 "PR 검토 기준이 모호할 때" 프로토콜](./pr-deployment.md) 참고 (곧 추가 예정)

**핵심 원칙**: "모르는 것을 인정하고, 시도한 것을 보고하고, 구체적으로 질문하세요."

---

**다음 단계**: 개발 완료 후 [배포 절차](../deployment/procedure.md) 문서를 참조하여 Production 배포를 진행하세요.
