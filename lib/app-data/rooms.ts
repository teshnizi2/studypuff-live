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

export type RoomDetail = {
  id: string;
  code: string;
  owner_id: string;
  name: string;
  focus_minutes: number;
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

export async function getRoomDetail(roomId: string): Promise<RoomDetail | null> {
  const { user } = await requireUser();
  const supabase = createSupabaseServerClient();

  const { data: room } = await supabase
    .from("study_rooms")
    .select("id, code, owner_id, name, focus_minutes, is_open, started_at, ended_at, created_at")
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

export async function createRoomAction(formData: FormData) {
  const { user } = await requireUser();
  const name = s(formData, "name");
  if (!name) throw new Error("Give your room a name.");

  const focusMinutes = Math.min(180, Math.max(1, n(formData, "focus_minutes", 25)));
  const supabase = createSupabaseServerClient();

  const { data: room, error } = await supabase
    .from("study_rooms")
    .insert({
      owner_id: user.id,
      name: name.slice(0, 80),
      focus_minutes: focusMinutes,
      topic_id: nullable(formData, "topic_id")
    })
    .select("id")
    .single();

  if (error || !room) throw error || new Error("Could not create room.");

  revalidatePath("/dashboard/rooms");
  redirect(`/dashboard/rooms/${room.id}`);
}

export async function joinRoomAction(formData: FormData) {
  await requireUser();
  const code = s(formData, "code").toUpperCase();
  if (!code) throw new Error("Enter a room code.");

  const supabase = createSupabaseServerClient();
  const { data: roomId, error } = await supabase.rpc("join_room_by_code", { p_code: code });

  if (error) throw new Error(error.message || "Could not join room.");
  if (!roomId) throw new Error("Could not join room.");

  revalidatePath("/dashboard/rooms");
  redirect(`/dashboard/rooms/${roomId}`);
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

  revalidatePath(`/dashboard/rooms/${roomId}`);
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/rooms");
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
