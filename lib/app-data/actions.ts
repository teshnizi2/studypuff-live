"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StudyMode, TaskPriority } from "@/lib/supabase/database.types";

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
  const supabase = createSupabaseServerClient();

  await supabase.from("tasks").insert({
    user_id: user.id,
    topic_id: nullableValue(formData, "topic_id"),
    text,
    priority,
    due_date: nullableValue(formData, "due_date")
  });

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
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
  revalidatePath("/dashboard");
}

const COLUMN_FOR_CATEGORY: Record<string, "equipped_sound" | "equipped_theme" | "equipped_accessory"> = {
  sound: "equipped_sound",
  theme: "equipped_theme",
  accessory: "equipped_accessory"
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
}
