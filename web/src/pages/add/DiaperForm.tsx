import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { insertDiaper } from '../../lib/api'
import { todayISO, nowTimeLocal, toPgTimeWithTZ } from '../../lib/datetime'
import { useSelectedDate } from '../../store/ui'

export default function DiaperForm(){
  const nav = useNavigate()
  const { date: selDate } = useSelectedDate()
  const [date, setDate] = useState(selDate || todayISO())
  const [time, setTime] = useState(nowTimeLocal().slice(0,5))
  const [pee, setPee] = useState(true)
  const [poop, setPoop] = useState(false)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setLoading(true)
    try{
      await insertDiaper({ date, time: toPgTimeWithTZ(time+':00'), pee, poop, note: note || null })
      alert('Salvato'); nav('/')
    }catch(e:any){ alert(e.message || String(e)) } finally{ setLoading(false) }
  }

  return (
    <div className="content">
      <form className="card" onSubmit={onSubmit} style={{maxWidth:520, margin:'16px auto', display:'grid', gap:12}}>
        <h2>Pannolino</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>Data<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>Ora<input className="input" type="time" step="60" value={time} onChange={e=>setTime(e.target.value)} /></label>
        </div>
        <div className="card" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label className="input" style={{display:'flex',alignItems:'center',gap:8, padding:8}}>
            <input type="checkbox" checked={pee} onChange={e=>setPee(e.target.checked)} />
            <span>Pipì</span>
          </label>
          <label className="input" style={{display:'flex',alignItems:'center',gap:8, padding:8}}>
            <input type="checkbox" checked={poop} onChange={e=>setPoop(e.target.checked)} />
            <span>Popò</span>
          </label>
        </div>
        <label>Note<textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} /></label>
        <button disabled={loading} type="submit">Salva</button>
      </form>
    </div>
  )
}
