import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AddEventModal from './AddEventModal';
import FAB from './ui/FAB';
import FilterChips from './FilterChips';
import EventList, { countsByType } from './EventList';
import type { DayData, FilterType } from '../types';

const EMPTY_DAY: DayData = {
  feeds: [], diapers: [], sleeps: [], vitamins: [], weights: [], heights: [], others: []
};

export default function DailyLog() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  async function load() {
    setLoading(true);
    setError(null);

    const { data: u, error: uErr } = await supabase.auth.getUser();
    if (uErr) { setLoading(false); setError(uErr.message); return; }
    const uid = u?.user?.id;
    if (!uid) { setLoading(false); setError('Non autenticato.'); return; }

    // RICHIESTA PER-UTENTE: anche se la view è già sicura, filtriamo esplicitamente
    const { data: rows, error } = await supabase
      .from('v_day_data')
      .select('data')
      .eq('user_id', uid)
      .eq('date', date)
      .limit(1);

    setLoading(false);
    if (error) { setError(error.message); return; }

    const row = (rows ?? [])[0] as { data: DayData } | undefined;
    setData(row?.data ?? EMPTY_DAY);
  }

  function prevDay() { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d.toISOString().slice(0, 10)); }
  function nextDay() { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d.toISOString().slice(0, 10)); }

  useEffect(() => { load(); }, [date]);

  const counts = countsByType(data ?? EMPTY_DAY);

  return (
    <div className="card">
      <h2>Daily Log</h2>

      <div className="row">
        <button onClick={prevDay}>←</button>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={nextDay}>→</button>
        <button onClick={load}>Ricarica</button>
      </div>

      <FilterChips value={filter} counts={counts} onChange={setFilter} />

      {loading && <p>Caricamento…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && data && (
        <>
          <div className="hr" />
          <EventList dayData={data} date={date} filter={filter} onChanged={load} />
        </>
      )}

      <FAB onClick={() => setOpen(true)} />
      <AddEventModal open={open} onClose={() => setOpen(false)} date={date} onSaved={load} />
    </div>
  );
}
