import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { nowHHMM, toPgTimeWithTz } from '../../utils/time';
import VoiceInput from '../VoiceInput';

export default function SleepForm({ date, onSaved }: { date: string; onSaved: () => void }) {
  const [start, setStart] = useState(nowHHMM());
  const [end, setEnd] = useState(nowHHMM());
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function save() {
    setError(null);
    if (end <= start) { setError('Fine deve essere dopo Inizio.'); return; }
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) { setError('Non sei autenticato.'); return; }
    setLoading(true);
    const { error } = await supabase.from('sleeps').insert({
      user_id: u.user.id, date,
      start_time: toPgTimeWithTz(start), end_time: toPgTimeWithTz(end),
      note: note || null
    });
    setLoading(false);
    if (error) setError(error.message); else onSaved();
  }

  return (
    <div className="card">
      <h3>Sleep</h3>
      <div className="row">
        <input type="time" value={start} onChange={e=>setStart(e.target.value)} />
        <input type="time" value={end}   onChange={e=>setEnd(e.target.value)} />
      </div>
      <div style={{marginTop:8}}>
        <VoiceInput value={note} onChange={setNote} placeholder="note" multiline />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="row" style={{marginTop:8}}>
        <button onClick={save} disabled={loading}>Salva</button>
      </div>
    </div>
  );
}
