export function toPgTimeWithTz(hhmm: string): string {
  if (!hhmm) return '00:00:00+00';
  if (hhmm.includes('+') && hhmm.split(':').length >= 2) return hhmm;
  const [h='00', m='00'] = hhmm.split(':');
  return `${h.padStart(2,'0')}:${m.padStart(2,'0')}:00+00`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0,10);
}

export function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
// "08:30" -> "08:30:00+00"; se è già "HH:MM:SS+00" lo lascia così.
export function toPgTimeWithTz(hhmm: string): string {
  if (!hhmm) return '00:00:00+00';
  if (hhmm.includes('+')) return hhmm;
  const [h='00', m='00'] = hhmm.split(':');
  return `${h.padStart(2,'0')}:${m.padStart(2,'0')}:00+00`;
}

// "08:30:00+00" | "08:30:00" | "08:30" -> "08:30"
export function hhmmFromPg(timeLike?: string): string {
  if (!timeLike) return '00:00';
  const t = timeLike.split('+')[0] ?? timeLike;
  const [h='00', m='00'] = t.split(':');
  return `${h.padStart(2,'0')}:${m.padStart(2,'0')}`;
}
