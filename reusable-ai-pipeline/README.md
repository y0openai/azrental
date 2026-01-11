# 🚀 Reusable AI Development Pipeline

> **AI 멀티 에이전트 개발 파이프라인**
> Claude Code의 Task 도구를 활용한 병렬 개발 시스템

---

## 📦 패키지 내용물

```
reusable-ai-pipeline/
│
├── 📄 CLAUDE.md                    # 메인 프로토콜 (프로젝트에 복사)
├── 📄 WAVE-ORCHESTRATION-SPECIFICATION.md  # ⭐ Wave 시스템 기술 명세 (필독)
├── 📄 KB.md                        # TDD 원칙
├── 📄 PIPELINE-EVOLUTION-ROADMAP.md # 업그레이드 로드맵
├── 📄 README.md                    # 이 파일
│
├── 📁 onboarding/                  # 역할별 온보딩 가이드
│   ├── _index.md
│   ├── new-feature.md              # 신규 기능 개발
│   ├── bug-fix.md                  # 버그 수정
│   ├── refactoring.md              # 리팩토링
│   ├── testing.md                  # 테스트/QA
│   ├── documentation.md            # 문서화
│   └── pr-deployment.md            # PR & 배포
│
├── 📁 development/                 # 개발 프로세스 가이드
│   ├── agent-roles.md              # ⭐ 에이전트 역할 정의
│   ├── multi-agent-context-passing.md  # ⭐ 병렬 협업 방식
│   ├── orchestrator-knowledge-transfer.md  # ⭐ 컨텍스트 전달
│   ├── documentation-sync-protocol.md  # ⭐ 문서-코드 동기화 프로토콜
│   ├── tdd-workflow.md             # TDD 워크플로
│   └── coding-conventions.md       # 코딩 규칙 (수정 필요)
│
├── 📁 design/                      # 설계 가이드
│   ├── orchestration-selection-guide.md  # ⭐ Mode 1/2 선택
│   ├── interface-contracts.md      # Mock 인터페이스
│   └── policy-driven.md            # 정책 기반 아키텍처
│
├── 📁 planning/                    # 기획 가이드
│   ├── feature-hub-structure.md    # 기능 문서 구조
│   └── prd-writing-full.md         # PRD 작성법
│
└── 📁 templates/                   # 문서 템플릿
    ├── 01-PRD-template.md
    ├── 02-RFC-template.md
    ├── 03-ORCHESTRATION-template.md
    ├── 04-CONTEXT-template.md
    ├── 05-POLICY-SETUP-template.md
    └── 06-AGENT-REFERENCES-template.md
```

---

## 🚀 Quick Start (5분)

**새 프로젝트 설정 매우 간단합니다!**

### 전체 가이드

**[QUICKSTART.md](QUICKSTART.md)** 참고 (단계별 설명 + 예시 포함)

### 간단 버전

```bash
# Step 1: 복사
cp -r reusable-ai-pipeline/docs ./docs
cp reusable-ai-pipeline/CLAUDE.md ./CLAUDE.md
cp reusable-ai-pipeline/KB.md ./KB.md

# Step 2: CLAUDE.md에서 {PROJECT_NAME}, {FRAMEWORK} 등만 수정
# (총 5개 placeholder 수정하면 됨)
#  - {PROJECT_NAME}
#  - {FRAMEWORK}
#  - {BACKEND_PLATFORM}
#  - {DATABASE_TYPE}
#  - {STAGING_URL}, {PRODUCTION_URL}

# Step 3: Claude Code에서 시작
# "CLAUDE.md 읽어"
```

---

## 📌 중요 파일들

| 파일 | 설명 | 수정 필요 |
|------|------|----------|
| **CLAUDE.md** | 메인 프로토콜 | ✅ 필수 (5개 placeholder) |
| **QUICKSTART.md** | 설정 가이드 | ❌ 아니오 |
| **WAVE-ORCHESTRATION-SPECIFICATION.md** | 기술 명세 | ❌ 아니오 |
| **KB.md** | TDD 원칙 | ❌ 아니오 |
| **docs/** | 모든 가이드 | ❌ 아니오 |

---

## 🎯 핵심 개념

### Wave Orchestration이란?

```
동적 멀티 페이즈 오케스트레이션 시스템:

Phase 1: Sub-agents 생성 + 작업 (병렬)
   ↓
Phase 1 결과 분석 (Orchestrator)
   ↓
Phase 2: 새 Sub-agents 생성 + 작업 (Phase 1 결과 임베드)
   ↓
... (Phase N까지 반복)
   ↓
최종 완성!

✅ 복잡도 자동 판단 (2-6 phases)
✅ Sub-agent 자동 재생성
✅ JSON 극한 압축 + 역추적 가능
✅ PM에게 Decision Report (문제 발생 시)
✅ Progress Dashboard 자동 생성
```

**더 알아보기**: `WAVE-ORCHESTRATION-SPECIFICATION.md` (완전한 기술 명세)

### Mode 1 vs Mode 2

| | Mode 1 (병렬) | Mode 2 (순차) |
|---|---|---|
| **에이전트** | 2-8명 동시 | 1명 순차 |
| **적합** | 복잡한 기능 (3일+) | 단순한 기능 (1-2일) |
| **문서** | 6개 문서 필요 | 최소 문서 |
| **PM 개입** | 시작 + 끝 | 단계별 |

### 6개 문서 시스템

```
docs/feature-hubs/{기능명}/
├── 01-PRD.md           # 무엇을 만들 것인가?
├── 02-RFC.md           # 어떻게 만들 것인가?
├── 03-ORCHESTRATION.md # 누가 무엇을 할 것인가?
├── 04-CONTEXT.md       # Sub-agent에게 전달할 배경 지식
├── 05-POLICY-SETUP.md  # 동적 설정 정의
└── 06-AGENT-REFERENCES.md  # 역할별 참고 링크
```

---

## 🔧 커스터마이징 가이드

### 프레임워크 변경 시

1. `development/coding-conventions.md` 수정
2. 프레임워크별 규칙 추가
3. 예시 코드 업데이트

### 백엔드 변경 시 (Firebase → Supabase 등)

1. `design/policy-driven.md` 수정
2. Policy 저장소 변경
3. `templates/05-POLICY-SETUP-template.md` 수정

### 새 역할 추가 시

1. `development/agent-roles.md`에 새 Agent 섹션 추가
2. `templates/03-ORCHESTRATION-template.md` 업데이트
3. `onboarding/` 필요 시 새 문서 추가

---

## 🌊 Wave Orchestration System (NEW v2.0)

Wave Orchestration은 **단순 병렬 실행의 한계**를 극복한 동적 멀티 페이즈 시스템입니다.

### 이전과의 차이점

| 항목 | 이전 (Agent Swarm v1) | 지금 (Wave v2) |
|------|-------|------|
| **실행 방식** | 1회 병렬 (4명 고정) | 동적 다중 페이즈 |
| **Sub-agent 생성** | 처음 1회만 | 페이즈마다 새로 생성 |
| **컨텍스트 관리** | 누적 (토큰 폭증) | JSON 극한 압축 (90%) |
| **역추적** | 불가능 | Hash + Cache (100% 가능) |
| **에러 처리** | 실패하면 끝 | 자동 재시도 + PM Decision Report |
| **Progress 추적** | 수동 | 자동 Dashboard |
| **복잡도 판단** | 고정 규칙 | 자동 스코어링 (2-6 phases) |

### 핵심 이점

```
✅ 무제한 프로젝트 크기 대응 (극한 압축이므로)
✅ 조금씩 나아가는 점진적 개선 (Wave 단위)
✅ PM은 최소 개입 (결정 시점만 참여)
✅ 에러 복구 자동 (재시도 + 대안 제시)
✅ 추적 완벽 (모든 단계 기록 + 역추적 가능)
```

**구현 세부사항**: `WAVE-ORCHESTRATION-SPECIFICATION.md` (700+ 줄 기술 문서)

---

## 📊 파이프라인 진화 로드맵

`PIPELINE-EVOLUTION-ROADMAP.md` 참고 - 이제 **구체적 구현 계획** 포함:

| Phase | 우선순위 | 기능 | 상태 |
|-------|---------|------|------|
| 1 (Q1) | 1-3 | Agent Memory, Quality Gates, Adaptive Complexity | 📋 계획 |
| 2 (Q2) | 4-6 | Conflict Detection, Rollback, Self-Optimization | 📋 계획 |
| 3 (Q3) | 7 | Cross-Project Knowledge Hub | 📋 계획 |

---

## ❓ FAQ

### Q: 모든 문서를 다 읽어야 하나요?
**A**: 아니요. 역할별로 필요한 문서만 읽습니다.
- Orchestrator: `orchestrator-knowledge-transfer.md` + `agent-roles.md` (Mode 1 섹션)
- Sub-agent: `04-CONTEXT.md` + `03-ORCHESTRATION.md` (자기 Task만)

### Q: Mode 1과 Mode 2 중 어떤 걸 선택해야 하나요?
**A**: `design/orchestration-selection-guide.md` 참고
- 간단히: 3일 이상 → Mode 1, 1-2일 → Mode 2

### Q: 프로젝트별로 수정해야 할 파일은?
**A**:
- **필수**: `CLAUDE.md` (Project Status, Commands, Schema)
- **권장**: `development/coding-conventions.md` (프레임워크별 규칙)
- **선택**: `design/policy-driven.md` (백엔드 변경 시)

### Q: 기존 프로젝트에 적용 가능한가요?
**A**: 네. 문서 구조만 맞추면 됩니다.
1. `CLAUDE.md`를 루트에 복사
2. 기존 코드 구조에 맞게 경로 수정
3. 첫 기능 개발부터 파이프라인 사용

---

## 📝 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 2.0 | 2025-12-26 | Wave Orchestration 시스템 업그레이드 (v4.0) |
| 1.0 | 2025-12-26 | 최초 버전 생성 |

---

## 🤝 기여

이 파이프라인을 개선하고 싶다면:
1. `PIPELINE-EVOLUTION-ROADMAP.md`의 아이디어 구현
2. 새 템플릿 추가
3. 문서 개선

---

*Made with Claude Code Agent Swarm*
