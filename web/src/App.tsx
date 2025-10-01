import { Link, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useEffect, useState } from 'react'
// Se hai questo store nel progetto, lascialo.
// Altrimenti puoi togliere le prossime 5 righe e usare un semplice state locale per la data.
let useSelectedDate: undefined | (() => { date: string; setDate: (v: string) => void })
try { /* opzionale: evita crash se lo store non esiste */
  // @ts-ignore
  useSelectedDate = require('./store/ui').useSelectedDate
} catch {}

import { ThemeWatcher } from './store/theme'

export default function App(){
  const nav = useNavigate()
  const [email, setEmail] = useState<string | null>(null)

  // usa lo store se presente, altrimenti fallback locale
  const [localDate, setLocalDate] = useState<string>(() => {
    const d = new Date()
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const dd = String(d.getDate()).padStart(2,'0')
    return `${d.getFullYear()}-${mm}-${dd}`
  })
  const dateState = useSelectedDate ? useSelectedDate() : { date: localDate, setDate: setLocalDate }

  useEffect(() => {
    supabase.auth.getUser().then(({data}) => {
      if(!data.user){ nav('/login'); return }
      setEmail(data.user.email ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if(!session) nav('/login')
      setEmail(session?.user?.email ?? null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [nav])

  return (
    <div className="container">
      <ThemeWatcher />

      <div className="heading">
        <h1>Baby Tracker</h1>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <small>{email}</small>
        </div>
      </div>

      {/* La tua tab bar può restare; l'importante è che il tab “More” punti a /more */}
      <div className="nav">
        <Link to="/">Daily Log</Link>
        <Link to="/summary">Summary</Link>
        <Link to="/more">More</Link>
      </div>

      <div className="card" style={{marginBottom:12}}>
        <label style={{display:'flex',gap:8,alignItems:'center'}}>
          <span>Day:</span>
          <input
            className="input"
            type="date"
            value={dateState.date}
            onChange={e=>dateState.setDate(e.target.value)}
          />
        </label>
      </div>

      <Outlet />
    </div>
  )
}
