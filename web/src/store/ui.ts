import { create } from 'zustand'
import { formatISO } from 'date-fns'

type UIState = {
  date: string
  setDate: (d: string) => void
}

const todayISO = new Date().toISOString().slice(0,10)

export const useSelectedDate = create<UIState>((set) => ({
  date: todayISO,
  setDate: (d)=>set({date: d || todayISO})
}))
