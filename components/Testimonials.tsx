import Reveal from "./Reveal";

const FEATURED = {
  quote:
    "It feels like discovering an underrated library full of like-minded people from around the world.",
  tone: "bg-brand-mint"
};

const QUOTES = [
  {
    quote:
      "StudyPuff helped me realize I'm not bad at studying. I just needed the right motivation.",
    tone: "bg-brand-pink"
  },
  {
    quote:
      "The live study sessions help me feel motivated, focused, and less overwhelmed.",
    tone: "bg-brand-butter"
  },
  {
    quote:
      "Studying at home feels less lonely. It's comforting to know others are studying too.",
    tone: "bg-brand-sky"
  },
  {
    quote: "A place of growth and motivation.",
    tone: "bg-brand-lilac"
  },
  {
    quote:
      "It keeps me motivated, focused, and makes studying feel fun.",
    tone: "bg-brand-peach"
  },
  {
    quote:
      "The focus of studying alone, but with the connection of a community.",
    tone: "bg-brand-pink"
  },
  {
    quote: "A great community to study with, connect with, and share with.",
    tone: "bg-brand-butter"
  }
];

const QUOTE_MARK = (
  <svg viewBox="0 0 24 24" className="h-7 w-7 text-ink-900/70" aria-hidden fill="currentColor">
    <path d="M9 7H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm10 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
  </svg>
);

export default function Testimonials() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow-squiggle mb-3 inline-flex flex-col text-xs uppercase tracking-[0.25em] text-ink-700">Student stories</p>
            <h2 className="display-heading text-4xl text-ink-900 sm:text-5xl">
              What students <em className="italic">tell us</em>.
            </h2>
          </div>
          <p className="max-w-md text-ink-700">
            Featured from messages we receive each month. Share your own on{" "}
            <a
              href="https://www.instagram.com/studypuffacademy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Instagram
            </a>
            ,{" "}
            <a
              href="https://www.youtube.com/@StudyPuffAcademy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              YouTube
            </a>{" "}
            or{" "}
            <a
              href="https://www.twitch.tv/studypuffacademy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Twitch
            </a>
            .
          </p>
        </Reveal>

        {/* Bento: featured big quote + 7 smaller cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[170px]">
          <Reveal className="md:col-span-2 md:row-span-2">
            <figure
              className={`flex h-full flex-col justify-between rounded-3xl ${FEATURED.tone} p-8 transition-transform hover:-translate-y-1`}
            >
              {QUOTE_MARK}
              <blockquote className="font-display text-2xl leading-snug text-ink-900 sm:text-3xl">
                &ldquo;{FEATURED.quote}&rdquo;
              </blockquote>
              <figcaption className="text-xs uppercase tracking-[0.22em] text-ink-700">
                — Anonymous, via Discord
              </figcaption>
            </figure>
          </Reveal>

          {QUOTES.map((q, i) => (
            <Reveal key={i} delay={i * 50} className="md:col-span-1 md:row-span-1">
              <figure
                className={`flex h-full flex-col justify-between rounded-2xl ${q.tone} p-5 transition-transform hover:-translate-y-1`}
              >
                {QUOTE_MARK}
                <blockquote className="font-display text-base leading-snug text-ink-900">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
