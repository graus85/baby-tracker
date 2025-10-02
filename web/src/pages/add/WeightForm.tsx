import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getById, insertWeight, updateWeight } from '../../lib/api'
import { todayISO, nowTimeLocal, toPgTimeWithTZ } from '../../lib/datetime'
import { useSelectedDate } from '../../store/ui'
import { useTranslation } from 'react-i18next'

export default function WeightForm(){
  const { t } = useTranslation()
  const nav = useNavigate()
  const { date: selDate } = useSelectedDate()
  const [sp] = useSearchParams()
  const id = sp.get('id')
  const isEdit = useMemo(()=> Boolean(id), [id])

  const [date, setDate] = useState(selDate || todayISO())
  const [time, setTime] = useState(nowTimeLocal().slice(0,5))
  const [kg, setKg] = useState<string>('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try{
        const row = await getById('weights', id)
        setDate(row.date)
        setTime(String(row.time).slice(0,5))
        setKg(String(row.kg ?? ''))
        setNote(row.note || '')
      }catch(e:any){ alert(e.message || String(e)) }
    })()
  }, [id])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setLoading(true)
    try{
      const payload = { date, time: toPgTimeWithTZ(time+':00'), kg: Number(kg), note: note || null }
      if (isEdit && id) await updateWeight(id, payload)
      else await insertWeight(payload)
      alert(t('actions.saved')); nav('/')
    }catch(e:any){ alert(e.message || String(e)) } finally{ setLoading(false) }
  }

  return (
    <div className="content">
      <form className="card" onSubmit={onSubmit} style={{maxWidth:520, margin:'16px auto', display:'grid', gap:12}}>
        <h2>{isEdit ? t('actions.edit') : t('add.weight')}</h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label>{t('fields.date')}<input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>{t('fields.time')}<input className="input" type="time" step="60" value={time} onChange={e=>setTime(e.target.value)} /></label>
        </div>
        <label>{t('fields.kg')}<input className="input" inputMode="decimal" value={kg} onChange={e=>setKg(e.target.value)} /></label>
        <label>{t('fields.notes')}<textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} /></label>
        <button disabled={loading} type="submit">{t('actions.save')}</button>
      </form>
    </div>
  )
}
