import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { todayISO } from '../lib/datetime'
import { useEventsRange, type Kind } from '../lib/events'
import { IconForKind } from '../components/Icons'
import { truncate } from '../lib/format'

type Tab = 'all' | Kind

const KIND_ORDER: Tab[] = ['all','feed','diaper','sleep','vitamin','weight','height','other']

export default function DailyLog(){
  const { t } = useTranslation()
  const today = todayISO()
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)
  const [tab, setTab] = useState<Tab>('all')

  const { data, isLoading, error } = useEventsRange({ from, to })

  const filtered = useMemo(()=> {
    const items = data ?? []
    if (tab === 'all') return items
    return items.filter(e => e.kind === tab)
  }, [data, tab])

  return (
    <div className="content">
      {/* Header filter bar */}
      <div className="card" style={{display:'grid', gap:8, marginBottom:12}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>{t('filters.from')}<input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
          <label>{t('filters.to')}<input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
        </div>

        <div className="chips">
          {KIND_ORDER.map(k=>{
            const active = tab === k
            return (
              <button
                key={k}
                className={`chip ${active ? 'chip-active' : ''}`}
                onClick={()=>setTab(k)}
                aria-pressed={active}
              >
                {k==='all' ? t('filters.all') : t(`kinds.${k}`)}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      {isLoading && <div className="card">{t('state.loading')}</div>}
      {error && <div className="card" style={{color:'tomato'}}>{String((error as any).message || error)}</div>}
      {!isLoading && filtered?.length === 0 && (
        <div className="card">{t('state.empty')}</div>
      )}

      <div className="vstack">
        {filtered?.map(ev=>(
          <article key={`${ev.kind}-${ev.id}`} className="event-card">
            <div className="event-icon">
              <IconForKind kind={ev.kind} className="ico-md" />
            </div>
            <div className="event-body">
              <div className="event-title">{t(`kinds.${ev.kind}`)}</div>
              <div className="event-sub">
                {truncate(ev.subtitle, 120)}
              </div>
              {ev.note && <div className="event-note">“{truncate(ev.note, 140)}”</div>}
            </div>
            <div className="event-time">{ev.time}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
