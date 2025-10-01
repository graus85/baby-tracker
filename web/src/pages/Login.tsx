import { useState } from 'react'
import { supabase, SUPABASE_READY } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!SUPABASE_READY || !supabase) {
    return (
      <div className="card" style={{maxWidth:420, margin:'48px auto'}}>
        <h2>Configuration required</h2>
        <p>
          Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> on Vercel,
          then redeploy.
        </p>
      </div>
    )
  }

  async function onSignup() {
    setLoading(true); setMsg(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
    setLoading(false)
    if (error) { setMsg(error.message); return }
    setMsg('Check your inbox and confirm your email to complete signup.')
  }

  async function onSignin() {
    setLoading(true); setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setMsg(error.message); return }
    window.location.href = '/'
  }

  async function onResend() {
    setLoading(true); setMsg(null)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
    setLoading(false)
    if (error) { setMsg(error.message); return }
    setMsg('Confirmation email re-sent. Check your inbox.')
  }

  return (
    <div className="card" style={{maxWidth:420, margin:'48px auto'}}>
      <h2>{mode === 'signin' ? 'Sign in' : 'Create account'}</h2>
      <div className="row" style={{display:'grid', gap:8}}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {mode === 'signup' ? (
          <>
            <button disabled={loading} onClick={onSignup}>Sign up</button>
            <button disabled={loading || !email} onClick={onResend}>Resend confirmation</button>
          </>
        ) : (
          <button disabled={loading} onClick={onSignin}>Sign in</button>
        )}
        <button onClick={()=>setMode(mode==='signin'?'signup':'signin')} style={{background:'transparent', border:'1px dashed var(--border)'}}>
          {mode==='signin' ? 'Need an account? Sign up' : 'Back to sign in'}
        </button>
      </div>
      {msg && <p style={{marginTop:12, color:'var(--muted)'}}>{msg}</p>}
    </div>
  )
}
