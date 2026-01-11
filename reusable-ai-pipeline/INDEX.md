# 📚 Reusable AI Pipeline - 완전 패키지 INDEX

> **이것이 무엇인가?**
>
> 이 폴더는 **어떤 프로젝트**에도 적용 가능한 완성된 AI 멀티 에이전트 개발 파이프라인입니다.
> Wave Orchestration을 기반으로 동적 멀티 페이즈 개발을 자동화합니다.

---

## 📦 패키지 내용물 완전 가이드

### 🎯 시작 문서들 (가장 먼저 읽기)

| 파일 | 용도 | 읽는 순서 | 수정 필요 |
|------|------|---------|----------|
| **[QUICKSTART.md](QUICKSTART.md)** | 5분 안에 새 프로젝트 설정 | **1순위** | ❌ 아니오 |
| **[README.md](README.md)** | 파이프라인 개요 & Wave Orchestration 소개 | **2순위** | ❌ 아니오 |
| **[CLAUDE.md](CLAUDE.md)** | 프로젝트 메인 설정 파일 (템플릿) | **3순위** | ✅ **필수** |

### 📖 기술 사양 & 아키텍처

| 파일 | 내용 | 대상 | 페이지 |
|------|------|------|--------|
| **[WAVE-ORCHESTRATION-SPECIFICATION.md](WAVE-ORCHESTRATION-SPECIFICATION.md)** | Wave 시스템 완전 기술 명세 | Orchestrator, 기술 리드 | 700+ |
| **[PIPELINE-EVOLUTION-ROADMAP.md](PIPELINE-EVOLUTION-ROADMAP.md)** | Q1-Q3 2025 진화 계획 (7개 기능) | PM, 기술 리드 | 380+ |
| **[KB.md](KB.md)** | TDD 워크플로 & 기술 원칙 | 모든 개발자 | 100+ |

### 🔍 참고용 예시 파일

| 파일 | 설명 |
|------|------|
| **CLAUDE-TEMPLATE.md** | 제네릭 템플릿 (CLAUDE.md와 동일) |

---

## 📁 가이드 & 템플릿 폴더 구조

### `onboarding/` - 역할별 온보딩 가이드

**목적**: 새 에이전트 또는 팀원이 각 역할을 이해하도록 하는 문서

```
onboarding/
├── _index.md                      # 온보딩 시스템 개요
├── new-feature.md                 # 신규 기능 개발 가이드
├── bug-fix.md                     # 버그 수정 프로세스
├── refactoring.md                 # 코드 품질 개선
├── testing.md                     # QA & 테스트 자동화
├── documentation.md               # 문서 작성
└── pr-deployment.md               # PR 검토 & 배포
```

**사용 시기**: CLAUDE.md Step 2에서 자동으로 로드됨

### `development/` - 개발 프로세스 & 협업 가이드

**목적**: 팀이 어떻게 함께 일하는지 명확히 하기

```
development/
├── agent-roles.md                 # ⭐ Mode 1/2별 에이전트 역할 (필독)
├── orchestrator-knowledge-transfer.md  # Orchestrator 역할 & 프로토콜
├── multi-agent-context-passing.md     # 병렬 협업 방식 (Context 전달)
├── tdd-workflow.md                # Test-Driven Development 워크플로
└── coding-conventions.md          # 코딩 규칙 (프레임워크별)
```

**사용 시기**: 기능 개발 시 역할별로 참고

### `design/` - 설계 & 아키텍처 가이드

**목적**: 기능을 어떻게 설계할지에 대한 원칙

```
design/
├── orchestration-selection-guide.md  # Mode 1 vs Mode 2 선택 기준
├── interface-contracts.md             # Mock 인터페이스 정의 방법
└── policy-driven.md                   # 정책 기반 아키텍처 패턴
```

**사용 시기**: RFC(Request for Comments) 작성할 때 참고

### `planning/` - 기획 & 문서 작성

**목적**: 기능을 어떻게 기획하고 문서화할지

```
planning/
├── prd-writing-full.md            # PRD(Product Requirements) 작성 완전 가이드
└── feature-hub-structure.md       # 기능 문서의 폴더 구조
```

**사용 시기**: Phase 0에서 기획 문서 작성할 때

### `templates/` - Phase 0 문서 템플릿

**목적**: 복사-붙여넣기로 바로 사용할 수 있는 템플릿

```
templates/
├── 01-PRD-template.md             # 무엇을 만들 것인가?
├── 02-WIREFRAME-template.md       # ⭐ User Flow 검증 (HTML/Tailwind 프로토타입)
├── 03-RFC-template.md             # 어떻게 만들 것인가?
├── 04-ORCHESTRATION-template.md   # 누가 무엇을 할 것인가?
├── 05-CONTEXT-template.md         # Sub-agent에게 전달할 배경 지식
├── 06-POLICY-SETUP-template.md    # 동적 설정 정의
├── 07-AGENT-REFERENCES-template.md # 역할별 참고 링크
└── DESIGN-SYSTEM-template.md      # 🎨 프로젝트 전역 디자인 시스템
```

**사용 시기**: 신규 기능 개발할 때 복사해서 채우면 됨

> ⚠️ **와이어프레임 우선**: PRD 작성 후, RFC 전에 반드시 02-WIREFRAME으로 User Flow 검증

> 💡 **디자인 시스템**: 프로젝트 전역 문서로, 기능별이 아닌 `docs/DESIGN-SYSTEM.md`에 한 번만 작성

---

## 🗺️ 전체 사용 흐름도

### 신규 프로젝트 설정

```
1. QUICKSTART.md 읽기 (5분)
   └─ 파일 복사 + CLAUDE.md 커스터마이징

2. CLAUDE.md 읽기 (Claude Code 세션에서)
   └─ 역할 선택 → 온보딩 완료

3. 첫 기능 개발 시작!
```

### 기능 개발 워크플로

```
Mode 1 (병렬 - 복잡한 기능):

Phase 0 (2.5-3시간): 계획
  ├─ Read: planning/prd-writing-full.md
  ├─ Copy: templates/01-PRD-template.md → docs/feature-hubs/{기능명}/01-PRD.md
  │
  ├─ ⭐ WIREFRAME 검증 (PRD 후, RFC 전)
  │   ├─ Read: templates/02-WIREFRAME-template.md
  │   ├─ Create: docs/wireframes/{기능명}/index.html
  │   ├─ Create: docs/wireframes/{기능명}/01-{화면}.html ...
  │   └─ 이해관계자 리뷰 & 승인
  │
  ├─ Copy: templates/03-RFC-template.md → docs/feature-hubs/{기능명}/03-RFC.md
  ├─ Copy: templates/04-ORCHESTRATION-template.md → docs/feature-hubs/{기능명}/04-ORCHESTRATION.md
  ├─ Copy: templates/05-CONTEXT-template.md → docs/feature-hubs/{기능명}/05-CONTEXT.md
  ├─ Copy: templates/06-POLICY-SETUP-template.md → docs/feature-hubs/{기능명}/06-POLICY-SETUP.md
  └─ Copy: templates/07-AGENT-REFERENCES-template.md → docs/feature-hubs/{기능명}/07-AGENT-REFERENCES.md

Phase 1+ (2-3일): 실행 (Wave Orchestration 자동)
  ├─ Orchestrator가 Sub-agent 생성
  ├─ 각 Sub-agent가 병렬 작업
  ├─ Progress Dashboard 자동 생성
  └─ 점진적 완성

---

Mode 2 (순차 - 단순한 기능):

Phase 0: 빠른 계획 (30분)
  └─ 핵심 설계만 기획

Phase 1: 순차 구현 (1-2일)
  └─ 1명이 계획 → 코딩 → 테스트 → 배포
```

### 참고 문서 선택 로드

```
항상:
├─ CLAUDE.md (프로젝트 설정)
├─ KB.md (TDD 원칙)
└─ development/agent-roles.md (Mode별 역할)

신규 기능:
├─ planning/prd-writing-full.md
├─ design/orchestration-selection-guide.md
├─ development/orchestrator-knowledge-transfer.md
└─ templates/* (6개 템플릿)

버그 수정:
└─ onboarding/bug-fix.md

리팩토링:
├─ onboarding/refactoring.md
└─ development/coding-conventions.md

테스트:
└─ onboarding/testing.md

배포:
└─ onboarding/pr-deployment.md
```

---

## 💡 각 상황별 어떤 문서를 읽을까?

### 상황 1: 새 프로젝트 만들기

**순서**:
1. QUICKSTART.md (5분) → 설정
2. CLAUDE.md → Step 1 역할 선택
3. 선택한 역할의 onboarding 문서 자동 로드

### 상황 2: 신규 기능 개발 (복잡함)

**순서**:
1. CLAUDE.md Step 1 → 신규 기능 개발 선택
2. orchestration-selection-guide.md → Mode 1 결정
3. planning/prd-writing-full.md → 기획
4. templates/01-PRD-template.md ~ 06-... → 6개 문서 작성
5. agent-roles.md (Mode 1) → 각 Sub-agent 역할 이해
6. Wave Orchestration 자동 실행

### 상황 3: 버그 수정 (간단함)

**순서**:
1. CLAUDE.md Step 1 → 버그 수정 선택
2. onboarding/bug-fix.md → 프로세스 이해
3. 버그 재현 → 수정 → 테스트 → PR

### 상황 4: 팀에 새 사람이 들어옴

**순서**:
1. CLAUDE.md 읽기
2. 역할 선택
3. 해당 역할의 onboarding 가이드 + 필수 개발 가이드
4. 첫 작업 시작

### 상황 5: 기술 리드가 기원을 이해하고 싶을 때

**순서**:
1. README.md → 파이프라인 개요
2. WAVE-ORCHESTRATION-SPECIFICATION.md → 기술 깊이
3. PIPELINE-EVOLUTION-ROADMAP.md → 향후 계획
4. development/orchestrator-knowledge-transfer.md → 상세 프로토콜

---

## 🎓 학습 경로 (권장 순서)

### 초급 (기능 개발 가능)

1. QUICKSTART.md
2. CLAUDE.md (역할 선택 후 해당 부분만)
3. 해당 role의 onboarding 문서
4. Mode별 agent-roles.md 섹션

**소요 시간**: 1-2시간
**가능한 것**: 단순 기능, 버그 수정

### 중급 (Orchestrator 역할 가능)

**기초 위에 추가 읽기**:
1. development/orchestrator-knowledge-transfer.md
2. planning/prd-writing-full.md
3. WAVE-ORCHESTRATION-SPECIFICATION.md (Section 1-5)
4. design/orchestration-selection-guide.md

**소요 시간**: 3-4시간
**가능한 것**: Mode 1 기능 계획, Sub-agent 지시

### 고급 (PM/기술 리드)

**중급 위에 추가 읽기**:
1. WAVE-ORCHESTRATION-SPECIFICATION.md (전체)
2. PIPELINE-EVOLUTION-ROADMAP.md
3. development/multi-agent-context-passing.md
4. design/policy-driven.md

**소요 시간**: 6-8시간
**가능한 것**: 시스템 개선, Phase 계획, 보고

---

## ✅ 체크리스트: 새 프로젝트 준비됨?

- [ ] QUICKSTART.md 완료 (파일 복사)
- [ ] CLAUDE.md의 5개 placeholder 수정
- [ ] docs/engineering/guides/ 폴더 존재 확인
- [ ] templates/ 폴더 이동 확인
- [ ] Claude Code에서 "CLAUDE.md 읽어" 명령 테스트
- [ ] 역할 선택 테이블이 표시됨
- [ ] 첫 기능 개발 시작!

---

## 🔗 파일 간 관계도

```
시작
 ↓
QUICKSTART.md → 파일 복사 & 설정
 ↓
CLAUDE.md (커스터마이징) → Role Selection
 ├─ Role 1: 신규 기능
 │  ├─ planning/prd-writing-full.md
 │  ├─ design/orchestration-selection-guide.md
 │  ├─ templates/01-06
 │  ├─ development/agent-roles.md
 │  └─ WAVE-ORCHESTRATION-SPECIFICATION.md
 ├─ Role 2: 버그 수정
 │  └─ onboarding/bug-fix.md
 ├─ Role 3: 리팩토링
 │  ├─ onboarding/refactoring.md
 │  └─ development/coding-conventions.md
 ├─ Role 4: 테스트
 │  └─ onboarding/testing.md
 ├─ Role 5: 문서화
 │  └─ onboarding/documentation.md
 └─ Role 6: PR & 배포
    └─ onboarding/pr-deployment.md
 ↓
PIPELINE-EVOLUTION-ROADMAP.md (향후 개선)
```

---

## 📊 파일 통계

| 범주 | 파일 수 | 총 줄 수 | 용도 |
|------|--------|--------|------|
| **핵심 설정** | 3 | 1,500+ | CLAUDE.md, KB.md, QUICKSTART.md |
| **기술 명세** | 2 | 1,100+ | Wave Spec, Roadmap |
| **온보딩** | 6 | 1,200+ | 역할별 가이드 |
| **개발 가이드** | 5 | 2,000+ | 협업 & 설계 패턴 |
| **기획 & 디자인** | 3 | 800+ | PRD, RFC 작성 |
| **템플릿** | 8 | 1,800+ | Phase 0 문서 + 디자인 시스템 |
| **참고** | 1 | 100+ | 디렉토리, 인터페이스 |

**총합**: 26개 파일 / 8,200+ 줄

---

## 🚀 다음 단계

1. **지금**: QUICKSTART.md 읽고 파일 복사
2. **다음**: 새 프로젝트에서 CLAUDE.md 읽기
3. **그 다음**: 첫 기능 개발 시작!
4. **나중**: WAVE-ORCHESTRATION-SPECIFICATION.md 정독 (선택)
5. **미래**: PIPELINE-EVOLUTION-ROADMAP.md의 7개 기능 구현

---

*Made with Claude Code Agent Swarm & Wave Orchestration*
*Version 2.0 (2025-12-26)*
