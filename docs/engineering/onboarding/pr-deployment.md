# PR 검토 & 배포 에이전트 (PR Review & Deployment Agent)

> **대상**: 완성된 코드를 검토하고 Production/Staging에 배포하는 에이전트
> **소요 시간**: 15분 (검토 10분 + 배포 5분)
> **난이도**: ⭐⭐ (중간)

---

## 🎯 이 가이드를 읽어야 하는 경우

- [ ] 신규 기능 개발 완료 후 배포
- [ ] 버그 수정 완료 후 Staging/Production 배포
- [ ] 리팩토링 완료 후 안전한 배포
- [ ] 코드 검토 및 품질 확인
- [ ] Git 브랜치 병합 및 PR 생성

**읽지 않아도 되는 경우**: 코드 작성 중, 로컬 테스트만 필요한 경우

---

## ⚡ Quick Start (15분 체크리스트)

### Phase 1: 코드 검토 (10분)

#### 1. 브랜치 및 파일 확인 (2분)
```bash
# 현재 브랜치 확인
git branch

# 변경된 파일 목록
git status

# 변경 내용 요약
git diff master...HEAD --stat
```

**체크포인트**:
- [ ] 올바른 브랜치에 있는가? (`feature/*`, `hotfix/*`, `refactor/*`)
- [ ] 변경된 파일이 예상과 일치하는가?
- [ ] 불필요한 파일 변경이 없는가? (예: `.env`, `node_modules/`)

#### 2. 코드 품질 검토 (5분)

**필수 체크리스트**:

##### 구조 변경 감지 ⚠️
- [ ] **구조 변경 감지**: DB 스키마 / Firestore 컬렉션 / API 파라미터 / Cloud Functions 시그니처 변경?
  - YES → [documentation-sync-protocol.md](../development/documentation-sync-protocol.md) 참조 (문서 검토/업데이트 필수)
  - NO → 바로 Policy-Driven Architecture 검토 진행

##### Policy-Driven Architecture 준수 ✅
- [ ] 동적 설정이 `policy_configs/{도메인}`에 있는가?
- [ ] 하드코딩된 정책 값이 없는가?
- [ ] `policyService.getPolicyConfig()` 사용하는가?

##### 보안 (Security) 🛡️
- [ ] 인증 체크가 있는가? (`if (!request.auth)`)
- [ ] 권한 확인이 있는가? (Admin 전용 함수)
- [ ] 민감 정보 로깅이 없는가? (비밀번호, 토큰)
- [ ] SQL Injection, XSS 취약점이 없는가?

##### 성능 (Performance) ⚡
- [ ] N+1 쿼리 문제가 없는가?
- [ ] 불필요한 Firestore 읽기/쓰기가 없는가?
- [ ] 무한 루프 가능성이 없는가?
- [ ] 대용량 데이터 처리 시 페이징을 사용하는가?

##### 테스트 커버리지 📊
```bash
# Backend 테스트 (Jest)
cd functions
npm test -- --coverage

# Frontend 테스트 (Vitest)
npm run test
```
- [ ] Critical Path 테스트 커버리지 >80%
- [ ] 모든 테스트가 통과하는가?

##### 코딩 컨벤션 📝
- [ ] [코딩 표준](../development/coding-conventions.md) 준수
- [ ] 일관된 네이밍 (`camelCase`, `PascalCase`)
- [ ] 적절한 주석 (복잡한 로직만)
- [ ] ESLint 에러가 없는가?

```bash
# Lint 체크
npm run lint
```

#### 3. 문서 업데이트 확인 (3분)
- [ ] CLAUDE.md 업데이트 (주요 변경 시)
- [ ] README.md 업데이트 (새 명령어 추가 시)
- [ ] PRD/기술 문서 업데이트 (새 기능 시)
- [ ] API 문서 (JSDoc) 작성 (Cloud Functions)
- [ ] CHANGELOG.md 업데이트 (선택적)

---

### Phase 2: PR 생성 (3분)

#### 1. Commit 정리
```bash
# Commit 메시지 확인
git log --oneline -10

# 필요 시 Commit 압축 (Squash)
git rebase -i HEAD~3
```

**Good Commit Message**:
```
feat: Add unified moderation system with appeal workflow

- Create moderation_cases collection for all report types
- Implement auto-strike enforcement based on policy
- Add appeal system with 7-day window and compensation
- Add Cloud Functions: createModerationCase, processModerationCase, submitAppeal, processAppeal
- Add Firestore security rules for moderation collections

Closes #123
```

**Commit Message 규칙**:
- `feat:` - 신규 기능
- `fix:` - 버그 수정
- `refactor:` - 리팩토링
- `docs:` - 문서 업데이트
- `test:` - 테스트 추가/수정
- `chore:` - 빌드, 설정 변경

#### 2. PR 템플릿 작성

```markdown
## 📋 변경 내용 요약

{한 줄 요약}

## 🎯 목적

{왜 이 변경이 필요한가?}

## 🔧 주요 변경 사항

- [ ] {변경 1}
- [ ] {변경 2}
- [ ] {변경 3}

## 🧪 테스트 결과

### Backend Tests
- [ ] Unit Tests: ✅ 15/15 passed
- [ ] Coverage: ✅ 92%

### Frontend Tests
- [ ] Component Tests: ✅ 8/8 passed

### Manual Testing
- [ ] Staging 환경 테스트 완료
- [ ] 주요 시나리오 검증 완료

## 📸 스크린샷 (UI 변경 시)

{Before/After 스크린샷}

## 📚 관련 문서

- PRD: `docs/product/features/{feature}.md`
- 기술 문서: `docs/engineering/architecture/{design}.md`

## ⚠️ 배포 시 주의사항

- [ ] Firestore Security Rules 먼저 배포
- [ ] Policy 초기화 스크립트 실행: `node scripts/init-moderation-policy.js`
- [ ] Cloud Functions 배포 순서: 의존성 함수 먼저

## ✅ 검토 완료 체크리스트

- [ ] Policy-Driven Architecture 준수
- [ ] 보안 검토 완료
- [ ] 성능 이슈 없음
- [ ] 테스트 커버리지 >80%
- [ ] 문서 업데이트 완료
- [ ] Lint 에러 없음
```

---

### Phase 3: 배포 전략 결정 (2분)

#### 🚨 필수: 사용자에게 배포 환경 질문

**에이전트 행동**: Phase 2 완료 후, **반드시** 사용자에게 다음 질문을 출력하세요:

```
✅ 코드 검토 및 PR 준비 완료

배포 환경을 선택해주세요:

| 번호 | 배포 유형 | 대상 환경 | 프로세스 | 사용 시기 |
|------|----------|----------|---------|---------|
| **1** | **일반 배포** | Staging → Production | 테스트 후 승인 | 신규 기능, 리팩토링 |
| **2** | **Hotfix** | Production 직접 | 최소 검증만 | 긴급 장애, 보안 패치 |
| **3** | **실험 배포** | Staging 전용 | 승인 불필요 | A/B 테스트, PoC |

번호를 입력해주세요 (1-3):
```

**사용자 입력 대기** → 배포 유형 선택 → 해당 배포 가이드 실행

---

#### 배포 유형별 가이드

| 배포 유형 | 대상 환경 | 승인 필요 | 롤백 전략 |
|----------|----------|---------|---------|
| **일반 배포** | Staging → Production | 테스트 후 승인 | Git Revert |
| **Hotfix** | Production 직접 | 최소 검증만 | 우선순위 최상 |
| **실험 배포** | Staging 전용 | 불필요 | 삭제만 |

#### 1. 일반 배포 (Feature, Refactor)

**프로세스**:
```
1. Staging 배포
   ↓
2. Staging 테스트 (1-3일)
   ↓
3. 사용자 승인
   ↓
4. Production 배포
```

**명령어**:
```bash
# Step 1: Staging 배포
npm run deploy:staging

# Step 2: Staging 테스트
# - 수동 테스트 시나리오 실행
# - QA 스크립트 실행: npm run test:*

# Step 3: Production 배포 (승인 후)
npm run deploy
```

#### 2. Hotfix 배포 (긴급 버그)

**프로세스**:
```
1. 최소 로컬 테스트
   ↓
2. Production 즉시 배포
   ↓
3. 모니터링 (24시간)
```

**명령어**:
```bash
# 로컬 테스트
npm run dev
# 버그 재현 → 수정 확인

# Production 즉시 배포
npm run deploy

# 모니터링
firebase functions:log --only {functionName}
```

**Hotfix 조건**:
- ✅ Production 장애 발생 중
- ✅ 사용자 영향 심각 (결제, 인증 등)
- ✅ 데이터 손실 위험
- ❌ 사소한 UI 버그 (일반 배포 권장)

#### 3. 실험 배포 (A/B 테스트, PoC)

**프로세스**:
```
1. Staging 전용 배포
   ↓
2. 실험 기간 (1-2주)
   ↓
3. 결과 분석 → Production 결정
```

**명령어**:
```bash
# Staging 전용 배포
npm run deploy:staging

# 실험 종료 후 삭제 또는 Production 배포
```

---

## 🚀 배포 실행 가이드

### 1. Staging 배포

```bash
# 전체 배포 (Frontend + Functions)
npm run deploy:staging

# Functions만 배포
firebase use staging
firebase deploy --only functions

# Firestore Rules만 배포
firebase deploy --only firestore:rules

# Storage Rules만 배포
firebase deploy --only storage
```

**배포 후 확인**:
- [ ] Functions 로그 확인: `firebase functions:log`
- [ ] Firestore Console에서 데이터 확인
- [ ] Frontend URL 접속: `https://{project}-staging.web.app`
- [ ] 주요 기능 수동 테스트

### 2. Production 배포

**⚠️ 주의사항**:
- **백업 먼저**: Firestore Export (중요 컬렉션)
- **점진적 배포**: Functions → Rules → Frontend 순서
- **모니터링 준비**: 에러 알림 설정 확인

```bash
# Step 1: 백업 (선택적, 중요 변경 시)
# Firestore Console → Export

# Step 2: Functions 배포
firebase use production
firebase deploy --only functions

# Step 3: 로그 모니터링 (1-5분)
firebase functions:log --only {새로운함수명}

# Step 4: Rules 배포 (Functions 정상 확인 후)
firebase deploy --only firestore:rules

# Step 5: Frontend 배포 (모든 Backend 정상 확인 후)
npm run deploy
```

**배포 후 모니터링 (24시간)**:
```bash
# 실시간 로그
firebase functions:log --follow

# 에러만 필터링
firebase functions:log --only {functionName} | grep ERROR

# Performance Monitoring
# Firebase Console → Performance 탭 확인
```

---

## 🔄 롤백 (Rollback) 가이드

### 언제 롤백하는가?

- ✅ Production 에러율 급증 (>5%)
- ✅ 주요 기능 장애 발생
- ✅ 데이터 손실 위험 발견
- ❌ 사소한 UI 버그 (Hotfix로 수정 권장)

### 롤백 방법

#### 1. Git Revert (권장)

```bash
# 1. 문제 Commit 확인
git log --oneline -10

# 2. Revert Commit 생성
git revert {commit-hash}

# 3. 즉시 배포
npm run deploy
```

**장점**: 변경 이력 보존, 안전함
**단점**: 새로운 Commit 생성

#### 2. Git Reset (긴급 상황만)

```bash
# ⚠️ 위험: 이전 Commit으로 강제 되돌림

# 1. 이전 안정 버전 확인
git log --oneline -10

# 2. Hard Reset
git reset --hard {이전-안정-commit-hash}

# 3. Force Push
git push origin master --force

# 4. 즉시 배포
npm run deploy
```

**장점**: 빠름
**단점**: Commit 이력 삭제, 위험함 (팀원과 충돌 가능)

#### 3. Functions 개별 롤백

```bash
# 특정 Functions만 이전 버전으로
firebase functions:delete {functionName}
git checkout {이전-commit} -- functions/src/{file}.js
firebase deploy --only functions:{functionName}
```

---

## 📊 배포 체크리스트 (종합)

### 배포 전 (Pre-Deployment)

#### 코드 품질
- [ ] Policy-Driven Architecture 준수
- [ ] 보안 검토 완료 (인증, 권한, XSS, SQL Injection)
- [ ] 성능 이슈 없음 (N+1 쿼리, 무한 루프)
- [ ] 테스트 커버리지 >80%
- [ ] Lint 에러 없음

#### 문서
- [ ] PRD/기술 문서 업데이트
- [ ] API 문서 (JSDoc) 작성
- [ ] CLAUDE.md 업데이트 (주요 변경 시)
- [ ] README.md 업데이트 (새 명령어 시)

#### Git
- [ ] Commit 메시지 명확 (`feat:`, `fix:`, `refactor:`)
- [ ] 불필요한 파일 제외 (`.env`, `node_modules/`)
- [ ] PR 템플릿 작성 완료

### 배포 중 (During Deployment)

#### Staging
- [ ] Functions 배포 성공
- [ ] Rules 배포 성공
- [ ] Frontend 빌드 성공
- [ ] 초기화 스크립트 실행 (필요 시)

#### Production
- [ ] 백업 완료 (중요 변경 시)
- [ ] 점진적 배포 (Functions → Rules → Frontend)
- [ ] 로그 모니터링 (1-5분)

### 배포 후 (Post-Deployment)

#### 검증
- [ ] 주요 기능 수동 테스트
- [ ] QA 스크립트 실행
- [ ] 에러 로그 확인 (24시간)
- [ ] Performance Monitoring 확인

#### 커뮤니케이션
- [ ] 팀원에게 배포 완료 알림
- [ ] 사용자에게 업데이트 안내 (주요 기능 시)
- [ ] 문서 링크 공유

---

## 🚨 일반적인 배포 실수 및 해결

### 실수 1: Functions 배포 실패 - "Module not found"

**원인**: `functions/index.js`에 import 누락

**해결**:
```javascript
// functions/index.js
const moderationFunctions = require('./src/moderation/index');
Object.assign(exports, moderationFunctions);
```

### 실수 2: Rules 배포 후 "permission-denied"

**원인**: Security Rules 문법 오류 또는 과도한 제약

**해결**:
```bash
# Rules 시뮬레이터로 테스트
firebase emulators:start --only firestore

# Rules 롤백
git checkout HEAD~1 -- firestore.rules
firebase deploy --only firestore:rules
```

### 실수 3: Frontend 빌드 실패 - "Memory limit"

**원인**: Vite 빌드 시 메모리 부족

**해결**:
```bash
# Node 메모리 증가
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### 실수 4: Policy 초기화 스크립트 미실행

**증상**: "Policy not found" 경고

**해결**:
```bash
# Staging
firebase use staging
node scripts/init-moderation-policy.js

# Production
firebase use production
node scripts/init-moderation-policy.js
```

---

## 📚 참고 자료

### 필독 문서
- [신규 기능 개발 워크플로](01-new-feature-workflow.md) - 기획 → 계획 → 코딩 → **배포**
- [코딩 표준](../development/coding-conventions.md) - 코드 품질 기준
- [Policy-Driven Architecture](../design/policy-driven.md) - 정책 기반 설계 원칙

### 배포 관련 문서
- Firebase 공식 문서: https://firebase.google.com/docs/cli
- Git Workflow: https://guides.github.com/introduction/flow/

---

## 🤔 PR 검토 기준이 모호할 때 프로토콜 (Agent Self-Diagnosis)

### 상황: PR 코드 검토 중 기준을 모를 때

**확인 항목** (이 중 1개 이상이 "아직 안 함"이면 더 시도하세요):

```
⚠️ 이 단계를 스킵하면 안 됩니다!

1️⃣ 변경 범위 파악 (3분)
   - [ ] Git diff로 변경된 파일 목록 확인?
   - [ ] 변경 라인 수 파악? (50줄 이상 = 주의깊게 검토)
   - [ ] 이 PR이 신규 기능? 버그 수정? 리팩토링? 문서? 어디?
   → 범위 불명확 → Git 로그와 PR 제목 다시 확인

2️⃣ 코드 품질 기준 검토 (3분)
   - [ ] 코딩 표준 문서 읽음? (docs/engineering/guides/development/coding-conventions.md)
   - [ ] Policy-Driven Architecture 가이드 확인? (policy_configs/ 사용하는가?)
   - [ ] 테스트 커버리지 기준 알고 있나? (>80% 목표)
   → 기준 불명확 → "필수 체크리스트" 섹션 다시 읽기

3️⃣ 구조 변경 감지 (3분)
   - [ ] DB 스키마 변경 있나? (Firestore 컬렉션/필드 추가/수정)
   - [ ] API 파라미터 변경 있나? (Cloud Functions 시그니처 변경)
   - [ ] 구조 변경 발견 시: documentation-sync-protocol 확인했나?
   → 구조 변경 놓침 → documentation-sync-protocol.md 읽기

4️⃣ 관련 문서 검토 (3분)
   - [ ] 이 PR의 PRD/기술 문서 읽음?
   - [ ] 배포 시 주의사항 문서에 있나?
   - [ ] 보안/성능 가이드 확인했나?
   → 문서 없음 → PR 설명과 코드에서 의도 파악

5️⃣ 유사 PR 비교 (2분)
   - [ ] 비슷한 기능의 기존 PR이 있나? (Git 히스토리)
   - [ ] 그 PR에서 어떻게 검토했나?
   - [ ] 일관성 있게 검토하고 있나?
```

### 만약 위의 5단계를 모두 했는데도 모호하다면?

**정직하게 질문하세요. 이게 전문가의 방식입니다:**

```markdown
## 🤔 PR 검토 기준 진단 보고서

### 현황
- PR 제목: [PR 제목]
- 변경 범위: [신규 기능/버그 수정/리팩토링]
- 변경 파일 수: [N개 파일, 총 M줄]

### 검토한 것 (✓ 완료)
- ✓ Git diff 확인 (변경 파일 목록, 라인 수)
- ✓ 코딩 표준 기준 검토 (Policy-Driven 준수 확인)
- ✓ 구조 변경 감지 (없음 = 단순 로직 변경 PR)
- ✓ 관련 문서 검토 (PRD, 기술 가이드 읽음)

### 발견한 것
1. **변경 사항 요약**:
   - File A: 함수 로직 수정 (50줄)
   - File B: 성능 최적화 (캐싱 추가, 20줄)
   - File C: JSDoc 추가 (API 문서)

2. **코드 품질 평가**:
   - Policy-Driven: ✅ policy_configs/ 사용 확인
   - 보안: ✅ 인증 체크, 권한 확인 있음
   - 성능: ⚠️ Firestore 쿼리 최적화 확인 필요
   - 테스트: ⚠️ 커버리지 78% (목표 80%)

3. **구조 변경**:
   - DB 스키마: ❌ 없음
   - API 시그니처: ❌ 없음 (Backward Compatible)
   - 문서 필요: ❌ 불필요

4. **의심 영역** (100% 확실 아님):
   - A. 성능 최적화가 정말 필요한가? (벤치마크 있나?)
   - B. 테스트 커버리지 78%를 통과시켜야 하나?
   - C. 다른 팀원들은 어떻게 검토하나?

### 내 질문
1. 성능 최적화 부분(File B)이 반드시 필요한가? 아니면 scope out?
2. 테스트 커버리지 78%를 승인할 수 있나?
3. 이 정도 수준의 코드 품질이 기준에 맞나?
```

**이렇게 질문하면:**
- ✅ 당신이 검토한 내용이 명확함
- ✅ 사용자/리뷰어가 "커버리지는 통과, 성능 부분은 리팩토링 필요"라고 구체적으로 피드백 가능
- ✅ 전문가처럼 보임 (vs "이게 맞는 기준인지 모르겠어요")

---

## ❓ 자주 묻는 질문 (FAQ)

**Q1: Staging과 Production 배포 차이가 무엇인가요?**
A: Staging은 테스트 환경 (자유롭게 실험 가능), Production은 실제 사용자 환경 (신중하게 배포). 항상 Staging → Production 순서로 배포하세요.

**Q2: Hotfix는 언제 사용하나요?**
A: Production 장애 발생 시만 사용. 사소한 버그는 일반 배포 프로세스를 따르세요.

**Q3: 배포 후 에러가 발생하면 어떻게 하나요?**
A:
1. 즉시 롤백 (`git revert` 권장)
2. 에러 로그 분석 (`firebase functions:log`)
3. 로컬에서 재현 및 수정
4. Staging 재배포 → 테스트 → Production 재배포

**Q4: PR을 생성하지 않고 바로 배포해도 되나요?**
A: ❌ 안 됩니다. PR은 코드 품질 관문입니다. 단, Hotfix는 예외적으로 배포 후 PR 생성 가능.

**Q5: 모든 배포를 24시간 모니터링해야 하나요?**
A: 중요 기능 변경 시에만 필수. 사소한 UI 수정은 배포 직후 1시간만 모니터링.

---

**다음 단계**: 배포 완료 후 → 팀원 알림 → 문서 업데이트 → 다음 기능 기획 시작.
