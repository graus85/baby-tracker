import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { nowHHMM, toPgTimeWithTz } from '../../utils/time';
import VoiceInput from '../VoiceInput';
import type { FeedMethod, FeedSide, FeedUnit } from '../../types';

export default function FeedForm({ date, onSaved }: { date: string; onSaved: () => void }) {
  const [method, setMethod] = useState<FeedMethod>('bottle');
  const [time, setTime] = useState(nowHHMM());
  const [amount, setAmount] = useState<number>(120);
  const [unit, setUnit] = useState<FeedUnit>('ml');
  const [milkType, setMilkType] = useState<'formula'|'breastmilk'>('formula');
  const [side, setSide] = useState<FeedSide>('left');
  const [duration, setDuration] = useState<number>(600);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  async function save() {
    setError(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) { setError('Non sei autenticato.'); return; }
    setLoading(true);
    const payload: any = {
      user_id: u.user.id, date,
      time: toPgTimeWithTz(time),
      method, note: note || null
    };
    if (method === 'bottle') {
      payload.amount = amount; payload.unit = unit; payload.milk_type = milkType;
    } else {
      payload.side = side; payload.duration_sec = duration;
    }
    const { error } = await supabase.from('feeds').insert(payload);
    setLoading(false);
    if (error) setError(error.message); else onSaved();
  }

  return (
    <div className="card">
      <h3>Feed</h3>
      <div className="row">
        <select value={method} onChange={e=>setMethod(e.target.value as FeedMethod)}>
          <option value="bottle">Bottle</option>
          <option value="breast">Breast</option>
        </select>
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} />
      </div>

      {method === 'bottle' ? (
        <div className="row" style={{marginTop:8}}>
          <input type="number" min={10} step={10} value={amount} onChange={e=>setAmount(Number(e.target.value))} placeholder="amount" />
          <select value={unit} onChange={e=>setUnit(e.target.value as FeedUnit)}>
            <option value="ml">ml</option><option value="oz">oz</option>
          </select>
          <select value={milkType} onChange={e=>setMilkType(e.target.value as any)}>
            <option value="formula">formula</option><option value="breastmilk">breastmilk</option>
          </select>
        </div>
      ) : (
        <div className="row" style={{marginTop:8}}>
          <select value={side} onChange={e=>setSide(e.target.value as FeedSide)}>
            <option value="left">left</option><option value="right">right</option>
          </select>
          <input type="number" min={60} step={30} value={duration} onChange={e=>setDuration(Number(e.target.value))} placeholder="duration sec" />
        </div>
      )}

      <div style={{marginTop:8}}>
        <VoiceInput value={note} onChange={setNote} placeholder="note (tap 🎤 e parla)" multiline />
      </div>

      {error && <p className="error">{error}</p>}
      <div className="row" style={{marginTop:8}}>
        <button onClick={save} disabled={loading}>Salva</button>
      </div>
    </div>
  );
}
