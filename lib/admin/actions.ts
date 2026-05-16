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
 * Admin sets a new password for any user. Requires service-role env.
 * Useful when a user is locked out.
 */
export async function adminResetPasswordAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const targetUserId = stringValue(formData, "user_id");
  const newPassword = stringValue(formData, "new_password");
  if (!targetUserId || !newPassword) return;
  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it in Vercel to enable password reset."
    );
  }

  const { error } = await admin.auth.admin.updateUserById(targetUserId, { password: newPassword });
  if (error) throw new Error(`Reset failed: ${error.message}`);

  const supabase = createSupabaseServerClient();
  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: targetUserId,
    action: "user.password_reset",
    metadata: {}
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/users/${targetUserId}`);
}

/**
 * Adjust a user's coin balance up or down. Uses the service-role client
 * to bypass the user_settings owner-only RLS.
 */
export async function adminAdjustCoinsAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const targetUserId = stringValue(formData, "user_id");
  const delta = Number(stringValue(formData, "delta"));
  if (!targetUserId || !Number.isFinite(delta) || delta === 0) return;

  const admin = createSupabaseAdminClient();
  if (!admin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it in Vercel to enable coin adjustment."
    );
  }

  // Fetch current balance, write back with clamp at 0.
  const { data: settings, error: readError } = await admin
    .from("user_settings")
    .select("coins")
    .eq("user_id", targetUserId)
    .maybeSingle();
  if (readError) throw new Error(`Read failed: ${readError.message}`);

  const current = settings?.coins ?? 0;
  const next = Math.max(0, current + delta);

  const { error: writeError } = await admin
    .from("user_settings")
    .update({ coins: next })
    .eq("user_id", targetUserId);
  if (writeError) throw new Error(`Write failed: ${writeError.message}`);

  const supabase = createSupabaseServerClient();
  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: targetUserId,
    action: "user.coins_adjusted",
    metadata: { delta, before: current, after: next }
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/users/${targetUserId}`);
}

// ───── Livestream schedule CRUD ───────────────────────────────────────────────

function nz(formData: FormData, key: string, fallback = 0) {
  const raw = stringValue(formData, key);
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function trunc(s: string, max: number) {
  return s.length > max ? s.slice(0, max) : s;
}

export async function createLivestreamAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const day_label = trunc(stringValue(formData, "day_label"), 40);
  const time_label = trunc(stringValue(formData, "time_label"), 40);
  const platform_label = trunc(stringValue(formData, "platform_label") || "YouTube · Twitch", 60);
  const topic = trunc(stringValue(formData, "topic"), 120);
  const sort_order = nz(formData, "sort_order", 0);
  const is_active = stringValue(formData, "is_active") !== "false";

  if (!day_label || !time_label || !topic) {
    throw new Error("Day, time, and topic are required.");
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("livestream_sessions")
    .insert({ day_label, time_label, platform_label, topic, sort_order, is_active });
  if (error) throw error;

  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: null,
    action: "livestream.created",
    metadata: { day_label, time_label, topic }
  });

  revalidatePath("/admin/schedule");
  revalidatePath("/study");
  revalidatePath("/");
}

export async function updateLivestreamAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const id = stringValue(formData, "id");
  if (!id) return;

  const updates: Record<string, unknown> = {};
  if (formData.has("day_label"))      updates.day_label      = trunc(stringValue(formData, "day_label"), 40);
  if (formData.has("time_label"))     updates.time_label     = trunc(stringValue(formData, "time_label"), 40);
  if (formData.has("platform_label")) updates.platform_label = trunc(stringValue(formData, "platform_label"), 60);
  if (formData.has("topic"))          updates.topic          = trunc(stringValue(formData, "topic"), 120);
  if (formData.has("sort_order"))     updates.sort_order     = nz(formData, "sort_order", 0);
  if (formData.has("is_active"))      updates.is_active      = stringValue(formData, "is_active") === "true";

  if (Object.keys(updates).length === 0) return;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("livestream_sessions").update(updates).eq("id", id);
  if (error) throw error;

  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: null,
    action: "livestream.updated",
    metadata: { id, ...updates }
  });

  revalidatePath("/admin/schedule");
  revalidatePath("/study");
  revalidatePath("/");
}

export async function deleteLivestreamAction(formData: FormData) {
  const { user: actor } = await requireAdmin();
  const id = stringValue(formData, "id");
  if (!id) return;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("livestream_sessions").delete().eq("id", id);
  if (error) throw error;

  await supabase.from("admin_audit_logs").insert({
    actor_id: actor.id,
    target_user_id: null,
    action: "livestream.deleted",
    metadata: { id }
  });

  revalidatePath("/admin/schedule");
  revalidatePath("/study");
  revalidatePath("/");
}

// ─────────────────────────────────────────────────────────────────────────────

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
