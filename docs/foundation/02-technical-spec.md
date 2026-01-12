# 렌탈 아재 - 기술 사양서 (Technical Specification)

## 📌 개요

본 문서는 렌탈 아재 프로젝트의 **확정된 기술 스택**과 아키텍처를 정의합니다.

---

## 🛠️ 1. 기술 스택 (확정)

### 1.1 Backend (백엔드)

| 요소 | 선택 | 사유 |
|------|------|------|
| **Platform** | Google Firebase | 빠른 개발, 자동 확장, 통합 인증 |
| **Database** | Firestore (NoSQL) | 실시간 데이터 동기화, 플렉서블 스키마 |
| **Real-time** | Google Realtime DB | 채팅 시스템 실시간 메시징 |
| **Auth** | Firebase Auth | 소셜 로그인, 전화번호 인증 |
| **Notifications** | Google FCM | 푸시 알림, 크로스 플랫폼 |
| **Functions** | Cloud Functions | 서버리스 백엔드 로직 |
| **Storage** | Firebase Storage | 사진, 문서 저장 및 CDN |
| **Hosting** | Firebase Hosting | 정적 자산 서빙 (필요시) |

**왜 Firebase인가?**
- ✅ 빠른 프로토타입 개발 (BaaS)
- ✅ 스케일 없이 자동 확장
- ✅ 실시간 데이터 동기화 (양방향 바인딩)
- ✅ 낮은 초기 비용 (종량제)
- ✅ 통합 인증 (Email, Phone, OAuth)
- ✅ 보안 규칙 (Firestore Rules)

### 1.2 Frontend (프론트엔드)

| 요소 | 선택 | 사유 |
|------|------|------|
| **Framework** | Next.js 14+ (App Router) | SSR, SSG, ISR, SEO 최적화 |
| **Language** | TypeScript | 타입 안전성, 개발 생산성 |
| **Styling** | Tailwind CSS | Utility-first, 빠른 개발 |
| **Components** | shadcn/ui | 접근성, 커스터마이징 가능 |
| **State** | Zustand | 가볍고 간단한 상태 관리 |
| **Data Fetching** | React Query | 서버 상태 관리, 캐싱 |
| **Forms** | React Hook Form + Zod | 검증, 성능 |
| **Charts** | Recharts | 수익 분석 그래프 |
| **Calendar** | react-calendar | 일정 선택 |

**왜 Next.js인가?**
- ✅ SEO (검색 엔진 최적화) - 마켓플레이스에 필수
- ✅ 성능 (이미지 최적화, 자동 코드 스플리팅)
- ✅ API Routes (백엔드 통합)
- ✅ 배포 쉬움 (Vercel)
- ✅ 파일 기반 라우팅
- ✅ Firebase 통합 용이

### 1.3 특색 있는 기능 - 랜딩 페이지

#### 패럴렉스 스크롤 기술

**구현 방식**:
```
라이브러리: framer-motion or react-scroll
기술: Intersection Observer API + CSS Transform
```

**콘텐츠 구성**:
1. **Hero Section** (동영상 배경)
   - 렌탈 아재 소개 영상 (15초)
   - 텍스트 오버레이: "당신의 이야기를 들어줄 믿을 수 있는 아재를..."
   - CTA: "시작하기"

2. **How It Works** (사진 + 텍스트)
   - Step 1: 검색 (사진 + 설명)
   - Step 2: 예약 (사진 + 설명)
   - Step 3: 만남 (사진 + 설명)
   - Step 4: 후기 (사진 + 설명)
   - 패럴렉스 효과: 스크롤 시 각 섹션이 다른 속도로 움직임

3. **Customer Testimonials** (사진 + 텍스트)
   - 고객 얼굴 사진 (또는 익명 아이콘)
   - 후기 텍스트
   - 별점
   - 패럴렉스: 텍스트와 사진이 다른 속도로 움직임

4. **Uncle Profiles** (프로필 사진 + 텍스트)
   - 주요 아재 프로필 5~10명
   - 이름, 별점, 스킬 태그
   - 패럴렉스: 사진은 천천히, 텍스트는 빠르게

5. **Safety & Trust** (아이콘 + 텍스트)
   - 신원 확인 배지
   - 24시간 고객 지원
   - 환불 정책
   - 영상 검증

6. **CTA Section** (영상 또는 동적 요소)
   - 최종 행동 유도
   - "지금 시작하기" 버튼
   - 소셜 미디어 링크

**구현 세부사항**:
```typescript
// 예시 구조
<ParallaxSection
  backgroundSpeed={0.3}  // 느린 움직임
  foregroundSpeed={0.8}  // 빠른 움직임
>
  <video src="..." autoPlay muted />
  <h1>텍스트</h1>
</ParallaxSection>
```

**성능 고려사항**:
- ✅ 이미지 최적화 (Next.js Image)
- ✅ 비디오 최적화 (WebM, MP4)
- ✅ 레이지 로딩 (Intersection Observer)
- ✅ 모바일 최적화 (패럴렉스 비활성화 가능)

### 1.4 Hosting & Deployment

| 계층 | 서비스 | 목적 |
|------|--------|------|
| **Frontend** | Vercel | Next.js 호스팅, CDN, 자동 배포 |
| **Backend** | Firebase | Firestore, Functions, Auth |
| **Database** | Firestore | NoSQL, 실시간 동기화 |
| **Real-time** | Realtime DB | 채팅 메시지 |
| **Storage** | Firebase Storage | 사진, 문서 저장 |
| **DNS** | Cloudflare or Google Domains | 도메인 관리 |

---

## 📊 2. 아키텍처 다이어그램

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────┐
│           사용자 브라우저                    │
│        (고객 / 아재 / 관리자)               │
└────────────────────┬────────────────────────┘
                     │ (HTTPS)
                     │
        ┌────────────▼──────────┐
        │    Vercel (CDN)       │
        │  Next.js Frontend     │
        │ - SSR/SSG Pages       │
        │ - API Routes (Gateway)│
        │ - Image Optimization  │
        └────────────┬──────────┘
                     │
        ┌────────────▼──────────────────┐
        │   Google Firebase Backend     │
        │                               │
        ├─ Authentication              │
        │  - Email/Password             │
        │  - Kakao/Naver OAuth         │
        │  - Phone Verification        │
        │                               │
        ├─ Firestore (Main DB)         │
        │  - Users                     │
        │  - Uncles                    │
        │  - Bookings                  │
        │  - Payments                  │
        │  - Reviews                   │
        │                               │
        ├─ Realtime Database (Chats)   │
        │  - Conversations             │
        │  - Messages                  │
        │                               │
        ├─ Cloud Functions             │
        │  - Payment Processing        │
        │  - Email Notifications       │
        │  - Review Moderation        │
        │                               │
        ├─ FCM (Notifications)         │
        │  - Push Notifications        │
        │  - In-app Messaging         │
        │                               │
        └─ Storage                     │
           - Profile Photos            │
           - Verification Docs         │
           - Review Images             │
        └────────────────────────────────┘
                     │
        ┌────────────▼──────────┐
        │  External Services   │
        │                      │
        ├─ Toss Payments      │
        ├─ Kakao Payments     │
        ├─ Naver Payments     │
        ├─ SMS (Naver Cloud)  │
        ├─ Kakao Address API  │
        └─ Google Analytics   │
        └──────────────────────┘
```

### 2.2 Data Flow - 예약 생성

```
1. 고객이 예약 폼 작성 (Next.js)
         ↓
2. API Route에서 데이터 검증
         ↓
3. Firestore에 예약 저장
         ↓
4. Cloud Function 트리거
   - 가격 계산
   - Toss Payments API 호출
   ↓
5. 결제 성공
   - Escrow 상태로 변경
   - FCM 알림 전송 (아재)
   ↓
6. Realtime DB 업데이트
   - 아재 대시보드 실시간 갱신
   ↓
7. 메시지 알림 (메일, SMS, 푸시)
```

### 2.3 Real-time Chat 아키텍처

```
Client A                    Client B
(고객)                       (아재)
  │                          │
  └────────────────┬─────────┘
                   │
            Realtime Database
                   │
         (Conversations)
         - conversation_id
         - messages[]
         - lastMessage
         - participants[]
                   │
        ┌──────────┼──────────┐
        │          │          │
    Listener    Listener   FCM Push
    (Client A)  (Client B)
```

---

## 🔐 3. Firebase 보안 설정

### 3.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: 자신의 정보만 접근
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Uncle Profiles: 승인된 프로필만 공개 조회
    match /uncleProfiles/{uncleId} {
      allow read: if resource.data.verified == true;
      allow write: if request.auth.uid == uncleId;
    }

    // Bookings: 당사자만 접근
    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.customerId
                     || request.auth.uid == resource.data.uncleId;
      allow create: if request.auth.uid == request.resource.data.customerId;
      allow write: if request.auth.uid == resource.data.customerId
                      || request.auth.uid == resource.data.uncleId;
    }

    // Messages: 대화 당사자만 접근
    match /conversations/{conversationId}/messages/{messageId} {
      allow read, write: if request.auth.uid in resource.data.participants;
    }

    // Reviews: 작성자만 수정, 공개 조회
    match /reviews/{reviewId} {
      allow read: if resource.data.isVisible == true;
      allow create: if request.auth.uid == request.resource.data.authorId;
      allow update: if request.auth.uid == resource.data.authorId;
      allow delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
```

### 3.2 Authentication

- **Email/Password**: Firebase Auth (기본)
- **Kakao OAuth**: Kakao SDK + Firebase Custom Token
- **Naver OAuth**: Naver SDK + Firebase Custom Token
- **Phone Verification**: Firebase Phone Auth (SMS)

### 3.3 환경 변수 관리

```env
# .env.local (개발)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# 프로덕션
FIREBASE_ADMIN_SDK_KEY=... (서버사이드만)
```

---

## 🚀 4. 개발 환경 설정

### 4.1 로컬 개발 (Firebase Emulator)

```bash
# Firebase Emulator Suite 설치
npm install -g firebase-tools

# 에뮬레이터 시작
firebase emulators:start

# Next.js 개발 서버
npm run dev
```

**에뮬레이터 포트**:
- Firestore: 8080
- Realtime DB: 9000
- Auth: 9099
- Functions: 5001

### 4.2 배포 프로세스

```
1. 코드 푸시 (GitHub)
         ↓
2. GitHub Actions
   - TypeScript 컴파일
   - Linting
   - Unit 테스트
         ↓
3. Vercel 자동 배포 (Next.js)
   - 프리뷰 배포
   - 프로덕션 배포
         ↓
4. Firebase 배포
   - Cloud Functions
   - Firestore Rules
   - Storage Rules
```

---

## 📈 5. 확장성 & 성능

### 5.1 Firestore 성능 최적화

| 최적화 | 방법 |
|--------|------|
| **인덱싱** | 복합 쿼리용 자동 인덱스 생성 |
| **캐싱** | React Query + Local Storage |
| **배치 쓰기** | 여러 문서 일괄 처리 |
| **Offlineability** | Firebase Offline Persistence |

### 5.2 확장 계획

| 단계 | 조치 |
|------|------|
| **MVP** | Firestore (Spark Plan) |
| **1,000+ 사용자** | Firestore (Blaze Plan), 읽기 최적화 |
| **10,000+ 사용자** | Cloud Datastore 고려, 샤딩 전략 |
| **100,000+ 사용자** | Custom API (Node.js) 추가, Kubernetes 검토 |

### 5.3 비용 예측

**Firestore 비용** (Blaze Plan - 종량제):
- 읽기: $0.06/100,000
- 쓰기: $0.18/100,000
- 삭제: $0.02/100,000
- 저장소: $0.18/GB/월

**예상 비용** (월간, 1,000 활성 사용자 기준):
- Firestore: ~$10~20
- Cloud Functions: ~$5~10
- Storage: ~$1~5
- Firebase Hosting: 무료 (또는 $0.5)
- **총계**: ~$20~35/월

---

## 🔄 6. 향후 기술 변경 계획

### Phase 1 (MVP) - Firebase 기반
- Firestore + Realtime DB + Cloud Functions
- Next.js + Vercel

### Phase 2 (최적화)
- Firebase → Cloud Run 마이그레이션 검토
- Algolia (검색 최적화)
- Stripe 추가 (결제 확장)

### Phase 3 (대규모)
- 자체 API 서버 (Node.js/Go)
- PostgreSQL (트랜잭션 필요시)
- Redis (캐싱, 세션)
- Kubernetes (오케스트레이션)

---

## 📋 7. 다음 단계

1. **Firebase 프로젝트 생성**
   - Google Cloud Console에서 프로젝트 생성
   - Firestore 활성화
   - Authentication 설정 (Email, Kakao, Naver)
   - Cloud Functions 활성화

2. **Next.js 프로젝트 생성**
   ```bash
   npx create-next-app@latest rental-uncle --typescript
   ```

3. **Firebase SDK 통합**
   - @react-firebase/database
   - firebase (Admin SDK)

4. **Firestore 스키마 설계**
   - Collection 구조 정의
   - Document 필드 정의
   - Index 계획

5. **결제 게이트웨이 연동**
   - Toss Payments API
   - Kakao Pay API
   - Naver Pay API

---

**작성 완료일**: 2026년 1월 10일
**상태**: ✅ 기술 스펙 확정 (Firebase, Next.js, 패럴렉스 스크롤)
**다음**: PRD 작성 준비
