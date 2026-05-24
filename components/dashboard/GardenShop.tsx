"use client";

import { REWARDS, type RewardCategory } from "@/lib/app-data/rewards";
import {
  equipRewardAction,
  purchaseRewardAction,
  unequipRewardAction
} from "@/lib/app-data/actions";

export type GardenShopProps = {
  coins: number;
  lifetimeMinutes: number;
  ownedItemIds: string[];
  equippedSound: string | null;
  equippedTheme: string | null;
  equippedAccessory: string | null;
};

// Garden sub-categories first (the page IS the garden), then the dashboard
// rewards (sound / theme / accessory).
const CATEGORY_ORDER: RewardCategory[] = [
  "garden-structures",
  "garden-plants",
  "garden-critters",
  "sound",
  "theme",
  "accessory"
];

const CATEGORY_LABEL: Record<RewardCategory, string> = {
  "garden-structures": "Cottages & Structures",
  "garden-plants": "Garden & Bounty",
  "garden-critters": "Critters & Whimsy",
  sound: "Ambient sounds",
  theme: "Themes",
  accessory: "Sheep accessories"
};

const CATEGORY_HINT: Record<RewardCategory, string> = {
  "garden-structures": "The big pieces — cottages, bridges, lanterns. Each one anchors a corner of your scene.",
  "garden-plants": "Flowers, vegetables, ponds. They fill the ground rows and feed the cozy.",
  "garden-critters": "Little characters and oddities — gnomes, snails, fairy rings. Hover or click them in the scene.",
  sound: "Plays in the background while a focus session runs.",
  theme: "Re-skins your dashboard until you swap it out.",
  accessory: "Worn by the sheep in the timer."
};

const CATEGORY_TONE: Record<RewardCategory, string> = {
  "garden-structures": "from-[#e8d8b8] to-[#d2bd8c]",
  "garden-plants": "from-[#d8eccb] to-[#b8d8a8]",
  "garden-critters": "from-[#f1d8e8] to-[#e0b8d4]",
  sound: "from-brand-sky/70 to-brand-sky/30",
  theme: "from-brand-lilac/70 to-brand-lilac/30",
  accessory: "from-brand-pink/70 to-brand-pink/30"
};

function isGardenCat(c: RewardCategory): boolean {
  return c.startsWith("garden-");
}

function CoinGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="10" fill="#e9b84a" stroke="#c79126" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="#f4d685" strokeWidth="1.5" />
      <path d="M12 8.2v7.6M9.6 9.6c0-1 1-1.6 2.4-1.6s2.4.6 2.4 1.6-1 1.4-2.4 1.4-2.4.5-2.4 1.5 1 1.6 2.4 1.6 2.4-.6 2.4-1.6" fill="none" stroke="#8a5e12" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function GardenShop(p: GardenShopProps) {
  const ownedSet = new Set(p.ownedItemIds);
  const equippedByCategory: Partial<Record<RewardCategory, string | null>> = {
    sound: p.equippedSound,
    theme: p.equippedTheme,
    accessory: p.equippedAccessory
    // garden-* categories don't equip; owned = placed.
  };
  const grouped: Record<RewardCategory, typeof REWARDS> = {
    "garden-structures": REWARDS.filter((r) => r.category === "garden-structures"),
    "garden-plants":     REWARDS.filter((r) => r.category === "garden-plants"),
    "garden-critters":   REWARDS.filter((r) => r.category === "garden-critters"),
    sound:     REWARDS.filter((r) => r.category === "sound"),
    theme:     REWARDS.filter((r) => r.category === "theme"),
    accessory: REWARDS.filter((r) => r.category === "accessory")
  };

  const totalGarden = grouped["garden-structures"].length + grouped["garden-plants"].length + grouped["garden-critters"].length;
  const ownedGarden = Array.from(ownedSet).filter((id) => id.startsWith("garden-")).length;

  return (
    <div>
      {/* Balance card */}
      <section className="rounded-[26px] border border-white/60 bg-gradient-to-br from-brand-butter via-brand-peach to-brand-pink p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_40px_-28px_rgba(31,77,44,0.45)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">Your balance</p>
            <p className="mt-1 flex items-center gap-2 font-display text-4xl text-ink-900">
              <CoinGlyph className="h-8 w-8 drop-shadow-[0_2px_3px_rgba(140,94,18,0.35)]" />
              {p.coins}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-right">
            <Stat label="Lifetime" value={`${p.lifetimeMinutes}m`} />
            <Stat label="Garden" value={`${ownedGarden} / ${totalGarden}`} />
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-700">
          Earn 1 coin per focused minute (capped at 90 / session). Each garden item appears in your scene above the moment you buy it. Sounds, themes, and accessories change how the rest of your dashboard looks and sounds.
        </p>
      </section>

      {/* Shop sections — garden categories first */}
      <div className="mt-7 space-y-8">
        {CATEGORY_ORDER.map((cat) => (
          <section key={cat}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl text-ink-900">{CATEGORY_LABEL[cat]}</h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-700">
                {grouped[cat].length} items
              </span>
            </div>
            <p className="mb-3 text-xs text-ink-700">{CATEGORY_HINT[cat]}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[cat].map((r) => {
                const owned = ownedSet.has(r.id);
                const equipped = equippedByCategory[cat] === r.id;
                const affordable = p.coins >= r.price;
                const isGarden = isGardenCat(cat);
                const placed = isGarden && owned;
                return (
                  <article
                    key={r.id}
                    className={`flex flex-col rounded-2xl border bg-gradient-to-br ${
                      equipped || placed ? "border-ink-900/70 ring-1 ring-ink-900/25" : "border-white/55"
                    } ${CATEGORY_TONE[cat]} p-4 shadow-[0_12px_28px_-20px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.45)] transition duration-200 hover:-translate-y-0.5`}
                  >
                    <div className="flex items-start justify-between">
                      {/* Garden items: show the bespoke art thumb. Others: emoji. */}
                      {isGarden && r.art ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.art} alt="" aria-hidden className="h-12 w-12 object-contain" />
                      ) : (
                        <span className="text-3xl" aria-hidden>{r.emoji}</span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream-50/85 px-2.5 py-0.5 text-xs font-semibold text-ink-900">
                        <CoinGlyph className="h-3.5 w-3.5" /> {r.price}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg text-ink-900">{r.name}</h3>
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

                      {/* Garden items: owned = always placed, no equip needed. */}
                      {isGarden && owned && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream-50">
                          ✓ In your garden
                        </span>
                      )}

                      {/* Other categories: existing equip/unequip flow. */}
                      {!isGarden && owned && !equipped && (
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
                      {!isGarden && equipped && (
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
