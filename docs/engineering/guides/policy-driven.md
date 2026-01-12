# Policy-Driven Architecture Implementation Guide

> **Document Purpose**: 플랫폼의 정책 변화에 신속하게 대응하고, 기존 기능에 미치는 영향을 최소화하기 위한 실행 가이드
> **Note**: 이 문서는 템플릿입니다. 프로젝트별로 예시를 수정하세요.
>
> **Audience**: 개발 엔지니어, AI 개발 에이전트
>
> **Status**: Active Implementation (v1.0)

---

## 📖 목차

1. [아키텍처 개요](#1-아키텍처-개요)
2. [구현 로드맵](#2-구현-로드맵)
3. [단계별 마이그레이션](#3-단계별-마이그레이션)
4. [정책 변화 프로세스](#4-정책-변화-프로세스)
5. [운영 가이드](#5-운영-가이드)

---

## 1. 아키텍처 개요

### 1.1 핵심 개념

**Policy-Driven Architecture**란 플랫폼의 비즈니스 규칙(정책)을 코드에서 분리하여, 정책 변화 시 **코드 수정 없이 설정만 변경하는 아키텍처**입니다.

### 1.2 핵심 이점

| 이점 | 설명 | 기존 방식 대비 |
|------|------|--------------|
| **신속한 정책 변화** | 새 정책 적용까지 시간 단축 | 코드 수정 → 테스트 → 배포 (days) → 설정 변경 (hours) |
| **코드 변경 최소화** | 정책 변화 시 비즈니스 로직 untouched | 5개+ 파일 수정 → 0개 파일 수정 |
| **위험 감소** | Feature Flag로 안전한 점진적 적용 | 일괄 배포 → A/B 테스트, 1% → 10% → 100% |
| **감사 추적** | 정책 변화 이력 자동 기록 | 수동 문서화 → 자동 버전 관리 |
| **에이전트 개발 용이** | AI 에이전트도 정책 기반 개발 가능 | 정책 파악 후 자동 구현 |

### 1.3 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                    User-Facing Features                      │
│   (Premium Tiers, Refund, Strikes, Search Boost, etc.)      │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│  Business Logic  │      │  Policy Service  │  ◄── 정책을 로드/관리
│   (services/)    │      │  (policyService) │
└──────────────────┘      └────────┬─────────┘
        ▲                          │
        │                          ▼
        │              ┌───────────────────────┐
        └──────────────│  Policy Configs       │
                       │  (Firestore)          │
                       │  - trust_safety       │
                       │  - refund             │
                       │  - premium            │
                       │  - ... (extensible)   │
                       └───────────────────────┘
                                   ▲
                                   │
                       ┌───────────┴───────────┐
                       ▼                       ▼
                ┌─────────────┐        ┌─────────────┐
                │   Feature   │        │    Admin    │
                │   Flags     │        │   Console   │
                │  (A/B Test) │        │  (UI Admin) │
                └─────────────┘        └─────────────┘
```

---

## 2. 구현 로드맵

### Phase 1: Foundation (Week 1-2)
**목표**: PolicyService 및 정책 저장소 구축

#### 작업 항목
- [ ] `services/policyService.js` 생성
- [ ] Firestore `policy_configs` 컬렉션 초기화
- [ ] 기본 정책 정의 (trust_safety, refund, premium)
- [ ] 캐싱 및 폴백 메커니즘 구현
- [ ] 단위 테스트 작성

#### 체크포인트
```bash
npm run test:run  # policyService 테스트 100% 통과
```

### Phase 2: Migration (Week 3-4)
**목표**: 기존 하드코딩된 정책을 PolicyService로 마이그레이션

#### 우선순위 (먼저 마이그레이션)
1. **Trust & Safety**: Strike 관련 로직
   - `functions/index.js` - Strike 트리거 로직
   - `services/trustSafety.js` - Strike 추가/확인 로직

2. **Credit/Refund**: 환불 및 보상 크레딧
   - `services/creditService.js` - 환불 계산
   - `functions/creditHandling.js` - 트랜잭션 처리

3. **Premium Economy**: Premium Tier 정책
   - `utils/premiumConfig.js` - Tier 설정
   - `utils/matchingScore.js` - Search Boost 계산

#### 체크포인트
```bash
npm run test:run  # 마이그레이션된 함수 회귀 테스트 통과
npm run build     # 빌드 성공
```

### Phase 3: Feature Flags (Week 5)
**목표**: 정책 변화를 위한 Feature Flag 시스템 구축

#### 작업 항목
- [ ] `feature_flags` Firestore 컬렉션 생성
- [ ] PolicyService에 Feature Flag 지원 추가
- [ ] Admin 콘솔에서 Feature Flag 관리 UI 추가
- [ ] A/B 테스트 시나리오 정의

### Phase 4: Admin Console (Week 6)
**목표**: 관리자가 정책을 직접 변경할 수 있는 UI 제공

#### 작업 항목
- [ ] Admin 페이지에 "Policies" 섹션 추가
- [ ] 정책 조회/수정 UI
- [ ] 변경 로그 조회
- [ ] Policy 롤백 기능

---

## 3. 단계별 마이그레이션

### 3.1 Trust & Safety (Strike 정책) 마이그레이션 예시

**기존 코드**:
```javascript
// functions/index.js
exports.onNoShowReported = functions.firestore
  .document('requests/{docId}')
  .onUpdate(async (change) => {
    const request = change.after.data();

    if (request.status === 'no_show_local') {
      // 하드코딩된 정책
      const user = await admin.firestore().collection('users').doc(request.localId).get();
      const strikes = user.data().strikes || [];

      strikes.push({
        severity: 1,                    // ← 하드코딩
        reason: 'no_show',
        issuedAt: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)  // ← 하드코딩
      });

      // Ban 적용
      if (strikes.length >= 3) {  // ← 하드코딩
        await admin.firestore().collection('users').doc(request.localId).update({
          accountStatus: 'banned'
        });
      }
    }
  });
```

**마이그레이션된 코드**:
```javascript
// functions/index.js
import { getPolicyConfig } from '../services/policyService';

exports.onNoShowReported = functions.firestore
  .document('requests/{docId}')
  .onUpdate(async (change) => {
    const request = change.after.data();

    if (request.status === 'no_show_local') {
      // 정책 서비스에서 로드
      const { noShowSeverity, strikeExpiryDays, strikeBanThreshold } =
        await getPolicyConfig('trust_safety');

      const user = await admin.firestore().collection('users').doc(request.localId).get();
      const strikes = user.data().strikes || [];

      strikes.push({
        severity: noShowSeverity,  // ← 정책에서 로드
        reason: 'no_show',
        issuedAt: new Date(),
        expiryDate: new Date(Date.now() + strikeExpiryDays * 24 * 60 * 60 * 1000)  // ← 정책
      });

      // Ban 적용
      if (strikes.length >= strikeBanThreshold) {  // ← 정책
        await admin.firestore().collection('users').doc(request.localId).update({
          accountStatus: 'banned'
        });
      }
    }
  });
```

**정책 설정 (Firestore)**:
```javascript
// policy_configs/trust_safety
{
  docId: "trust_safety",
  version: "2025-12-19",
  policies: {
    noShowSeverity: 1,
    strikeExpiryDays: 365,
    strikeBanThreshold: 3,
    // ... 다른 정책들
  }
}
```

### 3.1.1 Premium 정책 문서

**목적**: Premium Tier별 설정 및 기능 제어 (사용자 등급, 가격, 기능 제한, 검색 부스트)

**정책 설정 (Firestore)**:
```javascript
// policy_configs/premium
{
  docId: "premium",
  version: "2025-12-24",
  tiers: {
    basic: {
      name: "Basic",
      price: 0,
      maxRequests: 10,
      matchMultiplier: 1.0,
      features: {
        interests: "blurred",
        interestCount: 0,
        searchBoost: false
      }
    },
    verified_pro: {
      name: "Verified Pro",
      price: 29900,
      maxRequests: 100,
      matchMultiplier: 1.2,
      features: {
        interests: "partial",
        interestCount: 2,
        searchBoost: true
      }
    },
    elite: {
      name: "Elite",
      price: 99900,
      maxRequests: -1,  // 무제한
      matchMultiplier: 1.5,
      features: {
        interests: "full",
        interestCount: 5,
        searchBoost: true
      }
    }
  },
  version: "2025-12-24",
  updatedAt: "timestamp"
}
```

**사용 예시**:
```javascript
const { tiers } = await getPolicyConfig('premium');
const userTier = user.premiumTier || 'basic';
const tierConfig = tiers[userTier];
const matchScore = baseScore * tierConfig.matchMultiplier;
```

### 3.2 마이그레이션 체크리스트

각 정책을 마이그레이션할 때:

```markdown
## 마이그레이션 체크리스트

- [ ] **PolicyService 호출 위치 파악**
  - 이 정책 값을 사용하는 모든 파일 찾기
  - Grep 검색: `const XXX = 3` 또는 `>= 3`

- [ ] **정책 구조 설계**
  - Firestore 문서 구조 정의
  - 기본값(fallback) 설정

- [ ] **PolicyService 추가**
  - `getPolicyConfig('policy_name')` 호출 추가
  - 캐싱 확인

- [ ] **기존 코드 수정**
  - 하드코딩된 값 → 정책 변수로 변경
  - 모든 호출 위치 검토

- [ ] **테스트**
  - 기존 테스트 통과 확인
  - 새로운 정책 값으로 회귀 테스트

- [ ] **문서화**
  - 정책 정의서 업데이트
  - 변경 로그 기록
```

---

## 4. 정책 변화 프로세스

### 4.1 정책 변화 요청 흐름

```
Product Team 요청
    ↓
1. Policy Specification (정책 정의서 작성)
    - 현재 정책
    - 변경 사항
    - 이유/영향
    ↓
2. 기술 팀 검토
    - 영향받는 코드 파악
    - 마이그레이션 필요 여부
    - 테스트 계획
    ↓
3. PolicyService 구현 (필요시)
    - 새로운 정책 추가
    - Feature Flag 설정
    ↓
4. A/B 테스트 & Rollout
    - 1% → 10% → 50% → 100%
    - 메트릭 모니터링
    ↓
5. 문서 업데이트 & 완료
    - CHANGELOG 기록
    - Product 문서 업데이트
```

### 7.2 정책 변화 문서 예시

**문서**: `docs/product/policies/POLICY_CHANGE_[DATE].md`

```markdown
# Refund Policy Change - 2025-12-25

## 변경 사항
- Crew No-Show 환불율: 0% → 50% (점진적)
- Compensation Credits 추가

## 이유
- Crew 이탈률 감소
- 플랫폼 신뢰도 향상

## 영향받는 코드
- `services/creditService.js` - processRefund()
- `functions/creditHandling.js` - onRequestCompleted()

## 마이그레이션 상태
- [x] PolicyService 구현
- [x] Feature Flag 설정
- [ ] 1% 롤아웃 (12/25)
- [ ] 10% 롤아웃 (12/26)
- [ ] 100% 롤아웃 (12/27)

## 롤백 계획
- Feature Flag 비활성화 시 즉시 롤백 가능
- Firestore 정책 복구: 1시간 내

## 메트릭
- Crew 활동률
- Refund 비용
- User 만족도
```

### 7.3 정책 버전 관리 및 Changelog

**Firestore 정책 구조** (버전 관리 포함):

```javascript
{
  docId: "refund",
  version: "2025-12-25",  // ISO 날짜로 버전 관리
  effectiveDate: new Date("2025-12-25"),
  policies: { /* ... */ },

  // 변경 이력 자동 기록
  changelog: [
    {
      date: new Date("2025-12-25"),
      version: "2025-12-25",
      change: "Increased crew no-show refund from 0% to 50%",
      author: "product@{project_domain}.com",
      reason: "Reduce crew churn and improve platform trust",
      featureFlag: "refund_policy_v2",
      rolloutPhase: "started_1_percent"
    },
    {
      date: new Date("2025-12-20"),
      version: "2025-12-20",
      change: "Initial refund policy implementation",
      author: "engineering@{project_domain}.com"
    }
  ]
}
```

---

## 8. 운영 가이드

### 8.1 정책 조회 API

**개발자가 정책을 사용할 때**:

```javascript
// 방법 1: 기본 정책 로드
const policy = await getPolicyConfig('trust_safety');

// 방법 2: 사용자별 A/B 테스트 정책
const policy = await getPolicyConfig('refund', userId);

// 방법 3: 폴백 지원
const policy = await getPolicyConfig('premium', userId).catch(() => ({
  tiers: { basic: { searchBoost: 1.0 } }  // 기본값
}));
```

### 8.2 정책 업데이트 API (관리자)

```javascript
// Admin 콘솔에서 호출
import { updatePolicyConfig } from '../../services/policyService';

await updatePolicyConfig('refund', {
  refundRates: {
    local_no_show: 1.0,
    crew_no_show: 0.5  // 변경됨: 0.0 → 0.5
  }
}, 'Increased crew no-show refund to improve retention');
```

### 8.3 Feature Flag 롤아웃 전략

**1. 초기 롤아웃 (1%)**:
```javascript
// feature_flags/policy_experiments
{
  refund_policy_v2: {
    enabled: true,
    rollout: { percentage: 1 },
    config: { /* 새 정책 */ }
  }
}
```

**2. 모니터링** (24시간):
- 에러율 증가 여부
- Refund 비용 변화
- User 피드백

**3. 단계적 확대**:
```javascript
// Day 1: 10%
{ rollout: { percentage: 10 } }

// Day 2: 50%
{ rollout: { percentage: 50 } }

// Day 3: 100% (모든 사용자)
{ rollout: { percentage: 100 } }
```

**4. 완료 후 정리**:
```javascript
// Feature Flag 제거 또는 아카이브
// policy_configs에만 남겨둠
```

### 8.4 문제 해결 (Troubleshooting)

#### 문제 1: 정책이 로드되지 않음
```javascript
// 원인: Firestore 미연결, 캐시 오래됨
// 해결:
1. Firestore 연결 확인
2. 캐시 만료 확인 (5분)
3. 폴백 정책이 적용되었는지 확인
```

#### 문제 2: 정책 변화가 즉시 반영되지 않음
```javascript
// 원인: 캐시 TTL (Time To Live)
// 해결:
1. CACHE_TTL을 줄임 (5분 → 1분)
2. 또는 admin 패널에서 "캐시 무효화" 버튼
3. 또는 PolicyService.clearCache() 호출
```

#### 문제 3: A/B 테스트 분석이 어려움
```javascript
// 원인: 사용자 그룹 추적 불가
// 해결:
1. analytics_events에 feature_flag 정보 기록
2. BigQuery로 쿼리 분석
3. 대시보드 구성
```

### 8.5 모니터링 체크리스트

정책 변화 시 모니터링할 메트릭:

```markdown
## 정책 변화 모니터링

### Real-Time (변화 직후)
- [ ] 에러 로그 확인 (Sentry, Firebase)
- [ ] API 응답 시간
- [ ] 정책 캐시 히트율

### 24-Hour
- [ ] 영향받는 사용자 그룹 분석
- [ ] 비즈니스 메트릭 변화
  - Refund: 비용 증감
  - Premium: 업그레이드율 변화
  - Strikes: 적용율 변화

### 7-Day
- [ ] 누적 영향 분석
- [ ] User Satisfaction 피드백
- [ ] 롤아웃 결정 (계속 확대 vs 롤백)
```

---

## 부록 A: 정책 설정 템플릿

### A.1 새로운 정책 추가

```javascript
// policy_configs/[new_policy_name]
{
  docId: "[new_policy_name]",
  version: new Date().toISOString().split('T')[0],
  effectiveDate: new Date(),
  policies: {
    // 정책 필드들
  },
  changelog: [
    {
      date: new Date(),
      version: new Date().toISOString().split('T')[0],
      change: "Initial policy creation",
      author: "engineering@{project_domain}.com"
    }
  ]
}
```

### A.2 정책 마이그레이션 템플릿

```javascript
// before: 하드코딩
const HARD_CODED_VALUE = 3;

// after: 정책 기반
export const checkSomething = async (data) => {
  const { someValue } = await getPolicyConfig('policy_name');
  // someValue를 사용
};
```

---

## 부록 B: 자주 묻는 질문 (FAQ)

### Q1: PolicyService가 없으면 어떻게 되나?
A: 폴백 정책(기본값)이 자동으로 적용됩니다. 서비스 지속성이 보장됩니다.

### Q2: 캐시 때문에 정책이 실시간 반영 안 됨?
A: 캐시 TTL을 줄이거나, Admin 콘솔에서 "캐시 무효화" 기능 사용.

### Q3: Feature Flag 롤아웃 중 에러 발생하면?
A: 즉시 Feature Flag 비활성화. 기존 정책으로 자동 복원.

### Q4: 기존 데이터 (users, requests)는?
A: 정책 변화는 새로운 작업부터 적용. 기존 데이터 필요시 마이그레이션 스크립트.

---

**다음 단계**: [정책 기반 개발 가이드](./development-guidelines.md#9-정책-기반-아키텍처) 참조

*최종 수정: 2025-12-19*
