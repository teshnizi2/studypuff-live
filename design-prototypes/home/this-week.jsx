// Co-study section — editorial spread with TWO platform polaroids (YouTube + Twitch)
// and a printed-agenda treatment for the schedule.

function ThisWeek() {
  const BULLETS = [
  "50/10 Pomodoros",
  "All ages welcome",
  "Chatting during breaks",
  "Cozy community",
  "Regular cozy game streams",
  "Free, forever"];

  // expanded weekly schedule (8 sessions)
  const SCHEDULE = [
  { day: "Mon", date: "12", title: "Co-study · Deep Work", time: "19:00 CET", end: "22:00", kind: "Live", platform: "yt", host: "w/ Hera", tone: "bg-brand-mint", live: true, rsvp: 128, dur: "3h" },
  { day: "Tue", date: "13", title: "Quiet Hours · Reading Room", time: "08:00 CET", end: "10:00", kind: "Live", platform: "yt", host: "w/ Reza", tone: "bg-brand-sky", live: false, rsvp: 64, dur: "2h", note: "☕ slow start" },
  { day: "Wed", date: "14", title: "Workshop · Spaced Repetition", time: "18:30 CET", end: "20:00", kind: "Workshop", platform: "yt", host: "w/ Reza", tone: "bg-brand-butter", live: false, rsvp: 212, dur: "90m" },
  { day: "Thu", date: "15", title: "Co-study · Rainy Library", time: "20:00 CET", end: "23:00", kind: "Live", platform: "tw", host: "w/ Elaine", tone: "bg-brand-lilac", live: true, rsvp: 96, dur: "3h", note: "🌧 ambient rain" },
  { day: "Fri", date: "16", title: "Deadline Sprint · Submit Night", time: "21:00 CET", end: "01:00", kind: "Live", platform: "yt", host: "w/ Hera", tone: "bg-brand-pink", live: false, rsvp: 174, dur: "4h", note: "🚀 last-mile" },
  { day: "Sat", date: "17", title: "Cozy Game Night · Stardew", time: "21:00 CET", end: "23:30", kind: "Stream", platform: "tw", host: "w/ Elaine", tone: "bg-brand-pink", live: false, rsvp: 88, dur: "2.5h" },
  { day: "Sun", date: "18", title: "Week Reset · Planning Room", time: "16:00 CET", end: "18:00", kind: "Live", platform: "yt", host: "w/ Hera", tone: "bg-brand-mint", live: false, rsvp: 142, dur: "2h", note: "📓 planning" },
  { day: "Sun", date: "18", title: "Late Night Library · LoFi", time: "23:00 CET", end: "02:00", kind: "Live", platform: "tw", host: "w/ guest", tone: "bg-brand-lilac", live: false, rsvp: 54, dur: "3h", note: "🌙 night owls" }];


  const PlatformDot = ({ p }) =>
  p === "tw" ?
  <span title="Twitch" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#9146ff] text-white text-[10px]"><I.twitch /></span> :
  <span title="YouTube" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px]"><I.yt /></span>;

  return (
    <section id="this-week" className="spread relative" style={{ padding: "96px 0px 28px" }}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12" style={{ padding: "0px 48px 1px" }}>

        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-start">

          {/* ─── LEFT: copy + CTAs ────────────────────────────────── */}
          <div className="reveal col-span-12 lg:col-span-6 relative">
            <a href="/study" className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50 px-3.5 py-1.5 text-xs font-semibold text-ink-900 shadow-soft transition hover:-translate-y-0.5">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-60"></span>
                <span className="relative inline-block h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              Live this week · 8 streams →
            </a>

            <h2 className="display text-[clamp(2rem,3.5vw,3rem)] text-ink-900">
              Co-study sessions with focus timer<br className="hidden sm:block" /> and accountability.
            </h2>
            <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-ink-700">
              Free livestreams on <span className="font-semibold text-red-600">YouTube</span> and{" "}
              <span className="font-semibold text-[#9146ff]">Twitch</span>. Drop in, set your intention,
              and get your things done alongside students from all around the world.
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[14px]">
              {BULLETS.map((b) =>
              <li key={b} className="flex items-center gap-2.5 text-ink-900">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-ink-900/70" />
                  <span>{b}</span>
                </li>
              )}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/study" className="btn-ink">See this week&rsquo;s schedule <I.arrow /></a>
              <a href="https://www.youtube.com/@StudyPuffAcademy" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50 px-4 py-2.5 text-[14px] font-semibold text-ink-900 transition hover:-translate-y-0.5 hover:border-red-500/40 hover:text-red-600">
                <I.yt /> YouTube
              </a>
              <a href="https://www.twitch.tv/studypuff" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50 px-4 py-2.5 text-[14px] font-semibold text-ink-900 transition hover:-translate-y-0.5 hover:border-[#9146ff]/40 hover:text-[#9146ff]">
                <I.twitch /> Twitch
              </a>
            </div>

            {/* tiny stats strip */}
            <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-ink-900/15 pt-5">
              <div>
                <p className="font-display text-[28px] leading-none text-ink-900">2,400+</p>
                <p className="eyebrow text-ink-700 mt-1">hours streamed</p>
              </div>
              <div>
                <p className="font-display text-[28px] leading-none text-ink-900">180+</p>
                <p className="eyebrow text-ink-700 mt-1">co-study sessions</p>
              </div>
              <div>
                <p className="font-display text-[28px] leading-none text-ink-900"><StudyingNowCount /></p>
                <p className="eyebrow text-ink-700 mt-1">studying right now</p>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: scrapbook of two polaroids ─────────────────── */}
          <div className="reveal delay-2 col-span-12 lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[560px]">

              {/* faint perforated paper backdrop */}
              <div aria-hidden className="absolute -inset-6 -z-10 rounded-[10px]"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 24px, rgba(31,31,31,0.04) 24px 25px)" }} />

              {/* TWITCH polaroid — peeking behind */}
              <div className="absolute -left-6 top-32 w-[58%] rotate-[5deg] bg-cream-50 p-2.5 pb-3 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)] z-[1]">
                <div className="aspect-[4/3] relative overflow-hidden bg-brand-lilac/40">
                  <img src="public/twitch-lifestyle.jpg" alt="Twitch co-study" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-[#9146ff] px-2 py-0.5 text-white text-[9px] font-mono uppercase tracking-widest">
                    <I.twitch /> Live on Twitch
                  </span>
                </div>
                <p className="hand mt-1 text-center text-[14px] text-ink-700">sat · cozy game night</p>
              </div>

              {/* YOUTUBE polaroid — main */}
              <div className="relative -rotate-[2deg] bg-cream-50 p-3 pb-5 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.32)] z-[2]">
                {/* washi tape on top */}
                <span aria-hidden className="absolute -top-3 left-8 h-6 w-24 -rotate-[8deg] opacity-90"
                style={{ background: "repeating-linear-gradient(135deg, #f3c6c2 0 8px, #fbe9a5 8px 16px)", boxShadow: "0 2px 6px rgba(0,0,0,.08)" }} />
                {/* paperclip top-right */}
                <svg aria-hidden className="absolute -top-4 right-6 z-10" width="22" height="44" viewBox="0 0 22 44" fill="none">
                  <path d="M11 4 C 16 4, 18 8, 18 14 L 18 30 C 18 36, 14 38, 11 38 C 8 38, 5 36, 5 30 L 5 14 C 5 10, 7 7, 11 7 C 14 7, 15 9, 15 12 L 15 28" stroke="#a8a59f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>

                <div className="aspect-[4/3] relative overflow-hidden bg-brand-mint/40">
                  <img src="public/youtube-lifestyle.jpg" alt="YouTube co-study livestream" className="absolute inset-0 h-full w-full object-cover" />
                  {/* film-grain top vignette */}
                  <span aria-hidden className="absolute inset-x-0 top-0 h-20 pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.45), transparent)" }} />
                  {/* LIVE badge */}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-ink-900/90 px-3 py-1 text-cream-50 text-[10px] font-mono uppercase tracking-widest backdrop-blur">
                    <span className="relative inline-flex h-1.5 w-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-60"></span>
                      <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    </span>
                    <I.yt className="text-red-400" /> Live · <StudyingNowCount /> watching
                  </span>
                  {/* timer chip top-right */}
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-cream-50/90 px-2.5 py-1 text-ink-900 text-[10px] font-mono uppercase tracking-widest border border-ink-900/15">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-rust animate-pulse"></span>
                    37:12 · focus
                  </span>
                  {/* viewer avatars bottom-left */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {["#f3c6c2", "#fbe9a5", "#c7e2c7", "#cfd8e9"].map((c, i) =>
                      <span key={i} className="inline-block h-5 w-5 rounded-full border border-cream-50" style={{ background: c }} />
                      )}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-cream-50">+ <StudyingNowCount /> others</span>
                  </div>
                  {/* corner stamp */}
                  <span className="absolute bottom-3 right-3 rotate-[6deg] rounded-sm border border-brand-rust/70 bg-cream-50/85 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-brand-rust">
                    N° 03 · co-study
                  </span>
                </div>
                <div className="mt-3 px-1 flex items-center justify-between">
                  <p className="hand text-[18px] text-ink-700">tonight, 19:00 CET</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">YT · 50/10 pomodoro</p>
                </div>
                {/* progress bar */}
                <div className="mt-2 mx-1">
                  <div className="h-1 bg-ink-900/10 relative overflow-hidden">
                    <span className="absolute inset-y-0 left-0 bg-brand-rust" style={{ width: "62%" }} />
                  </div>
                  <div className="flex justify-between mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-500">
                    <span>session 2 / 4</span>
                    <span>62% through</span>
                  </div>
                </div>
              </div>

              {/* sticky note bottom-right */}
              <div className="absolute -right-4 -bottom-2 w-[180px] -rotate-[6deg] bg-brand-butter p-3 shadow-[0_10px_20px_-8px_rgba(0,0,0,.25)] z-[3]"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 88% 100%, 0 100%)" }}>
                <p className="hand text-[14px] leading-snug text-ink-900">
                  drop in late,<br />leave early —<br />no problem ✿
                </p>
              </div>

              {/* tiny chat bubble — top-left of stack */}
              <div className="absolute -top-3 -left-3 z-[4] bg-cream-50 border border-ink-900/15 px-2.5 py-1 rotate-[-6deg] shadow-[0_8px_18px_-10px_rgba(0,0,0,.3)]"
              style={{ borderRadius: "14px 14px 14px 4px" }}>
                <p className="font-mono text-[10px] text-ink-900">@hera_im: hi friends ✿</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SUMMARY: TONIGHT + NEXT UP (compact) ────────────────────── */}
        <div className="mt-20 relative">
          {/* short masthead */}
          <div className="border-t-2 border-b border-ink-900/80 py-3 mb-6 flex items-end justify-between flex-wrap gap-3">
            <div className="flex items-baseline gap-3">
              <p className="eyebrow text-brand-rust">On the air this week</p>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-700">Nov 12 — 18 · CET</span>
            </div>
            <a href="study.html#schedule" className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-ink-900 underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
              See the full week ({SCHEDULE.length} streams) →
            </a>
          </div>

          {(() => {
            const tonight = SCHEDULE[0];
            const upcoming = SCHEDULE.slice(1, 4);
            return (
              <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* TONIGHT — featured card */}
                <a href="study.html#schedule"
                className={`col-span-12 md:col-span-6 group relative ${tonight.tone} p-7 md:p-8 shadow-[0_22px_50px_-26px_rgba(0,0,0,0.32)] -rotate-[0.4deg] hover:-translate-y-0.5 transition border border-ink-900/12 flex flex-col`}>
                  {/* washi tape */}
                  <span aria-hidden className="absolute -top-3 right-10 h-5 w-24 rotate-[6deg] opacity-90"
                  style={{ background: "repeating-linear-gradient(135deg, #f3c6c2 0 8px, #fbe9a5 8px 16px)", boxShadow: "0 2px 6px rgba(0,0,0,.08)" }} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow text-brand-rust">Tonight</p>
                      <p className="hand text-[18px] text-ink-700 mt-0.5">{tonight.day} · {tonight.date} Nov</p>
                    </div>
                    {tonight.live ?
                    <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3 py-1 text-cream-50 text-[10px] font-mono uppercase tracking-widest">
                        <span className="relative inline-flex h-1.5 w-1.5">
                          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-60"></span>
                          <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        </span>
                        Live · <StudyingNowCount /> in
                      </span> :

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/90 border border-ink-900/15 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-ink-900">starts {tonight.time}</span>
                    }
                  </div>

                  <p className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.05] text-ink-900 mt-5">
                    {tonight.title}
                  </p>
                  <p className="text-[13px] text-ink-700 mt-2 flex items-center gap-2 flex-wrap">
                    <PlatformDot p={tonight.platform} />
                    <span>{tonight.host}</span>
                    <span aria-hidden>·</span>
                    <span className="font-mono">{tonight.time} → {tonight.end} CET · {tonight.dur}</span>
                  </p>

                  {/* mini chapter dots */}
                  <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-700">
                    <span>{tonight.dur} ·</span>
                    {Array.from({ length: 4 }).map((_, i) =>
                    <span key={i} className={`h-1.5 flex-1 ${i === 0 ? 'bg-brand-rust' : 'bg-ink-900/20'}`} />
                    )}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700 mt-2">round 1 of 4 · 50 min focus + 10 min break</p>

                  <div className="mt-auto pt-6 flex items-center justify-between flex-wrap gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-700">{tonight.rsvp} rsvp · no signup needed</span>
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-display italic text-ink-900 group-hover:text-brand-rust transition">
                      Pull up a chair <span aria-hidden>→</span>
                    </span>
                  </div>
                </a>

                {/* NEXT UP — small list */}
                <div className="col-span-12 md:col-span-6 flex flex-col">
                  <div className="flex items-end justify-between mb-3">
                    <p className="eyebrow text-ink-700">Next up</p>
                    <p className="hand text-[15px] text-brand-rust">— 3 of {SCHEDULE.length - 1} more</p>
                  </div>

                  <div className="flex-1 bg-cream-50 border border-ink-900/12 divide-y divide-ink-900/10">
                    {upcoming.map((s, i) =>
                    <a href="study.html#schedule" key={i} className="group grid grid-cols-12 items-center gap-3 py-4 px-4 hover:bg-cream-100/70 transition relative">
                        <span aria-hidden className={`${s.tone} absolute left-0 top-3 bottom-3 w-1`} />
                        <div className="col-span-3 flex items-baseline gap-2 pl-2">
                          <p className="eyebrow text-ink-700">{s.day}</p>
                          <p className="font-display text-[28px] leading-none text-ink-900">{s.date}</p>
                        </div>
                        <div className="col-span-7">
                          <p className="font-display text-[16px] leading-tight text-ink-900 group-hover:underline underline-offset-4 decoration-brand-rust">{s.title}</p>
                          <p className="font-mono text-[11px] text-ink-700 mt-0.5 flex items-center gap-1.5">
                            <PlatformDot p={s.platform} />
                            <span>{s.time}</span>
                            <span aria-hidden>·</span>
                            <span>{s.dur}</span>
                          </p>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1.5">
                          <span className={`${s.tone} text-ink-900 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-sm`}>{s.kind}</span>
                          <span aria-hidden className="text-ink-700 transition group-hover:translate-x-0.5 text-[14px]">→</span>
                        </div>
                      </a>
                    )}
                  </div>

                  {/* footer rail */}
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-ink-700 flex-wrap gap-2">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-red-500" />YouTube</span>
                      <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#9146ff]" />Twitch</span>
                    </span>
                    <a href="study.html#schedule" className="underline underline-offset-4 decoration-brand-rust hover:text-brand-rust">
                      Full schedule →
                    </a>
                  </div>
                </div>
              </div>);

          })()}
        </div>

        {/* hand-drawn divider */}
        <div className="mt-20 flex items-center justify-center" style={{ margin: "-3px 0px 0px" }}>
          <svg width="120" height="14" viewBox="0 0 120 14" fill="none" aria-hidden style={{ strokeWidth: "0px", opacity: "0" }}>
            <path d="M2 7 Q 20 2 40 8 T 80 6 T 118 8" stroke="#c97f72" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>);

}
window.ThisWeek = ThisWeek;