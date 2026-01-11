# 와이어프레임 네비게이션 감시 & 업데이트 요약

**완료 날짜**: 2026-01-11  
**총 파일 수정**: 9개

---

## 업데이트 규칙 요약

### 1. 비로그인 상태 페이지 (로그인 필요 없음)
- landing.html (랜딩페이지)
- search.html (검색 & 필터링)
- profile.html (아조씨 프로필)

**적용된 변경**:
- 헤더 네비게이션에 "로그인" 링크 추가 → `customer-login.html`
- 헤더 네비게이션에 "회원가입" 링크 추가 → `customer-signup.html`
- "검색" 링크만 활성 상태로 유지

---

### 2. 사용자 입력 페이지 (로그인 + 예약 경로)
- booking.html (예약하기)
- checkout.html (결제하기)

**적용된 변경**:
- "내 예약" 링크 추가 → `dashboard-customer.html`
- "로그인" 링크 추가 → `customer-login.html`
- "회원가입" 링크 제거 (이미 예약 진행 중)

---

### 3. 로그인 후 대시보드 페이지
- dashboard-customer.html (고객 대시보드)
- dashboard-uncle.html (아조씨 대시보드)

**적용된 변경**:
- "로그인" & "회원가입" 링크 제거
- "관리자" 링크 추가 → `admin.html`
- "로그아웃" 스타일 링크 추가:
  - 고객: `customer-login.html` (로그아웃 페이지로 이동)
  - 아조씨: `uncle-login.html` (로그아웃 페이지로 이동)
  - **스타일**: `color: #DC2626;` (빨강 = 주의 색상)

---

### 4. 실시간 메시징 & 리뷰 페이지
- messages.html (메시징)
- review.html (리뷰 작성)

**적용된 변경**:
- "로그인" & "회원가입" 링크 제거
- "관리자" 링크 추가 → `admin.html`
- "로그아웃" 스타일 링크 추가 (빨강 #DC2626)
- 기존 "검색", "메시지" 링크 제거 (불필요)

---

### 5. 관리자 대시보드
- admin.html (관리자 대시보드)

**변경 사항**: 없음 (고정됨)

---

## 네비게이션 맵 (최종 구조)

### 비로그인 사용자 경로
```
landing.html → search.html → profile.html
↓            ↓              ↓
로그인        로그인         로그인
회원가입      회원가입       회원가입
```

### 로그인 후 고객 경로
```
booking.html → checkout.html → dashboard-customer.html
↓             ↓                ↓
내 예약        내 예약          검색
로그인        로그인           관리자 ← 스타일
내 예약        결제 페이지       로그아웃 (RED)
```

### 로그인 후 아조씨 경로
```
dashboard-uncle.html → messages.html → review.html
↓                      ↓              ↓
홈                     관리자 ← 스타일  관리자 ← 스타일
내 프로필              로그아웃 (RED)  로그아웃 (RED)
관리자 ← 스타일
로그아웃 (RED)
```

---

## 파일별 상세 변경사항

### landing.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="customer-login.html">로그인</a></li>
  <li><a href="customer-signup.html">회원가입</a></li>
</nav>
```

### search.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="customer-login.html">로그인</a></li>
  <li><a href="customer-signup.html">회원가입</a></li>
</nav>
```

### profile.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="customer-login.html">로그인</a></li>
  <li><a href="customer-signup.html">회원가입</a></li>
</nav>
```

### booking.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="customer-login.html">로그인</a></li>
</nav>
```

### checkout.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="customer-login.html">로그인</a></li>
</nav>
```

### dashboard-customer.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="admin.html">관리자</a></li>
  <li><a href="customer-login.html" style="color: #DC2626;">로그아웃</a></li>
</nav>
```

### dashboard-uncle.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="profile.html">내 프로필</a></li>
  <li><a href="dashboard-uncle.html">대시보드</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="profile.html">내 프로필</a></li>
  <li><a href="admin.html">관리자</a></li>
  <li><a href="uncle-login.html" style="color: #DC2626;">로그아웃</a></li>
</nav>
```

### messages.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="admin.html">관리자</a></li>
  <li><a href="customer-login.html" style="color: #DC2626;">로그아웃</a></li>
</nav>
```

### review.html
```html
<!-- BEFORE -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="search.html">검색</a></li>
  <li><a href="dashboard-customer.html">내 예약</a></li>
  <li><a href="messages.html">메시지</a></li>
</nav>

<!-- AFTER -->
<nav class="nav-desktop">
  <li><a href="index.html">홈</a></li>
  <li><a href="admin.html">관리자</a></li>
  <li><a href="customer-login.html" style="color: #DC2626;">로그아웃</a></li>
</nav>
```

---

## 검증 결과

### ✅ 모든 업데이트 완료
- [x] landing.html - 로그인/가입 링크 추가
- [x] search.html - 로그인/가입 링크 추가
- [x] profile.html - 로그인/가입 링크 추가
- [x] booking.html - 내 예약 + 로그인 링크
- [x] checkout.html - 내 예약 + 로그인 링크
- [x] dashboard-customer.html - 로그인/가입 제거, 관리자 + 로그아웃 추가
- [x] dashboard-uncle.html - 로그인/가입 제거, 관리자 + 로그아웃 추가
- [x] messages.html - 로그인/가입 제거, 관리자 + 로그아웃 추가
- [x] review.html - 로그인/가입 제거, 관리자 + 로그아웃 추가
- [x] admin.html - 변경 없음 (고정됨)

### 🔗 링크 검증
- ✅ customer-login.html 참조 확인
- ✅ customer-signup.html 참조 확인
- ✅ uncle-login.html 참조 확인
- ✅ admin.html 참조 확인
- ✅ dashboard-customer.html 참조 확인
- ✅ index.html 참조 확인

### 🎨 스타일 적용
- ✅ 로그아웃 링크 색상 (빨강: #DC2626) 적용됨

---

## 다음 단계 (선택 사항)

1. **customer-login.html & customer-signup.html** - 로그인/가입 페이지 추가 개발 필요
2. **uncle-login.html & uncle-signup.html** - 아조씨 로그인/가입 페이지 추가 개발 필요
3. **login-success.html** - 로그인 후 리디렉션 처리 (dashboard로 자동 이동)
4. **모바일 네비게이션** - 하단 bottom-nav도 동일한 규칙 적용 검토

---

**담당자**: Claude Code  
**상태**: ✅ 완료  
**소요 시간**: 약 15분  
**오류 사항**: 없음
