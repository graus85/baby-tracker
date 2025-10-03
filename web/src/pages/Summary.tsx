import { useMemo, useState } from 'react'
import { todayISO } from '../lib/datetime'
import { useEventsRange } from '../lib/events'
import EventTimeline from '../components/EventTimeline'
import { useTranslation } from 'react-i18next'

export default function Summary(){
  const { t } = useTranslation()
  const today = todayISO()
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)

  const { data, isLoading, error } = useEventsRange({ from, to })
  const total = useMemo(()=> data?.length ?? 0, [data])

  return (
    <div className="content">
      <div className="card" style={{display:'grid', gap:8, marginBottom:12}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>{t('filters.from')}<input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
          <label>{t('filters.to')}<input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="muted">{t('summary.range', { from, to })}</div>
          <div className="badge">{t('summary.total', { count: total })}</div>
        </div>
      </div>

      {isLoading && <div className="card">{t('state.loading')}</div>}
      {error && <div className="card" style={{color:'tomato'}}>{String((error as any).message || error)}</div>}
      {!isLoading && (data?.length ?? 0) === 0 && <div className="card">{t('state.empty')}</div>}

      {!!data && data.length > 0 && (
        <EventTimeline events={data} from={from} to={to} />
      )}
    </div>
  )
}
