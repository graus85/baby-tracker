import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import DailyLog from './components/DailyLog'
import FooterTabs, { TabKey } from './components/FooterTabs'
import Summary from './pages/Summary'
import More from './pages/More'

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [tab, setTab] = useState<TabKey>('daily')

  useEffect(()=>{
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session)=>{ setIsAuthed(!!session) })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  async function signOut() { await supabase.auth.signOut() }

  return (
    <div className="container" style={{paddingBottom:80}}>
      <h1>👶 Baby Tracker</h1>
      {isAuthed ? (
        <>
          {tab === 'daily' && <DailyLog />}
          {tab === 'summary' && <Summary />}
          {tab === 'more' && (
            <>
              <div className="row"><button onClick={signOut}>Esci</button></div>
              <More />
            </>
          )}
          <FooterTabs tab={tab} onChange={setTab} />
        </>
      ) : (
        <Login onAuth={()=>setIsAuthed(true)} />
      )}
    </div>
  )
}
