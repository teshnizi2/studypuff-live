"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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
  revalidatePath(`/admin/users/${targetUserId}`);
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
  revalidatePath(`/admin/users/${targetUserId}`);
}

/**
 * Hard-deletes a user. Requires SUPABASE_SERVICE_ROLE_KEY in env so the
 * admin client can drop the auth.users row; on-delete cascades through
 * to profiles, sessions, tasks, rooms, members, messages, etc.
 *
 * Refuses to delete:
 *   - the actor themselves (admins can't self-destruct from the panel)
 *   - any admin (must demote them to user first via updateUserRole)
 */
export async function deleteUserAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const targetUserId = stringValue(formData, "user_id");
  if (!targetUserId || targetUserId === actor.id) return;

  const supabase = createSupabaseServerClient();
  const { data: target } = await supabase
    .from("profiles")
    .select("id, role, email")
    .eq("id", targetUserId)
    .single();

  if (!target) throw new Error("User not found.");
  if (target.role === "admin") {
    throw new Error(
      "Demote the admin to 'user' before deleting. This prevents a runaway action from wiping a fellow admin."
    );
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to the Vercel project settings to enable hard delete."
    );
  }

  const { error: authError } = await admin.auth.admin.deleteUser(targetUserId);
  if (authError) {
    throw new Error(`Auth delete failed: ${authError.message}`);
  }

  // The profile row + every FK-cascaded child (sessions, tasks, topics,
  // rooms, members, messages, etc.) is wiped by the auth.users delete
  // cascade. The audit log row is the only trace left behind.
  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: targetUserId,
    action: "user.deleted",
    metadata: { email: target.email }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

/**
 * Admin can force-end any room. Sets ended_at + is_open=false so the
 * existing in-room UI flips members back to solo mode.
 */
export async function adminEndRoomAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const roomId = stringValue(formData, "room_id");
  if (!roomId) return;

  const supabase = createSupabaseServerClient();
  await supabase
    .from("study_rooms")
    .update({ ended_at: new Date().toISOString(), is_open: false })
    .eq("id", roomId);

  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: null,
    action: "room.ended",
    metadata: { room_id: roomId }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/rooms");
}

/**
 * Admin can soft-delete any chat message (sets deleted_at). The UPDATE
 * policy on room_messages already allows admins.
 */
export async function adminDeleteMessageAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const messageId = stringValue(formData, "message_id");
  if (!messageId) return;

  const supabase = createSupabaseServerClient();
  await supabase
    .from("room_messages")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", messageId);

  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: null,
    action: "message.soft_deleted",
    metadata: { message_id: messageId }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/rooms");
}
