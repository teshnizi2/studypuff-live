// Store — coming soon waitlist with a few product placeholders.

const WAITLIST_FORM = "https://forms.gle/bVDmDsuSSSCSjE5C9";

const TEASERS = [
  { name:"Term Planner",      kind:"Notebook", price:"€18", tone:"bg-brand-pink",   note:"A4 · 152 pages",  drop:"Wave 01", details:["softcover · lay-flat","weekly + term spreads","ribbon marker"] },
  { name:"Sheep Sticker Set", kind:"Stickers", price:"€6",  tone:"bg-brand-butter", note:"24 die-cut",      drop:"Wave 01", details:["matte vinyl","laptop-safe","24 designs"] },
  { name:"Pomodoro Cards",    kind:"Method",   price:"€9",  tone:"bg-brand-mint",   note:"deck of 30",      drop:"Wave 02", details:["30 prompts","linen-finish","pocket size"] },
  { name:"Focus Tote",        kind:"Bag",      price:"€16", tone:"bg-brand-sky",    note:"organic cotton",  drop:"Wave 02", details:["organic cotton","inside pocket","13\" laptop fits"] }
];

function StoreHero(){
  // deterministic count for "spots claimed" (no hydration drift)
  const claimed = 1247;
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid grid-cols-12 gap-x-8 gap-y-12 items-start">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-7 relative">
          {/* postmark watermark behind eyebrow */}
          <svg aria-hidden width="120" height="120" viewBox="0 0 120 120" className="absolute -top-6 -left-4 opacity-[0.08] -rotate-12">
            <circle cx="60" cy="60" r="55" fill="none" stroke="#1f1f1f" strokeWidth="2"/>
            <circle cx="60" cy="60" r="44" fill="none" stroke="#1f1f1f" strokeWidth="1"/>
            <text x="60" y="50" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#1f1f1f">STUDYPUFF</text>
            <text x="60" y="78" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#1f1f1f">POST · LEIDEN</text>
            <line x1="20" y1="60" x2="100" y2="60" stroke="#1f1f1f" strokeWidth="1"/>
          </svg>

          <p className="eyebrow text-ink-700 mb-4 flex items-center gap-3 relative">
            <span>StudyPuff Store · Coming soon</span>
            <span className="hand text-[16px] text-brand-rust normal-case tracking-normal">— first drop Spring 2026</span>
          </p>
          <h1 className="display text-[clamp(2.6rem,7vw,6rem)] text-ink-900 leading-[1.02]">
            Cozy study merch —<br/>
            <span className="relative inline-block">
              <em>coming soon.</em>
              <svg aria-hidden viewBox="0 0 300 30" className="absolute left-0 right-0 -bottom-2 w-full h-4" preserveAspectRatio="none">
                <path d="M4 22 C 30 6, 80 26, 130 12 C 170 2, 220 26, 270 12 C 280 9, 292 14, 290 22" stroke="#c97f72" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M278 6 l4 8 l-4 -2 l-4 2 z" fill="#c97f72"/>
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-[56ch] text-[18px] leading-relaxed text-ink-700">
            Planners, stickers, notebooks, and small things to make the desk feel like a home. Drop your email to be first in when the digital doors open.
          </p>

          {/* category chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[["notebooks","bg-brand-pink"],["stickers","bg-brand-butter"],["cards","bg-brand-mint"],["totes","bg-brand-sky"],["limited edition","bg-brand-lilac"]].map(([k,t])=>(
              <span key={k} className={`${t} rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-ink-900 border border-ink-900/15`}>{k}</span>
            ))}
          </div>

          {/* inline waitlist form (placeholder — links to form) */}
          <form className="mt-7 flex flex-wrap items-center gap-3 max-w-[520px]"
                onSubmit={(e)=>{e.preventDefault(); window.open(WAITLIST_FORM,"_blank");}}>
            <label className="sr-only" htmlFor="waitlist-email">Email</label>
            <input id="waitlist-email" type="email" placeholder="your@email.com"
                   className="flex-1 min-w-[220px] bg-cream-50 border border-ink-900/30 px-4 py-3 text-[15px] outline-none focus:border-brand-rust"/>
            <button type="submit" className="btn-ink">Save my spot <I.arrow/></button>
          </form>
          <p className="hand text-[15px] text-brand-rust mt-2">— {claimed.toLocaleString()} spots already saved · early-bird gets 15% off</p>

          {/* counters row */}
          <div className="mt-10 flex items-center gap-6 max-w-[640px] border-t border-ink-900/15 pt-5 flex-wrap">
            <div><p className="font-display text-[28px] leading-none text-ink-900">04</p><p className="eyebrow text-ink-700 mt-1">first-drop pieces</p></div>
            <span aria-hidden className="h-8 w-px bg-ink-900/20"/>
            <div><p className="font-display text-[28px] leading-none text-ink-900">EU</p><p className="eyebrow text-ink-700 mt-1">ships from Leiden</p></div>
            <span aria-hidden className="h-8 w-px bg-ink-900/20"/>
            <div><p className="font-display text-[28px] leading-none text-ink-900">100%</p><p className="eyebrow text-ink-700 mt-1">recyclable packaging</p></div>
          </div>
        </div>

        {/* RIGHT — parcel + receipt stack */}
        <div className="col-span-12 lg:col-span-5 relative">
          <div className="relative mx-auto max-w-[420px] h-[440px]">

            {/* back: receipt */}
            <div className="absolute right-2 top-2 w-[210px] bg-cream-50 border border-ink-900/15 p-4 rotate-[6deg] shadow-[0_14px_30px_-18px_rgba(0,0,0,0.3)]"
                 style={{clipPath:"polygon(0 0, 100% 0, 100% calc(100% - 8px), 96% 100%, 88% calc(100% - 6px), 80% 100%, 72% calc(100% - 6px), 64% 100%, 56% calc(100% - 6px), 48% 100%, 40% calc(100% - 6px), 32% 100%, 24% calc(100% - 6px), 16% 100%, 8% calc(100% - 6px), 0 100%)"}}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700 text-center">STUDYPUFF · receipt</p>
              <div className="mt-2 border-t border-dashed border-ink-900/30 pt-2 space-y-1">
                <div className="flex justify-between font-mono text-[11px]"><span>Term Planner</span><span>€18.00</span></div>
                <div className="flex justify-between font-mono text-[11px]"><span>Sticker Set</span><span>€6.00</span></div>
                <div className="flex justify-between font-mono text-[11px]"><span>Pomodoro × 1</span><span>€9.00</span></div>
              </div>
              <div className="mt-2 border-t border-dashed border-ink-900/30 pt-2 flex justify-between font-mono text-[11px] text-brand-rust">
                <span>EARLY-BIRD −15%</span><span>−€4.95</span>
              </div>
              <p className="font-mono text-[10px] text-ink-700 text-center mt-3">— save spot to unlock —</p>
            </div>

            {/* front: parcel / shipping label */}
            <div className="absolute left-0 top-16 w-[330px] bg-cream-50 border-2 border-dashed border-ink-900/45 p-6 -rotate-[2.5deg] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.4)] z-[2]">
              <span className="absolute -top-3 left-6 inline-block bg-brand-butter px-2 py-0.5 rotate-[-4deg] text-[10px] font-mono uppercase tracking-widest border border-ink-900/30">parcel · 01</span>
              {/* postmark */}
              <svg aria-hidden width="64" height="64" viewBox="0 0 64 64" className="absolute -top-2 right-2 -rotate-[14deg] opacity-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#c97f72" strokeWidth="1.4"/>
                <circle cx="32" cy="32" r="22" fill="none" stroke="#c97f72" strokeWidth="0.8"/>
                <text x="32" y="28" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#c97f72">LEIDEN</text>
                <text x="32" y="38" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#c97f72">2026</text>
                <path d="M6 50 q 6 -3 12 0 t 12 0 t 12 0 t 12 0" stroke="#c97f72" strokeWidth="1.2" fill="none"/>
              </svg>
              <p className="eyebrow text-brand-rust">Ship to</p>
              <p className="font-display text-[22px] text-ink-900 mt-2 leading-tight">{"<your name here>"}</p>
              <p className="font-mono text-[12px] text-ink-700 mt-1">21 Quiet Library Lane<br/>2311 BG · Leiden, NL</p>

              {/* from */}
              <div className="mt-4 pt-3 border-t border-dashed border-ink-900/30 grid grid-cols-2 gap-4 text-[11px] font-mono">
                <div>
                  <p className="text-ink-700 uppercase tracking-widest text-[9px]">From</p>
                  <p className="text-ink-900 mt-1">StudyPuff HQ<br/>2311 BG Leiden</p>
                </div>
                <div className="text-right">
                  <p className="text-ink-700 uppercase tracking-widest text-[9px]">Contents</p>
                  <p className="text-ink-900 mt-1">soft goods<br/>handle with care</p>
                </div>
              </div>

              {/* barcode + eta */}
              <div className="mt-4 border-t border-dashed border-ink-900/30 pt-3 flex items-center justify-between">
                <span className="eyebrow text-ink-900">ETA · Spring 2026</span>
                <svg width="80" height="22" viewBox="0 0 80 22" fill="none" aria-hidden>
                  {Array.from({length:22}).map((_,i)=> <rect key={i} x={i*3.6} y="0" width={i%3===0?2.4:i%2?1.6:1} height="22" fill="#1f1f1f"/>) }
                </svg>
              </div>
              {/* fragile sticker */}
              <span className="absolute -bottom-4 -right-2 rotate-[10deg] inline-block bg-brand-rust text-cream-50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-ink-900/30">fragile · handle softly</span>
            </div>

            {/* tiny sticker — top corner */}
            <div className="absolute -top-2 left-10 w-[70px] h-[70px] rounded-full bg-brand-mint border border-ink-900/15 rotate-[-12deg] flex flex-col items-center justify-center text-center shadow-[0_8px_18px_-10px_rgba(0,0,0,0.3)]">
              <p className="font-display text-[11px] leading-none text-ink-900">EARLY</p>
              <p className="font-display text-[20px] leading-none text-brand-rust mt-0.5">−15%</p>
              <p className="font-mono text-[8px] uppercase tracking-widest text-ink-700 mt-1">waitlist</p>
            </div>

            {/* hand-drawn arrow */}
            <svg className="hidden lg:block absolute -left-16 top-32 w-24 h-16" viewBox="0 0 100 60" fill="none" aria-hidden>
              <path d="M2 8 Q 30 50 80 36" stroke="#c97f72" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 4"/>
              <path d="M72 30 L 82 36 L 76 46" stroke="#c97f72" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreTeasers(){
  // mini product illustrations
  const Sketch = ({i})=>{
    if (i===0) return (<svg viewBox="0 0 120 140" className="w-full h-full"><rect x="20" y="14" width="86" height="120" rx="2" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.5"/><rect x="14" y="10" width="86" height="120" rx="2" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.5"/><line x1="22" y1="34" x2="92" y2="34" stroke="#c97f72" strokeWidth="1.2"/><line x1="22" y1="50" x2="92" y2="50" stroke="#1f1f1f" strokeOpacity=".25"/><line x1="22" y1="62" x2="92" y2="62" stroke="#1f1f1f" strokeOpacity=".25"/><line x1="22" y1="74" x2="92" y2="74" stroke="#1f1f1f" strokeOpacity=".25"/><line x1="22" y1="86" x2="92" y2="86" stroke="#1f1f1f" strokeOpacity=".25"/><line x1="22" y1="98" x2="92" y2="98" stroke="#1f1f1f" strokeOpacity=".25"/><line x1="22" y1="110" x2="78" y2="110" stroke="#1f1f1f" strokeOpacity=".25"/><circle cx="14" cy="30" r="1.6" fill="#1f1f1f"/><circle cx="14" cy="60" r="1.6" fill="#1f1f1f"/><circle cx="14" cy="90" r="1.6" fill="#1f1f1f"/><circle cx="14" cy="118" r="1.6" fill="#1f1f1f"/><path d="M85 14 L 85 60 L 82 56 L 79 60 L 79 14" fill="#c97f72" opacity=".5"/></svg>);
    if (i===1) return (<svg viewBox="0 0 130 130" className="w-full h-full"><g><circle cx="32" cy="40" r="22" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.5"/><ellipse cx="26" cy="36" rx="3" ry="4" fill="#1f1f1f"/><ellipse cx="38" cy="36" rx="3" ry="4" fill="#1f1f1f"/><path d="M24 46 Q 32 52 40 46" stroke="#1f1f1f" strokeWidth="1.4" fill="none" strokeLinecap="round"/><circle cx="22" cy="48" r="2.5" fill="#f3c6c2" opacity=".7"/><circle cx="42" cy="48" r="2.5" fill="#f3c6c2" opacity=".7"/></g><g transform="translate(70 24) rotate(12)"><path d="M0 0 L 32 0 L 34 4 L 34 30 L -2 30 L -2 4 Z" fill="#fbe9a5" stroke="#1f1f1f" strokeWidth="1.4"/><text x="16" y="20" fontFamily="monospace" fontSize="9" textAnchor="middle" fill="#1f1f1f">focus</text></g><g transform="translate(22 82) rotate(-8)"><circle cx="14" cy="14" r="14" fill="#f3c6c2" stroke="#1f1f1f" strokeWidth="1.4"/><path d="M8 14 L 12 18 L 20 10" stroke="#1f1f1f" strokeWidth="1.6" fill="none" strokeLinecap="round"/></g><g transform="translate(72 84) rotate(6)"><path d="M14 2 L 17 11 L 26 11 L 19 17 L 22 26 L 14 21 L 6 26 L 9 17 L 2 11 L 11 11 Z" fill="#c7e2c7" stroke="#1f1f1f" strokeWidth="1.4"/></g><g transform="translate(96 64) rotate(-4)"><path d="M0 8 Q 4 0 8 6 Q 12 12 16 4 Q 20 -2 24 8" stroke="#c97f72" strokeWidth="1.4" fill="none"/></g></svg>);
    if (i===2) return (<svg viewBox="0 0 130 130" className="w-full h-full"><rect x="18" y="38" width="80" height="56" rx="3" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.5" transform="rotate(-9 58 66)"/><rect x="24" y="34" width="80" height="56" rx="3" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.5" transform="rotate(-4 64 62)"/><rect x="28" y="30" width="80" height="56" rx="3" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.5"/><circle cx="68" cy="58" r="16" fill="none" stroke="#c97f72" strokeWidth="1.6"/><path d="M68 46 L 68 58 L 78 64" stroke="#c97f72" strokeWidth="1.8" strokeLinecap="round"/><circle cx="68" cy="58" r="1.6" fill="#c97f72"/><line x1="38" y1="34" x2="50" y2="34" stroke="#1f1f1f" strokeWidth="1"/><text x="100" y="86" fontFamily="monospace" fontSize="7" textAnchor="end" fill="#1f1f1f">N° 01</text></svg>);
    return (<svg viewBox="0 0 130 140" className="w-full h-full"><path d="M34 40 L 34 30 Q 34 14 50 14 L 80 14 Q 96 14 96 30 L 96 40" stroke="#1f1f1f" strokeWidth="1.6" fill="none"/><rect x="22" y="40" width="86" height="84" rx="2" fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="1.5"/><text x="65" y="86" fontFamily="serif" fontSize="26" fontStyle="italic" textAnchor="middle" fill="#c97f72">puff</text><line x1="40" y1="100" x2="90" y2="100" stroke="#1f1f1f" strokeOpacity=".15"/></svg>);
  };

  return (
    <section className="spread relative pt-0">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        {/* masthead */}
        <div className="border-t-2 border-b border-ink-900/80 py-4 mb-12 grid grid-cols-12 gap-x-6 gap-y-3 items-end">
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow text-ink-900">Sneak peek · Spring 2026 drop</p>
            <p className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] text-ink-900 leading-tight mt-1">
              Four pieces, opening Wave 01.
            </p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Numbered</p>
            <p className="hand text-[16px] text-brand-rust leading-snug mt-1">first 200 of each — numbered &amp; stamped.</p>
          </div>
          <div className="col-span-6 md:col-span-3 text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Disclaimer</p>
            <p className="hand text-[16px] text-brand-rust leading-snug mt-1">— subject to change</p>
          </div>
        </div>

        {/* products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEASERS.map((t,i)=>(
            <article key={t.name}
                     className={`group relative ${t.tone} flex flex-col border border-ink-900/10 shadow-[0_22px_44px_-22px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition`}
                     style={{transform:`rotate(${(i%2?-1:1)*0.5}deg)`}}>
              {/* paperclip + ribbon */}
              <span aria-hidden className="absolute -top-2 left-6 h-6 w-3 rounded-sm bg-ink-900/15"></span>
              <span aria-hidden className="absolute top-2 right-2 rotate-[8deg] inline-block bg-cream-50/85 border border-brand-rust/70 text-brand-rust px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest">{t.drop}</span>

              {/* image area */}
              <div className="relative aspect-[5/6] bg-cream-50/70 border-b border-ink-900/10 overflow-hidden">
                {/* dotted inner frame */}
                <span aria-hidden className="absolute inset-3 border border-dashed border-ink-900/25 pointer-events-none"/>
                {/* big N° watermark */}
                <p className="absolute top-2 left-3 font-display text-[34px] leading-none text-ink-900/15">
                  {String(i+1).padStart(2,"0")}
                </p>
                {/* sketch */}
                <div className="absolute inset-0 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-700">
                  <Sketch i={i}/>
                </div>
                {/* soon stamp */}
                <span className="absolute bottom-3 right-3 rotate-[-6deg] inline-block bg-ink-900/85 text-cream-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest">soon</span>
              </div>

              {/* footer */}
              <div className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">{t.kind}</p>
                <p className="font-display text-[22px] text-ink-900 leading-tight mt-1">{t.name}</p>
                <p className="hand text-[14px] text-brand-rust mt-0.5">{t.note}</p>

                <ul className="mt-3 space-y-1 text-[12.5px] text-ink-900/80">
                  {t.details.map(d=>(
                    <li key={d} className="flex items-start gap-2"><span className="text-brand-rust shrink-0">·</span><span>{d}</span></li>
                  ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-dashed border-ink-900/25 flex items-center justify-between">
                  <p className="font-mono text-[12px] text-ink-900">est. {t.price}</p>
                  <a href={WAITLIST_FORM} target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-ink-900 underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
                    Notify me →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* under-the-fold rail */}
        <div className="mt-12 border-t border-ink-900/15 pt-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand-rust">Wave 01</p>
            <p className="font-display text-[18px] text-ink-900 mt-1">Mar 2026</p>
            <p className="text-[12px] text-ink-700 mt-1">Notebook + stickers</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand-rust">Wave 02</p>
            <p className="font-display text-[18px] text-ink-900 mt-1">May 2026</p>
            <p className="text-[12px] text-ink-700 mt-1">Method cards + tote</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand-rust">Wave 03</p>
            <p className="font-display text-[18px] text-ink-900 mt-1">tbd · 2026</p>
            <p className="text-[12px] text-ink-700 mt-1">A small surprise</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand-rust">Shipping</p>
            <p className="font-display text-[18px] text-ink-900 mt-1">EU first</p>
            <p className="text-[12px] text-ink-700 mt-1">Worldwide soon after</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StorePage(){
  return (
    <div className="paper-grain relative">
      <Header/>
      <StoreHero/>
      <StoreTeasers/>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<StorePage/>);
