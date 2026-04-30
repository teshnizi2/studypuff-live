"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export default function StorePage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sent">("idle");

  return (
    <PageShell>
      <PageHero
        eyebrow="StudyPuff Store · Coming soon"
        title="Cozy study merch — coming soon."
        subtitle="Planners, stickers, notebooks, and more. Drop your email below to be first in when the digital doors open."
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
                Join the semi-weekly email newsletter to get practical study, productivity tips,
                and know when the shop opens.
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
