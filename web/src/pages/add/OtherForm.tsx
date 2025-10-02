import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { insertOther } from '../../lib/api'
import { todayISO, nowTimeLocal, toPgTimeWithTZ } from '../../lib/datetime'
import { useSelectedDate } from '../../store/ui'
import { useTranslation } from 'react-i18next'

export default function OtherForm(){
  const { t } = useTranslation()
  const nav = useNavigate()
  const { date: selDate } = useSelectedDate()
  const [date, setDate] = useState(selDate || todayISO())
  const [time, setTime] = useState(nowTimeLocal().slice(0,5))
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setLoading(true)
    try{
      await insertOther({ date, time: toPgTimeWithTZ(time+':00'), note })
      alert(t('actions.saved')); nav('/')
    }catch(e:any){ alert(e.message || String(e)) } finally{ setLoading(false) }
  }

  return (
    <div className="content">
      <form className="card" onSubmit={onSubmit} style={{maxWidth:520, margin:'16px auto', display:'grid', gap:12}}>
        <h2>{t('add.other')}</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>{t('fields.date')}<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>{t('fields.time')}<input className="input" type="time" step="60" value={time} onChange={e=>setTime(e.target.value)} /></label>
        </div>
        <label>{t('fields.observations')}<textarea className="input" rows={4} value={note} onChange={e=>setNote(e.target.value)} /></label>
        <button disabled={loading} type="submit">{t('actions.save')}</button>
      </form>
    </div>
  )
}
