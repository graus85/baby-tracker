import { Outlet, useNavigate } from 'react-router-dom'
import { supabase, SUPABASE_READY } from './lib/supabase'
import { useEffect, useState } from 'react'
import { ThemeWatcher } from './store/theme'
import TabBar from './components/TabBar'
import Fab from './components/Fab'
import AddPicker from './pages/add/AddPicker'
import { useTranslation } from 'react-i18next'


function ConfigError() {
  return (
    <div className="content">
      <div className="card" style={{maxWidth:640, margin:'48px auto'}}>
        <h2>Configuration required</h2>
        <p>Missing <code>VITE_SUPABASE_URL</code> or <code>VITE_SUPABASE_ANON_KEY</code>.</p>
      </div>
    </div>
  )
}

export default function App(){
  const nav = useNavigate()
  const [email, setEmail] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!SUPABASE_READY || !supabase) return
    supabase.auth.getUser().then(({data}) => {
      if(!data.user){ nav('/login'); return }
      setEmail(data.user.email ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if(!session) nav('/login')
      setEmail(session?.user?.email ?? null)
    })
    return () => { sub?.subscription?.unsubscribe?.() }
  }, [nav])

  if (!SUPABASE_READY) {
    return (
      <div className="app-shell">
        <ThemeWatcher />
        <ConfigError />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <ThemeWatcher />

      <main className="content">
        <div className="heading">
          <h1>{t('app.title')}</h1>
          <small>{email}</small>
        </div>

        <Outlet />
      </main>

     /* <Fab /> */
      <TabBar />
    </div>
  )
}
