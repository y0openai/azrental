# Orchestrator 지식 전달 전략

> **목적**: Orchestrator가 학습한 개발 프레임워크를 새 에이전트에게 효과적으로 전달하는 방법
> **대상**: PM, Orchestrator, Mode 1 (병렬) 에이전트들
> **읽는 시간**: 15분

---

## 🎯 문제 상황

### Orchestrator의 학습 경로

```
Step 2: Orchestrator가 학습하는 문서들
├─ orchestration-selection-guide.md
├─ agent-roles.md
├─ design/system-architecture.md
├─ design/cloud-functions-overview.md
├─ design/interface-contracts.md
├─ development/coding-conventions.md
├─ development/policy-driven-architecture.md
└─ ... (총 1.5-2시간)

습득한 지식:
✅ 3-Layer 아키텍처 이해
✅ 21개 Cloud Functions 맵핑
✅ Mock 기반 병렬 개발 이해
✅ Policy-Driven 개발 패턴
✅ Firestore 설계 원칙
✅ 에이전트 역할 분담
```

### 새로 투입된 에이전트의 상황

```
Session B (Backend Agent):
PM: "@claude Agent 1 Backend
docs/feature-hubs/negotiation-system/03-ORCHESTRATION.md를 읽고
Task 1.1, 1.2, 1.3을 구현해."

Agent 1:
1. 문서 읽기 (2분) ← 03-ORCHESTRATION.md만!
2. Task 이해하려는데...
   "잠깐, Policy-Driven이 뭐지?"
   "Cloud Functions가 몇 개나 있는 거지?"
   "Firestore 스키마는 어떻게 설계해야 하는데?"
   "Mock은 뭐고 왜 써야 하지?"

   → 배경 지식 부족!
```

---

## ⚠️ 문제의 원인

| 관점 | Orchestrator | 새 에이전트 |
|------|-------------|-----------|
| **학습 시간** | 1.5-2시간 (체계적) | 2분 (03-ORCHESTRATION.md만) |
| **배경 지식** | ✅ 프레임워크 전체 이해 | ❌ Task만 이해하고 왜를 모름 |
| **의사결정** | ✅ 독립적 판단 가능 | ❌ 지시사항만 수행 |
| **문제 해결** | ✅ 상황에 맞게 대응 | ❌ 막히면 멈춤 |

---

## 💡 해결 방안 4가지

### 방안 1: 03-ORCHESTRATION.md 강화 (현재 방식의 개선)

**개념**:
```
03-ORCHESTRATION.md를 "완전한 자습서"로 만들기

기존:
└─ Task만 명시

개선:
├─ 배경 지식 (요약본)
├─ Task 명시
├─ 각 Task의 맥락 설명
└─ 참고 링크
```

**예시**:
```markdown
# 협상 채팅 기능 - ORCHESTRATION

## 📚 배경 지식 (5분 읽기)

### 이 프로젝트의 아키텍처
이 프로젝트는 3-Layer 아키텍처입니다:
- Frontend: React 컴포넌트
- Backend: Cloud Functions
- Database: Firestore

더 알려면 → `docs/engineering/guides/design/system-architecture.md`

### Policy-Driven 개발이란?
동적 설정이 필요한 값은 `policy_configs/{도메인}`에 저장합니다.
예: 협상 시간 제한 (24시간) → `policy_configs/negotiation_system`

더 알려면 → `docs/engineering/guides/development/policy-driven-architecture.md`

### Mock 기반 병렬 개발
4명 에이전트가 동시에 작업하기 위해 Mock을 사용합니다:
- Agent 1 (Backend): 실제 함수 구현
- Agent 2 (Frontend Core): Agent 1의 Mock 사용 → 실제 함수 기다림
- Agent 3 (Frontend UI): Agent 2의 Mock 사용

더 알려면 → `docs/engineering/guides/design/interface-contracts.md`

---

## 🎯 각 에이전트의 Task

### Agent 1 (Backend): Task 1.1-1.3
...
```

**장점**:
- ✅ 한 문서로 완결성 있음
- ✅ 새 에이전트가 즉시 자기 역할 이해 가능
- ✅ 추가 세션 불필요

**단점**:
- ❌ 03-ORCHESTRATION.md가 너무 길어짐 (15-20페이지)
- ❌ 모든 에이전트가 불필요한 내용까지 읽음
- ❌ Orchestrator가 작성할 때 시간 오래 걸림 (1-2시간)

---

### 방안 2: 분리된 배경 지식 문서 (권장)

**개념**:
```
03-ORCHESTRATION.md + 보조 문서들의 조합

docs/feature-hubs/negotiation-system/
├── 01-PRD.md (사용자 요구사항)
├── 02-RFC.md (기술 설계)
├── 03-ORCHESTRATION.md (에이전트 Task 명시)
├── 04-CONTEXT.md (NEW - 배경 지식 요약) ← 핵심
├── 05-POLICY-SETUP.md (NEW - Policy 설정)
└── 06-AGENT-REFERENCES.md (NEW - 참고 문서 링크)
```

**04-CONTEXT.md 예시**:
```markdown
# 협상 채팅 기능 - 개발자 배경 지식

> **목적**: 새로 합류한 에이전트가 빠르게 프로젝트 맥락을 이해
> **읽는 시간**: 10분
> **대상**: Backend, Frontend Core, Frontend UI, QA 에이전트

---

## 🏗️ 이 프로젝트의 아키텍처

### 3-Layer 구조
```
Frontend (React)
  ↓ HTTP
Backend (Cloud Functions)
  ↓ Firestore API
Database (Firestore)
```

**이 프로젝트에서**:
- Frontend: Crew/Local 앱
- Backend: 21개 Cloud Functions (협상 4개 추가 예정)
- Database: 13개 컬렉션 (negotiation_sessions 추가 예정)

더 알아보기 → `docs/engineering/guides/design/system-architecture.md`

---

## 💾 Firestore 설계 원칙

### 새 컬렉션: negotiation_sessions
```
컬렉션 구조:
negotiation_sessions/
├── {sessionId}/
│   ├── crewId: string
│   ├── localId: string
│   ├── experienceId: string
│   ├── status: 'active' | 'completed' | 'cancelled'
│   ├── proposedPrice: number
│   ├── proposedTime: timestamp
│   ├── createdAt: timestamp
│   ├── expiresAt: timestamp (24시간 후)
│   └── messages/
│       └── {messageId}/
│           ├── senderId: string
│           ├── message: string
│           └── createdAt: timestamp
```

**설계 원칙**:
1. 한 번에 읽을 수 있는 크기 (flat하게)
2. 실시간 업데이트 필요 → Firestore Listeners
3. 보안: crewId와 localId만 자신의 세션 조회 가능

더 알아보기 → `docs/engineering/guides/reference/backend/firestore-schema-reference.md`

---

## ⚡ Policy-Driven 개발

### 동적 설정: 협상 시간 제한

**원칙**:
```
하드코딩 금지: const NEGOTIATION_TIMEOUT = 24 * 60 * 60 * 1000;

Policy 기반:
const policy = await getPolicyConfig('negotiation_system');
const timeout = policy.timeoutHours * 60 * 60 * 1000;
```

**설정 위치**:
```
Firestore (Production):
policy_configs/
└── negotiation_system/
    ├── timeoutHours: 24
    ├── minPrice: 10000
    ├── maxPrice: 100000
    └── ...
```

**Admin이 원할 때 코드 배포 없이 변경 가능**!

더 알아보기 → `docs/engineering/guides/development/policy-driven-architecture.md`

---

## 🎯 Mock 기반 병렬 개발

### 왜 Mock을 쓸까?

**문제**: Agent 1 (Backend)이 먼저 완료되어야 Agent 2 (Frontend Core)가 작업할 수 있음
```
❌ 순차적:
Agent 1 Day 1-2 → Agent 2 Day 3-4 (총 4일)
```

**해결**: Mock 사용해서 병렬화
```
✅ 병렬적:
Agent 1 Day 1-2 동시에 Agent 2 Day 1-2 (총 2일)
  (Agent 2는 Agent 1의 Mock 함수 사용)
```

### 이 프로젝트의 Mock 계획

```
Agent 1 (Backend) 구현 함수:
├── initiateNegotiation(crewId, localId, experienceId)
│   → Mock: 즉시 { sessionId, status: 'active' } 반환
├── updateNegotiation(sessionId, updates)
│   → Mock: 즉시 { success: true, updatedAt } 반환
└── completeNegotiation(sessionId)
    → Mock: 즉시 { requestId, status: 'accepted' } 반환

Agent 2 (Frontend Core) 사용 방법:
├── import { useNegotiationSession } from './hooks';
│   (Mock 또는 실제 버전 자동 선택)
└── const { session, messages } = useNegotiationSession(sessionId);
```

더 알아보기 → `docs/engineering/guides/design/interface-contracts.md`

---

## 📚 각 에이전트가 읽어야 할 문서 (역할별)

### Agent 1 (Backend)
```
필수:
1. 이 문서 (04-CONTEXT.md) - 10분
2. 03-ORCHESTRATION.md - Task 1.1-1.3 섹션만 - 5분
3. docs/engineering/guides/reference/backend/firestore-schema-reference.md - 협상 부분 - 5분

선택:
- docs/engineering/guides/development/policy-driven-architecture.md
- docs/engineering/guides/reference/backend/system-architecture-reference.md
- docs/engineering/guides/development/coding-conventions.md (Cloud Functions 섹션)

총: 20분 (필수)
```

### Agent 2 (Frontend Core)
```
필수:
1. 이 문서 (04-CONTEXT.md) - 10분
2. 03-ORCHESTRATION.md - Task 2.1-2.2 섹션만 - 5분
3. docs/engineering/guides/design/interface-contracts.md - Mock 부분 - 10분

선택:
- docs/engineering/guides/reference/frontend/routing-structure-reference.md
- docs/engineering/guides/development/agent-roles.md (Mode 1 섹션)

총: 25분 (필수)
```

### Agent 3 (Frontend UI)
```
필수:
1. 이 문서 (04-CONTEXT.md) - 10분
2. 03-ORCHESTRATION.md - Task 3.1-3.2 섹션만 - 5분
3. docs/engineering/guides/design/interface-contracts.md - Mock 부분 - 10분
4. docs/engineering/guides/reference/frontend/design-system-guide.md - 필요 시 - 10분

총: 35분 (필수)
```

### Agent 4 (QA)
```
필수:
1. 이 문서 (04-CONTEXT.md) - 10분
2. 03-ORCHESTRATION.md - Task 4.1-4.3 섹션만 - 5분
3. docs/engineering/guides/development/agent-roles.md - QA 섹션 - 5분

선택:
- docs/engineering/guides/testing/... (테스트 관련)

총: 20분 (필수)
```

---

## 🚀 새 에이전트가 받아야 할 명령어 (개선된 버전)

### Before (지금)
```
PM: "@claude Agent 1 Backend
docs/feature-hubs/negotiation-system/03-ORCHESTRATION.md를 읽고
Task 1.1, 1.2, 1.3을 구현해."
```

**문제**: 배경 지식 없음

### After (권장)
```
PM: "@claude Agent 1 Backend
다음 순서로 진행해주세요:

1. docs/feature-hubs/negotiation-system/04-CONTEXT.md 읽기 (10분)
   - 프로젝트 아키텍처 이해
   - Policy-Driven 개발 패턴 이해

2. docs/feature-hubs/negotiation-system/03-ORCHESTRATION.md 읽기 (5분)
   - Task 1.1, 1.2, 1.3 섹션 읽기

3. 필요하면 참고 문서 읽기:
   - docs/engineering/guides/reference/backend/firestore-schema-reference.md
   - docs/engineering/guides/development/policy-driven-architecture.md

4. Task 1.1부터 구현 시작 (Day 1)
   - Task 1.1: initiateNegotiation (TDD)
   - Task 1.2: updateNegotiation (TDD)
   - Task 1.3: completeNegotiation (TDD)
"
```

**개선점**: 명확한 학습 경로 + 참고 문서 명시

---

## 📋 Orchestrator가 작성해야 할 문서들 (확장된 버전)

### Phase 0 (Orchestrator)

```
총 작성 시간: 2-3시간

📄 01-PRD.md (45분)
└─ 사용자 요구사항 상세

📄 02-RFC.md (45분)
└─ 기술 설계

📄 03-ORCHESTRATION.md (30분)
└─ Task 명시 + 의존성

📄 04-CONTEXT.md (NEW - 30분)
└─ 배경 지식 (이 문서 같은 형식)
   ├─ 아키텍처 요약
   ├─ 프레임워크 설명
   ├─ Mock 전략
   └─ 각 에이전트별 학습 경로

📄 05-POLICY-SETUP.md (NEW - 15분)
└─ Policy 설정 상세
   ├─ policy_configs 구조
   ├─ 어떤 값을 정책화할 것인가
   └─ Admin이 수정할 수 있는 항목

📄 06-AGENT-REFERENCES.md (NEW - 15분)
└─ 각 에이전트별 추천 문서
   ├─ Backend 에이전트: 읽을 문서 목록
   ├─ Frontend Core 에이전트: 읽을 문서 목록
   ├─ Frontend UI 에이전트: 읽을 문서 목록
   └─ QA 에이전트: 읽을 문서 목록
```

---

## ✅ 최종 권장 방식 (방안 2)

### Orchestrator 관점

```
Step 1: Mode 1 (병렬) 결정
  ↓
Step 2: 분석 & 기획
  ├─ 01-PRD.md 작성 (45분)
  ├─ 02-RFC.md 작성 (45분)
  └─ 이 과정에서 얻은 지식을 정리
  ↓
Step 3: 에이전트용 문서 작성
  ├─ 03-ORCHESTRATION.md (30분) - Task 명시
  ├─ 04-CONTEXT.md (30분) - 배경 지식 요약
  ├─ 05-POLICY-SETUP.md (15분) - Policy 설정
  └─ 06-AGENT-REFERENCES.md (15분) - 참고 문서 링크
  ↓
Step 4: 각 에이전트 투입
  ├─ Agent 1: Session B 오픈
  ├─ Agent 2: Session C 오픈
  ├─ Agent 3: Session D 오픈
  └─ Agent 4: Session E 오픈
```

### 각 에이전트 관점

```
Session B (Agent 1 Backend):
PM: "04-CONTEXT.md → 03-ORCHESTRATION.md (Task 1 섹션) → 구현"

→ 20-30분 학습 후 자신 있게 구현 시작

VS 기존:
PM: "03-ORCHESTRATION.md → 구현"
→ 5분 후 "잠깐, Policy-Driven이 뭐지?" (막힘)
```

---

## 📊 4가지 방안 비교

| 방안 | 내용 | 장점 | 단점 | 추천 |
|------|------|------|------|------|
| **1** | 03-ORCHESTRATION.md만 강화 | 한 문서로 완결 | 너무 길어짐, 작성 오래 | ❌ |
| **2** | 04-CONTEXT.md + 05-POLICY + 06-REFERENCES 추가 | 역할별 학습경로 명확, 모듈화 | 작성할 문서 3개 더 많음 | ✅ |
| **3** | PM이 각 세션마다 상세 지시사항 제공 | 에이전트 부담 최소 | PM의 작업 증가, 불일치 위험 | ⚠️ |
| **4** | 온보딩 세션 추가 (Orchestrator가 각 에이전트를 1:1 설명) | 명확성 최대 | 시간 오래 걸림, 불효율 | ❌ |

---

## 🎯 결론: 권장 프로세스

### Phase 0 (Orchestrator, 2.5-3시간)

```
1. 01-PRD.md 작성 (45분)
2. 02-RFC.md 작성 (45분)
3. 03-ORCHESTRATION.md 작성 (30분)
4. 04-CONTEXT.md 작성 (30분) ← NEW
5. 05-POLICY-SETUP.md 작성 (15분) ← NEW
6. 06-AGENT-REFERENCES.md 작성 (15분) ← NEW
```

### Phase 1 (에이전트들, 병렬)

```
Session B: Agent 1 Backend
1. 04-CONTEXT.md (10분) - 배경 지식
2. 03-ORCHESTRATION.md Task 1 (5분)
3. 06-AGENT-REFERENCES.md Backend 섹션 (5분)
4. 참고 문서 (필요하면)
5. 구현 시작 (Day 1)

[동시에]

Session C: Agent 2 Frontend Core
1. 04-CONTEXT.md (10분)
2. 03-ORCHESTRATION.md Task 2 (5분)
3. 06-AGENT-REFERENCES.md Frontend Core 섹션 (5분)
4. 구현 시작 (Day 1)

[동시에]

Session D: Agent 3 Frontend UI
1. 04-CONTEXT.md (10분)
2. 03-ORCHESTRATION.md Task 3 (5분)
3. 06-AGENT-REFERENCES.md Frontend UI 섹션 (10분)
4. 구현 시작 (Day 1)
```

### 총 소요 시간

```
기존:
- Orchestrator 준비: 2시간 (01-PRD, 02-RFC, 03-ORCHESTRATION)
- 에이전트 투입: 5분 (03-ORCHESTRATION.md만)
- 에이전트 학습 중 충돌: 불가피

개선:
- Orchestrator 준비: 3시간 (6개 문서)
- 에이전트 투입: 20-30분 학습 후 자신 있게 시작
- 에이전트 생산성: 크게 향상
```

**추가 1시간은 충분히 보상됨**: 에이전트들의 질문 감소, 오류 감소, 생산성 증가

---

## 🔄 Phase 버전 관리 전략 (Version Control)

> **목적**: Phase 간 변경 사항을 명확히 추적하고, 롤백 및 의존성 관리를 체계화
> **추가일**: 2025-12-27

### 왜 버전 관리가 중요한가?

Wave Orchestration에서 각 Phase는 이전 Phase의 결과에 의존합니다. 버전 관리 없이는:
- ❌ "Phase 2에서 왜 실패했는지 모르겠다"
- ❌ "Phase 1의 어떤 변경이 문제를 일으켰는지?"
- ❌ "롤백하려면 어떤 상태로 돌아가야 하는지?"

### Phase 버전 스키마

```json
{
  "wave_id": "wave_2025-12-27_gallery-refactor",
  "phase": 2,
  "version": "2.1.0",
  "semantic": {
    "major": 2,
    "minor": 1,
    "patch": 0
  },
  "parent_version": "1.3.0",
  "timestamp": "2025-12-27T14:30:00Z",
  "hash": "a7f3e2d1",
  "changes": {
    "added": ["useGallery hook", "ImageLightbox component"],
    "modified": ["GalleryGrid props interface"],
    "removed": []
  },
  "dependencies": {
    "phase_1": {
      "version": "1.3.0",
      "required_outputs": ["getImageMetadata API", "image_metadata schema"]
    }
  },
  "rollback_point": {
    "available": true,
    "cache_path": "/cache/wave_2025-12-27_phase1_v1.3.0"
  }
}
```

### 버전 번호 규칙 (Semantic Versioning for Phases)

```
{Phase}.{Iteration}.{Hotfix}

예시:
1.0.0  → Phase 1 초기 완료
1.1.0  → Phase 1 에이전트 피드백 후 개선
1.1.1  → Phase 1 핫픽스 (버그 수정)
2.0.0  → Phase 2 시작 (Phase 1 완료 후)
2.1.0  → Phase 2 첫 번째 이터레이션 완료
```

### 변경 추적 프로토콜

**각 Phase 시작 시**:
```markdown
## Phase {N} 변경 로그

### 시작 상태
- 부모 버전: {parent_version}
- 의존성: {dependencies}

### 변경 사항 (실시간 업데이트)
| 시간 | Agent | 변경 유형 | 설명 | 파일 |
|------|-------|----------|------|------|
| 14:30 | Backend | ADD | getImageMetadata 함수 | functions/gallery.js |
| 14:45 | Frontend | MODIFY | useGallery hook 인터페이스 | src/hooks/useGallery.js |

### 완료 상태
- 최종 버전: {final_version}
- 다음 Phase 입력: {outputs for next phase}
```

### 롤백 전략

**Level 1: Hotfix (동일 Phase 내)**
```
현재: 2.1.1
문제 발생 → 2.1.0으로 롤백
방법: Git revert + cache 복원
```

**Level 2: Phase 롤백 (이전 Phase로)**
```
현재: Phase 3
문제 발생 → Phase 2 완료 상태로 롤백
방법:
1. cache에서 Phase 2 최종 상태 로드
2. Phase 3 변경 사항 폐기
3. Phase 3 재시작 (새 전략으로)
```

**Level 3: 전체 Wave 롤백 (드물게)**
```
현재: Wave 진행 중
심각한 설계 결함 발견
방법:
1. 모든 Phase 변경 폐기
2. Phase 0 (설계)부터 재검토
3. 새 Wave 시작
```

### Orchestrator 버전 관리 체크리스트

```
Phase 시작 전:
- [ ] 이전 Phase 버전 확인 (parent_version)
- [ ] 의존성 검증 (required_outputs 존재 확인)
- [ ] 새 Phase 버전 번호 할당

Phase 진행 중:
- [ ] 각 변경 사항 실시간 로깅
- [ ] 중요 체크포인트에서 cache 스냅샷 저장
- [ ] 버전 번호 업데이트 (major change 시)

Phase 완료 시:
- [ ] 최종 버전 태깅
- [ ] 변경 로그 마무리
- [ ] 다음 Phase를 위한 outputs 문서화
- [ ] 롤백 포인트 저장 (cache)
```

### 버전 충돌 예방 (Conflict Prevention)

> **원칙**: "예방이 치료보다 낫다" - 충돌 발생 전에 감지하고 방지

#### 1. Optimistic Concurrency Control (Lock-Free)

```
작동 원리:
├─ 각 Agent가 작업 시작 시 대상 파일의 현재 버전 기록
├─ 작업 완료 시 버전 변경 여부 확인
├─ 변경됨 → 자동 리베이스 또는 Orchestrator 알림
└─ 변경 없음 → 정상 커밋

예시:
Agent 2 작업 시작: schema.js (v1.2.0)
  ... 작업 중 ...
Agent 1이 schema.js를 v1.3.0으로 업데이트
  ... Agent 2 작업 완료 ...
Agent 2 커밋 시도:
  → 버전 체크: v1.2.0 ≠ v1.3.0 (변경됨!)
  → 자동 알림: "schema.js가 Agent 1에 의해 변경됨"
  → 옵션: (A) 리베이스 후 재시도 (B) Orchestrator 조율 요청
```

#### 2. 자동 Branch 분기 권고

```
감지 조건:
├─ 같은 Phase에서 2명 이상이 동일 파일 수정 계획
├─ 파일 복잡도가 높음 (100줄+)
└─ 수정 범위가 겹침 (같은 함수/컴포넌트)

자동 권고:
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ 충돌 위험 감지                                              │
│                                                                 │
│  파일: src/hooks/useGallery.js                                  │
│  수정 예정: Agent 2 (Frontend Core), Agent 3 (Frontend UI)      │
│  수정 범위 중복: fetchImages 함수                               │
│                                                                 │
│  권고: 개별 브랜치에서 작업 후 순차 머지                          │
│  ├─ Agent 2: wave/gallery/phase-2/frontend-core                 │
│  └─ Agent 3: wave/gallery/phase-2/frontend-ui                   │
│                                                                 │
│  머지 순서: Agent 2 완료 → Agent 3 리베이스 → Agent 3 머지      │
└─────────────────────────────────────────────────────────────────┘
```

#### 3. Merge-Conflict 조기 경고 시스템

```
Phase 시작 시 자동 분석:
├─ 모든 Agent의 수정 대상 파일 수집
├─ 파일별 수정 예정 Agent 매핑
├─ 잠재적 충돌 파일 식별
└─ 경고 등급 부여

경고 등급:
🔴 HIGH:   3명+ 동일 파일 수정 예정 → 즉시 분할 권고
🟡 MEDIUM: 2명 동일 파일 수정 예정 → 순서 조율 권고
🟢 LOW:    1명만 수정 예정 → 정상 진행

예시 대시보드:
┌─────────────────────────────────────────────────────────────────┐
│  📊 Phase 2 충돌 위험 분석                                       │
├─────────────────────────────────────────────────────────────────┤
│  🔴 HIGH (즉시 조율 필요):                                       │
│     └─ schema.js: Agent 1, 2, 3 모두 수정 예정                  │
│                                                                 │
│  🟡 MEDIUM (순서 권고):                                          │
│     ├─ useGallery.js: Agent 2, 3 수정 예정                      │
│     └─ GalleryGrid.jsx: Agent 3, 4 수정 예정                    │
│                                                                 │
│  🟢 LOW (정상 진행):                                             │
│     └─ 기타 12개 파일                                            │
└─────────────────────────────────────────────────────────────────┘
```

#### 4. 자동 Interface Lock

```
특정 파일에 대한 수정 권한을 일시적으로 단일 Agent에게 할당

사용 시점:
├─ 핵심 인터페이스 파일 (types.ts, schema.js 등)
├─ 공유 컴포넌트/훅
└─ API 계약 정의 파일

작동 방식:
Agent 1: "schema.js 수정 시작" → Orchestrator에게 Lock 요청
Orchestrator: Lock 승인 (30분 타임아웃)
Agent 2: "schema.js 수정 시도" → Lock 거부
  → 알림: "schema.js는 Agent 1이 수정 중 (예상 완료: 14:30)"
  → 옵션: (A) 대기 (B) 다른 작업 먼저 (C) Lock 해제 요청

Lock 해제:
├─ Agent 1 작업 완료 → 자동 해제
├─ 30분 타임아웃 → 자동 해제 + 경고
└─ PM 명시적 해제 → 강제 해제
```

---

### 버전 충돌 해결 (Conflict Resolution)

**상황**: 예방에도 불구하고 충돌 발생 시

```
해결 전략:
1. 우선순위 규칙 (Backend > Frontend > UI)
2. 명시적 Lock 메커니즘
3. 충돌 발생 시 Orchestrator에게 에스컬레이션

예시:
Agent 1 (Backend): schema.js 수정 (v1.2.0 → v1.3.0)
Agent 2 (Frontend): schema.js 수정 시도
  → 충돌 감지
  → Orchestrator에게 보고
  → Orchestrator: "Agent 1 완료 후 Agent 2 진행" 결정
  → Agent 2: Agent 1의 v1.3.0 기반으로 수정
```

### 버전 관리 도구 연동

```
Git Integration:
- 각 Phase = Git branch
- 각 Version = Git tag
- 롤백 = Git revert/reset

예시 브랜치 전략:
main
└── wave/gallery-refactor
    ├── phase-1  (v1.0.0 ~ v1.3.0)
    ├── phase-2  (v2.0.0 ~ v2.1.0)
    └── phase-3  (v3.0.0 ~ )
```

---

## 📄 CLAUDE.md 관리 프로토콜

> **목적**: 세션 간 컨텍스트 휘발 방지, 새 에이전트 핸드오프 최적화
> **추가일**: 2026-01-12

### 왜 CLAUDE.md인가?

```
문제:
├─ 긴 세션 → 컨텍스트 토큰 한계 → 휘발
├─ 새 세션 시작 → 이전 진행상황 모름
└─ 에이전트 교체 → 암묵지 손실

해결:
└─ CLAUDE.md = Single Source of Truth
   ├─ 현재 상태 (status)
   ├─ 다음 액션 (next_action)
   └─ 핵심 컨텍스트 (압축 포맷)
```

### CLAUDE.md 포맷 원칙

```yaml
# 핵심 원칙: AI 에이전트 최적화
target_reader: AI_agent (NOT human)
format: compressed_yaml
goal: max_context_density + min_tokens

# 포맷 규칙
rules:
  - yaml_inline: "{key:val, key2:val2}"
  - array_compact: "[a,b,c]"
  - comments_inline: "#reason"
  - pk_notation: "field*"
  - fk_notation: "field→collection"
  - enum_notation: "[opt1|opt2|opt3]"
  - status_emoji: "✅❌🔄⏳"
  - path_glob: "path/[a,b,c].md"
```

### CLAUDE.md 필수 섹션

```yaml
# 1. 헤더 (상태 + 다음액션) - 가장 중요
v: {version}
date: {YYYY-MM-DD}
project: {one-line-description}
tech: {stack/summary}
status:
  phase_n: {emoji}
  current_work: {description}
next_action: "{specific_instruction}"

# 2. 온보딩 (새 에이전트용)
onboarding:
  ask_first: "{options}"
  docs: {path_mappings}

# 3. 에셋 참조 (문서 위치)
assets:
  foundation: {paths}
  planning: {paths}
  feature_hubs: {paths}

# 4. 락된 결정사항 (변경불가)
locked_decisions:
  key: value #reason

# 5. 아키텍처 (압축)
arch:
  frontend: {inline_yaml}
  backend: {inline_yaml}
  infra: {inline_yaml}

# 6. DB 스키마 (압축)
db_schema:
  collection: {field*, field→ref, field[]}

# 7. 커맨드 참조
commands:
  category: {cmd_mappings}

# 8. 변경로그
changelog:
  - {v, d, c}
```

### 업데이트 트리거

```yaml
when_to_update:
  - phase_transition: "상태 변경 시"
  - milestone_complete: "PRD/RFC/구현 완료 시"
  - decision_made: "중요 결정사항 확정 시"
  - session_handoff: "세션 종료/교체 전"
  - context_at_risk: "컨텍스트 75%+ 사용 시"

what_to_update:
  always:
    - status section
    - next_action
    - changelog (new entry)
  conditional:
    - locked_decisions (if new decision)
    - db_schema (if schema change)
    - arch (if architecture change)
```

### 버전 관리

```yaml
versioning:
  format: "{major}.{minor}"
  increment:
    major: "phase transition"
    minor: "milestone within phase"

  example:
    - "5.0": "Phase 1 시작"
    - "5.1": "PRD 3개 완료"
    - "5.2": "CLAUDE.md 압축포맷 전환"
    - "6.0": "Phase 2 시작"
```

### 압축 전후 비교

```yaml
before (human-readable):
  lines: 265
  readability: high
  token_efficiency: low

after (ai-optimized):
  lines: 125
  readability: medium (for humans)
  token_efficiency: high (53% 압축)

tradeoff: "인간 가독성 ↓ | AI 파싱효율 ↑"
decision: "AI 에이전트가 주 독자이므로 압축 선택"
```

### 새 에이전트 핸드오프 프로토콜

```
새 세션 시작 시:
1. CLAUDE.md 읽기 (필수, 최우선)
2. status.next_action 확인
3. 해당 작업의 feature-hub 문서 참조
4. 작업 완료 후 CLAUDE.md 업데이트

컨텍스트 위험 감지 시:
1. 현재 진행상황 CLAUDE.md에 기록
2. next_action 구체적으로 명시
3. 새 세션에서 이어서 작업 가능하도록 보장
```

### 체크리스트

```
세션 시작:
- [ ] CLAUDE.md 읽기
- [ ] status 확인
- [ ] next_action 파악

작업 중:
- [ ] 중요 결정 시 locked_decisions 업데이트
- [ ] 마일스톤 완료 시 status 업데이트

세션 종료:
- [ ] status 최신화
- [ ] next_action 명확히 기술
- [ ] changelog 추가
- [ ] version increment
```
