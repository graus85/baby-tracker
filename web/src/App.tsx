import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useEffect, useState } from 'react'
import { ThemeWatcher } from './store/theme'
import { useSelectedDate } from './store/ui'
import TabBar from './components/TabBar'

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
  }, [nav])

  return (
    <div className="app-shell">
      <ThemeWatcher />

      <main className="content container">
        <div className="heading">
          <h1>Baby Tracker</h1>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <small>{email}</small>
          </div>
        </div>

        <div className="card" style={{marginBottom:12}}>
          <label style={{display:'flex',gap:8,alignItems:'center'}}>
            <span>Day:</span>
            <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </label>
        </div>

        <Outlet />
      </main>

      {/* Footer con i 3 bottoni */}
      <TabBar />
    </div>
  )
}
