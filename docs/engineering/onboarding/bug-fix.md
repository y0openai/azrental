# 버그 수정 에이전트 (Bug Fix Agent)

> **대상**: 기존 기능의 버그를 빠르게 수정하는 에이전트
> **소요 시간**: 1분 (Quick Reference)
> **난이도**: ⭐ (낮음)

---

## 🎯 이 가이드를 읽어야 하는 경우

- [ ] 기존 기능의 명확한 버그 수정 (예: "Submit 버튼 클릭 시 오류", "잘못된 계산 로직")
- [ ] 긴급 Hotfix 배포 필요
- [ ] 사용자 신고로 확인된 문제 해결

**읽지 않아도 되는 경우**: 신규 기능 개발, 대규모 리팩토링, 아키텍처 변경

---

## ⚡ Quick Start (1분 체크리스트)

### 1. 버그 재현 (Reproduction)
- [ ] 버그 발생 조건 파악 (사용자 Role, 환경, 입력값)
- [ ] 로컬 또는 Staging에서 재현 확인
- [ ] 에러 로그 확인 (Browser Console, Firebase Console)

### 2. 원인 분석 (Root Cause)
- [ ] 관련 파일 식별 (Frontend: `src/`, Backend: `functions/`)
- [ ] 코드 읽기 및 로직 추적
- [ ] 정책 설정 확인 (`policy_configs/` 문서가 원인일 수 있음)
- [ ] **⭐ 구조 변경 확인**: DB 스키마 / 설정 / API 파라미터 변경?
  - YES → [documentation-sync-protocol.md](../development/documentation-sync-protocol.md) 참조
  - NO → 바로 Step 3 진행

### 3. 수정 (Fix)
- [ ] 최소 변경 원칙 (Minimal Change)
- [ ] 기존 코딩 스타일 유지
- [ ] 주석 추가 (왜 이 수정이 필요한지)

### 4. 테스트 (Validation)
- [ ] 로컬 테스트 (`npm run dev` or `firebase emulators:start`)
- [ ] Staging 배포 후 재검증 (`npm run deploy:staging`)
- [ ] 회귀 테스트 (기존 기능 영향 없는지 확인)

### 5. 배포 (Deployment)
- [ ] Git Commit: `fix: Fix {버그 설명}`
  - 예: `fix: Fix submit button error on request page`
- [ ] Production 배포: `npm run deploy` (긴급 시)
- [ ] 모니터링 (배포 후 1시간)

---

## 📖 핵심 참고 자료 (필요 시)

### Frontend 버그
- **파일 위치**: `src/pages/`, `src/components/`, `src/services/`
- **로그 확인**: Browser DevTools Console
- **참고 문서**: [코딩 표준 - 섹션 1-4](../development/coding-conventions.md#1-파일-구조-및-조직)

### Backend 버그
- **파일 위치**: `functions/services/`, `functions/index.js`
- **로그 확인**: Firebase Console → Functions → Logs
- **참고 문서**: [코딩 표준 - 섹션 10](../development/coding-conventions.md#10-cloud-functions-개발-규칙-backend)

### 정책 설정 관련 버그
- **위치**: Firestore Console → `policy_configs/` 컬렉션
- **서비스**: `src/services/policyService.js` 또는 `functions/services/policyService.js`
- **참고 문서**: [정책 기반 아키텍처 - 섹션 4](../design/policy-driven.md#4-실전-구현-가이드)

---

## 🚨 긴급 배포 프로세스 (Hotfix)

### Critical 버그 (서비스 장애)
```bash
# 1. 긴급 수정
git checkout -b hotfix/critical-bug-fix

# 2. 수정 및 테스트 (최소 5분)
npm run dev  # 로컬 검증

# 3. Staging 배포 (선택적, 시간 여유 있을 때)
npm run deploy:staging

# 4. Production 배포 (즉시)
npm run deploy

# 5. 모니터링
# Firebase Console → Functions → Logs
# Firestore Console → 데이터 확인
```

### High Priority 버그 (기능 오류)
```bash
# 1. 수정
git checkout -b fix/high-priority-bug

# 2. 테스트
npm run dev
npm run deploy:staging  # 필수

# 3. 검증 후 Production 배포 (1-2시간 후)
npm run deploy
```

---

## 🔍 디버깅 팁

### Frontend 디버깅
```javascript
// 1. Console 로그 추가
console.log('🐛 [DEBUG] State:', state);
console.error('❌ [ERROR] API Call Failed:', error);

// 2. React DevTools 사용
// Chrome Extension: React Developer Tools

// 3. Network 탭 확인
// DevTools → Network → Filter: XHR/Fetch
```

### Backend 디버깅
```javascript
// 1. 로깅 추가 (functions/)
console.log('🔍 [DEBUG] Input:', data);
console.error('❌ [ERROR]:', error.message);

// 2. Firebase Emulator 사용
// $ firebase emulators:start
// Emulator UI: http://localhost:4000

// 3. Cloud Functions 로그 확인
// Firebase Console → Functions → {함수명} → Logs
```

---

## ⚠️ 주의 사항

### ❌ 하지 말아야 할 것
1. **정책 설정 하드코딩**: `policy_configs/` 대신 코드에 직접 값을 넣지 마세요.
2. **대규모 리팩토링**: 버그 수정과 리팩토링을 동시에 하지 마세요.
3. **테스트 생략**: 긴급 배포라도 최소 로컬 테스트는 필수입니다.
4. **주석 없는 Workaround**: 임시 해결책이면 `// TODO: Fix properly` 주석 추가.

### ✅ 해야 할 것
1. **최소 변경**: 버그 수정에 필요한 최소한의 코드만 변경.
2. **회귀 테스트**: 기존 기능에 영향 없는지 확인.
3. **로그 정리**: 배포 전 디버깅 로그 제거 (Production 불필요).
4. **문서 업데이트**: 정책 변경 시 관련 문서 동기화.

---

## 📚 관련 가이드

- **정책 설정 수정**: [정책 기반 아키텍처](../design/policy-driven.md)
- **배포 절차**: [배포 가이드](../deployment/procedure.md)
- **코딩 규칙**: [코딩 표준](../development/coding-conventions.md)

---

## 🤔 "답을 못 찾았을 때" 프로토콜 (Agent Self-Diagnosis)

### 상황: 원인 분석 단계에서 막힐 때

**확인 항목** (이 중 1개 이상이 "아직 안 함"이면 더 시도하세요):

```
⚠️ 이 단계를 스킵하면 안 됩니다!

1️⃣ 기본 재현 (5분)
   - [ ] 로컬 `npm run dev`에서 재현 가능?
   - [ ] Staging에서 재현 가능?
   - [ ] 어떤 상황에서만 발생? (Role, 환경, 입력값)
   → 못 재현 → "버그 재현 불가"로 보고

2️⃣ 로그 확인 (3분)
   - [ ] Browser DevTools Console 확인? (Ctrl+Shift+K)
   - [ ] Firebase Console → Functions → Logs 확인?
   - [ ] 에러 메시지 전체 내용 캡처?
   → 로그 없음 → "에러가 조용히 발생" 가능성

3️⃣ 코드 추적 (5분)
   - [ ] 해당 페이지/API 코드 읽음?
   - [ ] 관련 함수 정의 위치 찾음?
   - [ ] 데이터 흐름 그려봤나? (Input → Process → Output)
   → 코드 읽기만 했고 실행 흐름 안 봤다면 이건 부족

4️⃣ 정책/설정 확인 (2분)
   - [ ] policy_configs/ 컬렉션 확인?
   - [ ] 환경 변수 (.env.example) 확인?
   → 동적 설정이 문제일 수도 있음

5️⃣ 컨텍스트 검색 (3분)
   - [ ] 같은 버그가 이미 문서에 나와있나? (Search)
   - [ ] 비슷한 코드가 다른 곳에도 있나?
   - [ ] 관련 PR/Commit 히스토리 있나?
```

### 만약 위의 5단계를 모두 했는데도 못 찾았다면?

**정직하게 보고하세요. 이게 전문가의 방식입니다:**

```markdown
## 🤔 버그 진단 보고서

### 버그
- 설명: [버그 설명]
- 재현: [재현 가능? 조건?]

### 시도한 것 (✓ 완료)
- ✓ 로컬 재현 (성공/실패)
- ✓ Firebase 로그 확인 (내용 요약)
- ✓ 코드 분석 (대상 파일 3개: src/pages/X.jsx, src/services/Y.js, functions/index.js)
- ✓ 정책 설정 확인 (policy_configs/domain 검토)

### 발견한 것
1. **로그 내용**:
   ```
   [ERROR] 구체적인 에러 메시지
   ```

2. **코드 현황**:
   - 파일: `src/pages/Admin.jsx:45-50`
   - 내용: fetchPolicy() 호출
   - 응답: undefined 반환

3. **의심 영역** (100% 확실 아님):
   - A. policyService의 캐시 문제?
   - B. Firestore 쿼리가 데이터를 못 찾는 건가?
   - C. 정책 버전 mismatch?

### 내 질문
1. 어느 의심 영역부터 파봐야 할까?
2. 이 버그가 특정 환경(Staging vs Prod)에서만 나타나나?
3. 관련 Cloud Function이 최근에 변경됐나?
```

**이렇게 보고하면:**
- ✅ 사용자가 당신의 진행 상황을 알 수 있음
- ✅ 사용자가 "아, 이 부분을 놓쳤네"라고 가이드 가능
- ✅ 전문가처럼 보임 ("당신이 뭘 했는지, 못 했는지 명확함")

---

### ❌ 하지 말아야 할 것

```
❌ 나쁜 보고:
"원인을 못 찾았어요. 뭐 하면 좋을까요?"
→ 사용자: "뭘 시도했어?" (답답함)

✅ 좋은 보고:
"이렇게 시도했는데 막혔어요:
 - 로그: [내용]
 - 코드: [분석]
 - 의심: A/B/C 중 하나인데 확실 아님"
→ 사용자: "그럼 C부터 해봐" (명확함)
```

---

## ❓ 자주 묻는 질문 (FAQ)

**Q1: 버그가 정책 설정 때문인 것 같은데, 코드를 수정해야 하나요?**
A: ❌ 정책 설정 문제는 Firestore Console에서 `policy_configs/` 문서를 수정하세요. 코드 재배포 불필요.

**Q2: Hotfix 브랜치를 main/master에 머지해야 하나요?**
A: ✅ 네. Hotfix 배포 후 반드시 main 브랜치에 머지하여 다음 배포 시 포함되도록 하세요.

**Q3: 버그 원인을 모르겠는데 어떻게 하나요?**
A: 위의 "답을 못 찾았을 때 프로토콜"을 따르세요. 5단계를 모두 했는데도 못 찾았다면, **진단 보고서**를 작성해서 사용자에게 질문하세요.

---

**다음 단계**: 수정 완료 후 [배포 절차](../deployment/procedure.md)를 따라 배포하세요.
