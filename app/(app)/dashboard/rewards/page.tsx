import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REWARDS, type RewardCategory } from "@/lib/app-data/rewards";
import { purchaseRewardAction } from "@/lib/app-data/actions";

const CATEGORY_LABEL: Record<RewardCategory, string> = {
  sound: "Ambient sounds",
  theme: "Themes",
  accessory: "Sheep accessories"
};

const CATEGORY_TONE: Record<RewardCategory, string> = {
  sound: "bg-brand-sky",
  theme: "bg-brand-lilac",
  accessory: "bg-brand-pink"
};

export default async function RewardsPage() {
  const { user, profile } = await requireUser();
  const supabase = createSupabaseServerClient();

  const [{ data: settings }, { data: purchases }] = await Promise.all([
    supabase
      .from("user_settings")
      .select("coins, lifetime_focus_minutes")
      .eq("user_id", user.id)
      .single(),
    supabase.from("user_purchases").select("item_id").eq("user_id", user.id)
  ]);

  const coins = settings?.coins ?? 0;
  const lifetimeMinutes = settings?.lifetime_focus_minutes ?? 0;
  const ownedSet = new Set((purchases || []).map((p) => p.item_id));

  const grouped: Record<RewardCategory, typeof REWARDS> = {
    sound: REWARDS.filter((r) => r.category === "sound"),
    theme: REWARDS.filter((r) => r.category === "theme"),
    accessory: REWARDS.filter((r) => r.category === "accessory")
  };

  return (
    <DashboardShell
      title="Rewards"
      subtitle="Earn coins by finishing focus sessions. Spend them on sounds, themes, and tiny upgrades for your sheep."
      profile={profile}
    >
      {/* Balance card */}
      <section className="rounded-[28px] border border-ink-900/10 bg-gradient-to-br from-brand-butter via-brand-peach to-brand-pink p-6 shadow-soft sm:p-8">
        <div className="grid gap-6 sm:grid-cols-3 sm:items-center">
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
              Your balance
            </p>
            <p className="mt-2 flex items-baseline gap-3 font-display text-6xl text-ink-900">
              <span aria-hidden>🪙</span>
              {coins}
            </p>
            <p className="mt-2 text-sm text-ink-700">
              You earn 1 coin per minute you complete in focus mode (capped at 90 per session).
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <Stat label="Lifetime focus" value={`${lifetimeMinutes} min`} />
            <Stat label="Items owned" value={String(ownedSet.size)} />
          </div>
        </div>
      </section>

      {/* Shop */}
      <div className="mt-10 space-y-12">
        {(Object.keys(grouped) as RewardCategory[]).map((cat) => (
          <section key={cat}>
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-3xl text-ink-900">{CATEGORY_LABEL[cat]}</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
                {grouped[cat].length} items
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[cat].map((r) => {
                const owned = ownedSet.has(r.id);
                const affordable = coins >= r.price;
                return (
                  <article
                    key={r.id}
                    className={`flex flex-col rounded-3xl border border-ink-900/10 ${CATEGORY_TONE[cat]}/40 p-5 shadow-soft transition hover:-translate-y-1`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-4xl" aria-hidden>{r.emoji}</span>
                      <span className="rounded-full bg-cream-50/80 px-3 py-1 text-xs font-semibold text-ink-900">
                        🪙 {r.price}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl text-ink-900">{r.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-ink-700">{r.description}</p>
                    <div className="mt-4">
                      {owned ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cream-50">
                          ✓ Owned
                        </span>
                      ) : (
                        <form action={purchaseRewardAction}>
                          <input type="hidden" name="item_id" value={r.id} />
                          <input type="hidden" name="price" value={r.price} />
                          <button
                            type="submit"
                            disabled={!affordable}
                            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cream-50 hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {affordable ? "Buy" : `Need ${r.price - coins} more`}
                          </button>
                        </form>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-center text-xs text-ink-700">
        Background sounds and themes will activate in the timer once we ship the audio loops and theme switcher — coming next.
      </p>
    </DashboardShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-cream-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700">{label}</p>
      <p className="mt-1 font-display text-2xl text-ink-900">{value}</p>
    </div>
  );
}
