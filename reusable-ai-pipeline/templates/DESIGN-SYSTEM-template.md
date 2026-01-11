# DESIGN-SYSTEM.md - {PROJECT_NAME}

> **Project-Level Document**
> **작성일**: {YYYY-MM-DD}
> **버전**: 1.0
> **상태**: Draft | Active | Deprecated

---

## 1. 개요

### 1.1 디자인 시스템 목적
> 이 디자인 시스템이 해결하는 문제와 목표

- **일관성**: {일관된 사용자 경험 제공}
- **효율성**: {개발 속도 향상}
- **확장성**: {새로운 기능 추가 용이}

### 1.2 적용 범위
- **플랫폼**: Web / Mobile App / Both
- **프레임워크**: {React / Vue / Angular / etc.}
- **스타일 도구**: {Tailwind CSS / CSS Modules / Styled Components / etc.}

---

## 2. 브랜드 아이덴티티

### 2.1 로고
| 유형 | 파일 | 사용처 |
|------|------|--------|
| Primary | `assets/logo-primary.svg` | 밝은 배경 |
| Inverse | `assets/logo-inverse.svg` | 어두운 배경 |
| Icon | `assets/logo-icon.svg` | Favicon, App Icon |

### 2.2 브랜드 가이드라인
- **최소 여백**: 로고 높이의 50%
- **최소 크기**: 24px (아이콘), 80px (풀 로고)
- **금지 사항**: 회전, 비율 변경, 색상 임의 변경

---

## 3. 색상 시스템

### 3.1 Primary Colors
| 이름 | HEX | RGB | 용도 |
|------|-----|-----|------|
| `primary-500` | `#{hex}` | `{r, g, b}` | 주요 액션 버튼, 링크 |
| `primary-600` | `#{hex}` | `{r, g, b}` | Hover 상태 |
| `primary-400` | `#{hex}` | `{r, g, b}` | 비활성 상태 |

### 3.2 Neutral Colors
| 이름 | HEX | 용도 |
|------|-----|------|
| `gray-900` | `#{hex}` | 본문 텍스트 |
| `gray-600` | `#{hex}` | 보조 텍스트 |
| `gray-300` | `#{hex}` | 테두리 |
| `gray-100` | `#{hex}` | 배경 |

### 3.3 Semantic Colors
| 이름 | HEX | 용도 |
|------|-----|------|
| `success` | `#{hex}` | 성공 메시지, 완료 상태 |
| `warning` | `#{hex}` | 경고, 주의 |
| `error` | `#{hex}` | 에러, 삭제 |
| `info` | `#{hex}` | 정보, 안내 |

### 3.4 Dark Mode (선택)
| Light Mode | Dark Mode | 용도 |
|------------|-----------|------|
| `gray-900` | `gray-100` | 텍스트 |
| `white` | `gray-900` | 배경 |

---

## 4. 타이포그래피

### 4.1 폰트 패밀리
```css
--font-primary: '{Font Name}', sans-serif;
--font-secondary: '{Font Name}', serif;
--font-mono: '{Font Name}', monospace;
```

### 4.2 폰트 스케일
| 이름 | 크기 | 줄 높이 | 용도 |
|------|------|---------|------|
| `text-xs` | 12px | 16px | 캡션, 라벨 |
| `text-sm` | 14px | 20px | 보조 텍스트 |
| `text-base` | 16px | 24px | 본문 |
| `text-lg` | 18px | 28px | 강조 텍스트 |
| `text-xl` | 20px | 28px | 소제목 |
| `text-2xl` | 24px | 32px | 섹션 제목 |
| `text-3xl` | 30px | 36px | 페이지 제목 |

### 4.3 폰트 굵기
| 이름 | 값 | 용도 |
|------|-----|------|
| `font-normal` | 400 | 본문 |
| `font-medium` | 500 | 강조 |
| `font-semibold` | 600 | 제목 |
| `font-bold` | 700 | 헤딩 |

---

## 5. 간격 시스템

### 5.1 Spacing Scale
```
4px  (1)  - 아이콘 내부, 매우 좁은 간격
8px  (2)  - 요소 내부 패딩
12px (3)  - 작은 간격
16px (4)  - 기본 간격
24px (6)  - 섹션 내 간격
32px (8)  - 섹션 간 간격
48px (12) - 큰 섹션 간격
64px (16) - 페이지 섹션 간격
```

### 5.2 사용 예시
| 컨텍스트 | 간격 |
|----------|------|
| 버튼 내부 패딩 | `8px 16px` |
| 카드 내부 패딩 | `16px` 또는 `24px` |
| 폼 필드 간격 | `16px` |
| 섹션 간격 | `32px` 또는 `48px` |

---

## 6. 컴포넌트 라이브러리

### 6.1 버튼 (Button)

#### Variants
| Variant | 용도 | 예시 |
|---------|------|------|
| `primary` | 주요 액션 | 저장, 제출 |
| `secondary` | 보조 액션 | 취소, 뒤로가기 |
| `outline` | 덜 강조 | 옵션 선택 |
| `ghost` | 최소 강조 | 텍스트 링크 |
| `danger` | 위험 액션 | 삭제 |

#### Sizes
| Size | 높이 | 패딩 | 폰트 |
|------|------|------|------|
| `sm` | 32px | `8px 12px` | 14px |
| `md` | 40px | `10px 16px` | 16px |
| `lg` | 48px | `12px 24px` | 18px |

#### States
- **Default**: 기본 상태
- **Hover**: 마우스 오버
- **Active**: 클릭 중
- **Disabled**: 비활성화
- **Loading**: 로딩 중 (스피너 표시)

### 6.2 입력 필드 (Input)

#### Types
| Type | 용도 |
|------|------|
| `text` | 일반 텍스트 |
| `password` | 비밀번호 |
| `email` | 이메일 |
| `number` | 숫자 |
| `textarea` | 긴 텍스트 |
| `select` | 선택 |

#### States
- **Default**: 기본
- **Focus**: 포커스
- **Error**: 에러 (빨간 테두리 + 에러 메시지)
- **Disabled**: 비활성화
- **ReadOnly**: 읽기 전용

### 6.3 카드 (Card)
```
┌─────────────────────────────┐
│  [이미지 영역 (선택)]        │
├─────────────────────────────┤
│  제목                        │
│  설명 텍스트                  │
│  [액션 버튼]                 │
└─────────────────────────────┘
```

| Variant | 그림자 | 테두리 |
|---------|--------|--------|
| `elevated` | shadow-md | 없음 |
| `outlined` | 없음 | 1px solid gray-300 |
| `filled` | 없음 | 없음 (배경색) |

### 6.4 모달 (Modal)
- **크기**: `sm` (400px), `md` (560px), `lg` (720px), `full` (90vw)
- **구조**: Header, Body, Footer
- **닫기**: X 버튼, 배경 클릭, ESC 키

### 6.5 네비게이션 (Navigation)
- **Top Nav**: 데스크톱 메인 네비게이션
- **Bottom Nav**: 모바일 하단 탭
- **Side Nav**: 대시보드 사이드바
- **Breadcrumb**: 계층 구조 표시

---

## 7. 아이콘 시스템

### 7.1 아이콘 라이브러리
- **사용 라이브러리**: {Heroicons / Lucide / Feather / Custom}
- **기본 크기**: 24px
- **스트로크 굵기**: 1.5px (또는 2px)

### 7.2 아이콘 크기
| 이름 | 크기 | 용도 |
|------|------|------|
| `xs` | 16px | 인라인 텍스트 |
| `sm` | 20px | 버튼 내부 |
| `md` | 24px | 기본 |
| `lg` | 32px | 강조 |
| `xl` | 48px | 히어로 섹션 |

---

## 8. 반응형 디자인

### 8.1 Breakpoints
| 이름 | 최소 너비 | 대상 기기 |
|------|----------|----------|
| `sm` | 640px | 대형 스마트폰 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 소형 데스크톱 |
| `xl` | 1280px | 데스크톱 |
| `2xl` | 1536px | 대형 모니터 |

### 8.2 Mobile First 원칙
```css
/* 기본 (모바일) */
.container { padding: 16px; }

/* 태블릿 이상 */
@media (min-width: 768px) {
  .container { padding: 24px; }
}

/* 데스크톱 이상 */
@media (min-width: 1024px) {
  .container { padding: 32px; }
}
```

---

## 9. 애니메이션 & 트랜지션

### 9.1 Duration
| 이름 | 시간 | 용도 |
|------|------|------|
| `fast` | 150ms | 호버, 토글 |
| `normal` | 300ms | 기본 트랜지션 |
| `slow` | 500ms | 모달, 페이지 전환 |

### 9.2 Easing
| 이름 | 값 | 용도 |
|------|-----|------|
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 기본 |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 진입 |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 퇴장 |

### 9.3 기본 트랜지션
```css
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 10. 접근성 (Accessibility)

### 10.1 색상 대비
- **텍스트**: 최소 4.5:1 (WCAG AA)
- **큰 텍스트**: 최소 3:1
- **UI 컴포넌트**: 최소 3:1

### 10.2 포커스 표시
```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### 10.3 필수 속성
- 모든 이미지에 `alt` 속성
- 폼 요소에 `label` 연결
- 버튼에 명확한 텍스트 또는 `aria-label`
- 색상만으로 정보 전달 금지

---

## 11. 파일 구조

```
src/
├── styles/
│   ├── design-tokens/
│   │   ├── colors.css
│   │   ├── typography.css
│   │   ├── spacing.css
│   │   └── index.css
│   ├── components/
│   │   ├── button.css
│   │   ├── input.css
│   │   ├── card.css
│   │   └── modal.css
│   └── global.css
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.css
│   │   └── index.js
│   └── ...
└── assets/
    ├── icons/
    └── images/
```

---

## 12. 체크리스트

### 디자인 시스템 완성도
- [ ] 색상 팔레트 정의 완료
- [ ] 타이포그래피 스케일 정의 완료
- [ ] 간격 시스템 정의 완료
- [ ] 핵심 컴포넌트 정의 완료 (Button, Input, Card)
- [ ] 반응형 브레이크포인트 정의 완료
- [ ] 접근성 가이드라인 정의 완료
- [ ] 다크 모드 지원 (선택)

### 적용 검증
- [ ] 스타일 토큰 파일 생성
- [ ] 컴포넌트 라이브러리 구현
- [ ] Storybook 또는 문서화 완료
- [ ] 팀 리뷰 완료

---

## 13. 참조 자료

- **Figma/디자인 파일**: `{링크}`
- **Storybook**: `{링크}`
- **관련 문서**:
  - [02-WIREFRAME-template.md](./02-WIREFRAME-template.md)
  - [coding-conventions.md](../development/coding-conventions.md)

---

*문서 버전: 1.0*
*최종 수정: {YYYY-MM-DD}*
