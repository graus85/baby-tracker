import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { insertWeight } from '../../lib/api'
import { todayISO, nowTimeLocal, toPgTimeWithTZ } from '../../lib/datetime'
import { useSelectedDate } from '../../store/ui'

export default function WeightForm(){
  const nav = useNavigate()
  const { date: selDate } = useSelectedDate()
  const [date, setDate] = useState(selDate || todayISO())
  const [time, setTime] = useState(nowTimeLocal().slice(0,5))
  const [kg, setKg] = useState<string>('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    try{
      await insertWeight({ date, time: toPgTimeWithTZ(time+':00'), kg: Number(kg), note: note || null })
      alert('Salvato'); nav('/')
    }catch(e:any){ alert(e.message || String(e)) } finally{ setLoading(false) }
  }

  return (
    <div className="content">
      <form className="card" onSubmit={onSubmit} style={{maxWidth:520, margin:'16px auto', display:'grid', gap:12}}>
        <h2>Peso</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>Data<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>Ora<input className="input" type="time" step="60" value={time} onChange={e=>setTime(e.target.value)} /></label>
        </div>
        <label>Peso (kg)<input className="input" inputMode="decimal" value={kg} onChange={e=>setKg(e.target.value)} /></label>
        <label>Note<textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} /></label>
        <button disabled={loading} type="submit">Salva</button>
      </form>
    </div>
  )
}
