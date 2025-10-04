import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { todayISO } from '../lib/datetime'
import { useEventsRange, type EventItem } from '../lib/events'
import { IconForKind, type Kind } from '../components/Icons'
import EventRow from '../components/EventRow'

const ALL_KINDS: Kind[] = ['feed','diaper','sleep','vitamin','weight','height','other']

export default function DailyLog() {
  const { t } = useTranslation()
  const today = todayISO()

  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)
  const [selected, setSelected] = useState<Set<Kind>>(new Set(ALL_KINDS))

  const { data, isLoading, error } = useEventsRange({ from, to })

  const filtered: EventItem[] = useMemo(() => {
    const src = data ?? []
    return src.filter(ev => selected.has(ev.kind as Kind))
  }, [data, selected])

  function toggle(k: Kind) {
    setSelected(prev => {
      const n = new Set(prev)
      if (n.has(k)) n.delete(k); else n.add(k)
      if (n.size === 0) ALL_KINDS.forEach(x => n.add(x)) // mai 0
      return n
    })
  }
  function selectAll() { setSelected(new Set(ALL_KINDS)) }

  // azioni (stub pronte a collegarsi ai form)
  function onEdit(_ev: EventItem){ /* open edit modal */ }
  function onDuplicate(_ev: EventItem){ /* duplicate logic */ }
  function onDelete(_ev: EventItem){ /* delete logic */ }

  return (
    <div className="content content--safe">
      {/* FILTRI */}
      <section className="card card--pad">
        <div className="grid-2">
          <label>
            {t('filters.from')}
            <input className="input input--date" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          </label>
          <label>
            {t('filters.to')}
            <input className="input input--date" type="date" value={to} onChange={e=>setTo(e.target.value)} />
          </label>
        </div>

        <div className="chips" role="group" aria-label="kinds filter" style={{marginTop:8}}>
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
        </div>
      </section>

      {/* LISTA EVENTI */}
      {isLoading && <div className="card">{t('state.loading')}</div>}
      {error && <div className="card" style={{color:'tomato'}}>{String((error as any).message || error)}</div>}
      {!isLoading && filtered.length === 0 && <div className="card">{t('state.empty')}</div>}

      <div className="stack">
        {filtered.map(ev => (
          <EventRow
            key={ev.id}
            event={ev}
            onEdit={()=>onEdit(ev)}
            onDuplicate={()=>onDuplicate(ev)}
            onDelete={()=>onDelete(ev)}
          />
        ))}
      </div>
    </div>
  )
}
