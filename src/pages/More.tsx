import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../store/theme'

type Mode = 'system' | 'dark' | 'light'

const OPTIONS: { value: Mode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
]

export default function More() {
  const { mode, setMode, resolved } = useTheme()

  const onSelect = useCallback((m: Mode) => setMode(m), [setMode])

  const subtitle =
    mode === 'system'
      ? `Current: System → ${resolved}`
      : `Current: ${mode === 'dark' ? 'Dark' : 'Light'}`

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* APP */}
      <section>
        <h2 className="section-title">APP</h2>
        <div className="card">
          <div className="list-item header">
            <div>
              <div className="item-title">Appearance</div>
              <div className="item-subtitle">{subtitle}</div>
            </div>
          </div>

          <div className="list" role="radiogroup" aria-label="Appearance mode">
            {OPTIONS.map((opt) => {
              const selected = mode === opt.value
              return (
                <button
                  key={opt.value}
                  className="list-item"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelect(opt.value)}
                >
                  <span>{opt.label}</span>
                  <span aria-hidden="true" style={{ fontWeight: 700 }}>
                    {selected ? '✓' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ACCOUNT */}
      <section>
        <h2 className="section-title">ACCOUNT</h2>
        <div className="card">
          <button
            className="btn-danger"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
          >
            Logout
          </button>
        </div>
      </section>
    </div>
  )
}
