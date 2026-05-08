import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { requireUser } from "@/lib/auth/guards";
import { getUserWorkspace } from "@/lib/app-data/queries";
import { getMyRooms } from "@/lib/app-data/rooms";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SessionRow = {
  id: string;
  minutes: number;
  mode: string;
  studied_on: string;
  created_at: string;
  topic_name: string | null;
  task_name: string | null;
  focus_score: number | null;
};

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  const workspace = await getUserWorkspace(user.id);
  const myRooms = await getMyRooms();

  const supabase = createSupabaseServerClient();

  const today = new Date();
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 13);

  const [
    { data: settings },
    { data: profileFull },
    { data: sessions },
    { data: purchases }
  ] = await Promise.all([
    supabase
      .from("user_settings")
      .select(
        "focus_minutes, short_break_minutes, long_break_minutes, daily_goal_minutes, ambient, chime, auto_cycle, coins, equipped_sound, equipped_accessory, equipped_theme, lifetime_focus_minutes"
      )
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("profiles")
      .select(
        "id, email, display_name, username, bio, avatar_url, pronouns, study_field, school, year_level, city, time_zone, favorite_subjects, birthday"
      )
      .eq("id", user.id)
      .single(),
    supabase
      .from("study_sessions")
      .select("id, minutes, mode, studied_on, created_at, topic_name, task_name, focus_score")
      .eq("user_id", user.id)
      .gte("studied_on", isoDate(fourteenDaysAgo))
      .order("created_at", { ascending: false }),
    supabase.from("user_purchases").select("item_id").eq("user_id", user.id)
  ]);

  // Build the same stats numbers the dedicated /stats page builds
  const recent: SessionRow[] = (sessions as SessionRow[]) || [];
  const dailyGoal = settings?.daily_goal_minutes ?? 90;
  const lifetimeMinutes = settings?.lifetime_focus_minutes ?? 0;

  const last7: { date: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const minutes = recent
      .filter((s) => s.studied_on === iso && s.mode === "focus")
      .reduce((a, s) => a + s.minutes, 0);
    last7.push({ date: iso, minutes });
  }

  const todayIso = isoDate(today);
  const todayMinutesStat = last7.find((d) => d.date === todayIso)?.minutes ?? 0;
  const weekMinutes = last7.reduce((a, d) => a + d.minutes, 0);

  let streak = 0;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const has = recent.some((s) => s.studied_on === iso && s.mode === "focus" && s.minutes > 0);
    if (has) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  const topicTotals = new Map<string, number>();
  for (const s of recent.filter((r) => r.mode === "focus")) {
    const k = s.topic_name || "General study";
    topicTotals.set(k, (topicTotals.get(k) || 0) + s.minutes);
  }
  const topTopics = Array.from(topicTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Pull a wider window of focus sessions so we can attribute minutes back
  // to the actual task / topic ids in the sidebar. Last 90 days is enough
  // for a "this is how much you've spent" feel without overshooting.
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 89);
  const { data: attributedSessions } = await supabase
    .from("study_sessions")
    .select("minutes, topic_id, task_id, mode")
    .eq("user_id", user.id)
    .eq("mode", "focus")
    .gte("studied_on", isoDate(ninetyDaysAgo));

  const minutesByTopic: Record<string, number> = {};
  const minutesByTask: Record<string, number> = {};
  for (const s of attributedSessions || []) {
    if (s.topic_id) minutesByTopic[s.topic_id] = (minutesByTopic[s.topic_id] || 0) + s.minutes;
    if (s.task_id)  minutesByTask[s.task_id]  = (minutesByTask[s.task_id]  || 0) + s.minutes;
  }

  const goalPct = Math.min(100, Math.round((todayMinutesStat / dailyGoal) * 100));

  return (
    <DashboardShell profile={profile} bg="green" fullBleed>
      <div className="w-full">
        <DashboardActions
          userId={user.id}
          tasks={workspace.tasks.map((t) => ({
            id: t.id,
            text: t.text,
            done: t.done,
            priority: t.priority,
            topic_id: t.topic_id,
            due_date: t.due_date,
            notes: t.notes
          }))}
          topics={workspace.topics.map((t) => ({ id: t.id, name: t.name }))}
          rooms={myRooms.map((r) => ({
            id: r.id,
            code: r.code,
            name: r.name,
            is_open: r.is_open,
            ended_at: r.ended_at,
            owner_id: r.owner_id
          }))}
          settings={
            settings
              ? {
                  focus_minutes: settings.focus_minutes,
                  short_break_minutes: settings.short_break_minutes,
                  long_break_minutes: settings.long_break_minutes,
                  daily_goal_minutes: settings.daily_goal_minutes,
                  ambient: settings.ambient,
                  chime: settings.chime,
                  auto_cycle: settings.auto_cycle
                }
              : null
          }
          profile={
            profileFull
              ? profileFull
              : {
                  id: user.id,
                  email: user.email || "",
                  display_name: null,
                  username: null,
                  bio: null,
                  avatar_url: null,
                  pronouns: null,
                  study_field: null,
                  school: null,
                  year_level: null,
                  city: null,
                  time_zone: null,
                  favorite_subjects: null,
                  birthday: null
                }
          }
          coins={settings?.coins ?? 0}
          todayMinutes={workspace.todayMinutes}
          equippedSound={settings?.equipped_sound ?? null}
          equippedAccessory={settings?.equipped_accessory ?? null}
          minutesByTopic={minutesByTopic}
          minutesByTask={minutesByTask}
          stats={{
            todayMinutes: todayMinutesStat,
            weekMinutes,
            streak,
            lifetimeMinutes,
            dailyGoal,
            goalPct,
            last7,
            topTopics,
            recent,
            todayIso
          }}
          rewards={{
            coins: settings?.coins ?? 0,
            lifetimeMinutes,
            ownedItemIds: (purchases || []).map((p) => p.item_id),
            equippedSound: settings?.equipped_sound ?? null,
            equippedTheme: settings?.equipped_theme ?? null,
            equippedAccessory: settings?.equipped_accessory ?? null
          }}
        />
      </div>
    </DashboardShell>
  );
}
