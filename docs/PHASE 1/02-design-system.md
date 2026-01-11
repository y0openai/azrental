# 02. 디자인 시스템 (Design System)

**문서 상태**: 초안 (Draft)
**작성일**: 2026-01-11
**베이스**: [LINE Design System](https://designsystem.line.me)
**기반 문서**: [01-ia-user-flows.md](01-ia-user-flows.md)

---

## 📌 개요

이 문서는 '아조씨 렌탈' 플랫폼의 **통일된 디자인 언어**를 정의합니다.
LINE Design System의 검증된 패턴을 베이스로, 한국 시장의 감정적 요구사항과 신뢰/안전성을 강조하는 아조씨 렌탈의 가치를 반영합니다.

---

## 🎨 1. 색상 팔레트 (Color Palette)

### 1.1 핵심 색상 (Primary Colors)

#### Primary: 신뢰감 블루 (Trust Blue)
브랜드 주 색상 - 신뢰, 안정성, 전문성을 표현합니다.

| 요소 | HEX | RGB | 용도 |
|------|-----|-----|------|
| **Primary 900** | #0C3E7C | (12, 62, 124) | 강렬한 액션 (CTA 버튼, 중요 텍스트) |
| **Primary 700** | #154FB3 | (21, 79, 179) | 주 색상 (Header, 선택 상태) |
| **Primary 500** | #2B6BE6 | (43, 107, 230) | 일반 UI (링크, 버튼, 포커스) |
| **Primary 300** | #7BA8F0 | (123, 168, 240) | 라이트 배경 (호버 상태, 배경) |
| **Primary 100** | #E8EFFD | (232, 239, 253) | 매우 밝은 배경 |

**선택 근거**:
- LINE Design System의 Primary Blue를 기반으로 차용
- 한국 금융/신뢰 서비스(은행, 보험)에서 고전적으로 사용되는 색상
- 중년 남성도 편하게 인식할 수 있는 색상

---

#### Secondary: 안전감 그린 (Safety Green)
안전, 확인, 긍정의 감정을 표현합니다.

| 요소 | HEX | RGB | 용도 |
|------|-----|-----|------|
| **Secondary 700** | #198754 | (25, 135, 84) | 확인/완료 (체크마크, 승인 상태) |
| **Secondary 500** | #28A745 | (40, 167, 69) | 보조 액션 (성공 알림, 긍정 피드백) |
| **Secondary 300** | #A8D4BA | (168, 212, 186) | 라이트 배경 |

**선택 근거**:
- 예약 완료, 결제 확인 등 긍정적 상태 표현
- 고객이 "안전하다"는 느낌을 받을 수 있도록

---

#### Accent: 따뜻한 오렌지 (Warm Orange)
주목, 따뜻함, 인간관계의 중요성을 표현합니다.

| 요소 | HEX | RGB | 용도 |
|------|-----|-----|------|
| **Accent 700** | #FD7E14 | (253, 126, 20) | 강조 액션 (추천, 인기, 찜하기) |
| **Accent 500** | #FF9C3B | (255, 156, 59) | 보조 강조 (이벤트, 주요 배너) |
| **Accent 200** | #FED7A8 | (254, 215, 168) | 라이트 배경 |

**선택 근거**:
- "사람과의 연결"을 따뜻하게 표현
- 중년 남성과 고객 간의 감정적 유대감을 시각적으로 강화

---

### 1.2 상태 색상 (Status Colors)

| 상태 | HEX | 용도 |
|------|-----|------|
| **Error (위험)** | #DC3545 | 에러, 경고, 취소, 거절 |
| **Warning (주의)** | #FFC107 | 주의 필요, 보류, 대기 |
| **Info (정보)** | #17A2B8 | 정보성 메시지, 팁 |
| **Success (완료)** | #28A745 | 성공, 완료, 확인 |

---

### 1.3 중성 색상 (Neutral Colors)

| 레벨 | HEX | 용도 |
|------|-----|------|
| **Black (텍스트)** | #000000 | 본문 텍스트, 짙은 요소 |
| **Gray 900** | #212529 | 헤딩, 강조 텍스트 |
| **Gray 700** | #495057 | 보조 텍스트, 라벨 |
| **Gray 500** | #6C757D | 비활성 텍스트, 힌트 |
| **Gray 300** | #DEE2E6 | 보더, 구분선 |
| **Gray 100** | #F8F9FA | 라이트 배경, 섹션 배경 |
| **White** | #FFFFFF | 배경, 카드 배경 |

**선택 근거**: LINE Design System의 Gray Scale을 정확히 차용

---

## 📝 2. 타이포그래피 (Typography)

### 2.1 폰트 선택

#### 한글 (Korean)
- **본문/UI 폰트**: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
  - 카테고리: Sans-serif (가독성 우선)
  - 선택 근거: 현대적, 중성적, 한국 UI 표준

#### 영문
- **영문 폰트**: Inter, Helvetica Neue, Arial, sans-serif
  - 선택 근거: 국제적 표준, LINE DS와 동일

### 2.2 타이포그래피 스케일 (Spacing Scale)

| 레벨 | 스타일 | 크기 | 가중치 | 줄높이 | 자간 | 용도 |
|------|--------|------|--------|--------|------|------|
| **H1** | Heading | 32px | Bold (700) | 1.5 | -0.5px | 페이지 제목 |
| **H2** | Heading | 28px | Bold (700) | 1.4 | -0.3px | 섹션 제목 |
| **H3** | Heading | 24px | SemiBold (600) | 1.4 | 0px | 소섹션 제목 |
| **H4** | Heading | 20px | SemiBold (600) | 1.3 | 0px | 서브 제목 |
| **Body Large** | Body | 16px | Regular (400) | 1.6 | 0.3px | 본문, 큰 텍스트 |
| **Body Regular** | Body | 14px | Regular (400) | 1.6 | 0.2px | 일반 본문 (기본값) |
| **Body Small** | Body | 12px | Regular (400) | 1.5 | 0px | 보조 텍스트 |
| **Label** | Label | 12px | Medium (500) | 1.5 | 0.5px | 라벨, 태그 |
| **Caption** | Caption | 11px | Regular (400) | 1.4 | 0px | 주석, 메타정보 |

### 2.3 타이포그래피 적용 규칙

**한글 + 영문 혼합 텍스트**
```
예) "아조씨를 만나세요. Meet your Uncle"

- 한글: Pretendard Bold 20px
- 영문: Inter SemiBold 16px (한글 크기보다 약간 작게)
- 베이스라인 정렬: 아래쪽 정렬로 통일
```

**모바일에서의 타이포그래피**
- 모든 폰트 크기 -2px 축소 (14px → 12px, 16px → 14px)
- 줄높이는 유지 (가독성 확보)

---

## 📐 3. 간격 시스템 (Spacing System)

### 3.1 기본 단위: 8px Grid

| 단계 | 값 | 용도 |
|------|-----|------|
| **4** | 4px | 매우 좁은 간격 (아이콘 내부, 미세 조정) |
| **8** | 8px | 가장 작은 간격 (요소 간 기본 간격) |
| **12** | 12px | 컴포넌트 내부 간격 |
| **16** | 16px | **기본 간격** (가장 빈번함) |
| **24** | 24px | 섹션 내 여백 |
| **32** | 32px | 섹션 간 간격 |
| **48** | 48px | 큰 섹션 간 간격 |
| **64** | 64px | 페이지 여백 |

---

## 🧩 4. 컴포넌트 패턴 (Component Patterns)

### 4.1 버튼 (Buttons)

#### Primary Button (주 액션)
```
높이: 44px
패딩: 좌우 16px, 상하 12px
Border Radius: 8px
폰트: Body Large (16px), Medium (500)
배경: Primary 500 (#2B6BE6)
텍스트: White
호버: Primary 700
활성: Primary 900
비활성: Gray 300 배경, Gray 500 텍스트
```

#### Secondary Button (보조 액션)
```
높이: 44px
배경: Transparent
텍스트: Primary 700
보더: 1px Primary 700
호버: Primary 100 배경
```

#### Danger Button (위험/취소)
```
높이: 44px
배경: #DC3545
텍스트: White
호버: #BB2D3B
```

---

### 4.2 카드 (Cards)

**프로필 카드 (Uncle Profile)**
- 배경: White
- 보더: 1px Gray 300
- 그림자: 0 2px 8px rgba(0,0,0,0.08)
- Border Radius: 12px
- 패딩: 16px
- 마진: 12px (카드 간)

---

### 4.3 입력 필드 (Form Inputs)

**텍스트 입력 필드**
```
높이: 44px
보더: 1px Gray 300
포커스: 보더 2px Primary 500
에러: 보더 2px Error
Border Radius: 8px
패딩: 좌우 12px, 상하 12px
```

---

## 📱 5. 반응형 디자인 (Responsive Design)

### 5.1 Breakpoints

| 기기 | 너비 |
|------|------|
| **Mobile** | < 576px |
| **Tablet** | 576px - 992px |
| **Desktop** | ≥ 992px |

---

## 🔍 6. 접근성 (Accessibility)

### 6.1 색상 대비 (WCAG 2.1 AA)

- 일반 텍스트: 최소 4.5:1
- 큰 텍스트: 최소 3:1
- UI 컴포넌트: 최소 3:1

### 6.2 포커스 표시

- 포커스 링: 2px solid Primary 500
- 오프셋: 2px 바깥쪽

---

## ✅ 다음 단계

이 Design System 문서를 **검토하신 후** 다음 항목들에 대해 의견을 주시면 됩니다:

1. **색상 팔레트**: Primary Blue, Secondary Green, Accent Orange 수락?
2. **타이포그래피**: Pretendard 기본값 동의?
3. **간격 시스템**: 8px Grid 시스템 적용?
4. **컴포넌트**: 버튼 3가지 스타일(Primary/Secondary/Danger) 동의?
5. **접근성**: WCAG 2.1 AA 표준 준수 필수?

**검토 후 변경 요청 또는 "승인" 알려주세요.**

---

**문서 상태**: 초안 → 待 검토 및 피드백
**의존 문서**: 01-ia-user-flows.md
**다음 문서**: 03-content-strategy.md
