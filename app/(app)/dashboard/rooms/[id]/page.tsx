import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RoomChat } from "@/components/rooms/RoomChat";
import { RoomRealtimeRefresher } from "@/components/rooms/RoomRealtimeRefresher";
import { requireUser } from "@/lib/auth/guards";
import {
  endRoomAction,
  getRoomDetail,
  getRoomMessages,
  kickMemberAction,
  leaveRoomAction,
  updateRoomAction
} from "@/lib/app-data/rooms";

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  const { user, profile } = await requireUser();
  const room = await getRoomDetail(params.id);

  if (!room) notFound();
  if (!room.is_member && !room.is_owner) {
    redirect("/dashboard/rooms");
  }

  const messages = await getRoomMessages(room.id);

  return (
    <DashboardShell
      title={room.name}
      subtitle={
        room.ended_at
          ? "This room has ended."
          : `Share the code ${room.code} with friends so they can join.`
      }
      profile={profile}
    >
      <RoomRealtimeRefresher roomId={room.id} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Left column: code + info */}
        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-700">
            Join code
          </p>
          <p className="mt-2 font-mono text-4xl tracking-[0.4em] text-ink-900">{room.code}</p>
          <p className="mt-2 text-xs text-ink-700">
            Anyone with this code can join while the room is open.
          </p>

          <dl className="mt-6 space-y-2 text-sm">
            <Row label="Status">
              {room.ended_at ? "Ended" : room.is_open ? "Open" : "Closed"}
            </Row>
            <Row label="Focus minutes">{room.focus_minutes}</Row>
            <Row label="Members">{room.members.length}</Row>
            <Row label="Created">{new Date(room.created_at).toLocaleString()}</Row>
          </dl>

          {!room.is_owner && !room.ended_at && (
            <form action={leaveRoomAction} className="mt-6">
              <input type="hidden" name="room_id" value={room.id} />
              <button type="submit" className="btn-outline w-full">
                Leave room
              </button>
            </form>
          )}
        </section>

        {/* Right column: members + owner controls */}
        <section className="space-y-6">
          <div className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
            <h2 className="font-display text-3xl text-ink-900">Members</h2>
            <ul className="mt-5 divide-y divide-ink-900/10">
              {room.members.map((m) => {
                const name = m.display_name || m.username || m.user_id.slice(0, 8);
                return (
                  <li key={m.user_id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-butter text-sm font-semibold text-ink-900">
                        {m.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.avatar_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          name.charAt(0).toUpperCase()
                        )}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">
                          {name}
                          {m.is_owner && (
                            <span className="ml-2 rounded-full bg-ink-900/10 px-2 py-0.5 text-xs uppercase tracking-wider text-ink-700">
                              Owner
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-ink-700">
                          Joined {new Date(m.joined_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {room.is_owner && !m.is_owner && !room.ended_at && (
                      <form action={kickMemberAction}>
                        <input type="hidden" name="room_id" value={room.id} />
                        <input type="hidden" name="user_id" value={m.user_id} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-red-600 underline underline-offset-4 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {room.is_owner && !room.ended_at && (
            <div className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
              <h2 className="font-display text-3xl text-ink-900">Owner controls</h2>
              <form action={updateRoomAction} className="mt-5 grid gap-4">
                <input type="hidden" name="room_id" value={room.id} />
                <label className="block text-sm font-semibold text-ink-900">
                  Room name
                  <input
                    name="name"
                    defaultValue={room.name}
                    maxLength={80}
                    className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
                  />
                </label>
                <label className="block text-sm font-semibold text-ink-900">
                  Focus minutes
                  <input
                    name="focus_minutes"
                    type="number"
                    min={1}
                    max={180}
                    defaultValue={room.focus_minutes}
                    className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
                  />
                </label>
                <label className="flex items-center gap-3 text-sm font-semibold text-ink-900">
                  <input
                    name="is_open"
                    type="checkbox"
                    defaultChecked={room.is_open}
                  />
                  Open to new joiners
                </label>
                <button type="submit" className="btn-primary w-fit">
                  Save changes
                </button>
              </form>

              <form action={endRoomAction} className="mt-6 border-t border-ink-900/10 pt-6">
                <input type="hidden" name="room_id" value={room.id} />
                <p className="text-sm text-ink-700">
                  Ending the room kicks everyone out and prevents new joins.
                </p>
                <button
                  type="submit"
                  className="mt-3 rounded-full border border-red-300 bg-red-50 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  End room
                </button>
              </form>
            </div>
          )}
        </section>
      </div>

      <div className="mt-8">
        <RoomChat
          roomId={room.id}
          initialMessages={messages}
          members={room.members}
          currentUserId={user.id}
          isOwner={room.is_owner}
          disabled={Boolean(room.ended_at)}
        />
      </div>

      <p className="mt-8">
        <Link href="/dashboard/rooms" className="text-sm underline underline-offset-4 text-ink-700">
          ← Back to rooms
        </Link>
      </p>
    </DashboardShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-ink-700">
      <dt>{label}</dt>
      <dd className="font-semibold text-ink-900">{children}</dd>
    </div>
  );
}
