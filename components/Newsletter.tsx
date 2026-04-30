import Reveal from "./Reveal";

const NEWSLETTER_FORM = "https://forms.gle/bVDmDsuSSSCSjE5C9";

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <span className="blob" style={{ left: "10%", top: "-40px", width: 280, height: 280, background: "#fbe9a5" }} />
      <span className="blob" style={{ right: "8%", bottom: "-60px", width: 260, height: 260, background: "#f3c6c2" }} />

      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[32px] border border-ink-900/10 bg-cream-50 p-8 shadow-soft sm:p-12 lg:p-16">
          <div className="max-w-xl">
            <Reveal>
              <p className="eyebrow-squiggle mb-3 inline-flex flex-col text-xs uppercase tracking-[0.25em] text-ink-700">
                Semi-weekly newsletter
              </p>
              <h2 className="display-heading text-4xl text-ink-900 sm:text-5xl">
                Subscribe to <em className="italic">StudyPuff news</em>.
              </h2>
              <p className="mt-5 text-lg text-ink-700">
                Join the semi-weekly email newsletter to get practical study and productivity
                tips that help you stay focused and get more done.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <a
                href={NEWSLETTER_FORM}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-8 inline-flex"
              >
                Sign me up <span aria-hidden>→</span>
              </a>
              <p className="mt-4 max-w-md text-xs text-ink-700">
                By signing up you&apos;ll receive our free newsletter. We may also send you other
                emails about StudyPuff resources and projects. You can opt-out at any time.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
