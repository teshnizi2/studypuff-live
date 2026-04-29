import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type StudySession = Pick<Database["public"]["Tables"]["study_sessions"]["Row"], "user_id" | "minutes" | "created_at">;
type Task = Pick<Database["public"]["Tables"]["tasks"]["Row"], "id" | "done">;
type AuditLog = Database["public"]["Tables"]["admin_audit_logs"]["Row"];

export async function getAdminOverview() {
  const supabase = createSupabaseServerClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [profilesResult, sessionsResult, tasksResult, auditResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,email,display_name,role,is_suspended,created_at,last_seen_at")
      .order("created_at", { ascending: false }),
    supabase.from("study_sessions").select("user_id,minutes,created_at"),
    supabase.from("tasks").select("id,done"),
    supabase
      .from("admin_audit_logs")
      .select("id,action,actor_id,target_user_id,metadata,created_at")
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  const profiles = (profilesResult.data || []) as Profile[];
  const sessions = (sessionsResult.data || []) as StudySession[];
  const tasks = (tasksResult.data || []) as Task[];
  const totalStudyMinutes = sessions.reduce((total, session) => total + session.minutes, 0);
  const newUsers = profiles.filter((profile) => profile.created_at >= sevenDaysAgo).length;
  const activeUsers = profiles.filter((profile) => profile.last_seen_at && profile.last_seen_at >= sevenDaysAgo).length;

  return {
    profiles,
    sessions,
    tasks,
    auditLogs: (auditResult.data || []) as AuditLog[],
    stats: {
      totalUsers: profiles.length,
      newUsers,
      activeUsers,
      totalStudyMinutes,
      completedTasks: tasks.filter((task) => task.done).length
    }
  };
}
