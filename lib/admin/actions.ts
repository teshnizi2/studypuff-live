"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/database.types";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateUserRoleAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const targetUserId = stringValue(formData, "user_id");
  const role = stringValue(formData, "role") as UserRole;

  if (!targetUserId || !["user", "admin"].includes(role)) return;

  const supabase = createSupabaseServerClient();
  await supabase.from("profiles").update({ role }).eq("id", targetUserId);
  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: targetUserId,
    action: "profile.role_updated",
    metadata: { role }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}

export async function updateUserSuspensionAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const targetUserId = stringValue(formData, "user_id");
  const isSuspended = stringValue(formData, "is_suspended") === "true";

  if (!targetUserId || targetUserId === actor.id) return;

  const supabase = createSupabaseServerClient();
  await supabase.from("profiles").update({ is_suspended: !isSuspended }).eq("id", targetUserId);
  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: targetUserId,
    action: "profile.suspension_updated",
    metadata: { is_suspended: !isSuspended }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
}
