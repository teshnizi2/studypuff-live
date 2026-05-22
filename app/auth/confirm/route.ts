import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/reset-password";
  }
  return next;
}

function forgotWith(message: string, origin: string) {
  const forgot = new URL("/forgot-password", origin);
  forgot.searchParams.set("message", message);
  return NextResponse.redirect(forgot);
}

/**
 * Handles email-link confirmation via the token-hash flow (password recovery
 * today; works cross-device because it does not rely on a PKCE verifier
 * cookie). Verifies the OTP, sets the session cookies on the response, and
 * redirects to a safe in-app path (default /reset-password).
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextPath = safeNextPath(requestUrl.searchParams.get("next"));
  const redirectTarget = new URL(nextPath, requestUrl.origin);

  let response = NextResponse.redirect(redirectTarget);

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return response;
    }
    return forgotWith(
      "That reset link is invalid or has expired. Request a new one below.",
      requestUrl.origin
    );
  }

  return forgotWith(
    "That reset link is missing its token. Request a new one below.",
    requestUrl.origin
  );
}
