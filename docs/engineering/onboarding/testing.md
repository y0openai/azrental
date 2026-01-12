# 테스트 에이전트 (Testing Agent)

> **대상**: 품질 보증, 테스트 자동화, QA 절차를 담당하는 에이전트
> **소요 시간**: 2분 (Quick Reference)
> **난이도**: ⭐⭐ (중간)

---

## 🎯 이 가이드를 읽어야 하는 경우

- [ ] 신규 기능의 테스트 케이스 작성
- [ ] 기존 테스트 스크립트 실행 및 검증
- [ ] 회귀 테스트 (Regression Test) 수행
- [ ] 테스트 자동화 스크립트 작성
- [ ] QA 체크리스트 실행

**읽지 않아도 되는 경우**: 단순 코드 작성, 긴급 버그 수정 (테스트는 선택적)

---

## ⚡ Quick Start (2분 체크리스트)

### 1. 테스트 범위 정의 (Scope)
- [ ] 테스트 대상 기능 식별 (Frontend? Backend? Both?)
- [ ] 테스트 유형 선택 (Unit? Integration? E2E?)
- [ ] 성공/실패 기준 정의

### 2. 테스트 환경 설정 (Setup)
- [ ] Firebase Emulators 실행: `firebase emulators:start`
- [ ] Staging 환경 확인 (Production 대신 사용)
- [ ] 테스트 데이터 준비 (스크립트 사용 권장)

### 3. 테스트 실행 (Execution)
- [ ] 기존 스크립트 확인: `npm run` (목록 출력)
- [ ] 스크립트 실행: `npm run test:{테스트명}`
- [ ] 수동 테스트 (UI 검증)

### 4. 결과 검증 (Validation)
- [ ] 테스트 통과 여부 확인
- [ ] 실패 시 로그 분석 (Browser Console, Firebase Logs)
- [ ] 회귀 테스트 (기존 기능 영향 없는지)

### 5. 문서화 (Documentation)
- [ ] 테스트 결과 기록 (Notion, Slack, PR Comment)
- [ ] 신규 테스트 케이스 문서화 (선택적)

---

## 📖 테스트 유형별 가이드

### 1. Frontend 단위 테스트 (Unit Tests) ⭐⭐
**도구**: Vitest + React Testing Library

#### 실행 방법
```bash
npm run test  # 모든 테스트 실행
npm run test -- src/services/creditService.test.js  # 특정 파일만 실행
```

#### 테스트 작성 예시
```javascript
// src/services/creditService.test.js
import { describe, it, expect } from 'vitest';
import { calculateReward } from './creditService';

describe('Credit Service', () => {
  it('should return correct signup bonus', async () => {
    const reward = await calculateReward('signup');
    expect(reward).toBe(50);
  });

  it('should return correct referral reward', async () => {
    const reward = await calculateReward('referral');
    expect(reward).toBe(30);
  });
});
```

**참고 문서**: [코딩 표준 - 섹션 11 (테스트 규칙)](../development/coding-conventions.md#11-테스트-규칙)

---

### 2. Backend 단위 테스트 (Cloud Functions) ⭐⭐⭐
**도구**: Jest + Firebase Test SDK

#### 실행 방법
```bash
npm run test:coverage -- --collectCoverageFrom="depositManagement.js"
```

#### 테스트 작성 예시
```javascript
// functions/services/depositManagement.test.js
const { holdDeposit, releaseDeposit } = require('./depositManagement');
const admin = require('firebase-admin');

describe('Deposit Management', () => {
  it('should hold 5 credits on acceptance', async () => {
    const result = await holdDeposit('crewId123', 5);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(45);  // 50 - 5
  });

  it('should release credits on completion', async () => {
    const result = await releaseDeposit('crewId123', 5);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(50);  // 45 + 5
  });
});
```

**참고 문서**: [Backend Patterns - 섹션 6 (Testing)](../../patterns/backend-patterns.md#6-테스트-전략)

---

### 3. 통합 테스트 (Integration Tests) ⭐⭐⭐
**목표**: Frontend ↔ Backend ↔ Firestore 전체 플로우 검증

#### 스크립트 기반 테스트 (권장)
```bash
# 1. 기존 스크립트 확인 (Scripts Discovery Protocol)
npm run

# 2. 관련 스크립트 실행
npm run test:case8-2        # 3-Strike 테스트 (Part 1)
npm run test:case8-2-part2  # 3-Strike 테스트 (Part 2)
npm run test:case8-5        # Ban 검증

# 3. 커스텀 스크립트 작성 (필요 시)
# scripts/ 디렉토리에 신규 파일 추가
# 참고: docs/engineering/guides/development/scripts-discovery.md
```

#### 수동 통합 테스트 체크리스트
- [ ] **Request Flow**:
  1. Crew가 Experience 요청
  2. Local 수락 (5 credits 예치)
  3. 완료 확인 (credits 해제)
  4. Notification 전송 확인

- [ ] **No-Show Flow**:
  1. Request 생성
  2. No-Show 신고
  3. Strike 부여 확인
  4. Refund 처리 확인

**참고 문서**: [No-Show Testing Guide](../../testing/scenarios/no-show-testing-guide.md)

---

### 4. E2E 테스트 (End-to-End) ⭐
**도구**: Playwright (선택적)

#### 실행 방법
```bash
# Playwright 설치 (최초 1회)
npm install -D @playwright/test

# 테스트 실행
npx playwright test

# UI 모드 실행 (디버깅용)
npx playwright test --ui
```

#### 테스트 작성 예시
```javascript
// tests/e2e/booking-flow.spec.js
import { test, expect } from '@playwright/test';

test('Crew can book an experience', async ({ page }) => {
  // 1. 로그인
  await page.goto('https://{project}-staging.web.app');
  await page.click('text=로그인');
  await page.fill('input[name="email"]', 'crew@test.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // 2. Experience 선택
  await page.click('text=홍대 투어');

  // 3. 예약 요청
  await page.click('text=요청하기');
  await expect(page.locator('text=요청이 전송되었습니다')).toBeVisible();
});
```

---

## 🛠️ 테스트 도구 및 환경

### Firebase Emulators (로컬 테스트)
```bash
# 실행
firebase emulators:start

# UI 접속
http://localhost:4000

# 지원 서비스
- Authentication
- Firestore
- Cloud Functions
- Storage
```

**장점**:
- ✅ Production 데이터 영향 없음
- ✅ 빠른 반복 테스트 (네트워크 지연 없음)
- ✅ 비용 0원

**단점**:
- ❌ 일부 Firebase 기능 미지원 (예: FCM)
- ❌ 실제 환경과 완전히 동일하지 않음

---

### Staging 환경 (실제 환경 테스트)
```bash
# Staging 배포
npm run deploy:staging

# 접속
https://{project}-staging.web.app
```

**장점**:
- ✅ Production과 동일한 환경
- ✅ 모든 Firebase 기능 지원 (FCM, Analytics 등)

**단점**:
- ❌ 네트워크 지연 (테스트 속도 느림)
- ❌ 비용 발생 (Firestore 읽기/쓰기)

---

## 📋 테스트 체크리스트

### 신규 기능 테스트
- [ ] **기능 동작**: 모든 Happy Path 시나리오 통과
- [ ] **에러 처리**: 잘못된 입력, 네트워크 오류 등 Edge Case
- [ ] **성능**: 응답 시간 <2초 (모바일 3G 기준)
- [ ] **UI/UX**: 레이아웃 깨짐 없음, 다국어 지원
- [ ] **접근성**: 스크린 리더, 키보드 탐색
- [ ] **회귀 테스트**: 기존 기능 영향 없음

### 버그 수정 검증
- [ ] **재현 확인**: 버그가 수정 전 재현되는지
- [ ] **수정 확인**: 버그가 수정 후 해결되는지
- [ ] **부작용 확인**: 다른 기능에 영향 없는지

### 리팩토링 검증
- [ ] **동작 동일성**: 리팩토링 전후 동작 동일
- [ ] **성능 개선**: 측정 가능한 성능 향상 (선택적)
- [ ] **코드 품질**: 복잡도 감소, 가독성 향상

---

## 🚨 테스트 실패 시 대응

### 1. 로그 분석
```bash
# Frontend 로그
# Browser DevTools → Console

# Backend 로그
# Firebase Console → Functions → Logs

# Firestore 데이터 확인
# Firebase Console → Firestore → 컬렉션 탐색
```

### 2. 디버깅 전략
- [ ] **재현 가능성**: 로컬 환경에서 재현되는지
- [ ] **입력 검증**: 테스트 데이터가 올바른지
- [ ] **정책 설정**: `policy_configs/` 값이 예상과 일치하는지
- [ ] **의존성 버전**: 패키지 버전 충돌 없는지 (`package.json`)

### 3. 에스컬레이션
- [ ] **팀원 문의**: Slack/Discord에서 도움 요청
- [ ] **이슈 생성**: GitHub Issues에 버그 리포트
- [ ] **문서 확인**: 관련 가이드 재확인

---

## 📚 관련 가이드

- **스크립트 작성**: [Scripts Discovery Protocol](../development/scripts-discovery.md)
- **테스트 규칙**: [코딩 표준 - 섹션 11](../development/coding-conventions.md#11-테스트-규칙)
- **No-Show 테스트**: [No-Show Testing Guide](../../testing/scenarios/no-show-testing-guide.md)

---

## 🤔 테스트 전략을 못 짤 때 프로토콜 (Agent Self-Diagnosis)

### 상황: 테스트 전략 정의 단계에서 막힐 때

**확인 항목** (이 중 1개 이상이 "아직 안 함"이면 더 시도하세요):

```
⚠️ 이 단계를 스킵하면 안 됩니다!

1️⃣ 기능 이해도 확인 (5분)
   - [ ] 테스트할 기능의 코드를 직접 읽음?
   - [ ] Happy Path (성공 케이스)와 Edge Case 3개 이상 식별?
   - [ ] 기능의 입력(Input)과 출력(Output) 정의?
   → 이해 부족 → "기능 분석 문서" 먼저 작성 필요

2️⃣ 테스트 유형 매칭 (3분)
   - [ ] 이 기능이 Frontend/Backend/Both 중 어디?
   - [ ] Unit? Integration? E2E? 중 어떤 테스트 필요?
   - [ ] 기존 테스트 패턴과 비교했나? (같은 기능 이미 테스트된 게 있나?)
   → 유형 결정 안 됨 → "테스트 유형별 가이드" (위의 섹션) 다시 읽기

3️⃣ 테스트 도구 선택 (3분)
   - [ ] Frontend 단위 테스트 → Vitest 사용 가능?
   - [ ] Backend 단위 테스트 → Jest 사용 가능?
   - [ ] 통합 테스트 → 기존 스크립트 활용 가능? (Scripts Discovery)
   - [ ] E2E 테스트 → Playwright 필요한가?
   → 도구 선택 안 됨 → "테스트 도구 및 환경" 섹션 참고

4️⃣ 테스트 환경 준비 (3분)
   - [ ] Firebase Emulators 실행 가능한가? (로컬 테스트용)
   - [ ] Staging 환경 접근 가능한가? (실제 환경 테스트)
   - [ ] 테스트 데이터 준비 스크립트 있나?
   → 환경 부재 → 개발팀에 문의 필요

5️⃣ 성공/실패 기준 정의 (3분)
   - [ ] 이 기능이 "성공"하려면 어떤 결과여야 하나?
   - [ ] 실패 케이스 3개 이상 정의했나? (에러 메시지, 로그 등)
   - [ ] 성능 기준 있나? (응답 시간, 렌더링 속도)
   → 기준 불명확 → "테스트 체크리스트" 섹션 참고
```

### 만약 위의 5단계를 모두 했는데도 못 짰다면?

**정직하게 보고하세요. 이게 전문가의 방식입니다:**

```markdown
## 🤔 테스트 전략 진단 보고서

### 현황
- 테스트 대상 기능: [기능명]
- 테스트 범위: [Frontend/Backend/Both]
- 기대 테스트 유형: [Unit/Integration/E2E]

### 시도한 것 (✓ 완료)
- ✓ 기능 코드 분석 (Happy Path: 1개, Edge Cases: 3개 식별)
- ✓ 테스트 유형 결정 (Integration Test 선택)
- ✓ 테스트 도구 확인 (Jest + Firebase Test SDK 사용 가능)
- ✓ 테스트 환경 점검 (Staging 접근 가능, Emulator 실행 가능)

### 발견한 것
1. **기능 특성**:
   - 입력: RequestID, UserID
   - 출력: Transaction ID, Credits Updated
   - 의존성: Firestore 쓰기, 정책 설정 조회

2. **테스트 유형 분석**:
   - Unit Test: Policy 조회 로직만 테스트 가능
   - Integration Test: Firestore 쓰기까지 포함 (권장)
   - E2E Test: UI 사용자 플로우 테스트 (선택적)

3. **기존 패턴**:
   - 유사 기능: depositManagement.test.js (참고 가능)
   - 테스트 데이터: Firebase Admin SDK로 생성

4. **의심 영역** (100% 확실 아님):
   - A. Policy 설정이 정책 조회 중에 변경되면?
   - B. Firestore 쓰기 실패하면 Rollback 되나?
   - C. 동시 요청 (Race Condition) 처리되나?

### 내 질문
1. A/B/C 중 어떤 Edge Case부터 테스트해야 할까?
2. 이 기능의 테스트 우선순위는 High인가?
3. 기존 depositManagement.test.js와 구조를 같게 해야 할까?
```

**이렇게 보고하면:**
- ✅ 당신의 분석이 명확함
- ✅ 사용자가 "테스트 우선순위 A부터"라고 직관적으로 가이드 가능
- ✅ 전문가처럼 보임 (vs "뭘 테스트해야 할지 모르겠어요")

---

## ❓ 자주 묻는 질문 (FAQ)

**Q1: 모든 기능을 테스트해야 하나요?**
A: ❌ 우선순위에 따라 선택하세요. Critical Path (결제, 인증) → High Impact (검색, 매칭) → Nice-to-Have 순서.

**Q2: 테스트 스크립트를 작성해야 하나요?**
A: ✅ 반복적인 테스트는 스크립트로 자동화하세요. [Scripts Discovery Protocol](../development/scripts-discovery.md) 참조.

**Q3: Staging 테스트 없이 바로 Production 배포해도 되나요?**
A: ❌ 절대 안 됩니다. Staging 검증은 필수입니다 (긴급 Hotfix 제외).

---

**다음 단계**: 테스트 통과 후 [배포 절차](../deployment/procedure.md)를 따라 Production 배포하세요.
