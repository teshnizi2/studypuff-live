// FAQ + Newsletter + Footer — restored original copy and section names.

function Closing(){
  return (<><Newsletter/><Footer/></>);
}

function FAQ(){ return null; }

function Newsletter(){
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-12">

        {/* postcard wrapper with tilt + drop shadow */}
        <div className="relative">
          {/* tiny "postage paid" mark above the card */}
          <div className="absolute -top-5 left-8 hand text-[18px] text-brand-rust rotate-[-4deg] z-10">
            ✎ a letter for you
          </div>

          <div className="relative bg-cream-50 border border-ink-900/20 shadow-[0_30px_80px_-30px_rgba(0,0,0,.35)] grid grid-cols-12 overflow-hidden -rotate-[0.6deg]">

            {/* ── LEFT: postcard front ─────────────────────────── */}
            <div className="col-span-12 md:col-span-5 aspect-[5/4] md:aspect-auto relative bg-brand-peach/60 overflow-hidden">

              {/* faint horizontal address rules */}
              <div aria-hidden className="absolute inset-0 opacity-[0.06]"
                   style={{backgroundImage:"repeating-linear-gradient(0deg, transparent 0 28px, #1f1f1f 28px 29px)"}}/>

              {/* sheep */}
              <div className="absolute inset-0 flex items-end justify-center pb-4">
                <img src="/sheep.png" alt="" className="w-[74%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,.12)]"/>
              </div>

              {/* postage stamp w/ perforated edge */}
              <div className="absolute top-4 right-4 w-20 h-24 rotate-[6deg] z-10"
                   style={{
                     background:"#fbe9a5",
                     padding:"3px",
                     filter:"drop-shadow(0 4px 8px rgba(0,0,0,.15))",
                     maskImage:"radial-gradient(circle at 4px 4px, transparent 2.5px, #000 2.6px), radial-gradient(circle at 4px 4px, transparent 2.5px, #000 2.6px)",
                     WebkitMask:"radial-gradient(circle 3px at 0 0, transparent 99%, #000) -4px -4px / 8px 8px",
                   }}>
                <div className="h-full w-full border-2 border-brand-rust/40 flex flex-col items-center justify-center text-center px-1">
                  <p className="font-display text-[9px] leading-[1.1] text-ink-900 tracking-wide">STUDY<br/>PUFF<br/>POST</p>
                  <div className="my-1 h-px w-6 bg-ink-900/40"></div>
                  <p className="hand text-[12px] text-brand-rust leading-none">№ 47</p>
                </div>
              </div>

              {/* wavy postmark cancellation over corner */}
              <svg aria-hidden className="absolute top-3 right-3 w-28 h-16 rotate-[-8deg] opacity-50" viewBox="0 0 120 60" fill="none">
                <circle cx="22" cy="30" r="18" stroke="#1f1f1f" strokeWidth="1.2"/>
                <circle cx="22" cy="30" r="14" stroke="#1f1f1f" strokeWidth="0.7"/>
                <text x="22" y="27" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="5" fill="#1f1f1f" letterSpacing="0.5">LEIDEN</text>
                <text x="22" y="34" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="4" fill="#1f1f1f">NL · 2024</text>
                <path d="M44 22 Q 56 18 68 22 T 92 22 T 116 22" stroke="#1f1f1f" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
                <path d="M44 30 Q 56 26 68 30 T 92 30 T 116 30" stroke="#1f1f1f" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
                <path d="M44 38 Q 56 34 68 38 T 92 38 T 116 38" stroke="#1f1f1f" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
              </svg>

              {/* bottom-left issue tag */}
              <p className="absolute bottom-3 left-4 eyebrow text-ink-900/70 mix-blend-multiply">
                Vol. 04 · Friday post
              </p>
            </div>

            {/* ── RIGHT: postcard back / letter side ───────────── */}
            <div className="col-span-12 md:col-span-7 p-8 lg:p-10 relative">

              {/* perforated separator */}
              <span aria-hidden className="hidden md:block absolute left-0 top-0 bottom-0 w-px"
                    style={{background:"repeating-linear-gradient(0deg, #1f1f1f33 0 6px, transparent 6px 12px)"}}/>

              {/* "TO:" address-style header */}
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow text-ink-700">Newsletter · Studypuff Post</p>
                <p className="hand text-[16px] text-brand-rust">free, forever</p>
              </div>

              <h3 className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink-900 mt-2 leading-tight">
                A quiet note, every now <em>and then.</em>
              </h3>

              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-700">
                A short letter from the team — a study tip, what&rsquo;s on the livestream schedule,
                and a free template every now and then. No spam, ever.
              </p>

              {/* what's inside chips */}
              <ul className="mt-4 flex flex-wrap gap-2">
                {["study tip", "livestream schedule", "free template", "behind the scenes"].map(t=>(
                  <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-cream-100 px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest text-ink-700">
                    <span className="inline-block h-1 w-1 rounded-full bg-brand-rust"></span>{t}
                  </li>
                ))}
              </ul>

              {/* form */}
              <form className="mt-6" onSubmit={e=>{e.preventDefault(); const f=e.currentTarget; f.querySelector("[data-ok]").style.opacity="1"; f.reset();}}>
                <label className="eyebrow text-ink-700 mb-1 inline-block">Send my letter to</label>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                  <input type="email" required placeholder="your@email.com"
                         className="flex-1 bg-transparent border-b border-ink-900/40 px-1 py-2 font-display text-[18px] focus:outline-none focus:border-ink-900"/>
                  <button className="btn-ink whitespace-nowrap">Subscribe <I.arrow/></button>
                </div>

                {/* trust row */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-700">
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    One letter, every other Friday
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    Unsubscribe anytime
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    <span><b className="text-ink-900">4,800+</b> students subscribed</span>
                  </span>
                </div>

                <p data-ok className="hand text-[18px] text-brand-rust mt-3 opacity-0 transition-opacity">
                  ✿ in the mail — see you Friday.
                </p>
              </form>

              {/* archive link bottom-right */}
              <a href="/coming-soon" className="absolute bottom-6 right-8 hidden md:inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-widest text-ink-700 hover:text-ink-900 underline underline-offset-4 decoration-brand-rust">
                Read past issues →
              </a>
            </div>
          </div>

          {/* signature flourish under card */}
          <svg className="mx-auto mt-6 block opacity-60" width="200" height="14" viewBox="0 0 200 14" fill="none" aria-hidden>
            <path d="M2 8 Q 30 2 60 8 T 120 7 T 198 8" stroke="#c97f72" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}

function Footer(){
  const year = new Date().getFullYear();
  const COLUMNS = [
    { title:"Learn",   items:[["Study with us","/study"],["StudyPuff App","/dashboard"],["Workshops","/workshops"],["Free Resources","/resources"],["Store","/store"]] },
    { title:"Company", items:[["About","/about"],["Contact","/contact"]] },
    { title:"Policies",items:[["Privacy","/privacy"],["Terms","/terms"]] }
  ];
  const SOCIAL = [
    ["YouTube","https://www.youtube.com/@StudyPuffAcademy", <I.yt/>],
    ["Twitch","https://www.twitch.tv/studypuffacademy",      <I.twitch/>],
    ["Discord","https://discord.gg/hb8bKpbjEz",              <I.discord/>],
    ["Instagram","https://www.instagram.com/studypuffacademy",<I.ig/>]
  ];
  return (
    <footer className="relative border-t-2 border-ink-900 bg-cream-100 mt-10">
      {/* perforation top */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-2" style={{background:"radial-gradient(circle at 8px 4px, #f6f0e2 4px, transparent 4.5px) 0 0/16px 8px repeat-x"}}/>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 pt-14 pb-10">

        {/* masthead row */}
        <div className="flex items-end justify-between gap-6 flex-wrap border-b-2 border-ink-900 pb-4">
          <div className="flex items-baseline gap-4 flex-wrap">
            <a href="/" className="font-display text-[44px] leading-none text-ink-900">StudyPuff</a>
            <span className="hand text-[18px] text-brand-rust -rotate-[2deg]">— made in Leiden, NL</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-700 text-right leading-relaxed">
            <p>Vol. 04 · {year}</p>
            <p>The calm-study quarterly</p>
          </div>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 pt-10">
          <div className="col-span-2 md:col-span-4">
            <p className="hand text-[20px] text-ink-900 leading-snug max-w-[26ch]">
              Science-based study, free livestreams, and a kinder way to do school.
            </p>
            {/* postal stamp seal */}
            <div className="mt-6 inline-flex items-center gap-3">
              <span aria-hidden className="rounded-full border-2 border-brand-rust/70 text-brand-rust text-center px-3 py-2 rotate-[-6deg] leading-none">
                <span className="block font-mono text-[8px] uppercase tracking-widest">est.</span>
                <span className="block font-display text-[16px] mt-0.5">2022</span>
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Quietly</p>
                <p className="hand text-[18px] text-brand-rust leading-tight">building calm.</p>
              </div>
            </div>
            <ul className="mt-7 flex gap-3">
              {SOCIAL.map(([n,h,ic],i)=>(
                <li key={i}>
                  <a href={h} target="_blank" rel="noreferrer" aria-label={`StudyPuffAcademy on ${n}`}
                     title={n}
                     className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-50 border border-ink-900/15 text-ink-900 transition hover:-translate-y-0.5 hover:bg-brand-butter">
                    {ic}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-6 grid grid-cols-3 gap-6">
            {COLUMNS.map(col=>(
              <div key={col.title}>
                <h4 className="font-mono text-[11px] uppercase tracking-widest text-brand-rust border-b border-ink-900/20 pb-2">{col.title}</h4>
                <ul className="mt-3 space-y-2">
                  {col.items.map(([l,h])=> <li key={l}><a href={h} className="font-display text-[16px] text-ink-900 hover:text-brand-rust transition">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* mini newsletter slip */}
          <div className="col-span-2 md:col-span-2 relative">
            <div className="bg-brand-butter border border-ink-900/15 p-4 rotate-[1.5deg] shadow-[0_14px_30px_-18px_rgba(0,0,0,0.3)]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-brand-rust">Friday post</p>
              <p className="font-display text-[18px] text-ink-900 leading-tight mt-1">A quiet letter, biweekly.</p>
              <form onSubmit={e=>e.preventDefault()} className="mt-3">
                <input type="email" placeholder="you@school.edu" className="w-full bg-transparent border-b border-ink-900/40 text-[12px] font-mono px-1 py-1.5 focus:outline-none focus:border-ink-900"/>
                <button className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-900 underline underline-offset-4 decoration-brand-rust">
                  Subscribe →
                </button>
              </form>
              <p className="hand text-[12px] text-ink-700 mt-2">4,800+ subscribed</p>
            </div>
          </div>
        </div>

        {/* signature row */}
        <div className="mt-12 pt-5 border-t border-dashed border-ink-900/30 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <svg width="180" height="32" viewBox="0 0 180 32" fill="none" aria-hidden>
              <path d="M4 22 Q 14 6 28 18 Q 42 28 52 14 Q 64 4 76 18 Q 86 26 96 16 Q 108 6 122 18 Q 132 26 144 14 Q 158 4 176 16" stroke="#c97f72" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            </svg>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-700 mt-1">— Hera, Elaine &amp; Reza</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap font-mono text-[11px] uppercase tracking-widest text-ink-700">
            <span>© {year} StudyPuff Academy</span>
            <span aria-hidden className="h-3 w-px bg-ink-900/30"/>
            <span>KvK 87655421</span>
            <span aria-hidden className="h-3 w-px bg-ink-900/30"/>
            <span>Made with care · Leiden 🇳🇱</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
window.Closing = Closing;
