import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminRooms } from "@/lib/admin/queries";
import { adminEndRoomAction } from "@/lib/admin/actions";

export default async function AdminRoomsPage({
  searchParams
}: {
  searchParams?: { status?: string };
}) {
  const allRooms = await getAdminRooms();
  const status = searchParams?.status || "all";
  const rooms = allRooms.filter((r) => {
    if (status === "active") return !r.ended_at;
    if (status === "ended") return !!r.ended_at;
    return true;
  });

  const counts = {
    all: allRooms.length,
    active: allRooms.filter((r) => !r.ended_at).length,
    ended: allRooms.filter((r) => !!r.ended_at).length
  };

  return (
    <AdminShell
      title="Study rooms"
      subtitle="Inspect every room created, see who owns it and how many people are in it, force-end if needed."
    >
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
        <FilterPill href="/admin/rooms"           label={`All · ${counts.all}`}           active={status === "all"} />
        <FilterPill href="/admin/rooms?status=active" label={`Active · ${counts.active}`} active={status === "active"} />
        <FilterPill href="/admin/rooms?status=ended"  label={`Ended · ${counts.ended}`}   active={status === "ended"} />
      </div>

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        {rooms.map((r) => (
          <article
            key={r.id}
            className="grid gap-5 border-b border-white/10 p-5 last:border-b-0 lg:grid-cols-[1.2fr_0.8fr_0.6fr_auto]"
          >
            <div>
              <p className="font-display text-2xl">{r.name}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.24em] text-brand-butter">
                Code · {r.code}
              </p>
              <p className="mt-2 text-xs text-cream-200">
                Created {new Date(r.created_at).toLocaleString()}
              </p>
            </div>

            <div className="text-sm text-cream-200">
              <p>
                Owner:{" "}
                {r.owner ? (
                  <Link href={`/admin/users/${r.owner.id}`} className="text-cream-50 hover:underline">
                    {r.owner.display_name || r.owner.email}
                  </Link>
                ) : (
                  <span className="font-mono">{r.owner_id}</span>
                )}
              </p>
              <p>Members: {r.member_count}</p>
              <p>Focus: {r.focus_minutes}m · timer: {r.timer_mode}</p>
              {r.chat_closed && <p className="mt-1 text-brand-pink">Chat closed</p>}
            </div>

            <div className="text-sm">
              {r.ended_at ? (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-cream-200">
                  Ended {new Date(r.ended_at).toLocaleDateString()}
                </span>
              ) : r.is_open ? (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs uppercase tracking-widest text-emerald-300">
                  Open
                </span>
              ) : (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-cream-200">
                  Closed
                </span>
              )}
            </div>

            {!r.ended_at && (
              <form action={adminEndRoomAction} className="self-start">
                <input type="hidden" name="room_id" value={r.id} />
                <button
                  type="submit"
                  className="rounded-full border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/25"
                >
                  Force end
                </button>
              </form>
            )}
          </article>
        ))}
        {rooms.length === 0 && (
          <p className="p-6 text-sm text-cream-200">No rooms match this filter.</p>
        )}
      </div>
    </AdminShell>
  );
}

function FilterPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 transition ${
        active ? "bg-brand-butter text-ink-900" : "bg-white/10 text-cream-100 hover:bg-white/15"
      }`}
    >
      {label}
    </Link>
  );
}
