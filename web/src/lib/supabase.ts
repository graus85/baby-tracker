import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL ?? ''
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

/** true se le env sono presenti; la UI le userà per mostrare un messaggio chiaro se mancano */
export const SUPABASE_READY = Boolean(url && anon)

/** Client Supabase: creato solo quando le env ci sono, altrimenti è null */
export const supabase: SupabaseClient | null = SUPABASE_READY
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

if (!SUPABASE_READY) {
  // log utile in console senza bloccare il render
  // (evitiamo di lanciare eccezioni qui!)
  // eslint-disable-next-line no-console
  console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.')
}
