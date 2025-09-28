import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [msg, setMsg] = useState<string>('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    try{
      if(mode==='signup'){
        const { error } = await supabase.auth.signUp({ email, password })
        if(error) throw error
        setMsg('Registrazione effettuata. Controlla la mail per la conferma.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if(error) throw error
        setMsg('Login ok, reindirizzo...')
        window.location.href = '/'
      }
    }catch(err:any){
      setMsg(err.message || 'Errore')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'48px auto'}}>
        <h2>{mode==='signin' ? 'Accedi' : 'Registrati'}</h2>
        <form onSubmit={submit} className="row">
          <input className="input" type="email" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit">{mode==='signin' ? 'Accedi' : 'Crea account'}</button>
        </form>
        <p style={{marginTop:12}}>
          {mode==='signin' ? 'Non hai un account?' : 'Hai già un account?'}&nbsp;
          <a href="#" onClick={(e)=>{e.preventDefault(); setMode(mode==='signin'?'signup':'signin')}}>
            {mode==='signin' ? 'Registrati' : 'Accedi'}
          </a>
        </p>
        {msg && <p><small>{msg}</small></p>}
      </div>
    </div>
  )
}
