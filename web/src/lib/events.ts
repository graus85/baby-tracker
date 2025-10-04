import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export type Kind = 'feed' | 'diaper' | 'sleep' | 'vitamin' | 'weight' | 'height' | 'other'

export type EventItem = {
  id: string
  kind: Kind
  date: string              // YYYY-MM-DD
  time?: string             // HH:MM[:SS...]
  start?: string            // HH:MM start (sleep)
  endTime?: string          // HH:MM end (sleep)
  note?: string
  // optional fields used in subtitles / duplication
  method?: 'breast' | 'bottle'
  amount?: number
  unit?: 'ml'|'oz'
  side?: 'left'|'right'
  milk_type?: string
  pee?: boolean
  poop?: boolean
  name?: string
  kg?: number
  cm?: number
}

const TABLE_BY_KIND: Record<Kind, string> = {
  feed: 'feeds',
  diaper: 'diapers',
  sleep: 'sleeps',
  vitamin: 'vitamins',
  weight: 'weights',
  height: 'heights',
  other: 'others'
}

function sortByDateTime(a: EventItem, b: EventItem) {
  const da = a.date.localeCompare(b.date)
  if (da !== 0) return da
  const ta = (a.kind === 'sleep' ? (a.start ?? a.time ?? '') : (a.time ?? ''))
  const tb = (b.kind === 'sleep' ? (b.start ?? b.time ?? '') : (b.time ?? ''))
  return ta.localeCompare(tb)
}

async function mapRange<T extends { [k: string]: any }>(table: string, select: string, from: string, to: string) {
  return supabase.from(table).select(select)
    .gte('date', from).lte('date', to)
    .order('date', { ascending: true })
}

/** Carica eventi da tutte le tabelle nell’intervallo [from, to] */
export async function fetchEventsRange(from: string, to: string): Promise<EventItem[]> {
  const [
    feeds, diapers, sleeps, vitamins, weights, heights, others
  ] = await Promise.all([
    mapRange('feeds', '*', from, to),
    mapRange('diapers', '*', from, to),
    mapRange('sleeps', '*', from, to),
    mapRange('vitamins', '*', from, to),
    mapRange('weights', '*', from, to),
    mapRange('heights', '*', from, to),
    mapRange('others', '*', from, to)
  ])

  if (feeds.error) throw feeds.error
  if (diapers.error) throw diapers.error
  if (sleeps.error) throw sleeps.error
  if (vitamins.error) throw vitamins.error
  if (weights.error) throw weights.error
  if (heights.error) throw heights.error
  if (others.error) throw others.error

  const list: EventItem[] = []

  ;(feeds.data ?? []).forEach((r: any) => list.push({
    id: r.id, kind: 'feed', date: r.date, time: r.time,
    amount: r.amount ?? undefined, unit: r.unit ?? undefined,
    method: r.method ?? undefined, side: r.side ?? undefined,
    milk_type: r.milk_type ?? undefined, note: r.note ?? undefined
  }))

  ;(diapers.data ?? []).forEach((r: any) => list.push({
    id: r.id, kind: 'diaper', date: r.date, time: r.time,
    pee: !!r.pee, poop: !!r.poop, note: r.note ?? undefined
  }))

  ;(sleeps.data ?? []).forEach((r: any) => list.push({
    id: r.id, kind: 'sleep', date: r.date,
    start: r.start_time ?? undefined, endTime: r.end_time ?? undefined,
    note: r.note ?? undefined
  }))

  ;(vitamins.data ?? []).forEach((r: any) => list.push({
    id: r.id, kind: 'vitamin', date: r.date, time: r.time, name: r.name ?? undefined, note: r.note ?? undefined
  }))

  ;(weights.data ?? []).forEach((r: any) => list.push({
    id: r.id, kind: 'weight', date: r.date, time: r.time, kg: r.kg ?? undefined, note: r.note ?? undefined
  }))

  ;(heights.data ?? []).forEach((r: any) => list.push({
    id: r.id, kind: 'height', date: r.date, time: r.time, cm: r.cm ?? undefined, note: r.note ?? undefined
  }))

  ;(others.data ?? []).forEach((r: any) => list.push({
    id: r.id, kind: 'other', date: r.date, time: r.time, note: r.note ?? undefined
  }))

  list.sort(sortByDateTime)
  return list
}

/** Hook con refreshKey per ricaricare dopo operazioni CRUD */
export function useEventsRange(args: { from: string, to: string, refreshKey?: number }) {
  const { from, to, refreshKey = 0 } = args
  const [data, setData] = useState<EventItem[] | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null)
    fetchEventsRange(from, to)
      .then(d => { if (!cancelled) setData(d) })
      .catch(e => { if (!cancelled) setError(e) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [from, to, refreshKey])

  return { data, isLoading, error }
}

/** Delete */
export async function deleteEvent(ev: EventItem) {
  const table = TABLE_BY_KIND[ev.kind]
  const { error } = await supabase.from(table).delete().eq('id', ev.id)
  if (error) throw error
}

/** Duplicate (copia negli stessi campi, nuova riga con user_id) */
export async function duplicateEvent(ev: EventItem) {
  const { data: userRes } = await supabase.auth.getUser()
  const user_id = userRes?.user?.id
  if (!user_id) throw new Error('Not authenticated')

  const table = TABLE_BY_KIND[ev.kind]
  let payload: any = { user_id, date: ev.date, note: ev.note }

  switch (ev.kind) {
    case 'sleep':
      payload.start_time = ev.start ?? ev.time
      payload.end_time = ev.endTime ?? null
      break
    case 'feed':
      payload.time = ev.time ?? null
      payload.amount = ev.amount ?? null
      payload.unit = ev.unit ?? null
      payload.method = ev.method ?? null
      payload.side = ev.side ?? null
      payload.milk_type = ev.milk_type ?? null
      break
    case 'diaper':
      payload.time = ev.time ?? null
      payload.pee = !!ev.pee
      payload.poop = !!ev.poop
      break
    case 'vitamin':
      payload.time = ev.time ?? null
      payload.name = ev.name ?? null
      break
    case 'weight':
      payload.time = ev.time ?? null
      payload.kg = ev.kg ?? null
      break
    case 'height':
      payload.time = ev.time ?? null
      payload.cm = ev.cm ?? null
      break
    default:
      payload.time = ev.time ?? null
  }

  const { error } = await supabase.from(table).insert(payload)
  if (error) throw error
}

/** Update (modifica data/ora/note; per sleep start/end) */
export async function updateEvent(ev: EventItem, patch: { date: string, time?: string, start?: string, endTime?: string, note?: string }) {
  const table = TABLE_BY_KIND[ev.kind]
  const base: any = { date: patch.date, note: patch.note ?? null }

  if (ev.kind === 'sleep') {
    base.start_time = patch.start ?? null
    base.end_time = patch.endTime ?? null
  } else {
    base.time = patch.time ?? null
  }

  const { error } = await supabase.from(table).update(base).eq('id', ev.id)
  if (error) throw error
}
