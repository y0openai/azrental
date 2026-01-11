# 📂 파일 목록 & 설명

> **한눈에 보는 모든 파일**

---

## 🎯 핵심 시작 파일 (먼저 읽기)

### 1. QUICKSTART.md
- **설명**: 새 프로젝트를 5분 안에 설정하기
- **크기**: 6.3 KB
- **대상**: 모든 사람 (처음 시작)
- **내용**: 단계별 지시 + 체크리스트 + FAQ

### 2. README.md
- **설명**: 파이프라인 개요 & Wave Orchestration 소개
- **크기**: 8.1 KB
- **대상**: 팀 리더 / PM
- **내용**: 시스템 비교 + 진화 로드맵

### 3. INDEX.md
- **설명**: 완전한 패키지 가이드
- **크기**: ~12 KB
- **대상**: 모든 사람 (문서 네비게이션)
- **내용**: 상황별 가이드 + 학습 경로

---

## 📖 메인 프로토콜 (핵심 문서)

### 4. CLAUDE.md
- **설명**: 프로젝트 설정 파일 (제네릭 템플릿)
- **크기**: 12 KB
- **대상**: 모든 에이전트/팀원
- **수정**: ✅ **필수** (5개 placeholder)
- **내용**: Step-by-step 온보딩 + Wave Orchestration Step 6

### 5. WAVE-ORCHESTRATION-SPECIFICATION.md
- **설명**: Wave 시스템 완전 기술 명세 ⭐
- **크기**: 23 KB
- **대상**: 기술 리드 / Orchestrator / 깊이 있는 이해
- **수정**: ❌ 아니오
- **내용**: 11개 섹션, 700+ 줄, 모든 엣지 케이스

### 6. PIPELINE-EVOLUTION-ROADMAP.md
- **설명**: Q1-Q3 2025 진화 계획
- **크기**: 9.9 KB
- **대상**: PM / 기술 리드 / 의사결정자
- **수정**: ❌ 아니오
- **내용**: 7개 기능, 구체적 구현 계획

### 7. KB.md
- **설명**: TDD 원칙 & 기술 워크플로우
- **크기**: 3.4 KB
- **대상**: 모든 개발자
- **수정**: ❌ 아니오
- **내용**: TDD 방법론, 테스트 전략

---

## 📋 참고 & 확인 파일

### 8. VERIFICATION.md
- **설명**: 파이프라인 완성 확인 체크리스트
- **크기**: ~8 KB
- **대상**: PM / 기술 리드 (배포 전 확인)
- **내용**: 완성도 평가, 통계, 다음 단계

### 9. FILES.md (이 파일)
- **설명**: 모든 파일 목록 & 설명
- **크기**: ~6 KB
- **대상**: 네비게이션 용
- **내용**: 각 파일의 목적, 크기, 대상, 수정 여부

### 10. CLAUDE-TEMPLATE.md
- **설명**: 제네릭 템플릿 백업
- **크기**: 12 KB
- **대상**: 백업 (CLAUDE.md와 동일)
- **수정**: ❌ 아니오

---

## 📚 온보딩 가이드 (역할별)

### onboarding/

#### 12. _index.md
- 온보딩 시스템 개요

#### 13. new-feature.md
- **대상**: Role 1 (신규 기능 개발)
- **내용**: 기획 → 설계 → 코딩 → 배포

#### 14. bug-fix.md
- **대상**: Role 2 (버그 수정)
- **내용**: 재현 → 분석 → 수정 → 테스트

#### 15. refactoring.md
- **대상**: Role 3 (리팩토링)
- **내용**: 리팩토링 유형별 전략

#### 16. testing.md
- **대상**: Role 4 (테스트/QA)
- **내용**: Unit, Integration, E2E 테스트

#### 17. documentation.md
- **대상**: Role 5 (문서화)
- **내용**: PRD, 기술 문서, API 문서

#### 18. pr-deployment.md
- **대상**: Role 6 (PR & 배포)
- **내용**: 코드 검토 → PR 생성 → 배포

---

## 🛠️ 개발 프로세스 가이드

### development/

#### 19. agent-roles.md ⭐
- **중요도**: **매우 높음**
- **내용**: Mode 1/2별 에이전트 역할 정의
- **대상**: Orchestrator, Sub-agents

#### 20. orchestrator-knowledge-transfer.md
- **내용**: Orchestrator 역할 & 프로토콜 상세
- **대상**: 기술 리드 / Orchestrator

#### 21. multi-agent-context-passing.md
- **내용**: Sub-agent 간 컨텍스트 전달 방식
- **대상**: 병렬 개발하는 에이전트들

#### 22. tdd-workflow.md
- **내용**: Test-Driven Development 워크플로우
- **대상**: 모든 개발자

#### 23. coding-conventions.md
- **내용**: 코딩 규칙 (프레임워크별)
- **수정**: ✅ 권장 (프레임워크 맞게)
- **대상**: 모든 개발자

---

## 🎨 설계 & 아키텍처

### design/

#### 24. orchestration-selection-guide.md
- **내용**: Mode 1 vs Mode 2 선택 기준
- **대상**: PM / 기술 리드

#### 25. interface-contracts.md
- **내용**: Mock 인터페이스 정의 방법
- **대상**: Frontend / Backend 개발자

#### 26. policy-driven.md
- **내용**: 정책 기반 아키텍처 패턴
- **대상**: Backend 개발자 (동적 설정)

---

## 📝 기획 & 문서 작성

### planning/

#### 27. prd-writing-full.md
- **내용**: PRD 작성 완전 가이드
- **대상**: PM / Product Manager

#### 28. feature-hub-structure.md
- **내용**: 기능 문서 폴더 구조
- **대상**: 기술 리드 (문서 조직)

---

## 📋 Phase 0 템플릿

### templates/

**목적**: 새 기능 개발 시 복사-붙여넣기로 바로 사용

#### 29. 01-PRD-template.md
- **설명**: Product Requirements Document
- **물음**: 무엇을 만들 것인가?

#### 30. 02-WIREFRAME-template.md
- **설명**: HTML/Tailwind 인터랙티브 프로토타입 가이드
- **물음**: User Flow를 어떻게 검증할 것인가?
- **도구**: HTML + Tailwind CSS (CDN)

#### 31. 03-RFC-template.md
- **설명**: Request for Comments
- **물음**: 어떻게 만들 것인가?

#### 32. 04-ORCHESTRATION-template.md
- **설명**: Task 정의 문서
- **물음**: 누가 무엇을 할 것인가?

#### 33. 05-CONTEXT-template.md
- **설명**: Sub-agent 배경 지식
- **물음**: Sub-agent가 알아야 할 것?

#### 34. 06-POLICY-SETUP-template.md
- **설명**: 동적 설정 정의
- **물음**: Firestore/Config에서 관리할 것?

#### 35. 07-AGENT-REFERENCES-template.md
- **설명**: 역할별 참고 링크
- **물음**: 각 Agent가 참고할 문서?

#### 36. DESIGN-SYSTEM-template.md
- **설명**: 프로젝트 전역 디자인 시스템
- **물음**: 색상, 타이포, 컴포넌트 규칙?
- **범위**: 기능별 ❌ → **프로젝트 전역 문서** ✅
- **위치**: `docs/DESIGN-SYSTEM.md` (한 번만 작성)

---

## 🔍 총 통계

| 범주 | 파일 수 | 총 줄 수 | 크기 |
|------|--------|--------|------|
| **시작 & 네비게이션** | 3 | ~300 | 26 KB |
| **핵심 프로토콜** | 4 | 2,000+ | 58 KB |
| **참고 & 백업** | 3 | 500+ | 62 KB |
| **온보딩** | 7 | 1,200+ | 100 KB |
| **개발 가이드** | 5 | 2,000+ | 150 KB |
| **설계** | 3 | 800+ | 120 KB |
| **기획** | 2 | 400+ | 80 KB |
| **템플릿** | 8 | 1,800+ | 180 KB |

**합계**: 34개 파일 / ~9,000줄 / ~680 KB

---

## 🗂️ 폴더 구조 최종

```
reusable-ai-pipeline/
│
├── 📄 QUICKSTART.md ................. 5분 시작
├── 📄 README.md .................... 개요
├── 📄 INDEX.md .................... 네비게이션
├── 📄 VERIFICATION.md ............. 완성 확인
├── 📄 FILES.md .................... 이 파일
│
├── 📄 CLAUDE.md ................... ⭐ 메인 설정 (수정 필요)
├── 📄 WAVE-ORCHESTRATION-SPECIFICATION.md ... 기술 명세
├── 📄 PIPELINE-EVOLUTION-ROADMAP.md ........ 로드맵
├── 📄 KB.md ....................... TDD 원칙
│
├── 📄 CLAUDE-TEMPLATE.md ........... 백업
│
├── 📁 onboarding/ ................. 역할별 가이드 (6개)
├── 📁 development/ ................ 개발 프로세스 (5개)
├── 📁 design/ ..................... 설계 & 아키텍처 (3개)
├── 📁 planning/ ................... 기획 & 문서 (2개)
├── 📁 templates/ .................. Phase 0 템플릿 (8개)
└── 📁 reference/ .................. 기타 (필요시)
```

---

## 📚 읽는 순서 (추천)

### 처음 사람

1. **QUICKSTART.md** (5분)
2. **CLAUDE.md** (10분)
3. 역할별 onboarding 문서 (30분)

**소요**: 45분 → 기본 이해 완료

### 개발자

1. 위 + **development/agent-roles.md** (30분)
2. **development/coding-conventions.md** (20분)
3. 필요한 설계 가이드

**소요**: 2시간

### 기술 리드

1. 모든 문서 중 (-)
2. **WAVE-ORCHESTRATION-SPECIFICATION.md** (1시간)
3. **PIPELINE-EVOLUTION-ROADMAP.md** (30분)

**소요**: 8시간 → 완전 이해

---

## ✅ 체크리스트: 파일 준비됨?

- [ ] QUICKSTART.md 있음
- [ ] README.md 있음
- [ ] INDEX.md 있음
- [ ] CLAUDE.md 있음
- [ ] WAVE-ORCHESTRATION-SPECIFICATION.md 있음
- [ ] PIPELINE-EVOLUTION-ROADMAP.md 있음
- [ ] onboarding/ 폴더 (6개 파일)
- [ ] development/ 폴더 (5개 파일)
- [ ] design/ 폴더 (3개 파일)
- [ ] planning/ 폴더 (2개 파일)
- [ ] templates/ 폴더 (8개 파일)

**모두 체크됨?** → **✅ 배포 준비 완료!**

---

*파일 목록 v2.0 (2025-12-26)*
