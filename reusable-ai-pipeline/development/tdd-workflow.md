# TDD 워크플로 가이드

> **목적**: 모든 에이전트가 TDD 원칙을 따르도록 안내
> **대상**: 모든 에이전트
> **읽는 시간**: 10분

---

## 📖 필수 읽기

**반드시 먼저 읽어야 할 문서**:

```
docs/engineering/guides/KB.md (76줄, 5분)
```

KB.md는 Kent Beck의 TDD + Tidy First 원칙을 정의합니다.

---

## 🔄 TDD 사이클: Red → Green → Refactor

### Step 1: Red (실패하는 테스트)

```javascript
// 1. 04-TEST-SCENARIOS.md 참조
// 2. 가장 작은 단위의 테스트 작성
// 3. 테스트 실행 → 반드시 실패해야 함

describe('holdDeposit', () => {
  test('should hold 5 credits when request accepted', async () => {
    // Arrange
    const user = await createTestUser({ credits: 10 });

    // Act
    await holdDeposit(user.id, 5);

    // Assert
    const updated = await getUser(user.id);
    expect(updated.availableCredits).toBe(5);  // 10 - 5
    expect(updated.heldCredits).toBe(5);
  });
});
```

```bash
npm run test  # ❌ 실패 확인
```

### Step 2: Green (최소 코드 구현)

```javascript
// 1. 05-IMPLEMENTATION.md 참조
// 2. 테스트를 통과시킬 최소한의 코드만 작성
// 3. 완벽할 필요 없음, 일단 통과시키기

async function holdDeposit(userId, amount) {
  const userRef = db.collection('users').doc(userId);

  await db.runTransaction(async (t) => {
    const doc = await t.get(userRef);
    const current = doc.data();

    t.update(userRef, {
      availableCredits: current.availableCredits - amount,
      heldCredits: current.heldCredits + amount
    });
  });
}
```

```bash
npm run test  # ✅ 통과 확인
```

### Step 3: Refactor (구조 개선)

```javascript
// 1. 테스트가 통과한 상태에서만 리팩토링
// 2. 기능 변경 없이 구조만 개선
// 3. 리팩토링 후 다시 테스트 실행

// Before (기능 변경)
async function holdDeposit(userId, amount) { ... }

// After (구조 변경만)
async function holdDeposit(userId, amount) {
  await updateCredits(userId, {
    available: -amount,
    held: +amount
  });
}

async function updateCredits(userId, delta) {
  // 공통 로직 추출
}
```

```bash
npm run test  # ✅ 여전히 통과 확인
```

---

## 📋 커밋 규칙 (KB.md)

### 구조 변경 vs 기능 변경 분리

```bash
# ❌ 잘못된 예: 구조와 기능을 섞음
git commit -m "Add holdDeposit and refactor user service"

# ✅ 올바른 예: 분리해서 커밋
git commit -m "feat: Add holdDeposit function"
git commit -m "refactor: Extract updateCredits helper"
```

### 커밋 전 체크리스트

- [ ] 모든 테스트 통과?
- [ ] 린터 경고 0개?
- [ ] 하나의 논리적 단위?
- [ ] 구조/기능 변경 분리?

---

## 📖 단계별 필수 읽기 문서

### Phase 2 개발 시작 전

| 순서 | 문서 | 읽는 시간 | 읽을 섹션 |
|------|------|----------|----------|
| 1 | `KB.md` | 5분 | 전체 |
| 2 | `development/coding-conventions.md` | 60분 | 섹션 1-4, 9, 10 |
| 3 | `design/policy-driven.md` | 40분 | 섹션 1-5 |
| 4 | `development/scripts-management.md` | 15분 | 스크립트 작성 시 |

### 섹션별 가이드

**`coding-conventions.md`에서 필수로 읽을 섹션**:
- 섹션 1-4: 파일 구조, 명명 규칙, 컴포넌트 작성법
- 섹션 9: 정책 기반 아키텍처
- 섹션 10: Cloud Functions 개발 규칙

**`policy-driven.md`에서 필수로 읽을 섹션**:
- 섹션 1-3: 핵심 개념 (Policy-Driven Architecture)
- 섹션 4-5: 실전 가이드

---

## ⚠️ TDD 원칙 위반 시

### KB.md "go" 명령어

`KB.md` 첫 줄:
```
Always follow the instructions in plan.md. When I say "go",
find the next unmarked test in plan.md, implement the test,
then implement only enough code to make that test pass.
```

**사용법**:
1. PM이 04-TEST-SCENARIOS.md를 plan.md로 사용
2. PM이 "go"라고 명령
3. 에이전트가 다음 테스트 찾아서 TDD 사이클 실행

---

## ✅ 체크리스트

TDD 개발 시:

- [ ] KB.md 읽었는가?
- [ ] 04-TEST-SCENARIOS.md 먼저 읽었는가?
- [ ] 테스트 먼저 작성했는가? (Red)
- [ ] 최소 코드로 테스트 통과시켰는가? (Green)
- [ ] 테스트 통과 후에만 리팩토링했는가? (Refactor)
- [ ] 구조/기능 변경을 분리해서 커밋했는가?

---

## 🔗 다음 단계

1. 역할별 상세 가이드 → `development/agent-roles.md`
2. 통합 체크리스트 → `testing/integration-checklist.md`
