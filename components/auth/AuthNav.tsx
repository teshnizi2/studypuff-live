"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function loadSession(currentUser: User | null) {
      setUser(currentUser);
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();
      setIsAdmin(profile?.role === "admin");
    }

    supabase.auth.getUser().then(({ data }) => loadSession(data.user ?? null));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      loadSession(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <>
        <Link href="/dashboard" className="nav-link text-sm">
          Dashboard
        </Link>
        {isAdmin && (
          <Link href="/admin" className="nav-link text-sm">
            Admin
          </Link>
        )}
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
