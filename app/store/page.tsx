"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SheepMascot from "@/components/SheepMascot";

type Product = {
  id: string;
  name: string;
  price: number;
  tone: "pink" | "peach" | "butter" | "mint" | "sky" | "lilac";
  blurb: string;
  category: "Planners" | "Print" | "Stationery" | "Apparel";
};

const toneClass: Record<Product["tone"], string> = {
  pink: "bg-brand-pink",
  peach: "bg-brand-peach",
  butter: "bg-brand-butter",
  mint: "bg-brand-mint",
  sky: "bg-brand-sky",
  lilac: "bg-brand-lilac"
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "The Weekly Reset Planner", price: 24, tone: "butter", category: "Planners", blurb: "Undated. 52 weeks. Lay-flat binding." },
  { id: "p2", name: "Daily Focus Pad", price: 14, tone: "pink", category: "Planners", blurb: "60 tear-off pages for one-tab days." },
  { id: "p3", name: "Study Sheep Enamel Pin", price: 9, tone: "mint", category: "Stationery", blurb: "Our little mascot, for your tote bag." },
  { id: "p4", name: "Focus Mode Mug", price: 18, tone: "sky", category: "Apparel", blurb: "Ceramic. 350ml. Microwave-safe." },
  { id: "p5", name: "Memory Curve Poster", price: 22, tone: "lilac", category: "Print", blurb: "A3 riso-style print. 100% recycled paper." },
  { id: "p6", name: "Notebook — Dot Grid", price: 16, tone: "peach", category: "Stationery", blurb: "Soft-touch cover, 160 pages, bookmark ribbon." },
  { id: "p7", name: "StudyPuff Hoodie", price: 58, tone: "mint", category: "Apparel", blurb: "Oversized. Organic cotton, heavy weight." },
  { id: "p8", name: "Pomodoro Timer Card", price: 6, tone: "butter", category: "Print", blurb: "Wallet-sized cue card. Pack of two." }
];

const CATEGORIES = ["All", "Planners", "Print", "Stationery", "Apparel"] as const;

export default function StorePage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const [cart, setCart] = useState<Record<string, number>>({});

  const filtered = useMemo(
    () =>
      PRODUCTS.filter((p) => (active === "All" ? true : p.category === active)),
    [active]
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, q]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return sum + (p ? p.price * q : 0);
  }, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));

  return (
    <PageShell>
      <PageHero
        eyebrow="StudyPuff Store"
        title="Tools that make studying feel like your own thing."
        subtitle="Lovingly designed planners, prints, and small objects. Every purchase funds another free livestream."
        accent="peach"
      />

      <section className="relative pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          {/* Filter + cart */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active === c
                      ? "bg-ink-900 text-cream-50"
                      : "bg-cream-50 text-ink-900 hover:bg-cream-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 rounded-full border border-ink-900/10 bg-cream-50 px-4 py-2 text-sm">
              🛒 <span>{cartCount} items</span>
              <span className="text-ink-700">·</span>
              <strong>€{cartTotal}</strong>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 60}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-cream-50 transition hover:-translate-y-1 hover:shadow-soft">
                  <div
                    className={`relative flex aspect-[4/5] items-center justify-center ${toneClass[p.tone]}`}
                  >
                    <SheepMascot
                      tone={p.tone}
                      className="h-32 w-32 transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-cream-50/80 px-3 py-1 text-xs uppercase tracking-widest text-ink-900">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg text-ink-900">{p.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-ink-700">{p.blurb}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-lg text-ink-900">€{p.price}</span>
                      <button
                        onClick={() => add(p.id)}
                        className="rounded-full bg-ink-900 px-4 py-2 text-xs uppercase tracking-widest text-cream-50 transition hover:bg-ink-700"
                      >
                        {cart[p.id] ? `In cart · ${cart[p.id]}` : "Add"}
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 rounded-[32px] border border-ink-900/10 bg-cream-50 p-10 text-center shadow-soft">
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              Shipped from Amsterdam, slowly.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-700">
              We batch-ship on Fridays to keep things sustainable. Every order includes a
              handwritten thank-you note and a sticker you didn't ask for.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                Shipping & returns
              </Link>
              <Link href="/workshops" className="btn-outline">
                Try a workshop instead
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
