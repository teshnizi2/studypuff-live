import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type StudySession = Pick<
  Database["public"]["Tables"]["study_sessions"]["Row"],
  "user_id" | "minutes" | "created_at" | "mode" | "studied_on" | "topic_name" | "task_name"
>;
type Task = Pick<Database["public"]["Tables"]["tasks"]["Row"], "id" | "done">;
type AuditLog = Database["public"]["Tables"]["admin_audit_logs"]["Row"];

export async function getAdminOverview() {
  const supabase = createSupabaseServerClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    profilesResult,
    sessionsResult,
    tasksResult,
    auditResult,
    roomsResult,
    messagesResult
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,email,display_name,role,is_suspended,created_at,last_seen_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("study_sessions")
      .select("user_id,minutes,created_at,mode,studied_on,topic_name,task_name"),
    supabase.from("tasks").select("id,done"),
    supabase
      .from("admin_audit_logs")
      .select("id,action,actor_id,target_user_id,metadata,created_at")
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("study_rooms")
      .select("id, ended_at, is_open, created_at"),
    supabase
      .from("room_messages")
      .select("id, created_at, deleted_at")
      .gte("created_at", sevenDaysAgo)
  ]);

  const profiles = (profilesResult.data || []) as Profile[];
  const sessions = (sessionsResult.data || []) as StudySession[];
  const tasks = (tasksResult.data || []) as Task[];
  const rooms = roomsResult.data || [];
  const messages = messagesResult.data || [];

  const focusSessions = sessions.filter((s) => s.mode === "focus");
  const totalStudyMinutes = focusSessions.reduce((t, s) => t + s.minutes, 0);
  const last7Minutes = focusSessions
    .filter((s) => s.created_at >= sevenDaysAgo)
    .reduce((t, s) => t + s.minutes, 0);

  const newUsers = profiles.filter((p) => p.created_at >= sevenDaysAgo).length;
  const dau = profiles.filter((p) => p.last_seen_at && p.last_seen_at >= sevenDaysAgo).length;
  const mau = profiles.filter((p) => p.last_seen_at && p.last_seen_at >= thirtyDaysAgo).length;

  // 30-day daily rollup — used by the overview activity chart.
  const isoDay = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const dailyMap = new Map<string, { signups: number; minutes: number; sessions: number }>();
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dailyMap.set(isoDay(d), { signups: 0, minutes: 0, sessions: 0 });
  }
  for (const p of profiles) {
    const day = p.created_at.slice(0, 10);
    if (dailyMap.has(day)) dailyMap.get(day)!.signups++;
  }
  for (const s of focusSessions) {
    const day = (s.studied_on as string | null) || s.created_at.slice(0, 10);
    if (dailyMap.has(day)) {
      const row = dailyMap.get(day)!;
      row.minutes += s.minutes;
      row.sessions++;
    }
  }
  const daily = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v }));

  // Top 10 users by lifetime focus minutes, joined with profile names.
  const minutesByUser = new Map<string, number>();
  for (const s of focusSessions) {
    minutesByUser.set(s.user_id, (minutesByUser.get(s.user_id) || 0) + s.minutes);
  }
  const topUsers = Array.from(minutesByUser.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([userId, minutes]) => {
      const p = profiles.find((x) => x.id === userId);
      return {
        userId,
        minutes,
        displayName: p?.display_name || p?.email || userId.slice(0, 8),
        email: p?.email || ""
      };
    });

  // Enrich audit logs with the actor's display name (and the target's,
  // when present), since the raw rows only carry uuids.
  const profilesById = new Map(profiles.map((p) => [p.id, p]));
  const auditLogs = ((auditResult.data || []) as AuditLog[]).map((log) => {
    const actor = profilesById.get(log.actor_id || "");
    const target = profilesById.get(log.target_user_id || "");
    return {
      ...log,
      actorLabel: actor?.display_name || actor?.email || log.actor_id || "—",
      targetLabel: target?.display_name || target?.email || log.target_user_id || null
    };
  });

  return {
    profiles,
    sessions,
    tasks,
    rooms,
    auditLogs,
    daily,
    topUsers,
    stats: {
      totalUsers: profiles.length,
      newUsers,
      activeUsers: dau,         // DAU (last 7d) — kept name for compat
      monthlyActive: mau,
      totalStudyMinutes,
      last7Minutes,
      completedTasks: tasks.filter((t) => t.done).length,
      totalTasks: tasks.length,
      activeRooms: rooms.filter((r) => !r.ended_at).length,
      totalRooms: rooms.length,
      messagesLast7: messages.filter((m) => !m.deleted_at).length
    }
  };
}

// Full per-user breakdown for the user-detail page.
export async function getUserDetail(userId: string) {
  const supabase = createSupabaseServerClient();

  const [
    profileResult,
    settingsResult,
    sessionsResult,
    tasksResult,
    topicsResult,
    ownedRoomsResult,
    memberRoomsResult
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, email, display_name, username, role, is_suspended, created_at, last_seen_at, study_field, school, city, bio, avatar_url"
      )
      .eq("id", userId)
      .single(),
    supabase
      .from("user_settings")
      .select("coins, lifetime_focus_minutes, daily_goal_minutes")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("study_sessions")
      .select("id, minutes, mode, studied_on, created_at, topic_name, task_name")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("tasks")
      .select("id, text, done, priority, due_date, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("topics")
      .select("id, name, color, created_at")
      .eq("user_id", userId),
    supabase
      .from("study_rooms")
      .select("id, code, name, is_open, ended_at, created_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("study_room_members")
      .select("room_id, joined_at, study_rooms(id, code, name, is_open, ended_at, created_at, owner_id)")
      .eq("user_id", userId)
  ]);

  if (!profileResult.data) return null;

  const profile = profileResult.data;
  const settings = settingsResult.data;
  const allSessions = sessionsResult.data || [];
  const focusSessions = allSessions.filter((s) => s.mode === "focus");
  const totalFocusMinutes = focusSessions.reduce((t, s) => t + s.minutes, 0);

  // Streak from recent sessions
  const today = new Date();
  const isoDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const studied = focusSessions.some((s) => s.studied_on === iso && s.minutes > 0);
    if (studied) streak++;
    else if (i > 0) break;
  }

  const tasks = tasksResult.data || [];
  const topics = topicsResult.data || [];
  const ownedRooms = ownedRoomsResult.data || [];
  const joinedRooms = (memberRoomsResult.data || [])
    .map((m: { study_rooms: unknown }) => m.study_rooms)
    .filter(Boolean) as Array<{
      id: string;
      code: string;
      name: string;
      is_open: boolean;
      ended_at: string | null;
      created_at: string;
      owner_id: string;
    }>;

  return {
    profile,
    settings,
    sessions: allSessions,
    focusSessionCount: focusSessions.length,
    totalFocusMinutes,
    streak,
    tasks,
    topics,
    ownedRooms,
    joinedRooms: joinedRooms.filter((r) => r.owner_id !== userId)
  };
}

// Recent chat messages across every room, joined with author display name
// and the room name — for the moderation page.
export async function getRecentChatMessages(limit = 100) {
  const supabase = createSupabaseServerClient();
  const { data: messages } = await supabase
    .from("room_messages")
    .select("id, room_id, user_id, body, created_at, deleted_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  const list = messages || [];
  const userIds = Array.from(new Set(list.map((m) => m.user_id).filter(Boolean) as string[]));
  const roomIds = Array.from(new Set(list.map((m) => m.room_id)));

  const [profilesResult, roomsResult] = await Promise.all([
    userIds.length
      ? supabase.from("profiles").select("id, display_name, email").in("id", userIds)
      : Promise.resolve({ data: [] as { id: string; display_name: string | null; email: string }[] }),
    roomIds.length
      ? supabase.from("study_rooms").select("id, name, code").in("id", roomIds)
      : Promise.resolve({ data: [] as { id: string; name: string; code: string }[] })
  ]);

  const profileMap = new Map((profilesResult.data || []).map((p) => [p.id, p]));
  const roomMap = new Map((roomsResult.data || []).map((r) => [r.id, r]));

  return list.map((m) => ({
    ...m,
    authorLabel:
      (m.user_id && (profileMap.get(m.user_id)?.display_name || profileMap.get(m.user_id)?.email)) ||
      "—",
    authorId: m.user_id,
    roomLabel: roomMap.get(m.room_id)?.name || "(deleted room)",
    roomCode: roomMap.get(m.room_id)?.code || ""
  }));
}

// All rooms for the rooms admin page, with member counts.
export async function getAdminRooms() {
  const supabase = createSupabaseServerClient();
  const [roomsResult, membersResult, ownersResult] = await Promise.all([
    supabase
      .from("study_rooms")
      .select(
        "id, code, name, owner_id, is_open, ended_at, created_at, chat_closed, focus_minutes, timer_mode"
      )
      .order("created_at", { ascending: false }),
    supabase.from("study_room_members").select("room_id"),
    supabase.from("profiles").select("id, display_name, email")
  ]);

  const rooms = roomsResult.data || [];
  const members = membersResult.data || [];
  const owners = ownersResult.data || [];

  const memberCount = new Map<string, number>();
  for (const m of members) memberCount.set(m.room_id, (memberCount.get(m.room_id) || 0) + 1);
  const ownerMap = new Map(owners.map((o) => [o.id, o]));

  return rooms.map((r) => ({
    ...r,
    member_count: memberCount.get(r.id) || 0,
    owner: ownerMap.get(r.owner_id) || null
  }));
}
