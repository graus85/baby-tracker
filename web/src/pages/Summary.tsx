import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export default function Summary(){
  const q = useQuery({
    queryKey: ['counts'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser()
      const uid = user.user?.id
      if(!uid) throw new Error('Non autenticato')
      const { data, error } = await supabase
        .from('feeds')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', uid)
      if(error) throw error
      return { feeds: data?.length ?? 0 }
    }
  })
  return (
    <div className="card">
      <h3>Riepilogo</h3>
      <p><strong>Totale feed (record):</strong> {q.data?.feeds ?? 0}</p>
      <small>Demo minimal: aggregazioni avanzate verranno aggiunte in seguito.</small>
    </div>
  )
}
