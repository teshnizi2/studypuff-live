# Godu Judgu ledger — StudyPuff /dashboard redesign

- **Dial:** 10 (No-limits) · rich motion · references self-found · LOCKED: all current features must keep working
- **Artifact:** `/dashboard` (auth-gated). Branch `dashboard-redesign`. Preview: https://studypuff-live-…vercel.app/dashboard (sign in as @dmin)
- **Concept:** "A study garden through the day" — living pastoral scene, time-of-day sky, breathing timer ring, persistent generative garden.
- **External spend:** €0.00 / €5.00 cap
- **Totals:** seeded 96 · PASS 0 · below-bar 96 · BLOCKED 0 · last-updated 2026-05-22 (round 0, pre-build)

Status legend: TODO · PASS (≥9.5) · BLOCKED · LOCKED (never auto-edit)

> Seeded from criteria-library WEB/UI floor + high-dial add-ons, tailored to this dashboard. Count GROWS via per-state/per-panel expansion and gap-hunts. Not claiming 1000 upfront — honest seed that compounds.

| ID | unit | category | criterion | target | score | status | evidence/flaw |
|----|------|----------|-----------|--------|-------|--------|---------------|
| FN1 | global | feature-locked | Timer start/pause/reset/skip still works | works | - | LOCKED | must verify each round |
| FN2 | global | feature-locked | Session logging on complete still fires | works | - | LOCKED | |
| FN3 | global | feature-locked | Tasks CRUD + topic select still works | works | - | LOCKED | |
| FN4 | global | feature-locked | Rooms create/join/leave + shared timer + chat | works | - | LOCKED | |
| FN5 | global | feature-locked | Stats / Rewards / Garden / Settings / Profile panels open & function | works | - | LOCKED | |
| FN6 | global | feature-locked | Sound chooser plays ambient audio | works | - | LOCKED | |
| FN7 | global | feature-locked | Coins pill + shop purchases work | works | - | LOCKED | |
| SC1 | scene | atmosphere | Background is a living scene, not flat green | ≥9.5 | - | TODO | |
| SC2 | scene | atmosphere | Time-of-day tint shifts palette (dawn/day/dusk/night) | ≥9.5 | - | TODO | |
| SC3 | scene | atmosphere | Drifting ambient layers (clouds/leaves) read as alive, low-amplitude | ≥9.5 | - | TODO | |
| SC4 | scene | atmosphere | Film grain/texture over color (no banding) | ≥9.5 | - | TODO | |
| SC5 | scene | atmosphere | Center vignette/depth focuses the eye on the timer | ≥9.5 | - | TODO | |
| SC6 | scene | perf | Scene motion is transform/opacity only, ~60fps, paused on reduced-motion | 10/0 | - | TODO | |
| SC7 | scene | perf | Scene paused/cheap when tab hidden; no full-page backdrop-filter | 10/0 | - | TODO | |
| SC8 | scene | a11y | Scene is aria-hidden, pointer-events-none, never traps focus | 10/0 | - | TODO | |
| RG1 | timer | ring | Ring stroke is a refined gradient, crisp at all sizes | ≥9.5 | - | TODO | |
| RG2 | timer | ring | Breathing glow halo (≈5s) reads as a calm focus cue | ≥9.5 | - | TODO | |
| RG3 | timer | ring | Progress head has a glowing spark that tracks the arc | ≥9.5 | - | TODO | |
| RG4 | timer | ring | Sheep settles/reads on start; idle is calm | ≥9.5 | - | TODO | |
| RG5 | timer | ring | Ring/scene cohere (same light source, palette) | ≥9.5 | - | TODO | |
| RG6 | timer | numerals | Time numerals have strong type presence + tabular alignment | ≥9.5 | - | TODO | |
| RG7 | timer | numerals | Number transitions are smooth (no jump/flash) | ≥9.5 | - | TODO | |
| RG8 | timer | states | Start transition (ring fill + settle) 300–500ms, smooth | ≥9.5 | - | TODO | |
| RG9 | timer | states | Completion celebration is restrained (one leaf unfurl), not confetti | ≥9.5 | - | TODO | |
| RG10 | timer | a11y | Play/pause/reset/skip have labels, focus-visible, ≥44px | 10/0 | - | TODO | |
| RL1 | rail | visual | Rail is premium glass (low blur, 1px light border), not flat | ≥9.5 | - | TODO | |
| RL2 | rail | visual | Active item state is unmistakable and elegant | ≥9.5 | - | TODO | |
| RL3 | rail | visual | Hover/press micro-interactions feel springy, 100–200ms | ≥9.5 | - | TODO | |
| RL4 | rail | visual | Icons consistent weight/size; labels legible at 8px or upsized | ≥9.5 | - | TODO | |
| RL5 | rail | visual | Room badge dot is clear, not noisy | ≥9.5 | - | TODO | |
| RL6 | rail | a11y | aria-pressed, focus-visible, keyboard operable, ≥24px targets | 10/0 | - | TODO | |
| RL7 | rail | layout | Rail doesn't overlap header; aligns to scene; mobile fallback clean | ≥9.5 | - | TODO | |
| TP1 | tasks | panel | Tasks panel is glass, slides in springy, cohere with scene | ≥9.5 | - | TODO | |
| TP2 | tasks | panel | Empty state ("no topics yet") is warm + inviting, on-brand | ≥9.5 | - | TODO | |
| TP3 | tasks | panel | Add-topic / add-task affordances are obvious + delightful | ≥9.5 | - | TODO | |
| TP4 | tasks | panel | Task check-off micro-celebration (leaf burst) intact + lovely | ≥9.5 | - | TODO | |
| TP5 | tasks | panel | Collapse/hide control clear; panel scroll contained | ≥9.5 | - | TODO | |
| HD1 | header | visual | Header is glass over scene; wordmark + coins + avatar + logout balanced | ≥9.5 | - | TODO | |
| HD2 | header | visual | Coin pill is a jewel-like, satisfying element | ≥9.5 | - | TODO | |
| HD3 | header | copy | "Back to site", greeting, labels read like a sharp human | ≥9.5 | - | TODO | |
| HD4 | header | a11y | Header contrast ≥4.5:1 over scene at every time-of-day | 10/0 | - | TODO | |
| HD5 | header | feature | Time-of-day greeting ("Good evening, …") personal + correct | ≥9.5 | - | TODO | |
| GD1 | garden | visual | Garden scene is beautiful, generative, persistent (not punitive) | ≥9.5 | - | TODO | |
| GD2 | garden | visual | Growth maps to focus minutes legibly (leaf per 25m) | ≥9.5 | - | TODO | |
| GD3 | garden | motion | Leaves sway/grow with calm, irregular idle motion | ≥9.5 | - | TODO | |
| GD4 | garden | integration | Garden could live ambiently in-scene, not only in a modal | ≥9.5 | - | TODO | structural Q |
| DL1 | dialogs | visual | Dialogs (rooms/settings/stats/rewards/profile) restyled cohesive glass | ≥9.5 | - | TODO | |
| DL2 | dialogs | motion | Dialog open/close is a smooth spring, backdrop fades | ≥9.5 | - | TODO | |
| DL3 | dialogs | a11y | Focus trap, Esc closes, returns focus, labelled | 10/0 | - | TODO | |
| DL4 | dialogs | forms | Inputs styled cohesively; focus rings; error/empty states | ≥9.5 | - | TODO | |
| ST1 | stats | viz | Sparkline + gauges are elegant, readable, animated in | ≥9.5 | - | TODO | |
| ST2 | stats | viz | Streak / lifetime / top-topics presented with quiet pride | ≥9.5 | - | TODO | |
| SD1 | sound | control | Inline sound chooser is beautiful; eq bars lively when playing | ≥9.5 | - | TODO | |
| SD2 | sound | pairing | Chosen sound subtly tints the scene (Tide-style pairing) | ≥9.5 | - | TODO | aspirational |
| RS1 | responsive | 360 | No horizontal scroll at 360; timer + controls legible | 10/0 | - | TODO | |
| RS2 | responsive | 390 | Clean at 390 (iPhone) | 10/0 | - | TODO | |
| RS3 | responsive | 768 | Tablet layout intentional, not stretched | 10/0 | - | TODO | |
| RS4 | responsive | 1280 | Desktop composition balanced, scene fills | 10/0 | - | TODO | |
| RS5 | responsive | 1440+ | Large screens not empty/over-stretched | ≥9.5 | - | TODO | |
| RS6 | responsive | mobile-rail | Rail's mobile fallback (bottom pill) is good, not an afterthought | ≥9.5 | - | TODO | |
| AC1 | a11y | contrast | Body/muted text ≥4.5:1 over scene in every time-of-day | 10/0 | - | TODO | compute |
| AC2 | a11y | keyboard | Full keyboard path through rail → panels → controls | 10/0 | - | TODO | |
| AC3 | a11y | focus | focus-visible ring on every focusable, not obscured | 10/0 | - | TODO | |
| AC4 | a11y | motion | prefers-reduced-motion stops scene+ring motion, content stays | 10/0 | - | TODO | |
| AC5 | a11y | sr | Decorative scene/icons aria-hidden; meaningful icons labelled | 10/0 | - | TODO | |
| AC6 | a11y | headings | Logical heading order, one h1, lang set | 10/0 | - | TODO | |
| AC7 | a11y | live | Coin/timer/count changes announced via aria-live where apt | ≥9.5 | - | TODO | |
| PF1 | perf | weight | JS/CSS weight not bloated by redesign; no unused libs | 10/0 | - | TODO | measure |
| PF2 | perf | smoothness | Scroll + all animation hold ~60fps, no jank | 10/0 | - | TODO | measure |
| PF3 | perf | paint | No costly full-page filters/repaints (the codebase already trimmed these) | 10/0 | - | TODO | |
| PF4 | perf | offscreen | Continuous animations pause when hidden/offscreen | 10/0 | - | TODO | |
| VS1 | visual | hierarchy | Eye lands on timer first, then controls, then ambient | ≥9.5 | - | TODO | |
| VS2 | visual | rhythm | Consistent spacing scale + radius + shadow tokens | ≥9.5 | - | TODO | |
| VS3 | visual | type | Trirong/Quattrocento pairing used with real scale + intent | ≥9.5 | - | TODO | |
| VS4 | visual | color | Palette coheres across scene/ring/panels; accent intentional | ≥9.5 | - | TODO | |
| VS5 | visual | alignment | Grids/centers align; no off-by-px drift | ≥9.5 | - | TODO | |
| VS6 | visual | polish | No flat-template tells (hard shadows, uniform radii, dead corners) | ≥9.5 | - | TODO | |
| MO1 | motion | language | One easing/timing language across entrances/hovers/transitions | ≥9.5 | - | TODO | |
| MO2 | motion | entrance | Dashboard load is a staggered, graceful reveal (journal-rise) | ≥9.5 | - | TODO | |
| MO3 | motion | signature | At least one "how'd they do that" moment (e.g. sky/garden) | ≥9.5 | - | TODO | |
| MO4 | motion | restraint | Nothing distracts DURING a focus session; motion calms when running | ≥9.5 | - | TODO | key for focus tool |
| CP1 | copy | voice | All UI copy reads human, no AI-tells, no em-dash-as-punct | ≥9.5 | - | TODO | |
| CP2 | copy | consistency | Labels/terminology consistent across panels | ≥9.5 | - | TODO | |
| CP3 | copy | empty | Empty/zero states are encouraging, specific, on-brand | ≥9.5 | - | TODO | |
| RB1 | robustness | nojs | Core content visible without JS (or graceful) | ≥9.5 | - | TODO | |
| RB2 | robustness | prepaint | Time-of-day theme set pre-paint (no flash) | 10/0 | - | TODO | |
| RB3 | robustness | longstr | Long display names / topics don't overflow panels | 10/0 | - | TODO | |
| RB4 | robustness | room | In-room layout (RoomSidebar + shared timer) coheres with new scene | ≥9.5 | - | TODO | |
| AW1 | award | benchmark | Honestly beats a competent template; near Awwwards SOTD feel | ≥9.5 | - | TODO | final gate |
| AW2 | award | cohesion | Whole dashboard feels like one designed world, not parts | ≥9.5 | - | TODO | |
| AW3 | award | emotion | It feels calm, cozy, motivating — the StudyPuff feeling | ≥9.5 | - | TODO | |
| AS1 | assets | bespoke | Sheep/garden art reads as intentional art direction, not generic | ≥9.5 | - | TODO | maybe regenerate |
| AS2 | assets | individual | Each asset judged in place: subject/crop/composition right | ≥9.5 | - | TODO | |
| IN1 | inroom | parity | Dashboard looks coherent in AND out of a room | ≥9.5 | - | TODO | |
| IN2 | inroom | chat | RoomSidebar chat/members restyled to new system | ≥9.5 | - | TODO | |
| TD1 | tod | dawn | Dawn palette is beautiful + readable | ≥9.5 | - | TODO | |
| TD2 | tod | day | Day palette is beautiful + readable | ≥9.5 | - | TODO | |
| TD3 | tod | dusk | Dusk palette is beautiful + readable | ≥9.5 | - | TODO | |
| TD4 | tod | night | Night palette is beautiful + readable | ≥9.5 | - | TODO | |
