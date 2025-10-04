import React from 'react'
import { useLocation } from 'react-router-dom'

type Props = {
  onClick: () => void
  /** route(s) dove mostrare il FAB; default: /daily e /daily-log  */
  onlyOn = ['/daily', '/daily-log']
}

export default function Fab({ onClick, onlyOn = ['/daily', '/daily-log'] }: Props) {
  const { pathname } = useLocation()
  const show = onlyOn.some(p => pathname === p || pathname.startsWith(p))
  if (!show) return null

  return (
    <button
      onClick={onClick}
      aria-label="Add"
      style={{
        position: 'fixed',
        right: `calc(16px + env(safe-area-inset-right))`,
        bottom: `calc(90px + env(safe-area-inset-bottom))`,
        width: 64,
        height: 64,
        borderRadius: 32,
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        boxShadow: '0 10px 24px rgba(0,0,0,.35)',
        fontSize: 28,
        lineHeight: '0',
        zIndex: 40
      }}
    >
      +
    </button>
  )
}
