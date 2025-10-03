import React, { useMemo } from 'react'
import { IconForKind } from './Icons'
import type { EventItem } from '../lib/events'

// --- helpers date ---
function parseISO(d: string) { return new Date(d + 'T00:00:00') }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function fmtDay(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}`
}
function hoursFrac(hhmm: string) {
  const m = hhmm?.match?.(/^(\d{2}):(\d{2})/)
  if (!m) return 0
  return parseInt(m[1], 10) + parseInt(m[2], 10) / 60
}

type Props = {
  events: EventItem[]
  from: string // YYYY-MM-DD
  to: string   // YYYY-MM-DD
}

/**
 * Responsive SVG timeline: X=days, Y=hours (0..24).
 * Marker size e posizioni sono clamped per non essere tagliati ai bordi.
 */
export default function EventTimeline({ events, from, to }: Props) {
  const DAYS = useMemo(() => {
    const a = parseISO(from)
    const b = parseISO(to)
    const out: Date[] = []
    for (let d = new Date(a); d <= b; d = addDays(d, 1)) out.push(new Date(d))
    return out
  }, [from, to])

  // layout base
  const W = 900
  const H = 420
  const ML = 44
  const MR = 28 // più spazio a destra per non tagliare i marker
  const MT = 16
  const MB = 26
  const IW = W - ML - MR
  const IH = H - MT - MB

  // helpers
  const colW = IW / Math.max(1, DAYS.length)
  const yForHour = (h: number) => MT + IH - (h / 24) * IH
  const xForDayIdx = (i: number) => ML + i * colW + colW / 2

  // marker size adattivo (min 14 / max 20) proporzionale alla colonna
  const iconSize = Math.max(14, Math.min(20, colW * 0.35))
  const circleR = Math.round(iconSize / 2) + 3
  const clampX = (x: number) =>
    Math.max(ML + circleR + 2, Math.min(W - MR - circleR - 2, x))

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
            <g key={`h-${h}`} opacity={0.55}>
              <line x1={ML} y1={y} x2={W - MR} y2={y} stroke="var(--border)" />
              <text x={ML - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--muted)">{String(h).padStart(2, '0')}</text>
            </g>
          )
        })}

        {/* grid days */}
        {DAYS.map((d, i) => {
          const x = ML + i * colW
          return (
            <g key={`d-${i}`} opacity={0.55}>
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
          const xRaw = xForDayIdx(dayIdx)
          const x = clampX(xRaw)
          const y = yForHour(hoursFrac(ev.time))
          const hasSpan = ev.endTime && ev.endTime.length >= 4
          const yEnd = hasSpan ? yForHour(hoursFrac(ev.endTime!)) : null

          return (
            <g key={`${ev.kind}-${ev.id}-${idx}`} pointerEvents="none">
              {hasSpan && yEnd !== null && (
                <line
                  x1={x - circleR + 2}
                  x2={x + circleR - 2}
                  y1={y}
                  y2={yEnd}
                  stroke="var(--acc)"
                  strokeOpacity="0.35"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              {/* marker */}
              <circle
                cx={x}
                cy={y}
                r={circleR}
                fill="var(--card)"
                stroke="var(--border)"
                strokeOpacity="0.9"
              />
              <g transform={`translate(${x - iconSize / 2}, ${y - iconSize / 2})`}>
                <IconForKind kind={ev.kind} width={iconSize} height={iconSize} />
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
