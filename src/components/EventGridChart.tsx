// src/components/EventGridChart.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { TYPE_META, flattenDayData } from '../utils/format'
import type { DayData } from '../types'

type DayRow = { date: string; data: DayData }

const HOURS = Array.from({ length: 24 }, (_, i) => i)

function useContainerWidth() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [w, setW] = useState(720) // fallback
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => {
      const e = entries[0]
      if (e?.contentRect?.width) setW(e.contentRect.width)
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return { ref, width: w }
}

export default function EventGridChart({ rows }: { rows: DayRow[] }) {
  const days = rows.map(r => r.date)
  const { ref, width } = useContainerWidth()

  // dimensionamento "reale" in px, non scalato
  const padL = 56 // spazio per etichette ore
  const padT = 32
  const cellH = 22 // altezza riga (ore)
  // calcola larghezza cella in base allo spazio disponibile, con limiti
  const cellW = useMemo(() => {
    const maxW = Math.max(1, width - padL)
    const ideal = maxW / Math.max(1, days.length)
    return Math.max(56, Math.min(100, ideal)) // tra 56 e 100 px
  }, [width, days.length])

  const W = Math.round(padL + days.length * cellW)
  const H = Math.round(padT + 24 * cellH)

  // Mappa: "YYYY-MM-DD|H" -> array di emoji (uno o più eventi in quell'ora)
  const byCell: Record<string, string[]> = useMemo(() => {
    const map: Record<string, string[]> = {}
    rows.forEach(r => {
      const flat = flattenDayData(r.data)
      flat.forEach(ev => {
        const hour = parseInt(ev.time.slice(0, 2), 10) || 0
        const k = `${r.date}|${hour}`
        ;(map[k] ||= []).push(TYPE_META[ev.type].emoji)
      })
    })
    return map
  }, [rows])

  return (
    <div ref={ref} className="card" style={{ overflowX: 'auto' }}>
      <svg
        width={W}
        height={H}
        // niente viewBox: il testo resta in px e non viene “ingrandito”
        aria-label="Event grid"
      >
        {/* Colonne (giorni) */}
        {days.map((d, ix) => {
          const x = padL + ix * cellW
          return (
            <g key={d}>
              <line x1={x} y1={padT} x2={x} y2={H} stroke="#30363d" strokeWidth="1" />
              <text
                x={x + cellW / 2}
                y={16}
                textAnchor="middle"
                fontSize="12"
                fill="#8b949e"
              >
                {d}
              </text>
            </g>
          )
        })}
        {/* bordo destro */}
        <line
          x1={padL + days.length * cellW}
          y1={padT}
          x2={padL + days.length * cellW}
          y2={H}
          stroke="#30363d"
          strokeWidth="1"
        />

        {/* Righe (ore) */}
        {HOURS.map(h => {
          const y = padT + h * cellH
          return (
            <g key={h}>
              <line x1={padL} y1={y} x2={W} y2={y} stroke="#30363d" strokeWidth="1" />
              <text
                x={padL - 8}
                y={y + cellH / 2 + 4}
                textAnchor="end"
                fontSize="12"
                fill="#8b949e"
              >
                {String(h).padStart(2, '0')}:00
              </text>
            </g>
          )
        })}
        {/* bordo inferiore */}
        <line x1={padL} y1={H} x2={W} y2={H} stroke="#30363d" strokeWidth="1" />

        {/* Emoji (eventi) */}
        {rows.map((r, ix) => {
          const x0 = padL + ix * cellW
          return HOURS.flatMap(h => {
            const k = `${r.date}|${h}`
            const arr = byCell[k] || []
            return arr.map((emoji, j) => {
              const cx = x0 + cellW / 2
              // distribuisci più eventi nella stessa ora senza sovrapporli
              const offset = (j - (arr.length - 1) / 2) * 12
              const cy = padT + h * cellH + cellH / 2 + offset
              return (
                <text
                  key={`${k}-${j}`}
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize="14"   // ~ dimensione testo normale
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
