import { create } from 'zustand'
import { useEffect } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
type Resolved = 'Light' | 'Dark'

type ThemeState = {
  mode: ThemeMode
  resolved: Resolved
  setMode: (m: ThemeMode) => void
}

const STORAGE_KEY = 'bt.themeMode'

function getInitialMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  return 'system'
}

export const useTheme = create<ThemeState>((set) => ({
  mode: getInitialMode(),
  resolved: 'Dark',
  setMode: (m) => {
    localStorage.setItem(STORAGE_KEY, m)
    set({ mode: m })
    applyTheme(m, set)
  }
}))

function applyTheme(mode: ThemeMode, set: any) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode
  document.documentElement.setAttribute('data-theme', resolved)
  set({ resolved: resolved === 'dark' ? 'Dark' : 'Light' })
}

export function ThemeWatcher() {
  const mode = useTheme(s => s.mode)

  useEffect(() => {
    applyTheme(mode, useTheme.setState)
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (useTheme.getState().mode === 'system') {
        applyTheme('system', useTheme.setState)
      }
    }
    mql.addEventListener?.('change', onChange)
    return () => mql.removeEventListener?.('change', onChange)
  }, [mode])

  return null
}
