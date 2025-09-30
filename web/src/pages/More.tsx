import { useTheme } from '../store/theme'
import { Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const appearanceOptions = [
  { value: 'system', label: 'System' },
  { value: 'dark',   label: 'Dark' },
  { value: 'light',  label: 'Light' },
] as const

export default function More(){
  const { mode, setMode, resolved } = useTheme()

  return (
    <div style={{display:'grid', gap:16}}>
      <section>
        <h2 className="section-title">APP</h2>
        <div className="card">
          <div className="list-item header">
            <div>
              <div className="item-title">Appearance</div>
              <div className="item-subtitle">
                {mode === 'system' ? `Current: System → ${resolved}` : `Current: ${mode === 'dark' ? 'Dark' : 'Light'}`}
              </div>
            </div>
          </div>
          <div className="list">
            {appearanceOptions.map(opt => (
              <button
                key={opt.value}
                className="list-item"
                onClick={()=>setMode(opt.value)}
                aria-pressed={mode===opt.value}
              >
                <span>{opt.label}</span>
                {mode===opt.value ? <Check size={18} aria-label="selected" /> : <span className="chevron" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">ACCOUNT</h2>
        <div className="card">
          <button className="btn-danger" onClick={()=>supabase.auth.signOut()}>
            Logout
          </button>
        </div>
      </section>
    </div>
  )
}
