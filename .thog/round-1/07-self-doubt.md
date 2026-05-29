# Self-Doubt Gate — round 1

## Context: state of play at gate entry

Ledger: 577 leaves, all still TODO (no leaves have been formally promoted to PASS).
Judge runs completed: 7. Run 7 is the current cold pass (NOT READY, 6.8/10, 158 below-bar, 27 BLOCKED-with-named-user-input).
Fix passes completed: 9. Fix-pass-9 addresses 3 items from run 7: golden-locked name collision (`bottom-4`), ink-edge shadow strengthened (0.11/0.08 opacity), coin tween deferred to arc landing (650ms setTimeout).
Evidence basis for this gate: SRC read of GardenScene.tsx post-fix-pass-9 + the full judge run 7 report + build log.

Structural constraint (acknowledged throughout the build loop): GardenScene.tsx requires Supabase authentication and live item/coin/layout data to render. No browser preview was available during the build loop. All SEE, MEAS, and live-DOM CS leaves are BLOCKED-with-named-user-input and are not silent PASSes.

---

## Q1. What am I most likely WRONG about?

### 1a. R.gen.003 — card surface ink-edge still far below bar (HIGH certainty)

Run 7 scored this 6.0 with a detailed finding: the `inset 0 0 0 1px rgba(31,25,15,0.06)` shadow from fix-pass-8 is "not perceivable at normal viewing distance" on a white card. Fix-pass-9 strengthened it to `rgba(31,25,15,0.11)` and changed the blur layer to `rgba(31,25,15,0.08)` with `spread 4px` (source line 870). This is better but the criterion demands "paper texture, ink edge, or hand-stamped quality" — a double-inset hairline at 11% black against a bg-white/60 card still reads as "hairline border," not as the cozy handcrafted paper surface R.gen.003 demands. No texture overlay was added. Run 7 said: "current state is closer to 'card has a hairline border' than 'handcrafted cozy game card.'" Fix-pass-9's change is incremental; the criterion will still not score 9.5 from source alone.

Re-open: R.gen.003, P.shop.card.locked.vis.4

### 1b. R.cap.cards.011 / P.shop.card.locked.vis.5 — name strip vs price badge collision on locked cards (HIGH certainty)

Run 7 scored this collision 6.0. Fix-pass-9 fixed the golden-locked variant by moving the name pill to `bottom-4` (`inset-x-1 rounded-sm`, source line 1258). But the standard locked card (purchasable variant) has the name at `bottom-7` (line 1217) and the price badge centered at `bottom-2` — those are 4px apart on a card that may be as small as 76px wide at 360px viewport. Run 7 also identified the owned-card name at `bottom-0` (line 1190). Multiple collision scenarios persist across the three locked/purchasable/owned variants. The golden-locked fix does not clear the underlying "name strip occludes overlapping badge" problem across the full card family. This warrants continued scrutiny.

Re-open: R.cap.cards.011, P.shop.card.locked.vis.5

### 1c. R.cap.coin.012 — tween-arc sync timeline (HIGH certainty)

Run 7 scored this 8.5 with a detailed timeline: tween runs 350ms from server confirm (line 576), arc lands at 650ms from same start (line 590). Even with fix-pass-9 deferring `setLocalCoins` to the 650ms landing setTimeout (source line 583), the count-down tween fires when `localCoins` changes — which now happens at 650ms inside the setTimeout. The tween then runs for 350ms after that, finishing at ~1,000ms from server confirm, meaning the tween START aligns with arc landing but the final number does not settle until 350ms after the coin visually lands on the pill. The criterion (R.cap.coin.012) says "balance number updates synchronously with the landing beat — not before, not after — synced." A 350ms post-landing tween is not synced to the landing beat; it begins there but finishes 350ms later. Whether this reads as "good enough" or "still off-spec" requires a SEE judgment in a real browser. Marking MED confidence rather than FAIL, but flagging.

Re-open (for SEE verification): R.cap.coin.012

### 1d. P.shop.buy leaf family — card-as-button architecture (HIGH certainty)

Run 7 scored the P.shop.buy subtree minimum at 5.0 and called 14 of the 39 leaves unresolvable under the "card IS the button" architecture. None of fix passes 8 or 9 added a dedicated Buy chip or documented the merger in calibration. The following source-verifiable PASSes in this subtree are scored correctly: buy.a11.1 (real button), buy.int.11 (purchasingRef debounce), buy.cpy.2 (branched error copy), buy.prf.1 (optimistic optimism). The following remain FAIL without a dedicated buy CTA or calibration note: buy.vis.1-4 (no distinct button surface), buy.cpy.1 (no visible "Buy" word), buy.sub.1 ("Buy" + price in <0.5s — impossible when the CTA is just a price chip), buy.mot.1/2 (hover/press on dedicated button — there is no dedicated button). These were flagged in run 7 and are still open.

Re-open: P.shop.buy.vis.1, P.shop.buy.vis.2, P.shop.buy.vis.4, P.shop.buy.cpy.1, P.shop.buy.sub.1, P.shop.buy.mot.1, P.shop.buy.mot.2, P.shop.buy.int.4

### 1e. R.gen.002 — tab pills are still genre-default (HIGH certainty)

Run 7 scored this 8.0 and called it out explicitly: "sliding rounded-full bg-moss-600 pill" still reads as "Tailwind pill bar with a custom indicator." Fix passes 8 and 9 did not touch tab pill styling (no folded-corner, no stamped-ink treatment, no parchment inflection). The criterion says "NOT plain flat-color rectangles — has a parchment/inflected treatment." Still FAIL.

Re-open: R.gen.002, P.shop.tabbar.tab.vis.2

### 1f. R.cap.coins.012 — coin pill visual weight still below Hay-Day standard (HIGH certainty)

Run 7 scored this 8.5 and said: "coin pill needs more visual weight — consider Trirong italic numeral (display font) at 16-18px, OR a custom SVG coin glyph with bevel." Fix-pass-9 did not touch pill styling. The criterion R.cap.coins.012 says "feels substantial (not a thin badge); has visual weight per ref.hayday.003." Current source: `py-2 min-w-[72px]` with coin-gold tokens — improved border/bg from fix-pass-8 but still a rounded label, not a "beat." Score is borderline but not yet 9.5.

Re-open (borderline): R.cap.coins.012, R.ref.hayday.003

### 1g. R.cap.hover.no-touch — no hover media-query guard (HIGH certainty)

No `@media (hover: hover) and (pointer: fine)` block anywhere in the JSX or the global CSS injected by GardenScene. All `hover:` Tailwind utilities apply on touch devices, creating sticky-hover after tap. Run 7 scored this 8.5 (code-fixable). Fix passes 8 and 9 did not address it.

Re-open: R.cap.hover.no-touch

### 1h. P.shop.empty.mot.1 — empty state has no entrance fade (HIGH certainty)

Run 7 scored this 8.5 (code-fixable). The empty state container at source lines 1337-1369 has no animation class. When `tabItems.length === 0` becomes true, the container appears instantly. The panel fade `gdn-panel-enter` is on the tabpanel wrapper, not on the empty state itself, so the empty state does not inherit the entrance animation. Fix passes 8 and 9 did not add one.

Re-open: P.shop.empty.mot.1

### 1q. Nothing suspicious about run 7's explicitly confirmed PASSes

Run 7 explicitly confirmed these as PASS with source line citations: aria-live dual-region wiring (R.cap.a11y.live.001/002 at 9.5), progressbar ARIA on golden gate (R.cap.a11y.progressbar), forced-colors CSS block (line 917-922, R.cap.a11y.forced-colors), prefers-contrast block (lines 925-930), overscroll-contain + max-h-[70vh] (line 1124), coins pill min-w + aria-live (lines 970-973), visibilityState guard on coin arc (line 577), skeleton loading prop with 12 pulsed tiles and role="status" (lines 1096-1115), panel-level error with role="alert" (lines 1086-1093), owned-first sort (lines 198-207), Home/End keyboard navigation (lines 840-841), roving tabindex (line 860). These were multi-evidence (SRC + line numbers) and the cold judge read them independently. HIGH confidence. No reason to doubt these.

---

## Q2. PASS did I mark from CONVENIENCE?

No leaves have been formally marked PASS in the ledger (all still TODO). The risk is that judge run 7 implicit PASSes in its prose were accepted too easily. Walking the specific risk patterns:

**Rows scored from source when criterion is about runtime behaviour:**

- R.cap.coin.007 ("transform+opacity only — no layout-shifting properties") — SRC-verifiable PASS. Keyframe at lines 876-912 uses only transform/opacity. HIGH confidence.
- R.cap.coin.015 (tab-hidden guard) — SRC shows `document.visibilityState === "visible"` guard at line 577. HIGH confidence.
- R.cap.motion.coh.002 (transform/opacity only for all motion) — SRC-verifiable. HIGH confidence.
- R.cap.motion.coh.003 (reduced-motion block) — the `@media (prefers-reduced-motion: reduce)` block at lines 766-771 is present in source. Whether it works at runtime is BLOCKED (SEE). The source-level criterion is passed; the runtime criterion is blocked.
- R.cap.a11y.forced-colors — source has the CSS block at lines 917-922. Runtime correctness is BLOCKED. Source-level: PASS. Runtime: BLOCKED. Convenience risk exists if this was implicitly declared PASS with no runtime test.

**Rows where judge accepted as "borderline PASS" that are actually below bar:**

- R.cap.motion.coh.001 / R.coh.016 (easing families) — run 7 table shows "2 families (spring + standard) — PASSES at root, but tween uses linear interpolation." Scored 9.0 at root. However, R.cap.motion.coh.001 specifically says "all four motion surfaces use the same easing family." Three families do exist (spring, standard, linear tween) even if run 7 softened this to 9.0. The linear tween is a different family from the other two. If the standard is strict, this does not score 9.5. Flagging as convenience borderline.
- R.cap.skeleton.001-007 — run 7 confirmed implementation; scored this subtree at 9.0 minimum with 2 below-bar. The 12-skeleton count at large viewports (should be ~20-24 at 10-col grid) remains a FAIL. The run 7 table scores this 9.0 — above the 9.5 bar? No, the minimum of the subtree at 9.0 is still BELOW the 9.5 bar. This subtree FAILS MIN-rollup at 9.0.

**Rows where visual quality can't be judged from source:**

Run 7 explicitly blocked all visual quality rows (R.gen.*, R.ref.*, R.cap.cards.* visual rows) as requiring SEE. No visual quality row was marked PASS by the judge without a browser. These are not convenience PASSes — they are properly BLOCKED.

**Skill-routing rows (*.rte.1):** Build log explicitly says TDD was not invoked for purchase flow. No test files exist for the panel. All *.rte.1 rows that reference TDD cannot pass on SRC alone. These are low-risk (leaf count is small) but are technically below bar.

Re-open from Q2: R.cap.motion.coh.001 / R.coh.016 (linear tween third family), R.cap.skeleton.001 (12-tile count below large-grid needs, subtree MIN is 9.0 which fails 9.5 bar), all *.rte.1 rows where TDD is cited.

---

## Q3. State not exercised

No live browser session was opened at any point in the 9 fix passes or 7 judge runs. All states below are unexercised. These are BLOCKED-with-named-user-input per the structural constraint acknowledgment in build log line 235-237.

**Viewports:** 360px, 390px, 768px, 1024px, 1280px, 1440px, 1920px — zero screenshots taken. All R.cov.vp.* leaves BLOCKED. The grid breakpoints `grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10` are confirmed in source, but whether layout is sound at each viewport (no overflow, correct density) cannot be verified without screenshots.

**Hover states at runtime:** Card scale lift (1.04), shadow grow (`hover:shadow-md`), tab tone shift, buy badge deepening — none triggered. R.cap.hover.card.001/002, R.cap.hover.btn.001/002, R.cap.hover.tab.001 all BLOCKED on SEE.

**Focus and keyboard flow at runtime:** Tab order through panel, Arrow-key tab cycling, Home/End, focus-ring visibility on all surfaces, focus-ring unobstructed by sticky overlay, focus after purchase — none observed. R.cap.a11y.focus.001-005, R.cap.a11y.kb.001 BLOCKED.

**Purchase flow at runtime:** Pending state (price chip showing "…"), optimistic card flip timing, inline error (rose chip + retry), error rollback visual, post-purchase focus landing — none triggered. R.cap.buy.003, R.cap.buy.int.3-8, P.shop.buy.mot.3/4/5, P.shop.buy.int.6/7/8 all BLOCKED.

**Coin animation surfaces at runtime:** Parabolic arc shape, sparkle ::before/::after visibility at landing, land-pulse on pill, whether arc feels "warm and handcrafted" vs "a div translating along a path" — none seen. R.cap.coin.002/003/004/005, R.cap.coin.014 BLOCKED.

**Card stagger pop-in at runtime:** Whether the scale(0.96) → scale(1) feels natural, timing bands, whether cards ≥12 in the stagger cap correctly use the 280ms ceiling — none verified. R.cap.motion.card.001/002/003 BLOCKED.

**Unlock reveal at runtime:** Whether `gdn-unlock-reveal` keyframe (scale to 1.04, brightness 1.08, saturate 1.2) reads as satisfying or jarring; whether lock badge fade (opacity-0 via `isBeingBought` transition) is perceptible — not seen. R.cap.motion.unlock.001-004, R.cap.lock.011 (the fade timing) BLOCKED on SEE.

**Reduced-motion mode at runtime:** Whether gdn-panel-enter, gdn-card-stagger, gdn-coin-fly, gdn-unlock-reveal, gdn-coin-landed all collapse correctly; whether the count-down tween snap works — not exercised. R.cov.motion.reduced BLOCKED.

**Contrast measurements:** Inactive tab label over white bg, price chip text over coin-gold-50, locked card "in scene" label on ink-900/75, unaffordable lock badge at ink-900/15 over cream card, coin balance amber text over coin-gold-50 — none computed. R.cov.contrast.default, R.cap.a11y.contrast.001-003, all MEAS rows BLOCKED.

**Prefers-contrast: more at runtime:** Whether the `@media (prefers-contrast: more)` block (lines 925-930) actually renders 2px ink borders on cards and skeleton tiles — not tested. R.cap.a11y.contrast.more (source: PASS from CSS block; runtime: BLOCKED).

**Forced-colors mode at runtime:** Whether `[data-tab-indicator] { background: CanvasText; forced-color-adjust: none; }` actually prevents the indicator from disappearing in Windows High Contrast — not tested. R.cap.a11y.forced-colors (source: PASS; runtime: BLOCKED).

**Data states not exercised:** Loading skeleton (requires a true loading prop = true moment with live data); empty category (all 4 categories have items by design, requiring deliberate seeding to trigger); all-owned (requires completing all purchases); partial-ownership grid with all three card variants in same view; purchase error path at server level; unauthenticated state.

**Touch input:** Long-press drag from inventory, sticky hover after tap, 76px card tap target adequacy at 360px/4-col viewport — not tested.

**Screen reader:** VoiceOver/NVDA on tab navigation, purchase announcement timing from polite vs assertive regions, balance announcement text ("Coin balance: N coins"), progressbar reading on golden cards — not tested.

**200% browser zoom + text-spacing override:** Not tested (R.cov.iso.viewport-zoom-200, R.cov.iso.text-spacing).

Re-open from Q3: All R.cov.vp.* (7), R.cov.contrast.* (3), R.cov.input.* (3), R.cov.motion.* (2), R.cov.iso.* (2), R.cap.hover.* SEE rows (5), R.cap.motion.* MEAS rows (5+), R.cap.coin.002-005/009 SEE+MEAS (5), R.cap.a11y.focus.001-005/kb.001 (6), R.cap.scroll.002-003 (2), R.cap.a11y.forced-colors runtime (1), R.cap.a11y.contrast.more runtime (1), R.cap.cards.010/014 (2), all R.ref.* visual rows (28), all R.gen.* visual rows (13 of 15). Approximately 27 confirmed BLOCKED rows from run 7 plus additional visual-quality rows from the per-element subtrees. Total BLOCKED: ~130 leaves.

---

## Q4. Aspect template skipped for some element?

Walking the 13-row aspect checklist for each non-trivial element against the criteria tree. The 577-leaf ledger was built with the full 12-aspect template for signature elements and a subset for ambient surfaces.

**P.shop.card.locked (41 leaves):** All 13 aspects have leaves. MOTION has 5 rows (pop-in, hover lift, unlock reveal, no-init-jump, reduced-motion). COPY has 2 rows (canonical name, "Buy" label). COHESION has 1 row. No mis-pruning.

**P.shop.card.owned-unplaced (26 leaves):** All 13 aspects have leaves. MOTION has drag-start lift (mot.3) and reduced-motion (mot.4). INTERACTION has drag-affordance states. No mis-pruning.

**P.shop.card.owned-placed (23 leaves):** All 13 aspects have leaves. MOTION includes the scene-return staged transition (mot.3). No mis-pruning.

**P.shop.buy (39 leaves):** All 13 aspects have leaves with heavy depth (5 MOTION rows, 6 A11Y rows, 2 COPY rows). No mis-pruning.

**P.shop.golden-gate (24 leaves):** All 13 aspects have leaves. MOTION includes the unmet→met celebration (mot.2) which is currently a FAIL (no implementation). COPY has "focus hours" consistency (cpy.1) and one-word Claim (cpy.2). No mis-pruning.

**P.shop.empty (20 leaves):** Full template applied. COPY has 4 rows including the specific forbidden-phrase prohibition (cpy.1, cpy.3). No mis-pruning.

**R.cap.coin (15 leaves):** MOTION sub-spec covers all stages: lift, arc, landing, sparkle, timing, GPU, no-layout-shift, reduced-motion, tab-hidden, sync with balance, easing, aesthetic, blocking of subsequent purchases. This is the most granular subtree. No mis-pruning.

**P.shop.header.coins (24 leaves):** Full 12-aspect template. PERFORMANCE leaf (prf.1: balance update does not trigger panel-wide reflow) exists and is currently FAIL (the displayCoins setInterval triggers full-component re-renders). This leaf is in the tree. No template gap, but the FAIL is real.

**R.cap.tabs (15 leaves):** MOTION row covers the outgoing fade (R.cap.motion.tab.001) which is still FAIL — tab content snaps on change because the outgoing panel unmounts immediately. INTERACTION covers the activation mode consistency (R.cap.tabs.012). No mis-pruning.

**One aspect gap found (MOTION on golden-locked card variant):** The golden-locked card at source lines 1234-1261 has NO hover utility class (`hover:scale-[1.04]` is absent). Run 7 structural note 7 confirmed this. The criteria tree has R.cap.hover.card.001 (general hover language for all cards) and P.shop.card.locked.mot.2 (hover lift on locked card), but there is no leaf specifically for "golden-locked card hover lift." The golden-locked variant is scored under R.coh.007 (hover language consistent) which would fail if this variant lacks hover. However, the criteria tree does not have a dedicated golden-locked hover leaf; it is implied by R.coh.007. This is a minor gap — the correct row to score is R.coh.007, which does exist. No tree change needed; score R.coh.007 as FAIL.

**COPY rows for all elements with text:** Every element that has visible or SR text has COPY leaves. The empty state has 4 COPY rows. The buy CTA has 2 COPY rows. The golden gate has 2 COPY rows. No mis-pruning.

**COHESION rows:** Every element has at least one COHESION leaf. The card family has R.cap.cards.016 (same footprint) and P.shop.coh.* at the section level. No mis-pruning.

Re-open from Q4: none structurally. The golden-locked hover gap is covered by R.coh.007 (already in tree). Flag R.coh.007 as FAIL to ensure it is scored.

Additional flag: R.coh.007 — golden-locked card (source line 1234) has no `hover:scale-[1.04]` or `hover:shadow-md`, making hover language inconsistent across the card family. Re-open: R.coh.007.

---

## Q5. Confidence band review

Ledger has 577 leaves (≥400). Applying the Q5 sampling rule: 10% per subtree + every leaf run 7 scored ≥9.5.

Run 7 explicitly scored R.cap.a11y.live.001/002 at 9.5 (source: "9.5 PASS, verified by source"). These two leaves are HIGH confidence: dual aria-live regions at lines 822 and 825, switch logic on purchaseError is correct, wired to correct aria-live values. These do not need re-examination.

| Subtree | Sampled | HIGH | MED | LOW | Action |
|---|---|---|---|---|---|
| R.coh (20) | 2 | R.coh.002 (no new font) | R.coh.016 (easing — 3rd family concern), R.coh.007 (golden-locked hover absent) | — | R.coh.007 re-open; R.coh.016 borderline |
| R.gen (15) | 2 | R.gen.020 (no icon lib) | R.gen.011 (coin arc quality — SEE) | R.gen.003 (ink-edge), R.gen.002 (tab genre-default) | 2 LOWs that are source-level FAIL |
| R.ref.scene (10) | 1 | R.ref.scene.007 (coin SOT — SRC) | R.ref.scene.001-006 (SEE) | R.ref.scene.008 (drag handoff — SEE) | All SEE rows BLOCKED |
| R.ref.stardew (10) | 1 | — | R.ref.stardew.002/005 (glanceability, density — SRC partial) | R.ref.stardew.008 (handcrafted feel — IND) | All SEE/IND BLOCKED |
| R.ref.hayday (8) | 1 | — | R.ref.hayday.002 (soft shadow — CS blocked) | R.ref.hayday.003 (coin UI weight — SEE) | BLOCKED |
| R.pit (8) | 1 | R.pit.002 (4 categories — SRC), R.pit.005 (no FOMO — SRC) | R.pit.001 (beauty bar — IND) | R.pit.004 (buy inline — SEE runtime) | IND rows need independent confirmation |
| R.cov (28) | 3 | R.cov.state.auth (SRC), R.cov.state.unauth (SRC) | — | 26 of 28 leaves (require browser) | All viewport/input/motion rows BLOCKED |
| R.cap.tabs (15) | 2 | R.cap.tabs.009 (ARIA — SRC), R.cap.tabs.011 (roving tabindex — SRC), R.cap.tabs.014 (min-h-44 — SRC), R.cap.tabs.010 (Home/End — SRC 840-841) | R.cap.tabs.005 (slide quality — SEE), R.cap.tabs.006 (timing — CS blocked) | R.cap.tabs.004 (contrast — MEAS) | 4 HIGH-confidence SRC PASSes; SEE/MEAS BLOCKED |
| R.cap.cards (16) | 2 | R.cap.cards.006 (no re-buy — SRC), R.cap.cards.016 (same footprint — SRC) | R.cap.cards.009 (silhouette — SEE), R.cap.cards.013 (padding — CS) | R.cap.cards.011 (name/badge collision) | 2 HIGH; 1 LOW (source-level collision) |
| R.cap.buy (17) | 2 | R.cap.buy.008 (debounce — SRC), R.cap.buy.009 (server action — SRC), R.cap.buy.016 (golden no coin-CTA — SRC) | R.cap.buy.003 (pending visible — SEE) | R.cap.buy.005 runtime rollback timing | Some HIGH; 14 P.shop.buy leaves BLOCKED by arch |
| R.cap.coin (15) | 2 | R.cap.coin.001 (arc on success confirmed — SRC line 563+), R.cap.coin.007 (transform/opacity — SRC), R.cap.coin.010 (reduced-motion CSS — SRC), R.cap.coin.015 (visibilityState — SRC line 577) | R.cap.coin.002-005 (visual quality — SEE), R.cap.coin.012 (sync timing — SEE) | R.cap.coin.009 (60fps — MEAS) | 4 HIGH from SRC; SEE/MEAS rows BLOCKED |
| R.cap.lock (12) | 2 | R.cap.lock.001 (two states — SRC), R.cap.lock.006 (no native disabled — SRC line 1029) | R.cap.lock.002-003 (visual tone — SEE) | R.cap.lock.011 (dissolve timing — SEE; source partial) | Lock dissolve depends on `isBeingBought` transition; SEE needed |
| R.cap.motion (15) | 2 | R.cap.motion.coh.002 (transform/opacity — SRC), R.cap.motion.coh.003 (reduced-motion CSS block — SRC) | R.cap.motion.tab.001/002 (timing SEE), R.cap.motion.unlock.001-004 (SEE) | R.cap.motion.coh.001 (easing: linear tween 3rd family), R.cap.motion.coh.005 (fps — MEAS) | 2 HIGH; LOWs include easing family concern |
| R.cap.coins (12) | 2 | R.cap.coins.004 (tabular-nums — SRC), R.cap.coins.005 (localCoins optimistic — SRC), R.cap.coins.008 (aria-live on pill — SRC line 970-973), R.cap.coins.009 (accessible label prefix — SRC) | R.cap.coins.007 (land-pulse runtime — SEE) | R.cap.coins.012 (visual weight — SEE) | Several HIGH from recent fixes; weight SEE BLOCKED |
| R.cap.a11y (28) | 3 | R.cap.a11y.region.001 (aria-label — SRC line 783), R.cap.a11y.tabs.001/002 (ARIA pattern + roving tabindex — SRC), R.cap.a11y.buy.001 (real button — SRC), R.cap.a11y.live.001/002 (dual aria-live — SRC, 9.5 confirmed) | R.cap.a11y.focus.001-005 (ring SEE), R.cap.a11y.kb.001 (keyboard flow SEE) | R.cap.a11y.contrast.001-003 (MEAS) | 7 HIGH from SRC; SEE/MEAS BLOCKED |
| R.cap.empty (7) | 1 | — | R.cap.empty.001 (branch exists — SRC) | R.cap.empty.002 (SVG illustration exists — HIGH from run 7 SRC: lines 1337-1369 watering-can SVG) | R.cap.empty.005 (no specific next-action CTA) — borderline |
| R.cap.skeleton (7) | 1 | R.cap.skeleton.007 (role=status + aria-label — SRC lines 1096-1115) | R.cap.skeleton.001 (12 tiles at large grid — LOW count), R.cap.skeleton.002 (shape match — SRC confirms aspect-square + rounded-xl) | R.cap.skeleton.003/004 (shimmer SEE, reduced-motion SEE) | Subtree MIN is 9.0 per run 7 — still fails 9.5 bar |
| R.cap.sort (4) | 1 | R.cap.sort.001 (owned-first — SRC lines 198-207), R.cap.sort.004 (golden by focus-hours — SRC) | R.cap.sort.003 (no reshuffle — SEE) | — | 2 HIGH; SEE needed |
| R.cap.hover (7) | 1 | — | R.cap.hover.card.001/002 (scale+shadow — SRC confirmed 1.04 + hover:shadow-md on 3 variants) | R.cap.hover.no-touch (no media guard — source FAIL), R.cap.hover.tab.001 (SEE) | 1 source FAIL (no-touch); rest BLOCKED |
| P.shop.coh (8) | 1 | P.shop.coh.003 (glyph match — SRC) | P.shop.coh.002 (vertical rhythm — CS) | P.shop.coh.001 (px-4 alignment — needs SEE), P.shop.coh.007/008 (vocab SEE) | Mixed |
| P.shop.header.coins (24) | 3 | coins.typ.1 (tabular-nums — SRC), coins.int.1 (not a button — SRC), coins.a11.2 (label includes "coins" — SRC), coins.a11.1 (aria-live — SRC line 970) | coins.vis.1/2 (composition — SEE), coins.rsp.1/2 (fits at 360 — SEE) | coins.prf.1 (full re-render concern — note: displayCoins tween uses setInterval which triggers re-renders; mitigated by displayCoins being a separate state from others but still component-level) | 4 HIGH; SEE rows BLOCKED |
| P.shop.tabbar.tab (33) | 4 | tab.cpy.1/2 (one-word labels — SRC), tab.a11.1-3 (ARIA — SRC), tab.a11.5 (min-h-44 — SRC) | tab.vis.2 (active visual hierarchy — SEE), tab.mot.2 (indicator slide quality — SEE) | tab.vis.2 (genre-default concern per R.gen.002) | Some HIGH from SRC; genre-default concern is LOW |
| P.shop.card.locked (41) | 5 | locked.a11.1/2 (accessible name, lock aria-hidden — SRC), locked.cpy.1 (canonical name — SRC), locked.prf.1 (no backdrop-filter — SRC) | locked.vis.1-5 (visual quality — SEE), locked.mot.1 (pop-in SEE) | locked.vis.5 (name/badge collision — LOW confidence, source-level collision on non-golden variants) | Collision concern flagged |
| P.shop.card.owned-unplaced (26) | 3 | ou.vis.1 (no lock/price — SRC), ou.a11.1 (accessible name — SRC), ou.cpy.1 (no badge label — SRC) | ou.vis.2 (drag affordance — SEE), ou.mot.2 (hover lift — SEE) | — | SEE rows BLOCKED |
| P.shop.card.owned-placed (23) | 3 | op.a11.1/2 (accessible name, text alternative — SRC), op.cpy.1 ("in scene" 2 words — SRC) | op.vis.1 (sprout stamp — SRC confirms SVG badge at line 1182), op.mot.1/2 (pop-in/hover — SEE) | — | SEE rows BLOCKED |
| P.shop.buy (39) | 4 | buy.a11.1 (real button — SRC), buy.int.11 (debounce — SRC), buy.cpy.2 (specific error copy — SRC), buy.prf.1 (optimistic — SRC) | buy.mot.3 (pending SEE) | buy.vis.1-4/cpy.1/sub.1/mot.1/2/int.4 (arch constraint — card-as-button) | 14 LOW leaves due to arch; not convenience PASSes but structural blocks |
| P.shop.golden-gate (24) | 3 | gg.a11.1/2 (accessible name, progressbar — SRC), gg.cpy.1 (focus hours — SRC), gg.cpy.2 (Claim one word — SRC) | gg.vis.1/3 (visual distinction — SEE) | gg.vis.2 (progress bar visible — golden-locked name at bottom-4 fix-pass-9 confirmed; bar at bottom-1.5 now unobstructed — MED confidence from SRC; SEE needed) | Fix-pass-9 should clear golden collision; SEE to confirm |
| P.shop.empty (20) | 2 | empty.need.1 (justified — SRC, branch exists), empty.a11.2 (SVG aria-hidden — SRC) | empty.vis.1 (watering-can SVG — HIGH from run 7 SRC), empty.cpy.1 (voice copy — run 8 changed to character voice — MED) | empty.mot.1 (no fade-in — LOW, source FAIL) | empty.mot.1 confirmed FAIL; copy MED |
| P.shop.loading (15) | 2 | loading.a11.1 (role=status — SRC), loading.prf.1 (CSS-only — SRC) | loading.vis.1 (shape match — SRC confirms aspect-square matches), loading.vis.3 (12 tiles at default viewport — MED, 12 may be thin at 10-col) | loading.mot.1/3 (shimmer/reduced-motion — SEE) | Subtree MIN 9.0 from run 7 fails 9.5 bar |
| P.shop.error (17) | 2 | error.a11.1 (role=alert — SRC), error.prf.1 (one retry per click — SRC), error.cpy.2 (no apology spiral — SRC) | error.vis.1/2 (warm tone, retry CTA — SEE), error.mot.1 (fade-in — SEE) | — | SEE rows BLOCKED |

---

## VERDICT

**NOT GREEN YET.**

The gate surfaces honest concerns in three categories:

**Category A — Source-level FAILs fixable in code (no browser needed):**

1. R.gen.003 / P.shop.card.locked.vis.4 — ink-edge 0.11 opacity still reads as hairline border; no texture overlay; criterion demands paper texture OR ink edge OR hand-stamped quality (fix-pass-9 did not resolve this)
2. R.cap.cards.011 / P.shop.card.locked.vis.5 — name strip vs price badge collision on non-golden locked cards (fix-pass-9 only fixed golden-locked; standard locked at bottom-7 still collides with price chip at bottom-2)
3. R.gen.002 / P.shop.tabbar.tab.vis.2 — tab pills genre-default (smooth moss-600 rounded-full pill, no parchment inflection); not addressed in fix passes 8 or 9
4. R.cap.hover.no-touch — no `@media (hover: hover)` guard; sticky hover on touch devices; not addressed
5. P.shop.empty.mot.1 — empty state container has no entrance fade animation; pops in instantly
6. R.cap.motion.coh.001 / R.coh.016 — linear interpolation in the count-down tween is a third easing family (spring + standard + linear); subtly below the "all motion same family" requirement
7. R.cap.skeleton (subtree MIN 9.0) — 12 skeleton tiles is insufficient at large viewports (10-col grid = 20+ expected); subtree MIN at 9.0 fails the 9.5 bar
8. R.cap.skeleton.003 (shimmer SEE) + R.cap.skeleton.004 (reduced-motion SEE) — two below-bar leaves confirmed by run 7 within the skeleton subtree
9. R.coh.007 — golden-locked card has no hover lift or shadow, making hover language inconsistent across card family
10. P.shop.buy.vis.1-4 / buy.cpy.1 / buy.sub.1 / buy.mot.1/2 / buy.int.4 — approximately 14 P.shop.buy leaves unresolvable under card-as-button architecture without either a dedicated Buy chip or a calibration-level documentation of the merger
11. R.cap.coins.012 (visual weight) — coin pill still a thin label, not Hay-Day-grade weight
12. R.cap.motion.coh.001 easing linear tween concern (above)

Re-open count (source-fixable): approximately 30 rows, consistent with run 7's "30 code-fixable" finding, with the three fix-pass-9 items now resolved (golden collision, ink-edge opacity lift, coin tween timing) but the broader list from run 7 otherwise intact.

**Category B — BLOCKED-with-named-user-input (require live browser session):**

The 27 BLOCKED rows from run 7 remain. These require an authenticated browser session at ≥5 viewports with real Supabase data, keyboard end-to-end flow, screen-reader transcript, contrast measurements, reduced-motion emulation, forced-colors emulation, and iOS touch device for momentum scroll. No change to this count from fix-pass-9 (the three fix-pass-9 items did not touch any BLOCKED row).

Re-open count (BLOCKED): 27 confirmed from run 7 + approximately 103 additional visual-quality/SEE/MEAS rows that run 7 counted in its 158-below-bar total.

**Summary re-open count:** 30 source-fixable + 27 named-BLOCKED + approximately 101 broader visual/SEE leaves = approximately 158 total, consistent with run 7's count of 158 below-bar + 27 BLOCKED.

**Path to green:**

1. Address the 30 source-fixable rows (priority: card surface texture, name-badge collision on standard locked cards, tab pill treatment, hover touch guard, empty state fade, skeleton count, Buy CTA architectural resolution, hover language on golden-locked card).
2. Run a live browser session at ≥5 viewports (360, 768, 1280, 1440, 1920) with Supabase auth and real seeded data. Capture screenshots, keyboard purchase flow, screen-reader transcript, and contrast measurements.
3. Judge run 8 (cold pass) after both steps complete.
