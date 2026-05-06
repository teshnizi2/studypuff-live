"use client";

import { REWARDS, type RewardCategory } from "@/lib/app-data/rewards";
import {
  equipRewardAction,
  purchaseRewardAction,
  unequipRewardAction
} from "@/lib/app-data/actions";

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

const CATEGORY_HINT: Record<RewardCategory, string> = {
  sound: "Plays in the background while a focus session runs.",
  theme: "Re-skins your dashboard until you swap it out.",
  accessory: "Worn by the sheep in the timer."
};

export type RewardsContentProps = {
  coins: number;
  lifetimeMinutes: number;
  ownedItemIds: string[];
  equippedSound: string | null;
  equippedTheme: string | null;
  equippedAccessory: string | null;
};

export function RewardsContent(p: RewardsContentProps) {
  const ownedSet = new Set(p.ownedItemIds);
  const equippedByCategory: Record<RewardCategory, string | null> = {
    sound: p.equippedSound,
    theme: p.equippedTheme,
    accessory: p.equippedAccessory
  };
  const grouped: Record<RewardCategory, typeof REWARDS> = {
    sound: REWARDS.filter((r) => r.category === "sound"),
    theme: REWARDS.filter((r) => r.category === "theme"),
    accessory: REWARDS.filter((r) => r.category === "accessory")
  };

  return (
    <div>
      {/* Balance card */}
      <section className="rounded-[24px] border border-ink-900/10 bg-gradient-to-br from-brand-butter via-brand-peach to-brand-pink p-5 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
              Your balance
            </p>
            <p className="mt-1 flex items-baseline gap-2 font-display text-4xl text-ink-900">
              <span aria-hidden>🪙</span>
              {p.coins}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-right">
            <Stat label="Lifetime" value={`${p.lifetimeMinutes}m`} />
            <Stat label="Owned" value={String(ownedSet.size)} />
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-700">
          Earn 1 coin per focused minute (capped at 90 / session).
        </p>
      </section>

      {/* Shop */}
      <div className="mt-6 space-y-8">
        {(Object.keys(grouped) as RewardCategory[]).map((cat) => (
          <section key={cat}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ink-900">{CATEGORY_LABEL[cat]}</h3>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-700">
                {grouped[cat].length} items
              </span>
            </div>
            <p className="mb-3 text-xs text-ink-700">{CATEGORY_HINT[cat]}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {grouped[cat].map((r) => {
                const owned = ownedSet.has(r.id);
                const equipped = equippedByCategory[cat] === r.id;
                const affordable = p.coins >= r.price;
                return (
                  <article
                    key={r.id}
                    className={`flex flex-col rounded-2xl border ${equipped ? "border-ink-900" : "border-ink-900/10"} ${CATEGORY_TONE[cat]}/40 p-4 shadow-soft transition`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl" aria-hidden>{r.emoji}</span>
                      <span className="rounded-full bg-cream-50/80 px-2.5 py-0.5 text-xs font-semibold text-ink-900">
                        🪙 {r.price}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-lg text-ink-900">{r.name}</h4>
                    <p className="mt-1 flex-1 text-xs text-ink-700">{r.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {!owned && (
                        <form action={purchaseRewardAction}>
                          <input type="hidden" name="item_id" value={r.id} />
                          <input type="hidden" name="price" value={r.price} />
                          <button
                            type="submit"
                            disabled={!affordable}
                            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream-50 hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {affordable ? "Buy" : `Need ${r.price - p.coins}`}
                          </button>
                        </form>
                      )}
                      {owned && !equipped && (
                        <form action={equipRewardAction}>
                          <input type="hidden" name="item_id" value={r.id} />
                          <input type="hidden" name="category" value={cat} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream-50 hover:bg-ink-700"
                          >
                            Equip
                          </button>
                        </form>
                      )}
                      {equipped && (
                        <>
                          <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream-50">
                            ✓ Equipped
                          </span>
                          <form action={unequipRewardAction}>
                            <input type="hidden" name="category" value={cat} />
                            <button
                              type="submit"
                              className="text-[11px] font-semibold uppercase tracking-widest text-ink-700 underline-offset-4 hover:underline"
                            >
                              Unequip
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-cream-50/70 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-700">{label}</p>
      <p className="mt-0.5 font-display text-base text-ink-900">{value}</p>
    </div>
  );
}
