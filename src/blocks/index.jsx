import { useState, useEffect } from 'react'
import Icon from '../icons.jsx'
import { resolveTokens, resolveSel, selected, setSelected, sourceItems, optionItems, readLS, writeLS, prependLS, TODAY, iso, dayBlocks, hasActivity, setJobStatus, JOB_STATUSES, setOrderStatus, ORDER_STATUSES, dashSummary, monthlyCost, DASH_PERIODS, shortWon, isFav, toggleFav, svcGuide } from '../homecare.js'

/**
 * 블록 라이브러리.
 *
 * 화면은 이 블록들의 나열로만 만든다. spec.json의 각 항목이 블록 하나다.
 * 새 앱에서 이 파일과 blocks.css는 건드리지 않는 것이 원칙 —
 * 손대기 시작하면 앱마다 CSS를 다시 쓰던 예전 방식으로 돌아간다.
 *
 * 공통 옵션(모든 블록):
 *   title  섹션 제목
 *   more   섹션 우측 링크 텍스트
 *   to     클릭 시 이동할 화면 id
 *
 * 이 앱(해강건축)에서 추가한 것:
 *   - 목록·지표 블록의 `source`: haegang.js 의 오늘 기준 예시 데이터를 읽는다
 *   - barChart 의 `stacked`, costCard·svcCards 블록, form chips 의 `icons`, panels 의 `variant`
 *   - 행의 `data`: 누르면 selected 에 담기고, 상세 화면 블록이 "@sel:필드" 로 읽는다
 *   - records / actions / panels 블록
 */

/* ── 공통 래퍼 ─────────────────────────────── */
function Section({ title, more, moreIcon, onMore, card, children }) {
  if (!title && !more && !card) return children
  // card: 제목까지 흰 카드 안에 넣는다(만물상토탈솔루션 홈 실시간 현황·최근 알림)
  return (
    <section className={`section${card ? ' is-card' : ''}`}>
      {(title || more) && (
        <div className="section-head">
          {title ? <h2>{title}</h2> : <span />}
          {more && (
            // more: true 면 글자 없이 꺾쇠만 그린다(만물상토탈솔루션 시안 최근 알림 '>')
            <button className={`more${more === true ? ' is-icon' : ''}`} onClick={onMore} aria-label={more === true ? '더보기' : undefined}>
              {moreIcon && <Icon name={moreIcon} size={13} />}
              {more === true ? null : more}
              {!moreIcon && <Icon name="chevronRight" size={more === true ? 18 : 13} />}
            </button>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/** 이미지가 없으면 브랜드 톤 그라데이션으로 대체한다.
 *  목업 단계에서 실제 사진을 구하느라 시간 쓰지 않기 위한 장치. */
function Media({ src, alt = '', className = '' }) {
  if (!src) return <div className={`media media-ph ${className}`} />
  return <img className={`media ${className}`} src={src} alt={alt} loading="lazy" />
}

/** 행을 누르면 data 를 선택 항목으로 담고 이동한다 */
const goWith = (go, it) => {
  if (it?.data) setSelected(it.data)
  go(it?.to)
  // panel: 이동한 화면의 panels 블록에서 열 탭 번호 (해강건축 홈 바로가기 → 대시보드 문의 탭)
  if (it?.panel !== undefined) setTimeout(() => window.dispatchEvent(new CustomEvent('panels:go', { detail: it.panel })), 0)
}

/* ── 1. hero — 상단 그라데이션 배너 ────────── */
function Hero({ greeting, title, desc, big, icon = 'sparkle', image, slides, counter, to, accent, fade, go }) {
  // accent · fade: 슬라이드 없이 단일 배너로 쓸 때도 전달한다(은성기공 추가)
  // to: 배너를 누르면 이동할 화면 id (현대주방메탈팩토리 홈 배너 → 회사 소개 추가)
  const list = slides?.length ? slides : [{ greeting, title, desc, big, icon, image, accent, fade }]
  const [at, setAt] = useState(0)

  // 스크롤 위치로 현재 슬라이드를 판단한다. 캐러셀 라이브러리를 쓰지 않기 위함.
  const onScroll = (e) => {
    const w = e.currentTarget.clientWidth
    if (w) setAt(Math.round(e.currentTarget.scrollLeft / w))
  }

  return (
    <div className={`hero${to ? ' is-link' : ''}`} onClick={to ? () => go(to) : undefined}>
      <div className="hero-track" onScroll={onScroll}>
        {list.map((s, i) => (
          <div
            className={`hero-slide${s.image ? ' has-image' : ''}`}
            key={i}
            style={
              s.image
                ? {
                    // url()은 인라인 스타일에 직접 써야 문서 기준으로 풀린다.
                    // CSS 변수에 담아 스타일시트에서 var()로 쓰면 빌드 후 /assets/ 기준으로 해석돼 404가 난다(실측).
                    // fade: [솔리드%, 투명%] — 이미지 좌측을 덮는 그라데이션 구간(도담이네 추가, 기본 26/56)
                    backgroundImage: `linear-gradient(90deg, var(--hero-from) 0%, var(--hero-from) ${s.fade?.[0] ?? 26}%, rgba(244, 122, 156, 0) ${s.fade?.[1] ?? 56}%), url(${s.image})`,
                  }
                : undefined
            }
          >
            <div className="hero-copy">
              {s.greeting && (
                <p className="hero-greeting">
                  {Array.isArray(s.greeting) ? s.greeting.map((line, j) => <span key={j}>{line}</span>) : s.greeting}
                </p>
              )}
              {s.title && (
                <p className="hero-title">
                  {Array.isArray(s.title) ? (
                    // **글자** 는 강조색(서호에너지 '안전한 **보일러 시공**' 추가)
                    s.title.map((line, j) => (
                      <span key={j}>
                        {String(line)
                          .split(/\*\*(.+?)\*\*/)
                          .map((part, k) => (k % 2 ? <em className="hero-accent" key={k}>{part}</em> : part))}
                      </span>
                    ))
                  ) : s.accent && s.title.startsWith(s.accent) ? (
                    <span>
                      <em className="hero-accent">{s.accent}</em>
                      {s.title.slice(s.accent.length)}
                    </span>
                  ) : (
                    s.title
                  )}
                </p>
              )}
              {s.big && <p className="hero-big">{s.big}</p>}
              {s.desc && (
                <p className="hero-desc">
                  {(Array.isArray(s.desc) ? s.desc : [s.desc]).map((line, j) => (
                    <span key={j}>{line}</span>
                  ))}
                </p>
              )}
              {s.list?.length > 0 && (
                <ul className="hero-list">
                  {s.list.map((b, j) => (
                    <li key={j}>
                      <Icon name={b.icon || 'check'} size={15} />
                      <span>{b.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {s.art ? (
              <img className="hero-art-img" src={s.art} alt="" />
            ) : s.image ? null : (
              <Icon name={s.icon || 'sparkle'} size={124} strokeWidth={1} className="hero-art" />
            )}
          </div>
        ))}
      </div>
      {counter && list.length > 1 && (
        <span className="hero-count">
          {at + 1}/{list.length}
        </span>
      )}
      {list.length > 1 && (
        <div className="dots">
          {list.map((_, i) => (
            <span className={`dot${i === at ? ' is-active' : ''}`} key={i} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── 2. statGrid — 2열 지표 카드 ───────────── */
function StatGrid({ items = [], cols = 2, size, source, go }) {
  // 같은 화면의 form 이 저장하면(store:changed) source 지표를 다시 계산한다 — 우성건업 유지보수 A/S 추가
  const [, bump] = useState(0)
  useEffect(() => {
    const h = () => bump((n) => n + 1)
    window.addEventListener('store:changed', h)
    return () => window.removeEventListener('store:changed', h)
  }, [])
  if (source) items = sourceItems(source)
  return (
    <div className={`stat-grid${size ? ` stat-grid-${size}` : ''}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {items.map((it, i) => (
        <button
          className={`stat-card${it.fresh ? ' is-fresh' : ''}`}
          key={i}
          onClick={() => goWith(go, it)}
        >
          {/* leadIcon: 카드 왼쪽 큰 아이콘(효령테크 홈 실시간 현황 추가) */}
          {it.leadIcon && (
            <span className="stat-lead">
              <Icon name={it.leadIcon} size={30} strokeWidth={1.6} />
            </span>
          )}
          <span className="stat-label">
            {it.label}
            {it.icon && <Icon name={it.icon} size={15} className={`stat-icon tone-${it.tone || 'green'}`} />}
          </span>
          <span className="stat-value">
            {it.value}
            {it.unit && <em>{it.unit}</em>}
          </span>
          {it.caption && <span className="stat-caption">{it.caption}</span>}
        </button>
      ))}
    </div>
  )
}

/* ── 3. listRows — 아이콘 + 제목 + 설명 + 우측 ── */
function ListRows({
  items = [],
  variant,
  store,
  source,
  tabs,
  initialTab = 0,
  allLabel = '전체',
  counts = false,
  pill = false,
  limit,
  search,
  empty = '해당 항목이 없습니다.',
  expand = false,
  statusSelect,
  fav = false,
  go,
}) {
  // fav: true 면 item.fav(서비스 키)마다 하트 버튼을 그린다 — 누르면 관심 서비스에 담기고 빠진다(홈케어마스터 추가)
  // statusSelect: true 면 태그 자리에 상태 드롭다운을 그린다(효령테크 주문관리 추가, 규칙 16)
  const [, bumpRows] = useState(0)
  useEffect(() => {
    if (!source && !fav) return undefined
    const h = () => bumpRows((n) => n + 1)
    window.addEventListener('store:changed', h)
    return () => window.removeEventListener('store:changed', h)
  }, [source, fav])
  // tabs: ['전체','오늘',...] 를 주면 목록 위에 분할 탭을 그리고 item.group 으로 거른다.
  const [tab, setTab] = useState(initialTab)
  // expand: true 면 행을 누를 때 이동하지 않고 item.body 를 아래에 펼친다(라온하우징 고객센터 공지·FAQ 추가).
  const [opened, setOpened] = useState(null)
  // search: 자리표시 문구를 주면 목록 위에 검색창을 그리고 제목·설명으로 거른다(도담이네 추가).
  const [query, setQuery] = useState('')
  // store: form 블록이 localStorage `added:<store>` 에 쌓은 기록을 맨 앞에 붙인다.
  const [extra] = useState(() => (store ? readLS(`added:${store}`, []) : []))
  // source: skinbody.js 의 오늘 기준 예시 데이터. 정적 items 뒤에 이어 붙인다.
  const base = source ? [...items, ...sourceItems(source)] : items
  const defaultGroup = tabs?.find((s) => s !== allLabel)
  const merged = extra.length
    ? [...extra.map((r) => ({ ...r, isNew: true, group: r.group ?? defaultGroup })), ...base]
    : base
  const current = tabs?.[tab]
  let list = tabs && current !== allLabel ? merged.filter((it) => it.group === current) : merged
  if (search && query.trim()) {
    const q = query.trim().toLowerCase()
    const text = (it) => [it.eyebrow, it.title, it.desc, it.meta].flat().filter(Boolean).join(' ').toLowerCase()
    list = list.filter((it) => text(it).includes(q))
  }
  if (limit) list = list.slice(0, limit)
  const countOf = (s) => (s === allLabel ? merged.length : merged.filter((it) => it.group === s).length)
  return (
    <>
      {search && (
        <label className="rows-search">
          <Icon name="search" size={16} />
          <input value={query} placeholder={search} onChange={(e) => setQuery(e.target.value)} />
        </label>
      )}
      {tabs?.length > 0 && (
        <div className={`segs rows-segs${pill ? ' segs-pill' : ''}`} style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((s, i) => (
            <button className={`seg${i === tab ? ' is-active' : ''}`} key={i} onClick={() => setTab(i)}>
              {s}
              {counts && <em className="seg-count">{countOf(s)}</em>}
            </button>
          ))}
        </div>
      )}
      {list.length === 0 && <p className="rows-empty">{empty}</p>}
      <ul className={`rows${variant ? ` rows-${variant}` : ''}`}>
        {list.map((it, i) => (
          <li key={i} className={expand && opened === i ? 'is-open' : undefined}>
            <button
              className={`row${it.isNew ? ' is-new' : ''}`}
              onClick={() => (expand && it.body ? setOpened(opened === i ? null : i) : goWith(go, it))}
            >
              {it.dot && <span className={`row-dot tone-${it.dot}`} />}
              {it.lead && <span className={`row-lead${it.leadTone ? ` tone-${it.leadTone}` : ''}`}>{it.lead}</span>}
              {it.image ? (
                <img className="row-img" src={it.image} alt="" loading="lazy" />
              ) : (
                it.icon && (
                  <span className={`row-icon tone-${it.tone || 'green'}`}>
                    <Icon name={it.icon} size={17} />
                  </span>
                )
              )}
              <span className="row-body">
                {it.eyebrow && <span className="row-eyebrow">{it.eyebrow}</span>}
                <span className="row-title">{it.title}</span>
                {it.desc &&
                  (Array.isArray(it.desc) ? it.desc : [it.desc]).map((d, j) => (
                    <span className="row-desc" key={j}>
                      {d}
                    </span>
                  ))}
              </span>
              {it.meta &&
                (Array.isArray(it.meta) ? (
                  <span className="row-meta row-meta-stack">
                    {it.meta.map((m, j) => (
                      <span key={j}>{m}</span>
                    ))}
                  </span>
                ) : (
                  <span className="row-meta">{it.meta}</span>
                ))}
              {statusSelect && it.id ? (
                <span className={`job-select row-select tone-${it.tagTone || 'green'}`} onClick={(e) => e.stopPropagation()}>
                  <select value={it.tag} onChange={(e) => setOrderStatus(it.id, e.target.value)}>
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevronDown" size={13} />
                </span>
              ) : (
                it.tag && <span className={`tag row-tag tone-${it.tagTone || 'green'}`}>{it.tag}</span>
              )}
              {fav && it.fav && (
                <span
                  role="button"
                  aria-label={isFav(it.fav) ? '관심 서비스에서 빼기' : '관심 서비스에 담기'}
                  className={`row-fav${isFav(it.fav) ? ' is-on' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFav(it.fav)
                  }}
                >
                  <Icon name="heart" size={21} />
                </span>
              )}
              {/* chevron: 화면 없는 자리표시 행도 시안처럼 꺾쇠를 그린다(눌러도 이동하지 않는다 — 홈케어마스터 공지사항) */}
              {(it.to || it.chevron || (expand && it.body)) && (
                <Icon name={expand && opened === i ? 'chevronDown' : 'chevronRight'} size={15} className="row-chevron" />
              )}
            </button>
            {expand &&
              opened === i &&
              it.body &&
              // body 가 [항목, 값] 배열이면 표로 그린다(해강건축 견적 상세 추가)
              (Array.isArray(it.body) ? (
                <dl className="kv row-kv">
                  {it.body.map(([k, v], j) => (
                    <div className="kv-row" key={j}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="row-expand">{it.body}</p>
              ))}
            {/* action: 펼친 상세 아래 실행 버튼 — 그 행만 대상으로 다른 화면을 연다(해강건축 추가) */}
            {expand && opened === i && it.action && (
              <div className="row-action">
                <button className="btn-primary" onClick={() => goWith(go, it.action)}>
                  {it.action.icon && <Icon name={it.action.icon} size={17} />}
                  {it.action.label}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

/* ── 4. meterRows — 라벨 + 수치 + 상태 뱃지 ──
   막대는 기본으로 그리지 않는다(시안 대부분이 수치+뱃지만 쓴다).
   막대가 필요한 앱에서만 "bar": true 를 준다. */
function MeterRows({ items = [], bar = false, source }) {
  if (source) items = sourceItems(source)
  return (
    <ul className="meters">
      {items.map((it, i) => (
        <li className="meter" key={i}>
          {it.icon && (
            <span className={`meter-icon tone-${it.tone || 'green'}`}>
              <Icon name={it.icon} size={15} />
            </span>
          )}
          <span className="meter-label">{it.label}</span>
          {bar && (
            <span className="meter-bar">
              <span className="meter-fill" style={{ width: `${Math.min(100, it.pct ?? 0)}%` }} />
            </span>
          )}
          <span className="meter-pct">
            {it.pct}
            {it.unit ?? '%'}
          </span>
          {it.tag && <span className={`tag tone-${it.tagTone || 'green'}`}>{it.tag}</span>}
        </li>
      ))}
    </ul>
  )
}

/* ── 5. gauge — 도넛 점수 ──────────────────── */
function Gauge({ source, ...props }) {
  // source: hanol.js 계산값({ value, segments, caption ... })을 그대로 얹는다 — 오늘 기준 운행 현황 도넛용(한결6624 추가)
  if (source) props = { ...props, ...sourceItems(source) }
  return <GaugeBody {...props} />
}
function GaugeBody({ value = 0, max = 100, unit, caption, sub, segments, inlineUnit, label }) {
  const R = 42
  const C = 2 * Math.PI * R
  const ratio = Math.max(0, Math.min(1, value / max))

  // segments: [{ label, value, color, meta }] — 도넛을 여러 색으로 나눠 그리고 범례를 붙인다.
  const total = segments?.reduce((a, s) => a + (s.value || 0), 0) || 0
  let acc = 0
  const arcs = (segments || []).map((s) => {
    const len = total ? (s.value / total) * C : 0
    const arc = { ...s, dash: `${len} ${C}`, offset: -acc }
    acc += len
    return arc
  })

  return (
    <div className="gauge-card">
      <div className="gauge">
        <svg viewBox="0 0 100 100">
          <circle className="gauge-track" cx="50" cy="50" r={R} />
          {/* -90도 회전으로 12시 방향에서 시작하게 한다. */}
          {arcs.length > 0 ? (
            arcs.map((a, i) => (
              <circle
                className="gauge-seg"
                key={i}
                cx="50"
                cy="50"
                r={R}
                stroke={a.color}
                strokeDasharray={a.dash}
                strokeDashoffset={a.offset}
                transform="rotate(-90 50 50)"
              />
            ))
          ) : (
            <circle
              className="gauge-fill"
              cx="50"
              cy="50"
              r={R}
              strokeDasharray={`${C * ratio} ${C}`}
              transform="rotate(-90 50 50)"
            />
          )}
        </svg>
        <div className={`gauge-num${inlineUnit ? ' is-inline' : ''}${label ? ' has-label' : ''}`}>
          {label && <small className="gauge-label">{label}</small>}
          <span className="gauge-val">
            <strong>{value}</strong>
            <em>{unit ?? `/${max}`}</em>
          </span>
        </div>
      </div>
      <div className="gauge-copy">
        {caption && <p className="gauge-caption">{caption}</p>}
        {sub && <p className="gauge-sub">{sub}</p>}
        {arcs.length > 0 && (
          <ul className="gauge-legend">
            {arcs.map((a, i) => (
              <li key={i}>
                <span className="legend-dot" style={{ background: a.color }} />
                <span className="legend-label">{a.label}</span>
                <span className="legend-meta">{a.meta ?? a.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ── 6. stepper — 단계 진행 ────────────────── */
function Stepper({ source, steps = [], current = 0 }) {
  // source: haegang.js 의 { steps, current } — 공사 단계를 데이터에서 읽는다(해강건축 추가)
  if (source) ({ steps, current } = sourceItems(source))
  if (!steps.length) return null // 보여 줄 단계가 없으면 빈 카드를 남기지 않는다
  return (
    <ol className="stepper">
      {steps.map((s, i) => {
        const item = typeof s === 'string' ? { label: s } : s
        const state = i < current ? 'is-done' : i === current ? 'is-now' : ''
        return (
          <li className={`step ${state}`} key={i}>
            <span className="step-mark">
              {item.icon ? <Icon name={item.icon} size={14} /> : i < current ? <Icon name="check" size={13} /> : i + 1}
            </span>
            <span className="step-label">{item.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

/* ── 7. keyValue — 라벨-값 테이블 ──────────── */
function KeyValue({ source, rows = [] }) {
  if (source) rows = sourceItems(source) // haegang.js 계산값(AI 분석 대상 요약)
  return (
    <dl className="kv">
      {rows.map((r, i) => {
        const [k, v] = Array.isArray(r) ? r : [r.label, r.value]
        return (
          <div className="kv-row" key={i}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        )
      })}
    </dl>
  )
}

/* ── 8. mediaCard — 이미지 + 메타 + 진행바 ─── */
function MediaCard({ items = [], cover = false, go }) {
  return (
    <div className={`media-list${cover ? ' is-cover' : ''}`}>
      {items.map((it, i) => (
        <article className="media-card" key={i}>
          <Media src={it.image} alt={it.title} />
          <div className="media-body">
            {it.badge && <span className={`tag tone-${it.badgeTone || 'green'}`}>{it.badge}</span>}
            <h3>{it.title}</h3>
            {it.meta && <p className="media-meta">{it.meta}</p>}
            {it.steps?.length > 0 && <Stepper steps={it.steps} current={it.step ?? 0} />}
            {typeof it.progress === 'number' && (
              <div className="progress">
                <span style={{ width: `${Math.min(100, it.progress)}%` }} />
              </div>
            )}
            {it.footer && <p className="media-foot">{it.footer}</p>}
            {it.cta && (
              <button className="btn-ghost" onClick={() => go(it.cta.to)}>
                {it.cta.label}
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

/* ── 9. segmentTabs — 상단 분할 탭 ─────────── */
function SegmentTabs({ items = [], initial = 0 }) {
  const [at, setAt] = useState(initial)
  return (
    <div className="segs" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((s, i) => (
        <button className={`seg${i === at ? ' is-active' : ''}`} key={i} onClick={() => setAt(i)}>
          {typeof s === 'string' ? s : s.label}
        </button>
      ))}
    </div>
  )
}

/* ── 10. lineChart — 추이 그래프 ───────────── */
function LineChart({ source, ...props }) {
  // source: dawon.js 계산값({ value, unit, points, labels })을 그대로 얹는다 — 오늘 날짜 기반 매출 그래프용.
  if (source) props = { ...props, ...sourceItems(source) }
  return <LineChartBody {...props} />
}
function LineChartBody({ points = [], points2, label2, labels = [], label, delta, deltaUp = true, value, unit, deltaPrefix, yTicks, yMax, yMin }) {
  const W = 300
  const H = 96
  // yTicks 를 주면 눈금 기준(최대·최소)으로 선을 그려 눈금과 선이 어긋나지 않게 한다.
  // points2/label2: 같은 눈금 위에 두 번째 선(매출 vs 비용)을 겹쳐 그린다 — 한결6624 추가
  const all = points2?.length ? [...points, ...points2] : points
  const max = yMax ?? Math.max(...all, 1)
  const min = yMin ?? Math.min(...all, 0)
  const span = max - min || 1

  // 값 배열을 그대로 좌표로 편다. 데이터 포인트가 1개뿐이면 가로 중앙에 찍는다.
  const toXY = (arr) => arr.map((p, i) => [arr.length > 1 ? (i / (arr.length - 1)) * W : W / 2, H - ((p - min) / span) * H])
  const xy = toXY(points)
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const xy2 = points2?.length ? toXY(points2) : null
  const line2 = xy2 ? xy2.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ') : null
  const area = `${line} ${W},${H} 0,${H}`

  return (
    <div className={`chart-card${yTicks ? ' has-y' : ''}`}>
      {value !== undefined && (
        <p className="chart-value">
          {value}
          {unit && <em>{unit}</em>}
        </p>
      )}
      {(label || delta) && (
        <div className="chart-head">
          {label2 && (
            <span className="chart-legend">
              <i className="chart-legend-dot is-2" />
              {label2}
            </span>
          )}
          {label && (
            <span className="chart-label">
              {label2 && <i className="chart-legend-dot" />}
              {label}
            </span>
          )}
          {deltaPrefix && <span className="chart-delta-prefix">{deltaPrefix}</span>}
          {delta && (
            <span className={`chart-delta${deltaUp ? ' is-up' : ''}`}>
              <Icon name="arrowUp" size={13} />
              {delta}
            </span>
          )}
        </div>
      )}
      <div className="chart-plot">
        {yTicks && (
          <div className="chart-y">
            {yTicks.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        )}
        <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          {yTicks &&
            yTicks.map((_, i) => (
              <line className="chart-grid" key={i} x1="0" x2={W} y1={(H / (yTicks.length - 1)) * i} y2={(H / (yTicks.length - 1)) * i} />
            ))}
          <polygon className="chart-area" points={area} />
          <polyline className="chart-line" points={line} />
          {xy.map(([x, y], i) => (
            <circle className="chart-dot" cx={x} cy={y} r="2.6" key={i} />
          ))}
          {line2 && <polyline className="chart-line chart-line-2" points={line2} />}
          {xy2?.map(([x, y], i) => (
            <circle className="chart-dot chart-dot-2" cx={x} cy={y} r="2.6" key={`b${i}`} />
          ))}
        </svg>
      </div>
      {labels.length > 0 && (
        <div className="chart-x">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── 11. iconGrid — 아이콘 메뉴 ────────────── */
function IconGrid({ items = [], cols = 3, go }) {
  return (
    <div className="icon-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {items.map((it, i) => (
        <button className="icon-cell" key={i} onClick={() => goWith(go, it)}>
          <span className={`icon-chip tone-${it.tone || 'green'}`}>
            <Icon name={it.icon} size={19} />
          </span>
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ── 12. tipCard — 이미지 + 문구 + CTA ─────── */
function TipCard({ text, sub, image, cta, variant, go }) {
  return (
    <div className={`tip-card${variant ? ` tip-card-${variant}` : ''}`}>
      <div className="tip-body">
        {text && <p className="tip-text">{text}</p>}
        {sub && <p className="tip-sub">{sub}</p>}
      </div>
      {image && <Media src={image} className="tip-img" />}
      {cta && (
        <button className="btn-primary tip-cta" onClick={() => go(cta.to)}>
          {cta.label}
        </button>
      )}
    </div>
  )
}

/* ── 13. noteCard — 강조 카드 + 태그 ───────── */
function NoteCard({ name, tags = [], desc }) {
  return (
    <div className="note-card">
      {name && <strong className="note-name">{name}</strong>}
      {desc && <p className="note-desc">{desc}</p>}
      {tags.length > 0 && (
        <p className="note-tags">
          {tags.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </p>
      )}
    </div>
  )
}

/* ── 14. cta — 버튼 ────────────────────────── */
function Cta({ label, to, icon, variant = 'primary', buttons, panel, data, arrow, go }) {
  // arrow: 버튼 오른쪽 끝 꺾쇠(홈케어마스터 '빠른 상담/견적 신청 >')
  // data: 누르면 selected 에 담고 이동한다(서호에너지 'A/S 신청하기' → 상담 구분 A/S 문의)
  // buttons: [{ label, to, variant, icon }] — 버튼 두 개를 한 줄에 나란히(현대주방메탈팩토리 제품 상세 "상담문의 | 견적문의" 추가)
  if (buttons?.length) {
    return (
      <div className="cta-pair">
        {buttons.map((b, i) => (
          <button key={i} className={b.variant === 'ghost' ? 'btn-ghost' : 'btn-primary'} onClick={() => goWith(go, b)}>
            {b.icon && <Icon name={b.icon} size={17} />}
            {b.label}
          </button>
        ))}
      </div>
    )
  }
  return (
    <button className={variant === 'ghost' ? 'btn-ghost' : `btn-primary${variant === 'navy' ? ' btn-navy' : ''}`} onClick={() => goWith(go, { to, panel, data })}>
      {/* navy(시안 '견적 상담 신청하기')는 화살표가 글자 뒤에 온다 */}
      {variant !== 'navy' && icon && <Icon name={icon} size={17} />}
      {label}
      {variant === 'navy' && icon && <Icon name={icon} size={17} />}
      {arrow && <Icon name="chevronRight" size={20} className="btn-arrow" />}
    </button>
  )
}

/* ── 15. text — 자유 문단 ──────────────────── */
function Text({ source, body }) {
  if (source) body = sourceItems(source)
  const lines = Array.isArray(body) ? body : [body]
  return (
    <div className="text-block">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  )
}

/* ── 16. profile — 아바타 + 이름 + 등급 뱃지 ──
   image(사진) · suffix(이름 옆 작은 글자) · sub(부제) · action({label,to}) 우측 버튼 */
function Profile({ name, suffix, sub, badge, badgeTone = 'pink', icon = 'user', image, action, gear, go }) {
  // gear: 오른쪽 톱니 아이콘(표시 전용 — 홈케어마스터 마이페이지 시안)
  return (
    <div className="profile-card">
      <span className="profile-avatar">
        {image ? <img src={image} alt="" /> : <Icon name={icon} size={30} strokeWidth={1.8} />}
      </span>
      <div className="profile-body">
        <strong className="profile-name">
          {name}
          {suffix && <small className="profile-suffix">{suffix}</small>}
        </strong>
        {sub && <span className="profile-sub">{sub}</span>}
        {badge && <span className={`tag profile-badge tone-${badgeTone}`}>{badge}</span>}
      </div>
      {action && (
        <button className="btn-ghost profile-action" onClick={() => go(action.to)}>
          {action.label}
        </button>
      )}
      {gear && (
        <span className="profile-gear" aria-hidden="true">
          <Icon name="gear" size={24} />
        </span>
      )}
    </div>
  )
}

/* ── 17. form — 라벨 + 입력 필드 목록 ──
   fields: [{ label, kind: 'select'|'date'|'time'|'picker'|'text'|'textarea', value, placeholder,
              options: ['a', { label, sub }] | "@opt:programs", days(date), range/step(time) }]
   submit: { label, to, store, record: { key: '{필드라벨}' 템플릿 }, doneTitle, doneSub }
   선택형 필드는 바닥 시트로 고르고, 제출하면 localStorage `added:<store>` 에 기록을 쌓은 뒤
   완료 안내를 띄우고 `to` 화면으로 보낸다. listRows 의 `store` 가 그 기록을 읽어 맨 앞에 보여 준다. */
const DAYS_KO = '일월화수목금토'
const fmtDate = (d) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${DAYS_KO[d.getDay()]})`

function optionsOf(f) {
  if (typeof f.options === 'string' && f.options.startsWith('@opt:')) return optionItems(f.options.slice(5))
  if (f.options) return f.options.map((o) => (typeof o === 'string' ? { label: o } : o))
  if (f.kind === 'date') {
    const n = f.days ?? 14
    // past: true 면 오늘부터 거꾸로(비용 등록처럼 지난 날짜를 고르는 폼 — 한결6624 추가)
    const dir = f.past ? -1 : 1
    return Array.from({ length: n }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i * dir)
      const group = i === 0 ? '오늘' : i === 1 ? (f.past ? '어제' : '내일') : f.past ? '이전' : '이후'
      // ymd: 점 표기 날짜(2026.09.04) — 계약 기간 문구처럼 요일 없이 쓰는 폼 기록용(한올상운 추가)
      return { label: fmtDate(d), group, key: iso(d), ymd: iso(d).replace(/-/g, '.') }
    })
  }
  if (f.kind === 'time') {
    const [a, b] = f.range ?? ['10:00', '19:00']
    const step = f.step ?? 30
    const toM = (s) => s.split(':').map(Number).reduce((h, m) => h * 60 + m)
    const out = []
    for (let m = toM(a); m <= toM(b); m += step)
      out.push({ label: `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}` })
    return out
  }
  return null
}

function Form({ fields = [], submit, steps, nextLabel = '다음', prevLabel = '이전', layout, validateStep, go }) {
  // steps: ['정보입력','현장정보','완료'] 를 주면 위에 스테퍼를 그리고, 필드의 step(0부터)에 따라 단계별로 나눠 보여 준다.
  // 마지막 단계 라벨은 '완료' 자리라 필드를 두지 않는다(라온하우징 견적문의 추가).
  const fieldStages = fields.map((f) => f.step ?? 0)
  const lastStage = fieldStages.length ? Math.max(...fieldStages) : 0
  const [stage, setStage] = useState(0)
  const [values, setValues] = useState(() =>
    Object.fromEntries(
      fields.map((f) => {
        const opts = optionsOf(f)
        // selKey: 앞 화면에서 고른 값(selected[selKey])이 있으면 그 값으로 시작한다
        // (만물상토탈솔루션 홈 서비스 칸·전체 서비스 → 견적 요청의 서비스 유형)
        const picked = f.selKey ? selected[f.selKey] : undefined
        const v = picked || (f.value === '$today' ? fmtDate(new Date()) : f.value)
        if (!opts) return [f.label, { label: v ?? '' }]
        return [f.label, opts.find((o) => o.label === v) ?? (v ? { label: v } : f.placeholder ? { label: '' } : opts[0])]
      }),
    ),
  )
  // selKey 로 받은 값은 한 번 쓰고 비운다 — 탭바로 다시 들어오면 빈 폼이어야 한다
  useEffect(() => {
    for (const f of fields) if (f.selKey) delete selected[f.selKey]
  }, [fields])
  const [open, setOpen] = useState(null)
  const [done, setDone] = useState(false)
  // 필수 입력 검사(효령테크 견적문의 추가): f.required 인 칸이 비면 제출을 막고 칸 아래에 안내를 띄운다
  const [errors, setErrors] = useState({})
  const setVal = (f, val) => {
    setValues((v) => ({ ...v, [f.label]: val }))
    if (errors[f.label]) setErrors((e) => ({ ...e, [f.label]: undefined }))
  }
  const reqMark = (f) => (f.required ? <i className="field-req">*</i> : null)
  const errOf = (f) => (errors[f.label] ? <em className="field-error">{errors[f.label]}</em> : null)
  // when: { 다른 칸 라벨: 값 } — 그 칸이 그 값일 때만 보이고 검사한다(서호에너지 고객 구분 '기업 고객' → 회사명)
  const shown = (f) => !f.when || Object.entries(f.when).every(([k, v]) => values[k]?.label === v)
  // 전화번호 자동 하이픈
  const telFormat = (raw) => {
    const d = raw.replace(/\D/g, '').slice(0, 11)
    if (d.startsWith('02')) {
      if (d.length < 3) return d
      if (d.length < 6) return `${d.slice(0, 2)}-${d.slice(2)}`
      if (d.length < 10) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`
      return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`
    }
    if (d.length < 4) return d
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`
    if (d.length < 11) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
  }

  const display = (f) => {
    const v = values[f.label]
    if (!v?.label) return ''
    return v.sub && f.showSub ? `${v.label} (${v.sub})` : v.label
  }
  const resolve = (tpl) => {
    if (Array.isArray(tpl)) return tpl.map(resolve)
    if (typeof tpl !== 'string') return tpl
    return tpl.replace(/\{([^}.]+)(?:\.(\w+))?\}/g, (_, k, sub) => {
      if (k.trim() === '$today') return iso(new Date()) // 제출 시각의 날짜(iso) — 접수일 기록용(라온하우징 추가)
      const v = values[k.trim()]
      if (!v) return ''
      return sub ? (v[sub] ?? '') : (v.label ?? '')
    })
  }
  const pickPhoto = (f, file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setValues((v) => ({ ...v, [f.label]: { label: file.name, url } }))
  }

  // 받침 유무로 을/를 고르기
  const josa = (w) => {
    const c = w.replace(/[^가-힣]/g, '').slice(-1).charCodeAt(0) - 0xac00
    return c >= 0 && c % 28 ? '을' : '를'
  }
  // validateStep: true 면 '다음 단계'에서도 그 단계의 필수 칸을 검사한다(만물상토탈솔루션 추가).
  // 없으면 1단계를 비운 채 넘어가 제출 때 보이지 않는 칸의 오류로 막힌다.
  const onSubmit = (onlyStage) => {
    const errs = {}
    for (const f of fields) {
      if (!shown(f)) continue
      if (onlyStage !== undefined && (f.step ?? 0) !== onlyStage) continue
      const v = values[f.label] || {}
      if (f.kind === 'heading') continue
      const empty = f.kind === 'qty' ? !String(v.num ?? '').trim() : f.kind === 'agree' ? !v.checked : !String(v.label ?? '').trim()
      const pick = f.kind === 'select' || f.kind === 'date' || f.kind === 'chips'
      if (f.required && empty) errs[f.label] = f.kind === 'agree' ? '개인정보 수집·이용에 동의해주세요' : pick ? `${f.label}${josa(f.label)} 선택해주세요` : `${f.label}${josa(f.label)} 입력해주세요`
      else if (f.format === 'email' && v.label && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.label)) errs[f.label] = '이메일 형식을 확인해주세요'
      else if (f.format === 'tel' && v.label && v.label.replace(/\D/g, '').length < 9) errs[f.label] = '연락처를 끝까지 입력해주세요'
    }
    if (Object.keys(errs).length) {
      setErrors(errs)
      requestAnimationFrame(() => document.querySelector('.field.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
      return
    }
    if (onlyStage !== undefined) {
      setStage(onlyStage + 1)
      return
    }
    // writes: [{ store, record }] — 여러 저장소에 동시에 기록한다. (store/record 단일형도 허용)
    const writes = submit?.writes ?? (submit?.store && submit.record ? [{ store: submit.store, record: submit.record }] : [])
    for (const w of writes) {
      const rec = Object.fromEntries(Object.entries(w.record).map(([k, tpl]) => [k, resolve(tpl)]))
      prependLS(`added:${resolve(w.store)}`, rec)
    }
    setSelected({}) // 이전에 고른 항목을 지운다 — 방금 등록한 건이 기준이 되도록
    window.dispatchEvent(new CustomEvent('store:changed'))
    setDone(true)
  }

  const openField = fields.find((f) => f.label === open)
  // recall: "@opt:종류" — 글자 칸 옆 '이전 주소 불러오기'가 여는 목록(만물상토탈솔루션 추가)
  const openOpts = openField ? (openField.recall ? optionItems(openField.recall.slice(5)) : optionsOf(openField)) : null
  // 고른 항목에 fill: { 다른 칸 라벨: 값 } 이 있으면 그 칸도 함께 채운다(현장 주소 → 건물 용도)
  const pickOpt = (f, o) => {
    if (f.recall) setVal(f, { label: o.value ?? o.label })
    else setVal(f, o)
    if (o.fill) {
      setValues((v) => ({ ...v, ...Object.fromEntries(Object.entries(o.fill).map(([k, val]) => [k, { label: val }])) }))
    }
  }

  return (
    <div className={`form${layout === 'row' ? ' form-row' : layout === 'lead' ? ' form-lead' : ''}`}>
      {steps?.length > 0 && <Stepper steps={steps} current={done ? steps.length - 1 : stage} />}
      {fields.map((f, i) => {
        if (steps?.length && (f.step ?? 0) !== stage) return null
        if (!shown(f)) return null
        const kind = f.kind || 'text'
        const opts = optionsOf(f)
        const icon =
          f.icon ||
          (kind === 'select' ? 'chevronDown' : kind === 'date' ? 'calendar' : kind === 'time' || kind === 'picker' ? 'chevronRight' : null)
        if (kind === 'chips') {
          // 인라인 칩 선택(우성건업 견적 상담의 상담 유형·공사 유형) — 바닥 시트 대신 칩을 바로 누른다
          const cur = values[f.label]?.label
          return (
            <div className={`field field-chips${errors[f.label] ? ' has-error' : ''}`} key={i}>
              <span className="field-label">
                {f.label}
                {reqMark(f)}
              </span>
              {/* icons: {라벨: 아이콘명} 을 주면 시안의 공사 유형처럼 아이콘 카드 격자로 그린다(해강건축 추가) */}
              <span className={f.icons ? 'chips chips-icon' : 'chips'}>
                {(opts ?? []).map((o, j) => (
                  <button
                    type="button"
                    key={j}
                    className={`chip${cur === o.label ? ' is-active' : ''}`}
                    onClick={() => setVal(f, o)}
                  >
                    {f.icons?.[o.label] && <Icon name={f.icons[o.label]} size={23} strokeWidth={1.7} />}
                    <span>{o.label}</span>
                  </button>
                ))}
              </span>
              {errOf(f)}
            </div>
          )
        }
        if (kind === 'heading') {
          // 폼 안 소제목(효령테크 추가)
          return (
            <p className="form-heading" key={i}>
              {f.label}
              {f.sub && <small>{f.sub}</small>}
            </p>
          )
        }
        if (kind === 'qty') {
          // 수량 + 단위(효령테크 추가): 숫자만 받아 천 단위 쉼표, 단위는 옆에서 선택
          const v = values[f.label] || {}
          const units = f.units ?? ['EA']
          const unit = v.unit ?? units[0]
          const set = (num, u) => setVal(f, { num, unit: u, label: num ? `${num}${u}` : '' })
          return (
            <label className={`field field-qty${errors[f.label] ? ' has-error' : ''}`} key={i}>
              <span className="field-label">
                {f.label}
                {reqMark(f)}
              </span>
              <span className="qty-box">
                <input
                  className="field-input"
                  inputMode="numeric"
                  placeholder={f.placeholder}
                  value={v.num ?? ''}
                  onChange={(e) => {
                    const d = e.target.value.replace(/\D/g, '').slice(0, 9)
                    set(d ? Number(d).toLocaleString('ko-KR') : '', unit)
                  }}
                />
                {units.length > 1 ? (
                  <span className="qty-unit">
                    <select value={unit} onChange={(e) => set(v.num ?? '', e.target.value)}>
                      {units.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                    <Icon name="chevronDown" size={14} />
                  </span>
                ) : (
                  <span className="qty-unit is-fixed">{unit}</span>
                )}
              </span>
              {errOf(f)}
            </label>
          )
        }
        if (kind === 'file') {
          // 도면·파일 첨부(효령테크 추가): PDF·DWG·STEP·이미지, 최대 5개
          const v = values[f.label] || {}
          const files = v.files ?? []
          const setFiles = (next) => setVal(f, { files: next, label: next.map((x) => x.name).join(', ') })
          return (
            <div className="field field-file" key={i}>
              <span className="field-label">
                {f.label}
                {reqMark(f)}
              </span>
              <label className="file-drop">
                <input
                  type="file"
                  multiple
                  accept={f.accept}
                  hidden
                  onChange={(e) => {
                    const picked = [...(e.target.files ?? [])].map((x) => ({ name: x.name, size: x.size }))
                    setFiles([...files, ...picked].slice(0, 5))
                    e.target.value = ''
                  }}
                />
                <span className="file-drop-icon">
                  <Icon name="plus" size={18} />
                </span>
                <span className="file-drop-text">
                  <b>{f.cta ?? '파일 선택'}</b>
                  <small>{f.sub}</small>
                </span>
              </label>
              {files.length > 0 && (
                <ul className="file-list">
                  {files.map((x, j) => (
                    <li key={j}>
                      <Icon name="doc" size={15} />
                      <span className="file-name">{x.name}</span>
                      <span className="file-size">{x.size > 1048576 ? `${(x.size / 1048576).toFixed(1)}MB` : `${Math.max(1, Math.round(x.size / 1024))}KB`}</span>
                      <button type="button" className="file-del" aria-label="삭제" onClick={() => setFiles(files.filter((_, k) => k !== j))}>
                        <Icon name="plus" size={15} style={{ transform: 'rotate(45deg)' }} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        }
        if (kind === 'agree') {
          // 동의 체크(효령테크 추가)
          const v = values[f.label] || {}
          return (
            <div className={`field field-agree${errors[f.label] ? ' has-error' : ''}`} key={i}>
              <button type="button" className={`agree-row${v.checked ? ' is-on' : ''}`} onClick={() => setVal(f, { checked: !v.checked, label: v.checked ? '' : '동의' })}>
                <span className="agree-box">
                  <Icon name="check" size={14} strokeWidth={2.6} />
                </span>
                <span>
                  {f.label}
                  {reqMark(f)}
                </span>
              </button>
              {f.sub && <p className="agree-sub">{f.sub}</p>}
              {errOf(f)}
            </div>
          )
        }
        if (kind === 'photo' && f.max) {
          // 여러 장 사진 첨부(홈케어마스터 견적문의 '사진 첨부하기 (최대 5장)'): 회색 카메라 칸 + 안내, 고른 사진은 아래 썸네일 줄
          const v = values[f.label] || {}
          const shots = v.shots ?? []
          const setShots = (next) => setVal(f, { shots: next, label: next.length ? `${next.length}장` : '' })
          return (
            <div className="field field-photos" key={i}>
              <label className="photos-pick">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    const picked = [...(e.target.files ?? [])].map((x) => URL.createObjectURL(x))
                    setShots([...shots, ...picked].slice(0, f.max))
                    e.target.value = ''
                  }}
                />
                <span className="photos-cam">
                  <Icon name="camera" size={26} />
                </span>
                <span className="photos-copy">
                  <b>{f.label}</b>
                  <small>{shots.length ? `${shots.length}장 첨부 · 최대 ${f.max}장` : f.sub}</small>
                </span>
              </label>
              {shots.length > 0 && (
                <ul className="photos-list">
                  {shots.map((u, j) => (
                    <li key={j}>
                      <img src={u} alt="" />
                      <button type="button" className="photos-del" aria-label="삭제" onClick={() => setShots(shots.filter((_, k) => k !== j))}>
                        <Icon name="plus" size={14} style={{ transform: 'rotate(45deg)' }} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        }
        if (kind === 'photo' && layout === 'row') {
          // 행 배치 사진 첨부: 라벨 좌측 + 우측 회색 박스(카메라 아이콘 + 안내 문구)
          const v = values[f.label]
          return (
            <label className={`field field-photo-row${v?.url ? ' has-photo' : ''}`} key={i}>
              <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => pickPhoto(f, e.target.files?.[0])} />
              <span className="field-label">{f.label}</span>
              <span className="photo-box">
                {v?.url ? <img className="photo-thumb" src={v.url} alt="" /> : <Icon name="camera" size={20} />}
                <span className="photo-sub">{v?.label || f.sub}</span>
              </span>
            </label>
          )
        }
        if (kind === 'photo') {
          // 사진 첨부 칸: 카메라 칩 + 안내 문구, 고르면 파일명·썸네일을 보여 준다
          const v = values[f.label]
          return (
            <label className={`field field-photo${v?.url ? ' has-photo' : ''}`} key={i}>
              <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => pickPhoto(f, e.target.files?.[0])} />
              {v?.url ? <img className="photo-thumb" src={v.url} alt="" /> : <span className="photo-chip"><Icon name="camera" size={22} /></span>}
              <span className="photo-copy">
                <span className="photo-title">{f.label}</span>
                {f.sub && <span className="photo-sub">{v?.label || f.sub}</span>}
              </span>
            </label>
          )
        }
        return (
          <label className={`field${errors[f.label] ? ' has-error' : ''}${kind === 'textarea' ? ' field-area' : ''}${f.lead ? ' has-lead' : ''}`} key={i}>
            {/* lead: 칸 왼쪽 안의 아이콘(홈케어마스터 견적문의 — 라벨 없이 아이콘 + 자리표시) */}
            {f.lead && <Icon name={f.lead} size={20} className="field-lead" />}
            <span className={`field-label${f.recall ? ' has-recall' : ''}`}>
              <span>
                {f.label}
                {reqMark(f)}
              </span>
              {f.recall && (
                <button
                  type="button"
                  className="field-recall"
                  onClick={(e) => {
                    e.preventDefault()
                    setOpen(f.label)
                  }}
                >
                  <Icon name="history" size={14} />
                  {f.recallLabel ?? '이전 주소 불러오기'}
                </button>
              )}
            </span>
            {kind === 'textarea' ? (
              <span className="area-box">
                <textarea
                  className="field-input"
                  placeholder={f.placeholder}
                  value={values[f.label]?.label ?? ''}
                  maxLength={f.max}
                  onChange={(e) => setVal(f, { label: e.target.value })}
                  rows={f.rows ?? 2}
                />
                {f.max && (
                  <small className="area-count">
                    {(values[f.label]?.label ?? '').length}/{f.max}
                  </small>
                )}
              </span>
            ) : kind === 'text' ? (
              // icon: 글자 칸 오른쪽 안의 아이콘(서호에너지 주소 칸 위치 핀)
              <span className={f.icon ? 'input-box has-icon' : 'input-box'}>
                <input
                  className="field-input"
                  placeholder={f.placeholder}
                  value={values[f.label]?.label ?? ''}
                  inputMode={f.format === 'tel' ? 'tel' : f.format === 'email' ? 'email' : undefined}
                  type={f.format === 'email' ? 'email' : 'text'}
                  onChange={(e) => setVal(f, { label: f.format === 'tel' ? telFormat(e.target.value) : e.target.value })}
                />
                {f.icon && <Icon name={f.icon} size={18} className="input-icon" />}
              </span>
            ) : (
              <button
                type="button"
                className={`field-input field-static${display(f) ? '' : ' is-empty'}`}
                onClick={() => opts && setOpen(f.label)}
              >
                <span>{display(f) || f.placeholder}</span>
                {icon && <Icon name={icon} size={17} className="field-icon" />}
              </button>
            )}
            {errOf(f)}
          </label>
        )
      })}

      {submit && stage < lastStage && (
        <div className="form-nav">
          {stage > 0 && (
            <button type="button" className="btn-ghost" onClick={() => setStage(stage - 1)}>
              {prevLabel}
            </button>
          )}
          <button type="button" className="btn-primary form-submit" onClick={() => (validateStep ? onSubmit(stage) : setStage(stage + 1))}>
            {nextLabel}
          </button>
        </div>
      )}
      {submit && stage >= lastStage && (
        <div className="form-nav">
          {stage > 0 && (
            <button type="button" className="btn-ghost" onClick={() => setStage(stage - 1)}>
              {prevLabel}
            </button>
          )}
          <button type="button" className="btn-primary form-submit" onClick={() => onSubmit()}>
            {submit.label}
            {submit.arrow && <Icon name="chevronRight" size={20} className="btn-arrow" />}
          </button>
        </div>
      )}

      {openField && openOpts && (
        <div className="sheet-back" onClick={() => setOpen(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h3>
                {openField.recallTitle ?? openField.label}
                {openField.recall && <small className="sheet-count">{openOpts?.length ?? 0}곳</small>}
              </h3>
              <button type="button" className="sheet-close" onClick={() => setOpen(null)} aria-label="닫기">
                <Icon name="plus" size={18} style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <ul className="sheet-list">
              {openOpts.map((o, i) => {
                const active = values[openField.label]?.label === (o.value ?? o.label)
                return (
                  <li key={i}>
                    <button
                      type="button"
                      className={`sheet-opt${active ? ' is-active' : ''}`}
                      onClick={() => {
                        pickOpt(openField, o)
                        setOpen(null)
                      }}
                    >
                      {o.eyebrow ? (
                        // eyebrow 가 있으면 세 줄 카드: 이름 · 값 · 부가 정보(이전 주소 불러오기)
                        <span className="sheet-opt-stack">
                          <b className="sheet-opt-eyebrow">
                            {o.eyebrow}
                            {o.tag && <em className="sheet-opt-tag">{o.tag}</em>}
                          </b>
                          <span className="sheet-opt-label">{o.label}</span>
                          {o.sub && <span className="sheet-opt-sub">{o.sub}</span>}
                        </span>
                      ) : (
                        <>
                          <span className="sheet-opt-label">{o.label}</span>
                          {o.sub && <span className="sheet-opt-sub">{o.sub}</span>}
                        </>
                      )}
                      {active && <Icon name="check" size={17} className="sheet-opt-check" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      {done && (
        <div className="sheet-back">
          <div className="sheet sheet-done">
            <span className="done-mark">
              <Icon name="check" size={26} strokeWidth={2.4} />
            </span>
            <h3>{submit?.doneTitle ?? '등록이 완료되었습니다'}</h3>
            {submit?.doneSub && <p className="done-sub">{submit.doneSub}</p>}
            <dl className="kv done-kv">
              {fields
                .filter((f) => f.kind !== 'heading' && f.kind !== 'agree' && shown(f) && display(f))
                .map((f, i) => (
                  <div className="kv-row" key={i}>
                    <dt>{f.label}</dt>
                    <dd>{display(f)}</dd>
                  </div>
                ))}
            </dl>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setDone(false)
                // panel: 열어 줄 panels 블록의 탭 번호(우성건업 유지보수 A/S 추가).
                // 다른 화면으로 옮겨 갈 때는 이동한 뒤에 보내야 한다 — 이동 전에 보내면 그 화면이
                // 아직 없어 이벤트가 사라진다(해강건축 견적 신청 → 내 공사 > 견적).
                if (submit?.to) go(submit.to)
                if (submit?.panel !== undefined) {
                  const at = submit.panel
                  setTimeout(() => window.dispatchEvent(new CustomEvent('panels:go', { detail: at })), 0)
                }
              }}
            >
              {submit?.doneCta ?? '확인'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── 18. records — 고객 서비스 기록 (김민정스킨바디 추가) ──
   items: [{ date, title, rows:[[k,v]], group }] · photo:true 면 진행 사진 자리 · body 면 상담 기록 문단
   tabs 를 주면 group 으로 거른다. */
function Records({ items = [], tabs, initialTab = 0, empty = '기록이 없습니다.' }) {
  const [tab, setTab] = useState(initialTab)
  const current = tabs?.[tab]
  const list = tabs ? items.filter((it) => it.group === current) : items
  const photos = list.filter((it) => it.photo)
  const rest = list.filter((it) => !it.photo)
  return (
    <div className="records">
      {tabs?.length > 0 && (
        <div className="segs rows-segs" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((s, i) => (
            <button className={`seg${i === tab ? ' is-active' : ''}`} key={i} onClick={() => setTab(i)}>
              {s}
            </button>
          ))}
        </div>
      )}
      {list.length === 0 && <p className="rows-empty">{empty}</p>}
      {photos.length > 0 && (
        <ul className="rec-photos">
          {photos.map((p, i) => (
            <li key={i}>
              {p.image ? <img className="media rec-photo" src={p.image} alt="" loading="lazy" /> : <div className="media media-ph rec-photo" />}
              <span className="rec-photo-date">{p.date}</span>
              <span className="rec-photo-title">{p.title}</span>
            </li>
          ))}
        </ul>
      )}
      <ul className="rec-list">
        {rest.map((r, i) => (
          <li className="rec" key={i}>
            <div className="rec-head">
              <span className="rec-date">{r.date}</span>
              <strong className="rec-title">{r.title}</strong>
            </div>
            {r.rows?.map((row, j) => (
              <div className="rec-row" key={j}>
                <span className="rec-k">{row[0]}</span>
                <span className="rec-v">{row[1]}</span>
              </div>
            ))}
            {r.body && <p className="rec-body">{r.body}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 19. actions — 상태 변경 버튼 (김민정스킨바디 추가) ──
   key: 'reservations' · id: '@sel:id' · buttons: [{ label, set, variant, to }]
   누르면 localStorage `status:<key>`[id] = set 으로 저장하고 to 로 이동. 목록은 이 값을 읽어 뱃지를 바꾼다. */
function Actions({ storeKey = 'reservations', id, status, buttons = [], note, go }) {
  const [state, setState] = useState(() => readLS(`status:${storeKey}`, {})[id])
  const act = (b) => {
    const map = { ...readLS(`status:${storeKey}`, {}), [id]: b.set }
    writeLS(`status:${storeKey}`, map)
    setState(b.set)
    if (b.to) go(b.to)
  }
  const cur = state ?? status ?? ''
  const visible = buttons.filter((b) => !b.when || b.when.includes(cur))
  return (
    <div className="actions">
      {note && <p className="actions-note">{note.replace('{status}', cur)}</p>}
      <div className="actions-row">
        {visible.map((b, i) => (
          <button key={i} className={b.variant === 'ghost' ? 'btn-ghost' : 'btn-primary'} onClick={() => act(b)}>
            {b.icon && <Icon name={b.icon} size={16} />}
            {b.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── 21. calendar — 월 달력 + 선택일 패널 (H에비뉴호텔 방식) ──
   실제 오늘 기준으로 skinbody.js 데이터를 계산한다. 예약 있는 날에 점, 오늘은 테두리, 선택일은 채움.
   선택한 날짜의 집계·목록은 dayBlocks() 가 만들어 아래에 그린다. */
const calMemory = {}
const WD = ['일', '월', '화', '수', '목', '금', '토']
const pad2 = (n) => String(n).padStart(2, '0')
const fromIso = (k) => {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const dateLabel = (k) => {
  const d = fromIso(k)
  return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())} (${WD[d.getDay()]})`
}
function Calendar({ go, initialOpen = true }) {
  const today = iso(TODAY)
  const [ym, setYmRaw] = useState(calMemory.ym ?? today.slice(0, 7))
  const [sel, setSelRaw] = useState(calMemory.sel ?? today)
  // 접기/펴기: 펴면 월간, 접으면 선택한 날짜가 든 한 주만 보인다. 상태는 화면 이동 후에도 기억한다.
  // initialOpen: false 면 처음부터 주간(한 줄) 달력으로 시작한다(한결6624 시안의 주간 스트립).
  const [open, setOpenRaw] = useState(calMemory.open ?? initialOpen)
  const [anchor, setAnchorRaw] = useState(calMemory.anchor ?? (calMemory.sel ?? today))
  const setYm = (v) => {
    calMemory.ym = v
    setYmRaw(v)
  }
  const setSel = (v) => {
    calMemory.sel = v
    setSelRaw(v)
  }
  const setOpen = (v) => {
    calMemory.open = v
    setOpenRaw(v)
  }
  const setAnchor = (v) => {
    calMemory.anchor = v
    setAnchorRaw(v)
  }
  const toggle = () => {
    if (open) setAnchor(sel) // 접을 때는 선택한 날짜의 주를 보여준다
    else setYm(sel.slice(0, 7)) // 펼 때는 선택한 날짜의 달을 보여준다
    setOpen(!open)
  }
  const [y, m] = ym.split('-').map(Number)
  const shiftDays = (isoStr, n) => {
    const d = fromIso(isoStr)
    d.setDate(d.getDate() + n)
    return iso(d)
  }
  // 주간(접힘) 셀: anchor 가 든 주의 일~토 7일
  const anchorDate = fromIso(anchor)
  const weekStart = new Date(anchorDate)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekKeys = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return iso(d)
  })
  const headDate = open ? { y, m } : { y: anchorDate.getFullYear(), m: anchorDate.getMonth() + 1 }
  const first = new Date(y, m - 1, 1).getDay()
  const count = new Date(y, m, 0).getDate()
  const key = (d) => `${ym}-${pad2(d)}`
  const cells = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)]
  const prev = () => (open ? setYm(m === 1 ? `${y - 1}-12` : `${y}-${pad2(m - 1)}`) : setAnchor(shiftDays(anchor, -7)))
  const next = () => (open ? setYm(m === 12 ? `${y + 1}-01` : `${y}-${pad2(m + 1)}`) : setAnchor(shiftDays(anchor, 7)))
  const blocks = dayBlocks(fromIso(sel))

  const dayCell = (k, label) => {
    const cls = `cal-day${k === sel ? ' is-sel' : ''}${k === today ? ' is-today' : ''}`
    return (
      <button className={cls} key={k} onClick={() => setSel(k)}>
        <span>{label}</span>
        {hasActivity(fromIso(k)) ? <i /> : null}
      </button>
    )
  }

  return (
    <>
      <div className="cal">
        <div className="cal-head">
          <button onClick={prev} aria-label={open ? '이전 달' : '이전 주'}>
            <Icon name="chevronLeft" size={18} />
          </button>
          <strong>
            {headDate.y}년 {headDate.m}월
          </strong>
          <div className="cal-head-right">
            <button onClick={next} aria-label={open ? '다음 달' : '다음 주'}>
              <Icon name="chevronRight" size={18} />
            </button>
            <button className="cal-toggle" onClick={toggle} aria-label={open ? '달력 접기' : '달력 펴기'}>
              <Icon name={open ? 'chevronUp' : 'chevronDown'} size={17} />
            </button>
          </div>
        </div>
        <div className="cal-grid">
          {WD.map((w) => (
            <span className="cal-wd" key={w}>
              {w}
            </span>
          ))}
          {open
            ? cells.map((d, i) => (d ? dayCell(key(d), d) : <span key={`e${i}`} />))
            : weekKeys.map((k) => dayCell(k, fromIso(k).getDate()))}
        </div>
      </div>
      <p className="cal-caption">
        {dateLabel(sel)}
        {sel === today && <em className="cal-today-tag">오늘</em>}
      </p>
      <div className="cal-panel" key={sel}>
        {blocks.map((b, i) => (
          <Block spec={b} go={go} key={i} />
        ))}
      </div>
    </>
  )
}

/* ── 20. panels — 분할 탭 + 탭별 블록 묶음 (김민정스킨바디 추가) ──
   tabs: [{ label, blocks: [...] }] — 탭을 누르면 그 탭의 블록들을 그린다(대시보드). */
function Panels({ tabs = [], initial = 0, variant, go }) {
  const [at, setAt] = useState(initial)
  useEffect(() => {
    const h = (e) => typeof e.detail === 'number' && setAt(e.detail)
    window.addEventListener('panels:go', h)
    return () => window.removeEventListener('panels:go', h)
  }, [])
  const cur = tabs[at]
  return (
    <div className={`panels${variant ? ` panels-${variant}` : ''}`}>
      <div className="segs panels-segs" style={variant === 'chips' ? undefined : { gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((t, i) => (
          <button className={`seg${i === at ? ' is-active' : ''}`} key={i} onClick={() => setAt(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="panel" key={at}>
        {(cur?.blocks ?? []).map((b, i) => (
          <Block spec={b} go={go} key={i} />
        ))}
      </div>
    </div>
  )
}

/* ── 22. tiles — 색 타일 2열 메뉴 (라온하우징 홈 추가) ──
   items: [{ icon, title, sub, color: 'green'|'blue'|'orange'|'violet', to }] */
function Tiles({ items = [], cols = 2, variant, go }) {
  // variant: 'center' 면 아이콘 위·글자 아래 가운데 정렬 카드(만물상토탈솔루션 홈 서비스 6칸)
  return (
    <div className={`tiles${variant ? ` tiles-${variant}` : ''}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {items.map((it, i) => (
        <button className={`tile tile-${it.color || 'green'}${it.image ? ' has-photo' : ''}`} key={i} onClick={() => goWith(go, it)}>
          {/* image: 아이콘 대신 위쪽 사진(홈케어마스터 견적문의 상단 이미지) */}
          {it.image ? (
            <img className="tile-photo" src={it.image} alt="" />
          ) : (
            <span className="tile-icon">
              <Icon name={it.icon} size={30} strokeWidth={1.6} />
            </span>
          )}
          <span className="tile-body">
            <strong className="tile-title">{it.title}</strong>
            {it.sub && <span className="tile-sub">{it.sub}</span>}
          </span>
          {/* arrow: 오른쪽 화살표(서호에너지 '무료 견적 상담' 띠) */}
          {it.arrow && <Icon name="arrowRight" size={24} className="tile-arrow" />}
        </button>
      ))}
    </div>
  )
}

/* ── svcGuide — 서비스 시공 안내(홈케어마스터 추가) ──
   전체 서비스에서 고른 서비스(selected.svc)의 소개 + 시공 단계 4개(사진·단계명·설명) + 견적 문의 버튼.
   견적문의로 갔다가 뒤로 오면 selected 가 비어 있으므로 마지막으로 연 서비스를 기억해 둔다. */
let lastGuideSvc = ''
function SvcGuide({ cta = '견적 문의하기', go }) {
  const [svc] = useState(() => selected.svc || lastGuideSvc)
  lastGuideSvc = svc
  const g = svcGuide(svc)
  if (!g) return <p className="rows-empty">서비스를 선택해 주세요.</p>
  return (
    <div className="guide">
      <div className="guide-head">
        <img src={g.image} alt="" />
        <div className="guide-head-body">
          <strong>{g.name}</strong>
          {g.desc.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>
      <h2 className="guide-title">시공 단계</h2>
      <ol className="guide-steps">
        {g.steps.map((st, i) => (
          <li className="guide-step" key={i}>
            <img src={st.image} alt={`${g.name} ${st.title}`} loading="lazy" />
            <div className="guide-step-body">
              <em>STEP {i + 1}</em>
              <strong>{st.title}</strong>
              <p>{st.desc}</p>
            </div>
          </li>
        ))}
      </ol>
      <button className="btn-primary guide-cta" onClick={() => goWith(go, { to: 'quote', data: { svc } })}>
        <Icon name="clipboard" size={20} />
        {g.name} {cta}
        <Icon name="chevronRight" size={20} className="btn-arrow" />
      </button>
    </div>
  )
}

/* ── 23. imageBanner — 사진 카드 + 글자 (라온하우징 추가) ──
   image · heading(큰 글자) · desc(줄 배열) · text(가운데 한 줄) · fade: [솔리드%, 투명%] 좌측 덮개 · height */
function ImageBanner({ image, eyebrow, heading, desc, text, fade, height, to, go }) {
  const style = {
    minHeight: height,
    backgroundImage: image
      ? fade
        ? `linear-gradient(90deg, var(--ib-from) 0%, var(--ib-from) ${fade[0]}%, rgba(0, 0, 0, 0) ${fade[1]}%), url(${image})`
        : `url(${image})`
      : undefined,
  }
  const Tag = to ? 'button' : 'div'
  return (
    <Tag className={`image-banner${image ? ' has-image' : ' media-ph'}${text ? ' is-center' : ''}`} style={style} onClick={to ? () => go(to) : undefined}>
      {text && <strong className="ib-text">{text}</strong>}
      {(heading || desc) && (
        <span className="ib-copy">
          {eyebrow && <span className="ib-eyebrow">{eyebrow}</span>}
          {heading && <strong className="ib-heading">{heading}</strong>}
          {desc && (
            <span className="ib-desc">
              {(Array.isArray(desc) ? desc : [desc]).map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </span>
          )}
        </span>
      )}
    </Tag>
  )
}

/* ── 24. checkList — 체크 항목 + 우측 썸네일 (라온하우징 제품 특징 추가) ── */
function CheckList({ items = [], image }) {
  return (
    <div className="check-card">
      <ul className="check-list">
        {items.map((t, i) => (
          <li key={i}>
            <span className="check-mark">
              <Icon name="check" size={12} strokeWidth={2.6} />
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      {image && <img className="check-img" src={image} alt="" loading="lazy" />}
    </div>
  )
}

/* ── 25. caseCards — 시공 전/후 사진 카드 + 분류 칩 (라온하우징 시공사례 추가) ──
   items: [{ group, before, after, title, desc }] · tabs: ['전체','아파트',...] 는 한 줄 가로 스크롤 칩 */
function CaseCards({ items = [], source, tabs, allLabel = '전체', beforeLabel = '시공 전', afterLabel = '시공 후', empty = '해당 시공사례가 준비 중입니다.', go }) {
  if (source) items = [...items, ...sourceItems(source)]
  const [tab, setTab] = useState(0)
  const cur = tabs?.[tab]
  const list = tabs && cur !== allLabel ? items.filter((it) => it.group === cur) : items
  return (
    <div className="cases">
      {tabs?.length > 0 && (
        <div className="segs case-segs">
          {tabs.map((s, i) => (
            <button className={`seg${i === tab ? ' is-active' : ''}`} key={i} onClick={() => setTab(i)}>
              {s}
            </button>
          ))}
        </div>
      )}
      {list.length === 0 && <p className="rows-empty">{empty}</p>}
      <ul className="case-list">
        {list.map((it, i) => (
          <li className="case" key={i}>
            <div className="case-pair">
              <figure className="case-shot">
                {it.before ? <img src={it.before} alt="" loading="lazy" /> : <div className="media media-ph" />}
                <figcaption>{beforeLabel}</figcaption>
              </figure>
              <span className="case-arrow">
                <Icon name="chevronRight" size={16} strokeWidth={2.4} />
              </span>
              <figure className="case-shot">
                {it.after ? <img src={it.after} alt="" loading="lazy" /> : <div className="media media-ph" />}
                <figcaption>{afterLabel}</figcaption>
              </figure>
            </div>
            <strong className="case-title">{it.title}</strong>
            {it.desc && <p className="case-desc">{it.desc}</p>}
            {it.cta && (
              <button className="btn-ghost case-cta" onClick={() => go(it.cta.to)}>
                {it.cta.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 26. photoCards — 사진 + 제목 + 부제 카드 격자 (우성건업 추가) ──
   items: [{ image, title, sub, group, to }] · cols · size: 'lg' · tabs: ['전체', ...] 한 줄 가로 스크롤 칩 · source */
function PhotoCards({ items = [], source, cols = 2, size, tabs, allLabel = '전체', empty = '해당 항목이 준비 중입니다.', go }) {
  if (source) items = [...items, ...sourceItems(source)]
  const [tab, setTab] = useState(0)
  const cur = tabs?.[tab]
  const list = tabs && cur !== allLabel ? items.filter((it) => it.group === cur) : items
  return (
    <div className={`photo-cards${size ? ` photo-cards-${size}` : ''}`}>
      {tabs?.length > 0 && (
        <div className="pc-chips">
          {tabs.map((s, i) => (
            <button className={`pc-chip${i === tab ? ' is-active' : ''}`} key={i} onClick={() => setTab(i)}>
              {s}
            </button>
          ))}
        </div>
      )}
      {list.length === 0 && <p className="rows-empty">{empty}</p>}
      <ul className="pc-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {list.map((it, i) => (
          <li key={i}>
            <button className="pc-card" onClick={() => goWith(go, it)}>
              {it.arrow ? (
                // arrow: 사진 가운데 흰 원 + 꺾쇠(홈케어마스터 홈 작업사례 시안)
                <span className="pc-imgwrap">
                  <Media src={it.image} alt={it.title} className="pc-img" />
                  <span className="pc-arrow">
                    <Icon name="chevronRight" size={18} strokeWidth={2.4} />
                  </span>
                </span>
              ) : (
                <Media src={it.image} alt={it.title} className="pc-img" />
              )}
              <span className="pc-body">
                <strong className="pc-title">{it.title}</strong>
                {it.sub && <span className="pc-sub">{it.sub}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 27. jobBoard — 생산 작업 목록: 썸네일 + 작업명 + 코드 + 상태 뱃지 + 공정률 막대 (효령테크 추가) ──
   source · tabs: ['전체','가공중',...] 한 줄 칩 · manage: true 면 행마다 상태 드롭다운(규칙 16), 아니면 뱃지만 */
function JobBoard({ source = 'jobs', tabs, allLabel = '전체', manage = false, segs = false, empty = '해당 상태의 작업이 없습니다.' }) {
  // segs: true 면 알약 칩 대신 시안의 밑줄 분할 탭으로 그린다(은성기공 주문 진행 현황)
  const [, bump] = useState(0)
  useEffect(() => {
    const h = () => bump((n) => n + 1)
    window.addEventListener('store:changed', h)
    return () => window.removeEventListener('store:changed', h)
  }, [])
  const [tab, setTab] = useState(0)
  const items = sourceItems(source)
  const cur = tabs?.[tab]
  const list = tabs && cur !== allLabel ? items.filter((it) => it.group === cur) : items
  const countOf = (s) => (s === allLabel ? items.length : items.filter((it) => it.group === s).length)
  return (
    <div className={`jobs${manage ? ' is-manage' : ''}`}>
      {tabs?.length > 0 && (
        <div className={`job-chips${segs ? ' is-segs' : ''}`}>
          {tabs.map((s, i) => (
            <button className={`job-chip${i === tab ? ' is-active' : ''}`} key={i} onClick={() => setTab(i)}>
              {s}
              {manage && <em>{countOf(s)}</em>}
            </button>
          ))}
        </div>
      )}
      {list.length === 0 && <p className="rows-empty">{empty}</p>}
      <ul className="job-list">
        {list.map((it) => (
          <li className="job" key={it.id}>
            <img className="job-img" src={it.image} alt="" loading="lazy" />
            <div className="job-body">
              <div className="job-head">
                {/* 시안: 첫 줄에 코드(+거래처·납기), 오른쪽에 상태 뱃지. 품명은 그 아래 줄 */}
                <span className="job-code">
                  {it.code}
                  <i>{it.meta}</i>
                </span>
                {manage ? (
                  <label className={`job-select tone-${it.tone}`}>
                    <select value={it.status} onChange={(e) => setJobStatus(it.id, e.target.value)}>
                      {JOB_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Icon name="chevronDown" size={13} />
                  </label>
                ) : (
                  <span className={`tag job-tag tone-${it.tone}`}>{it.status}</span>
                )}
              </div>
              <strong className="job-title">{it.title}</strong>
              <div className="job-bar">
                <span className={`job-track${it.pct >= 100 ? ' is-done' : ''}`}>
                  <span style={{ width: `${it.pct}%` }} />
                </span>
                <b>{it.pct}%</b>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 28. mapCard — 지도 사진 + 핀·지역 라벨 (효령테크 해외사업 글로벌 네트워크 추가) ──
   image · pins: [{ x, y, label, labelPos: 'below'|'above' }] (x·y 는 % 좌표) */
function MapCard({ image, pins = [], height = 150 }) {
  return (
    <div className="map-card" style={{ height, backgroundImage: image ? `url(${image})` : undefined }}>
      {pins.map((p, i) => (
        <span className="map-pin" key={i} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <Icon name="mapPin" size={22} strokeWidth={2} />
          {p.label && <em className={`map-label is-${p.labelPos || 'below'}`}>{p.label}</em>}
        </span>
      ))}
    </div>
  )
}

/* ── 29. barChart — 묶음 막대(적합·보완) + 범례 (은성기공 품질관리 추가) ──
   source → { labels, series: [{ label, color, points }] } · 섹션 제목 오른쪽에 범례가 온다 */
function BarChart({ source, labels = [], series = [], stacked = false, unit = '건' }) {
  const [, bump] = useState(0)
  useEffect(() => {
    const h = () => bump((n) => n + 1)
    window.addEventListener('store:changed', h)
    return () => window.removeEventListener('store:changed', h)
  }, [])
  if (source) {
    const d = sourceItems(source)
    labels = d.labels ?? labels
    series = d.series ?? series
    if (d.stacked !== undefined) stacked = d.stacked
  }
  const totals = labels.map((_, i) => series.reduce((a, s) => a + (s.points[i] || 0), 0))
  const max = stacked ? Math.max(1, ...totals) : Math.max(1, ...series.flatMap((s) => s.points))
  const top = Math.ceil(max / 4) * 4 || 4
  const ticks = [top, (top * 3) / 4, top / 2, top / 4, 0]
  return (
    <div className={`bar-card${stacked ? ' is-stacked' : ''}`}>
      <div className="bar-legend">
        {series.map((s, i) => (
          <span key={i}>
            <i style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <div className="bar-plot">
        <div className="bar-y">
          {ticks.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
        <div className="bar-cols">
          {labels.map((l, i) => (
            <div className="bar-col" key={i}>
              {/* stacked: 시안처럼 한 막대에 쌓고 총합을 막대 위에 적는다 */}
              {stacked && <b className="bar-total">{totals[i]}</b>}
              <div className={`bar-pair${stacked ? ' is-stack' : ''}`} style={stacked ? { height: `${(totals[i] / top) * 100}%` } : undefined}>
                {(stacked ? [...series].reverse() : series).map((s, j) => (
                  <span
                    key={j}
                    className="bar"
                    style={{ height: stacked ? `${totals[i] ? (s.points[i] / totals[i]) * 100 : 0}%` : `${(s.points[i] / top) * 100}%`, background: s.color }}
                    title={`${s.label} ${s.points[i]}${unit}`}
                  />
                ))}
              </div>
              <em>{l}</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 30. costCard — 기간 공사 비용 + 증감 + 스파크라인 (해강건축 시안 '이번 달 비용' 카드) ──
   source → { title, period, value, delta, up, points, labels } */
function CostCard({ source, title, period, value, delta, up = true, points = [], labels = [] }) {
  const [, bump] = useState(0)
  useEffect(() => {
    const h = () => bump((n) => n + 1)
    window.addEventListener('store:changed', h)
    return () => window.removeEventListener('store:changed', h)
  }, [])
  if (source) ({ title, period, value, delta, up, points, labels } = sourceItems(source))
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const d = points
    .map((v, i) => `${(i / Math.max(1, points.length - 1)) * 100},${28 - ((v - min) / span) * 24}`)
    .join(' ')
  return (
    <div className="cost-card">
      <div className="cost-head">
        <strong className="cost-title">{title}</strong>
        <span className="cost-period">{period}</span>
      </div>
      <div className="cost-body">
        <span className="cost-value">{value}</span>
        {delta && (
          <span className={`cost-delta${up ? ' is-up' : ' is-down'}`}>
            <Icon name="arrowUp" size={13} strokeWidth={2.6} />
            {delta}
          </span>
        )}
        <svg className="cost-spark" viewBox="0 0 100 30" preserveAspectRatio="none">
          <polyline points={d} />
        </svg>
      </div>
      {labels.length > 0 && (
        <ul className="cost-labels">
          {labels.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── 31. svcCards — 아이콘 + 제목 + 설명 2줄 + 우측 사진 (해강건축 전체 서비스) ──
   items: [{ icon, title, desc: [줄1, 줄2], image, to }] */
function SvcCards({ items = [], go }) {
  return (
    <ul className="svc-cards">
      {items.map((it, i) => (
        <li key={i}>
          <button className="svc-card" onClick={() => goWith(go, it)}>
            <span className="svc-icon">
              <Icon name={it.icon} size={30} strokeWidth={1.7} />
            </span>
            <span className="svc-body">
              <strong className="svc-title">{it.title}</strong>
              {(Array.isArray(it.desc) ? it.desc : [it.desc]).filter(Boolean).map((l, j) => (
                <span className="svc-desc" key={j}>
                  {l}
                </span>
              ))}
            </span>
            {it.image && <img className="svc-img" src={it.image} alt="" loading="lazy" />}
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ── 33. myDash — 시안 '운영 대시보드' 요약 화면을 고객 관점으로 (만물상토탈솔루션 추가) ──
   기간 선택(이번 달·최근 3개월·최근 6개월) → 지표 4칸 · 진행 현황 도넛 · 범례가 함께 바뀌고,
   월간 공사비는 6개월/3개월 막대를 고른다. 값은 seoho.js 의 dashSummary·monthlyCost 가 센다. */
function MyDash({ go }) {
  const [period, setPeriod] = useState(DASH_PERIODS[0])
  const [months, setMonths] = useState(6)
  const [, bump] = useState(0)
  useEffect(() => {
    const h = () => bump((n) => n + 1)
    window.addEventListener('store:changed', h)
    return () => window.removeEventListener('store:changed', h)
  }, [])
  const { stats, donut } = dashSummary(period)
  const cost = monthlyCost(months)
  const R = 38
  const C = 2 * Math.PI * R
  const gap = donut.total > 1 ? 1.6 : 0
  let acc = 0
  const arcs = donut.segments
    .filter((sg) => sg.value > 0)
    .map((sg) => {
      const len = (sg.value / Math.max(1, donut.total)) * C
      const arc = { ...sg, dash: `${Math.max(0, len - gap)} ${C}`, offset: -acc }
      acc += len
      return arc
    })
  const max = Math.max(1, ...cost.bars.map((b) => b.value))
  const select = (value, options, onChange) => (
    <label className="mdash-select">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={14} />
    </label>
  )
  return (
    <div className="mdash">
      <div className="mdash-period">{select(period, DASH_PERIODS, setPeriod)}</div>
      <div className="mdash-stats">
        {stats.map((st, i) => (
          <button className="mdash-stat" key={i} onClick={() => go?.(st.to)}>
            <span className={`mdash-ic mdash-ic-${i}`}>
              <Icon name={st.icon} size={24} />
            </span>
            <span className="mdash-stat-body">
              <small>{st.label}</small>
              <b>
                {st.value}
                <em>{st.unit}</em>
              </b>
            </span>
          </button>
        ))}
      </div>
      <section className="mdash-sec">
        <h2>진행 현황</h2>
        <div className="mdash-donut">
          <div className="mdash-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={R} fill="none" stroke="#eef1f5" strokeWidth="15" />
              {arcs.map((a, i) => (
                <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={a.color} strokeWidth="15" strokeDasharray={a.dash} strokeDashoffset={a.offset} transform="rotate(-90 50 50)" />
              ))}
            </svg>
            <span className="mdash-center">
              <b>
                {donut.total}
                <em>건</em>
              </b>
              <small>{donut.caption}</small>
            </span>
          </div>
          <ul className="mdash-legend">
            {donut.segments.map((sg, i) => (
              <li key={i}>
                <i style={{ background: sg.color }} />
                <span>{sg.label}</span>
                <b>{sg.value}건</b>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mdash-sec">
        <div className="mdash-head">
          <h2>월간 공사비</h2>
          {select(months, [{ value: 6, label: '6개월' }, { value: 3, label: '3개월' }], (v) => setMonths(Number(v)))}
        </div>
        <strong className="mdash-total">{cost.value}</strong>
        <small className="mdash-cap">{cost.caption}</small>
        <div className="mdash-bars">
          {cost.bars.map((b, i) => (
            <div className={`mdash-col${i === cost.bars.length - 1 ? ' is-now' : ''}`} key={i}>
              <span className="mdash-bar" style={{ height: `${Math.max(4, (b.value / max) * 100)}%` }} title={`${b.value.toLocaleString('ko-KR')}원`} />
              <em>{b.label}</em>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ── 34. consultDash — 시안 '운영 대시보드' 요약을 고객 관점으로 (서호에너지 추가) ──
   상담 진행 현황 도넛(가운데 완료율) + 범례 → 지표 4칸(2×2) → 월별 시공 비용 막대.
   기간(이번 달·최근 3개월·최근 6개월)을 바꾸면 도넛·지표가 함께 바뀐다. 값은 seoho.js 가 센다. */
function ConsultDash({ initial = 2, go }) {
  const [period, setPeriod] = useState(DASH_PERIODS[initial] ?? DASH_PERIODS[0])
  const [, bump] = useState(0)
  useEffect(() => {
    const h = () => bump((n) => n + 1)
    window.addEventListener('store:changed', h)
    return () => window.removeEventListener('store:changed', h)
  }, [])
  const { stats, donut } = dashSummary(period)
  const cost = monthlyCost(6)
  const R = 38
  const C = 2 * Math.PI * R
  let acc = 0
  const arcs = donut.segments
    .filter((sg) => sg.value > 0)
    .map((sg) => {
      const len = (sg.value / Math.max(1, donut.total)) * C
      const arc = { ...sg, dash: `${len} ${C}`, offset: -acc }
      acc += len
      return arc
    })
  const max = Math.max(1, ...cost.bars.map((b) => b.value))
  return (
    <div className="cdash">
      <div className="cdash-period">
        {DASH_PERIODS.map((p) => (
          <button key={p} className={`cdash-chip${p === period ? ' is-active' : ''}`} onClick={() => setPeriod(p)}>
            {p}
          </button>
        ))}
      </div>
      <section className="cdash-card">
        <h2>상담 진행 현황</h2>
        <div className="cdash-donut">
          <div className="cdash-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={R} fill="none" stroke="#eef1f5" strokeWidth="16" />
              {arcs.map((a, i) => (
                <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={a.color} strokeWidth="16" strokeDasharray={a.dash} strokeDashoffset={a.offset} transform="rotate(-90 50 50)" />
              ))}
            </svg>
            <span className="cdash-center">
              <b>
                {donut.pct}
                <em>%</em>
              </b>
              <small>완료</small>
            </span>
          </div>
          <ul className="cdash-legend">
            {donut.segments.map((sg, i) => (
              <li key={i}>
                <i style={{ background: sg.color }} />
                <span>{sg.label}</span>
                <b>{sg.value}건</b>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="cdash-stats">
        {stats.map((st, i) => (
          <button className="cdash-stat" key={i} onClick={() => goWith(go, st)}>
            <small>{st.label}</small>
            <b>
              {st.value}
              <em>{st.unit}</em>
            </b>
          </button>
        ))}
      </div>
      <section className="cdash-card">
        <h2>월별 시공 비용</h2>
        <strong className="cdash-total">{cost.value}</strong>
        <small className="cdash-cap">{cost.caption}</small>
        <div className="cdash-bars">
          {cost.bars.map((b, i) => (
            <div className={`cdash-col${i === cost.bars.length - 1 ? ' is-now' : ''}`} key={i}>
              {b.value > 0 && <span className="cdash-val">{shortWon(b.value).replace('원', '')}</span>}
              <span className="cdash-bar" style={{ height: `${b.value ? Math.max(6, (b.value / max) * 100) : 2}%` }} title={`${b.value.toLocaleString('ko-KR')}원`} />
              <em>{b.label}</em>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ── 32. aiFlow — AI 분석 "시작 → 분석 중 → 결과" 3단 흐름 (원소프트에서 가져옴, 규칙 7) ──
   다시 들어오면 "이전 분석 결과 · N분 전" 배너 + "새 분석 시작" 과 함께 지난 결과부터 보여 준다.
   intro: { name, desc[] }  steps: ['…을 분석하고 있습니다', …]  results: [블록, …]
   store: localStorage 키(앱에 분석이 여럿이면 나눈다) */
const aiAgo = (t) => {
  const m = Math.floor((Date.now() - t) / 60000)
  if (m < 1) return '방금 전'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  return `${Math.floor(h / 24)}일 전`
}

function AiFlow({ intro, empty, steps = [], results = [], cta = 'AI 분석 시작', store = 'ai:lastRun', keySource, go }) {
  // keySource: 지금 분석 대상이 무엇인지 알려주는 값(해강건축은 견적 번호).
  // 지난 분석과 대상이 다르면 "이전 분석 결과"가 아니라 처음부터 다시 돌린다
  // — 새 견적을 넣고 왔는데 옛 분석이 그대로 뜨면 안 된다.
  const key = keySource ? String(sourceItems(keySource)) : null
  const nothing = keySource ? !key : false
  const saved = readLS(store, null)
  const savedAt = typeof saved === 'object' && saved ? saved.at : saved
  const stale = key !== null && typeof saved === 'object' && saved ? saved.key !== key : false
  const [last, setLast] = useState(() => (stale ? null : savedAt))
  const [phase, setPhase] = useState(() => (!stale && savedAt ? 'done' : 'idle'))
  const [fresh, setFresh] = useState(false) // 이번 방문에서 방금 돌린 분석인가
  const [at, setAt] = useState(0)

  const start = () => {
    setAt(0)
    setPhase('run')
  }

  useEffect(() => {
    if (phase !== 'run') return undefined
    const t = setTimeout(
      () => {
        if (at < steps.length) return setAt(at + 1)
        const now = Date.now()
        writeLS(store, key === null ? now : { at: now, key })
        setLast(now)
        setFresh(true)
        setPhase('done')
        return undefined
      },
      at < steps.length ? 850 : 450,
    )
    return () => clearTimeout(t)
  }, [phase, at, steps.length, store, key])

  if (nothing)
    return (
      <div className="ai-flow-card">
        <span className="ai-flow-icon is-muted">
          <Icon name="sparkle" size={26} />
        </span>
        <strong className="ai-flow-name">{empty?.name ?? '분석할 견적이 없습니다'}</strong>
        {(Array.isArray(empty?.desc) ? empty.desc : [empty?.desc]).filter(Boolean).map((l, i) => (
          <p className="ai-flow-desc" key={i}>
            {l}
          </p>
        ))}
        {empty?.cta && (
          <button className="btn-primary" onClick={() => go(empty.cta.to)}>
            {empty.cta.label}
          </button>
        )}
      </div>
    )

  if (phase === 'idle')
    return (
      <div className="ai-flow-card">
        <span className="ai-flow-icon">
          <Icon name="sparkle" size={26} />
        </span>
        {intro?.name && <strong className="ai-flow-name">{intro.name}</strong>}
        {intro?.desc &&
          (Array.isArray(intro.desc) ? intro.desc : [intro.desc]).map((l, i) => (
            <p className="ai-flow-desc" key={i}>
              {l}
            </p>
          ))}
        <button className="btn-primary" onClick={start}>
          {cta}
        </button>
      </div>
    )

  if (phase === 'run')
    return (
      <div className="ai-flow-card">
        <span className="ai-flow-icon ai-pulse">
          <Icon name="sparkle" size={26} />
        </span>
        <strong className="ai-flow-name">AI가 분석하고 있습니다</strong>
        <ul className="ai-steps">
          {steps.map((step, i) => (
            <li className={`ai-step${i < at ? ' is-done' : i === at ? ' is-now' : ''}`} key={i}>
              <span className="ai-mark">
                {i < at ? <Icon name="check" size={13} /> : i === at ? <span className="ai-spin" /> : <span className="ai-dot" />}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    )

  return (
    <>
      <div className="ai-flow-done">
        <span className="ai-mark">
          <Icon name="check" size={14} />
        </span>
        <span>{fresh ? 'AI 분석이 완료되었습니다' : `이전 분석 결과 · ${last ? aiAgo(last) : ''}`}</span>
        <button className="ai-again" onClick={start}>
          새 분석 시작
        </button>
      </div>
      {results.map((b, i) => (
        <Block spec={b} go={go} key={i} />
      ))}
    </>
  )
}

/* ── 레지스트리 ────────────────────────────── */
const REGISTRY = {
  aiFlow: AiFlow,
  svcGuide: SvcGuide,
  consultDash: ConsultDash,
  myDash: MyDash,
  barChart: BarChart,
  costCard: CostCard,
  svcCards: SvcCards,
  jobBoard: JobBoard,
  mapCard: MapCard,
  photoCards: PhotoCards,
  tiles: Tiles,
  imageBanner: ImageBanner,
  checkList: CheckList,
  caseCards: CaseCards,
  hero: Hero,
  statGrid: StatGrid,
  listRows: ListRows,
  meterRows: MeterRows,
  gauge: Gauge,
  stepper: Stepper,
  keyValue: KeyValue,
  mediaCard: MediaCard,
  segmentTabs: SegmentTabs,
  lineChart: LineChart,
  iconGrid: IconGrid,
  tipCard: TipCard,
  noteCard: NoteCard,
  cta: Cta,
  text: Text,
  profile: Profile,
  form: Form,
  records: Records,
  actions: Actions,
  panels: Panels,
  calendar: Calendar,
}

export const BLOCK_TYPES = Object.keys(REGISTRY)

/** spec의 블록 하나를 렌더한다. 알 수 없는 type이면 화면에 눈에 띄게 표시해
 *  검수 때 바로 잡히도록 한다(조용히 사라지면 놓친다). */
export default function Block({ spec: raw, go }) {
  const spec = resolveSel(resolveTokens(raw)) // {today±N:FMT} → 실제 날짜, @sel:필드 → 선택 항목
  const { type, title, more, moreIcon, ifSel, card, ...props } = spec
  const Cmp = REGISTRY[type]

  if (!Cmp) {
    return <div className="block-missing">알 수 없는 블록: {type}</div>
  }

  // ifSel: { key, is } — 선택된 항목의 값이 다르면 이 블록을 그리지 않는다. (is 에 배열도 허용)
  if (ifSel) {
    const v = resolveSel(`@sel:${ifSel.key}`)
    const ok = Array.isArray(ifSel.is) ? ifSel.is.includes(v) : ifSel.is === undefined ? Boolean(v) : v === ifSel.is
    if (!ok) return null
  }

  // hero의 title은 섹션 제목이 아니라 배너 안 큰 글자다.
  if (type === 'hero') {
    return <Cmp {...props} title={title} go={go} />
  }

  return (
    <Section title={title} more={more} moreIcon={moreIcon} card={card} onMore={() => go(props.moreTo)}>
      <Cmp {...props} go={go} />
    </Section>
  )
}
