import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { nowHHMM, toPgTimeWithTz } from '../../utils/time';
import VoiceInput from '../VoiceInput';

export default function HeightForm({ date, onSaved }: { date: string; onSaved: () => void }) {
  const [time, setTime] = useState(nowHHMM());
  const [cm, setCm] = useState<number>(55.0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function save() {
    setError(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) { setError('Non sei autenticato.'); return; }
    setLoading(true);
    const { error } = await supabase.from('heights').insert({
      user_id: u.user.id, date, time: toPgTimeWithTz(time), cm, note: note || null
    });
    setLoading(false);
    if (error) setError(error.message); else onSaved();
  }

  return (
    <div className="card">
      <h3>Height</h3>
      <div className="row">
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
        <input type="number" step="0.1" value={cm} onChange={e=>setCm(Number(e.target.value))} placeholder="cm" />
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
