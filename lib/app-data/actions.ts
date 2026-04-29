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
  const displayName = stringValue(formData, "display_name");

  await supabase
    .from("profiles")
    .update({ display_name: displayName || null, last_seen_at: new Date().toISOString() })
    .eq("id", user.id);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
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

  revalidatePath("/dashboard/timer");
  revalidatePath("/dashboard");
}
