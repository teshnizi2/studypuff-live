// Free Resources — 13 templates from the source repo.

const REQUEST_FORM = "https://forms.gle/xKZnXvzZUKL843D5A";

const RESOURCES = [
  { title:"Cornell Note Taking Template",  body:"Turn note-taking into a way to already get a deeper understanding of the material and actually remember what the content was about.", tone:"bg-brand-pink",   kind:"Template" },
  { title:"Planning Fallacy Test",         body:"Discover how well you can plan tasks by comparing your optimistic, intuitive prediction of how long a task will take, to how long it takes in reality.", tone:"bg-brand-butter", kind:"Test" },
  { title:"Urgent-Important Matrix",       body:"A productivity tool that prioritizes tasks by assessing urgency and importance, helping you move from reactive firefighting to proactive, strategic work.", tone:"bg-brand-mint", kind:"Tool" },
  { title:"Starting Ritual",               body:"Works as a mental cue or ignition switch that signals to your brain that it is time to shift from rest or distraction into focused action.", tone:"bg-brand-sky", kind:"Ritual" },
  { title:"Task Chunking",                 body:"Breaking large, overwhelming projects into smaller, manageable, and actionable steps.", tone:"bg-brand-lilac", kind:"Tool" },
  { title:"Task List",                     body:"Organize your tasks in different lists.", tone:"bg-brand-peach", kind:"Template" },
  { title:"Monthly Task List",             body:"Organize your monthly tasks in different lists.", tone:"bg-brand-pink",   kind:"Template" },
  { title:"Weekly Planning Ritual",        body:"A dedicated, recurring time to review the past week, set goals, and map out study tasks, classes, and breaks for the week ahead.", tone:"bg-brand-butter", kind:"Ritual" },
  { title:"Course Overview",               body:"Centralized, organized system that outlines all academic tasks for a block or semester in one place.", tone:"bg-brand-mint", kind:"Template" },
  { title:"Assignment Tracker",            body:"Track every assignment with deadlines, status, and weighting — all in one calm sheet.", tone:"bg-brand-sky", kind:"Template" },
  { title:"Pomodoro Tracker",              body:"A time-management tool used to boost focus and productivity by breaking work into high-intensity intervals separated by short breaks.", tone:"bg-brand-lilac", kind:"Tool" },
  { title:"Deep Focus Log",                body:"Logging how well you were able to focus on a specific task, and analysing what improved or decreased your focus.", tone:"bg-brand-peach", kind:"Log" },
  { title:"Motivation Log",                body:"Turning abstract tasks into more personal goals, making it more clear why you're actually doing them.", tone:"bg-brand-pink", kind:"Log" }
];

function ResourcesHero(){
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid grid-cols-12 gap-x-8 gap-y-12 items-end">
        <div className="col-span-12 lg:col-span-7 relative">
          {/* tape strip */}
          <span aria-hidden className="absolute -top-4 left-0 h-5 w-24 -rotate-[6deg] opacity-80"
                style={{background:"repeating-linear-gradient(135deg, #c7e2c7 0 7px, #fbe9a5 7px 14px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
          <p className="eyebrow text-ink-700 mb-4 flex items-center gap-3">
            <span>Free resources · forever</span>
            <span className="hand text-[16px] text-brand-rust normal-case tracking-normal">— no paywalls</span>
          </p>
          <h1 className="display text-[clamp(2.6rem,7vw,6rem)] text-ink-900 leading-[1.02]">
            Tools for a{" "}
            <span className="relative inline-block">
              <em>calmer term.</em>
              <svg aria-hidden viewBox="0 0 280 28" className="absolute left-0 right-0 -bottom-2 w-full h-4" preserveAspectRatio="none">
                <path d="M4 14 C 30 2, 80 26, 130 12 S 220 22, 260 10 C 270 7, 278 12, 274 18" stroke="#c97f72" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M254 14 q 8 8 18 4" stroke="#c97f72" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-[56ch] text-[18px] leading-relaxed text-ink-700">
            Free printables, templates, and rituals you can request and use. Made with love, backed by research.
          </p>

          {/* category chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[["planning","bg-brand-sky"],["focus","bg-brand-butter"],["notes","bg-brand-mint"],["wellbeing","bg-brand-pink"],["templates","bg-brand-peach"]].map(([k,t])=>(
              <span key={k} className={`${t} rounded-full px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-ink-900 border border-ink-900/15`}>{k}</span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3 items-center">
            <a href={REQUEST_FORM} target="_blank" rel="noreferrer" className="btn-ink">Request the bundle <I.arrow/></a>
            <a href="#catalogue" className="btn-ghost">Browse the 13</a>
            <span className="hand text-[17px] text-ink-700">— PDF in your inbox in 2 min</span>
          </div>

          {/* tiny proof row */}
          <div className="mt-10 flex items-center gap-6 max-w-[560px] border-t border-ink-900/15 pt-5 flex-wrap">
            <div><p className="font-display text-[26px] leading-none text-ink-900">12,800+</p><p className="eyebrow text-ink-700 mt-1">downloads</p></div>
            <span aria-hidden className="h-8 w-px bg-ink-900/20"/>
            <div><p className="font-display text-[26px] leading-none text-ink-900">★★★★★</p><p className="eyebrow text-ink-700 mt-1">avg. rating</p></div>
            <span aria-hidden className="h-8 w-px bg-ink-900/20"/>
            <div><p className="font-display text-[26px] leading-none text-ink-900">€0</p><p className="eyebrow text-ink-700 mt-1">forever</p></div>
          </div>
        </div>

        {/* RIGHT — scrapbook stack of printables peeking */}
        <div className="col-span-12 lg:col-span-5 relative">
          <div className="relative mx-auto max-w-[420px] h-[380px]">
            {/* back card — pomodoro */}
            <div className="absolute right-12 top-0 w-[200px] aspect-[3/4] bg-brand-sky border border-ink-900/15 rotate-[-8deg] p-3 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.3)]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink-700">N° 03</p>
              <p className="font-display text-[16px] text-ink-900 leading-tight mt-1">Pomodoro card</p>
              <svg viewBox="0 0 100 100" className="mt-2 w-full"><circle cx="50" cy="55" r="32" fill="none" stroke="#1f1f1f" strokeWidth="1.4"/><path d="M50 28 L 50 55 L 70 65" stroke="#c97f72" strokeWidth="2" fill="none" strokeLinecap="round"/><text x="50" y="60" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#1f1f1f">25:00</text></svg>
            </div>
            {/* middle card — weekly planner */}
            <div className="absolute right-32 top-12 w-[210px] aspect-[3/4] bg-cream-50 border border-ink-900/15 rotate-[4deg] p-3 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink-700">N° 01</p>
              <p className="font-display text-[16px] text-ink-900 leading-tight mt-1">Weekly planner</p>
              <div className="mt-2 grid grid-cols-7 gap-0.5">
                {Array.from({length:35}).map((_,k)=>(
                  <div key={k} className={`aspect-square border border-ink-900/15 ${k===8||k===17||k===22?'bg-brand-rust/60':k===4?'bg-brand-butter':''}`}/>
                ))}
              </div>
              <p className="hand text-[12px] text-brand-rust mt-2">block your week ✿</p>
            </div>
            {/* front polaroid — bundle */}
            <div className="absolute left-0 bottom-0 w-[220px] bg-cream-50 p-3 pb-5 rotate-[-3deg] border border-ink-900/15 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.4)] z-[2]">
              <span aria-hidden className="absolute -top-3 left-10 h-5 w-24 -rotate-[8deg]"
                    style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 7px, #fbe9a5 7px 14px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
              <div className="aspect-[4/5] bg-brand-butter flex flex-col items-center justify-center relative">
                <p className="font-display text-[72px] leading-none text-ink-900">13</p>
                <p className="eyebrow text-brand-rust mt-1">printables &amp; tools</p>
                <p className="hand text-[15px] text-ink-700 mt-2">PDFs in your inbox</p>
                <span className="absolute top-2 right-2 rotate-[10deg] rounded-full border border-brand-rust/70 text-brand-rust px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest bg-cream-50/80">free · vol 03</span>
              </div>
              <p className="hand mt-2 text-center text-[15px] text-ink-700">the calm-term bundle</p>
            </div>
            {/* sticky — most requested */}
            <div className="absolute right-0 bottom-6 w-[140px] bg-brand-mint border border-ink-900/15 rotate-[7deg] p-3 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.3)] z-[3]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ink-700">most requested</p>
              <p className="font-display text-[16px] text-ink-900 leading-tight mt-1">Cornell notes</p>
              <p className="hand text-[12px] text-brand-rust mt-1">N° 06 · 2,400+ downloads</p>
            </div>
            {/* hand-drawn arrow from headline */}
            <svg className="hidden lg:block absolute -left-20 top-20 w-24 h-16" viewBox="0 0 100 60" fill="none" aria-hidden>
              <path d="M2 8 Q 30 50 80 36" stroke="#c97f72" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 4"/>
              <path d="M72 30 L 82 36 L 76 46" stroke="#c97f72" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResourceGrid(){
  const GROUPS = [
    { kind:"Template", label:"Templates",  hand:"fill it in, print, repeat", desc:"Pages built to be lived in — print a stack and you'll plan a whole term." },
    { kind:"Tool",     label:"Tools",      hand:"science-backed methods",    desc:"Tiny mental machines borrowed from research, packed onto one page each." },
    { kind:"Ritual",   label:"Rituals",    hand:"do once, do every week",    desc:"Short repeating practices — the smallest one that still changes a week." },
    { kind:"Test",     label:"Tests",      hand:"know your own habits",      desc:"Quiet self-assessments to catch the lies you tell yourself about time." },
    { kind:"Log",      label:"Logs",       hand:"track, then look back",     desc:"Pages for noticing — fill them and a pattern shows up by week three." },
  ];

  // mini "what's inside" preview SVG per kind
  const Preview = ({k}) => {
    const ink="#1f1f1f", rust="#c97f72";
    const wrap = "w-full h-[110px] bg-cream-50/85 border border-ink-900/15 p-2 mb-3";
    if(k==="Template") return (
      <div className={wrap}>
        <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
          <rect x="2" y="2" width="156" height="86" fill="none" stroke={ink} strokeOpacity=".35" strokeDasharray="2 3"/>
          <rect x="8" y="8" width="60" height="9" fill={rust} opacity=".25"/>
          <line x1="8" y1="24" x2="152" y2="24" stroke={ink} strokeOpacity=".25"/>
          <line x1="8" y1="34" x2="152" y2="34" stroke={ink} strokeOpacity=".25"/>
          <line x1="8" y1="44" x2="120" y2="44" stroke={ink} strokeOpacity=".25"/>
          <line x1="8" y1="54" x2="152" y2="54" stroke={ink} strokeOpacity=".25"/>
          <line x1="8" y1="64" x2="100" y2="64" stroke={ink} strokeOpacity=".25"/>
          <rect x="8" y="74" width="36" height="10" fill="none" stroke={ink} strokeOpacity=".55"/>
          <path d="M14 79 l4 4 l8 -8" stroke={rust} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    );
    if(k==="Tool") return (
      <div className={wrap}>
        <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
          <line x1="80" y1="6" x2="80" y2="84" stroke={ink} strokeOpacity=".5"/>
          <line x1="6" y1="46" x2="154" y2="46" stroke={ink} strokeOpacity=".5"/>
          <text x="14" y="18" fontSize="6" fontFamily="ui-monospace" fill={ink} opacity=".7">DO NOW</text>
          <text x="88" y="18" fontSize="6" fontFamily="ui-monospace" fill={ink} opacity=".7">SCHEDULE</text>
          <text x="14" y="58" fontSize="6" fontFamily="ui-monospace" fill={ink} opacity=".7">DELEGATE</text>
          <text x="88" y="58" fontSize="6" fontFamily="ui-monospace" fill={ink} opacity=".7">DROP</text>
          <rect x="32" y="22" width="26" height="14" fill={rust} opacity=".55"/>
          <rect x="98" y="22" width="40" height="14" fill={ink} opacity=".15"/>
          <rect x="32" y="62" width="40" height="14" fill={ink} opacity=".15"/>
          <rect x="98" y="62" width="20" height="14" fill={ink} opacity=".1"/>
        </svg>
      </div>
    );
    if(k==="Ritual") return (
      <div className={wrap}>
        <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
          {[0,1,2,3,4].map(i=>(
            <g key={i} transform={`translate(8 ${10+i*15})`}>
              <rect width="10" height="10" fill="none" stroke={ink} strokeOpacity=".55"/>
              {i<2 && <path d="M2 5 l3 3 l6 -6" stroke={rust} strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
              <line x1="16" y1="6" x2={i<2?"130":"100"} y2="6" stroke={ink} strokeOpacity={i<2?".2":".4"} strokeWidth={i<2?"2":"1"}/>
            </g>
          ))}
        </svg>
      </div>
    );
    if(k==="Test") return (
      <div className={wrap}>
        <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
          {[0,1,2].map(i=>(
            <g key={i} transform={`translate(8 ${10+i*22})`}>
              <text x="0" y="8" fontSize="7" fontFamily="ui-monospace" fill={ink} opacity=".7">Q{i+1}</text>
              <line x1="14" y1="6" x2="120" y2="6" stroke={ink} strokeOpacity=".3"/>
              <circle cx="128" cy="6" r="3.5" fill="none" stroke={ink} strokeOpacity=".55"/>
              <circle cx="140" cy="6" r="3.5" fill={i===1?rust:"none"} stroke={ink} strokeOpacity=".55"/>
              <circle cx="152" cy="6" r="3.5" fill="none" stroke={ink} strokeOpacity=".55"/>
            </g>
          ))}
        </svg>
      </div>
    );
    if(k==="Log") return (
      <div className={wrap}>
        <svg viewBox="0 0 160 90" className="w-full h-full" aria-hidden>
          <line x1="6" y1="76" x2="154" y2="76" stroke={ink} strokeOpacity=".5"/>
          <line x1="6" y1="8" x2="6" y2="76" stroke={ink} strokeOpacity=".5"/>
          {[12,28,18,40,32,55,48,62].map((h,i)=>(
            <rect key={i} x={14+i*18} y={76-h} width="11" height={h} fill={i===5||i===7?rust:ink} opacity={i===5||i===7?".7":".25"}/>
          ))}
          <text x="6" y="86" fontSize="6" fontFamily="ui-monospace" fill={ink} opacity=".6">MON</text>
          <text x="138" y="86" fontSize="6" fontFamily="ui-monospace" fill={ink} opacity=".6">SUN</text>
        </svg>
      </div>
    );
    return null;
  };

  const KindMark = ({k}) => {
    const stroke="#c97f72";
    const props = { width:28, height:28, viewBox:"0 0 24 24", fill:"none", stroke, strokeWidth:1.4, strokeLinecap:"round", strokeLinejoin:"round", "aria-hidden":true };
    if(k==="Template") return <svg {...props}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>;
    if(k==="Tool")     return <svg {...props}><path d="M3 12h18M12 3v18"/><circle cx="12" cy="12" r="9"/></svg>;
    if(k==="Ritual")   return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    if(k==="Test")     return <svg {...props}><path d="M9 4v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V4M9 4h6"/></svg>;
    if(k==="Log")      return <svg {...props}><path d="M4 20V6a2 2 0 0 1 2-2h11l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8M8 14h8M8 18h5"/></svg>;
    return null;
  };

  const indexed = RESOURCES.map((r,i)=>({...r, n:i+1}));
  const swatch = { Template:"#f3c6c2", Tool:"#cfd8e9", Ritual:"#c7e2c7", Test:"#fbe9a5", Log:"#e7d9ef" };

  return (
    <section id="catalogue" className="spread relative pt-0">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">

        {/* MASTHEAD */}
        <div className="border-t-2 border-b border-ink-900/80 py-4 mb-12 grid grid-cols-12 gap-x-6 gap-y-3 items-end">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow text-ink-900">Catalogue · vol. 03</p>
            <p className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] text-ink-900 leading-tight mt-1">
              13 quiet tools, indexed by use.
            </p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">How it works</p>
            <p className="hand text-[16px] text-brand-rust leading-snug mt-1">request → PDF in your inbox in 2 min, every PDF free.</p>
          </div>
          <div className="col-span-6 md:col-span-2 text-right md:text-left">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Updated</p>
            <p className="font-display text-[18px] text-ink-900 leading-tight mt-1">Spring · 2026</p>
          </div>
          <div className="col-span-12 md:col-span-2 md:text-right">
            <a href={REQUEST_FORM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-ink-900 underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
              Get them all →
            </a>
          </div>
        </div>

        {/* QUICK INDEX strip */}
        <div className="mb-14 grid grid-cols-2 md:grid-cols-5 gap-3">
          {GROUPS.map(g=>{
            const count = indexed.filter(r=>r.kind===g.kind).length;
            return (
              <a key={g.kind} href={`#section-${g.kind}`} className="group flex items-center gap-3 border border-ink-900/15 bg-cream-50/70 hover:bg-cream-50 p-3 transition">
                <span className="inline-block h-7 w-7 rounded-full shrink-0" style={{background:swatch[g.kind]}}/>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[18px] text-ink-900 leading-none">{g.label}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700 mt-1">{count} {count===1?"piece":"pieces"}</p>
                </div>
                <span className="font-mono text-[11px] text-brand-rust shrink-0 group-hover:translate-x-0.5 transition">→</span>
              </a>
            );
          })}
        </div>

        {/* grouped sections — featured + grid */}
        <div className="space-y-20">
          {GROUPS.map((g,gi)=>{
            const items = indexed.filter(r=>r.kind===g.kind);
            if(items.length===0) return null;
            const [feat, ...rest] = items;
            return (
              <div key={g.kind} id={`section-${g.kind}`} className="relative">
                {/* horizontal masthead */}
                <div className="grid grid-cols-12 gap-x-6 gap-y-3 items-end pb-4 border-b border-ink-900/80">
                  <div className="col-span-12 md:col-span-1">
                    <p className="font-display text-[56px] leading-none text-brand-rust/30">
                      {String(gi+1).padStart(2,"0")}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-5">
                    <div className="flex items-center gap-3">
                      <KindMark k={g.kind}/>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-brand-rust">{g.kind} series</p>
                    </div>
                    <h3 className="display text-[clamp(2rem,3vw,2.8rem)] text-ink-900 mt-1 leading-[1]">{g.label}</h3>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <p className="text-[14.5px] leading-relaxed text-ink-700 max-w-[40ch]">{g.desc}</p>
                  </div>
                  <div className="col-span-12 md:col-span-2 md:text-right">
                    <p className="hand text-[18px] text-brand-rust leading-tight">{g.hand}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700 mt-1">{items.length} {items.length===1?"item":"items"} ·  free</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-5">
                  {/* FEATURED */}
                  <article
                    className={`relative col-span-12 lg:col-span-5 ${feat.tone} p-6 pt-7 border border-ink-900/10 shadow-[0_22px_44px_-22px_rgba(0,0,0,0.4)]`}
                    style={{transform:"rotate(-0.4deg)"}}>
                    <span aria-hidden className="absolute -top-2 left-8 h-6 w-3 rounded-sm bg-ink-900/15"></span>
                    <span aria-hidden className="absolute top-3 right-3 rotate-[10deg] rounded-full border border-brand-rust/70 text-brand-rust px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-cream-50/85">N° {String(feat.n).padStart(2,"0")}</span>

                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Featured · {g.kind}</p>
                    <h4 className="font-display text-[28px] leading-[1.05] text-ink-900 mt-1 max-w-[18ch]">{feat.title}</h4>
                    <p className="mt-3 text-[14px] leading-[1.65] text-ink-900/80 max-w-[48ch]">{feat.body}</p>

                    <div className="mt-5">
                      <Preview k={g.kind}/>
                      <p className="hand text-[14px] text-ink-700 -mt-1">— what's inside the PDF</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-dashed border-ink-900/25 flex items-center justify-between gap-3 flex-wrap">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">PDF · A4 · 1–2 pages · printable</p>
                      <a href={REQUEST_FORM} target="_blank" rel="noreferrer"
                         className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-cream-50 text-[11px] font-mono uppercase tracking-widest hover:bg-brand-rust transition">
                        Request the PDF →
                      </a>
                    </div>
                  </article>

                  {/* SECONDARY list */}
                  <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                    {rest.length===0 && (
                      <div className="sm:col-span-2 border border-dashed border-ink-900/25 p-6 flex items-center justify-center text-center bg-cream-50/50">
                        <p className="hand text-[18px] text-ink-700">— one piece in this series.<br/>more coming in vol. 04 ✿</p>
                      </div>
                    )}
                    {rest.map((r,j)=>(
                      <article key={r.title}
                               className="group relative bg-cream-50 border border-ink-900/15 p-5 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(0,0,0,0.3)] transition">
                        <span aria-hidden className="absolute top-0 left-0 h-1 w-full" style={{background:swatch[g.kind]}}/>
                        <div className="flex items-start gap-4">
                          <p className="font-display text-[36px] leading-none text-ink-900/20 shrink-0">
                            {String(r.n).padStart(2,"0")}
                          </p>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-[18px] leading-tight text-ink-900">{r.title}</p>
                            <p className="mt-2 text-[13px] leading-[1.6] text-ink-900/75 line-clamp-3">{r.body}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-dashed border-ink-900/20 flex items-center justify-between">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">PDF · {j%2?"2p":"1p"}</p>
                          <a href={REQUEST_FORM} target="_blank" rel="noreferrer"
                             className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-ink-900 underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
                            Request →
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* bottom rail */}
        <div className="mt-20 border-t border-ink-900/15 pt-5 flex items-center justify-between flex-wrap gap-3">
          <p className="hand text-[18px] text-ink-700">— end of catalogue. one bundle, one request.</p>
          <a href={REQUEST_FORM} target="_blank" rel="noreferrer" className="btn-ink !py-2.5 !px-5 !text-[13px]">Request the full bundle <I.arrow/></a>
        </div>
      </div>
    </section>
  );
}

function ResourcesCTA(){
  return (
    <section className="spread relative pt-0">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12 grid grid-cols-12 gap-6">
        {/* discord card */}
        <a href="https://discord.gg/hb8bKpbjEz" target="_blank" rel="noreferrer"
           className="col-span-12 md:col-span-6 group flex items-center gap-6 bg-brand-peach p-7 border border-ink-900/10 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition -rotate-[0.6deg]">
          <span className="h-16 w-16 shrink-0 rounded-2xl bg-cream-50 text-indigo-700 flex items-center justify-center text-3xl">
            <I.discord/>
          </span>
          <div className="flex-1">
            <span className="eyebrow text-brand-rust">Community · Free</span>
            <p className="font-display text-[24px] text-ink-900 mt-1 leading-tight">Join the Discord</p>
            <p className="text-[14px] text-ink-900/80 mt-1">Hang out between livestreams. Share wins, find a study buddy, ask for accountability.</p>
          </div>
          <span aria-hidden className="hidden md:inline text-ink-900 transition group-hover:translate-x-1">→</span>
        </a>

        {/* workshops card */}
        <div className="col-span-12 md:col-span-6 bg-cream-50 border border-ink-900/10 p-7 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)] rotate-[0.5deg]">
          <p className="eyebrow text-ink-700">Looking for more?</p>
          <h3 className="display text-[28px] text-ink-900 mt-2 leading-tight">Paid workshops <em>go deeper, faster.</em></h3>
          <p className="text-[14px] text-ink-700 mt-3 max-w-md">Our cohorts take these free tools and build a full practice around them — with peer accountability and coach feedback.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="workshops.html" className="btn-ink">See workshops <I.arrow/></a>
            <a href="contact.html" className="btn-ghost">Ask a question</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResourcesPage(){
  return (
    <div className="paper-grain relative">
      <Header/>
      <ResourcesHero/>
      <ResourceGrid/>
      <ResourcesCTA/>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ResourcesPage/>);
