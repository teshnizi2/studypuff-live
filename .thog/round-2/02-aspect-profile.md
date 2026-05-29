## Mode: AUTOPILOT
**No user questions were asked in Phase 0.6.** All depth targets and closeout slots use defaults per the agent's AUTOPILOT defaults table. The user opted out of further intake when they picked AUTOPILOT in calibration Q9.

If you (the user) want to change any of these picks for THIS round, edit this file directly before the orchestrator dispatches Phase 0.7 (criteria-tree). The orchestrator re-reads this file at every phase boundary and adopts whatever's on disk.

---

# Aspect Profile — round 2

**Artifact:** Garden inventory + shop panel in GardenScene.tsx
**Dial:** 8 / 10 (Expert cozy-game polish)
**Intake mode:** AUTOPILOT
**Round focus:** Close the ~27 code-fixable below-bar rows identified in round-1 run report (post fix-pass-9). No new surface; no scope expansion.

Total aspects: 19
At DEEP depth: 12
At MEDIUM depth: 7
At LIGHT depth: 0

---

## Aspect table

| # | Aspect | Round-1 depth | Round-2 depth | Change rationale | Branch leaves target |
|---|---|---|---|---|---|
| 1 | Category tab navigation | DEEP | DEEP | R.gen.002 (tab pill genre-default, 8.0) and R.cap.tabs.012 (WAI pattern inconsistency, 8.5) still open. User flagged tab pill parchment treatment as round-2 priority. Full template applies. | 30 |
| 2 | Item card design (owned vs locked states) | DEEP | DEEP | R.gen.003 / P.shop.card.locked at 6.0 (paper texture, ink-edge). Name-strip vs price-badge collision at 6.0. Two of the highest-impact code-fixable rows in the entire run. Full template applies. | 30 |
| 3 | Purchase / unlock flow (Buy CTA architecture) | DEEP | DEEP | P.shop.buy subtree at 5.0 with 14 below-bar rows — worst-performing subtree this round. No visible Buy label; card-as-button architecture unresolved. User listed Buy CTA architectural resolution as round-2 priority 3. Full template applies. | 30 |
| 4 | Coin micro-animation on purchase | DEEP | DEEP | R.gen.011 coin arc missing rotation and trail (8.5); only 2 sparkle pseudos. User listed coin weight as a round-2 focus item. BLOCKED rows (live arc visibility) defer to browser session, but arc CSS / sparkle count is code-fixable. Full template applies. | 30 |
| 5 | Lock icon treatment (affordable vs unaffordable) | DEEP | DEEP | R.cap.lock.002-003 at 9.0 (unaffordable lock too faded; ink-900/15 → ink-900/25). Minor fix but remains a DEEP signature capability. Full template applies. | 30 |
| 6 | Animation and motion (tab switch, card pop-in, unlock reveal, easing family) | DEEP | DEEP | R.coh.016 / R.cap.motion.coh.001: linear tween introduces a third easing family alongside spring + standard. User flagged easing family cohesion as round-2 focus. Empty-state entrance fade also lives here (P.shop.empty.mot.1, 8.5). Full template applies. | 30 |
| 7 | Coins display (balance panel) + coin pill visual weight | DEEP | DEEP | R.gen.005 / R.cap.coins.012: coin pill visual weight below Hay-Day standard (8.5). P.shop.header.coins.prf.1: 12 full component re-renders per balance change (7.0). User flagged coin weight / visual hierarchy as round-2 focus. Full template applies. | 30 |
| 8 | Accessibility (keyboard nav, focus rings, aria labels) | DEEP | DEEP | R.cap.a11y BLOCKED (9.0 SRC, 9 below-bar). BLOCKED rows require browser session; code-fixable slice is WAI Tabs pattern (R.cap.tabs.012) and aria-disabled states. Depth stays DEEP; build output is static code changes only — browser verification deferred. Full template applies. | 30 |
| 9 | Empty states (no items owned in category; all placed) | MEDIUM | DEEP | P.shop.empty.mot.1 (8.5): no entrance fade on tab arrival. User explicitly flagged empty state entrance animation as round-2 focus item. Upgrading MEDIUM → DEEP. | 30 |
| 10 | Sorting (by price within category) | MEDIUM | MEDIUM | No below-bar rows specific to sorting logic in run-7 scorecard. No round-2 priority signal from user. Unchanged. | 15 |
| 11 | Inventory vs shop conceptual model | MEDIUM | MEDIUM | No specific below-bar rows. Structural model validated in round 1. Unchanged. | 15 |
| 12 | Category grouping logic | MEDIUM | MEDIUM | No below-bar rows. Data-model decision settled. Unchanged. | 15 |
| 13 | Responsive layout (mobile vs desktop grid) | MEDIUM | MEDIUM | R.cov viewport rows are all BLOCKED (require authenticated browser screenshots at 7 viewports). No code-fixable layout rows open. Unchanged. | 15 |
| 14 | Typography (item names, counts, prices) | MEDIUM | MEDIUM | P.shop.header.title at 8.5 (2 below-bar). No user priority signal for round 2. Minor improvement possible within MEDIUM budget. Unchanged. | 15 |
| 15 | Color and palette (panel chrome, card surfaces, accent) | MEDIUM | MEDIUM | R.cap.palette at 9.0 (2 below-bar). Palette specified and locked in calibration. Minor execution improvements within MEDIUM budget. Unchanged. | 15 |
| 16 | Hover / focus micro-interactions (card lift, button press, touch guard) | MEDIUM | DEEP | R.cap.hover BLOCKED (sticky-hover after tap on touch). Code-fixable path is adding @media (hover: hover) and (pointer: fine) guard. R.coh.007: golden-locked card missing hover lift. User flagged hover touch guard as round-2 focus item. Upgrading MEDIUM → DEEP. | 30 |
| 17 | Panel loading skeleton | MEDIUM | DEEP | R.cap.skeleton MIN at 9.0 (2 below-bar). Skeleton count: 12 tiles insufficient at 10-col large viewport. Fix: Math.max(12, gridCols * 2) or hard-set 24. User flagged skeleton count as round-2 focus item. Upgrading MEDIUM → DEEP. | 30 |
| 18 | Scroll behaviour within category grid | MEDIUM | MEDIUM | R.cap.scroll.002-003 BLOCKED (requires iOS device + perf trace). No code-fixable scroll rows open. Unchanged. | 15 |
| 19 | Border-radius vocabulary and system cohesion | NEW | DEEP | R.coh.005 at 7.5: four distinct border-radius values in use (24px / 12px / full / incidental). Standardise to three (outer 24px / cards 12px+xl / pills full). R.coh (category MIN) at 7.0 with 4 below-bar rows; this is the top cohesion defect category. New aspect not enumerated in round 1 — discovered via run-7 below-bar rows. Adding at DEEP because R.coh MIN is 7.0 (furthest from 9.5 in a non-BLOCKED category). | 30 |

---

## Depth change summary (round 1 → round 2)

| Aspect | Change | Reason |
|---|---|---|
| #9 Empty states | MEDIUM → DEEP | User flagged entrance animation; P.shop.empty.mot.1 at 8.5 code-fixable |
| #16 Hover / focus micro-interactions | MEDIUM → DEEP | User flagged hover touch guard; @media guard is code-fixable; R.coh.007 open |
| #17 Panel loading skeleton | MEDIUM → DEEP | User flagged skeleton count; Math.max fix is code-fixable; R.cap.skeleton MIN at 9.0 |
| #19 Border-radius vocabulary | NEW → DEEP | New aspect; R.coh.005 at 7.5; R.coh category MIN 7.0 (worst non-BLOCKED category) |

All other aspects carry forward at their round-1 depth with updated scoring context.

---

## Aspects structurally irrelevant (carried forward from round 1, unchanged)

- **Sound:** no audio system in codebase; calibration vibe rules out garish audio. Deferred indefinitely.
- **Personalization / account-based prefs:** out of scope for this panel; ownership is already account-bound via Supabase. Not a new surface.
- **SEO / OG / sitemap:** internal game UI panel, not a public indexable route. N/A.
- **Print stylesheet:** game UI. N/A.
- **Onboarding / coach marks:** no calibration signal; deferred to future round calibration.

---

## Round-2 code-fixable priority order (for build agent)

Derived from run-report "Top code-fixable rows" ranked by impact, cross-referenced against depth upgrades above:

1. **P.shop.buy (14 rows, 5.0 min)** — Add visible Buy chip at locked-card footer OR document card-as-button merger in calibration. This alone closes ~14 of the 27 rows (aspect #3, DEEP).
2. **R.gen.003 / P.shop.card.locked (6.0 min)** — Paper texture / ink edge treatment: SVG noise filter OR layered double-inset shadow OR paper overlay. Name-strip vs price-badge collision: move figcaption below aspect-square OR relocate price badge to top corner (aspect #2, DEEP).
3. **R.gen.002 / R.gen.009** — Tab pill parchment inflection: folded-paper corner, stamped-ink underline, or hand-drawn arch. Ink-blot drop-shadow OR ribbon ornament at tab top-left (aspect #1, DEEP).
4. **R.cap.hover touch guard** — Add @media (hover: hover) and (pointer: fine) wrapper around all hover: utilities. R.coh.007: golden-locked card hover lift (aspect #16, DEEP).
5. **R.coh.016 easing** — Replace linear count-down tween with cubic-bezier ease-out (aspect #6, DEEP).
6. **P.shop.empty.mot.1** — Add gdn-empty-fade entrance class to empty state container (aspect #9, DEEP).
7. **R.cap.skeleton count** — Math.max(12, gridCols * 2) skeleton tile count (aspect #17, DEEP).
8. **R.gen.005 coin pill weight** — Custom SVG coin glyph, Trirong digit, raised bevel, or minimum py-2.5 px-4 text-base with display font (aspect #7, DEEP).
9. **R.coh.005 border-radius** — Standardise to three values: 24px / 12px+xl / full (aspect #19, DEEP).
10. **R.cap.lock.002-003** — Bump unaffordable lock opacity ink-900/15 → ink-900/25 (aspect #5, DEEP).
11. **P.shop.header.coins performance** — Extract coin pill to React.memo OR drive via CSS custom property on ref (aspect #7, DEEP).
12. **R.gen.011 coin arc** — 4-6 radial sparkles on landing + rotation mid-arc (aspect #4, DEEP).
13. **R.coh.005 golden gate** — Bump progress bar h-1 → h-1.5; consolidate amber tokens to 3 (aspect #3 / #5).
14. **R.cap.tabs.012** — Uniform WAI Tabs pattern: pick automatic or manual, not both (aspect #8, DEEP).
15. **R.cap.cards.007** — Drag handle dots on hover in all modes OR document editing-mode gate in calibration (aspect #2, DEEP).
16. **Additional craft rows** — Remaining 06-judge-report.md rows 936-971 per run report (aspects #1-#7 as applicable).

---

## Intake closeout (no more questions this round)

- **Sacred items:** GardenScene.tsx scene canvas (do NOT touch), drag-drop logic (do NOT touch), inventory/shop panel below the scene only (per calibration Locked content block, round 1 and round 2 confirmed identical). No additions under AUTOPILOT.
- **Suspected bloat:** "let the rederive find it" (AUTOPILOT default).
- **Rollback policy:** Single baseline commit before structural cuts (AUTOPILOT default — recommended).
- **Redirect policy:** 308 permanent to new location (AUTOPILOT default). Note: this panel is a component within an existing route; route-level redirects are unlikely to be needed this round. Policy stands as safety default.
- **User-verification scope (this round):** Empty list — every BLOCKED-on-user-verification leaf (viewport screenshots, contrast measurements, keyboard flow, screen-reader transcript, iOS momentum scroll, reduced-motion / forced-colors emulation, real touch device for hover guard) defers to next round. (AUTOPILOT default.)
- **Spend cap:** €2 — default; if any paid generative work (fal-ai imagery, etc.) would exceed €2 this round, the orchestrator blocks and queues a separate confirmation turn rather than asking mid-round. (AUTOPILOT default.)

### User free-form notes (binding directives — verbatim)
> (none — user chose autopilot)

<!-- Downstream agents MUST read this block before scoring/judging/cutting.
     No conflicts with calibration were detected.
     Calibration Locked content is reproduced verbatim in Sacred items above.
     Round-2 user dispatch brief listed 8 focus items — all absorbed into depth-upgrade rationale rows above; none conflict with calibration. -->

---

## New aspects to re-run during build

If new aspects emerge during Phase 2 that were not enumerated here, DO NOT call AskUserQuestion again this round. Instead the orchestrator picks a default, documents it in `05-build-log.md`, and the next round's calibrator surfaces it. (This is the no-mid-round-questions rule the orchestrator enforces — see SKILL.md.)

---

## Depth summary for downstream agents

**DEEP aspects (12):** category tab navigation (#1), item card design (#2), purchase/unlock flow — Buy CTA (#3), coin micro-animation (#4), lock icon treatment (#5), animation and motion + easing (#6), coins display + coin pill weight (#7), accessibility (#8), empty states + entrance animation (#9, upgraded), hover/focus micro-interactions + touch guard (#16, upgraded), panel loading skeleton + count (#17, upgraded), border-radius vocabulary + system cohesion (#19, new).

**MEDIUM aspects (7):** sorting (#10), inventory vs shop conceptual model (#11), category grouping logic (#12), responsive layout (#13), typography (#14), color and palette (#15), scroll behaviour (#18).

**LIGHT aspects:** none — dial 8 sets floor at MEDIUM for all non-signature aspects.

**Dial vs depth sanity check:** PASS — dial 8 requires MEDIUM floor; no LIGHT aspects present. 12 of 19 aspects at DEEP (63%) is appropriate for a round focused on closing code-fixable defects across the lowest-scoring subtrees.
