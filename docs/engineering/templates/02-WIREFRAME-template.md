# 02-WIREFRAME.md - {기능명} 인터랙티브 프로토타입

> **Interactive Wireframe Document**
> **작성일**: {YYYY-MM-DD}
> **작성자**: Frontend Agent / Orchestrator
> **상태**: Draft | Review | Approved

---

## 1. 개요

### 1.1 목적
HTML/Tailwind 기반 인터랙티브 프로토타입을 통해 **구현 전** 다음을 검증합니다:
- User Flow 적합성
- UI/UX 사용성
- 화면 간 전환 로직
- 이해관계자 피드백 수집

### 1.2 프로토타입 범위
| 화면 | 포함 여부 | 우선순위 |
|------|:--------:|---------|
| {화면1} | ✅ | P0 |
| {화면2} | ✅ | P0 |
| {화면3} | ⬜ | P1 |

---

## 2. 기술 스택

```yaml
프로토타입 스택:
  마크업: HTML5
  스타일: Tailwind CSS (CDN)
  인터랙션: Vanilla JavaScript (선택)
  아이콘: Heroicons / Lucide (선택)

특징:
  - 빌드 불필요 (단일 HTML 파일)
  - 브라우저에서 즉시 확인 가능
  - 실제 클릭/탭 인터랙션 지원
```

---

## 3. 파일 구조

```
docs/
└── wireframes/
    └── {feature-name}/
        ├── index.html          ← 메인 엔트리 (화면 네비게이션)
        ├── 01-{screen-name}.html
        ├── 02-{screen-name}.html
        ├── 03-{screen-name}.html
        └── assets/             ← 필요시 이미지/아이콘
            └── placeholder.svg
```

---

## 4. HTML 템플릿

### 4.1 기본 구조

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{화면명} - {기능명} Wireframe</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#3B82F6',
            secondary: '#10B981',
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-100 min-h-screen">

  <!-- 📱 Mobile Frame (375px) -->
  <div class="max-w-[375px] mx-auto bg-white min-h-screen shadow-xl">

    <!-- Header -->
    <header class="sticky top-0 bg-white border-b px-4 py-3 flex items-center">
      <button onclick="history.back()" class="mr-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-lg font-semibold">{화면 제목}</h1>
    </header>

    <!-- Main Content -->
    <main class="p-4">
      <!-- 콘텐츠 영역 -->
    </main>

    <!-- Bottom Navigation (선택) -->
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white border-t">
      <div class="flex justify-around py-2">
        <a href="01-home.html" class="flex flex-col items-center text-gray-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-xs mt-1">홈</span>
        </a>
        <!-- 추가 네비게이션 아이템 -->
      </div>
    </nav>

  </div>

</body>
</html>
```

### 4.2 공통 컴포넌트

#### 버튼
```html
<!-- Primary Button -->
<button class="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition">
  {버튼 텍스트}
</button>

<!-- Secondary Button -->
<button class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
  {버튼 텍스트}
</button>

<!-- Disabled Button -->
<button class="w-full bg-gray-200 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed" disabled>
  {버튼 텍스트}
</button>
```

#### 입력 필드
```html
<!-- Text Input -->
<div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-1">{라벨}</label>
  <input type="text"
         placeholder="{플레이스홀더}"
         class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
</div>

<!-- Error State -->
<div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-1">{라벨}</label>
  <input type="text"
         class="w-full px-4 py-3 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500">
  <p class="text-red-500 text-sm mt-1">{에러 메시지}</p>
</div>
```

#### 카드
```html
<div class="bg-white rounded-xl shadow-sm border p-4 mb-4">
  <div class="flex items-start justify-between">
    <div>
      <h3 class="font-semibold text-gray-900">{제목}</h3>
      <p class="text-sm text-gray-500 mt-1">{설명}</p>
    </div>
    <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{상태}</span>
  </div>
</div>
```

#### 모달/바텀시트
```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-black bg-opacity-50 z-40" onclick="closeModal()"></div>

<!-- Bottom Sheet -->
<div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white rounded-t-2xl z-50 p-4">
  <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
  <h2 class="text-lg font-semibold mb-4">{제목}</h2>
  <!-- 콘텐츠 -->
</div>
```

---

## 5. 인터랙션 패턴

### 5.1 화면 전환
```html
<!-- 페이지 링크 -->
<a href="02-detail.html" class="block">
  <!-- 클릭 가능한 요소 -->
</a>

<!-- JavaScript 전환 -->
<button onclick="location.href='03-confirm.html'">
  다음 단계
</button>
```

### 5.2 상태 전환 (JavaScript)
```html
<script>
  // 탭 전환
  function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('border-primary', 'text-primary'));

    document.getElementById(tabId).classList.remove('hidden');
    event.target.classList.add('border-primary', 'text-primary');
  }

  // 모달 열기/닫기
  function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
  }

  function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
  }
</script>
```

---

## 6. User Flow 정의

### 6.1 Flow 다이어그램
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  01-홈   │ ──▶ │ 02-목록  │ ──▶ │ 03-상세  │ ──▶ │ 04-완료  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │                 │
                      ▼                 ▼
                ┌──────────┐     ┌──────────┐
                │  필터    │     │  액션    │
                │ (모달)   │     │ (바텀시트)│
                └──────────┘     └──────────┘
```

### 6.2 화면별 전환 매트릭스
| From | To | Trigger | 조건 |
|------|-----|---------|------|
| 01-홈 | 02-목록 | 카테고리 클릭 | - |
| 02-목록 | 03-상세 | 아이템 클릭 | - |
| 03-상세 | 04-완료 | CTA 버튼 클릭 | 로그인 필요 |
| 03-상세 | 로그인 | CTA 버튼 클릭 | 미로그인 시 |

---

## 7. 검증 체크리스트

### 7.1 Flow 검증
- [ ] 모든 화면 간 이동 경로가 동작하는가?
- [ ] 뒤로가기가 올바르게 작동하는가?
- [ ] 엣지 케이스 (에러, 빈 상태) 화면이 있는가?
- [ ] 로딩 상태가 표현되어 있는가?

### 7.2 UI 검증
- [ ] Mobile First (375px)에서 정상 표시되는가?
- [ ] 터치 타겟이 최소 44x44px인가?
- [ ] 텍스트 가독성이 충분한가?
- [ ] 컬러 대비가 접근성 기준을 충족하는가?

### 7.3 이해관계자 검증
- [ ] PM 리뷰 완료
- [ ] 디자이너 리뷰 완료 (있는 경우)
- [ ] 주요 피드백 반영됨

---

## 8. 피드백 로그

| 날짜 | 리뷰어 | 화면 | 피드백 | 상태 |
|------|--------|------|--------|------|
| {날짜} | {이름} | {화면} | {내용} | 반영됨/보류 |

---

## 9. 다음 단계

와이어프레임 승인 후:

1. **02-RFC.md 작성** - 기술 설계 문서
2. **Interface Contracts 정의** - Mock 데이터 구조
3. **03-ORCHESTRATION.md** - 에이전트 작업 분배
4. **Wave 실행** - 실제 구현 시작

---

*문서 버전: 1.0*
*최종 수정: {YYYY-MM-DD}*
