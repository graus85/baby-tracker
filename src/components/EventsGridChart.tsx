import { useMemo } from 'react'
import type { DayData } from '../types'
import { hhmmFromPg } from '../utils/time'

type Row = { date: string; data: DayData }

/**
 * Grafico responsive: X = giorni, Y = ore (0–23).
 * Ad ogni incrocio giorno/ora mostra l'emoji dell'evento.
 * Per gli Sleep piazza l'emoji su tutte le ore coperte dall'intervallo.
 */
export default function EventsGridChart({ rows }: { rows: Row[] }) {
  const chart = useMemo(() => {
    const cols = rows.length
    const hours = Array.from({ length: 24 }, (_, i) => i)

    // dimensioni responsive: 80px per giorno, minimo 640
    const width = Math.max(640, Math.max(1, cols) * 80)
    const cellW = width / Math.max(1, cols)
    const cellH = 28
    const height = cellH * (hours.length + 1) // +1 riga per le etichette dei giorni

    const events: { x: number; y: number; emoji: string; key: string }[] = []

    function hourFrom(timeLike?: string) {
      const t = hhmmFromPg(timeLike)
      const h = parseInt(t.split(':')[0] || '0', 10)
      return Math.max(0, Math.min(23, isNaN(h) ? 0 : h))
    }

    rows.forEach((r, xi) => {
      const cx = xi * cellW + cellW / 2

      r.data.feeds.forEach((f: any) =>
        events.push({ x: cx, y: (hourFrom(f.time) + 1) * cellH, emoji: '🍼', key: `f-${f.id}` })
      )
      r.data.diapers.forEach((d: any) =>
        events.push({ x: cx, y: (hourFrom(d.time) + 1) * cellH, emoji: '👶', key: `d-${d.id}` })
      )
      r.data.vitamins.forEach((v: any) =>
        events.push({ x: cx, y: (hourFrom(v.time) + 1) * cellH, emoji: '💊', key: `v-${v.id}` })
      )
      r.data.weights.forEach((w: any) =>
        events.push({ x: cx, y: (hourFrom(w.time) + 1) * cellH, emoji: '⚖️', key: `w-${w.id}` })
      )
      r.data.heights.forEach((h: any) =>
        events.push({ x: cx, y: (hourFrom(h.time) + 1) * cellH, emoji: '🪜', key: `h-${h.id}` })
      )
      r.data.others.forEach((o: any) =>
        events.push({ x: cx, y: (hourFrom(o.time) + 1) * cellH, emoji: '📝', key: `o-${o.id}` })
      )
      r.data.sleeps.forEach((s: any) => {
        const hs = hourFrom(s.start)
        const he = Math.max(hs, hourFrom(s.end))
        for (let h = hs; h <= he; h++) {
          events.push({ x: cx, y: (h + 1) * cellH, emoji: '😴', key: `s-${s.id}-${h}` })
        }
      })
    })

    return { hours, width, height, cellW, cellH, events }
  }, [rows])

  const { hours, width, height, cellW, cellH, events } = chart

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <svg width={width} height={height} role="img" aria-label="Eventi per giorno e ora">
        {/* Etichette giorni (in alto) */}
        {rows.map((r, i) => (
          <text key={r.date} x={i * cellW + cellW / 2} y={cellH * 0.7} textAnchor="middle" fontSize="12">
            {r.date}
          </text>
        ))}

        {/* Linee orizzontali + etichette ore */}
        {hours.map((h) => {
          const y = (h + 1) * cellH
          return (
            <g key={h}>
              <line x1={0} x2={width} y1={y} y2={y} stroke="#30363d" strokeWidth={1} />
              <text x={4} y={y - 6} fontSize="10" fill="#8b949e">
                {String(h).padStart(2, '0')}:00
              </text>
            </g>
          )
        })}

        {/* Linee verticali per colonne giorno */}
        {rows.map((_, i) => {
          const x = i * cellW
          return <line key={`col-${i}`} x1={x} x2={x} y1={cellH} y2={height} stroke="#30363d" strokeWidth={1} />
        })}

        {/* Marker emoji */}
        {events.map((ev) => (
          <text key={ev.key} x={ev.x} y={ev.y - 4} textAnchor="middle" fontSize="14">
            {ev.emoji}
          </text>
        ))}
      </svg>
    </div>
  )
}
