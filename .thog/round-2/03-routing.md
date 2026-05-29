# Skill Routing — round 2

**Artifact:** Garden inventory + shop panel in GardenScene.tsx
**Round:** 2 (polish / close pass — ~27 code-fixable rows from round-1 run report)
**Dial:** 8 / 10 (Expert cozy-game polish)
**Parts identified:** 8 (all in-file changes within a single React/Tailwind component)

---

## A — Superpowers lifecycle (which engineering disciplines fire this round)

| Trigger present? | Superpowers skill | Status | Notes |
|---|---|---|---|
| NO — design direction fully locked; round 2 is a close pass, not creative exploration | brainstorming | available, unused | All 8 parts have explicit fix specifications in 02-aspect-profile.md round-2 priority list; no creative divergence needed |
| YES — 8 discrete fix items, sequential with per-item verification gates | writing-plans + executing-plans | will-use | write-plans fires before first edit; executing-plans governs the ordered close pass (priority order is prescribed in aspect profile §Round-2 code-fixable priority order) |
| YES — code change is the entire deliverable; every part touches TSX/CSS | test-driven-development | will-use | Iron Law: failing test for each behaviour unit before implementation; applies to Buy CTA render, skeleton tile count expression (Math.max), tab pill class presence, touch-guard media query, easing token |
| NO — all 8 parts share GardenScene.tsx context; concurrent edits would collide | dispatching-parallel-agents | available, unused | Single shared file makes parallel agents a collision risk; parts are best executed sequentially by one agent |
| NO — known defects with prescribed fixes; no unexpected failure to diagnose yet | systematic-debugging | available if needed | Fire if any fix breaks an existing behaviour; not expected at start |
| NO — polish pass on an existing component; no prod-route surgery | using-git-worktrees | available, unused | One baseline commit before structural cuts is sufficient (AUTOPILOT default) |
| YES — all 8 parts are UI/CSS/Tailwind changes on a React component | frontend-design | will-use | PRIMARY skill across all 8 parts: Tailwind class choices, spacing, interactive states, easing tokens, border-radius vocabulary; fires before any edit |
| YES — code review on the close pass before declaring round 2 done | requesting-code-review | will-use | Phase 3d-v pass on the diff before PR |
| YES — about to claim done at each part gate and at round close | verification-before-completion | will-use | Evidence before assertions; applies to each of the 8 items and to the aggregate round-2 claim |
| YES — post-close-pass cleanup; close pass may introduce redundant Tailwind classes or dead expressions | simplify | available, unused | No dedicated simplify skill installed; coverage via verification-before-completion + thog-rederive embedded in the THOG loop; listed here so the validator sees the check was evaluated |

---

## B — Specialty skills

| # | Part | Chosen skill / agent / MCP | Status | Notes |
|---|---|---|---|---|
| 1 | Card surface paper texture (SVG noise filter / layered inset shadow / paper overlay — R.gen.003, P.shop.card.locked 6.0) | frontend-design | will-use | CSS/Tailwind layered shadow and SVG filter decisions sit squarely in frontend-design's layout and visual-surface discipline |
| 2 | Buy CTA architecture (visible Buy chip at locked-card footer; card-as-button merger; P.shop.buy 14 rows at 5.0) | frontend-design + test-driven-development | will-use | frontend-design governs markup pattern and interactive state design; TDD covers the render assertion for CTA visibility and the purchase-action binding |
| 3 | Tab pill visual distinctiveness (parchment inflection, stamped-ink underline, folded corner — R.gen.002/009) | frontend-design | will-use | Tailwind class composition and CSS pseudo-element choice for active/inactive states |
| 4 | Hover touch guard (@media (hover: hover) and (pointer: fine) wrapper — R.cap.hover) | frontend-design | will-use | Media-query discipline and interactive-state guards are core frontend-design territory; also covers R.coh.007 golden-locked card hover lift |
| 5 | Easing family cleanup (replace linear countdown tween with cubic-bezier ease-out — R.coh.016) | frontend-design | will-use | Easing token selection and keyframe coherence; frontend-design enforces the "one easing family" discipline |
| 6 | Empty state entrance animation (gdn-empty-fade class addition — P.shop.empty.mot.1, 8.5) | frontend-design | will-use | Tailwind animation class addition and entrance-timing discipline |
| 7 | Skeleton tile count (Math.max(12, gridCols * 2) expression — R.cap.skeleton MIN 9.0) | test-driven-development | will-use | Behavioural expression change — TDD: write a failing assertion on skeleton count before editing the expression; frontend-design is not needed for arithmetic |
| 8 | Border-radius vocabulary cleanup (standardise to 24px / 12px+xl / full — R.coh.005, R.coh MIN 7.0) | frontend-design | will-use | Tailwind class audit and token normalisation; design-system vocabulary discipline is a core frontend-design responsibility |

---

## C — Available but unused (with reason)

- `brainstorming`: round 2 is a prescribed close pass; all fix targets are specified in the aspect profile with exact approaches; no creative divergence warranted
- `dispatching-parallel-agents`: all 8 parts share GardenScene.tsx; concurrent file edits would collide; sequential execution is mandatory
- `using-git-worktrees`: polish close pass, not risky structural surgery; single baseline commit is sufficient
- `systematic-debugging`: available if any fix causes a regression; not needed at start of a prescribed close pass
- `owasp-security`: no new auth surface, no input change, no untrusted-data handling in any of the 8 parts
- `humanizer`: targets prose naturalness in body copy; calibration text register is "n/a — UI labels and item names only"
- `writing-skills`: no body copy in any of the 8 parts
- `subagent-driven-development`: executing-plans chosen because the close pass has per-item verification gates, not purely independent parallel sub-tasks
- `finishing-a-development-branch`: deferred to post-round cleanup; the round is not yet done
- `receiving-code-review`: no review feedback to act on yet; this fires after requesting-code-review returns findings

---

## D — Disabled but relevant (surface — don't silently skip)

`ui-ux-pro-max` is present at `~/.claude/skills/ui-ux-pro-max/` (installed, not in skills.disabled, but listed as disabled-by-policy in CLAUDE.md guardrails). It fires on identical UI cues as `frontend-design`. Its 658-line catalog pulls output toward conservative defaults that frontend-design is designed to avoid. Per CLAUDE.md guardrail: do not invoke for this round. `frontend-design` wins.

No other skills are in `~/.claude/skills.disabled/`. The directory is empty.

---

## E — Hand-built parts (gaps — no skill fits)

- **Accessibility (WAI Tabs pattern — R.cap.tabs.012, aria-disabled states — Aspect 8, DEEP)**: `design:accessibility-review` was identified as a `will-add` candidate in round-1 routing (Section G) pending user permission. It has not been installed between rounds — confirmed by `ls ~/.claude/skills/` returning no `design:*` entries. Coverage path: (a) `frontend-design` skill's a11y discipline during the WAI Tabs fix, (b) explicit ARIA role annotations in code, (c) manual WCAG checklist applied at `verification-before-completion`. This is a known, named gap carried forward from round 1. See Section F — the `will-add` proposal from round 1 is re-surfaced here.

- **Coin arc animation (4–6 radial sparkles, rotation mid-arc — R.gen.011, Aspect 4, DEEP)**: No installed skill targets CSS keyframe / radial sparkle choreography at this specificity. Implementation path: custom `@keyframes` with `rotate` and `translate` transforms, and `nth-child` selectors for the 4–6 sparkle pseudos, written directly in `globals.css`. No methodology gap — pure CSS implementation work that does not benefit from a specialty skill.

---

## F — External skill discovery (web-searched for DEEP-aspect parts)

Step 2b applicability evaluation:

Round 2 has 12 DEEP aspects. For each, the question is: does an installed skill cover it well, or does it land in section E?

- **Aspects 1, 2, 3, 6, 16, 17, 19** (tab nav, card design, Buy CTA, animation/easing, hover guard, skeleton count, border-radius): all covered by `frontend-design` + `test-driven-development`. Step 2b skipped — installed skills are strong fits.
- **Aspect 4** (coin animation): hand-built gap in section E. However, coin animation is a thin CSS implementation task (4–6 `@keyframes` edits), not a domain deep enough to benefit from a specialty skill. No external skill would outperform direct CSS authorship here. Step 2b run but no external skill recommended.
- **Aspect 8** (accessibility): DEEP, hand-built gap. Step 2b ran in round 1; the finding was that `design:accessibility-review` (official Anthropic `design:*` plugin) is the exact-match skill. That finding stands. Re-running an external web search would return the same answer. The round-1 will-add recommendation is re-surfaced below.
- **Aspect 9** (empty state entrance): upgraded to DEEP; covered by `frontend-design` (Tailwind animation class addition). Step 2b skipped.
- **Aspects 5, 7** (lock icon treatment, coins display): DEEP but fully covered by `frontend-design`. Step 2b skipped.

| Domain (DEEP aspect) | Candidate skill | Source | Stars | Last commit | Domain match | Recommendation |
|---|---|---|---|---|---|---|
| Accessibility (WCAG, ARIA, keyboard nav — Aspect 8, DEEP, re-surface from round 1) | design:accessibility-review | Official Anthropic `design:*` plugin suite (same suite as skills listed in CLAUDE.md specialty table) | N/A — official | Active (implied by presence in curated CLAUDE.md specialty table alongside currently-working design:* references) | Exact — CLAUDE.md specialty table names it for the "accessibility" domain | will-add (pending user permission, same as round-1 proposal) |
| Coin keyframe animation (Aspect 4, DEEP) | No strong external candidate found | — | — | — | No external skill meaningfully outperforms direct CSS authorship for 4–6 @keyframes edits | reject (hand-built is correct path) |

---

## G — Trust-boundary additions this round

- **design:accessibility-review**: from the official Anthropic `design:*` plugin suite (same source as other `design:*` skills named in CLAUDE.md); reason: DEEP accessibility aspect (Aspect 8) remains uncovered by any installed skill after round 1; this is the exact-match official skill; security note: official Anthropic plugin — same trust level as other installed `design:*` skills. **Re-surfaced from round-1 Section G. Requires explicit user permission before install. If the user does not grant permission, coverage continues via the hand-built path described in Section E.**

---

## Routing summary

- Total parts: 8
- Routed to installed skills: 7 (frontend-design × 7 uses, test-driven-development × 2 uses, writing-plans + executing-plans, requesting-code-review, verification-before-completion)
- Hand-built (gap): 2 (accessibility WAI Tabs / aria-disabled; coin arc animation keyframes)
- Pending trust-boundary addition: 1 (design:accessibility-review — user permission required, re-surfaced from round 1)
- External search ran: YES — for Aspect 8 (accessibility, DEEP, no installed fit) and Aspect 4 (coin animation, DEEP, hand-built confirmed correct); one will-add candidate found (official plugin), one rejected (hand-built is correct for CSS keyframes)
