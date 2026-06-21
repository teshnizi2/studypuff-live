# StudyPuff Garden Scene — THOG ledger

**Pitch:** Cozy top-down 2D RPG garden at /dashboard/garden, items appear in themed zones, like Stardew Valley.
**Dial:** 8 · **Bar:** ≥9.5 each leaf · **Last URL:** https://studypuff-live-diam3omjb-hmkhd2-1413s-projects.vercel.app/dashboard/garden
**Cumulative cost:** $4.49 / €5 cap · **Remaining:** ~$0.51

## Totals (post-v20)
- N leaves: 366 (from v19 cold judge)
- Below-bar after v20 fixes: estimated ~180 (improvement from 247 → ~180)
- PASS: ~186 (~51%) up from 119 (~32%) in v19
- BLOCKED: 1 (FLUX painted-humanoid bias on map regeneration — needs user decision)

## v20 fix landings (verified via Chrome MCP screenshot + DOM inspect)
| ID-cluster | v19 score | v20 status |
|---|---|---|
| D.6.2 anchor (feet-on-ground) | FAIL | FIXED — translate(-50%, -100%), 25 y-coords rebaked |
| F.7 G.11 sun-arc HUD | 0 | LANDED — SVG plaque + orb traveling arc, DOM-verified |
| E.10 idle ambient motion | 0 | PARTIAL — 3 drifting clouds + lantern flicker + pond shimmer + star twinkle land. Grass sway not yet. |
| F.8 animated weather | 0 | PARTIAL — clouds count, no rain/snow yet |
| I.2 I.3 I.4 keyboard/focus-visible | FAIL | FIXED — items are <button> with focus-visible:ring |
| D.4.4 D.4.6 scale ratios | FAIL | FIXED — applestree 11→8, gazebo 15→12 |
| K.5 K.6 lazy-load | FAIL | FIXED — loading="lazy" decoding="async" |
| A.x.8 embedded ground patches | 18/25 had them | PARTIAL — 4 items regenerated cleaner, FLUX bias on 6+ still produces patches |
| B.5 painted barn | FAIL | PARTIAL — barn gone, but TWO PAINTED HUMANOIDS now hallucinated in new map |
| B.9 painted pond | FAIL | PARTIAL — big painted pond still dominates bottom area |

## BLOCKED — needs user decision
- **B.5/B.9/B.12 base map painted reward elements:** 
  - v18 had a red barn. v19 had a smaller barn + decorative trees. v20 has TWO painted humanoid characters (Mario-like NPCs) + multiple painted small pickups (apples/coins) + a painted lake + a painted pond.
  - **Three map regens in a row with progressively stricter negative prompts have ALL failed.** FLUX dev consistently hallucinates rewards into game-map scenes regardless of explicit "NO" instructions.
  - This is a generator-bias ceiling, not a prompt-engineering failure.
  - **Decision needed:** (a) Accept current v20 state; (b) Spend remaining ~$0.025 on a 4th map regen attempt with a different prompt strategy (e.g., describe ONLY background colors with no scene-narrative); (c) Manually edit the map PNG to mask out humanoids; (d) Switch to a different image generator (need fal.ai recommendation); (e) Pause this loop.

## Top remaining below-bar (post-v20)
1. Map still paints humanoids + pickups + lake (BLOCKED above)
2. ~6 items still soft/emoji-style despite regen (FLUX bias on characters: gnome, scarecrow, frogstatue, mailbox, picnic, birdbath)
3. ~10 items still have embedded ground patches baked into PNG
4. No rain/snow weather (only clouds implemented)
5. No grass sway / water ripple
6. frontend-design specialist still not invoked as a separate Agent

Last-updated: 2026-05-25
