/**
 * Converte "HH:MM" in "HH:MM:00+00" (compatibile con Postgres time with time zone).
 * Se riceve già un valore con secondi e/o offset (es. "08:30:00+02"), lo lascia così.
 */
export function toPgTimeWithTz(hhmm: string): string {
  if (!hhmm) return '00:00:00+00';
  // già in formato con offset (es. "08:30:00+00" o "08:30:00+02")
  if (hhmm.includes('+')) return hhmm;

  // accetta anche "HH:MM:SS"
  const parts = hhmm.split(':');
  const h = (parts[0] ?? '00').padStart(2, '0');
  const m = (parts[1] ?? '00').padStart(2, '0');
  const s = parts[2] ? parts[2].padStart(2, '0') : '00';
  return `${h}:${m}:${s}+00`;
}

/** Ritorna la data di oggi in "YYYY-MM-DD". */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Ritorna l'ora locale corrente in "HH:MM". */
export function nowHHMM(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Normalizza un valore orario proveniente dal DB/view a "HH:MM".
 * Accetta "HH:MM:SS+ZZ", "HH:MM:SS" o "HH:MM".
 */
export function hhmmFromPg(timeLike?: string): string {
  if (!timeLike) return '00:00';
  const t = timeLike.split('+')[0] ?? timeLike; // rimuove l'offset se presente
  const [h = '00', m = '00'] = t.split(':');
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
}
