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
