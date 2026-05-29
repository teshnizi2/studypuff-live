## Mode: AUTOPILOT
**No user questions were asked in Phase 0.6.** All depth targets and closeout slots use defaults per the agent's AUTOPILOT defaults table. The user opted out of further intake when they picked AUTOPILOT in calibration Q9.

If you (the user) want to change any of these picks for THIS round, edit this file directly before the orchestrator dispatches Phase 0.7 (criteria-tree). The orchestrator re-reads this file at every phase boundary and adopts whatever's on disk.

---

# Aspect Profile — round 1

**Artifact:** Garden inventory + shop panel in GardenScene.tsx
**Dial:** 8 / 10 (Expert cozy-game polish)
**Intake mode:** AUTOPILOT

Total aspects: 18
At DEEP depth: 8
At MEDIUM depth: 10
At LIGHT depth: 0

---

| # | Aspect | AUTOPILOT default choice | Depth | Rationale |
|---|---|---|---|---|
| 1 | Category tab navigation | Themed pill tabs with emoji/icon per category, animated active indicator | DEEP | Signature capability (calibration Q8) — primary navigation surface |
| 2 | Item card design (owned vs locked states) | Three distinct visual states: owned-placed, owned-unplaced, locked | DEEP | Signature capability — lock icon treatment is explicitly named |
| 3 | Purchase / unlock flow | Inline coin-spend with confirmation affordance, no modal exit | DEEP | Signature capability — buy-inline named in calibration |
| 4 | Coin micro-animation on purchase | Coin-flip + sparkle burst on successful purchase | DEEP | Signature capability — explicitly named in calibration |
| 5 | Lock icon treatment (affordable vs unaffordable) | Dual states: soft amber lock (can afford) vs hard grey lock + muted card (cannot afford) | DEEP | Signature capability — named; dial 8 warrants full state distinction |
| 6 | Animation and motion (tab switch, card pop-in, unlock reveal) | Tab cross-fade + card stagger pop-in + unlock scale-up reveal | DEEP | Dial ≥7 capability-aligned aspect; cozy-game feel depends on this |
| 7 | Coins display (balance panel near purchase actions) | Persistent coin balance badge visible throughout panel; updates optimistically | DEEP | Capability-aligned (buy-inline requires balance visibility); dial 8 |
| 8 | Accessibility (keyboard nav, focus rings, aria labels) | Full keyboard nav across tabs + cards; ARIA roles for shop region, item names, purchase buttons | DEEP | Dial 8 default = DEEP for accessibility per AUTOPILOT table |
| 9 | Empty states (no items owned in category; all placed) | Designed empty state per category: warm illustration + friendly copy | MEDIUM | Dial 8 non-signature aspect → MEDIUM |
| 10 | Sorting (by price within category) | Price ascending by default; owned items float to top within category | MEDIUM | Dial 8 non-signature → MEDIUM |
| 11 | Inventory vs shop conceptual model | Unified panel: owned (unplaced) + locked (purchaseable) shown together per category; placed items show count badge not card | MEDIUM | Core UX model; not a signature capability → MEDIUM |
| 12 | Category grouping logic | Map existing item categories to display groups (Flowers, Trees, Decor, Paths, Water); Others bucket for uncategorised | MEDIUM | Data-model decision; not a visual signature → MEDIUM |
| 13 | Responsive layout (mobile vs desktop grid) | 2-col grid mobile → 3-col tablet → 4-col desktop; panel height cap + scroll on mobile | MEDIUM | Dial 8 standard → MEDIUM for non-signature layout |
| 14 | Typography (item names, counts, prices) | Game-UI label style: rounded, slightly chunky; size hierarchy for name / count / price | MEDIUM | Dial 8 non-signature → MEDIUM |
| 15 | Color and palette (panel chrome, card surfaces, accent) | Parchment/aged-paper panel bg; cream card surfaces; mossy green active tab; coin-gold accent | MEDIUM | Palette locked by calibration; execution is MEDIUM (palette is already specified) |
| 16 | Hover / focus micro-interactions (card lift, button press) | Subtle scale-up on card hover; inset press on purchase button | MEDIUM | Dial 8 standard motion beyond signatures → MEDIUM |
| 17 | Panel loading skeleton | Skeleton cards in grid formation while item data fetches; matches card shape | MEDIUM | Functional loading state; not a signature moment → MEDIUM |
| 18 | Scroll behaviour within category grid | Virtual or windowed scroll if item count > threshold; smooth momentum scroll on iOS | MEDIUM | Performance-adjacent; dial 8 standard → MEDIUM |

---

## Aspects enumerated but marked structurally irrelevant this round

- **Sound:** calibration vibe is "game-like but not garish" + no audio system exists in the codebase. AUTOPILOT → defer entirely; not enumerated in depth targets.
- **Personalization / account-based prefs:** out of scope for this panel; item ownership is already account-bound via Supabase. Not a new surface.
- **SEO / OG / sitemap:** internal game UI panel, not a public indexable route. N/A.
- **Print stylesheet:** game UI. N/A.
- **Onboarding / coach marks:** may belong in a future round; no calibration signal. Deferred to next round calibration.

---

## Intake closeout (no more questions this round)

- **Sacred items:** GardenScene.tsx scene canvas (do NOT touch), drag-drop logic (do NOT touch), the inventory/shop panel below the scene only (per calibration Locked content block). No additions under AUTOPILOT.
- **Suspected bloat:** "let the rederive find it" (AUTOPILOT default).
- **Rollback policy:** Single baseline commit before structural cuts (AUTOPILOT default — recommended).
- **Redirect policy:** 308 permanent to new location (AUTOPILOT default — preserves inbound links). Note: this panel is a component within an existing route, so route-level redirects are unlikely to be needed; policy stands as a safety default.
- **User-verification scope (this round):** Empty list — every BLOCKED-on-user-verification leaf (real-device touch testing, colour-contrast manual audit, iOS momentum scroll feel) defers to next round. (AUTOPILOT default.)
- **Spend cap:** €2 — default; if any paid generative work (fal-ai imagery, etc.) would exceed €2 this round, the orchestrator blocks and queues a separate confirmation turn rather than asking mid-round. (AUTOPILOT default.)

### User free-form notes (binding directives — verbatim)
> (none — user chose autopilot)

<!-- Downstream agents MUST read this block before scoring/judging/cutting.
     No conflicts with calibration were detected.
     Calibration Locked content is reproduced verbatim in Sacred items above. -->

---

## New aspects to re-run during build

If new aspects emerge during Phase 2 that were not enumerated here, DO NOT call AskUserQuestion again this round. Instead the orchestrator picks a default, documents it in `05-build-log.md`, and the next round's calibrator surfaces it. (This is the no-mid-round-questions rule the orchestrator enforces — see SKILL.md.)

---

## Depth summary for downstream agents

**DEEP aspects (8):** category tab navigation, item card design (owned/locked states), purchase/unlock flow, coin micro-animation, lock icon treatment (affordable vs unaffordable), animation and motion, coins display (balance panel), accessibility.

**MEDIUM aspects (10):** empty states, sorting, inventory vs shop conceptual model, category grouping logic, responsive layout, typography, color and palette, hover/focus micro-interactions, panel loading skeleton, scroll behaviour.

**LIGHT aspects:** none — dial 8 sets floor at MEDIUM for all non-signature aspects.
