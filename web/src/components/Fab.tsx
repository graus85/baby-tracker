import { Link } from 'react-router-dom'

export default function Fab() {
  return (
    <Link to="/add" className="fab" aria-label="Add">
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </Link>
  )
}
