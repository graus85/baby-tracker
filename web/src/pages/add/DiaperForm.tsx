import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { insertDiaper } from '../../lib/api'
import { todayISO, nowTimeLocal, toPgTimeWithTZ } from '../../lib/datetime'
import { useSelectedDate } from '../../store/ui'
import { useTranslation } from 'react-i18next'

export default function DiaperForm(){
  const { t } = useTranslation()
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
      alert(t('actions.saved')); nav('/')
    }catch(e:any){ alert(e.message || String(e)) } finally{ setLoading(false) }
  }

  return (
    <div className="content">
      <form className="card" onSubmit={onSubmit} style={{maxWidth:520, margin:'16px auto', display:'grid', gap:12}}>
        <h2>{t('add.diaper')}</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>{t('fields.date')}<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>{t('fields.time')}<input className="input" type="time" step="60" value={time} onChange={e=>setTime(e.target.value)} /></label>
        </div>
        <div className="card" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label className="input" style={{display:'flex',alignItems:'center',gap:8, padding:8}}>
            <input type="checkbox" checked={pee} onChange={e=>setPee(e.target.checked)} />
            <span>{t('fields.pee')}</span>
          </label>
          <label className="input" style={{display:'flex',alignItems:'center',gap:8, padding:8}}>
            <input type="checkbox" checked={poop} onChange={e=>setPoop(e.target.checked)} />
            <span>{t('fields.poop')}</span>
          </label>
        </div>
        <label>{t('fields.notes')}<textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} /></label>
        <button disabled={loading} type="submit">{t('actions.save')}</button>
      </form>
    </div>
  )
}
