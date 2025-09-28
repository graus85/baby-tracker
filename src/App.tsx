import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import DailyLog from './components/DailyLog'

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthed(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="container">
      <h1>👶 Baby Tracker</h1>
      {isAuthed ? (
        <>
          <div className="row">
            <button onClick={signOut}>Esci</button>
          </div>
          <DailyLog />
        </>
      ) : (
        <Login onAuth={() => setIsAuthed(true)} />
      )}
    </div>
  )
}
