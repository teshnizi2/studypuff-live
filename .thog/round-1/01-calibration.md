# THOG Calibration — round 1

**Date:** 2026-05-27
**Artifact type:** UI panel — inventory/shop panel component (within existing Next.js / React garden game)

## Pitch (north star, verbatim)
"A beautiful categorized garden shop panel that shows all items organized by theme, lets users buy locked items inline, and makes browsing/collecting feel like a cozy game store"

## Ambition dial
8/10 — Expert / cozy-game polish

## References
- Existing garden panel style in GardenScene.tsx (primary match anchor)
- Stardew Valley shop (cozy, warm, icon-forward, item grid)
- Hay Day shop (chunky tiles, soft shadows, coin UI)

## Locked content (immutable across all rounds)
- GardenScene.tsx scene canvas — do NOT touch
- Drag-drop logic — do NOT touch
- Only the inventory/shop panel below the scene changes

## Light vs dark default
Light — soft warm paper/parchment tones, matching existing scene aesthetic

## Vibe
Warm, cozy, game-like but not garish. Feels handcrafted. Earthen/botanical palette — think aged paper, mossy greens, warm creams.

## Text register
n/a — UI labels and item names only; no substantial body copy

## Signature capabilities (dial ≥7)
- Category tabs with icons (themed tab bar, one per garden category)
- Lock icon + buy-inline (locked items show lock overlay + purchase CTA without leaving the panel)
- Coin micro-animation on buy (small coin-flip / sparkle animation on purchase confirmation)

## Intake mode
**AUTOPILOT** — user explicitly selected; Phase 0.6 (aspect-profile) will run with agent defaults, no further questions this round.

This binds Phase 0.6 (aspect-profile). It does NOT bind Phase 0.5 (this calibration is always interactive). It does NOT change Phase 0.7+ behaviour (all later phases are already non-interactive by SKILL.md rule).

## Palette brand-collision check
- warm cream + parchment + moss green: closest brand — Whole Foods (green/cream) → verdict: LOW RISK — the parchment/earthen-ochre tertiary and game-UI chrome distinguish it clearly; no rejection
- warm tan + coin-gold accents: closest brand — Hay Day (intentional reference) → verdict: PASS — reference is named and intentional
- soft warm white + earthy tones: no strong famous-brand match at this combination → verdict: PASS
- final: PASS — palette cleared, no re-derive needed
