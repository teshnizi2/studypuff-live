# Re-derive + Delete Pass — round 1

**Trigger:** candidate-green (scheduled pass, run by Phase 3h agent)
**Rounds since last re-derive:** this is the first external Phase 3h run; prior passes were self-contained to the build loop
**Pass number:** 4 (supersedes pass 3)

---

## Prior pass summary

Pass 3 found no new deletion candidates and confirmed all pass-2 items executed. This pass starts
fresh from the live source, not from pass 3 findings.

---

## Deletion candidates

| Item | Type | Justification | Reversibility |
|---|---|---|---|
| `td-item-golden` className on scene item buttons (line 714) | ELEMENT (CSS class application) | Class is added to the scene-layer button element but no CSS rule in the JSX `<style jsx>` block, `globals.css`, or any discovered stylesheet targets `.td-item-golden` as a selector. The child element that creates the aura uses a distinct class `td-item-golden-aura`. The parent class does nothing. Remove the conditional `${isGolden ? "td-item-golden" : ""}` from the template literal. | git commit before; safe to delete — removing a class that no rule targets has zero visual effect |
| `td-item-lantern` className on scene item buttons (line 714) | ELEMENT (CSS class application) | Same pattern as td-item-golden. Class is applied conditionally when `isLantern` is true, but no CSS rule targets `.td-item-lantern` in any stylesheet. The lantern-glow `div` child element uses inline conditional rendering, not a CSS class selector. Remove `${isLantern ? "td-item-lantern" : ""}`. | git commit before; safe to delete |
| `key={activeTab}` on empty-state div (line 1342) | ELEMENT (React key prop) | The parent tabpanel `div` already has `key={activeTab}` at line 1121. When `activeTab` changes, the tabpanel remounts entirely, taking all children with it — including the empty state. Adding a second `key={activeTab}` on the inner `div` forces a redundant React reconciliation signal that the parent's key already handles. This creates unnecessary component churn but no benefit. | git commit before; safe to delete — parent key governs remount |
| Four `opacity-100` explicit declarations on name-strip spans (lines 1190, 1217, 1258, 1334) | ELEMENT (redundant CSS utility) | `opacity-100` is the Tailwind default for all elements. Explicitly writing it provides no override. The original intent was likely to signal "this label is always visible, not hover-toggled" — a concern that should be expressed as a comment, not as a no-op class. Remove from all four name strips. Note: the one at line 1311 is NOT a candidate — that one alternates `opacity-0 / opacity-100` and is load-bearing. | git commit before; safe to delete — zero visual change |
| `--spark-x` and `--spark-y` custom property references in `gdnSparkle` keyframe (lines 911-912) | ELEMENT (dead CSS variable) | The fallback values `var(--spark-x, 8px)` and `var(--spark-y, -8px)` are always the active values because these custom properties are never set on the `.gdn-coin-fly` element in JSX. Both pseudo-elements travel to the same fixed direction (8px right, -8px up) rather than fanning out. Either the variables should be set dynamically on the element to create a real fan effect, or the variables should be replaced with the hardcoded 8px / -8px values to eliminate the illusion of configurability. This is not a deletion but a simplification of the keyframe to remove dead indirection. | git commit before; visual change is intentional simplification |

---

## Replacement / restructure proposals

| What | From | To | Justification |
|---|---|---|---|
| Coin balance pill element (line 991) | `div` with both `aria-label` and `aria-live` | Separate the two concerns: `aria-live` should be on the existing sr-only region (line 1006) which already announces purchase events. The pill `div` should keep `aria-label` for static identification but drop `aria-live`. Currently, every tween tick (12 steps per purchase) triggers a polite SR announcement of the raw number with no "Coin balance:" prefix — because `aria-live` announces text content, not `aria-label`. The sr-only polite region at line 1006 handles the purchase success announcement (includes "balance now N" in `announceMsg`). Having two live regions fired from the same event creates double-announcements. | Correctness; removes SR noise |
| Golden-locked card element (line 1229) | `div` with `role="img"` and no `tabindex` | Add `tabindex="0"` to make the card keyboard-reachable per R.cap.a11y.cards.001. Currently, the div with `role="img"` has no tabindex, so it is not focusable by Tab. The progressbar child inside the `role="img"` subtree is also unreachable. As an alternative: change the outer element to `role="group"` or `role="listitem"` so the progressbar is exposed separately. Pick one model. | A11y correctness |
| Shop panel container (line 963) | `div` with `aria-label="Garden shop"` | Change to `<section aria-label="Garden shop">` or add `role="region"` to the existing div. A plain `div` with `aria-label` but no landmark role is not exposed as a landmark in screen reader landmark navigation. `role="region"` + `aria-label` is the correct pattern per ARIA spec and per `R.cap.a11y.region.001`. | A11y landmark correctness |
| Name strip on standard purchasable-locked card (line 1334) | `bottom-7` | Increase to `bottom-9` (36px) or reduce the price badge from `bottom-2` to `bottom-1`. Current geometry: name strip bottom edge sits at 28px from card bottom; price badge top edge sits at 24px from card bottom — 4px overlap confirmed by measurement. This collision is the same issue self-doubt flagged at 1c. The golden-locked fix (`bottom-4` clearing the progress bar) was applied but the equivalent fix for the standard locked card was not. | Structural fix; requires SEE verification post-change |
| Standard locked card name strip (line 1334) vs golden-claimable name strip (line 1217) | Both use `bottom-7` | These two cards have different bottom-badge heights: golden-claimable badge is `py-0.5 text-[9px]` (same as standard). Both use `bottom-7`. So the same collision exists on the golden-claimable card too. Unify the fix: move both to `bottom-9`, or set the price/claim badge height to create enough clearance. | Consistency |
| `isGoldenCat` and `isGoldenItem` computed at lines 1132-1133 | Two booleans | These two overlap almost completely. `isGoldenCat = item.category === "garden-golden"` and `isGoldenItem = item.id.startsWith("garden-golden-")`. In the current data model, golden-category items always have the `garden-golden-` id prefix (by convention). The only place `isGoldenItem` is used instead of `isGoldenCat` is in the owned-card branch (lines 1152, 1172, 1175) — because an owned golden item may be in a non-golden category tab (it stays in its original category). This distinction is real and the two booleans are justified. No change needed. | Keep — distinction is load-bearing |

---

## Distinctiveness defects discovered

- **R.gen.002 confirmed from source: tab pills are genre-default.** The sliding indicator (moss-600 rounded-full bg pill under tab buttons) reads as a polished Tailwind tab bar, not as a "parchment/inflected treatment." No fix passes changed this. The genre-default escape is absent. Propose: add a subtle folded-corner clip-path or an ink-stroke indicator underline in place of the floating pill. This does not require a deletion — it requires a replacement of the indicator's visual style.
- **R.gen.003 confirmed from source: ink-edge hairline still reads as hairline.** The `gdn-card-stagger` inset shadow at `rgba(31,25,15,0.11)` is the full card surface treatment. No texture overlay, no roughened border-image, no paper-grain SVG filter. At 11% opacity it will read as a barely-visible border on a white/60 card. The criterion demands "paper texture, ink edge, or hand-stamped quality." This requires a restructure, not a deletion — propose a CSS `background-image: url(noise.svg)` or a CSS radial-gradient texture overlay on the card. Not a code-deletion candidate; flagged as an unresolved distinctiveness defect.
- **R.coh.007 confirmed from source: golden-locked card has no hover utility.** Line 1234: the golden-locked `div` has no `hover:scale-[1.04]` or `hover:shadow-md`. Every other hoverable surface in the panel has these. Hover language is inconsistent. Since the golden-locked card is not interactive (no purchase action), not adding hover lift is defensible — but it should be documented in calibration or the card should get a focus-visible ring to maintain consistency in non-hover interaction vocabulary.
- **R.cap.hover.no-touch confirmed from source: no `@media (hover: hover)` guard.** All `hover:` Tailwind utilities on cards and tabs apply on touch devices. This creates sticky-hover after tap on mobile. No CSS `@media (hover: hover) and (pointer: fine)` wrapper exists. Propose adding a Tailwind plugin config or a CSS block that strips hover utilities on touch input.

---

## Locked content verification

- **L.001 — GardenScene scene canvas:** The `div` with `ref={sceneRef}` (line 643), the base map `<img>` (line 646-651), night sky gradient div and star SVG (lines 662-675), dusk/dawn overlay (lines 677-681), drifting cloud divs (lines 685-691), `placedItems.map` with scene item buttons (lines 697-750), drop-preview circle (lines 754-766), and `<SunArcHud />` (line 769) are all present and structurally intact. The scene canvas was not modified by any shop-panel build pass. UNTOUCHED. ✓
- **L.002 — Drag-drop logic:** `handlePointerDown` (line 377), `onWindowMove` inner closure, `onWindowUp` inner closure, `clientToScenePercent` (line 354), `isOverScene` (line 363), `isOverInventory` (line 370), `persistLayout` (line 336), `resetLayout` (line 511), all ref mirrors (`layoutRef`, `draggingRef`, `isEditingRef`), `windowDragCleanupRef`, and the `pendingTimeoutsRef` cleanup effect are all present and unmodified. UNTOUCHED. ✓

---

## Criteria-tree stale-criterion flags

These are not code changes but criterion maintenance items for the next criteria-tree pass:

1. **`cap.coin.002` and `cap.coin.003` wording mismatch (carry-forward from pass 3):** Both describe "a coin element lifts from coin-balance badge" and "coin travels to the purchased card." The implementation fires the opposite direction: arc originates at the buy-button (`triggerEl.getBoundingClientRect()`, line 545) and terminates at the coins pill (`coinsRef.current.getBoundingClientRect()`, line 540). The arc correctly represents coins leaving the wallet and landing on the card — the semantic direction is right, but the spatial direction is inverted relative to criterion wording. Criteria wording should be updated to describe the buy-button → coins-pill arc, or the implementation should be inverted if the pill→card direction was deliberately intended.

2. **R.cap.a11y.cards.001 scoring for golden-locked cards:** This criterion says "each card is reachable by Tab." Golden-locked cards use `div[role="img"]` without `tabindex`, so they are NOT reachable by keyboard. The criterion should score FAIL on this surface. Currently there is no specific golden-locked keyboard criterion — the general R.cap.a11y.cards.001 covers it, but the scoring rubric should note this specific variant.

---

## Action plan

1. **git commit current state, then delete `td-item-golden` and `td-item-lantern` class conditions from line 714.** These are the safest deletions (no CSS rule targets them; removal has zero visual effect). Two conditional string interpolations removed.

2. **git commit, then remove the four redundant `opacity-100` declarations from name-strip spans (lines 1190, 1217, 1258, 1334).** Zero visual change; cleaner markup.

3. **git commit, then remove `key={activeTab}` from the empty-state div (line 1342).** Parent key already handles remount. Tiny React performance improvement.

4. **git commit, then simplify `gdnSparkle` keyframe:** Replace `var(--spark-x, 8px)` and `var(--spark-y, -8px)` with literal `8px` and `-8px` unless a fan effect (multiple different directions) is desired — in which case the variables must actually be set on the element in JSX. Pick one direction and remove the dead indirection.

5. **git commit, then fix the coin balance pill aria duplication:** Remove `aria-live="polite"` and `aria-atomic="true"` from the `coinsRef` div. The sr-only region at line 1006 already announces purchase events. The pill's `aria-label` provides static identification when focused. The tween-tick announcements (12 per purchase) are SR noise.

6. **git commit, then fix the shop panel container landmark:** Change `div` at line 963 to `<section>` and update the closing tag, OR add `role="region"` to the existing div. Either approach exposes it as a landmark in SR navigation.

7. **git commit, then add `tabindex="0"` to the golden-locked card div (line 1229).** Keyboard reachability fix per R.cap.a11y.cards.001.

8. **git commit, then fix the name-strip / price-badge collision on standard locked card (line 1334):** Move `bottom-7` to `bottom-9` (or move the price badge from `bottom-2` to `bottom-0`). Apply the same fix to the golden-claimable card name strip at line 1217 if its badge clearance has the same geometry.

9. **Source-fixable structural defects (from self-doubt Category A, unaddressed):** Add `@media (hover: hover) and (pointer: fine)` wrapper around all card/tab hover utilities (R.cap.hover.no-touch); add entrance fade to empty state container (P.shop.empty.mot.1); increase skeleton tile count from 12 to 20 for large-grid viewports (R.cap.skeleton); document or resolve the card-as-button architecture gap for the P.shop.buy subtree.

Items 1-8 are destructive changes; each requires a git branch/commit before execution per the high-blast-radius rule. Item 9 is a Phase 2 build-pass concern, not a re-derive deletion.

---

## Self-check: a round where I deleted nothing AND added nothing is suspicious — am I being honest?

This pass found 5 deletion candidates (2 dead CSS class applications, 1 redundant React key, 4 redundant opacity-100 declarations, 1 dead CSS variable indirection), 5 restructure proposals, 4 distinctiveness defects confirmed from source, and 2 criteria-tree maintenance flags. The prior pass 3 returned a null result because it was run immediately after the build loop's own cleanup passes, which had trimmed the most obvious dead code. This pass was run from scratch with broader scope (full re-derive discipline, not just incremental cleanup), which surfaces the CSS class dead weight and the accessibility restructure candidates that the build loop's cleanup passes did not catch. The non-null result is consistent with THOG's additive bias: each fix pass adds code, and without a scheduled re-derive, the accumulation of small additions creates a net weight gain. This pass finds that weight.
