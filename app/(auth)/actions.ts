"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function authRedirect(path: string, message: string) {
  redirect(`${path}?message=${encodeURIComponent(message)}`);
}

function getSiteOrigin(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) {
    return `${proto}://${host}`;
  }
  const fallback = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fallback) return fallback;
  return "http://localhost:3001";
}

function safeNextPath(next: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

export async function loginAction(formData: FormData) {
  const rawIdentifier = formValue(formData, "email");
  const password = formValue(formData, "password");
  const next = formValue(formData, "next") || "/dashboard";

  if (!rawIdentifier || !password) {
    authRedirect("/login", "Username or email and password are required.");
  }

  const supabase = createSupabaseServerClient();

  // If the field contains "@" anywhere except as a leading char, treat it
  // as an email. Otherwise look it up as a username via the SECURITY
  // DEFINER RPC. We strip a leading "@" so "@dmin" and "dmin" both work.
  const looksLikeEmail = /@/.test(rawIdentifier) && !rawIdentifier.startsWith("@");

  let email = rawIdentifier;
  if (!looksLikeEmail) {
    const username = rawIdentifier.replace(/^@+/, "").toLowerCase();
    const { data: resolved } = await supabase.rpc("email_for_username", {
      p_username: username
    });
    if (!resolved) {
      authRedirect("/login", "No account with that username.");
    }
    email = resolved as string;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    authRedirect("/login", error.message);
  }

  redirect(safeNextPath(next));
}

export async function registerAction(formData: FormData) {
  const email = formValue(formData, "email");
  const password = formValue(formData, "password");
  const displayName = formValue(formData, "display_name");

  if (!email || !password) {
    authRedirect("/register", "Email and password are required.");
  }

  if (password.length < 12) {
    authRedirect("/register", "Use a password of at least 12 characters.");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split("@")[0]
      }
    }
  });

  if (error) {
    authRedirect("/register", error.message);
  }

  redirect("/dashboard");
}

export async function signInWithGoogleAction(formData: FormData) {
  const next = safeNextPath(formValue(formData, "next") || "/dashboard");
  const source = formValue(formData, "oauth_source") || "login";
  const errorPath = source === "register" ? "/register" : "/login";

  const origin = getSiteOrigin();
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", next);

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: {
        prompt: "select_account"
      }
    }
  });

  if (error) {
    authRedirect(errorPath, error.message);
  }

  if (data?.url) {
    redirect(data.url);
  }

  authRedirect(errorPath, "Could not start Google sign-in. Try again.");
}

export async function logoutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
