const SUPABASE_URL_FALLBACK = "https://example.supabase.co";
const SUPABASE_KEY_FALLBACK = "missing-supabase-anon-key";

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_FALLBACK;
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_KEY_FALLBACK;
}

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
