import { Link, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useEffect, useState } from 'react'
import { Calendar, LogOut } from 'lucide-react'
import { useSelectedDate } from './store/ui'

export default function App(){
  const nav = useNavigate()
  const [email, setEmail] = useState<string | null>(null)
  const { date, setDate } = useSelectedDate()

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
  }, [])

  return (
    <div className="container">
      <div className="heading">
        <h1>Baby Tracker</h1>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <small>{email}</small>
          <button onClick={()=>supabase.auth.signOut()} title="Logout">
            <LogOut size={16}/> Logout
          </button>
        </div>
      </div>
      <div className="nav">
        <Link to="/">Diario</Link>
        <Link to="/summary">Riepilogo</Link>
      </div>
      <div className="card" style={{marginBottom:12}}>
        <label style={{display:'flex',gap:8,alignItems:'center'}}>
          <Calendar size={16}/> Giorno:&nbsp;
          <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </label>
      </div>
      <Outlet />
    </div>
  )
}
