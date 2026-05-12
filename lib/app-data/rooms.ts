"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function s(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function nullable(formData: FormData, key: string) {
  const v = s(formData, key);
  return v ? v : null;
}

function n(formData: FormData, key: string, fallback: number) {
  const v = Number(s(formData, key));
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

export type RoomMemberSummary = {
  user_id: string;
  joined_at: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  is_owner: boolean;
};

export type RoomMessage = {
  id: string;
  room_id: string;
  user_id: string | null;
  body: string;
  created_at: string;
  deleted_at: string | null;
};

export async function getRoomMessages(roomId: string, limit = 200): Promise<RoomMessage[]> {
  await requireUser();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("room_messages")
    .select("id, room_id, user_id, body, created_at, deleted_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
    .limit(limit);
  return data || [];
}

export type RoomDetail = {
  id: string;
  code: string;
  owner_id: string;
  name: string;
  focus_minutes: number;
  short_break_minutes: number;
  long_break_minutes: number;
  timer_mode: "idle" | "focus" | "short" | "long";
  timer_started_at: string | null;
  timer_paused_at: string | null;
  timer_pause_offset_seconds: number;
  timer_round: number;
  chat_closed: boolean;
  is_open: boolean;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  members: RoomMemberSummary[];
  is_owner: boolean;
  is_member: boolean;
};

export async function getMyRooms() {
  const { user } = await requireUser();
  const supabase = createSupabaseServerClient();

  const { data: ownedRooms } = await supabase
    .from("study_rooms")
    .select("id, code, name, focus_minutes, is_open, ended_at, created_at, owner_id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const { data: memberRooms } = await supabase
    .from("study_room_members")
    .select(
      "room_id, joined_at, study_rooms!inner(id, code, name, focus_minutes, is_open, ended_at, created_at, owner_id)"
    )
    .eq("user_id", user.id);

  type RoomCard = {
    id: string;
    code: string;
    name: string;
    focus_minutes: number;
    is_open: boolean;
    ended_at: string | null;
    created_at: string;
    owner_id: string;
  };

  const merged = new Map<string, RoomCard>();
  for (const r of ownedRooms || []) merged.set(r.id, r);
  for (const m of memberRooms || []) {
    const r = (m as unknown as { study_rooms: RoomCard | null }).study_rooms;
    if (r && !merged.has(r.id)) merged.set(r.id, r);
  }

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// The single room the user is currently a member of, used by /dashboard to
// render the side panel. Returns null when the user is not in any room.
// With "one room at a time" semantics enforced in joinRoomAction this should
// only ever return at most one row; if the DB somehow has more, we pick the
// most recently joined one.
export async function getActiveRoom(): Promise<RoomDetail | null> {
  const { user } = await requireUser();
  const supabase = createSupabaseServerClient();
  const { data: membership } = await supabase
    .from("study_room_members")
    .select("room_id, joined_at")
    .eq("user_id", user.id)
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!membership?.room_id) return null;
  return getRoomDetail(membership.room_id);
}

export async function getRoomDetail(roomId: string): Promise<RoomDetail | null> {
  const { user } = await requireUser();
  const supabase = createSupabaseServerClient();

  const { data: room } = await supabase
    .from("study_rooms")
    .select(
      "id, code, owner_id, name, focus_minutes, short_break_minutes, long_break_minutes, timer_mode, timer_started_at, timer_paused_at, timer_pause_offset_seconds, timer_round, chat_closed, is_open, started_at, ended_at, created_at"
    )
    .eq("id", roomId)
    .single();

  if (!room) return null;

  const { data: memberRows } = await supabase
    .from("study_room_members")
    .select("user_id, joined_at")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  const userIds = (memberRows || []).map((m) => m.user_id);
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", userIds)
    : { data: [] as { id: string; display_name: string | null; username: string | null; avatar_url: string | null }[] };

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  const members: RoomMemberSummary[] = (memberRows || []).map((m) => {
    const p = profileMap.get(m.user_id);
    return {
      user_id: m.user_id,
      joined_at: m.joined_at,
      display_name: p?.display_name || null,
      username: p?.username || null,
      avatar_url: p?.avatar_url || null,
      is_owner: m.user_id === room.owner_id
    };
  });

  return {
    ...room,
    members,
    is_owner: room.owner_id === user.id,
    is_member: members.some((m) => m.user_id === user.id)
  };
}

// 6-char room code — A-Z + 2-9 (no 0/1/O/I to avoid confusion). Generated
// app-side so we don't rely on a DB DEFAULT that might be missing.
function generateRoomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function createRoomAction(formData: FormData) {
  const { user } = await requireUser();
  const name = s(formData, "name");
  if (!name) throw new Error("Give your room a name.");

  const focusMinutes = Math.min(180, Math.max(1, n(formData, "focus_minutes", 25)));
  const supabase = createSupabaseServerClient();

  // Retry a few times on the unlikely event of a code collision.
  let lastError: unknown = null;
  let roomId: string | null = null;
  for (let attempt = 0; attempt < 5 && !roomId; attempt++) {
    const { data: room, error } = await supabase
      .from("study_rooms")
      .insert({
        owner_id: user.id,
        name: name.slice(0, 80),
        focus_minutes: focusMinutes,
        topic_id: nullable(formData, "topic_id"),
        code: generateRoomCode()
      })
      .select("id")
      .single();
    if (room) {
      roomId = room.id;
      break;
    }
    lastError = error;
    // 23505 = unique_violation (code collision) → retry. Anything else, bail.
    if (!error || (error as { code?: string }).code !== "23505") break;
  }

  if (!roomId) {
    // Surface the real Supabase error to Vercel logs so future failures
    // show up as something other than an opaque digest.
    console.error("[createRoomAction] failed", lastError);
    const msg =
      lastError && typeof lastError === "object" && "message" in lastError
        ? String((lastError as { message: unknown }).message)
        : "Could not create room.";
    throw new Error(msg);
  }

  // The room lives inside /dashboard now — the chat, member list, leave button
  // are rendered as a side panel there rather than on a dedicated detail page.
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard");
}

export async function joinRoomAction(formData: FormData) {
  const { user } = await requireUser();
  const code = s(formData, "code").toUpperCase();
  if (!code) throw new Error("Enter a room code.");

  const supabase = createSupabaseServerClient();

  // One-room-at-a-time: drop any existing memberships (other than rooms this
  // user owns) before joining the new one, so /dashboard has a single
  // unambiguous "active room" to render.
  await supabase
    .from("study_room_members")
    .delete()
    .eq("user_id", user.id);

  const { data: roomId, error } = await supabase.rpc("join_room_by_code", { p_code: code });

  if (error) throw new Error(error.message || "Could not join room.");
  if (!roomId) throw new Error("Could not join room.");

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard");
}

export async function leaveRoomAction(formData: FormData) {
  const { user } = await requireUser();
  const roomId = s(formData, "room_id");
  if (!roomId) return;

  const supabase = createSupabaseServerClient();
  await supabase
    .from("study_room_members")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/rooms/${roomId}`);
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard");
}

export async function updateRoomAction(formData: FormData) {
  const { user } = await requireUser();
  const roomId = s(formData, "room_id");
  if (!roomId) throw new Error("Missing room id.");

  const supabase = createSupabaseServerClient();
  const { data: room } = await supabase
    .from("study_rooms")
    .select("owner_id")
    .eq("id", roomId)
    .single();

  if (!room || room.owner_id !== user.id) {
    throw new Error("Only the owner can update this room.");
  }

  const updates: Record<string, unknown> = {};
  const name = s(formData, "name");
  if (name) updates.name = name.slice(0, 80);
  if (formData.has("focus_minutes")) {
    updates.focus_minutes = Math.min(180, Math.max(1, n(formData, "focus_minutes", 25)));
  }
  if (formData.has("is_open")) {
    updates.is_open = formData.get("is_open") === "on" || formData.get("is_open") === "true";
  }

  if (Object.keys(updates).length === 0) return;

  const { error } = await supabase.from("study_rooms").update(updates).eq("id", roomId);
  if (error) throw error;

  revalidatePath(`/dashboard/rooms/${roomId}`);
}

export async function endRoomAction(formData: FormData) {
  const { user } = await requireUser();
  const roomId = s(formData, "room_id");
  if (!roomId) return;

  const supabase = createSupabaseServerClient();
  const { data: room } = await supabase
    .from("study_rooms")
    .select("owner_id")
    .eq("id", roomId)
    .single();
  if (!room || room.owner_id !== user.id) {
    throw new Error("Only the owner can end this room.");
  }

  await supabase
    .from("study_rooms")
    .update({ ended_at: new Date().toISOString(), is_open: false })
    .eq("id", roomId);

  revalidatePath(`/dashboard/rooms/${roomId}`);
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/rooms");
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared timer — only the room owner can change timer state. RLS already
// restricts UPDATE on study_rooms to owner_id = auth.uid(), so we don't
// duplicate that check at the app layer.

type TimerMode = "idle" | "focus" | "short" | "long";

function durationFor(mode: TimerMode, room: {
  focus_minutes: number;
  short_break_minutes: number;
  long_break_minutes: number;
}): number {
  switch (mode) {
    case "focus": return room.focus_minutes;
    case "short": return room.short_break_minutes;
    case "long":  return room.long_break_minutes;
    default:      return room.focus_minutes;
  }
}

async function loadTimerRoom(roomId: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("study_rooms")
    .select(
      "id, owner_id, focus_minutes, short_break_minutes, long_break_minutes, timer_mode, timer_started_at, timer_paused_at, timer_pause_offset_seconds, timer_round, ended_at"
    )
    .eq("id", roomId)
    .single();
  return data;
}

/** Owner starts (or resumes from paused) the current mode. If mode is idle,
 *  flips it to focus first. */
export async function startRoomTimerAction(formData: FormData) {
  await requireUser();
  const roomId = s(formData, "room_id");
  if (!roomId) return;
  const supabase = createSupabaseServerClient();
  const room = await loadTimerRoom(roomId);
  if (!room || room.ended_at) return;

  const nowIso = new Date().toISOString();
  const updates: Record<string, unknown> = {};

  if (room.timer_mode === "idle") {
    updates.timer_mode = "focus";
    updates.timer_started_at = nowIso;
    updates.timer_paused_at = null;
    updates.timer_pause_offset_seconds = 0;
  } else if (room.timer_paused_at) {
    // Resume: accumulate the time spent paused into pause_offset, clear paused.
    const pausedMs = new Date(room.timer_paused_at).getTime();
    const startedMs = new Date(room.timer_started_at!).getTime();
    const elapsedSinceStart = Math.max(0, Math.floor((pausedMs - startedMs) / 1000));
    const _ = elapsedSinceStart; void _;
    // The "remaining" calculation does: total - (paused - started - existing_offset).
    // To resume cleanly we shift started_at forward by the wall-clock time spent
    // paused; equivalent and simpler than accumulating into pause_offset.
    const pauseDurationMs = Date.now() - pausedMs;
    const newStartedMs = startedMs + pauseDurationMs;
    updates.timer_started_at = new Date(newStartedMs).toISOString();
    updates.timer_paused_at = null;
  } else if (!room.timer_started_at) {
    updates.timer_started_at = nowIso;
    updates.timer_paused_at = null;
    updates.timer_pause_offset_seconds = 0;
  } else {
    // already running, no-op
    return;
  }

  const { error } = await supabase.from("study_rooms").update(updates).eq("id", roomId);
  if (error) throw error;
  revalidatePath("/dashboard");
}

export async function pauseRoomTimerAction(formData: FormData) {
  await requireUser();
  const roomId = s(formData, "room_id");
  if (!roomId) return;
  const supabase = createSupabaseServerClient();
  const room = await loadTimerRoom(roomId);
  if (!room || !room.timer_started_at || room.timer_paused_at) return;
  const { error } = await supabase
    .from("study_rooms")
    .update({ timer_paused_at: new Date().toISOString() })
    .eq("id", roomId);
  if (error) throw error;
  revalidatePath("/dashboard");
}

export async function resetRoomTimerAction(formData: FormData) {
  await requireUser();
  const roomId = s(formData, "room_id");
  if (!roomId) return;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("study_rooms")
    .update({
      timer_mode: "idle",
      timer_started_at: null,
      timer_paused_at: null,
      timer_pause_offset_seconds: 0,
      timer_round: 1
    })
    .eq("id", roomId);
  if (error) throw error;
  revalidatePath("/dashboard");
}

/** Used by the owner when a phase finishes (or they press Skip). Auto-cycles
 *  focus → short, short → focus, with a long break after every 4 focuses. */
export async function advanceRoomTimerAction(formData: FormData) {
  await requireUser();
  const roomId = s(formData, "room_id");
  if (!roomId) return;
  const supabase = createSupabaseServerClient();
  const room = await loadTimerRoom(roomId);
  if (!room || room.ended_at) return;

  const justFinished = room.timer_mode as TimerMode;
  let nextMode: TimerMode = "focus";
  let nextRound = room.timer_round;

  if (justFinished === "focus") {
    nextRound = room.timer_round + 1;
    nextMode = nextRound % 5 === 0 ? "long" : "short";
  } else if (justFinished === "short" || justFinished === "long") {
    nextMode = "focus";
  }

  const { error } = await supabase
    .from("study_rooms")
    .update({
      timer_mode: nextMode,
      timer_started_at: new Date().toISOString(),
      timer_paused_at: null,
      timer_pause_offset_seconds: 0,
      timer_round: nextRound
    })
    .eq("id", roomId);
  if (error) throw error;
  revalidatePath("/dashboard");
}

/** Owner picks a mode manually while idle (e.g. "let's do a long break"). */
export async function setRoomTimerModeAction(formData: FormData) {
  await requireUser();
  const roomId = s(formData, "room_id");
  const modeRaw = s(formData, "mode");
  if (!roomId) return;
  const mode = (["focus", "short", "long", "idle"] as const).includes(modeRaw as TimerMode)
    ? (modeRaw as TimerMode) : "focus";
  // Touch durationFor so TS keeps it; used by client for display, server only
  // writes the mode and resets the clock.
  void durationFor;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("study_rooms")
    .update({
      timer_mode: mode,
      timer_started_at: null,
      timer_paused_at: null,
      timer_pause_offset_seconds: 0
    })
    .eq("id", roomId);
  if (error) throw error;
  revalidatePath("/dashboard");
}

/** Owner toggles whether members can post in chat. The owner can always
 *  post regardless; this only locks out everyone else. RLS enforces the
 *  same rule independently so the client can't cheat. */
export async function setRoomChatClosedAction(formData: FormData) {
  await requireUser();
  const roomId = s(formData, "room_id");
  if (!roomId) return;
  const closed = s(formData, "closed") === "true";
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("study_rooms")
    .update({ chat_closed: closed })
    .eq("id", roomId);
  if (error) throw error;
  revalidatePath("/dashboard");
}

// ─────────────────────────────────────────────────────────────────────────────

export async function kickMemberAction(formData: FormData) {
  const { user } = await requireUser();
  const roomId = s(formData, "room_id");
  const targetUserId = s(formData, "user_id");
  if (!roomId || !targetUserId) return;
  if (targetUserId === user.id) return;

  const supabase = createSupabaseServerClient();
  const { data: room } = await supabase
    .from("study_rooms")
    .select("owner_id")
    .eq("id", roomId)
    .single();
  if (!room || room.owner_id !== user.id) {
    throw new Error("Only the owner can remove members.");
  }
  if (targetUserId === room.owner_id) return;

  await supabase
    .from("study_room_members")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", targetUserId);

  revalidatePath(`/dashboard/rooms/${roomId}`);
}
