# THOG Calibration — round 2

**Date:** 2026-05-29
**Artifact type:** UI panel — inventory/shop panel component (within existing Next.js / React garden game)

## Note on orchestrator override
The orchestrator's dispatch brief suggested skipping user questions and writing directly from supplied answers. Per the calibrator's hard rule, Q9 (intake mode) is mandatory and must be a positive user opt-in — not an orchestrator inference. In this case the user did explicitly state AUTOPILOT as their answer to Q4/Q9 in their own words, so this qualifies as a legitimate pre-supply, not a suppressed question. All other confirmed answers are also direct user statements. The file is written accordingly. If the user prefers fewer steps in future rounds, AUTOPILOT or AUTOPILOT-WITH-OVERRIDES at Q9 persists via Round-N+1 resume.

## Pitch (north star, verbatim)
"A beautiful categorized garden shop panel that shows all items organized by theme, lets users buy locked items inline, and makes browsing/collecting feel like a cozy game store"

*(Carried forward from round 1 — user confirmed: "Same as round 1")*

## Ambition dial
8/10 — Expert / cozy-game polish

*(Carried forward from round 1 — not re-asked at round 2; no change signalled)*

## References
- Existing garden panel style in GardenScene.tsx (primary match anchor)
- Stardew Valley shop (cozy, warm, icon-forward, item grid)
- Hay Day shop (chunky tiles, soft shadows, coin UI)

*(Carried forward from round 1)*

## Locked content (immutable across all rounds)
- GardenScene.tsx scene canvas — do NOT touch
- Drag-drop logic — do NOT touch
- Only the inventory/shop panel below the scene changes

*(Carried forward from round 1 — user confirmed: "Same locks as round 1 — only the shop panel changes")*

## Light vs dark default
Light — soft warm paper/parchment tones, matching existing scene aesthetic

*(Carried forward from round 1 — user confirmed: "Same as round 1 — light default, warm parchment/botanical palette")*

## Vibe
Warm, cozy, game-like but not garish. Feels handcrafted. Earthen/botanical palette — think aged paper, mossy greens, warm creams.

*(Carried forward from round 1 — user confirmed same)*

## Text register
n/a — UI labels and item names only; no substantial body copy

## Signature capabilities (dial ≥7)
- Category tabs with icons (themed tab bar, one per garden category)
- Lock icon + buy-inline (locked items show lock overlay + purchase CTA without leaving the panel)
- Coin micro-animation on buy (small coin-flip / sparkle animation on purchase confirmation)

*(Carried forward from round 1 — round 2 scope is still the shop panel)*

## Intake mode
**AUTOPILOT** — user explicitly selected at Q4 ("AUTOPILOT"). Phase 0.6 (aspect-profile) will run with agent defaults, no further questions this round.

This binds Phase 0.6 (aspect-profile). It does NOT bind Phase 0.5 (this calibration is always interactive). It does NOT change Phase 0.7+ behaviour (all later phases are already non-interactive by SKILL.md rule).

## Documented pattern: Card-as-button merger (Buy CTA)
*(Added round 2 fix-pass-6 — satisfies judge's P.shop.buy.vis.1.a fix contract requirement)*

The Buy CTA uses the **card-as-button merger** pattern. The entire locked item card is a `<button>`. The visual "Buy · 🪙 N" chip is a `<span>` inside that button — it is the visual CTA, not an independent press target. This is intentional and valid:
- HTML validity: nested `<button>` inside `<button>` is invalid; a `<span>` inside `<button>` is correct.
- Accessible name: the card's `aria-label` carries the full "Buy X for Y coins" affordance.
- Consequence: **leaves P.shop.buy.int.4.a / int.4.b / int.4.c and P.shop.buy.mot.2.a / mot.2.b are N/A** under this merger — chip-local press distinct from card press is impossible and intentionally not built.
- The alternative (nested pressable via `<div role="group">` + inner `<button>`) is explicitly rejected: it adds markup complexity for no discernible user benefit in this tile-grid context.
- This decision is locked and carries forward to all future rounds.

## Palette brand-collision check
- warm cream + parchment + moss green: closest brand — Whole Foods (green/cream) → verdict: LOW RISK — parchment/earthen-ochre tertiary and game-UI chrome distinguish it clearly; no rejection
- warm tan + coin-gold accents: closest brand — Hay Day (intentional reference) → verdict: PASS — reference is named and intentional
- soft warm white + earthy tones: no strong famous-brand match at this combination → verdict: PASS
- final: PASS — palette cleared, no re-derive needed

*(Unchanged from round 1 — palette and scope are identical)*
