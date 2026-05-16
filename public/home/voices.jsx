// Student stories — corkboard / pinned scrapbook treatment.
// Mix of paper types (sticky notes, ruled index card, torn notebook strip),
// thumb tacks + washi tape, handwritten attribution slips, a hand-drawn arrow
// connecting the featured quote to its source.

function Voices() {
  const FEATURED = {
    quote: "It feels like discovering an underrated library full of like-minded people from around the world.",
    who: "Anonymous",
    where: "via Discord"
  };
  const QUOTES = [
    { quote: "StudyPuff helped me realize I'm not bad at studying. I just needed the right motivation.",
      who:"Maya · psychology",   tone:"bg-brand-pink",   rot:"-2.2deg",  paper:"sticky",  pin:"tape-pink" },
    { quote: "The live study sessions help me feel motivated, focused, and less overwhelmed.",
      who:"Jonas · law",         tone:"bg-brand-butter", rot:"2.6deg",   paper:"sticky",  pin:"tack-rust" },
    { quote: "Studying at home feels less lonely. It's comforting to know others are studying too.",
      who:"Priya · medicine",    tone:"bg-brand-sky",    rot:"-1.4deg",  paper:"index",   pin:"tack-forest" },
    { quote: "A place of growth and motivation.",
      who:"Léa · architecture",  tone:"bg-brand-lilac",  rot:"3.4deg",   paper:"sticky",  pin:"tape-yellow" },
    { quote: "It keeps me motivated, focused, and makes studying feel fun.",
      who:"Sam · econ",          tone:"bg-brand-peach",  rot:"-2.8deg",  paper:"torn",    pin:"tack-rust" },
    { quote: "The focus of studying alone, but with the connection of a community.",
      who:"Noor · biology",      tone:"bg-brand-pink",   rot:"2deg",     paper:"index",   pin:"tape-pink" },
    { quote: "A great community to study with, connect with, and share with.",
      who:"Yuki · linguistics",  tone:"bg-brand-butter", rot:"-1.6deg",  paper:"sticky",  pin:"tack-forest" }
  ];

  // pin/tape renderers
  const Pin = ({kind}) => {
    if(kind==="tape-pink") return <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-20 rotate-[-4deg] opacity-90" style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 8px, #fbe9a5 8px 16px)", boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>;
    if(kind==="tape-yellow") return <span aria-hidden className="absolute -top-3 right-6 h-5 w-16 rotate-[6deg] bg-brand-butter/85 shadow-sm"/>;
    if(kind==="tack-rust") return (
      <span aria-hidden className="absolute -top-2 left-5 h-4 w-4 rounded-full" style={{background:"radial-gradient(circle at 35% 30%, #f1a89c 0 22%, #c97f72 30% 65%, #7d3c33 70% 100%)", boxShadow:"0 2px 4px rgba(0,0,0,.25)"}}/>
    );
    if(kind==="tack-forest") return (
      <span aria-hidden className="absolute -top-2 right-5 h-4 w-4 rounded-full" style={{background:"radial-gradient(circle at 35% 30%, #a8c8a8 0 22%, #2f4d34 30% 65%, #16241a 70% 100%)", boxShadow:"0 2px 4px rgba(0,0,0,.25)"}}/>
    );
    return null;
  };

  const QM = (
    <svg viewBox="0 0 24 24" className="h-9 w-9 text-brand-rust/70 mb-3" fill="currentColor" aria-hidden>
      <path d="M9 7H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm10 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"/>
    </svg>
  );

  // ruled paper background (for index card variant)
  const ruledBg = {
    backgroundImage:"repeating-linear-gradient(to bottom, transparent 0 26px, rgba(31,31,31,.08) 26px 27px)",
    backgroundPosition:"left 18px"
  };

  return (
    <section className="spread relative overflow-hidden" style={{ padding: "22px 0px 96px" }}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

        {/* divider */}
        <div className="mb-12 flex items-center justify-center opacity-50">
          <svg width="220" height="14" viewBox="0 0 220 14" fill="none" aria-hidden>
            <path d="M2 8 Q 30 2 60 8 T 120 7 T 180 8 T 218 7" stroke="#c97f72" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-ink-700 mb-3 flex items-center gap-2">
              <span>Student stories</span>
              <span aria-hidden className="h-px w-10 bg-ink-900/30"/>
              <span className="hand text-[16px] text-brand-rust normal-case tracking-normal">pinned to the wall</span>
            </p>
            <h2 className="display text-[clamp(2rem,4vw,3.6rem)] text-ink-900">
              What students <em>tell us</em>.
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-ink-700">
            Featured from messages we receive each month. Share your own on{" "}
            <a className="underline underline-offset-4" href="https://www.instagram.com/studypuffacademy" target="_blank" rel="noreferrer">Instagram</a>,{" "}
            <a className="underline underline-offset-4" href="https://www.youtube.com/@StudyPuffAcademy" target="_blank" rel="noreferrer">YouTube</a>{" "}or{" "}
            <a className="underline underline-offset-4" href="https://www.twitch.tv/studypuffacademy" target="_blank" rel="noreferrer">Twitch</a>.
          </p>
        </div>

        {/* corkboard surface */}
        <div className="relative rounded-[6px] p-6 md:p-10"
             style={{
               background:"linear-gradient(180deg, #d8c39a 0%, #c9ad7e 100%)",
               boxShadow:"inset 0 0 0 6px #b9956a, inset 0 0 80px rgba(0,0,0,.12), 0 30px 60px -30px rgba(0,0,0,.35)"
             }}>
          {/* cork grain */}
          <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[.35] mix-blend-multiply"
               style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.25 0 0 0 0 0.1 0 0 0 0.45 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E\")"}}/>
          {/* corner pin sticking nothing — just decor */}
          <span aria-hidden className="absolute top-3 left-3 h-3 w-3 rounded-full" style={{background:"radial-gradient(circle at 35% 30%, #f1a89c 0 22%, #c97f72 30% 65%, #7d3c33 70% 100%)", boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
          <span aria-hidden className="absolute top-3 right-3 h-3 w-3 rounded-full" style={{background:"radial-gradient(circle at 35% 30%, #a8c8a8 0 22%, #2f4d34 30% 65%, #16241a 70% 100%)", boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>

          <div className="relative grid grid-cols-12 gap-5">
            {/* FEATURED — polaroid-ish big quote card */}
            <figure className="col-span-12 md:col-span-7 relative" style={{ transform: "rotate(-1.2deg)" }}>
              <span aria-hidden className="absolute -top-3 left-12 h-6 w-28 rotate-[-5deg] z-10" style={{background:"repeating-linear-gradient(135deg, #c7e2c7 0 9px, #fbe9a5 9px 18px)", boxShadow:"0 2px 6px rgba(0,0,0,.12)"}}/>
              <div className="bg-brand-mint p-8 pb-10 shadow-[0_22px_50px_-22px_rgba(0,0,0,0.45)] border border-ink-900/10">
                {QM}
                <blockquote className="display text-[clamp(1.5rem,2.4vw,2.2rem)] text-ink-900 leading-snug">
                  &ldquo;{FEATURED.quote}&rdquo;
                </blockquote>
                {/* signature line */}
                <svg className="mt-6 mb-3" width="120" height="10" viewBox="0 0 120 10" fill="none" aria-hidden>
                  <path d="M2 6 Q 20 1 40 5 T 80 5 T 118 5" stroke="#c97f72" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <figcaption className="flex items-center gap-3">
                  <span aria-hidden className="h-9 w-9 rounded-full bg-brand-rust/85 text-cream-50 inline-flex items-center justify-center font-display text-[14px]">A</span>
                  <div>
                    <p className="font-display text-[16px] text-ink-900 leading-tight">{FEATURED.who}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700">{FEATURED.where}</p>
                  </div>
                </figcaption>
              </div>
              {/* hand-drawn arrow + note */}
              <div className="absolute -right-4 md:-right-10 bottom-6 hidden md:block" style={{transform:"rotate(8deg)"}}>
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" aria-hidden>
                  <path d="M4 38 C 30 10, 70 4, 108 18" stroke="#c97f72" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                  <path d="M108 18 L 100 12 M 108 18 L 104 26" stroke="#c97f72" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                </svg>
                <p className="hand text-[18px] text-brand-rust leading-none -mt-1 ml-3">our favourite,<br/>this month.</p>
              </div>
            </figure>

            {/* small quotes column 1 */}
            <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">
              {QUOTES.slice(0,4).map((q,i)=>(
                <figure key={i}
                        className={`${q.tone} relative p-5 pb-4 border border-ink-900/10 shadow-[0_14px_28px_-18px_rgba(0,0,0,0.5)]`}
                        style={{transform:`rotate(${q.rot})`, ...(q.paper==="index"?ruledBg:{})}}>
                  <Pin kind={q.pin}/>
                  {q.paper==="index" && <span aria-hidden className="absolute left-3 top-0 bottom-0 w-px bg-brand-rust/40"/>}
                  <blockquote className="font-display text-[14.5px] leading-snug text-ink-900 relative">&ldquo;{q.quote}&rdquo;</blockquote>
                  <figcaption className="mt-3 font-mono text-[9.5px] uppercase tracking-widest text-ink-700 border-t border-ink-900/15 pt-2 flex items-center justify-between">
                    <span>— {q.who.split(" · ")[0]}</span>
                    <span className="hand text-[12px] normal-case tracking-normal text-brand-rust">{q.who.split(" · ")[1]}</span>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* bottom row */}
            {QUOTES.slice(4).map((q,i)=>(
              <figure key={i}
                      className={`col-span-12 md:col-span-4 ${q.tone} relative p-5 pb-4 border border-ink-900/10 shadow-[0_14px_28px_-18px_rgba(0,0,0,0.5)]
                      ${q.paper==="torn" ? "[clip-path:polygon(0%_0%,98%_2%,100%_98%,96%_100%,52%_98%,48%_100%,4%_98%,2%_94%,0%_70%,3%_42%,0%_18%)]" : ""}`}
                      style={{transform:`rotate(${q.rot})`, ...(q.paper==="index"?ruledBg:{})}}>
                <Pin kind={q.pin}/>
                {q.paper==="index" && <span aria-hidden className="absolute left-3 top-0 bottom-0 w-px bg-brand-rust/40"/>}
                <blockquote className="font-display text-[14.5px] leading-snug text-ink-900 relative">&ldquo;{q.quote}&rdquo;</blockquote>
                <figcaption className="mt-3 font-mono text-[9.5px] uppercase tracking-widest text-ink-700 border-t border-ink-900/15 pt-2 flex items-center justify-between">
                  <span>— {q.who.split(" · ")[0]}</span>
                  <span className="hand text-[12px] normal-case tracking-normal text-brand-rust">{q.who.split(" · ")[1]}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* footer slip on cork */}
          <div className="relative mt-6 flex items-center justify-between flex-wrap gap-3">
            <p className="hand text-[18px] text-cream-50 drop-shadow-sm">
              + 4,800 more notes in our inbox.
            </p>
            <a href="https://discord.gg/studypuff" target="_blank" rel="noreferrer"
               className="font-mono text-[11px] uppercase tracking-widest text-cream-50 underline underline-offset-4 decoration-cream-50/70 hover:text-brand-butter">
              Join the Discord →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Voices = Voices;
