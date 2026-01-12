# 🚀 Quick Start Guide - 새 프로젝트 설정 (5분)

> 이 파이프라인을 새로운 프로젝트에 적용하기 위한 빠른 시작 가이드입니다.

---

## 📋 사전 준비사항

- 새 프로젝트 폴더 생성 및 Git 초기화
- Node.js & npm 설치 (개발 시)

---

## 🎯 Step 1: 파이프라인 복사 (1분)

### 옵션 A: 전체 구조 복사 (권장)

```bash
# 새 프로젝트 루트에서
cp -r /path/to/reusable-ai-pipeline/docs ./docs
cp /path/to/reusable-ai-pipeline/CLAUDE.md ./CLAUDE.md
cp /path/to/reusable-ai-pipeline/KB.md ./KB.md
cp /path/to/reusable-ai-pipeline/templates/HANDOFF-template.md ./.handoff.md
```

### 옵션 B: 개별 복사

```bash
# 최소 필수
cp /path/to/reusable-ai-pipeline/CLAUDE.md ./CLAUDE.md
cp /path/to/reusable-ai-pipeline/KB.md ./KB.md
cp /path/to/reusable-ai-pipeline/templates/HANDOFF-template.md ./.handoff.md

# 그리고 나중에
mkdir -p docs/engineering/guides
cp -r /path/to/reusable-ai-pipeline/{onboarding,development,design,planning,templates} docs/engineering/guides/
```

### ⚠️ .handoff.md 생성 필수

**.handoff.md**는 세션 간 컨텍스트 이관의 핵심입니다:
- 새 세션에서 에이전트가 프로토콜을 따르도록 강제
- 복잡도 계산 → Single/Wave 결정을 자동 트리거
- 템플릿 참조: `templates/HANDOFF-template.md`

---

## 📝 Step 2: CLAUDE.md 커스터마이징 (2분)

파일을 열고 `{...}` 형태의 플레이스홀더를 교체하세요:

### 필수 수정 사항

#### 1. 프로젝트 정보

```markdown
# 현재 내용:
> **Root Anchor**: 이 문서는 {PROJECT_NAME} 프로젝트의 단일 진실 공급원입니다.

# 수정 후:
> **Root Anchor**: 이 문서는 MyAwesomeApp 프로젝트의 단일 진실 공급원입니다.
```

바꿀 항목들:
- `{PROJECT_NAME}` → 프로젝트 이름 (예: "Airbnb Clone", "Social Network")
- `{YYYY-MM-DD}` → 현재 날짜 (예: "2025-12-26")
- `{VERSION}` → 버전 (예: "1.0")

#### 2. 아키텍처 스택

"## Architecture & Tech Stack" 섹션 찾기:

```markdown
### Frontend
- Framework: {FRAMEWORK} → React 18 (또는 Vue 3, Angular 등)
- Build Tool: {BUILD_TOOL} → Vite (또는 Webpack, Parcel 등)
- Styling: {STYLING_SOLUTION} → Tailwind CSS (또는 Styled-components 등)

### Backend
- Platform: {BACKEND_PLATFORM} → Firebase (또는 AWS, Supabase 등)
- Database: {DATABASE_TYPE} → Firestore (또는 PostgreSQL, DynamoDB 등)
```

#### 3. 배포 환경

```markdown
### Staging
└─ {STAGING_URL} → https://my-app-staging.vercel.app

### Production
└─ {PRODUCTION_URL} → https://my-app.vercel.app
```

#### 4. 데이터베이스 스키마

"## Database Schema" 섹션 찾기:

```markdown
### Collections/Tables

{COLLECTION_NAME}
├─ {field1} (type) - {description}
└─ {field2} (type) - {description}
```

예시:
```markdown
users
├─ id (string) - Primary Key
├─ email (string) - User email
└─ createdAt (timestamp) - Account creation date

posts
├─ id (string) - Primary Key
├─ authorId (string) - FK → users.id
└─ content (string) - Post content
```

### 선택적 수정 사항 (나중에 가능)

- `{STATUS}` - 프로젝트 상태 (예: "Active Development")
- "## Project Status" 섹션의 모든 내용
- "## Essential Commands" 섹션 (기술 스택에 맞게)

---

## 🔧 Step 3: 코딩 규칙 커스터마이징 (선택, 나중에 가능)

파일: `docs/engineering/guides/development/coding-conventions.md`

프레임워크별로 맞게 수정:
- **React**: React Hooks, Function components, JSX
- **Vue**: Composition API, Template syntax
- **Angular**: Class-based, Decorators, Services
- **Backend**: Framework-specific patterns (Express, Django, Spring 등)

---

## 🚀 Step 4: 파이프라인 시작!

### 첫 기능 개발 시작

새 Claude Code 세션에서:

```
CLAUDE.md 읽고 .handoff.md 읽어
```

**자동으로 진행됨**:
1. ✅ CLAUDE.md 로드 완료
2. ✅ .handoff.md 로드 → 필수 지시 확인
3. ✅ 역할 선택 테이블 표시
4. 🎯 사용자가 역할 선택 (1-6)
5. 📚 필수 문서 자동 로드
6. 📊 **복잡도 계산** (1번 선택 시 필수!)
7. 🔀 Single/Wave 결정
8. ✅ 온보딩 완료 보고
9. 🚀 작업 시작

### ⚠️ 중요: 복잡도 계산 강제

**1번(신규 기능 개발) 선택 시**:
- 복잡도 계산 필수 (스킵 금지)
- complexity < 2.0 → Single Agent
- complexity ≥ 2.0 → Wave Orchestration 강제

이 Gate가 없으면 에이전트가 습관적으로 순차 작업만 진행합니다.

---

## 📂 폴더 구조 최종 확인

정상적으로 설정되었으면:

```
my-new-project/
├── CLAUDE.md                  ✅ 커스터마이징됨
├── KB.md                      ✅ 유지
├── .handoff.md                ✅ 세션 핸드오프 (필수!)
├── package.json
├── src/
│   └── ...
├── docs/
│   └── engineering/
│       └── guides/
│           ├── onboarding/       ✅ 복사됨
│           ├── development/      ✅ 복사됨
│           ├── design/           ✅ 복사됨
│           ├── planning/         ✅ 복사됨
│           └── templates/        ✅ 복사됨
└── ...
```

---

## 🎓 다음 단계

### 처음 기능 개발 (Mode 1 또는 Mode 2)

1. **Phase 0: 계획** (2-3시간)
   - 7개 문서 작성 (PRD, WIREFRAME, RFC, ORCHESTRATION, CONTEXT, POLICY-SETUP, REFERENCES)
   - Template 사용: `docs/engineering/guides/templates/`
   - 💡 **디자인 시스템**: 프로젝트 전역 문서로 `docs/DESIGN-SYSTEM.md`에 한 번만 작성

2. **Phase 1+: 실행** (Wave Orchestration)
   - Sub-agent 자동 병렬 실행
   - Orchestrator가 Progress Dashboard 생성

### 참고 문서

**처음 읽을 문서**:
- `docs/engineering/guides/development/agent-roles.md` - Mode 1/2 역할 정의
- `docs/engineering/guides/design/orchestration-selection-guide.md` - Mode 선택 기준
- `WAVE-ORCHESTRATION-SPECIFICATION.md` - 기술 깊이

**기능별 가이드**:
- 신규 기능: `docs/engineering/guides/onboarding/new-feature.md`
- 버그 수정: `docs/engineering/guides/onboarding/bug-fix.md`
- 리팩토링: `docs/engineering/guides/onboarding/refactoring.md`

---

## ❓ 문제 해결

### Q: CLAUDE.md에 placeholder가 남아있는 경우?

**A**: 그대로 두면 됩니다. 해당 기능을 나중에 추가할 때 수정하면 됩니다.

### Q: 기술 스택이 template과 다른 경우?

**A**: 예시일 뿐이니 자유롭게 수정하세요. 중요한 것은 **일관성**입니다.

### Q: 팀원들도 파이프라인을 써야 하나요?

**A**: 네! CLAUDE.md를 읽으면 모두 같은 프로세스를 따릅니다. 처음 1-2회는 어색하지만 금방 익숙해집니다.

### Q: 기존 프로젝트에 적용 가능한가?

**A**: 네! 단계별로:
1. CLAUDE.md를 루트에 복사
2. 기존 폴더 구조에 맞게 경로 수정
3. 다음 기능부터 파이프라인 사용

---

## 🎉 완료!

이제 새 프로젝트가 준비되었습니다.

**다음**: Claude Code에서 "CLAUDE.md 읽어" 명령으로 시작하세요!

---

## 💡 팁

- CLAUDE.md는 프로젝트의 **"헌법"**입니다. 주기적으로 업데이트하세요.
- KB.md는 TDD 원칙을 담고 있으니 참고하세요.
- Wave Orchestration은 자동으로 작동하므로 이해만 하면 됩니다.
- 질문이 있으면 WAVE-ORCHESTRATION-SPECIFICATION.md를 참고하세요.

---

*Made with Claude Code Agent Swarm & Wave Orchestration*
