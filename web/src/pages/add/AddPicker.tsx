import { Link } from 'react-router-dom'

const items = [
  { to: '/add/feed', label: 'Pasto' },
  { to: '/add/diaper', label: 'Pannolino' },
  { to: '/add/sleep', label: 'Sonno' },
  { to: '/add/vitamin', label: 'Vitamine' },
  { to: '/add/weight', label: 'Peso' },
  { to: '/add/height', label: 'Altezza' },
  { to: '/add/other', label: 'Altro' },
]

export default function AddPicker(){
  return (
    <div className="content">
      <div className="card" style={{maxWidth:520, margin:'16px auto'}}>
        <h2>Registra evento</h2>
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
