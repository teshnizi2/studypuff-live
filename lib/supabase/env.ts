const SUPABASE_URL_FALLBACK = "https://example.supabase.co";
const SUPABASE_KEY_FALLBACK = "missing-supabase-anon-key";

export function getSupabaseUrl() {
  // LOCAL-PREVIEW split: server (no window) prefers SUPABASE_SERVER_URL (local DB,
  // fast); browser uses the public tunnel URL so a remote device can reach the DB.
  // A fixed cookie name (server/client/middleware cookieOptions) shares the session.
  if (typeof window === "undefined" && process.env.SUPABASE_SERVER_URL) {
    return process.env.SUPABASE_SERVER_URL;
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_FALLBACK;
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_KEY_FALLBACK;
}

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
