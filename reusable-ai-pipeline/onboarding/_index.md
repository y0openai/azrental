# 온보딩 가이드

> **목적**: 새 에이전트가 역할에 맞는 워크플로를 빠르게 학습
> **시작점**: CLAUDE.md → 역할 선택 → 이 폴더의 해당 문서

---

## 📋 역할별 진입점

| 역할 | 문서 | 설명 |
|------|------|------|
| 1. 신규 기능 개발 | [new-feature.md](new-feature.md) | PRD → RFC → 오케스트레이션 → 개발 |
| 2. 버그 수정 | [bug-fix.md](bug-fix.md) | 재현 → 분석 → 수정 → 테스트 |
| 3. 리팩토링 | [refactoring.md](refactoring.md) | 코드 품질 개선, 기술 부채 해소 |
| 4. 테스트/QA | [testing.md](testing.md) | 테스트 자동화, QA 절차 |
| 5. 문서화 | [documentation.md](documentation.md) | PRD, 기술 문서, API 문서 |
| 6. PR 검토 & 배포 | [pr-deployment.md](pr-deployment.md) | 코드 검토, Staging/Production 배포 |

---

## 🎯 신규 기능 개발 흐름 (역할 1)

```
new-feature.md 읽기
  ↓
Phase 0: 기획
├─ planning/feature-hub-structure.md
├─ planning/prd-writing-full.md
└─ 산출: 01-PRD.md
  ↓
Phase 1: 설계
├─ design/system-architecture.md (⭐ 먼저 읽기)
├─ design/cloud-functions-overview.md (필요 시)
├─ design/interface-contracts.md
├─ design/policy-driven.md
├─ design/orchestration.md
└─ 산출: 02-RFC.md, 03-ORCHESTRATION.md
  ↓
Phase 2: 개발
├─ KB.md (TDD 원칙)
├─ development/tdd-workflow.md
├─ development/coding-conventions.md (섹션 1-4, 9, 10)
├─ development/agent-roles.md
└─ 산출: 04-TEST-SCENARIOS.md, 05-IMPLEMENTATION.md
  ↓
Phase 3: 통합
├─ testing/integration-checklist.md
└─ deployment/procedure.md
```
