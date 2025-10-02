import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'
import { formatTimeHHMM } from './format'

export type Kind = 'feed'|'diaper'|'sleep'|'vitamin'|'weight'|'height'|'other'

export type EventItem = {
  id: string
  kind: Kind
  date: string
  time: string   // HH:MM (per sleep = start)
  endTime?: string // per sleep
  title: string
  subtitle?: string
  note?: string | null
  sortKey: string // YYYY-MM-DDTHH:MM
}

type Range = { from: string; to: string }

export function useEventsRange({ from, to }: Range){
  return useQuery({
    queryKey: ['events-range', from, to],
    queryFn: async (): Promise<EventItem[]> => {
      if (!supabase) throw new Error('Supabase not configured')

      const [feeds, diapers, sleeps, vitamins, weights, heights, others] = await Promise.all([
        supabase.from('feeds').select('id,date,time,amount,unit,method,side,duration_sec,milk_type,note').gte('date', from).lte('date', to).order('date').order('time'),
        supabase.from('diapers').select('id,date,time,pee,poop,note').gte('date', from).lte('date', to).order('date').order('time'),
        supabase.from('sleeps').select('id,date,start_time,end_time,note').gte('date', from).lte('date', to).order('date').order('start_time'),
        supabase.from('vitamins').select('id,date,time,name,dose,note').gte('date', from).lte('date', to).order('date').order('time'),
        supabase.from('weights').select('id,date,time,kg,note').gte('date', from).lte('date', to).order('date').order('time'),
        supabase.from('heights').select('id,date,time,cm,note').gte('date', from).lte('date', to).order('date').order('time'),
        supabase.from('others').select('id,date,time,note').gte('date', from).lte('date', to).order('date').order('time'),
      ])

      const items: EventItem[] = []

      // Feeds
      feeds.data?.forEach(f => {
        const t = formatTimeHHMM(f.time)
        const sub = f.method === 'bottle'
          ? `${f.amount ?? ''}${f.amount ? (f.unit || '') : ''} ${f.milk_type || 'bottle'}`
          : `breast ${f.side || ''}`
        items.push({
          id: f.id, kind:'feed', date:f.date, time:t,
          title: 'Feed', subtitle: sub.trim(), note: f.note || null,
          sortKey: `${f.date}T${t}`
        })
      })

      // Diapers
      diapers.data?.forEach(d => {
        const t = formatTimeHHMM(d.time)
        const sub = d.pee && d.poop ? 'pee + poop' : d.pee ? 'pee' : d.poop ? 'poop' : ''
        items.push({
          id: d.id, kind:'diaper', date:d.date, time:t,
          title:'Diaper', subtitle: sub, note:d.note || null,
          sortKey: `${d.date}T${t}`
        })
      })

      // Sleeps
      sleeps.data?.forEach(s => {
        const st = formatTimeHHMM(s.start_time)
        const en = formatTimeHHMM(s.end_time)
        items.push({
          id: s.id, kind:'sleep', date:s.date, time:st, endTime:en,
          title:'Sleep', subtitle:`${st}–${en}`, note:s.note || null,
          sortKey: `${s.date}T${st}`
        })
      })

      // Vitamins
      vitamins.data?.forEach(v => {
        const t = formatTimeHHMM(v.time)
        items.push({
          id: v.id, kind:'vitamin', date:v.date, time:t,
          title:'Vitamins', subtitle:[v.name, v.dose].filter(Boolean).join(' '),
          note:v.note || null, sortKey:`${v.date}T${t}`
        })
      })

      // Weights
      weights.data?.forEach(w => {
        const t = formatTimeHHMM(w.time)
        items.push({
          id: w.id, kind:'weight', date:w.date, time:t,
          title:'Weight', subtitle:`${w.kg} kg`, note:w.note || null,
          sortKey:`${w.date}T${t}`
        })
      })

      // Heights
      heights.data?.forEach(h => {
        const t = formatTimeHHMM(h.time)
        items.push({
          id: h.id, kind:'height', date:h.date, time:t,
          title:'Height', subtitle:`${h.cm} cm`, note:h.note || null,
          sortKey:`${h.date}T${t}`
        })
      })

      // Others
      others.data?.forEach(o => {
        const t = formatTimeHHMM(o.time)
        items.push({
          id: o.id, kind:'other', date:o.date, time:t,
          title:'Other', subtitle: (o.note || '').slice(0,60),
          note:o.note || null, sortKey:`${o.date}T${t}`
        })
      })

      // ordina crescente per data/ora
      items.sort((a,b)=> a.sortKey.localeCompare(b.sortKey))
      return items
    }
  })
}
