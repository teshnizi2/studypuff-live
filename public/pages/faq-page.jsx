function FAQPage(){
  const SECTIONS = [
    {
      id:"workshops",
      kicker:"Workshops",
      title:"Workshops & cohorts",
      intro:"Paid, in-person and online. Scholarship seats every cohort.",
      tone:"bg-brand-pink",
      faqs:[
        { q:"Who are the workshops for?",
          a:"The current workshops are specifically designed for university and college students. However, this does not mean that you cannot join if you're not a university or college student. Anyone who wants to learn more about the specific workshop topic is able to join." },
        { q:"Can I join the workshops from outside of the Netherlands?",
          a:"We are currently focused on hosting in-person workshops, but we will soon launch our online workshops. Make sure to sign up to our newsletter to be the first to know when this happens. For now you can always join the livestreams on YouTube or Twitch." },
        { q:"What makes the workshops science-based?",
          a:"Every workshop is grounded in scientific research on attention, sleep, spaced repetition, motivation, and other related topics. With that we also use our own experience as students and student representatives, to ensure it's all related to actual student life." },
        { q:"Is it really online and in-person?",
          a:"Yes. Sessions are taught from our Leiden studio with a live online seat. Same Q&A, same workbook, same Discord." },
        { q:"What if I miss a session?",
          a:"Every session is recorded and uploaded within 24h. You keep the recordings — they don't expire." },
        { q:"Can I switch tiers mid-cohort?",
          a:"Yes — once. We'll credit what you've paid against the new tier. Just email info@studypuff.com." },
        { q:"Do you offer refunds?",
          a:"Full refund up to 7 days before the cohort starts. After that, we offer transfers to the next cohort." },
        { q:"What if I can't afford a paid workshop?",
          a:"Every workshop has scholarship seats. For this you can fill out the following form.",
          formUrl:"https://forms.gle/12W2jhcPdtPEbt4X8" },
        { q:"How do scholarship seats work?",
          a:"Two seats per cohort, fully free. No application essay — just a short form. We don't ask for proof of need." },
        { q:"Are recordings shared publicly?",
          a:"No. Recordings are private to the cohort. You can download them and keep them for personal use — please don't redistribute." },
        { q:"What languages are workshops in?",
          a:"All workshops are taught in English. We use plain language, and slides are kept readable for non-native speakers." }
      ]
    },
    {
      id:"livestreams",
      kicker:"Study with us",
      title:"Livestreams & co-study",
      intro:"Free, daily, on YouTube and Twitch. Just open the link.",
      tone:"bg-brand-mint",
      faqs:[
        { q:"Do I need to sign up?",
          a:"Nope. Just open the YouTube or Twitch link a few minutes before the session and join the chat." },
        { q:"Are the livestreams really free?",
          a:"Yes they are. Upon joining the livestream you will see an ad and sometimes there will be ads during the breaks, but you do not have to pay anything to join. In case you want to support, you can become a member to get access to cute emojis." },
        { q:"Do I need to be a student?",
          a:"All ages welcome. Most people are students, but plenty of folks join for thesis work, language study, certifications, or just to do their taxes alongside someone." },
        { q:"Camera and mic?",
          a:"Never required. The room runs on chat. Most people work from their own desk, lurk quietly, and chat during breaks." },
        { q:"What time zone?",
          a:"Times are in CET (Central European Time, UTC+1). The schedule auto-converts on Google Calendar — link's on the Study page." },
        { q:"Can I host a session?",
          a:"Eventually, yes. We rotate guest hosts every few months. Email info@studypuff.com with what you'd want to host and we'll be in touch." },
        { q:"What's the Pomodoro structure?",
          a:"Usually 50 minutes of focus, 10 minutes of break — repeated for 2 to 4 hours. Some sessions use 25/5. The host says at the top." },
        { q:"Is there a Discord?",
          a:"Yes. The Discord link is in every stream description. It's a quiet place to ask study questions and chat between sessions." }
      ]
    },
    {
      id:"app",
      kicker:"The app",
      title:"The StudyPuff app",
      intro:"Free forever. Timer, streaks, friend rooms. No ads.",
      tone:"bg-brand-sky",
      faqs:[
        { q:"Is the app really free?",
          a:"Yes — forever, no ads. We support development through workshops and the upcoming store, not by selling your attention." },
        { q:"What platforms is it on?",
          a:"It's a web app, so it works in any modern browser — desktop or mobile. Native iOS and Android apps are on the roadmap." },
        { q:"Do I need an account?",
          a:"You can use the timer without one. Streaks, friend rooms, and history sync need a free account (just an email)." },
        { q:"How do friend rooms work?",
          a:"Invite up to 8 friends with a room link. You'll see when each person is focusing — no cams, no audio, just a quiet shared timer." },
        { q:"What about privacy?",
          a:"We store your email, timer history, and friend list — nothing else. No third-party trackers, no analytics fingerprinting. Read more on /privacy." }
      ]
    },
    {
      id:"resources",
      kicker:"Free resources",
      title:"Templates & printables",
      intro:"PDFs in your inbox in 2 minutes, every PDF free.",
      tone:"bg-brand-butter",
      faqs:[
        { q:"How do I get the templates?",
          a:"Open any resource on the Resources page and click \"Request\" — fill out the short form and the PDF arrives by email within 2 minutes.",
          formUrl:"https://forms.gle/xKZnXvzZUKL843D5A" },
        { q:"Can I print them?",
          a:"Yes — every template is A4, designed to print clearly on a black-and-white home printer." },
        { q:"Can I share them?",
          a:"With friends, yes — please link to studypuff.com/resources rather than re-uploading. For classroom use, drop us an email and we'll send a teacher pack." },
        { q:"Are they research-based?",
          a:"Yes. Every method (Cornell notes, spaced repetition, Pomodoro, urgent-important matrix) is sourced from cognitive-science literature. Citations are on each PDF's footer." }
      ]
    },
    {
      id:"general",
      kicker:"Everything else",
      title:"General questions",
      intro:"The rest. Sponsorship, press, podcasts, weird emails.",
      tone:"bg-brand-lilac",
      faqs:[
        { q:"How do I contact you?",
          a:"Easiest: open the contact form on /contact, or email info@studypuff.com. We reply within three workdays — usually faster, from an actual human." },
        { q:"Do you take sponsors?",
          a:"Only from organizations we'd genuinely recommend to a student we love. Most weeks the answer is no. If you'd like to discuss it, write to info@studypuff.com with what you have in mind." },
        { q:"Press / podcast / interview?",
          a:"Yes — we'd love to. Email info@studypuff.com with your outlet and a rough idea, and Elaine will reply." },
        { q:"Are you hiring?",
          a:"Not right now. We do work with guest hosts and scholarship students though — see the Workshops page." },
        { q:"Where are you based?",
          a:"Leiden, the Netherlands. The studio is small and quiet, the way we like it." }
      ]
    }
  ];

  const [query,setQuery] = React.useState("");
  const filter = (f) => {
    if(!query.trim()) return true;
    const q = query.toLowerCase();
    return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
  };

  const totalQs = SECTIONS.reduce((n,s)=>n+s.faqs.length,0);
  const filteredCount = SECTIONS.reduce((n,s)=>n+s.faqs.filter(filter).length,0);

  return (
    <div className="paper-grain relative">
      <Header/>

      {/* hero */}
      <section className="spread relative pb-6">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid grid-cols-12 gap-x-8 gap-y-10 items-end">
          <div className="col-span-12 lg:col-span-8 relative">
            <span aria-hidden className="absolute -top-4 left-0 h-5 w-28 -rotate-[4deg] opacity-80"
                  style={{background:"repeating-linear-gradient(135deg, #c7e2c7 0 7px, #fbe9a5 7px 14px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
            <p className="eyebrow text-ink-700 mb-4 flex items-center gap-3 flex-wrap">
              <span>FAQ · index N° 04</span>
              <span className="hand text-[16px] text-brand-rust normal-case tracking-normal">— if a question isn't here, just ask.</span>
            </p>
            <h1 className="display text-[clamp(2.4rem,6vw,5.4rem)] text-ink-900 leading-[1.04]">
              Everything you might<br/>
              <span className="relative inline-block">
                <em>wonder</em>
                <svg aria-hidden viewBox="0 0 180 32" className="absolute left-0 right-0 -bottom-2 w-full h-4" preserveAspectRatio="none">
                  <path d="M4 18 C 20 4, 50 30, 80 14 C 110 -2, 140 26, 170 14 C 178 11, 176 22, 168 22 C 162 22, 162 16, 168 16" stroke="#c97f72" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>, on one page.
            </h1>
            <p className="mt-7 max-w-[58ch] text-[17px] leading-relaxed text-ink-700">
              We've grouped {totalQs} questions by what you came for. Search, browse, or jump to a section — and if your question's not here, <a className="underline underline-offset-4 decoration-brand-rust" href="/contact">just write us</a>.
            </p>

            {/* search */}
            <div className="mt-7 max-w-[560px] flex items-center gap-3 border-b-2 border-ink-900/30 pb-2 focus-within:border-ink-900 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f1f1f" strokeWidth="1.6" aria-hidden>
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
              </svg>
              <input value={query} onChange={e=>setQuery(e.target.value)}
                     placeholder="Search the questions…"
                     className="flex-1 bg-transparent text-[16px] font-display text-ink-900 placeholder:text-ink-500 focus:outline-none py-1"/>
              {query && <button onClick={()=>setQuery("")} className="text-[11px] font-mono uppercase tracking-widest text-ink-700 hover:text-ink-900">clear</button>}
            </div>
            {query && (
              <p className="hand text-[15px] text-brand-rust mt-3">
                — showing {filteredCount} of {totalQs} questions matching "{query}"
              </p>
            )}

            {/* popular */}
            {!query && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-700 mr-1">Popular:</p>
                {["refunds","scholarship","time zone","privacy","camera and mic"].map(t=>(
                  <button key={t} onClick={()=>setQuery(t)}
                          className="inline-flex items-center rounded-full border border-ink-900/20 bg-cream-50/70 hover:bg-cream-50 hover:border-ink-900/50 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-ink-900 transition">
                    {t} →
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* index card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-cream-50 border border-ink-900/15 p-6 rotate-[1.2deg] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)] relative">
              <span aria-hidden className="absolute -top-3 left-6 h-5 w-16 -rotate-[6deg] bg-brand-pink/80 shadow-sm"/>
              <p className="font-mono text-[10px] uppercase tracking-widest text-brand-rust">Table of contents</p>
              <p className="font-display text-[20px] text-ink-900 mt-1 leading-tight">{totalQs} questions, in 5 chapters</p>
              <ul className="mt-4 space-y-3 border-t border-dashed border-ink-900/25 pt-3">
                {SECTIONS.map((s,i)=>(
                  <li key={s.id} className="flex items-baseline gap-3">
                    <span className="font-display text-[22px] text-ink-900/30 leading-none w-10">0{i+1}</span>
                    <a href={`#${s.id}`} className="flex-1 font-display text-[17px] text-ink-900 hover:text-brand-rust transition leading-tight">
                      {s.title}
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-700 mt-0.5">{s.faqs.length} questions</span>
                    </a>
                    <span aria-hidden className={`inline-block h-3 w-3 rounded-full ${s.tone} border border-ink-900/20 shrink-0`}/>
                  </li>
                ))}
              </ul>
              <p className="hand text-[16px] text-brand-rust mt-5 leading-snug border-t border-dashed border-ink-900/25 pt-3">
                still stuck? → <a href="/contact" className="underline underline-offset-4">write us</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* sections */}
      {SECTIONS.map((s,si)=>{
        const items = s.faqs.filter(filter);
        if(query && items.length===0) return null;
        return (
          <section id={s.id} key={s.id} className="spread relative !pt-8">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
              <div className="grid grid-cols-12 gap-x-8 gap-y-6 border-t-2 border-ink-900 pt-8">
                <div className="col-span-12 md:col-span-4 lg:col-span-3">
                  <div className="md:sticky md:top-24">
                    <div className="flex items-center gap-2 mb-2">
                      <span aria-hidden className={`inline-block h-4 w-4 rounded-full ${s.tone} border border-ink-900/20`}/>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-brand-rust">Chapter 0{si+1} · {s.kicker}</p>
                    </div>
                    <h2 className="display text-[clamp(1.8rem,3vw,2.8rem)] text-ink-900 leading-[1.05]">{s.title}</h2>
                    <p className="hand text-[18px] text-ink-700 mt-3 max-w-[24ch] leading-snug">{s.intro}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500 mt-4">
                      {items.length} of {s.faqs.length} {query?"matching":"questions"}
                    </p>
                  </div>
                </div>
                <ul className="col-span-12 md:col-span-8 lg:col-span-9 border-t border-ink-900/15">
                  {items.map((f,i)=>(
                    <li key={i}>
                      <details className="group border-b border-ink-900/15">
                        <summary className="flex items-start gap-4 py-5 cursor-pointer list-none hover:bg-cream-50/40 transition px-2 -mx-2">
                          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-500 pt-1.5 w-10 shrink-0">Q.{String(i+1).padStart(2,"0")}</span>
                          <span className="font-display text-[clamp(1.1rem,1.6vw,1.4rem)] text-ink-900 flex-1 pr-6 leading-snug">{f.q}</span>
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-900/20 transition group-open:bg-ink-900 group-open:text-cream-50">
                            <I.plus className="transition-transform group-open:rotate-45"/>
                          </span>
                        </summary>
                        <div className="pb-6 pl-14 pr-12 -mt-1">
                          <p className="max-w-prose text-[15px] leading-relaxed text-ink-700">
                            {"formUrl" in f && f.formUrl ? (
                              <>
                                {f.a.split("form")[0]}
                                <a href={f.formUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ink-900">form</a>
                                {f.a.split("form").slice(1).join("form")}
                              </>
                            ) : f.a}
                          </p>
                          <div className="mt-3 flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-ink-500">
                            <span>was this helpful?</span>
                            <button className="hover:text-brand-rust transition">yes ✓</button>
                            <span aria-hidden>·</span>
                            <button className="hover:text-brand-rust transition">no →</button>
                          </div>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      {/* still stuck CTA */}
      <section className="spread relative">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
          <div className="relative bg-brand-butter/70 p-10 md:p-14 text-center -rotate-[0.4deg] shadow-[0_30px_80px_-30px_rgba(0,0,0,.35)]">
            <span aria-hidden className="absolute -top-4 left-10 h-7 w-32 -rotate-[5deg] opacity-90"
                  style={{background:"repeating-linear-gradient(135deg, #f3c6c2 0 10px, #c7e2c7 10px 20px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
            <p className="hand text-[22px] text-brand-rust">didn't see your question?</p>
            <h3 className="display text-[clamp(2rem,4vw,3.4rem)] text-ink-900 mt-2 leading-[1]">
              Write us a <em>real letter.</em>
            </h3>
            <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink-700">
              We reply within three workdays — usually faster. From a person, not a bot.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a href="/contact" className="btn-ink">Open the contact form <I.arrow/></a>
              <a href="mailto:info@studypuff.com" className="btn-ghost">info@studypuff.com</a>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<FAQPage/>);
