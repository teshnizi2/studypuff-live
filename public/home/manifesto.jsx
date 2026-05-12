// "Why StudyPuff" — restored original copy + 3 pillars. Treatment: editorial spread,
// no rounded card-on-cream boxes; just typography, marker accents, and the PLNT row.

function Manifesto() {
  const PILLARS = [
  { emoji: "⏰", title: "Steady focus",
    body: "Structured focus rounds, the StudyPuff timer, and calm real-time background sounds." },
  { emoji: "🌍", title: "International company",
    body: "A global room of students co-studying and learning together. Body-doubling that feels like a library." },
  { emoji: "✈️", title: "Tools that travel",
    body: "Simple trackers, free printable templates, knowledge, and an app. Forever useful, from anywhere." }];

  return (
    <section id="manifesto" className="spread relative" style={{ padding: "96px 0px 50px" }}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

        <div className="grid grid-cols-12 gap-x-8 gap-y-8 items-end">
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow text-ink-700 mb-3">Why StudyPuff</p>
            <h2 className="display text-[clamp(2rem,4vw,3.6rem)] text-ink-900">
              Because we believe that{" "}
              <span className="relative inline-block">
                <em>students deserve better</em>
                <svg className="absolute left-[-2%] w-[104%]" style={{ bottom: "calc(-0.18em - 0.3cm)", height: "0.42em" }} viewBox="0 0 360 28" preserveAspectRatio="none" fill="none" aria-hidden>
                  <path
                    d="M4 14 C 22 22, 54 6, 86 12 S 142 20, 176 10 S 232 4, 268 12 S 322 20, 340 10 C 350 4, 358 8, 354 16 C 351 22, 342 22, 340 16 C 338 12, 344 10, 348 12"
                    stroke="#c97f72" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  
                </svg>
              </span>.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 text-[15px] leading-relaxed text-ink-700">
            At StudyPuff, we teach you how to study. However, it doesn&rsquo;t stop there.
            We offer continuous support with the help of our community. Because you don&rsquo;t
            have to do this alone.
          </div>
        </div>

        {/* pillars, set as numbered editorial blocks rather than boxes */}
        <div className="mt-14 grid grid-cols-12 gap-x-8 gap-y-10 border-t border-ink-900/15 pt-10">
          {PILLARS.map((p, i) =>
          <div key={p.title} className="col-span-12 md:col-span-4 relative">
              <div className="flex items-center gap-3 mb-3">
                <span className="hand text-[26px] text-brand-rust leading-none">{["i.", "ii.", "iii."][i]}</span>
                <span className="text-[26px]" aria-hidden>{p.emoji}</span>
              </div>
              <p className="font-display text-[22px] leading-tight text-ink-900">{p.title}</p>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-700">{p.body}</p>
            </div>
          )}
        </div>

        {/* PLNT row — kept, but as an editorial colophon strip, not a stacked card */}
        <div className="mt-16 pt-8 border-t border-ink-900/15 grid grid-cols-12 gap-6 items-center" style={{ padding: "32px 0px 1px" }}>
          <div className="col-span-12 md:col-span-2">
            <img src="/assets/plnt-logo-transparent.png" alt="PLNT Leiden" className="h-14 w-auto object-contain mix-blend-multiply" />
          </div>
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow text-ink-700 mb-2">Proud partner</p>
            <p className="text-[16px] leading-relaxed text-ink-900">
              StudyPuff is part of PLNT&rsquo;s community of innovators and entrepreneurs in
              Leiden and The Hague, where early-stage ideas get the coaching, network, and
              structure to grow from ideation to validation and acceleration.
            </p>
          </div>
          <div className="col-span-12 md:col-span-3 md:text-right">
            <a href="https://www.plntleiden.com" target="_blank" rel="noreferrer" className="btn-ghost">
              Visit PLNT <I.arrowDR />
            </a>
          </div>
        </div>
      </div>
    </section>);

}
window.Manifesto = Manifesto;