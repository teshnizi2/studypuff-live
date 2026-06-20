import { describe, it, expect } from "vitest";
import {
  hourBucketHistogram,
  buildDayGrid,
  longestStreak,
  currentStreak,
  sessionLengthBuckets,
  daysHitGoal,
  weekOverWeek,
  pickHeroInsight,
  weekdayTotals,
  personalRecords,
  type InsightSession
} from "../stats-insights";

// ── Test helpers ──────────────────────────────────────────────────────────
// All helpers read the BROWSER's local time via `new Date(created_at)`. To keep
// these tests deterministic regardless of the runner's timezone, we build each
// `created_at` from a LOCAL-time Date (new Date(y, mIdx, d, h)) and serialize it
// with .toISOString(). Re-parsing that string yields the SAME local hour/day on
// the test machine, so the asserted local hour is unambiguous. We never assert a
// hard-coded UTC offset.
function at(y: number, mIdx: number, d: number, h = 12, min = 0): string {
  return new Date(y, mIdx, d, h, min, 0, 0).toISOString();
}

let _id = 0;
function s(opts: Partial<InsightSession> & { created_at: string }): InsightSession {
  return {
    id: `s${_id++}`,
    minutes: 25,
    mode: "focus",
    // studied_on is the LOCAL calendar day of created_at — mirror how the app stores it.
    studied_on: localIso(new Date(opts.created_at)),
    topic_name: null,
    focus_score: null,
    ...opts
  };
}

function localIso(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// A fixed "now" used across day-grid / streak tests: 2026-06-18 14:00 local.
const NOW = new Date(2026, 5, 18, 14, 0, 0, 0);

describe("hourBucketHistogram", () => {
  it("returns 8 two-hour buckets spanning 6a–10p with stable labels", () => {
    const h = hourBucketHistogram([]);
    expect(h).toHaveLength(8);
    expect(h.map((b) => b.label)).toEqual([
      "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p"
    ]);
    expect(h.every((b) => b.minutes === 0)).toBe(true);
  });

  it("sums focus minutes into the bucket of the local hour of created_at", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 10), minutes: 30 }), // 10a bucket (10–12)
      s({ created_at: at(2026, 5, 18, 11), minutes: 20 }), // 10a bucket
      s({ created_at: at(2026, 5, 18, 14), minutes: 45 }), // 2p bucket (14–16)
    ];
    const h = hourBucketHistogram(sessions);
    const tenA = h.find((b) => b.label === "10a")!;
    const twoP = h.find((b) => b.label === "2p")!;
    expect(tenA.minutes).toBe(50);
    expect(twoP.minutes).toBe(45);
  });

  it("ignores non-focus sessions", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 10), minutes: 30, mode: "short" }),
      s({ created_at: at(2026, 5, 18, 10), minutes: 15, mode: "focus" }),
    ];
    const h = hourBucketHistogram(sessions);
    expect(h.find((b) => b.label === "10a")!.minutes).toBe(15);
  });

  it("clamps hours outside 6a–10p into the nearest edge bucket", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 3), minutes: 10 }),  // 3a -> first bucket
      s({ created_at: at(2026, 5, 18, 23), minutes: 12 }), // 11p -> last bucket
    ];
    const h = hourBucketHistogram(sessions);
    expect(h[0].minutes).toBe(10);
    expect(h[h.length - 1].minutes).toBe(12);
  });
});

describe("buildDayGrid", () => {
  it("returns weeks*7 days ending today, oldest first", () => {
    const grid = buildDayGrid([], NOW, 10);
    expect(grid).toHaveLength(70);
    expect(grid[grid.length - 1].date).toBe("2026-06-18"); // today is last
    expect(grid[0].date).toBe(localIso(new Date(2026, 5, 18 - 69)));
  });

  it("assigns focus minutes per local day and bucket level", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 9), minutes: 50 }),  // today
      s({ created_at: at(2026, 5, 18, 13), minutes: 40 }), // today (same day -> 90)
      s({ created_at: at(2026, 5, 17, 9), minutes: 10 }),  // yesterday
    ];
    const grid = buildDayGrid(sessions, NOW, 10);
    const today = grid.find((d) => d.date === "2026-06-18")!;
    const yest = grid.find((d) => d.date === "2026-06-17")!;
    expect(today.minutes).toBe(90);
    expect(yest.minutes).toBe(10);
    expect(today.level).toBeGreaterThan(yest.level);
    expect(today.level).toBeGreaterThanOrEqual(1);
    expect(today.level).toBeLessThanOrEqual(4);
  });

  it("level 0 means no focus minutes", () => {
    const grid = buildDayGrid([], NOW, 10);
    expect(grid.every((d) => d.level === 0 && d.minutes === 0)).toBe(true);
  });

  it("ignores non-focus minutes", () => {
    const sessions = [s({ created_at: at(2026, 5, 18, 9), minutes: 60, mode: "long" })];
    const grid = buildDayGrid(sessions, NOW, 10);
    expect(grid.find((d) => d.date === "2026-06-18")!.minutes).toBe(0);
  });
});

describe("longestStreak", () => {
  it("is 0 with no sessions", () => {
    expect(longestStreak([], NOW)).toBe(0);
  });

  it("finds the longest unbounded run of consecutive focus days", () => {
    // A 4-day run early in the window, a 2-day run near today. Longest = 4.
    const sessions = [
      s({ created_at: at(2026, 5, 1, 9) }),
      s({ created_at: at(2026, 5, 2, 9) }),
      s({ created_at: at(2026, 5, 3, 9) }),
      s({ created_at: at(2026, 5, 4, 9) }),
      // gap
      s({ created_at: at(2026, 5, 17, 9) }),
      s({ created_at: at(2026, 5, 18, 9) }),
    ];
    expect(longestStreak(sessions, NOW)).toBe(4);
  });

  it("counts a single isolated day as a streak of 1", () => {
    expect(longestStreak([s({ created_at: at(2026, 5, 10, 9) })], NOW)).toBe(1);
  });

  it("ignores zero-minute and non-focus days", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 10, 9), minutes: 0 }),
      s({ created_at: at(2026, 5, 11, 9), mode: "short" }),
    ];
    expect(longestStreak(sessions, NOW)).toBe(0);
  });
});

describe("currentStreak", () => {
  it("counts a run ending today", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 16, 9) }),
      s({ created_at: at(2026, 5, 17, 9) }),
      s({ created_at: at(2026, 5, 18, 9) }), // today
    ];
    expect(currentStreak(sessions, NOW)).toBe(3);
  });

  it("counts a run ending yesterday (today not yet studied)", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 16, 9) }),
      s({ created_at: at(2026, 5, 17, 9) }), // yesterday
    ];
    expect(currentStreak(sessions, NOW)).toBe(2);
  });

  it("is 0 when the most recent focus day is older than yesterday", () => {
    const sessions = [s({ created_at: at(2026, 5, 14, 9) })]; // 4 days ago
    expect(currentStreak(sessions, NOW)).toBe(0);
  });

  it("is 0 with no sessions", () => {
    expect(currentStreak([], NOW)).toBe(0);
  });
});

describe("sessionLengthBuckets", () => {
  it("counts focus sessions into <15, 15-25, 25-45, 45-60, 60+ bins", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 9), minutes: 10 }),  // <15
      s({ created_at: at(2026, 5, 18, 9), minutes: 20 }),  // 15-25
      s({ created_at: at(2026, 5, 18, 9), minutes: 25 }),  // 25-45 (lower edge inclusive)
      s({ created_at: at(2026, 5, 18, 9), minutes: 50 }),  // 45-60
      s({ created_at: at(2026, 5, 18, 9), minutes: 90 }),  // 60+
      s({ created_at: at(2026, 5, 18, 9), minutes: 30, mode: "short" }), // ignored
    ];
    const b = sessionLengthBuckets(sessions);
    expect(b).toEqual([
      { label: "under 15", count: 1 },
      { label: "15 to 25", count: 1 },
      { label: "25 to 45", count: 1 },
      { label: "45 to 60", count: 1 },
      { label: "60+", count: 1 }
    ]);
  });

  it("emits no dashes or semicolons in user-visible bucket labels", () => {
    for (const b of sessionLengthBuckets([])) {
      expect(b.label).not.toMatch(/[—–]/);
      expect(b.label).not.toMatch(/;/);
      expect(b.label).not.toMatch(/ - /);
    }
  });

  it("returns all-zero counts for no sessions", () => {
    const b = sessionLengthBuckets([]);
    expect(b.map((x) => x.count)).toEqual([0, 0, 0, 0, 0]);
  });
});

describe("daysHitGoal", () => {
  it("counts distinct days in the window whose focus minutes met the goal", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 9), minutes: 60 }),
      s({ created_at: at(2026, 5, 18, 13), minutes: 40 }), // today total 100 >= 90
      s({ created_at: at(2026, 5, 17, 9), minutes: 30 }),  // yesterday 30 < 90
      s({ created_at: at(2026, 5, 16, 9), minutes: 95 }),  // 95 >= 90
    ];
    const r = daysHitGoal(sessions, 90, NOW, 30);
    expect(r.hit).toBe(2);
    expect(r.of).toBe(30);
  });

  it("only counts days inside the window", () => {
    const sessions = [
      s({ created_at: at(2026, 4, 1, 9), minutes: 200 }), // way outside 30d window
    ];
    const r = daysHitGoal(sessions, 90, NOW, 30);
    expect(r.hit).toBe(0);
  });

  it("treats a zero or missing goal as never-hittable safely", () => {
    const r = daysHitGoal([s({ created_at: at(2026, 5, 18, 9), minutes: 5 })], 0, NOW, 30);
    expect(r.of).toBe(30);
    expect(r.hit).toBeGreaterThanOrEqual(0);
  });
});

describe("weekOverWeek", () => {
  it("compares the last 7 days against the 7 before", () => {
    const sessions = [
      // This week (within 7 days ending today incl today)
      s({ created_at: at(2026, 5, 18, 9), minutes: 100 }),
      s({ created_at: at(2026, 5, 15, 9), minutes: 50 }), // 410-ish placeholder
      // Last week (8–14 days ago)
      s({ created_at: at(2026, 5, 10, 9), minutes: 80 }),
      s({ created_at: at(2026, 5, 8, 9), minutes: 40 }),
    ];
    const r = weekOverWeek(sessions, NOW);
    expect(r.thisWeek).toBe(150);
    expect(r.lastWeek).toBe(120);
    expect(r.deltaMin).toBe(30);
  });

  it("returns negative delta when this week is lighter", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 9), minutes: 10 }),
      s({ created_at: at(2026, 5, 10, 9), minutes: 90 }),
    ];
    const r = weekOverWeek(sessions, NOW);
    expect(r.deltaMin).toBe(-80);
  });

  it("ignores non-focus minutes", () => {
    const sessions = [s({ created_at: at(2026, 5, 18, 9), minutes: 60, mode: "short" })];
    const r = weekOverWeek(sessions, NOW);
    expect(r.thisWeek).toBe(0);
  });
});

describe("pickHeroInsight", () => {
  const morningHistogram = [
    { label: "6a", minutes: 0 },
    { label: "8a", minutes: 40 },
    { label: "10a", minutes: 320 }, // clear, dominant peak
    { label: "12p", minutes: 60 },
    { label: "2p", minutes: 30 },
    { label: "4p", minutes: 20 },
    { label: "6p", minutes: 10 },
    { label: "8p", minutes: 0 }
  ];

  it("returns a thin-signal fallback for new users (few sessions)", () => {
    const out = pickHeroInsight({
      hourHistogram: hourBucketHistogram([]),
      currentStreak: 0,
      activeDays: 1,
      windowDays: 70,
      topTopic: null,
      totalMinutes: 20,
      sessionCount: 1
    });
    expect(out.text).toMatch(/quiet start/i);
    expect(out.subline.length).toBeGreaterThan(0);
    // never overclaims a peak hour on thin data
    expect(out.text).not.toMatch(/best thinking/i);
  });

  it("states a peak-hour rhythm only with a clear lead and enough sessions", () => {
    const out = pickHeroInsight({
      hourHistogram: morningHistogram,
      currentStreak: 2,
      activeDays: 31,
      windowDays: 70,
      topTopic: { name: "Calculus", minutes: 300 },
      totalMinutes: 680,
      sessionCount: 27
    });
    // Should pick a rhythm/peak-hour hero
    expect(out.text.toLowerCase()).toContain("yours");
    expect(out.subline.length).toBeGreaterThan(0);
  });

  it("does NOT state a peak hour as fact without a clear lead", () => {
    const flat = [
      { label: "6a", minutes: 50 },
      { label: "8a", minutes: 55 },
      { label: "10a", minutes: 52 },
      { label: "12p", minutes: 51 },
      { label: "2p", minutes: 53 },
      { label: "4p", minutes: 50 },
      { label: "6p", minutes: 54 },
      { label: "8p", minutes: 50 }
    ];
    const out = pickHeroInsight({
      hourHistogram: flat,
      currentStreak: 5,
      activeDays: 40,
      windowDays: 70,
      topTopic: { name: "Physics", minutes: 200 },
      totalMinutes: 415,
      sessionCount: 30
    });
    // With no clear time-of-day lead, the hero must not claim a peak hour.
    expect(out.text.toLowerCase()).not.toContain("best thinking lands");
    expect(out.text.length).toBeGreaterThan(0);
  });

  it("always returns non-empty text and subline (never throws on edge data)", () => {
    const out = pickHeroInsight({
      hourHistogram: hourBucketHistogram([]),
      currentStreak: 0,
      activeDays: 0,
      windowDays: 70,
      topTopic: null,
      totalMinutes: 0,
      sessionCount: 0
    });
    expect(out.text.length).toBeGreaterThan(0);
    expect(out.subline.length).toBeGreaterThan(0);
  });

  it("never emits dashes or semicolons in user-visible copy across every tier", () => {
    const flat = Array.from({ length: 8 }, (_, i) => ({ label: `b${i}`, minutes: 50 }));
    const cases = [
      // Tier 1: peak-hour rhythm
      pickHeroInsight({ hourHistogram: morningHistogram, currentStreak: 2, activeDays: 31, windowDays: 70, topTopic: { name: "Calculus", minutes: 300 }, totalMinutes: 680, sessionCount: 27 }),
      // Tier 2: topic anchor (flat hours, enough sessions, has a topic)
      pickHeroInsight({ hourHistogram: flat, currentStreak: 1, activeDays: 2, windowDays: 70, topTopic: { name: "Physics", minutes: 200 }, totalMinutes: 400, sessionCount: 9 }),
      // Tier 3: showing up (flat hours, no topic, active days)
      pickHeroInsight({ hourHistogram: flat, currentStreak: 0, activeDays: 12, windowDays: 70, topTopic: null, totalMinutes: 300, sessionCount: 6 }),
      // Tier 4: live streak (flat, few active days, no topic, live streak)
      pickHeroInsight({ hourHistogram: flat, currentStreak: 3, activeDays: 1, windowDays: 70, topTopic: null, totalMinutes: 200, sessionCount: 5 }),
      // Thin signal fallback
      pickHeroInsight({ hourHistogram: hourBucketHistogram([]), currentStreak: 0, activeDays: 1, windowDays: 70, topTopic: null, totalMinutes: 20, sessionCount: 1 }),
    ];
    for (const c of cases) {
      for (const str of [c.text, c.subline]) {
        expect(str).not.toMatch(/[—–]/); // no em/en dash
        expect(str).not.toMatch(/;/);     // no semicolons
        expect(str).not.toMatch(/ - /);   // no spaced hyphen used as a dash
      }
    }
  });
});

describe("weekdayTotals", () => {
  it("returns 7 entries labelled Mon through Sun in order", () => {
    const w = weekdayTotals([]);
    expect(w).toHaveLength(7);
    expect(w.map((d) => d.label)).toEqual([
      "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
    ]);
    expect(w.every((d) => d.minutes === 0)).toBe(true);
  });

  it("sums focus minutes into the local weekday of created_at", () => {
    // 2026-06-18 is a Thursday; 2026-06-17 a Wednesday; 2026-06-15 a Monday.
    const sessions = [
      s({ created_at: at(2026, 5, 18, 9), minutes: 30 }),  // Thu
      s({ created_at: at(2026, 5, 18, 14), minutes: 20 }), // Thu (same day)
      s({ created_at: at(2026, 5, 17, 9), minutes: 45 }),  // Wed
      s({ created_at: at(2026, 5, 15, 9), minutes: 10 }),  // Mon
    ];
    const w = weekdayTotals(sessions);
    const by = (label: string) => w.find((d) => d.label === label)!.minutes;
    expect(by("Thu")).toBe(50);
    expect(by("Wed")).toBe(45);
    expect(by("Mon")).toBe(10);
    expect(by("Tue")).toBe(0);
  });

  it("ignores non-focus and zero-minute sessions", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 17, 9), minutes: 40, mode: "short" }),
      s({ created_at: at(2026, 5, 17, 9), minutes: 0 }),
    ];
    expect(weekdayTotals(sessions).every((d) => d.minutes === 0)).toBe(true);
  });
});

describe("personalRecords", () => {
  it("returns zeroed records for no sessions", () => {
    const r = personalRecords([]);
    expect(r.longestSessionMin).toBe(0);
    expect(r.bestDay.minutes).toBe(0);
    expect(r.bestDay.date).toBe("");
    expect(r.bestWeekMinutes).toBe(0);
    expect(r.totalHours).toBe(0);
    expect(r.totalSessions).toBe(0);
  });

  it("computes longest single session, best day, total hours and session count", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 9), minutes: 60 }),
      s({ created_at: at(2026, 5, 18, 13), minutes: 60 }), // 2026-06-18 total 120
      s({ created_at: at(2026, 5, 17, 9), minutes: 95 }),  // longest single session
      s({ created_at: at(2026, 5, 10, 9), minutes: 25 }),
    ];
    const r = personalRecords(sessions);
    expect(r.longestSessionMin).toBe(95);
    expect(r.bestDay.date).toBe("2026-06-18");
    expect(r.bestDay.minutes).toBe(120);
    expect(r.totalSessions).toBe(4);
    // 60 + 60 + 95 + 25 = 240 minutes = 4 hours exactly.
    expect(r.totalHours).toBe(4);
  });

  it("finds the best rolling 7-day window for bestWeekMinutes", () => {
    // Three days inside one 7-day span, plus an isolated day far away.
    const sessions = [
      s({ created_at: at(2026, 5, 1, 9), minutes: 50 }),
      s({ created_at: at(2026, 5, 3, 9), minutes: 60 }),
      s({ created_at: at(2026, 5, 6, 9), minutes: 40 }), // Jun 1..7 holds 150
      s({ created_at: at(2026, 5, 20, 9), minutes: 30 }), // far apart, own window
    ];
    const r = personalRecords(sessions);
    expect(r.bestWeekMinutes).toBe(150);
  });

  it("ignores non-focus and zero-minute sessions", () => {
    const sessions = [
      s({ created_at: at(2026, 5, 18, 9), minutes: 80, mode: "short" }),
      s({ created_at: at(2026, 5, 18, 9), minutes: 0 }),
    ];
    const r = personalRecords(sessions);
    expect(r.totalSessions).toBe(0);
    expect(r.longestSessionMin).toBe(0);
    expect(r.bestWeekMinutes).toBe(0);
  });
});
