"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { RoomMemberSummary, RoomMessage } from "@/lib/app-data/rooms";

type Props = {
  roomId: string;
  initialMessages: RoomMessage[];
  members: RoomMemberSummary[];
  currentUserId: string;
  isOwner: boolean;
  /** Whole chat is unusable (room ended). Hides the composer for everyone. */
  disabled?: boolean;
  /** Owner toggled chat off. Members can't send; owner can still post. */
  chatClosed?: boolean;
};

export function RoomChat({
  roomId,
  initialMessages,
  members,
  currentUserId,
  isOwner,
  disabled,
  chatClosed
}: Props) {
  // Owners are always allowed to post; non-owners are blocked when the
  // owner has closed the chat.
  const composerLocked = disabled || (!!chatClosed && !isOwner);
  const [messages, setMessages] = useState<RoomMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const memberMap = useMemo(() => {
    const m = new Map<string, RoomMemberSummary>();
    for (const member of members) m.set(member.user_id, member);
    return m;
  }, [members]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`room-chat:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const next = payload.new as RoomMessage;
          setMessages((prev) => (prev.some((m) => m.id === next.id) ? prev : [...prev, next]));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const next = payload.new as RoomMessage;
          setMessages((prev) => prev.map((m) => (m.id === next.id ? next : m)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  const send = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const body = draft.trim();
      if (!body || sending || composerLocked) return;
      setSending(true);
      setError(null);
      const supabase = createSupabaseBrowserClient();
      const { error: insertError } = await supabase
        .from("room_messages")
        .insert({ room_id: roomId, user_id: currentUserId, body: body.slice(0, 2000) });
      setSending(false);
      if (insertError) {
        setError(insertError.message);
        return;
      }
      setDraft("");
    },
    [draft, roomId, currentUserId, sending, composerLocked]
  );

  const softDelete = useCallback(
    async (id: string) => {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from("room_messages")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (updateError) setError(updateError.message);
    },
    []
  );

  return (
    <div className="rounded-[28px] border border-ink-900/10 bg-cream-50 shadow-soft">
      <header className="flex items-center justify-between border-b border-ink-900/10 px-6 py-4">
        <h2 className="font-display text-2xl text-ink-900">Chat</h2>
        <span className="text-xs text-ink-700">
          {messages.filter((m) => !m.deleted_at).length} message
          {messages.filter((m) => !m.deleted_at).length === 1 ? "" : "s"}
        </span>
      </header>

      <div ref={scrollRef} className="max-h-[480px] min-h-[280px] overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <p className="text-sm text-ink-700">No messages yet. Say hi.</p>
        ) : (
          <ul className="space-y-3">
            {messages.map((msg) => {
              const author = msg.user_id ? memberMap.get(msg.user_id) : null;
              const name =
                author?.display_name || author?.username || (msg.user_id ? "Former member" : "—");
              const isMine = msg.user_id === currentUserId;
              const canDelete =
                !msg.deleted_at && (msg.user_id === currentUserId || isOwner);

              return (
                <li
                  key={msg.id}
                  className="flex items-start gap-3 rounded-2xl border border-transparent px-2 py-2 hover:border-ink-900/5"
                >
                  <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-butter text-xs font-semibold text-ink-900">
                    {author?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={author.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      name.charAt(0).toUpperCase()
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-semibold text-ink-900">
                        {name}
                        {isMine && <span className="ml-1 text-xs text-ink-700">(you)</span>}
                      </span>
                      <time className="text-xs text-ink-700">{formatTime(msg.created_at)}</time>
                    </div>
                    <p
                      className={`mt-1 whitespace-pre-wrap break-words text-sm ${
                        msg.deleted_at ? "italic text-ink-700" : "text-ink-900"
                      }`}
                    >
                      {msg.deleted_at ? "(message deleted)" : msg.body}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => softDelete(msg.id)}
                      className="text-xs text-ink-700 underline-offset-2 hover:text-red-700 hover:underline"
                      aria-label="Delete message"
                    >
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <form onSubmit={send} className="border-t border-ink-900/10 px-6 py-4">
        {error && <p className="mb-2 text-xs text-red-700">{error}</p>}
        {chatClosed && !isOwner && (
          <p className="mb-2 text-xs text-ink-700">
            The owner has closed the chat. You can still read what was posted.
          </p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              disabled
                ? "Chat is closed."
                : chatClosed && !isOwner
                  ? "Chat is closed by the owner."
                  : chatClosed && isOwner
                    ? "Chat is closed — only you can post."
                    : "Type a message…"
            }
            maxLength={2000}
            disabled={composerLocked || sending}
            className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending || composerLocked}
            className="btn-primary px-5 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = Date.now();
  const diff = (now - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
