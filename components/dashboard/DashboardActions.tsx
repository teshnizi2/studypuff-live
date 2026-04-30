"use client";

import { useState } from "react";
import {
  ListChecks,
  Users,
  FolderTree,
  Settings as SettingsIcon,
  Sparkles,
  BarChart3,
  User as UserIcon,
  Trash2,
  Plus
} from "lucide-react";
import { Dialog } from "./Dialog";
import {
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
};

type ModalKey = "tasks" | "rooms" | "topics" | "settings" | "profile" | null;

export function DashboardActions(props: Props) {
  const [open, setOpen] = useState<ModalKey>(null);
  const close = () => setOpen(null);

  const openTasks = props.tasks.filter((t) => !t.done).length;
  const activeRooms = props.rooms.filter((r) => !r.ended_at).length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ActionTile
          Icon={ListChecks}
          tone="bg-brand-butter text-amber-700"
          label="Tasks"
          hint={openTasks === 0 ? "Inbox zero" : `${openTasks} open`}
          onClick={() => setOpen("tasks")}
        />
        <ActionTile
          Icon={Users}
          tone="bg-brand-sky text-sky-800"
          label="Rooms"
          hint={activeRooms === 0 ? "None active" : `${activeRooms} active`}
          onClick={() => setOpen("rooms")}
        />
        <ActionTile
          Icon={FolderTree}
          tone="bg-brand-mint text-emerald-800"
          label="Topics"
          hint={`${props.topics.length} ${props.topics.length === 1 ? "topic" : "topics"}`}
          onClick={() => setOpen("topics")}
        />
        <ActionTile
          Icon={UserIcon}
          tone="bg-brand-pink text-rose-700"
          label="Profile"
          hint={props.profile.display_name || "Set up"}
          onClick={() => setOpen("profile")}
        />
        <ActionTile
          Icon={SettingsIcon}
          tone="bg-brand-lilac text-violet-800"
          label="Settings"
          hint={`${props.settings?.focus_minutes ?? 25} min focus`}
          onClick={() => setOpen("settings")}
        />
        <ActionTile
          Icon={Sparkles}
          tone="bg-brand-peach text-orange-700"
          label="Rewards"
          hint={`${props.coins} coins`}
          href="/dashboard/rewards"
        />
      </div>
      <a
        href="/dashboard/stats"
        className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-700 hover:text-ink-900"
      >
        <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden /> Full stats →
      </a>

      {/* Tasks dialog */}
      <Dialog open={open === "tasks"} onClose={close} title="Tasks" description="Add, complete, and clean up your task list." size="md">
        <form action={createTaskAction} className="flex flex-wrap gap-2">
          <input
            name="text"
            required
            maxLength={280}
            placeholder="What's next?"
            className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-2.5 text-sm"
          />
          <select name="priority" defaultValue="normal" className="rounded-2xl border border-ink-900/15 bg-cream-100 px-3 py-2.5 text-sm">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          {props.topics.length > 0 && (
            <select name="topic_id" defaultValue="" className="rounded-2xl border border-ink-900/15 bg-cream-100 px-3 py-2.5 text-sm">
              <option value="">No topic</option>
              {props.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
          <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
            <Plus className="h-4 w-4" strokeWidth={2} aria-hidden /> Add
          </button>
        </form>

        <ul className="mt-5 space-y-2">
          {props.tasks.length === 0 && (
            <li className="rounded-2xl bg-cream-100 px-4 py-3 text-sm text-ink-700">
              Nothing on the list yet. Add your first task above.
            </li>
          )}
          {props.tasks.map((t) => (
            <li
              key={t.id}
              className={`flex items-center justify-between gap-3 rounded-2xl bg-cream-100 px-4 py-2.5 text-sm ${t.done ? "opacity-60" : ""}`}
            >
              <form action={toggleTaskAction} className="flex flex-1 items-center gap-3">
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="done" value={String(t.done)} />
                <button
                  type="submit"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${t.done ? "bg-ink-900 border-ink-900 text-cream-50" : "border-ink-900/30"}`}
                  aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                >
                  {t.done ? "✓" : ""}
                </button>
                <span className={`flex-1 ${t.done ? "line-through" : ""}`}>{t.text}</span>
              </form>
              <span className="hidden text-[10px] uppercase tracking-widest text-ink-700 sm:inline">{t.priority}</span>
              <form action={deleteTaskAction}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-ink-700 hover:text-red-700" aria-label="Delete task">
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      </Dialog>

      {/* Rooms dialog */}
      <Dialog open={open === "rooms"} onClose={close} title="Study rooms" description="Join with a code, see your active rooms, or jump into one." size="md">
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

      {/* Topics dialog */}
      <Dialog open={open === "topics"} onClose={close} title="Topics" description="Group tasks by topic to track progress." size="sm">
        <form action={createTopicAction} className="flex gap-2">
          <input
            name="name"
            required
            maxLength={120}
            placeholder="e.g. Calculus"
            className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-2.5 text-sm"
          />
          <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
            <Plus className="h-4 w-4" strokeWidth={2} aria-hidden /> Add
          </button>
        </form>
        <ul className="mt-4 flex flex-wrap gap-2">
          {props.topics.length === 0 && (
            <li className="text-sm text-ink-700">No topics yet — add one above.</li>
          )}
          {props.topics.map((t) => (
            <li key={t.id} className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-3 py-1.5 text-sm text-ink-900">
              {t.name}
              <form action={deleteTopicAction}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-ink-700 hover:text-red-700" aria-label={`Delete topic ${t.name}`}>
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      </Dialog>

      {/* Settings dialog */}
      <Dialog open={open === "settings"} onClose={close} title="Timer settings" description="Tune the durations and ambient defaults." size="sm">
        <form action={updateSettingsAction} className="grid gap-4">
          <div className="grid grid-cols-3 gap-3">
            <NumField name="focus_minutes" label="Focus" defaultValue={props.settings?.focus_minutes ?? 25} />
            <NumField name="short_break_minutes" label="Short break" defaultValue={props.settings?.short_break_minutes ?? 5} />
            <NumField name="long_break_minutes" label="Long break" defaultValue={props.settings?.long_break_minutes ?? 20} />
          </div>
          <NumField name="daily_goal_minutes" label="Daily goal (min)" defaultValue={props.settings?.daily_goal_minutes ?? 90} />
          <label className="flex items-center gap-3 text-sm font-semibold text-ink-900">
            <input name="auto_cycle" type="checkbox" defaultChecked={props.settings?.auto_cycle ?? false} />
            Auto-cycle focus and breaks
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-ink-900">
            <input name="chime" type="checkbox" defaultChecked={props.settings?.chime ?? true} />
            Play session chime
          </label>
          <button type="submit" className="btn-primary w-fit text-sm">
            Save settings
          </button>
        </form>
      </Dialog>

      {/* Profile dialog */}
      <Dialog open={open === "profile"} onClose={close} title="Your profile" description="What other StudyPuffs see when you join their room." size="lg">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-700">Avatar</p>
            <div className="mt-3 flex flex-col items-center gap-3">
              <div className="h-28 w-28 overflow-hidden rounded-full border border-ink-900/10 bg-brand-butter/40">
                {props.profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={props.profile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-3xl text-ink-900">
                    {(props.profile.display_name || props.profile.email).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <form action={uploadAvatarAction} encType="multipart/form-data" className="flex w-full flex-col gap-2">
                <input
                  type="file"
                  name="avatar"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  required
                  className="block w-full text-xs text-ink-700 file:mr-3 file:rounded-full file:border-0 file:bg-brand-butter file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink-900"
                />
                <button type="submit" className="btn-primary w-full text-sm">
                  Upload new
                </button>
              </form>
              {props.profile.avatar_url && (
                <form action={removeAvatarAction} className="w-full">
                  <button type="submit" className="btn-outline w-full text-xs">
                    Remove avatar
                  </button>
                </form>
              )}
              <p className="text-center text-[10px] text-ink-700">PNG/JPG/WEBP/GIF · 5 MB max</p>
            </div>
          </section>

          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-700">Personal info</p>
            <p className="mt-1 text-xs text-ink-700">Email: {props.profile.email}</p>
            <form action={updateProfileAction} className="mt-3 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field name="display_name" label="Display name" defaultValue={props.profile.display_name || ""} placeholder="How you appear to others" />
                <Field name="username" label="Username" defaultValue={props.profile.username || ""} placeholder="lowercase, 3-24" hint="letters, numbers, _" />
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
              <label className="block text-sm font-semibold text-ink-900">
                Bio
                <textarea
                  name="bio"
                  defaultValue={props.profile.bio || ""}
                  maxLength={500}
                  rows={3}
                  placeholder="A short blurb about you (max 500 chars)"
                  className="mt-1 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-3 py-2 text-sm"
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

function ActionTile({
  Icon,
  tone,
  label,
  hint,
  onClick,
  href
}: {
  Icon: typeof ListChecks;
  tone: string;
  label: string;
  hint: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="font-display text-base leading-tight text-ink-900">{label}</p>
        <p className="mt-0.5 text-xs text-ink-700">{hint}</p>
      </div>
    </>
  );
  const cls =
    "group flex h-full items-center gap-3 rounded-2xl border border-ink-900/10 bg-cream-50 px-4 py-3.5 text-left shadow-soft transition hover:-translate-y-0.5 hover:bg-cream-100";
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  type = "text",
  maxLength
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  hint?: string;
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
      {hint && <span className="mt-1 block text-[10px] font-normal normal-case tracking-normal text-ink-700">{hint}</span>}
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
