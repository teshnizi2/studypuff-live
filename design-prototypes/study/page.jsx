// Study with us — full page.
// Editorial / scrapbook treatment that extends the home spread:
// hero with live status, deep weekly schedule, how-it-works, hosts,
// past sessions, room rules, FAQ, and CTA.

const { useState: useS, useEffect: useE } = React;

/* ── helpers ─────────────────────────────────────────────────────── */
function ClockCET(){
  const [t,setT]=useS(new Date());
  useE(()=>{ const id=setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(id); },[]);
  const fmt = new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/Amsterdam"});
  return <span className="font-mono tabular-nums">{fmt.format(t)} CET</span>;
}

/* ── HERO ────────────────────────────────────────────────────────── */
function StudyHero(){
  return (
    <section id="top" className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-end">

          <div className="col-span-12 lg:col-span-7 relative">
            {/* live status pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50 px-3.5 py-1.5 text-xs font-semibold text-ink-900 shadow-soft">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-60"></span>
                <span className="relative inline-block h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              On air now · <StudyingNowCount/> studying together · <ClockCET/>
            </div>

            <p className="eyebrow text-ink-700 mb-4">Study with us</p>
            <h1 className="display text-[clamp(2.6rem,7vw,6rem)] text-ink-900">
              A quiet room,<br/>
              <span className="relative inline-block">
                <em>open to anyone.</em>
                <svg aria-hidden viewBox="0 0 360 30" className="absolute left-0 right-0 -bottom-2 w-full h-4" preserveAspectRatio="none">
                  <path d="M4 18 C 60 6, 140 26, 220 14 S 320 20, 354 16" stroke="#c97f72" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <path d="M320 8 l 16 16 M 336 8 l -16 16" stroke="#c97f72" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[18px] leading-relaxed text-ink-700">
              Free live co-study sessions, hosted on YouTube and Twitch. Bring your books, set
              a tiny intention, and work alongside students from all around the world.
              Cameras off, chat on, breaks every fifty minutes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#schedule" className="btn-ink">See this week&rsquo;s schedule <I.arrow/></a>
              <a href="https://www.youtube.com/@StudyPuffAcademy" target="_blank" rel="noreferrer" className="btn-ghost">
                <I.yt/> Watch on YouTube
              </a>
              <a href="https://www.twitch.tv/studypuff" target="_blank" rel="noreferrer" className="btn-ghost">
                <I.twitch/> Watch on Twitch
              </a>
            </div>

            {/* tiny stats strip */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-[520px] border-t border-ink-900/15 pt-5">
              <div><p className="font-display text-[28px] leading-none text-ink-900">2,400+</p><p className="eyebrow text-ink-700 mt-1">hours streamed</p></div>
              <div><p className="font-display text-[28px] leading-none text-ink-900">180+</p><p className="eyebrow text-ink-700 mt-1">sessions hosted</p></div>
              <div><p className="font-display text-[28px] leading-none text-ink-900">38</p><p className="eyebrow text-ink-700 mt-1">countries tuning in</p></div>
            </div>
          </div>

          {/* RIGHT — layered polaroids */}
          <div className="col-span-12 lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[520px]">

              {/* twitch polaroid behind */}
              <div className="absolute -left-8 top-32 w-[60%] rotate-[6deg] bg-cream-50 p-2.5 pb-3 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)] z-[1]">
                <div className="aspect-[4/3] relative overflow-hidden bg-brand-lilac/40">
                  <img src="public/twitch-lifestyle.jpg" alt="" className="absolute inset-0 h-full w-full object-cover"/>
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-[#9146ff] px-2 py-0.5 text-white text-[9px] font-mono uppercase tracking-widest">
                    <I.twitch/> Twitch
                  </span>
                </div>
                <p className="hand mt-1 text-center text-[14px] text-ink-700">cozy game nights</p>
              </div>

              {/* youtube polaroid front */}
              <div className="relative -rotate-[2deg] bg-cream-50 p-3 pb-4 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.32)] z-[2]">
                <span aria-hidden className="absolute -top-3 left-10 h-6 w-28 -rotate-[8deg] opacity-90"
                      style={{background:"repeating-linear-gradient(135deg, #c7e2c7 0 8px, #fbe9a5 8px 16px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
                <div className="aspect-[4/3] relative overflow-hidden bg-brand-mint/40">
                  <img src="public/youtube-lifestyle.jpg" alt="" className="absolute inset-0 h-full w-full object-cover"/>
                  <span className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-ink-900/90 px-3 py-1 text-cream-50 text-[10px] font-mono uppercase tracking-widest backdrop-blur">
                    <I.yt className="text-red-400"/> Live · <StudyingNowCount/> watching
                  </span>
                  <span className="absolute bottom-3 right-3 rotate-[6deg] rounded-sm border border-brand-rust/70 bg-cream-50/85 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-brand-rust">
                    co-study · N° 184
                  </span>
                </div>
                <p className="hand mt-2 text-center text-[18px] text-ink-700">tonight, 19:00 CET — bring your books</p>
              </div>

              {/* sticky note */}
              <div className="absolute -right-6 -bottom-4 w-[180px] -rotate-[6deg] bg-brand-butter p-3 shadow-[0_10px_20px_-8px_rgba(0,0,0,.25)] z-[3]"
                   style={{clipPath:"polygon(0 0, 100% 0, 100% 86%, 88% 100%, 0 100%)"}}>
                <p className="hand text-[14px] leading-snug text-ink-900">
                  drop in late,<br/>leave early —<br/>no problem ✿
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ────────────────────────────────────────────────── */
function HowItWorks(){
  const STEPS = [
    { num:"01", kicker:"Show up", title:"Drop in, however you arrive",
      body:"Click the YouTube or Twitch link a few minutes before. No sign-up, no camera, no microphone." },
    { num:"02", kicker:"Set intention", title:"Write one tiny goal in chat",
      body:"\"Finish chapter 4.\" \"Outline the essay.\" Sharing it makes you 2× more likely to do it — that's the whole trick." },
    { num:"03", kicker:"Work the round", title:"50 minutes deep, 10 minutes breathe",
      body:"The Pomodoro timer runs on screen. Background sounds keep it calm. Break chat is for tea, stretches, and dog photos.",
      stamp:"T + 00", duration:"60 min", tone:"bg-brand-mint",
      icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="13" r="7.5"/><path d="M12 13V8.5"/><path d="M9.5 3h5"/><path d="M19 5l1.5 1.5"/><path d="M5 5L3.5 6.5"/></svg>) },
    { num:"04", kicker:"Mark progress", title:"Tick off your win on the way out",
      body:"End-of-session ritual: one ✓ in chat, one thing you're proud of. Then go to bed earlier than you planned. We mean it.",
      stamp:"T + 60", duration:"2 min", tone:"bg-brand-pink",
      icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l2 2L20 5"/><path d="M4 13l2 2 14-4"/><path d="M4 19l2 2 14-4"/></svg>) }
  ];
  // first two need icons & stamps too
  STEPS[0] = { ...STEPS[0],
    stamp:"T − 05", duration:"≈ 2 min", tone:"bg-brand-sky",
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 12h6"/><circle cx="15" cy="12" r=".7" fill="currentColor"/><path d="M5 7h14"/></svg>) };
  STEPS[1] = { ...STEPS[1],
    stamp:"T − 02", duration:"≈ 1 min", tone:"bg-brand-butter",
    icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17l3.5-1 9-9-2.5-2.5-9 9L4 17z"/><path d="M14 6l3 3"/><path d="M5 20h14"/></svg>) };
  return (
    <section id="how" className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* masthead — printed-program style */}
        <div className="border-t-2 border-b border-ink-900/80 py-4 mb-10 grid grid-cols-12 gap-x-6 gap-y-3 items-end">
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow text-brand-rust">How a session runs</p>
            <h2 className="display text-[clamp(2rem,4vw,3.4rem)] text-ink-900 leading-[1.02] mt-1">
              Four steps. <em>That&rsquo;s it.</em>
            </h2>
          </div>
          <p className="col-span-12 md:col-span-4 text-[15px] leading-relaxed text-ink-700">
            Every co-study runs on the same rhythm — calm, predictable, easy to slot into a Tuesday night.
          </p>
          <div className="col-span-12 md:col-span-2 md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Total run-time</p>
            <p className="font-display text-[20px] text-ink-900 leading-tight mt-1">≈ 65 minutes</p>
          </div>
        </div>

        {/* journey rail — dashed timeline with stations */}
        <div className="relative pt-2">
          {/* horizontal dashed rail (md+) */}
          <svg aria-hidden className="absolute left-0 right-0 top-[58px] hidden md:block w-full" height="14" viewBox="0 0 1200 14" preserveAspectRatio="none">
            <path d="M 30 7 Q 200 1, 350 8 T 700 5 T 1000 9 T 1170 6" stroke="#c97f72" strokeWidth="1.5" strokeDasharray="4 6" fill="none" strokeLinecap="round"/>
          </svg>

          <div className="grid grid-cols-12 gap-x-4 gap-y-12">
            {STEPS.map((s,i)=>{
              const offset = i % 2 === 0 ? "md:mt-0" : "md:mt-10";
              return (
                <div key={s.num} className={`col-span-12 md:col-span-3 relative ${offset}`}>
                  {/* station dot on rail (above card) */}
                  <div className="hidden md:flex items-center justify-center mb-3">
                    <span className="relative">
                      <span className="block h-4 w-4 rounded-full bg-cream-100 border-2 border-brand-rust shadow-[0_0_0_3px_rgba(253,251,247,1)]"/>
                      {i < STEPS.length - 1 &&
                        <span aria-hidden className="absolute left-full top-1/2 -translate-y-1/2 ml-2 text-brand-rust/70 text-[14px]">→</span>}
                    </span>
                  </div>

                  {/* the step card */}
                  <article className="relative bg-cream-50 border border-ink-900/12 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.32)] p-6 pb-7"
                           style={{transform:`rotate(${(i%2?0.4:-0.4)}deg)`}}>
                    {/* time stamp ribbon */}
                    <div className="absolute -top-3 left-5 right-5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-cream-50">
                        {s.stamp}
                      </span>
                      <span className={`${s.tone} inline-flex items-center gap-1 rounded-full border border-ink-900/15 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-ink-900`}>
                        {s.duration}
                      </span>
                    </div>

                    {/* number + icon row */}
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-display text-[58px] leading-none text-brand-rust" style={{letterSpacing:"-0.03em"}}>{s.num}</p>
                      <span className={`${s.tone} inline-flex h-12 w-12 items-center justify-center rounded-full text-ink-900 border border-ink-900/15`}>
                        <span className="h-6 w-6 block">{s.icon}</span>
                      </span>
                    </div>

                    <p className="eyebrow text-ink-700 mt-4">{s.kicker}</p>
                    <p className="font-display text-[22px] leading-tight text-ink-900 mt-2">{s.title}</p>
                    <p className="mt-3 text-[14px] leading-[1.65] text-ink-700">{s.body}</p>

                    <svg className="mt-5" width="42" height="8" viewBox="0 0 42 8" fill="none" aria-hidden>
                      <path d="M1 5 Q 10 1 20 4 T 41 4" stroke="#c97f72" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </article>
                </div>
              );
            })}
          </div>

          {/* footer caption */}
          <div className="mt-12 flex items-center justify-between flex-wrap gap-3 border-t border-ink-900/15 pt-5">
            <p className="hand text-[18px] text-brand-rust">— then close the laptop. for real.</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">No mic required · drop in late · leave when ready</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FULL WEEKLY SCHEDULE ────────────────────────────────────────── */
function Schedule(){
  const [platform,setPlatform] = useS("all");
  const [kind,setKind] = useS("all");
  const ALL = [
    { day:"Mon", date:"12", dow:"Monday",    title:"Co-study · Deep Work",          time:"19:00", end:"22:00", dur:"3h",   host:"Hera",   platform:"yt", kind:"Live",     tone:"bg-brand-mint",   live:true,  rsvp:128, note:"main weekly anchor" },
    { day:"Tue", date:"13", dow:"Tuesday",   title:"Morning Pages · Quiet Room",    time:"08:00", end:"10:00", dur:"2h",   host:"Reza",   platform:"yt", kind:"Live",     tone:"bg-brand-sky",    live:false, rsvp:64,  note:"slow start, no chat" },
    { day:"Tue", date:"13", dow:"Tuesday",   title:"Sprint Hour · Inbox Zero",      time:"21:00", end:"22:00", dur:"1h",   host:"Hera",   platform:"yt", kind:"Live",     tone:"bg-brand-peach",  live:false, rsvp:42,  note:"admin & errands" },
    { day:"Wed", date:"14", dow:"Wednesday", title:"Workshop · Spaced Repetition",  time:"18:30", end:"20:00", dur:"90m",  host:"Reza",   platform:"yt", kind:"Workshop", tone:"bg-brand-butter", live:false, rsvp:212, note:"bring your deck" },
    { day:"Thu", date:"15", dow:"Thursday",  title:"Co-study · Rainy Library",      time:"20:00", end:"23:00", dur:"3h",   host:"Elaine", platform:"tw", kind:"Live",     tone:"bg-brand-lilac",  live:true,  rsvp:96,  note:"ambient rain track" },
    { day:"Fri", date:"16", dow:"Friday",    title:"Deadline Sprint · Submit Night",time:"21:00", end:"01:00", dur:"4h",   host:"Hera",   platform:"yt", kind:"Live",     tone:"bg-brand-pink",   live:false, rsvp:174, note:"last-mile push" },
    { day:"Sat", date:"17", dow:"Saturday",  title:"Cozy Game Night · Stardew",     time:"21:00", end:"23:30", dur:"2.5h", host:"Elaine", platform:"tw", kind:"Stream",   tone:"bg-brand-pink",   live:false, rsvp:88,  note:"between-study chill" },
    { day:"Sun", date:"18", dow:"Sunday",    title:"Week Reset · Planning Room",    time:"16:00", end:"18:00", dur:"2h",   host:"Hera",   platform:"yt", kind:"Live",     tone:"bg-brand-mint",   live:false, rsvp:142, note:"plan your week" },
    { day:"Sun", date:"18", dow:"Sunday",    title:"Late Night Library · LoFi",     time:"23:00", end:"02:00", dur:"3h",   host:"guest",  platform:"tw", kind:"Live",     tone:"bg-brand-lilac",  live:false, rsvp:54,  note:"for the night owls" }
  ];

  const FILTERED = ALL.filter(s =>
    (platform==="all" || s.platform===platform) &&
    (kind==="all" || s.kind.toLowerCase()===kind)
  );

  // group by day
  const BY_DAY = FILTERED.reduce((acc,s)=>{
    const key = `${s.day}-${s.date}-${s.dow}`;
    (acc[key] = acc[key] || { day:s.day, date:s.date, dow:s.dow, items:[] }).items.push(s);
    return acc;
  }, {});
  const DAYS = Object.values(BY_DAY);

  const PlatformDot = ({p, size="md"}) => {
    const sz = size==="sm"?"h-4 w-4":"h-5 w-5";
    return p === "tw"
      ? <span title="Twitch"  className={`inline-flex ${sz} items-center justify-center rounded-full bg-[#9146ff] text-white text-[9px]`}><I.twitch/></span>
      : <span title="YouTube" className={`inline-flex ${sz} items-center justify-center rounded-full bg-red-500 text-white text-[9px]`}><I.yt/></span>;
  };

  const HostAvatar = ({name}) => {
    const map = { Hera:"#c7e2c7", Reza:"#fbe9a5", Elaine:"#d9cdea", guest:"#cfd8e9" };
    const init = name === "guest" ? "?" : name[0];
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-ink-900/15 font-mono text-[10px] text-ink-900"
            style={{background: map[name] || "#eee"}}>
        {init}
      </span>
    );
  };

  const totalHours = ALL.reduce((sum,s)=>{
    const m = s.dur.match(/^([\d.]+)(h|m)/);
    return sum + (m ? (m[2]==="h" ? parseFloat(m[1]) : parseFloat(m[1])/60) : 0);
  }, 0);

  return (
    <section id="schedule" className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

        {/* MASTHEAD — printed-program style */}
        <div className="border-t-2 border-b border-ink-900/80 py-4 mb-5 grid grid-cols-12 gap-x-6 gap-y-3 items-end">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow text-brand-rust">Stream Schedule · Vol. 03</p>
            <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight text-ink-900 mt-1">This week on the air</h2>
          </div>
          <div className="col-span-4 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Week of</p>
            <p className="font-display text-[18px] text-ink-900 leading-tight mt-1">Nov 12 — 18</p>
          </div>
          <div className="col-span-4 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Time zone</p>
            <p className="font-display text-[18px] text-ink-900 leading-tight mt-1">CET · UTC+1</p>
          </div>
          <div className="col-span-4 md:col-span-3 md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">On the air</p>
            <p className="font-display text-[18px] text-ink-900 leading-tight mt-1">{totalHours.toFixed(1)} hrs · {ALL.length} streams</p>
          </div>
        </div>

        {/* FILTERS row */}
        <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Platform</span>
            {[{v:"all",label:"All"},{v:"yt",label:<><I.yt/> YouTube</>},{v:"tw",label:<><I.twitch/> Twitch</>}].map(opt=>(
              <button key={opt.v} onClick={()=>setPlatform(opt.v)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest transition border ${platform===opt.v ? "bg-ink-900 text-cream-50 border-ink-900" : "border-ink-900/20 text-ink-700 hover:text-ink-900"}`}>
                {opt.label}
              </button>
            ))}
            <span aria-hidden className="hidden md:inline h-4 w-px bg-ink-900/20 mx-1"/>
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Kind</span>
            {[{v:"all",label:"All"},{v:"live",label:"Co-study"},{v:"workshop",label:"Workshop"},{v:"stream",label:"Stream"}].map(opt=>(
              <button key={opt.v} onClick={()=>setKind(opt.v)}
                      className={`rounded-full px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest transition border ${kind===opt.v ? "bg-ink-900 text-cream-50 border-ink-900" : "border-ink-900/20 text-ink-700 hover:text-ink-900"}`}>
                {opt.label}
              </button>
            ))}
          </div>
          <p className="hand text-[16px] text-brand-rust">drop in late — no problem</p>
        </div>

        {/* DAY GROUPS */}
        <div className="border-t border-ink-900/15">
          {DAYS.map((d, di) => (
            <div key={di} className="grid grid-cols-12 gap-x-4 py-5 border-b border-ink-900/15">
              {/* day rail */}
              <div className="col-span-12 md:col-span-2 mb-3 md:mb-0">
                <div className="md:sticky md:top-4">
                  <p className="eyebrow text-ink-700">{d.day}</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <p className="font-display text-[44px] leading-none text-ink-900">{d.date}</p>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-ink-500">Nov</p>
                  </div>
                  <p className="hand text-[15px] text-ink-700 mt-1">{d.dow.toLowerCase()}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500 mt-1">{d.items.length} session{d.items.length>1?"s":""}</p>
                </div>
              </div>

              {/* sessions for this day */}
              <div className="col-span-12 md:col-span-10 space-y-2">
                {d.items.map((s, si) => (
                  <a href={s.platform==="yt"?"https://www.youtube.com/@StudyPuffAcademy":"https://www.twitch.tv/studypuff"}
                     target="_blank" rel="noreferrer"
                     key={si}
                     className="group relative grid grid-cols-12 items-center gap-3 py-3 pl-4 pr-3 bg-cream-50 border border-ink-900/10 hover:border-ink-900/30 hover:bg-cream-100/60 transition">
                    {/* left tone bar */}
                    <span aria-hidden className={`${s.tone} absolute left-0 top-2 bottom-2 w-1`}/>

                    {/* time block */}
                    <div className="col-span-3 sm:col-span-2 flex flex-col">
                      <p className="font-display text-[20px] leading-none text-ink-900">{s.time}</p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500 mt-1">→ {s.end} · {s.dur}</p>
                    </div>

                    {/* platform + host avatar */}
                    <div className="col-span-2 hidden sm:flex items-center gap-2">
                      <PlatformDot p={s.platform} size="sm"/>
                      <div className="flex items-center gap-1.5">
                        <HostAvatar name={s.host}/>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-700">{s.host}</span>
                      </div>
                    </div>

                    {/* title + note */}
                    <div className="col-span-7 sm:col-span-5">
                      <p className="font-display text-[18px] leading-tight text-ink-900 group-hover:underline underline-offset-4 decoration-brand-rust">{s.title}</p>
                      <p className="hand text-[14px] text-brand-rust mt-0.5">— {s.note}</p>
                    </div>

                    {/* live / rsvp */}
                    <div className="col-span-2 hidden sm:flex items-center justify-end">
                      {s.live ?
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-red-600 border border-red-500/30">
                          <span className="relative inline-flex h-1.5 w-1.5">
                            <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-60"></span>
                            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          </span>
                          Live now
                        </span>
                        :
                        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-700">{s.rsvp} rsvp</span>
                      }
                    </div>

                    {/* kind chip + arrow */}
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-2">
                      <span className={`${s.tone} text-ink-900 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded-sm`}>{s.kind}</span>
                      <span aria-hidden className="hidden md:inline text-ink-700 transition group-hover:translate-x-0.5">→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* empty state */}
        {DAYS.length===0 && (
          <div className="py-16 text-center border-b border-ink-900/15">
            <p className="hand text-[20px] text-brand-rust">— nothing matches that filter —</p>
            <p className="text-[13px] text-ink-700 mt-2">try another platform or kind.</p>
          </div>
        )}

        {/* FOOTER RAIL */}
        <div className="mt-4 grid grid-cols-12 gap-3 items-center">
          <div className="col-span-12 md:col-span-7 flex items-center gap-4 flex-wrap text-[11px] font-mono uppercase tracking-widest text-ink-700">
            <span>— end of week —</span>
            <span aria-hidden className="hidden md:inline h-3 w-px bg-ink-900/20"/>
            <a href="https://calendar.google.com/" target="_blank" rel="noreferrer" className="underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
              Add to Google Calendar →
            </a>
            <a href="/feed.ics" className="underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
              .ics feed
            </a>
            <a href="https://www.youtube.com/@StudyPuffAcademy" target="_blank" rel="noreferrer" className="underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
              Subscribe on YouTube
            </a>
          </div>
          <p className="hand text-[16px] text-brand-rust md:text-right col-span-12 md:col-span-5">all times CET — auto-converts on Google Calendar</p>
        </div>
      </div>
    </section>
  );
}

/* ── HOSTS ───────────────────────────────────────────────────────── */
function Hosts(){
  const TEAM = [
    { name:"Hera",   role:"Lead host · Deep Work",  photo:"public/assets/hera.jpg",   tone:"bg-brand-mint",   rot:"-2deg",
      bio:"PhD candidate. Loves the quiet kind of focus. Hosts the Monday rounds and the Sunday reset." },
    { name:"Reza",   role:"Workshops · Spaced repetition", photo:"public/assets/reza.jpg",   tone:"bg-brand-butter", rot:"1.5deg",
      bio:"Cognitive science nerd. Runs the workshops and the early morning quiet room. Drinks too much tea." },
    { name:"Elaine", role:"Twitch host · Cozy game nights", photo:"public/assets/elaine.jpg", tone:"bg-brand-lilac",  rot:"-1deg",
      bio:"Streamer & student. Lights the candles, picks the music, and hosts the Saturday game-study crossovers." }
  ];
  return (
    <section id="hosts" className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-12 flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="eyebrow text-ink-700 mb-3">The hosts</p>
            <h2 className="display text-[clamp(2rem,4vw,3.4rem)] text-ink-900">
              Real people, <em>same rooms.</em>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-ink-700">
            A small rotating team. You&rsquo;ll get to know them — they answer chat, remember names, and notice when you&rsquo;ve been working too late.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {TEAM.map((p,i)=>(
            <div key={p.name} className="col-span-12 md:col-span-4">
              <div className={`relative bg-cream-50 p-3 pb-4 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.32)]`} style={{transform:`rotate(${p.rot})`}}>
                <span aria-hidden className="absolute -top-3 left-8 h-5 w-20 rotate-[-6deg] opacity-90"
                      style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 8px, #fbe9a5 8px 16px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
                <div className={`aspect-[4/5] relative overflow-hidden ${p.tone}`}>
                  <img src={p.photo} alt={p.name} className="absolute inset-0 h-full w-full object-cover"/>
                </div>
                <div className="mt-3 px-1">
                  <p className="font-display text-[24px] leading-none text-ink-900">{p.name}</p>
                  <p className="eyebrow text-ink-700 mt-2">{p.role}</p>
                  <p className="mt-3 text-[14px] leading-[1.65] text-ink-700">{p.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ROOM RULES ──────────────────────────────────────────────────── */
function RoomRules(){
  const RULES = [
    { y:"Yes please", items:["Drop in late, leave early","Type your goal in chat","Take real breaks — water, walk, stretch","Be kind in chat","Show up tired — that's why we're here"] },
    { y:"Not here",   items:["No camera or mic required","No grinding shame","No politics in chat","No promo / self-marketing","No \"why are you behind\" energy"] }
  ];
  return (
    <section id="rules" className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow text-ink-700 mb-3">The room rules</p>
            <h2 className="display text-[clamp(2rem,4vw,3.4rem)] text-ink-900">
              A few small things that make the room <em>feel right.</em>
            </h2>
            <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-ink-700">
              Not rules so much as habits — the kind every cozy library quietly enforces.
            </p>
          </div>
          <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-6">
            {RULES.map((col,ci)=>(
              <div key={col.y}
                   className={`relative ${ci===0?"bg-brand-mint":"bg-brand-peach"} p-6 pb-7 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)]`}
                   style={{transform:`rotate(${ci===0?'-1':'1'}deg)`, backgroundImage:"repeating-linear-gradient(to bottom, transparent 0 30px, rgba(31,31,31,.06) 30px 31px)"}}>
                <span aria-hidden className="absolute -top-3 left-8 h-5 w-16 -rotate-[6deg] bg-cream-50/85 shadow-[0_2px_6px_rgba(0,0,0,.08)]"/>
                <p className="hand text-[14px] text-brand-rust mb-1">{ci===0?"— do this":"— skip this"}</p>
                <p className="font-display text-[24px] text-ink-900 mb-4">{col.y}</p>
                <ul className="space-y-2.5">
                  {col.items.map(it=>(
                    <li key={it} className="flex gap-2.5 text-[14px] leading-snug text-ink-900">
                      <span aria-hidden className={`font-mono select-none mt-0.5 ${ci===0?"text-brand-rust":"text-ink-700"}`}>{ci===0?"✓":"×"}</span>
                      <span className={ci===1?"line-through decoration-ink-900/40 decoration-[1.5px]":""}>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PAST SESSIONS (replays) ─────────────────────────────────────── */
function Replays(){
  const REPLAYS = [
    { title:"3hr Co-study · Late Night Library",  duration:"3:04:21", views:"82K",  platform:"yt", img:"public/youtube-lifestyle.jpg", tone:"bg-brand-sky",    tape:"#c6dceb", date:"Nov 05" },
    { title:"Pomodoro Co-study · Rain & Pages",   duration:"2:50:00", views:"61K",  platform:"yt", img:"public/sheep.png",            tone:"bg-brand-mint",   tape:"#c7e2c7", date:"Nov 03" },
    { title:"Cozy Cottage Study · Lo-fi",          duration:"4:12:08", views:"118K", platform:"yt", img:"public/youtube-lifestyle.jpg", tone:"bg-brand-butter", tape:"#fbe9a5", date:"Oct 30" },
    { title:"Twitch Game Night · Stardew Valley",  duration:"3:48:11", views:"24K",  platform:"tw", img:"public/twitch-lifestyle.jpg",  tone:"bg-brand-lilac",  tape:"#d9cdea", date:"Oct 28" }
  ];
  return (
    <section id="replays" className="spread relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow text-ink-700 mb-3">Replays</p>
            <h2 className="display text-[clamp(2rem,4vw,3.4rem)] text-ink-900">Catch up <em>after class.</em></h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-ink-700">
            Missed the live? Past sessions stay up — pick one to study along with on your own time.
          </p>
        </div>
        <div className="grid grid-cols-12 gap-5">
          {REPLAYS.map((r,i)=>(
            <a key={i} href="https://www.youtube.com/@StudyPuffAcademy" target="_blank" rel="noreferrer"
               className="col-span-12 sm:col-span-6 md:col-span-3 group"
               style={{transform:`rotate(${(i%2?1:-1)*0.6}deg)`}}>
              <div className="relative bg-cream-50 p-2.5 pb-3 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)] transition group-hover:-translate-y-1">
                {/* washi tape */}
                <span aria-hidden className="absolute -top-2 left-6 h-4 w-16 -rotate-[6deg] opacity-90 z-10"
                      style={{background:`repeating-linear-gradient(135deg, ${r.tape} 0 8px, #fbe9a5 8px 16px)`,boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
                <div className={`relative aspect-[4/5] overflow-hidden ${r.tone}`}>
                  <img src={r.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90"/>
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-ink-900/10"/>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-14 w-14 rounded-full bg-cream-50/95 flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(0,0,0,.45)] transition group-hover:scale-110">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#1f1f1f"><path d="M8 5v14l11-7z"/></svg>
                    </span>
                  </span>
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink-900/85 px-2 py-0.5 text-cream-50 text-[10px] font-mono uppercase tracking-widest backdrop-blur">
                    {r.platform==="tw" ? <><I.twitch/> Twitch</> : <><I.yt/> YouTube</>}
                  </span>
                  <span className="absolute top-3 right-3 rounded-sm bg-ink-900/85 px-2 py-0.5 text-cream-50 text-[10px] font-mono">{r.duration}</span>
                  <span className="absolute bottom-3 right-3 rotate-[5deg] rounded-sm border border-brand-rust/70 bg-cream-50/90 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-brand-rust">
                    N° {String(184-i).padStart(3,'0')}
                  </span>
                </div>
                <p className="hand mt-2 px-1 text-[16px] leading-tight text-ink-900">{r.title}</p>
                <div className="flex items-center justify-between px-1 mt-1">
                  <p className="eyebrow text-ink-700">{r.views} watched</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-ink-700/70">{r.date}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-ink-900/15 pt-5 flex-wrap gap-3">
          <p className="hand text-[18px] text-ink-700">over 180 sessions in the cupboard —</p>
          <a href="https://www.youtube.com/@StudyPuffAcademy" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-mono uppercase tracking-widest text-ink-900 underline underline-offset-4 decoration-brand-rust">
            All replays on YouTube →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ moved to faq.html ─────────────────────────────────────── */
function StudyFAQ(){
  return (
    <section id="faq" className="spread relative">
      <div className="mx-auto max-w-[900px] px-6 lg:px-12 text-center">
        <p className="eyebrow text-ink-700 mb-3">Before you knock</p>
        <h2 className="display text-[clamp(1.8rem,3vw,2.8rem)] text-ink-900">A few <em>quick questions?</em></h2>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-700 max-w-[52ch] mx-auto">
          All our co-study, workshop, and app FAQs now live in one place.
        </p>
        <a href="faq.html#livestreams" className="btn-ink mt-6">Visit the FAQ page <I.arrow/></a>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────── */
function StudyCTA(){
  return (
    <section className="spread relative">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
        <div className="relative bg-brand-mint/60 p-10 md:p-16 text-center -rotate-[0.4deg] shadow-[0_30px_80px_-30px_rgba(0,0,0,.35)]">
          <span aria-hidden className="absolute -top-4 left-10 h-7 w-32 -rotate-[5deg] opacity-90"
                style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 10px, #fbe9a5 10px 20px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
          <p className="hand text-[22px] text-brand-rust">see you tonight?</p>
          <h3 className="display text-[clamp(2rem,5vw,4rem)] text-ink-900 mt-2 leading-[1]">
            The room is <em>already on.</em>
          </h3>
          <p className="hand text-[18px] text-ink-700 mt-4"><StudyingNowCount/> studying right now · <ClockCET/></p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href="https://www.youtube.com/@StudyPuffAcademy" target="_blank" rel="noreferrer" className="btn-ink"><I.yt/> Join on YouTube</a>
            <a href="https://www.twitch.tv/studypuff" target="_blank" rel="noreferrer" className="btn-ghost"><I.twitch/> Join on Twitch</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PAGE ROOT ───────────────────────────────────────────────────── */
function StudyPage(){
  return (
    <div className="paper-grain relative">
      <Header/>
      <StudyHero/>
      <HowItWorks/>
      <Schedule/>
      <RoomRules/>
      <Replays/>
      <StudyFAQ/>
      <StudyCTA/>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<StudyPage/>);
