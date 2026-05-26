"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StudyMode, TaskPriority } from "@/lib/supabase/database.types";
import { REWARDS } from "@/lib/app-data/rewards";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(formData: FormData, key: string, fallback: number) {
  const value = Number(stringValue(formData, key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function nullableValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value ? value : null;
}

export async function updateProfileAction(formData: FormData) {
  const { user } = await requireUser();
  const supabase = createSupabaseServerClient();

  const usernameRaw = stringValue(formData, "username").toLowerCase();
  if (usernameRaw && !/^[a-z0-9_]{3,24}$/.test(usernameRaw)) {
    throw new Error("Username must be 3–24 chars: lowercase letters, numbers, or underscore.");
  }

  const updates = {
    display_name: stringValue(formData, "display_name") || null,
    username: usernameRaw || null,
    bio: stringValue(formData, "bio").slice(0, 500) || null,
    pronouns: stringValue(formData, "pronouns").slice(0, 40) || null,
    study_field: stringValue(formData, "study_field").slice(0, 80) || null,
    school: stringValue(formData, "school").slice(0, 120) || null,
    year_level: stringValue(formData, "year_level").slice(0, 60) || null,
    city: stringValue(formData, "city").slice(0, 80) || null,
    time_zone: stringValue(formData, "time_zone").slice(0, 60) || null,
    favorite_subjects: stringValue(formData, "favorite_subjects").slice(0, 200) || null,
    birthday: nullableValue(formData, "birthday"),
    last_seen_at: new Date().toISOString()
  };

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) {
    if (error.code === "23505") {
      throw new Error("That username is already taken.");
    }
    throw error;
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

export async function uploadAvatarAction(formData: FormData) {
  const { user, profile } = await requireUser();
  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Pick an image to upload.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be 5 MB or smaller.");
  }
  if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) {
    throw new Error("Image must be PNG, JPG, WEBP, or GIF.");
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase().slice(0, 5);
  const path = `${user.id}/avatar-${Date.now()}.${ext}`;
  const supabase = createSupabaseServerClient();

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);

  const previousUrl = profile?.avatar_url;
  await supabase.from("profiles").update({ avatar_url: publicUrl.publicUrl }).eq("id", user.id);

  if (previousUrl) {
    const previousPath = previousUrl.split("/avatars/")[1];
    if (previousPath && previousPath.startsWith(`${user.id}/`)) {
      await supabase.storage.from("avatars").remove([previousPath]);
    }
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
}

export async function removeAvatarAction() {
  const { user, profile } = await requireUser();
  if (!profile?.avatar_url) return;

  const supabase = createSupabaseServerClient();
  const previousPath = profile.avatar_url.split("/avatars/")[1];
  if (previousPath && previousPath.startsWith(`${user.id}/`)) {
    await supabase.storage.from("avatars").remove([previousPath]);
  }
  await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
}

export async function deleteTaskAction(formData: FormData) {
  const { user } = await requireUser();
  const id = stringValue(formData, "id");
  if (!id) return;

  const supabase = createSupabaseServerClient();
  await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}

export async function deleteTopicAction(formData: FormData) {
  const { user } = await requireUser();
  const id = stringValue(formData, "id");
  if (!id) return;

  const supabase = createSupabaseServerClient();
  await supabase.from("topics").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}

export async function updateSettingsAction(formData: FormData) {
  const { user } = await requireUser();
  const supabase = createSupabaseServerClient();

  await supabase.from("user_settings").upsert({
    user_id: user.id,
    focus_minutes: numberValue(formData, "focus_minutes", 25),
    short_break_minutes: numberValue(formData, "short_break_minutes", 5),
    long_break_minutes: numberValue(formData, "long_break_minutes", 20),
    daily_goal_minutes: numberValue(formData, "daily_goal_minutes", 90),
    dark_mode: formData.get("dark_mode") === "on",
    auto_cycle: formData.get("auto_cycle") === "on",
    ambient: stringValue(formData, "ambient") || "library",
    chime: formData.get("chime") === "on"
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}

export async function createTopicAction(formData: FormData) {
  const { user } = await requireUser();
  const name = stringValue(formData, "name");

  if (!name) return;

  const supabase = createSupabaseServerClient();
  await supabase.from("topics").insert({ user_id: user.id, name });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function createTaskAction(formData: FormData) {
  const { user } = await requireUser();
  const text = stringValue(formData, "text");

  if (!text) return;

  const priority = (stringValue(formData, "priority") || "normal") as TaskPriority;
  const topicId = nullableValue(formData, "topic_id");
  const supabase = createSupabaseServerClient();

  // Place the new task at the bottom of its topic — read the current max
  // position and add 1. Cheap query and avoids fighting the user's order.
  const { data: maxRow } = await supabase
    .from("tasks")
    .select("position")
    .eq("user_id", user.id)
    .eq("topic_id", topicId as string | null)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPosition = (maxRow?.position ?? 0) + 1;

  await supabase.from("tasks").insert({
    user_id: user.id,
    topic_id: topicId,
    text,
    priority,
    due_date: nullableValue(formData, "due_date"),
    position: nextPosition
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

// Reorder tasks within a topic. Receives an ordered list of task IDs and
// rewrites their positions to 1..N. Idempotent.
export async function reorderTasksAction(formData: FormData) {
  const { user } = await requireUser();
  const idsRaw = stringValue(formData, "ids");
  if (!idsRaw) return;
  const ids = idsRaw.split(",").map((s) => s.trim()).filter(Boolean);
  if (ids.length === 0) return;

  const supabase = createSupabaseServerClient();
  // Sequential updates — small N (one topic's worth), simpler than upsert.
  for (let i = 0; i < ids.length; i++) {
    await supabase
      .from("tasks")
      .update({ position: i + 1 })
      .eq("id", ids[i])
      .eq("user_id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}

export async function toggleTaskAction(formData: FormData) {
  await requireUser();
  const id = stringValue(formData, "id");
  const done = formData.get("done") === "true";

  if (!id) return;

  const supabase = createSupabaseServerClient();
  await supabase.from("tasks").update({ done: !done }).eq("id", id);

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

// Updates editable task fields. All fields are optional — the FormData only
// needs to carry the keys that changed.
export async function updateTaskAction(formData: FormData) {
  const { user } = await requireUser();
  const id = stringValue(formData, "id");
  if (!id) return;

  const updates: {
    text?: string;
    priority?: TaskPriority;
    due_date?: string | null;
    notes?: string | null;
  } = {};

  if (formData.has("text")) {
    const text = stringValue(formData, "text");
    if (text) updates.text = text;
  }

  if (formData.has("priority")) {
    const priority = stringValue(formData, "priority");
    if (priority === "low" || priority === "normal" || priority === "high") {
      updates.priority = priority as TaskPriority;
    }
  }

  // due_date: empty string clears it; missing key leaves it untouched
  if (formData.has("due_date")) {
    const due = stringValue(formData, "due_date");
    updates.due_date = due ? due : null;
  }

  // notes: empty string clears, missing key leaves untouched
  if (formData.has("notes")) {
    const notes = stringValue(formData, "notes");
    updates.notes = notes ? notes.slice(0, 4000) : null;
  }

  if (Object.keys(updates).length === 0) return;

  const supabase = createSupabaseServerClient();
  await supabase.from("tasks").update(updates).eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function addStudySessionAction(formData: FormData) {
  const { user } = await requireUser();
  const minutes = numberValue(formData, "minutes", 25);
  const mode = (stringValue(formData, "mode") || "focus") as StudyMode;
  const supabase = createSupabaseServerClient();

  await supabase.from("study_sessions").insert({
    user_id: user.id,
    topic_id: nullableValue(formData, "topic_id"),
    task_id: nullableValue(formData, "task_id"),
    topic_name: nullableValue(formData, "topic_name"),
    task_name: nullableValue(formData, "task_name"),
    minutes,
    mode,
    focus_score: numberValue(formData, "focus_score", 0) || null
  });

  // Reward coins for focus sessions: 1 coin per minute focused, capped at 90
  if (mode === "focus" && minutes > 0) {
    const coinsEarned = Math.min(minutes, 90);
    await supabase.rpc("award_focus_coins", {
      p_minutes: minutes,
      p_coins: coinsEarned
    });
  }

  revalidatePath("/dashboard/timer");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/stats");
  revalidatePath("/dashboard/rewards");
}

/** Claim a free golden trophy item once the user has reached its unlock
 *  threshold (lifetime focused minutes). No coins are spent. Inserts a row
 *  in user_purchases at price 0 — after that the item behaves like any
 *  other owned item in inventory. */
export async function claimGoldenItemAction(formData: FormData) {
  const { user } = await requireUser();
  const itemId = stringValue(formData, "item_id");
  if (!itemId || !itemId.startsWith("garden-golden-")) {
    throw new Error("Invalid trophy item id.");
  }

  // Look up the reward to learn its unlock threshold.
  const reward = REWARDS.find((r) => r.id === itemId);
  if (!reward || reward.category !== "garden-golden") {
    throw new Error("Unknown trophy item.");
  }
  const threshold = reward.unlocks_at_minutes ?? Number.POSITIVE_INFINITY;

  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase
    .from("user_settings")
    .select("lifetime_focus_minutes")
    .eq("user_id", user.id)
    .single();
  const minutes = settings?.lifetime_focus_minutes ?? 0;
  if (minutes < threshold) {
    throw new Error(`Need ${threshold - minutes} more focused minutes to claim this trophy.`);
  }

  // Idempotent insert: ignore duplicate-key errors (already claimed).
  const { error } = await supabase
    .from("user_purchases")
    .insert({ user_id: user.id, item_id: itemId, price_paid: 0 });
  if (error && !/duplicate|unique/i.test(error.message)) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/garden");
  revalidatePath("/dashboard");
}

export async function purchaseRewardAction(formData: FormData) {
  await requireUser();
  const itemId = stringValue(formData, "item_id");
  const price = numberValue(formData, "price", 0);
  if (!itemId) throw new Error("Missing item.");

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("purchase_reward", {
    p_item_id: itemId,
    p_price: price
  });
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/rewards");
  revalidatePath("/dashboard/garden");
  revalidatePath("/dashboard");
}

const COLUMN_FOR_CATEGORY: Record<string, "equipped_sound" | "equipped_theme" | "equipped_accessory" | "equipped_map"> = {
  sound: "equipped_sound",
  theme: "equipped_theme",
  accessory: "equipped_accessory",
  "garden-map": "equipped_map"
};

export async function equipRewardAction(formData: FormData) {
  const { user } = await requireUser();
  const itemId = stringValue(formData, "item_id");
  const category = stringValue(formData, "category");
  const column = COLUMN_FOR_CATEGORY[category];
  if (!itemId || !column) throw new Error("Missing item or category.");

  const supabase = createSupabaseServerClient();
  const { data: owned } = await supabase
    .from("user_purchases")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .maybeSingle();
  if (!owned) throw new Error("You don't own this item.");

  await supabase
    .from("user_settings")
    .update({ [column]: itemId })
    .eq("user_id", user.id);

  revalidatePath("/dashboard/rewards");
  revalidatePath("/dashboard/timer");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/garden");
}

/** Garden item-placement persistence — accepts a JSON layout map and stores
 *  it as user_settings.garden_layout. Caller posts the full layout (not a diff)
 *  so the column always reflects the current state. */
export async function saveGardenLayoutAction(formData: FormData) {
  const { user } = await requireUser();
  const raw = stringValue(formData, "layout");
  if (!raw) throw new Error("Missing layout.");
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error("Invalid layout JSON."); }
  if (!parsed || typeof parsed !== "object") throw new Error("Layout must be an object.");

  // Sanitize: only accept {x, y} numbers in 0-100 range, item-id key.
  const clean: Record<string, { x: number; y: number }> = {};
  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    if (!k.startsWith("garden-")) continue;
    if (!v || typeof v !== "object") continue;
    const { x, y } = v as { x?: unknown; y?: unknown };
    if (typeof x !== "number" || typeof y !== "number") continue;
    if (x < -10 || x > 110 || y < -10 || y > 110) continue;
    clean[k] = { x, y };
  }

  const supabase = createSupabaseServerClient();
  await supabase.from("user_settings").update({ garden_layout: clean }).eq("user_id", user.id);
  revalidatePath("/dashboard/garden");
}

export async function resetGardenLayoutAction() {
  const { user } = await requireUser();
  const supabase = createSupabaseServerClient();
  await supabase.from("user_settings").update({ garden_layout: {} }).eq("user_id", user.id);
  revalidatePath("/dashboard/garden");
}

export async function unequipRewardAction(formData: FormData) {
  const { user } = await requireUser();
  const category = stringValue(formData, "category");
  const column = COLUMN_FOR_CATEGORY[category];
  if (!column) throw new Error("Missing category.");

  const supabase = createSupabaseServerClient();
  await supabase
    .from("user_settings")
    .update({ [column]: null })
    .eq("user_id", user.id);

  revalidatePath("/dashboard/rewards");
  revalidatePath("/dashboard/timer");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/garden");
}
