/**
 * 랜딩페이지 콘텐츠 데이터
 * PRD 섹션별 데이터 정의
 */

// Section 0: Hero
export const HERO_CONTENT = {
  mainTitle: '나도 그랬어',
  subtitle: '그래서 좀 알아',
  ctaPrimary: {
    label: '아조씨 찾기',
    href: '/search',
    icon: '🔍',
  },
  ctaSecondary: {
    label: '아조씨 되기',
    href: '/uncle/signup',
    icon: '🎯',
  },
  storyButtonLabel: '창업자의 생각이 궁금하신가요?',
} as const;

// Section 0.5: Services Grid
export const SERVICES = [
  { icon: '💬', name: '잡담 상대', description: '누군가와 그냥... 떠들고 싶은 날 있잖아. 그럴 땐 우리를 불러봐' },
  { icon: '💡', name: '조언/어드바이스', description: '"이거 어떻게 할까?"라고 물어볼 누군가가 필요할 때' },
  { icon: '🍽️', name: '음식점 동행', description: '그 식당, 혼자 가긴 좀 어색한데... 우리랑 같이 가볼까?' },
  { icon: '🎮', name: '취미 함께하기', description: '영화도 좋지만, 함께 보면 더 얘기 많아지더라고요' },
  { icon: '⚽', name: '스포츠 관전', description: '경기장에서 함께 응원하면 재미가 배로 느껴져요' },
  { icon: '💼', name: '전직/커리어 상담', description: '새로 시작하려니까 불안한가요? 경험자의 이야기를 들어보세요' },
  { icon: '🎓', name: '진로/자기개발', description: '미래가 막연할 땐, 아저씨들의 인생 경험이 나침반이 되어줄 수 있어요' },
  { icon: '🏠', name: '방 정리/정돈', description: '혼자 하면 지치는 일, 함께하면 수다도 나누고 팁도 배워요' },
  { icon: '🏕️', name: '캠프/야외활동', description: '산에 가봤자 혼자면 외로운데, 우리가 함께 즐겨봐요' },
  { icon: '📝', name: '논문/글 첨삭', description: '"이 문장 좀 봐봐" 할 때, 경험 많은 눈으로 봐드려요' },
  { icon: '🚗', name: '드라이브', description: '드라이브하다 보니까 말도 나오고 경치도 나오더라고요' },
  { icon: '🎸', name: '라이브/공연 동행', description: '좋아하는 가수의 공연, 함께 가면 그 감동이 두 배예요' },
] as const;

// Section 1: How It Works
export const HOW_IT_WORKS = [
  {
    number: 1,
    title: '아조씨 찾기',
    description: '필요한 분야, 경험, 취향...\n당신에게 맞는 아조씨를 찾아봐요.',
  },
  {
    number: 2,
    title: '예약하기',
    description: '언제, 어디서, 뭘 할지\n정하고 예약하면 끝.',
  },
  {
    number: 3,
    title: '만나서 대화',
    description: '카페, 영상통화, 산책...\n편한 곳에서 시간을 함께 써요.',
  },
] as const;

// Section 1.5: Uncle Profiles
export const UNCLE_PROFILES = [
  {
    emoji: '🎬',
    name: '김준호',
    career: '영화사 프로듀서 (20년)',
    rating: 4.8,
    reviewCount: 152,
    pricePerHour: 45000,
    quote: '저는 당신의 감정을 영화처럼 읽을 수 있어요',
    tags: ['#감정표현', '#영화', '#문화'],
    targetAudience: [
      '진로/꿈에 대해 고민 중인 분',
      '감정 표현이 어려운 분',
      '영화/문화에 관심 있는 분',
    ],
  },
  {
    emoji: '🍳',
    name: '박성민',
    career: '호텔 셰프 (25년)',
    rating: 4.9,
    reviewCount: 289,
    pricePerHour: 50000,
    quote: '함께 밥을 먹으면서, 인생의 맛을 찾을 수 있어요',
    tags: ['#요리', '#건강식단', '#라이프스타일'],
    targetAudience: [
      '건강/라이프스타일 개선을 원하는 분',
      '요리/음식 문화에 관심 있는 분',
      '일상에서 작은 기쁨을 찾고 싶은 분',
    ],
  },
  {
    emoji: '📸',
    name: '이창욱',
    career: '광고사진작가 (30년)',
    rating: 4.7,
    reviewCount: 198,
    pricePerHour: 55000,
    quote: '세상을 아름답게 바라보는 방법을 알려드려요',
    tags: ['#사진', '#미술', '#야외활동'],
    targetAudience: [
      '사진/미술에 관심 있는 분',
      '심미안 개발을 원하는 분',
      '새로운 취미 활동을 시작하고 싶은 분',
    ],
  },
] as const;

// Section 2: Trust
export const TRUST_MECHANISMS = [
  {
    icon: '🔍',
    title: '철저한 검증',
    description: '모든 아조씨는 신원확인 → 배경조회 → 영상면접 → 안전교육을 거칩니다',
  },
  {
    icon: '⭐',
    title: '신뢰 평점 시스템',
    description: '모든 만남 후 투명한 평점 + 후기로 신뢰도를 직접 확인할 수 있습니다',
  },
  {
    icon: '💳',
    title: '에스크로우 결제',
    description: '안전한 결제로 고객과 아조씨 양쪽 모두를 보호합니다',
  },
  {
    icon: '📞',
    title: '24/7 지원팀',
    description: '문제가 생기면 즉시 연락할 수 있는 지원팀이 있습니다',
  },
] as const;

export const TRUST_STATS = [
  { value: '342+', label: '검증된 아조씨들' },
  { value: '4.8★', label: '평균 고객 평점' },
  { value: '98%', label: '다시 만나고 싶은 비율' },
] as const;

export const REVIEWS = [
  {
    avatar: '👩',
    name: '김미영',
    rating: 5.0,
    text: '박준호 아조씨 만나고 인생이 좀 달라졌어요. 그냥 현실적인 사람의 따뜻한 말이 그렇게 힘이 될 줄은.',
  },
  {
    avatar: '👩‍💼',
    name: '이하은',
    rating: 5.0,
    text: '혼자 고민하고 있었는데, 누군가 옆에서 "그런 거 있어" 이러는 것만으로도 괜찮아지더라고요.',
  },
] as const;

export const SAFETY_FEATURES = [
  { icon: '✓', title: '신원 확인', description: '모든 아조씨는 신분증 확인 완료' },
  { icon: '✓', title: '에스크로우', description: '돈은 안전하게 보호됨' },
  { icon: '✓', title: '24시간 지원', description: '문제 발생 시 즉시 대응' },
  { icon: '✓', title: '100% 환불', description: '예약 24시간 전 전액 환불 가능' },
] as const;

// Section 3: Final CTA
export const FINAL_CTA = {
  title: '그러면, 시작해 볼까?',
  subtitle: '누군가의 경험이 필요하신가요?\n아니면 당신의 경험을 나누고 싶으신가요?',
  ctaPrimary: {
    label: '아조씨 찾아보기',
    href: '/search',
  },
  ctaSecondary: {
    label: '나도 아조씨 하기',
    href: '/uncle/signup',
  },
  faqLink: '/faq',
} as const;

// Founder Story Modal
export const FOUNDER_STORY = [
  {
    emoji: '🧠',
    title: '깨달음',
    content: `요즘 유튜브 댓글을 보면... 중년 남성을 깎아내리는 영상들 천지예요.

'영포티', '아재들', '구닥다리'...

볼 때마다 답답했어요. 이게 뭐 하는 짓인가 싶고.`,
  },
  {
    emoji: '❓',
    title: '의문',
    content: `우리가 정말 중년 남성을 이렇게 봐야 하나?

이들도 누군가의 아버지고, 누군가의 인생 선배인데... 경험이랑 지혜가 진짜 쓸모없는 거야?

그럴 리 없지, 라고 생각했어요.`,
  },
  {
    emoji: '💪',
    title: '결심',
    content: `그래서 시작했어요.

중년 남성들의 경험과 지혜를 부정하지 말고, 그걸 필요로 하는 사람들과 직접 연결하는 거. 그게 아조씨 렌탈이에요.

함께라는 것의 참 의미를 다시 찾고 싶었어요.`,
  },
] as const;
