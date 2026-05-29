import { describe, it, expect } from "vitest";
import { REWARDS, RARITY_ORDER, type Rarity } from "./rewards";

// ── Economy balance invariants ───────────────────────────────────────────
// Anchor (set by product): a hardcore learner studying ~6 h/day should be able
// to buy the ENTIRE catalogue in ~3 months. At 1 coin / focused minute that is
// 6 * 60 * 90 ≈ 32,400 coins. We allow a band so the curve can breathe.
const COINS_PER_MINUTE = 1;
const SIX_H_THREE_MONTHS = 6 * 60 * 90 * COINS_PER_MINUTE; // 32,400

// Buyable = costs coins (price > 0). Excludes the free starter map and the
// 6 golden trophies (those are time-gated, claimed for free).
const buyable = REWARDS.filter((r) => r.price > 0 && r.category !== "garden-golden");

describe("economy: catalogue total", () => {
  it("total cost to buy everything lands near the 3-month anchor", () => {
    const total = buyable.reduce((sum, r) => sum + r.price, 0);
    // Within ±8% of 32,400 → roughly 3 months at 6 h/day.
    expect(total).toBeGreaterThanOrEqual(Math.round(SIX_H_THREE_MONTHS * 0.92)); // 29,808
    expect(total).toBeLessThanOrEqual(Math.round(SIX_H_THREE_MONTHS * 1.08)); // 34,992
  });

  it("is meaningfully pricier than the old flat catalogue (~11,465)", () => {
    const total = buyable.reduce((sum, r) => sum + r.price, 0);
    expect(total).toBeGreaterThan(25000);
  });
});

describe("economy: price ladder (cheap → aspirational)", () => {
  it("has true impulse buys reachable on day one (≤ 120 coins)", () => {
    const cheapest = Math.min(...buyable.map((r) => r.price));
    expect(cheapest).toBeLessThanOrEqual(120);
  });

  it("has aspirational flagship items (≥ 2000 coins)", () => {
    const dearest = Math.max(...buyable.map((r) => r.price));
    expect(dearest).toBeGreaterThanOrEqual(2000);
  });

  it("is a skewed curve, not flat — most items cost less than the mean", () => {
    const prices = buyable.map((r) => r.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const belowMean = prices.filter((p) => p < mean).length;
    // A long right tail pulls the mean up, so a majority sit below it.
    expect(belowMean).toBeGreaterThan(prices.length / 2);
  });
});

describe("economy: rarity tiers", () => {
  it("every buyable item declares a rarity", () => {
    for (const r of buyable) {
      expect(r.rarity, `${r.id} missing rarity`).toBeDefined();
      expect(RARITY_ORDER).toContain(r.rarity as Rarity);
    }
  });

  it("all five rarity tiers are populated", () => {
    for (const tier of RARITY_ORDER) {
      const n = buyable.filter((r) => r.rarity === tier).length;
      expect(n, `tier ${tier} is empty`).toBeGreaterThan(0);
    }
  });

  it("rarity bands ascend: common cheaper than legendary on average", () => {
    const avg = (tier: Rarity) => {
      const xs = buyable.filter((r) => r.rarity === tier).map((r) => r.price);
      return xs.reduce((a, b) => a + b, 0) / xs.length;
    };
    expect(avg("common")).toBeLessThan(avg("uncommon"));
    expect(avg("uncommon")).toBeLessThan(avg("rare"));
    expect(avg("rare")).toBeLessThan(avg("epic"));
    expect(avg("epic")).toBeLessThan(avg("legendary"));
  });
});
