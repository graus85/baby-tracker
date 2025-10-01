import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UIState = {
  /** Formato YYYY-MM-DD usato dall'input date */
  date: string
  setDate: (v: string) => void
  resetToday: () => void
}

function today(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

/** Stato UI condiviso e persistito in localStorage */
export const useSelectedDate = create<UIState>()(
  persist(
    (set) => ({
      date: today(),
      setDate: (v) => set({ date: v }),
      resetToday: () => set({ date: today() }),
    }),
    { name: 'bt.ui.selectedDate' }
  )
)
