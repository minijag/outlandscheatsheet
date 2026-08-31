import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, BookOpen, ChevronRight, CircleAlert, ExternalLink,
  MapPin, Menu, Search, Shield, Skull, Sparkles, Swords, X,
} from 'lucide-react'
import { bosses, sources } from './data'

const confidence = {
  medium: { label: 'Field documented', short: 'Documented', note: 'Clearly demonstrated in historical encounter footage; verify after balance changes.' },
  low: { label: 'Verification needed', short: 'Unverified', note: 'Current combat archetype is known, but unique mechanics lack a trustworthy public breakdown.' },
}

const preferenceOptions = {
  type: ['All encounters', 'Main Boss', 'Mini-Boss', 'Omni Boss'],
  sortMode: ['dungeon', 'name'],
  viewMode: ['full', 'compact'],
}

function savedPreference(key, fallback) {
  try {
    const value = localStorage.getItem(`outlands-encounters:${key}`)
    return preferenceOptions[key].includes(value) ? value : fallback
  } catch {
    return fallback
  }
}

function BossArt({ boss, large = false }) {
  if (boss.image) return <img className={large ? 'boss-art boss-art-large' : 'boss-art'} src={boss.image} alt={boss.name} />
  return (
    <div className={large ? 'art-fallback art-fallback-large' : 'art-fallback'} aria-hidden="true">
      <Skull size={large ? 58 : 34} strokeWidth={1.3} />
    </div>
  )
}

function BossCard({ boss, onOpen, compact = false }) {
  const c = confidence[boss.confidence]
  const typeClass = boss.type === 'Main Boss' ? 'main' : boss.type === 'Omni Boss' ? 'omni' : 'mini'
  if (compact) {
    return (
      <button className={`boss-card compact-card compact-card-${typeClass}`} onClick={() => onOpen(boss)} aria-label={`Open ${boss.name} encounter guide`}>
        <span className="compact-location"><MapPin size={14} />{boss.location}</span>
        <span className="compact-type">{boss.type}</span>
        <h3>{boss.name}</h3>
        <ChevronRight className="compact-arrow" size={18} />
      </button>
    )
  }
  return (
    <button className={`boss-card boss-card-${typeClass}`} onClick={() => onOpen(boss)} aria-label={`Open ${boss.name} encounter guide`}>
      <div className="card-art">
        <BossArt boss={boss} />
        <span className={`confidence confidence-${boss.confidence}`}>{c.short}</span>
      </div>
      <div className="card-copy">
        <div className="eyebrow"><span>{boss.type}</span><i />{boss.slayer}</div>
        <h3>{boss.name}</h3>
        <p>{boss.summary}</p>
        <div className="card-meta">
          <span><MapPin size={14} />{boss.location}</span>
          <span>{boss.abilities.length} {boss.abilities.length === 1 ? 'mechanic' : 'mechanics'}</span>
        </div>
        <div className="card-action">View encounter <ArrowRight size={16} /></div>
      </div>
    </button>
  )
}

function BossModal({ boss, onClose }) {
  useEffect(() => {
    if (!boss) return
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [boss, onClose])

  if (!boss) return null
  const c = confidence[boss.confidence]
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <article className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close encounter guide"><X /></button>
        <header className="modal-hero">
          <div className="modal-art"><BossArt boss={boss} large /></div>
          <div>
            <div className="eyebrow"><span>{boss.type}</span><i />{boss.slayer}</div>
            <h2 id="modal-title">{boss.name}</h2>
            <p>{boss.summary}</p>
            <div className="modal-tags">
              <span><MapPin size={15} />{boss.location}</span>
              <span><Swords size={15} />{boss.role}</span>
            </div>
          </div>
        </header>

        <div className={`evidence evidence-${boss.confidence}`}>
          {boss.confidence === 'medium' ? <BookOpen /> : <CircleAlert />}
          <div><strong>{c.label}</strong><p>{c.note}</p></div>
        </div>

        <section className="modal-section">
          <div className="section-kicker"><Sparkles /> Encounter mechanics</div>
          {boss.abilities.length ? (
            <div className="ability-list">
              {boss.abilities.map(([name, text], index) => (
                <div className="ability" key={name}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{name}</h3><p>{text}</p></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-mechanics">
              <CircleAlert />
              <div><h3>Unique abilities awaiting verification</h3><p>The public sources confirm this boss’s combat archetype, but not a dependable move list.</p></div>
            </div>
          )}
        </section>

        <section className="modal-section">
          <div className="section-kicker"><Shield /> Field notes</div>
          <ul className="tips-list">{boss.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
        </section>
      </article>
    </div>
  )
}

function App() {
  const [type, setType] = useState(() => savedPreference('type', 'All encounters'))
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState(() => savedPreference('sortMode', 'dungeon'))
  const [viewMode, setViewMode] = useState(() => savedPreference('viewMode', 'full'))
  const [selected, setSelected] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('outlands-encounters:type', type)
      localStorage.setItem('outlands-encounters:sortMode', sortMode)
      localStorage.setItem('outlands-encounters:viewMode', viewMode)
    } catch {
      // Preferences remain in memory when storage is unavailable.
    }
  }, [type, sortMode, viewMode])

  const filtered = useMemo(() => {
    const matches = bosses.filter((boss) => {
    const q = query.trim().toLowerCase()
    const matchType = type === 'All encounters' || boss.type === type
    const matchQuery = !q || [boss.name, boss.location, boss.type].join(' ').toLowerCase().includes(q)
      return matchType && matchQuery
    })
    if (sortMode === 'name') {
      matches.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortMode === 'dungeon') {
      matches.sort((a, b) => (
        a.location.localeCompare(b.location)
        || (a.type === 'Main Boss' ? -1 : 1) - (b.type === 'Main Boss' ? -1 : 1)
        || a.name.localeCompare(b.name)
      ))
    }
    return matches
  }, [type, query, sortMode])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="site-shell">
      <nav className="topbar">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Outlands Cheat Sheet home">
          <span className="brand-sigil"><Swords size={21} /></span>
          <span>OUTLANDS <b>CHEAT SHEET</b></span>
        </button>
        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <button onClick={() => scrollTo('encounters')}>Encounters</button>
          <button onClick={() => scrollTo('sources')}>Sources</button>
        </div>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><Menu /></button>
      </nav>

      <main id="top">
        <h1 className="sr-only">UO Outlands Boss and Miniboss Cheat Sheet</h1>
        <section className="encounters" id="encounters">
          <div className="section-heading">
            <div><span className="section-number">01 / ENCOUNTER INDEX</span><h2>Choose your target</h2></div>
            <p>{filtered.length} of {bosses.length} encounters</p>
          </div>

          <div className="filters">
            <label className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search boss name, location, or type…" /></label>
            <div className="type-tabs" role="group" aria-label="Encounter type">
              {preferenceOptions.type.map((label) => (
                <button className={type === label ? 'active' : ''} onClick={() => setType(label)} key={label}>{label}</button>
              ))}
            </div>
            <div className="index-controls">
              <div className="control-set" role="group" aria-label="Sort encounters">
                <span>Sort</span>
                <button className={sortMode === 'dungeon' ? 'active' : ''} onClick={() => setSortMode('dungeon')}>Dungeon A–Z</button>
                <button className={sortMode === 'name' ? 'active' : ''} onClick={() => setSortMode('name')}>Name A–Z</button>
              </div>
              <div className="control-set" role="group" aria-label="Encounter view">
                <span>View</span>
                <button className={viewMode === 'full' ? 'active' : ''} onClick={() => setViewMode('full')}>Full</button>
                <button className={viewMode === 'compact' ? 'active' : ''} onClick={() => setViewMode('compact')}>Compact</button>
              </div>
            </div>
          </div>

          {filtered.length ? (
            <div className={`boss-grid ${viewMode === 'compact' ? 'compact-grid' : ''}`}>{filtered.map((boss) => <BossCard boss={boss} compact={viewMode === 'compact'} onOpen={setSelected} key={boss.name} />)}</div>
          ) : (
            <div className="no-results"><Search /><h3>No encounters found</h3><p>Try a broader boss name, location, or type.</p><button onClick={() => { setQuery(''); setType('All encounters') }}>Clear filters</button></div>
          )}
        </section>

        <section className="source-section" id="sources">
          <div className="source-intro">
            <span className="section-number">02 / SOURCES</span>
            <h2>Study the Enemy</h2>
            <p>The roster and archetypes come from official Outlands pages. Ability descriptions come from demonstrated community encounters and are flagged where later patches may have changed them.</p>
          </div>
          <div className="source-list">
            {sources.map((source, index) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                <span>{String(index + 1).padStart(2, '0')}</span><strong>{source.label}</strong><ExternalLink size={17} />
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer><div className="brand"><span className="brand-sigil"><Swords size={18} /></span><span>OUTLANDS <b>CHEAT SHEET</b></span></div></footer>
      <BossModal boss={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default App
