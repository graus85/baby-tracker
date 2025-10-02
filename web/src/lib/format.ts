export function formatTimeHHMM(pgTime: string | null | undefined): string {
  if (!pgTime) return ''
  // accetta "HH:MM:SS", "HH:MM", "HH:MM:SS+02:00"
  const m = pgTime.match(/^(\d{2}):(\d{2})/)
  return m ? `${m[1]}:${m[2]}` : String(pgTime)
}

export function truncate(s: string | null | undefined, n = 80): string {
  if (!s) return ''
  return s.length <= n ? s : s.slice(0, n - 1) + '…'
}
