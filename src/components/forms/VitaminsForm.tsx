import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { nowHHMM, toPgTimeWithTz } from '../../utils/time';
import VoiceInput from '../VoiceInput';

export default function VitaminsForm({ date, onSaved }: { date: string; onSaved: () => void }) {
  const [time, setTime] = useState(nowHHMM());
  const [name, setName] = useState('Vitamin D');
  const [dose, setDose] = useState('400 IU');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function save() {
    setError(null);
    if (!name.trim()) { setError('Nome vitamina obbligatorio.'); return; }
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) { setError('Non sei autenticato.'); return; }
    setLoading(true);
    const { error } = await supabase.from('vitamins').insert({
      user_id: u.user.id, date,
      time: toPgTimeWithTz(time), name, dose: dose || null, note: note || null
    });
    setLoading(false);
    if (error) setError(error.message); else onSaved();
  }

  return (
    <div className="card">
      <h3>Vitamin</h3>
      <div className="row">
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="name" />
        <input value={dose} onChange={e=>setDose(e.target.value)} placeholder="dose (es. 400 IU)" />
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
