import { supabase } from './supabase'

export async function requireUserId(): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return data.user.id
}

/* ---- INSERT helpers (ritornano {id}) ---- */
export async function insertFeed(payload: {
  date: string
  time: string // HH:MM:SS±HH:MM
  method: 'breast' | 'bottle'
  amount?: number | null
  unit?: 'ml' | 'oz' | null
  duration_sec?: number | null
  milk_type?: string | null
  side?: 'left' | 'right' | null
  note?: string | null
}) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!
    .from('feeds')
    .insert([{ user_id, ...payload }])
    .select('id')
    .single()
  if (error) throw error
  return data
}

export async function insertWeight(payload: {
  date: string
  time: string
  kg: number
  note?: string | null
}) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!
    .from('weights').insert([{ user_id, ...payload }])
    .select('id').single()
  if (error) throw error
  return data
}

export async function insertHeight(payload: {
  date: string
  time: string
  cm: number
  note?: string | null
}) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!
    .from('heights').insert([{ user_id, ...payload }])
    .select('id').single()
  if (error) throw error
  return data
}

export async function insertDiaper(payload: {
  date: string
  time: string
  pee: boolean
  poop: boolean
  note?: string | null
}) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!
    .from('diapers').insert([{ user_id, ...payload }])
    .select('id').single()
  if (error) throw error
  return data
}

export async function insertVitamin(payload: {
  date: string
  time: string
  name: string
  dose?: string | null
  note?: string | null
}) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!
    .from('vitamins').insert([{ user_id, ...payload }])
    .select('id').single()
  if (error) throw error
  return data
}

export async function insertSleep(payload: {
  date: string
  start_time: string
  end_time: string
  note?: string | null
}) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!
    .from('sleeps').insert([{ user_id, ...payload }])
    .select('id').single()
  if (error) throw error
  return data
}

export async function insertOther(payload: {
  date: string
  time: string
  note: string
}) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!
    .from('others').insert([{ user_id, ...payload }])
    .select('id').single()
  if (error) throw error
  return data
}
