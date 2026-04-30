"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const TEASERS = [
  { name: "Weekly Reset Planner", tone: "bg-brand-butter", emoji: "📓" },
  { name: "Memory Curve Poster", tone: "bg-brand-pink", emoji: "🖼️" },
  { name: "Study Sheep Pin", tone: "bg-brand-mint", emoji: "🐑" },
  { name: "Focus Mode Mug", tone: "bg-brand-sky", emoji: "☕" },
  { name: "Pomodoro Cue Card", tone: "bg-brand-lilac", emoji: "🎴" },
  { name: "Cozy Tote Bag", tone: "bg-brand-peach", emoji: "👜" }
];

export default function StorePage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sent">("idle");

  return (
    <PageShell>
      <PageHero
        eyebrow="StudyPuff Store · Opening soon"
        title="Cozy study merch — opening soon."
        subtitle="Planners, prints, pins, mugs and a few small objects we keep on our own desks. Drop your email to be the first in when the doors open."
        accent="peach"
      />

      <section className="relative pb-24">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          {/* Waitlist */}
          <Reveal>
            <div className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-8 shadow-soft sm:p-12">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">
                Get on the waitlist.
              </h2>
              <p className="mt-3 max-w-xl text-ink-700">
                We&apos;ll send one email when the store opens, and that&apos;s it. No spam,
                pinky promise.
              </p>
              <form
                className="mt-6 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setState("sent");
                }}
              >
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="flex-1 rounded-full border border-ink-900/15 bg-white px-6 py-4 text-base outline-none transition focus:border-ink-900/40"
                />
                <button className="btn-primary" type="submit">
                  {state === "sent" ? "You're on the list ✨" : "Save my spot"}
                </button>
              </form>
              {state === "sent" && (
                <p className="mt-3 text-sm text-ink-700">
                  Thanks — we&apos;ll write the moment the shop is open.
                </p>
              )}
            </div>
          </Reveal>

          {/* Teasers */}
          <div className="mt-14">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.25em] text-ink-700">A peek at what&apos;s coming</p>
              <h3 className="mt-3 font-display text-3xl text-ink-900 sm:text-4xl">
                On the workbench.
              </h3>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {TEASERS.map((t, i) => (
                <Reveal key={t.name} delay={(i % 6) * 50}>
                  <div
                    className={`flex aspect-square flex-col items-center justify-center rounded-3xl ${t.tone} p-4 text-center transition hover:-translate-y-1`}
                  >
                    <span className="text-4xl" aria-hidden>{t.emoji}</span>
                    <p className="mt-3 text-xs font-semibold text-ink-900">{t.name}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* For now */}
          <Reveal className="mt-16 rounded-[32px] border border-ink-900/10 bg-cream-50 p-10 text-center shadow-soft">
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              In the meantime, the freebies are open.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-700">
              Templates, printables, and the StudyPuff app are all free to use today. No purchase
              needed — pick what helps and tell a friend.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/resources" className="btn-primary">
                Browse free resources
              </Link>
              <Link href="/dashboard" className="btn-outline">
                Open the StudyPuff app
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
