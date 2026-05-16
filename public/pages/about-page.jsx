// About — principles + team. Faithful to source repo, dressed for the new editorial look.

const PRINCIPLES = [
  { n:"01", title:"Research over showmanship", body:"Everything we teach is grounded in science, adapted for real student life.",  tone:"bg-brand-pink",   accent:"#c97f72", source:"Roediger & Karpicke · 2006", kicker:"the boring one we keep choosing", hand:"we read the papers so you don't have to" },
  { n:"02", title:"Rest is part of the work",  body:"Sleep, breaks, and fun aren't an afterthought, they are essential.",          tone:"bg-brand-butter", accent:"#c97f72", source:"Walker · Why We Sleep",  kicker:"protected, on purpose", hand:"a tired brain is not a moral failing" },
  { n:"03", title:"Personal attention",        body:"In-person cohorts of 30 max, no spam emails, and no ad interruptions.",        tone:"bg-brand-mint",   accent:"#c97f72", source:"Cohorts capped at 30",  kicker:"small rooms only", hand:"we'd rather know your name" },
  { n:"04", title:"Kindness is a strategy",    body:"Self-compassion outperforms self-criticism in the long run. Our tools reflect that.", tone:"bg-brand-sky", accent:"#c97f72", source:"Neff & Germer · 2013", kicker:"the long game wins", hand:"be the friend you needed in year one" }
];

const TEAM = [
  { name:"Elaine Herkul", first:"Elaine", role:"Founder · CEO", photo:"/assets/elaine.jpg", tone:"bg-brand-pink",   rot:"-2deg",
    bio:"Elaine is currently pursuing her master's in Applied Cognitive Psychology and her master's in Statistics and Data Science. She has been hosting the study with me livestreams since 2021 and continues to work on ways to give back to students.",
    tag:"hosts the livestreams" },
  { name:"Hera Imthorn",  first:"Hera",   role:"Co-founder · Research & Development", photo:"/assets/hera.jpg", tone:"bg-brand-mint", rot:"1.6deg",
    bio:"As a master's student in Applied Cognitive Psychology, Hera focuses primarily on research. She contributes to StudyPuff by conducting usability research and exploring scientific research on studying and learning. She makes sure that everything we build is grounded in evidence and genuinely supports effective learning.",
    tag:"reads the papers" },
  { name:"Reza Teshnizi", first:"Reza",   role:"Co-founder · Engineering & Automation", photo:"/assets/reza.jpg", tone:"bg-brand-lilac", rot:"-1deg",
    bio:"Reza is the computer scientist behind the StudyPuff app and the website. He also focuses on the automation to make sure that everything keeps running smoothly in the background.",
    tag:"writes the code" }
];

function AboutHero(){
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid grid-cols-12 gap-x-8 gap-y-10 items-end">
        <div className="col-span-12 lg:col-span-7">
          <p className="eyebrow text-ink-700 mb-4">About · est. 2022</p>
          <h1 className="display text-[clamp(2.6rem,7vw,6rem)] text-ink-900">
            Studying better<br/>
            <span className="relative inline-block">
              <em>shouldn't be a secret.</em>
              <svg aria-hidden viewBox="0 0 380 30" className="absolute left-0 right-0 -bottom-2 w-full h-4" preserveAspectRatio="none">
                <path d="M4 18 C 60 4, 140 26, 220 12 S 340 20, 374 14" stroke="#c97f72" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          <p className="mt-6 max-w-[54ch] text-[18px] leading-relaxed text-ink-700">
            A small team of three, building a calm home for students who want to study well together — grounded in research, run with care, free at the door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/contact" className="btn-ink">Say hello <I.arrow/></a>
            <a href="/study"   className="btn-ghost">Study with us tonight</a>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          {/* manifesto note */}
          <div className="relative bg-cream-50 border border-ink-900/15 p-7 md:p-8 -rotate-[1.2deg] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)]">
            <span aria-hidden className="absolute -top-3 left-10 h-6 w-28 -rotate-[6deg]"
                  style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 8px, #fbe9a5 8px 16px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
            <p className="eyebrow text-brand-rust">Mission, one paragraph</p>
            <p className="font-display italic text-[22px] leading-[1.35] text-ink-900 mt-3">
              "We want studying to feel less like a private war and more like a shared evening — with a warm light on, a quiet room, and people who'll quietly cheer when you finish the chapter."
            </p>
            <p className="hand text-[18px] text-ink-700 mt-4">— the team, Leiden</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Principles(){
  const Icon = ({i}) => {
    const stroke="#1f1f1f";
    const p = { width:54, height:54, viewBox:"0 0 60 60", fill:"none", stroke, strokeWidth:1.4, strokeLinecap:"round", strokeLinejoin:"round", "aria-hidden":true };
    if(i===0) return (<svg {...p}><rect x="10" y="8" width="34" height="44" rx="2"/><path d="M16 18h22M16 25h22M16 32h16"/><circle cx="44" cy="44" r="8" stroke="#c97f72"/><line x1="50" y1="50" x2="55" y2="55" stroke="#c97f72"/></svg>);
    if(i===1) return (<svg {...p}><path d="M8 36c4-2 6-4 6-10s4-10 12-10 12 4 12 12 6 8 12 8" stroke="#c97f72"/><path d="M14 44h36"/><circle cx="44" cy="14" r="4" fill="#fbe9a5"/></svg>);
    if(i===2) return (<svg {...p}><circle cx="22" cy="24" r="8"/><circle cx="40" cy="22" r="6"/><path d="M10 50c0-8 6-12 12-12s12 4 12 12"/><path d="M30 50c0-6 4-10 10-10s10 4 10 10"/><circle cx="50" cy="14" r="2.5" fill="#c97f72"/></svg>);
    return (<svg {...p}><path d="M30 50s-18-10-18-26a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 16-18 26-18 26z" stroke="#c97f72" fill="#f3c6c2" fillOpacity=".35"/></svg>);
  };
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* masthead */}
        <div className="mb-12 border-t-2 border-b border-ink-900/80 py-4 grid grid-cols-12 gap-x-6 gap-y-3 items-end">
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow text-ink-900">Our principles · house rules</p>
            <h2 className="display text-[clamp(1.5rem,3vw,2.8rem)] text-ink-900 leading-[1.05] mt-1 whitespace-nowrap">
              Four house rules <em>we don't bend.</em>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:text-right">
            <p className="hand text-[18px] text-brand-rust">— posted on the office wall, in that order.</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700 mt-2">Last revised · Spring 2026 · v1.3</p>
          </div>
        </div>

        {/* offset card layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRINCIPLES.map((p,i)=>(
            <article key={p.n}
                     className={`relative ${p.tone} border border-ink-900/10 shadow-[0_22px_44px_-22px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition`}
                     style={{transform:`rotate(${(i%2?1:-1)*0.6}deg)`, marginTop: i%2 ? "0" : "1.5rem"}}>
              {/* tape */}
              <span aria-hidden className="absolute -top-3 left-8 h-5 w-20 opacity-85"
                    style={{background:"repeating-linear-gradient(135deg, rgba(255,255,255,.7) 0 6px, rgba(0,0,0,.06) 6px 12px)", transform:`rotate(${i%2?6:-6}deg)`, boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
              {/* corner dog-ear */}
              <span aria-hidden className="absolute top-0 right-0 w-5 h-5" style={{background:"linear-gradient(135deg, rgba(255,255,255,.55) 50%, rgba(0,0,0,.08) 50%)"}}/>

              <div className="p-7">
                {/* top row — N° + icon */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Rule N° {p.n}</p>
                    <p className="font-display text-[64px] leading-none text-ink-900 mt-1" style={{letterSpacing:"-0.02em"}}>{p.n}</p>
                  </div>
                  <Icon i={i}/>
                </div>

                {/* hand-drawn divider */}
                <svg viewBox="0 0 180 8" className="w-full h-2 mt-4" aria-hidden preserveAspectRatio="none">
                  <path d="M2 5 Q 30 1 60 4 T 120 4 T 178 4" stroke="#c97f72" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                </svg>

                <p className="font-mono text-[10px] uppercase tracking-widest text-brand-rust mt-5">{p.kicker}</p>
                <p className="font-display text-[22px] mt-1 text-ink-900 leading-[1.15]">{p.title}</p>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-ink-900/80">{p.body}</p>
                <p className="hand text-[15px] text-ink-700 mt-3 leading-snug">— {p.hand}</p>

                {/* source footnote */}
                <div className="mt-5 pt-3 border-t border-dashed border-ink-900/25 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">cf. {p.source}</p>
                  <span aria-hidden className="inline-block w-6 h-px bg-ink-900/30"/>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* signature row */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink-900/15 pt-5">
          <p className="hand text-[18px] text-ink-700">— signed, the three of us.</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">StudyPuff · Leiden · est. 2022</p>
        </div>
      </div>
    </section>
  );
}

function Team(){
  const FACTS = [
    { label:"Leiden, NL",        kicker:"based in" },
    { label:"3 humans",          kicker:"team size" },
    { label:"a lot of tea",      kicker:"fuel" },
    { label:"est. 2022",         kicker:"since" }
  ];
  const FAVS = [
    { who:"Elaine", chip:"☕ flat white",  tone:"bg-brand-pink" },
    { who:"Hera",   chip:"📚 cited papers", tone:"bg-brand-mint" },
    { who:"Reza",   chip:"⌨️  vim, sorry",   tone:"bg-brand-lilac" }
  ];
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
        {/* masthead */}
        <div className="mb-12 border-t-2 border-b border-ink-900/80 py-4 grid grid-cols-12 gap-x-6 gap-y-3 items-end">
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow text-ink-900">The team · staff page</p>
            <h2 className="display text-[clamp(1.5rem,3vw,2.8rem)] text-ink-900 leading-[1.05] mt-1 whitespace-nowrap">
              The humans <em>behind StudyPuff.</em>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:text-right">
            <p className="hand text-[18px] text-brand-rust">Three friends. One small office. A lot of tea.</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700 mt-2">Group photo coming · spring 2026</p>
          </div>
        </div>

        {/* facts strip */}
        <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-0 border border-ink-900/15 bg-cream-50/70">
          {FACTS.map((f,i)=>(
            <div key={f.label} className={`p-4 ${i<FACTS.length-1?"md:border-r":""} border-ink-900/15 ${i<2?"border-b md:border-b-0":""}`}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">{f.kicker}</p>
              <p className="font-display text-[22px] text-ink-900 leading-tight mt-1">{f.label}</p>
            </div>
          ))}
        </div>

        {/* team cards */}
        <div className="grid grid-cols-12 gap-6">
          {TEAM.map((p,i)=>(
            <figure key={p.name} className="col-span-12 md:col-span-4 group">
              <div className="relative bg-cream-50 p-3 pb-5 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.32)] hover:-translate-y-1 transition" style={{transform:`rotate(${p.rot})`}}>
                {/* tape */}
                <span aria-hidden className="absolute -top-3 left-8 h-5 w-20 -rotate-[6deg]"
                      style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 8px, #fbe9a5 8px 16px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
                {/* polaroid corner stamp */}
                <span className="absolute top-2 right-2 z-10 rotate-[10deg] inline-block bg-cream-50/85 border border-brand-rust/70 text-brand-rust px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest">N° {String(i+1).padStart(2,"0")}</span>
                <div className={`aspect-[4/5] relative overflow-hidden ${p.tone}`}>
                  <img src={p.photo} alt={p.name} className="absolute inset-0 h-full w-full object-cover"/>
                  {/* date stamp bottom-left */}
                  <span className="absolute bottom-2 left-2 rounded-sm bg-cream-50/90 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-ink-900">{p.first} · 2026</span>
                </div>
                <figcaption className="mt-4 px-1">
                  <p className="font-display text-[28px] leading-none text-ink-900">{p.name}</p>
                  <p className="eyebrow text-brand-rust mt-2">{p.role}</p>
                  <p className="hand text-[17px] text-ink-700 mt-1">“{p.tag}”</p>
                  <p className="mt-3 text-[14px] leading-[1.65] text-ink-700">{p.bio}</p>
                  {/* signature line */}
                  <div className="mt-4 pt-3 border-t border-dashed border-ink-900/20 flex items-center justify-between">
                    <span className="hand text-[18px] text-ink-900" style={{transform:"rotate(-2deg)",display:"inline-block"}}>{p.first}.</span>
                    <span className={`inline-block ${FAVS[i].tone} border border-ink-900/15 px-2 py-0.5 text-[11px] font-mono text-ink-900`}>{FAVS[i].chip}</span>
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        {/* hiring / join us slip */}
        <div className="mt-14 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-8">
            <p className="eyebrow text-ink-900">Joining us</p>
            <p className="font-display text-[clamp(1.4rem,2.4vw,2rem)] text-ink-900 leading-tight mt-2">
              No open roles right now — but we read every kind note from students who want to help.
            </p>
            <p className="hand text-[17px] text-brand-rust mt-2">guest hosts, scholarship students, friendly nerds welcome.</p>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <a href="/contact" className="btn-ink">Say hello <I.arrow/></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPage(){
  return (
    <div className="paper-grain relative">
      <Header/>
      <AboutHero/>
      <Principles/>
      <Team/>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AboutPage/>);
