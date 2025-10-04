import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { IconForKind } from './Icons'
import type { Kind } from '../lib/events'

type Props = {
  open: boolean
  onClose: () => void
  onAdded: () => void
  defaultDate: string
}

const KINDS: Kind[] = ['feed','diaper','sleep','vitamin','weight','height','other']

function nowHHMM(){
  const d = new Date()
  const hh = String(d.getHours()).padStart(2,'0')
  const mm = String(d.getMinutes()).padStart(2,'0')
  return `${hh}:${mm}`
}

export default function AddEventSheet({ open, onClose, onAdded, defaultDate }: Props){
  const { t } = useTranslation()
  const [step, setStep] = useState<'pick'|'form'>('pick')
  const [kind, setKind] = useState<Kind | null>(null)

  // campi comuni
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState(nowHHMM())
  const [note, setNote] = useState('')

  // feed
  const [method, setMethod] = useState<'breast'|'bottle'>('breast')
  const [side, setSide] = useState<'left'|'right'>('left')
  const [amount, setAmount] = useState<number | ''>('')
  const [unit, setUnit] = useState<'ml'|'oz'>('ml')
  const [milkType, setMilkType] = useState('')

  // diaper
  const [pee, setPee] = useState(true)
  const [poop, setPoop] = useState(false)

  // sleep
  const [start, setStart] = useState(nowHHMM())
  const [endTime, setEndTime] = useState(nowHHMM())

  // vitamin / weight / height
  const [name, setName] = useState('')
  const [dose, setDose] = useState('')
  const [kg, setKg] = useState<number | ''>('')
  const [cm, setCm] = useState<number | ''>('')

  React.useEffect(()=>{
    if (!open){ // reset ad ogni chiusura
      setStep('pick'); setKind(null)
      setDate(defaultDate); setTime(nowHHMM()); setNote('')
      setMethod('breast'); setSide('left'); setAmount(''); setUnit('ml'); setMilkType('')
      setPee(true); setPoop(false)
      setStart(nowHHMM()); setEndTime(nowHHMM())
      setName(''); setDose(''); setKg(''); setCm('')
    }
  }, [open, defaultDate])

  if (!open) return null

  async function add(){
    const { data: userRes } = await supabase.auth.getUser()
    const user_id = userRes?.user?.id
    if (!user_id || !kind) { alert('Not authenticated'); return }

    // helper time to hh:mm:ss
    const t = (x?: string) => x ? `${x}:00` : null

    let table = ''
    let payload: any = { user_id, date, note: note || null }

    switch(kind){
      case 'feed':
        table = 'feeds'
        payload.time = t(time)
        payload.method = method
        if (method === 'bottle'){
          payload.amount = amount === '' ? null : Number(amount)
          payload.unit = unit
          payload.milk_type = milkType || null
        } else {
          payload.side = side
        }
        break

      case 'diaper':
        table = 'diapers'
        payload.time = t(time)
        payload.pee = !!pee
        payload.poop = !!poop
        break

      case 'sleep':
        table = 'sleeps'
        payload.start_time = t(start)
        payload.end_time = t(endTime)
        break

      case 'vitamin':
        table = 'vitamins'
        payload.time = t(time)
        payload.name = name || null
        payload.dose = dose || null
        break

      case 'weight':
        table = 'weights'
        payload.time = t(time)
        payload.kg = kg === '' ? null : Number(kg)
        break

      case 'height':
        table = 'heights'
        payload.time = t(time)
        payload.cm = cm === '' ? null : Number(cm)
        break

      case 'other':
        table = 'others'
        payload.time = t(time)
        break
    }

    const { error } = await supabase.from(table).insert(payload)
    if (error) {
      alert(error.message)
      return
    }
    onAdded()
  }

  const title = useMemo(()=>{
    return kind ? `${t('add.title')} — ${t(`kinds.${kind}`)}` : t('add.title')
  }, [kind, t])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>{title}</h3>

        {step === 'pick' && (
          <>
            <div className="sheet-grid" style={{marginBottom:12}}>
              {KINDS.map(k => (
                <button key={k} className="sheet-tile" onClick={()=>{ setKind(k); setStep('form') }}>
                  <IconForKind kind={k} width={22} height={22}/>
                  <span>{t(`kinds.${k}`)}</span>
                </button>
              ))}
            </div>
            <button onClick={onClose}>{t('actions.cancel') || 'Cancel'}</button>
          </>
        )}

        {step === 'form' && kind && (
          <div className="sheet-form">
            <div className="grid-2">
              <label>{t('fields.date')}
                <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
              </label>
              {kind === 'sleep' ? (
                <label>{t('fields.start')}
                  <input className="input" type="time" value={start} onChange={e=>setStart(e.target.value)} />
                </label>
              ) : (
                <label>{t('fields.time')}
                  <input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)} />
                </label>
              )}
            </div>

            {/* campi specifici */}
            {kind === 'feed' && (
              <>
                <label>{t('fields.breast') + ' / ' + t('fields.bottle')}
                  <select className="input" value={method} onChange={e=>setMethod(e.target.value as any)}>
                    <option value="breast">{t('fields.breast')}</option>
                    <option value="bottle">{t('fields.bottle')}</option>
                  </select>
                </label>
                {method === 'bottle' ? (
                  <div className="grid-2">
                    <label>{t('fields.quantityMl')}
                      <input className="input" type="number" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value === '' ? '' : Number(e.target.value))} />
                    </label>
                    <label>Unit
                      <select className="input" value={unit} onChange={e=>setUnit(e.target.value as any)}>
                        <option value="ml">ml</option>
                        <option value="oz">oz</option>
                      </select>
                    </label>
                  </div>
                ) : (
                  <label>{t('fields.sideLeft') + ' / ' + t('fields.sideRight')}
                    <select className="input" value={side} onChange={e=>setSide(e.target.value as any)}>
                      <option value="left">{t('fields.sideLeft')}</option>
                      <option value="right">{t('fields.sideRight')}</option>
                    </select>
                  </label>
                )}
                {method === 'bottle' && (
                  <label>{t('fields.milkType')}
                    <input className="input" type="text" value={milkType} onChange={e=>setMilkType(e.target.value)} placeholder={t('fields.milkTypePlaceholder') || ''} />
                  </label>
                )}
              </>
            )}

            {kind === 'diaper' && (
              <div className="chips">
                <label className="chip">
                  <input type="checkbox" checked={pee} onChange={e=>setPee(e.target.checked)} />
                  <span>{t('fields.pee')}</span>
                </label>
                <label className="chip">
                  <input type="checkbox" checked={poop} onChange={e=>setPoop(e.target.checked)} />
                  <span>{t('fields.poop')}</span>
                </label>
              </div>
            )}

            {kind === 'sleep' && (
              <label>{t('fields.end')}
                <input className="input" type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} />
              </label>
            )}

            {kind === 'vitamin' && (
              <>
                <label>{t('fields.name')}
                  <input className="input" type="text" value={name} onChange={e=>setName(e.target.value)} />
                </label>
                <label>{t('fields.dose')}
                  <input className="input" type="text" value={dose} onChange={e=>setDose(e.target.value)} />
                </label>
              </>
            )}

            {kind === 'weight' && (
              <label>{t('fields.kg')}
                <input className="input" type="number" inputMode="decimal" value={kg} onChange={e=>setKg(e.target.value === '' ? '' : Number(e.target.value))} />
              </label>
            )}

            {kind === 'height' && (
              <label>{t('fields.cm')}
                <input className="input" type="number" inputMode="decimal" value={cm} onChange={e=>setCm(e.target.value === '' ? '' : Number(e.target.value))} />
              </label>
            )}

            <label>{t('fields.notes')}
              <input className="input" type="text" value={note} onChange={e=>setNote(e.target.value)} />
            </label>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8}}>
              <button onClick={()=>{ setStep('pick'); setKind(null) }}>{t('actions.cancel') || 'Cancel'}</button>
              <button onClick={add}>{t('actions.add')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
