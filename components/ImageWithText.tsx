import Link from "next/link";
import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  heading: string;
  body: string;
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
  reverse?: boolean;
  accent?: "pink" | "peach" | "butter" | "mint" | "sky" | "lilac";
};

const accents: Record<NonNullable<Props["accent"]>, string> = {
  pink: "#f3c6c2",
  peach: "#f6d4b7",
  butter: "#fbe9a5",
  mint: "#c7e2c7",
  sky: "#c6dceb",
  lilac: "#d9cdea"
};

export default function ImageWithText({
  eyebrow,
  heading,
  body,
  cta,
  image,
  imageAlt,
  reverse,
  accent = "pink"
}: Props) {
  return (
    <section className="relative py-20 lg:py-28">
      <div
        className={`mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 lg:px-10 ${
          reverse ? "md:[&>:first-child]:order-2" : ""
        }`}
      >
        <Reveal className="relative md:col-span-6">
          <div
            className="absolute -inset-4 -z-10 rounded-[32px]"
            style={{ background: accents[accent] }}
            aria-hidden
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            className="ring-soft w-full rounded-[28px] object-cover"
            loading="lazy"
          />
        </Reveal>
        <Reveal className="md:col-span-6" delay={150}>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-ink-700">
            {eyebrow}
          </p>
          <h2 className="display-heading text-[clamp(2rem,3.5vw,3rem)] text-ink-900">
            {heading}
          </h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-700">
            {body}
          </p>
          <div className="mt-8">
            <Link href={cta.href} className="btn-primary">
              {cta.label} <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
