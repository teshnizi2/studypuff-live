"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthNav() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <>
        <Link href="/dashboard" className="nav-link text-sm">
          Dashboard
        </Link>
        <Link href="/admin" className="nav-link text-sm">
          Admin
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className="nav-link text-sm">
        Log in
      </Link>
      <Link
        href="/register"
        className="btn-primary text-sm px-4 py-2 font-semibold shadow-soft"
      >
        Create account
      </Link>
    </>
  );
}
