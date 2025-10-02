import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { insertSleep } from '../../lib/api'
import { todayISO, nowTimeLocal, toPgTimeWithTZ } from '../../lib/datetime'
import { useSelectedDate } from '../../store/ui'

export default function SleepForm(){
  const nav = useNavigate()
  const { date: selDate } = useSelectedDate()
  const [date, setDate] = useState(selDate || todayISO())
  const [start, setStart] = useState(nowTimeLocal().slice(0,5))
  const [end, setEnd] = useState(nowTimeLocal().slice(0,5))
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setLoading(true)
    try{
      await insertSleep({
        date,
        start_time: toPgTimeWithTZ(start+':00'),
        end_time: toPgTimeWithTZ(end+':00'),
        note: note || null
      })
      alert('Salvato'); nav('/')
    }catch(e:any){ alert(e.message || String(e)) } finally{ setLoading(false) }
  }

  return (
    <div className="content">
      <form className="card" onSubmit={onSubmit} style={{maxWidth:520, margin:'16px auto', display:'grid', gap:12}}>
        <h2>Sonno</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>Data<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>Inizio<input className="input" type="time" step="60" value={start} onChange={e=>setStart(e.target.value)} /></label>
          <label>Fine<input className="input" type="time" step="60" value={end} onChange={e=>setEnd(e.target.value)} /></label>
        </div>
        <label>Note<textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} /></label>
        <button disabled={loading} type="submit">Salva</button>
      </form>
    </div>
  )
}
