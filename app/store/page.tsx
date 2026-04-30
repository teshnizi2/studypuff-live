"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Notebook,
  Image as ImageIcon,
  Sparkles,
  Coffee,
  StickyNote,
  ShoppingBag,
  type LucideIcon
} from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const TEASERS: { name: string; tone: string; Icon: LucideIcon; iconColor: string }[] = [
  { name: "Weekly Reset Planner", tone: "bg-brand-butter", Icon: Notebook, iconColor: "text-amber-700" },
  { name: "Memory Curve Poster", tone: "bg-brand-pink", Icon: ImageIcon, iconColor: "text-rose-700" },
  { name: "Study Sheep Pin", tone: "bg-brand-mint", Icon: Sparkles, iconColor: "text-emerald-800" },
  { name: "Focus Mode Mug", tone: "bg-brand-sky", Icon: Coffee, iconColor: "text-sky-800" },
  { name: "Pomodoro Cue Card", tone: "bg-brand-lilac", Icon: StickyNote, iconColor: "text-violet-800" },
  { name: "Cozy Tote Bag", tone: "bg-brand-peach", Icon: ShoppingBag, iconColor: "text-orange-700" }
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
          <div className="mt-12">
            <Reveal className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-ink-700">A peek at what&apos;s coming</p>
                <h3 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">
                  On the workbench.
                </h3>
              </div>
              <p className="max-w-md text-sm text-ink-700">
                A small, slow-fashion catalogue. Designed in Amsterdam, batch-shipped on Fridays.
              </p>
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {TEASERS.map((t, i) => (
                <Reveal key={t.name} delay={(i % 6) * 40}>
                  <div
                    className={`flex aspect-[5/6] flex-col items-center justify-center gap-3 rounded-2xl ${t.tone} p-4 text-center shadow-soft transition hover:-translate-y-1`}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream-50/80">
                      <t.Icon className={`h-6 w-6 ${t.iconColor}`} strokeWidth={1.75} aria-hidden />
                    </span>
                    <p className="text-xs font-semibold leading-tight text-ink-900">{t.name}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* For now */}
          <Reveal className="mt-12 grid grid-cols-1 gap-3 rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:p-8">
            <div>
              <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
                In the meantime, the freebies are open.
              </h2>
              <p className="mt-2 text-sm text-ink-700">
                Templates, printables, and the StudyPuff app are free to use today.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <Link href="/resources" className="btn-primary">
                Browse resources
              </Link>
              <Link href="/dashboard" className="btn-outline">
                Open the app
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
