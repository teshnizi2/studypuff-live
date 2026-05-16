import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getRecentChatMessages } from "@/lib/admin/queries";
import { adminDeleteMessageAction } from "@/lib/admin/actions";

export default async function AdminMessagesPage() {
  const messages = await getRecentChatMessages(200);

  return (
    <AdminShell
      title="Message moderation"
      subtitle="Newest 200 chat messages across every room. Soft-delete anything inappropriate; the author keeps existing in the chat."
    >
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        {messages.map((m) => (
          <article
            key={m.id}
            className="grid gap-4 border-b border-white/10 p-5 last:border-b-0 lg:grid-cols-[1fr_auto]"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                {m.authorId ? (
                  <Link
                    href={`/admin/users/${m.authorId}`}
                    className="font-semibold text-cream-50 hover:underline"
                  >
                    {m.authorLabel}
                  </Link>
                ) : (
                  <span className="font-semibold">{m.authorLabel}</span>
                )}
                <span className="text-cream-200">in</span>
                <span className="font-display text-lg">{m.roomLabel}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-brand-butter">
                  {m.roomCode}
                </span>
                <span className="ml-auto text-xs text-cream-200">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p
                className={`mt-2 whitespace-pre-wrap break-words text-sm ${
                  m.deleted_at ? "italic text-cream-300" : "text-cream-50"
                }`}
              >
                {m.deleted_at ? "(message deleted)" : m.body}
              </p>
            </div>
            <div className="self-start">
              {!m.deleted_at && (
                <form action={adminDeleteMessageAction}>
                  <input type="hidden" name="message_id" value={m.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-400/40 bg-red-500/15 px-4 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/25"
                  >
                    Soft delete
                  </button>
                </form>
              )}
            </div>
          </article>
        ))}
        {messages.length === 0 && (
          <p className="p-6 text-sm text-cream-200">No messages yet.</p>
        )}
      </div>
    </AdminShell>
  );
}
