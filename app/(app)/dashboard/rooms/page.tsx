import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/guards";
import { createRoomAction, getMyRooms, joinRoomAction } from "@/lib/app-data/rooms";

export default async function RoomsPage() {
  const { user, profile } = await requireUser();
  const rooms = await getMyRooms();

  const active = rooms.filter((r) => !r.ended_at);
  const past = rooms.filter((r) => r.ended_at);

  return (
    <DashboardShell
      title="Study rooms"
      subtitle="Create a room with a join code so friends can study with you. Or join one a friend shared."
      profile={profile}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink-900">Create a room</h2>
          <form action={createRoomAction} className="mt-5 grid gap-4">
            <label className="block text-sm font-semibold text-ink-900">
              Room name
              <input
                name="name"
                required
                maxLength={80}
                placeholder="Calculus crunch"
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
              />
            </label>
            <label className="block text-sm font-semibold text-ink-900">
              Default focus minutes
              <input
                name="focus_minutes"
                type="number"
                min={1}
                max={180}
                defaultValue={25}
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
              />
            </label>
            <button type="submit" className="btn-primary w-fit">
              Create room
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink-900">Join with a code</h2>
          <form action={joinRoomAction} className="mt-5 grid gap-4">
            <label className="block text-sm font-semibold text-ink-900">
              Room code
              <input
                name="code"
                required
                placeholder="A1B2C3"
                maxLength={8}
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 uppercase tracking-[0.3em]"
              />
            </label>
            <button type="submit" className="btn-outline w-fit">
              Join room
            </button>
          </form>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-ink-900">Your rooms</h2>
        {active.length === 0 && past.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-ink-900/10 bg-cream-50 p-6 text-ink-700">
            You haven&apos;t created or joined any rooms yet.
          </p>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {active.map((r) => (
                  <RoomCard key={r.id} room={r} userId={user.id} />
                ))}
              </div>
            )}
            {past.length > 0 && (
              <>
                <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-ink-700">
                  Ended
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {past.map((r) => (
                    <RoomCard key={r.id} room={r} userId={user.id} dim />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </DashboardShell>
  );
}

function RoomCard({
  room,
  userId,
  dim
}: {
  room: {
    id: string;
    name: string;
    code: string;
    focus_minutes: number;
    is_open: boolean;
    ended_at: string | null;
    owner_id: string;
  };
  userId: string;
  dim?: boolean;
}) {
  const isOwner = room.owner_id === userId;
  return (
    <Link
      href={`/dashboard/rooms/${room.id}`}
      className={`block rounded-[24px] border border-ink-900/10 bg-cream-50 p-5 shadow-soft transition hover:border-ink-900/30 ${
        dim ? "opacity-60" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-700">
        {isOwner ? "You own" : "Joined"}
      </p>
      <h3 className="mt-2 font-display text-2xl text-ink-900">{room.name}</h3>
      <p className="mt-2 text-sm text-ink-700">
        Code:{" "}
        <span className="rounded-md bg-ink-900/5 px-2 py-1 font-mono tracking-[0.3em]">
          {room.code}
        </span>
      </p>
      <p className="mt-3 text-xs text-ink-700">
        {room.ended_at
          ? "Ended"
          : room.is_open
            ? `Open · ${room.focus_minutes}-min focus`
            : "Closed to new joiners"}
      </p>
    </Link>
  );
}
