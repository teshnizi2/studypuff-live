import Reveal from "./Reveal";

const QUOTES = [
  {
    quote:
      "StudyPuff helped me realize I'm not bad at studying. I just needed the right motivation.",
    tone: "bg-brand-pink"
  },
  {
    quote:
      "A great community to study with, connect with, and share things with.",
    tone: "bg-brand-butter"
  },
  {
    quote:
      "StudyPuff means quality time for me. The live study sessions help me feel motivated, focused, and less overwhelmed.",
    tone: "bg-brand-mint"
  },
  {
    quote:
      "StudyPuff makes studying at home feel less lonely. It's comforting to know others are studying too.",
    tone: "bg-brand-sky"
  },
  {
    quote: "A place of growth and motivation.",
    tone: "bg-brand-lilac"
  },
  {
    quote:
      "StudyPuff has been my study savior. It keeps me motivated, focused, and makes studying feel fun.",
    tone: "bg-brand-peach"
  },
  {
    quote:
      "StudyPuff gives me the focus of studying alone, but with the connection of a community.",
    tone: "bg-brand-butter"
  },
  {
    quote:
      "It feels like discovering an underrated library full of like-minded people from around the world.",
    tone: "bg-brand-mint"
  }
];

export default function Testimonials() {
  return (
    <section className="relative py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
              Student stories
            </p>
            <h2 className="display-heading text-4xl text-ink-900 sm:text-5xl">
              What students <em className="italic">tell us</em>.
            </h2>
          </div>
          <p className="max-w-md text-ink-700">
            Featured from messages we receive each month. Share your own on Instagram{" "}
            <a
              href="https://www.instagram.com/studypuffacademy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              @studypuffacademy
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {QUOTES.map((q, i) => (
            <Reveal key={i} delay={i * 60}>
              <figure
                className={`h-full rounded-3xl ${q.tone} p-6 transition-transform hover:-translate-y-1`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="mb-4 h-7 w-7 text-ink-900/70"
                  aria-hidden
                  fill="currentColor"
                >
                  <path d="M9 7H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm10 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
                </svg>
                <blockquote className="font-display text-lg leading-snug text-ink-900">
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
