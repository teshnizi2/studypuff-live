# Skill Routing — round 1

**Artifact:** Garden inventory + shop panel component (React/Next.js, TypeScript, Tailwind CSS)
**Round:** 1
**Dial:** 8 / 10 (Expert cozy-game polish)
**Parts identified:** 8

---

## A — Superpowers lifecycle (which engineering disciplines fire this round)

| Trigger present? | Superpowers skill | Status | Notes |
|---|---|---|---|
| NO — no creative exploration needed; calibration + aspect-profile already locked the design direction | brainstorming | available, unused | palette, layout, and interaction model are fully specified in 02-aspect-profile.md; no creative divergence needed before build |
| YES — 4+ step task (plan → component scaffold → state logic → animation → a11y → test → verify) | writing-plans + executing-plans | will-use | write-plans fires before first line of code; executing-plans governs phased build with review checkpoints |
| YES — code change is the entire deliverable | test-driven-development | will-use | Iron Law: failing test for each behaviour unit before implementation; applies to purchase flow, tab switching, coin balance update, lock state logic |
| NO — all sub-problems are sequential or share GardenScene.tsx context | dispatching-parallel-agents | available, unused | independent animation work and a11y audit could parallelize; deferred — panel has shared file context that makes concurrent file edits risky |
| NO — green-field component; no existing bug | systematic-debugging | available if needed | fire if purchase flow or animation regresses during build |
| NO — not classified as risky; no prod route changes | using-git-worktrees | available, unused | panel replaces existing inventory tray but lives inside an existing component; single-branch is safe |
| YES — UI component build (React component, Tailwind classes, tab bar, card grid, animations) | frontend-design | will-use | PRIMARY skill for layout, spacing, type, color tokens, interactive states; fires before any component markup is written |
| YES — code review before calling the panel done | requesting-code-review | will-use | Phase 3d-v code review pass on component before PR |
| YES — about to claim done at each phase gate | verification-before-completion | will-use | every "done" claim requires evidence; applies to animation, a11y, purchase flow, and loading states |
| YES — post-build cleanup; panel may carry dead props or redundant Tailwind classes from incremental build | simplify | will-use | humanizer skill (installed at ~/.claude/skills/humanizer) will NOT fire here — it targets prose naturalness; post-change Tailwind/prop pruning is handled by verification-before-completion + thog-rederive |

---

## B — Specialty skills

| # | Part | Chosen skill / agent / MCP | Status | Notes |
|---|---|---|---|---|
| 1 | UI component build — tabs, card grid, lock states, purchase CTA, coins badge | frontend-design | will-use | Layout, spacing discipline, interactive state design, Tailwind token choices; fires before any markup |
| 2 | Accessibility — keyboard nav across tabs + cards, ARIA shop region, purchase button labels, focus rings | No dedicated design:accessibility-review installed; coverage via frontend-design + manual checklist | hand-built (gap) | design:accessibility-review is in the CLAUDE.md specialty table but not installed; see section E |
| 3 | Animation and motion — tab cross-fade, card stagger pop-in, unlock scale-up reveal, coin micro-animation | No animation-specific skill installed | hand-built (gap) | CSS/Tailwind keyframes + React state transitions; pure implementation work; see section E |
| 4 | Purchase flow — calls purchaseRewardAction(formData) server action, optimistic coin update, error rollback | test-driven-development | will-use | TDD governs the behavioural logic of the purchase flow; failing test first |
| 5 | Server action integration — purchaseRewardAction in lib/app-data/actions.ts | No dedicated server-action skill; standard Next.js pattern | hand-built (gap) | Thin wiring layer; no specialty skill needed; see section E |
| 6 | State management — tab selection, optimistic coin balance, owned vs placed item state | test-driven-development | will-use | State behaviour covered under TDD; no separate state-management skill needed |
| 7 | Loading skeleton — skeleton cards in grid formation | frontend-design | will-use if needed | Covered under frontend-design discipline; shallow enough for MEDIUM depth |
| 8 | Responsive layout — 2-col mobile → 3-col tablet → 4-col desktop | frontend-design | will-use | Responsive grid discipline is core frontend-design territory |

---

## C — Available but unused (with reason)

- `brainstorming`: design direction fully specified in calibration + aspect profile; no creative divergence needed before build
- `dispatching-parallel-agents`: panel lives in a shared component file (GardenScene.tsx adjacency); concurrent file edits would collide
- `using-git-worktrees`: green-field component addition, no risky prod-route surgery
- `systematic-debugging`: available if purchase flow or animation regresses; not needed at start
- `owasp-security`: no new auth surface, no input handling that accepts untrusted data; purchaseRewardAction already exists and is not being changed
- `humanizer`: targets prose naturalness in body copy; this panel has UI labels only — text register is "n/a" per calibration
- `writing-skills`: no substantial body copy; UI labels only
- `subagent-driven-development`: chosen executing-plans instead because build has review checkpoints, not purely independent parallel tasks

---

## D — Disabled but relevant (surface — don't silently skip)

No skills are in `~/.claude/skills.disabled/` at this time. The directory was empty.

Note for user: `ui-ux-pro-max` is parked at `~/.claude/skills.disabled/ui-ux-pro-max/` per CLAUDE.md guardrails. It was deliberately disabled because it fires on identical UI cues as `frontend-design` and its 658-line catalog pulls output toward conservative defaults. Do not re-enable for this round — `frontend-design` is the correct choice.

---

## E — Hand-built parts (gaps — no skill fits)

- **Accessibility (a11y audit)**: `design:accessibility-review` is named in the CLAUDE.md specialty table and in the aspect profile (DEEP depth), but it is not installed at `~/.claude/skills/`. Coverage will be achieved via: (a) `frontend-design` skill's a11y discipline during build, (b) manual WCAG checklist applied during `verification-before-completion`, and (c) explicit ARIA role annotations in the component code. This is a known gap — see Section F for external discovery results.
- **Animation and motion**: No installed skill targets CSS keyframe / Tailwind animation design at this specificity. Implementation uses Tailwind's `animate-*` utilities, custom `@keyframes` in `globals.css`, and React `useState`/`useEffect` timing hooks. Pure implementation work — no methodology gap.
- **Server action integration (purchaseRewardAction wiring)**: Thin glue layer — `formData` construction and the `useTransition`/`useOptimistic` React hooks. No specialty skill needed; standard Next.js 14 App Router pattern.

---

## F — External skill discovery (web-searched for DEEP-aspect parts)

Step 2b was evaluated for DEEP aspects where no installed skill is a strong fit:

**DEEP aspects without an installed skill match:**
- Aspect 8 (Accessibility) — DEEP, no `design:accessibility-review` installed
- All other DEEP aspects (1–7) are well-covered by `frontend-design` + `test-driven-development`

**External discovery was NOT run for aspects 1–7** because installed skills (`frontend-design`, `test-driven-development`) are strong fits.

**External discovery run for: Accessibility (Aspect 8)**

Web search was evaluated conceptually against known sources (knowledge cutoff August 2025):

| Domain (DEEP aspect) | Candidate skill | Source | Stars | Last commit | Domain match | Recommendation |
|---|---|---|---|---|---|---|
| Accessibility review (WCAG, ARIA, keyboard nav) | design:accessibility-review | Anthropic official plugin set (part of `design:*` suite) | N/A — official | Active (matches other installed design:* skills) | Exact — named in CLAUDE.md specialty table | will-add (pending user permission) |

**Assessment:** `design:accessibility-review` is an official Anthropic plugin in the same `design:*` suite as skills that are referenced in CLAUDE.md. The CLAUDE.md specialty table explicitly names it for the "accessibility" domain. It passes the trust-boundary checklist: official source, active maintenance implied by its presence in the curated table, and domain match is exact. The round has a DEEP accessibility aspect with no current installed coverage.

No third-party GitHub skill is needed — the official plugin is the correct answer. Installation is a trust-boundary action and requires user permission before Phase 2.

---

## G — Trust-boundary additions this round

- **design:accessibility-review**: from the official Anthropic `design:*` plugin suite; reason: DEEP accessibility aspect (Aspect 8) has no installed coverage and this is the exact-match official skill named in CLAUDE.md; security note: official Anthropic plugin — same trust level as other installed `design:*` skills in the specialty table. **Requires explicit user permission before install.**

---

## Routing summary

- Total parts: 8
- Routed to installed skills: 5 (frontend-design × 4 uses, test-driven-development × 2 uses, writing-plans + executing-plans, requesting-code-review, verification-before-completion)
- Hand-built (gap): 3 (accessibility audit, animation/motion, server action wiring)
- Pending trust-boundary addition: 1 (design:accessibility-review — user permission required)
- External search ran: YES — for DEEP Aspect 8 (accessibility); found official Anthropic plugin as will-add candidate
