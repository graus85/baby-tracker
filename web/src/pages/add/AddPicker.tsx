import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AddPicker(){
  const { t } = useTranslation()
  const items = [
    { to: '/add/feed',   label: t('add.feed') },
    { to: '/add/diaper', label: t('add.diaper') },
    { to: '/add/sleep',  label: t('add.sleep') },
    { to: '/add/vitamin',label: t('add.vitamin') },
    { to: '/add/weight', label: t('add.weight') },
    { to: '/add/height', label: t('add.height') },
    { to: '/add/other',  label: t('add.other') },
  ]

  return (
    <div className="content">
      <div className="card" style={{maxWidth:520, margin:'16px auto'}}>
        <h2>{t('add.title')}</h2>
        <div style={{display:'grid', gap:8, marginTop:12}}>
          {items.map(i=>(
            <Link key={i.to} to={i.to} className="tab" style={{textDecoration:'none', textAlign:'center'}}>
              {i.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
