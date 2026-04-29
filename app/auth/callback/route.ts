import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const login = new URL("/login", requestUrl.origin);
      login.searchParams.set("message", error.message);
      return NextResponse.redirect(login);
    }
    return response;
  }

  const oauthError =
    requestUrl.searchParams.get("error_description") ||
    requestUrl.searchParams.get("error");
  if (oauthError) {
    const login = new URL("/login", requestUrl.origin);
    login.searchParams.set("message", oauthError);
    return NextResponse.redirect(login);
  }

  const login = new URL("/login", requestUrl.origin);
  login.searchParams.set(
    "message",
    "Missing authorization code. Try signing in again."
  );
  return NextResponse.redirect(login);
}
