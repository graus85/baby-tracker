import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { insertFeed } from '../../lib/api'
import { todayISO, nowTimeLocal, toPgTimeWithTZ } from '../../lib/datetime'
import { useSelectedDate } from '../../store/ui'

export default function FeedForm(){
  const nav = useNavigate()
  const { date: selDate } = useSelectedDate()
  const [date, setDate] = useState(selDate || todayISO())
  const [time, setTime] = useState(nowTimeLocal().slice(0,5)) // HH:MM (senza sec per UX)
  const [method, setMethod] = useState<'breast'|'bottle'>('breast')
  const [amount, setAmount] = useState<string>('')
  const [durationMin, setDurationMin] = useState<string>('0')
  const [durationSec, setDurationSec] = useState<string>('0')
  const [milkType, setMilkType] = useState('')
  const [side, setSide] = useState<'left'|'right'>('left')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dur = Number(durationMin) * 60 + Number(durationSec)
      await insertFeed({
        date,
        time: toPgTimeWithTZ(time + ':00'),
        method,
        amount: method === 'bottle' ? (amount ? Number(amount) : null) : null,
        unit: method === 'bottle' ? 'ml' : null,
        duration_sec: method === 'bottle' ? dur : null,
        milk_type: method === 'bottle' && milkType ? milkType : null,
        side: method === 'breast' ? side : null,
        note: note || null
      })
      alert('Salvato')
      nav('/')
    } catch (err:any) {
      alert(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="content">
      <form className="card" onSubmit={onSubmit} style={{maxWidth:640, margin:'16px auto', display:'grid', gap:12}}>
        <h2>Pasto</h2>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>Data<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>Ora<input className="input" type="time" step="60" value={time} onChange={e=>setTime(e.target.value)} /></label>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label className="input" style={{display:'flex',alignItems:'center',gap:8, padding:0, background:'transparent', border:'0'}}>
            <input type="radio" name="method" checked={method==='breast'} onChange={()=>setMethod('breast')} />
            <span>Allattamento al seno</span>
          </label>
          <label className="input" style={{display:'flex',alignItems:'center',gap:8, padding:0, background:'transparent', border:'0'}}>
            <input type="radio" name="method" checked={method==='bottle'} onChange={()=>setMethod('bottle')} />
            <span>Biberon</span>
          </label>
        </div>

        {method === 'bottle' ? (
          <>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <label>Quantità (ml)<input className="input" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} /></label>
              <label>Tipo latte<input className="input" value={milkType} onChange={e=>setMilkType(e.target.value)} placeholder="(es. formulato)" /></label>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              <label>Durata (min)<input className="input" inputMode="numeric" value={durationMin} onChange={e=>setDurationMin(e.target.value)} /></label>
              <label>Durata (sec)<input className="input" inputMode="numeric" value={durationSec} onChange={e=>setDurationSec(e.target.value)} /></label>
            </div>
          </>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            <label className="input" style={{display:'flex',alignItems:'center',gap:8, padding:0, background:'transparent', border:'0'}}>
              <input type="radio" name="side" checked={side==='left'} onChange={()=>setSide('left')} />
              <span>Seno sinistro</span>
            </label>
            <label className="input" style={{display:'flex',alignItems:'center',gap:8, padding:0, background:'transparent', border:'0'}}>
              <input type="radio" name="side" checked={side==='right'} onChange={()=>setSide('right')} />
              <span>Seno destro</span>
            </label>
          </div>
        )}

        <label>Note<textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} /></label>

        <div style={{display:'flex', gap:8}}>
          <button disabled={loading} type="submit">Salva</button>
        </div>
      </form>
    </div>
  )
}
