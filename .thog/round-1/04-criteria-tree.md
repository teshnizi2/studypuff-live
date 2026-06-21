# Criteria Tree — round 1

**Pitch:** "A beautiful categorized garden shop panel that shows all items organized by theme, lets users buy locked items inline, and makes browsing/collecting feel like a cozy game store"
**Dial:** 8/10 (Expert cozy-game polish)
**Quality bar:** ≥9.5 every leaf · MIN-rollup (one sub-9.5 fails its subtree)
**Row count:** derived from artifact surface (see footer math)

## Live totals
- Total leaves: 577
- By status: TODO=577, PASS=0, BLOCKED=0, LOCKED=2 (from calibration: GardenScene canvas + drag-drop logic — both NO-TOUCH)

## Evidence keys
- CS = computed-style read (browser devtools or DOM check)
- SEE = screenshot / visual inspection
- SRC = source-read (component or styles)
- IND = independent-judge (cold subagent verdict)
- MEAS = measurement (perf trace, contrast ratio, time-to-paint)

## Sacred / Locked content (do NOT score these — they are out of scope)
- L.001 | GardenScene scene canvas — calibration LOCK; not modified this round
- L.002 | Drag-drop logic — calibration LOCK; not modified this round

---

# R — Root subtrees

## R.coh — System cohesion (panel within wider scene)
Cohesion axes: voice/tone · palette · type scale · motion language · spacing scale · hover language · focus ring · interactive-state vocab · empty/loading/error patterns. At dial 8 these are checked at root AND repeated at unit/section levels.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.coh.001 | Panel palette matches scene palette (parchment/cream/mossy-green/coin-gold) within ±5% LCh distance per swatch | 9.5 | – | TODO | CS |
| R.coh.002 | Panel typography uses same font family as scene chrome (no introduced 2nd display face) | 10 | – | TODO | CS |
| R.coh.003 | Type scale steps in panel are a subset of the global type scale (no ad-hoc sizes) | 9.5 | – | TODO | CS |
| R.coh.004 | Spacing tokens used in panel are members of the existing spacing scale (no off-token gaps) | 9.5 | – | TODO | CS |
| R.coh.005 | Border-radius vocabulary consistent: one radius for cards, one for tabs, one for buttons (no four-radius drift) | 9.5 | – | TODO | CS |
| R.coh.006 | Shadow token vocabulary: card shadow, tab shadow, hover shadow — three or fewer distinct shadows total | 9.5 | – | TODO | CS |
| R.coh.007 | Hover language consistent across all hoverable surfaces (cards, tabs, buttons): same direction (lift), same magnitude band, same easing | 9.5 | – | TODO | CS |
| R.coh.008 | Focus-visible ring is the SAME ring on every focusable (color, width, offset) | 9.5 | – | TODO | CS |
| R.coh.009 | Active-press inset behaviour is the same on every pressable | 9.5 | – | TODO | CS |
| R.coh.010 | Disabled state vocabulary identical for all disabled surfaces (opacity + cursor + filter) | 9.5 | – | TODO | CS |
| R.coh.011 | Empty-state pattern (illustration + 1-sentence copy + optional CTA) shared by every empty surface in panel | 9.5 | – | TODO | SEE |
| R.coh.012 | Loading-skeleton pattern shape matches the real card shape it stands in for (same width, height, radius) | 9.5 | – | TODO | SEE |
| R.coh.013 | Error-state pattern shared across all error surfaces (purchase failure, fetch failure) | 9.5 | – | TODO | SEE |
| R.coh.014 | Voice/tone for all UI labels is consistent (warm, brief, no marketing fluff) | 9.5 | – | TODO | SRC |
| R.coh.015 | Iconography style coherent (line weight, corner treatment, fill style) across coin, lock, category icons | 9.5 | – | TODO | SEE |
| R.coh.016 | Motion easing curve is the same family across all motion (e.g. ease-out for entrances, ease-in-out for transitions) | 9.5 | – | TODO | CS |
| R.coh.017 | Motion duration bands consistent: hover 0.2-0.3s, tab switch 0.25-0.4s, entrance 0.6-1.0s, coin micro 0.6-1.0s | 9.5 | – | TODO | CS |
| R.coh.018 | Panel does not introduce a chrome motif (border style, divider, ornament) absent from rest of scene | 9.5 | – | TODO | SEE |
| R.coh.019 | Card "press" depth is identical across locked/owned/golden card variants | 9.5 | – | TODO | CS |
| R.coh.020 | No new icon library introduced for panel (existing icon source reused) | 10 | – | TODO | SRC |

## R.gen — Distinctiveness vs genre

- **Genre named:** "cozy farm/garden inventory shop panel (Stardew / Hay Day / Animal Crossing lineage)"
- **Genre defaults (100× seen):**
  - Flat-color tab pills with bold icon + label
  - Square card grid, soft drop-shadow, white/cream surface
  - Pixel-art or chibi item sprites on flat colored background
  - Coin counter top-right with gold coin glyph
  - "Locked" overlay = full-card grey wash + centered padlock
  - Price tag = small gold coin + integer next to it
  - Owned-count badge as small circle top-right corner of card
  - Buy CTA = solid pill button at card footer or modal
  - Category strip across the top with active-state underline or fill
  - Empty state = generic basket / sad-face icon + "Nothing here yet" copy
- **Ownable moment required:** coin micro-animation at purchase — a coin physically lifts from the balance badge, arcs to the purchased card, lands as the "owned" badge flips into view; OR an equally specific signature beat (parchment ribbon, hand-stamped "OWNED" stamp, etc.). The screenshot a juror would post.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.gen.001 | Genre named explicitly in design notes (Stardew/Hay Day comparison made on record) | 10 | – | TODO | SRC |
| R.gen.002 | Tab pills are NOT plain flat-color rectangles — has a parchment/inflected treatment | 9.5 | – | TODO | SEE |
| R.gen.003 | Card surface is NOT a plain white/cream rectangle — has paper texture, ink edge, or hand-stamped quality | 9.5 | – | TODO | SEE |
| R.gen.004 | Locked overlay is NOT a generic grey-wash + centered padlock — has a per-card treatment (wrapped string, sealed envelope, etc.) | 9.5 | – | TODO | SEE |
| R.gen.005 | Coin counter is NOT a plain "🪙 1,234" string — has weight/depth/animation that earns the screenshot | 9.5 | – | TODO | SEE |
| R.gen.006 | Owned badge is NOT a generic top-right circle — uses a designed mark (stamp, ribbon, sprout) | 9.5 | – | TODO | SEE |
| R.gen.007 | Empty state does NOT use "Nothing here yet" + sad icon — has voice and a character beat | 9.5 | – | TODO | SEE |
| R.gen.008 | Buy CTA is NOT a generic solid pill — feels like part of the panel's chrome (carved, hand-lettered, etc.) | 9.5 | – | TODO | SEE |
| R.gen.009 | Category active-state is NOT just an underline — has a designed indicator (folded paper tab, ink mark) | 9.5 | – | TODO | SEE |
| R.gen.010 | Price-tag treatment is NOT a generic "🪙 50" — has typographic care (numeral face, kerning, mini-icon weight) | 9.5 | – | TODO | SEE |
| R.gen.011 | Ownable moment present: coin micro-animation arc or equivalent signature beat exists and is well-staged | 9.5 | – | TODO | SEE |
| R.gen.012 | Cohort comparison: panel would not be mistakable for any of the named references at first glance — has its own identity | 9.5 | – | TODO | IND |
| R.gen.013 | Cohort comparison: panel would not be mistakable for a Tailwind-template inventory grid | 9.5 | – | TODO | IND |
| R.gen.014 | At least one "how did they do that" moment per the dial-8 add-on requirement | 9.5 | – | TODO | IND |
| R.gen.015 | Panel does not use any of the AI-tell visual patterns (gradient blob backgrounds, neon glow accents, glassmorphism panels) | 10 | – | TODO | SEE |

## R.ref — Reference parity

### R.ref.scene — vs existing GardenScene.tsx panel style (PRIMARY anchor)

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.ref.scene.001 | New panel does NOT regress scene panel visual quality — equal or better at every measurable axis | 9.5 | – | TODO | SEE |
| R.ref.scene.002 | Panel palette is a strict subset of (or designed extension of) scene palette — no foreign hues | 9.5 | – | TODO | CS |
| R.ref.scene.003 | Panel chrome (border, shadow, corner radius) reads as the SAME world as scene chrome | 9.5 | – | TODO | SEE |
| R.ref.scene.004 | Typography in panel reads as the SAME author as typography in scene labels/HUD | 9.5 | – | TODO | CS |
| R.ref.scene.005 | Panel motion language is consistent with any motion already in scene (idle micro, hover lift) | 9.5 | – | TODO | SEE |
| R.ref.scene.006 | Panel does NOT add a competing focal point with the scene (visual weight balanced) | 9.5 | – | TODO | SEE |
| R.ref.scene.007 | Coins badge in panel header agrees in value with any coins indicator elsewhere in scene (single source of truth) | 9.5 | – | TODO | SRC |
| R.ref.scene.008 | Drag handoff: an item dragged out of panel into scene retains visual continuity (same sprite/icon, no flicker) | 9.5 | – | TODO | SEE |
| R.ref.scene.009 | Owned-placed indicator on a card uses the same visual mark used elsewhere to indicate placed (or is intentionally different and documented) | 9.5 | – | TODO | SEE |
| R.ref.scene.010 | When panel is open, scene remains usable and not visually starved (z-order, alpha, scroll lock all balanced) | 9.5 | – | TODO | SEE |

### R.ref.stardew — vs Stardew Valley shop (cozy, warm, icon-forward, item grid)

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.ref.stardew.001 | Match-or-surpass: icon-forward card design with clear silhouette readability at 64px | 9.5 | – | TODO | SEE |
| R.ref.stardew.002 | Match-or-surpass: price+coin pairing is glanceable in <0.5s | 9.5 | – | TODO | SEE |
| R.ref.stardew.003 | Match-or-surpass: panel warmth (color temp ≥ 4500K equivalent in panel background) | 9.5 | – | TODO | CS |
| R.ref.stardew.004 | Match-or-surpass: category strip with iconography (no text-only tab bar) | 9.5 | – | TODO | SEE |
| R.ref.stardew.005 | Match-or-surpass: card density allows 4+ items visible in default viewport without scrolling | 9.5 | – | TODO | SEE |
| R.ref.stardew.006 | Match-or-surpass: hover/select on a card surfaces description and price within the card area (no modal hop) | 9.5 | – | TODO | SEE |
| R.ref.stardew.007 | Match-or-surpass: visual hierarchy reads name > icon > price > affordability in a glance | 9.5 | – | TODO | SEE |
| R.ref.stardew.008 | Match-or-surpass: cozy/handcrafted feel (no flat-vector glossiness) | 9.5 | – | TODO | IND |
| R.ref.stardew.009 | Match-or-surpass: keyboard navigation through items works as expected for shop UX | 9.5 | – | TODO | SEE |
| R.ref.stardew.010 | Match-or-surpass: purchase confirmation feels physical (sound or motion or both — at minimum coin micro-animation per calibration) | 9.5 | – | TODO | SEE |

### R.ref.hayday — vs Hay Day shop (chunky tiles, soft shadows, coin UI)

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.ref.hayday.001 | Match-or-surpass: chunky tile feel (substantial card with breathing room — not cramped) | 9.5 | – | TODO | SEE |
| R.ref.hayday.002 | Match-or-surpass: soft drop shadow on cards (ambient + key, not harsh hard-edge) | 9.5 | – | TODO | CS |
| R.ref.hayday.003 | Match-or-surpass: coin UI in header has weight and visual hierarchy (not a thin label) | 9.5 | – | TODO | SEE |
| R.ref.hayday.004 | Match-or-surpass: tap targets generous on touch (≥44px) | 9.5 | – | TODO | CS |
| R.ref.hayday.005 | Match-or-surpass: clear can-afford / cant-afford visual distinction on cards | 9.5 | – | TODO | SEE |
| R.ref.hayday.006 | Match-or-surpass: tab bar uses iconography that reads at low resolution | 9.5 | – | TODO | SEE |
| R.ref.hayday.007 | Match-or-surpass: empty state feels like a designed surface, not an absence | 9.5 | – | TODO | SEE |
| R.ref.hayday.008 | Match-or-surpass: panel header has clear identity (label/icon establishing context) | 9.5 | – | TODO | SEE |

## R.pit — Pitch alignment
Pitch is: "A beautiful categorized garden shop panel that shows all items organized by theme, lets users buy locked items inline, and makes browsing/collecting feel like a cozy game store."

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.pit.001 | "Beautiful": no element scores below 9.5 on visual rows — beauty bar enforced via MIN rollup | 9.5 | – | TODO | IND |
| R.pit.002 | "Categorized": items split across exactly the four named categories (Structures / Plants / Critters / Golden) with no orphans | 10 | – | TODO | SRC |
| R.pit.003 | "By theme": each category's visual identity (icon, possibly subtle accent) is recognisably different — a glance at a tab tells you what's in it | 9.5 | – | TODO | SEE |
| R.pit.004 | "Buy locked items inline": purchase happens within the panel — no modal exit, no full-page redirect | 10 | – | TODO | SEE |
| R.pit.005 | "Browsing feels cozy": no aggressive marketing UI (no countdown timers, no "limited time", no FOMO patterns) | 10 | – | TODO | SEE |
| R.pit.006 | "Collecting feels cozy": owned items show satisfaction (a mark, a count badge, a "you have this" visual reward) | 9.5 | – | TODO | SEE |
| R.pit.007 | "Like a cozy game store": tone of voice on every label/copy is warm, not transactional | 9.5 | – | TODO | SRC |
| R.pit.008 | Every element in panel can be justified against this sentence (no element exists that the pitch wouldn't ask for) | 9.5 | – | TODO | IND |

## R.cov — Combinatorial coverage

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cov.vp.360 | No horizontal scroll at 360px width; all card content reachable | 10 | – | TODO | SEE |
| R.cov.vp.390 | Layout sound at 390px (iPhone 14/15 standard); cards 2-col grid; no overflow | 10 | – | TODO | SEE |
| R.cov.vp.768 | Layout sound at 768px (iPad portrait); cards 3-col grid; tab bar fits | 10 | – | TODO | SEE |
| R.cov.vp.1024 | Layout sound at 1024px (iPad landscape / small laptop); cards 4-col grid | 10 | – | TODO | SEE |
| R.cov.vp.1280 | Layout sound at 1280px (laptop); cards 4-6 col grid | 10 | – | TODO | SEE |
| R.cov.vp.1440 | Layout sound at 1440px (desktop); cards 6-8 col grid | 10 | – | TODO | SEE |
| R.cov.vp.1920 | Layout sound at 1920px (large desktop); cards 8-10 col grid; panel does not get visually starved | 10 | – | TODO | SEE |
| R.cov.scheme.light | Light theme (default per calibration) renders with full design intent | 10 | – | TODO | SEE |
| R.cov.input.mouse | Every interaction performable with mouse | 10 | – | TODO | SEE |
| R.cov.input.touch | Every interaction performable with touch (no hover-only affordance) | 10 | – | TODO | SEE |
| R.cov.input.kb | Every interaction performable with keyboard (Tab, Shift+Tab, Enter, Space, Arrows on tabs) | 10 | – | TODO | SEE |
| R.cov.motion.default | All motion runs at intended timing with `prefers-reduced-motion: no-preference` | 9.5 | – | TODO | SEE |
| R.cov.motion.reduced | All motion collapses to ~0 duration with `prefers-reduced-motion: reduce`; content remains visible and feature still works | 10 | – | TODO | SEE |
| R.cov.contrast.default | Default contrast: all text ≥4.5:1, UI ≥3:1 against actual computed bg | 10 | – | TODO | MEAS |
| R.cov.contrast.more | `prefers-contrast: more` strengthens borders/dividers (visible difference) | 9.5 | – | TODO | SEE |
| R.cov.contrast.forced | `forced-colors: active` (Windows High Contrast) — interactive elements remain identifiable; no purely-color affordances | 9.5 | – | TODO | SEE |
| R.cov.state.loaded | Loaded state: full item grid renders with correct ownership/lock states | 10 | – | TODO | SEE |
| R.cov.state.loading | Loading state: skeleton matches card shape; visible during data fetch | 9.5 | – | TODO | SEE |
| R.cov.state.empty.tab | Empty tab state: a category with zero items shows designed empty state, not blank grid | 9.5 | – | TODO | SEE |
| R.cov.state.empty.owned | Empty owned state (early game): locked items still browseable | 10 | – | TODO | SEE |
| R.cov.state.error.purchase | Purchase failure: error surfaces inline near CTA; balance rollback visible | 9.5 | – | TODO | SEE |
| R.cov.state.error.fetch | Item-fetch failure: panel does not crash; user-facing error with retry | 9.5 | – | TODO | SEE |
| R.cov.state.populated.partial | Partial ownership (some owned, some locked, some placed): all three states visible coherently in a single grid view | 9.5 | – | TODO | SEE |
| R.cov.state.populated.all-owned | All-owned state (no locked items in a category): grid still feels intentional, not "nothing to do" | 9.5 | – | TODO | SEE |
| R.cov.state.auth | Authenticated state (current scope) — purchase action wired to Supabase coin balance | 10 | – | TODO | SRC |
| R.cov.state.unauth | Unauthenticated state: panel either not rendered or gracefully degraded (per existing app behaviour); document the choice | 9.5 | – | TODO | SRC |
| R.cov.iso.viewport-zoom-200 | At 200% browser zoom on 1280px viewport, panel content remains usable (WCAG 1.4.10) | 9.5 | – | TODO | SEE |
| R.cov.iso.text-spacing | WCAG 1.4.12: panel functional after applying user text-spacing override | 9.5 | – | TODO | SEE |


## R.cap — Capability presence + quality (DEEP aspects from 02-aspect-profile.md)

### R.cap.tabs — Category tab navigation (DEEP, aspect #1)
Capability: themed pill tabs with emoji/icon per category, animated active indicator.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.tabs.001 | Exactly 4 tabs render: Structures / Plants / Critters / Golden | 10 | – | TODO | SRC |
| R.cap.tabs.002 | Each tab has a distinct icon glyph; not all four are emoji of the same metaphor | 9.5 | – | TODO | SEE |
| R.cap.tabs.003 | Active tab is visually unambiguous (≥2 distinguishing properties: fill, weight, indicator) | 9.5 | – | TODO | SEE |
| R.cap.tabs.004 | Inactive tabs are clearly secondary but still readable (≥4.5:1 contrast on label) | 9.5 | – | TODO | MEAS |
| R.cap.tabs.005 | Active indicator animates from old tab to new tab (slide/fade), not snap | 9.5 | – | TODO | SEE |
| R.cap.tabs.006 | Active-indicator transition duration in 0.25-0.4s band | 9.5 | – | TODO | CS |
| R.cap.tabs.007 | Active-indicator easing is the cohesion-coh.016 family (no rogue easing) | 9.5 | – | TODO | CS |
| R.cap.tabs.008 | Tab content swap: outgoing tab fades or wipes before incoming arrives (no double-stack flash) | 9.5 | – | TODO | SEE |
| R.cap.tabs.009 | Tab keyboard semantics: implemented as `role="tablist"` + `role="tab"` + `aria-selected` + `aria-controls` | 10 | – | TODO | SRC |
| R.cap.tabs.010 | Arrow-key navigation between tabs (Left/Right cycle); Home/End jump to first/last | 10 | – | TODO | SEE |
| R.cap.tabs.011 | Roving tabindex: only the active tab has tabindex=0; others tabindex=-1 | 10 | – | TODO | SRC |
| R.cap.tabs.012 | Tab activation: automatic on focus (default WAI-ARIA pattern) OR manual on Enter — pick one and apply consistently | 9.5 | – | TODO | SRC |
| R.cap.tabs.013 | Tab labels remain visible at 360px viewport (no truncation that loses meaning) | 9.5 | – | TODO | SEE |
| R.cap.tabs.014 | Tab tap target ≥44px on touch widths | 10 | – | TODO | CS |
| R.cap.tabs.015 | Focus-visible ring on each tab is unobstructed (not clipped by adjacent tab or container) | 9.5 | – | TODO | SEE |

### R.cap.cards — Item card design with owned/locked states (DEEP, aspect #2)
Capability: three distinct visual states — owned-placed, owned-unplaced, locked.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.cards.001 | Three card variants implemented and visually distinguishable in a single glance | 10 | – | TODO | SEE |
| R.cap.cards.002 | Owned-placed variant has its own designed mark (e.g. "in scene" stamp / sprout / ribbon) — not just a checkmark | 9.5 | – | TODO | SEE |
| R.cap.cards.003 | Owned-unplaced variant signals "drag me into the scene" affordance | 9.5 | – | TODO | SEE |
| R.cap.cards.004 | Locked variant shows lock icon AND price AND inline-purchase CTA together (per calibration) | 10 | – | TODO | SEE |
| R.cap.cards.005 | Locked variant does not visually crowd the item silhouette (lock + price + CTA are organized, not overlapping the art) | 9.5 | – | TODO | SEE |
| R.cap.cards.006 | Owned-placed card explicitly is NOT marked as "purchaseable again" (no duplicate-buy footgun) | 10 | – | TODO | SRC |
| R.cap.cards.007 | Owned-unplaced card is draggable (cursor changes to grab on hover) | 10 | – | TODO | SEE |
| R.cap.cards.008 | Owned-placed card is NOT draggable from panel (item already in scene) — OR is draggable and replaces existing placement; pick one and document | 9.5 | – | TODO | SRC |
| R.cap.cards.009 | Card silhouette readable at default desktop card size (typically 96-128px) | 9.5 | – | TODO | SEE |
| R.cap.cards.010 | Card silhouette readable at touch min size (88px in 2-col mobile) | 9.5 | – | TODO | SEE |
| R.cap.cards.011 | Card name label fits in single line at all viewports — or truncates with `…` + accessible full name via `title`/SR | 9.5 | – | TODO | SEE |
| R.cap.cards.012 | Card has no near-zero gap with its neighbors (≥8px gap in grid) | 9.5 | – | TODO | CS |
| R.cap.cards.013 | Card has consistent internal padding between art / label / footer (no off-token gaps) | 9.5 | – | TODO | CS |
| R.cap.cards.014 | Card art / icon is centered with intent within its container (no off-center drift) | 9.5 | – | TODO | SEE |
| R.cap.cards.015 | Owned-placed indicator does NOT compete visually with locked-state badge in the same grid (clear hierarchy) | 9.5 | – | TODO | SEE |
| R.cap.cards.016 | All three variants share the same outer footprint (no jumping card sizes within a grid) | 10 | – | TODO | CS |

### R.cap.buy — Purchase / unlock flow (DEEP, aspect #3)
Capability: inline coin-spend with confirmation affordance; no modal exit.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.buy.001 | Buy CTA on a locked card triggers purchase without opening a modal or navigating away | 10 | – | TODO | SEE |
| R.cap.buy.002 | Buy CTA disabled (visually + functionally + aria-disabled) when balance < price | 10 | – | TODO | SEE |
| R.cap.buy.003 | Buy CTA shows pending state during server action (spinner or pulse inside the button) | 9.5 | – | TODO | SEE |
| R.cap.buy.004 | Optimistic coin deduction: balance updates immediately on click, rolls back on server error | 9.5 | – | TODO | SEE |
| R.cap.buy.005 | Optimistic card flip: card transitions from locked to owned-unplaced immediately, rolls back on error | 9.5 | – | TODO | SEE |
| R.cap.buy.006 | Successful purchase shows a confirmation beat (coin micro-animation per cap.coin) — not a snackbar/toast | 9.5 | – | TODO | SEE |
| R.cap.buy.007 | Failed purchase shows error message inline near CTA (not in a toast that disappears) | 9.5 | – | TODO | SEE |
| R.cap.buy.008 | Double-click / rapid-fire is debounced — second click before server response is ignored, not double-spent | 10 | – | TODO | SRC |
| R.cap.buy.009 | Server action: calls `purchaseRewardAction(formData)` per existing data layer (no new wire format) | 10 | – | TODO | SRC |
| R.cap.buy.010 | Purchase confirmation does NOT shift other cards in the grid (no layout jump from new badge) | 9.5 | – | TODO | SEE |
| R.cap.buy.011 | After purchase, item moves visually from "locked" to "owned" but stays in same grid position (no re-sort jump) | 9.5 | – | TODO | SEE |
| R.cap.buy.012 | After purchase, screen reader announces "Purchased <item name>" via aria-live | 10 | – | TODO | SEE |
| R.cap.buy.013 | Purchase is triggerable by Enter AND Space on the CTA button | 10 | – | TODO | SEE |
| R.cap.buy.014 | Buy CTA tap target ≥44px on touch widths | 10 | – | TODO | CS |
| R.cap.buy.015 | If purchase fails due to network, retry path is clear (button re-enables; clear message; no spinner forever) | 10 | – | TODO | SEE |
| R.cap.buy.016 | Golden items (focus-hours requirement) do NOT show coin-buy CTA — they show a "requires N focus hours" treatment | 10 | – | TODO | SEE |
| R.cap.buy.017 | Golden items: if requirement met, the unlock action triggers the same coin-micro confirmation beat (or its golden equivalent) | 9.5 | – | TODO | SEE |

### R.cap.coin — Coin micro-animation on purchase (DEEP, aspect #4) — THE SIGNATURE OWNABLE MOMENT
Capability: coin-flip + sparkle burst on successful purchase. This IS the screenshot a juror would post.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.coin.001 | Animation fires on successful purchase (only on success, never on click) | 10 | – | TODO | SEE |
| R.cap.coin.002 | Animation is staged: a coin element lifts from coin-balance badge | 9.5 | – | TODO | SEE |
| R.cap.coin.003 | Animation arc: coin travels along a noticeable arc (not a straight line) to the purchased card | 9.5 | – | TODO | SEE |
| R.cap.coin.004 | Animation lands: coin "drops" / "absorbs" into the now-owned card with a settling beat | 9.5 | – | TODO | SEE |
| R.cap.coin.005 | Sparkle burst (optional but desirable) accompanies landing, not the launch | 9.5 | – | TODO | SEE |
| R.cap.coin.006 | Animation timing 0.6-1.0s total (cinematic but not slow) | 9.5 | – | TODO | CS |
| R.cap.coin.007 | Animation uses `transform` + `opacity` only — no layout-shifting properties | 10 | – | TODO | SRC |
| R.cap.coin.008 | Animation does NOT cause layout shift in the panel grid | 10 | – | TODO | SEE |
| R.cap.coin.009 | Animation is GPU-accelerated (will-change/transform); held at ~60fps on mid-range hardware | 9.5 | – | TODO | MEAS |
| R.cap.coin.010 | Animation respects `prefers-reduced-motion`: collapses to instant balance update + brief flash, no arc | 10 | – | TODO | SEE |
| R.cap.coin.011 | Animation does NOT block subsequent purchases (user can buy a second item during the animation if they want) | 9.5 | – | TODO | SEE |
| R.cap.coin.012 | Coin balance number updates synchronously with the landing beat (not before, not after — synced) | 9.5 | – | TODO | SEE |
| R.cap.coin.013 | Animation easing follows cohesion-coh.016 (no rogue ease-out-elastic if rest of motion is ease-out-cubic) | 9.5 | – | TODO | CS |
| R.cap.coin.014 | Animation aesthetic matches calibration "warm, handcrafted" — not Material-style ripple or neon flash | 9.5 | – | TODO | SEE |
| R.cap.coin.015 | Animation pauses / does not fire when tab is hidden (no off-screen waste) | 9.5 | – | TODO | SRC |

### R.cap.lock — Lock icon treatment (affordable vs unaffordable) (DEEP, aspect #5)
Capability: dual states — soft amber lock (can afford) vs hard grey lock + muted card (cannot afford).

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.lock.001 | Two distinct lock states render based on `balance >= price` | 10 | – | TODO | SRC |
| R.cap.lock.002 | Affordable-lock variant uses warm tone (amber/gold tint) that invites action | 9.5 | – | TODO | SEE |
| R.cap.lock.003 | Unaffordable-lock variant uses cooler / muted tone that signals "not yet" without feeling punitive | 9.5 | – | TODO | SEE |
| R.cap.lock.004 | Unaffordable card whole-card treatment is dim (~60-70% opacity or desaturate filter) | 9.5 | – | TODO | CS |
| R.cap.lock.005 | Unaffordable card price label is still readable (contrast ≥4.5:1 against actual computed bg) | 10 | – | TODO | MEAS |
| R.cap.lock.006 | Unaffordable cards remain focusable for keyboard browsing (not removed from tab order) | 10 | – | TODO | SEE |
| R.cap.lock.007 | Unaffordable cards have aria-disabled on buy button, with accessible label ("Costs N — you have M") | 10 | – | TODO | SEE |
| R.cap.lock.008 | Lock icon style cohesive across both states (same icon family, only color/tone changes) | 9.5 | – | TODO | SEE |
| R.cap.lock.009 | Lock icon size is consistent across card sizes (does not balloon on larger cards) | 9.5 | – | TODO | CS |
| R.cap.lock.010 | Lock icon never obscures the item silhouette such that it's unrecognizable | 9.5 | – | TODO | SEE |
| R.cap.lock.011 | Lock has a designed counterpart-removal moment: when an item is purchased, the lock dissolves/lifts as part of the cap.coin animation (not a hard snap) | 9.5 | – | TODO | SEE |
| R.cap.lock.012 | Affordability state updates immediately when balance changes (e.g. purchase of one item flips a borderline-affordable item to affordable in real time) | 9.5 | – | TODO | SEE |

### R.cap.motion — Animation and motion (DEEP, aspect #6)
Capability: tab cross-fade + card stagger pop-in + unlock scale-up reveal. Per-surface scoring required.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.motion.tab.001 | Tab switch: outgoing content fades out (0.15-0.2s ease-out) | 9.5 | – | TODO | CS |
| R.cap.motion.tab.002 | Tab switch: incoming content fades in (0.2-0.25s ease-out) | 9.5 | – | TODO | CS |
| R.cap.motion.tab.003 | Tab switch: no init-jump on panel open (cards don't snap from off-position to position) | 10 | – | TODO | SEE |
| R.cap.motion.card.001 | Card stagger pop-in on tab arrival: ≤80ms stagger per card; first card visible within 250ms | 9.5 | – | TODO | MEAS |
| R.cap.motion.card.002 | Card pop-in uses opacity + small translateY (≤8px); no scale > 0.95-1.0 (so cards don't grow from tiny) | 9.5 | – | TODO | CS |
| R.cap.motion.card.003 | Card stagger pauses after first ~12 cards (no 60-card cascading wait) | 9.5 | – | TODO | SEE |
| R.cap.motion.unlock.001 | Unlock reveal: when card flips locked → owned, the transition is staged (not a single CSS class swap) | 9.5 | – | TODO | SEE |
| R.cap.motion.unlock.002 | Unlock reveal includes a subtle scale-up (≤1.04) then settle, conveying "revealed" | 9.5 | – | TODO | CS |
| R.cap.motion.unlock.003 | Unlock reveal duration 0.4-0.7s | 9.5 | – | TODO | CS |
| R.cap.motion.unlock.004 | Lock element exits visibly during reveal (fade + slight lift), not instantly disappears | 9.5 | – | TODO | SEE |
| R.cap.motion.coh.001 | All four motion surfaces above use the same easing family (no mix of cubic-bezier curves) | 9.5 | – | TODO | CS |
| R.cap.motion.coh.002 | All motion uses `transform`/`opacity` only (no width/height/margin animations) | 10 | – | TODO | SRC |
| R.cap.motion.coh.003 | All motion respects `prefers-reduced-motion` (duration → 0 OR animation removed; content remains visible) | 10 | – | TODO | SEE |
| R.cap.motion.coh.004 | No motion thrashes layout (no FLIP without proper FLIP technique; no reflow animations) | 10 | – | TODO | MEAS |
| R.cap.motion.coh.005 | Motion runs at ~60fps on a mid-range machine; profile a tab switch to verify | 9.5 | – | TODO | MEAS |

### R.cap.coins — Coins display in panel header (DEEP, aspect #7)
Capability: persistent coin balance badge visible throughout panel; updates optimistically.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.coins.001 | Coin balance badge visible in panel header regardless of active tab | 10 | – | TODO | SEE |
| R.cap.coins.002 | Coin balance badge has glyph + integer value; integer is the dominant element | 9.5 | – | TODO | SEE |
| R.cap.coins.003 | Coin glyph weight/style cohesive with rest of icon system | 9.5 | – | TODO | SEE |
| R.cap.coins.004 | Integer typography uses tabular-num (no jumping digits during count animation) | 9.5 | – | TODO | CS |
| R.cap.coins.005 | Balance updates optimistically on purchase (instant), reverses on server error | 9.5 | – | TODO | SEE |
| R.cap.coins.006 | Balance update animates: a count-down tween (~300-500ms) for the deducted amount, not a snap | 9.5 | – | TODO | SEE |
| R.cap.coins.007 | Balance acts as the launch point for cap.coin animation (the coin flies from the badge) | 9.5 | – | TODO | SEE |
| R.cap.coins.008 | Balance has aria-live so screen reader users hear the new balance | 10 | – | TODO | SRC |
| R.cap.coins.009 | Balance label includes accessible context ("Coin balance: 1,234") not just bare number | 10 | – | TODO | SRC |
| R.cap.coins.010 | Balance number contrast ≥4.5:1 in default theme | 10 | – | TODO | MEAS |
| R.cap.coins.011 | Balance does NOT shift its position when value changes width (5-digit → 6-digit) — reserve space | 9.5 | – | TODO | CS |
| R.cap.coins.012 | Balance feels substantial (not a thin badge); has visual weight per ref.hayday.003 | 9.5 | – | TODO | SEE |

### R.cap.a11y — Accessibility (DEEP, aspect #8)
Capability: full keyboard nav across tabs + cards; ARIA roles for shop region, item names, purchase buttons. NOTE: per routing 03-routing.md section E, accessibility is a hand-built gap; this subtree IS the manual WCAG checklist.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.a11y.region.001 | Panel exposed as a landmark or labeled region (`<section aria-label="Garden shop">` or similar) | 10 | – | TODO | SRC |
| R.cap.a11y.tabs.001 | Tabs implement WAI-ARIA Tabs pattern (tablist/tab/tabpanel + aria-selected + aria-controls) | 10 | – | TODO | SRC |
| R.cap.a11y.tabs.002 | Roving tabindex on tabs (active=0, others=-1) | 10 | – | TODO | SRC |
| R.cap.a11y.tabs.003 | Arrow-keys cycle tabs; Home/End jump to first/last | 10 | – | TODO | SEE |
| R.cap.a11y.cards.001 | Each card is reachable by Tab (or grouped grid with Arrow nav — pick one) | 10 | – | TODO | SEE |
| R.cap.a11y.cards.002 | Each card has an accessible name combining item name + state ("Sunflower, locked, costs 50") | 10 | – | TODO | SRC |
| R.cap.a11y.cards.003 | Locked-card lock icon is `aria-hidden` (state already in name); decorative-not-meaningful | 10 | – | TODO | SRC |
| R.cap.a11y.cards.004 | Owned-placed indicator has accessible text ("In scene") not color-only | 10 | – | TODO | SRC |
| R.cap.a11y.buy.001 | Buy button is a real `<button>` (not div+onClick), `type="button"` | 10 | – | TODO | SRC |
| R.cap.a11y.buy.002 | Buy button accessible name includes item + price ("Buy Sunflower for 50 coins") | 10 | – | TODO | SRC |
| R.cap.a11y.buy.003 | Disabled buy button uses `aria-disabled="true"` (and explains why via name) — NOT `disabled` attr if you want it to remain focusable | 10 | – | TODO | SRC |
| R.cap.a11y.live.001 | Purchase success announced via aria-live polite ("Purchased Sunflower. Balance now 1,184") | 10 | – | TODO | SRC |
| R.cap.a11y.live.002 | Purchase error announced via aria-live assertive | 10 | – | TODO | SRC |
| R.cap.a11y.live.003 | Tab change does NOT announce ("Plants tab selected") repeatedly — handled by ARIA tabs pattern natively | 9.5 | – | TODO | IND |
| R.cap.a11y.focus.001 | Focus-visible ring on every focusable element (tabs, cards, buy buttons) | 10 | – | TODO | SEE |
| R.cap.a11y.focus.002 | Focus ring is NOT obscured by sticky/overlay elements within panel | 10 | – | TODO | SEE |
| R.cap.a11y.focus.003 | Focus ring contrast against adjacent surfaces ≥3:1 | 10 | – | TODO | MEAS |
| R.cap.a11y.focus.004 | After purchase, focus remains on the now-owned card's primary action (or moves logically) — not lost to body | 9.5 | – | TODO | SEE |
| R.cap.a11y.focus.005 | After tab switch via keyboard, focus is on the tab (per WAI ARIA tabs pattern), not into the panel | 9.5 | – | TODO | SEE |
| R.cap.a11y.contrast.001 | Body / label text ≥4.5:1 in default theme (every label, every state) | 10 | – | TODO | MEAS |
| R.cap.a11y.contrast.002 | UI components (borders, icons that convey state) ≥3:1 | 10 | – | TODO | MEAS |
| R.cap.a11y.contrast.003 | Locked / dimmed card text remains ≥4.5:1 against its actual computed bg | 10 | – | TODO | MEAS |
| R.cap.a11y.motion.001 | Every motion in cap.motion respects `prefers-reduced-motion` | 10 | – | TODO | SEE |
| R.cap.a11y.contrast.more | `prefers-contrast: more` strengthens borders/dividers on cards and tabs | 9.5 | – | TODO | SEE |
| R.cap.a11y.forced-colors | `forced-colors: active`: tabs, cards, buttons all remain identifiable; no purely-bg-color state distinctions | 9.5 | – | TODO | SEE |
| R.cap.a11y.kb.001 | Full purchase flow performable end-to-end keyboard-only (Tab to category, Arrow to tab, Tab to card, Enter to buy, verify confirmation) | 10 | – | TODO | SEE |
| R.cap.a11y.target.001 | All tap targets ≥24px (WCAG 2.5.8 minimum); ≥44px on touch widths (best practice) | 10 | – | TODO | CS |
| R.cap.a11y.lang.001 | Language attribute correct on panel root (inherited from page `<html lang>`) | 10 | – | TODO | SRC |


### R.cap.empty — Empty states (MEDIUM, aspect #9)
Capability: designed empty state per category — warm illustration + friendly copy.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.empty.001 | A category with zero items renders a designed empty state (not a blank grid) | 10 | – | TODO | SEE |
| R.cap.empty.002 | Empty state has illustration / character beat (per criteria-library "creative opportunity") | 9.5 | – | TODO | SEE |
| R.cap.empty.003 | Empty state copy has voice — warm, brief, in the panel's tone | 9.5 | – | TODO | SRC |
| R.cap.empty.004 | Empty state copy is NOT "Nothing here yet" or any generic placeholder phrase | 10 | – | TODO | SRC |
| R.cap.empty.005 | Empty state includes a clear next action where applicable ("Earn 10 more focus hours to unlock first Golden item") | 9.5 | – | TODO | SEE |
| R.cap.empty.006 | All-owned state (no locked left in a category) feels rewarding, not "nothing to do here" | 9.5 | – | TODO | SEE |
| R.cap.empty.007 | Empty state typography matches panel hierarchy (no jumbo display type out of nowhere) | 9.5 | – | TODO | SEE |

### R.cap.sort — Sorting within category (MEDIUM, aspect #10)
Capability: price ascending default; owned float to top within category.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.sort.001 | Default sort: owned items appear first within each category, then locked by price ascending | 10 | – | TODO | SEE |
| R.cap.sort.002 | Owned-placed and owned-unplaced ordering within owned section is documented (e.g. unplaced first, placed last) | 9.5 | – | TODO | SRC |
| R.cap.sort.003 | Sort does NOT reshuffle after every purchase (purchased item stays in original visual position briefly, then settles) — no visual chaos | 9.5 | – | TODO | SEE |
| R.cap.sort.004 | Golden items use focus-hours requirement as the implicit sort dimension | 9.5 | – | TODO | SRC |

### R.cap.model — Inventory vs shop conceptual model (MEDIUM, aspect #11)
Capability: unified panel — owned + locked shown together per category; placed items still visible.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.model.001 | Each category shows BOTH owned and locked items in a single grid (no separate "owned" / "shop" sub-tabs) | 10 | – | TODO | SEE |
| R.cap.model.002 | Placed items still appear in the grid with their "in scene" indicator (not hidden) | 10 | – | TODO | SEE |
| R.cap.model.003 | Conceptual model is glanceable: a first-time user understands within 5 seconds that owned + locked coexist | 9.5 | – | TODO | IND |
| R.cap.model.004 | No duplicate items rendered (each item appears once per its category) | 10 | – | TODO | SRC |
| R.cap.model.005 | An item cannot be both "owned-placed" and "locked" simultaneously (state machine sound) | 10 | – | TODO | SRC |

### R.cap.grouping — Category grouping logic (MEDIUM, aspect #12)
Capability: map item categories to display groups — Structures / Plants / Critters / Golden.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.grouping.001 | Every item in the catalogue maps to exactly one of the 4 named categories | 10 | – | TODO | SRC |
| R.cap.grouping.002 | No "uncategorised" or "Other" bucket at dial 8 (all items have intentional placement) | 10 | – | TODO | SRC |
| R.cap.grouping.003 | Golden category is reserved for focus-hours-gated items only (no coin-priced item appears here) | 10 | – | TODO | SRC |
| R.cap.grouping.004 | Category mapping is data-driven (not hardcoded if/else per item) | 9.5 | – | TODO | SRC |
| R.cap.grouping.005 | Per-tab item count is in a reasonable range (10-17 per calibration); no category is empty by data design | 9.5 | – | TODO | SRC |

### R.cap.responsive — Responsive layout (MEDIUM, aspect #13)
Capability: 2-col mobile → 3-col tablet → 4-col desktop (calibration says 4→6→8→10 per panel surface spec).

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.responsive.001 | At <480px (small mobile), grid = 4 cols (per panel spec) without crowding | 9.5 | – | TODO | SEE |
| R.cap.responsive.002 | At 768px (tablet), grid = 6 cols | 9.5 | – | TODO | SEE |
| R.cap.responsive.003 | At 1280px, grid = 8 cols | 9.5 | – | TODO | SEE |
| R.cap.responsive.004 | At 1920px, grid = 10 cols | 9.5 | – | TODO | SEE |
| R.cap.responsive.005 | Breakpoint transitions are smooth — no awkward intermediate widths (e.g. 901-1000) that snap weirdly | 9.5 | – | TODO | SEE |
| R.cap.responsive.006 | Panel height capped on mobile with internal scroll (does not push scene off-screen) | 9.5 | – | TODO | CS |
| R.cap.responsive.007 | Tab bar remains usable on mobile (no horizontal scroll that buries far tabs) | 9.5 | – | TODO | SEE |

### R.cap.typo — Typography (MEDIUM, aspect #14)
Capability: game-UI label style; rounded, slightly chunky; size hierarchy name / count / price.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.typo.001 | Item name typography distinct from price typography (different weight or size) | 9.5 | – | TODO | CS |
| R.cap.typo.002 | Price typography uses tabular-nums (no jumping digit widths) | 9.5 | – | TODO | CS |
| R.cap.typo.003 | Font weights used are members of the existing weight set (no rogue weight) | 10 | – | TODO | CS |
| R.cap.typo.004 | Line-height on multi-line labels is comfortable (≥1.3 for small labels) | 9.5 | – | TODO | CS |
| R.cap.typo.005 | Letter-spacing on tab labels and badges set with intent (not browser default for caps) | 9.5 | – | TODO | CS |
| R.cap.typo.006 | Font face supports the chunky/rounded register per calibration vibe (not a flat sans like Inter without modification) | 9.5 | – | TODO | SEE |

### R.cap.palette — Color and palette (MEDIUM, aspect #15)
Capability: parchment panel bg + cream card surface + mossy green active tab + coin-gold accent.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.palette.001 | Panel bg is parchment (warm off-white with subtle texture or undertone), not pure white | 9.5 | – | TODO | CS |
| R.cap.palette.002 | Card surface cream — different from panel bg by ≥3% Lab L | 9.5 | – | TODO | CS |
| R.cap.palette.003 | Active tab color is mossy green from existing scene palette (not new green) | 9.5 | – | TODO | CS |
| R.cap.palette.004 | Coin gold accent matches scene coin glyph color | 9.5 | – | TODO | CS |
| R.cap.palette.005 | No more than 6 distinct hues used in entire panel (palette discipline) | 9.5 | – | TODO | CS |
| R.cap.palette.006 | No saturated red used as a primary state color (would break cozy vibe; reserve only for hard-error) | 9.5 | – | TODO | CS |

### R.cap.hover — Hover / focus micro-interactions (MEDIUM, aspect #16)
Capability: subtle scale-up on card hover; inset press on purchase button.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.hover.card.001 | Card hover: scale 1.0 → 1.02-1.04, 0.2-0.3s ease-out | 9.5 | – | TODO | CS |
| R.cap.hover.card.002 | Card hover: shadow grows subtly (1 level up the shadow scale) | 9.5 | – | TODO | CS |
| R.cap.hover.card.003 | Card hover does NOT cause layout shift on neighbors (scale via transform only) | 10 | – | TODO | SRC |
| R.cap.hover.btn.001 | Buy button hover: inset press tilt OR slight scale 1.0 → 1.02 | 9.5 | – | TODO | CS |
| R.cap.hover.btn.002 | Buy button active: inset depth (translateY 1-2px), 0.1s ease-in | 9.5 | – | TODO | CS |
| R.cap.hover.tab.001 | Tab hover (on inactive tabs): subtle tone shift, 0.2s ease | 9.5 | – | TODO | CS |
| R.cap.hover.no-touch | Hover effects disabled on touch (no sticky-hover state after tap) | 9.5 | – | TODO | SEE |

### R.cap.skeleton — Panel loading skeleton (MEDIUM, aspect #17)
Capability: skeleton cards in grid formation matching card shape.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.skeleton.001 | Skeleton renders during initial data fetch | 10 | – | TODO | SEE |
| R.cap.skeleton.002 | Skeleton card shape matches real card footprint (width, height, radius) — no layout shift on real data arrival | 10 | – | TODO | SEE |
| R.cap.skeleton.003 | Skeleton has gentle shimmer / pulse (not aggressive, not static) | 9.5 | – | TODO | CS |
| R.cap.skeleton.004 | Skeleton respects `prefers-reduced-motion` (no shimmer; static placeholder) | 10 | – | TODO | SEE |
| R.cap.skeleton.005 | Skeleton count matches expected grid density (not 1 skeleton in a 4-col grid) | 9.5 | – | TODO | SEE |
| R.cap.skeleton.006 | Skeleton is replaced by real cards without a flash / opacity jump | 9.5 | – | TODO | SEE |
| R.cap.skeleton.007 | Skeleton has accessible role (`role="status"` + `aria-label="Loading items"`) | 10 | – | TODO | SRC |

### R.cap.scroll — Scroll behaviour within category grid (MEDIUM, aspect #18)
Capability: smooth momentum scroll on iOS; bounded scroll container.

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| R.cap.scroll.001 | Scroll container has `overscroll-behavior: contain` (does not chain to page scroll) | 9.5 | – | TODO | CS |
| R.cap.scroll.002 | Scroll runs at ~60fps on a mid-range machine (no jank from heavy shadows / blurs in cards) | 9.5 | – | TODO | MEAS |
| R.cap.scroll.003 | Scroll respects iOS momentum (`-webkit-overflow-scrolling` not set to anything that breaks it) | 9.5 | – | TODO | SEE |
| R.cap.scroll.004 | No `backdrop-filter` inside the scroll container (per criteria-library performance rule) | 10 | – | TODO | SRC |
| R.cap.scroll.005 | Scroll position is preserved when switching tabs back to a category (or intentionally reset — pick one and document) | 9.5 | – | TODO | SEE |
| R.cap.scroll.006 | Keyboard scroll (PageUp/PageDown, Arrow keys when focus inside scroll area) works | 9.5 | – | TODO | SEE |


---

# P — Unit (panel) subtrees
The artifact is one unit: the shop panel embedded in GardenScene.tsx. Sections within it: panel header (coins badge + title), tab bar, item grid, item card (in its three variants), buy CTA, golden-item gate label, empty state, loading skeleton, error state.

## P.shop.coh — Unit-level cohesion (within panel)

| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| P.shop.coh.001 | Header, tab bar, and grid share aligned left/right edges (no off-px drift) | 9.5 | – | TODO | CS |
| P.shop.coh.002 | Vertical rhythm between header → tab bar → grid uses spacing scale (no off-token gaps) | 9.5 | – | TODO | CS |
| P.shop.coh.003 | Card variants (locked / owned-unplaced / owned-placed) all use same internal padding | 10 | – | TODO | CS |
| P.shop.coh.004 | Coin glyph in header matches coin glyph used in price tag on cards (single source) | 10 | – | TODO | SEE |
| P.shop.coh.005 | Lock icon and "in scene" indicator agree on icon family / line weight | 9.5 | – | TODO | SEE |
| P.shop.coh.006 | Buy CTA in card matches buy CTA visual style across locked and golden variants (only label differs) | 9.5 | – | TODO | SEE |
| P.shop.coh.007 | Hover/focus/active vocab identical across all interactive elements in panel | 9.5 | – | TODO | CS |
| P.shop.coh.008 | Empty state, loading skeleton, error state all use same internal padding/margin pattern as a normal grid | 9.5 | – | TODO | CS |

---

## P.shop.header — Panel header section
Houses panel title (optional), coins badge, optional close affordance.

### P.shop.header.coh — Section cohesion
| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| P.shop.header.coh.001 | Header contents (title, badge) are vertically centered on the same baseline | 9.5 | – | TODO | CS |
| P.shop.header.coh.002 | Header height consistent across viewports (does not jump between breakpoints) | 9.5 | – | TODO | CS |
| P.shop.header.coh.003 | Header bg coherent with panel bg (subtle distinction OR seamless — pick one and apply) | 9.5 | – | TODO | SEE |

### P.shop.header.coins — Element: coin balance badge

##### Aspect: NEED
| P.shop.header.coins.need.1 | Argue for removing: removal fails because user must see balance to make purchase decisions | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.header.coins.sub.1 | Subject ("you have N coins") readable in <2s glance | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.header.coins.vis.1 | Composition: glyph + integer balanced (not glyph-dominant nor integer-dominant) | 9.5 | – | TODO | SEE |
| P.shop.header.coins.vis.2 | Alignment: integer baseline aligns with glyph baseline | 9.5 | – | TODO | CS |
| P.shop.header.coins.vis.3 | Color: coin-gold accent used only here and in card price tags (consistent meaning) | 9.5 | – | TODO | CS |
##### Aspect: TYPOGRAPHY
| P.shop.header.coins.typ.1 | Integer uses tabular-nums (no width jump on value change) | 10 | – | TODO | CS |
| P.shop.header.coins.typ.2 | Integer weight bold enough to read as primary info at default viewport | 9.5 | – | TODO | CS |
| P.shop.header.coins.typ.3 | Integer color ≥4.5:1 against actual computed bg | 10 | – | TODO | MEAS |
| P.shop.header.coins.typ.4 | Integer uses comma thousands separator (or locale-aware separator) for ≥4-digit values | 9.5 | – | TODO | SEE |
##### Aspect: MOTION
| P.shop.header.coins.mot.1 | Balance count-down tween on purchase (~300-500ms ease-out) — not snap | 9.5 | – | TODO | SEE |
| P.shop.header.coins.mot.2 | No init-jump on panel open (number renders in place, doesn't tween from 0) | 10 | – | TODO | SEE |
| P.shop.header.coins.mot.3 | Tween respects `prefers-reduced-motion` (snap to new value) | 10 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.header.coins.int.1 | Balance is NOT a button (it's a display) — does not have hover/active states | 10 | – | TODO | SRC |
| P.shop.header.coins.int.2 | Balance is focusable for screen readers via `aria-label` / `aria-live` (handled in a11y subtree) | 10 | – | TODO | SRC |
##### Aspect: SPACING
| P.shop.header.coins.spc.1 | Internal gap glyph-to-integer ≥6px ≤12px | 9.5 | – | TODO | CS |
| P.shop.header.coins.spc.2 | Badge has breathing room: ≥16px from panel edge / title | 9.5 | – | TODO | CS |
##### Aspect: RESPONSIVE
| P.shop.header.coins.rsp.1 | Badge fits at 360px viewport without overlapping title | 9.5 | – | TODO | SEE |
| P.shop.header.coins.rsp.2 | Badge anchor position (typically top-right) maintained across all viewports | 9.5 | – | TODO | SEE |
##### Aspect: A11Y
| P.shop.header.coins.a11.1 | Aria-live region announces balance changes | 10 | – | TODO | SRC |
| P.shop.header.coins.a11.2 | Accessible name includes the word "coins" so context is clear without seeing glyph | 10 | – | TODO | SRC |
##### Aspect: PERFORMANCE
| P.shop.header.coins.prf.1 | Balance update does not trigger panel-wide reflow | 10 | – | TODO | MEAS |
##### Aspect: COPY
| P.shop.header.coins.cpy.1 | If a label accompanies the integer ("Coins"), it is one word, no flourish | 9.5 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.header.coins.coh.1 | Coin glyph matches scene coin glyph (identical asset or token) | 10 | – | TODO | SEE |
##### Aspect: SKILL ROUTING
| P.shop.header.coins.rte.1 | Built under frontend-design discipline (per routing 03-routing.md part 1) | 10 | – | TODO | SRC |

### P.shop.header.title — Element: panel title (if present)

##### Aspect: NEED
| P.shop.header.title.need.1 | Argue for removing: if the panel is visually unmistakable as "the shop", title can be cut. Default = include for screen readers | 9.5 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.header.title.sub.1 | If present, title clearly says what this panel is ("Garden Shop" or equivalent) | 9.5 | – | TODO | SRC |
##### Aspect: VISUAL
| P.shop.header.title.vis.1 | Title weight does NOT compete with the coin balance badge for primary attention | 9.5 | – | TODO | SEE |
##### Aspect: TYPOGRAPHY
| P.shop.header.title.typ.1 | Title uses one of the existing display sizes (not a one-off) | 9.5 | – | TODO | CS |
| P.shop.header.title.typ.2 | Title color ≥4.5:1 against panel bg | 10 | – | TODO | MEAS |
##### Aspect: A11Y
| P.shop.header.title.a11.1 | Title is a heading (`<h2>` or `<h3>` depending on document outline) | 10 | – | TODO | SRC |
| P.shop.header.title.a11.2 | If title is hidden visually (e.g. visually-hidden class), it remains in DOM for SR | 10 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.header.title.coh.1 | Title typography matches scene heading typography family | 10 | – | TODO | CS |

---

## P.shop.tabbar — Tab bar section

### P.shop.tabbar.coh — Section cohesion
| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| P.shop.tabbar.coh.001 | All 4 tabs equal width OR all 4 tabs intrinsic width with consistent gap (no mixed strategy) | 10 | – | TODO | CS |
| P.shop.tabbar.coh.002 | Tab bar bottom edge aligned with panel content top edge — no near-zero gap | 9.5 | – | TODO | CS |
| P.shop.tabbar.coh.003 | Tab icon + label have consistent vertical alignment across all 4 tabs | 9.5 | – | TODO | CS |

### P.shop.tabbar.tab — Element: one tab (template applies to each of 4 tabs; this row set scores ALL four uniformly)

##### Aspect: NEED
| P.shop.tabbar.tab.need.1 | Argue for removing: 4 categories justified by item count (10-17 per category × 4 = 48 total); below 6 items per category would justify combining | 9.5 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.tabbar.tab.sub.1 | Tab label + icon together communicate the category in <1s | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.tabbar.tab.vis.1 | Icon-to-label proportion: icon does not swamp label (icon ~16-24px against ~14-16px label) | 9.5 | – | TODO | CS |
| P.shop.tabbar.tab.vis.2 | Active state visually wins over inactive in a peripheral glance (≥2 cues: color + indicator + weight) | 9.5 | – | TODO | SEE |
| P.shop.tabbar.tab.vis.3 | Inactive tab colors are tonally muted (not pure grey — uses panel palette family) | 9.5 | – | TODO | CS |
##### Aspect: TYPOGRAPHY
| P.shop.tabbar.tab.typ.1 | Tab label typography: one weight, one size across all 4 tabs | 10 | – | TODO | CS |
| P.shop.tabbar.tab.typ.2 | Label letter-spacing intentional (not default for caps if caps are used) | 9.5 | – | TODO | CS |
| P.shop.tabbar.tab.typ.3 | Active and inactive label colors both ≥4.5:1 against tab bg | 10 | – | TODO | MEAS |
##### Aspect: MOTION
| P.shop.tabbar.tab.mot.1 | Hover tone shift 0.2s ease-out | 9.5 | – | TODO | CS |
| P.shop.tabbar.tab.mot.2 | Active-state transition (tab → tab): indicator slides 0.25-0.35s | 9.5 | – | TODO | CS |
| P.shop.tabbar.tab.mot.3 | No init-jump on first paint (indicator renders under active tab, doesn't slide in from off-screen) | 10 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.tabbar.tab.int.1 | Default state: muted color, no hover affordance until focus/hover | 10 | – | TODO | SEE |
| P.shop.tabbar.tab.int.2 | Hover state: tone shift + cursor pointer | 10 | – | TODO | SEE |
| P.shop.tabbar.tab.int.3 | Focus-visible state: outline ring per coh.008 | 10 | – | TODO | SEE |
| P.shop.tabbar.tab.int.4 | Active state: full active styling (color shift + indicator) | 10 | – | TODO | SEE |
| P.shop.tabbar.tab.int.5 | Press/active: visible press-feedback (slight inset or color deepen) | 9.5 | – | TODO | SEE |
| P.shop.tabbar.tab.int.6 | Disabled state: not applicable (no tab should ever be disabled in this panel; if needed in future, document) | 9.5 | – | TODO | SRC |
##### Aspect: SPACING
| P.shop.tabbar.tab.spc.1 | Internal padding ≥12px horizontal, ≥8px vertical (tap target compliance) | 10 | – | TODO | CS |
| P.shop.tabbar.tab.spc.2 | Gap between adjacent tabs ≥4px ≤16px (consistent across the bar) | 9.5 | – | TODO | CS |
##### Aspect: RESPONSIVE
| P.shop.tabbar.tab.rsp.1 | At 360px, all 4 tabs fit without horizontal scroll | 9.5 | – | TODO | SEE |
| P.shop.tabbar.tab.rsp.2 | At 360px, label remains readable (no aggressive truncation) | 9.5 | – | TODO | SEE |
| P.shop.tabbar.tab.rsp.3 | At ≥1280px, tabs do not stretch awkwardly across full width | 9.5 | – | TODO | SEE |
##### Aspect: A11Y
| P.shop.tabbar.tab.a11.1 | `role="tab"` + `aria-selected` + `aria-controls` set per WAI ARIA Tabs pattern | 10 | – | TODO | SRC |
| P.shop.tabbar.tab.a11.2 | Tab icon `aria-hidden` (label conveys meaning) | 10 | – | TODO | SRC |
| P.shop.tabbar.tab.a11.3 | Roving tabindex (active=0, others=-1) | 10 | – | TODO | SRC |
| P.shop.tabbar.tab.a11.4 | Arrow-key navigation per WAI pattern | 10 | – | TODO | SEE |
| P.shop.tabbar.tab.a11.5 | Tap target ≥44px on touch widths | 10 | – | TODO | CS |
##### Aspect: PERFORMANCE
| P.shop.tabbar.tab.prf.1 | Tab switch does not re-render entire panel (only inactive panels unmount or hide via CSS) | 9.5 | – | TODO | SRC |
##### Aspect: COPY
| P.shop.tabbar.tab.cpy.1 | Labels are one word ("Structures", "Plants", "Critters", "Golden") — not phrases | 10 | – | TODO | SRC |
| P.shop.tabbar.tab.cpy.2 | Labels match category contents (Golden is gold-themed/focus-hours, not coin-priced) | 10 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.tabbar.tab.coh.1 | All 4 tabs use the same icon family / line weight | 9.5 | – | TODO | SEE |
| P.shop.tabbar.tab.coh.2 | Active-tab color is mossy green (per palette spec) | 9.5 | – | TODO | CS |
##### Aspect: SKILL ROUTING
| P.shop.tabbar.tab.rte.1 | Built under frontend-design + TDD (tab state behaviour has failing test first) | 10 | – | TODO | SRC |


---

## P.shop.grid — Item grid section
The grid container that lays out cards within the active tab.

### P.shop.grid.coh — Section cohesion
| ID | Criterion | Target | Score | Status | Evidence |
|---|---|---|---|---|---|
| P.shop.grid.coh.001 | Grid uses CSS Grid (not flex-wrap) for predictable layout | 9.5 | – | TODO | SRC |
| P.shop.grid.coh.002 | Grid gap consistent on both axes (no row-gap ≠ column-gap unless intentional) | 9.5 | – | TODO | CS |
| P.shop.grid.coh.003 | All cards in the grid have identical outer dimensions (no variant-by-variant size drift) | 10 | – | TODO | CS |
| P.shop.grid.coh.004 | Grid alignment: cards align edges precisely (no off-px drift) | 9.5 | – | TODO | CS |

---

## P.shop.card.locked — Element: locked card variant

##### Aspect: NEED
| P.shop.card.locked.need.1 | Locked card is needed (proves shop functionality) — removal fails | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.card.locked.sub.1 | "Locked + buyable" status communicated in <1.5s | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.card.locked.vis.1 | Lock + price + buy CTA arranged in clear hierarchy (item silhouette dominant) | 9.5 | – | TODO | SEE |
| P.shop.card.locked.vis.2 | Lock icon does not obscure item silhouette (positioned at a corner, ~25% of card area max) | 9.5 | – | TODO | SEE |
| P.shop.card.locked.vis.3 | Price tag visually paired with coin glyph (no integer floating alone) | 9.5 | – | TODO | SEE |
| P.shop.card.locked.vis.4 | Card surface: cream paper texture or treatment per R.gen.003 | 9.5 | – | TODO | SEE |
| P.shop.card.locked.vis.5 | Buy CTA visually distinct from card body but harmonious (not jarring) | 9.5 | – | TODO | SEE |
##### Aspect: TYPOGRAPHY
| P.shop.card.locked.typ.1 | Item name typography readable at card size; ≥4.5:1 contrast | 10 | – | TODO | MEAS |
| P.shop.card.locked.typ.2 | Price integer typography uses tabular-nums | 9.5 | – | TODO | CS |
| P.shop.card.locked.typ.3 | Price weight ≥ name weight (price is the actionable info on a locked card) | 9.5 | – | TODO | CS |
| P.shop.card.locked.typ.4 | No three sizes within a single card (item name, price, and buy label — max 2 distinct sizes) | 9.5 | – | TODO | CS |
##### Aspect: MOTION
| P.shop.card.locked.mot.1 | Card pop-in on tab arrival (per cap.motion.card.001) | 9.5 | – | TODO | SEE |
| P.shop.card.locked.mot.2 | Hover lift per cap.hover.card.001 | 9.5 | – | TODO | CS |
| P.shop.card.locked.mot.3 | On purchase: lock dissolves + reveal scale-up per cap.motion.unlock.* | 9.5 | – | TODO | SEE |
| P.shop.card.locked.mot.4 | No init-jump (card renders in place at first paint) | 10 | – | TODO | SEE |
| P.shop.card.locked.mot.5 | Reduced-motion: hover/pop-in/reveal all degrade to instant; content visible | 10 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.card.locked.int.1 | Default: locked styling visible | 10 | – | TODO | SEE |
| P.shop.card.locked.int.2 | Hover: card lifts; buy CTA highlights | 10 | – | TODO | SEE |
| P.shop.card.locked.int.3 | Focus-visible: ring per coh.008 | 10 | – | TODO | SEE |
| P.shop.card.locked.int.4 | Active: card press depth (subtle) when entire card clicked | 9.5 | – | TODO | SEE |
| P.shop.card.locked.int.5 | Disabled (unaffordable): dimmed per cap.lock.004; buy CTA aria-disabled | 10 | – | TODO | SEE |
| P.shop.card.locked.int.6 | Loading (during purchase): buy CTA shows pending; card not removed mid-flight | 9.5 | – | TODO | SEE |
| P.shop.card.locked.int.7 | Error (purchase failed): inline error near CTA; card returns to locked state | 9.5 | – | TODO | SEE |
| P.shop.card.locked.int.8 | Success: card flips to owned-unplaced per cap.buy.005 | 10 | – | TODO | SEE |
##### Aspect: SPACING
| P.shop.card.locked.spc.1 | Internal padding consistent: ≥12px around art, ≥8px between art and label | 9.5 | – | TODO | CS |
| P.shop.card.locked.spc.2 | No near-zero gap between buy CTA and card edge (≥8px) | 9.5 | – | TODO | CS |
| P.shop.card.locked.spc.3 | Card has consistent grid spacing with neighbors (uses cap.responsive grid gap) | 9.5 | – | TODO | CS |
##### Aspect: RESPONSIVE
| P.shop.card.locked.rsp.1 | Card readable at smallest grid size (88px in 4-col 360px viewport per spec) | 9.5 | – | TODO | SEE |
| P.shop.card.locked.rsp.2 | At largest size (1920px, 10-col), card does not look stretched / empty | 9.5 | – | TODO | SEE |
| P.shop.card.locked.rsp.3 | Buy CTA fits within card at every size — no overflow, no truncation that hides "Buy" | 9.5 | – | TODO | SEE |
##### Aspect: A11Y
| P.shop.card.locked.a11.1 | Accessible name: "<item name>, locked, costs N coins" | 10 | – | TODO | SRC |
| P.shop.card.locked.a11.2 | Lock icon `aria-hidden` (state in accessible name) | 10 | – | TODO | SRC |
| P.shop.card.locked.a11.3 | Card focusable via Tab OR via parent grid Arrow nav (consistent with cap.a11y.cards.001) | 10 | – | TODO | SEE |
| P.shop.card.locked.a11.4 | Color is NOT the only carrier of locked state (lock icon + price + CTA all communicate it) | 10 | – | TODO | SEE |
| P.shop.card.locked.a11.5 | Tap target for entire card ≥44px on touch | 10 | – | TODO | CS |
##### Aspect: PERFORMANCE
| P.shop.card.locked.prf.1 | Card has no `backdrop-filter` (would jank in scroll container) | 10 | – | TODO | SRC |
| P.shop.card.locked.prf.2 | Card images use intrinsic size + lazy loading where applicable | 9.5 | – | TODO | SRC |
##### Aspect: COPY
| P.shop.card.locked.cpy.1 | Item name copy is the canonical item name (no shop-only rewrite) | 10 | – | TODO | SRC |
| P.shop.card.locked.cpy.2 | Buy CTA label is "Buy" or single word — no marketing phrase ("Unlock now!") | 10 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.card.locked.coh.1 | Card visual language matches owned variants (outer footprint, padding, radius) | 10 | – | TODO | SEE |
##### Aspect: SKILL ROUTING
| P.shop.card.locked.rte.1 | Built under frontend-design + TDD (locked-state logic has failing test first) | 10 | – | TODO | SRC |

---

## P.shop.card.owned-unplaced — Element: owned-unplaced card variant

##### Aspect: NEED
| P.shop.card.ou.need.1 | Variant needed (proves the unified inventory model from cap.model) — removal fails | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.card.ou.sub.1 | "Owned and drag me into the scene" communicated in <1.5s | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.card.ou.vis.1 | NO lock, NO price, NO buy CTA shown — clean card focused on item silhouette | 10 | – | TODO | SEE |
| P.shop.card.ou.vis.2 | Drag-affordance hint (subtle texture or icon) suggests draggable | 9.5 | – | TODO | SEE |
| P.shop.card.ou.vis.3 | Item silhouette pops vs cream card surface (≥3:1 graphical contrast) | 9.5 | – | TODO | MEAS |
##### Aspect: TYPOGRAPHY
| P.shop.card.ou.typ.1 | Item name typography identical to locked card name typography | 10 | – | TODO | CS |
| P.shop.card.ou.typ.2 | Item count badge (if owned > 1 of same item) uses tabular-nums | 9.5 | – | TODO | CS |
##### Aspect: MOTION
| P.shop.card.ou.mot.1 | Card pop-in on tab arrival (per cap.motion.card.001) | 9.5 | – | TODO | SEE |
| P.shop.card.ou.mot.2 | Hover lift per cap.hover.card.001 | 9.5 | – | TODO | CS |
| P.shop.card.ou.mot.3 | Drag-start: card lifts off (scale ≤1.06 + shadow grows) signaling pick-up | 9.5 | – | TODO | SEE |
| P.shop.card.ou.mot.4 | Reduced-motion: drag affordance remains (cursor) but no scale-up | 10 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.card.ou.int.1 | Default: clean owned styling | 10 | – | TODO | SEE |
| P.shop.card.ou.int.2 | Hover: cursor changes to grab; subtle card lift | 10 | – | TODO | SEE |
| P.shop.card.ou.int.3 | Focus-visible: ring per coh.008 | 10 | – | TODO | SEE |
| P.shop.card.ou.int.4 | Active/grab: cursor changes to grabbing | 9.5 | – | TODO | SEE |
| P.shop.card.ou.int.5 | Drag handoff to scene canvas works (per existing drag-drop logic; this panel side wires up correctly) | 10 | – | TODO | SEE |
| P.shop.card.ou.int.6 | Drag-cancel returns card to grid without visual confusion | 9.5 | – | TODO | SEE |
##### Aspect: SPACING
| P.shop.card.ou.spc.1 | Internal padding identical to locked variant | 10 | – | TODO | CS |
##### Aspect: RESPONSIVE
| P.shop.card.ou.rsp.1 | Drag affordance works on touch (long-press starts drag, per existing drag system) | 9.5 | – | TODO | SEE |
##### Aspect: A11Y
| P.shop.card.ou.a11.1 | Accessible name: "<item name>, owned" or "<item name>, owned, ready to place" | 10 | – | TODO | SRC |
| P.shop.card.ou.a11.2 | Keyboard alternative to drag: "Place in scene" action accessible via Enter (or documented alternative path) | 10 | – | TODO | SEE |
| P.shop.card.ou.a11.3 | Tap target ≥44px on touch | 10 | – | TODO | CS |
##### Aspect: PERFORMANCE
| P.shop.card.ou.prf.1 | Drag preview uses transform only (no DOM clones that thrash layout) | 9.5 | – | TODO | SRC |
##### Aspect: COPY
| P.shop.card.ou.cpy.1 | No "Owned!" badge label — visual mark + accessible name handle it | 9.5 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.card.ou.coh.1 | Card outer footprint identical to other variants | 10 | – | TODO | CS |
##### Aspect: SKILL ROUTING
| P.shop.card.ou.rte.1 | Built under frontend-design (visual) + TDD (drag wiring tested) | 10 | – | TODO | SRC |

---

## P.shop.card.owned-placed — Element: owned-placed card variant

##### Aspect: NEED
| P.shop.card.op.need.1 | Variant needed (so user can see what they own AND what's in scene at a glance) — removal would hurt model clarity | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.card.op.sub.1 | "Already placed in scene" communicated in <1s | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.card.op.vis.1 | "In scene" indicator (stamp / sprout / ribbon per R.gen.006) clearly visible | 9.5 | – | TODO | SEE |
| P.shop.card.op.vis.2 | Card has slight visual treatment that distinguishes from owned-unplaced (e.g. slightly muted, or a corner mark) | 9.5 | – | TODO | SEE |
| P.shop.card.op.vis.3 | Item silhouette still clearly visible (placed status does not over-occlude item art) | 9.5 | – | TODO | SEE |
##### Aspect: TYPOGRAPHY
| P.shop.card.op.typ.1 | "In scene" label (if present) uses small body text size | 9.5 | – | TODO | CS |
##### Aspect: MOTION
| P.shop.card.op.mot.1 | Pop-in per cap.motion.card.001 | 9.5 | – | TODO | SEE |
| P.shop.card.op.mot.2 | Hover lift per cap.hover.card.001 (still hoverable, just not draggable per documented choice) | 9.5 | – | TODO | CS |
| P.shop.card.op.mot.3 | When item is returned from scene to owned-unplaced (if app supports), transition is staged (not snap) | 9.5 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.card.op.int.1 | Default: owned-placed styling visible | 10 | – | TODO | SEE |
| P.shop.card.op.int.2 | Hover: subtle lift; cursor does NOT show grab (placed cards are not draggable per default policy) | 9.5 | – | TODO | SEE |
| P.shop.card.op.int.3 | Focus-visible: ring per coh.008 | 10 | – | TODO | SEE |
| P.shop.card.op.int.4 | Click action: optional "view in scene" (highlights item in scene) OR no action — pick one and document | 9.5 | – | TODO | SRC |
| P.shop.card.op.int.5 | Disabled state: not applicable (always interactive at minimum for SR readout) | 9.5 | – | TODO | SRC |
##### Aspect: SPACING
| P.shop.card.op.spc.1 | Internal padding identical to locked + owned-unplaced variants | 10 | – | TODO | CS |
##### Aspect: A11Y
| P.shop.card.op.a11.1 | Accessible name: "<item name>, in scene" | 10 | – | TODO | SRC |
| P.shop.card.op.a11.2 | "In scene" indicator has text alternative (not color-only) | 10 | – | TODO | SRC |
| P.shop.card.op.a11.3 | Tap target ≥44px on touch | 10 | – | TODO | CS |
##### Aspect: PERFORMANCE
| P.shop.card.op.prf.1 | No animation runs continuously on placed card (no shimmer / sparkle eating CPU) | 9.5 | – | TODO | MEAS |
##### Aspect: COPY
| P.shop.card.op.cpy.1 | "In scene" indicator copy (visible or aria) is exactly 2 words, no flourish | 10 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.card.op.coh.1 | Outer footprint identical to other variants | 10 | – | TODO | CS |
| P.shop.card.op.coh.2 | "In scene" mark uses same icon family as scene-side placed indicators (if any) | 9.5 | – | TODO | SEE |
##### Aspect: SKILL ROUTING
| P.shop.card.op.rte.1 | Built under frontend-design + TDD (state-machine tested for owned-placed transitions) | 10 | – | TODO | SRC |


---

## P.shop.buy — Element: buy CTA button (lives inside locked-card; element-scored because it is the highest-stakes interaction in the panel)

##### Aspect: NEED
| P.shop.buy.need.1 | Buy CTA needed (calibration requires inline-purchase) — removal fails | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.buy.sub.1 | Label "Buy" + price visible together in <0.5s glance | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.buy.vis.1 | Button shape consistent (rounded rectangle / pill matching other buttons in app) | 9.5 | – | TODO | SEE |
| P.shop.buy.vis.2 | Button color: filled accent (coin-gold OR mossy-green) — pick one and use consistently | 9.5 | – | TODO | CS |
| P.shop.buy.vis.3 | Button label color ≥4.5:1 against button bg | 10 | – | TODO | MEAS |
| P.shop.buy.vis.4 | Hierarchy: button is the second focal point in a locked card (after item silhouette) | 9.5 | – | TODO | SEE |
##### Aspect: TYPOGRAPHY
| P.shop.buy.typ.1 | Label weight bold (so it reads as actionable) | 9.5 | – | TODO | CS |
| P.shop.buy.typ.2 | Label size readable at smallest card size (≥12px) | 9.5 | – | TODO | CS |
##### Aspect: MOTION
| P.shop.buy.mot.1 | Hover: color deepen + slight scale (1.0 → 1.02) 0.15-0.25s | 9.5 | – | TODO | CS |
| P.shop.buy.mot.2 | Active/press: inset 1-2px, 0.1s ease-in | 9.5 | – | TODO | CS |
| P.shop.buy.mot.3 | Pending (during server action): pulse or spinner inside button (per cap.buy.003) | 9.5 | – | TODO | SEE |
| P.shop.buy.mot.4 | Success: button enters cap.coin animation; visually "consumed" | 9.5 | – | TODO | SEE |
| P.shop.buy.mot.5 | Reduced-motion: hover/press collapse to color shift only | 10 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.buy.int.1 | Default state visible | 10 | – | TODO | SEE |
| P.shop.buy.int.2 | Hover state visible | 10 | – | TODO | SEE |
| P.shop.buy.int.3 | Focus-visible ring present | 10 | – | TODO | SEE |
| P.shop.buy.int.4 | Active/press state visible | 10 | – | TODO | SEE |
| P.shop.buy.int.5 | Disabled (unaffordable): visually dim + cursor not-allowed + aria-disabled (per cap.lock.007) | 10 | – | TODO | SEE |
| P.shop.buy.int.6 | Loading state (pending) visible | 10 | – | TODO | SEE |
| P.shop.buy.int.7 | Success state visible (brief: button shows ✓ or "Purchased" for ~500ms before card flips) | 9.5 | – | TODO | SEE |
| P.shop.buy.int.8 | Error state: button text changes to "Retry"; card stays locked | 9.5 | – | TODO | SEE |
| P.shop.buy.int.9 | Triggerable by Enter | 10 | – | TODO | SEE |
| P.shop.buy.int.10 | Triggerable by Space | 10 | – | TODO | SEE |
| P.shop.buy.int.11 | Debounced (per cap.buy.008) — no double-spend on rapid-fire | 10 | – | TODO | SRC |
##### Aspect: SPACING
| P.shop.buy.spc.1 | Internal padding ≥8px horizontal, ≥4px vertical (and meets tap-target via height min) | 10 | – | TODO | CS |
| P.shop.buy.spc.2 | Button gap from card edge ≥8px | 9.5 | – | TODO | CS |
##### Aspect: RESPONSIVE
| P.shop.buy.rsp.1 | Button label fits at all card sizes (no truncation that hides "Buy" or price) | 9.5 | – | TODO | SEE |
| P.shop.buy.rsp.2 | Button tap target ≥44px on touch widths | 10 | – | TODO | CS |
##### Aspect: A11Y
| P.shop.buy.a11.1 | Real `<button type="button">` — not div+onClick | 10 | – | TODO | SRC |
| P.shop.buy.a11.2 | Accessible name includes item + price ("Buy Sunflower for 50 coins") | 10 | – | TODO | SRC |
| P.shop.buy.a11.3 | Disabled button announces "unavailable, you need 30 more coins" via accessible name update | 10 | – | TODO | SRC |
| P.shop.buy.a11.4 | Loading state announces via aria-live "Purchasing Sunflower..." | 10 | – | TODO | SRC |
| P.shop.buy.a11.5 | Error state announces error message via aria-live assertive | 10 | – | TODO | SRC |
| P.shop.buy.a11.6 | Focus does NOT escape button mid-purchase (focus management stable) | 9.5 | – | TODO | SEE |
##### Aspect: PERFORMANCE
| P.shop.buy.prf.1 | Optimistic update on click is synchronous (no server round-trip blocking UI) | 10 | – | TODO | SRC |
##### Aspect: COPY
| P.shop.buy.cpy.1 | Label is "Buy" (one word). No "Buy now!" / "Get it!" / "Add to garden" alternatives | 10 | – | TODO | SRC |
| P.shop.buy.cpy.2 | Error message is specific ("Not enough coins" / "Network error — try again"), not generic ("Something went wrong") | 10 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.buy.coh.1 | Style matches any other primary CTA in the app (or is intentionally a new pattern documented) | 9.5 | – | TODO | SEE |
##### Aspect: SKILL ROUTING
| P.shop.buy.rte.1 | Built under frontend-design + TDD (purchase flow has failing test first per routing) | 10 | – | TODO | SRC |

---

## P.shop.golden-gate — Element: golden-item focus-hours requirement label (replaces buy CTA for golden tab items)

##### Aspect: NEED
| P.shop.gg.need.1 | Needed (calibration #7: Golden items show focus-hours requirement instead of coin price) | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.gg.sub.1 | "Earned by N focus hours" communicated in <1.5s | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.gg.vis.1 | Visual treatment is distinct from coin-priced cards (gold leaf? distinct icon?) — clear it's a different reward path | 9.5 | – | TODO | SEE |
| P.shop.gg.vis.2 | Progress towards requirement visible (e.g. "12/25 hours" or progress bar) | 9.5 | – | TODO | SEE |
| P.shop.gg.vis.3 | Met-requirement state: clear "claim" affordance differs from unmet "in progress" state | 9.5 | – | TODO | SEE |
##### Aspect: TYPOGRAPHY
| P.shop.gg.typ.1 | Integer hours typography uses tabular-nums | 9.5 | – | TODO | CS |
| P.shop.gg.typ.2 | Label contrast ≥4.5:1 against card bg | 10 | – | TODO | MEAS |
##### Aspect: MOTION
| P.shop.gg.mot.1 | Progress bar (if present) animates smoothly on update; no init-jump | 9.5 | – | TODO | SEE |
| P.shop.gg.mot.2 | Met-requirement transition (unmet → met) is staged (small celebratory beat) | 9.5 | – | TODO | SEE |
| P.shop.gg.mot.3 | Reduced-motion: progress updates instant; no celebration | 10 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.gg.int.1 | Default (unmet) state: label shows requirement; no action available | 10 | – | TODO | SEE |
| P.shop.gg.int.2 | Met state: claim button enables; styled like other primary CTA | 10 | – | TODO | SEE |
| P.shop.gg.int.3 | Focus-visible ring on claim button | 10 | – | TODO | SEE |
| P.shop.gg.int.4 | Claim is triggerable by Enter / Space | 10 | – | TODO | SEE |
##### Aspect: SPACING
| P.shop.gg.spc.1 | Label spacing within card identical to price-tag spacing on coin cards (visual rhythm preserved) | 9.5 | – | TODO | CS |
##### Aspect: RESPONSIVE
| P.shop.gg.rsp.1 | Label readable at smallest card size; truncates progress text gracefully if needed | 9.5 | – | TODO | SEE |
##### Aspect: A11Y
| P.shop.gg.a11.1 | Accessible name includes item + requirement state ("Crystal Sprout, earned by 25 focus hours — you have 12") | 10 | – | TODO | SRC |
| P.shop.gg.a11.2 | Progress communicated via aria-valuemin/max/now on progress bar role | 10 | – | TODO | SRC |
| P.shop.gg.a11.3 | Claim button when enabled announces ready to claim | 10 | – | TODO | SRC |
##### Aspect: PERFORMANCE
| P.shop.gg.prf.1 | Progress bar update does not re-render entire panel (scoped state) | 9.5 | – | TODO | SRC |
##### Aspect: COPY
| P.shop.gg.cpy.1 | Copy uses "focus hours" consistently (not "hours focused" or "study time") | 10 | – | TODO | SRC |
| P.shop.gg.cpy.2 | Claim CTA label is one word ("Claim") | 10 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.gg.coh.1 | Golden tab visual accent (gold) consistent across all golden-gate cards | 9.5 | – | TODO | CS |
##### Aspect: SKILL ROUTING
| P.shop.gg.rte.1 | Built under frontend-design + TDD (focus-hour requirement logic tested) | 10 | – | TODO | SRC |

---

## P.shop.empty — Element: empty-state surface (per category)

##### Aspect: NEED
| P.shop.empty.need.1 | Needed for "all-owned" and "data-empty" scenarios (cap.empty) — removal would leave a blank grid | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.empty.sub.1 | User understands the empty state's meaning in <2s ("nothing here" / "you have them all" / "earn more to unlock") | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.empty.vis.1 | Has an illustration / character beat (not just text) per criteria-library guidance | 9.5 | – | TODO | SEE |
| P.shop.empty.vis.2 | Illustration tone matches panel vibe (warm, handcrafted) | 9.5 | – | TODO | SEE |
| P.shop.empty.vis.3 | Layout centered within the grid area; does not float top-left | 9.5 | – | TODO | CS |
##### Aspect: TYPOGRAPHY
| P.shop.empty.typ.1 | Copy uses existing body typography (no special display style) | 10 | – | TODO | CS |
| P.shop.empty.typ.2 | Text contrast ≥4.5:1 | 10 | – | TODO | MEAS |
##### Aspect: MOTION
| P.shop.empty.mot.1 | Fade-in on tab arrival (consistent with card pop-in language) | 9.5 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.empty.int.1 | If a next-action CTA exists, it is a real button with focus-visible / hover states | 10 | – | TODO | SEE |
##### Aspect: SPACING
| P.shop.empty.spc.1 | Vertical padding around empty content ≥32px so it doesn't feel cramped | 9.5 | – | TODO | CS |
##### Aspect: RESPONSIVE
| P.shop.empty.rsp.1 | Empty state remains centered and legible at 360px | 9.5 | – | TODO | SEE |
##### Aspect: A11Y
| P.shop.empty.a11.1 | Empty state container is announced via aria-live polite when it appears | 9.5 | – | TODO | SRC |
| P.shop.empty.a11.2 | Illustration `aria-hidden` (copy carries meaning) | 10 | – | TODO | SRC |
##### Aspect: PERFORMANCE
| P.shop.empty.prf.1 | Illustration loaded as SVG or small asset (≤20kB); no heavy raster | 9.5 | – | TODO | MEAS |
##### Aspect: COPY
| P.shop.empty.cpy.1 | Copy has voice (warm, brief, in character) — NOT "No items yet" | 10 | – | TODO | SRC |
| P.shop.empty.cpy.2 | Copy is one sentence, ≤14 words | 9.5 | – | TODO | SRC |
| P.shop.empty.cpy.3 | No AI-tells: no "Stay tuned", no "Coming soon!", no "Check back later" | 10 | – | TODO | SRC |
| P.shop.empty.cpy.4 | If next-action CTA present, the verb is concrete ("Earn 5 more focus hours") | 9.5 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.empty.coh.1 | Illustration style matches panel iconography family | 9.5 | – | TODO | SEE |
##### Aspect: SKILL ROUTING
| P.shop.empty.rte.1 | Built under frontend-design (visual + copy) — text register "warm, brief" per calibration vibe | 10 | – | TODO | SRC |

---

## P.shop.loading — Element: loading skeleton surface

##### Aspect: NEED
| P.shop.loading.need.1 | Needed (per cap.skeleton; data fetch may take >100ms) | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.loading.sub.1 | User understands "panel is loading, content will appear here" in <1s | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.loading.vis.1 | Skeleton cards match real card footprint per cap.skeleton.002 | 10 | – | TODO | SEE |
| P.shop.loading.vis.2 | Skeleton tone is panel-bg-adjacent (not stark grey block) | 9.5 | – | TODO | CS |
| P.shop.loading.vis.3 | Skeleton count fills typical grid (≥6 placeholders at default viewport) | 9.5 | – | TODO | SEE |
##### Aspect: MOTION
| P.shop.loading.mot.1 | Shimmer / pulse animates gently (1.5-2s cycle) | 9.5 | – | TODO | CS |
| P.shop.loading.mot.2 | No init-jump on skeleton appearance | 10 | – | TODO | SEE |
| P.shop.loading.mot.3 | Reduced-motion: shimmer disabled; static placeholder shown | 10 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.loading.int.1 | Skeleton is non-interactive (cursor default; not focusable) | 10 | – | TODO | SRC |
##### Aspect: SPACING
| P.shop.loading.spc.1 | Grid gap matches real card grid gap | 10 | – | TODO | CS |
##### Aspect: A11Y
| P.shop.loading.a11.1 | `role="status"` + `aria-label="Loading shop items"` | 10 | – | TODO | SRC |
| P.shop.loading.a11.2 | When real data arrives, status region updates (or unmounts cleanly) | 9.5 | – | TODO | SRC |
##### Aspect: PERFORMANCE
| P.shop.loading.prf.1 | Skeleton CSS-only (no JS animation loop) | 9.5 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.loading.coh.1 | Skeleton card radius / shape matches real card per cap.skeleton.002 | 10 | – | TODO | CS |
##### Aspect: SKILL ROUTING
| P.shop.loading.rte.1 | Built under frontend-design | 10 | – | TODO | SRC |

---

## P.shop.error — Element: error-state surface (panel-level fetch failure)

##### Aspect: NEED
| P.shop.error.need.1 | Needed for graceful failure of item fetch (per R.cov.state.error.fetch) | 10 | – | TODO | IND |
##### Aspect: SUBJECT
| P.shop.error.sub.1 | User understands "shop couldn't load — try again" in <2s | 9.5 | – | TODO | SEE |
##### Aspect: VISUAL
| P.shop.error.vis.1 | Error tone is warm, not punitive (avoid red splash); muted accent + brief message | 9.5 | – | TODO | SEE |
| P.shop.error.vis.2 | Retry button clearly the primary action | 9.5 | – | TODO | SEE |
##### Aspect: TYPOGRAPHY
| P.shop.error.typ.1 | Error message text contrast ≥4.5:1 | 10 | – | TODO | MEAS |
##### Aspect: MOTION
| P.shop.error.mot.1 | Fade-in (no aggressive shake / pulse) | 9.5 | – | TODO | SEE |
##### Aspect: INTERACTION
| P.shop.error.int.1 | Retry button: default / hover / focus / active / pending states all defined | 10 | – | TODO | SEE |
| P.shop.error.int.2 | Retry triggerable by Enter / Space | 10 | – | TODO | SEE |
| P.shop.error.int.3 | Retry button tap target ≥44px touch | 10 | – | TODO | CS |
##### Aspect: SPACING
| P.shop.error.spc.1 | Vertical padding ≥32px around error content | 9.5 | – | TODO | CS |
##### Aspect: A11Y
| P.shop.error.a11.1 | Error region uses `role="alert"` OR `aria-live="assertive"` so SR users hear it | 10 | – | TODO | SRC |
| P.shop.error.a11.2 | Error message describes the issue, not a generic "Error occurred" | 10 | – | TODO | SRC |
##### Aspect: PERFORMANCE
| P.shop.error.prf.1 | Error path does not trigger re-fetch loop (one retry per user click) | 10 | – | TODO | SRC |
##### Aspect: COPY
| P.shop.error.cpy.1 | Copy is warm, specific, non-blaming ("Couldn't reach the shop — try again?") | 9.5 | – | TODO | SRC |
| P.shop.error.cpy.2 | No AI-tells, no apology spirals ("We sincerely apologize for the inconvenience…") | 10 | – | TODO | SRC |
##### Aspect: COHESION
| P.shop.error.coh.1 | Error pattern matches R.coh.013 (shared with purchase-error inline) | 9.5 | – | TODO | SEE |
##### Aspect: SKILL ROUTING
| P.shop.error.rte.1 | Built under frontend-design + verification-before-completion (error path explicitly verified) | 10 | – | TODO | SRC |

---

# Footer — derived row-count math

Total leaves: 577 (count check via `grep -c '^| [PRL]' 04-criteria-tree.md`)

Breakdown (measured, not estimated — counted via `grep -cE '^\| <id-prefix>' 04-criteria-tree.md`):
- R.coh: 20 (system cohesion axes — all 9 axes covered with subsidiary rows)
- R.gen: 15 (genre-default escape rows + ownable moment + cohort comparison)
- R.ref: 28 (scene anchor 10 + Stardew 10 + Hay Day 8)
- R.pit: 8 (pitch sentence clauses)
- R.cov: 28 (viewport × scheme × input × motion × contrast × state subset)
- R.cap (DEEP × 8): tabs 15 + cards 16 + buy 17 + coin 15 + lock 12 + motion 15 + coins 12 + a11y 28 = 130
- R.cap (MEDIUM × 10): empty 7 + sort 4 + model 5 + grouping 5 + responsive 7 + typo 6 + palette 6 + hover 7 + skeleton 7 + scroll 6 = 60
- P.shop.coh: 8 (panel-level cohesion)
- P.shop.header.coh (3) + header.coins (24, full 12-aspect template) + header.title (8): 35
- P.shop.tabbar.coh (3) + tabbar.tab (33, full 12-aspect template): 36
- P.shop.grid.coh: 4
- P.shop.card.locked (41, full 12-aspect template — primary signature element): 41
- P.shop.card.owned-unplaced (26, full 12-aspect template): 26
- P.shop.card.owned-placed (23, full 12-aspect template): 23
- P.shop.buy (39, full 12-aspect template — highest-stakes interaction in panel): 39
- P.shop.golden-gate (24, full 12-aspect template): 24
- P.shop.empty (20, full 12-aspect template): 20
- P.shop.loading (15, subset template — non-interactive): 15
- P.shop.error (17, subset template): 17

Sum: 20+15+28+8+28+130+60+8+35+36+4+41+26+23+39+24+20+15+17 = 577 ✓

Surface enumeration justifying the count:
- Pages / units: 1 (the panel)
- Sections within: 4 (header, tab bar, grid+cards, ambient surfaces — empty/loading/error)
- Distinct elements: 9 (coins badge, title, tab, locked card, owned-unplaced card, owned-placed card, buy CTA, golden gate, empty + loading + error grouped)
- Signature capabilities (DEEP): 8 → ~127 leaves
- MEDIUM capabilities: 10 → ~60 leaves
- References: 3 → 28 leaves
- Coverage combos: ~28 (meaningful viewport × scheme × input × motion × contrast × state)
- Aspects/element at dial 8: ALL 12 of the template per signature element (cards, buy, golden); subset (8-10) for ambient surfaces (empty/loading/error)

Coverage check:
- Every signature capability has a subtree: PASS (8/8 DEEP + 10/10 MEDIUM)
- Every reference has parity rows: PASS (scene + Stardew + Hay Day)
- Every meaningful coverage combo is represented: PASS
- Every element from the artifact has a subtree: PASS (header coins/title, tab, 3 card variants, buy, golden gate, empty/loading/error)
- Every cohesion level present: PASS (R.coh root + P.shop.coh unit + per-section .coh subtrees)
- Reduced-motion + prefers-contrast + forced-colors covered: PASS (R.cov + per-element a11y rows)

Sanity-check vs dial-8 illustrative example: a tabbed panel with 9 elements × ~12 aspects × ~1.5 avg multi-row + 18 capabilities × ~10 + 3 references × ~10 + coverage ≈ ~400 — within range. Not padded; not under-counted. The single panel-as-unit artifact justifies ~420 leaves at dial 8.
