// src/components/EventGridChart.tsx
import { TYPE_META, flattenDayData } from '../utils/format'
import type { DayData } from '../types'

type DayRow = { date: string; data: DayData }

const HRS = Array.from({ length: 24 }, (_, i) => i)

/**
 * Grafico responsive: asse X = giorni selezionati, asse Y = ore (0-23).
 * In ogni incrocio mostra l'emoji del tipo evento che è avvenuto in quell'ora.
 * Se più eventi cadono nella stessa ora/giorno, vengono “spalmati” verticalmente.
 */
export default function EventGridChart({ rows }: { rows: DayRow[] }) {
  const days = rows.map(r => r.date)

  // Mappa: key "day|hour" -> array di emoji
  const byCell: Record<string, string[]> = {}
  rows.forEach((r) => {
    const flat = flattenDayData(r.data)
    flat.forEach((ev) => {
      const hour = parseInt(ev.time.slice(0, 2), 10) || 0
      const k = `${r.date}|${hour}`
      ;(byCell[k] ||= []).push(TYPE_META[ev.type].emoji)
    })
  })

  // dimensioni "logiche" (verranno scalate via viewBox per essere responsive)
  const cellW = 84
  const cellH = 28
  const padL = 44      // spazio a sinistra per le etichette ore
  const padT = 24
  const W = padL + days.length * cellW
  const H = padT + 24 * cellH

  return (
    <div className="card" style={{ overflow: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={Math.min(H, 560)}>
        {/* sfondo */}
        <rect x={0} y={0} width={W} height={H} fill="transparent" />

        {/* colonne: giorni (intestazioni) */}
        {days.map((d, ix) => {
          const x = padL + ix * cellW
          return (
            <g key={d}>
              {/* linea colonna */}
              <line x1={x} y1={padT} x2={x} y2={H} stroke="#30363d" strokeWidth="1" />
              {/* label giorno */}
              <text x={x + cellW / 2} y={18} textAnchor="middle" fontSize="12" fill="#8b949e">
                {d}
              </text>
            </g>
          )
        })}
        {/* ultima linea destra */}
        <line x1={padL + days.length * cellW} y1={padT} x2={padL + days.length * cellW} y2={H} stroke="#30363d" strokeWidth="1" />

        {/* righe: ore */}
        {HRS.map((h) => {
          const y = padT + h * cellH
          return (
            <g key={h}>
              <line x1={padL} y1={y} x2={W} y2={y} stroke="#30363d" strokeWidth="1" />
              <text x={padL - 6} y={y + cellH / 2 + 4} textAnchor="end" fontSize="12" fill="#8b949e">
                {String(h).padStart(2,'0')}:00
              </text>
            </g>
          )
        })}
        {/* ultima linea in basso */}
        <line x1={padL} y1={padT + 24 * cellH} x2={W} y2={padT + 24 * cellH} stroke="#30363d" strokeWidth="1" />

        {/* punti (emoji) */}
        {rows.map((r, ix) => {
          const x0 = padL + ix * cellW
          return HRS.flatMap((h) => {
            const k = `${r.date}|${h}`
            const arr = byCell[k] || []
            // distribuzione verticale dentro la cella se più eventi
            return arr.map((emoji, j) => {
              const cx = x0 + cellW / 2
              // per più eventi, sposta un po' verso l'alto/basso
              const offset = (j - (arr.length - 1) / 2) * 14
              const cy = padT + h * cellH + cellH / 2 + offset
              return (
                <text
                  key={`${k}-${j}`}
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize="16"
                >
                  {emoji}
                </text>
              )
            })
          })
        })}
      </svg>
    </div>
  )
}
