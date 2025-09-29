import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { todayISO } from '../utils/time'
import { countsByType, TYPE_META } from '../utils/format'
import type { DayData } from '../types'
import EventsGridChart from '../components/EventsGridChart'

type DayRow = { date: string; data: DayData }

export default function Summary() {
  // from/to preimpostati su oggi
  const [from, setFrom] = useState<string>(() => todayISO())
  const [to, setTo] = useState<string>(() => todayISO())

  const [rows, setRows] = useState<DayRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true); setError(null)
    const { data, error } = await supabase
      .from('v_day_data')
      .select('date, data')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: true })
    setLoading(false)
    if (
