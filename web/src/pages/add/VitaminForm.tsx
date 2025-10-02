import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { insertVitamin } from '../../lib/api'
import { todayISO, nowTimeLocal, toPgTimeWithTZ } from '../../lib/datetime'
import { useSelectedDate } from '../../store/ui'

export default function VitaminForm(){
  const nav = useNavigate()
  const { date: selDate } = useSelectedDate()
  const [date, setDate] = useState(selDate || todayISO())
  const [time, setTime] = useState(nowTimeLocal().slice(0,5))
  const [name, setName] = useState('')
  const [dose, setDose] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setLoading(true)
    try{
      await insertVitamin({ date, time: toPgTimeWithTZ(time+':00'), name, dose: dose || null, note: note || null })
      alert('Salvato'); nav('/')
    }catch(e:any){ alert(e.message || String(e)) } finally{ setLoading(false) }
  }

  return (
    <div className="content">
      <form className="card" onSubmit={onSubmit} style={{maxWidth:520, margin:'16px auto', display:'grid', gap:12}}>
        <h2>Vitamine</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>Data<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>Ora<input className="input" type="time" step="60" value={time} onChange={e=>setTime(e.target.value)} /></label>
        </div>
        <label>Tipo<input className="input" value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Dosaggio<input className="input" value={dose} onChange={e=>setDose(e.target.value)} /></label>
        <label>Note<textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} /></label>
        <button disabled={loading} type="submit">Salva</button>
      </form>
    </div>
  )
}
