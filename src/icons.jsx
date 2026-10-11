/**
 * 범용 아이콘 세트 — 라이브러리 의존 없이 인라인 SVG.
 *
 * spec.json에서는 이름 문자열로 쓴다:  "icon": "drop"
 * 없는 이름을 쓰면 콘솔에 경고를 남기고 점(dot)으로 대체하므로 화면이 깨지지 않는다.
 * 앱 전용 아이콘이 필요하면 아래 PATHS에 한 줄 추가한다.
 */

// 모두 24×24 viewBox, stroke 기반, currentColor 상속.
const PATHS = {
  home: 'M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.3-4.3',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  user: 'M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1M12 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z',
  check: 'M4 12.5 9 17.5 20 6.5',
  checkCircle: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM8 12l2.6 2.6L16 9',
  doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4',
  bell: 'M11 5.9c.1-.9.8-1.5 1.7-1.4M5.8 16.2V12a6.2 6.2 0 0 1 12.4 0v4.2c0 .9.8 1.5 2.1 1.9H3.7c1.3-.4 2.1-1 2.1-1.9zM10.3 20.4a1.8 1.8 0 0 0 3.4 0', /* 효령테크: 시안 헤더 종(꼭지·넓은 받침·반원 추) */
  drop: 'M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3z',
  sun: 'M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  leaf: 'M4 20c0-9 6-15 16-15 0 10-5.5 15-16 15zM4 20c2-5 5-8 9-10',
  heart: 'M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  camera: 'M3 8a2 2 0 0 1 2-2h2.5L9 4h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 16.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z',
  calendar: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 9h16M8 3v3M16 3v3',
  clock: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 7v5.2l3.2 2',
  box: 'M3 8.5 12 4l9 4.5v7L12 20l-9-4.5zM3 8.5 12 13m0 0 9-4.5M12 13v7',
  cart: 'M3 4h2.2l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.1a1.6 1.6 0 0 0 1.6-1.3L21 8H6M9.5 20.5h.01M17.5 20.5h.01',
  card: 'M2.5 7a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2zM2.5 10h19M6.5 15h3',
  pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
  phone: 'M21 16.4v2.6a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.2 19.2 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.6A2 2 0 0 1 3.4 3H6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.1 10.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  mail: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3.5 6.5l8.5 6 8.5-6',
  gear: 'M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.5 15h-.3a2 2 0 1 1 0-4h.2A1.6 1.6 0 0 0 4.5 8.2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V4a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.8 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z',
  shield: 'M12 21s7-3.2 7-9V5.8L12 3 5 5.8V12c0 5.8 7 9 7 9zM9 12l2.2 2.2L15.5 10',
  sparkle: 'm12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
  flask: 'M9.5 3v6.2L4.6 17.7A2 2 0 0 0 6.3 20.7h11.4a2 2 0 0 0 1.7-3L14.5 9.2V3M8 3h8M7.6 14.5h8.8',
  bag: 'M5 8h14l1 12H4zM8.5 8V6a3.5 3.5 0 1 1 7 0v2',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  chevronRight: 'm9 5 7 7-7 7',
  // 홈케어마스터 견적문의 칸 아이콘 — 목록 문서(서비스 선택) · 메모(문의 내용)
  docList: 'M6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3zM8.5 8h.01M11 8h5M8.5 12h.01M11 12h5M8.5 16h.01M11 16h5',
  memo: 'M5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4zM8.5 9h.01M11.5 9h.01M8.5 12.5h.01M11.5 12.5h.01M14.5 12.5h.01M8.5 16h.01',
  chevronLeft: 'm15 5-7 7 7 7',
  chevronDown: 'm5 9 7 7 7-7',
  chevronUp: 'm5 15 7-7 7 7',
  arrowUp: 'M12 20V4M5 11l7-7 7 7',
  trend: 'm3 16 5.5-5.5 3.5 3.5L21 5M21 5h-5M21 5v5',
  lock: 'M6 11a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zM8.5 9V6.5a3.5 3.5 0 1 1 7 0V9',
  download: 'M12 3v12M7 10.5l5 5 5-5M4 20h16',
  play: 'M7 4.5 19 12 7 19.5z',
  info: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 11v5M12 7.6h.01',
  warn: 'M12 3 1.5 20.5h21zM12 9.5v4.5M12 17.5h.01',
  dot: 'M12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
  /* ── 다원핏 앱 추가 ── */
  dumbbell: 'M2.5 12h2M19.5 12h2M8.5 12h7M4.5 9.5v5M7 7v10M17 7v10M19.5 9.5v5',
  checkSquare: 'M4.5 6A1.5 1.5 0 0 1 6 4.5h12A1.5 1.5 0 0 1 19.5 6v12a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18zM8.5 12.2l2.5 2.5 5-5.4',
  chat: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.6-.3-3.7-.9L4 20l.9-4.8a8.5 8.5 0 1 1 16.1-3.7zM8.5 11.5h.01M12.5 11.5h.01M16.5 11.5h.01',
  wallet: 'M3.5 7A1.5 1.5 0 0 1 5 5.5h12.5V8M3.5 7v10A1.5 1.5 0 0 0 5 18.5h14a1.5 1.5 0 0 0 1.5-1.5V9.5A1.5 1.5 0 0 0 19 8H3.5M16 13.2h.01',
  /* ── 김민정스킨바디 앱 추가 ── */
  userPlus: 'M4 21v-1a6 6 0 0 1 6-6h3M11 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM19 15v6M16 18h6',
  face: 'M12 21a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM9 12h.01M15 12h.01M9.5 16c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1M20 4c-1 1.2-2.6 2-4 2 0-1.4.8-3 2-4',
  calendarDots: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 9.5h16M8 3v3M16 3v3M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01',
  history: 'M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 3.5V9H9M12 8v4.5l3 2',
  bars: 'M5 20v-6M12 20V9M19 20V4',
  archive: 'M3.5 5h17v4h-17zM5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4',
  tag: 'M3 11.5V4h7.5L21 14.5 13.5 22zM7.5 8.5h.01',
  /* ── 정수기업 앱에서 가져온 것 ── */
  bus: 'M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17V6A1.5 1.5 0 0 1 5 4.5zM3.5 12h17M7 15.5h.01M17 15.5h.01M7.5 18.5v2M16.5 18.5v2M9 4.5v7M15 4.5v7',
  car: 'M4 13.5 5.8 8.6A2 2 0 0 1 7.7 7.3h8.6a2 2 0 0 1 1.9 1.3L20 13.5M4 13.5h16v4.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-9v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM7.5 16h.01M16.5 16h.01',
  menu: 'M4 7h16M4 12h16M4 17h16',
  receipt: 'M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21zM9.5 8.5h5M9.5 12h5M9.5 15.5h3',
  calendarCheck: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 9h16M8 3v3M16 3v3M9 15l2.2 2.2L15.5 13',
  route: 'M6 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8.5 16.5H15a3 3 0 0 0 0-6h-5a3 3 0 0 1 0-6h5.5M18 10v.01',
  coins: 'M12 8.5c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3zM4 5.5v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4M4 9.5v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4M4 13.5v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4',
  users: 'M9.5 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1M16.5 11.3a3.2 3.2 0 0 0 0-6.1M21 20v-1a4.5 4.5 0 0 0-3-4.2',
  refresh: 'M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3M20 4v4h-4M4 20v-4h4',
  /* ── 한결6624 앱 추가 ── */
  truck: 'M2.5 6.5h11v9h-11zM13.5 9.5h3.5l3.5 3.3v2.7h-7M8 17.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 17.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
  won: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM7.5 8.5l1.6 7 2.9-6 2.9 6 1.6-7M7 12.5h10',
  building: 'M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 9.5h5a1 1 0 0 1 1 1V21M2.5 21h19M7.5 7.5h2M7.5 11h2M7.5 14.5h2M17 13h1.5M17 16.5h1.5M9 21v-3.5h1.5V21',
  fuel: 'M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M2.5 21h13M6.5 6.5h5v4h-5zM14 10.5h1.5a2 2 0 0 1 2 2v4.5a1.5 1.5 0 0 0 3 0V9.5L18 7',
  wrench: 'M14.5 6.5a4.5 4.5 0 0 0 5.6 5.6l-9.3 9.3a2.1 2.1 0 0 1-3-3l9.3-9.3a4.5 4.5 0 0 0 5.6 5.6M14.5 6.5 17 4l3 3-2.5 2.5',
  parking: 'M6.5 21V3.5h5.5a4.75 4.75 0 0 1 0 9.5H6.5',
  /* ── 라온하우징 앱 추가 ── */
  wind: 'M3 8h9.5a2.5 2.5 0 1 0-2.4-3.2M3 12h13.5a3 3 0 1 1-2.9 3.8M3 16h7.5a2 2 0 1 1-1.9 2.6',
  bubbles: 'M12 9.5a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM7 20.5a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17 20.5a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z',
  headset: 'M4 14v-1a8 8 0 0 1 16 0v1M4 14a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2zM20 14a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2zM17 19a3 3 0 0 1-3 3h-2',
  image: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 16.5l4.5-4.5 3.5 3.5 2.5-2.5L20 18M15.5 9h.01',
  package: 'M3.5 8 12 4l8.5 4v8L12 20l-8.5-4zM3.5 8 12 12m0 0 8.5-4M12 12v8M7.5 6l8.5 4',
  docPen: 'M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M13 3v5h5M18.5 13.5 14 18l-.5 2.5L16 20l4.5-4.5a1.4 1.4 0 0 0-2-2zM9 12h4M9 16h2',
  houseTag: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 21v-6h6v6',
  roller: 'M3.5 5.5A1.5 1.5 0 0 1 5 4h9a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 14 9H5a1.5 1.5 0 0 1-1.5-1.5zM15.5 6.5h3A1.5 1.5 0 0 1 20 8v2a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 0 10 13v1M8.4 14h3.2a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H8.4a.6.6 0 0 1-.6-.6v-4.8a.6.6 0 0 1 .6-.6z', /* 해강건축: 인테리어(페인트 롤러) */
  tools: 'M3.2 20.8h3.6l11.6-11.6a2 2 0 0 0-3.6-3.6L3.2 17.2zM14.2 6.2l3.6 3.6M11.4 8.2 6.6 3.4l-3.4 3.4 4.8 4.8M15.4 12.2l4.8 4.8-3.4 3.4-4.8-4.8', /* 해강건축: 시안의 렌치+드라이버 교차 */
  mask: 'M4 10c0-2 3.5-4 8-4s8 2 8 4v3c0 3.5-3.5 6-8 6s-8-2.5-8-6zM4 11H2.5a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2H4M20 11h1.5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H20M9 11h6M9 14h6',
  mapPin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z',
  /* ── 우성건업 앱 추가 ── */
  /* ── 현대주방메탈팩토리 앱 추가: 배기후드(사다리꼴 후드 + 하단 필터선) ── */
  hood: 'M8 5h8l4 8H4zM4 13h16v3H4zM8 20h8M12 16v4',
  /* ── 효령테크 앱 추가 ── */
  factory: 'M2.5 21h19M3.5 21v-9.5l5 3v-3l5 3V4h3.5v17M17 8.5h3.5V21M6.5 17.5h2M11 17.5h2',
  globe: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM3 12h18M12 3c2.4 2.5 3.7 5.5 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-5.5-3.7-9S9.6 5.5 12 3z',
  clipboard: 'M9 4.5H7A1.5 1.5 0 0 0 5.5 6v13.5A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 17 4.5h-2M9 3h6v3H9zM8.5 11h7M8.5 14.5h7M8.5 18h4',
  clipboardCheck: 'M9 4.5H7A1.5 1.5 0 0 0 5.5 6v13.5A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 17 4.5h-2M9 3h6v3H9zM8.8 13.8l2.2 2.2 4.2-4.6',
  handshake: 'M2 8.5 5.5 6.5l3.5 1.2M22 8.5l-3.5-2-4.5 1.2-4.7 4a1.6 1.6 0 0 0 2.2 2.3l2.5-1.8 5.2 4.8M2 8.5v6.3l2.6.4 5.3 4.3a1.4 1.4 0 0 0 2-2M22 8.5v6.3l-2.6.4-3.2 2.8M12 17.8l1.3 1.1a1.4 1.4 0 0 0 2-1.9M9.6 15.6l2.4 2.2',
  caseBox: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8.5 16.5v-4.3L12 9.2l3.5 3v4.3M10.6 16.5v-2.6h2.8v2.6',
  // 서호에너지 '무료 견적 상담' 띠의 오른쪽 화살표
  arrowRight: 'M4.5 12h15M13.5 6l6 6-6 6',
}

/* 래스터 아이콘 — 자주쓰는아이콘/ 폴더의 PNG를 CSS 마스크로 그려 currentColor 를 입힌다(우성건업 추가).
   검은 실루엣 + 투명 배경 PNG면 어떤 색으로든 나온다. 이름이 겹치면 PATHS 보다 우선한다. */
const IMAGES = {
  // 만물상토탈솔루션 '내 공사' 탭 — 자주사용하는이미지/아이콘/안전모.png (여백만 잘라 정사각)
  helmet: 'img/icon-helmet.png',
  // 홈케어마스터 — 서비스 탭·작업내역 스패너는 자주사용하는이미지/아이콘/수리.png, 공지사항 확성기는 서호에너지 시안 글리프
  // 서호에너지 — 홈 4칸·고객센터 4칸·견적 상담 띠 아이콘은 시안 글리프를 잘라 마스크로 만들었다(crops/make_icons.py).
  // 스패너만 자주사용하는이미지/아이콘/수리.png(손그림 스패너 금지).
  sWrench: 'img/ic-wrench.png',
  sDrop: 'img/ic-drop.png',
  sPipe: 'img/ic-pipe.png',
  sGear: 'img/ic-gear.png',
  sHeadset: 'img/ic-headset.png',
  sAsDoc: 'img/ic-asdoc.png',
  sBook: 'img/ic-book.png',
  sMegaphone: 'img/ic-megaphone.png',
  sClipboard: 'img/ic-clipboard.png',
}

/* 채움 + 굵은 선 아이콘 — 효령테크 홈 실시간 현황(시안: 남색 굵은 윤곽 + 연파랑 채움, 사람은 남색 채움) */
const gearPath = (() => {
  const cx = 12, cy = 12, rOut = 9.6, rIn = 7.4, teeth = 8, pts = []
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2 - Math.PI / 2
    const w = Math.PI / teeth
    const at = (r, ang) => `${(cx + r * Math.cos(ang)).toFixed(2)},${(cy + r * Math.sin(ang)).toFixed(2)}`
    pts.push(at(rIn, a - w * 0.62), at(rOut, a - w * 0.36), at(rOut, a + w * 0.36), at(rIn, a + w * 0.62))
  }
  return `M${pts.join('L')}Z`
})()
const NAVY = '#0a4a9f'
const TINT = '#d6e4f6'
const DRAWN = {
  /* ── 만물상토탈솔루션: 시안 홈 서비스 6칸의 색 아이콘(주황 집·파랑 스패너·파랑 빌딩·빨강 소화기·주황 가게·파랑 별 방패) ── */
  mHouse: (
    <>
      <path d="M12 2.6 1.8 11.2l1.5 1.7L12 5.6l8.7 7.3 1.5-1.7z" fill="#f7820a" />
      <path d="M4.6 11.9 12 5.8l7.4 6.1v8.4a1 1 0 0 1-1 1H5.6a1 1 0 0 1-1-1z" fill="#fb9a3a" />
      <rect x="9.6" y="14.4" width="4.8" height="6.9" rx=".6" fill="#fff" />
    </>
  ),
  mWrench: (
    <path
      d="M20.8 6.2a5.4 5.4 0 0 1-7 6.3L6.4 20a2.2 2.2 0 0 1-3.1-3.1l7.5-7.4a5.4 5.4 0 0 1 6.3-7l-3.2 3.2.6 2.7 2.7.6zM5 19.4a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8z"
      fill="#1a7fd0"
      fillRule="evenodd"
    />
  ),
  mBuilding: (
    <>
      <rect x="5.4" y="2.2" width="13.2" height="19.6" rx="1" fill="#1a7fd0" />
      <path d="M8 5.4h2v2H8zM11 5.4h2v2h-2zM14 5.4h2v2h-2zM8 9.2h2v2H8zM11 9.2h2v2h-2zM14 9.2h2v2h-2zM8 13h2v2H8zM11 13h2v2h-2zM14 13h2v2h-2z" fill="#fff" />
      <rect x="10.4" y="17" width="3.2" height="4.8" fill="#fff" />
    </>
  ),
  mExt: (
    <>
      <path d="M9 4.2h4.6l3.6-1.6v2.6l-3.6-.2" fill="#3a4250" />
      <path d="M8.2 4.6c-2 .7-3.5 2.4-3.5 5" fill="none" stroke="#3a4250" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="9.4" y="2.4" width="3.6" height="3.2" rx=".6" fill="#3a4250" />
      <path d="M7.6 9.6a3.6 3.6 0 0 1 3.6-3.6h0a3.6 3.6 0 0 1 3.6 3.6v11a1 1 0 0 1-1 1H8.6a1 1 0 0 1-1-1z" fill="#e8402d" />
      <rect x="8.8" y="11.6" width="4.8" height="4.6" rx=".5" fill="#fff" opacity=".9" />
    </>
  ),
  mStore: (
    <>
      <path d="M3.4 3.4h17.2l1.6 5.2H1.8z" fill="#f7820a" />
      <path d="M1.8 8.6h20.4v1.1a2.6 2.6 0 0 1-5.1 0 2.6 2.6 0 0 1-5.1 0 2.6 2.6 0 0 1-5.1 0 2.6 2.6 0 0 1-5.1 0z" fill="#fb9a3a" />
      <path d="M3.4 12.4h17.2v8.4a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1z" fill="#f7820a" />
      <rect x="9.6" y="14.6" width="4.8" height="7.2" rx=".5" fill="#fff" />
    </>
  ),
  mShield: (
    <>
      <path d="M12 1.8 20.6 5v6.6c0 5.4-3.6 9-8.6 10.6-5-1.6-8.6-5.2-8.6-10.6V5z" fill="#1a7fd0" />
      <path d="m12 6.6 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#fff" />
    </>
  ),
  /* 시안 실시간 현황·요약 카드 아이콘(파랑 폴더·주황 문서·보라 말풍선·초록 체크·파랑 톱니) */
  mFolder: <path d="M2.6 6a1.6 1.6 0 0 1 1.6-1.6h5l2 2.2h8.6a1.6 1.6 0 0 1 1.6 1.6v10.4a1.6 1.6 0 0 1-1.6 1.6H4.2a1.6 1.6 0 0 1-1.6-1.6z" fill="#1a89db" />,
  mDoc: (
    <>
      <path d="M6 2.4h8.4l4.6 4.8v13.2a1.2 1.2 0 0 1-1.2 1.2H6a1.2 1.2 0 0 1-1.2-1.2V3.6A1.2 1.2 0 0 1 6 2.4z" fill="#fb9a3a" />
      <path d="M14.4 2.4v4.8H19z" fill="#fdc690" />
      <path d="M8 11h8M8 14.2h8M8 17.4h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  mChat: (
    <>
      <path d="M4.2 3.6h15.6a1.6 1.6 0 0 1 1.6 1.6v10.4a1.6 1.6 0 0 1-1.6 1.6H11l-4.6 3.6v-3.6H4.2a1.6 1.6 0 0 1-1.6-1.6V5.2a1.6 1.6 0 0 1 1.6-1.6z" fill="#7b62e0" />
      <path d="M8 10.4h2M14 10.4h2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  mCheck: (
    <>
      <circle cx="12" cy="12" r="9.6" fill="#2fa564" />
      <path d="m7.6 12.2 3 3 5.8-6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  mGear: (
    <>
      <path d={gearPath} fill="#1a7fd0" />
      <circle cx="12" cy="12" r="3.4" fill="#fff" />
    </>
  ),
  /* 은성기공 홈 현황 카드 — 시안의 채운 아이콘(슬레이트 기어 · 초록 방패 · 슬레이트 문서 · 주황 트럭) */
  esGear: (
    <>
      <path d={gearPath} fill="#3a4a63" />
      <circle cx="12" cy="12" r="3.6" fill="#fff" />
    </>
  ),
  esShield: (
    <>
      <path d="M12 2.4 20 5.4v6.2c0 5.2-3.4 8.6-8 10-4.6-1.400-8-4.800-8-10V5.400z" fill="#1fa86a" />
      <path d="M8.300 12.100l2.700 2.700 4.900-5.200" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  esDoc: (
    <>
      <path d="M6.200 2.600h8.200l4.800 4.900v12.700a1.300 1.300 0 0 1-1.300 1.300H6.200a1.300 1.300 0 0 1-1.300-1.300V3.900a1.300 1.300 0 0 1 1.300-1.300z" fill="#3a4a63" />
      <path d="M14.400 2.600v4.900h4.800z" fill="#8492a8" />
      <path d="M8.300 11h7.400M8.300 14.200h7.400M8.300 17.400h4.600" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  esTruck: (
    <>
      <rect x="1.600" y="5.600" width="12.800" height="10.600" rx="1.400" fill="#f07a1f" />
      <path d="M14.400 8.600h3.900l4.100 4.100v3.500h-8z" fill="#f59a4c" />
      <path d="M16 10.200h1.900l2 2.100H16z" fill="#fff" />
      <circle cx="6.400" cy="17.300" r="2.300" fill="#f07a1f" stroke="#fff" strokeWidth="1.300" />
      <circle cx="17.700" cy="17.300" r="2.300" fill="#f07a1f" stroke="#fff" strokeWidth="1.300" />
    </>
  ),
  /* 품질관리 카드 — 윤곽 방패(체크) · 초록 원 체크 · 주황 원 X */
  qcShield: (
    <>
      <path d="M12 2.800 19.400 5.600v5.900c0 4.900-3.200 8-7.400 9.500-4.200-1.500-7.400-4.600-7.400-9.500V5.600z" fill="none" stroke="#1d2a3f" strokeWidth="1.900" strokeLinejoin="round" />
      <path d="M8.700 11.900l2.400 2.400 4.300-4.600" fill="none" stroke="#1d2a3f" strokeWidth="1.900" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  qcOk: (
    <>
      <circle cx="12" cy="12" r="10" fill="#1fa86a" />
      <path d="M7.600 12.200l3 3 5.800-6.200" fill="none" stroke="#fff" strokeWidth="2.300" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  qcFix: (
    <>
      <circle cx="12" cy="12" r="10" fill="#f0783c" />
      <path d="M8.400 8.400l7.200 7.200M15.600 8.400l-7.200 7.200" stroke="#fff" strokeWidth="2.300" strokeLinecap="round" />
    </>
  ),
  /* 주요 서비스 타일 — 채운 슬레이트 아이콘 + KS 마크(청록) */
  svcStock: (
    <>
      <path d="M12 3 21.500 7.200 12 11.400 2.500 7.200z" fill="#3a4a63" />
      <path d="M2.500 9.400 12 13.600l9.500-4.200v3.300L12 16.900l-9.500-4.200z" fill="#55657f" />
      <path d="M2.500 14.200 12 18.400l9.500-4.200v3.300L12 21.700l-9.500-4.200z" fill="#3a4a63" />
    </>
  ),
  svcKs: (
    <>
      <path d="M20.300 9.300A8.600 8.600 0 0 0 3.700 9.300M3.700 14.700a8.600 8.600 0 0 0 16.600 0" fill="none" stroke="#0e8a8a" strokeWidth="2.200" strokeLinecap="round" />
      <path d="M1.800 12h5M17.200 12h5" stroke="#0e8a8a" strokeWidth="2.200" strokeLinecap="round" />
      <path d="M9.300 7.600v8.800M14.900 7.600 9.600 12.500M11.400 11l3.700 5.400" fill="none" stroke="#0e8a8a" strokeWidth="2.300" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  svcTruck: (
    <>
      <rect x="1.600" y="5.600" width="12.800" height="10.600" rx="1.400" fill="#3a4a63" />
      <path d="M14.400 8.600h3.900l4.100 4.100v3.500h-8z" fill="#55657f" />
      <circle cx="6.400" cy="17.300" r="2.300" fill="#3a4a63" stroke="#fff" strokeWidth="1.300" />
      <circle cx="17.700" cy="17.300" r="2.300" fill="#3a4a63" stroke="#fff" strokeWidth="1.300" />
    </>
  ),
  svcClip: (
    <>
      <rect x="4.600" y="3.800" width="14.800" height="17.800" rx="2" fill="#3a4a63" />
      <rect x="8.400" y="2.200" width="7.200" height="3.800" rx="1.200" fill="#55657f" stroke="#fff" strokeWidth="1" />
      <path d="M8.200 10.600h7.600M8.200 13.800h7.600M8.200 17h4.800" stroke="#fff" strokeWidth="1.600" strokeLinecap="round" />
    </>
  ),
  svcUsers: (
    <>
      <circle cx="16.600" cy="7.400" r="3.700" fill="#55657f" />
      <path d="M12.600 20.800a6 7 0 0 1 10.800-3.200v3.200z" fill="#55657f" />
      <circle cx="9" cy="7" r="4.300" fill="#3a4a63" stroke="#fff" strokeWidth="1.300" />
      <path d="M1 21.200a8 8.500 0 0 1 16 0z" fill="#3a4a63" stroke="#fff" strokeWidth="1.300" strokeLinejoin="round" />
    </>
  ),
  statGear: (
    <>
      <path d={gearPath} fill="#e3edf9" stroke={NAVY} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.9" fill="#fff" stroke={NAVY} strokeWidth="1.6" />
    </>
  ),
  statTruck: (
    <>
      <rect x="1.8" y="5.2" width="12.6" height="11" rx="1" fill={TINT} stroke={NAVY} strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M14.4 8.6h3.7l3.9 4v3.6h-7.6z" fill="#e9f0fa" stroke={NAVY} strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M15.9 10.3h1.7l1.9 2" fill="none" stroke={NAVY} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4.2 7.6h2.4" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="6.2" cy="17.4" r="2.05" fill="#fff" stroke={NAVY} strokeWidth="1.9" />
      <circle cx="17.6" cy="17.4" r="2.05" fill="#fff" stroke={NAVY} strokeWidth="1.9" />
    </>
  ),
  statDoc: (
    <>
      <path d="M6.3 2.8h8.4l4.6 4.7v12.7a1.2 1.2 0 0 1-1.2 1.2H6.3a1.2 1.2 0 0 1-1.2-1.2V4a1.2 1.2 0 0 1 1.2-1.2z" fill="#fff" stroke={NAVY} strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M14.5 3v4.6h4.6" fill={TINT} stroke={NAVY} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.6 10.6h4.6M8.6 13.8h6.6M8.6 17h3.6" stroke={NAVY} strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  /* 해외사업 지표 — 시안 메뉴 아이콘(굵은 윤곽 지구본 · 채운 악수 · 채운 빌딩 · 막대 3개) */
  gGlobe: (
    <>
      <circle cx="12" cy="12" r="9" fill="#fff" stroke={NAVY} strokeWidth="2.2" />
      <path d="M12 3.2c2.5 2.4 3.7 5.3 3.7 8.8s-1.2 6.4-3.7 8.8c-2.5-2.4-3.7-5.3-3.7-8.8S9.5 5.6 12 3.2z" fill={TINT} stroke={NAVY} strokeWidth="1.7" />
      <path d="M3.6 9.3h16.8M3.6 14.7h16.8" stroke={NAVY} strokeWidth="1.7" />
    </>
  ),
  gHandshake: (
    <g transform="translate(12 12) scale(1.1) translate(-12 -12.4)">
      <path d="M0.8 9.8 4.6 6l3.6 3.6-3.8 3.8z" fill={NAVY} />
      <path d="M23.2 9.8 19.4 6l-3.6 3.6 3.8 3.8z" fill={NAVY} />
      <path d="M17.6 8.6 13.9 6.7a2.4 2.4 0 0 0-2.7.4L7.9 10.2a1.6 1.6 0 0 0 2.2 2.3l1.9-1.7 5.6 5 1.6-1.6z" fill={NAVY} />
      <path d="M6 13.2 5.2 14a1.5 1.5 0 0 0 0 2.1l4.4 4.3a1.5 1.5 0 0 0 2.1 0l5.3-5-4.9-4.5-1.8 1.6a2.6 2.6 0 0 1-3.6-.1z" fill={NAVY} />
      <path d="M8.1 15.3l1.7-1.7M9.9 17.1l1.7-1.7M11.8 18.8l1.6-1.6" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
    </g>
  ),
  gBuilding: (
    <>
      <path d="M4.6 21V7.6h2.2V5.2L9.7 3l2.9 2.2v2.4h1.9V21z" fill={NAVY} />
      <path d="M14.5 21v-9.6h5.1V21z" fill={NAVY} />
      <path d="M7 10h1.6v1.6H7zM10.2 10h1.6v1.6h-1.6zM7 13.4h1.6V15H7zM10.2 13.4h1.6V15h-1.6zM7 16.8h1.6v1.6H7zM16.2 13.6h1.6v1.5h-1.6zM16.2 16.6h1.6v1.5h-1.6z" fill="#fff" />
      <path d="M9 21v-2.2a1 1 0 0 1 2 0V21z" fill="#fff" />
      <path d="M2.5 21.4h19" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  gBars: (
    <>
      <rect x="4.6" y="12.6" width="3.6" height="8.4" rx="0.5" fill="#3b73c7" stroke={NAVY} strokeWidth="1.5" />
      <rect x="10.2" y="8.6" width="3.6" height="12.4" rx="0.5" fill="#3b73c7" stroke={NAVY} strokeWidth="1.5" />
      <rect x="15.8" y="3.6" width="3.6" height="17.4" rx="0.5" fill="#3b73c7" stroke={NAVY} strokeWidth="1.5" />
    </>
  ),
  statUsers: (
    <>
      <circle cx="16.6" cy="7.2" r="3.9" fill={NAVY} />
      <path d="M12.4 20.8a6 7.2 0 0 1 11.2-3.4v3.4z" fill={NAVY} />
      <circle cx="9" cy="6.9" r="4.4" fill={NAVY} stroke="#fff" strokeWidth="1.3" />
      <circle cx="9" cy="6.9" r="1.9" fill="#3f73c0" opacity="0.55" />
      <path d="M0.9 21.2a8.1 8.6 0 0 1 16.2 0z" fill={NAVY} stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
    </>
  ),
}

const warned = new Set()

export default function Icon({ name, size = 20, strokeWidth = 1.7, ...rest }) {
  if (DRAWN[name]) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
        {DRAWN[name]}
      </svg>
    )
  }
  const img = IMAGES[name]
  if (img) {
    // 래스터 아이콘: currentColor 를 배경으로 깔고 PNG 알파를 마스크로 써서 색을 입힌다
    const { style, className, ...more } = rest
    const mask = `url(${img}) center / contain no-repeat`
    return (
      <span
        className={`icon-img${className ? ` ${className}` : ''}`}
        aria-hidden="true"
        style={{ display: 'inline-block', flex: 'none', width: size, height: size, background: 'currentColor', WebkitMask: mask, mask, ...style }}
        {...more}
      />
    )
  }
  let d = PATHS[name]

  if (!d) {
    // 시안 해독 중 오타가 나도 화면이 깨지지 않게 대체 아이콘을 쓴다.
    if (name && !warned.has(name)) {
      warned.add(name)
      console.warn(`[icons] 알 수 없는 아이콘: "${name}" — icons.jsx의 PATHS에 추가하세요.`)
    }
    d = PATHS.dot
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}

export const ICON_NAMES = Object.keys(PATHS)
