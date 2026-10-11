/**
 * 홈케어마스터 — 날짜 기반 예시 데이터.
 *
 * 앱은 실제 오늘 날짜를 읽어 움직인다. 문의 접수일·견적일·작업 예정일·작업 완료일·알림 시각은
 * "오늘로부터 며칠"(오프셋)로 두어 내일 열면 내일 기준으로 목록이 다시 계산된다.
 *
 * spec.json 문자열 안의 토큰:  {today}  {today+2:M월 D일}  {today:YYYY년 M월}  {today:iso}
 *
 * **이 앱은 홈케어마스터가 일반 소비자에게 배포하는 고객용 앱이다**(2026-10-11 사용자 지정).
 * 목록은 전부 "이 고객이 맡긴 건" 기준이다 — 회사 전체 실적·남의 의뢰·상태 변경은 넣지 않는다(규칙 22).
 *
 * 시안에 보이는 것(배너 문구, 서비스 6종 이름·설명, 작업사례 3건 이름, 견적문의 폼 자리표시,
 * 마이페이지 메뉴 5개)은 문구 그대로 두었다.
 * 내 상담·견적·작업 8건, 작업사례 9건의 제목·현장, 알림은 시안에 없어 만든 예시 데이터다(고객 확인 필요).
 */

export const WD = ['일', '월', '화', '수', '목', '금', '토']
const pad = (n) => String(n).padStart(2, '0')

export const TODAY = (() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})()

export const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromIso = (k) => {
  const [y, m, d] = String(k).split('-').map(Number)
  return new Date(y, m - 1, d)
}
const daysFromToday = (d) => Math.round((d - TODAY) / 86400000)

export function fmt(d, f = 'YYYY.MM.DD') {
  if (f === 'iso') return iso(d)
  return f.replace(/YYYY|YY|MM|DD|ddd|M|D/g, (t) => {
    switch (t) {
      case 'YYYY':
        return d.getFullYear()
      case 'YY':
        return pad(d.getFullYear() % 100)
      case 'MM':
        return pad(d.getMonth() + 1)
      case 'M':
        return d.getMonth() + 1
      case 'DD':
        return pad(d.getDate())
      case 'D':
        return d.getDate()
      case 'ddd':
        return WD[d.getDay()]
      default:
        return t
    }
  })
}

/** 문자열·배열·객체 안의 {today±N:FMT} 토큰을 오늘 기준 날짜로 바꾼다. */
export function resolveTokens(v) {
  if (typeof v === 'string') {
    if (!v.includes('{today')) return v
    return v.replace(/\{today([+-]\d+)?(?::([^}]+))?\}/g, (_, n, f) => fmt(addDays(TODAY, Number(n || 0)), f))
  }
  if (Array.isArray(v)) return v.map(resolveTokens)
  if (v && typeof v === 'object') {
    const out = {}
    for (const k of Object.keys(v)) out[k] = resolveTokens(v[k])
    return out
  }
  return v
}

/* ── 선택 항목 전달 (목록 행 → 다음 화면) ───────── */
export const selected = {}
export function setSelected(data) {
  for (const k of Object.keys(selected)) delete selected[k]
  Object.assign(selected, data || {})
}
export function resolveSel(v) {
  if (typeof v === 'string') return v.startsWith('@sel:') ? (selected[v.slice(5)] ?? '') : v
  if (Array.isArray(v)) return v.map(resolveSel)
  if (v && typeof v === 'object') {
    const out = {}
    for (const k of Object.keys(v)) out[k] = resolveSel(v[k])
    return out
  }
  return v
}

/* ── localStorage ───────────────────────────────── */
export const readLS = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null')
    return v ?? fallback
  } catch {
    return fallback
  }
}
export const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 저장이 막힌 환경이면 화면 상태만 유지한다 */
  }
}
/** added:* 목록 읽기 — 배열이 아니거나 중간에 null·문자열이 섞여도 화면이 죽지 않게 거른다. */
export const readList = (key) => {
  const v = readLS(key, [])
  return Array.isArray(v) ? v.filter((r) => r && typeof r === 'object') : []
}
export const prependLS = (key, rec) => writeLS(key, [rec, ...readList(key)].slice(0, 50))

/* 상대 시각 표기 — "10분 전 · 1시간 전 · 1일 전" */
const agoLabel = (mins) => {
  if (mins < 60) return `${mins}분 전`
  if (mins < 60 * 24) return `${Math.floor(mins / 60)}시간 전`
  return `${Math.floor(mins / (60 * 24))}일 전`
}
const won = (n) => `${n.toLocaleString('ko-KR')}원`
/** 금액을 억/만 단위로 줄인다(규칙 14). 1만원 미만은 쉼표 그대로. */
export function shortWon(n) {
  if (!n) return '0원'
  if (n >= 100000000) {
    const v = n / 100000000
    return `${v >= 10 ? Math.round(v) : v.toFixed(2).replace(/\.?0+$/, '')}억원`
  }
  if (n >= 10000) {
    const man = n / 10000
    return man < 100 && n % 10000 ? `${man.toFixed(1).replace(/\.0$/, '')}만원` : `${Math.round(man).toLocaleString('ko-KR')}만원`
  }
  return `${n.toLocaleString('ko-KR')}원`
}

/* ══════════════════════════════════════════════════
   0. 서비스 6종 — 시안 홈 6칸·전체 서비스 목록 그대로.
   홈 칸·전체 서비스 행을 누르면 견적문의의 '서비스'가 그 값으로 골라져 열린다.
   ══════════════════════════════════════════════════ */
export const SERVICES = ['옥상방수', '외벽방수', '방충망 시공', '쇼파청소', '침대·매트리스 청소', '배관막힘']
const SVC_IMAGE = {
  옥상방수: 'img/svc-roof.jpg',
  외벽방수: 'img/svc-wall.jpg',
  '방충망 시공': 'img/svc-screen.jpg',
  쇼파청소: 'img/svc-sofa.jpg',
  '침대·매트리스 청소': 'img/svc-bed.jpg',
  배관막힘: 'img/svc-pipe.jpg',
}
/** 견적문의 상단 — 고른 서비스의 시공 사진 4장(청소·방수·배관 시공 서비스 갤러리.png, 2026-10-11 사용자 제공) */
const GAL_KEY = { 옥상방수: 'roof', 외벽방수: 'wall', '방충망 시공': 'screen', 쇼파청소: 'sofa', '침대·매트리스 청소': 'bed', 배관막힘: 'pipe' }
export const svcGallery = (k) => (GAL_KEY[k] ? [1, 2, 3, 4].map((n) => `img/gal-${GAL_KEY[k]}-${n}.jpg`) : null)
const SVC_DESC = {
  옥상방수: ['옥상 누수 예방', '전문 방수 시공 서비스'],
  외벽방수: ['건물 외벽 누수 차단', '안전한 방수 시공'],
  '방충망 시공': ['미세먼지·벌레 차단', '맞춤 방충망 설치'],
  쇼파청소: ['패브릭·가죽 쇼파 전문 청소', '얼룩·냄새 제거'],
  '침대·매트리스 청소': ['진드기 제거, 위생 관리', '쾌적한 수면 환경'],
  배관막힘: ['싱크대·세면대·변기 등', '막힘 해결 및 배관 관리'],
}

/* ── 시공 안내 (전체 서비스 → 서비스를 누르면 여는 단계별 안내, 2026-10-11 사용자 요청) ──
   사진은 '청소·방수·배관 시공 서비스 갤러리.png' 의 서비스별 4장(갤러리 순서 = 단계 순서).
   단계 이름·설명은 사진을 보고 쓴 예시 문구다(고객 확인 필요). */
const GUIDE_STEPS = {
  옥상방수: [
    ['현장 점검', '노후된 옥상 바닥의 들뜸·균열·고인 물을 확인합니다.'],
    ['방수 시공', '바닥을 청소하고 방수재를 꼼꼼히 바릅니다.'],
    ['방수층 완성', '빈틈 없는 방수층으로 빗물 스밈을 막습니다.'],
    ['마감 점검', '배수구·벽 모서리 마감까지 확인합니다.'],
  ],
  외벽방수: [
    ['균열 보수', '외벽 크랙에 보수재를 채워 물길을 막습니다.'],
    ['방수재 도포', '로프 작업으로 외벽 전체에 방수재를 바릅니다.'],
    ['고층부 시공', '안전 장비를 갖추고 높은 층까지 빠짐없이 시공합니다.'],
    ['시공 완료', '매끈하게 마감된 외벽을 확인합니다.'],
  ],
  '방충망 시공': [
    ['기존 방충망 철거', '낡은 방충망과 틀을 떼어 냅니다.'],
    ['맞춤 방충망 설치', '창 크기에 맞춘 방충망을 끼웁니다.'],
    ['설치 완료', '미세먼지·벌레를 막는 새 방충망으로 바뀝니다.'],
    ['밀착 확인', '틈새 없이 닫히는지 마지막으로 확인합니다.'],
  ],
  쇼파청소: [
    ['오염 확인·세척', '얼룩 부위를 확인하고 전용 장비로 세척합니다.'],
    ['딥 클리닝', '오염물과 세제를 함께 흡입해 냄새까지 뺍니다.'],
    ['건조·정리', '물기를 말리고 쿠션 모양을 정리합니다.'],
    ['청소 완료', '깨끗해진 쇼파 상태를 함께 확인합니다.'],
  ],
  '침대·매트리스 청소': [
    ['진드기 흡입', '매트리스 표면의 진드기·먼지를 흡입합니다.'],
    ['오염 세척', '땀·얼룩 오염을 습식 세척으로 빼냅니다.'],
    ['건조·정리', '충분히 말린 뒤 침대에 다시 놓습니다.'],
    ['청소 완료', '쾌적한 수면 환경을 확인합니다.'],
  ],
  배관막힘: [
    ['막힘 진단', '전용 장비로 막힌 위치와 원인을 찾습니다.'],
    ['이물질 제거', '배관 안에 쌓인 찌꺼기를 걷어 냅니다.'],
    ['배관 재조립', '깨끗해진 배관을 단단히 다시 연결합니다.'],
    ['배수 확인', '물이 시원하게 내려가는지 확인합니다.'],
  ],
}
export function svcGuide(k) {
  const photos = svcGallery(k)
  if (!photos) return null
  return {
    name: k,
    desc: SVC_DESC[k],
    image: SVC_IMAGE[k],
    steps: GUIDE_STEPS[k].map(([title, desc], i) => ({ image: photos[i], title, desc })),
  }
}

/* ── 관심 서비스 (전체 서비스 행의 하트) ── */
const FAV_KEY = 'favs'
const DEFAULT_FAVS = ['옥상방수', '쇼파청소']
const favList = () => {
  const v = readLS(FAV_KEY, DEFAULT_FAVS)
  return Array.isArray(v) ? v.filter((k) => SERVICES.includes(k)) : DEFAULT_FAVS
}
export const isFav = (k) => favList().includes(k)
export function toggleFav(k) {
  const cur = favList()
  writeLS(FAV_KEY, cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k])
  window.dispatchEvent(new CustomEvent('store:changed'))
}

/* ══════════════════════════════════════════════════
   1. 내 의뢰 — 8건. 문의 → 상담 → 견적 → 작업 한 줄기로 이어진다.
   상담내역·견적내역·작업내역은 이 목록을 단계별로 보여 준다.
   [번호, 서비스, 제목, 현장, 문의 며칠 전, 상담 상태, 견적 금액, 견적 상태, 작업일 오프셋, 메모]
   견적 상태: 견적 도착(확인 대기) · 승인 · 보류 / 작업일 오프셋: + 는 예정, - 는 완료
   ══════════════════════════════════════════════════ */
const MY_REQUESTS = [
  ['HC-2611', '쇼파청소', '거실 패브릭 쇼파 얼룩 청소', '아파트 거실', 1, '상담중', 0, null, null, '3인용 패브릭 쇼파에 커피 얼룩이 번졌어요.'],
  ['HC-2607', '배관막힘', '주방 싱크대 배수 막힘', '아파트 주방', 4, '상담완료', 87000, '견적 도착', null, '물이 천천히 빠지다가 오늘은 거의 안 내려가요.'],
  ['HC-2598', '옥상방수', '옥상 바닥 우레탄 방수', '단독주택 옥상', 9, '상담완료', 3860000, '승인', 3, '비 오면 2층 천장에 물자국이 생깁니다. 옥상 약 72㎡.'],
  ['HC-2584', '방충망 시공', '거실·안방 창 방충망 교체', '아파트 거실·안방', 18, '상담완료', 342000, '승인', -12, '미세방충망으로 4곳 교체 원합니다.'],
  ['HC-2571', '침대·매트리스 청소', '퀸 매트리스 진드기 케어', '안방·작은방', 33, '상담완료', 138000, '승인', -27, '퀸 매트리스 2개, 아이가 비염이 있어요.'],
  ['HC-2549', '외벽방수', '외벽 크랙 보수·발수 코팅', '단독주택 외벽', 52, '상담완료', 2470000, '보류', null, '외벽 실금 사이로 빗물이 스며드는 것 같아요.'],
  ['HC-2533', '쇼파청소', '가죽 쇼파 클리닝', '아파트 거실', 74, '상담완료', 96000, '승인', -70, '4인용 가죽 쇼파 오염·광택 관리.'],
  ['HC-2516', '배관막힘', '욕실 세면대 배수 막힘', '아파트 욕실', 103, '상담완료', 73000, '승인', -101, '세면대 물이 고여요.'],
]

/** 견적문의 폼이 저장한 건 — 상담내역 맨 위 '접수'로 들어간다 */
function addedRequests() {
  const list = readList('added:quotes')
  return list.map((r, i) => {
    const svc = SERVICES.includes(r.svc) ? r.svc : SERVICES[0]
    return {
      id: `HC-${2612 + list.length - 1 - i}`,
      svc,
      title: `${svc} 견적 문의`,
      site: r.addr || '',
      date: r.dateKey ? fromIso(r.dateKey) : TODAY,
      consult: '접수',
      amount: 0,
      quote: null,
      work: null,
      memo: r.memo || '',
      name: r.name || '',
      tel: r.tel || '',
      photos: r.photos || '',
      isNew: true,
    }
  })
}
function allRequests() {
  const base = MY_REQUESTS.map(([id, svc, title, site, ago, consult, amount, quote, work, memo]) => ({
    id,
    svc,
    title,
    site,
    date: addDays(TODAY, -ago),
    consult,
    amount,
    quote,
    work: work === null ? null : addDays(TODAY, work),
    memo,
  }))
  return [...addedRequests(), ...base]
}

const CONSULT_TONE = { 접수: 'sky', 상담중: 'amber', 상담완료: 'green' }
const QUOTE_TONE = { '견적 도착': 'sky', 승인: 'green', 보류: 'gray' }

const baseBody = (r) =>
  [
    ['문의 번호', r.id],
    ['문의일', fmt(r.date, 'YYYY.MM.DD (ddd)')],
    ['서비스', r.svc],
    r.site && ['시공주소', r.site],
    r.tel && ['연락처', r.tel],
    r.photos && ['사진', r.photos],
    r.memo && ['문의 내용', r.memo],
  ].filter(Boolean)

/* 상담내역 — 모든 문의 */
const consultRows = () =>
  allRequests().map((r) => ({
    id: r.id,
    image: SVC_IMAGE[r.svc],
    eyebrow: `${r.svc} · ${r.site || '현장'}`,
    title: r.title,
    desc: r.isNew ? '방금 접수 · 담당자 확인 중' : r.consult === '상담중' ? `문의 ${fmt(r.date, 'M/D')} · 담당자 상담 중` : `문의 ${fmt(r.date, 'M/D')} · 상담 완료`,
    tag: r.consult,
    tagTone: CONSULT_TONE[r.consult],
    isNew: r.isNew,
    body: baseBody(r),
  }))

/* 견적내역 — 견적이 나온 건 */
const quoteRows = () =>
  allRequests()
    .filter((r) => r.quote)
    .map((r) => ({
      id: r.id,
      image: SVC_IMAGE[r.svc],
      eyebrow: `${r.svc} · ${r.site}`,
      title: r.title,
      desc: `견적 금액 ${won(r.amount)}`,
      tag: r.quote,
      tagTone: QUOTE_TONE[r.quote],
      body: [
        ['문의 번호', r.id],
        ['견적 금액', `${won(r.amount)} (부가세 포함)`],
        ['견적 상태', r.quote === '견적 도착' ? '확인 대기' : r.quote],
        r.work && ['작업일', fmt(r.work, 'YYYY.MM.DD (ddd)')],
        ['시공주소', r.site],
      ].filter(Boolean),
    }))

/* 작업내역 — 작업 예정·완료 */
const workRows = () =>
  allRequests()
    .filter((r) => r.work)
    .sort((a, b) => b.work - a.work)
    .map((r) => {
      const off = daysFromToday(r.work)
      const upcoming = off >= 0
      return {
        id: r.id,
        image: SVC_IMAGE[r.svc],
        eyebrow: `${r.svc} · ${r.site}`,
        title: r.title,
        desc: upcoming ? `작업 예정 ${fmt(r.work, 'M/D (ddd)')} · ${off === 0 ? '오늘' : `D-${off}`}` : `작업 완료 ${fmt(r.work, 'M/D')}`,
        tag: upcoming ? '작업 예정' : '작업 완료',
        tagTone: upcoming ? 'sky' : 'green',
        body: [
          ['문의 번호', r.id],
          [upcoming ? '작업 예정일' : '작업 완료일', fmt(r.work, 'YYYY.MM.DD (ddd)')],
          ['시공 금액', won(r.amount)],
          ['시공주소', r.site],
        ],
      }
    })

/* 관심 서비스 — 하트 누른 서비스, 누르면 그 서비스의 시공 안내 */
const favRows = () =>
  favList().map((k) => ({
    image: SVC_IMAGE[k],
    title: k,
    desc: SVC_DESC[k],
    to: 'guide',
    data: { svc: k },
  }))

/* 전체 서비스 목록 — 하트(관심 서비스) 상태를 함께 싣는다 */
const serviceRows = () =>
  SERVICES.map((k) => ({
    image: SVC_IMAGE[k],
    title: k,
    desc: SVC_DESC[k],
    to: 'guide',
    data: { svc: k },
    fav: k,
  }))

/* ══════════════════════════════════════════════════
   2. 작업사례 — 9건. 사진은 시안(홈 작업사례 3장 + 홈 서비스 칸 6장)에서 잘랐다.
   [서비스, 사진, 제목, 현장, 완료 며칠 전]
   ══════════════════════════════════════════════════ */
const CASES = [
  ['옥상방수', 'img/case-roof.jpg', '옥상 우레탄 방수 시공', '단독주택 옥상 72㎡', 6],
  ['외벽방수', 'img/case-wall.jpg', '외벽 크랙 보수·발수 코팅', '4층 빌라 외벽', 11],
  ['쇼파청소', 'img/case-sofa.jpg', '패브릭 쇼파 얼룩 제거', '3인용 패브릭 쇼파', 15],
  ['배관막힘', 'img/tile-pipe.jpg', '주방 싱크대 배관 막힘 해결', '아파트 주방 배수관', 19],
  ['방충망 시공', 'img/tile-screen.jpg', '거실 창 미세방충망 교체', '아파트 창 4곳', 24],
  ['침대·매트리스 청소', 'img/tile-bed.jpg', '퀸 매트리스 진드기 케어', '퀸 매트리스 2개', 31],
  ['옥상방수', 'img/tile-roof.jpg', '옥상 바닥 균열 보수·방수', '상가주택 옥상 48㎡', 38],
  ['외벽방수', 'img/tile-wall.jpg', '외벽 창호 둘레 실리콘 재시공', '아파트 외벽', 46],
  ['쇼파청소', 'img/tile-sofa.jpg', '쇼파 진드기·냄새 케어', '4인용 패브릭 쇼파', 57],
]
const caseItems = () =>
  CASES.map(([group, image, title, site, ago]) => ({
    group,
    image,
    title,
    sub: `${site} · ${fmt(addDays(TODAY, -ago), 'YYYY.MM.DD')}`,
  }))

/* ══════════════════════════════════════════════════
   3. 알림 — 내 의뢰에 대한 알림 5건 + 견적 문의하면 맨 위에 1건
   [제목, 분 전, 아이콘, 톤]
   ══════════════════════════════════════════════════ */
const NOTICES = [
  ['쇼파청소 상담이 시작되었습니다. 담당자가 곧 연락드립니다.', 412, 'chat', 'amber'],
  ['주방 싱크대 배수 막힘 견적이 도착했습니다.', 2875, 'doc', 'sky'],
  ['옥상 우레탄 방수 작업이 {today+3:M월 D일 (ddd)}로 예약되었습니다.', 7340, 'calendarCheck', 'sky'],
  ['거실·안방 창 방충망 교체 작업이 완료되었습니다.', 17460, 'checkCircle', 'green'],
  ['퀸 매트리스 진드기 케어 작업이 완료되었습니다.', 38950, 'checkCircle', 'green'],
]
function noticeRows() {
  const added = readList('added:quotes').map((r) => [`${SERVICES.includes(r.svc) ? r.svc : '견적'} 견적 문의가 접수되었습니다.`, 0, 'chat', 'sky', true])
  return [...added, ...NOTICES].map(([title, mins, icon, tone, isNew]) => ({
    icon,
    tone,
    title: resolveTokens(title),
    meta: mins ? agoLabel(mins) : '방금',
    isNew,
    to: 'history',
  }))
}

/* 고객용 앱이라 상태 변경·운영 지표는 없다 — blocks/index.jsx 호환용 */
export const JOB_STATUSES = []
export function setJobStatus() {}
export const ORDER_STATUSES = []
export function setOrderStatus() {}
export const hasActivity = () => false
export const dayBlocks = () => []
export const DASH_PERIODS = []
export const dashSummary = () => ({ stats: [], donut: { total: 0, pct: 0, segments: [] } })
export const monthlyCost = () => ({ bars: [], value: '0원', caption: '' })

/** 블록의 source: "종류:인자" 를 목록으로 바꾼다 */
export function sourceItems(src) {
  const [kind] = String(src).split(':')
  switch (kind) {
    case 'services':
      return serviceRows()
    case 'consults':
      return consultRows()
    case 'quotes':
      return quoteRows()
    case 'works':
      return workRows()
    case 'favs':
      return favRows()
    case 'cases':
      return caseItems()
    case 'notices':
      return noticeRows()
    default:
      console.warn(`[spec] 알 수 없는 source: "${src}"`)
      return []
  }
}

/** form 의 options: "@opt:종류" */
export function optionItems(kind) {
  switch (kind) {
    case 'services':
      return SERVICES.map((label) => ({ label }))
    default:
      return []
  }
}
