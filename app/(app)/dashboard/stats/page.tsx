import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsContent, type StatsContentProps } from "@/components/dashboard/StatsContent";
import { requireUser } from "@/lib/auth/guards";
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

export default async function StatsPage() {
  const { user, profile } = await requireUser();
  const supabase = createSupabaseServerClient();

  const today = new Date();
  // ~16-week window (116 days) so the full-page meadow has real history to show.
  // One indexed (user_id, studied_on) range scan, no migration. The 7-day chart
  // and 14-day rollups below slice their own narrower windows from this array.
  const statsWindowStart = new Date(today);
  statsWindowStart.setDate(today.getDate() - 115);

  const [{ data: sessions }, { data: settings }] = await Promise.all([
    supabase
      .from("study_sessions")
      .select("id, minutes, mode, studied_on, created_at, topic_name, task_name, focus_score")
      .eq("user_id", user.id)
      .gte("studied_on", isoDate(statsWindowStart))
      .order("created_at", { ascending: false }),
    supabase
      .from("user_settings")
      .select("daily_goal_minutes, lifetime_focus_minutes")
      .eq("user_id", user.id)
      .maybeSingle()
  ]);

  const recent: SessionRow[] = (sessions as SessionRow[]) || [];
  const focusRows = recent.filter((r) => r.mode === "focus");
  const dailyGoal = settings?.daily_goal_minutes ?? 90;
  const lifetimeMinutes = settings?.lifetime_focus_minutes ?? 0;

  // ── Last 7 days (focus minutes per local-ish stored day) ───────────────────
  const last7: { date: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const minutes = focusRows.filter((s) => s.studied_on === iso).reduce((a, s) => a + s.minutes, 0);
    last7.push({ date: iso, minutes });
  }
  const todayIso = isoDate(today);
  const todayMinutes = last7.find((d) => d.date === todayIso)?.minutes ?? 0;
  const weekMinutes = last7.reduce((a, d) => a + d.minutes, 0);

  // ── Streak (consecutive studied days ending today or yesterday) ────────────
  let streak = 0;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const has = focusRows.some((s) => s.studied_on === iso && s.minutes > 0);
    if (has) streak++;
    else if (i === 0) continue;
    else break;
  }

  // ── Full topic breakdown (all topics by focus minutes, biggest first) ──────
  // The full page renders the complete list under "Everything you studied", so
  // we do NOT slice here. The hero and chips only read the first entry.
  const topicTotals = new Map<string, number>();
  for (const s of focusRows) {
    const k = s.topic_name || "General study";
    topicTotals.set(k, (topicTotals.get(k) || 0) + s.minutes);
  }
  const topTopics: [string, number][] = Array.from(topicTotals.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  const goalPct = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));

  const statsProps: Omit<StatsContentProps, "onCloseHref"> = {
    todayMinutes,
    weekMinutes,
    streak,
    lifetimeMinutes,
    dailyGoal,
    goalPct,
    last7,
    topTopics,
    recent,
    todayIso,
    // Full ~16-week window of sessions. StatsContent computes the meadow, hour
    // histogram, streaks and deep sections client-side from this using the
    // browser's local time, so the viewer's timezone is always correct.
    sessions: focusRows.map((s) => ({
      id: s.id,
      minutes: s.minutes,
      mode: s.mode,
      studied_on: s.studied_on,
      created_at: s.created_at,
      topic_name: s.topic_name,
      focus_score: s.focus_score
    }))
  };

  return (
    <DashboardShell
      title="Your stats"
      subtitle="Quiet pride. Here is the longer view of your study, kept calmly over time."
      profile={profile}
    >
      <StatsContent {...statsProps} variant="full" />
    </DashboardShell>
  );
}
