# 01-PRD.md - 랜딩 페이지

> **Product Requirements Document**
> **작성일**: 2026-01-12
> **작성자**: Orchestrator Agent
> **상태**: Draft

---

## 1. 개요 (Overview)

### 1.1 기능 요약
> 창업자 스토리텔링 기반의 11섹션 패럴렉스 랜딩 페이지로, 아조씨 렌탈 서비스의 가치와 신뢰를 전달하여 고객/아조씨 전환을 유도합니다.

### 1.2 배경 및 목적

- **문제점**: 신규 서비스로서 브랜드 인지도와 신뢰가 부족하며, 서비스의 본질(중년 남성의 경험과 지혜 공유)을 명확히 전달할 채널이 없음
- **기회**: 창업자의 진정성 있는 스토리텔링을 통해 감정적 연결을 형성하고, 서비스의 차별화된 가치를 효과적으로 전달
- **목표**: 첫 방문자의 서비스 이해도 향상 및 CTA 전환율 극대화

### 1.3 성공 지표 (Success Metrics)

| 지표 | 현재 | 목표 | 측정 방법 |
|------|------|------|----------|
| Scroll Depth | N/A | 70% 이상 | GA4 스크롤 이벤트 |
| CTA Click Rate | N/A | 5% 이상 | GA4 버튼 클릭 이벤트 |
| Founder Story View Time | N/A | 3초 이상 | Intersection Observer |
| Trust Section View | N/A | 80% 이상 | GA4 섹션 노출 |
| Conversion Rate (가입) | N/A | 2-3% | Firebase Auth 가입 수 |

---

## 2. 사용자 스토리 (User Stories)

### 2.1 주요 사용자

- **신규 방문자 (고객 후보)**: 혼자라는 감정, 조언/동반/공감이 필요한 개인
- **신규 방문자 (아조씨 후보)**: 자신의 경험과 지혜를 나누고 싶은 중년 남성
- **재방문자**: 서비스에 관심이 있어 다시 방문한 사용자

### 2.2 사용자 스토리

#### 스토리 1: 서비스 이해
```
AS A 신규 방문자
I WANT 랜딩 페이지에서 서비스의 본질을 빠르게 이해하고
SO THAT 이 서비스가 나에게 필요한지 판단할 수 있다
```
- **사용자**: 20-40대 여성/남성, 외로움이나 고민이 있는 사람
- **행동**: 랜딩 페이지 스크롤, 섹션별 콘텐츠 읽기
- **결과**: 3초 내 서비스 개념 이해, 스크롤 70% 이상

#### 스토리 2: 창업자 스토리를 통한 신뢰 형성
```
AS A 관심 있는 방문자
I WANT 창업자의 진정성 있는 스토리를 통해
SO THAT 이 서비스가 믿을 만한지 판단할 수 있다
```
- **사용자**: 서비스에 관심은 있지만 신뢰가 부족한 방문자
- **행동**: 창업자 스토리 모달 열기, 내용 읽기
- **결과**: 감정적 공감 형성, CTA 클릭으로 연결

#### 스토리 3: 서비스 제공자로 참여
```
AS A 중년 남성 방문자
I WANT 내 경험이 누군가에게 도움이 될 수 있는지 확인하고
SO THAT 아조씨로 활동하기 위한 다음 단계로 진행할 수 있다
```
- **사용자**: 45-65세 남성, 은퇴자 또는 경력자
- **행동**: "아조씨 되기" CTA 클릭
- **결과**: 아조씨 가입 페이지로 이동

---

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 필수 기능 (Must Have)

#### Section 0: Hero (서비스 정의)
- [ ] 메인 슬로건 표시 ("혼자하긴... 좀 외로운데?")
- [ ] 서브 메시지 표시 ("누군가의 경험이 필요하신가요?")
- [ ] 이중 CTA 버튼 (아조씨 찾기 / 아조씨 되기)
- [ ] 창업자 스토리 모달 트리거 버튼
- [ ] 스크롤 인디케이터 (bounce 애니메이션)
- [ ] 배경 그래디언트 (Primary 색상)

#### Section 0.5: 서비스 소개
- [ ] 12개 서비스 카드 그리드 (잡담, 조언, 동행, 취미 등)
- [ ] 각 카드: 이모지 아이콘 + 서비스명 + 설명
- [ ] 호버 효과 (lift + border highlight)
- [ ] 반응형 그리드 (데스크탑 4열, 모바일 2열)

#### Section 1: How It Works (이용 방법)
- [ ] 3단계 프로세스 카드 (찾기 → 예약 → 만남)
- [ ] 각 단계: 번호 뱃지 + 제목 + 설명
- [ ] 호버 효과

#### Section 1.5: 아조씨 프로필 샘플
- [ ] 3개 프로필 카드 (김준호, 박성민, 이창욱)
- [ ] 각 카드: 이모지 + 이름 + 경력 + 평점 + 가격 + 한 줄 소개 + 태그 + 추천 대상
- [ ] 반응형 레이아웃

#### Section 2: Trust (신뢰 & 안전)
- [ ] 4개 신뢰 메커니즘 카드 (검증, 평점, 에스크로우, 24/7 지원)
- [ ] 통계 수치 (342+ 아조씨, 4.8★ 평점, 98% 재이용률)
- [ ] 고객 후기 2개
- [ ] 안전 보장 박스 (신원확인, 에스크로우, 24시간 지원, 환불정책)
- [ ] 경계선 명시 문구

#### Section 3: Final CTA
- [ ] 마지막 메시지 ("그러면, 시작해 볼까?")
- [ ] 이중 CTA 버튼
- [ ] FAQ 링크

#### 창업자 스토리 모달
- [ ] 모달 오버레이 + 슬라이드업 애니메이션
- [ ] 3개 섹션 (깨달음, 의문, 결심)
- [ ] 닫기 버튼 (X)
- [ ] 외부 클릭/ESC 키로 닫기

#### 네비게이션
- [ ] 데스크탑: 상단 헤더 (로고, 메뉴)
- [ ] 모바일: 하단 내비게이션 바

### 3.2 권장 기능 (Should Have)
- [ ] 패럴렉스 스크롤 효과 (섹션별 속도 차이)
- [ ] 스크롤 기반 애니메이션 (Intersection Observer)
- [ ] 동적 카운터 애니메이션 (통계 수치)
- [ ] 프로필 카드 Carousel (모바일)

### 3.3 선택 기능 (Nice to Have)
- [ ] Hero 배경 비디오 (서울 야경)
- [ ] 다크 모드 지원
- [ ] A/B 테스트 변형 (CTA 문구, 색상)

---

## 4. 비기능 요구사항 (Non-Functional Requirements)

### 4.1 성능
- 응답 시간: LCP < 2.5초 (WiFi), < 4초 (3G)
- FID: < 100ms
- CLS: < 0.1
- 초기 번들 크기: < 500KB
- 이미지 최적화: Next.js Image 컴포넌트 + WebP

### 4.2 보안
- XSS 방지 (React 기본 escaping)
- HTTPS 강제 (Vercel 기본)

### 4.3 접근성
- WCAG 2.1 AA 준수
- 색상 대비: 최소 4.5:1
- 키보드 네비게이션 지원
- 스크린 리더 호환 (시맨틱 HTML)
- 포커스 표시: 2px solid Primary 500

### 4.4 SEO
- 메타 태그 최적화 (title, description, og:*)
- 구조화 데이터 (Organization, WebPage)
- sitemap.xml 포함

---

## 5. UI/UX 요구사항

### 5.1 화면 목록

| 화면명 | 설명 | 우선순위 |
|-------|------|---------|
| 랜딩 페이지 (전체) | 11섹션 스크롤 페이지 | High |
| 창업자 스토리 모달 | 오버레이 모달 | High |

### 5.2 인터랙티브 와이어프레임

> **도구**: HTML/Tailwind 인터랙티브 프로토타입
> **위치**: `docs/wireframes/landing.html`

#### 프로토타입 링크
- **메인 엔트리**: `docs/wireframes/landing.html` ✅ (이미 존재)

#### User Flow
```
┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│   랜딩 페이지  │ ──▶ │  CTA 클릭     │ ──▶ │ 가입/검색    │
│   (스크롤)    │     │ (고객/아조씨)  │     │   페이지     │
└──────────────┘     └───────────────┘     └──────────────┘
        │
        ▼
┌──────────────┐
│ 창업자 스토리  │
│   모달 열기   │
└──────────────┘
```

#### 와이어프레임 검증 체크리스트
- [x] 모든 화면 HTML 파일 생성 완료
- [x] 화면 간 이동 (링크) 동작 확인
- [x] Mobile First (375px) 레이아웃 확인
- [ ] PM/이해관계자 리뷰 완료
- [ ] 피드백 반영 완료

### 5.3 디자인 토큰 (from Design System)

#### 색상
- **Primary 500**: #2B6BE6 (CTA 버튼, 링크)
- **Primary 700**: #154FB3 (Hero 배경)
- **Secondary 500**: #28A745 (성공, 안전)
- **Accent 700**: #FD7E14 (강조)

#### 타이포그래피
- **H1**: 32px Bold (페이지 제목)
- **H2**: 28px Bold (섹션 제목)
- **Body Large**: 16px Regular (본문)
- **Font Family**: Pretendard, Inter

#### 간격
- 기본 단위: 8px Grid
- 섹션 간격: 80px (5rem)
- 컴포넌트 내부: 16-24px

---

## 6. 제약사항 및 의존성

### 6.1 기술적 제약
- Next.js 14+ App Router 필수
- 서버 컴포넌트 우선 (클라이언트 컴포넌트 최소화)
- Tailwind CSS 사용 (인라인 스타일 지양)

### 6.2 외부 의존성
- **framer-motion**: 패럴렉스/애니메이션 (선택)
- **@vercel/analytics**: 분석
- **Firebase**: 없음 (정적 페이지)

### 6.3 일정 제약
- Phase 1 내 완료 필요

---

## 7. 범위 외 (Out of Scope)

> 이번 버전에서 **하지 않을** 것들

- 다국어 지원 (i18n) - 향후 Phase
- 실시간 채팅 위젯
- A/B 테스트 인프라 (첫 배포 후 추가)
- 동영상 배경 (첫 배포 시 정적 이미지/그래디언트)
- 블로그/콘텐츠 섹션

---

## 8. 섹션별 상세 스펙

### Section 0: Hero
```typescript
interface HeroProps {
  mainTitle: string;      // "혼자하긴... 좀 외로운데?"
  subtitle: string;       // "누군가의 경험이 필요하신가요?"
  ctaPrimary: {
    label: string;        // "아조씨 찾기"
    href: string;         // "/search"
    icon: string;         // "🔍"
  };
  ctaSecondary: {
    label: string;        // "아조씨 되기"
    href: string;         // "/uncle/signup"
    icon: string;         // "🎯"
  };
  storyButtonLabel: string; // "창업자의 생각이 궁금하신가요?"
}
```

### Section 0.5: Services Grid
```typescript
interface ServiceCard {
  icon: string;           // "💬"
  name: string;           // "잡담 상대"
  description: string;    // "누군가와 그냥..."
}

// 12개 서비스: 잡담, 조언, 음식점동행, 취미, 스포츠관전,
// 전직상담, 진로자기개발, 방정리, 캠프, 논문첨삭, 드라이브, 공연동행
```

### Section 1: How It Works
```typescript
interface Step {
  number: number;         // 1, 2, 3
  title: string;          // "아조씨 찾기"
  description: string;    // "필요한 분야, 경험, 취향..."
}

// 3단계: 찾기 → 예약 → 만남
```

### Section 1.5: Uncle Profiles
```typescript
interface UncleProfileSample {
  emoji: string;          // "🎬"
  name: string;           // "김준호"
  career: string;         // "영화사 프로듀서 (20년)"
  rating: number;         // 4.8
  reviewCount: number;    // 152
  pricePerHour: number;   // 45000
  quote: string;          // "저는 당신의 감정을..."
  tags: string[];         // ["#감정표현", "#영화", "#문화"]
  targetAudience: string[]; // ["진로/꿈에 대해...", ...]
}
```

### Section 2: Trust
```typescript
interface TrustMechanism {
  icon: string;           // "🔍"
  title: string;          // "철저한 검증"
  description: string;    // "모든 아조씨는..."
}

interface TrustStat {
  value: string;          // "342+"
  label: string;          // "검증된 아조씨들"
}

interface Review {
  avatar: string;         // "👩"
  name: string;           // "김미영"
  rating: number;         // 5.0
  text: string;           // "박준호 아조씨 만나고..."
}

interface SafetyFeature {
  icon: string;           // "✓"
  title: string;          // "신원 확인"
  description: string;    // "모든 아조씨는..."
}
```

### Section 3: Final CTA
```typescript
interface FinalCTAProps {
  title: string;          // "그러면, 시작해 볼까?"
  subtitle: string;       // "누군가의 경험이 필요하신가요?"
  ctaPrimary: CTAButton;
  ctaSecondary: CTAButton;
  faqLink: string;        // "/faq"
}
```

### Founder Story Modal
```typescript
interface FounderStorySection {
  emoji: string;          // "🧠"
  title: string;          // "깨달음"
  content: string;        // "요즘 유튜브 댓글을..."
}

// 3개 섹션: 깨달음, 의문, 결심
```

---

## 9. 승인

| 역할 | 이름 | 승인 일자 | 서명 |
|------|------|----------|------|
| PM | | | |
| Tech Lead | | | |

---

*문서 버전: 1.0*
*최종 수정: 2026-01-12*
