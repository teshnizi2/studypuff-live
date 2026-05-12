// Workshops — three tiers + curriculum + outcomes + testimonials + scholarship CTA.

const SCHOLARSHIP_FORM = "https://forms.gle/12W2jhcPdtPEbt4X8";
const WAITLIST_FORM    = "https://forms.gle/YPYHPUwiwY8esmK39";

const TIERS = [
  { name:"Time Management Toolkit", badge:"Starter · single session", price:"€10", cadence:"2-hour workshop",
    sessions:1, sessionLabel:"1 live session", dur:"2 hrs",
    bestFor:"Best for: anyone heading into exams in 4–6 weeks.",
    tagline:"One two-hour workshop to help you manage your time. Not just about the science of time management, but to help you plan your upcoming period.",
    bullets:["1 live session","Personalized advice","Workbook (PDF)","Discord / WhatsApp group"],
    seats:"8 of 30 seats left", nextDate:"Sat · Feb 8",
    tone:"bg-brand-sky" },
  { name:"StudyPuff Academy", badge:"Flagship · 8-week series", price:"€40", cadence:"8 weeks",
    sessions:8, sessionLabel:"4 live + 4 checkups", dur:"8 weeks",
    bestFor:"Best for: students who want a method that lasts past finals.",
    tagline:"Our structured, 8-week series to help you build the foundation you need to improve your academic performance. Built on the science of studying.",
    bullets:["4 sessions + 4 checkups","Printed workbook (96 pages)","Discord / WhatsApp group","Lifetime alumni support"],
    seats:"12 of 30 seats left", nextDate:"Cohort 04 · Jan 13",
    tone:"bg-brand-butter", featured:true },
  { name:"Focus Foundation", badge:"Advanced · long session", price:"€20", cadence:"1 long session",
    sessions:1, sessionLabel:"1 long session", dur:"4 hrs",
    bestFor:"Best for: returning students rebuilding a routine.",
    tagline:"Supporting you to build the foundation of effective studying in 1 long session. Covering the building blocks of academic success.",
    bullets:["1 long session","Personalized advice","Workbook (PDF)","Discord / WhatsApp group"],
    seats:"19 of 30 seats left", nextDate:"Sun · Feb 23",
    tone:"bg-brand-pink" }
];

/* ── HERO ────────────────────────────────────────────────────────── */
function WorkshopsHero(){
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid grid-cols-12 gap-x-8 gap-y-12 items-end">

        <div className="col-span-12 lg:col-span-7 relative">
          {/* tape strip above eyebrow */}
          <span aria-hidden className="absolute -top-4 left-0 h-5 w-24 -rotate-[6deg] opacity-80"
                style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 7px, #fbe9a5 7px 14px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
          <p className="eyebrow text-ink-700 mb-4 flex items-center gap-3">
            <span>Workshops · cohorts of 30 max</span>
            <span className="hand text-[16px] text-brand-rust normal-case tracking-normal">— since 2022</span>
          </p>
          <h1 className="display text-[clamp(2.6rem,7vw,6rem)] text-ink-900 leading-[1.02]">
            Workshops that<br/><em>change how you</em>{" "}
            <span className="relative inline-block">
              study.
              <svg aria-hidden viewBox="0 0 260 30" className="absolute left-0 right-0 -bottom-3 w-full h-4" preserveAspectRatio="none">
                <path d="M4 22 C 40 8, 90 30, 140 16 S 220 4, 252 18 C 258 21, 256 26, 250 25 C 246 24, 248 19, 252 19" stroke="#c97f72" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-[56ch] text-[18px] leading-relaxed text-ink-700">
            Small in-person cohorts in Leiden, plus an online seat for every session. Choose the depth you need — one focused workshop, a foundation session, or the full eight-week Academy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 items-center">
            <a href="#tiers" className="btn-ink">See the tiers <I.arrow/></a>
            <a href={SCHOLARSHIP_FORM} target="_blank" rel="noreferrer" className="btn-ghost">Apply for a scholarship seat</a>
            <span className="hand text-[17px] text-ink-700">— 2 scholarship seats / cohort</span>
          </div>

          {/* proof strip — receipt style */}
          <div className="mt-10 max-w-[600px] relative bg-cream-50 border border-ink-900/15 px-6 py-4 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.3)]"
               style={{clipPath:"polygon(0 0,100% 0,100% 100%,97% 96%,94% 100%,91% 96%,88% 100%,85% 96%,82% 100%,79% 96%,76% 100%,73% 96%,70% 100%,67% 96%,64% 100%,61% 96%,58% 100%,55% 96%,52% 100%,49% 96%,46% 100%,43% 96%,40% 100%,37% 96%,34% 100%,31% 96%,28% 100%,25% 96%,22% 100%,19% 96%,16% 100%,13% 96%,10% 100%,7% 96%,4% 100%,1% 96%,0 100%)"}}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-ink-700 border-b border-dashed border-ink-900/25 pb-2 mb-3">
              <span>Cohort log · 2022 — 2025</span>
              <span>receipt · 0042</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div><p className="font-display text-[30px] leading-none text-ink-900">04</p><p className="eyebrow text-ink-700 mt-1">cohorts run</p></div>
              <div><p className="font-display text-[30px] leading-none text-ink-900">112</p><p className="eyebrow text-ink-700 mt-1">alumni so far</p></div>
              <div className="relative">
                <p className="font-display text-[30px] leading-none text-ink-900">94<span className="text-[18px]">%</span></p>
                <p className="eyebrow text-ink-700 mt-1">would recommend</p>
                <span aria-hidden className="absolute -top-2 -right-1 rotate-[12deg] rounded-full border border-brand-rust/70 text-brand-rust text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-cream-50">verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — workbook + waitlist scrapbook */}
        <div className="col-span-12 lg:col-span-5 relative">
          <div className="relative mx-auto max-w-[460px]">

            {/* workbook polaroid */}
            <div className="relative -rotate-[2deg] bg-cream-50 p-3 pb-4 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.32)]">
              <span aria-hidden className="absolute -top-3 left-10 h-6 w-28 -rotate-[8deg] opacity-90"
                    style={{background:"repeating-linear-gradient(135deg, #c7e2c7 0 8px, #fbe9a5 8px 16px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
              <div className="aspect-[4/5] relative overflow-hidden bg-brand-butter">
                {/* mock workbook spread */}
                <div className="absolute inset-0 p-6">
                  <div className="h-full w-full bg-cream-50 p-5 shadow-inner relative" style={{backgroundImage:"repeating-linear-gradient(to bottom, transparent 0 22px, rgba(31,31,31,.08) 22px 23px)"}}>
                    <span aria-hidden className="absolute left-7 top-0 bottom-0 w-px bg-brand-rust/40"/>
                    <p className="hand text-[22px] text-ink-900 leading-tight pl-3">My week · cohort 04</p>
                    <p className="font-mono text-[10px] text-ink-700 mt-1 pl-3">workbook · p. 14</p>
                    <ul className="mt-4 space-y-3 pl-3">
                      <li className="flex items-start gap-2 text-[13px] text-ink-900">
                        <span className="inline-flex h-3.5 w-3.5 rounded-sm border border-ink-900/60 mt-0.5 bg-cream-50 items-center justify-center text-[10px]">✓</span>
                        <span className="line-through decoration-ink-900/50">Block 1 · Calculus problem set</span>
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-ink-900">
                        <span className="inline-flex h-3.5 w-3.5 rounded-sm border border-ink-900/60 mt-0.5"/>
                        <span>Block 2 · Re-read & retrieve ch. 4</span>
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-ink-900">
                        <span className="inline-flex h-3.5 w-3.5 rounded-sm border border-ink-900/60 mt-0.5"/>
                        <span>Walk · phone in drawer</span>
                      </li>
                      <li className="flex items-start gap-2 text-[13px] text-ink-900">
                        <span className="inline-flex h-3.5 w-3.5 rounded-sm border border-ink-900/60 mt-0.5"/>
                        <span>Spaced review · 7 cards</span>
                      </li>
                    </ul>
                    <p className="hand text-[16px] text-brand-rust mt-5 pl-3 rotate-[-2deg]">small, finishable ✿</p>
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 rotate-[5deg] rounded-sm border border-brand-rust/70 bg-cream-50/90 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-brand-rust">
                  cohort 04 · workbook
                </span>
              </div>
              <p className="hand mt-2 text-center text-[18px] text-ink-700">your printed workbook · 96 pages</p>
            </div>

            {/* waitlist sticky */}
            <div className="absolute -right-6 -bottom-6 w-[200px] rotate-[6deg] bg-cream-50 border border-ink-900/15 p-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,.35)] z-[3]">
              <p className="eyebrow text-brand-rust">Cohort 04 · Jan 2026</p>
              <p className="font-display text-[44px] leading-none text-ink-900 mt-1.5">12 <span className="text-ink-700 text-[18px]">/ 30</span></p>
              <p className="hand text-[15px] text-ink-700 leading-tight mt-1">seats filled — early-bird</p>
              <a href={WAITLIST_FORM} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-ink-900 underline underline-offset-4 decoration-brand-rust">Join the waitlist →</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── TIERS ───────────────────────────────────────────────────────── */
function Tiers(){
  return (
    <section id="tiers" className="spread relative pt-0">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        <div className="border-t-2 border-ink-900/80 pt-3 mb-2 flex items-baseline justify-between gap-4 flex-wrap">
          <p className="eyebrow text-ink-900">Pick a path</p>
          <p className="hand text-[18px] text-brand-rust">all in-person · Leiden + online seat</p>
        </div>
        <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink-900 mb-10 max-w-2xl">Three ways in. <em>Same kind teachers.</em></h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((t,i)=>{
            const filled = parseInt(t.seats);
            const total = 30;
            const pct = ((total-filled)/total)*100;
            return (
            <article key={t.name}
                     className={`relative flex flex-col ${t.tone} p-7 border border-ink-900/10 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.32)] ${t.featured?'lg:-mt-6 lg:mb-2':''}`}>
              {/* tape on featured */}
              {t.featured && (
                <span aria-hidden className="absolute -top-3 right-10 h-5 w-20 -rotate-[6deg] opacity-90"
                      style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 7px, #c7e2c7 7px 14px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
              )}
              {t.featured && (
                <span className="absolute -top-3 left-6 bg-ink-900 text-cream-50 px-3 py-1 text-[10px] font-mono uppercase tracking-widest -rotate-[3deg] shadow-[0_4px_10px_rgba(0,0,0,.25)]">
                  ★ Most popular
                </span>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="eyebrow text-brand-rust">{t.badge}</span>
                <span className="font-mono text-[10px] text-ink-700 uppercase tracking-widest">{t.dur}</span>
              </div>
              <h3 className="font-display text-[28px] text-ink-900 mt-2 leading-tight">{t.name}</h3>

              {/* session dots */}
              <div className="mt-3 flex items-center gap-1.5">
                {Array.from({length:t.sessions}).map((_,k)=>(
                  <span key={k} aria-hidden className={`h-2 w-2 rounded-full ${k<Math.ceil(t.sessions/2)?'bg-ink-900':'bg-ink-900/30'}`}/>
                ))}
                <span className="font-mono text-[10px] text-ink-700 uppercase tracking-widest ml-1">{t.sessionLabel}</span>
              </div>

              <p className="mt-4 text-[14px] leading-[1.65] text-ink-900/85">{t.tagline}</p>

              <div className="mt-5 flex items-end gap-2 border-t border-ink-900/15 pt-4">
                <span className="font-display text-[48px] leading-none text-ink-900">{t.price}</span>
                <span className="text-[13px] text-ink-700 pb-1">/ {t.cadence}</span>
                <span className="ml-auto font-mono text-[10px] text-ink-700 uppercase tracking-widest pb-1">incl. VAT</span>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5 text-[14px] text-ink-900">
                {t.bullets.map(b=>(
                  <li key={b} className="flex items-start gap-2.5">
                    <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cream-50">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1f1f1f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* seats meter */}
              <div className="mt-6 pt-4 border-t border-dashed border-ink-900/20">
                <div className="flex items-baseline justify-between text-[11px] font-mono uppercase tracking-widest text-ink-700">
                  <span>{t.nextDate}</span>
                  <span className="text-brand-rust">{t.seats}</span>
                </div>
                <div className="mt-1.5 h-1 w-full rounded-full bg-cream-50/70 overflow-hidden">
                  <div className="h-full bg-brand-rust/80" style={{width:`${100-pct}%`}}/>
                </div>
                <p className="hand text-[14px] text-ink-700 mt-2 leading-snug">{t.bestFor}</p>
              </div>

              <a href={WAITLIST_FORM} target="_blank" rel="noreferrer"
                 className={`mt-5 ${t.featured?'btn-ink':'btn-ghost'} justify-center w-full`}>
                Join the waiting list <I.arrow/>
              </a>
            </article>
            );
          })}
        </div>
        <p className="text-center text-[12px] text-ink-700 mt-8 font-mono">Prices in EUR · includes VAT · scholarship seats every cohort</p>
      </div>
    </section>
  );
}

/* ── ACADEMY CURRICULUM ──────────────────────────────────────────── */
function HowAcademyWorks(){
  const WEEKS = [
    { w:"01–02", title:"Foundations", kind:"Live · 90 min", body:"Cognitive load, attention, the science of how learning actually happens.",
      reads:["Make It Stick · ch. 1–3","Lecture notes · template A"], deliver:"You leave with: your attention map" },
    { w:"03–04", title:"Method", kind:"Live · 90 min", body:"Spaced repetition, retrieval practice, the right way to take notes.",
      reads:["Build your card deck","Cornell notes · live drill"], deliver:"You leave with: a working flashcard deck" },
    { w:"05–06", title:"Rhythm", kind:"Live + 1-on-1", body:"Time blocking, energy management, sleep, breaks.",
      reads:["Weekly review · template","Sleep audit"], deliver:"You leave with: your weekly schedule, drafted" },
    { w:"07–08", title:"Integration", kind:"Live + 1-on-1", body:"Apply it to your real coursework. We check in weekly until you've made it stick.",
      reads:["1-on-1 checkup","Plan for next term"], deliver:"You leave with: a plan for next term" }
  ];
  return (
    <section className="spread relative pt-0">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow text-ink-700 mb-3">Academy · 8-week structure</p>
            <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink-900">A semester of study, <em>distilled.</em></h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-ink-700">
            Four 90-minute live sessions, four 1-on-1 checkups in between. Recordings stay yours for life.
          </p>
        </div>

        {/* horizontal timeline track */}
        <div className="relative hidden md:block mt-6 mb-2">
          <div className="h-px bg-ink-900/20 w-full"/>
          <div className="absolute inset-x-0 -top-1.5 grid grid-cols-4">
            {WEEKS.map((s,i)=>(
              <div key={i} className="flex justify-start pl-6 first:pl-0">
                <span className="h-3 w-3 rounded-full bg-brand-rust border-2 border-cream-100 shadow-[0_0_0_1px_rgba(31,31,31,.2)]"/>
              </div>
            ))}
          </div>
          {/* tick labels */}
          <div className="absolute inset-x-0 top-3 grid grid-cols-4 text-[10px] font-mono uppercase tracking-widest text-ink-700">
            <span className="pl-6">Start</span>
            <span className="pl-6">Mid</span>
            <span className="pl-6">Rhythm</span>
            <span className="pl-6 flex items-center gap-1">Finish <span aria-hidden>→</span></span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-0 gap-y-10 pt-12 md:pt-10">
          {WEEKS.map((s,i)=>(
            <div key={s.w} className={`col-span-12 md:col-span-3 relative px-0 md:px-6 ${i>0?"md:border-l md:border-ink-900/15":""}`}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-[40px] leading-none text-brand-rust">{s.w}</p>
                <span className="font-mono text-[10px] text-ink-700 uppercase tracking-widest">N° {String(i+1).padStart(2,'0')}</span>
              </div>
              <p className="eyebrow text-ink-700 mt-2">Weeks</p>
              <p className="font-display text-[22px] leading-tight text-ink-900 mt-3">{s.title}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 rounded-full bg-cream-50 border border-ink-900/15 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-ink-900">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-rust"/>
                {s.kind}
              </span>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink-700">{s.body}</p>
              <ul className="mt-4 space-y-1.5 text-[12px] text-ink-700">
                {s.reads.map(r=>(
                  <li key={r} className="flex items-start gap-1.5">
                    <span aria-hidden className="mt-1.5 inline-block h-1 w-1 rounded-full bg-brand-rust shrink-0"/>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 hand text-[15px] text-brand-rust leading-snug">{s.deliver}</p>
              <svg className="mt-3" width="42" height="8" viewBox="0 0 42 8" fill="none" aria-hidden>
                <path d="M1 5 Q 10 1 20 4 T 41 4" stroke="#c97f72" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── OUTCOMES — what you leave with ──────────────────────────────── */
function Outcomes(){
  const OUT = [
    { k:"A weekly rhythm",        v:"Time-blocked Sundays, energy-matched study, real breaks. We'll set yours together in week 03.",
      tag:"calendar template", glyph:(
        <svg viewBox="0 0 64 64" className="h-12 w-12"><rect x="6" y="12" width="52" height="46" rx="3" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.6"/><line x1="6" y1="24" x2="58" y2="24" stroke="#1f1f1f" strokeWidth="1.4"/><line x1="18" y1="8" x2="18" y2="16" stroke="#1f1f1f" strokeWidth="1.6" strokeLinecap="round"/><line x1="46" y1="8" x2="46" y2="16" stroke="#1f1f1f" strokeWidth="1.6" strokeLinecap="round"/><rect x="14" y="32" width="10" height="6" fill="#c97f72"/><rect x="28" y="32" width="10" height="6" fill="#fbe9a5" stroke="#1f1f1f" strokeWidth=".8"/><rect x="14" y="44" width="10" height="6" fill="#c7e2c7"/><rect x="28" y="44" width="24" height="6" fill="#c6dceb"/></svg>
      )},
    { k:"A method that sticks",   v:"Spaced repetition deck + retrieval drills you actually use, not just bookmark for someday.",
      tag:"50-card starter deck", glyph:(
        <svg viewBox="0 0 64 64" className="h-12 w-12"><rect x="12" y="18" width="40" height="30" rx="2" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.6" transform="rotate(-6 32 33)"/><rect x="14" y="14" width="40" height="30" rx="2" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.6"/><line x1="20" y1="22" x2="38" y2="22" stroke="#1f1f1f" strokeWidth="1.2"/><line x1="20" y1="28" x2="44" y2="28" stroke="#1f1f1f" strokeOpacity=".4"/><line x1="20" y1="33" x2="44" y2="33" stroke="#1f1f1f" strokeOpacity=".4"/><line x1="20" y1="38" x2="36" y2="38" stroke="#1f1f1f" strokeOpacity=".4"/></svg>
      )},
    { k:"A printed workbook",     v:"96 pages, exercises and templates, posted to your address before week 01.",
      tag:"posted to your door", glyph:(
        <svg viewBox="0 0 64 64" className="h-12 w-12"><path d="M10 14 L 30 8 L 30 56 L 10 50 Z" fill="#fbe9a5" stroke="#1f1f1f" strokeWidth="1.6"/><path d="M30 8 L 54 14 L 54 50 L 30 56 Z" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.6"/><line x1="36" y1="20" x2="48" y2="20" stroke="#1f1f1f" strokeWidth="1.2"/><line x1="36" y1="26" x2="48" y2="26" stroke="#1f1f1f" strokeOpacity=".5"/><line x1="36" y1="32" x2="46" y2="32" stroke="#1f1f1f" strokeOpacity=".5"/><line x1="36" y1="38" x2="48" y2="38" stroke="#1f1f1f" strokeOpacity=".5"/></svg>
      )},
    { k:"A small, kind cohort",   v:"30 students, two hosts, and the same Discord / WhatsApp group long after the program ends.",
      tag:"alumni group · for life", glyph:(
        <svg viewBox="0 0 64 64" className="h-12 w-12"><circle cx="20" cy="26" r="8" fill="#c7e2c7" stroke="#1f1f1f" strokeWidth="1.4"/><circle cx="44" cy="26" r="8" fill="#f3c6c2" stroke="#1f1f1f" strokeWidth="1.4"/><circle cx="32" cy="42" r="8" fill="#c6dceb" stroke="#1f1f1f" strokeWidth="1.4"/><path d="M8 56 Q 20 46 32 50" stroke="#1f1f1f" strokeWidth="1.4" fill="none"/><path d="M32 50 Q 44 46 56 56" stroke="#1f1f1f" strokeWidth="1.4" fill="none"/></svg>
      )}
  ];
  return (
    <section className="spread relative pt-0">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        <div className="relative bg-cream-50 border border-ink-900/10 p-8 md:p-12 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.25)]">
          {/* twine wrap — diagonal string across the top-left */}
          <span aria-hidden className="absolute -top-3 left-10 h-5 w-28 -rotate-[6deg] opacity-90"
                style={{background:"repeating-linear-gradient(135deg, #c7e2c7 0 8px, #fbe9a5 8px 16px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
          {/* corner stamp */}
          <span aria-hidden className="absolute top-6 right-8 rotate-[8deg] rounded-full border-2 border-brand-rust/80 text-brand-rust px-3 py-2 text-center leading-none">
            <span className="block font-mono text-[8px] uppercase tracking-widest">graduation</span>
            <span className="block font-display text-[14px] mt-0.5">kit · 04</span>
          </span>

          <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
            <div>
              <p className="eyebrow text-ink-700 mb-3">What you leave with · packed in week 08</p>
              <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink-900 max-w-[24ch]">Four things, in your hands <em>by graduation.</em></h2>
            </div>
            <p className="hand text-[18px] text-brand-rust max-w-[20ch] text-right">— and your evenings back</p>
          </div>

          {/* inventory header — like a packing list */}
          <div className="mt-7 flex items-center justify-between border-y border-ink-900/25 py-2 text-[10px] font-mono uppercase tracking-widest text-ink-700">
            <span>Inventory · 4 items</span>
            <span className="hidden md:inline">contents · weight 1.2 kg</span>
            <span>checked & wrapped ✓</span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 pt-7">
            {OUT.map((o,i)=>(
              <li key={o.k} className="relative flex gap-5 items-start group">
                {/* number + glyph stack */}
                <div className="relative shrink-0 w-14 flex flex-col items-center">
                  <span className="font-display text-[28px] leading-none text-brand-rust">{String(i+1).padStart(2,'0')}</span>
                  <span className="mt-2 inline-flex items-center justify-center rounded-md bg-cream-100 border border-ink-900/10 p-1.5">
                    {o.glyph}
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="font-display text-[22px] leading-tight text-ink-900">{o.k}</p>
                    <span className="rounded-sm bg-ink-900/5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-ink-700">{o.tag}</span>
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.65] text-ink-700 max-w-[42ch]">{o.v}</p>
                  <svg className="mt-3" width="42" height="6" viewBox="0 0 42 6" fill="none" aria-hidden>
                    <path d="M1 4 Q 10 1 20 3 T 41 3" stroke="#c97f72" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
              </li>
            ))}
          </ul>

          {/* footer — like a packing-slip signature */}
          <div className="mt-8 pt-5 border-t border-dashed border-ink-900/25 flex items-end justify-between flex-wrap gap-4">
            <p className="hand text-[18px] text-ink-900">Packed with care, <span className="text-brand-rust">— Hera, Elaine & Reza</span></p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">studypuff · leiden · NL</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ────────────────────────────────────────────────── */
function AlumniVoices(){
  const QUOTES = [
    { q:"I'd taken three productivity courses before this. This was the first one that actually changed my Mondays.",
      who:"Lieke V.", role:"Law student · Leiden", tone:"bg-brand-mint", rot:"-1deg" },
    { q:"The workbook is the thing I keep going back to. It's on my desk, not in a Notion graveyard.",
      who:"Mateo R.", role:"MSc Physics · Cohort 02", tone:"bg-brand-sky", rot:"1.2deg" },
    { q:"Small cohort meant they actually noticed when I was struggling. That's the part you can't fake in a Udemy course.",
      who:"Sana A.", role:"Pre-med · Cohort 03", tone:"bg-brand-peach", rot:"-0.8deg" }
  ];
  return (
    <section className="spread relative pt-0">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        <div className="mb-8">
          <p className="eyebrow text-ink-700 mb-3">From the alumni — letters & notes</p>
          <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink-900">Three short ones, <em>unedited.</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUOTES.map((q,i)=>(
            <figure key={i} className={`relative ${q.tone} p-6 pt-8 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)]`} style={{transform:`rotate(${q.rot})`}}>
              <span aria-hidden className="absolute -top-3 left-8 h-5 w-16 -rotate-[6deg] bg-cream-50/85 shadow-[0_2px_6px_rgba(0,0,0,.08)]"/>
              <span aria-hidden className="font-display text-[60px] leading-none text-brand-rust absolute top-2 right-4 select-none">"</span>
              <blockquote className="hand text-[20px] leading-snug text-ink-900">{q.q}</blockquote>
              <figcaption className="mt-5 pt-3 border-t border-ink-900/15">
                <p className="font-display text-[18px] text-ink-900 leading-none">{q.who}</p>
                <p className="eyebrow text-ink-700 mt-1.5">{q.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ moved to faq.html ─────────────────────────────────────── */
function WorkshopsFAQ(){
  return (
    <section className="spread relative pt-0">
      <div className="mx-auto max-w-[900px] px-6 lg:px-12 text-center">
        <p className="eyebrow text-ink-700 mb-3">Before you sign up</p>
        <h2 className="display text-[clamp(1.8rem,3vw,2.8rem)] text-ink-900">A few <em>quick questions?</em></h2>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-700 max-w-[52ch] mx-auto">
          Refunds, scholarships, what happens if you miss a session — answered in detail on the FAQ page.
        </p>
        <a href="/faq#workshops" className="btn-ink mt-6">Visit the FAQ page <I.arrow/></a>
      </div>
    </section>
  );
}

/* ── SCHOLARSHIP CTA ─────────────────────────────────────────────── */
function CozyNotBootcamp(){
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
        <div className="relative bg-brand-mint/60 p-10 md:p-14 text-center -rotate-[0.4deg] shadow-[0_30px_80px_-30px_rgba(0,0,0,.35)]">
          <span aria-hidden className="absolute -top-4 left-10 h-7 w-32 -rotate-[5deg] opacity-90"
                style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 10px, #fbe9a5 10px 20px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
          <p className="hand text-[22px] text-brand-rust">if the price is the problem</p>
          <h2 className="display text-[clamp(2rem,5vw,3.6rem)] text-ink-900 mt-2 leading-[1]">
            A cozy community, <em>not a bootcamp.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-700">
            Two scholarship seats every cohort. Just write to us — no judgement, no essay, no proof of need.
          </p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <a href={SCHOLARSHIP_FORM} target="_blank" rel="noreferrer" className="btn-ink">Apply for a scholarship seat <I.arrow/></a>
            <a href="/contact" className="btn-ghost">Or just say hi</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkshopsPage(){
  return (
    <div className="paper-grain relative">
      <Header/>
      <WorkshopsHero/>
      <Tiers/>
      <HowAcademyWorks/>
      <Outcomes/>
      <AlumniVoices/>
      <WorkshopsFAQ/>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WorkshopsPage/>);
