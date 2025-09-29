import { supabase } from '../supabaseClient';

export type UserSettings = {
  user_id: string;
  language: string;
  dark_mode: boolean;
  preferred_units: string;
  created_at?: string;
  updated_at?: string;
};

export async function getMySettings(): Promise<UserSettings | null> {
  const { data: u, error: uErr } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  const uid = u?.user?.id;
  if (!uid) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', uid)
    .limit(1);

  if (error) throw error;
  return (data ?? [])[0] as UserSettings | undefined ?? null;
}

export async function upsertMySettings(patch: Partial<UserSettings>) {
  const { data: u, error: uErr } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  const uid = u?.user?.id;
  if (!uid) throw new Error('Not authenticated');

  const payload = { user_id: uid, ...patch };

  const { error } = await supabase
    .from('user_settings')
    .upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
}
