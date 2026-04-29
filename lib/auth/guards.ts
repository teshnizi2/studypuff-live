import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,display_name,role,is_suspended,last_seen_at,created_at,updated_at")
    .eq("id", user.id)
    .single();

  if (profile?.is_suspended) {
    redirect("/login?message=Account%20is%20suspended");
  }

  return { user, profile: profile as Profile | null };
}

export async function requireAdmin() {
  const session = await requireUser();

  if (session.profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return session;
}
