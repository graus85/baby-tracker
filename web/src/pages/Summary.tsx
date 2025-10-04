import { useMemo, useState } from 'react'
import { todayISO } from '../lib/datetime'
import { useEventsRange } from '../lib/events'
import EventTimeline from '../components/EventTimeline'
import { useTranslation } from 'react-i18next'
import type { Kind } from '../components/Icons'
import { IconForKind } from '../components/Icons'

const ALL_KINDS: Kind[] = ['feed','diaper','sleep','vitamin','weight','height','other']

export default function Summary(){
  const { t } = useTranslation()
  const today = todayISO()
  const [from, setFrom] = useState(today)
  const [to, setTo]   = useState(today)

  const [selected, setSelected] = useState<Set<Kind>>(new Set(ALL_KINDS))
  const toggle = (k: Kind) => {
    setSelected(prev => {
      const n = new Set(prev)
      if (n.has(k)) n.delete(k); else n.add(k)
      if (n.size === 0) ALL_KINDS.forEach(x => n.add(x)) // evita "zero tipi"
      return n
    })
  }
  const selectAll = () => setSelected(new Set(ALL_KINDS))

  const { data, isLoading, error } = useEventsRange({ from, to })

  const filtered = useMemo(
    () => (data ?? []).filter(ev => selected.has(ev.kind as Kind)),
    [data, selected]
  )
  const total = filtered.length

  return (
    <div className="content">
      {/* Filter bar */}
      <div className="card" style={{display:'grid', gap:8, marginBottom:12}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>{t('filters.from')}<input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
          <label>{t('filters.to')}  <input className="input" type="date" value={to}   onChange={e=>setTo(e.target.value)} /></label>
        </div>
        <div className="chips" role="group" aria-label="kinds filter">
          <button className={`chip ${selected.size===ALL_KINDS.length ? 'chip-active' : ''}`} onClick={selectAll}>{t('filters.all')}</button>
          {ALL_KINDS.map(k => {
            const active = selected.has(k)
            return (
              <button key={k} className={`chip ${active ? 'chip-active':''}`} onClick={()=>toggle(k)} title={t(`kinds.${k}`)!} aria-pressed={active}>
                <IconForKind kind={k} className="ico-chip" />
                <span>{t(`kinds.${k}`)}</span>
              </button>
            )
          })}
          <div style={{flex:1}} />
          <div className="badge">{t('summary.total', { count: total })}</div>
        </div>
      </div>

      {isLoading && <div className="card">{t('state.loading')}</div>}
      {error && <div className="card" style={{color:'tomato'}}>{String((error as any).message || error)}</div>}
      {!isLoading && total === 0 && <div className="card">{t('state.empty')}</div>}

      {total > 0 && (
        <EventTimeline events={filtered} from={from} to={to} />
      )}
    </div>
  )
}
