import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import DailyLog from './components/DailyLog'
import FooterTabs, { TabKey } from './components/FooterTabs'
import Summary from './pages/Summary'
import More from './pages/More'

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false)

  // 👇 Impostiamo "summary" come tab iniziale (home)
  const [tab, setTab] = useState<TabKey>('summary')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    // opzionale: torna alla home (summary) dopo il logout
    setTab('summary')
  }

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <h1>👶 Baby Tracker</h1>
      {isAuthed ? (
        <>
          {tab === 'summary' && <Summary />}
          {tab === 'daily' && <DailyLog />}
          {tab === 'more' && (
            <>
              <div className="row"><button onClick={signOut}>Esci</button></div>
              <More />
            </>
          )}
          <FooterTabs tab={tab} onChange={setTab} />
        </>
      ) : (
        <Login onAuth={() => setIsAuthed(true)} />
      )}
    </div>
  )
}
