import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import AddEventModal from './AddEventModal'
import FAB from './ui/FAB'
import type { DayData } from '../types'

export default function DailyLog() {
  const [date, setDate] = useState<string>(()=> new Date().toISOString().slice(0,10))
  const [data, setData] = useState<DayData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  async function load() {
    setLoading(true); setError(null)
    const { data, error } = await supabase
      .from('v_day_data')
      .select('data')
      .eq('date', date)
      .maybeSingle()
    setLoading(false)
    if (error) { setError(error.message); return }
    setData((data?.data as DayData) ?? { feeds: [], diapers: [], sleeps: [], vitamins: [], weights: [], heights: [], others: [] })
  }

  useEffect(()=>{ load() }, [date])

  return (
    <div className="card">
      <h2>Daily Log</h2>
      <div className="row">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <button onClick={load}>Ricarica</button>
      </div>

      {loading && <p>Caricamento…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && data && (
        <>
          <div className="row" style={{marginTop:8}}>
            <div className="badge">Feeds: {data.feeds.length}</div>
            <div className="badge">Diapers: {data.diapers.length}</div>
            <div className="badge">Sleep: {data.sleeps.length}</div>
            <div className="badge">Vitamins: {data.vitamins.length}</div>
            <div className="badge">Weights: {data.weights.length}</div>
            <div className="badge">Heights: {data.heights.length}</div>
          </div>

          <div className="hr" />

          {data.others.length + data.feeds.length + data.diapers.length + data.sleeps.length +
           data.vitamins.length + data.weights.length + data.heights.length === 0
            ? <p className="small">Nessun evento. Premi “+” per aggiungerne uno.</p>
            : <p className="small">Eventi caricati.</p>
          }
        </>
      )}

      <FAB onClick={()=>setOpen(true)} />
      <AddEventModal open={open} onClose={()=>setOpen(false)} date={date} onSaved={load} />
    </div>
  )
}
