import { hhmmFromPg } from './time';
import type { DayData, FilterType } from '../types';

export const TYPE_META: Record<Exclude<FilterType,'all'>, {label:string; emoji:string; table:string}> = {
  feed:   { label: 'Feed',   emoji:'🍼', table:'feeds'   },
  diaper: { label: 'Diaper', emoji:'👶', table:'diapers' },
  sleep:  { label: 'Sleep',  emoji:'😴', table:'sleeps'  },
  vitamin:{ label: 'Vitamin',emoji:'💊', table:'vitamins'},
  weight: { label: 'Weight', emoji:'⚖️', table:'weights' },
  height: { label: 'Height', emoji:'🪜', table:'heights' },
  other:  { label: 'Other',  emoji:'📝', table:'others'  },
};

export type NormalizedEvent = {
  id: string;
  type: Exclude<FilterType,'all'>;
  title: string;
  subtitle?: string;
  time: string;        // "HH:MM"
  sortKey: string;     // per ordinamento
  raw: any;            // dato originale della view
};

// crea una lista piatta di eventi normalizzati per la UI
export function flattenDayData(day: DayData): NormalizedEvent[] {
  const out: NormalizedEvent[] = [];

  day.feeds.forEach((f: any) => {
    const time = hhmmFromPg(f.time);
    const isBottle = f.method === 'bottle';
    const sub = isBottle
      ? `${(f.amount ?? 0)}${f.unit ?? 'ml'} ${f.milkType ?? ''}`.trim()
      : `${f.side ?? ''} ${f.durationSec ? Math.round(f.durationSec/60)+'m' : ''}`.trim();
    out.push({
      id: f.id, type: 'feed', title: 'Feed', subtitle: sub || f.note,
      time, sortKey: `A${time}`, raw: f
    });
  });

  day.diapers.forEach((d: any) => {
    const time = hhmmFromPg(d.time);
    const sub = `${d.pee ? 'pee' : ''}${d.pee && d.poop ? ' + ' : ''}${d.poop ? 'poop' : ''}` || d.note;
    out.push({ id:d.id, type:'diaper', title:'Diaper', subtitle: sub, time, sortKey:`B${time}`, raw:d });
  });

  day.sleeps.forEach((s: any) => {
    const start = hhmmFromPg(s.start);
    const end = hhmmFromPg(s.end);
    out.push({ id:s.id, type:'sleep', title:'Sleep', subtitle:`${start}–${end}`+(s.note?` · ${s.note}`:''), time:start, sortKey:`C${start}`, raw:s });
  });

  day.vitamins.forEach((v: any) => {
    const time = hhmmFromPg(v.time);
    const sub = `${v.name}${v.dose ? ' · '+v.dose : ''}` || v.note;
    out.push({ id:v.id, type:'vitamin', title:'Vitamin', subtitle: sub, time, sortKey:`D${time}`, raw:v });
  });

  day.weights.forEach((w: any) => {
    const time = hhmmFromPg(w.time);
    out.push({ id:w.id, type:'weight', title:'Weight', subtitle:`${w.kg} kg`+(w.note?` · ${w.note}`:''), time, sortKey:`E${time}`, raw:w });
  });

  day.heights.forEach((h: any) => {
    const time = hhmmFromPg(h.time);
    out.push({ id:h.id, type:'height', title:'Height', subtitle:`${h.cm} cm`+(h.note?` · ${h.note}`:''), time, sortKey:`F${time}`, raw:h });
  });

  day.others.forEach((o: any) => {
    const time = hhmmFromPg(o.time);
    out.push({ id:o.id, type:'other', title:'Other', subtitle:o.note, time, sortKey:`G${time}`, raw:o });
  });

  return out.sort((a,b)=> a.sortKey.localeCompare(b.sortKey));
}

export function countsByType(day: DayData){
  return {
    feed: day.feeds.length,
    diaper: day.diapers.length,
    sleep: day.sleeps.length,
    vitamin: day.vitamins.length,
    weight: day.weights.length,
    height: day.heights.length,
    other: day.others.length
  };
}
