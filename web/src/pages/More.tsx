import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { supabase } from '../lib/supabase'
import JSZip from 'jszip'

type ThemeMode = 'system' | 'dark' | 'light'
const THEME_KEY = 'bt_theme'
const LANG_KEY  = 'bt_lang'

const TABLES = [
  { id: 'feeds',    labelKey: 'kinds.feed'   },
  { id: 'diapers',  labelKey: 'kinds.diaper' },
  { id: 'sleeps',   labelKey: 'kinds.sleep'  },
  { id: 'vitamins', labelKey: 'kinds.vitamin'},
  { id: 'weights',  labelKey: 'kinds.weight'},
  { id: 'heights',  labelKey: 'kinds.height'},
  { id: 'others',   labelKey: 'kinds.other' }
] as const

export default function More(){
  const { t } = useTranslation()

  // --- Theme dropdown --------------------------------------------------------
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem(THEME_KEY) as ThemeMode) || 'system')
  useEffect(() => applyTheme(theme), []) // mount apply
  function applyTheme(mode: ThemeMode){
    const root = document.documentElement
    if (mode === 'system'){
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', mode)
    }
    localStorage.setItem(THEME_KEY, mode)
    setTheme(mode)
  }

  // --- Language dropdown ------------------------------------------------------
  const [lang, setLang] = useState<string>(() => localStorage.getItem(LANG_KEY) || i18n.language || 'en')
  async function changeLang(lng: string){
    await i18n.changeLanguage(lng)
    localStorage.setItem(LANG_KEY, lng)
    setLang(lng)
  }

  // --- Export helpers ---------------------------------------------------------
  const [busyAll, setBusyAll] = useState(false)
  const [busyOne, setBusyOne] = useState(false)
  const [tableSel, setTableSel] = useState<typeof TABLES[number]['id']>('feeds')

  function toCsv(rows: any[]): string {
    if (!rows || rows.length === 0) return ''
    const headers = Object.keys(rows[0])
    const esc = (v: any) => {
      if (v === null || v === undefined) return ''
      const s = String(v)
      const needs = /[",\n]/.test(s)
      return needs ? `"${s.replace(/"/g, '""')}"` : s
    }
    const lines = [
      headers.join(','),
      ...rows.map(r => headers.map(h => esc((r as any)[h])).join(','))
    ]
    return lines.join('\n')
  }

  function downloadBlob(filename: string, blob: Blob){
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function exportTableCsv(table: typeof TABLES[number]['id']){
    const q = supabase.from(table).select('*').order('date', { ascending: true })
    if (table === 'sleeps') q.order('start_time', { ascending: true })
    else if (table !== 'weights' && table !== 'heights') q.order('time', { ascending: true })
    const { data, error } = await q
    if (error) throw error
    return { csv: toCsv(data || []), count: data?.length ?? 0 }
  }

  // ---- NEW: Export all tables into ONE ZIP file ------------------------------
  async function handleExportAllZip(){
    try{
      setBusyAll(true)
      const zip = new JSZip()
      const meta: Record<string, any> = { exportedAt: new Date().toISOString(), tables: {} }

      for (const tdef of TABLES){
        const { csv, count } = await exportTableCsv(tdef.id)
        meta.tables[tdef.id] = { rows: count }
        zip.file(`${tdef.id}.csv`, csv || '')
      }
      zip.file('metadata.json', JSON.stringify(meta, null, 2))

      const blob = await zip.generateAsync({ type: 'blob' })
      downloadBlob('baby-tracker-export.zip', blob)
      alert(t('more.export.done'))
    }catch(e:any){
      alert(`${t('more.export.error')}: ${e?.message || String(e)}`)
    }finally{
      setBusyAll(false)
    }
  }

  // ---- Export single table CSV (rimane disponibile) -------------------------
  async function handleExportOne(){
    try{
      setBusyOne(true)
      const { csv } = await exportTableCsv(tableSel)
      downloadBlob(`${tableSel}.csv`, new Blob([csv], { type: 'text/csv;charset=utf-8' }))
      alert(t('more.export.done'))
    }catch(e:any){
      alert(`${t('more.export.error')}: ${e?.message || String(e)}`)
    }finally{
      setBusyOne(false)
    }
  }

  // --- Logout ----------------------------------------------------------------
  async function logout(){
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="content" style={{display:'grid', gap:16}}>
      {/* APP */}
      <section className="card" style={{display:'grid', gap:16}}>
        <div className="muted" style={{fontWeight:700}}>{t('more.app')}</div>

        {/* Appearance */}
        <div>
          <div style={{marginBottom:6}}>
            <div style={{fontWeight:600}}>{t('more.appearance')}</div>
            <div className="muted">{t('more.current')}: {t(`more.${theme}`)}</div>
          </div>
          <select className="input" value={theme} onChange={e=>applyTheme(e.target.value as ThemeMode)}>
            <option value="system">{t('more.system')}</option>
            <option value="dark">{t('more.dark')}</option>
            <option value="light">{t('more.light')}</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <div style={{marginBottom:6}}>
            <div style={{fontWeight:600}}>{t('more.language')}</div>
            <div className="muted">{t('more.current')}: {t(`lang.${lang as 'en'|'it'|'fr'|'es'}`)}</div>
          </div>
          <select className="input" value={lang} onChange={e=>changeLang(e.target.value)}>
            <option value="en">{t('lang.en')}</option>
            <option value="it">{t('lang.it')}</option>
            <option value="fr">{t('lang.fr')}</option>
            <option value="es">{t('lang.es')}</option>
          </select>
        </div>

        {/* Export data (ZIP + CSV singola) */}
        <div>
          <div style={{marginBottom:6}}>
            <div style={{fontWeight:600}}>{t('more.export.title')}</div>
            <div className="muted">{t('more.export.subtitle')}</div>
          </div>

          <div style={{display:'grid', gap:8}}>
            <button onClick={handleExportAllZip} disabled={busyAll}>
              {busyAll ? t('more.export.progress') : t('more.export.allZip')}
            </button>

            <div className="card" style={{display:'grid', gap:8}}>
              <label>{t('more.export.select')}
                <select className="input" value={tableSel} onChange={e=>setTableSel(e.target.value as any)}>
                  {TABLES.map(ti => (
                    <option key={ti.id} value={ti.id}>{t(ti.labelKey)}</option>
                  ))}
                </select>
              </label>
              <button onClick={handleExportOne} disabled={busyOne}>
                {busyOne ? t('more.export.progress') : t('more.export.one')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT */}
      <section className="card" style={{display:'grid', gap:12}}>
        <div className="muted" style={{fontWeight:700}}>{t('more.account')}</div>
        <button onClick={logout} style={{background:'#b91c1c'}}>{t('auth.logout')}</button>
      </section>
    </div>
  )
}
