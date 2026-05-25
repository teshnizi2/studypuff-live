# StudyPuff Garden Scene — THOG ledger
**Pitch:** Cozy top-down 2D RPG garden at /dashboard/garden, items appear in themed zones, like Stardew Valley.
**Dial:** 8 · **Bar:** ≥9.5 each leaf · **Budget:** $4.09/$5 cumulative · ~$0.91 remaining
**Live v19 URL:** https://studypuff-live-d72mr0d4y-hmkhd2-1413s-projects.vercel.app/dashboard/garden

## Totals (post-v19-judge)
- N leaves: 366 enumerated by cold judge
- PASS (≥9.5): 119 (~32.5%)
- Below-bar: 247 (~67%)
- BLOCKED: 0
- Confidence: HIGH=majority of asset/observed checks · MED=composition simulations · LOW=runtime-features (HUD, weather, ambient motion) not exercised live

## v20 fix queue (top-impact, ranked)
| Pri | ID-cluster | Defect | Fix |
|---|---|---|---|
| P0 | B.5/B.7/B.9/B.12 | Map still paints barn, painted pond+lilies, painted apple trees, painted decorative trees, painted bench | Regen map with strictest possible negative prompts |
| P0 | A.7 A.8 A.12 A.16 A.17 A.18 A.20 A.21 A.23 A.24 A.25 | 11 items still emoji-blur/frontal/grass-disc-baked | Regen each w/ pumpkinpatch as positive reference |
| P0 | A.x.8 | 18 sprites have embedded ground patches (sticker tell) | Same regen + strict alpha-flush prompt |
| P0 | F.7 G.11 N-bis | Sun-arc HUD ABSENT — chosen dial-8 feature at 0 | Build SVG arc top-right |
| P0 | F.8 F.9 F.10 N-bis | Animated weather ABSENT — chosen feature at 0 | Add cloud-drift + a rain TOD overlay |
| P0 | E.2 E.10 | Idle ambient motion ABSENT — grass sway, water ripple, lantern flicker | Add CSS animations |
| P1 | D.6.2 | Center-anchor causes items to float, not stand on ground | Switch translate to (-50%, -100%) + rebake y-coords |
| P1 | I.2 I.3 I.4 | No click/keyboard/focus-visible on items | Wrap in <button> with focus styles |
| P1 | D.4.4 D.4.6 | Applestree too big (size 11), Gazebo equal to cottage (size 15) | Drop applestree→8, gazebo→12 |
| P1 | D.2.12 | Bench item duplicates painted bench | Fixed when map regenerates clean |
| P2 | L.1 | frontend-design specialist never invoked | Route ambient-motion + HUD design through Agent |
| P2 | K.5 K.6 | Raw <img> 1024px PNGs no lazy | Add loading="lazy" + decoding="async" |

## Budget plan for v20
- 1 map regen: $0.025
- 11 item regens: $0.275
- 12 bg-removes: $0.060
- = ~$0.36, brings cumulative to ~$4.45/$5 — within cap ✓

Last-updated: 2026-05-25 by THOG Phase 3 cold judge
