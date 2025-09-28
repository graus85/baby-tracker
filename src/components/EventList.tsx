import { supabase } from '../supabaseClient';
import { TYPE_META, flattenDayData, countsByType, NormalizedEvent } from '../utils/format';
import EventCard from './EventCard';
import type { DayData, FilterType } from '../types';

async function duplicate(ev: NormalizedEvent, date: string) {
  const table = TYPE_META[ev.type].table;

  // mappa i campi dalla view v_day_data alle colonne DB
  const r = ev.raw;
  const payload: any = { date };

  switch (ev.type) {
    case 'feed':
      Object.assign(payload, {
        time: r.time, method: r.method, amount: r.amount, unit: r.unit,
        side: r.side, duration_sec: r.durationSec, milk_type: r.milkType, note: r.note ?? null
      });
      break;
    case 'diaper':
      Object.assign(payload, { time: r.time, pee: r.pee, poop: r.poop, note: r.note ?? null });
      break;
    case 'sleep':
      Object.assign(payload, { start_time: r.start, end_time: r.end, note: r.note ?? null });
      break;
    case 'vitamin':
      Object.assign(payload, { time: r.time, name: r.name, dose: r.dose ?? null, note: r.note ?? null });
      break;
    case 'weight':
      Object.assign(payload, { time: r.time, kg: r.kg, note: r.note ?? null });
      break;
    case 'height':
      Object.assign(payload, { time: r.time, cm: r.cm, note: r.note ?? null });
      break;
    case 'other':
      Object.assign(payload, { time: r.time, note: r.note });
      break;
  }

  const { data: u } = await supabase.auth.getUser();
  if (!u?.user) throw new Error('Not authenticated');
  payload.user_id = u.user.id;

  const { error } = await supabase.from(table).insert(payload);
  if (error) throw error;
}

async function remove(ev: NormalizedEvent) {
  const table = TYPE_META[ev.type].table;
  const { error } = await supabase.from(table).delete().eq('id', ev.id);
  if (error) throw error;
}

export default function EventList({
  dayData, date, filter, onChanged
}: {
  dayData: DayData; date: string; filter: FilterType; onChanged: () => void;
}) {
  const all = flattenDayData(dayData);
  const items = filter === 'all' ? all : all.filter(e => e.type === filter);

  return (
    <div className="list">
      {items.length === 0 && <p className="small">No events yet. Tap “+” to add one.</p>}
      {items.map(ev => (
        <EventCard
          key={`${ev.type}:${ev.id}`}
          type={ev.type}
          title={ev.title}
          subtitle={ev.subtitle}
          time={ev.time}
          onEdit={undefined /* TODO: apri form in modalità edit */}
          onDuplicate={async ()=>{ try{ await duplicate(ev, date); onChanged(); } catch(e:any){ alert(e.message) } }}
          onDelete={async ()=>{ try{ await remove(ev); onChanged(); } catch(e:any){ alert(e.message) } }}
        />
      ))}
    </div>
  );
}

export { countsByType };
