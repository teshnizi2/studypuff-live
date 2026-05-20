// Workshops · explore — the detailed listing reached from the "Explore
// workshops" button on /workshops. Not in the top nav. Intro paragraph
// + one rectangle per workshop (Time Management Toolkit, Effective
// Studying Toolkit), styled like the card on the general workshops section.

const SIGNUP_FORM  = "https://forms.gle/TGCDTSKsyyGGaiy16";
const SOLO_PRICE   = "€10";
const BUNDLE_PRICE = "€15";

const WORKSHOPS = [
  {
    name: "Time Management Toolkit",
    subhead: "Take back control of your days, and actually feel on top of things.",
    body: "Feeling like there's never enough time is one of the most common struggles students face. This workshop helps you figure out exactly where your time is going, and gives you a system to change it. You'll leave with a clear, personalised 30-day plan you can start using immediately.",
    bullets: [
      "Your personal workbook to use during and after the session",
      "Discover what's actually getting in the way of your time",
      "Try proven time management methods hands-on",
      "Walk away with a personalised 30-day plan, ready to use and test from day one",
      "30 days of post-workshop support so you stay on track"
    ],
    tone: "bg-brand-sky",
    accent: "#c6dceb"
  },
  {
    name: "Effective Studying Toolkit",
    subhead: "Study less, retain more and finally stop dreading revision.",
    body: "Most students study hard. Not many study smart. This workshop helps you understand how you personally learn best, then gives you a toolkit of evidence-based techniques to match. Less time at your desk, better results and a lot less stress.",
    bullets: [
      "Understand how you learn best and what's been holding you back",
      "Try evidence-based study techniques hands-on during the session",
      "Walk away with a personalised study toolkit built around your needs",
      "30 days of support so the results actually stick"
    ],
    tone: "bg-brand-butter",
    accent: "#fbe9a5"
  }
];

/* ── HERO / INTRO ─────────────────────────────────────────────────── */
function ExploreIntro(){
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
        <span aria-hidden className="absolute -top-1 left-6 lg:left-12 h-5 w-24 -rotate-[6deg] opacity-80"
              style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 7px, #fbe9a5 7px 14px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
        <p className="eyebrow text-ink-700 mb-4">StudyPuff Toolkit · our workshops</p>
        <h1 className="display text-[clamp(2.2rem,5vw,4rem)] text-ink-900 leading-[1.05] max-w-[20ch]">
          Knowing what to do is one thing. <em>Doing it</em> is another.
        </h1>
        <p className="mt-6 max-w-[64ch] text-[18px] leading-relaxed text-ink-700">
          Knowing what you should do is one thing. Actually doing it consistently, without the stress, is another. Our workshops skip the theory overload and get straight to what works for you. In two hours, you'll walk away with a personalised plan, hands-on experience with proven methods, and the support to keep it going.
        </p>
      </div>
    </section>
  );
}

/* ── WORKSHOP CARDS ───────────────────────────────────────────────── */
function ExploreCards(){
  return (
    <section id="workshops" className="spread relative pt-0">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-12">

        {/* Bundle note — €10 each, €15 for both */}
        <div className="relative mx-auto mb-8 max-w-[760px] -rotate-[0.5deg]">
          <div className="relative bg-brand-mint/70 border border-ink-900/15 px-6 py-4 md:py-5 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <span aria-hidden className="absolute -top-3 left-10 h-5 w-28 -rotate-[6deg] opacity-90"
                  style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 8px, #fbe9a5 8px 16px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
            <div>
              <p className="eyebrow text-brand-rust">Bundle deal</p>
              <p className="font-display text-[clamp(1.3rem,2.2vw,1.7rem)] text-ink-900 mt-1 leading-tight">
                Take both workshops · <em>{BUNDLE_PRICE}</em>
                <span className="text-ink-700/70 text-[0.7em] ml-2 line-through">{SOLO_PRICE} + {SOLO_PRICE}</span>
              </p>
              <p className="hand text-[18px] text-ink-700 mt-1">save €5 when you sign up for both</p>
            </div>
            <a href={SIGNUP_FORM} target="_blank" rel="noreferrer"
               className="btn-ink justify-center !py-2.5 !px-4 !text-[13px] shrink-0 whitespace-nowrap">
              Secure your spot <I.arrow/>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {WORKSHOPS.map((w,i)=>(
            <article key={w.name}
                     className={`relative flex flex-col ${w.tone} p-8 lg:p-10 border border-ink-900/10 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.32)]`}
                     style={{transform: i===0 ? "rotate(-0.5deg)" : "rotate(0.4deg)"}}>
              {/* tape strip */}
              <span aria-hidden className="absolute -top-3 right-10 h-5 w-24 -rotate-[6deg] opacity-85"
                    style={{background:`repeating-linear-gradient(135deg, ${w.accent} 0 8px, #fbe9a5 8px 16px)`,boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>

              {/* price stamp */}
              <span aria-hidden className="absolute -top-4 -right-2 rotate-[8deg] rounded-full border-2 border-brand-rust/80 bg-cream-50 px-3 py-1.5 text-center leading-none shadow-[0_4px_10px_rgba(0,0,0,.18)]">
                <span className="block font-mono text-[8px] uppercase tracking-widest text-brand-rust">price</span>
                <span className="block font-display text-[20px] text-ink-900 mt-0.5">{SOLO_PRICE}</span>
              </span>

              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full border border-ink-900/15 bg-cream-50 px-3 py-1 eyebrow text-ink-700">Single session · Starter</span>
                <span className="font-mono text-[10px] text-ink-700 uppercase tracking-widest">N° {String(i+1).padStart(2,'0')}</span>
              </div>
              <h3 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] text-ink-900 mt-3 leading-tight">{w.name}</h3>
              <p className="hand text-[20px] text-ink-700 mt-2 leading-snug">{w.subhead}</p>

              <p className="mt-5 text-[15px] leading-[1.7] text-ink-900/85">{w.body}</p>

              <div className="mt-5 flex items-baseline gap-2 border-t border-ink-900/15 pt-4">
                <span className="font-display text-[40px] leading-none text-ink-900">{SOLO_PRICE}</span>
                <span className="text-[13px] text-ink-700 pb-1">/ 2-hour workshop</span>
                <span className="ml-auto font-mono text-[10px] text-ink-700 uppercase tracking-widest pb-1">incl. VAT</span>
              </div>

              <div className="mt-5 flex-1">
                <p className="eyebrow text-ink-700 mb-3">What's included</p>
                <ul className="space-y-2.5 text-[14px] text-ink-900">
                  {w.bullets.map(b=>(
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cream-50">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1f1f1f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a href={SIGNUP_FORM} target="_blank" rel="noreferrer"
                 className="btn-ink justify-center w-full mt-7">
                Secure your spot <I.arrow/>
              </a>
            </article>
          ))}
        </div>

        <p className="text-center text-[12px] text-ink-700 mt-8 font-mono">
          {SOLO_PRICE} per workshop · {BUNDLE_PRICE} for both · includes VAT · scholarship seats every cohort
        </p>

        <div className="mt-10 text-center">
          <a href="/workshops" className="inline-flex items-center gap-1.5 text-[13px] font-mono uppercase tracking-widest text-ink-900 underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
            ← Back to the StudyPuff Toolkit
          </a>
        </div>
      </div>
    </section>
  );
}

function WorkshopsExplorePage(){
  return (
    <div className="paper-grain relative">
      <Header/>
      <ExploreIntro/>
      <ExploreCards/>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WorkshopsExplorePage/>);
