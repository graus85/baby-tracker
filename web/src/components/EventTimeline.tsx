import React, { useMemo } from 'react'
import { IconForKind } from './Icons'
import type { EventItem } from '../lib/events'

// --- helpers date ---
function parseISO(d: string) { return new Date(d + 'T00:00:00') }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function fmtDay(d: Date) {
  // dd/MM
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}`
}
function hoursFrac(hhmm: string) {
  // "HH:MM" -> float hours
  const m = hhmm.match(/^(\d{2}):(\d{2})/)
  if (!m) return 0
  return parseInt(m[1], 10) + parseInt(m[2], 10) / 60
}

type Props = {
  events: EventItem[]
  from: string // YYYY-MM-DD
  to: string   // YYYY-MM-DD
}

/**
 * Responsive SVG timeline: X=days, Y=hours (0..24)
 */
export default function EventTimeline({ events, from, to }: Props) {
  const DAYS = useMemo(() => {
    const a = parseISO(from)
    const b = parseISO(to)
    const out: Date[] = []
    for (let d = new Date(a); d <= b; d = addDays(d, 1)) out.push(new Date(d))
    return out
  }, [from, to])

  // layout
  const W = 900
  const H = 420
  const ML = 44, MR = 12, MT = 16, MB = 24
  const IW = W - ML - MR
  const IH = H - MT - MB

  const colW = IW / Math.max(1, DAYS.length)
  const yForHour = (h: number) => MT + IH - (h / 24) * IH
  const xForDayIdx = (i: number) => ML + i * colW + colW / 2

  return (
    <div className="card" style={{ padding: 0 }}>
      <svg className="timeline-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="events timeline">
        {/* bg */}
        <rect x="0" y="0" width={W} height={H} fill="var(--soft)" rx="12" />
        {/* grid hours every 2h */}
        {Array.from({ length: 13 }).map((_, i) => {
          const h = i * 2
          const y = yForHour(h)
          return (
            <g key={`h-${h}`} opacity={0.5}>
              <line x1={ML} y1={y} x2={W - MR} y2={y} stroke="var(--border)" />
              <text x={ML - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--muted)">{String(h).padStart(2, '0')}</text>
            </g>
          )
        })}

        {/* grid days */}
        {DAYS.map((d, i) => {
          const x = ML + i * colW
          return (
            <g key={`d-${i}`}>
              <line x1={x} y1={MT} x2={x} y2={H - MB} stroke="var(--border)" />
              <text x={x + colW / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--muted)">{fmtDay(d)}</text>
            </g>
          )
        })}
        {/* right border */}
        <line x1={W - MR} y1={MT} x2={W - MR} y2={H - MB} stroke="var(--border)" />

        {/* events */}
        {events.map((ev, idx) => {
          const dayIdx = DAYS.findIndex(d => d.toISOString().slice(0, 10) === ev.date)
          if (dayIdx < 0) return null
          const x = xForDayIdx(dayIdx)
          const y = yForHour(hoursFrac(ev.time))
          // sleep duration bar (if endTime same day)
          const hasSpan = ev.endTime && ev.endTime.length >= 4
          const yEnd = hasSpan ? yForHour(hoursFrac(ev.endTime!)) : null

          return (
            <g key={`${ev.kind}-${ev.id}-${idx}`}>
              {hasSpan && yEnd !== null && (
                <line x1={x - 18} x2={x + 18} y1={y} y2={yEnd}
                      stroke="var(--acc)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
              )}
              {/* marker */}
              <circle cx={x} cy={y} r={13} fill="var(--card)" stroke="var(--border)" />
              <g transform={`translate(${x - 10}, ${y - 10})`}>
                <IconForKind kind={ev.kind} width={20} height={20} />
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
