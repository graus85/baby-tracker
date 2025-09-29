import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { todayISO } from '../utils/time'
import { countsByType, TYPE_META } from '../utils/format'
import type { DayData } from '../types'
import EventGridChart from '../components/EventGridChart'

type DayRow = { date: string; data: DayData }

export default function Summary() {
  // ✅ preimposta oggi
  const [from, setFrom] = useState<string>(() => todayISO())
  const [to, setTo] = useState<string>(() => todayISO())

  const [rows, setRows] = useState<DayRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true); setError(null)
    const { data, error } = await supabase
      .from('v_day_data')
      .select('date, data')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: true })
    setLoading(false)
    if (error) { setError(error.message); return }
    setRows((data as any[])?.map(r => ({ date: r.date, data: r.data as DayData })) ?? [])
  }

  useEffect(() => { load() }, [from, to])

  // Totali nel periodo
  const totals = useMemo(() => {
    const empty = { feed:0, diaper:0, sleep:0, vitamin:0, weight:0, height:0, other:0 }
    return rows.reduce((acc, r) => {
      const c = countsByType(r.data)
      ;(Object.keys(c) as (keyof typeof acc)[]).forEach(k => { acc[k] += c[k] })
      return acc
    }, empty)
  }, [rows])

  return (
    <div className="card">
      <h2>Summary</h2>

      {/* Datepicker centrati */}
      <div className="row" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <label className="small">From</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <label className="small">To</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <button onClick={load}>Ricarica</button>
      </div>

      {/* Totali del periodo centrati */}
      <div className="row" style={{ justifyContent: 'center', marginTop: 8 }}>
        {(['feed','diaper','sleep','vitamin','weight','height','other'] as const).map(t => (
          <div key={t} className="badge" title={TYPE_META[t].label}>
            <span style={{ marginRight: 6 }}>{TYPE_META[t].emoji}</span>
            {totals[t]}
          </div>
        ))}
      </div>

      <div className="hr" />

      {loading && <p>Caricamento…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        rows.length === 0
          ? <p className="small">Nessun evento nel periodo selezionato.</p>
          : <EventGridChart rows={rows} />
      )}
    </div>
  )
}
