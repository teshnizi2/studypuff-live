import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

/**
 * Service-role Supabase client for admin-only operations (e.g.
 * deleting auth.users). Reads SUPABASE_SERVICE_ROLE_KEY from the
 * environment. NEVER expose this client to the browser — every
 * caller must be a server-only module that has already verified the
 * caller is an admin (e.g. requireAdmin in lib/auth/guards).
 *
 * When the service-role key is missing, returns null so callers can
 * fall back to softer behaviour (suspension instead of hard delete).
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function hasAdminEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Exposed so the UI can hint to set the env var on Vercel.
export const ADMIN_ENV_HINT =
  "Set SUPABASE_SERVICE_ROLE_KEY in Vercel project settings to enable hard delete.";

// Silence the unused warning when the URL helper is imported but
// the function above already covers usage — keeps the import tree clean.
void getSupabaseUrl;
