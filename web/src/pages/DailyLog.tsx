import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { todayISO } from '../lib/datetime'
import { useEventsRange, type Kind } from '../lib/events'
import { IconForKind } from '../components/Icons'
import { truncate } from '../lib/format'
import { deleteByKind, duplicateByKind } from '../lib/api'
import { useNavigate } from 'react-router-dom'

type Tab = 'all' | Kind
const KIND_ORDER: Tab[] = ['all','feed','diaper','sleep','vitamin','weight','height','other']

export default function DailyLog(){
  const { t } = useTranslation()
  const today = todayISO()
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)
  const [tab, setTab] = useState<Tab>('all')
  const nav = useNavigate()

  const { data, isLoading, error, refetch } = useEventsRange({ from, to })

  const filtered = useMemo(()=> {
    const items = data ?? []
    if (tab === 'all') return items
    return items.filter(e => e.kind === tab)
  }, [data, tab])

  async function onDelete(kind: Kind, id: string){
    if (!confirm(t('actions.deleteConfirm') as string)) return
    try { await deleteByKind(kind, id); await refetch() }
    catch(e:any){ alert(e.message || String(e)) }
  }
  async function onDuplicate(kind: Kind, id: string){
    try { await duplicateByKind(kind, id); await refetch() }
    catch(e:any){ alert(e.message || String(e)) }
  }
  function onEdit(kind: Kind, id: string){
    nav(`/add/${kind}?id=${id}`)
  }

  return (
    <div className="content">
      {/* Filter bar */}
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
                title={k === 'all' ? t('filters.all')! : t(`kinds.${k}`)!}
              >
                {k === 'all' ? t('filters.all') : (
                  <>
                    <IconForKind kind={k as Kind} className="ico-chip" />
                    <span>{t(`kinds.${k}`)}</span>
                  </>
                )}
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
              <div className="event-title">{t(`kinds.${ev.kind}`, { defaultValue: ev.title })}</div>
              <div className="event-sub">{truncate(ev.subtitle, 120)}</div>
              {ev.note && <div className="event-note">“{truncate(ev.note, 140)}”</div>}
              <div className="event-actions">
                <button className="btn" onClick={()=>onEdit(ev.kind, ev.id)}>{t('actions.edit')}</button>
                <button className="btn" onClick={()=>onDuplicate(ev.kind, ev.id)}>{t('actions.duplicate')}</button>
                <button className="btn btn-danger" onClick={()=>onDelete(ev.kind, ev.id)}>{t('actions.delete')}</button>
              </div>
            </div>
            <div className="event-time">{ev.time}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
