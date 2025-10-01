import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../store/theme'
import { useTranslation } from 'react-i18next'

type Mode = 'system' | 'dark' | 'light'
const THEME_OPTIONS: { value: Mode; labelKey: string }[] = [
  { value: 'system', labelKey: 'more.system' },
  { value: 'dark',   labelKey: 'more.dark' },
  { value: 'light',  labelKey: 'more.light' },
]

const LANG_OPTIONS = [
  { value: 'en', labelKey: 'lang.en' },
  { value: 'it', labelKey: 'lang.it' },
  { value: 'fr', labelKey: 'lang.fr' },
  { value: 'es', labelKey: 'lang.es' },
] as const

export default function More(){
  const { mode, setMode, resolved } = useTheme()
  const { t, i18n } = useTranslation()

  const onTheme = useCallback((m: Mode) => setMode(m), [setMode])
  const onLang = useCallback(async (lng: string) => {
    await i18n.changeLanguage(lng)
    // il detector salva già su localStorage
  }, [i18n])

  const themeSubtitle =
    mode === 'system'
      ? `${t('more.current')}: ${t('more.system')} → ${resolved}`
      : `${t('more.current')}: ${t(mode === 'dark' ? 'more.dark' : 'more.light')}`

  return (
    <div style={{display:'grid', gap:16}}>
      {/* APP */}
      <section>
        <h2 className="section-title">{t('more.app')}</h2>

        {/* Appearance */}
        <div className="card" style={{marginBottom:12}}>
          <div className="list-item header">
            <div>
              <div className="item-title">{t('more.appearance')}</div>
              <div className="item-subtitle">{themeSubtitle}</div>
            </div>
          </div>
          <div className="list" role="radiogroup" aria-label={t('more.appearance')}>
            {THEME_OPTIONS.map((opt) => {
              const selected = mode === opt.value
              return (
                <button
                  key={opt.value}
                  className="list-item"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onTheme(opt.value)}
                >
                  <span>{t(opt.labelKey)}</span>
                  <span aria-hidden="true" style={{ fontWeight: 700 }}>{selected ? '✓' : ''}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Language */}
        <div className="card">
          <div className="list-item header">
            <div>
              <div className="item-title">{t('more.language')}</div>
              <div className="item-subtitle">{t('more.current')}: {t(`lang.${i18n.language as 'en'|'it'|'fr'|'es'}`)}</div>
            </div>
          </div>
          <div className="list" role="radiogroup" aria-label={t('more.language')}>
            {LANG_OPTIONS.map((opt) => {
              const selected = i18n.language.startsWith(opt.value)
              return (
                <button
                  key={opt.value}
                  className="list-item"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onLang(opt.value)}
                >
                  <span>{t(opt.labelKey)}</span>
                  <span aria-hidden="true" style={{ fontWeight: 700 }}>{selected ? '✓' : ''}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ACCOUNT */}
      <section>
        <h2 className="section-title">{t('more.account')}</h2>
        <div className="card">
          <button
            className="btn-danger"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
          >
            {t('auth.logout')}
          </button>
        </div>
      </section>
    </div>
  )
}
