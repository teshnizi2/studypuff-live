// HERO — editorial almanac framing, but with the ORIGINAL site copy preserved.
function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 lg:pt-16 pb-10">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

        <div className="reveal flex items-end justify-between border-b border-ink-900/15 pb-4 mb-10">
          <p className="eyebrow text-ink-700">Cozy · science-based · student-led</p>
          <p className="eyebrow text-ink-700 hidden sm:block">A home for students</p>
          <p className="eyebrow text-ink-700 hidden md:block">Est. Leiden</p>
        </div>

        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          {/* main set headline (original copy) */}
          <div className="col-span-12 md:col-span-8">
            <h1 className="display hero-headline text-ink-900">
              <SplitHeadline>Small progress,</SplitHeadline><br/>
              <SplitHeadline><span className="marker-under italic">is still</span> progress.</SplitHeadline>
            </h1>

            <div className="mt-10 max-w-[52ch] text-[18px] leading-[1.55] text-ink-700">
              <p>
                StudyPuff is the home for students who want to improve their performance,
                without burning out. Join a workshop, drop into a free livestream, or use
                one of our free templates.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* Only entry point to /workshops from the home page —
                  per spec, the workshops listing isn't in the top nav. */}
              <a href="/workshops" className="btn-ink">Explore the StudyPuff Toolkit <I.arrow/></a>
              <a href="/study"     className="btn-ghost">Study with us for free</a>
            </div>

            {/* baseline strip — original numbers */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-ink-700">
              <div className="flex items-center gap-2.5">
                <span className="flex -space-x-2">
                  {["#f3c6c2","#fbe9a5","#c7e2c7","#c6dceb","#d9cdea"].map((c,i)=>(
                    <span key={i} className="inline-block h-7 w-7 rounded-full border-2 border-cream-50" style={{background:c}}/>
                  ))}
                </span>
                <span><strong className="text-ink-900"><CountUp to={17074} duration={1800} suffix="+"/></strong> students</span>
              </div>
              <span className="h-3.5 w-px bg-ink-900/20" aria-hidden></span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                  <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>
                </svg>
                <CountUp to={46} duration={1400} suffix="+"/>&nbsp;countries
              </span>
            </div>
          </div>

          {/* mascot — layered scrapbook composition: washi tape + main polaroid + sticky note + date stamp + behind-photo peek */}
          <div className="reveal delay-1 col-span-12 md:col-span-4 relative pt-6 pb-10">
            {/* graph-paper texture wash behind */}
            <div aria-hidden className="absolute inset-x-[-12px] top-2 bottom-2 -z-10 opacity-60"
                 style={{
                   backgroundImage:"linear-gradient(rgba(31,31,31,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,31,31,.06) 1px, transparent 1px)",
                   backgroundSize:"22px 22px",
                   maskImage:"radial-gradient(ellipse at center, #000 55%, transparent 80%)"
                 }}></div>

            {/* peeking polaroid behind (workshop / YT lifestyle photo) */}
            <div aria-hidden className="absolute -left-6 top-12 hidden sm:block bg-cream-50 p-2.5 pb-7 -rotate-[10deg] shadow-[0_18px_38px_-22px_rgba(0,0,0,0.3)] w-[58%]">
              <img src="/youtube-lifestyle.jpg" alt="" className="block w-full aspect-[4/5] object-cover"/>
            </div>

            {/* main polaroid */}
            <a href="/dashboard" className="group relative block focus-visible:outline-none" aria-label="Open the StudyPuff app">
              {/* washi tape across top */}
              <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 h-5 w-28 rotate-[-3deg]"
                    style={{background:"repeating-linear-gradient(90deg, rgba(243,198,194,.85) 0 8px, rgba(251,233,165,.85) 8px 16px)",
                            boxShadow:"0 2px 4px rgba(0,0,0,.08)"}}></span>

              <div className="relative bg-cream-50 p-3 pb-14 rotate-[3deg] group-hover:rotate-[1deg] group-hover:-translate-y-1 transition-transform shadow-[0_26px_60px_-22px_rgba(0,0,0,0.38)]">
                <div className="aspect-[4/5] relative bg-brand-mint/60 flex items-end justify-center overflow-hidden">
                  {/* warm light wash */}
                  <div className="absolute inset-0" style={{background:"radial-gradient(circle at 50% 65%, rgba(251,233,165,.6), transparent 62%)"}}></div>
                  {/* drawn frame */}
                  <svg aria-hidden className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)]" viewBox="0 0 100 125" preserveAspectRatio="none" fill="none">
                    <path d="M2 3 Q 50 1 98 3 Q 99 60 97 122 Q 50 124 3 122 Q 1 60 2 3 Z" stroke="#2f4d34" strokeOpacity=".4" strokeWidth=".5" strokeDasharray="1.5 1.5"/>
                  </svg>
                  <img src="/sheep.png" alt="StudyPuff sheep mascot — reading a book" className="relative bob mb-1 w-[88%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,.18)]"/>

                  {/* LIVE tag */}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-cream-50/95 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-900">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 pdot"></span> Live
                  </span>

                  {/* date stamp top-right */}
                  <div aria-hidden className="absolute top-3 right-3 rotate-[8deg] border-2 border-brand-rust/80 px-2 py-0.5 text-brand-rust">
                    <p className="font-mono text-[8px] uppercase tracking-[.18em] leading-tight">Co-study</p>
                    <p className="font-display text-[11px] leading-none mt-0.5">N° 03</p>
                  </div>

                  {/* corner star sticker */}
                  <span aria-hidden className="absolute bottom-2 right-2 rotate-[14deg]">
                    <svg viewBox="0 0 40 40" width="34" height="34">
                      <circle cx="20" cy="20" r="18" fill="#fbe9a5"/>
                      <text x="20" y="14" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="5" fill="#1f1f1f" letterSpacing=".5">FREE</text>
                      <text x="20" y="24" textAnchor="middle" fontFamily="Trirong" fontStyle="italic" fontSize="9" fill="#1f1f1f">forever</text>
                      <text x="20" y="32" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="4" fill="#1f1f1f" letterSpacing=".5">· · ·</text>
                    </svg>
                  </span>
                </div>
                <p className="hand absolute bottom-3 left-0 right-0 text-center text-[24px] text-ink-700">
                  open the app &nbsp;<span className="text-brand-rust">↝</span>
                </p>
              </div>

              {/* studying-now pill */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-cream-50 px-4 py-2 text-[12px] font-semibold text-ink-900 shadow-soft ring-1 ring-black/5 whitespace-nowrap">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 pdot"></span>
                <StudyingNowLabel/>
                <span aria-hidden>→</span>
              </div>
            </a>

            {/* sticky note with handwritten quote */}
            <div aria-hidden className="absolute -right-4 bottom-4 hidden md:block w-[140px] bg-brand-butter px-3 py-3 -rotate-[7deg] shadow-[0_14px_28px_-16px_rgba(0,0,0,.3)]">
              <span className="absolute -top-2 left-6 h-3 w-12 bg-cream-50/80 rotate-[-4deg]" aria-hidden></span>
              <p className="hand text-[18px] leading-tight text-ink-900">
                &ldquo;just one<br/>more chapter&rdquo;
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-widest text-ink-700">— puff, 3:14am</p>
            </div>

            {/* paperclip top-left */}
            <svg aria-hidden className="absolute top-0 left-4 w-7 h-10 rotate-[-12deg]" viewBox="0 0 28 40" fill="none">
              <path d="M9 4 L9 30 a 5 5 0 0 0 10 0 L19 8 a 3 3 0 0 0 -6 0 L13 28" stroke="#6b6b6b" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
