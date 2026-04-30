import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { requireUser } from "@/lib/auth/guards";
import { getUserWorkspace } from "@/lib/app-data/queries";
import { getMyRooms } from "@/lib/app-data/rooms";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  const workspace = await getUserWorkspace(user.id);
  const myRooms = await getMyRooms();

  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase
    .from("user_settings")
    .select(
      "focus_minutes, short_break_minutes, long_break_minutes, daily_goal_minutes, ambient, chime, auto_cycle, coins, equipped_sound, equipped_accessory"
    )
    .eq("user_id", user.id)
    .single();
  const { data: profileFull } = await supabase
    .from("profiles")
    .select(
      "id, email, display_name, username, bio, avatar_url, pronouns, study_field, school, year_level, city, time_zone, favorite_subjects, birthday"
    )
    .eq("id", user.id)
    .single();

  return (
    <DashboardShell profile={profile}>
      <div className="mx-auto w-full">
        <DashboardActions
          userId={user.id}
          tasks={workspace.tasks.map((t) => ({
            id: t.id,
            text: t.text,
            done: t.done,
            priority: t.priority,
            topic_id: t.topic_id
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
        />
      </div>
    </DashboardShell>
  );
}
