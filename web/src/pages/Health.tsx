import { useEffect, useState } from 'react'
import { supabase, SUPABASE_READY } from '../lib/supabase'
import { useTheme } from '../store/theme'
import { useTranslation } from 'react-i18next'

type PingResult = { ok: boolean; status?: number; error?: string }

export default function Health() {
  const { mode, resolved } = useTheme()
  const { i18n } = useTranslation()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [ping, setPing] = useState<PingResult | null>(null)

  useEffect(() => {
    ;(async () => {
      if (supabase) {
        // Sessione attuale (se loggato mostro email)
        const { data: { session } } = await supabase.auth.getSession()
        setUserEmail(session?.user?.email ?? null)

        // Ping al DB: select HEAD su "feeds" (con RLS torna 200 se loggato, 401 se no)
        try {
          const { error, status } = await supabase
            .from('feeds')
            .select('*', { head: true, count: 'exact' })
          setPing({ ok: !error, status, error: error?.message })
        } catch (e: any) {
          setPing({ ok: false, error: String(e) })
        }
      }
    })()
  }, [])

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined
  const version = (import.meta as any).env?.VITE_APP_VERSION ?? 'dev'
  const projectRef = envUrl?.match(/^https?:\/\/([^.]+)\.supabase\.co/i)?.[1]

  const mask = (s?: string, head = 6, tail = 4) => {
    if (!s) return ''
    if (s.length <= head + tail) return s.replace(/.(?=.{2})/g, '*')
    return s.slice(0, head) + '…' + s.slice(-tail)
  }

  const clearLocal = () => {
    try {
      localStorage.removeItem('bt.themeMode')
      localStorage.removeItem('bt.ui.selectedDate')
      localStorage.removeItem('i18nextLng')
      alert('Local storage cleared for app keys. Reloading…')
      location.reload()
    } catch { /* no-op */ }
  }

  return (
    <div className="content">
      <div className="card" style={{maxWidth:900, margin:'24px auto'}}>
        <h2>Health Check</h2>
        <p style={{color:'var(--muted)'}}>Quick diagnostics of config & runtime.</p>

        <dl style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:'8px 16px', marginTop:12}}>
          <dt><b>App version</b></dt><dd>{String(version)}</dd>
          <dt><b>Origin</b></dt><dd>{window.location.origin}</dd>
          <dt><b>Language</b></dt><dd>{i18n.language}</dd>
          <dt><b>Theme</b></dt><dd>{mode} → {resolved}</dd>

          <dt><b>Supabase ready</b></dt><dd>{String(SUPABASE_READY)}</dd>
          <dt><b>Project ref</b></dt><dd>{projectRef ?? '—'}</dd>
          <dt><b>VITE_SUPABASE_URL</b></dt><dd>{envUrl ? mask(envUrl, 12, 12) : 'MISSING'}</dd>
          <dt><b>VITE_SUPABASE_ANON_KEY</b></dt><dd>{envKey ? mask(envKey) : 'MISSING'}</dd>

          <dt><b>Auth user</b></dt><dd>{userEmail ?? 'not signed in'}</dd>
          <dt><b>DB ping (feeds)</b></dt>
          <dd>
            {ping
              ? (ping.ok
                  ? `OK (status ${ping.status ?? 200})`
                  : `ERROR${ping.status ? ' '+ping.status : ''}: ${ping.error}`)
              : 'pending…'}
          </dd>
        </dl>

        <div style={{display:'flex', gap:8, marginTop:16, flexWrap:'wrap'}}>
          <a className="tab" href="/" style={{textDecoration:'none'}}>Home</a>
          <a className="tab" href="/summary" style={{textDecoration:'none'}}>Summary</a>
          <a className="tab" href="/more" style={{textDecoration:'none'}}>More</a>
          <a className="tab" href="/login" style={{textDecoration:'none'}}>Login</a>
          <button className="btn-danger" onClick={clearLocal}>Clear local data & reload</button>
        </div>
      </div>
    </div>
  )
}
