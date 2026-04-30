"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Profile = {
  display_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
};

type Props = {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
};

export function AuthNav({ onNavigate, variant = "desktop" }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function loadSession(currentUser: User | null) {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setLoaded(true);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, role")
        .eq("id", currentUser.id)
        .single();
      setProfile((data as Profile | null) ?? null);
      setLoaded(true);
    }

    supabase.auth.getUser().then(({ data }) => loadSession(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadSession(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Avoid a flash of the wrong state on first paint
  if (!loaded) {
    return <span className="block h-9 w-32" aria-hidden />;
  }

  const handleNav = () => onNavigate?.();

  if (user) {
    const initial = (profile?.display_name || user.email || "?").charAt(0).toUpperCase();
    const isAdmin = profile?.role === "admin";

    if (variant === "mobile") {
      return (
        <>
          <Link
            href="/dashboard"
            onClick={handleNav}
            className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
          >
            <Avatar profile={profile} fallback={initial} size={6} />
            Open dashboard
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={handleNav}
              className="btn-outline inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
            >
              Admin
            </Link>
          )}
        </>
      );
    }

    return (
      <>
        {isAdmin && (
          <Link
            href="/admin"
            onClick={handleNav}
            className="rounded-full px-3 py-1.5 text-sm text-ink-900/80 hover:text-ink-900"
          >
            Admin
          </Link>
        )}
        <Link
          href="/dashboard"
          onClick={handleNav}
          className="inline-flex items-center gap-2 rounded-full bg-cream-50 py-1 pl-1 pr-4 text-sm text-ink-900 shadow-soft ring-1 ring-ink-900/10 transition hover:-translate-y-0.5 hover:bg-cream-100"
        >
          <Avatar profile={profile} fallback={initial} size={7} />
          <span className="font-semibold">{profile?.display_name || "Dashboard"}</span>
        </Link>
      </>
    );
  }

  // Logged out
  if (variant === "mobile") {
    return (
      <>
        <Link
          href="/login"
          onClick={handleNav}
          className="btn-outline inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
        >
          Log in
        </Link>
        <Link
          href="/register"
          onClick={handleNav}
          className="btn-primary inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
        >
          Create account
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        onClick={handleNav}
        className="rounded-full px-3 py-2 text-sm text-ink-900/80 transition hover:text-ink-900"
      >
        Log in
      </Link>
      <Link
        href="/register"
        onClick={handleNav}
        className="btn-primary px-5 py-2 text-sm font-semibold"
      >
        Create account
      </Link>
    </>
  );
}

function Avatar({
  profile,
  fallback,
  size
}: {
  profile: Profile | null;
  fallback: string;
  size: 6 | 7;
}) {
  const sizeClass = size === 7 ? "h-7 w-7" : "h-6 w-6";
  return (
    <span
      className={`flex ${sizeClass} items-center justify-center overflow-hidden rounded-full bg-brand-butter text-xs font-semibold text-ink-900`}
    >
      {profile?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
      ) : (
        fallback
      )}
    </span>
  );
}
