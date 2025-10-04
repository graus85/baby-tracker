import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EventItem } from '../lib/events'

type Props = {
  open: boolean
  event: EventItem | null
  onClose: () => void
  onSave: (values: { date: string, time?: string, start?: string, endTime?: string, note?: string }) => Promise<void>
}

export default function EditEventModal({ open, event, onClose, onSave }: Props){
  const { t } = useTranslation()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [start, setStart] = useState('')
  const [endTime, setEndTime] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open || !event) return
    setDate(event.date)
    setTime(event.time?.slice(0,5) || '')
    setStart(event.start?.slice(0,5) || '')
    setEndTime(event.endTime?.slice(0,5) || '')
    setNote(event.note || '')
  }, [open, event])

  if (!open || !event) return null

  async function handleSave(){
    try{
      setBusy(true)
      if (event.kind === 'sleep'){
        await onSave({ date, start, endTime, note })
      } else {
        await onSave({ date, time, note })
      }
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>{t('actions.edit')} — {t(`kinds.${event.kind}`)}</h3>

        <div className="grid-2" style={{marginBottom:8}}>
          <label>{t('fields.date')}
            <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </label>

          {event.kind === 'sleep' ? (
            <label>{t('fields.start')}
              <input className="input" type="time" value={start} onChange={e=>setStart(e.target.value)} />
            </label>
          ) : (
            <label>{t('fields.time')}
              <input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)} />
            </label>
          )}
        </div>

        {event.kind === 'sleep' && (
          <label style={{marginBottom:8}}>{t('fields.end')}
            <input className="input" type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} />
          </label>
        )}

        <label style={{marginBottom:12}}>{t('fields.notes')}
          <input className="input" type="text" value={note} onChange={e=>setNote(e.target.value)} />
        </label>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          <button onClick={onClose}>{t('actions.cancel') || 'Cancel'}</button>
          <button onClick={handleSave} disabled={busy}>{busy ? t('actions.saving') || 'Saving…' : t('actions.save')}</button>
        </div>
      </div>
    </div>
  )
}
