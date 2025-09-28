import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

type DayData = {
  feeds: any[]
  diapers: any[]
  sleeps: any[]
  vitamins: any[]
  weights: any[]
  heights: any[]
  others: any[]
}

export default function DailyLog() {
  const [date, setDate] = useState<string>(()=> new Date().toISOString().slice(0,10))
  const [data, setData] = useState<DayData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  async function addDemoNote() {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return
    const now = new Date()
    const time = now.toISOString().slice(11,19) + '+00'
    const today = now.toISOString().slice(0,10)
    const { error } = await supabase.from('others').insert({
      user_id: user.id,
      date: today,
      time,
      note: 'Nota demo aggiunta dal pulsante'
    })
    if (!error) load()
  }

  return (
    <div className="card">
      <h2>Daily Log</h2>
      <div className="row">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <button onClick={load}>Ricarica</button>
        <button onClick={addDemoNote}>Aggiungi evento demo</button>
      </div>
      {loading && <p>Caricamento…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && data && (
        <div className="list">
          <div className="badge">Feeds: {data.feeds.length}</div>
          <div className="badge">Diapers: {data.diapers.length}</div>
          <div className="badge">Sleep: {data.sleeps.length}</div>
          <div className="badge">Vitamins: {data.vitamins.length}</div>
          <div className="badge">Weights: {data.weights.length}</div>
          <div className="badge">Heights: {data.heights.length}</div>
          <div className="badge">Others: {data.others.length}</div>
          <div className="hr"></div>
          {data.others.map((o, i)=> (
            <div key={i} className="card">
              <div><strong>Altro</strong> <span className="small">{o.date} {o.time}</span></div>
              <div>{o.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
