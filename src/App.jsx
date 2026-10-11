import { useState } from 'react'
import spec from './spec.json'
import Block from './blocks/index.jsx'
import Icon from './icons.jsx'

/**
 * spec.json 하나로 앱 전체를 그린다. 이 파일은 앱마다 수정하지 않는다.
 *
 * 화면 이동은 blocks의 `to` 값으로만 일어나고, 뒤로가기는 방문 스택으로 처리한다.
 * 탭을 누르면 스택을 초기화한다(탭 전환은 새 흐름의 시작이라 뒤로가기가 쌓이면 안 된다).
 */
export default function App() {
  const screens = spec.screens ?? []
  const tabs = spec.tabs ?? []

  const [stack, setStack] = useState([screens[0]?.id])
  const id = stack[stack.length - 1]
  const screen = screens.find((s) => s.id === id) ?? screens[0]

  const go = (to) => {
    if (!to) return
    if (!screens.some((s) => s.id === to)) {
      console.warn(`[spec] 없는 화면으로 이동 시도: "${to}"`)
      return
    }
    setStack((prev) => [...prev, to])
  }

  // 뒤로가기: 쌓인 화면이 있으면 하나 빼고, 탭으로 바로 들어와 쌓인 게 없으면 홈으로 간다.
  const back = () => setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : [screens[0]?.id]))

  if (!screen) return <div className="shell" />

  // 화면이 tab을 명시하면 그것을 따르고, 없으면 그 화면을 여는 탭을 활성으로 본다.
  const activeTab = screen.tab ?? tabs.find((t) => t.to === screen.id)?.id

  const header = screen.header ?? 'back'

  return (
    <div className="shell">
      {header === 'brand' && (
        <header className="header">
          <h1 className="brand">
            {spec.brand?.logo && <img className="brand-logo" src={spec.brand.logo} alt="" />}
            {spec.brand?.sub ? (
              <span className="brand-text">
                <b>{spec.brand?.name}</b>
                <small>{spec.brand.sub}</small>
              </span>
            ) : (
              spec.brand?.name
            )}
          </h1>
          <button className="bell" onClick={() => go(screen.bellTo)}>
            <Icon name="bell" size={21} />
            {screen.bell ? <span className="badge">{screen.bell}</span> : null}
          </button>
        </header>
      )}

      {(header === 'back' || header === 'title') && (
        <header className="screen-header">
          {header === 'back' && (
            <button className="back" onClick={back} aria-label="뒤로">
              <Icon name="chevronLeft" size={21} />
            </button>
          )}
          <h1>{screen.title}</h1>
        </header>
      )}

      {/* key에 화면 id를 넣어 화면이 바뀌면 스크롤과 블록 내부 상태(탭 선택 등)를 초기화한다. */}
      <div className="scroll" key={screen.id}>
        {(screen.blocks ?? []).map((block, i) => (
          <Block spec={block} go={go} key={i} />
        ))}
      </div>

      {tabs.length > 0 && !screen.hideTabBar && (
        <nav className="tabbar" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((t) => (
            <button
              className={`tab${t.id === activeTab ? ' is-active' : ''}`}
              key={t.id}
              onClick={() => screens.some((s) => s.id === t.to) && setStack([t.to])}
            >
              <Icon name={t.icon} size={21} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
