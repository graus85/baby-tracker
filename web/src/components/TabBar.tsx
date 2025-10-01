import { NavLink } from 'react-router-dom'

export default function TabBar() {
  const items = [
    { to: '/summary', label: 'Summary', icon: ChartIcon },
    { to: '/', label: 'Daily Log', icon: ClipboardIcon, end: true },
    { to: '/more', label: 'More', icon: GearIcon },
  ] as const

  return (
    <nav className="tabbar" aria-label="Bottom navigation">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end as boolean | undefined}
          className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}
        >
          <Icon />
          <span className="tab-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

/* ---- Minimal SVG icons (no deps) ---- */
function ChartIcon() {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24"
      aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"
    >
      <path d="M4 20V10M10 20V4M16 20v-6M3 20h18"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ClipboardIcon() {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24"
      aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"
    >
      <rect x="7" y="4" width="10" height="16" rx="2"
        fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 4.5h6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 4.5z"
        fill="currentColor" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24"
      aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"
    >
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
        fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M19 12a7 7 0 0 0 .07-.95l1.76-1.37-1.6-2.77-2.08.66a7.1 7.1 0 0 0-1.64-.95l-.3-2.17h-3.2l-.3 2.17c-.58.23-1.13.54-1.64.95l-2.08-.66-1.6 2.77 1.76 1.37c-.05.31-.07.63-.07.95s.02.64.07.95l-1.76 1.37 1.6 2.77 2.08-.66c.5.41 1.06.73 1.64.95l.3 2.17h3.2l.3-2.17c.58-.23 1.13-.54 1.64-.95l2.08.66 1.6-2.77-1.76-1.37c.05-.31.07-.63.07-.95z"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
