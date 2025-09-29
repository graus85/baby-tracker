import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Range = { from: string; to: string };
type Counts = { feeds: number; diapers: number; sleeps: number; vitamins: number; weights: number; heights: number; others: number; };

async function countRows(table: string, uid: string, range: Range) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', uid)
    .gte('date', range.from)
    .lte('date', range.to);
  if (error) throw error;
  return count ?? 0;
}

export default function Summary() {
  const today = new Date().toISOString().slice(0,10);
  const weekAgo = new Date(Date.now() - 6*24*3600*1000).toISOString().slice(0,10);

  const [range, setRange] = useState<Range>({ from: weekAgo, to: today });
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true); setError(null);
    const { data: u, error: uErr } = await supabase.auth.getUser();
    if (uErr) { setError(uErr.message); setLoading(false); return; }
    const uid = u?.user?.id; if (!uid) { setError('Non autenticato.'); setLoading(false); return; }

    try {
      const [feeds, diapers, sleeps, vitamins, weights, heights, others] = await Promise.all([
        countRows('feeds', uid, range),
        countRows('diapers', uid, range),
        countRows('sleeps', uid, range),
        countRows('vitamins', uid, range),
        countRows('weights', uid, range),
        countRows('heights', uid, range),
        countRows('others', uid, range),
      ]);
      setCounts({ feeds, diapers, sleeps, vitamins, weights, heights, others });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [range.from, range.to]);

  return (
    <div className="card">
      <h2>Summary</h2>

      <div className="row">
        <label>From <input type="date" value={range.from} onChange={e => setRange(r => ({...r, from: e.target.value}))} /></label>
        <label>To <input type="date" value={range.to} onChange={e => setRange(r => ({...r, to: e.target.value}))} /></label>
        <button onClick={load}>Aggiorna</button>
      </div>

      {loading && <p>Caricamento…</p>}
      {error && <p className="error">{error}</p>}

      {counts && (
        <ul className="grid-2">
          <li>🍼 Feeds: <b>{counts.feeds}</b></li>
          <li>👶 Diapers: <b>{counts.diapers}</b></li>
          <li>😴 Sleeps: <b>{counts.sleeps}</b></li>
          <li>💊 Vitamins: <b>{counts.vitamins}</b></li>
          <li>⚖️ Weights: <b>{counts.weights}</b></li>
          <li>🪜 Heights: <b>{counts.heights}</b></li>
          <li>📝 Others: <b>{counts.others}</b></li>
        </ul>
      )}
    </div>
  );
}
