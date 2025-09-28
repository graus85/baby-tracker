import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function signUp() {
    setLoading(true); setMessage(null); setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else {
      setMessage('Registrazione completata. Ora effettua il login.')
    }
  }

  async function signIn() {
    setLoading(true); setMessage(null); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else onAuth()
  }

  return (
    <div className="card">
      <h2>Accedi / Registrati</h2>
      <div className="row">
        <input placeholder="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div className="row" style={{marginTop:8}}>
        <button onClick={signIn} disabled={loading}>Entra</button>
        <button onClick={signUp} disabled={loading}>Registrati</button>
      </div>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p className="small">Suggerimento: abilita "Email / Password" nelle impostazioni Auth di Supabase.</p>
    </div>
  )
}
