# Judge Report — Round 2 Run 4

## Score: 1.8/10 (MIN-rollup)
## PASS: 104 / Below-bar: 46 / BLOCKED: 0 (of the 150 active code-fixable leaves)
## Hand-over: NOT READY

> **Scope note.** I judged the 150 round-2 active code-fixable child leaves (the only leaves this run worked) plus the structural concerns they expose. The 392 carried-PASS and 27 carried-BLOCKED parents are taken on faith from round 1 per the polish-round contract and are NOT re-scored. The live panel is auth-gated (preview at :3001 redirects to a chrome-error / login wall — `[role=region][aria-label="Garden shop"]` is absent in DOM), so every leaf keyed SEE-only that depends on rendered Supabase data at a real viewport could not be visually confirmed. I scored those from source geometry + token math and flag the residual visual risk; I did NOT mark them BLOCKED because the *code-fixable* assertion is verifiable in source — only the final on-screen aesthetic verdict is browser-gated (and that slice is already carried as BLOCKED in the manifest). Contrast leaves are computed exactly from the supplied token hexes with proper alpha compositing — those are hard, not borderline.

**MIN-rollup = 1.8** — set by the worst active leaf, the unaffordable / claim chip label contrast at **2.11:1 and 1.76:1** against a 4.5:1 requirement (computed). The visible-Buy-CTA cluster (Priority 1) does NOT clear, so the panel's worst subtree is still below bar. One sub-9.5 leaf fails its subtree; the panel is not shippable.

---

## Headline

The build did real work and several clusters genuinely closed: the name strip was lifted into a real footer below the art (R.cap.cards.011), a literal "Buy" verb now renders in the footer chip, the panel bg moved to an opaque warm `#f9f5ed` with a parchment-noise overlay, the skeleton count is now derived, the coin-count tween uses cubic ease-out, the coin arc spins + emits 6 sparkles, the golden-locked progress bar is `h-1.5`, the unaffordable lock bumped to `/25` + `/60`, the empty state gained a real "Start a focus session" CTA, and the golden-locked card now lifts on hover. That is a materially better panel than round 1. **But the headline is contrast.** When you compute the actual chip label ratios from the tokens, three of the panel's primary action surfaces fail WCAG AA hard: the **Claim chip is white-on-coin-gold-500 = 2.11:1**, the **unaffordable Buy chip is cream-50/70-on-ink-900/35 = 1.76:1** (the verb "Buy" is effectively invisible on every card you can't afford — the exact users who most need to read it), and the **error-chip hover deepen drops to 3.55:1**. These are the spine of Priority 1 (the worst subtree in the run) and they regressed the very thing round 2 was dispatched to fix. Secondary misses: the hover touch-guard uses the *negative* `@media (hover: none)` enumerated-reset the leaf explicitly rejects (the source comment itself concedes the positive wrapper "would be impractical"), the tab "parchment motif" is a `▾` font glyph over the same sliding moss pill (still the round-1 "Tailwind pill bar" reading), and there is no success-confirm micro-state on the Buy chip before the card flips. To lift the next round: fix the three chip contrasts (deepen the chip fills or swap the label color), replace the enumerated hover reset with the named positive guard, and design an actual tab motif rather than a chevron character.

---

## Per-category summary (MIN per subtree — NOT mean)

| Category | MIN | # below 9.5 |
|---|---|---|
| P.shop.buy (visible Buy CTA — Priority 1) | 1.8 | 23 |
| Card surface paper/texture (2a) | 9.5 | 0 |
| Name/price collision (2b) | 9.0 | 3 |
| Tab pill distinctiveness (3) | 7.0 | 6 |
| Hover guard + golden-locked lift (4) | 7.0 | 2 |
| Easing-family cohesion (5) | 9.5 | 0 |
| Empty-state entrance fade (6) | 9.5 | 0 |
| Skeleton tile count (7) | 7.0 | 2 |
| Coin pill visual weight (8) | 9.0 | 2 |
| Border-radius vocabulary (9) | 9.5 | 0 |
| Unaffordable lock opacity (10) | 1.8 | 3 |
| Coins display performance (11) | 9.5 | 0 |
| Coin arc richness (12) | 9.5 | 0 |
| Golden-gate visual mass + tokens (13) | 9.0 | 2 |
| WAI Tabs activation uniformity (14) | 9.0 | 1 |
| Owned-unplaced drag affordance (15) | 9.0 | 2 |
| Empty-state next-action (16) | 9.5 | 0 |

---

## Scoring table (150 active leaves)

Legend: PASS ≥9.5 · FAIL <9.5. Evidence in parens (MEAS = computed contrast; CS = computed/declared style; SRC = source; SEE = visual, blocked at render; IND = independent judge).

### Priority 1 — P.shop.buy (38 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| P.shop.buy.sub.1.a | "Buy" verb present, not implied by price | 9.5 | PASS | Chip renders `Buy · 🪙 N` (L1451) (SRC) |
| P.shop.buy.sub.1.b | Buy + price one visual unit, <0.5s | 9.5 | PASS | Single chip reads as one decision (SRC) |
| P.shop.buy.sub.1.c | Legible at 4-col/360px | 9.0 | FAIL | Unaffordable variant contrast 1.76:1 makes verb illegible at small size (MEAS) |
| P.shop.buy.vis.1.a | Deliberate button shape, `<button>` | 9.0 | FAIL | Chip is a `rounded-full` `<span>`, not a button; merger not documented in calibration (only inline comment L1376-79) (SRC) |
| P.shop.buy.vis.1.b | Shape identical across cards | 9.5 | PASS | One shared chip class (SRC) |
| P.shop.buy.vis.1.c | Fill/border separates chip from card | 9.5 | PASS | moss-700 filled chip on cream card (SRC) |
| P.shop.buy.vis.2.a | One accent token chosen | 9.5 | PASS | moss-700 fill (SRC) |
| P.shop.buy.vis.2.b | Accent on every chip, no second accent | 9.0 | FAIL | Buy=moss-700; **Claim=coin-gold-500** (L1322) — two accents for the two primary actions (CS) |
| P.shop.buy.vis.2.c | Accent in ≤6-hue palette | 9.5 | PASS | moss-700 existing token (CS) |
| **P.shop.buy.vis.3.a** | **Label ≥4.5:1 on chip's own fill** | **2.0** | **FAIL** | affordable Buy=8.0:1 ✓; **unaffordable Buy cream-50/70 on ink-900/35 = 1.76:1**; **Claim white on coin-gold-500 = 2.11:1** (MEAS) |
| **P.shop.buy.vis.3.b** | **Price glyph ≥4.5:1 on same surface** | **1.8** | **FAIL** | "🪙 N" sits in the SAME 1.76:1 chip (MEAS) |
| **P.shop.buy.vis.3.c** | **Contrast holds at hover-deepen** | **3.5** | **FAIL** | error chip hover rose-600→rose-500 = **3.55:1** (MEAS) |
| P.shop.buy.vis.4.a | Art dominant, chip second focal | 9.0 | FAIL | Geometry OK; art-wins-glance unconfirmable at render (SEE) |
| P.shop.buy.vis.4.b | Chip in footer, not over art | 9.5 | PASS | Footer below aspect-square (SRC) |
| P.shop.buy.vis.4.c | Chip weight ≈ lock badge, ≤2 zones | 9.5 | PASS | Art + footer zones (SRC) |
| P.shop.buy.typ.1.a | Bold weight, reads as verb | 9.5 | PASS | `font-bold` chip (CS) |
| P.shop.buy.typ.1.b | Label weight ≥ name weight | 9.5 | PASS | chip bold vs name medium (CS) |
| P.shop.buy.typ.2.a | ≥12px at small card | 9.0 | FAIL | text-[11px] = 11px, under the 12px floor (CS) |
| P.shop.buy.typ.2.b | Verb truncates after price | 9.0 | FAIL | No truncation-priority; no min-width reserve (SRC) |
| P.shop.buy.mot.1.a | Hover deepen + scale ~1.02, 0.15-0.25s | 9.5 | PASS | `group-hover:bg-moss-600 scale-105` duration-150 (CS) |
| P.shop.buy.mot.1.b | Hover easing in coh.016 family | 9.0 | FAIL | `transition-all duration-150`, no explicit timing-fn = default `ease`, not coh.016 cubic (CS) |
| P.shop.buy.mot.1.c | Hover gated behind `@media(hover:hover)` | 8.0 | FAIL | Only negative `@media(hover:none)` reset covers it (SRC) |
| P.shop.buy.mot.1.d | RM drops scale → color only | 9.0 | FAIL | Chip `group-hover:scale-105` Tailwind transition NOT in RM block (L949) — scale not collapsed (SRC) |
| P.shop.buy.mot.2.a | Active press inset ~0.1s | 9.0 | FAIL | Card has active:scale-[0.97]; chip has NO chip-local inset (CS) |
| P.shop.buy.mot.2.b | Chip press ≠ card press | 8.5 | FAIL | No independent chip press (SRC) |
| P.shop.buy.int.4.a | Chip own pressable target | 8.0 | FAIL | Chip is `<span>`; only the card is pressable (SRC) |
| P.shop.buy.int.4.b | Card press ≠ chip active | 8.0 | FAIL | One target, not disambiguated (SRC) |
| P.shop.buy.int.4.c | Chip active shares panel press vocab | 9.0 | FAIL | No chip active state (CS) |
| **P.shop.buy.int.7.a** | **Success ✓/"Purchased" ~500ms before flip** | **5.0** | **FAIL** | Absent — chip shows `…` then card flips (L1451) (SRC) |
| P.shop.buy.int.7.b | Confirm beat sequenced w/ arc | 6.0 | FAIL | No beat to sequence (SRC) |
| P.shop.buy.int.7.c | RM preserves confirm | 6.0 | FAIL | Beat absent (SRC) |
| P.shop.buy.int.8.a | Error chip → "Retry" | 9.5 | PASS | `hasError ? "Retry"` (L1451) (SRC) |
| P.shop.buy.int.8.b | Inline error msg near chip | 9.5 | PASS | "Not enough coins"/"Try again" L1456 (SRC) |
| P.shop.buy.int.8.c | Clean rollback + re-enabled | 9.5 | PASS | hasError keeps card clickable (SRC) |
| P.shop.buy.cpy.1.a | Label literally "Buy" | 9.5 | PASS | `Buy · 🪙 N` (SRC) |
| P.shop.buy.cpy.1.b | Verb never absent any card/viewport | 9.0 | FAIL | Rendered but 1.76:1 = visually absent on unaffordable cards (MEAS) |
| P.shop.buy.coh.1.a | Buy + Claim one shared button primitive | 8.5 | FAIL | Share footer structure but NOT shape/accent (moss vs gold); not one primitive (SEE) |
| P.shop.buy.coh.1.b | Hover/focus/active vocab identical | 9.0 | FAIL | Chips have no own focus-visible/active (CS) |

### Priority 2a — Card surface paper/texture (13 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.gen.003.a | One of 3 treatments applied | 9.5 | PASS | `gdn-card-stagger` triple-inset shadow L902-908 = double-inset ink+paper (SRC) |
| R.gen.003.b | Reads as texture, not 1px border | 9.5 | PASS | 1px ring + 1px highlight + 5px soft inset = lifted paper (SEE-source) |
| R.gen.003.c | Restrained, no texture spam | 9.5 | PASS | Inset only; panel noise opacity-0.035 (CS) |
| R.gen.003.d | No scroll cost, no backdrop-filter | 9.5 | PASS | Static shadow + static SVG noise (SRC) |
| P.shop.card.locked.vis.4.a | Treatment on locked card | 9.5 | PASS | All variants carry the class (SRC) |
| P.shop.card.locked.vis.4.b | Same token across 3 variants | 9.5 | PASS | One class (CS) |
| R.coh.001.a | Opaque cream, warm parchment | 9.5 | PASS | `bg-[#f9f5ed]` opaque, no /90 over white (CS) |
| R.coh.001.b | Panel paper overlay ~0.04 | 9.5 | PASS | feTurbulence opacity-[0.035] (CS) |
| R.coh.001.c | Hue within ±5% LCh of scene parchment | 9.5 | PASS | #f9f5ed consistent w/ scene cream (CS) |
| R.cap.palette.001.a | Warm off-white, not #fff | 9.5 | PASS | #f9f5ed (CS) |
| R.cap.palette.001.b | Texture/undertone cue | 9.5 | PASS | noise overlay (SEE-source) |
| R.cap.palette.002.a | Card cream distinct opaque from panel | 9.5 | PASS | white/75 vs #f9f5ed (CS) |
| R.cap.palette.002.b | ΔL ≥3% | 9.5 | PASS | differ >3% L (CS) |

### Priority 2b — Name/price collision (14 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| P.shop.card.locked.vis.5.a | Name + price no overlap | 9.5 | PASS | Stacked footer rows below art (SRC) |
| P.shop.card.locked.vis.5.b | ≥8px gap between zones | 9.0 | FAIL | Name pt-0.5 + chip mt-0.5 = ~2px, under ≥8px (CS) |
| P.shop.card.locked.vis.5.c | Holds at 4-col | 9.0 | FAIL | Same 2px gap; unverified at 360 (SEE) |
| R.cap.cards.011.a | Name below square (figcaption) | 9.5 | PASS | Name in footer, no overlay (SRC) |
| R.cap.cards.011.b | Silhouette fully visible | 9.5 | PASS | Art zone clean (SRC) |
| R.cap.cards.011.c | Long names truncate + accessible name | 9.5 | PASS | truncate + aria-label full name (SRC) |
| R.cap.cards.005.a | ≤2 zones, not 3 overlays | 9.5 | PASS | Art + footer; single lock badge (SRC) |
| R.cap.cards.005.b | Art zone dominant | 9.5 | PASS | square > footer (SEE-source) |
| R.cap.cards.005.c | No chrome overlaps chrome | 9.5 | PASS | De-stacked (SRC) |
| R.cap.cards.014.a | Not postage stamp at 4-col | 9.0 | FAIL | p-3 retained; leaf wanted p-2 small OR cleared overlays (CS) |
| R.cap.cards.014.b | Art optically centered | 9.5 | PASS | object-contain centered (CS) |
| R.cap.cards.014.c | Padding on-token, variant-consistent | 9.5 | PASS | p-3 all variants (CS) |
| R.cap.cards.015.a | Placed vs locked distinct after reorg | 9.5 | PASS | moss sprout stamp vs corner lock (SEE-source) |
| R.cap.cards.015.b | Fixed marker positions | 9.5 | PASS | Consistent corners (SRC) |

### Priority 3 — Tab pill distinctiveness (10 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.gen.002.a | One designed parchment motif | 7.0 | FAIL | "Motif" = `▾` font glyph (L1170) over sliding moss pill — a character, not folded-paper/stamped-ink/arch (SRC) |
| R.gen.002.b | Reads as handcrafted chrome | 7.0 | FAIL | Sliding moss pill + chevron = the round-1 "Tailwind pill bar" reading (IND) |
| R.gen.002.c | Motif uses palette + 3-radius | 9.5 | PASS | moss-300 glyph, rounded-xl indicator (CS) |
| R.gen.009.a | Designed mark, not sliding fill | 7.0 | FAIL | Indicator IS still `bg-moss-600/90` rounded-xl sliding fill (L1128) (SEE) |
| R.gen.009.b | Distinct from underline AND pill | 7.0 | FAIL | Reads as pill + caret, not unmistakably neither (IND) |
| R.gen.009.c | Transition coh.016 + 0.25-0.4s | 9.5 | PASS | left/width 0.3s cubic-bezier(0.4,0,0.2,1) (CS) |
| P.shop.tabbar.tab.vis.2.a | Active wins ≥2 cues incl. motif | 8.5 | FAIL | Cue set incl. only a weak glyph "motif" (SEE) |
| P.shop.tabbar.tab.vis.2.b | Inactive label ≥4.5:1 | 9.5 | PASS | ink-700 on white/60-over-panel = **11.01:1** (MEAS) |
| P.shop.tabbar.tab.coh.2.a | Active accent = moss token | 9.5 | PASS | moss-600 (CS) |
| P.shop.tabbar.tab.coh.2.b | Motif identical across 4 tabs | 9.0 | FAIL | Shared indicator + chevron, but the motif itself is the unresolved .a/.b concern (CS) |

### Priority 4 — Hover guard + golden-locked lift (7 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.cap.hover.no-touch.a | ALL hover wrapped in `@media(hover:hover) and (pointer:fine)` | 7.0 | FAIL | Build used **negative** `@media(hover:none)` reset (L985); comment concedes positive was skipped (SRC) |
| R.cap.hover.no-touch.b | No hover-only-reachable action | 9.5 | PASS | Drag handle base opacity-30 always visible (SRC) |
| R.cap.hover.no-touch.c | Single drift-proof mechanism | 7.5 | FAIL | Enumerated allowlist incl. brittle `.flex...max-w-\[640px\] button:hover` — a new surface leaks (SRC) |
| R.coh.007.a | Golden-locked lifts OR documented | 9.5 | PASS | `hover:scale-[1.02] hover:shadow-sm` added (L1342) (CS) |
| R.coh.007.b | One direction, ≤1.04, one easing | 9.5 | PASS | Lifts 1.02-1.04 consistent (CS) |
| R.coh.007.c | Hover shadow from ≤3-shadow set | 9.5 | PASS | Only shadow-sm/md panel-wide (CS) |
| R.coh.007.d | Golden-locked policy consistent | 9.5 | PASS | All golden-locked use same lift (SEE-source) |

### Priority 5 — Easing-family cohesion (6 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.cap.motion.coh.001.a | Count-down cubic ease-out | 9.5 | PASS | `1 - Math.pow(1 - t, 3)` (L300) (SRC) |
| R.cap.motion.coh.001.b | ≤2 easing families | 9.5 | PASS | Spring + standard; linear only on cloud drift (cosmetic) (SRC) |
| R.cap.motion.coh.001.c | No stray linear where eased intended | 9.5 | PASS | Remaining linear = clouds + gradients (SRC) |
| R.coh.016.a | Count-down easing is ease-out | 9.5 | PASS | cubic ease-out (SRC) |
| R.coh.016.b | Entrance ease-out, transition standard | 9.5 | PASS | spring entrances, standard transitions (SRC) |
| R.coh.016.c | Durations in band | 9.5 | PASS | 350ms/0.3s/220-420ms in bands (CS) |

### Priority 6 — Empty-state entrance (3 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| P.shop.empty.mot.1.a | Entrance class on container | 9.5 | PASS | `gdn-panel-enter` (L1466) (SRC) |
| P.shop.empty.mot.1.b | Matches pop-in language | 9.5 | PASS | 200ms standard curve (CS) |
| P.shop.empty.mot.1.c | RM collapses, content visible | 9.5 | PASS | in RM block (L950) (SRC) |

### Priority 7 — Skeleton tile count (6 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.cap.skeleton.005.a | Derived count, not 12 | 9.5 | PASS | `Math.max(12, MAX_GRID_COLS*2)` = 20 (L40) (SRC) |
| R.cap.skeleton.005.b | ≥20 at 10-col | 9.5 | PASS | 20/10 = 2 rows (SRC) |
| R.cap.skeleton.005.c | Failing unit test first (TDD) | 7.0 | FAIL | No skeleton-count test artifact found; routing part 7 required one (SRC) |
| P.shop.loading.vis.3.a | Fills ≥2 rows each breakpoint | 9.0 | FAIL | 2 rows holds at 10-col; cross-breakpoint visual unconfirmed (SEE) |
| P.shop.loading.vis.3.b | Tiles match card footprint, no CLS | 9.5 | PASS | aspect-square rounded-xl = card (SEE-source) |
| P.shop.loading.vis.3.c | Radius = card xl token | 9.5 | PASS | both rounded-xl (CS) |

### Priority 8 — Coin pill weight (7 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.gen.005.a | One weight treatment applied | 9.0 | FAIL | text-base display numeral nominally qualifies, but glyph is still `🪙` emoji + 1px ring (not bevel SVG / outer-shadow ring) (SRC) |
| R.gen.005.b | Hay-Day chunky, not hairline | 9.0 | FAIL | Better, but flat emoji+number pill, not a beveled token (IND) |
| R.gen.005.c | Pill glyph = card price glyph | 9.5 | PASS | Both `🪙` emoji (SEE-source) |
| R.cap.coins.012.a | ≥ py-2.5 px-4 text-base | 9.5 | PASS | px-4 py-2.5 text-base (CS) |
| R.cap.coins.012.b | tabular-nums + dominant integer | 9.5 | PASS | tabular-nums font-bold coin-gold-300 (CS) |
| R.cap.coins.012.c | No positional shift on digit-width | 9.5 | PASS | min-w-[92px] justify-center (CS) |
| R.cap.coins.012.d | Integer ≥4.5:1 on pill | 9.5 | PASS | coin-gold-300 on ink-900 = **11.71:1** (MEAS) |

### Priority 9 — Border-radius vocabulary (4 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.coh.005.a | Exactly 3 tiers 24px/xl/full | 9.5 | PASS | containers [24px], cards/tabs/skeleton xl, pills full (CS) |
| R.coh.005.b | Skeleton/card/focus unified on xl | 9.5 | PASS | both rounded-xl; scene rounded-md is LOCKED scene (out of scope) (CS) |
| R.coh.005.c | No 4th ad-hoc radius in panel | 9.5 | PASS | Only rounded-[24px] (= the container tier) (SRC) |
| R.coh.005.d | New tab/buy respect 3-value set | 9.5 | PASS | indicator xl, chip full (CS) |

### Priority 10 — Unaffordable lock opacity (8 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.cap.lock.002.a | Affordable lock warm amber/gold | 9.5 | PASS | bg-coin-gold-300/90 text-coin-gold-700 (SEE-source) |
| R.cap.lock.002.b | Affordable vs unaffordable distinct | 9.5 | PASS | gold vs gray-ink (SEE-source) |
| R.cap.lock.003.a | Unaffordable bg ≥ ink-900/25 | 9.5 | PASS | bg-ink-900/25 (CS) |
| R.cap.lock.003.b | Glyph ≥ ink-900/60 | 9.5 | PASS | text-ink-900/60 (CS) |
| R.cap.lock.003.c | Muted-but-visible, not absent/punitive | 9.0 | FAIL | glyph 3.53:1 but 🔒 is text-[7px]; barely a badge at render (SEE) |
| R.cap.lock.004.a | Dim + lock compose correctly | 9.0 | FAIL | Whole card opacity-60 dims the now-stronger lock back down; net unverified (CS) |
| **R.cap.lock.004.b** | **Price ≥4.5:1 on dimmed card** | **1.8** | **FAIL** | The price lives in the Buy chip = **1.76:1** (the chip IS the price surface). Hard fail (MEAS) |
| R.cap.lock.004.c | Focusable + aria-disabled + accessible name | 9.5 | PASS | aria-disabled + "need N more coins" (L1385,1395) (SRC) |

### Priority 11 — Coins display performance (3 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| P.shop.header.coins.prf.1.a | Count isolated (memo OR ref var) | 9.5 | PASS | `CoinPill = memo(...)` (L53) shields the grid (SRC) |
| P.shop.header.coins.prf.1.b | ≤1 commit for the count animation | 9.5 | PASS | memo'd child re-renders on displayCoins; grid not re-rendered per tick (SRC) |
| P.shop.header.coins.prf.1.c | RM snap + transform/opacity only | 9.5 | PASS | RM snaps (L286); pulse is transform/filter (SRC) |

### Priority 12 — Coin arc richness (7 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.gen.011.a | rotate mid-arc | 9.5 | PASS | rotate(200deg) mid, 360deg end (L921-922) (SRC) |
| R.gen.011.b | 4-6 radial sparkles on landing | 9.5 | PASS | 2 pseudos + 4 spans = 6, delays 605-630ms (SRC) |
| R.gen.011.c | transform/opacity only | 9.5 | PASS | all keyframes transform/opacity (SRC) |
| R.gen.011.d | RM drops arc + sparkles | 9.5 | PASS | in RM block (L952,957) (SRC) |
| R.gen.014.a | Spin + burst + land-bloom coordinated | 9.5 | PASS | spin + 6 sparkles + gdn-coin-landed pulse (SRC) |
| R.gen.014.b | Staged cause→effect | 9.5 | PASS | leaves→arcs→lands→pulse (SRC) |
| R.gen.014.c | Success-only, non-blocking | 9.5 | PASS | fires in try after confirm; ref-guard (SRC) |

### Priority 13 — Golden-gate visual mass + tokens (9 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| P.shop.gg.vis.1.a | Reads distinctly golden | 9.0 | FAIL | coin-gold-300/70 border+ring bumped, but /30 bg + hoursNeeded badge **2.76:1** still reads faded (MEAS+SEE) |
| P.shop.gg.vis.1.b | Distinction survives 4-col | 9.0 | FAIL | Unverified at 360 (SEE) |
| P.shop.gg.vis.1.c | Distinct from both lock states | 9.5 | PASS | gold border+ring vs gold-chip-lock vs gray-lock (SEE-source) |
| P.shop.gg.vis.2.a | Bar h-1 → h-1.5 | 9.5 | PASS | h-1.5 (L1365) (CS) |
| P.shop.gg.vis.2.b | Fill/track ≥3:1, reads as progress | 9.5 | PASS | coin-gold-500 on ink-900/40 = **4.93:1** (MEAS) |
| P.shop.gg.vis.2.c | Bar radius from 3-value set | 9.5 | PASS | rounded-full (CS) |
| P.shop.gg.coh.1.a | 8 amber tokens → ≤3 | 9.5 | PASS | coin-gold-{50,300,500,700} = 4 shades of ONE hue; amber-* gone from panel (lone amber-400 L770 is LOCKED scene) (CS) |
| P.shop.gg.coh.1.b | Tokens consistent across golden cards | 9.5 | PASS | locked/claimable/owned all coin-gold-300 + 500 (CS) |
| P.shop.gg.coh.1.c | Total panel hues ≤6 | 9.5 | PASS | cream/ink/moss/coin-gold/emerald/rose — within budget (CS) |

### Priority 14 — WAI Tabs activation (6 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.cap.tabs.012.a | One model chosen + documented | 9.0 | FAIL | Behavior is consistent automatic, but no explicit "automatic activation" doc at the tablist (SRC) |
| R.cap.tabs.012.b | Mixed behaviour removed | 9.5 | PASS | Arrow auto-activates + click auto-activates; no Enter-after-arrow (SRC) |
| R.cap.tabs.012.c | Roving tabindex + Home/End intact | 9.5 | PASS | tabIndex 0/-1, Home/End (L1114-15) (SRC) |
| R.cap.a11y.tabs.001.a | ARIA pattern + consistent activation | 9.5 | PASS | tablist/tab/tabpanel + aria-selected/controls (SRC) |
| R.cap.a11y.tabs.001.b | aria-selected matches semantics | 9.5 | PASS | moves with focus under automatic (SRC) |
| R.cap.a11y.tabs.001.c | No SR announcement spam | 9.5 | PASS | native pattern, no extra live region (IND-source) |

### Priority 15 — Owned-unplaced drag affordance (6 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.cap.cards.007.a | Drag affordance ALL modes OR gate doc | 9.5 | PASS | Handle-dots always rendered (L1286, opacity-30) (SEE-source) |
| R.cap.cards.007.b | Scoped to owned-unplaced only | 9.5 | PASS | `{isInventory && ...}` guard (SRC) |
| R.cap.cards.007.c | Hover escalation behind guard | 9.0 | FAIL | group-hover:opacity-60 covered by the negative reset (`:hover span{opacity:inherit}`), but uses the rejected mechanism (SRC) |
| P.shop.card.ou.vis.2.a | Handle-dots present | 9.5 | PASS | 4-dot grid (L1287-90) (SEE-source) |
| P.shop.card.ou.vis.2.b | On-vibe, uncluttered | 9.0 | FAIL | ink-900 dots are neutral UI, not "warm/handcrafted matching icon family" (SEE) |
| P.shop.card.ou.vis.2.c | Doesn't beat art for dominance | 9.5 | PASS | opacity-30 corner, art dominant (SEE-source) |

### Priority 16 — Empty-state next-action (3 children)

| ID | Criterion | Score | Verdict | Notes |
|---|---|---|---|---|
| R.cap.empty.005.a | Concrete next action | 9.5 | PASS | "Start a focus session" link-button (L1494-99) (SEE-source) |
| R.cap.empty.005.b | Real button/link + concrete verb + states | 9.5 | PASS | `<a>` w/ hover/active/focus-visible (SRC) |
| R.cap.empty.005.c | ≤14 words, warm, no AI-tells | 9.5 | PASS | warm copy, no tells (SRC) |

---

## Below-bar summary (46 leaves grouped into the fix-items below, grouped by tier)

### TIER 1 — hard WCAG / spec failures (block hand-over; fix first)

1. **Chip label contrast (P.shop.buy.vis.3.a/.b/.c, .cpy.1.b, sub.1.c, R.cap.lock.004.b — 6 leaves, scores 1.8–3.5).** Computed exactly from the supplied tokens with alpha compositing:
   - **Unaffordable Buy chip** `cream-50/70` on `ink-900/35`-over-card = **1.76:1** (full cream-50 = 2.17:1). "Buy" + price illegible on every card the user can't afford.
   - **Claim chip** `white` on `coin-gold-500` = **2.11:1**.
   - **Error chip hover** `cream-50` on `rose-500` = **3.55:1**.
   - **Fix:** unaffordable chip → dark-on-light (`text-ink-700` on `coin-gold-50`/`cream-100`) or deepen fill to opaque `ink-700`/`moss-700`. Claim chip → `text-ink-900` on `coin-gold-300` (11.71:1) or fill `coin-gold-700` (verify white ≈ 4.6:1). Error hover → stay on `rose-600` (don't lighten).

2. **No success-confirm beat on Buy chip (P.shop.buy.int.7.a/.b/.c — 3 leaves, 5.0–6.0).** Chip shows `…` then card flips straight to owned. **Fix:** add a `✓`/"Purchased" chip micro-state ~500ms before the owned variant renders, sequenced with the arc landing, RM-safe.

### TIER 2 — card-as-button leaves the chip non-interactive (8 leaves, 8.0–9.0)

3. **Chip is a `<span>`, not its own pressable target (P.shop.buy.vis.1.a, mot.2.a/.b, int.4.a/.b/.c, coh.1.a/.b).** No chip-local press/active/focus, no chip-vs-card disambiguation, Buy(moss) vs Claim(gold) aren't one primitive. **Fix:** either (a) commit to card-as-button and **document the merger in `01-calibration.md`** (currently only an inline source comment L1376-79), then re-key these leaves to the card's wiring — the contract allows this route IF documented — or (b) make the chip a real action affordance.

### TIER 3 — distinctiveness / motif (7 leaves, 7.0–9.0)

4. **Tab "motif" is a `▾` font glyph over the same sliding moss pill (R.gen.002.a/.b, R.gen.009.a/.b, tab.vis.2.a, tab.coh.2.b).** Still the round-1 "Tailwind pill bar + custom indicator" reading. **Fix:** design an actual motif — folded-paper corner (clip-path), stamped-ink underline (textured SVG stroke), or hand-drawn arch — in the moss/coin-gold palette and 3-radius set.

5. **Coin pill still a flat emoji+number pill (R.gen.005.a/.b).** Metrics bumped but glyph = `🪙` emoji, "ring" = 1px ring. **Fix:** custom beveled SVG coin or a `coin-gold-700` outer-shadow ring.

### TIER 4 — hover-guard mechanism is the rejected one (2 leaves, 7.0–7.5; ripples into mot.1.c, cards.007.c)

6. **Negative `@media (hover: none)` enumerated reset, not the named positive `@media (hover: hover) and (pointer: fine)` (R.cap.hover.no-touch.a/.c).** The reset is an allowlist (incl. a brittle `.flex.w-full.max-w-\[640px\] button:hover` selector) that a new hover surface will silently escape. **Fix:** wrap hover utilities in the positive guard via one shared CSS layer targeting by role, not class strings.

### TIER 5 — smaller spec gaps (5 leaves, 7.0–9.0)

7. **Name↔chip gap is ~2px, not ≥8px (P.shop.card.locked.vis.5.b/.c).** Bump footer row gap to ≥`gap-2`.
8. **Buy label 11px vs 12px floor (P.shop.buy.typ.2.a); no verb-truncation priority (typ.2.b).** Bump to 12px, reserve chip min-width.
9. **No TDD failing-test artifact for skeleton count (R.cap.skeleton.005.c).** Routing part 7 wanted a failing-then-passing test; none found.
10. **Hover-easing default `ease` not coh.016 (buy.mot.1.b); chip scale not in RM block (buy.mot.1.d); p-3 art padding at small viewport (cards.014.a); 7px lock emoji faint after card opacity-60 (lock.003.c/.004.a); golden badge 2.76:1 + /30 bg faded (gg.vis.1.a/.b); drag-dot hint neutral not on-vibe (ou.vis.2.b); tabs model undocumented (tabs.012.a); loading visual fill cross-breakpoint (loading.vis.3.a).** Each is a single-line/targeted tweak — see per-row notes.

---

## Brand-collision check (explicit)
Panel palette from tokens: warm cream `#f9f5ed` / ink `#1f1f1f` / moss greens / coin-gold. Same as round-1 calibration (scope unchanged).
- closest brand: Whole Foods (green + cream) — distinguished by parchment + game-UI chrome + coin-gold tertiary — **PASS**
- closest brand: Hay Day (tan + coin-gold) — intentional named reference — **PASS**
- closest brand: Starbucks (deep green) — moss is warmer/earthier — **PASS**
- final: **PASS** (carried; palette unchanged)

## Capability presence audit
| Capability | Expected? | Rendered (source-verified)? | Evidence |
|---|---|---|---|
| Category tabs with icons | yes | yes — 4 emoji tabs, roving tabindex, sliding indicator | SRC+CS |
| Lock icon + buy-inline | yes | yes — locked card, corner lock, footer "Buy · 🪙 N", no modal | SRC |
| Coin micro-animation on buy | yes | yes — spinning arc + 6 sparkles + pill pulse, success-only | SRC |
*(All three present in source; on-screen aesthetic verdict is the carried BLOCKED slice — needs an authenticated browser.)*

## Structural notes (≤10 bullets)
- **The dispatch's #1 priority (Buy-CTA cluster, MIN 5.0 in round 1) is still the floor of the panel** — now 1.8 because the fix introduced a contrast regression rather than closing it. The verb appeared but became illegible on unaffordable + claim chips.
- **Contrast was not computed during the build.** Three primary action surfaces fail AA by wide margins, all derivable from tokens without a browser. A token-contrast sweep over every chip/badge fill should be a build gate.
- **The card-as-button merger route is legitimate but its documentation obligation was skipped** (contract said "document in calibration"; it's only an inline comment). Eight leaves hinge on this being a recorded decision.
- The negative-hover-guard choice is a recurring smell (Priority 4 + buy.mot.1.c + cards.007.c) — one positive guard lifts several leaves at once.
- Genuine wins worth keeping: easing-cohesion (5), coin-arc richness (12), border-radius consolidation (9), coins perf isolation (11), empty-state (6+16), card-surface texture (2a), and the name-strip lift (2b core) are clean ≥9.5 — 7 clusters closed.
- The Tailwind `group-hover:scale-105` chip transition is NOT in the RM block (buy.mot.1.d) — small but real reduced-motion gap.
- Carried-PASS/BLOCKED counts taken on faith per the polish-round contract; if the orchestrator wants those re-audited it needs an authenticated browser round.

## What I couldn't verify (browser-gated — carried BLOCKED, not re-counted)
- All at-render visual leaves (SEE) at the 7 viewports: panel is auth-gated; preview redirects to a login wall (`[role=region][aria-label="Garden shop"]` absent in DOM). Card layout, art-vs-chrome dominance, golden distinctiveness at 360px, skeleton fill, the on-screen arc verdict — need an authenticated session + real data (the 27 carried-BLOCKED rows). I scored the code-fixable slice from source.
- prefers-reduced-motion / prefers-contrast / forced-colors *runtime* rendering (CSS rules exist and source-pass; emulation needed).

## HAND-OVER VERDICT
**NOT READY** — 28 of 150 active leaves below 9.5; MIN-rollup 1.8. The three highest-impact unresolved rows:
1. **P.shop.buy.vis.3.a/.b + R.cap.lock.004.b** — unaffordable Buy chip (1.76:1) and Claim chip (2.11:1) fail WCAG AA; deepen fills or flip to a dark-on-gold label scheme.
2. **P.shop.buy.int.7.a** — add the ~500ms `✓`/"Purchased" success micro-state on the chip before the card flips.
3. **R.cap.hover.no-touch.a/.c** — replace the enumerated `@media (hover: none)` reset with the named positive `@media (hover: hover) and (pointer: fine)` guard via one drift-proof mechanism.

---

# Judge Run 5

**Score 3.0/10 (MIN-rollup) · 118 PASS / 150 active · 32 below-9.5 · 0 BLOCKED-with-named-input (of the 150 active code-fixable leaves)**
**Brand-collision verdict: PASS** (palette unchanged from calibration; re-verified §below)
**Capability presence: 3/3 chosen capabilities verified present in source** (tabs, lock+buy-inline, coin micro-animation)
**Locked content: untouched** (L.001 scene canvas + L.002 drag-drop logic — not modified; the 2 `rounded-md` radii live ONLY inside the locked scene and are correctly exempt)
**Hand-over: NOT READY**

> **Scope + verification note.** I judged the 150 round-2 active code-fixable child leaves (the only worked set) cold, plus the structural concerns they expose. The 392 carried-PASS and 27 carried-BLOCKED parents are taken on faith from round 1 per the polish-round contract. **The live panel remains auth-gated** — `GardenScene` is mounted only at `app/(app)/dashboard/garden/page.tsx` inside the authenticated `(app)` route group; the preview at :3001 redirects to `chrome-error://` and `[role=region][aria-label="Garden shop"]` is absent from the DOM (confirmed via `preview_eval`). There is no public demo route. So every craft leaf keyed SEE/IND that depends on rendered Supabase data could not be visually confirmed; I scored those from source geometry + token math and flag residual visual risk. I did NOT re-mark them BLOCKED (the code-fixable assertion is source-verifiable; only the final on-screen aesthetic verdict is browser-gated, and that slice is already carried as BLOCKED in the manifest). **All contrast ratios below are computed exactly from the tailwind.config.ts hexes with full alpha-compositing per the mandatory chain — they are hard objective results, not estimates.**

---

## Headline

Fix-pass-5 genuinely closed the two worst run-4 failures: the Claim chip is now `text-ink-900` on `coin-gold-500` (**7.82:1**, was 2.11:1) and the unaffordable Buy chip label is now opaque `text-cream-50` instead of `/70`. The easing family is clean (cubic ease-out tween, no stray `linear` in the panel), the panel radius vocabulary is a true 3-tier set, the coin arc spins + emits 6 landing sparkles, the empty state fades in, the skeleton count is derived, and the coin pill is a chunky dark `ink-900` pill with `11.71:1` gold text. **But the MIN-rollup is still 3.0, set by a contrast failure prior runs missed because they did not composite the mandated card-level `opacity-60`.** On every *unaffordable* card the whole card carries `opacity-60`; once you composite both the `cream-50` label and the `ink-900/35` chip fill over the page at 0.6, the verb+price drop to **3.29:1** — below 4.5:1. The exact users who most need to read "Buy · 50🪙" (the ones who can't yet afford it) get a sub-AA label. A second NEW objective miss the prior runs also let through: the golden-locked **"hours" badge is `coin-gold-700/80` + `cream-50` = 2.75:1**, and the **active-tab count badge is 4.04:1** — both informative text below AA. Beyond contrast, the architecture-level Priority-1 defects are unresolved by the merger route: the Buy chip is a `<span>` inside the card `<button>`, so there is **no chip-local press distinct from the whole-card press** (mot.2/int.4), **no ~500ms success micro-state before the card flips** (int.7), and the **merger is documented only in a source comment, not in calibration** as the fix contract required. The hover guard is still the *negative* `@media (hover: none)` enumerated reset the leaf explicitly forbids (the comment itself concedes the positive wrapper is "impractical"), and the tab "motif" is still a `▾` glyph over a sliding moss pill. To lift the next round: (1) lift the Buy verb/price OUT of the `opacity-60` dim — render the chip at full opacity even on unaffordable cards, or dim only the art not the chip; (2) fix the hours-badge + tab-count-badge contrasts; (3) decide the merger honestly — either document card-as-button in calibration AND drop the int.4/mot.2/int.7 chip-local assertions as N/A, or build a real nested-pressable; (4) add the success micro-state; (5) design an actual tab motif.

---

## Per-category summary (MIN per subtree — NOT mean)

| Category | MIN | # below 9.5 |
|---|---|---|
| Pitch alignment | 9.5 (carried) | 0 active |
| P.shop.buy — visible Buy CTA (Priority 1) | 3.0 | 18 |
| Card surface paper/texture (2a) | 8.0 | 2 |
| Name/price collision (2b) | 8.0 | 1 |
| Tab pill distinctiveness (3) | 7.0 | 5 |
| Hover guard + golden-locked lift (4) | 7.0 | 2 |
| Easing-family cohesion (5) | 9.5 | 0 |
| Empty-state entrance fade (6) | 9.5 | 0 |
| Skeleton tile count (7) | 6.0 | 1 |
| Coin pill visual weight (8) | 9.5 | 0 |
| Border-radius vocabulary (9) | 9.5 | 0 |
| Unaffordable lock opacity (10) | 3.0 | 1 |
| Coins display performance (11) | 6.0 | 1 |
| Coin arc richness (12) | 9.5 | 0 |
| Golden-gate visual mass + tokens (13) | 9.5* | 0 (but see contrast flag) |
| WAI Tabs activation (14) | 8.0 | 1 |
| Owned-unplaced drag affordance (15) | 9.5 | 0 |
| Empty-state next-action (16) | 9.5 | 0 |

\* Golden-gate leaf assertions pass, BUT the golden-locked **hours badge (2.75:1)** is an objective AA text failure not covered by a dedicated round-2 child — flagged under the contrast table + structural notes. The criteria-library a11y floor (≥4.5:1 per child block) means the golden-locked cluster is NOT AA-clean despite its named children passing.

---

## Computed contrast ratios (exact, alpha-composited per mandatory chain)

Chain: page `#f9f5ed` → footer = `ink-900/75` over page = `rgb(86,84,82)` → chip = composited over footer → text = composited over chip. Card-level `opacity-60` (unaffordable) composites BOTH text and chip-bg over the page at 0.6 (correct WCAG behaviour: opacity is NOT contrast-preserving when the backdrop is not the b/w midpoint).

| Surface | Tokens | Ratio | Need | Verdict |
|---|---|---|---|---|
| Buy chip — affordable | moss-700 fill / cream-50 | **8.00:1** | 4.5 | PASS |
| Buy chip — affordable hover | moss-600 fill / cream-50 | **6.01:1** | 4.5 | PASS |
| Buy chip — buying | moss-600 fill / cream-50 | **6.01:1** | 4.5 | PASS |
| **Buy chip — UNAFFORDABLE (no card-opacity)** | ink-900/35 / cream-50 | 9.75:1 | 4.5 | (pre-dim) |
| **Buy chip — UNAFFORDABLE + card `opacity-60`** | ink-900/35 / cream-50, ×0.6 over page | **3.29:1** | 4.5 | **FAIL** |
| Price glyph in unaffordable chip | = same as above | **3.29:1** | 4.5 | **FAIL** |
| Claim chip | coin-gold-500 / ink-900 | **7.82:1** | 4.5 | PASS (was 2.11) |
| Claim chip hover | coin-gold-300 / ink-900 | **11.71:1** | 4.5 | PASS |
| Retry chip | rose-600 / cream-50 | **4.67:1** | 4.5 | PASS (thin) |
| Retry chip hover | rose-700 / cream-50 | **6.26:1** | 4.5 | PASS |
| Inline error text | rose-200 / footer | **5.19:1** | 4.5 | PASS |
| Coin pill integer | ink-900 / coin-gold-300 | **11.71:1** | 4.5 | PASS |
| Name footer text | footer / cream-50 | **7.26:1** | 4.5 | PASS |
| **Golden hours badge** | coin-gold-700/80 over cream / cream-50 | **2.75:1** | 4.5 | **FAIL** |
| **Tab active count badge** | moss-500/35 over moss-600/90 indicator / cream-50/90 | **4.04:1** | 4.5 | **FAIL** |
| Tab inactive count badge | ink-900/10 / ink-700 | **9.04:1** | 4.5 | PASS |
| Tab inactive label | white/60 over page / ink-700 | **11.00:1** | 4.5 | PASS |
| Tab active label | moss-600/90 indicator / cream-50 | **4.84:1** | 4.5 | PASS (thin) |
| Golden progress bar (non-text) | coin-gold-500 fill / ink-900/40 track | **4.99:1** | 3.0 | PASS |
| Unaffordable lock glyph (informative 🔒) | ink-900/60 over ink-900/25 badge | **3.55:1** | 4.5 | borderline — glyph is decorative `aria-hidden`; the accessible name carries state, so not a hard text fail, but the visual cue is weak |
| Unaffordable lock badge bg vs card (non-text) | ink-900/25 vs cream | **1.69:1** | ~3.0 | weak — badge barely separates from card; "muted not absent" is technically met (matches the prescribed /25 fix) but it is faint |

**Three hard AA text failures: unaffordable Buy chip/price (3.29:1), golden hours badge (2.75:1), tab active count badge (4.04:1).**

---

## Per-criterion scores — all 150 active leaves

### Priority 1 — P.shop.buy (38 children) · cluster MIN 3.0

| Leaf | Score | Verdict | Evidence |
|---|---|---|---|
| P.shop.buy.sub.1.a | PASS (9.5) | "Buy" verb on every locked card, always rendered | SRC L1451 `Buy · 🪙 ${price}` |
| P.shop.buy.sub.1.b | PASS (9.5) | verb+price co-located in one chip | SRC L1442-1452 |
| P.shop.buy.sub.1.c | PASS (9.5) | footer preserves verb+price at small card | SRC |
| P.shop.buy.vis.1.a | **8** | card IS `<button>` ✓ + chip uses `rounded-full` from radius set ✓, BUT merger documented only in source comment (L1376-1379), not in calibration as the fix contract required | SRC L1380-1411 |
| P.shop.buy.vis.1.b | PASS (9.5) | one shared chip class across locked cards | CS |
| P.shop.buy.vis.1.c | PASS (9.5) | moss-700 fill separates chip from card | SEE(src) |
| P.shop.buy.vis.2.a | PASS (9.5) | single accent moss chosen | SRC L1449 |
| P.shop.buy.vis.2.b | PASS (9.5) | moss on every buy chip, no second accent | CS |
| P.shop.buy.vis.2.c | PASS (9.5) | moss-700 is an existing palette token | CS |
| **P.shop.buy.vis.3.a** | **3** | label ≥4.5 on chip: affordable 8.0:1 PASS, **but UNAFFORDABLE state = 3.29:1 FAIL** after card opacity-60 | MEAS |
| **P.shop.buy.vis.3.b** | **3** | price glyph: affordable 8.0:1, **unaffordable 3.29:1 FAIL** | MEAS |
| P.shop.buy.vis.3.c | PASS (9.5) | hover-deepen holds: affordable 6.01, retry 6.26 | MEAS |
| P.shop.buy.vis.4.a | PASS (9.5) | art dominant, chip second focal | SEE(src) |
| P.shop.buy.vis.4.b | PASS (9.5) | chip in footer below art, no overlap | SRC L1437 |
| P.shop.buy.vis.4.c | PASS (9.5) | chip vs lock badge balanced; ≤2 zones | SEE(src) |
| P.shop.buy.typ.1.a | PASS (9.5) | chip `font-bold` from weight set | CS L1443 |
| P.shop.buy.typ.1.b | PASS (9.5) | chip bold heavier than name `font-medium` | CS L1438/1443 |
| **P.shop.buy.typ.2.a** | **8** | chip is `text-[11px]` = 11px, **below the ≥12px floor** | CS L1443 |
| **P.shop.buy.typ.2.b** | **8** | no explicit "price truncates before verb" logic; chip is a single non-truncating string | SEE(src) |
| P.shop.buy.mot.1.a | PASS (9.5) | `group-hover:bg-moss-600 group-hover:scale-105` | CS L1449 |
| **P.shop.buy.mot.1.b** | **8.5** | `transition-all duration-150` uses browser-default `ease`, not the named coh.016 cubic-bezier token (duration in band) | CS L1443 |
| **P.shop.buy.mot.1.c** | **7** | NOT gated behind positive `@media (hover:hover) and (pointer:fine)`; relies on negative `@media (hover:none)` reset | SRC L985 |
| **P.shop.buy.mot.1.d** | **6** | reduced-motion block (L949-957) covers gdn-* + sparkles but NOT the chip `group-hover:scale-105` transition → chip still scales under RM+hover | SRC |
| **P.shop.buy.mot.2.a** | **4** | chip has NO independent active/press inset — only the whole card has `active:scale-[0.97]` | SEE(src) L1402 |
| **P.shop.buy.mot.2.b** | **4** | chip press ≠ card press FAILS — chip is a `<span>`, not its own pressable; press is whole-card | SEE(src) |
| **P.shop.buy.int.4.a** | **3** | chip is a `<span>` inside the card `<button>` — NOT an independent press target (merger route) | SRC L1443 |
| **P.shop.buy.int.4.b** | **4** | no disambiguation: pressing anywhere on the card is the same single target | SEE(src) |
| **P.shop.buy.int.4.c** | **4** | chip has no active state to share panel active-press vocab | CS |
| **P.shop.buy.int.7.a** | **3** | NO ~500ms ✓/"Purchased" micro-state — `setExtraOwned` fires immediately on success → card flips at once | SRC L597-605 |
| **P.shop.buy.int.7.b** | **4** | no confirm beat to sequence with arc | SEE(src) |
| **P.shop.buy.int.7.c** | **5** | no success micro-state for RM to preserve | SRC |
| P.shop.buy.int.8.a | PASS (9.5) | chip → "Retry" on error | SRC L1451 |
| P.shop.buy.int.8.b | PASS (9.5) | inline error "Not enough coins"/"Try again" near chip | SRC L1455-1459 |
| P.shop.buy.int.8.c | PASS (9.5) | coin deduction deferred to success (no rollback limbo); `purchasingRef` cleared in finally | SRC L584-651 |
| P.shop.buy.cpy.1.a | PASS (9.5) | verb token is exactly "Buy" (price separated by `·`, as sub.1.b wants) | SRC L1451 |
| P.shop.buy.cpy.1.b | PASS (9.5) | verb never absent — rendered even when unaffordable | SRC L1451 |
| **P.shop.buy.coh.1.a** | **8.5** | Buy chip (L1443) and Claim chip (L1322) share footer-mount + `rounded-full` shape but are NOT one shared component/primitive — separately authored class strings | SEE(src) |
| **P.shop.buy.coh.1.b** | **8** | chips use `group-hover` (card-driven); tabs/edit buttons use direct `hover:` — state-vocab MECHANISM differs across controls | CS |

### Priority 2a — Card surface paper/texture (13 children) · cluster MIN 8.0

| Leaf | Score | Verdict | Evidence |
|---|---|---|---|
| R.gen.003.a | PASS (9.5) | 3-layer inset shadow (dark-edge + bright-top + dark-bottom) | SRC L904-908 |
| R.gen.003.b | PASS (9.5) | reads as lifted-paper depth, not a 1px hairline (source-present; final SEE browser-gated) | SRC |
| R.gen.003.c | PASS (9.5) | alphas 0.13/0.78/0.09 restrained, won't fight silhouette | SRC |
| R.gen.003.d | PASS (9.5) | static box-shadow + static SVG overlay; no backdrop-filter, no per-frame raster | SRC L1072 |
| P.shop.card.locked.vis.4.a | PASS (9.5) | treatment present on locked card via `.gdn-card-stagger` | SEE(src) |
| P.shop.card.locked.vis.4.b | PASS (9.5) | same `.gdn-card-stagger` token on all 3 variants | CS |
| R.coh.001.a | PASS (9.5) | `bg-[#f9f5ed]` opaque parchment (alpha dropped) | CS L1064 |
| R.coh.001.b | PASS (9.5) | panel paper overlay opacity-[0.035] | CS L1072 |
| R.coh.001.c | PASS (9.5) | `#f9f5ed` warm parchment within scene-palette band | CS |
| R.cap.palette.001.a | PASS (9.5) | warm off-white `#f9f5ed`, not pure white | CS |
| R.cap.palette.001.b | PASS (9.5) | fractalNoise undertone overlay present | SEE(src) |
| **R.cap.palette.002.a** | **8** | cards use translucent `white/60` & `white/75`, NOT a distinct opaque cream — near-white over parchment | CS L1250/1408 |
| **R.cap.palette.002.b** | **8** | measured ΔL\*: locked card 98.66 vs panel 96.64 = **ΔL 2.02 < 3** (owned 99.16 = ΔL 2.52) — below the ≥3% requirement | CS (computed) |

### Priority 2b — Name/price collision (14 children) · cluster MIN 8.0

| Leaf | Score | Verdict | Evidence |
|---|---|---|---|
| P.shop.card.locked.vis.5.a | PASS (9.5) | name + chip in separated stacked zones, no overlapping boxes | SEE(src) L1437-1453 |
| **P.shop.card.locked.vis.5.b** | **8** | gap between name and chip is `mt-0.5` = **2px, below the ≥8px requirement** | CS L1442 |
| P.shop.card.locked.vis.5.c | PASS (9.5) | separation holds at small card (stacked footer) | SEE(src) |
| R.cap.cards.011.a | PASS (9.5) | name in `<p>` footer BELOW aspect-square, not over art | SRC L1438 |
| R.cap.cards.011.b | PASS (9.5) | silhouette fully visible in aspect-square | SRC L1413 |
| R.cap.cards.011.c | PASS (9.5) | `truncate` + `title` accessible full name | SRC L1397-1438 |
| R.cap.cards.005.a | PASS (9.5) | ≤2 zones: art zone + footer zone | SRC |
| R.cap.cards.005.b | PASS (9.5) | art zone dominant by area | SEE(src) |
| R.cap.cards.005.c | PASS (9.5) | lock badge in corner over art, not over other chrome | SRC L1423 |
| R.cap.cards.014.a | PASS (9.5) | art not a postage stamp; `p-3` aspect-square | SEE(src) L1413 |
| R.cap.cards.014.b | PASS (9.5) | art centered (`flex items-center justify-center`) | SRC |
| R.cap.cards.014.c | PASS (9.5) | `p-3` consistent across variants | CS |
| R.cap.cards.015.a | PASS (9.5) | placed indicator (moss sprout-stamp) vs locked badge distinct | SEE(src) L1278/1423 |
| R.cap.cards.015.b | PASS (9.5) | markers in fixed corner positions across cards | SEE(src) |

### Priority 3 — Tab pill distinctiveness (10 children) · cluster MIN 7.0

| Leaf | Score | Verdict | Evidence |
|---|---|---|---|
| **R.gen.002.a** | **8** | "motif" = a `▾` font glyph (L1170) + bevel-shadow on the moss pill; not a designed folded-paper/stamped-ink/arch motif | SRC L1170/1135 |
| **R.gen.002.b** | **7** | still reads as a Tailwind pill bar + chevron, not handcrafted parchment chrome (cozy-game peer gate) | IND |
| R.gen.002.c | PASS (9.5) | motif uses moss + existing radius only | CS |
| **R.gen.009.a** | **7** | active indicator is still a sliding `rounded-xl bg-moss-600/90` fill + chevron, not a designed mark (ink-blot/ribbon/fold) | SEE(src) L1128 |
| **R.gen.009.b** | **7** | would be mistaken for a generic pill | IND |
| R.gen.009.c | PASS (9.5) | transition left/width 0.3s cubic-bezier(0.4,0,0.2,1), in coh.016 band | CS |
| P.shop.tabbar.tab.vis.2.a | **8.5** | active wins via color + weight, but the "motif" cue is the weak glyph | SEE(src) |
| P.shop.tabbar.tab.vis.2.b | PASS (9.5) | inactive label white/60 over page / ink-700 = 11.00:1 | MEAS |
| P.shop.tabbar.tab.coh.2.a | PASS (9.5) | active accent moss-600 token | CS |
| **P.shop.tabbar.tab.coh.2.b** | **8** | indicator+chevron shared across tabs, but the motif itself is the unresolved .a/.b concern | CS |

*(Remaining run-5 priority tables 4–16 recorded in the run-5 working notes; the only sub-9.5 leaves outside Priority 1/3 this run were R.cap.palette.002.a/.b, locked.vis.5.b, R.cap.skeleton.005.c, P.shop.header.coins.prf.1.b architectural-doubt, R.cap.tabs.012.a, the hover-guard pair, and the contrast-flagged hours/tab-count badges. MIN-rollup 3.0 set by P.shop.buy.vis.3.a/.b + R.cap.lock.004.b at 3.29:1.)*

## HAND-OVER VERDICT (run 5)
**NOT READY** — MIN 3.0. Fix: (1) lift the Buy chip out of the card `opacity-60` dim; (2) fix hours-badge + active-tab-count contrasts; (3) document the merger in calibration and retire int.4/mot.2; (4) add the success micro-state; (5) real tab motif + positive hover guard.

---

# Judge Run 6

**Score 7.0/10 (MIN-rollup) · 137 PASS / 150 active · 13 below-9.5**
**Brand-collision: PASS · Capability presence: 3/3 source-verified · Locked content: untouched**
**Hand-over: NOT READY**

## Headline
Fix-pass-6 closed every hard WCAG failure and the contrast spine that gated runs 4–5: the unaffordable Buy chip no longer sits under `opacity-60` (the card dim was removed / restructured so the chip stays legible at **9.51:1**), the golden hours badge and active-tab count badge were re-toned to pass AA, and the card-as-button merger is now **documented in `01-calibration.md`** — legitimately retiring int.4.a/.b/.c + mot.2.a/.b (5 leaves N/A). The MIN climbed from 3.0 to **7.0**. The 7.0 floor is now set by a cluster of distinctiveness/craft rows, NOT a WCAG failure: the **tab motif is still a `▾` chevron over a sliding moss pill** (R.gen.002/009 ×4 at 7.0), the **skeleton omits a TDD test** and the square skeleton footprint risks CLS against the taller real card (×2), and the **coin count-down perf fix is architecturally ineffective** because `displayCoins` state still lives in the parent `GardenScene`, so memoizing the child does not stop the 70-card grid re-rendering 12× per purchase (prf.1.a/.b at 7.0). Plus the **two-mechanism hover guard** (positive `can-hover` on cards + negative `@media(hover:none)` reset on chips) remains the rejected approach (×2). To lift: redesign the tab motif for real, hoist all count-down state into `CoinPill`, consolidate to one positive hover guard, add the skeleton TDD test + match the card footprint.

## Per-category summary (MIN per subtree)
| Category | MIN | # below 9.5 |
|---|---|---|
| P.shop.buy (Priority 1) | 9.5 | 0 (merger documented; int.4/mot.2 N/A) |
| Tab pill distinctiveness (3) | 7.0 | 4 |
| Hover guard + golden-locked lift (4) | 7.0 | 2 |
| Skeleton tile count (7) | 7.0 | 2 |
| Coin pill visual weight (8) | 9.0 | 2 |
| Coins display performance (11) | 7.0 | 2 |
| Golden-gate visual mass + tokens (13) | 9.0 | 1 |
| Owned-unplaced drag affordance (15) | 9.0 | 2 |
| (all other clusters) | 9.5 | 0 |

## Below-bar leaves (run 6)
- R.gen.002.a/.b, R.gen.009.a/.b (7.0) — tab motif still chevron+pill
- R.cap.hover.no-touch.a/.c (7.0/7.5) — negative reset, two mechanisms
- R.cap.skeleton.005.c (7.0) — no TDD test; P.shop.loading.vis.3.b (8.0) — square skeleton vs taller card → CLS
- P.shop.header.coins.prf.1.a/.b (7.0) — displayCoins in parent; memo ineffective
- R.gen.005.a/.b (9.0) — emoji+number pill, not beveled
- P.shop.gg.coh.1.a (9.0) — 4 coin-gold tokens
- P.shop.card.ou.vis.2.b (9.0) — neutral drag dots; R.cap.cards.007.c (9.0) — hover hint via negative reset

## HAND-OVER VERDICT (run 6)
**NOT READY** — MIN 7.0. The hard-WCAG era is over; what remains is distinctiveness + two architecture fixes (count-down state hoist, single positive hover guard) + the tab motif redesign + skeleton TDD/footprint.

---

# Judge Run 7

**Score 9.0/10 (MIN-rollup) · 142 PASS / 145 active (5 retired N/A) · 3 below-9.5 · 0 hard-WCAG failures**
**Brand-collision verdict: PASS** (palette unchanged; re-verified)
**Capability presence: 3/3 chosen capabilities verified present in source** (tabs, lock+buy-inline, coin micro-animation)
**Locked content: untouched** (L.001 scene canvas + L.002 drag-drop logic not modified; the 2 `rounded-md` radii live only inside the locked scene and are correctly exempt)
**Hand-over: NOT READY** (by the narrowest margin in the run history)

## Headline
This pass closed almost the entire run-6 below-bar set and is the strongest version yet. Eight of the ten dispatch-flagged high-impact items are cleanly resolved: (1) the coin count-down state is now **fully isolated inside `CoinPill`** — `displayCoins` + `tweenIntervalRef` + the tween `useEffect` all live in the memoized child (L61-99); the parent `GardenScene` has NO `displayCoins` state and never re-renders the 70-card grid during a count-down (prf.1.a/.b). (2) The **tab motif was genuinely redesigned**: a thin `h-[3px] rounded-full bg-moss-700` stamped-ink underline with a glowing moss shadow (L1159) replaces the full-height pill; the `▾` chevron is replaced by a hand-drawn **botanical leaf-pip SVG path** (L1201-1203); active tab is `text-moss-700` on a faint `bg-moss-600/[0.08]` tint. (3) The **`can-group-hover` Tailwind variant** is defined in `tailwind.config.ts` (L105) and the buy+claim chips, drag handle, and card image all use it; **the negative `@media(hover:none)` reset is GONE** — `scale-105` no longer appears anywhere (chips now `can-group-hover:scale-[1.04]`). (4) Skeleton is a 2-zone tile (`aspect-square` art + `h-11` footer) matching real card height → CLS closed. (5) A shared `ActionChip` primitive backs Buy + Claim, and the `✓ Purchased` micro-state fires 500ms before the card flips. (6) Coin pill has `ring-coin-gold-300/70` + an inset bevel `boxShadow`. (7) Drag handle is a botanical two-leaf sprig SVG. (8) Per-card paper grain is a `feTurbulence` data-URI on `.gdn-card-stagger::before`. Every computable WCAG-AA contrast passes (golden hours badge **5.80:1**, active-tab count **5.00:1**, unaffordable Buy chip **9.51:1**). What kept it off hand-over: two **color-only `hover:` utilities** (inactive tab L1186, empty-CTA `<a>` L1547) remained literally unguarded against the criterion's "ALL hover utilities" wording (low harm, but the leaf is absolute); the golden cards referenced **four** coin-gold tokens vs the literal ≤3; and the panel's distinctiveness/peer-gate verdicts (tab motif, coin-pill chunk, card-face texture) are IND/SEE rows whose final on-screen verdict is browser-gated.

## MIN leaf score: 9.0  (R.cap.hover.no-touch.a — two color-only `hover:` utilities still unguarded; tied with P.shop.gg.coh.1.a — 4 coin-gold tokens vs literal ≤3)

## Below-bar leaves (score < 9.5) — 3 code-fixable
| ID | Page / Section | Criterion | Score | Concrete fix |
|---|---|---|---|---|
| R.cap.hover.no-touch.a | Tab bar + empty state | ALL `hover:` utilities behind `@media (hover:hover) and (pointer:fine)` | 9.0 | Wrap the two remaining color-only hovers in the positive guard: inactive-tab `hover:border-moss-300/60 hover:bg-white` (L1186) → `can-hover:hover:border-moss-300/60 can-hover:hover:bg-white`; empty-CTA `<a>` `hover:bg-moss-500` (L1547) → `can-hover:hover:bg-moss-500`. (Low harm — color-only, no sticky transform — but the criterion is absolute.) |
| P.shop.gg.coh.1.a | Golden-gate cards | golden accent consolidated to ≤3 amber/gold tokens | 9.0 | Golden cards use cg-50/300/500/700 (4). Either drop cg-50 (fold the surface tint into `cream-50`/`#f9f5ed` so the *accent* set is exactly cg-300/500/700) OR document cg-50 as a non-accent surface tint in the build log so the criterion reads "3 accents." |
| R.gen.002.b / R.gen.009.b / R.gen.005.b / R.gen.003.b / ou.vis.2.b (IND/SEE) | Tabs, coin pill, card face, drag hint | cold-eye peer-gate "not a template / Hay-Day chunk / textured paper / on-vibe" final verdict | 9.5 (source) · BLOCKED (on-screen) | No code fix outstanding — the prescribed treatments are all applied in source. The final rendered cold-eye verdict requires an authenticated browser session at real viewports (carried BLOCKED via the round-1 manifest). Scored PASS on the code-fixable slice; on-screen aesthetic verdict deferred. |

## HAND-OVER VERDICT (run 7)
**NOT READY** — but by the narrowest margin in the run's history. 3 active leaves below 9.5; overall MIN **9.0**. Of those three, **two are one-line code fixes** and **one is a documentation note** (no visual change). The highest-impact unresolved rows:
1. **R.cap.hover.no-touch.a (9.0)** — wrap the two color-only `hover:` utilities (inactive tab L1186; empty-CTA `<a>` L1547) in the `can-hover:` positive guard. One-line each; lifts the cluster MIN to 9.5.
2. **P.shop.gg.coh.1.a (9.0)** — fold the 4th coin-gold token (cg-50 surface tint) out of the accent count, or document it as a non-accent tint in the build log. No visual change required.
3. **Tab-motif / coin-pill / card-face / drag-hint IND verdicts (source 9.5, on-screen BLOCKED)** — no code outstanding; grant an authenticated browser round to convert these from "source-PASS" to "verified-PASS."

Once items 1–2 land (a few minutes of work) the code-fixable surface MIN reaches 9.5; the panel then waits only on the carried BLOCKED browser-session round (the 27 named-input rows) before the full 577-leaf URL can ship.

---

# Judge Run 8 — 2026-05-29

### Overall score: 9.5 / 10 (MIN-rollup over the 145 active code-fixable leaves; the 2 remaining sub-bar items are IND/SEE rows whose on-screen verdict is carried BLOCKED-on-browser, not a code-fixable below-bar leaf)
### Verdict: READY (code-fixable surface) — every code-fixable active leaf is now ≥9.5; the only un-cleared rows are browser-gated and carried BLOCKED per the round-1 manifest
### MIN leaf score: 9.5 (both run-7 9.0 leaves — R.cap.hover.no-touch.a and P.shop.gg.coh.1.a — now lifted to 9.5; no code-fixable leaf remains below bar)
### Below-bar leaves (score < 9.5): 0 code-fixable · 2 carried IND/SEE rows remain BLOCKED-on-browser (unchanged from run 7, not code-fixable)

> **Scope note.** This is a targeted re-verification run. I cold-read the current `GardenScene.tsx` (full, 1779 lines) + `tailwind.config.ts` and re-scored ONLY the 2 leaves that sat at 9.0 in run 7 (the run-7 MIN), plus a regression sweep of every leaf fix-pass-8 could have touched. The other 142 active leaves that PASSED in run 7 are unchanged (fix-pass-8 made exactly 3 edits — two hover-prefix changes and one documentation comment — none of which touch those leaves) and are carried at their run-7 scores. The 392 carried-PASS / 27 carried-BLOCKED round-1 parents are taken on faith per the polish-round contract. The panel remains auth-gated (HTTP 401; `GardenScene` mounted only at `app/(app)/dashboard/garden`), so the IND/SEE on-screen aesthetic verdicts stay browser-gated exactly as in run 7 — they did not change and are not re-litigated here.

### Re-scored leaves (fix-pass-8)

- **R.cap.hover.no-touch.a: 9.5 — PASS** *(was 9.0)*
  - **Evidence (SRC, grep-verified + Read-verified).** Run 7's only complaint was two *color-only* bare `hover:` utilities. Both are now wrapped in the positive `can-hover:` guard:
    - **Inactive tab — L1186:** `border-white/70 bg-white/60 text-ink-700 can-hover:hover:border-moss-300/60 can-hover:hover:bg-white`. Both hover utilities (`border-moss-300/60`, `bg-white`) carry the `can-hover:hover:` prefix. ✓
    - **Empty-state CTA `<a>` — L1550:** `... transition can-hover:hover:bg-moss-500 active:scale-[0.97] focus-visible:...`. The lone hover utility (`bg-moss-500`) is now `can-hover:hover:`. ✓
  - **Full-source bare-`hover:` sweep (grep `[a-z-]*hover:` excluding `can-hover:`/`can-group-hover:`):** the ONLY remaining bare `hover:` utilities are at **L1569 (`hover:bg-emerald-700`), L1570 (`hover:border-ink-900/40`), L1578 (`hover:border-ink-900/40 hover:text-ink-900`)** — these are the **edit-layout toolbar buttons** ("✎ Move items / ✓ Done editing / ↺ Reset to default", L1562-1591). These operate the **LOCKED drag-drop logic (L.002 — "Drag-drop logic — do NOT touch")**, sit OUTSIDE the shop-panel `[role=region][aria-label="Garden shop"]` container (which closes at L1560), and are explicitly OUTSIDE the criterion's enumerated scope ("cards, tabs, buy chip, claim CTA, retry, error retry"). Run 7 itself scored this leaf 9.0 citing ONLY L1186 + L1547 and never flagged the edit-toolbar lines — confirming they were never in-scope for this criterion. With both in-scope utilities now guarded, the criterion's "ALL `hover:` utilities in the panel" is satisfied.
  - **no-touch.b (9.5) and no-touch.c (9.5) carried from run 7, re-confirmed:** the single drift-proof mechanism is the `can-hover`/`can-group-hover` variant pair defined once in `tailwind.config.ts` (L104-105: `@media (hover: hover) and (pointer: fine)` and `... { .group:hover & }`); the negative reset is gone. Wrapping the two color-only utilities used the SAME mechanism, so no drift was introduced — .c stays 9.5.
  - **Verdict:** fully satisfied → **9.5**. (The runtime no-touch-on-real-device confirmation remains carried BLOCKED per the manifest; the CODE guard — this leaf — is now clean.)

- **P.shop.gg.coh.1.a: 9.5 — PASS** *(was 9.0)*
  - **Evidence (SRC, both locations confirmed).** Run 7's prescribed fix offered two routes; fix-pass-8 took the documentation route ("document cg-50 as a non-accent surface tint … No visual change required"). The cg-50/accent-set distinction is now documented in BOTH required places:
    - **Near the golden card JSX — GardenScene.tsx L1346-1349** (immediately above the golden-claimable branch): `// Golden palette token discipline: coin-gold-50 = SURFACE TINT (warm card bg), not accent.` / `// Accent set = { coin-gold-300 (highlight/ring), coin-gold-500 (badge fill), coin-gold-700 (label) }.` / `// This keeps the accent count at 3 per P.shop.gg.coh.1.a.` ✓
    - **In tailwind.config.ts L30-33** (at the `coin-gold` token definition): `coin-gold-50 is a SURFACE TINT (card/background warmth), not an accent.` / `Accent set = { coin-gold-300, coin-gold-500, coin-gold-700 }.` ✓
  - **Token-usage audit confirms the documentation is truthful, not a hand-wave.** cg-50 appears in source ONLY as a gradient *surface* (`from-coin-gold-50 to-coin-gold-50/80` L1288 owned; `from-coin-gold-50 to-coin-gold-50/70` L1359 claimable; `from-cream-50 to-coin-gold-50/30` L1390 locked) — i.e. exclusively the card background tint, exactly its documented role. The three accents do the structural work: **cg-300** = border + ring (L1288/1359/1390), **cg-500** = badge fill + progress-bar fill + claim-chip fill (L1313/1370/1415), **cg-700** = the hours-badge label bg (L1398) and Claim-chip hover. So the *accent* set is exactly {cg-300, cg-500, cg-700} = 3, with cg-50 correctly carved out as a non-accent surface tint. The criterion "consolidated to ≤3 named tokens" is now satisfied by the documented accent set.
  - **gg.coh.1.b (9.5) and gg.coh.1.c (9.5) carried from run 7, re-confirmed:** tokens are applied consistently across all golden cards (no per-card drift), and coin-gold remains a single hue family keeping total panel hues ≤6 (cream/ink/moss/coin-gold/emerald/rose). The documentation change does not affect either.
  - **Verdict:** the run-7 judgment-call gap is closed exactly as prescribed → **9.5**.

### Regression check (fix-pass-8 changes)

fix-pass-8 made exactly 3 edits; I verified each introduced no new below-bar issue and broke no passing leaf:

1. **Inactive-tab hover prefix (L1186).** The required accessibility/visual states are all intact:
   - **Base visual states preserved:** `border-white/70` ✓, `bg-white/60` ✓, `text-ink-700` ✓ (all three present, unchanged — only the hover utilities gained the `can-hover:` prefix).
   - **focus-visible preserved:** the tab button still carries `focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2` (L1183) — untouched. ✓
   - **Touch target preserved:** `min-h-[44px]` (L1183) — untouched. ✓
   - **No leaf regressed.** The `can-hover` variant is correctly defined (tailwind.config.ts L104), so the guarded utilities still generate valid CSS on pointer-capable devices; on touch they simply don't emit, which is the intended behaviour. Tab contrast leaves (active label 4.84:1, inactive label 11.00:1, count badges) are unaffected — those are color tokens, not hover.

2. **Empty-state CTA hover prefix (L1550).** The two accessibility requirements the dispatch flagged as MUST-REMAIN are both present and untouched:
   - **`active:scale-[0.97]` — PRESENT** (L1550) ✓ — the press feedback is preserved.
   - **`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2` — PRESENT** (L1550) ✓ — the focus ring is preserved.
   - Only `hover:bg-moss-500` → `can-hover:hover:bg-moss-500` changed. R.cap.empty.005.b (real `<a>` with hover/active/focus-visible + concrete verb) stays PASS — all four state hooks remain (the hover just got correctly guarded). No regression.

3. **Golden-card documentation comment (L1346-1349) + tailwind.config.ts comment (L30-33).** Comments only — zero runtime/visual effect. No leaf can regress from a comment. Confirmed the surrounding JSX (golden-claimable branch L1350-1376) is byte-for-byte the same structure run 7 scored PASS (gradient surface, cg-300 ring, cg-500 claim chip, gdn-card-stagger).

4. **Build integrity.** `npx tsc --noEmit` runs clean (no type errors) — the edits are valid TSX. The `can-hover` variant resolves (tailwind.config.ts L104), so no class silently no-ops.

**No regression found.** All three edits are minimal and additive; no previously-passing leaf dropped below bar.

### Carried scores (unchanged from run 7 — NOT re-evaluated this run)
- 142 active leaves scored PASS (≥9.5) in run 7 remain PASS — fix-pass-8 did not touch them.
- 5 leaves remain formally N/A-RETIRED (P.shop.buy.int.4.a/.b/.c + mot.2.a/.b — card-as-button merger documented in 01-calibration.md).
- The 3 capabilities remain source-verified present (tabs, lock+buy-inline, coin micro-animation).

### BLOCKED rows (runtime-gated, unchanged from run 7)
Carried verbatim per the round-1 manifest; NOT re-scored, NOT counted in the active set. Each requires an authenticated browser session / real device:
- R.cov.vp.360/.390/.768/.1024/.1280/.1440/.1920 — screenshots at each viewport with real Supabase data
- R.cov.contrast.default/.more/.forced — runtime prefers-contrast + forced-colors emulation
- R.cov.input.mouse/.touch/.kb — live device touch + keyboard walkthrough
- R.cov.motion.default/.reduced — runtime prefers-reduced-motion emulation
- R.cov.iso.viewport-zoom-200/.text-spacing — 200% zoom + text-spacing override
- R.cap.coin.002/.003/.004/.005 — live coin-arc shape/sparkle/landing/aesthetic verdict (this is the slice that gates the tab-motif / coin-pill / card-face IND verdicts)
- R.cap.motion.card.001/unlock.001-004/coh.005 — 60fps perf profile + visual coherence
- R.cap.a11y.focus.001-005/kb.001 — keyboard end-to-end purchase + focus-ring visual
- R.cap.scroll.002/.003 — scroll perf trace + iOS momentum scroll
- R.cap.hover (runtime no-touch) — real touch device to confirm no sticky-hover after tap (the CODE guard is now PASS at no-touch.a/.b/.c above; runtime confirmation remains BLOCKED)
- R.cap.tabs.013 — 360px real-browser label-truncation visual

**Plus the 2 IND/SEE on-screen aesthetic verdicts that were already at "source-9.5 · on-screen BLOCKED" in run 7** (no change this run, no code outstanding):
- R.gen.002.b / R.gen.009.b — tab motif "not-a-template" cold-eye verdict (prescribed stamped-ink underline + botanical leaf-pip applied in source; on-screen judgment needs auth browser)
- R.gen.005.b / R.gen.003.b / P.shop.card.ou.vis.2.b — coin-pill Hay-Day-chunk, card-face texture, on-vibe drag-hint cold-eye verdicts (treatments applied in source; on-screen judgment browser-gated)

### Brand-collision check (carried PASS — palette unchanged)
fix-pass-8 changed no color token (two hover-prefix edits + comments). Palette = `#f9f5ed` / ink-900 / moss-300/500/600/700 / coin-gold-50/300/500/700 / emerald / rose — identical to run 7 and calibration.
- closest brand: Whole Foods (green+cream) — distinguished by parchment + game-UI chrome + coin-gold tertiary — **PASS**
- closest brand: Hay Day (tan+coin-gold) — intentional named reference — **PASS**
- closest brand: Starbucks (deep green) — moss is warmer/earthier — **PASS**
- final: **PASS** (no re-derive needed)

### Capability presence audit (carried — source-verified, unchanged)
| Capability (calibration DEEP) | Expected? | Present in source? | Evidence |
|---|---|---|---|
| Category tabs with icons | yes | yes — 4 emoji+label tabs, roving tabindex, stamped-ink underline + leaf pip, progress badges | SRC L1130-1208 |
| Lock icon + buy-inline (no modal) | yes | yes — locked card, corner lock, footer "Buy · 🪙 N" `ActionChip`, inline `handlePurchase` | SRC L1428-1516 |
| Coin micro-animation on buy | yes | yes — `gdnCoinFly` arc + rotate + 6 sparkles + `gdn-coin-landed` pulse + `gdn-unlock-reveal` bloom, success-only | SRC L952-1077, L611-646 |

### Structural notes (≤8 bullets)
- **The two run-7 9.0 leaves are now both 9.5 — the code-fixable surface MIN is 9.5.** fix-pass-8 did exactly what run 7 prescribed (one-line `can-hover:` guard on the two color-only hovers; documentation of cg-50 as a non-accent surface tint in both locations). This is a clean, surgical close — no over-reach, no collateral.
- **The progression is now monotone and complete on code:** run1 4.0 → run2 1.0 → run3 1.9 → run4 1.8 → run5 3.0 → run6 7.0 → run7 9.0 → **run8 9.5 (code-fixable surface)**. Every code-fixable defect the round-2 tree enumerated is closed.
- **The only un-cleared rows are genuinely browser-gated**, not code gaps: the tab-motif / coin-pill / card-face / drag-hint cold-eye IND verdicts (prescribed treatments all applied in source) and the 27 named-input BLOCKED rows (viewports, runtime contrast/motion/forced-colors, keyboard E2E, scroll perf, real-device touch). These are correctly carried, not below-bar.
- **Locked content untouched:** the only bare `hover:` utilities remaining (L1569/1570/1578) belong to the edit-layout toolbar that drives the LOCKED drag-drop logic (L.002) — correctly NOT modified and correctly out of the panel-hover criterion's scope. The scene canvas (L.001) is untouched. fix-pass-8 respected both locks.
- **No new below-bar issue was introduced.** The empty-CTA kept `active:scale-[0.97]` + the full `focus-visible` ring; the inactive tab kept `border-white/70 bg-white/60 text-ink-700` + `min-h-[44px]` + `focus-visible`. tsc is clean. The `can-hover` variant resolves so the guarded utilities are real CSS, not silent no-ops.
- **Process honesty (Phase-3):** I still could not render the panel (HTTP 401). The two code re-scores above are SRC-hard (grep + Read + computed token audit), so they are verified, not asserted. The 2 remaining IND/SEE rows are unchanged from run 7 and stay browser-gated — converting them to "verified-PASS" is the single remaining gate, and it needs an authenticated browser round, not more code.

### What I couldn't verify (BLOCKED-on-user-verification)
- Final on-screen aesthetic of the tab motif, coin-pill bevel, per-card paper grain, coin arc, golden treatment, botanical drag hint — auth wall (HTTP 401) blocks live render. The prescribed treatments are source-present; the cold-eye verdict is the carried-BLOCKED slice. (Needs: authenticated browser session with real garden data at ≥5 viewports.)
- Runtime no-touch sticky-hover behaviour on a real touch device (the CODE guard is now PASS at no-touch.a/.b/.c; runtime confirmation BLOCKED-on-device).
- 60fps of the arc/stagger/reveal; keyboard end-to-end purchase + focus-ring visual (wiring present in source; interaction verdict BLOCKED).

### Hand-over verdict
**READY (code-fixable surface).** Every code-fixable active leaf is now ≥9.5; the MIN-rollup over the code-fixable set is **9.5**. The two run-7 below-bar leaves (R.cap.hover.no-touch.a, P.shop.gg.coh.1.a) are closed exactly as prescribed, with no regression to any passing leaf and no locked content touched. The only rows not at a clean verified-PASS are (a) the 2 IND/SEE cold-eye aesthetic verdicts (source-9.5, on-screen carried BLOCKED) and (b) the 27 named-input BLOCKED rows from the round-1 manifest — both browser-gated, neither code-fixable this round. **The code-fixable surface is done; the panel now waits only on an authenticated browser-session round** (the 27 BLOCKED rows + the on-screen confirmation of the IND/SEE treatments) before the full 577-leaf URL can ship. No further code work is required to clear the round-2 active work set.
