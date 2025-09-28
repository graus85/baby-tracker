import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelectedDate } from '../store/ui'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

type Feed = { id:string; time:string; amount?:number; unit?:'ml'|'oz'; method:'breast'|'bottle'; side?:'left'|'right'; durationSec?:number; milkType?:string; note?:string }
type Diaper = { id:string; time:string; pee:boolean; poop:boolean; note?:string }
type DayData = { feeds: Feed[]; diapers: Diaper[] }

export default function DailyLog(){
  const { date } = useSelectedDate()
  const qc = useQueryClient()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setUserId(data.user?.id ?? null)) }, [])

  const dayQuery = useQuery({
    queryKey: ['day', date],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      const uid = user.user?.id
      if(!uid) throw new Error('Non autenticato')
      const { data, error } = await supabase.from('v_day_data')
        .select('data')
        .eq('user_id', uid)
        .eq('date', date)
        .maybeSingle()
      if(error) throw error
      return (data?.data as DayData) ?? { feeds: [], diapers: [] }
    }
  })

  const addFeed = useMutation({
    mutationFn: async (payload: { time:string; amount:number; note?:string }) => {
      if(!userId) throw new Error('Missing user')
      const { error } = await supabase.from('feeds').insert({
        user_id: userId,
        date, time: payload.time, method: 'bottle',
        amount: payload.amount, unit:'ml', milk_type:'formula',
        note: payload.note ?? null
      })
      if(error) throw error
    },
    onSuccess: ()=> qc.invalidateQueries({ queryKey: ['day', date] })
  })

  const addDiaper = useMutation({
    mutationFn: async (payload: { time:string; pee:boolean; poop:boolean; note?:string }) => {
      if(!userId) throw new Error('Missing user')
      const { error } = await supabase.from('diapers').insert({
        user_id: userId, date, time: payload.time, pee: payload.pee, poop: payload.poop, note: payload.note ?? null
      })
      if(error) throw error
    },
    onSuccess: ()=> qc.invalidateQueries({ queryKey: ['day', date] })
  })

  return (
    <div className="row">
      <div className="card" style={{flex:2}}>
        <h3>Feed</h3>
        <FeedForm onAdd={(time, amount, note)=>addFeed.mutate({time, amount, note})} />
        <ul>
          {dayQuery.data?.feeds?.map(f=>(
            <li key={f.id}><span className="badge">{f.time}</span> {f.method==='bottle' ? `${f.amount ?? 0} ${f.unit ?? 'ml'}` : `breast ${f.side}`} {f.note ? `— ${f.note}`:''}</li>
          ))}
          {!dayQuery.data?.feeds?.length && <li><small>Nessun feed per questo giorno.</small></li>}
        </ul>
      </div>
      <div className="card" style={{flex:1}}>
        <h3>Diapers</h3>
        <DiaperForm onAdd={(time, pee, poop, note)=>addDiaper.mutate({time, pee, poop, note})} />
        <ul>
          {dayQuery.data?.diapers?.map(d=>(
            <li key={d.id}><span className="badge">{d.time}</span> {d.pee?'pee':''} {d.poop?'poop':''} {d.note ? `— ${d.note}`:''}</li>
          ))}
          {!dayQuery.data?.diapers?.length && <li><small>Nessun cambio per questo giorno.</small></li>}
        </ul>
      </div>
    </div>
  )
}

function FeedForm({ onAdd }:{ onAdd: (time:string, amount:number, note?:string)=>void }){
  const [time, setTime] = useState('08:00')
  const [amount, setAmount] = useState(120)
  const [note, setNote] = useState('')
  return (
    <form className="row" onSubmit={(e)=>{e.preventDefault(); onAdd(time, amount, note||undefined); setNote('')}}>
      <input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)} required />
      <input className="input" type="number" min={0} step={10} value={amount} onChange={e=>setAmount(parseInt(e.target.value||'0'))} required />
      <input className="input" type="text" placeholder="nota (opzionale)" value={note} onChange={e=>setNote(e.target.value)} />
      <button type="submit">Aggiungi</button>
    </form>
  )
}

function DiaperForm({ onAdd }:{ onAdd: (time:string, pee:boolean, poop:boolean, note?:string)=>void }){
  const [time, setTime] = useState('09:30')
  const [pee, setPee] = useState(true)
  const [poop, setPoop] = useState(false)
  const [note, setNote] = useState('')
  return (
    <form className="row" onSubmit={(e)=>{e.preventDefault(); onAdd(time, pee, poop, note||undefined); setNote('')}}>
      <input className="input" type="time" value={time} onChange={e=>setTime(e.target.value)} required />
      <label><input type="checkbox" checked={pee} onChange={e=>setPee(e.target.checked)} /> Pee</label>
      <label><input type="checkbox" checked={poop} onChange={e=>setPoop(e.target.checked)} /> Poop</label>
      <input className="input" type="text" placeholder="nota (opzionale)" value={note} onChange={e=>setNote(e.target.value)} />
      <button type="submit">Aggiungi</button>
    </form>
  )
}
