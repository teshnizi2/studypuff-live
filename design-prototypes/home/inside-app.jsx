// "Meet the app" — restored original copy + CTAs. Visual treatment is the field-notebook spread.

function InsideApp() {
  return (
    <section id="inside" className="spread relative">
      <div className="absolute inset-0 bg-cream-100/70 border-y border-ink-900/10" aria-hidden></div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-center">
          {/* left text column (original copy) */}
          <div className="reveal col-span-12 lg:col-span-6 order-2 lg:order-1">
            <p className="eyebrow text-ink-700 mb-3">Meet the app · free</p>
            <h2 className="display text-[clamp(2rem,3.5vw,3rem)] text-ink-900">
              A cozy timer. A sheep that&rsquo;s <em>rooting for you</em>.
            </h2>
            <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-ink-700">
              Set your focus timer, pick a task, press start. Earn coins for every study
              session, completed tasks, and more. Use them on new ambient sounds, themes,
              and more to come. Join study rooms with a code so you can study with your
              friends in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/dashboard" className="btn-ink">Open the app <I.arrow/></a>
              <a href="/register"  className="btn-ghost">Create a free account</a>
            </div>

            {/* small annotations row */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <Annot n="①" label="Focus block"  />
              <Annot n="②" label="Ambient sound" />
              <Annot n="③" label="Study room code" />
            </div>
          </div>

          {/* app mock + marginalia */}
          <div className="reveal delay-2 col-span-12 lg:col-span-6 order-1 lg:order-2 relative">
            <AppMock/>
            {/* Floating mini cards — from the original AppPreview, restored */}
            <div className="pointer-events-none absolute -left-4 top-1/4 hidden sm:inline-flex rotate-[-6deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0369a1" strokeWidth="1.75" aria-hidden><path d="M8 19v1m4-1v1m4-1v1M4 14a4 4 0 0 1 1.5-7.8A6 6 0 0 1 17 7a4.5 4.5 0 0 1 1 8.8"/></svg>
              Rain · ambient
            </div>
            <div className="pointer-events-none absolute -right-4 top-10 hidden sm:inline-flex rotate-[5deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#c2410c" strokeWidth="1.75" aria-hidden><path d="M12 3s5 5 5 10a5 5 0 0 1-10 0c0-3 2-5 2-8 1 2 3 3 3 6"/></svg>
              Streak · 12 days
            </div>
            <div className="pointer-events-none absolute -bottom-4 right-12 hidden sm:inline-flex rotate-[-3deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#047857" strokeWidth="1.75" aria-hidden><path d="M21 12a8 8 0 0 1-11.3 7.3L4 21l1.7-5.7A8 8 0 1 1 21 12z"/></svg>
              3 friends in your room
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block">
              <img src="public/studypuff-sheep-sm.png" alt="" className="bob w-[110px] h-auto drop-shadow-[0_12px_22px_rgba(0,0,0,.2)]"/>
            </div>
            <svg className="absolute -left-10 top-1/2 hidden lg:block" width="80" height="120" viewBox="0 0 80 120" fill="none" aria-hidden>
              <path d="M70 10 C 20 30, 20 60, 60 90" stroke="#c97f72" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M60 90 L 50 84 M 60 90 L 56 78" stroke="#c97f72" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            <p className="hand absolute -left-8 top-[34%] text-brand-rust text-[20px] rotate-[-8deg] hidden lg:block">
              that&rsquo;s puff,<br/>rooting for you
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Annot({n,label}){
  return (
    <div className="flex items-start gap-2">
      <span className="font-display text-[22px] text-brand-rust leading-none">{n}</span>
      <span className="text-[13px] text-ink-700 leading-tight">{label}</span>
    </div>
  );
}

function AppMock(){
  const R = 130;
  const C = 2 * Math.PI * R;
  const P = 0.42;
  const OFF = C * (1 - P);
  const ang = -90 + 360 * P;
  const dx = 150 + R * Math.cos(ang * Math.PI/180);
  const dy = 150 + R * Math.sin(ang * Math.PI/180);
  return (
    <div className="relative mx-auto max-w-md bg-cream-50 rounded-[28px] border border-ink-900/12 shadow-[0_30px_80px_-30px_rgba(0,0,0,.35)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-900/8">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e36b62]"></span>
        <span className="h-2.5 w-2.5 rounded-full bg-[#f0b73e]"></span>
        <span className="h-2.5 w-2.5 rounded-full bg-[#2bb259]"></span>
        <span className="ml-2 flex-1 text-[11px] text-ink-500 font-mono">studypuff.com/dashboard</span>
      </div>
      <div className="bg-gradient-to-b from-[#dfead2] via-[#cfe0c2] to-[#bbd3ad] p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5">
            <span className="rounded-full bg-ink-900 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-cream-50">Focus · 25m</span>
            <span className="rounded-full bg-cream-50/70 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-900">Short · 5m</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/90 px-2.5 py-1 text-[11px] font-semibold text-ink-900">
            <I.star className="text-amber-500"/> 420
          </span>
        </div>
        <div className="flex flex-col items-center my-2">
          <div className="relative h-[240px] w-[240px]">
            <svg viewBox="0 0 300 300" className="h-full w-full">
              <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(0,0,0,.12)" strokeWidth="6"/>
              <circle cx="150" cy="150" r={R} fill="none" stroke="#1f4d2c" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={C} strokeDashoffset={OFF} transform="rotate(-90 150 150)"/>
              <circle cx={dx} cy={dy} r="9" fill="#fff" stroke="#1f4d2c" strokeWidth="3"/>
            </svg>
            <div className="absolute inset-[18%] rounded-full bg-[#5b8a55] flex items-end justify-center overflow-hidden">
              <img src="public/sheep.png" alt="" className="w-[88%] object-contain mb-[-4%]"/>
            </div>
          </div>
          <p className="mt-3 font-display text-[44px] tabular-nums tracking-[.05em] text-ink-900">14:42</p>
          <p className="text-[12px] text-ink-700 mt-1">Working on <strong className="text-ink-900">Calculus chapter 3</strong></p>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <span className="rounded-full bg-cream-50 px-4 py-2 text-[11px] font-semibold text-ink-900 shadow">Change task</span>
          <span className="rounded-full bg-ink-900 px-5 py-2 text-[11px] font-mono uppercase tracking-widest text-cream-50">Pause</span>
          <span className="rounded-full bg-cream-50 px-4 py-2 text-[11px] font-semibold text-ink-900 shadow">Reset</span>
        </div>
      </div>
    </div>
  );
}
window.InsideApp = InsideApp;
