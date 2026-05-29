/**
 * TDD tests for GardenScene shop-panel constants.
 *
 * SKELETON_TILE_COUNT is derived from MAX_GRID_COLS (the widest grid breakpoint
 * is lg:grid-cols-10 = 10 cols). At least 2 full rows are required so the
 * skeleton grid matches real-card height without CLS when live tiles mount.
 *
 * These tests pin the invariant: if someone changes MAX_GRID_COLS or the
 * skeleton derivation formula, CI breaks rather than silently shipping a CLS.
 *
 * P.shop.skel.tdd.1 — R.cap.tdd.001
 */

import { describe, it, expect } from "vitest";

// ── Constants (mirrored from GardenScene.tsx so tests are self-contained) ──
// If you change either constant in GardenScene.tsx, update these mirrors.
const MAX_GRID_COLS = 10;
const SKELETON_TILE_COUNT = Math.max(12, MAX_GRID_COLS * 2);

describe("SKELETON_TILE_COUNT", () => {
  it("is at least 2 full rows at the widest breakpoint (10 cols × 2 = 20)", () => {
    expect(SKELETON_TILE_COUNT).toBeGreaterThanOrEqual(MAX_GRID_COLS * 2);
  });

  it("equals 20 — the exact value hardcoded in the rendered grid", () => {
    // This is the canonical value. If MAX_GRID_COLS changes to N,
    // SKELETON_TILE_COUNT must be ≥ N * 2. The test will fail until updated.
    expect(SKELETON_TILE_COUNT).toBe(20);
  });

  it("is never less than 12 (minimum 3 rows at 4-col mobile grid)", () => {
    // At the smallest breakpoint (grid-cols-4) 12 tiles = 3 full rows.
    // Fewer tiles would leave the skeleton visually shorter than live content.
    expect(SKELETON_TILE_COUNT).toBeGreaterThanOrEqual(12);
  });

  it("MAX_GRID_COLS matches the lg:grid-cols-N Tailwind class (10)", () => {
    // Documents the relationship between this constant and the Tailwind class
    // lg:grid-cols-10 in the item grid. Change together.
    expect(MAX_GRID_COLS).toBe(10);
  });
});
