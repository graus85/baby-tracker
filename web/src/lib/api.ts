import { supabase } from './supabase'

export async function requireUserId(): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return data.user.id
}

/* ------------------------------------------
 * INSERT
 * ----------------------------------------*/
export async function insertFeed(payload: {
  date: string; time: string; method: 'breast' | 'bottle';
  amount?: number | null; unit?: 'ml'|'oz'|null; duration_sec?: number | null;
  milk_type?: string | null; side?: 'left'|'right'|null; note?: string | null
}) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!.from('feeds')
    .insert([{ user_id, ...payload }]).select('id').single()
  if (error) throw error
  return data
}

export async function insertWeight(payload: { date: string; time: string; kg: number; note?: string|null }) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!.from('weights')
    .insert([{ user_id, ...payload }]).select('id').single()
  if (error) throw error
  return data
}
export async function insertHeight(payload: { date: string; time: string; cm: number; note?: string|null }) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!.from('heights')
    .insert([{ user_id, ...payload }]).select('id').single()
  if (error) throw error
  return data
}
export async function insertDiaper(payload: { date: string; time: string; pee: boolean; poop: boolean; note?: string|null }) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!.from('diapers')
    .insert([{ user_id, ...payload }]).select('id').single()
  if (error) throw error
  return data
}
export async function insertVitamin(payload: { date: string; time: string; name: string; dose?: string|null; note?: string|null }) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!.from('vitamins')
    .insert([{ user_id, ...payload }]).select('id').single()
  if (error) throw error
  return data
}
export async function insertSleep(payload: { date: string; start_time: string; end_time: string; note?: string|null }) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!.from('sleeps')
    .insert([{ user_id, ...payload }]).select('id').single()
  if (error) throw error
  return data
}
export async function insertOther(payload: { date: string; time: string; note: string }) {
  const user_id = await requireUserId()
  const { data, error } = await supabase!.from('others')
    .insert([{ user_id, ...payload }]).select('id').single()
  if (error) throw error
  return data
}

/* ------------------------------------------
 * READ BY ID (per Edit / Duplicate)
 * ----------------------------------------*/
export async function getById(table: string, id: string) {
  const { data, error } = await supabase!.from(table).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

/* ------------------------------------------
 * UPDATE
 * ----------------------------------------*/
export async function updateFeed(id: string, patch: Partial<{
  date: string; time: string; method: 'breast'|'bottle';
  amount: number|null; unit: 'ml'|'oz'|null; duration_sec: number|null;
  milk_type: string|null; side: 'left'|'right'|null; note: string|null
}>) {
  const { error } = await supabase!.from('feeds').update(patch).eq('id', id)
  if (error) throw error
}

export async function updateWeight(id: string, patch: Partial<{ date:string; time:string; kg:number; note:string|null }>) {
  const { error } = await supabase!.from('weights').update(patch).eq('id', id)
  if (error) throw error
}
export async function updateHeight(id: string, patch: Partial<{ date:string; time:string; cm:number; note:string|null }>) {
  const { error } = await supabase!.from('heights').update(patch).eq('id', id)
  if (error) throw error
}
export async function updateDiaper(id: string, patch: Partial<{ date:string; time:string; pee:boolean; poop:boolean; note:string|null }>) {
  const { error } = await supabase!.from('diapers').update(patch).eq('id', id)
  if (error) throw error
}
export async function updateVitamin(id: string, patch: Partial<{ date:string; time:string; name:string; dose:string|null; note:string|null }>) {
  const { error } = await supabase!.from('vitamins').update(patch).eq('id', id)
  if (error) throw error
}
export async function updateSleep(id: string, patch: Partial<{ date:string; start_time:string; end_time:string; note:string|null }>) {
  const { error } = await supabase!.from('sleeps').update(patch).eq('id', id)
  if (error) throw error
}
export async function updateOther(id: string, patch: Partial<{ date:string; time:string; note:string }>) {
  const { error } = await supabase!.from('others').update(patch).eq('id', id)
  if (error) throw error
}

/* ------------------------------------------
 * DELETE
 * ----------------------------------------*/
export async function deleteByKind(kind:
  'feed'|'diaper'|'sleep'|'vitamin'|'weight'|'height'|'other', id: string) {
  const table = kind + (kind === 'weight' || kind === 'height' ? 's' : kind === 'other' ? 's' : 's') // plural
  const { error } = await supabase!.from(table).delete().eq('id', id)
  if (error) throw error
}

/* ------------------------------------------
 * DUPLICATE (copia stessa riga con nuova id)
 * ----------------------------------------*/
export async function duplicateByKind(kind:
  'feed'|'diaper'|'sleep'|'vitamin'|'weight'|'height'|'other', id: string) {

  const table = kind + (kind === 'weight' || kind === 'height' ? 's' : kind === 'other' ? 's' : 's')

  const row = await getById(table, id)
  if (!row) throw new Error('Not found')

  delete row.id
  // user_id viene forzato dall'utente corrente
  const user_id = await requireUserId()
  const { data, error } = await supabase!.from(table)
    .insert([{ ...row, user_id }]).select('id').single()
  if (error) throw error
  return data
}
