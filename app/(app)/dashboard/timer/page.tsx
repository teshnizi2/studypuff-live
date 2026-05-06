import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { requireUser } from "@/lib/auth/guards";
import { addStudySessionAction } from "@/lib/app-data/actions";
import { getUserWorkspace } from "@/lib/app-data/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TimerPage() {
  const { user, profile } = await requireUser();
  const workspace = await getUserWorkspace(user.id);
  const settings = workspace.settings;

  const focusMinutes = settings?.focus_minutes ?? 25;
  const shortBreakMinutes = settings?.short_break_minutes ?? 5;
  const longBreakMinutes = settings?.long_break_minutes ?? 20;

  const supabase = createSupabaseServerClient();
  const { data: equipped } = await supabase
    .from("user_settings")
    .select("equipped_sound, equipped_accessory")
    .eq("user_id", user.id)
    .single();

  const tasks = workspace.tasks
    .filter((t) => !t.done)
    .map((t) => ({ id: t.id, text: t.text }));
  const topics = workspace.topics.map((t) => ({ id: t.id, name: t.name }));

  return (
    <DashboardShell
      title="Focus timer"
      subtitle="A cozy circle, a sheep in the middle, and a little chime when you finish. Keep going."
      profile={profile}
    >
      <TimerCircle
        focusMinutes={focusMinutes}
        shortBreakMinutes={shortBreakMinutes}
        longBreakMinutes={longBreakMinutes}
        todayMinutes={workspace.todayMinutes}
        tasks={tasks}
        topics={topics}
        taskId=""
        topicId=""
        onComplete={addStudySessionAction}
        equippedSound={equipped?.equipped_sound ?? null}
        equippedAccessory={equipped?.equipped_accessory ?? null}
      />
    </DashboardShell>
  );
}
