"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Dialog } from "./Dialog";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { TaskPanel } from "./TaskPanel";
import { LeavesAccent } from "./LeavesAccent";
import { SoundDock, type TimerSoundMode } from "./SoundDock";
import {
  addStudySessionAction,
  createTaskAction,
  createTopicAction,
  deleteTaskAction,
  deleteTopicAction,
  toggleTaskAction,
  updateProfileAction,
  updateSettingsAction,
  uploadAvatarAction,
  removeAvatarAction
} from "@/lib/app-data/actions";
import { joinRoomAction, leaveRoomAction } from "@/lib/app-data/rooms";

type TaskRow = {
  id: string;
  text: string;
  done: boolean;
  priority: string;
  topic_id: string | null;
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
};

type ModalKey = "tasks" | "rooms" | "settings" | null;

export function DashboardActions(props: Props) {
  const [open, setOpen] = useState<ModalKey>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string>("");
  const [currentTopicId, setCurrentTopicId] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerSoundMode>("focus");
  const defaultSound = props.equippedSound ?? "sound-lofi";
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

  // Group tasks by topic for the Tasks dialog (legacy modal; still used)
  const tasksByTopic = new Map<string | null, TaskRow[]>();
  for (const t of props.tasks) tasksByTopic.set(t.topic_id, [...(tasksByTopic.get(t.topic_id) || []), t]);

  return (
    <>
      <div className="bg-paper-grain relative">
        <LeavesAccent />

        {/* Tasks LEFT, timer RIGHT — flowing two-column */}
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-x-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
          {/* Tasks panel — LEFT (mobile: 2nd, lg: 1st) */}
          <div className="order-2 lg:order-1 lg:max-w-[640px]">
            <TaskPanel
              tasks={props.tasks.map((t) => ({
                id: t.id, text: t.text, done: t.done, topic_id: t.topic_id
              }))}
              topics={props.topics.map((t) => ({ id: t.id, name: t.name }))}
              todayMinutes={props.todayMinutes}
              currentTaskId={currentTaskId}
              currentTopicId={currentTopicId}
              onSelectTask={handleSelectTask}
              onSelectTopic={handleSelectTopic}
              onCreateTask={createTaskAction}
              onCreateTopic={createTopicAction}
              onToggleTask={toggleTaskAction}
              onDeleteTask={deleteTaskAction}
              onDeleteTopic={deleteTopicAction}
            />
          </div>

          {/* Timer — RIGHT, sticky on lg+ */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
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
                onSettingsClick={() => setOpen("settings")}
                onRoomsClick={() => setOpen("rooms")}
                onModeChange={(m) => setTimerMode(m as TimerSoundMode)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating sound dock — bottom center, persistent */}
      <SoundDock
        sound={sound}
        playing={running && !!sound}
        onSelect={handleSelectActiveSound}
        onTogglePlay={() => setRunning((r) => !r)}
        timerMode={timerMode}
        soundsByMode={soundsByMode}
        onSelectForMode={handleSelectSoundForMode}
      />

      {/* Tasks + Topics dialog (tasks live inside topics) */}
      <Dialog
        open={open === "tasks"}
        onClose={close}
        title="Tasks & Topics"
        description="Topics are folders. Tasks live inside them. Use 'No topic' for one-off items."
        size="md"
      >
        <form action={createTaskAction} className="rounded-2xl bg-cream-100 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-700">
            Quick add task
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              name="text"
              required
              maxLength={280}
              placeholder="What's next?"
              className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-2.5 text-sm"
            />
            <select
              name="priority"
              defaultValue="normal"
              className="rounded-2xl border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <select
              name="topic_id"
              defaultValue=""
              className="rounded-2xl border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm"
            >
              <option value="">No topic</option>
              {props.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden /> Add
            </button>
          </div>
        </form>

        <div className="mt-5 space-y-4">
          {props.topics.map((topic) => {
            const items = tasksByTopic.get(topic.id) || [];
            return (
              <TopicGroup key={topic.id} topic={topic} items={items} />
            );
          })}

          {/* No-topic group */}
          <NoTopicGroup items={tasksByTopic.get(null) || []} />
        </div>

        <form action={createTopicAction} className="mt-5 flex gap-2 rounded-2xl bg-cream-100 p-3">
          <input
            name="name"
            required
            maxLength={120}
            placeholder="New topic name (e.g. Calculus)"
            className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-2.5 text-sm"
          />
          <button type="submit" className="btn-outline px-4 py-2.5 text-sm">
            <Plus className="h-4 w-4" strokeWidth={2} aria-hidden /> Topic
          </button>
        </form>
      </Dialog>

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

      {/* Settings + Profile dialog */}
      <Dialog
        open={open === "settings"}
        onClose={close}
        title="Settings & profile"
        description="Tune the timer and update what other StudyPuffs see when you join their room."
        size="lg"
      >
        <div className="grid gap-8 lg:grid-cols-2">
          {/* TIMER SETTINGS */}
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-700">
              Timer settings
            </p>
            <form action={updateSettingsAction} className="grid gap-3">
              <div className="grid grid-cols-3 gap-2">
                <NumField name="focus_minutes" label="Focus" defaultValue={props.settings?.focus_minutes ?? 25} />
                <NumField name="short_break_minutes" label="Short" defaultValue={props.settings?.short_break_minutes ?? 5} />
                <NumField name="long_break_minutes" label="Long" defaultValue={props.settings?.long_break_minutes ?? 20} />
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
          </section>

          {/* PROFILE */}
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-700">
              Profile
            </p>

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

            <form action={updateProfileAction} className="mt-3 grid gap-3">
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
          </section>
        </div>
      </Dialog>
    </>
  );
}

function TopicGroup({ topic, items }: { topic: TopicRow; items: TaskRow[] }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base text-ink-900">
          {topic.name}{" "}
          <span className="text-xs font-normal text-ink-700">
            ({items.length} {items.length === 1 ? "task" : "tasks"})
          </span>
        </h3>
        <form action={deleteTopicAction}>
          <input type="hidden" name="id" value={topic.id} />
          <button
            type="submit"
            className="text-ink-700 hover:text-red-700"
            aria-label={`Delete topic ${topic.name}`}
            title="Delete topic"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </form>
      </div>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-ink-700">No tasks yet — use the Quick add above and pick this topic.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((t) => (
            <TaskItem key={t.id} task={t} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NoTopicGroup({ items }: { items: TaskRow[] }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-900/15 bg-cream-50 p-3">
      <h3 className="font-display text-base text-ink-900/70">
        No topic{" "}
        <span className="text-xs font-normal text-ink-700">
          ({items.length})
        </span>
      </h3>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-ink-700">One-off tasks land here.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((t) => (
            <TaskItem key={t.id} task={t} />
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskItem({ task }: { task: TaskRow }) {
  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-xl bg-cream-100 px-3 py-2 text-sm ${task.done ? "opacity-60" : ""}`}
    >
      <form action={toggleTaskAction} className="flex flex-1 items-center gap-3">
        <input type="hidden" name="id" value={task.id} />
        <input type="hidden" name="done" value={String(task.done)} />
        <button
          type="submit"
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${task.done ? "border-ink-900 bg-ink-900 text-cream-50" : "border-ink-900/30"}`}
          aria-label={task.done ? "Mark incomplete" : "Mark complete"}
        >
          {task.done ? "✓" : ""}
        </button>
        <span className={`flex-1 ${task.done ? "line-through" : ""}`}>{task.text}</span>
      </form>
      <span className="hidden text-[10px] uppercase tracking-widest text-ink-700 sm:inline">{task.priority}</span>
      <form action={deleteTaskAction}>
        <input type="hidden" name="id" value={task.id} />
        <button type="submit" className="text-ink-700 hover:text-red-700" aria-label="Delete task">
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </form>
    </li>
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
