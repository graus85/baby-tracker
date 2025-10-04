import React, { useMemo, useState } from 'react'
import { IconForKind } from './Icons'
import type { EventItem } from '../lib/events'
import { useTranslation } from 'react-i18next'

// ---- date helpers -----------------------------------------------------------
function parseISO(d: string) { return new Date(d + 'T00:00:00') }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function fmtDay(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}`
}
function dayKeyLocal(d: Date) { // YYYY-MM-DD in locale (no UTC)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}
function hoursFrac(hhmm: string) {
  // accetta "HH:MM" o "HH:MM:SS+TZ"
  const m = hhmm?.match?.(/^(\d{2}):(\d{2})/)
  if (!m) return 0
  return parseInt(m[1], 10) + parseInt(m[2], 10) / 60
}
function trunc(s?: string, n=32){ if(!s) return ''; return s.length>n ? s.slice(0,n-1)+'…' : s }

// -----------------------------------------------------------------------------
type Props = {
  events: EventItem[]
  from: string // YYYY-MM-DD
  to: string   // YYYY-MM-DD
}

type Tip = {
  x: number
  y: number
  title: string
  time: string
  note?: string
} | null

/**
 * SVG timeline: X = giorni, Y = ore (0..24)
 * - icone adattive (piccole) con clamp ai bordi
 * - tooltip (tap/click) con ora e note
 */
export default function EventTimeline({ events, from, to }: Props) {
  const { t } = useTranslation()
  const DAYS = useMemo(() => {
    const a = parseISO(from)
    const b = parseISO(to)
    const out: Date[] = []
    for (let d = new Date(a); d <= b; d = addDays(d, 1)) out.push(new Date(d))
    return out
  }, [from, to])

  // layout
  const W = 900, H = 420
  const ML = 44, MR = 40, MT = 16, MB = 26
  const IW = W - ML - MR
  const IH = H - MT - MB

  const colW = IW / Math.max(1, DAYS.length)
  const yForHour = (h: number) => MT + IH - (h / 24) * IH
  const xForDayIdx = (i: number) => ML + i * colW + colW / 2

  // marker dimensioni (ridotte)
  const iconSize = Math.max(8, Math.min(14, colW * 0.24))
  const circleR = Math.round(iconSize / 2) + 2
  const clampX = (x: number) => Math.max(ML + circleR + 2, Math.min(W - MR - circleR - 2, x))

  // tooltip
  const [tip, setTip] = useState<Tip>(null)
  const hideTip = () => setTip(null)

  // posizionamento tooltip dentro i bordi
  function tipBox(x: number, y: number){
    const BOX_W = 180, BOX_H = 64, PAD = 8
    let tx = x + circleR + 8
    let ty = y - BOX_H - 8
    if (tx + BOX_W > W - MR) tx = x - BOX_W - circleR - 8
    if (ty < MT + 4) ty = y + circleR + 8
    return { tx, ty, w: BOX_W, h: BOX_H, pad: PAD }
  }

  return (
    <div className="card" style={{ padding: 0 }}>
      <svg className="timeline-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="events timeline">
        {/* bg */}
        <rect x="0" y="0" width={W} height={H} fill="var(--soft)" rx="12" />
        {/* grid ore (ogni 2h) */}
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

        {/* grid giorni */}
        {DAYS.map((d, i) => {
          const x = ML + i * colW
          return (
            <g key={`d-${i}`} opacity={0.55}>
              <line x1={x} y1={MT} x2={x} y2={H - MB} stroke="var(--border)" />
              <text x={x + colW / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--muted)">{fmtDay(d)}</text>
            </g>
          )
        })}
        {/* bordo destro */}
        <line x1={W - MR} y1={MT} x2={W - MR} y2={H - MB} stroke="var(--border)" />

        {/* eventi */}
        {events.map((ev, idx) => {
          const dayIdx = DAYS.findIndex(d => dayKeyLocal(d) === ev.date) // confronto locale (NO UTC)
          if (dayIdx < 0) return null
          const x = clampX(xForDayIdx(dayIdx))
          const y = yForHour(hoursFrac(ev.time))
          const hasSpan = ev.endTime && ev.endTime.length >= 4
          const yEnd = hasSpan ? yForHour(hoursFrac(ev.endTime!)) : null

          const title = t(`kinds.${ev.kind}`)
          const when = hasSpan ? `${ev.time} – ${ev.endTime}` : ev.time

          const onShow = () => setTip({ x, y, title, time: when, note: ev.note })

          return (
            <g key={`${ev.kind}-${ev.id}-${idx}`} onMouseEnter={onShow} onMouseLeave={hideTip} onClick={onShow} style={{ cursor: 'pointer' }}>
              {hasSpan && yEnd !== null && (
                <line
                  x1={x - circleR + 1}
                  x2={x + circleR - 1}
                  y1={y}
                  y2={yEnd}
                  stroke="var(--acc)"
                  strokeOpacity="0.35"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              {/* marker */}
              <circle cx={x} cy={y} r={circleR} fill="var(--card)" stroke="var(--border)" strokeOpacity="0.9" />
              <g transform={`translate(${x - iconSize / 2}, ${y - iconSize / 2})`}>
                <IconForKind kind={ev.kind} width={iconSize} height={iconSize} />
              </g>
            </g>
          )
        })}

        {/* Tooltip */}
        {tip && (() => {
          const { tx, ty, w, h, pad } = tipBox(tip.x, tip.y)
          return (
            <g key="tip">
              <rect x={tx} y={ty} width={w} height={h} rx="8" fill="var(--card)" stroke="var(--border)" />
              <text x={tx + pad} y={ty + 18} fill="var(--fg)" fontSize="12" fontWeight={600}>{tip.title}</text>
              <text x={tx + pad} y={ty + 36} fill="var(--muted)" fontSize="11">{tip.time}</text>
              {tip.note && <text x={tx + pad} y={ty + 52} fill="var(--muted)" fontSize="11">{trunc(tip.note, 40)}</text>}
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

