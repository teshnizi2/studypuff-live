"use client";

import { useEffect, useState } from "react";
import { PanelLeftOpen } from "lucide-react";
import { Dialog } from "./Dialog";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { TaskPanel } from "./TaskPanel";
import { LeavesAccent } from "./LeavesAccent";
import { GrowthTree } from "./GrowthTree";
import { SoundDock, type TimerSoundMode } from "./SoundDock";
import { StatsContent, type StatsContentProps } from "./StatsContent";
import { RewardsContent, type RewardsContentProps } from "./RewardsContent";
import { PROFILE_OPEN_EVENT } from "./HeaderAvatarButton";
import { HEADER_OPEN_ROOMS, HEADER_OPEN_STATS, HEADER_OPEN_SETTINGS } from "./HeaderActions";
import {
  addStudySessionAction,
  createTaskAction,
  createTopicAction,
  deleteTaskAction,
  deleteTopicAction,
  reorderTasksAction,
  toggleTaskAction,
  updateTaskAction,
  updateProfileAction,
  updateSettingsAction,
  uploadAvatarAction,
  removeAvatarAction
} from "@/lib/app-data/actions";
import { joinRoomAction, leaveRoomAction } from "@/lib/app-data/rooms";

type TaskPriority = "low" | "normal" | "high";

type TaskRow = {
  id: string;
  text: string;
  done: boolean;
  priority: TaskPriority;
  topic_id: string | null;
  due_date: string | null;
  notes: string | null;
};

type TopicRow = { id: string; name: string };

type RoomRow = {
  id: string;
  code: string;
  name: string;
  is_open: boolean;
  ended_at: string | null;
  owner_id: string;
};

type SettingsRow = {
  focus_minutes: number;
  short_break_minutes: number;
  long_break_minutes: number;
  daily_goal_minutes: number;
  ambient: string;
  chime: boolean;
  auto_cycle: boolean;
};

type ProfileRow = {
  id: string;
  email: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  pronouns: string | null;
  study_field: string | null;
  school: string | null;
  year_level: string | null;
  city: string | null;
  time_zone: string | null;
  favorite_subjects: string | null;
  birthday: string | null;
};

type Props = {
  userId: string;
  tasks: TaskRow[];
  topics: TopicRow[];
  rooms: RoomRow[];
  settings: SettingsRow | null;
  profile: ProfileRow;
  coins: number;
  todayMinutes: number;
  equippedSound: string | null;
  equippedAccessory: string | null;
  /** Lifetime focus minutes by topic id (last 90 days). */
  minutesByTopic?: Record<string, number>;
  /** Lifetime focus minutes by task id (last 90 days). */
  minutesByTask?: Record<string, number>;
  stats?: Omit<StatsContentProps, "onCloseHref">;
  rewards?: RewardsContentProps;
  /** When true, the right-edge garden rail is suppressed so the
      RoomSidebar can take that space. Garden falls back to the inline
      under-timer position it uses on mobile. */
  inRoom?: boolean;
};

type ModalKey = "rooms" | "settings" | "stats" | "rewards" | "profile" | null;

export function DashboardActions(props: Props) {
  const [open, setOpen] = useState<ModalKey>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string>("");
  const [currentTopicId, setCurrentTopicId] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerSoundMode>("focus");
  const [sidebarHidden, setSidebarHidden] = useState(false);
  // Sound playback is independent from the timer — user can preview a sound
  // even while the timer is paused. Auto-syncs ON when timer starts.
  const [soundPlaying, setSoundPlaying] = useState(false);

  useEffect(() => {
    if (running) setSoundPlaying(true);
    else setSoundPlaying(false);
  }, [running]);

  // Restore sidebar hidden state from localStorage so focus mode persists.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem("studypuff:sidebar-hidden") === "true") {
        setSidebarHidden(true);
      }
    } catch { /* ignore */ }
  }, []);

  const setSidebarHiddenPersist = (next: boolean) => {
    setSidebarHidden(next);
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem("studypuff:sidebar-hidden", String(next)); }
      catch { /* ignore */ }
    }
  };

  // Open the profile popup when the header avatar fires the event.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setOpen("profile");
    window.addEventListener(PROFILE_OPEN_EVENT, handler);
    return () => window.removeEventListener(PROFILE_OPEN_EVENT, handler);
  }, []);

  // Listen for the header pills (Rooms / Stats / Settings) which live in
  // DashboardShell and dispatch via custom events.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onRooms    = () => setOpen("rooms");
    const onStats    = () => setOpen("stats");
    const onSettings = () => setOpen("settings");
    window.addEventListener(HEADER_OPEN_ROOMS,    onRooms);
    window.addEventListener(HEADER_OPEN_STATS,    onStats);
    window.addEventListener(HEADER_OPEN_SETTINGS, onSettings);
    return () => {
      window.removeEventListener(HEADER_OPEN_ROOMS,    onRooms);
      window.removeEventListener(HEADER_OPEN_STATS,    onStats);
      window.removeEventListener(HEADER_OPEN_SETTINGS, onSettings);
    };
  }, []);
  const defaultSound = props.equippedSound ?? "sound-rain";
  const [soundsByMode, setSoundsByMode] = useState<Record<TimerSoundMode, string | null>>({
    focus: defaultSound,
    short: "sound-rain",
    long: "sound-ocean"
  });

  // Restore per-mode sound prefs from localStorage on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("studypuff:sounds-by-mode");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setSoundsByMode((prev) => ({
          focus: typeof parsed.focus !== "undefined" ? parsed.focus : prev.focus,
          short: typeof parsed.short !== "undefined" ? parsed.short : prev.short,
          long:  typeof parsed.long  !== "undefined" ? parsed.long  : prev.long
        }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistSounds = (next: Record<TimerSoundMode, string | null>) => {
    setSoundsByMode(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("studypuff:sounds-by-mode", JSON.stringify(next));
      } catch {
        /* ignore quota / private mode */
      }
    }
  };

  const handleSelectSoundForMode = (mode: TimerSoundMode, id: string | null) => {
    persistSounds({ ...soundsByMode, [mode]: id });
  };

  const handleSelectActiveSound = (id: string | null) => {
    persistSounds({ ...soundsByMode, [timerMode]: id });
  };

  const sound = soundsByMode[timerMode];
  const close = () => setOpen(null);

  const handleSelectTask = (taskId: string, topicId: string) => {
    setCurrentTaskId(taskId);
    if (topicId) setCurrentTopicId(topicId);
    else if (!taskId) setCurrentTopicId("");
  };

  const handleSelectTopic = (topicId: string) => {
    setCurrentTopicId(topicId);
    if (currentTaskId) {
      const task = props.tasks.find((t) => t.id === currentTaskId);
      if (!task || task.topic_id !== topicId) setCurrentTaskId("");
    }
  };

  return (
    <>
      {/* Layout — desktop:
            Two fixed-position rails (sidebar left, garden right) live OUTSIDE
            the document flow, so toggling the sidebar can never shift the
            timer. The timer is centered in the viewport, always.
          Mobile:
            Stacks naturally — sidebar above, then timer, then garden — since
            the rails fall back to inline rendering below the lg breakpoint. */}
      <div className="bg-paper-grain relative min-h-[calc(100vh-100px)] pb-28">
        <LeavesAccent />

        {/* Sidebar — desktop only, fixed flush to the left edge of the viewport.
            Slides off when hidden; the column the timer occupies never changes. */}
        <aside
          aria-label="Topics & tasks"
          className={`fixed left-0 top-[100px] z-20 hidden h-[calc(100vh-120px)] w-[300px] overflow-y-auto px-5 pb-10 pt-2 transition-transform duration-300 ease-out lg:block ${
            sidebarHidden ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <TaskPanel
            tasks={props.tasks.map((t) => ({
              id: t.id, text: t.text, done: t.done, topic_id: t.topic_id,
              priority: t.priority, due_date: t.due_date, notes: t.notes
            }))}
            topics={props.topics.map((t) => ({ id: t.id, name: t.name }))}
            currentTaskId={currentTaskId}
            currentTopicId={currentTopicId}
            onSelectTask={handleSelectTask}
            onSelectTopic={handleSelectTopic}
            onCreateTask={createTaskAction}
            onCreateTopic={createTopicAction}
            onToggleTask={toggleTaskAction}
            onDeleteTask={deleteTaskAction}
            onDeleteTopic={deleteTopicAction}
            onUpdateTask={updateTaskAction}
            onReorderTasks={reorderTasksAction}
            minutesByTopic={props.minutesByTopic}
            minutesByTask={props.minutesByTask}
            onHide={() => setSidebarHiddenPersist(true)}
          />
        </aside>

        {/* Garden — desktop only, fixed flush to the right edge.
            Suppressed when in a room so RoomSidebar can claim the right rail;
            the inline garden block below covers the rendering in that case. */}
        {!props.inRoom && (
          <aside
            aria-label="Garden"
            className="fixed right-0 top-[100px] z-20 hidden h-[calc(100vh-120px)] w-[300px] overflow-y-auto px-4 pb-10 pt-4 lg:block"
          >
            <GrowthTree
              lifetimeMinutes={props.stats?.lifetimeMinutes ?? 0}
              todayMinutes={props.stats?.todayMinutes ?? props.todayMinutes}
              tasksDone={props.tasks.filter((t) => t.done).length}
              streak={props.stats?.streak ?? 0}
            />
          </aside>
        )}

        {/* Mobile sidebar + garden — stacked above the timer below lg. */}
        <div className="flex flex-col gap-10 px-4 pt-6 lg:hidden">
          <TaskPanel
            tasks={props.tasks.map((t) => ({
              id: t.id, text: t.text, done: t.done, topic_id: t.topic_id,
              priority: t.priority, due_date: t.due_date, notes: t.notes
            }))}
            topics={props.topics.map((t) => ({ id: t.id, name: t.name }))}
            currentTaskId={currentTaskId}
            currentTopicId={currentTopicId}
            onSelectTask={handleSelectTask}
            onSelectTopic={handleSelectTopic}
            onCreateTask={createTaskAction}
            onCreateTopic={createTopicAction}
            onToggleTask={toggleTaskAction}
            onDeleteTask={deleteTaskAction}
            onDeleteTopic={deleteTopicAction}
            onUpdateTask={updateTaskAction}
            onReorderTasks={reorderTasksAction}
            minutesByTopic={props.minutesByTopic}
            minutesByTask={props.minutesByTask}
          />
        </div>

        {/* Timer — centered in the viewport on every screen size.
            Position is independent of sidebar visibility. */}
        <div className="flex justify-center pt-6 lg:pt-10">
          <div className="journal-rise jrise-2">
            <TimerCircle
              focusMinutes={props.settings?.focus_minutes ?? 25}
              shortBreakMinutes={props.settings?.short_break_minutes ?? 5}
              longBreakMinutes={props.settings?.long_break_minutes ?? 20}
              todayMinutes={props.todayMinutes}
              dailyGoalMinutes={props.settings?.daily_goal_minutes ?? 0}
              tasks={props.tasks.filter((t) => !t.done).map((t) => ({ id: t.id, text: t.text }))}
              topics={props.topics.map((t) => ({ id: t.id, name: t.name }))}
              taskId={currentTaskId}
              topicId={currentTopicId}
              running={running}
              onRunningChange={setRunning}
              onComplete={addStudySessionAction}
              equippedAccessory={props.equippedAccessory}
              onModeChange={(m) => setTimerMode(m as TimerSoundMode)}
              weekly={props.stats?.last7}
            />
          </div>
        </div>

        {/* Mobile garden — under timer at small sizes. Shows at all sizes
            when in a room (since the fixed right rail is hidden then). */}
        <div className={`flex justify-center px-4 pt-10 ${props.inRoom ? "" : "lg:hidden"}`}>
          <GrowthTree
            lifetimeMinutes={props.stats?.lifetimeMinutes ?? 0}
            todayMinutes={props.stats?.todayMinutes ?? props.todayMinutes}
            tasksDone={props.tasks.filter((t) => t.done).length}
            streak={props.stats?.streak ?? 0}
          />
        </div>
      </div>

      {/* "Show tasks" tab — only visible when sidebar is hidden, anchored
          to the left edge so the timer keeps the spotlight during focus. */}
      {sidebarHidden && (
        <button
          type="button"
          onClick={() => setSidebarHiddenPersist(false)}
          aria-label="Show tasks"
          title="Show tasks"
          className="fixed left-4 top-32 z-30 flex items-center gap-2 rounded-full bg-cream-50/85 px-3 py-2 text-xs font-display italic text-ink-900 shadow-soft ring-1 ring-ink-900/10 backdrop-blur-md transition hover:-translate-y-0.5"
        >
          <PanelLeftOpen className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          Tasks
        </button>
      )}

      {/* Floating sound dock — bottom right, persistent.
          Sound is now decoupled from the timer: hitting play in the dock
          plays the chosen sound regardless of whether the timer is running. */}
      <SoundDock
        sound={sound}
        playing={soundPlaying && !!sound}
        onSelect={handleSelectActiveSound}
        onTogglePlay={() => setSoundPlaying((p) => !p)}
        timerMode={timerMode}
        soundsByMode={soundsByMode}
        onSelectForMode={handleSelectSoundForMode}
      />

      {/* Rooms dialog */}
      <Dialog
        open={open === "rooms"}
        onClose={close}
        title="Study rooms"
        description="Join with a code, see your active rooms, or jump into one."
        size="md"
      >
        <form action={joinRoomAction} className="flex gap-2">
          <input
            name="code"
            required
            maxLength={8}
            placeholder="A1B2C3"
            className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-2.5 text-sm uppercase tracking-[0.3em]"
          />
          <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
            Join
          </button>
        </form>

        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-ink-700">Active rooms</p>
        <ul className="mt-2 space-y-2">
          {props.rooms.filter((r) => !r.ended_at).length === 0 && (
            <li className="rounded-2xl bg-cream-100 px-4 py-3 text-sm text-ink-700">
              No active rooms. Create one to study with friends.
            </li>
          )}
          {props.rooms
            .filter((r) => !r.ended_at)
            .map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-cream-100 px-4 py-2.5 text-sm"
              >
                <a href={`/dashboard/rooms/${r.id}`} className="flex flex-1 items-center gap-3 text-ink-900 hover:underline">
                  <span className="font-semibold">{r.name}</span>
                  <span className="font-mono text-xs tracking-[0.3em] text-ink-700">{r.code}</span>
                </a>
                {r.owner_id !== props.userId && (
                  <form action={leaveRoomAction}>
                    <input type="hidden" name="room_id" value={r.id} />
                    <button type="submit" className="text-xs text-ink-700 underline-offset-4 hover:text-red-700 hover:underline">
                      Leave
                    </button>
                  </form>
                )}
              </li>
            ))}
        </ul>
        <a href="/dashboard/rooms" className="btn-outline mt-5 inline-flex w-fit px-4 py-2 text-sm">
          + Create new room
        </a>
      </Dialog>

      {/* Settings dialog — timer prefs only */}
      <Dialog
        open={open === "settings"}
        onClose={close}
        title="Settings"
        description="Tune your timer defaults."
        size="md"
      >
        <form action={updateSettingsAction} className="grid gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-700">
              Default durations
            </p>
            <div className="grid grid-cols-3 gap-2">
              <NumField name="focus_minutes" label="Focus" defaultValue={props.settings?.focus_minutes ?? 25} />
              <NumField name="short_break_minutes" label="Short" defaultValue={props.settings?.short_break_minutes ?? 5} />
              <NumField name="long_break_minutes" label="Long" defaultValue={props.settings?.long_break_minutes ?? 20} />
            </div>
          </div>
          <NumField name="daily_goal_minutes" label="Daily goal (min)" defaultValue={props.settings?.daily_goal_minutes ?? 90} />
          <label className="flex items-center gap-3 text-sm text-ink-900">
            <input name="auto_cycle" type="checkbox" defaultChecked={props.settings?.auto_cycle ?? false} />
            Auto-cycle focus and breaks
          </label>
          <label className="flex items-center gap-3 text-sm text-ink-900">
            <input name="chime" type="checkbox" defaultChecked={props.settings?.chime ?? true} />
            Play session chime
          </label>
          <button type="submit" className="btn-primary w-fit text-sm">
            Save settings
          </button>
        </form>
      </Dialog>

      {/* Profile dialog — opens from the header avatar */}
      <Dialog
        open={open === "profile"}
        onClose={close}
        title="Profile"
        description="What other StudyPuffs see when you join their room."
        size="lg"
      >
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-ink-900/10 bg-brand-butter/40">
            {props.profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={props.profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-2xl text-ink-900">
                {(props.profile.display_name || props.profile.email).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <form action={uploadAvatarAction} encType="multipart/form-data" className="flex flex-col gap-2">
              <input
                type="file"
                name="avatar"
                accept="image/png,image/jpeg,image/webp,image/gif"
                required
                className="block w-full text-xs text-ink-700 file:mr-3 file:rounded-full file:border-0 file:bg-brand-butter file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink-900"
              />
              <button type="submit" className="btn-primary text-sm">
                Upload avatar
              </button>
            </form>
            {props.profile.avatar_url && (
              <form action={removeAvatarAction}>
                <button type="submit" className="text-xs font-semibold text-ink-700 underline underline-offset-4 hover:text-red-700">
                  Remove avatar
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-ink-700">Email: {props.profile.email}</p>

        <form action={updateProfileAction} className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field name="display_name" label="Display name" defaultValue={props.profile.display_name || ""} placeholder="How you appear to others" />
            <Field name="username" label="Username" defaultValue={props.profile.username || ""} placeholder="lowercase, 3-24" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field name="pronouns" label="Pronouns" defaultValue={props.profile.pronouns || ""} placeholder="she/her" maxLength={40} />
            <Field name="birthday" label="Birthday" type="date" defaultValue={props.profile.birthday || ""} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field name="school" label="School" defaultValue={props.profile.school || ""} placeholder="TU Delft" maxLength={120} />
            <Field name="year_level" label="Year / level" defaultValue={props.profile.year_level || ""} placeholder="1st year MSc" maxLength={60} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field name="study_field" label="Studying" defaultValue={props.profile.study_field || ""} placeholder="Computer Science" maxLength={80} />
            <Field name="city" label="City" defaultValue={props.profile.city || ""} placeholder="Amsterdam" maxLength={80} />
          </div>
          <Field name="favorite_subjects" label="Favourite subjects" defaultValue={props.profile.favorite_subjects || ""} placeholder="Algorithms, statistics, Dutch literature" maxLength={200} />
          <Field name="time_zone" label="Time zone" defaultValue={props.profile.time_zone || ""} placeholder="Europe/Amsterdam" maxLength={60} />
          <label className="block text-xs font-semibold uppercase tracking-widest text-ink-700">
            Bio
            <textarea
              name="bio"
              defaultValue={props.profile.bio || ""}
              maxLength={500}
              rows={3}
              placeholder="A short blurb about you (max 500 chars)"
              className="mt-1 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink-900"
            />
          </label>
          <button type="submit" className="btn-primary w-fit text-sm">
            Save profile
          </button>
        </form>
      </Dialog>

      {/* Stats dialog */}
      {props.stats && (
        <Dialog
          open={open === "stats"}
          onClose={close}
          title="Your stats"
          description="Quiet pride. Two weeks at a glance."
          size="lg"
        >
          <StatsContent {...props.stats} />
        </Dialog>
      )}

      {/* Rewards dialog */}
      {props.rewards && (
        <Dialog
          open={open === "rewards"}
          onClose={close}
          title="Rewards"
          description="Earn coins by finishing focus sessions. Spend them on tiny upgrades."
          size="lg"
        >
          <RewardsContent {...props.rewards} />
        </Dialog>
      )}
    </>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
  maxLength
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-ink-700">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 block w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink-900"
      />
    </label>
  );
}

function NumField({
  name,
  label,
  defaultValue
}: {
  name: string;
  label: string;
  defaultValue: number;
}) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-ink-700">
      {label}
      <input
        name={name}
        type="number"
        min="1"
        defaultValue={defaultValue}
        className="mt-1 block w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink-900"
      />
    </label>
  );
}
