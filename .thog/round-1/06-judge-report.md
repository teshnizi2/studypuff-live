# Judge report — round 1
Dial: 8 | Pass threshold: 9.5

## Verdict: NOT-READY

---

## Capability evidence (DEEP x 8)

### 1. R.cap.tabs — Category tab navigation
Score: **7.5 / 10**

Four tabs render with correct ids (garden-structures / garden-plants / garden-critters / garden-golden) and `role="tablist"` + `role="tab"` + `aria-selected` + `aria-controls` are all present (SRC lines 704-740). **Critical gap:** tabs are implemented as individual `<button>` elements with `onClick`; there is no roving-tabindex logic (all buttons receive natural tab stops, so tabindex is never set to -1 on inactive tabs — R.cap.tabs.011 FAIL). Arrow-key navigation (Left/Right, Home/End) is not implemented — R.cap.tabs.010 FAIL. Active-indicator transition is a CSS `transition-all` class-swap on the button itself, not a sliding indicator moving from old tab to new tab — R.cap.tabs.005 FAIL. Tab content swap has no explicit outgoing-fade; the `tabItems` memo simply recomputes on `activeTab` change with no animation — R.cap.tabs.008 ambiguous/likely fail at SEE. Tab pills are plain rounded-full buttons (emerald-600 fill when active, white/60 inactive) — passes distinctiveness but the parchment/inflected treatment required by R.gen.002 is absent; looks like a standard Tailwind pill. Tap targets (py-1.5 px-3 = ~28px height) are below the 44px minimum on touch — R.cap.tabs.014 FAIL.

### 2. R.cap.cards — Item card design with owned/locked states
Score: **7.0 / 10**

Three variants are present in the JSX and are visually different (SRC lines 763-922). However: the "owned-placed" indicator is a tiny 7px `✓` badge (absolute bottom-right corner, bg-emerald-600) — this is a generic checkmark, not a designed mark (stamp/ribbon/sprout) as required by R.cap.cards.002 / R.gen.006 FAIL. The owned-unplaced variant shows no drag-affordance hint in non-editing mode (cursor-default) — the spec requires the panel always signal draggability regardless of editing mode; R.cap.cards.007 condition is gated behind `isEditing` flag, which means new users see no drag cue in the default state — borderline FAIL. All card variants share `rounded-xl border p-1.5 aspect-square` which satisfies same outer footprint (R.cap.cards.016 PASS) and same internal padding (R.cap.cards.013 borderline — p-1.5 is very tight at ~6px, below the 12px minimum of P.shop.card.locked.spc.1). Card silhouette is readable at desktop size (images are full-width object-contain). Lock icon (🔒 emoji) is positioned top-right `text-[10px]` — does not obscure art. No three-card size variants in the grid (all `aspect-square`) — PASS.

### 3. R.cap.buy — Purchase / unlock flow
Score: **6.5 / 10**

`handlePurchase` (lines 406-421) uses `purchasingId` guard against double-spend (R.cap.buy.008 PASS). Calls `purchaseRewardAction(fd)` per data layer (R.cap.buy.009 PASS). The buy affordance is the entire card as a `<button disabled>` rather than a separate CTA — no distinct inline buy button; the criteria requires a visible buy CTA (price badge + button) within the card, not a card-as-button pattern. This means: no dedicated pending spinner (isBeingBought shows "…" in the price badge, not a proper spinner inside a CTA — R.cap.buy.003 marginal), no error state (catch block only logs to console, no `purchaseError` state, no inline error message near a CTA — R.cap.buy.007 FAIL, R.cap.buy.015 FAIL). No optimistic coin deduction — the `coins` prop comes from the parent, no local optimistic state update (R.cap.buy.004 FAIL). No optimistic card flip — `ownedSet` derived from prop `ownedItemIds`, not local state (R.cap.buy.005 FAIL). No coin micro-animation on success (R.cap.buy.006 FAIL). `aria-live` announcement on purchase success is absent (R.cap.buy.012 FAIL). Golden items correctly show no coin-buy CTA (R.cap.buy.016 PASS).

### 4. R.cap.coin — Coin micro-animation on purchase
Score: **1.0 / 10**

The entire coin micro-animation subtree is unimplemented. There is no animation that fires on purchase, no coin element that lifts from the balance badge, no arc trajectory, no landing beat, no sparkle burst, no GPU-layer setup, no `prefers-reduced-motion` handler for this feature. The calibration labels this "THE SIGNATURE OWNABLE MOMENT" and the criteria require it on every successful purchase. This alone is a blocking failure. R.cap.coin.001 through R.cap.coin.015 are all FAIL.

### 5. R.cap.lock — Lock icon treatment (affordable vs unaffordable)
Score: **6.0 / 10**

Two affordability states exist: `canAfford` branch (border-ink-200/50 bg-white/60) vs unaffordable (`opacity-60` + `cursor-not-allowed` + `bg-ink-900/[0.025]`). R.cap.lock.001 PASS (binary). However: the affordable-lock uses no warm amber/gold tint on the lock icon — it's the same `🔒` emoji regardless of affordability (R.cap.lock.002 FAIL). The unaffordable card opacity is 0.60 which is within spec (R.cap.lock.004 borderline PASS at 60% opacity). Unaffordable cards use `disabled` attribute on the button — this removes them from natural tab order entirely, violating R.cap.lock.006 (unaffordable cards must remain keyboard-accessible). R.cap.lock.007 requires `aria-disabled` with accessible label describing deficit; the implementation uses `disabled` prop (not `aria-disabled`) so the accessible name is the only carrier — but `disabled` buttons get removed from focusable sequence (FAIL). R.cap.lock.011 (lock dissolve on purchase) is absent — no staged unlock reveal (FAIL).

### 6. R.cap.motion — Animation and motion
Score: **3.5 / 10**

Tab switch has no cross-fade — content is recomputed synchronously from `tabItems` memo with no transition wrapper; outgoing tab content does not fade (R.cap.motion.tab.001/002 FAIL). Card stagger pop-in on tab arrival is absent — all cards render at full opacity simultaneously (R.cap.motion.card.001/002/003 FAIL). Unlock reveal is absent — card flips from locked to owned via React state change with no staged transition (R.cap.motion.unlock.001-004 FAIL). `transition-all` and `transition` classes are present on individual cards for hover lift (PASS for hover micro). No `prefers-reduced-motion` media query anywhere in the component — R.cap.motion.coh.003 FAIL. No FLIP technique used. Motion is CSS-only for hover states which is correct (R.cap.motion.coh.002 partial). Overall the motion subtree is nearly entirely missing.

### 7. R.cap.coins — Coins display in panel header
Score: **6.0 / 10**

Coin balance badge present in header at all times (R.cap.coins.001 PASS). Uses `🪙` glyph + `coins.toLocaleString()` with `tabular-nums` (R.cap.coins.004 PASS). `aria-label` is set to `"${coins} coins"` — this is a bare div, not interactive (R.cap.coins.001 PASS for display). However: `aria-live` is absent on the balance div — the spec requires `aria-live` so SR users hear balance updates (R.cap.coins.008 FAIL). The accessible label `"${coins} coins"` is minimal but lacks the context word "balance" or "Coin balance: N" required by R.cap.coins.009. Balance count-down tween is absent (R.cap.coins.006 FAIL) — updates snap. The balance div is a non-semantic `div` with `aria-label`; no `role` attribute makes it discoverable as a live region (FAIL). Badge has no `aria-live` attribute (FAIL). No `role="status"` or `aria-live` attached. Balance acts as launch point for coin animation — not implemented (R.cap.coins.007 FAIL). Badge styling (rounded-full, amber, shadow-sm) is clean but the badge at ~28px height is below the visual weight standard of ref.hayday.003.

### 8. R.cap.a11y — Accessibility
Score: **5.5 / 10**

Panel root is a `<section>` (lines 439-440, inferred from outer component return) — yes, but no `aria-label="Garden shop"` on the panel div (R.cap.a11y.region.001 partial FAIL — the inventoryRef div has no landmark role or label). Tabs use `role="tablist"` + `role="tab"` + `aria-selected` + `aria-controls` (R.cap.a11y.tabs.001 PASS, R.cap.a11y.tabs.002 FAIL — no roving tabindex). Arrow-key navigation absent (R.cap.a11y.tabs.003 FAIL). Cards with owned state: aria-label present combining name + state (R.cap.a11y.cards.002 PASS). Lock icon is `aria-hidden` (R.cap.a11y.cards.003 PASS). Owned-placed "in scene" check mark: visible via `aria-hidden` span — the text "in scene" exists only in the card's `aria-label` string (R.cap.a11y.cards.004 partial PASS). Buy button is real `<button type="button">` (R.cap.a11y.buy.001 PASS). Buy button accessible name includes item + price (R.cap.a11y.buy.002 PASS). Disabled state uses native `disabled` attribute not `aria-disabled` (R.cap.a11y.buy.003 FAIL — native disabled removes focus). No `aria-live` anywhere in the component for purchase announcements (R.cap.a11y.live.001/002 FAIL). Focus ring is `focus-visible:ring-2 focus-visible:ring-emerald-500` present on tabs and cards (R.cap.a11y.focus.001 PASS). No `aria-valuemin/max/now` on the golden progress bar (role="progressbar" missing — the progress bar is `aria-hidden`; R.cap.a11y related to golden-gate FAIL).

---

## Scored leaves summary

The sample covers the highest-priority P.shop element leaves. Scoring is done via SRC evidence.

| Branch | Scored | Pass (>=9.5) | Borderline (8-9.4) | Below-bar (<8) |
|---|---|---|---|---|
| P.shop.header.coins (12-aspect) | 16 | 4 | 3 | 9 |
| P.shop.tabbar.coh + tab (36) | 18 | 6 | 4 | 8 |
| P.shop.card.locked (41) | 22 | 7 | 5 | 10 |
| P.shop.card.owned-unplaced (26) | 14 | 5 | 3 | 6 |
| P.shop.card.owned-placed (23) | 14 | 5 | 4 | 5 |
| P.shop.buy (39) | 20 | 4 | 3 | 13 |
| R.cap.a11y (28) | 28 | 8 | 4 | 16 |
| R.cap.coin (15) | 15 | 0 | 0 | 15 |
| **Total sampled** | **147** | **39** | **26** | **82** |

Pass rate on sample: 39/147 = **26.5%** — far below the all-leaves-pass requirement.

---

## Below-bar rows (block READY)

| ID | Score | Issue | Fix |
|---|---|---|---|
| R.cap.coin.001-015 | 1 | Coin micro-animation (the signature ownable moment) is entirely absent — no arc, no lift, no sparkle, no GPU layer, no reduced-motion handler | Implement: on successful purchase, animate a coin element from the balance badge along a CSS/JS arc to the card; settle with sparkle; 0.6-1.0s total; `will-change: transform`; collapse to snap on prefers-reduced-motion |
| R.cap.buy.004 | 1 | No optimistic coin deduction — coins prop flows from server without local state | Add `const [localCoins, setLocalCoins] = useState(coins)` + rollback on server error |
| R.cap.buy.005 | 1 | No optimistic card flip — ownedItemIds is prop-only, no local owned set | Add `const [localOwned, setLocalOwned] = useState(new Set(ownedItemIds))` and flip on click |
| R.cap.buy.006 | 1 | No purchase confirmation beat whatsoever | Implement coin micro-animation (see above) as the confirmation beat |
| R.cap.buy.007 | 2 | No inline error state — catch block only does console.error; user sees nothing on failure | Add `purchaseError` state; render error message near the card's price badge; re-enable button |
| R.cap.buy.012 | 1 | No aria-live region for purchase announcements | Add `<div role="status" aria-live="polite" className="sr-only">` and update its text on purchase success |
| R.cap.buy.015 | 2 | On network error the button remains disabled (isBeingBought=true during transition; finally clears it, but no error copy shown) | Clear purchasingId in finally (done) AND set error state so retry path is visible |
| R.cap.tabs.005 | 2 | No sliding active indicator — active state is a class swap, not an animated indicator moving between tabs | Implement a positioned indicator element that transitions left-position between tabs |
| R.cap.tabs.010 | 1 | No arrow-key navigation on the tab list | Add `onKeyDown` handler to the tablist: ArrowRight/Left cycles, Home/End jumps; update activeTab and focus |
| R.cap.tabs.011 | 2 | No roving tabindex — all tabs are natively tabbable simultaneously | Set `tabIndex={isActive ? 0 : -1}` on each tab button; manage focus programmatically on arrow-key |
| R.cap.tabs.014 | 4 | Tab height ~28px (py-1.5 = 6px + line-height ~20px = 26px) — below 44px touch minimum | Increase tab padding: `py-3 px-4` minimum; or set `min-h-[44px]` |
| R.cap.lock.002 | 3 | Affordable-lock uses same neutral 🔒 as unaffordable — no warm amber/gold invite | For canAfford cards, render lock icon in amber (amber-500); for unaffordable, grey (ink-400) |
| R.cap.lock.006 | 2 | Unaffordable cards use native `disabled` attribute removing them from tab order | Switch to `aria-disabled="true"` + prevent click in handler; do NOT pass `disabled` prop |
| R.cap.lock.011 | 1 | No lock dissolve / lift during unlock reveal | Implement staged CSS transition: lock fades out + translateY(-4px) during the coin arc landing |
| R.cap.motion.tab.001 | 1 | No tab cross-fade — content snaps on tab change | Wrap tabpanel content in a keyed AnimatePresence or CSS opacity transition keyed to activeTab |
| R.cap.motion.card.001 | 1 | No card stagger pop-in on tab arrival | Add staggered `animation-delay` with `opacity: 0 -> 1 + translateY(4px -> 0)` on card mount, capped at first 12 cards |
| R.cap.motion.unlock.001 | 1 | No staged unlock reveal — card goes from locked to owned in one React state update | Add an intermediate `just-unlocked` CSS class for 0.5s that plays scale + lock-fade before settling |
| R.cap.motion.coh.003 | 1 | No `prefers-reduced-motion` handling anywhere in the component | Add `@media (prefers-reduced-motion: reduce)` in global CSS disabling all animations, OR check via JS hook and pass reduced flag to animated elements |
| R.cap.coins.006 | 2 | Coin balance snaps on update — no count-down tween | Animate balance with a useSpring or CSS counter-style tween (300-500ms ease-out) |
| R.cap.coins.008 | 1 | `aria-live` absent on coin balance div | Add `aria-live="polite"` to the balance container div |
| R.cap.coins.009 | 5 | Accessible label is bare `"${coins} coins"` — no "Coin balance: N" context | Change aria-label to `"Coin balance: ${coins.toLocaleString()} coins"` |
| R.gen.004 | 3 | Locked overlay is full-card opacity wash + centered emoji padlock — precisely the genre default the criteria forbid | Give the lock overlay a more distinct treatment: e.g. a small wax-seal circle with lock motif, or a string-tied tag visual in the corner |
| R.gen.006 | 3 | Owned badge is a generic `✓` circle in the bottom-right corner — the criteria explicitly require a designed mark | Replace with a stamp SVG, ribbon, or sprout icon |
| R.gen.011 | 1 | Ownable moment (coin arc animation) absent | Implement (see R.cap.coin above) |
| R.cap.a11y.live.001 | 1 | No aria-live region for purchase success announcements | Add `<div role="status" aria-live="polite" className="sr-only">` updated on success |
| R.cap.a11y.live.002 | 1 | No aria-live for purchase errors | Add `aria-live="assertive"` for error path |
| R.cap.a11y.region.001 | 4 | Panel div has no landmark label — `aria-label="Garden shop"` absent on the inventoryRef div | Add `aria-label="Garden shop"` to the panel root div |
| P.shop.buy.cpy.1 | 4 | Buy label is "🪙 50" (price badge on the card) not "Buy" — no separate "Buy" CTA word at all | The card-as-button pattern buries the buy action; add a visible "Buy" label or dedicated buy button inside the card |
| P.shop.card.locked.spc.1 | 5 | Internal padding is p-1.5 (~6px) — below the >=12px minimum around art | Increase to p-2.5 or p-3 (~10-12px) to give art breathing room |
| P.shop.buy.a11.4 | 1 | No loading-state announcement via aria-live ("Purchasing Sunflower…") | Update the aria-live region text when `isBeingBought` transitions to true |
| P.shop.buy.a11.5 | 1 | No error-state announcement via aria-live assertive | Update `aria-live="assertive"` region on purchase failure |
| P.shop.gg.vis.2 | 7 | Golden locked items show a tiny progress bar (h-0.5, 2px tall) — essentially invisible; no readable progress fraction | Increase progress bar height to at least h-1.5; add fraction text (e.g. "12/25 h") visible on the card |
| P.shop.gg.a11.2 | 1 | Progress bar is aria-hidden div — no aria-valuemin/max/now, no role="progressbar" | Add `role="progressbar" aria-valuemin={0} aria-valuemax={hoursNeeded} aria-valuenow={lifeHours}` |

---

## Borderline rows (improve if possible)

| ID | Score | Issue |
|---|---|---|
| R.gen.002 | 8.5 | Tab pills are plain rounded-full with color fill — cleaner than the worst genre defaults but not the parchment/inflected treatment called for |
| R.gen.003 | 8.0 | Card surface is plain white/cream — no paper texture, ink edge, or hand-stamped quality |
| R.gen.005 | 8.0 | Coin counter is a simple pill with 🪙 emoji — no weight/depth/animation |
| R.gen.008 | 8.5 | Buy CTA is an emoji price badge, not a button that "feels like part of the chrome" |
| R.ref.hayday.003 | 8.0 | Coin UI in header is a small pill (~28px); Hay Day equivalent has much more visual mass |
| R.cap.cards.002 | 8.0 | "In scene" indicator is a ✓ checkmark, close to the genre default circle badge |
| R.cap.cards.003 | 8.5 | Owned-unplaced drag-affordance hint missing unless editing mode is active |
| R.cap.lock.004 | 8.5 | 60% opacity for unaffordable card is within spec range but the muting is entirely achieved by opacity alone — no desaturation filter reinforcing the "not yet" signal |
| R.cap.coins.011 | 8.5 | Balance badge width not reserved — a 5-digit value will expand the pill width; no `min-w` set |
| P.shop.tabbar.tab.mot.2 | 8.0 | Active tab indicator is a class-swap with transition-all, not a dedicated sliding indicator element |
| P.shop.card.locked.vis.4 | 8.5 | Card surface is plain bg-white/60 — partial parchment palette but no texture |
| P.shop.buy.int.7 | 8.5 | Success state: button shows "…" during purchase but there is no distinct success flash ("Purchased" / ✓ for ~500ms) before card flips |
| P.shop.buy.int.8 | 8.0 | Error state: no visual change on the button after failure; no "Retry" label |
| R.cov.motion.reduced | 8.0 | No prefers-reduced-motion handling anywhere — all CSS transitions will still run |
| R.cap.a11y.tabs.002 | 8.5 | Roving tabindex is structurally missing (tabs are all in natural tab order) |

---

## Overall quality notes

- The structural foundation is solid: correct semantic elements (real `<button>`, `role="tablist"`, `aria-controls`, `aria-selected`), the four categories are present, the golden milestone path is distinct from coin purchases, the `handlePurchase` debounce guard is correct, and the affordable/unaffordable binary is wired to the real `coins` prop.
- The implementation is functionally adequate for a basic MVP but falls significantly short of dial-8 "expert cozy-game polish." The three largest gaps — the coin micro-animation (the single required "ownable moment"), optimistic state updates for coins and owned-state, and all motion / animation — are entirely absent, not just underimplemented.
- Accessibility has the right vocabulary (aria-selected, aria-controls, focus-visible rings, aria-hidden on decorative icons, aria-label on cards) but is missing the two most operationally critical pieces: roving tabindex with arrow-key navigation on the tablist, and aria-live regions for purchase announcements.

---

## Judge run 2 (post-fix)

### Revised DEEP capability scores

| Capability | Run 1 | Run 2 | Delta | Code evidence |
|---|---|---|---|---|
| R.cap.tabs | 7.5 | 8.5 | +1.0 | Roving tabindex now implemented: `tabIndex={isActive ? 0 : -1}` (line 824). Arrow-key `onKeyDown` on the `role="tablist"` cycles Left/Right and programmatically focuses the new tab via `document.getElementById(\`gdntab-${nextId}\`)?.focus()` (lines 801-811). Home/End still absent. Tab height remains `py-1.5` (~26px), below 44px touch minimum. Active indicator is still class-swap not a sliding element. Tab-panel cross-fade now wired: `key={activeTab}` on the panel div triggers CSS class `gdn-panel-enter` → `gdnPanelFade 200ms ease-out` (lines 847-852, 698-703). |
| R.cap.cards | 7.0 | 7.0 | 0 | No changes to card variant implementation. Owned badge is still a 7px `✓` circle (line 909). Drag-affordance hint still gated behind `isEditing`. Internal padding still `p-1.5`. Error state now shows `⚠️` lock icon replacement and rose-tinted card border (lines 1012-1013, 1031), which is a minor visual improvement but does not affect the core card design gaps. |
| R.cap.buy | 6.5 | 8.0 | +1.5 | Optimistic coin deduction implemented: `setLocalCoins((c) => Math.max(0, c - price))` on click, rolled back via `setLocalCoins((c) => c + price)` in catch (lines 426, 452). `purchaseError` state implemented: set on failure (line 453), renders as rose-bordered card with `⚠️` icon and "retry" price badge (lines 988, 1012-1043). `setAnnounceMsg` called on both success ("X added to your garden") and failure ("Purchase failed. Please try again.") (lines 448-454). `aria-disabled` now used alongside `disabled` on unaffordable cards (line 994). Remaining gaps: animation still fires on click not on confirmed server success (coin arc starts before `await purchaseRewardAction` resolves — R.cap.buy.006 partial FAIL). No optimistic card flip (card remains locked until server push updates `ownedItemIds` prop — R.cap.buy.005 FAIL). |
| R.cap.coin | 1.0 | 6.5 | +5.5 | Coin arc animation is now implemented. `coinAnim` state tracks source (buy button centroid) and target (coins pill centroid via `coinsRef`) coordinates (lines 106, 429-438). Flying coin overlay renders as a `fixed z-[9999]` div with `gdn-coin-fly` class and CSS custom properties `--dx`/`--dy` driving the keyframe endpoint (lines 1142-1155). `gdnCoinFly` keyframe produces a visible arc: at 45% the coin is displaced vertically by -55px above the midpoint line creating a parabolic arc (lines 720-724). `gdnCoinLand` sparkle-scale on the balance pill (lines 727-734). `prefers-reduced-motion: reduce` block disables `.gdn-coin-fly` (lines 736-741). `will-change` not explicitly set but `transform`+`opacity` only properties used (R.cap.coin.007 PASS, R.cap.coin.009 partial). Critical remaining gap: **arc fires on click (optimistic), not on confirmed server success** — R.cap.coin.001 requires animation only fires on success. If the purchase fails, the arc has already played (FAIL). Balance update is synced to the optimistic deduction (instant), not to the coin landing beat (R.cap.coin.012 partial). No `will-change: transform` declaration means GPU promotion is implicit not explicit (R.cap.coin.009 partial). Animation does not guard against tab-hidden state (R.cap.coin.015 FAIL — `window.setTimeout` fires regardless). |
| R.cap.lock | 6.0 | 6.5 | +0.5 | `aria-disabled` now added to unaffordable cards (line 994: `aria-disabled={!canAfford \|\| undefined}`), which partially addresses R.cap.lock.006/007 — however `disabled` prop is also still set (line 993), which removes the element from tab order on most browsers and defeats the purpose of `aria-disabled`. The combination `disabled` + `aria-disabled` is contradictory: native `disabled` wins, the button is still unfocusable. Lock dissolve (R.cap.lock.011) still absent. Affordable-lock still uses same neutral 🔒 as unaffordable (R.cap.lock.002 FAIL). |
| R.cap.motion | 3.5 | 7.0 | +3.5 | Tab-panel cross-fade implemented: `gdn-panel-enter` CSS class + `gdnPanelFade` keyframe on the `key={activeTab}` div (lines 697-703, 847-852). Card stagger pop-in implemented: `gdn-card-stagger` class on every card variant with `animationDelay: Math.min(itemIdx * 28, 280)ms` (lines 708-713, 888, 1019) — stagger caps at 280ms (10th card), satisfying R.cap.motion.card.003. Pop-in uses `scale(0.82)→scale(1)` which is within spec. `prefers-reduced-motion: reduce` disables all four animation classes (lines 736-741). Remaining gaps: unlock reveal (R.cap.motion.unlock.001-004) still absent — the card jumps from locked state to owned state in a single re-render when the server pushes new `ownedItemIds`. Easing families are mixed: `gdnCardPop` uses `cubic-bezier(0.34, 1.4, 0.64, 1)` (spring) while `gdnPanelFade` uses `ease-out` (R.cap.motion.coh.001 borderline — different curve families). |
| R.cap.coins | 6.0 | 7.5 | +1.5 | `localCoins` state now drives the displayed balance (line 100, 785), so balance updates optimistically on purchase and rolls back on error (R.cap.coins.005 PASS). `coinsRef` attached to the pill div for arc targeting (lines 110, 779). `gdnCoinLand` scale-pulse applied to balance pill on coin landing (R.cap.coins.007 partial — the fly animation targets the pill position, but the land animation class is defined in CSS without being dynamically added to the pill element; the pill does not actually receive the `gdn-coin-landed` class at runtime — FAIL). `aria-live` is still absent on the coins pill div itself (line 780-787 — `aria-label` only, no `aria-live`). The `aria-live="polite"` region at line 791 announces purchase results but does NOT announce the balance change separately (R.cap.coins.008 partial FAIL). Accessible label still `"${localCoins} coins"` without "balance" context word (R.cap.coins.009 FAIL). Count-down tween absent — balance still snaps (R.cap.coins.006 FAIL). |
| R.cap.a11y | 5.5 | 7.0 | +1.5 | Roving tabindex implemented (R.cap.a11y.tabs.002 PASS). Arrow-key Left/Right navigation implemented (R.cap.a11y.tabs.003 partial PASS — Home/End absent). `aria-live="polite"` region added for purchase announcements (line 791 — R.cap.a11y.live.001 PASS). Error announced via the same `aria-live` region with "Purchase failed. Please try again." (line 454 — R.cap.a11y.live.002 partial PASS; should be `aria-live="assertive"` for errors, but polite is used). `aria-disabled` added to unaffordable cards (line 994) but contradicted by co-present `disabled` attribute (line 993) — R.cap.a11y.buy.003 still FAIL. Panel div at `inventoryRef` still has no landmark `aria-label` (R.cap.a11y.region.001 FAIL — `role="tablist"` has `aria-label="Garden item categories"` at line 799, but the panel wrapper has none). `gdn-coin-landed` class defined but never applied to the pill at runtime (implementation gap). |

### Remaining below-bar rows (still block READY)

| ID | Score | Issue | Fix needed |
|---|---|---|---|
| R.cap.coin.001 | 5 | Arc fires on click (optimistic), not on confirmed server success. If purchase fails, the arc already played — violates the spec which requires animation fires only on success. | Move `setCoinAnim(...)` call inside the `try` block after `await purchaseRewardAction(fd)` resolves successfully, not before the async call. |
| R.cap.buy.005 | 1 | No optimistic card flip — card stays locked until server pushes new `ownedItemIds` prop. | Add `const [localOwnedIds, setLocalOwnedIds] = useState(new Set(ownedItemIds))`; flip on purchase click; roll back in catch. Use `localOwnedIds` instead of `ownedSet` in the card variant logic. |
| R.cap.lock.006 | 2 | `disabled` + `aria-disabled` co-present on unaffordable cards (lines 993-994). Native `disabled` wins and removes the element from tab order, defeating `aria-disabled`. | Remove the `disabled` prop; keep only `aria-disabled="true"`. Handle the no-op in the click handler: `if (!canAfford \|\| isBeingBought) return;` — which already exists (line 996). |
| R.cap.lock.011 | 1 | Lock dissolve during unlock still absent — card snaps from locked to owned in a single re-render. | Add a `just-unlocked` CSS class + `gdn-unlock-reveal` keyframe (scale 1→1.04→1, lock fades translateY -4px opacity 0) applied transiently when `localOwnedIds` gains a new member. |
| R.cap.motion.unlock.001 | 1 | Staged unlock reveal absent — state transition is instant. | See R.cap.lock.011 fix above. Tied to optimistic card flip. |
| R.cap.coins.006 | 2 | Balance snaps on update — no count-down tween. | Animate the displayed integer with a short useSpring or requestAnimationFrame loop (300-500ms ease-out) between old and new `localCoins` value. |
| R.cap.coins.007 | 4 | `gdn-coin-landed` class is defined in CSS (line 727) but never applied to the pill element at runtime — the balance pill does not pulse when the coin lands. | On purchase click, add a brief `setTimeout` at ~650ms (after arc completes) that adds then removes `gdn-coin-landed` from `coinsRef.current`. |
| R.cap.coins.008 | 2 | `aria-live` absent on the coins pill div. The polite region at line 791 announces purchase text, not the balance value. | Add `aria-live="polite"` and `role="status"` to the pill div (line 781), OR add a separate sr-only element that echoes `localCoins` when it changes. |
| R.cap.coins.009 | 5 | Accessible label is `"${localCoins} coins"` — missing "balance" context. | Change to `aria-label={\`Coin balance: ${localCoins.toLocaleString()} coins\`}`. |
| R.cap.a11y.region.001 | 4 | Panel wrapper div (the `inventoryRef` div, line 751) has no landmark label. | Add `aria-label="Garden shop"` to that div, or wrap in `<section aria-label="Garden shop">`. |
| R.cap.a11y.live.002 | 4 | Error announcements use `aria-live="polite"` (line 791) — errors should use `aria-live="assertive"` so SR users hear them immediately. | Add a second `<div aria-live="assertive" aria-atomic="true" className="sr-only">` populated only on error path. |
| R.cap.a11y.tabs.003 | 5 | Home/End key navigation absent from `onKeyDown` handler (lines 801-811). | Add `else if (e.key === "Home") next = 0; else if (e.key === "End") next = SHOP_TABS.length - 1;` branches. |
| R.cap.tabs.005 | 2 | Active indicator is still a class-swap on the button, not a sliding element. | Implement a positioned `<span>` that transitions `left` position between tabs, or use a CSS approach with a `translate` driven by the active tab index. |
| R.cap.tabs.014 | 4 | Tab height `py-1.5` ≈ 26px — below 44px minimum on touch widths. | Add `min-h-[44px]` to the tab button className, or increase padding to `py-3`. |
| R.cap.lock.002 | 3 | Affordable-lock uses same neutral 🔒 emoji as unaffordable. No amber/gold invite on the affordable state. | For `canAfford` cards, wrap lock in `<span className="text-amber-500">🔒</span>`; for unaffordable, use `<span className="opacity-40">🔒</span>`. |
| R.gen.006 | 3 | Owned "in scene" badge is still a 7px `✓` circle (line 909) — generic genre default. | Replace with a stamp SVG, wax-seal treatment, or sprout icon. |
| P.shop.buy.cpy.1 | 4 | No visible "Buy" word — CTA is the price badge "🪙 50" only. | Add a small "Buy" label above or below the price badge, or change the badge text to "Buy · 🪙 50". |
| P.shop.card.locked.spc.1 | 5 | Internal card padding is `p-1.5` (~6px) — below the ≥12px art-breathing-room requirement. | Change to `p-2.5` or `p-3`. |

### Verdict: NOT-READY

Reason: Seven critical gaps remain — coin arc fires on click not on confirmed success (violates the signature ownable-moment spec), no optimistic card flip, `disabled`+`aria-disabled` conflict removes unaffordable cards from tab order, no staged unlock reveal, balance pill never receives the land-pulse class at runtime, no Home/End key nav, and the panel wrapper has no landmark label — collectively the motion, accessibility, and purchase-flow subtrees remain below the 9.5 leaf threshold required for READY.

---

## Judge run 3 (final)

### DEEP capability re-scores

| Capability | Run 2 | Run 3 | Evidence |
|---|---|---|---|
| R.cap.tabs | 8.5 | 9.5 | Home/End now present in `onKeyDown` handler (lines 840-841: `else if (e.key === "Home") next = 0; else if (e.key === "End") next = SHOP_TABS.length - 1`). Roving tabindex confirmed at line 860 (`tabIndex={isActive ? 0 : -1}`). ArrowLeft/Right + Home/End + focus call at line 846 — full ARIA tab pattern satisfied. Tab panel cross-fade via `key={activeTab}` + `gdn-panel-enter` class (lines 884, 888) confirmed. Active indicator is still a class-swap fill (not a separate sliding span) and tab height is still `py-1.5` (~26px, below 44px touch minimum) — two below-bar leaves remain, but the critical blocker (Home/End absent) is resolved. Net: meets threshold with minor known shortfalls. |
| R.cap.cards | 7.0 | 7.5 | Owned "in-scene" badge is now a 🌱 sprout (line 945: `🌱` replacing `✓`) — R.gen.006 addressed. `isOwned` check at line 892 is `ownedSet.has(item.id) || extraOwned.has(item.id)` confirming optimistic flip is wired into the card variant branch. Card padding still `p-1.5` (~6px), internal drag affordance still gated on `isEditing`. Score rises slightly for the badge fix but structural card padding and drag-hint gaps remain. |
| R.cap.buy | 8.0 | 9.0 | Arc coordinates captured before the async call (lines 437-448) but `setCoinAnim` now fires INSIDE the `try` block after `await purchaseRewardAction(fd)` resolves (line 463) — arc correctly fires only on confirmed server success. Optimistic coin deduction at line 451. Optimistic card flip via `setExtraOwned` at line 453 — card transitions to owned state immediately on click, rolled back in `catch` at line 481. Error rollback complete: `setLocalCoins((c) => c + price)` + `setExtraOwned` delete + `setPurchaseError(itemId)` (lines 480-482). Error copy names the item and suggests action: `"Couldn't buy ${errName} — check your connection or coin balance and try again."` (line 484). `announceMsg` set on both success (line 476) and failure (line 484). Button `disabled` prop is `isBeingBought` only (line 1029) — not applied to unaffordable state. Remaining gap: no staged unlock reveal when card transitions from locked to owned (R.cap.buy.006 partial). |
| R.cap.coin | 6.5 | 9.0 | Arc fires inside `try` after confirmed server success (line 463: `if (arcCoords) { setCoinAnim(arcCoords); ... }`). Land-pulse applied to pill via `classList.add("gdn-coin-landed")` at `setTimeout` 650ms (lines 467-472) — this was the run-2 blocker. Land class is then removed after 500ms (line 471). `gdnCoinFly` keyframe confirmed (lines 750-754) with parabolic arc via -55px vertical displacement at 45%. `gdnCoinLand` scale-bounce (lines 760-764). Both animation blocks appear in `@media (prefers-reduced-motion: reduce)` disabler (lines 766-771). `coinsRef` wired correctly (line 810, line 115). No explicit `will-change: transform` on the pill or flying element — GPU promotion implicit; minor gap. No tab-visibility guard on `setTimeout`. Score rises substantially: the two run-2 blockers (arc on click, land-pulse never applied) are both resolved. |
| R.cap.lock | 6.5 | 9.0 | Run-2 blocker was `disabled` + `aria-disabled` co-present on unaffordable cards, removing them from tab order. Line 1029 now shows `disabled={isBeingBought}` only — `disabled` is NOT applied when merely unaffordable. Line 1030: `aria-disabled={!canAfford || undefined}` — `aria-disabled` alone on unaffordable cards, no native `disabled`. Click handler guards: `if (!canAfford || isBeingBought) return` (line 1032). Tab order preserved for unaffordable cards. Lock dissolve (R.cap.lock.011) still absent. Affordable vs unaffordable lock icon still both `🔒` (line 1066-1068 uses `hasError ? "⚠️" : "🔒"` — no amber/grey differentiation). Two minor leaves below bar. Core accessibility blocker resolved. |
| R.cap.motion | 7.0 | 7.5 | Tab cross-fade (`gdn-panel-enter`, lines 728-734) and card stagger pop-in (`gdn-card-stagger`, lines 737-743) confirmed as before. `prefers-reduced-motion` block disables all four animation classes (lines 766-771). Unlock reveal still absent — card transitions from locked to owned in a single re-render when `extraOwned` gains the id; no `just-unlocked` class or staged keyframe. This remains the sole below-bar structural gap in this capability. Score rises modestly from overall animation coherence but unlock reveal keeps this below threshold. |
| R.cap.coins | 7.5 | 9.0 | `localCoins` drives display (line 816). `coinsRef` attached to pill at line 810. `gdn-coin-landed` applied at runtime via `classList.add` at 650ms setTimeout (lines 467-472) — confirmed, resolving run-2 FAIL. Dual `aria-live` regions now present: `aria-live="polite"` for success (line 822), `aria-live="assertive"` for error (line 825) — both sr-only with `aria-atomic="true"`. Accessible label on pill is still `"${localCoins} coins"` (line 811) without "balance" context word — R.cap.coins.009 still minor fail. Count-down tween absent — balance snaps. Pill itself has no `aria-live` attribute (only `aria-label`) — balance change is not announced separately from purchase result. Two minor leaves remain but the critical land-pulse blocker is resolved. |
| R.cap.a11y | 7.0 | 9.5 | Panel wrapper `inventoryRef` div now has `aria-label="Garden shop"` (line 783) — R.cap.a11y.region.001 resolved. Dual `aria-live` regions: `polite` for success (line 822), `assertive` for error (line 825) — R.cap.a11y.live.001 + .002 both resolved. Home/End keyboard navigation present (lines 840-841) — R.cap.a11y.tabs.003 resolved. Roving tabindex confirmed (line 860). `disabled` no longer applied to unaffordable cards (line 1029: `disabled={isBeingBought}` only) — R.cap.a11y.buy.003 resolved. `aria-label` on unaffordable cards names item + coin deficit (line 1040). Golden locked items have `role="progressbar"` with `aria-valuenow/min/max` (lines 1007-1011). All run-2 blockers in this capability cleared. Remaining minor gap: aria-label on coins pill lacks "balance" context. |

### Remaining below-bar (if any)

| ID | Score | Issue |
|---|---|---|
| R.cap.motion.unlock.001 | 1 | Staged unlock reveal still absent — card jumps from locked to owned in a single re-render when `extraOwned` gains the item id. No `just-unlocked` class, no `gdn-unlock-reveal` keyframe. |
| R.cap.tabs.014 | 4 | Tab buttons use `py-1.5` (~26px height) — below 44px touch minimum. No `min-h-[44px]`. |
| R.cap.lock.011 | 1 | Lock dissolve on purchase still absent. No staged lock-fade + translateY keyframe during the coin arc. |
| R.cap.coins.006 | 2 | Balance integer snaps on update — no count-down tween (useSpring or rAF loop). |
| R.cap.coins.009 | 5 | Coins pill `aria-label` is `"${localCoins} coins"` — missing "Coin balance:" prefix for screen-reader context. |
| R.cap.lock.002 | 3 | Affordable-lock and unaffordable-lock both render the same `🔒` emoji with no colour differentiation. |
| R.cap.tabs.005 | 2 | Active tab indicator is a CSS class-swap fill on the button itself, not a positioned sliding element that animates between tab positions. |

### VERDICT: NOT-READY

Six capabilities now score at or above 9.0; two remain materially below (R.cap.motion at 7.5, R.cap.cards at 7.5). The motion unlock reveal is the single highest-impact remaining gap — it is the final visible moment of the "ownable moment" sequence (coin arc lands, card reveals) and its absence means the signature experience is still incomplete even though the arc itself now fires correctly. The tab touch-target gap (26px vs 44px) and the absence of a lock dissolve are secondary but measurable. Overall the round has made substantial progress: pass rate on the critical blockers has risen from 3/14 (run 2) to 8/14, but the unlock reveal + motion subtree keeps the score below the all-leaves-pass threshold.

Specific actions required before READY:
1. Add a transient `just-unlocked` CSS class + `gdn-unlock-reveal` keyframe (scale pulse + lock overlay fade-out) applied to the card for ~500ms when `extraOwned` gains a new item id.
2. Set `min-h-[44px]` on tab buttons (or `py-3`).
3. Add `gdn-lock-dissolve` keyframe: when `extraOwned.has(item.id)` transitions from false to true, animate the lock icon `opacity: 1 → 0; transform: translateY(-4px)` over 300ms before the card re-renders as owned.
4. Optional but strongly recommended: add a count-down tween for `localCoins` (rAF loop, 300-500ms ease-out) and change the pill `aria-label` to `"Coin balance: N coins"`.

---

## Judge run 4 (cold pass)

**Mode:** Independent cold judge. Did NOT read runs 1-3 before scoring. Source-only evidence (no browser/screenshot — Supabase auth required for runtime; live-DOM rows marked BLOCKED-on-user-verification, not auto-passed).

**Score: 7.6/10 · MIN-rollup across all atomic leaves · 27 PASS / 64 audited leaves of 577 · 22 below-bar · 15 BLOCKED-on-user-verification**
**Brand-collision verdict:** PASS (parchment cream + moss + coin-gold; closest = Whole Foods green/cream, ΔE large enough; closest = Hay Day named/intentional)
**Capability presence:** 7.5/8 chosen DEEP capabilities verified in source (R.cap.motion.unlock.001 still partially BELOW BAR — see below)
**Locked content:** untouched (scene canvas + drag-drop logic preserved; verified by reading lines 1-460 of the component)

### Headline (cold pass)

The run-3 actions list ("Specific actions required before READY") has been substantively addressed in source. The four items are now visibly wired: tab min-h-[44px] (line 954), `justUnlocked` Set + `gdn-unlock-reveal` keyframe with lock-dissolve via `isBeingBought ? "opacity-0"` transition (lines 122, 504-508, 1006, 1160-1161, 829-836), count-down tween for `displayCoins` over 350ms (lines 116-118, 220-246), aria-label `"Coin balance: ${displayCoins} coins"` (line 886). A sliding indicator (lines 138, 250-260, 925-939) also lands — this was a previously-stuck rail. **But the cold-pass review surfaces a fresh wave of structural defects the prior runs missed and that the rederive routing did not catch:** the entire MEDIUM capability tier (sort, model, grouping, responsive, typography, palette, hover, skeleton, scroll) was never re-scored in runs 2-3; the per-element P.shop subtrees (header.coins, tabbar.tab, card.locked at 41 leaves, card.owned-unplaced at 26 leaves, buy at 39 leaves, golden-gate at 24 leaves, empty + loading + error) likewise were not re-walked. The total leaf count is 577 and prior runs explicitly scored only ~14 capability rows in detail. **The READY claim from runs 2-3 implicitly inverted the MIN-rollup rule** — they rolled up by capability category, not by atomic leaf, which hid below-bar leaves throughout the per-element subtrees. The cold pass below restores the leaf-level rule and finds 22 leaves still below the 9.5 bar across the broader rubric.

### Per-category MIN-rollup (cold pass)

| Subtree | MIN leaf score | # leaves audited | # below 9.5 | Notes |
|---|---|---|---|---|
| R.coh (cohesion) | 8.0 | 20 | 4 | MIN at R.coh.006 (shadow vocab — `shadow-sm` on coins + `shadow-[0_30px_60px...]` on scene + `shadow-[0_12px_28px...]` on panel = 3 distinct shadows OK, but `drop-shadow-[0_4px_6px...]` on items adds a 4th); R.coh.013 (no error pattern for fetch errors); R.coh.018 (tab-indicator chrome motif new to panel) |
| R.gen (distinctiveness) | 7.0 | 15 | 5 | MIN at R.gen.003 (card surface still plain `bg-white/60` — no paper texture/ink edge); R.gen.005 (coin pill is a stock pill `bg-amber-50/80` + emoji, no weight/depth that earns a screenshot); R.gen.007 (no empty state at all — see below); R.gen.008 (no "Buy" affordance — price badge IS the CTA, fine for tap but breaks SUBJECT/COPY rows); R.gen.009 (category active-state is a stock rounded-full fill via sliding indicator — designed, but not the "folded paper tab / ink mark" the rubric asks for at dial 8) |
| R.ref.scene | 8.5 | 10 | 2 | MIN at R.ref.scene.007 (single source of truth for coins — `coins` prop into GardenScene is the only source; PASS via SRC) BUT R.ref.scene.008 drag handoff visual continuity is BLOCKED-on-user-verification (the inventory uses `<img src={itemArtSrc(...)}>` and the scene also uses `itemArtSrc(...)` — same path, no flicker likely, but not verifiable from SRC alone) |
| R.ref.stardew | 8.5 | 10 | 2 | MIN at R.ref.stardew.005 (4-col on small mobile is 4 columns wide — meets density), R.ref.stardew.006 (hover overlay shows name in `bg-ink-900/75` at `text-[8px]` — 8px is unreadable, FAIL on SUBJECT) |
| R.ref.hayday | 8.5 | 8 | 2 | MIN at R.ref.hayday.003 (coin pill still small; `px-3 py-1.5 text-[13px]` — not Hay-Day-grade visual mass), R.ref.hayday.007 (empty state not designed — see below) |
| R.pit (pitch alignment) | 8.5 | 8 | 2 | "Categorized" PASS (4 tabs, no orphans — verified by SRC line 30-35 + `r.category === activeTab` filter at line 188). "By theme" partial — each tab has emoji + color underline but no per-category accent in the grid bg, no theme expressed visually beyond tab chrome. R.pit.001 ("Beautiful": no element <9.5) FAILS due to MIN propagation from R.gen.003/.005/.007 |
| R.cov (combinatorial coverage) | 5.0 | 28 | 12 | **Major systematic gap.** R.cov.vp.* (viewports 360/390/768/1024/1280/1440/1920) — current grid is `grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9`. The calibration / cap.responsive spec calls for 4→6→8→10 (at <480/768/1280/1920). Implementation is 4→5→7→9 — close but NOT the spec values. FAIL on 4 viewport breakpoints. **R.cov.state.empty.tab FAIL — no `tabItems.length === 0` branch.** **R.cov.state.loading FAIL — no skeleton implementation; data arrives as props so a skeleton is structurally absent**. R.cov.state.error.fetch FAIL — same reason; no fetch error pattern (the panel relies on server-side data, but no error fallback if the server pushes empty/malformed). R.cov.input.kb partial — keyboard reaches tabs (Tab + Arrow) but cannot Tab between cards within a tabpanel beyond the natural source order; no roving-tabindex grid (acceptable but documented vs spec choice). R.cov.contrast.* mostly BLOCKED-on-user-verification (need browser computed contrast measurement). R.cov.iso.viewport-zoom-200 + iso.text-spacing both BLOCKED. |
| R.cap.tabs | 7.5 | 15 | 4 | **R.cap.tabs.014 PASS** (now `min-h-[44px]` on tab, line 954). **R.cap.tabs.005 PASS** (sliding indicator now an actual positioned element transitioning `left` + `width` via cubic-bezier(0.4,0,0.2,1) over 0.22s — lines 925-939). R.cap.tabs.013 partial — at 360px viewport the 4 tab pills with emoji + label + N/M progress badge would likely overflow → `overflow-x-auto` allows horizontal scroll (line 907, `scrollbarWidth: "none"`) — but R.cap.tabs.013 forbids truncation that loses meaning; horizontal scroll preserves meaning so this is PASS. R.cap.tabs.002 partial — all 4 tabs use distinct emoji glyphs (🏡🌿🐸✨) PASS. R.cap.tabs.007 (active-indicator easing follows coh.016 family) — cubic-bezier(0.4,0,0.2,1) vs panel-fade `ease-out` vs card-pop `cubic-bezier(0.34, 1.4, 0.64, 1)` vs coin-fly `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — four different curves total; **FAIL on cohesion** even though tab-indicator itself is fine. R.cap.tabs.015 (focus ring unobstructed): the `ring-emerald-500 ring-offset-1` on each tab works, but ring-offset of just 1px may visually clip into the sliding indicator's emerald-600 bg on the active tab — borderline. R.cap.tabs.004 contrast: inactive tabs use `text-ink-800` on `bg-white/60` — **`ink-800` is NOT defined in tailwind.config.ts** (only ink-900, ink-700, ink-500). The class silently fails → text defaults to browser inherit (likely no override); contrast indeterminate. **FAIL on SRC-level.** |
| R.cap.cards | 7.5 | 16 | 5 | Three variants present and visually distinguishable (PASS). Owned-placed sprout 🌱 is the designed mark (R.cap.cards.002 PASS via line 1038). R.cap.cards.005 (locked variant does not crowd silhouette): lock icon at `h-4 w-4 text-[7px]` top-right + price badge at `text-[8px]` bottom — both shrunk way down. The art uses `h-full w-full object-contain` with `opacity-65` (line 1155) — silhouette visible. PASS. R.cap.cards.007 (owned-unplaced shows drag-affordance): `cursor-grab` only when `isInventory && isEditing` (line 1012) — in default (non-edit) mode there is no drag affordance shown. The card is `cursor-default` in non-edit mode. This is a documented design choice (the explicit "click to buy · edit mode to drag & place" copy at line 880) so technically passes the variant requirement, but the criterion R.cap.cards.007 reads "Owned-unplaced card is draggable (cursor changes to grab on hover)" — strict read = FAIL outside edit mode. R.cap.cards.011 (name fits single line or truncates with title): hover-overlay name uses `truncate` at `text-[8px]` and the card has no static label visible — only on hover. Below typical readability; FAIL on the name-visibility-without-hover read of the rubric. R.cap.cards.009 (silhouette at 96-128px desktop): lg:grid-cols-9 at 1280px-ish viewport = (1280-padding-gaps)/9 ≈ 130px; PASS. R.cap.cards.010 (silhouette at 88px on 2-col mobile): grid is 4-col at <sm so at 360px → (360-32-3*8)/4 ≈ 76px each. Below 88px target. FAIL on density choice. |
| R.cap.buy | 8.0 | 17 | 4 | Coin arc fires on confirmed server success (line 519, post `await purchaseRewardAction`). PASS R.cap.buy.001 (no modal — confirmed). PASS R.cap.buy.008 (purchasingId debounce, line 481). PASS R.cap.buy.009 (purchaseRewardAction wire format unchanged). PASS R.cap.buy.012 (aria-live announces success — line 531, "added to your garden"). R.cap.buy.002 — `aria-disabled={!canAfford || undefined}` on the unaffordable case (line 1122) AND click handler guards (line 1124) AND `disabled` only when `isBeingBought` (line 1121) — PASS. R.cap.buy.005 PASS (optimistic card flip via setExtraOwned, line 503). R.cap.buy.016 (golden no coin-buy CTA) PASS — golden-cat-locked branch (line 1077) renders no buy CTA. **R.cap.buy.011** (after purchase, item stays in same grid position) — `tabItems` sort is `(a, b) => a.price - b.price` (line 188), but the OWNED check happens at render-time inside `tabItems.map`. As soon as `extraOwned` gains an id, the card renders as the owned-unplaced variant — same grid position. PASS. **R.cap.buy.003 partial FAIL** — pending state during server action is the price badge changing to "…" (line 1180) — that's a subtle indicator, not a clear spinner or pulse in the CTA. R.cap.buy.006 PASS (coin arc IS the confirmation beat, not a toast). R.cap.buy.007 PASS (inline error: lock turns ⚠, badge says "retry", card border rose-400, line 1140-1180). |
| R.cap.coin | 8.5 | 15 | 3 | Animation fires on success (line 519). Arc uses cubic-bezier(0.25, 0.46, 0.45, 0.94) over 0.65s (line 809) — total visual time including land 0.85s (line 520) — within 0.6-1.0s spec. PASS R.cap.coin.006. Coin lifts from button origin (R.cap.coin.002 — `s = triggerEl.getBoundingClientRect()` line 489) and lands at coins pill (R.cap.coin.004 — `e = coinsRef.current.getBoundingClientRect()` line 490). Arc trajectory: keyframe at 45% has translateY(-55px) so it IS a noticeable arc (line 814). PASS R.cap.coin.003. Sparkle/scale-bounce on the pill via `gdn-coin-landed` (lines 819-826, applied via classList.add at line 525 inside setTimeout 650ms). PASS R.cap.coin.005. Uses transform + opacity only (line 813-815) — PASS R.cap.coin.007. Reduced-motion: animation disabled (line 841) — but the spec asks reduced-motion to "collapse to instant balance update + brief flash"; the implementation simply removes the animation so the balance pill still updates via the count-down tween, and no flash compensates. PASS-borderline R.cap.coin.010. R.cap.coin.011 (does not block subsequent purchases): the `purchasingId` guard (line 481) DOES block subsequent purchases for the duration of the await, but the arc animation runs concurrently (it's set inside the try after the await, then setTimeout cleans it up at 850ms). However the user can't fire another purchase while one is in flight — they can immediately fire one as soon as `purchasingId` clears, which happens in the finally. Strict spec read: arc must not block; current implementation blocks for the await duration + arc duration overlap. Acceptable. R.cap.coin.012 (balance number syncs with landing beat): current code deducts balance at click time (line 501) — instant, BEFORE the arc launches; the spec wants the balance to update synchronously with the landing beat at the END of the arc, not the launch. **FAIL R.cap.coin.012.** (The display-coins tween masks this somewhat by animating 350ms of decrement, but the tween starts on localCoins change at click, not on land.) R.cap.coin.013 (easing follows coh.016 family): see R.cap.tabs.007 — 4 different cubic-bezier curves in the panel. FAIL on cohesion family. R.cap.coin.015 (no off-screen waste): no `document.visibilityState` guard around setTimeout — animation runs even if tab is hidden during the 850ms window. Minor FAIL. R.cap.coin.014 (warm handcrafted aesthetic, not Material/neon): 🪙 emoji + simple arc + scale-bounce — passes the no-Material-ripple test. PASS. |
| R.cap.lock | 8.5 | 12 | 2 | **R.cap.lock.002 PASS** — affordable lock now `bg-amber-400/90 text-white`, unaffordable `bg-ink-900/15 text-ink-900/40` (lines 1164-1166). Distinct color treatment. **R.cap.lock.011 PASS-borderline** — lock icon now transitions `opacity-0` when `isBeingBought` (line 1161) via `transition-opacity duration-300`. That IS a lock-dissolve, NOT a hard snap. Sequence: click → optimistic owned flip (instant, card variant changes) — wait, here's the issue: when `isBeingBought` flips to true, the card is still in its locked branch IF the optimistic ownership flip happens via `setExtraOwned`. But `isOwned = ownedSet.has(item.id) || extraOwned.has(item.id)` at line 984 — so once extraOwned fires (synchronously with setPurchasingId), the card RE-RENDERS into the OWNED branch entirely. The locked branch's lock-dissolve transition never has a chance to run because the locked branch unmounts immediately. So the dissolve is effectively a no-op for affordance. **FAIL on R.cap.lock.011 — the transition is structurally bypassed by the optimistic-flip re-render.** R.cap.lock.006 PASS (no `disabled` on unaffordable). R.cap.lock.007 PASS (`aria-disabled` + accessible label "need N more coins" at line 1131). R.cap.lock.012 (affordability flips in real-time when balance changes): `canAfford = localCoins >= item.price` — re-evaluated on every render — PASS. |
| R.cap.motion | 7.0 | 15 | 6 | Tab cross-fade IN works (line 791-796); but R.cap.motion.tab.001 requires OUT also — outgoing content fades out before incoming arrives. Current implementation just keys on activeTab which unmounts old and mounts new with the fade-in only. No fade-out on the outgoing. FAIL R.cap.motion.tab.001. Card stagger pop-in: animation-delay capped at 280ms (line 1016) = 10 cards — PASS R.cap.motion.card.003. Card pop scale 0.82→1.10→1 (line 802-805) — exceeds the cap.motion.card.002 spec which says "scale > 0.95-1.0 (so cards don't grow from tiny)". 0.82 IS growing from tiny. **FAIL R.cap.motion.card.002.** **R.cap.motion.unlock.001 PASS** (justUnlocked set + gdn-unlock-reveal keyframe at lines 504-508, 829-836, 1006). Scale-up 0.72→1.14→1, brightness 0.45→1.22→1, saturate 0→1.5→1 — staged reveal. R.cap.motion.unlock.002 (subtle scale ≤1.04) — implementation peaks at 1.14 which is louder than ≤1.04. **FAIL R.cap.motion.unlock.002** (overshoots intended subtlety). R.cap.motion.unlock.003 (0.4-0.7s): 500ms duration (line 830) — PASS. R.cap.motion.coh.001 (same easing family): 4 different cubic-beziers + ease-out — **FAIL.** R.cap.motion.coh.002 PASS (transform/opacity/filter only). R.cap.motion.coh.003 PASS (prefers-reduced-motion handled across all keyframes, lines 780-785, 838-846). R.cap.motion.coh.004 (no layout thrash): tab indicator measured via offsetLeft/Top in useLayoutEffect — does this thrash? Only on tab change. Acceptable. PASS. |
| R.cap.coins | 8.5 | 12 | 3 | **R.cap.coins.006 PASS** — count-down tween over 350ms with 12 steps (lines 220-246). Increment via setInterval (not rAF — minor performance suboptimal, but functional). PASS R.cap.coins.005 (`localCoins` optimistic). PASS R.cap.coins.004 (`tabular-nums` line 890). **R.cap.coins.009 PASS** — aria-label now `"Coin balance: ${displayCoins} coins"` (line 886). R.cap.coins.008 partial — the pill div ONLY has aria-label, NOT aria-live. The aria-live regions at lines 897-902 announce purchase results but not the standalone balance change. Per the spec, balance updates should be announced via aria-live; using aria-label alone means SR re-reads only on focus, not on update. **FAIL R.cap.coins.008.** R.cap.coins.011 (reserve space for 5→6 digit): no `min-w` on pill (line 887) — the pill width is content-driven. Going from 9,999 to 10,000 will shift width by ~7px. **FAIL R.cap.coins.011** (minor visual jump). R.cap.coins.012 (visual weight per ref.hayday.003): pill is `px-3 py-1.5 text-[13px]` — still on the small side. **FAIL R.cap.coins.012.** R.cap.coins.007 PASS (pill IS the launch point — `coinsRef.current.getBoundingClientRect()` is the END coordinate of the arc; the START is the buy button. Wait — re-reading lines 489-496: `s = triggerEl.getBoundingClientRect()` (the BUY BUTTON) is the START, `e = coinsRef.current.getBoundingClientRect()` (the COINS PILL) is the END. So the coin flies FROM the buy button TO the pill — the OPPOSITE of "lifts from coin-balance badge / arcs to purchased card" per R.cap.coin.002. The spec says coin lifts from balance to card. The implementation goes card → balance. **FAIL R.cap.coin.002** (direction inverted) — this is a semantic mismatch: the spec narrative is "coin flies from balance to card" (signifying spending coin into purchase), the implementation is "coin flies from card to balance" (signifying ... revenue collection?). Either narrative works metaphorically, but the rubric named the spec direction. Cold-judge calls this a FAIL. |
| R.cap.a11y | 8.5 | 28 | 4 | Panel aria-label PASS (line 858, `aria-label="Garden shop"`). Tabs ARIA pattern PASS (role/aria-selected/aria-controls/roving tabindex). Cards accessible names PASS (line 1000, 1057, 1083, 1127). Lock aria-hidden PASS. Buy real `<button type="button">` PASS. dual aria-live PASS (polite for success, assertive for error — lines 897-902). Focus-visible ring PASS. R.cap.a11y.cards.001 (each card reachable by Tab): currently every card is a `<button>` in source order; with 17+ items per category and 4 categories, Tab cycles through all cards even when off-screen. Acceptable but not "grouped grid with Arrow nav." **R.cap.a11y.focus.004 partial** — after purchase, focus stays on the card-as-button which transitions to the owned variant (still a button, focusable). Acceptable but no explicit `focus()` call to confirm. **R.cap.a11y.contrast.003 BLOCKED-on-user-verification** — unaffordable card text "🪙 50" in `bg-ink-900/35 text-cream-50/70` (line 1179). Computed contrast cannot be verified from SRC; the alpha math means actual contrast depends on parent layer stack. BLOCKED. **R.cap.a11y.contrast.more BLOCKED** (no `@media (prefers-contrast: more)` block exists in component — FAIL on the strict read). **R.cap.a11y.forced-colors BLOCKED** (no forced-colors rules; tab indicator IS a div with bg-emerald-600 only — in forced-colors mode the indicator vanishes because bg-color is overridden). **FAIL R.cap.a11y.forced-colors.** |
| R.cap.empty (MEDIUM) | 0 | 7 | 7 | **NO EMPTY STATE EXISTS.** Source has no `tabItems.length === 0` branch. If any category were empty the grid would render zero cards with no fallback. All 4 garden categories currently have data so this is latent, but the rubric requires a designed empty state (warm illustration + brief copy). **All 7 leaves FAIL on SRC.** |
| R.cap.sort (MEDIUM) | 5.0 | 4 | 3 | Sort is `a.price - b.price` only (line 188) — owned items do NOT float to top. **FAIL R.cap.sort.001** (rubric: owned first within each category, then locked by price ascending). R.cap.sort.002 (owned-placed vs owned-unplaced ordering): not documented; both sort by raw price. FAIL. R.cap.sort.003 (purchased item stays in original visual position briefly then settles): purchased item flips variant in-place (same array index) so no reshuffle — PASS. R.cap.sort.004 (golden uses focus-hours requirement implicit sort): golden tab is also sorted by price which is 0 for all goldens — so they sort by REWARDS array insertion order (lantern→gnome→cottage→applestree→gazebo→fairyring, matching unlocks_at_minutes ascending: 300→900→1800→3600→7200→14400) — coincidentally correct but undocumented. PASS by coincidence. |
| R.cap.model (MEDIUM) | 8.5 | 5 | 2 | Each category shows BOTH owned and locked in one grid (PASS). Placed items still appear (PASS line 1036-1040, "in scene" sprout badge). No duplicates (PASS — each REWARDS id is unique). **R.cap.model.003 (5-second glance comprehension): BLOCKED-on-user-verification** (cannot judge without showing it to a real first-time user). R.cap.model.005 (no owned-placed AND locked simultaneously): state machine says `isPlaced` requires `item.id in localLayout`, which requires the item is owned. Sound. PASS. |
| R.cap.grouping (MEDIUM) | 9.5 | 5 | 0 | Every item maps to exactly one category (PASS). No "Other" bucket (PASS). Golden is reserved (PASS — all garden-golden items have price 0). Data-driven via `r.category === activeTab` (PASS line 188). Per-tab counts: structures 9, plants 13 (incl. seasonal), critters 11, golden 6 — within reasonable range. PASS. |
| R.cap.responsive (MEDIUM) | 5.0 | 7 | 6 | Grid `grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9` (line 982). Spec calls for 4→6→8→10. Off by 1 col at every step. **FAIL all 4 viewport leaves** (R.cap.responsive.001/002/003/004). R.cap.responsive.005 (smooth breakpoint transitions): Tailwind sm=640, md=768, lg=1024 — typical reasonable breakpoints. PASS. R.cap.responsive.006 (panel height capped on mobile with internal scroll): no `max-h` on the panel; it can grow indefinitely on mobile. **FAIL.** R.cap.responsive.007 (tab bar on mobile no horizontal scroll burying tabs): `overflow-x-auto` allows scroll (line 907) — acceptable but means tabs CAN be hidden off-screen at very narrow widths. Borderline FAIL. |
| R.cap.typo (MEDIUM) | 6.0 | 6 | 3 | R.cap.typo.001 (item name vs price distinct): item names rendered as `text-[8px]` only on hover (overlay); price badge is `text-[8px] font-bold`. Both 8px. Same size. **FAIL.** R.cap.typo.002 (tabular-nums): PASS (line 890, 963, 1264). R.cap.typo.003 (weights from existing set): `font-semibold` (600) and `font-bold` (700) — both standard. PASS. R.cap.typo.004 (≥1.3 line-height for small labels): uses `leading-none` (line-height: 1) on most badges. **FAIL.** R.cap.typo.005 (letter-spacing on caps): `tracking-[0.18em]` and `tracking-[0.22em]` on the uppercase labels (line 870, 1199, 1219, 1228) — PASS. R.cap.typo.006 (chunky/rounded register per calibration vibe, not flat sans like Inter): `font-display` is Trirong (italic serif) — used only on the panel title "Your Garden" (line 869) and stage name. Body text uses default (no fontFamily set → tailwind base → system-ui). For game UI this is acceptable but NOT particularly "chunky/rounded." Borderline. |
| R.cap.palette (MEDIUM) | 6.0 | 6 | 3 | R.cap.palette.001 (panel bg parchment): `bg-cream-50/90` (line 859). cream-50 = #fdfbf7. Warm off-white. PASS. R.cap.palette.002 (card surface differs ≥3% Lab L from panel bg): card uses `bg-white/75` (line 1011) on top of cream-50/90 background. white = #ffffff, cream-50 = #fdfbf7. Difference is minimal (<2% Lab L). **FAIL R.cap.palette.002.** R.cap.palette.003 (active tab mossy green from scene palette): emerald-600 = #059669 — but no "moss green" exists in the scene palette (tailwind config has `brand-mint #c7e2c7` but not used in tabs). Emerald is Tailwind's default. **FAIL R.cap.palette.003** (not "mossy green from existing scene palette" — it's stock Tailwind emerald). R.cap.palette.004 (coin gold matches scene coin glyph): amber-50 background, amber-800 text — these are Tailwind defaults, not the scene's amber-* tokens (there are no scene amber tokens defined; the scene uses raw `rgba(255,210,90,...)` for golden sheen). Inconsistent. **FAIL R.cap.palette.004.** R.cap.palette.005 (no more than 6 hues): currently uses cream + white + black/ink + emerald + amber + rose + ink + amber-900 = ~7 distinct hues. Borderline FAIL. R.cap.palette.006 (no saturated red): rose-400 used for error border — rose IS in the red family. Reserved for error only — PASS. |
| R.cap.hover (MEDIUM) | 7.0 | 7 | 3 | Card hover via `hover:border-emerald-300 hover:bg-white` (line 1145) — this is a color hover, NOT a scale 1.02-1.04 lift. **FAIL R.cap.hover.card.001.** R.cap.hover.card.002 (shadow grows on hover): no hover shadow on shop cards (only the scene items get `:hover scale(1.08)`). **FAIL R.cap.hover.card.002.** R.cap.hover.card.003 PASS (no layout shift; all hover changes color). R.cap.hover.btn.* (buy button): buy button IS the card, no separate button — hover treatment is the card hover above. R.cap.hover.tab.001 (tab hover tone shift): `hover:border-emerald-200 hover:bg-white` on inactive tabs (line 957) — color shift PASS. R.cap.hover.no-touch (no sticky-hover on touch): no `@media (hover: hover)` guard; hover styles will stick after tap on touch. **FAIL R.cap.hover.no-touch.** |
| R.cap.skeleton (MEDIUM) | 0 | 7 | 7 | **NO SKELETON EXISTS.** No loading-state UI in the component. Data arrives as props (server-rendered) so client-side fetch state doesn't exist — but the rubric requires SOMETHING for the initial paint window. **All 7 leaves FAIL** OR BLOCKED-on-user-verification depending on whether the team considers "skeleton" applicable to a server-rendered prop component. Strict cold-judge call: FAIL — the rubric explicitly says skeleton applies. |
| R.cap.scroll (MEDIUM) | 7.5 | 6 | 3 | R.cap.scroll.001 (overscroll-behavior: contain): no `overscroll-behavior` set on the panel or tablist. **FAIL.** R.cap.scroll.002 (60fps on mid-range): BLOCKED-on-user-verification (need perf trace). R.cap.scroll.003 (iOS momentum): no styles break momentum; default behavior. PASS. R.cap.scroll.004 (no backdrop-filter inside scroll): grepped the source — no `backdrop-filter` or `backdrop-blur` classes. PASS. R.cap.scroll.005 (scroll position preserved on tab switch back): NOT preserved — every tab switch re-keys the tabpanel (line 976: `key={activeTab}`) and the inner grid scrolls back to top. **FAIL.** R.cap.scroll.006 (keyboard PageUp/PageDown when focus inside scroll): inherited browser behavior on focused button — works for the page scroll, not specifically for the inner grid. Acceptable. PASS. |
| P.shop.coh (panel cohesion) | 6.0 | 8 | 4 | P.shop.coh.001 (header/tabbar/grid aligned edges): header `px-5 py-3`, tabbar `px-4 pb-1 pt-3`, grid `px-4 pb-5 pt-3`. Header uses px-5, tabbar+grid use px-4. **MISALIGNED by 4px.** FAIL. P.shop.coh.002 (vertical rhythm uses spacing scale): `py-3 / pb-1 pt-3 / pb-5 pt-3 / mt-7 / mt-5` — mix of spacing-3 and spacing-5 and spacing-7 from Tailwind scale. PASS. P.shop.coh.003 PASS (all card variants use `p-1.5`). P.shop.coh.004 (coin glyph in header matches price tag glyph): both use 🪙 emoji — PASS. P.shop.coh.005 (lock + in-scene icon family): lock = 🔒 emoji, in-scene = 🌱 emoji, error = ⚠ — all emoji, different metaphor families. PASS. P.shop.coh.006 (buy CTA matches across locked + golden variants): locked CTA is the price badge "🪙 50", golden-claim CTA is the "Claim!" pill, golden-locked has no CTA. Three different treatments. **FAIL.** P.shop.coh.007 (hover/focus/active vocab identical): hover uses `hover:border-emerald-300 hover:bg-white` on locked cards, `hover:border-amber-500 hover:bg-amber-100` on claim, `hover:bg-white` on owned-inventory — different. **FAIL.** P.shop.coh.008 (empty/loading/error use same internal padding pattern as grid): no empty/loading state exists. Vacuously fails. **FAIL.** |
| P.shop.header.coins (24 leaves, deep template) | 6.0 | 24 | 8 | Already covered in R.cap.coins above — count-down tween PASS, aria-label PASS. P.shop.header.coins.vis.1 (glyph + integer balanced): glyph is `text-sm` (~14px), integer is `text-[13px]` font-semibold — roughly balanced. PASS. .vis.2 (baseline aligned): `flex items-center` — yes, vertical center, not baseline-aligned per spec. Borderline. .vis.3 (coin-gold used only here and in price tags): amber-50 used on header pill, amber-500 used on golden badge, amber-400 used on affordable lock, amber-800 on text — five amber tokens, inconsistent. Borderline FAIL on cohesion. .typ.1 PASS (tabular-nums). .typ.2 (weight bold enough): font-semibold = 600. PASS. .typ.4 PASS (toLocaleString). .mot.1 PASS (count-down tween). .mot.2 (no init-jump): tween only fires on `localCoins` change (line 221: `if (startVal === endVal) return`) — on first mount, displayCoins starts at `coins` (line 116, useState initializer). No tween from 0. PASS. .mot.3 (reduced-motion: snap): no reduced-motion guard around the tween. The setInterval still runs even in reduced-motion. **FAIL .mot.3.** .int.1 PASS (it's a div, not a button). .int.2 PASS (aria-label present). .spc.1 PASS (`gap-1.5` = 6px). .spc.2 (≥16px from panel edge): `px-5 py-3` on header = 20px horizontal — PASS. .rsp.1 (fits at 360px without overlapping title): title "Your Garden" + small subtitle on left, coins pill on right with `justify-between` — at 360px tight but fits. Borderline PASS. .rsp.2 PASS (anchored right). .a11.1 (aria-live on balance changes): NOT directly on the pill — see R.cap.coins.008 above. **FAIL .a11.1.** .a11.2 PASS (label includes "coins"). .prf.1 (no panel-wide reflow on balance update): the tween updates displayCoins state, which re-renders only the pill. The whole GardenScene re-renders too because displayCoins is in component state. **FAIL .prf.1** (full component re-render on every tween step = 12 re-renders per balance change). .cpy.1 (if label present, one word): no separate "Coins" label — only emoji + integer. PASS vacuously. .coh.1 (matches scene coin glyph): scene uses 🪙 emoji too — PASS. .rte.1 PASS (frontend-design built). |
| P.shop.header.title (8 leaves) | 8.0 | 8 | 2 | Title "Your Garden" present (line 869). .sub.1 PASS (clearly identifies the panel). .vis.1 (does not compete with coins): title is `font-display text-base italic text-ink-900` — moderate weight. Subtitle text is `text-[10px] uppercase tracking-[0.18em]` — small. Coins pill is rounded amber pill. Balance ambiguous; the title "Your Garden" reads larger than the pill content. **FAIL .vis.1** (slightly competes — but the cold judge calls this 8.5 borderline, the dial-8 rubric needs better hierarchy). .typ.1 (uses one of existing display sizes): text-base is a stock Tailwind size. PASS. .typ.2 (≥4.5:1 contrast): ink-900 #1f1f1f on cream-50 #fdfbf7 ≈ 17:1. PASS. .a11.1 (is a heading h2 or h3): line 869 uses `<h3>` — PASS. .a11.2 N/A (title is visible). .coh.1 (matches scene heading family): `font-display` (Trirong) — same family as scene "stage.name" (line 1227 also `font-display`). PASS. |
| P.shop.tabbar.coh + tab (36 leaves) | 7.5 | 36 | 6 | Tabbar.coh.001 (all 4 equal width OR all intrinsic with consistent gap): tabs are intrinsic width with `gap-1.5` (line 907). PASS. .coh.002 (bottom edge aligned with content top edge): tab bar `pt-3` then panel `pt-3` — direct adjacency. PASS. .coh.003 (icon+label aligned across all 4): each tab `flex items-center gap-1.5` — consistent. PASS. Now per-tab template (33 leaves): .vis.1 (icon-to-label proportion): emoji at default + label at text-[11px] — emoji ~12-13px tall, label 11px. Balanced. PASS. .vis.2 (active wins peripherally ≥2 cues): emerald-600 fill + cream-50 text + sliding indicator = 3 cues. PASS. .vis.3 (inactive tonally muted, not pure grey): inactive uses `text-ink-800` (but ink-800 is undefined in tailwind config!) — falls back to no color. **CRITICAL SILENT BUG.** Likely renders default text color (browser default). FAIL on .vis.3. .typ.1 PASS (one size text-[11px] across all 4). .typ.2 PASS (no caps; tracking unused on tabs). .typ.3 (both active and inactive ≥4.5:1): active is cream-50 #fdfbf7 on emerald-600 #059669 ≈ 4.6:1, borderline. Inactive is ink-800 (undefined) on white/60 — indeterminate. **BLOCKED-on-user-verification.** .mot.1 PASS (hover transition-colors). .mot.2 PASS (active-state transition 0.22s via indicator slide). .mot.3 PASS (no init-jump, useLayoutEffect measures on mount). .int.1-.5 mostly PASS. .spc.1 PASS (px-3 py-1.5 = 12px horizontal + min-h-[44px] vertical). .spc.2 PASS (gap-1.5 = 6px between). .rsp.1 (fits at 360px): emoji + label + N/M badge per tab × 4 tabs + gap = likely overflows at 360px → `overflow-x-auto` (line 907). Tabs can be scrolled. PASS on functional but FAIL on the spec "no horizontal scroll that buries far tabs". .rsp.2 PASS (label readable). .rsp.3 (at ≥1280px tabs don't stretch awkwardly): intrinsic width prevents stretch. PASS. .a11.1-.5 mostly PASS. .prf.1 (tab switch doesn't re-render entire panel): tab switch updates activeTab → tabItems memo re-runs → the entire tabpanel grid re-renders (because of `key={activeTab}` at line 976 which forces remount). **FAIL .prf.1** (full panel grid unmount/remount on every switch is the opposite of efficient). .cpy.1/.2 PASS. .coh.1 PASS (same icon family — emoji). .coh.2 (active color mossy green): emerald-600 ≠ "mossy green" per palette spec — emerald is Tailwind's default green. **FAIL .coh.2.** .rte.1 PASS. |
| P.shop.grid.coh (4 leaves) | 8.0 | 4 | 2 | .coh.001 (uses CSS Grid not flex-wrap): line 982 uses `grid grid-cols-4 ...`. PASS. .coh.002 (gap consistent both axes): `gap-2` = 8px both axes. PASS. .coh.003 (all cards identical outer dims): all use `aspect-square` and same grid cell → identical. PASS. .coh.004 (cards align precisely): grid handles this. PASS. |
| P.shop.card.locked (41 leaves) | 6.5 | 41 | 11 | .sub.1 (locked + buyable in <1.5s): lock icon top-right, price badge bottom-center, full card clickable. Glanceable. PASS. .vis.1 (lock + price + buy hierarchy): only lock + price visible; no separate "Buy" label. Borderline. .vis.2 (lock at corner ~25% max): lock is h-4 w-4 = ~16px on a ~120px card = ~13%. PASS. .vis.3 (price+coin paired): "🪙 50" together in the badge. PASS. .vis.4 (parchment cream surface): `bg-white/60` (line 1145) — not parchment-textured. FAIL. .vis.5 (buy CTA distinct from card but harmonious): price badge IS the CTA. Borderline. .typ.1 (item name readable + ≥4.5:1): item name only shows on hover at `text-[8px]` — 8px is below typical 12px minimum. **FAIL.** .typ.2 PASS (tabular-nums via tracking-tight... wait, no tabular-nums on price badge — let me re-check line 1180: `🪙 ${item.price}` in `text-[8px] font-bold leading-none` — no `tabular-nums`. **FAIL .typ.2.** .typ.3 (price weight ≥ name weight): price is font-bold, name is font-medium (line 1184). PASS. .typ.4 (no 3 sizes within a card): item name 8px, price 8px, lock-icon emoji is its own size. Effectively 2 sizes. PASS. .mot.1 PASS (gdn-card-stagger). .mot.2 (hover lift): NO scale-up on hover — only color shift. **FAIL.** .mot.3 (on purchase: lock dissolves + reveal scale-up): see R.cap.lock.011 above — structurally bypassed by optimistic re-render. **FAIL.** .mot.4 PASS (no init-jump for cards). .mot.5 PASS (reduced-motion). .int.1-.8: int.2 (hover lift + CTA highlight): no lift. **FAIL.** int.4 (active press depth): no press depth. **FAIL.** int.6 (loading state visible): "…" in price badge — subtle but present. PASS. .int.7 (error state inline, card returns to locked): rose border + ⚠ + "retry" text. PASS. .int.8 (success → owned-unplaced flip): PASS via setExtraOwned. .spc.1 (≥12px around art): card padding is `p-1.5` = 6px. **FAIL.** .spc.2 (≥8px buy CTA from edge): price badge is `inset-x-0 bottom-0.5` — 2px from bottom. **FAIL.** .spc.3 PASS (grid gap-2 = 8px). .rsp.1 (readable at smallest grid 88px in 4-col 360px): card width at 360px → (360-32-3*8)/4 ≈ 76px — below 88px target. **FAIL.** .rsp.2 PASS (at 1920px, 9-col still reasonable). .rsp.3 (buy CTA fits): "🪙 50" at 8px font fits even small cards. PASS. .a11.1 PASS (aria-label includes name + price). .a11.2 PASS (lock aria-hidden). .a11.3 PASS (card focusable). .a11.4 PASS (not color-only). .a11.5 (tap target ≥44px on touch): at 360px → 76px card. PASS. .prf.1 PASS (no backdrop-filter). .prf.2 (lazy loading): no `loading="lazy"` on img tags inside locked cards. **FAIL .prf.2.** .cpy.1 PASS. .cpy.2 (label is "Buy" or single word): no "Buy" label at all — the CTA copy is "🪙 50" / "…" / "retry". The button has `aria-label="Buy ..."` so accessible name has "Buy" but visible label does not. **FAIL .cpy.2.** .coh.1 PASS (same outer footprint as other variants). .rte.1 PASS. |
| P.shop.card.owned-unplaced (26 leaves) | 7.0 | 26 | 7 | .sub.1 (owned + drag-me in <1.5s): owned card in non-edit mode has no drag affordance. In edit mode it gets `cursor-grab`. PASS conditional. .vis.1 (NO lock NO price NO buy CTA): correct — owned branch renders only image + hover name + optional sprout/golden badges. PASS. .vis.2 (drag-affordance hint): only `cursor-grab` when `isInventory && isEditing` — outside edit mode, no hint. **FAIL.** .vis.3 (silhouette pops ≥3:1 graphical contrast): images are PNGs with transparency; against `bg-white/75` parchment-cream — varies per item. BLOCKED-on-user-verification. .typ.1 PASS (item name identical between locked and owned — both via hover overlay at 8px). .mot.1 PASS. .mot.2 (hover lift): no scale, color only. **FAIL.** .mot.3 (drag-start lifts off): drag-start triggers `td-item-dragging` class on the SCENE item only, NOT the inventory card. Inventory drag shows the ghost separately (line 1300-1322). Inventory card opacity drops to 40 (line 1013, `${isBeingDragged ? "opacity-40" : ""}`). Scale/shadow not applied to inventory card itself. Borderline. .mot.4 PASS (reduced-motion). .int.1-.6 mixed PASS/FAIL. .int.2 (cursor grab + lift on hover): cursor-grab in edit mode PASS, lift FAIL. .int.5 (drag handoff): wired via handlePointerDown(item.id, "inventory") at line 1018. PASS. .int.6 (drag-cancel returns card): inventory drag with no drop just clears state. PASS. .spc.1 PASS (same padding). .rsp.1 (drag works on touch): pointer events used, touch-action: none on inventory cards (line 1015). PASS via SRC. .a11.1 PASS (aria-label includes "owned"). .a11.2 (keyboard alternative to drag): NO keyboard path for "place in scene." Drag is mouse/touch only. **FAIL.** .a11.3 PASS (44px). .prf.1 PASS (drag preview is fixed-position single img). .cpy.1 PASS. .coh.1 PASS. .rte.1 PASS. |
| P.shop.card.owned-placed (23 leaves) | 8.0 | 23 | 4 | .sub.1 (placed in <1s): 🌱 sprout badge at bottom-right corner. PASS. .vis.1 (in-scene indicator clearly visible): 🌱 is visible. PASS. .vis.2 (visual treatment distinguishes from owned-unplaced): placed cards use `border-emerald-400/50 bg-emerald-50/70 ring-1 ring-emerald-300/40` (line 1010); unplaced use `border-white/80 bg-white/75`. Distinct. PASS. .vis.3 (silhouette still visible): image opacity unchanged. PASS. .typ.1 (in-scene label): no visible label, only the badge. Borderline. .mot.1 PASS. .mot.2 PASS (hoverable). .mot.3 (transition when returned from scene): the scene→inventory flow is via drag; when removed, card simply re-renders without `isPlaced`. No staged transition. **FAIL.** .int.1 PASS. .int.2 (hover no grab cursor): placed cards have `cursor-default` (line 1012). PASS. .int.3 PASS. .int.4 (click action): no click action wired (placed cards have no onClick). The aria-label says "in scene" only. Acceptable per "pick one and document" — but undocumented. Borderline. .int.5 PASS. .spc.1 PASS. .a11.1 PASS (aria-label includes "in scene"). .a11.2 PASS (text alternative). .a11.3 PASS. .prf.1 PASS (no continuous animation on placed card — only the optional aura/glow if golden). .cpy.1 (exactly 2 words "in scene"): aria-label says "in scene" — exactly 2 words. PASS. .coh.1 PASS. .coh.2 (in-scene mark matches scene-side placed indicators): scene-side has no separate "placed" indicator (items just exist in scene). Sprout 🌱 is panel-only. Borderline FAIL. .rte.1 PASS. |
| P.shop.buy (39 leaves) | 5.0 | 39 | 18 | This is the highest-stakes subtree and the cold pass finds substantial gaps. The fundamental issue: **the locked card IS the buy button**, not a separate CTA. Many P.shop.buy.* rows assume a separate "Buy" labeled button inside the card. Bulk-impact rows: .sub.1 (Buy + price in <0.5s): no "Buy" word visible. .vis.1 (button shape consistent rounded rect/pill): the "button" is the whole card (rounded-xl). Acceptable. .vis.2 (button color filled accent): the card bg is white/60 — no accent fill. **FAIL .vis.2.** .vis.3 (label color ≥4.5:1 against button bg): "🪙 50" in `bg-emerald-700 text-cream-50` (line 1178) on hover-active state — high contrast PASS. .vis.4 (button second focal after silhouette): price badge is small at bottom — silhouette dominates. PASS. .typ.1 (label weight bold): font-bold on price badge. PASS. .typ.2 (label ≥12px): label is `text-[8px]`. **FAIL.** .mot.1 (hover color deepen + slight scale): only `hover:bg-emerald-600` on the badge — no scale. Borderline. .mot.2 (active press inset): none. **FAIL.** .mot.3 (pending pulse): "…" in badge — subtle. Borderline. .mot.4 (success consumed): coin arc fires, badge stays. PASS. .mot.5 PASS (reduced-motion). .int.1-.10 mixed. .int.3 (focus-visible ring): present on card, not separate button. PASS. .int.4 (active press visible): none. **FAIL.** .int.7 (success state visible "Purchased" or ✓ for ~500ms): no such state. The card transitions instantly to owned variant via optimistic flip. **FAIL.** .int.8 (error state "Retry" label): button text changes to "retry" in price badge (line 1180). PASS. .int.9 PASS (Enter on button works). .int.10 PASS (Space on button works). .int.11 PASS (debounce via purchasingId). .spc.1 (≥8px horizontal padding + ≥4px vertical): badge is `px-1.5 py-0.5` = 6px/2px. **FAIL.** .spc.2 PASS (gap from card edge ≥8px — badge is inset-x-0). .rsp.1 (label fits at all card sizes): "🪙 50" at 8px fits even tiny cards. PASS. .rsp.2 (tap target ≥44px touch): card is ≥76px wide, badge area is small. The CARD is the button so 76px target. PASS. .a11.1 PASS (real button). .a11.2 PASS. .a11.3 (unaffordable accessible name): "${item.name} — need ${item.price - localCoins} more coins" (line 1132). PASS. .a11.4 (loading state announce): `setAnnounceMsg("")` clears on pending — but no "Purchasing X..." announcement. **FAIL.** .a11.5 (error announce assertive): rose region used (line 901). PASS. .a11.6 (focus stable mid-purchase): card stays focused; React state changes don't unmount. PASS. .prf.1 PASS (optimistic update synchronous). .cpy.1 (label is "Buy"): NO "Buy" label visible. **FAIL.** .cpy.2 (error message specific): line 542-546 — "Not enough coins to buy X" or "Couldn't reach the server" — specific. PASS. .coh.1 (style matches other primary CTAs): the "Done editing" button uses bg-emerald-600 pill, the "Move items" uses border + cream-50 bg. The price badge uses bg-emerald-700. Three different patterns. **FAIL.** .rte.1 PASS. |
| P.shop.golden-gate (24 leaves) | 7.0 | 24 | 6 | Golden tab implemented. Claim CTA "Claim!" pill (line 1066) — single word PASS. Locked-golden shows hours requirement "5h" in amber pill (line 1093-1095) and a tiny 2px progress bar (line 1104-1106). .vis.1 (distinct from coin-priced): yes — golden uses gradient amber bg + ring-amber and Claim! label. PASS. .vis.2 (progress visible): h-0.5 = 2px progress bar — essentially invisible. **FAIL.** Numerator hours not shown next to denominator. **FAIL on glanceable progress.** .vis.3 (met-requirement claim affordance differs from unmet): yes — claim has border-amber-400 + ring-amber-300/60 + visible "Claim!", unmet has lock overlay + hours badge. Distinct. PASS. .typ.1 PASS (tabular-nums on `{hoursNeeded}h`... wait, hoursNeeded is just an integer rendered in template literal, no tabular-nums class. **FAIL.** .typ.2 PASS (contrast). .mot.1 (progress animates): `transition-[width]` on the inner progress bar (line 1106). PASS. .mot.2 (met-requirement celebration): no celebration transition from unmet → met (only React state change). **FAIL.** .mot.3 PASS (reduced-motion). .int.* mostly PASS. .spc.1 PASS. .rsp.1 PASS. .a11.1 (accessible name includes item + requirement state): line 1083-1085 — yes. PASS. .a11.2 PASS (role=progressbar + aria-valuemin/max/now at line 1099-1103). .a11.3 PASS (claim button enabled). .prf.1 PASS. .cpy.1 PASS ("focus" used consistently — actually the visible label says "h" not "focus hours" but the spec also says "earn N focus hours"; the title attribute says "5h of total focus to unlock" — PASS). .cpy.2 PASS (Claim!). .coh.1 (gold accent consistent): amber-50, amber-100, amber-200, amber-300, amber-400, amber-500, amber-800, amber-900 — 8 amber tokens. Inconsistent. **FAIL.** .rte.1 PASS. |
| P.shop.empty (20 leaves) | 0 | 20 | 20 | **NO EMPTY STATE.** All 20 leaves FAIL on SRC since no empty-state surface exists in the component. Score 0. |
| P.shop.loading (15 leaves) | 0 | 15 | 15 | **NO LOADING SKELETON.** All 15 leaves FAIL on SRC. Score 0. |
| P.shop.error (17 leaves) | 4.0 | 17 | 12 | Per-card error state exists (rose border + ⚠ + retry badge), BUT no panel-level fetch-failure error state. The panel-level error is what P.shop.error scores. **All non-trivial leaves FAIL** since no panel-error surface exists. The card-level error is handled in P.shop.card.locked/buy subtrees instead. |

### Atomic below-9.5 rows the prior runs missed (cold-pass additions)

These are NEW failures (not captured in runs 1-3) that the cold pass surfaces. The list is intentionally long because the prior runs' "READY" claim implicitly rolled up by capability not by leaf.

| ID | Cold-pass score | Concrete defect | Concrete fix |
|---|---|---|---|
| R.cov.vp.360 | 5 | Grid `grid-cols-4` at <sm = 4 cols. Spec at <480px wants 4 cols (matches). At sm/md/lg the cols are 5/7/9 vs spec 6/8/10. Off-by-one across viewports. | Change grid to `grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10` to match cap.responsive.001-004. |
| R.cov.state.empty.tab | 0 | No empty-state branch when `tabItems.length === 0`. | Add: `{tabItems.length === 0 ? <EmptyState category={activeTab} /> : <Grid />}` plus the EmptyState component itself (illustration + warm 1-sentence copy + optional CTA per R.cap.empty rubric). |
| R.cov.state.loading | 0 | No loading skeleton. Data flows as props but rubric requires SOMETHING for initial paint. | Add a `<Suspense fallback={<ShopSkeleton />}>` wrapper at the page level (in the parent server component), OR a `if (!ownedItemIds) return <ShopSkeleton />` guard at the top of GardenScene. |
| R.cov.state.error.fetch | 0 | No panel-level error fallback if server data is malformed/missing. | Add an error boundary or `if (!REWARDS || REWARDS.length === 0) return <PanelError />` guard. |
| R.cap.responsive.001-004 | 5 | Grid breakpoints off-by-one from spec (4→5→7→9 vs 4→6→8→10). | Same fix as R.cov.vp.* above. |
| R.cap.responsive.006 | 4 | Panel has no `max-h` on mobile — pushes scene off-screen as items count grows. | Add `max-h-[60vh] overflow-y-auto` on the panel wrapper (or the grid container specifically) at mobile widths. |
| R.cap.typo.001 | 5 | Item name and price both `text-[8px]` — same size, fails hierarchy. | Bump item name to text-[10px] OR use distinct weight on name (font-medium) vs price (font-bold). |
| R.cap.typo.004 | 5 | `leading-none` (line-height: 1) on most badges — below ≥1.3 for small labels. | Change `leading-none` to `leading-tight` (1.25) or `leading-snug` (1.375) on label spans, especially the hover-overlay name. |
| R.cap.palette.002 | 5 | Card bg `bg-white/75` vs panel bg `bg-cream-50/90` — Lab L difference is <2%, below spec 3%. | Use `bg-cream-100` (#f8f3ea) on cards to give a more visible cream-vs-parchment contrast. |
| R.cap.palette.003 | 4 | Active tab `bg-emerald-600` — Tailwind's stock emerald, not "mossy green from existing scene palette". The scene uses `text-emerald-700` for some accents but never the panel's emerald-600. | Either define a `moss` color in tailwind.config.ts derived from the scene's emerald accents, or use `bg-emerald-700` to match the scene-side accent. |
| R.cap.palette.004 | 5 | Coin gold uses Tailwind amber-* tokens (amber-50/400/800/900) — these are stock Tailwind, NOT the scene's `rgba(255,210,90,...)` golden tint used in `GOLDEN_FILTER` and golden auras. | Add a `coin: { gold: "#ffd25a", deep: "#aa9658" }` to tailwind.config and use those tokens for both the coin pill, lock badge, and any golden chrome — single source of truth for coin-gold across panel + scene. |
| R.cap.palette.005 | 7 | Panel uses ~7 distinct hues (cream + white + ink + emerald + amber + rose + ink/black). Spec caps at 6. | Drop one — easiest is `rose` (only used for error states); use `amber-900` or a desaturated red derived from the cream-palette instead. |
| R.cap.hover.card.001 | 5 | Card hover is color-shift only — no `scale(1.02-1.04)` lift, no shadow grow. | Add `hover:scale-[1.02] transition-transform` to card buttons (use `transform-gpu` for hint), and `hover:shadow-md` for shadow grow. |
| R.cap.hover.no-touch | 5 | Hover styles persist on touch tap (no `@media (hover: hover)` guard). | Wrap hover utilities in custom variant: define `'hover-only': '@media (hover: hover)'` in tailwind.config and prefix `hover:` with it OR use `@media (hover: hover) and (pointer: fine)` in a custom CSS layer to gate the hover styles. |
| R.cap.scroll.001 | 6 | No `overscroll-behavior: contain` on tabpanel — bounce-back on iOS chains to page. | Add `overscroll-contain` (Tailwind plugin) or inline `style={{ overscrollBehavior: 'contain' }}` to the tabpanel div. |
| R.cap.scroll.005 | 5 | Tab switch unmounts the tabpanel (`key={activeTab}` at line 976), so scroll position is reset every switch. | If scroll preservation is desired (per spec "pick one and document"), remove the `key` prop and use conditional rendering with persistent grid; OR document that scroll-reset is intentional. |
| R.cap.tabs.004 | 3 | Inactive tab uses `text-ink-800` which is NOT defined in tailwind.config.ts. Falls back to no override. Contrast indeterminate but visually likely defaults to inherited body color. | Define `ink-800` in tailwind.config.ts (e.g. #2a2a2a between 700 and 900), OR change inactive tab to `text-ink-700` which IS defined. |
| R.cap.tabs.007 | 5 | Tab indicator easing `cubic-bezier(0.4,0,0.2,1)` differs from card-pop `cubic-bezier(0.34, 1.4, 0.64, 1)` and coin-fly `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Four cubic-bezier families in the panel. | Pick ONE family — recommend `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) for all linear motion and one spring `cubic-bezier(0.34, 1.4, 0.64, 1)` for pop-ins only. Apply consistently. |
| R.cap.cards.007 | 5 | Owned-unplaced shows no drag-affordance hint in non-edit mode (cursor-default). New users see no drag cue. | Add an opaque-on-hover "drag handle" treatment (e.g. small grip-dots icon visible only on hover) in all modes, OR document that drag is opt-in via edit mode. |
| R.cap.cards.010 | 4 | At 360px viewport, 4-col grid → ~76px per card — below 88px silhouette readability target. | Switch to 3-col at <sm (or `grid-cols-3 sm:grid-cols-4`), giving ~104px cards at 360px. Trade off: shop is slightly less dense on small screens. |
| R.cap.cards.011 | 5 | Item name only visible on hover at 8px text. New users don't see names. | Add a static visible name label below each card (text-[10px] truncate) OR shift the price badge up and reveal name above it (de-emphasize on owned-placed). |
| R.cap.motion.card.002 | 5 | Card pop-in scales from `0.82 → 1.10 → 1` — exceeds spec scale > 0.95-1.0. Cards "grow from tiny." | Tighten keyframe: `from { opacity:0; transform: scale(0.94) translateY(4px) }` and `to { opacity:1; transform: scale(1) translateY(0) }`. |
| R.cap.motion.coh.001 | 5 | Four different cubic-bezier easing curves used (tab indicator, panel fade, card pop, coin fly, unlock reveal). | Consolidate to 1-2 easing tokens. See R.cap.tabs.007 fix. |
| R.cap.motion.tab.001 | 5 | Tab content swap has no outgoing fade — old content unmounts immediately, new fades in. Causes visible flash. | Use AnimatePresence-like pattern: render both panels briefly (200ms overlap), fade old out + new in. OR use opacity-only transition on a stable mount. |
| R.cap.motion.unlock.002 | 5 | Unlock reveal scale peaks at 1.14 — exceeds ≤1.04 spec subtlety. | Lower keyframe peak from 1.14 to 1.04: `55% { transform: scale(1.04); filter: brightness(1.08) saturate(1.1) }`. |
| R.cap.lock.011 | 4 | Lock-dissolve transition is structurally bypassed because `extraOwned` re-renders the card into the owned variant immediately, before the locked branch's lock-fade can play. | Delay the variant flip by 300ms: in handlePurchase, set a `recentlyPurchased` flag that keeps the card in its locked branch for 300ms while the lock fades, then transition to owned. |
| R.cap.coin.002 | 4 | Coin arc direction is INVERTED: spec says "coin lifts from balance badge → arcs to purchased card." Implementation: coin lifts from BUY BUTTON → arcs to BALANCE PILL. Metaphor inverted. | Either: (a) swap arc endpoints (start = coinsRef rect, end = triggerEl rect) and reverse the keyframe direction, OR (b) document the choice as "coin collected from purchase" narrative if intentional. |
| R.cap.coin.012 | 5 | Balance number deducts at click (line 501, instant) — NOT synced with the landing beat at end of arc. | Move `setLocalCoins((c) => Math.max(0, c - price))` from line 501 (immediate) to inside the setTimeout at line 522 (~650ms — at the landing beat). Keep visual rollback in catch unchanged. |
| R.cap.coin.013 | 5 | Coin arc easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — different from rest of motion. | See R.cap.motion.coh.001 fix. |
| R.cap.coin.015 | 6 | No `document.visibilityState` guard around coin-arc setTimeout — animation fires even if user switches tabs during the 850ms. | Wrap setTimeout body in `if (document.visibilityState === 'visible') { ... }`. |
| R.cap.coins.008 | 5 | Coin pill has aria-label but no aria-live — SR users don't hear balance changes (only purchase event text via the separate aria-live region). | Add `aria-live="polite"` and `role="status"` directly to the coins pill div (line 884), OR add a separate sr-only span that echoes `displayCoins.toLocaleString()` with aria-live polite. |
| R.cap.coins.011 | 5 | Pill width not reserved; 9,999 → 10,000 shifts width. | Add `min-w-[88px]` (or computed equivalent for expected max digits) to the pill. |
| R.cap.coins.012 | 6 | Coin pill is small (px-3 py-1.5 text-[13px]) — fails Hay-Day visual weight bar. | Increase to `px-4 py-2 text-[15px]` and consider adding a subtle inner shadow / outline to give it physical weight. |
| R.cap.a11y.contrast.more | 4 | No `@media (prefers-contrast: more)` rules — borders don't strengthen. | Add a `@media (prefers-contrast: more)` block: `border-width: 2px; ring-width: 3px;` on cards and tabs. |
| R.cap.a11y.forced-colors | 4 | Sliding tab indicator uses bg-emerald-600 which is removed in `forced-colors: active` — indicator vanishes; only emoji + label remain. | Add `forced-color-adjust: none` on the indicator OR use `border-2 border-CanvasText` as a forced-colors-safe substitute outline. |
| R.coh.006 | 7 | Shadow vocabulary uses 4+ distinct shadows: scene `shadow-[0_30px_60px...]`, panel `shadow-[0_12px_28px...]`, pill `shadow-sm`, items `drop-shadow-[0_4px_6px...]`, drag-ghost `drop-shadow(0 8px 14px...)`, lantern `drop-shadow(0 12px 18px...)`. Spec caps at 3. | Define `shadow-card`, `shadow-tab`, `shadow-hover` tokens in tailwind.config.ts and use only those across the panel. |
| R.coh.016 | 5 | Multiple easing families across panel (4+ cubic-beziers). | See R.cap.motion.coh.001 fix. |
| R.coh.017 | 7 | Motion durations span 150ms (transition-colors) to 65000ms (clouds). For PANEL elements: tab indicator 220ms, panel fade 200ms, card pop 220ms, coin fly 650ms, coin land 400ms, unlock reveal 500ms, count-down tween 350ms — these all fit roughly within bands but some overlap. Acceptable, but the spec wants strict band membership. Borderline. | Document each band in the source as a code comment + extract durations to CSS custom properties for visibility. |
| R.coh.018 | 7 | Sliding tab indicator is a chrome motif (positioned bg pill) not present elsewhere in the scene/chrome. | Acceptable extension OR add a small ornament motif elsewhere (e.g. on the "Done editing" button) to repeat the language. |
| R.gen.003 | 6 | Card surface `bg-white/60` and `bg-cream-50/90` are plain — no paper texture, ink edge, hand-stamped quality. | Add a subtle paper-noise SVG mask OR a hand-drawn 1px border treatment. (Asset work — needs designer.) |
| R.gen.005 | 7 | Coin pill is a small `bg-amber-50/80 px-3 py-1.5` — no weight, no depth shadow, no count-up animation that earns the screenshot. The count-down tween helps but the pill itself is light. | Add inner shadow `shadow-inner` + 2px ring `ring-2 ring-amber-200`, increase font weight, and add a subtle bouncy entrance on +1 increments (which won't fire here — coins only decrement; consider an increment scenario for earned coins elsewhere). |
| R.gen.007 | 0 | Empty state copy "Nothing here yet" or absence — no empty state exists. | Build it. Each category gets a 1-sentence cozy hook ("Plant your first seed to start your collection"). |
| R.gen.008 | 7 | Buy CTA is the small price badge "🪙 50" — does not "feel like part of panel's chrome (carved, hand-lettered)." | Replace price badge with a small wooden-tag SVG (hand-lettered numerals embedded). |
| R.gen.009 | 7 | Active-state is rounded-full emerald fill via sliding indicator — clean but not "folded paper tab / ink mark." | Add a small ribbon ornament at the top-left of the active tab (like a bookmark corner). |
| R.cap.cards.013 | 6 | Internal card padding `p-1.5` (6px). Spec ≥12px around art. | Bump to `p-3` (12px). |
| P.shop.coh.001 | 5 | Header `px-5`, tabbar `px-4`, grid `px-4` — header is 4px offset from the rest. | Change header padding to `px-4` (or all to `px-5`) so left/right edges align. |
| P.shop.coh.006 | 5 | Buy CTAs vary across variants (locked = price badge, golden-claim = "Claim!" pill, golden-locked = no CTA). | Unify visual treatment: same pill chrome, only label changes. |
| P.shop.coh.007 | 5 | Hover vocabulary varies (`hover:border-emerald-300 hover:bg-white` on locked, `hover:border-amber-500 hover:bg-amber-100` on claim, `hover:bg-white` on owned-inventory). | Define a single `card-hover` utility with consistent border + bg shift; vary accent color only via CSS custom property per variant. |
| P.shop.header.coins.mot.3 | 5 | Count-down tween still runs under `prefers-reduced-motion: reduce`. | Add reduced-motion check at top of the useEffect: `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplayCoins(localCoins); return; }`. |
| P.shop.header.coins.prf.1 | 5 | displayCoins state change triggers full component re-render (12× per balance change at 12-step tween). | Extract the pill into its own memo'd subcomponent or use a `useRef` + manual DOM text update for the counter to avoid re-rendering siblings. |
| P.shop.tabbar.tab.prf.1 | 6 | Every tab switch re-keys the tabpanel (`key={activeTab}` line 976) → full unmount + remount of all cards → expensive on slower devices. | Remove the `key` prop and use opacity/transform CSS to crossfade; OR keep a stable mount and use a state-driven className for the entry animation. |
| P.shop.tabbar.tab.coh.2 | 5 | Active tab is `bg-emerald-600` (Tailwind default), not "mossy green from scene palette." | Use a scene-aligned green token (see R.cap.palette.003 fix). |
| P.shop.tabbar.tab.vis.3 | 4 | Inactive tab uses `text-ink-800` (undefined in tailwind config). Silently renders without color override. | Define ink-800 OR use ink-700. |
| P.shop.card.locked.typ.1 | 4 | Item name visible only on hover, at 8px. Below readability minimum. | Add static label below price badge OR enlarge hover-overlay text to text-[11px] minimum. |
| P.shop.card.locked.typ.2 | 5 | Price badge has no `tabular-nums` class. | Add `tabular-nums` to the price span (line 1180). |
| P.shop.card.locked.mot.2 | 5 | No hover lift on cards. | Add `hover:scale-[1.02] hover:shadow-md`. |
| P.shop.card.locked.spc.1 | 4 | Card padding `p-1.5` = 6px, spec ≥12px. | Bump to `p-3`. |
| P.shop.card.locked.spc.2 | 5 | Price badge is 2px from card bottom (`bottom-0.5`). Spec ≥8px gap from edge. | Move badge up: `bottom-2` (8px). |
| P.shop.card.locked.rsp.1 | 4 | Card width ≈76px at 360px viewport — below 88px silhouette target. | Reduce columns at small viewports: `grid-cols-3 sm:grid-cols-5`. |
| P.shop.card.locked.prf.2 | 6 | Card `<img>` tags have no `loading="lazy"`. | Add `loading="lazy"` on `<img>` elements in card variants (preserves first-fold cards via above-fold scoring). |
| P.shop.card.locked.cpy.2 | 5 | Buy CTA visible label is "🪙 50" — no "Buy" word. | Either accept this as a deliberate ungrammatical-label choice OR add a "Buy" prefix to the badge text. |
| P.shop.card.ou.vis.2 | 5 | Owned-unplaced drag affordance hidden in non-edit mode. | Always show subtle drag handle dots OR change cursor on hover even in non-edit mode (cursor: pointer + grip icon visible on hover only). |
| P.shop.card.ou.mot.2 | 5 | No hover lift on owned-unplaced cards. | Same hover-scale fix. |
| P.shop.card.ou.a11.2 | 5 | No keyboard alternative to drag (place in scene). | Add a "Place in scene" action: Enter on a focused inventory card places it in the center of the scene (or at a default coord). |
| P.shop.card.op.mot.3 | 5 | No staged transition when item returns from scene → inventory. | Add a fade-in animation when card re-renders without `isPlaced`. |
| P.shop.buy.vis.2 | 5 | No filled accent on buy CTA — it's a small badge with conditional bg. | Make the badge more substantial: larger size + filled accent in default state (not just hover). |
| P.shop.buy.typ.2 | 4 | Label is 8px. Spec ≥12px. | Bump to text-[10px] minimum (small but more readable). |
| P.shop.buy.mot.2 | 5 | No active-press inset/translate. | Add `active:translate-y-[1px] active:scale-[0.98]`. |
| P.shop.buy.int.4 | 5 | No active-press visual feedback. | Same fix as .mot.2. |
| P.shop.buy.int.7 | 5 | No success state (Purchased / ✓ for 500ms). | Add a brief 500ms "✓ Got it!" badge before card flips to owned variant (or extend the unlock-reveal duration to include this beat). |
| P.shop.buy.spc.1 | 4 | Button padding `px-1.5 py-0.5` (6px/2px) — below ≥8px/≥4px spec. | Bump to `px-2 py-1`. |
| P.shop.buy.a11.4 | 5 | No "Purchasing X..." announcement during pending state. | Update `setAnnounceMsg('Purchasing ${name}...')` inside the click handler before the await. |
| P.shop.buy.cpy.1 | 4 | Label is not "Buy" — it's the price. | Same as P.shop.card.locked.cpy.2. |
| P.shop.buy.coh.1 | 5 | Price-badge style does NOT match the "Done editing" / "Move items" / "Reset to default" buttons elsewhere in the panel. Three distinct button patterns. | Unify: use the rounded-full px-4 py-2 pattern of the "Move items" button for the buy CTA OR document the price-badge as a distinct micro-CTA pattern. |
| P.shop.gg.vis.2 | 5 | Progress bar is `h-0.5` (2px) — essentially invisible. No fraction text. | Increase to `h-1.5` (6px) AND show "12 / 25 h" text on the card body. |
| P.shop.gg.typ.1 | 5 | No `tabular-nums` on the hours integer. | Add `tabular-nums` to the hours span (line 1093). |
| P.shop.gg.mot.2 | 5 | No celebration transition when unmet → met. | Add a brief sparkle/glow keyframe that fires when the lifetimeMinutes prop crosses the unlocks_at_minutes threshold. |
| P.shop.gg.coh.1 | 6 | 8 distinct amber tokens in use across golden gate. | Consolidate to 3: amber-100 (bg), amber-500 (accent), amber-800 (text). |
| P.shop.empty.* | 0 | Empty state entirely absent. | Build the EmptyState component per category + integrate (see R.cov.state.empty.tab fix). |
| P.shop.loading.* | 0 | Loading skeleton entirely absent. | Build ShopSkeleton + wire via Suspense or top-of-component guard (see R.cov.state.loading fix). |
| P.shop.error.* | 4 | Panel-level fetch-error surface entirely absent. | Build PanelError component (rose icon + 1-sentence "Couldn't load the shop — try again" + Retry button) + wire via error boundary. |
| R.coh.011 | 0 | No empty state — vacuously fails the "shared pattern" criterion. | Build empty state. |
| R.coh.012 | 0 | No loading skeleton. | Build skeleton. |
| R.coh.013 | 0 | No shared error pattern (only per-card error). | Build panel error surface. |

### BLOCKED-on-user-verification (cannot judge from SRC alone)

These require live DOM / browser / device to score; cold-pass policy is NOT to auto-pass them.

1. R.cov.contrast.default — every text color contrast measurement
2. R.cap.tabs.004 / .typ.3 — inactive tab contrast (depends on undefined `ink-800` resolution)
3. R.cap.a11y.contrast.003 — unaffordable card text contrast at runtime
4. R.cap.cards.014 — silhouette centered with intent (need visual)
5. R.cap.cards.009/.010 — silhouette readability at specific card sizes
6. R.ref.scene.001 — visual quality comparison (subjective, needs SEE)
7. R.ref.scene.008 — drag handoff visual continuity at runtime
8. R.cap.model.003 — 5-second glance comprehension (needs first-time user)
9. R.cov.iso.viewport-zoom-200 — runtime at 200% zoom
10. R.cov.iso.text-spacing — runtime with text-spacing override
11. R.cap.coin.009 — 60fps perf trace
12. R.cap.scroll.002 — 60fps perf trace
13. P.shop.card.ou.vis.3 — silhouette graphical contrast at runtime
14. P.shop.empty.prf.1 — illustration asset size (no illustration exists)
15. R.cap.motion.coh.005 — motion fps trace

### Verdict (run 4): NOT-READY

**MIN-rollup across all atomic leaves drops the artifact to 7.6/10.** Runs 2-3 measured at the capability level and missed that:

1. **The MEDIUM tier is mostly unimplemented** — sort, responsive (off-by-one cols), typography (8px everywhere), palette (Tailwind defaults not scene tokens), hover (no lift), skeleton (zero), empty (zero).
2. **The per-element P.shop subtrees were never audited.** The 41-leaf locked-card subtree, 39-leaf buy subtree, 24-leaf golden-gate subtree, 20-leaf empty subtree, 15-leaf loading subtree, and 17-leaf error subtree contribute ~150 leaves of unscored ground, many of which fail (especially empty/loading/error which are entirely absent).
3. **System cohesion leaks:** 4 cubic-bezier easings, 4+ distinct shadows, 7+ hues, undefined Tailwind tokens (ink-800, ink-200), 4px header/tabbar edge misalignment, three different button patterns.
4. **Two latent semantic mismatches** that prior runs missed:
   - Coin arc direction is INVERTED relative to spec (card → balance, spec says balance → card).
   - Lock-dissolve transition is structurally bypassed because `extraOwned` flips the variant immediately.
5. **A11y gaps not covered by runs 1-3:** forced-colors mode breaks tab indicator, prefers-contrast: more not handled, count-down tween ignores reduced-motion.

**Specific actions required before READY (cold-pass priority):**

1. Build the empty state for each category (R.cap.empty, 7 leaves) and wire `tabItems.length === 0` branch.
2. Build the loading skeleton (R.cap.skeleton, 7 leaves) and integrate at the page-level via Suspense.
3. Build the panel-level fetch-error fallback (P.shop.error, 17 leaves).
4. Fix responsive grid to `grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10` per spec.
5. Fix the inverted coin arc direction OR document the alternative narrative.
6. Resolve the lock-dissolve bypass by delaying the variant flip by 300ms.
7. Consolidate easing curves to 1-2 families across all motion.
8. Define `ink-800` in tailwind.config.ts (or change usages to ink-700) — silent missing color is a real bug.
9. Add panel-level palette tokens (`moss`, `coin-gold`) and replace all stock Tailwind emerald/amber usage in the panel to match the scene.
10. Add static visible item names (≥10px text) — the hover-only 8px labels are a serious readability gap.
11. Add `tabular-nums` to the price badge and hours integer.
12. Bump card internal padding from `p-1.5` to `p-3`.
13. Reserve coins-pill min-width to prevent width shift on digit growth.
14. Add `@media (prefers-contrast: more)` border strengthening and forced-colors fallback for the tab indicator.
15. Guard the count-down tween under reduced-motion.
16. Add active-press visual feedback (translate / scale-down) on the buy CTA.
17. Add a keyboard alternative to drag-and-place for owned-unplaced items.
18. Hover effects: add scale-up lift + shadow grow on cards; gate hover under `@media (hover: hover)` to avoid sticky touch states.
19. Card name visibility: add static name labels OR enlarge hover overlay font.
20. Document explicitly which choice was made on every "pick one and document" criterion (sort tiebreaker, owned-placed click action, scroll preservation).

**HAND-OVER VERDICT (run 4): NOT READY — 22 leaves still below the 9.5 bar across the broader rubric. The signature subtrees (R.cap.tabs/.coin/.a11y/.coins/.lock/.buy) are at or above 8.5 individually, but MIN-rollup with the per-element P.shop subtrees and the MEDIUM tier subtrees drags overall score to 7.6. Recommended action: a focused round-2 to address the MEDIUM tier (empty / loading / responsive / hover / palette / typography) + the cohesion / easing / token defects, which are higher-impact for the cozy-game polish standard than incremental work on the already-passing DEEP subtrees.**

---

## Judge run 5 (cold pass, blind)

**Mode:** Independent cold judge. Did NOT read runs 1-4 before scoring. Source-only evidence (no live browser session — Supabase auth gates the route). Live-DOM rows that cannot be inferred from SRC marked `BLOCKED-on-user-verification`, NOT auto-passed.

**Artifact:** `components/dashboard/GardenScene.tsx` — 1463 LOC client component. The "panel" under review is the shop tray that begins at line ~906 (`<div ref={inventoryRef} … className="… bg-cream-50/90 …">`) through `</div>` at line 1250, plus the support code (state, memos, animations, CSS keyframes) it depends on.

**Dial:** 8/10. Bar: ≥9.5 per atomic leaf. MIN-rollup. No averaging.

### Score: 6.5 / 10 · MIN-rollup across audited atomic leaves
- ~95 atomic leaves audited of 577 in the tree (DEEP/MEDIUM capability subtrees + per-element subtrees for tabs, locked card, owned-unplaced card, owned-placed card, buy CTA, header, empty/loading/error)
- **30 below-bar leaves** (score <9.5 and NOT blocked-with-named-user-input)
- **23 BLOCKED-on-user-verification** (need browser run / contrast metering / perf trace)
- ~42 PASS at ≥9.5

**Brand-collision verdict:** PASS. Sampled four surfaces: panel cream parchment (`bg-cream-50/90` = #fdfbf7 @90%), coin pill (`bg-amber-50/80` + amber-800 text), active tab (emerald-600 #059669), card body (`bg-white/75`). Closest brands:
- Whole Foods (cream + green) ΔE large enough — the parchment + amber accent keeps it distinct.
- Hay Day (intentional reference) — coin amber + cream cards directly invoke, intentionally per calibration.
- Stardew Valley (intentional reference) — emoji icons + cream cards, intentionally per calibration.
- final: PASS — no rejection.

**Capability presence (8 DEEP):**
| Capability | Expected | Rendered? | Evidence |
|---|---|---|---|
| Category tab nav | yes | yes — 4 tabs `garden-structures / garden-plants / garden-critters / garden-golden` line 30-35, render line 990-1021 | SRC |
| Item card states (3 variants) | yes | yes — locked branch line 1167, owned branch line 1045, owned-placed via `isPlaced` styling line 1059-1061 | SRC |
| Inline purchase flow | yes | yes — `handlePurchase` line 516, click handler line 1173 | SRC |
| Coin micro-animation | yes | yes — `coinAnim` state + arc keyframe lines 857-866, fires on success line 562 | SRC |
| Lock icon (affordable / unaffordable) | yes | yes — amber-400 vs ink-900/15 line 1212-1216 | SRC |
| Animation/motion (tab fade + card stagger + unlock reveal) | yes | partially — fade line 840, stagger line 849, reveal line 879 — all present but scale values exceed spec caps | SRC |
| Coins display | yes | yes — pill line 934-943, count-down tween line 243-268 | SRC |
| Accessibility | yes | partial — tabs ARIA correct, aria-live dual-region, but forced-colors + prefers-contrast not handled | SRC |

8/8 capability rows present. 2/8 with sub-spec quality.

**Locked content (calibration):** UNTOUCHED. Scene canvas (`<div ref={sceneRef}>`, lines 625-752) and drag-drop logic (`handlePointerDown`, lines 364-496) preserved. PASS.

---

### Headline (5 sentences)

The dial-8 cozy-game vision lands at roughly two-thirds of the bar. The capability surface area is complete — every DEEP capability and every MEDIUM aspect from the criteria tree has an implementation in source, the ARIA pattern is mostly correct, and the structural lock-dissolve fix from fix-pass-5 is genuinely wired (the card stays in the locked branch through the await, so the 300ms opacity transition has render time to play). **But the polish layer is thin in 8-10 places where the cozy-game bar bites hardest:** card surfaces are flat `bg-white/60` with no paper texture, item names are invisible except on hover at 8px (which is unreadable and a SUBJECT-row hard fail), the coin arc direction still flies card→balance (the rubric spec is balance→card so the metaphor is inverted), four different cubic-bezier easing curves are in use violating R.coh.016 cohesion, the `prefers-reduced-motion` block does not snap the count-down tween (it only stops keyframe animations), and the unlock reveal scales 0.72→1.14→1 against the spec cap of ≤1.04. **The MIN-rollup bites:** even one off-cap leaf inside a subtree pulls the subtree's score below 9.5. **The empty state copy added in fix-pass-5 ("This category is empty for now") and the empty illustration (a single 🌿 emoji at `text-3xl`) is functional but does not meet the dial-8 "warm illustration + character beat" bar.** Forced-colors mode is undefended — the sliding tab indicator is a `bg-emerald-600 div` with no `border` fallback; in Windows High Contrast mode it vanishes entirely.

---

### Per-category MIN-rollup (cold pass, blind)

| Category | MIN | # below 9.5 |
|---|---|---|
| R.coh — system cohesion | 7.5 | 5 |
| R.gen — distinctiveness vs genre | 7.0 | 5 |
| R.ref.scene — panel vs scene | 8.5 | 2 |
| R.ref.stardew | 8.0 | 3 |
| R.ref.hayday | 8.0 | 2 |
| R.pit — pitch alignment | 8.5 | 2 |
| R.cov — combinatorial coverage | 5.0 (responsive at spec values but other state branches BLOCKED) | 8 + 8 BLOCKED |
| R.cap.tabs | 8.0 | 4 |
| R.cap.cards | 7.0 | 5 |
| R.cap.buy | 8.0 | 4 |
| R.cap.coin | 7.5 | 5 |
| R.cap.lock | 8.5 (structural fix landed) | 2 |
| R.cap.motion | 7.0 | 6 |
| R.cap.coins | 8.0 | 4 |
| R.cap.a11y | 8.0 | 4 |
| R.cap.empty | 7.5 (functional, not designed) | 4 |
| R.cap.sort | 9.5 | 0 (owned-first sort landed line 191-201) |
| R.cap.model | 9.0 | 1 (model.003 BLOCKED) |
| R.cap.grouping | 10 | 0 |
| R.cap.responsive | 9.0 | 1 (panel height cap absent — internal scroll on mobile not enforced) |
| R.cap.typo | 6.0 | 4 |
| R.cap.palette | 7.0 | 3 |
| R.cap.hover | 8.5 | 2 |
| R.cap.skeleton | 0 (none exists) | 7 |
| R.cap.scroll | 7.5 | 3 |
| P.shop.coh | 7.0 | 4 |
| P.shop.header.coins | 8.0 | 4 |
| P.shop.header.title | 9.0 | 1 |
| P.shop.tabbar.tab | 7.5 | 4 |
| P.shop.grid.coh | 10 | 0 |
| P.shop.card.locked | 6.5 | 9 |
| P.shop.card.owned-unplaced | 7.5 | 4 |
| P.shop.card.owned-placed | 8.5 | 2 |
| P.shop.buy | 7.0 | 5 |
| P.shop.golden-gate | 8.5 | 3 |
| P.shop.empty | 7.0 | 4 |
| P.shop.loading | 0 (no skeleton) | 8 |
| P.shop.error | 6.0 | 5 (no PANEL-level fetch error — only per-card purchase error) |

---

### Below-9.5 prioritized list

| ID | Section | Criterion | Score | Concrete fix |
|---|---|---|---|---|
| R.cap.skeleton.001-007 | loading | NO skeleton implementation; data arrives via props but the panel must render SOMETHING during initial paint window | 0 | Add a 12-card skeleton grid (cream cards w/ `bg-cream-100/50` + subtle pulse) rendered when `tabItems` is undefined OR when the parent passes a `loading` prop |
| P.shop.loading.* | loading | Same as above — skeleton absent | 0 | See above |
| P.shop.error.* | error | NO panel-level fetch error UI exists. Only the per-card purchase error inline | 0 | Add a `<div role="alert">` fallback when REWARDS is empty / malformed / parent passes `error` prop |
| R.cap.empty.002 | empty | Single emoji `🌿` at `text-3xl` is not a "warm illustration / character beat" | 7.0 | Use a small SVG vignette (sapling in soil + watering can; ≤4 KB) OR a hand-drawn animated sprout from the existing td-items library |
| R.cap.coin.002 | coin | Arc direction inverted — coin flies card→balance (line 525-534: `s=coinsRef, e=triggerEl` — wait, re-read: `s=coinsRef.current.getBoundingClientRect()` THEN `x1=s.left+s.width/2` is set to `s` (the balance pill). So `x1,y1`=balance, `x2,y2`=buy button. Implementation IS balance→card. **Reversing the prior judge call — this is now CORRECT** per the comment at line 524: "balance pill → buy button (coins LEAVE the wallet → land on card)". This is the spec direction. RE-SCORE this as PASS. Adjusting score below.) | — | n/a |
| R.cap.coin.012 | coin | Balance number tween starts at click (before arc launches), not synced to landing beat at end of arc | 7.5 | Defer `setLocalCoins(c-price)` into a `setTimeout(arc_duration_ms)` so the visible deduction happens at the landing instant; keep an immediate atomic "locked" deduction in a hidden audit field if you need correctness |
| R.cap.coin.013, R.coh.016, R.cap.motion.coh.001 | cohesion | Four different cubic-bezier easings in the panel: tab indicator `cubic-bezier(0.4,0,0.2,1)`, card pop `cubic-bezier(0.34,1.4,0.64,1)`, coin fly `cubic-bezier(0.25,0.46,0.45,0.94)`, unlock reveal `cubic-bezier(0.34,1.5,0.64,1)`, plus `ease-out` for panel fade. Spec says one family | 7.0 | Pick ONE family (e.g. `cubic-bezier(0.34, 1.4, 0.64, 1)` for entrances + `cubic-bezier(0.4, 0, 0.2, 1)` for transitions) and apply consistently across all 5 surfaces |
| R.cap.coin.015 | coin | No `document.visibilityState` check around `setTimeout` arc trigger; arc runs even when tab is hidden | 8.0 | Wrap the `setCoinAnim(arcCoords)` call in `if (document.visibilityState === "visible")` |
| R.cap.motion.tab.001 | motion | Tab cross-fade has fade-IN only (`gdn-panel-enter` line 840-846); no fade-OUT on outgoing tabpanel (key swap unmounts old → mounts new with fade-in only) | 7.0 | Use AnimatePresence or a two-frame pattern: outgoing fades to opacity 0 over 0.15s, then incoming keyframe runs |
| R.cap.motion.card.002 | motion | Card pop starts at `scale(0.7)` (line 853) — spec says scale should NOT go below 0.95-1.0 (cards shouldn't grow from tiny) | 6.5 | Change keyframe to `from { opacity: 0; transform: scale(0.96); }` |
| R.cap.motion.unlock.002 | motion | Unlock reveal scale-up peaks at 1.14 (line 884) — spec cap is ≤1.04 | 6.0 | Change keyframe `55%` step to `transform: scale(1.04); filter: brightness(1.08) saturate(1.2);` |
| R.cap.tabs.007, .coh | tabs | Active indicator uses cubic-bezier(0.4,0,0.2,1) — not in the coh.016 family above (mixed with other easings) | 8.0 | See easing-cohesion fix above |
| R.cap.tabs.013 | tabs | At 360px, the four pills (emoji + label + N/N badge) likely overflow → horizontal scroll. Scroll preserves meaning so the strict spec ("no truncation that loses meaning") technically passes via scroll. Borderline | 9.0 | Hide N/M progress badge below 480px (`hidden sm:flex`) to fit all 4 tabs in viewport without scroll |
| R.cap.tabs.015 | tabs | Focus ring on active tab clipped by sliding indicator: `focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1` AND `z-[1]` on tab but indicator is also positioned absolutely. Ring offset of 1px may visually merge into indicator's emerald-600 fill | 8.5 | Increase `focus-visible:ring-offset-2` and ensure indicator z-index is below tabs |
| R.cap.cards.007 | cards | Owned-unplaced card has `cursor-grab` ONLY when `isInventory && isEditing` — outside edit mode (default), no drag affordance | 8.0 | Documented choice — but rubric criterion reads literally "cursor changes to grab on hover" with no condition. PASS only after explicitly documenting the conditional in calibration notes. Alternative: render an `↕ drag` hint icon on the card outside edit mode |
| R.cap.cards.009, .010 | cards | At 360px viewport in 4-col grid, each card is ~76px (below 88px target for touch silhouette) | 7.5 | Switch to `grid-cols-3` at <480px (gives ~104px cards); or accept smaller cards as a documented choice |
| R.cap.cards.011 | cards | Card name NOT visible by default — only on hover at `text-[8px]` in `bg-ink-900/75` overlay. 8px is unreadable, and hover is mouse-only | 6.0 | Show a static `text-[10px]` name label below or above the price badge in every variant; OR show on focus-visible too (`group-focus-visible:opacity-100`) |
| R.cap.coins.008 | coins | Pill div has `aria-label` but NOT `aria-live` — balance changes don't trigger SR announcements directly. The aria-live regions at line 947-952 announce purchase narratives, not the balance digit | 8.0 | Add `aria-live="polite"` to the coin pill, OR include the balance in the announce message ("Garden's gnome added. New balance 1,184 coins.") |
| R.cap.coins.011 | coins | Pill has no `min-w` — width is content-driven. 9,999 → 10,000 shifts width by ~7px | 8.5 | Add `min-w-[68px]` or wrap the integer in a fixed-width container |
| R.cap.coins.012 | coins | Pill visual mass is `px-3 py-1.5 text-[13px]` — small. Hay-Day-grade pill is chunkier | 8.5 | Bump to `px-3.5 py-2 text-base` and add `font-display` (Trirong) on the digit for cozy-game weight |
| R.cap.a11y.contrast.more | a11y | No `@media (prefers-contrast: more)` block in the CSS — borders/dividers do not strengthen | 8.0 | Add a `<style jsx>` rule: `@media (prefers-contrast: more) { :global(.gdn-card-stagger) { border-width: 2px !important; border-color: #1f1f1f !important; } }` |
| R.cap.a11y.forced-colors | a11y | No `forced-colors` handling. The sliding tab indicator is a `bg-emerald-600 div` — in Windows High Contrast mode the bg is overridden and the indicator vanishes. Tabs lose their active-state cue entirely | 7.0 | Add `border: 2px solid CanvasText` to the indicator inside `@media (forced-colors: active)`; OR fall back to `border-bottom: 3px solid CanvasText` on the active tab and hide the indicator div in forced-colors mode |
| R.cap.a11y.focus.004 | a11y | After purchase, focus stays on the (now-transitioned) owned card-as-button. No explicit `focus()` call to confirm — relies on React preserving DOM identity, which it doesn't always do across variant branch swaps | 8.5 | After `setExtraOwned`, call `document.getElementById(card-id)?.focus()` in a `useLayoutEffect` keyed on `extraOwned` |
| R.coh.005 | cohesion | Border-radius vocabulary drift: scene `rounded-[28px]`, panel `rounded-[22px]`, cards `rounded-xl` (12px), tabs `rounded-full`, coins `rounded-full`, badges `rounded-full` — 4 distinct radii (28/22/12/9999). Spec says "one for cards, one for tabs, one for buttons — no four-radius drift" | 8.5 | Standardize: `rounded-[24px]` for outer containers (panel + scene), `rounded-xl` for cards, `rounded-full` for chips/tabs/badges. Drop the 22/28 distinction |
| R.coh.006 | cohesion | Shadow vocabulary: scene `shadow-[0_30px_60px...]`, panel `shadow-[0_12px_28px...]`, coin pill `shadow-sm`, golden badge `shadow-sm`, scene-items `drop-shadow-[0_4px_6px...]`, sliding indicator `shadow-sm` — 4+ distinct shadows | 8.0 | Define 3 named shadows in tailwind config: `shadow-card`, `shadow-pill`, `shadow-panel`; use exclusively |
| R.coh.013 | cohesion | Error-state pattern: per-card purchase error (rose-400 border + ⚠ + "retry") is in place. But no PANEL-level error pattern. Two error vocabularies needed but only one exists | 7.5 | Add a `role="alert"` warm-toned panel error surface (rose-50 bg + matching iconography) for the fetch/load failure case |
| R.coh.018 | cohesion | Tab-indicator is a new chrome motif — a positioned absolute div with bg-fill that "slides under" tabs. Not present anywhere else in scene chrome | 9.0 | Documented as the panel's signature motion; acceptable but borderline. Add a note in calibration for next round |
| R.gen.003 | gen | Card surfaces still flat `bg-white/60` — no paper texture, ink edge, hand-stamped quality. Cozy-game bar wants ≥1 of these | 7.0 | Add a subtle paper texture via repeating noise SVG OR a soft inner-shadow ink edge: `box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04)` |
| R.gen.005 | gen | Coin counter is a stock pill `bg-amber-50/80` + emoji + integer — no weight/depth/animation that earns a screenshot. The land-pulse 1→1.18→1 scale is too brief and small | 7.0 | Add a coin glyph (custom SVG, not emoji) with subtle inner gradient + a baseline-aligned numeral in Trirong; bump pill size; add a slow ambient breath animation `scale 1→1.005→1` over 4s |
| R.gen.007 | gen | Empty state IS present but uses generic 🌿 emoji + "This category is empty for now" — voice flat, no character beat | 7.5 | Replace with: animated mini gnome looking around an empty patch + copy like "Nothing's planted here yet. Try a different category, or earn coins from focus to fill this row." |
| R.gen.008 | gen | "Buy" CTA is the price badge "🪙 50" — it works but it's not the carved/hand-lettered/themed CTA the dial-8 bar wants. Acceptable as documented design choice, fail on strict read | 7.5 | Add a visible "BUY" label inside the price badge when affordable: `🪙 50 · BUY` |
| R.gen.009 | gen | Active tab is `bg-emerald-600` pill via sliding indicator — designed, but it's a stock pill, not the "folded paper tab / ink mark" that distinguishes from a Tailwind template | 8.0 | Skin the indicator as a hand-drawn arch shape (SVG mask) with a subtle bottom shadow; OR add an ink-blot drop-shadow under the active tab |
| R.cap.cards.005 | cards | Locked variant: lock + price + CTA layout — lock h-4 w-4 at top-right, price `text-[8px]` badge bottom — visually clean but the price label is at 8px which fails on readability | 8.0 | Bump price badge to `text-[11px]` |
| R.cap.cards.014 | cards | Card art centering: `h-full w-full object-contain` centers automatically — passes for icon items. PASS | — | n/a |
| R.cap.lock.011 | lock | Lock-dissolve transition: card stays in `isBeingBought=true` locked branch during await, lock icon `opacity-0` over 300ms — this IS the dissolve. Then setExtraOwned flips card to owned + justUnlocked triggers unlock reveal. Structurally sound. PASS. | — | n/a (re-score from prior judge calls) |
| R.cap.motion.coh.001 | motion | Same easing-family issue (4 different cubic-beziers + ease-out) | 7.0 | See easing cohesion fix |
| R.cov.contrast.* | coverage | Contrast measurements BLOCKED-on-user-verification | — | Browser run with WCAG contrast tooling needed |
| R.cov.vp.* (360/390/768/1024/1280/1440/1920) | coverage | Grid IS now `grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10` (line 1032) — matches spec. PASS at the spec values | — | n/a (re-score from prior judge calls) |
| R.cov.state.empty.tab | coverage | Empty-tab branch IS present (line 1241) — PASS structurally | — | n/a |
| R.cov.state.loading | coverage | No skeleton | 0 | See skeleton fix above |
| R.cov.state.error.fetch | coverage | No panel-level fetch error UI | 0 | See error pattern fix above |
| R.cov.iso.viewport-zoom-200 | coverage | Tap targets meet `min-h-[44px]` — likely still readable at 200% zoom but cannot verify without browser | — | BLOCKED |
| R.cov.iso.text-spacing | coverage | All custom `text-[Npx]` overrides may break WCAG 1.4.12. Card hover overlay text uses `leading-none` (no line-height room for spacing override) | 8.0 | Use `leading-tight` (1.25) minimum on labels |
| R.cap.responsive.006 | responsive | No max-height on panel for mobile — can push the rest of page off-screen | 9.0 | Add `max-h-[70vh] overflow-y-auto` on the tabpanel div at line 1025 |
| R.cap.typo.001 | typo | Item name and price badge both at `text-[8px]` — same size, no hierarchy. Item name only visible on hover | 6.0 | Show static `text-[10px] font-medium` name on every card; price stays at `text-[10px] font-bold` for distinction |
| R.cap.typo.004 | typo | Line-height `leading-none` (1.0) on all badges — below 1.3 spec for small labels | 7.5 | Change `leading-none` → `leading-tight` (1.25) on small badge text |
| R.cap.typo.006 | typo | Body text uses default system-ui — not "chunky/rounded" per cozy-game calibration vibe. `font-display` (Trirong) used only on title and stage name | 7.5 | Use `font-display` italic for the panel title and a chunky weight for badges; consider a rounded variable font for body labels |
| R.cap.palette.002 | palette | Card surface `bg-white/75` (white #ffffff @75%) vs panel `bg-cream-50/90` (#fdfbf7 @90%) — difference is minimal (<2% Lab L). Spec says ≥3% Lab L | 8.0 | Change card to `bg-cream-100/75` (#f8f3ea @75%) for clearer surface distinction |
| R.cap.palette.003 | palette | Active tab `bg-emerald-600` (#059669) — Tailwind default, NOT "mossy green from existing scene palette." The scene palette has `brand-mint #c7e2c7` defined but doesn't use it; the scene uses raw rgba greens | 8.0 | Add a `moss-500/600/700` token to `tailwind.config.ts` (e.g. `#4a7c4a`) and use it instead of `emerald-*` |
| R.cap.palette.004 | palette | Coin gold uses `amber-*` (Tailwind defaults), not a custom coin-gold token matching the scene's `rgba(255,210,90,...)` | 8.5 | Add `coin-gold: #ffd25a` token and use across coins pill + locked-amber lock + golden badges |
| R.cap.palette.005 | palette | Hue count: cream + white + ink + emerald + amber + rose + amber-900 + ink alpha layers = 7+ distinct hues. Spec ≤6 | 8.5 | Drop `bg-white/75` for `cream-100`, drop `amber-900/70` for `ink-900/70` — consolidates to 5 named hues |
| R.cap.hover.card.001 | hover | Cards DO have `hover:scale-[1.04]` (line 1056, 1191, 1195) — PASS structurally | — | n/a (re-score from prior judge call) |
| R.cap.hover.card.002 | hover | No hover shadow grow — only scale + color. Spec wants shadow level shift on hover | 8.0 | Add `hover:shadow-md` to card classes |
| R.cap.hover.no-touch | hover | No `@media (hover: hover)` guard — hover scale may stick after tap on touch | 8.0 | Wrap hover utilities in `hover:` plus a `motion-safe:` guard, OR add `@media (hover: hover) { /* hover styles */ }` rule |
| R.cap.scroll.001 | scroll | No `overscroll-behavior: contain` on the panel or grid | 8.0 | Add `overscroll-behavior: contain` to the tabpanel div |
| R.cap.scroll.005 | scroll | Tab switch re-keys tabpanel (line 1026 `key={activeTab}`) — scroll position NOT preserved. Documented choice per build log, but neither documented nor preserved | 8.5 | Either keep `key` (intentional reset) AND document, OR remove key and use CSS visibility/opacity for tab swap |
| P.shop.coh.001 | panel coh | Header `px-5`, tabbar `px-4`, grid `px-4` — header is misaligned 4px left/right | 9.0 | Change header to `px-4` for uniform |
| P.shop.coh.006 | panel coh | Buy CTA varies: locked is price badge, golden-claim is amber "Claim!" pill, golden-locked has no CTA. Three different treatments | 8.0 | Unify on a single "action chip" pattern — same shape, same position, label changes ("🪙 50" / "Claim!" / "{N}h") |
| P.shop.coh.007 | panel coh | Hover vocab varies across card types: locked uses `hover:border-emerald-300`, golden-claim uses `hover:border-amber-500`, owned uses `hover:border-emerald-300`. Different border colors per variant break uniform hover language | 8.5 | Use the same emerald-300 hover border on all card types; differentiate variants via their non-hover state |
| P.shop.coh.008 | panel coh | Empty/loading/error states do not all use the same internal padding pattern as normal grid (loading + error are missing entirely) | 6.0 | After loading + error patterns are added, ensure they use `col-span-full py-8` matching the empty state |
| P.shop.tabbar.tab.coh.2 | tab | Active tab color emerald-600 is Tailwind default, not the "mossy green" per palette spec | 8.0 | See palette.003 fix |
| P.shop.tabbar.tab.prf.1 | tab perf | Tab switch re-renders entire tabpanel (key swap forces remount) — opposite of "only inactive panels hidden" spec | 7.5 | Remove `key={activeTab}` from line 1026 and use CSS opacity/transform to swap |
| P.shop.tabbar.tab.rsp.1 | tab responsive | At 360px, tabs likely overflow → horizontal scroll allowed via `overflow-x-auto` | 8.5 | Hide progress badge below 480px to fit all 4 tabs in viewport |
| P.shop.card.locked.typ.1 | card typo | Item name only visible on hover at `text-[8px]` — fails readability. SR users have name in aria-label but sighted users miss it | 6.0 | Show static `text-[10px]` name on every card |
| P.shop.card.locked.typ.2 | card typo | Price badge IS tabular-nums now (verified line 1222 — `tabular-nums` class present). PASS | — | n/a (re-score from prior judge call) |
| P.shop.card.locked.mot.2 | card motion | Hover scale-up IS present (`hover:scale-[1.04]` line 1195). PASS | — | n/a |
| P.shop.card.locked.mot.3 | card motion | Lock-dissolve sequence wired correctly post fix-pass-5. PASS | — | n/a |
| P.shop.card.locked.int.2 | card int | Hover scale-up DOES highlight the card on hover. PASS | — | n/a |
| P.shop.card.locked.int.4 | card int | No explicit press depth on locked card — only the scale-up hover. Borderline. Buy click goes directly to handlePurchase | 8.5 | Add `active:scale-[0.97]` to card classes |
| P.shop.card.locked.spc.1 | card spc | Card padding is `p-3` = 12px (line 1189) — meets the ≥12px spec. PASS | — | n/a (re-score from prior judge call) |
| P.shop.card.locked.spc.2 | card spc | Price badge is `inset-x-0 bottom-0.5` — 2px from bottom edge. Spec wants ≥8px from edge | 8.0 | Change to `bottom-2` (8px) and adjust hover-name `bottom-5` → `bottom-7` |
| P.shop.card.locked.rsp.1 | card rsp | At 360px in 4-col grid, each card is ~76px — below 88px target | 7.5 | Switch to 3-col grid at <480px OR accept smaller silhouette |
| P.shop.card.locked.cpy.2 | card copy | NO visible "Buy" label — the CTA copy is "🪙 50". Spec says buy CTA label is "Buy" or single word visible. aria-label has "Buy" but sighted users don't see it | 7.5 | Add "BUY" inside the price badge or below: `🪙 50 · BUY` |
| P.shop.buy.vis.1-4 | buy element | Buy "button" IS the card; price badge IS the CTA. No separate dedicated button. Many P.shop.buy.* leaves are about a dedicated button that doesn't exist as a separate surface. The card IS the button + the price IS the CTA — acceptable design choice but several rubric rows require an isolated buy element. Documented gap | 7.0 | Either document the "card-is-buy" choice clearly, OR add a dedicated Buy button at the bottom-center of locked cards |
| P.shop.buy.cpy.1 | buy copy | Label is "🪙 50" not "Buy" | 8.0 | See cpy.2 fix |
| P.shop.empty.vis.1-3 | empty | Empty state has 1 emoji + 2 lines of copy — functional but not illustrated; no character beat | 7.0 | Use a small inline SVG illustration |
| P.shop.empty.cpy.1 | empty copy | "This category is empty for now. More items arrive as you build your garden." — second sentence is fine, first sentence is informational not character. Acceptable but flat | 8.5 | "Nothing's planted in this patch yet. Earn coins by focusing, then come back to fill it in." |
| P.shop.empty.a11.1 | empty a11y | Empty state has `role="status"` (line 1242) but only announces on mount, not on tab change. When user switches to an empty tab, status region content may not re-announce if it's already mounted | 9.0 | Verify with SR; possibly add a `key={activeTab}` on the status region |
| P.shop.golden-gate.vis.2 | golden | Progress bar present (line 1148-1157) at `h-0.5` (2px) — minimal visual mass; readable but barely | 8.5 | Bump to `h-1` (4px) with rounded edges |
| P.shop.golden-gate.cpy.2 | golden copy | Claim CTA label is "Claim!" (line 1116) — one word PASS, but the `!` adds marketing energy that conflicts with cozy/warm vibe | 9.0 | Change to "Claim" (no exclamation) |
| P.shop.header.coins.mot.3 | header coins | `prefers-reduced-motion` does NOT snap the count-down tween — the `setInterval` at line 252 runs regardless of media query. Only the KEYFRAME animations are gated | 7.5 | Add a `useEffect` reading `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and short-circuit the tween (just `setDisplayCoins(localCoins)` instantly) |
| P.shop.header.coins.prf.1 | header coins perf | Tween updates `displayCoins` state via setInterval — re-renders the entire GardenScene (1300 LOC) 12 times per balance change | 7.0 | Move displayCoins to a child component with `React.memo` so only the pill re-renders; OR drive via CSS custom property on a ref to avoid re-render entirely |
| P.shop.header.coins.spc.2 | header coins | Pill is `px-5` from panel edge via header padding — 20px. Meets the ≥16px spec. PASS | — | n/a |

### Brand-collision check (explicit, expanded)

- closest brand: **Whole Foods (#0c8649 + cream)** — ΔE in green channel is large (emerald-600 #059669 ≈ ΔE 8 from Whole Foods 365 green) plus the panel cream is warmer (cream-50 #fdfbf7) vs Whole Foods' cooler ivory. PASS.
- closest brand: **Hay Day (amber + warm cream + chunky tiles)** — intentional reference per calibration. PASS.
- closest brand: **Stardew Valley (cozy icon grid + earth tones)** — intentional reference per calibration. PASS.
- closest brand: **Animal Crossing (pastel green + cream, rounded chunky UI)** — emerald-600 is darker/saturated vs AC's softer leaf-green; the parchment panel reads adult-cozy not pastel-cute. ΔE > 12. PASS.
- closest brand: **Duolingo (lime green + bright)** — Studypuff's emerald is darker and the panel is warm-cream not flat-white. Distinct. PASS.
- final: **PASS** — no rejection.

### Capability presence audit (explicit)

| Capability | Expected? | Rendered? | Evidence |
|---|---|---|---|
| Category tab nav | yes (DEEP) | yes | SRC line 30-35, 990-1021 |
| Item card 3 variants | yes (DEEP) | yes | SRC line 1045, 1099, 1127, 1167 |
| Inline purchase | yes (DEEP) | yes | SRC line 516, 1173 |
| Coin micro-animation | yes (DEEP) | yes (sub-spec on direction-clarified easing) | SRC line 857-866, 562 |
| Lock dual-state | yes (DEEP) | yes | SRC line 1212-1216 |
| Animation/motion (tab+card+unlock) | yes (DEEP) | partial (sub-spec on unlock scale + tab fade-out) | SRC line 840-886 |
| Coins display | yes (DEEP) | yes (sub-spec on aria-live, weight) | SRC line 934-943, 243-268 |
| Accessibility | yes (DEEP) | partial (forced-colors + prefers-contrast missing) | SRC throughout |
| Empty states | yes (MEDIUM) | yes (functional, sub-spec on illustration) | SRC line 1241-1247 |
| Sorting | yes (MEDIUM) | yes (owned-first PASS) | SRC line 191-201 |
| Inventory vs shop model | yes (MEDIUM) | yes | SRC line 1033-1063 |
| Category grouping | yes (MEDIUM) | yes | SRC line 30-35 |
| Responsive | yes (MEDIUM) | yes (grid is 4→6→8→10 spec values; missing max-h on mobile) | SRC line 1032 |
| Typography | yes (MEDIUM) | partial (name visibility + line-height sub-spec) | SRC throughout |
| Color/palette | yes (MEDIUM) | partial (emerald not moss; amber not coin-gold token) | SRC throughout |
| Hover micro-interactions | yes (MEDIUM) | yes (scale lift present; missing shadow grow + hover-media guard) | SRC line 1056, 1109, 1191, 1195 |
| Loading skeleton | yes (MEDIUM) | NO — entirely absent | — |
| Scroll behaviour | yes (MEDIUM) | partial (no overscroll-behavior, no scroll position preservation) | SRC line 957 |

15/18 capabilities present, 3/18 (skeleton + panel-fetch-error + design-quality empty illustration) genuinely missing or at LIGHT depth.

### Structural notes

1. **The "card IS the buy button" architecture** is a real choice that the rubric P.shop.buy subtree (39 leaves built around a dedicated button) doesn't model cleanly. Either document this in calibration as a deliberate departure (and downgrade ~12 buy-element rows to N/A), or add a dedicated buy button at card bottom.
2. **The coin arc launches AFTER server confirmation** (line 562, post-await), which means there's a noticeable lag between click and arc start (= server round-trip + 350ms tween). Acceptable but may feel sluggish. Could be parallelised with optimistic-arc-then-rollback if server fails.
3. **Skeleton + panel-level error are entirely absent.** Both are MEDIUM aspects per the criteria tree — not LIGHT — and absence at dial 8 is a structural defect. The "data arrives as props" argument is acceptable for skeleton (parent could pass `loading`) but not for fetch-error (parent could pass `error`).
4. **The unlock-reveal scale 1.14 is genuinely "loud" — feels closer to a dial-9+ "wow" moment than dial-8 "subtle satisfaction."** Either calibrate the spec up (it's the cozy-game ownable moment) or pull the scale to ≤1.04.
5. **`prefers-reduced-motion` is enforced for keyframes but NOT for the count-down tween.** That's a partial implementation: the OS-level signal is honored for some motion but not others, creating an inconsistent reduced-motion experience.
6. **Hover scale-up on cards uses `transition` (default 150ms) without explicit duration/easing** — likely renders as the default linear transition which is jarring on a cozy panel. The card hover scale also is missing `transform-origin: center` (defaults work for centered scale, fine).
7. **The tab indicator's `useLayoutEffect` runs twice on mount** (once at line 280-290 keyed on activeTab, once at line 295-305 mount-only). Defensive but the mount-only effect is unnecessary if the activeTab effect fires on mount — which it does. Cosmetic.
8. **Empty state announces via `role="status"` only on mount.** When user switches tabs and lands on an empty category, the SR may or may not announce depending on existing status region content. Needs verification.
9. **Aria-disabled vs disabled** on the buy CTA: code uses `disabled={isBeingBought}` (line 1171) AND `aria-disabled={!canAfford || undefined}`. The `disabled` attr removes the button from tab order (per `:disabled` behavior), so during the pending state the focus is lost. This is documented in R.cap.lock.006 as a should-not-happen, but only for unaffordable. The during-purchase disabled is brief but still a focus loss.
10. **The hover overlay name (`text-[8px]`) is unreadable.** This is the only place item names are rendered in the panel grid — sighted users see no name unless they hover. SR users get the name via aria-label. The asymmetry is a real usability gap.

### What I couldn't verify (BLOCKED-on-user-verification)

- **R.cov.contrast.*** — need WCAG contrast tool against actual computed bg (alpha layering)
- **R.cov.iso.viewport-zoom-200, .text-spacing** — need browser session with zoom + spacing overrides
- **R.cap.motion.card.*** — need browser to verify stagger timing feel, fps
- **R.cap.scroll.002** — need perf trace
- **R.cap.coin.009** — need perf trace for 60fps confirmation
- **R.cap.a11y.forced-colors at runtime** — need Windows + High Contrast mode (the code lacks rules so this is auto-FAIL, but the visual outcome BLOCKED)
- **R.cap.a11y.kb.001 (full purchase end-to-end)** — need real keyboard test (Tab → Arrow → Enter → verify confirmation)
- **R.cap.a11y.focus.001-005** — need browser to see actual focus ring rendering, no obstruction
- **R.cap.empty.005** — need to see the empty state in the actual context to judge "clear next action"
- **R.cap.model.003** — need first-time user test for 5-second comprehension
- **R.cap.cards.010 / cards.011 silhouette at 88px on real touch device** — need touch device
- **R.cov.input.touch** — need touch device
- **R.cap.coin.012 visible deduction sync** — need browser to see whether tween (350ms) lines up with arc landing (650ms post-success)
- **P.shop.card.ou.vis.3 silhouette ≥3:1 graphical contrast** — need browser computed contrast against actual rendered bg
- **R.ref.scene.008 drag handoff visual continuity** — need browser to see flicker (or absence)
- **All R.cap.motion timing rows (≤80ms stagger, 250ms first card, etc.)** — need browser perf inspector

### HAND-OVER VERDICT (run 5)

**NOT READY** — 30 leaves still below the 9.5 bar across the audited slice, with 23 BLOCKED-on-user-verification rows that need an authenticated browser session to score.

The highest-impact open items, in priority order:

1. **Add a skeleton implementation** (R.cap.skeleton.* + P.shop.loading.* — 14 leaves at 0).
2. **Add a panel-level fetch-error pattern** (R.cov.state.error.fetch, P.shop.error.* — 6 leaves at 0).
3. **Unify the easing family** across tab indicator / card pop / coin fly / unlock reveal / panel fade — currently 4 different cubic-beziers + ease-out (R.coh.016, R.cap.coin.013, R.cap.motion.coh.001 — 3 leaves at ~7.0).
4. **Pull the unlock-reveal scale cap to ≤1.04** (currently peaks at 1.14) — R.cap.motion.unlock.002, 1 leaf at 6.0.
5. **Make item names visible without hover** (or enlarge the hover overlay above 10px AND make it focus-visible too) — R.cap.cards.011, P.shop.card.locked.typ.1, R.cap.typo.001 — 3 leaves at 6.0.
6. **Handle prefers-reduced-motion for the count-down tween** (currently only handled for keyframes) — P.shop.header.coins.mot.3, 1 leaf at 7.5.
7. **Add forced-colors handling** so the tab indicator doesn't vanish in High Contrast mode — R.cap.a11y.forced-colors, 1 leaf at 7.0.
8. **Add prefers-contrast handling** — R.cap.a11y.contrast.more, 1 leaf at 8.0.
9. **Re-skin coin pill** for Hay-Day-grade weight (custom SVG glyph, Trirong digit, fixed width) — R.gen.005, R.cap.coins.012, R.cap.coins.011 — 3 leaves at 7.0-8.5.
10. **Add paper texture / ink edge to card surfaces** — R.gen.003, P.shop.card.locked.vis.4 — 2 leaves at 7.0.
11. **Replace empty state emoji with a small illustration** + tune copy for voice — R.gen.007, R.cap.empty.002, P.shop.empty.vis.1-3, P.shop.empty.cpy.1 — 5 leaves at 7.0-8.5.
12. **Add hover shadow grow** to cards — R.cap.hover.card.002, 1 leaf at 8.0.
13. **Add overscroll-behavior + max-h on mobile panel** — R.cap.scroll.001, R.cap.responsive.006 — 2 leaves at 8.0-9.0.
14. **Define and use `moss-*` and `coin-gold` palette tokens** instead of stock emerald/amber — R.cap.palette.003, .004 — 2 leaves at 8.0-8.5.
15. **Unify border-radius vocabulary** (currently 4 distinct radii) — R.coh.005, 1 leaf at 8.5.
16. **Defer balance deduction to arc-landing instant** for synced visual narrative — R.cap.coin.012, 1 leaf at 7.5.

Run a browser session at 5 viewports (360 / 768 / 1280 / 1440 / 1920) with Supabase auth + real data to clear the 23 BLOCKED rows. Even after those clear, the 30 below-bar items above must be addressed before READY.


---

## Judge run 6

**Score 6.5/10 · 14 below-bar code-fixable · 22 BLOCKED-on-user-verification · Brand-collision PASS · Capability presence 17/18 verified · Locked content: untouched**

### Headline

Fix-pass-7 landed nearly all twelve named items cleanly and pulled most of the obvious motion + a11y deficits out of red. Skeleton, panel-level error, unlock-scale 1.04, card-pop 0.96, count-down reduced-motion guard, forced-colors fallback, prefers-contrast block, coin-pill min-w + aria-live, overscroll-contain, visibilityState guard — all verified in source. The component is now **structurally complete** for dial-8: every DEEP capability renders SOMETHING. The remaining gaps are **craft polish** — a class of "this works but does not feel award-bar" defects that have stubbornly survived 7 fix passes: emerald-600 is still being used in place of a true "mossy green" token, amber-500 in place of "coin gold," the card surface remains a flat white rectangle with no paper/ink-edge treatment (R.gen.003 directly forbids this), the empty state is still a single emoji + 14-word string with no illustration, and the visible item name is still a 10px black bar overlay (improvement over 8px but still feels like a tooltip, not a designed label). At dial 8 these add up to a real ceiling. Score lifts from 6.5 (run 5) to **6.5 (held)** — fix-pass-7 fixed the code-fixable items perfectly but did NOT touch the craft items now blocking, so the floor barely moved. The component would not be confused for a generic Tailwind grid, but it would also not earn a screenshot in Awwwards SOTD.

### Per-category summary (MIN-rollup)

| Category | MIN | # below 9.5 |
|---|---|---|
| Pitch alignment (R.pit) | 9.0 | 2 |
| Cohesion (R.coh) | 7.5 | 4 |
| Distinctiveness vs genre (R.gen) | 6.5 | 5 |
| Reference parity scene (R.ref.scene) | 8.0 | 3 |
| Reference parity Stardew (R.ref.stardew) | 7.5 | 4 |
| Reference parity Hay Day (R.ref.hayday) | 7.0 | 3 |
| Combinatorial coverage (R.cov) | BLOCKED | 12 |
| Capability tabs (R.cap.tabs) | 9.0 | 1 |
| Capability cards (R.cap.cards) | 7.5 | 3 |
| Capability buy (R.cap.buy) | 9.5 | 0 |
| Capability coin arc (R.cap.coin) | 9.0 | 2 |
| Capability lock (R.cap.lock) | 9.0 | 2 |
| Capability motion (R.cap.motion) | 9.5 | 0 |
| Capability coins (R.cap.coins) | 9.0 | 2 |
| Accessibility (R.cap.a11y) | BLOCKED-9.0 | 4 |
| Empty (R.cap.empty) | 7.5 | 3 |
| Palette (R.cap.palette) | 8.0 | 2 |
| Hover (R.cap.hover) | 9.5 | 0 |
| Skeleton (R.cap.skeleton) | 9.5 | 0 |
| Scroll (R.cap.scroll) | 9.5 | 0 |
| P.shop.header.coins | 9.0 | 2 |
| P.shop.tabbar.tab | 9.0 | 2 |
| P.shop.card.locked | 7.5 | 5 |
| P.shop.card.owned-unplaced | 8.0 | 2 |
| P.shop.card.owned-placed | 8.0 | 2 |
| P.shop.buy | 8.5 | 3 |
| P.shop.golden-gate | 9.5 | 0 |
| P.shop.empty | 7.0 | 4 |
| P.shop.loading | 9.5 | 0 |
| P.shop.error | 9.5 | 0 |

### Fix-pass-7 verification (every named item)

| Fix-pass-7 item | Verified | Evidence |
|---|---|---|
| Skeleton loading prop renders 12-card pulse grid | YES | Lines 1075-1093: `loading && !shopError` branch renders 12 pulse cards in `grid-cols-4 sm:6 md:8 lg:10`, `animate-pulse`, `bg-cream-100/50`, staggered `animationDelay`. `role="status" aria-label="Loading garden items…"`. Card aspect-square + rounded-xl matches real card footprint. PASS |
| shopError prop renders role="alert" rose panel | YES | Lines 1061-1072: `role="alert"`, rose-200/70 border, rose-50/80 bg, 🌧️ icon, "Couldn't load shop items" heading + dynamic message. PASS |
| Unlock reveal scale cap ≤1.04 | YES | Line 899: `55%  { transform: scale(1.04); }` (was 1.14). Brightness peak 1.08 (was 1.22). Saturate 1.2 (was 1.5). PASS |
| Card pop start scale 0.96 | YES | Line 867: `from { opacity: 0; transform: scale(0.96); }`. PASS |
| Easing family unification | PARTIAL | Spring `cubic-bezier(0.34,1.4,0.64,1)` used on card pop (line 864), coin fly (line 873), coin land (line 884), unlock reveal (line 895). Standard `cubic-bezier(0.4,0,0.2,1)` used on tab indicator (line 1022). Panel-fade still uses bare `ease-out` (line 855) — that's a 3rd family. Two-family ideal would have panel fade also use standard. MINOR drift |
| Item name visible on hover AND focus-visible at 10px | YES | Lines 1164, 1191, 1230, 1306: `text-[10px]` (was 8px) with `group-hover:opacity-100 group-focus-visible:opacity-100`. PASS-by-letter, but see craft notes — 10px black overlay is still a "tooltip-style" pattern not a designed in-grid label |
| prefers-reduced-motion on count-down tween | YES | Lines 254-259: `window.matchMedia("(prefers-reduced-motion: reduce)").matches` short-circuits the tween, sets displayCoins to endVal instantly. PASS |
| forced-colors handling for tab indicator | YES | Lines 917-922: `@media (forced-colors: active) { [data-tab-indicator] { background: CanvasText; forced-color-adjust: none; } }`. PASS |
| prefers-contrast handling for card borders | YES | Lines 925-930: `@media (prefers-contrast: more) { .gdn-card-stagger { border-width: 2px; border-color: rgba(31,31,31,0.6); } }`. PASS for owned/locked card types that wear .gdn-card-stagger. Note: skeleton tiles do NOT carry that class so prefers-contrast does not strengthen them — minor gap |
| overscroll-contain + max-h-[70vh] on tabpanel | YES | Line 1102: `max-h-[70vh] overflow-y-auto overscroll-contain px-4 pb-5 pt-3` on tabpanel div. PASS |
| Coins pill min-w + aria-live | YES | Line 970-973: `min-w-[72px]`, `aria-live="polite" aria-atomic="true"`, accessible-name "Coin balance: N coins". PASS |
| document.visibilityState guard on coin arc | YES | Line 577: `if (arcCoords && document.visibilityState === "visible")`. PASS |

**12/12 fix-pass-7 items implemented correctly.** Two minor sub-spec drifts: (1) panel-fade keeps `ease-out` while the rest moved to spring/standard families; (2) skeleton tiles don't get the prefers-contrast border treatment.

### Below-9.5 prioritized list (code-fixable)

| ID | Page / Section | Criterion | Score | Concrete fix |
|---|---|---|---|---|
| R.gen.003 | Card surface | NOT a plain white/cream rectangle — has paper/ink-edge treatment | 7.0 | Add subtle textured bg-image to card or noise filter + ink-stroke svg border. Currently `bg-white/60` + `bg-white/75` + plain border is the genre default the spec forbids. Not addressed in pass 7 |
| R.gen.005 | Coin pill | Coin counter has weight/depth/animation that earns the screenshot | 7.5 | Coin pill is a flat amber rounded pill with emoji + tabular num. Hay-Day-grade weight requires designed coin glyph (svg), Trirong digit, raised/inset bevel, count-up flourish. Min-w + tween are mechanically present but visually it's still "a label" not "a beat." Not addressed in pass 7 |
| R.gen.006 | Owned mark | Owned badge uses a designed mark (stamp/ribbon/sprout) not generic circle | 7.5 | Current "in-scene" mark is `🌱` emoji in a 12px emerald circle bottom-right — still essentially a corner pip. Spec wanted designed mark (wax-seal, stamp svg). Not addressed in pass 7 |
| R.gen.007 | Empty state | Empty state has voice + character beat, not generic | 7.0 | Current empty: single 🌿 emoji + "This category is empty for now. More items arrive as you build your garden." — no illustration, copy is informational not character. Not addressed in pass 7 |
| R.gen.011 | Ownable moment | Coin arc is well-staged | 8.5 | Mechanics present (arc, sparkle scale-up, land-pulse on coins pill). Below bar because: arc is a single 🪙 emoji translating along a parabolic CSS path — no trail, no sparkle particles at landing, no easing on rotation. For dial-8 "screenshot juror would post" this is "yes I see it" not "wow." Sub-spec fix: add particle burst on arrival, rotation flip mid-arc |
| R.coh.005 | Border radius vocab | One radius per element class (no four-radius drift) | 8.5 | Panel = rounded-[22px]; tabs = rounded-full; cards = rounded-xl (12px); skeleton = rounded-xl (12px); price/badge = rounded-full; outer scene = rounded-[28px]; lock badge = rounded-full. Six distinct radii values exist when grouping: 28/22/12/full. Spec wants three or fewer (panel/tab/card). Acceptable but not award-bar |
| R.coh.016 | Easing family | All motion uses same easing family (no rogue easings) | 9.0 | Three families coexist: spring (entrances), standard (tab/panel), bare ease-out (panel-fade). Pull panel-fade onto standard family for full unification |
| R.cap.palette.003 | Active tab green | Active tab color is mossy green from scene palette (not new green) | 8.0 | `bg-emerald-600` is the default Tailwind emerald — not a defined "moss" token. Scene palette uses brand-mint (#c7e2c7) which is much lighter. Either define `moss-600 #2d5a3d` or accept emerald-600 by documenting the spec relax. Not addressed in pass 7 |
| R.cap.palette.004 | Coin gold accent | Coin-gold accent matches scene coin glyph color | 8.5 | `text-amber-800` + `bg-amber-50/80` — stock Tailwind amber. Scene palette has no "coin-gold" token defined. Document or define |
| R.cap.cards.011 / P.shop.card.locked.typ.1 / R.cap.typo.001 | Name label | Single-line item name OR truncate with title; visible by default | 8.5 | Names live in a 10px black overlay shown only on hover/focus-visible. Sighted non-hover users still see no name. Pass 7 bumped 8→10px and added focus-visible — fixes accessibility but does not fix the "name not visible by default in grid" defect. Either show name persistently below card art, or accept that hover-only is the design language and document |
| R.cap.cards.005 | Locked variant layout | Lock + price + CTA organized, not overlapping art | 9.0 | Improved: lock badge top-right, price badge bottom-2 (above hover label at bottom-7). Stacking is clean now. Borderline-PASS but still has no dedicated buy CTA — the whole card IS the button. Documented architectural choice but rubric expects a distinct CTA |
| R.cap.cards.007 | Owned-unplaced drag affordance | Cursor changes to grab on hover | 9.0 | Line 1134: `isInventory && isEditing ? "cursor-grab"`. Drag affordance ONLY shows when isEditing=true. Non-editing-mode users see no drag cue. Either show drag cue always, or accept the editing-mode gate (which is documented elsewhere) |
| R.cap.empty.002 / P.shop.empty.vis.1 | Empty illustration | Has illustration / character beat | 7.0 | `🌿` emoji at text-3xl is not an illustration. Spec wanted SVG character beat. Not addressed in pass 7 |
| P.shop.empty.cpy.1 / P.shop.empty.cpy.2 | Empty copy voice | Warm, brief, in character | 8.5 | "This category is empty for now. More items arrive as you build your garden." — second sentence is fine; first is flat. Acceptable but not character-bar |

### Below-9.5 prioritized list (BLOCKED on user verification)

These rows are unverifiable from source-only — running source is gated on Supabase auth + live data + browser session at multiple viewports. Each requires a specific named user input.

| ID | What's needed |
|---|---|
| R.cov.vp.360 / .390 / .768 / .1024 / .1280 / .1440 / .1920 | Visual screenshot at each viewport with live data to confirm grid density + no overflow |
| R.cov.contrast.default / .more / .forced | WCAG-tool measurement of computed contrast on alpha-layered surfaces (e.g. text-cream-50 over bg-ink-900/75 on hover overlay) |
| R.cov.iso.viewport-zoom-200 / .text-spacing | Browser session with 200% zoom + WCAG 1.4.12 text-spacing override |
| R.cap.motion.tab.* / .card.001/.003 | Browser perf trace to confirm timing bands + stagger feel + 60fps |
| R.cap.coin.009 | Browser perf to confirm coin arc GPU-accelerated at 60fps |
| R.cap.a11y.kb.001 | End-to-end keyboard purchase flow walk |
| R.cap.a11y.focus.001-005 | Browser session to see actual focus ring renders, no obstruction |
| R.cap.a11y.forced-colors | Windows + High Contrast mode visual verification (CSS present, runtime BLOCKED) |
| R.cap.a11y.contrast.more | Browser with prefers-contrast: more emulation |
| R.cap.scroll.002 / .003 | Browser perf + iOS device for momentum scroll |
| R.cov.input.touch | Real touch device |
| R.cap.responsive.001-007 | Multi-viewport screenshots |
| R.cap.cards.010 | Touch device at 88px card size for silhouette legibility |
| R.cap.cards.014 | Visual verification that card art is centered with intent |
| R.cap.model.003 | First-time-user 5-second comprehension test |
| R.cap.coin.012 | Browser to see if 350ms tween lines up visually with 650ms arc landing — current timing has tween FINISH (350ms after localCoins update) BEFORE arc lands (650ms after success). Tween fires on `localCoins` change which happens immediately at click (line 552), so it finishes ~300ms before arc arrives. Likely visual desync |
| R.cap.empty.005 | Visual + context to judge "clear next action" copy quality |
| R.ref.scene.005 / .006 / .008 | Browser to compare panel motion language to scene motion + drag handoff continuity |
| R.cap.skeleton.006 | Browser to see if skeleton→real-data swap has a flash |
| R.cov.state.populated.* | Live data states to verify partial / all-owned grids |
| R.cap.scroll.005 | Browser to verify scroll-position behavior on tab switch |

### Brand-collision check (explicit)

- closest brand: **Whole Foods (#0c8649 green + cream)** — ΔE ≈ 9 (Studypuff emerald-600 #059669 is brighter + warmer than Whole Foods' deeper hunter); cream tones differ (Studypuff warm parchment vs WF cooler ivory). PASS
- closest brand: **Hay Day (warm amber + cream + chunky)** — intentional reference per calibration, named. PASS
- closest brand: **Stardew Valley (cozy icon grid + earth)** — intentional reference per calibration, named. PASS
- closest brand: **Animal Crossing (pastel green/cream rounded)** — Studypuff's emerald is more saturated, panel is parchment not pastel. Distinct ΔE>12. PASS
- closest brand: **Duolingo (bright lime + flat white)** — Studypuff emerald is muted compared to Duo's #58cc02; cream bg differs from Duo's white. PASS
- final: **PASS** — no rejection

### Capability presence audit

| Capability | Expected? | Rendered? | Evidence |
|---|---|---|---|
| Category tab nav | yes (DEEP) | yes | SRC 36-41, 990-1058 |
| Item card 3 variants | yes (DEEP) | yes | SRC 1117 (owned), 1172 (claim), 1199 (golden-locked), 1239 (purchasable) |
| Inline purchase | yes (DEEP) | yes | SRC 529, 1247 |
| Coin micro-animation | yes (DEEP) | yes (sub-spec on synced timing) | SRC 871-890, 1410-1423 |
| Lock dual-state | yes (DEEP) | yes | SRC 1280-1291 |
| Animation/motion (tab+card+unlock) | yes (DEEP) | yes (3 easing families instead of unified 2) | SRC 854-901 |
| Coins display | yes (DEEP) | yes | SRC 968-979 |
| Accessibility | yes (DEEP) | yes (a11y rules present; CSS forced-colors + prefers-contrast confirmed) | SRC throughout + 913-930 |
| Empty states | yes (MEDIUM) | yes (functional, no illustration) | SRC 1313-1319 |
| Sorting | yes (MEDIUM) | yes (owned-first PASS) | SRC 198-207 |
| Inventory vs shop model | yes (MEDIUM) | yes | SRC 1095-1322 |
| Category grouping | yes (MEDIUM) | yes | SRC 36-41 |
| Responsive | yes (MEDIUM) | yes (grid 4→6→8→10 + max-h-[70vh]) | SRC 1102, 1104 |
| Typography | yes (MEDIUM) | partial (10px hover-only name) | SRC 1164, 1191, 1306 |
| Color/palette | yes (MEDIUM) | partial (emerald not moss-token; amber not coin-gold-token) | SRC throughout |
| Hover micro-interactions | yes (MEDIUM) | yes (scale + shadow grow added in pass 7) | SRC 1128, 1181, 1267 |
| Loading skeleton | yes (MEDIUM) | **NOW YES** (pass-7 added) | SRC 1075-1093 |
| Panel-fetch error | yes (MEDIUM) | **NOW YES** (pass-7 added) | SRC 1061-1072 |
| Scroll behaviour | yes (MEDIUM) | yes (overscroll-contain added) | SRC 1102 |

**17/18 capabilities verified present** (was 15/18 in run 5). The single remaining partial is "Color/palette" — the design tokens for moss/coin-gold were never defined; component uses stock emerald-* and amber-*. The "Typography" partial improves but doesn't clear bar because name remains hover-only.

### Structural notes

1. **The 10px hover-only item name is the most persistent craft defect across all 7 fix passes.** Pass 7 bumped 8→10px and added group-focus-visible, which clears a11y. But sighted-non-hover users still see no name in the grid. At dial 8, an item shop where you cannot see names without hovering each card is a real UX defect. Either show name persistently under each card art, or document an explicit "minimalist by design" choice in calibration.
2. **Coin balance tween (350ms) and arc landing (650ms post-success) are not synced.** The tween fires on `localCoins` change at click time, finishing well before the arc arrives at the pill. R.cap.coin.012 explicitly requires the balance count to update synchronously with the landing beat. Fix: defer `setLocalCoins(c - price)` to fire inside the 650ms `setTimeout` (right when the land-pulse triggers).
3. **The card surface is still a flat white rectangle.** R.gen.003 explicitly forbids this; the spec demands paper texture, ink-edge, or hand-stamped quality. Pass 7 added subtle ring + hover shadow but no texture. This is the second persistent craft defect.
4. **The empty state remains "single emoji + flat copy"** — 5 leaves in P.shop.empty and R.cap.empty stay below bar because pass 7 did not address visual treatment or copy voice.
5. **Three easing families (spring / standard / bare ease-out) coexist.** Pass 7 unified card pop / coin / unlock to spring, and tab indicator to standard, but missed the panel-fade keyframe at line 855 which is still bare `ease-out`. Trivial fix.
6. **Tab pills are still emerald-on-emerald** — the active state is a sliding emerald-600 indicator, not a parchment/inflected treatment (R.gen.002). The pills survive as "looks like a Tailwind pill bar with a polished slide indicator." Not a defect that blocks function, but blocks the "would not be mistaken for a Tailwind template" criterion.
7. **The "card IS the button" architecture** is still the panel's core decision and the P.shop.buy 39-leaf subtree still doesn't model it cleanly. About 12 of those leaves are scored borderline-PASS by reading them as "the card-as-button satisfies the spirit." If the user wants strict-rubric PASS, add a distinct in-card buy CTA at the bottom.
8. **Loading skeleton does not get prefers-contrast strengthened borders.** It carries no `.gdn-card-stagger` class so the @media (prefers-contrast: more) block at line 925 doesn't reach it. Either add the class to skeleton tiles or define a parallel block.
9. **R.coh.005 border radius vocabulary has four-radius drift.** 28px (outer scene) / 22px (panel) / 12px (card) / full (pills) / xl (skeleton, same 12px) — four meaningful values plus full. The spec wants three. Cosmetic.
10. **Self-screenshot for visual claims was not possible.** Component requires Supabase auth + live data + browser. The 22 BLOCKED-on-user-verification rows above all require a real preview session at multiple viewports. Code-only review cannot clear them.

### What I couldn't verify (BLOCKED-on-user-verification)

The 22 BLOCKED rows enumerated above. **None of these are convertible to PASS by code-reading.** They all require: (a) authenticated browser session with live data; (b) multi-viewport screenshots (360/390/768/1024/1280/1440/1920); (c) keyboard end-to-end flow; (d) screen-reader walkthrough; (e) Windows High Contrast mode visual check; (f) prefers-contrast: more emulation; (g) iOS touch device for momentum scroll. The build log (line 204-206) acknowledges this as a "structural constraint" but the BLOCKED rows nonetheless block READY.

### HAND-OVER VERDICT (run 6)

**NOT READY** — 14 below-9.5 code-fixable rows still open and 22 BLOCKED-on-user-verification rows that need an authenticated browser session.

Highest-impact remaining items, in priority order:

1. **R.gen.003 / P.shop.card.locked.vis.4 — Card surface paper/ink-edge treatment.** Single biggest defect — directly violates an R.gen "do not be a genre default" rule. Add subtle noise texture filter + ink-stroke border SVG to all 4 card variants.
2. **R.gen.005 + R.cap.coins.012 — Coin pill weight + sync to arc.** Pill needs Hay-Day-grade visual weight (custom SVG coin glyph, larger Trirong digit, raised bevel). Then defer `setLocalCoins` deduction to the 650ms timeout so the count-down lands when the coin lands.
3. **R.cap.cards.011 / typo.001 — Visible item name in grid.** Either persistent label under each card OR clearly larger overlay (≥12px) OR document the hover-only choice as intentional.
4. **R.gen.006 — Owned mark as designed badge.** Replace 🌱 emoji corner pip with a real sprout-stamp SVG, ribbon, or wax-seal motif.
5. **R.gen.007 + P.shop.empty.vis.1 — Empty state illustration + voice.** Replace 🌿 with a small character SVG (wheelbarrow with seeds, gardener silhouette, watering can) and tune the copy to character-voice ("Nothing planted in this patch yet. Earn coins by focusing, then come back to fill it in.").
6. **R.cap.palette.003/.004 — Define moss-* and coin-gold tokens** in tailwind.config.ts, then swap stock emerald/amber usages. Or document the decision to stay on default Tailwind palette.
7. **R.coh.016 — Move panel-fade keyframe to standard easing family.** Trivial: line 855 `200ms ease-out` → `200ms cubic-bezier(0.4,0,0.2,1)`.
8. **R.gen.011 sub-spec — Coin arc particle burst on landing.** Add 3-4 small radial sparkles on arrival to elevate from "trajectory animation" to "ownable moment."
9. **R.coh.005 — Border-radius reduction.** Standardize to three: outer container (28px), panel surfaces (22px), grid elements (12px). Pills stay "full" as a distinct case.
10. **Loading skeleton tiles add `.gdn-card-stagger` class** so prefers-contrast strengthens them too.

After code-fixable items clear, the user MUST run a browser session at 5+ viewports with Supabase auth + real data to attempt the 22 BLOCKED rows. Even with all 22 PASSing (best case), the 14 code-fixable items above must be closed before READY.


---

## Judge run 7 (cold pass, blind, post-fix-pass-8)

**Score 6.8/10 · 392 PASS / 577 TOTAL · 158 below-bar · 27 BLOCKED-with-named-user-input**
**Brand-collision verdict: PASS** (palette = parchment cream / mossy green / coin gold; Whole Foods green-cream is the closest brand but ΔE>30 due to ochre tertiary; Hay Day amber is the intentional reference)
**Capability presence: 17/18 chosen capabilities verified rendered** (single weak link: card surface still lacks paper/texture, only an inset 1-px ink-edge box-shadow; flagged below)
**Locked content: untouched** — `placedItems` render block (line 692-750), drag-drop pointer pipeline (line 377-509), `inventoryRef` drop-zone (line 962-1001) and scene canvas all preserved against calibration L.001 + L.002. Drag-handling not modified this pass.

## Headline

Fix pass 8 made real progress on five long-standing craft defects: moss/coin-gold tokens now exist in tailwind.config.ts and are wired through the panel; an SVG sprout-stamp replaces the emoji corner pip; the empty state has a designed watering-can+seedling SVG with character-voice copy; the panel-fade keyframe was moved to the standard cubic-bezier family so only two easing families remain; item names are now permanently visible as a dark bottom strip on every card variant (opacity-100, no hover-only). However, two of the most persistent dial-8 craft defects are still NOT cleared: (1) card surfaces are visually still flat rectangles — the new `inset 0 0 0 1px rgba(31,25,15,0.06)` ink-edge is so subtle (~6% black at 1px) that it reads as "nothing" against a white card body, falling well short of R.gen.003's "paper texture, ink edge, or hand-stamped quality" bar; (2) the name strip now permanently covers the bottom 20% of every card art, which on locked cards collides with the centered price badge and on golden-locked cards covers the focus-progress bar — a visual regression introduced this pass. The artifact remains roughly halfway between "expert dial-8 cozy game polish" and "polished Tailwind template with custom tokens." Plus 27 BLOCKED rows that require a live browser session at 5+ viewports with Supabase auth.

## Per-category summary (MIN per subtree)

| Category | MIN | # below 9.5 |
|---|---|---|
| R.coh — System cohesion | 7.0 | 4 |
| R.gen — Distinctiveness vs genre | 7.0 | 7 |
| R.ref.scene — Scene parity | BLOCKED (8.5) | 3 |
| R.ref.stardew — Stardew parity | BLOCKED (8.0) | 4 |
| R.ref.hayday — Hay Day parity | BLOCKED (7.5) | 3 |
| R.pit — Pitch alignment | 8.5 | 3 |
| R.cov — Coverage | BLOCKED (8.0) | 18 |
| R.cap.tabs — Tab navigation | 8.5 | 4 |
| R.cap.cards — Card design | 6.0 | 7 |
| R.cap.buy — Purchase flow | 8.5 | 3 |
| R.cap.coin — Coin animation | BLOCKED (8.5) | 6 |
| R.cap.lock — Lock affordances | 8.0 | 4 |
| R.cap.motion — Animation | BLOCKED (8.5) | 6 |
| R.cap.coins — Coins display | 9.0 | 3 |
| R.cap.a11y — Accessibility | BLOCKED (9.0) | 9 |
| R.cap.empty — Empty states | 8.5 | 3 |
| R.cap.palette — Color/palette | 9.0 | 2 |
| R.cap.hover — Micro-interactions | BLOCKED (8.5) | 5 |
| R.cap.skeleton — Loading | 9.0 | 2 |
| P.shop.coh — Unit cohesion | 8.5 | 3 |
| P.shop.header.coins (24 leaves) | 8.0 | 4 |
| P.shop.header.title (8 leaves) | 8.5 | 2 |
| P.shop.tabbar.tab (33 leaves) | 7.0 | 8 |
| P.shop.card.locked (41 leaves) | 6.0 | 11 |
| P.shop.card.owned-unplaced (26) | 7.5 | 6 |
| P.shop.card.owned-placed (23) | 8.0 | 4 |
| P.shop.buy (39 leaves) | 5.0 | 14 |
| P.shop.golden-gate (24 leaves) | 7.0 | 6 |
| P.shop.empty (20 leaves) | 8.5 | 4 |
| P.shop.loading (15 leaves) | 9.0 | 2 |
| P.shop.error (17 leaves) | 8.5 | 3 |

## Below-9.5 prioritized list (code-fixable, sorted by impact)

| ID | Page / Section | Criterion | Score | Concrete fix |
|---|---|---|---|---|
| **R.gen.003** | Card surface | "NOT a plain white/cream rectangle — paper texture, ink edge, or hand-stamped quality" | **6.0** | The 6% black 1-px inset ink-edge is too subtle to register as treatment. Add: (a) SVG noise filter (feTurbulence baseFrequency=0.65 + feColorMatrix opacity 0.04) layered via CSS pseudo, OR (b) a 2-3% black + 2-3% white double-inset shadow stack ("ink stroke + paper highlight"), OR (c) a `background-image: url('/paper-noise.png'); background-blend-mode: multiply; opacity: 0.06` overlay. Current state is closer to "card has a hairline border" than "handcrafted cozy game card." |
| **NEW — R.cap.cards.011 regression** | All 4 card variants | Name overlay `opacity-100` now permanently covers the bottom 20% of card art | **6.0** | Pass 8 swapped `opacity-0 group-hover:opacity-100` to `opacity-100`. While this clears the hover-only access defect, the dark `bg-ink-900/75` strip now (a) eats card art bottom on every card, (b) on locked cards the price badge at `bottom-2` overlaps the name strip's `bottom-0` and reads as visual collision, (c) on golden-locked cards the focus-progress bar at `bottom-1.5` is now occluded by the name. Three viable rebalances: (i) make the strip translucent — `bg-ink-900/45` + remove text shadow + relocate badges to top, (ii) restore hover/focus reveal but bump font to 11px and use a small label CHIP top-left of card, (iii) lift the name OUTSIDE the aspect-square card into a `<figcaption>`-style 14px label below each card (adds vertical space but eliminates collisions entirely). Most idiomatic for "cozy shop": (iii). |
| **NEW — P.shop.card.locked.vis.5 / R.cap.cards.005** | Locked card | Price badge (centered, `bottom-2`) and name strip (`bottom-0` to `bottom-7`) overlap | **6.0** | After pass-8 name change, on a typical 88-128px square card, the moss-700 price pill sits at ~80% height while the name strip starts at ~78% and runs to bottom — they vertically collide. Move name above the price OR move price to top-corner OR shrink price to a corner chip. Same fix as row above can subsume this. |
| **P.shop.golden-gate.vis.2 / R.cap.cards.015** | Golden-locked card | Focus-progress bar `h-1 absolute bottom-1.5` is now hidden under the name strip | **5.5** | Direct DOM collision: name strip at line 1255 uses `bottom-0` (with bg-ink-900/75 → fully opaque) and the progress bar at line 1251 uses `bottom-1.5`. Progress bar is now obscured. Move progress bar above name strip (e.g. `bottom-8`) OR exempt golden-locked from the full-width name strip OR relocate name to top. |
| **R.coh.005** | Border-radius vocabulary | 4 radii drift remains | **7.5** | Currently: 24px (outer scene + outer panel), xl/12px (cards + skeleton + tabs internal), full (pill badges + coins badge + tab indicator), 2px (golden-gate inner pot SVG rect — incidental). The dial-8 spec wants "one for cards, one for tabs, one for buttons." Pass 8 partial-fixed: both containers now 24px. To clear: pick THREE intentional radii — e.g. 24px containers, 12px cards (xl already used), full pills — and remove any other ad-hoc radii. The 2px rect inside the SVG empty-state pot is fine because it's inside an SVG asset, but the `rounded-[12px]` skeleton vs `rounded-xl` real card vs `rounded-md` focus-visible on scene buttons should be unified (all on the `xl` token). |
| **R.coh.001 / R.cap.palette.001-002** | Panel bg | Panel uses bg-cream-50/90 (which = `#fdfbf7` at 90% alpha); cards use bg-white/75 — both feel like default Tailwind cream, not "parchment with subtle texture" | **8.0** | The cream-50 token is `#fdfbf7` which IS warm cream, but at 90% over a presumed white parent, the *rendered* color is very close to pure white. Move alpha to background-color directly (bg-cream-50 unstyled) and add a paper texture overlay at the panel level (`background-image: url(/data:image/svg+xml...noise.svg)` opacity 0.04). This stacks with the card-surface fix above. |
| **R.coh.007 / R.cap.hover.card.001-002** | Hover-language consistency | Owned cards = `hover:scale-[1.04] hover:shadow-md`, claimable golden = same, purchasable locked = same, golden-locked = NONE (no hover lift) | **8.0** | The golden-locked card variant at line 1233 has no hover scale or shadow change — inconsistent with the rest of the panel's hover language. Either add `hover:scale-[1.02]` (gentler, since unclickable) + `hover:shadow-sm` OR document that gated cards intentionally have no hover affordance and ensure that decision is consistent. |
| **R.gen.002 / P.shop.tabbar.tab.vis.2** | Tab pills | Active tab indicator is a sliding moss-600 pill — still reads as "Tailwind pill bar with custom indicator," not "parchment/inflected treatment" | **8.0** | The tabs survive run-6's "would not be mistaken for a Tailwind template" comparison borderline. To clear: give the active-tab pill a paper-tag motif (folded corner, slight rotation OR slight serif framing OR a hand-stamped ink-edge effect). The spec wants tab to feel like "part of the panel's chrome (carved, hand-lettered)." Currently it's a smooth rounded-full bg-moss-600. |
| **R.gen.005 / R.cap.coins.012** | Coin pill weight + sync | Pill is now coin-gold-300 border + coin-gold-50 bg + coin-gold-700 text, py-2 — better than run 6 but still a thin badge. R.cap.coins.012 (sync to landing beat) IS fixed in this pass — `setLocalCoins` now in try block after server confirm (line 576), tween fires 200ms BEFORE arc lands at 650ms → still ~450ms early. | **8.5** | Two items: (a) coin pill needs more visual weight — consider Trirong italic numeral (display font) at 16-18px, OR a custom SVG coin glyph with bevel, OR a 1px coin-gold-700 outer shadow ring. (b) The tween-arc sync is closer but still off: tween runs 350ms from server confirm (line 576), arc lands at 650ms from same start (line 590). Either bump the land-pulse timing or delay the tween start. Currently the count finishes ~300ms before the arc arrives. |
| **R.cap.cards.005 / locked.vis.2** | Lock + price + CTA hierarchy | Lock icon 16×16 top-right + price badge centered `bottom-2` + name strip `bottom-7` — the bottom half of the card art is HEAVILY occluded by overlays | **7.0** | At 88px card width (4-col 360px viewport), the visual layering on a locked card is: top-right 16×16 lock badge (~18% of card), centered bottom price pill (~30% of card width × 16px), name strip (~100% × 18px). That's at least three overlapping graphic elements covering the bottom 40% of card art. The art (the actual silhouette the user is shopping for) becomes secondary to chrome. Reduce: shrink price badge OR move price + lock to a single "footer row" along card bottom OR show price only on hover. |
| **R.cap.lock.002-003** | Lock badge differentiation | Affordable = amber-400/90 (vivid), unaffordable = ink-900/15 (~8% black) — affordable PASSES; unaffordable is so faded it reads as "no badge" on a low-contrast monitor | **9.0** | Bump unaffordable lock to ink-900/25 minimum so it's visible against the cream card bg. Add a static `text-ink-900/60` lock glyph color instead of `text-ink-900/40`. The "muted not punitive" spec wants visible-but-low-energy, not "disappeared." |
| **R.cap.coins.012 (arc sync)** | Coin pill | Tween starts at server confirm (line 576), runs 350ms; arc launches at server confirm (line 581), lands at 650ms → tween finishes ~300ms before arc lands | **8.5** | Either (a) defer `setLocalCoins(c - price)` into the 650ms land timeout, OR (b) bump tween DURATION_MS from 350 → 650 to land together. (a) is cleaner — keeps the count-down feeling like "coin arrives, count drops." |
| **R.cap.motion.coh.001 / R.coh.016** | Easing families | Now 2 families (spring + standard) — PASSES at root, but the tween in `useEffect [localCoins]` at line 264-281 uses linear interpolation (no easing curve) | **9.0** | Pure linear tween is acceptable for short count animations, but the spec asks "ease-out on count-down ~300-500ms" (R.cap.coins.006). Replace `progress = step / STEPS` with `progress = 1 - Math.pow(1 - step/STEPS, 3)` (cubic ease-out) to land softer. |
| **R.cap.cards.011 (name truncation)** | All cards with long names | `truncate` class applied, but name strip is 10px font + ~88px card width → most item names ≥8 chars will truncate with "…" — accessible name on the button covers this but VISUAL truncation is heavy | **8.5** | Either bump font to 11px and trust truncation, or wrap to 2 lines with `line-clamp-2`, or move name BELOW the card art as a wrapping figcaption. Two-line label with `text-[10px] leading-tight` would fit "Cozy Cottage" and similar 2-word items. |
| **P.shop.golden-gate.vis.1** | Golden-locked card | Gold accent uses amber-200/40 border + amber-50/50 bg — the gold reads as VERY faded, basically as muted as the ink-500/15 unaffordable locked. The spec wants "clear it's a different reward path." | **8.0** | Bump amber border alpha and bg alpha so the golden-locked variant reads as distinctly golden (perhaps coin-gold-300 border now that the token exists). Currently borderline indistinguishable from generic locked at 4-col mobile. |
| **R.cap.cards.014 (off-center art)** | All card variants | `<img className="h-full w-full object-contain">` — art is centered with object-contain. But `p-3` (12px) on a ~88px card leaves only 64px for art = quite small. | **9.0** | At 4-col 360px the inner content area is ~64×52px (accounting for name strip + price badge ~16px). Item silhouette becomes a postage stamp. Either reduce padding to p-2 (8px) on small viewports OR move overlays off the art (per name-strip fix above). |
| **R.cap.tabs.005 (indicator slide)** | Tab bar | Sliding indicator is correctly implemented, but the indicator slides BEHIND the tab text. At measurement: indicator is `absolute` at `left/top/width/height` from button rect, but on first paint before useLayoutEffect runs, indicator is `null` and not rendered. Test: hard refresh in browser would show 1-frame flash without indicator. | **9.0** | The `useLayoutEffect` with `[]` dep on lines 308-318 is a safety net for this — but if `tabBtnRefs.current[idx]` is null at first commit (rare strict-mode), indicator stays null. Add an SSR-safe default rect for the first tab (left:16, top:12, width: undefined → fallback) OR render indicator conditionally with a fade-in. Borderline acceptable as-is. |
| **R.cap.tabs.012 (activation mode)** | Tab bar | Tab change happens on `onClick` (manual) but ALSO automatically on focus via the keyboard arrow handler at line 1030 (`.focus()` after `setActiveTab`). This mixes manual and automatic activation. | **8.5** | Pick one: WAI ARIA "automatic" pattern means tab activates on focus alone, no extra Enter; "manual" means Enter/Space activates. The current code uses arrow → setActiveTab → focus (automatic), Tab → focus → Click/Enter (manual). Consistency: drop the `setActiveTab(nextId)` in arrow handler and require Enter/Space (manual); OR keep activation on arrow and document choice. Currently mixed. |
| **R.cap.tabs.013 (label truncation 360px)** | Tab bar | Tab labels = "Structures / Plants / Critters / Golden" + emoji + 9-px progress chip. At 360px viewport with 4 tabs in a horizontal scroll (overflow-x-auto), "Structures" almost certainly wraps or scrolls off | **8.5** | The current `overflow-x-auto` solution means some tabs get scrolled off-screen at 360px — borderline acceptable but not great. Either (a) shorten label "Structures" → "Build" / "Houses" / icon-only with tooltip, (b) make tab bar wrap into 2 rows on mobile, (c) reduce font to 10px on mobile. Without a real preview can't measure exact overflow. |
| **R.cap.skeleton.001-007** | Skeleton tiles | Tiles use `border border-black/[0.04]` plus `gdn-card-stagger` class. Pass 8 added the class so `@media (prefers-contrast: more)` reaches them. But the skeleton renders 12 tiles at a 4×3-col-6 grid — at 360px (4 col) that's 4×3 grid, at 1280px (10 col) that's 12×1 row. 12 tiles is too few for the large grid. | **9.0** | Bump skeleton count to `Math.max(12, gridCols * 2)` or just hard-set to 24 for desktop. Alternatively, render a skeleton-per-real-grid-slot (16-20 cards). |
| **R.cap.empty.005** | Empty state | Copy reads "Earn coins by focusing, then come back to fill it in." — no specific next-action CTA, no progress indicator | **8.5** | Spec asks for "clear next action where applicable." Either add a small <button>Start a focus session</button> CTA, OR list specific minutes-to-next-unlock for the active category. |
| **P.shop.buy.cpy.1** | Buy CTA copy | The "buy CTA" is implemented as the entire card being clickable (no separate <button>Buy</button>) — `aria-label="Buy ${item.name} for ${item.price} coins"` PASSES for SR, but visible "Buy" label is absent. The price badge serves as the visible price+CTA combined. | **5.0** | Architecturally the artifact has chosen "card IS the button" — there is no separate Buy CTA element. About 14 of the 39 P.shop.buy leaves grade as "satisfied in spirit by the card-as-button." For strict-rubric PASS, add a small Buy chip OR document the choice. The visible price chip at `bottom-2` is acting AS the CTA but doesn't say "Buy" — discoverability for first-time users may be slow. |
| **P.shop.buy.vis.1-4** | Buy CTA visual | No distinct buy button — price chip is the only visible CTA-like surface | **5.0** | Same root as above. About 11 P.shop.buy.vis.* leaves don't grade cleanly because there's no separate button. Either document the merger or split. |
| **P.shop.buy.int.7-8 (success/error states)** | Buy CTA | On success: card flips to owned variant (good). On error: price chip changes to "retry" + rose color + ⚠ in lock corner — visible inline. But there's no <button>Retry</button> — user has to click the card again. | **8.5** | The error state is visible but the affordance is ambiguous — "retry" appears in the chip but the WHOLE card stays clickable. Add a clearer "Tap card to retry" hint OR make the chip itself the click target. |
| **R.cov.iso.text-spacing / viewport-zoom-200** | Coverage | WCAG 1.4.12 and 1.4.10 require functional UI at user text-spacing override and 200% zoom. Cannot verify without browser. | **BLOCKED** | Browser test required. |
| **R.cov.scheme.light / contrast.more / forced** | Coverage | Default light theme renders — PASS by code; prefers-contrast: more and forced-colors: active have CSS rules but cannot verify rendered output. | **BLOCKED** | Browser with emulation required. |
| **R.cap.a11y.live.001-002** | aria-live | Polite + assertive regions both implemented. Polite at `purchaseError ? "" : announceMsg`, assertive at `purchaseError ? announceMsg : ""` — switch logic depends on purchaseError state. At success: announceMsg = "X added to your garden", polite fires (assertive empty because purchaseError null). At fail: purchaseError = itemId, announceMsg = err — assertive fires. Logic looks right. | **9.5 PASS** | Verified by source. |
| **R.cap.a11y.kb.001 / focus.001-005** | Keyboard end-to-end | Buttons + tablist + roving tabindex all wired. Cannot verify focus survives purchase flow, focus-ring visibility on all surfaces. | **BLOCKED** | Keyboard walkthrough required. |
| **R.cap.scroll.002-003** | Scroll perf | `overscroll-contain` + `max-h-[70vh] overflow-y-auto` added. Cannot verify 60fps scroll on mid-range hardware or iOS momentum. | **BLOCKED** | Device/profile required. |
| **R.cap.motion.card.001-003 / unlock.001-004** | Motion runtime | Card stagger keyframe + unlock-reveal keyframe defined with capped scales. Cannot verify 60fps execution or visual coherence. | **BLOCKED** | Browser profile required. |
| **R.cap.hover.no-touch** | Touch hover bleed | Hover styles via `hover:` Tailwind utilities — no explicit `@media (hover: hover)` guard. Touch devices may show sticky-hover after tap. | **8.5 (code-fixable)** | Wrap all hover utilities in a media query or use `@media (hover: hover) and (pointer: fine)` block in the JSX style tag. |
| **P.shop.empty.mot.1** | Empty state fade-in | Empty state has no entrance animation class — pops in instantly when `tabItems.length === 0` becomes true. | **8.5** | Add `gdn-panel-enter` class to the empty state container OR a dedicated `gdn-empty-fade` keyframe. |
| **P.shop.error.coh.1** | Inline purchase error vs panel-level error | Inline purchase error = rose-50 chip on the card (line 1287-1290); panel-level error = rose-50 box (line 1086) with same hue. Visually coherent. | **9.0 (borderline)** | Both use rose family — PASSES the consistency check. Borderline because the inline version doesn't say "Try again" explicitly; spec is happier with explicit retry copy on both. |
| **R.cov.input.touch / cap.responsive.001-007** | Touch + responsive | Grid `grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10` matches calibration. Tap targets ≥44px on tabs (PASS by min-h-[44px]). Cards are square at any width — 88px at 360/4col is below the 44px touch-target rule when interpreted as "minimum dimension." | **8.5 (borderline)** | At 360px viewport with grid-cols-4 + gap-2 + px-4 panel padding, each card is roughly `(360 - 32 - 24)/4 = 76px` wide and 76px tall — under the 88px the build log claims and below 44×44 not by absolute (each card is way bigger than 44px) but the in-card buttons (price chip at 12px height) ARE under 44px touch target. The card-as-button does meet 44px globally. |
| **R.cap.coin.012 (tween-arc sync)** | Coins display | See main row above. Fix-pass-8 deferred deduction to server confirm (better than pre-pass-8) but tween still finishes ~300ms before arc lands. | **8.5** | See fix in row above. |
| **R.gen.014** | "How did they do that" moment | Coin arc + sparkle ::before/::after pseudos + unlock-reveal keyframe at 1.04 scale + sprout-stamp SVG — collectively a few small "ah" moments but none cross into "would post to twitter" territory at dial 8 level. | **8.0** | Closest moment is the coin arc. To elevate: (a) make the coin SPIN on the arc, (b) emit 4-6 sparkles in a radial burst (currently only 2 sparkles), (c) momentary card bloom on land. Currently rates "polished" not "delighted." |

(Plus ~110 additional leaves where the artifact PASSES strictly per source-read but the leaf is a "9.5 borderline" that drops to 9.0 because the visual cannot be verified without browser. These are listed in roll-up MINs and counted in the below-9.5 totals but are individually fine-grained.)

## Brand-collision check (explicit)

- closest brand: **Whole Foods** (green + cream): ΔE≈35 — verdict **PASS** (Whole Foods is darker forest #00674b vs panel moss #2d6e2d; cream tones similar but the parchment ochre + amber tertiary distinguish)
- closest brand: **Hay Day** (amber + farm green): ΔE≈22 — verdict **PASS — intentional reference per calibration**
- closest brand: **Stardew Valley shop** (brown + cream): ΔE≈40 — verdict **PASS** (no brown wood tone; lighter and greener)
- closest brand: **Hertz / Lufthansa** (yellow): ΔE>50 — verdict **PASS** (coin-gold is more amber than corporate yellow)
- final: **PASS** — palette cleared

## Capability presence audit

| Capability | Expected? | Rendered? | Evidence |
|---|---|---|---|
| Category tab navigation | yes (DEEP) | yes | SRC 1012-1080 |
| Item card with 3 variants | yes (DEEP) | yes | SRC 1138-1336 (owned/golden-claimable/golden-locked/purchasable) |
| Purchase / unlock flow | yes (DEEP) | yes | SRC 526-618, handlePurchase + extraOwned + justUnlocked |
| Coin micro-animation | yes (DEEP) | yes (coin arc + sparkle pseudos + land pulse) | SRC 876-912, 1460-1473 |
| Lock icon treatment | yes (DEEP) | yes (amber/grey based on canAfford) | SRC 1304-1316 |
| Tab cross-fade / card stagger / unlock reveal | yes (DEEP) | yes (3 keyframes + reduced-motion fallback) | SRC 857-933 |
| Coins display in header | yes (DEEP) | yes (pill + aria-live + tween) | SRC 989-1001, 248-281 |
| Accessibility wiring | yes (DEEP) | yes (tablist/tab/tabpanel/aria-disabled/aria-live polite+assertive/min-h-44/role=progressbar/role=status/role=alert) | SRC pervasive |
| Empty state | yes (MEDIUM) | yes (watering-can SVG + character copy) | SRC 1337-1369 |
| Sorting (owned-first / price-asc) | yes (MEDIUM) | yes | SRC 196-207 |
| Inventory vs shop model | yes (MEDIUM) | yes (unified grid) | SRC 1095-1372 |
| Category grouping (4 named) | yes (MEDIUM) | yes | SRC 36-41 |
| Responsive 4→6→8→10 grid | yes (MEDIUM) | yes | SRC 1126 |
| Typography hierarchy | yes (MEDIUM) | partial (10px name strip too small; visible permanently per pass-8 but introduces collision) | SRC 1189, 1216, 1255, 1331 |
| Color/palette tokens | yes (MEDIUM) | yes (moss + coin-gold defined in tailwind.config) | tailwind.config.ts:32-43 |
| Hover micro-interactions | yes (MEDIUM) | partial (golden-locked variant has no hover) | SRC 1233 (no hover utility) |
| Loading skeleton | yes (MEDIUM) | yes (12 tiles + gdn-card-stagger + animate-pulse + role=status) | SRC 1096-1115 |
| Scroll behaviour | yes (MEDIUM) | yes (overscroll-contain + max-h-[70vh]) | SRC 1124 |

**17/18 capabilities verified present.** Typography is the single "partial" — the always-visible name strip is rendered but introduces overlap with other badges. Architectural-style "card-as-button" rolls about 14 P.shop.buy leaves to a lower grade — flagged in priority list.

## Locked content audit

- L.001 GardenScene scene canvas: **untouched** — all scene-rendering code at lines 636-769 + 1455-1473 + 1481-1503 + 1508-1586 unchanged this round (read via the SunArcHud, the `placedItems` map, the cloud div, the night sky overlay, the lantern glow, the pond shimmer, the drag ghost — all intact).
- L.002 Drag-drop logic: **untouched** — `handlePointerDown` (377-509) + `onWindowMove` (421-443) + `onWindowUp` (445-494) + `cleanup` + `windowDragCleanupRef` all preserved; refs (`layoutRef`, `draggingRef`, `isEditingRef`) intact; `clientToScenePercent` and `isOverScene` / `isOverInventory` unchanged.

## Structural notes (≤10 bullets)

1. **Pass-8 introduced a real regression: the always-visible name strip COLLIDES with the price badge on locked cards and OCCLUDES the focus-progress bar on golden-locked cards.** This must be fixed before READY. The simplest fix is to move the name BELOW the aspect-square card (figcaption pattern) — that eliminates both collisions in one move and is closer to how Stardew/Hay Day actually do it.
2. **The card surface is the longest-standing unresolved craft defect.** Eight fix passes and the rendered visual is still "rounded white card with a 1-px hairline border." R.gen.003 is explicit: paper, ink, OR hand-stamped — none of which the current treatment meets. Pass-8's `inset 0 0 0 1px rgba(31,25,15,0.06)` is 6% black at 1px on a white card and is not perceivable at normal viewing distance.
3. **The card-as-button architectural choice still doesn't pass the P.shop.buy rubric cleanly.** Either (a) split a tiny Buy chip out of the card, (b) document the merger in calibration and the rubric will accept it. Without one of these, ~14 P.shop.buy leaves are unresolvable.
4. **Coin arc sync remains slightly off.** Tween 350ms, land at 650ms — 300ms gap. Trivial to close: defer setLocalCoins into the 650ms timer. R.cap.coin.012 explicitly demands sync.
5. **Tab activation pattern mixes automatic and manual.** Arrow keys activate on focus (automatic per WAI), Tab key requires Enter/Space (manual). WAI says pick one and apply uniformly. Cosmetic but flagged in the criteria tree.
6. **27 BLOCKED rows cannot be cleared without a live browser session.** These cover responsive layout at 6 viewports, prefers-reduced-motion runtime, forced-colors runtime, prefers-contrast runtime, 60fps motion profiling, keyboard end-to-end flow, screen-reader walkthrough, iOS momentum scroll. The build log acknowledges this as a structural constraint; the rows remain BLOCKED-with-named-user-input.
7. **The tab pills are still genre-default.** Even after the moss-token swap, the active-tab indicator is "a rounded-full bg-moss-600 pill sliding behind a label." This passes contrast but fails R.gen.002 ("NOT plain flat-color rectangles — has a parchment/inflected treatment"). A folded-paper tab corner OR a stamped-ink underline would clear it.
8. **The empty-state SVG is a nice character beat but is the only handcrafted illustration in the panel.** The cards are all just product PNGs with overlays. The empty state proves the design CAN do character; the cards prove the panel doesn't. Asymmetry is itself a craft note.
9. **The 16px → 24px container radius standardization moved both outer panels in sync, but the rest of the radius vocabulary still drifts.** Skeleton tile uses `rounded-xl`, real card uses `rounded-xl`, golden-claimable uses `rounded-xl` — those are consistent. But the lock badge uses `rounded-full`, the focus-visible ring uses `rounded-md`, the in-scene sprout badge uses `rounded-full`. Five+ radii in play once you count badges. Cosmetic but flagged.
10. **No browser preview was available this round.** The component requires Supabase auth + live data + a running Next.js server. The build log's "Runtime-exercise acknowledgement" note (line 224-226) flags this as a structural constraint. All BLOCKED rows here need the user to either: (a) run `next dev` locally with seeded data and capture 5+ viewport screenshots + keyboard + screen-reader runs OR (b) deploy to a staging URL and have THOG run a browser MCP against it.

## What I couldn't verify (BLOCKED-on-user-verification)

27 rows total, all requiring a live preview:

- **R.cov.vp.{360,390,768,1024,1280,1440,1920}** — 7 viewport rows (visual layout sound)
- **R.cov.scheme.light / contrast.more / contrast.forced** — 3 rendering modes
- **R.cov.input.{mouse,touch,kb}** — 3 input modes (especially touch — long-press drag, no sticky hover)
- **R.cov.motion.{default,reduced}** — 2 motion modes (runtime, not just media-query presence)
- **R.cov.iso.viewport-zoom-200 / text-spacing** — 2 WCAG isolation modes
- **R.cap.coin.002-005** — 4 coin animation runtime visuals (arc shape, sparkle visibility, landing beat coherence)
- **R.cap.motion.card.001 / unlock.001-004 / coh.005** — 6 motion runtime rows (60fps, visual coherence)
- **R.cap.a11y.focus.001-005 / kb.001** — keyboard end-to-end + focus survival mid-purchase (6 rows)
- **R.cap.scroll.002-003** — scroll perf + iOS momentum (2 rows)
- **R.cap.hover runtime** — sticky hover on touch (1 row)
- **R.cap.tabs.013** — exact 360px label truncation visual (1 row)

User input required: launch the dashboard route at multiple viewports with real seeded data, capture screenshots + keyboard run + screen-reader transcript, and re-run THOG with the screenshots attached.

## HAND-OVER VERDICT

**NOT READY** — 30 tier-1 code-fixable rows still open plus the 27 BLOCKED rows. The fix-pass-8 changes the parent flagged for confirmation all landed (moss/coin-gold tokens ✓, ink-edge box-shadow ✓ but too subtle, SVG sprout-stamp ✓, SVG watering-can empty state ✓, name overlays opacity-100 ✓ but introduces collision regression, easing unified to 2 families ✓, coin deduction deferred to server success ✓ but tween still not synced to land beat, sparkle ::before/::after ✓, rounded-[24px] containers ✓, skeleton gets .gdn-card-stagger ✓).

But fix pass 8 also introduced ONE meaningful NEW defect: the always-visible name strip collides with the price badge on locked cards and occludes the focus-progress bar on golden-locked cards (both verifiable from source line numbers, not opinion). Plus 5 of the previously-flagged craft defects from run 6 are NOT addressed by pass 8 (card surface texture remains flat, tab pill still genre-default, coin pill still thin, P.shop.buy.* unaddressed, R.coh.005 radius drift partial).

Top 5 highest-impact unresolved rows (re-prioritized post-pass-8):

1. **Resolve the name-strip collision regression.** Either move name below the card (figcaption) OR shrink to 9px translucent OR restore hover-only reveal + add a separate visible label.
2. **R.gen.003 card surface treatment.** The single longest-standing craft defect. Add real texture (SVG noise filter OR paper image overlay OR layered double-inset shadow).
3. **R.cap.cards.005 + R.cap.cards.015 — overlay hierarchy on locked + golden-locked cards.** Lock icon + price chip + name strip + progress bar collectively occlude bottom 40-50% of card art. Restructure overlays into a single non-overlapping footer row.
4. **R.cap.coin.012 — sync count-down to coin landing.** Defer setLocalCoins into the 650ms land timeout (or bump tween duration). Trivial code change, makes the signature moment land.
5. **P.shop.buy architectural reckoning.** Either document the card-as-button merger in calibration (and rebalance the rubric subtree), OR add a tiny Buy chip to the locked-card footer to satisfy the 39-leaf subtree at the visual level.

After all 30 code rows close, the user MUST run a live preview session at ≥5 viewports with authenticated Supabase data + keyboard run + screen-reader transcript to clear the 27 BLOCKED rows. Even at best-case full-PASS on the BLOCKED rows, the 30 code-fixable items above must close before READY.
