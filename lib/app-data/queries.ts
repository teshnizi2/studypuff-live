import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Settings = Database["public"]["Tables"]["user_settings"]["Row"];
type Topic = Database["public"]["Tables"]["topics"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];
type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];

export async function getUserWorkspace(userId: string) {
  const supabase = createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const [settingsResult, topicsResult, tasksResult, sessionsResult, todayResult] = await Promise.all([
    supabase.from("user_settings").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("topics").select("*").eq("user_id", userId).order("position"),
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      // Open tasks first; within each group, oldest first so newly added
      // tasks land at the bottom of the list.
      .order("done", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("studied_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("study_sessions").select("minutes").eq("user_id", userId).eq("studied_on", today)
  ]);

  const todayMinutes = (todayResult.data || []).reduce((total, row) => total + row.minutes, 0);
  const totalMinutes = (sessionsResult.data || []).reduce((total, row) => total + row.minutes, 0);

  return {
    settings: settingsResult.data as Settings | null,
    topics: (topicsResult.data || []) as Topic[],
    tasks: (tasksResult.data || []) as Task[],
    sessions: (sessionsResult.data || []) as StudySession[],
    todayMinutes,
    totalMinutes
  };
}
