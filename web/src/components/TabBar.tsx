import { NavLink } from 'react-router-dom'

export default function TabBar() {
  const items = [
    { to: '/summary', label: 'Summary', icon: ChartIcon },
    { to: '/',        label: 'Daily Log', icon: ClipboardIcon, end: true },
    { to: '/more',    label: 'More',      icon: GearIcon },
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
          <span className="tab-icon" aria-hidden="true">
            <Icon />
          </span>
          <span className="tab-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

/* ---- SVG icons con width/height fissati (no dipendenze) ---- */
function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20V10M10 20V4M16 20v-6M3 20h18"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="4" width="10" height="16" rx="2"
            stroke="currentColor" strokeWidth="2"/>
      <path d="M9 4.5h6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 4.5z"
            fill="currentColor"/>
    </svg>
  )
}
function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15.5a3.5 3.5 0 1 0 
