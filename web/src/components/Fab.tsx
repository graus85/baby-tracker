import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Fab() {
  const { t } = useTranslation()
  return (
    <Link to="/add" className="fab" aria-label={t('actions.add')}>
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </Link>
  )
}
