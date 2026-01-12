# 세션 핸드오프 템플릿

> **용도**: 세션 간 컨텍스트 이관 및 새 에이전트 강제 실행 프로토콜
> **위치**: 프로젝트 루트의 `.handoff.md`

---

## 템플릿

```markdown
# 세션 핸드오프
ts: {YYYY-MM-DD HH:MM}
from_session: "{이전 세션 요약}"

## 마지막 작업
task: "{완료한 작업 설명}"
result: "{완료/진행중/실패}"

## 진행중 작업 (WIP)
wip:
  - "{진행중 작업 1}"
  - "{진행중 작업 2}"

## 미결 사항
pending:
  - "{미결 사항 1}"
  - "{미결 사항 2}"

## 대화 맥락
context:
  - "{중요 맥락 1}"
  - "{중요 맥락 2}"
  - "{중요 맥락 3}"

---

## ⚠️ 새 세션 필수 지시

```yaml
# 이 파일을 읽은 후 반드시 실행

step_1: "CLAUDE.md의 '필수 실행 프로토콜' 섹션 확인"
step_2: "작업 유형 선택 프롬프트 표시 [A]~[G] 또는 [1]~[6]"
step_3: "선택에 따라 해당 onboarding 문서 읽기"
step_4: "[A] 또는 [1] 선택 시 복잡도 계산 → Single/Wave 결정"
step_5: "온보딩 완료 보고 후 작업 시작"

warning: "이 프로토콜을 스킵하고 바로 코딩 시작 금지"
```

---

## 다음 세션 권장 작업
next_action: "{다음 작업 설명}"
complexity_estimate: "{복잡도 계산식} = {점수} → {Single/Wave 권장}"

read_first:
  - "CLAUDE.md"
  - ".handoff.md (이 파일)"
  - "{관련 PRD 또는 문서 경로}"
```

---

## 사용 가이드

### 언제 업데이트하나요?

1. **커밋 전** (필수)
2. **세션 종료 전** (권장)
3. **중요 결정 후** (권장)

### 무엇을 기록하나요?

| 섹션 | 내용 | 예시 |
|------|------|------|
| `task` | 마지막으로 완료한 작업 | "랜딩페이지 Hero 섹션 구현" |
| `wip` | 진행 중인 작업 목록 | "Services 섹션 구현 중" |
| `pending` | 미해결 사항, 결정 대기 | "디자인 에셋 대기" |
| `context` | 다음 에이전트가 알아야 할 맥락 | "PRD 기준 Must Have만 구현" |
| `next_action` | 다음 세션에서 할 일 | "customer-auth 개발 시작" |
| `complexity_estimate` | 예상 복잡도 (선택) | "2.25 → Wave 권장" |

### 왜 중요한가요?

```
문제: 새 세션에서 에이전트가 맥락을 잃고 순차 작업만 진행
해결: .handoff.md의 "새 세션 필수 지시"로 프로토콜 강제 실행
```

---

## 예시

```markdown
# 세션 핸드오프
ts: 2026-01-12 20:30
from_session: "랜딩페이지 MVP 완료"

## 마지막 작업
task: "랜딩페이지 6개 섹션 구현"
result: "완료"

## 진행중 작업 (WIP)
wip: []

## 미결 사항
pending:
  - "실제 에셋 교체 필요"

## 대화 맥락
context:
  - "랜딩페이지 MVP 완료"
  - "다음: customer-auth"

---

## ⚠️ 새 세션 필수 지시

```yaml
step_1: "CLAUDE.md의 '필수 실행 프로토콜' 확인"
step_2: "작업 유형 선택 표시"
step_3: "onboarding 문서 읽기"
step_4: "복잡도 계산 → Single/Wave 결정"
step_5: "온보딩 완료 보고 후 작업 시작"

warning: "프로토콜 스킵 금지"
```

---

## 다음 세션 권장 작업
next_action: "customer-auth 개발"
complexity_estimate: "2.25 → Wave 권장"

read_first:
  - "CLAUDE.md"
  - ".handoff.md"
  - "docs/feature-hubs/customer-auth/01-PRD.md"
```

---

*Template Version: 1.0*
*Last Updated: 2026-01-12*
