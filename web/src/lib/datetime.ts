export function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function nowTimeLocal(): string {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

/** postgres TIME WITH TIME ZONE -> 'HH:MM:SS±HH:MM' dal locale */
export function toPgTimeWithTZ(hms: string): string {
  const [hh, mm, ss = '00'] = hms.split(':')
  const offMin = new Date().getTimezoneOffset() // minuti rispetto a UTC
  const sign = offMin > 0 ? '-' : '+'
  const abs = Math.abs(offMin)
  const oh = String(Math.floor(abs / 60)).padStart(2, '0')
  const om = String(abs % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}${sign}${oh}:${om}`
}
