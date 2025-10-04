import React from 'react'
import { useTranslation } from 'react-i18next'
import { IconForKind } from './Icons'
import type { EventItem } from '../lib/events'

type Props = {
  event: EventItem
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function timeRight(ev: EventItem){
  if (ev.kind === 'sleep' && ev.start) {
    const s = ev.start.slice(0,5)
    const e = ev.endTime?.slice(0,5)
    return e ? `${s}–${e}` : s
  }
  return ev.time?.slice(0,5) || ''
}

function subtitle(ev: EventItem, t: (k:string,v?:any)=>string){
  switch(ev.kind){
    case 'feed':
      if (ev.method === 'bottle'){
        const qty = ev.amount ? `${ev.amount}${ev.unit || 'ml'}` : ''
        const type = ev.milk_type ? ` ${ev.milk_type}` : ''
        return [qty && `${qty} bottle`, type].filter(Boolean).join('')
      }
      if (ev.side) return t('fields.breast') + ' ' + (ev.side === 'left' ? t('fields.sideLeft') : t('fields.sideRight'))
      return t('fields.breast')
    case 'diaper': {
      const a:string[] = []
      if (ev.pee) a.push('pee')
      if (ev.poop) a.push('poop')
      return a.join(' + ')
    }
    case 'vitamin': return ev.name || t('kinds.vitamin')
    case 'weight':  return ev.kg ? `${ev.kg} kg` : ''
    case 'height':  return ev.cm ? `${ev.cm} cm` : ''
    case 'other':   return ev.note || t('kinds.other')
    case 'sleep':   return ev.note || t('kinds.sleep')
    default:        return ev.note || ''
  }
}

export default function EventRow({ event, onEdit, onDuplicate, onDelete }: Props){
  const { t } = useTranslation()
  const title = t(`kinds.${event.kind}`)
  const sub = subtitle(event, t)
  const at = timeRight(event)

  return (
    <article className="event-card card">
      <div className="event-ico">
        <IconForKind kind={event.kind as any} width={20} height={20}/>
      </div>

      <div className="event-main">
        <div className="event-head">
          <div className="event-title">{title}</div>
          <div className="event-time">{at}</div>
        </div>
        {sub && <div className="event-sub">{sub}</div>}

        <div className="event-actions">
          <button onClick={onEdit}>{t('actions.edit')}</button>
          <button onClick={onDuplicate}>{t('actions.duplicate')}</button>
          <button className="btn-danger" onClick={onDelete}>{t('actions.delete')}</button>
        </div>
      </div>
    </article>
  )
}
