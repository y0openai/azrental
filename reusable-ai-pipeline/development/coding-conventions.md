# 프로젝트 개발 가이드라인

> **목적**: 새로운 개발자/AI Agent가 기존 코드에 영향을 최소화하며 기능을 확장할 수 있도록 안내
> **버전**: 1.0.0
> **최종 수정**: {YYYY-MM-DD}
> **Note**: 이 문서는 템플릿입니다. 프로젝트별로 구체적인 내용을 수정하세요.

---

## 📋 목차

1. [필수 숙지 사항](#1-필수-숙지-사항)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [코딩 컨벤션](#3-코딩-컨벤션)
4. [컴포넌트 개발 규칙](#4-컴포넌트-개발-규칙)
5. [서비스 레이어 규칙 (Frontend)](#5-서비스-레이어-규칙)
6. [상태 관리 규칙](#6-상태-관리-규칙)
7. [다국어 처리 규칙](#7-다국어-처리-규칙)
8. [에러 처리 패턴](#8-에러-처리-패턴)
9. [정책 기반 아키텍처](#9-정책-기반-아키텍처) ⭐
10. [Cloud Functions 개발 규칙 (Backend)](#10-cloud-functions-개발-규칙-backend) ⭐ **NEW**
11. [테스트 규칙](#11-테스트-규칙)
12. [금지 사항](#12-금지-사항)
13. [체크리스트](#13-체크리스트)

---

## 1. 필수 숙지 사항

### 1.1 기술 스택
- **Frontend**: React 19, Vite 7
- **상태관리**: React Context API
- **스타일**: CSS Modules, Material Design 3 (Dark Mode 기본)
- **Backend**: Firebase (Auth, Firestore, Realtime DB, Storage, FCM)
- **언어**: JavaScript (ES6+), TypeScript 미사용

### 1.2 사용자 역할
| 역할 | 기본 언어 | 주요 경로 |
|------|----------|----------|
| `{user_role_1}` | {언어} | `/{경로}` |
| `{user_role_2}` | {언어} | `/{경로}` |
| `admin` | - | `/admin/*` |

### 1.3 핵심 디자인 원칙
1. **{원칙 1}**: {설명}
2. **Mobile-First**: 모바일 기기 최적화
3. **다국어**: 한국어, 영어 지원 (필요시 추가)

---

## 2. 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── m3/              # Material Design 3 기본 컴포넌트 (Button, Card 등)
│   ├── common/          # 공통 컴포넌트 (ErrorDisplay, Loading 등)
│   ├── layout/          # 레이아웃 (Header, BottomNav, MainLayout)
│   ├── tutorial/        # 튜토리얼 시스템
│   ├── hotplaces/       # Hot Place 관련
│   ├── map/             # 지도 관련
│   └── wishlist/        # 위시리스트
│
├── contexts/            # React Context (⚠️ context/ 아님!)
│   ├── AuthContext.jsx  # 인증 상태
│   ├── LanguageContext.jsx  # 언어 설정
│   └── ThemeContext.jsx # 테마 설정
│
├── hooks/               # 커스텀 훅
│   ├── useAuth.js       # 인증 훅
│   ├── useToast.js      # 토스트 메시지
│   ├── useWishlist.js   # 위시리스트
│   └── useUnreadNotifications.js
│
├── pages/               # 페이지 컴포넌트
│   ├── auth/            # 로그인, 회원가입
│   ├── crew/            # Crew 전용 페이지
│   ├── local/           # Local 전용 페이지
│   ├── shared/          # 공통 페이지 (Chat, Notifications 등)
│   ├── lounge/          # Crew Lounge
│   └── admin/           # 관리자 페이지
│
├── services/            # Firebase 서비스 계층
│   ├── firebase.js      # Firebase 초기화
│   ├── auth.js          # 인증 함수
│   ├── firestore.js     # Firestore CRUD
│   ├── realtime.js      # Realtime DB (채팅)
│   ├── storage.js       # Storage (이미지)
│   ├── fcm.js           # Push Notification
│   └── analytics.js     # Google Analytics
│
├── utils/               # 유틸리티 함수
│   ├── translations.js  # 다국어 번역
│   ├── validation.js    # 유효성 검사
│   ├── dateUtils.js     # 날짜 처리
│   ├── currency.js      # 통화 포맷
│   └── ...
│
└── styles/              # 전역 스타일
    ├── m3-tokens.css    # 디자인 토큰
    ├── m3-motion.css    # 애니메이션
    └── responsive.css   # 반응형
```

### 2.1 Import 경로 규칙

```javascript
// ✅ 올바른 예시
import { useAuth } from '../../hooks/useAuth';
import { Button, Card } from '../../components/m3';
import { getDocument } from '../../services/firestore';
import { useTranslation } from '../../utils/translations';

// ❌ 잘못된 예시
import { AuthContext } from '../../context/AuthContext'; // context/ 아님!
import Button from '../../components/m3/Button'; // index.js 통해 import
```

---

## 3. 코딩 컨벤션

### 3.1 파일명 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `CrewHome.jsx`, `Button.jsx` |
| 훅 | camelCase + use 접두사 | `useAuth.js`, `useWishlist.js` |
| 서비스 | camelCase | `firestore.js`, `realtime.js` |
| 유틸 | camelCase | `validation.js`, `dateUtils.js` |
| 스타일 | 컴포넌트명 동일 | `CrewHome.css`, `Button.css` |

### 3.2 컴포넌트 작성 순서

```jsx
// 1. imports (외부 → 내부 순서)
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// 외부 라이브러리
import { Clock, MapPin } from 'lucide-react';
// 내부 모듈
import { useAuth } from '../../hooks/useAuth';
import { Button, Card } from '../../components/m3';
import { getDocument } from '../../services/firestore';
import { useTranslation } from '../../utils/translations';
// 스타일
import './ComponentName.css';

// 2. 컴포넌트 정의
function ComponentName() {
  // 2.1 Hooks
  const navigate = useNavigate();
  const { id } = useParams();
  const { userProfile } = useAuth();
  const t = useTranslation();

  // 2.2 State
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2.3 Derived State (useMemo)
  const filteredData = useMemo(() => {
    // ...
  }, [data]);

  // 2.4 Effects
  useEffect(() => {
    loadData();
  }, [id]);

  // 2.5 Event Handlers
  const handleClick = () => {
    // ...
  };

  // 2.6 Helper Functions (컴포넌트 내부용)
  const formatPrice = (price) => {
    // ...
  };

  // 2.7 Early Returns (Loading, Error)
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  // 2.8 Main Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
}

// 3. Export
export default ComponentName;
```

### 3.3 CSS 클래스 명명 (BEM 변형)

```css
/* 블록 */
.crew-home { }

/* 블록__요소 */
.crew-home__header { }
.crew-home__content { }
.crew-home__card { }

/* 블록__요소--상태 */
.crew-home__card--selected { }
.crew-home__button--disabled { }
```

---

## 4. 컴포넌트 개발 규칙

### 4.1 M3 컴포넌트 우선 사용

```jsx
// ✅ M3 컴포넌트 사용
import { Button, Card, Input, Chip } from '../../components/m3';

<Button variant="filled" onClick={handleClick}>
  {t('common.save')}
</Button>

// ❌ 직접 HTML 사용 지양
<button className="my-button" onClick={handleClick}>
  저장
</button>
```

### 4.2 새 컴포넌트 추가 시

1. **재사용 가능 여부 판단**
   - 2곳 이상 사용 → `components/` 폴더
   - 특정 페이지 전용 → 해당 페이지 폴더 내 `components/`

2. **M3 컴포넌트 확장 시**
   ```jsx
   // components/m3/NewComponent.jsx 생성 후
   // components/m3/index.js에 export 추가
   export { NewComponent } from './NewComponent';
   ```

### 4.3 페이지 컴포넌트 크기 제한

- **권장**: 300줄 이하
- **최대**: 500줄 (초과 시 분리 필수)
- **분리 방법**:
  - 비즈니스 로직 → 커스텀 훅으로 추출
  - UI 섹션 → 하위 컴포넌트로 분리

```jsx
// ✅ 큰 페이지 분리 예시
// pages/crew/CrewHome.jsx
import { useCrewHomeData } from './hooks/useCrewHomeData';
import { ExperienceSection } from './components/ExperienceSection';
import { LocalsSection } from './components/LocalsSection';

function CrewHome() {
  const { experiences, locals, loading } = useCrewHomeData();
  // ...
}
```

---

## 5. 서비스 레이어 규칙 (Frontend)

> **적용 대상**: `src/services/` 폴더 (React 애플리케이션)
> **Backend 개발**: [섹션 10 참조](#10-cloud-functions-개발-규칙-backend)

### 5.1 Firestore 작업

```javascript
// ✅ services/firestore.js의 함수 사용
import {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument
} from '../../services/firestore';

// 단일 문서 조회
const user = await getDocument('users', userId);

// 조건부 조회
const experiences = await getDocuments('experiences', [
  { field: 'hostId', operator: '==', value: userId },
  { field: 'active', operator: '==', value: true }
]);

// ❌ 직접 Firebase SDK 호출 금지
import { doc, getDoc } from 'firebase/firestore';  // 금지!
```

### 5.2 Realtime Database 작업

```javascript
// ✅ services/realtime.js의 함수 사용
import {
  sendMessage,
  onMessagesChange,
  createOrGetChatRoom
} from '../../services/realtime';

// 채팅방 생성/조회
const roomId = await createOrGetChatRoom(userId1, userId2);

// 메시지 리스너 (정리 필수!)
useEffect(() => {
  const unsubscribe = onMessagesChange(roomId, 50, (messages) => {
    setMessages(messages);
  });

  return () => unsubscribe();  // 🔴 반드시 정리!
}, [roomId]);
```

### 5.3 새 서비스 추가 시

1. `services/` 폴더에 새 파일 생성
2. Firebase 초기화는 `firebase.js`에서 import
3. 함수 export 패턴 통일

```javascript
// services/newService.js
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * JSDoc 주석 필수
 * @param {string} param - 파라미터 설명
 * @returns {Promise<Array>} 반환값 설명
 */
export const getNewData = async (param) => {
  try {
    // 구현
  } catch (error) {
    console.error('Error in getNewData:', error);
    throw error;  // 반드시 다시 throw
  }
};
```

---

## 6. 상태 관리 규칙

### 6.1 Context 사용 기준

| 상태 유형 | 관리 위치 | 예시 |
|----------|----------|------|
| 인증/사용자 | AuthContext | user, userProfile |
| 언어 설정 | LanguageContext | language |
| 테마 | ThemeContext | theme (dark/light) |
| 페이지 로컬 상태 | useState | loading, formData |
| 서버 데이터 | useState + useEffect | experiences, requests |

### 6.2 Context 접근

```javascript
// ✅ 커스텀 훅 사용
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';

const { user, userProfile, loading } = useAuth();
const { language, setLanguage } = useLanguage();

// ❌ 직접 useContext 지양
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
const context = useContext(AuthContext);  // 지양
```

### 6.3 새 Context 추가 시

```jsx
// 1. contexts/NewContext.jsx 생성
import { createContext, useContext, useState } from 'react';

const NewContext = createContext(null);

export function NewProvider({ children }) {
  const [state, setState] = useState(initialState);

  const value = { state, setState };

  return (
    <NewContext.Provider value={value}>
      {children}
    </NewContext.Provider>
  );
}

// 2. 커스텀 훅 export (Context 직접 노출 금지)
export function useNew() {
  const context = useContext(NewContext);
  if (!context) {
    throw new Error('useNew must be used within a NewProvider');
  }
  return context;
}

// 3. App.jsx에 Provider 추가
<NewProvider>
  <App />
</NewProvider>
```

---

## 7. 다국어 처리 규칙

### 7.1 번역 사용

```jsx
// ✅ useTranslation 훅 사용
import { useTranslation } from '../../utils/translations';

function MyComponent() {
  const t = useTranslation();

  return (
    <div>
      <h1>{t('crewHome.title')}</h1>
      <p>{t('common.loading')}</p>
    </div>
  );
}
```

### 7.2 새 번역 키 추가

```javascript
// utils/translations.js 수정
export const translations = {
  newSection: {
    newKey: {
      en: 'English text',
      ko: '한국어 텍스트',
      ja: '日本語テキスト'
    }
  }
};
```

### 7.3 동적 텍스트

```jsx
// 변수가 포함된 번역
const t = useTranslation();
const count = 5;

// ❌ 잘못된 예시
<p>{t('items.count')} {count}개</p>

// ✅ 올바른 예시 (번역 키에 플레이스홀더 사용)
// translations.js: itemCount: { en: '{count} items', ko: '{count}개', ja: '{count}件' }
<p>{t('items.itemCount').replace('{count}', count)}</p>
```

---

## 8. 에러 처리 패턴

### 8.1 서비스 레이어

```javascript
// ✅ 표준 에러 처리 패턴
export const fetchData = async (id) => {
  try {
    const data = await getDocument('collection', id);
    return data;
  } catch (error) {
    console.error('fetchData error:', error);
    throw error;  // 반드시 다시 throw
  }
};
```

### 8.2 컴포넌트 레이어

```jsx
function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchData(id);
        setData(result);
      } catch (err) {
        console.error('Failed to load:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Early returns
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={loadData} />;
  if (!data) return <EmptyState message={t('common.noData')} />;

  return <div>{/* 정상 렌더링 */}</div>;
}
```

### 8.3 ErrorBoundary 활용

```jsx
// 최상위 App은 이미 ErrorBoundary로 감싸져 있음
// 특정 섹션만 격리하려면:
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

<ErrorBoundary fallback={<SectionError />}>
  <RiskySection />
</ErrorBoundary>
```

---

## 9. 정책 기반 아키텍처

> **목적**: 정책 변화가 발생해도 기존 기능을 최소한으로 영향받도록 설계
> **원칙**: Policy-as-Data, Feature Flags, Configuration-Driven Development

### 9.1 정책 vs 기능의 명확한 분리

정책 변화가 빈번한 플랫폼 비지니스에서는 **정책을 하드코딩하지 않는 것**이 핵심입니다.

```javascript
// ❌ 절대 금지: 하드코딩된 정책
export const checkStrikeThreshold = (strikes) => {
  if (strikes.length >= 3) {  // 이 숫자가 변경되면 코드 수정 필요!
    return 'BANNED';
  }
};

export const calculateRefund = (basePrice) => {
  return basePrice * 0.5;  // 50% 환불 정책이 변경되면?
};

// ✅ 올바른 방식: 정책을 설정에서 로드
import { getPolicyConfig } from '../../services/policyService';

export const checkStrikeThreshold = async (strikes) => {
  const { strikeBanThreshold } = await getPolicyConfig('trust_safety');
  if (strikes.length >= strikeBanThreshold) {
    return 'BANNED';
  }
};

export const calculateRefund = async (basePrice, scenario) => {
  const { refundRates } = await getPolicyConfig('refund');
  const rate = refundRates[scenario] || refundRates.default;
  return basePrice * rate;
};
```

### 9.2 정책 설정 관리 (Policy Configuration Layer)

**Firestore `policy_configs` 컬렉션 구조**:

```javascript
// Firestore document: policy_configs/trust_safety
{
  docId: "trust_safety",
  version: "2025-12-19",  // ISO date로 버전 관리
  effectiveDate: timestamp,
  policies: {
    strikeBanThreshold: 3,           // 3 strikes = ban
    strikeExpiryDays: 365,           // 1년 후 자동 제거
    noShowSeverity: 1,               // no-show = 1 strike
    harassmentSeverity: 2,           // harassment = 2 strikes
    approvalsRequired: {
      localNoShow: ['crew_approval'],
      crewNoShow: ['local_approval']
    }
  },
  changelog: [
    {
      date: timestamp,
      change: "Increased strike expiry from 180 to 365 days",
      author: "admin@{project_domain}.com"
    }
  ]
}

// Firestore document: policy_configs/refund
{
  docId: "refund",
  version: "2025-12-19",
  effectiveDate: timestamp,
  policies: {
    refundRates: {
      local_no_show: 1.0,    // Local No-Show: 100% 환불
      crew_no_show: 0.0,     // Crew No-Show: 0% 환불
      mutual_cancel_24h: 1.0,
      mutual_cancel_48h: 0.75,
      disputed: 0.5          // Dispute: 50% 환불
    },
    compensationCredits: {
      local_no_show: 50,     // Crew에게 50 credits 보상
      crew_no_show: 10
    }
  }
}

// Firestore document: policy_configs/premium
{
  docId: "premium",
  version: "2025-12-19",
  effectiveDate: timestamp,
  policies: {
    tiers: {
      basic: {
        monthlyPrice: 0,
        searchBoost: 1.0,
        profileFeatures: ['basic']
      },
      verified_pro: {
        monthlyPrice: 9900,
        searchBoost: 1.2,
        profileFeatures: ['verified', 'video'],
        monthlyCredits: 5000
      },
      elite: {
        monthlyPrice: 29900,
        searchBoost: 1.5,
        profileFeatures: ['verified', 'video', 'priority'],
        monthlyCredits: 15000
      }
    }
  }
}
```

### 9.3 PolicyService 구현

**새로운 서비스 계층 추가**:

```javascript
// services/policyService.js
import { getDocument, updateDocument } from './firestore';

const POLICY_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5분

/**
 * 정책 설정 조회 (캐시 포함)
 * @param {string} policyName - 정책 이름 (e.g., 'trust_safety', 'refund')
 * @returns {Promise<Object>} 정책 객체
 */
export const getPolicyConfig = async (policyName) => {
  const cached = POLICY_CACHE.get(policyName);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const doc = await getDocument('policy_configs', policyName);
    if (!doc) {
      console.warn(`Policy not found: ${policyName}`);
      return getDefaultPolicy(policyName);
    }

    POLICY_CACHE.set(policyName, {
      data: doc.policies,
      timestamp: Date.now()
    });

    return doc.policies;
  } catch (error) {
    console.error(`Error loading policy ${policyName}:`, error);
    return getDefaultPolicy(policyName);
  }
};

/**
 * 정책 업데이트 (관리자)
 * @param {string} policyName - 정책 이름
 * @param {Object} newPolicies - 새로운 정책 객체
 * @param {string} changeDescription - 변경 사항 설명
 */
export const updatePolicyConfig = async (policyName, newPolicies, changeDescription) => {
  try {
    const current = await getDocument('policy_configs', policyName);

    const updatedDoc = {
      ...current,
      policies: newPolicies,
      version: new Date().toISOString().split('T')[0],
      effectiveDate: new Date(),
      changelog: [
        ...(current.changelog || []),
        {
          date: new Date(),
          change: changeDescription,
          author: getCurrentAdminEmail() // 관리자 인증 필요
        }
      ]
    };

    await updateDocument('policy_configs', policyName, updatedDoc);

    // 캐시 무효화
    POLICY_CACHE.delete(policyName);
  } catch (error) {
    console.error(`Error updating policy ${policyName}:`, error);
    throw error;
  }
};

/**
 * 폴백 정책 (정책 로드 실패 시)
 */
function getDefaultPolicy(policyName) {
  const defaults = {
    trust_safety: {
      strikeBanThreshold: 3,
      strikeExpiryDays: 365,
      noShowSeverity: 1
    },
    refund: {
      refundRates: {
        local_no_show: 1.0,
        crew_no_show: 0.0
      }
    },
    premium: {
      tiers: {
        basic: { searchBoost: 1.0 },
        verified_pro: { searchBoost: 1.2 },
        elite: { searchBoost: 1.5 }
      }
    }
  };

  return defaults[policyName] || {};
}
```

### 9.4 정책 기반 비즈니스 로직 작성

정책 서비스를 통해 정책을 로드한 후 사용합니다:

```javascript
// 예제 1: Strike 관련 로직
export const addStrike = async (userId, reason) => {
  const { strikeExpiryDays, noShowSeverity, harassmentSeverity } =
    await getPolicyConfig('trust_safety');

  const severity = reason === 'no_show' ? noShowSeverity : harassmentSeverity;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + strikeExpiryDays);

  // Firestore 업데이트 (중복된 strikeExpiryDays는 반복되지 않음)
  return await updateDocument('users', userId, {
    strikes: arrayUnion({
      severity,
      reason,
      issuedAt: new Date(),
      expiryDate
    })
  });
};

// Strike 확인 (자동 ban 트리거)
export const checkAndApplyBan = async (userId) => {
  const user = await getDocument('users', userId);
  const { strikeBanThreshold } = await getPolicyConfig('trust_safety');

  // 만료된 strike 제거
  const activeStrikes = user.strikes.filter(s => s.expiryDate > new Date());

  if (activeStrikes.length >= strikeBanThreshold) {
    await updateDocument('users', userId, {
      accountStatus: 'banned',
      bannedAt: new Date(),
      bannedReason: `Accumulated ${activeStrikes.length} strikes`
    });

    // 알림 전송
    await sendNotification(userId, {
      type: 'account_banned',
      title: 'Your account has been banned',
      body: `You have reached the maximum allowed violations (${strikeBanThreshold})`
    });
  }
};

// 예제 2: 환불 정책 적용
export const processRefund = async (requestId, scenario) => {
  const { refundRates, compensationCredits } = await getPolicyConfig('refund');

  const request = await getDocument('requests', requestId);
  const basePrice = request.experience.price;

  const refundRate = refundRates[scenario] || refundRates.default;
  const refundAmount = basePrice * refundRate;
  const compensationAmount = compensationCredits[scenario] || 0;

  // 트랜잭션 처리
  return await createCreditTransaction({
    userId: request.recipientId,
    amount: refundAmount + compensationAmount,
    type: 'refund',
    reason: scenario,
    relatedEntityId: requestId
  });
};

// 예제 3: Premium 정책 적용
export const calculateSearchScore = async (experienceId, userId) => {
  const { tiers } = await getPolicyConfig('premium');

  const user = await getDocument('users', userId);
  const tier = user.premiumTier || 'basic';

  const baseScore = calculateBaseScore(experienceId);
  const boost = tiers[tier].searchBoost;

  return baseScore * boost;
};
```

### 9.5 Feature Flag 패턴 (점진적 배포)

정책 변화를 Feature Flag로 A/B 테스트:

```javascript
// Firestore document: feature_flags/policy_experiments
{
  docId: "policy_experiments",
  experiments: {
    refund_policy_v2: {
      enabled: true,
      startDate: timestamp,
      endDate: timestamp,
      rollout: {
        percentage: 10,  // 10% 사용자에게만 적용
        targetUsers: ['user_id_1', 'user_id_2'],  // 특정 사용자 대상
        regions: ['korea']  // 특정 지역
      },
      config: {
        refundRates: {
          local_no_show: 1.0,
          crew_no_show: 0.5  // 기존: 0.0 → 새: 0.5 (점진적 개선)
        }
      }
    }
  }
}

// 서비스: Feature Flag 적용
export const getPolicyConfig = async (policyName, userId, context = {}) => {
  const basePolicy = await getDocument('policy_configs', policyName);
  const experiments = await getDocument('feature_flags', 'policy_experiments');

  // 활성 실험 찾기
  for (const [expName, exp] of Object.entries(experiments.experiments || {})) {
    if (exp.enabled && isUserInExperiment(userId, exp, context)) {
      // 실험 그룹의 정책으로 오버라이드
      return { ...basePolicy.policies, ...exp.config };
    }
  }

  return basePolicy.policies;
};

function isUserInExperiment(userId, experiment, context) {
  const { rollout } = experiment;

  // 특정 사용자 대상
  if (rollout.targetUsers?.includes(userId)) return true;

  // 지역 필터
  if (rollout.regions && !rollout.regions.includes(context.region)) return false;

  // 비율 롤아웃 (일관된 해싱으로 결정)
  const hash = hashUser(userId) % 100;
  return hash < rollout.percentage;
}
```

### 9.6 정책 변화 영향 분석 체크리스트

새로운 정책을 추가하거나 변경할 때:

```markdown
## 정책 변화 체크리스트

- [ ] **정책 설계 완료**
  - 정책 이름, 필드, 기본값 정의
  - Product 팀과 검증됨

- [ ] **PolicyService 구현**
  - getPolicyConfig 호출 위치 파악
  - 캐시 무효화 전략 정의

- [ ] **영향받는 비즈니스 로직 파악**
  - 이 정책을 사용하는 함수 목록
  - 기존 하드코딩된 값 → 정책 참조로 변경

- [ ] **테스트 추가**
  - 정책별 시나리오 테스트
  - Fallback (정책 미로드) 테스트
  - Feature Flag A/B 테스트

- [ ] **문서화**
  - 정책 정의서 작성 (docs/product/policies/)
  - 영향받는 코드 문서화
  - 관리자 콘솔 업데이트 (필요시)

- [ ] **배포 전략**
  - Feature Flag로 점진적 롤아웃
  - 모니터링 지표 설정
  - 롤백 계획 수립

- [ ] **기존 데이터 마이그레이션**
  - 기존 users, requests 데이터 업데이트 필요?
  - 마이그레이션 스크립트 작성
  - 데이터 유효성 검증
```

### 9.7 정책 변화 시 코드 수정 최소화 예시

**기존 (정책 하드코딩)**: 정책 변화 시 5개 파일 수정 필요
```
functions/index.js (Strike 로직 수정)
services/creditService.js (환불 로직 수정)
hooks/useStrikeStatus.js (Hook 로직 수정)
components/AdminPanel.js (관리자 UI 수정)
tests/strikes.test.js (테스트 수정)
```

**개선 (정책 외부화)**: 정책 변화 시 Firestore만 업데이트
```
policy_configs 문서만 수정
→ 모든 코드는 자동으로 새로운 정책 적용
→ Feature Flag로 점진적 테스트 가능
```

---

## 10. Cloud Functions 개발 규칙 (Backend)

> **적용 대상**: `functions/` 폴더 내 모든 Cloud Functions 코드

### 10.1 프로젝트 구조

```
functions/
├── index.js              # 엔트리포인트 (라우팅만, 200줄 이하)
├── services/             # 비즈니스 로직 (모듈화)
│   ├── {domain}Service.js
│   ├── {feature}Service.js
│   ├── {core}Service.js
│   └── notificationService.js
├── utils/                # 유틸리티 함수
│   ├── validators.js
│   └── logger.js
└── package.json
```

### 10.2 모듈화 원칙 ⭐

**핵심 원칙**: `index.js`는 얇게 유지, 로직은 서비스로 분리

```javascript
// ✅ 올바른 예시: 모듈화 방식

// 1. functions/services/{feature}Service.js (500줄)
const admin = require('firebase-admin');
const { getPolicyConfig } = require('./policyService');

/**
 * 추천 코드 처리
 * @param {string} userId - 사용자 ID
 * @param {string} referralCode - 추천 코드
 * @returns {Promise<Object>} 처리 결과
 */
exports.handleReferral = async (userId, referralCode) => {
  try {
    // 비즈니스 로직 500줄...
    const policy = await getPolicyConfig('referral');
    const reward = policy.signupBonus;

    await admin.firestore().collection('users').doc(userId).update({
      layoCredits: admin.firestore.FieldValue.increment(reward),
      referredBy: referralCode,
    });

    return { success: true, reward };
  } catch (error) {
    console.error('handleReferral error:', error);
    throw error;
  }
};

// 2. functions/index.js (1줄만 추가)
const functions = require('firebase-functions');
const referral = require('./services/{feature}Service');

exports.handleReferral = functions.https.onCall(async (data, context) => {
  return referral.handleReferral(data.userId, data.code);
});
```

```javascript
// ❌ 잘못된 예시: index.js에 모든 로직 작성

// functions/index.js (500줄+)
exports.handleReferral = functions.https.onCall(async (data, context) => {
  // 비즈니스 로직 500줄이 index.js에 직접 작성됨
  const policy = await getPolicyConfig('referral');
  // ... 500줄
});
```

### 10.3 파일명 및 Export 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| **서비스** | camelCase + Service 접미사 | `{domain}Service.js`, `{feature}Service.js` |
| **유틸** | camelCase | `validators.js`, `logger.js` |
| **Export** | CommonJS `exports.` | `exports.handleReferral = async () => {}` |
| **Import** | CommonJS `require()` | `const strike = require('./services/{domain}Service');` |

**⚠️ 주의**: Backend는 ES6 `import/export` 사용 불가 (Node.js CommonJS 환경)

### 10.4 서비스 레이어 작성 패턴

```javascript
// functions/services/{domain}Service.js

const admin = require('firebase-admin');
const { getPolicyConfig } = require('./policyService');

/**
 * Strike 추가 및 Ban 체크
 * @param {string} userId - 대상 사용자 ID
 * @param {string} reason - Strike 사유
 * @returns {Promise<Object>}
 */
exports.addStrikeAndCheck = async (userId, reason) => {
  try {
    const policy = await getPolicyConfig('trust_safety');
    const { strikeBanThreshold, strikeExpiryDays } = policy;

    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();
    const strikes = userDoc.data().strikes || [];

    // Strike 추가
    const newStrike = {
      severity: reason === 'no_show' ? 1 : 2,
      reason,
      issuedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    strikes.push(newStrike);

    // Ban 체크
    const shouldBan = strikes.length >= strikeBanThreshold;

    await userRef.update({
      strikes,
      accountStatus: shouldBan ? 'banned' : 'active',
    });

    return { success: true, banned: shouldBan };
  } catch (error) {
    console.error('addStrikeAndCheck error:', error);
    throw error;
  }
};

// functions/index.js에서 사용
// const strike = require('./services/{domain}Service');
// exports.onNoShow = functions.firestore.document('requests/{id}')
//   .onUpdate((change, ctx) => strike.addStrikeAndCheck(userId, 'no_show'));
```

### 10.5 index.js 크기 제한

- **권장**: 200줄 이하 (exports만)
- **최대**: 300줄 (초과 시 서비스 분리 필수)

```javascript
// ✅ 올바른 index.js 구조

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// 서비스 Import
const strike = require('./services/{domain}Service');
const referral = require('./services/{feature}Service');
const deposit = require('./services/{core}Service');

// Exports (라우팅만)
exports.addStrike = functions.https.onCall(strike.addStrikeAndCheck);
exports.handleReferral = functions.https.onCall(referral.handleReferral);
exports.holdDeposit = functions.firestore
  .document('requests/{id}')
  .onUpdate(deposit.holdOnAcceptance);

// index.js 총 20줄 내외 유지
```

### 10.6 새 Cloud Function 추가 절차

1. **서비스 파일 생성**
   ```bash
   touch functions/services/newFeatureService.js
   ```

2. **비즈니스 로직 작성** (CommonJS)
   ```javascript
   // functions/services/newFeatureService.js
   const admin = require('firebase-admin');

   exports.processNewFeature = async (data) => {
     // 로직 작성...
   };
   ```

3. **index.js에 라우팅 추가**
   ```javascript
   // functions/index.js
   const newFeature = require('./services/newFeatureService');

   exports.processNewFeature = functions.https.onCall(
     newFeature.processNewFeature
   );
   ```

4. **테스트 작성**
   ```javascript
   // functions/services/__tests__/newFeatureService.test.js
   const { processNewFeature } = require('../newFeatureService');

   describe('newFeatureService', () => {
     it('should process feature correctly', async () => {
       // 테스트...
     });
   });
   ```

### 10.7 Frontend vs Backend 서비스 비교

| 항목 | Frontend (`src/services/`) | Backend (`functions/services/`) |
|------|---------------------------|--------------------------------|
| **위치** | `src/services/` | `functions/services/` |
| **문법** | ES6 `import/export` | CommonJS `require/exports` |
| **SDK** | `firebase` (클라이언트) | `firebase-admin` |
| **호출처** | React 컴포넌트 | Cloud Functions 트리거 |
| **예시** | `import { getDocument } from './firestore'` | `const admin = require('firebase-admin')` |

### 10.8 체크리스트

새 Cloud Function 추가 시:

- [ ] `functions/services/` 폴더에 서비스 파일 생성
- [ ] CommonJS 문법 사용 (`require/exports`)
- [ ] `index.js`는 200줄 이하 유지
- [ ] JSDoc 주석 작성
- [ ] 에러 핸들링 완료
- [ ] 테스트 작성 (90% 커버리지)
- [ ] 정책 기반 로직은 `getPolicyConfig` 사용

---

## 11. 테스트 규칙

### 11.1 테스트 파일 위치

```
src/
├── utils/
│   ├── validation.js
│   └── __tests__/
│       └── validation.test.js  // 유틸 테스트
├── components/
│   └── m3/
│       ├── Button.jsx
│       └── __tests__/
│           └── Button.test.jsx  // 컴포넌트 테스트
```

### 11.2 테스트 작성 우선순위

1. **필수**: 비즈니스 로직
   - Frontend: `src/utils/` 함수
   - **Backend: `functions/services/` 함수** ⭐
   - 특히 정책 기반 로직 (Policy Service, 환불 계산 등)
2. **권장**: 공통 컴포넌트 (components/m3/, components/common/)
3. **선택**: 페이지 컴포넌트 (복잡한 로직 있는 경우)

**정책 기반 테스트 우선순위** (Policy-Driven Architecture):
```javascript
// ✅ 필수 테스트 예시
describe('Policy Service', () => {
  // 정책 로드 테스트
  it('should load policy from cache', async () => { });

  // 폴백 테스트 (정책 미로드 시)
  it('should use default policy when not found', async () => { });

  // 정책 변화 적용 테스트
  it('should apply new policy when updated', async () => { });

  // Feature Flag 테스트
  it('should apply experiment config for targeted users', async () => { });
});

// ✅ 정책별 시나리오 테스트
describe('Refund Policy', () => {
  it('should process local no-show with 100% refund', async () => { });
  it('should process crew no-show with 0% refund', async () => { });
});
```

**Backend 서비스 테스트 예시**:
```javascript
// functions/services/__tests__/{feature}Service.test.js
const { handleReferral } = require('../{feature}Service');

describe('Referral Service', () => {
  it('should grant signup bonus to new user', async () => {
    const result = await handleReferral('user123', 'REF001');
    expect(result.success).toBe(true);
    expect(result.reward).toBe(50);
  });

  it('should reject invalid referral code', async () => {
    await expect(handleReferral('user123', 'INVALID'))
      .rejects.toThrow('Invalid referral code');
  });
});
```

### 11.3 테스트 실행

```bash
# Frontend 테스트
npm run test       # watch 모드
npm run test:run   # 1회 실행

# Backend 테스트
cd functions
npm run test       # Cloud Functions 테스트
npm run test:coverage -- --collectCoverageFrom="services/{feature}Service.js"
```

---

## 12. 금지 사항 🚫

### 12.1 절대 금지

| 금지 항목 | 이유 | 대안 |
|----------|------|------|
| Firebase SDK 직접 호출 (Frontend) | 일관성 깨짐 | `src/services/` 함수 사용 |
| **Backend index.js에 로직 작성** | 유지보수 어려움 | `functions/services/` 모듈 분리 |
| **정책 하드코딩** | 정책 변화 시 코드 수정 필수 | PolicyService & policy_configs 사용 |
| console.log 프로덕션 코드 | 성능/보안 | console.error만 에러 시 |
| 인라인 스타일 | 유지보수 어려움 | CSS 파일 분리 |
| 하드코딩 텍스트 | 다국어 깨짐 | translations.js 사용 |
| any 타입 주석 | 타입 안전성 | 구체적 JSDoc |

### 12.2 지양 사항

| 지양 항목 | 상황 | 대안 |
|----------|------|------|
| useEffect 내 async 직접 | Frontend | 내부 함수 정의 후 호출 |
| props drilling 3단계+ | 복잡한 트리 | Context 사용 |
| 컴포넌트 500줄+ | 대형 페이지 | 분리 |
| **Cloud Function 300줄+** | index.js 비대화 | 서비스 모듈 분리 |
| 전역 CSS | 스타일 충돌 | CSS Modules 또는 BEM |

---

## 13. 체크리스트

### 13.1 새 기능 추가 전

- [ ] 기존 유사 기능/컴포넌트 존재 여부 확인
- [ ] 영향받는 파일 목록 파악
- [ ] 필요한 번역 키 목록 작성
- [ ] **Backend 기능인 경우**
  - `functions/services/` 폴더에 서비스 모듈 생성 계획
  - `index.js`는 라우팅만 (200줄 이하 유지)
- [ ] **정책 관련 기능인지 확인**
  - 정책이라면 policy_configs 사용 설계
  - PolicyService와 Feature Flag 사용 계획

### 13.2 코드 작성 후

**Frontend**:
- [ ] 다국어 텍스트 하드코딩 없음
- [ ] 에러 처리 완료 (try-catch + 사용자 피드백)
- [ ] useEffect cleanup 함수 추가 (리스너, 타이머)
- [ ] 불필요한 console.log 제거
- [ ] CSS 클래스명 BEM 규칙 준수

**Backend**:
- [ ] `functions/services/` 모듈로 분리됨
- [ ] CommonJS 문법 사용 (`require/exports`)
- [ ] `index.js`는 200줄 이하
- [ ] JSDoc 주석 작성
- [ ] 트랜잭션 사용 (여러 문서 변경 시)

**정책 기반 (Frontend & Backend 공통)**:
- [ ] PolicyService를 통해 정책 로드
- [ ] 하드코딩된 정책 값 없음
- [ ] 폴백(Fallback) 정책 정의됨
- [ ] 정책 변화 시나리오 테스트 작성

### 13.3 PR 전

- [ ] `npm run test:run` 통과 (Frontend)
- [ ] `cd functions && npm run test` 통과 (Backend)
- [ ] `npm run build` 성공
- [ ] 관련 문서 업데이트 (필요시)
- [ ] Dead Code 없음
- [ ] **정책 문서 업데이트** (필요시)
  - `docs/product/policies/` 문서 업데이트
  - changelog에 정책 변화 기록

---

## 부록: 자주 사용하는 패턴

### A. 데이터 로딩 패턴

```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  let isMounted = true;

  const load = async () => {
    try {
      const result = await fetchData();
      if (isMounted) setData(result);
    } catch (err) {
      if (isMounted) setError(err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  load();

  return () => { isMounted = false; };
}, []);
```

### B. 실시간 리스너 패턴

```jsx
useEffect(() => {
  const unsubscribe = onDataChange(id, (newData) => {
    setData(newData);
  });

  return () => unsubscribe();
}, [id]);
```

### C. 폼 제출 패턴

```jsx
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (submitting) return;

  try {
    setSubmitting(true);
    await submitData(formData);
    navigate('/success');
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};
```

---

*이 가이드라인은 프로젝트의 일관성과 품질을 유지하기 위해 작성되었습니다.*
*문의: 프로젝트 관리자*
