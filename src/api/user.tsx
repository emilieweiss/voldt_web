import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signup(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  if (data.user) {
    await supabase
      .from('profiles')
      .update({ name, email })
      .eq('id', data.user.id);
  }
  return data;
}

export async function getUserProfile() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getUserProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
}

export async function deleteUserProfile(userId: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) throw error;
  return true;
}
