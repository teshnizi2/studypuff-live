"use client";

import { useState } from "react";
import { RoomChat } from "@/components/rooms/RoomChat";
import { endRoomAction, leaveRoomAction, type RoomDetail, type RoomMessage } from "@/lib/app-data/rooms";

type Props = {
  room: RoomDetail;
  initialMessages: RoomMessage[];
  currentUserId: string;
};

// Right-rail panel rendered on /dashboard when the user is in a room.
// Owns the chat, the member list, and leave/end controls. Timer-sync UI
// lands in a follow-up — for now the room timer state is read-only data
// that nothing yet renders.
export function RoomSidebar({ room, initialMessages, currentUserId }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-ink-900 shadow-soft transition hover:-translate-y-0.5 lg:right-6 lg:bottom-6"
        aria-label={`Open room — ${room.name}`}
      >
        <span aria-hidden>💬</span>
        <span className="hidden sm:inline">{room.name}</span>
        <span className="rounded-md bg-ink-900/5 px-2 py-0.5 font-mono text-[11px] tracking-[0.18em]">
          {room.code}
        </span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Study room"
      className="
        relative mx-auto mt-6 flex w-full max-w-[420px] flex-col gap-3 px-4 pb-10
        lg:fixed lg:right-0 lg:top-[100px] lg:z-30 lg:m-0 lg:h-[calc(100vh-120px)]
        lg:w-[360px] lg:max-w-none lg:overflow-y-auto lg:px-4 lg:pt-4 lg:pb-10
        xl:w-[400px]
      "
    >
      <header className="flex items-start justify-between gap-3 rounded-[24px] border border-ink-900/10 bg-cream-50 p-4 shadow-soft">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-700">
            {room.is_owner ? "Your room" : "Joined"}
          </p>
          <h2 className="mt-0.5 truncate font-display text-xl text-ink-900">{room.name}</h2>
          <p className="mt-1 text-xs text-ink-700">
            Code:{" "}
            <span className="rounded-md bg-ink-900/5 px-2 py-0.5 font-mono tracking-[0.24em]">
              {room.code}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="rounded-full border border-ink-900/15 bg-cream-50 px-2.5 py-1 text-[11px] font-semibold text-ink-700 transition hover:border-ink-900/40 hover:text-ink-900"
          aria-label="Collapse room panel"
        >
          Hide
        </button>
      </header>

      {room.members.length > 0 && (
        <div className="rounded-[24px] border border-ink-900/10 bg-cream-50 p-4 shadow-soft">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-700">
            Members · {room.members.length}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {room.members.map((m) => {
              const label = m.display_name || m.username || "Member";
              const initial = label.charAt(0).toUpperCase();
              return (
                <li
                  key={m.user_id}
                  className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-cream-100 px-2.5 py-1"
                  title={label + (m.is_owner ? " · owner" : "")}
                >
                  <span className="inline-flex h-6 w-6 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-butter text-[11px] font-semibold text-ink-900">
                    {m.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      initial
                    )}
                  </span>
                  <span className="max-w-[10rem] truncate text-xs text-ink-900">{label}</span>
                  {m.is_owner && (
                    <span className="rounded-md bg-brand-rust/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-rust">
                      owner
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Reuse the existing chat component — it owns its own realtime
          subscription, optimistic input, soft-delete, etc. */}
      <RoomChat
        roomId={room.id}
        initialMessages={initialMessages}
        members={room.members}
        currentUserId={currentUserId}
        isOwner={room.is_owner}
        disabled={!!room.ended_at}
      />

      <div className="flex gap-2">
        <form action={leaveRoomAction} className="flex-1">
          <input type="hidden" name="room_id" value={room.id} />
          <button
            type="submit"
            className="w-full rounded-full border border-ink-900/15 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-ink-900 transition hover:-translate-y-0.5 hover:border-ink-900/30"
          >
            Leave room
          </button>
        </form>
        {room.is_owner && !room.ended_at && (
          <form action={endRoomAction} className="flex-1">
            <input type="hidden" name="room_id" value={room.id} />
            <button
              type="submit"
              className="w-full rounded-full border border-red-600/30 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:border-red-600"
            >
              End room
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
