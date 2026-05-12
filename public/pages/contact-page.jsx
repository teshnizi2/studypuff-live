// Contact — postcard composition with form + side cards.

const REASONS = ["Workshop questions","Order or shipping","Press & partnerships","I just want to say hi"];

function ContactHero(){
  return (
    <section className="spread relative pb-8">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid grid-cols-12 gap-x-8 gap-y-10 items-end">
        <div className="col-span-12 lg:col-span-7 relative">
          <span aria-hidden className="absolute -top-4 left-0 h-5 w-24 -rotate-[6deg] opacity-80"
                style={{background:"repeating-linear-gradient(135deg, #c6dceb 0 7px, #fbe9a5 7px 14px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
          <p className="eyebrow text-ink-700 mb-4 flex items-center gap-3 flex-wrap">
            <span>Contact · 3-workday response</span>
            <span className="hand text-[16px] text-brand-rust normal-case tracking-normal">— from Leiden, NL</span>
          </p>
          <h1 className="display text-[clamp(2.4rem,6vw,5.2rem)] text-ink-900 leading-[1.04]">
            Workshops, scholarship requests, press,<br/>
            <span className="relative inline-block">
              <em>or just a kind note.</em>
              <svg aria-hidden viewBox="0 0 360 28" className="absolute left-0 right-0 -bottom-2 w-full h-4" preserveAspectRatio="none">
                <path d="M4 18 Q 50 6 100 16 T 200 16 T 300 14 T 356 10" stroke="#c97f72" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M340 16 q 12 -4 16 4 q 2 6 -8 6" stroke="#c97f72" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          <p className="mt-7 max-w-[56ch] text-[17px] leading-relaxed text-ink-700">
            Email us at <a className="underline underline-offset-4 decoration-brand-rust" href="mailto:info@studypuff.com">info@studypuff.com</a> or send a message below — we&rsquo;ll get back to you within three workdays.
          </p>

          {/* contact channels strip */}
          <div className="mt-8 max-w-[600px] grid grid-cols-3 gap-3 border-t border-ink-900/15 pt-5">
            <div><p className="font-display text-[24px] leading-none text-ink-900">~3 days</p><p className="eyebrow text-ink-700 mt-1">avg. reply</p></div>
            <div><p className="font-display text-[24px] leading-none text-ink-900">CET</p><p className="eyebrow text-ink-700 mt-1">timezone</p></div>
            <div><p className="font-display text-[24px] leading-none text-ink-900">EN · NL</p><p className="eyebrow text-ink-700 mt-1">languages</p></div>
          </div>
        </div>

        {/* envelope illustration */}
        <div className="col-span-12 lg:col-span-5 relative">
          <div className="relative mx-auto max-w-[400px]">
            <div className="relative aspect-[5/3] bg-cream-50 border border-ink-900/20 rotate-[-3deg] shadow-[0_22px_50px_-22px_rgba(0,0,0,0.32)]">
              {/* envelope flap */}
              <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
                <path d="M0 0 L 50 38 L 100 0" stroke="#1f1f1f" strokeOpacity=".25" strokeWidth=".5" fill="none"/>
              </svg>
              {/* stamp */}
              <div className="absolute top-3 right-3 w-[88px] h-[100px] bg-brand-butter border border-ink-900/30 p-1.5 rotate-[5deg] shadow-[0_4px_10px_rgba(0,0,0,.12)]"
                   style={{clipPath:"polygon(0% 4%, 4% 0%, 12% 4%, 20% 0%, 28% 4%, 36% 0%, 44% 4%, 52% 0%, 60% 4%, 68% 0%, 76% 4%, 84% 0%, 92% 4%, 100% 0%, 96% 8%, 100% 16%, 96% 24%, 100% 32%, 96% 40%, 100% 48%, 96% 56%, 100% 64%, 96% 72%, 100% 80%, 96% 88%, 100% 96%, 92% 100%, 84% 96%, 76% 100%, 68% 96%, 60% 100%, 52% 96%, 44% 100%, 36% 96%, 28% 100%, 20% 96%, 12% 100%, 4% 96%, 0% 100%, 4% 92%, 0% 84%, 4% 76%, 0% 68%, 4% 60%, 0% 52%, 4% 44%, 0% 36%, 4% 28%, 0% 20%, 4% 12%, 0% 4%)"}}>
                <div className="h-full w-full border border-ink-900/40 flex flex-col items-center justify-center text-center">
                  <p className="hand text-[14px] text-brand-rust leading-tight">study<br/>puff</p>
                  <p className="font-mono text-[7px] uppercase tracking-widest text-ink-900 mt-1">€ 0,75</p>
                </div>
              </div>
              {/* postmark */}
              <div className="absolute top-6 right-28 w-[78px] h-[78px] rotate-[-12deg]" aria-hidden>
                <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" stroke="#c97f72" strokeWidth="1.2">
                  <circle cx="40" cy="40" r="32"/>
                  <circle cx="40" cy="40" r="24"/>
                  <text x="40" y="32" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="#c97f72" stroke="none">LEIDEN · NL</text>
                  <text x="40" y="46" textAnchor="middle" fontFamily="serif" fontSize="14" fontStyle="italic" fill="#c97f72" stroke="none">2300</text>
                  <text x="40" y="56" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#c97f72" stroke="none">studypuff post</text>
                </svg>
                <svg viewBox="0 0 120 40" className="absolute -right-16 top-6 w-32" aria-hidden>
                  <path d="M2 10 Q 20 4 40 10 T 80 10 T 118 10" stroke="#c97f72" strokeOpacity=".6" strokeWidth="1.2" fill="none"/>
                  <path d="M2 18 Q 20 12 40 18 T 80 18 T 118 18" stroke="#c97f72" strokeOpacity=".6" strokeWidth="1.2" fill="none"/>
                  <path d="M2 26 Q 20 20 40 26 T 80 26 T 118 26" stroke="#c97f72" strokeOpacity=".6" strokeWidth="1.2" fill="none"/>
                </svg>
              </div>
              {/* address lines */}
              <div className="absolute left-6 bottom-5 right-32">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ink-700">To:</p>
                <p className="font-display text-[20px] text-ink-900 leading-tight">StudyPuff Academy</p>
                <p className="hand text-[15px] text-ink-700 leading-tight">Rapenburg · Leiden · NL</p>
                <p className="font-mono text-[10px] text-ink-900 mt-1">2311 EZ</p>
              </div>
            </div>
            {/* "we read every one" note */}
            <div className="absolute -bottom-8 -left-4 bg-brand-pink border border-ink-900/15 px-4 py-3 rotate-[-5deg] shadow-[0_14px_30px_-18px_rgba(0,0,0,0.3)]">
              <p className="hand text-[22px] text-brand-rust leading-tight">we read every<br/>one. truly.</p>
              <svg className="block mt-1" width="120" height="10" viewBox="0 0 120 10" fill="none" aria-hidden>
                <path d="M2 6 Q 20 1 40 5 T 80 5 T 118 5" stroke="#c97f72" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({label, error, children}){
  return (
    <label className="block">
      <span className="eyebrow text-ink-700 mb-1 inline-block">{label}</span>
      {children}
      {error && <span className="hand mt-1 block text-[16px] text-brand-rust">{error}</span>}
    </label>
  );
}

function ContactForm(){
  const [form,setForm] = React.useState({name:"",email:"",topic:REASONS[0],message:""});
  const [sent,setSent] = React.useState(false);
  const [errors,setErrors] = React.useState({});

  const onChange = (k)=>(e)=> setForm(f=>({...f,[k]:e.target.value}));
  const validate = () => {
    const next = {};
    if(!form.name.trim()) next.name = "We'd love to know your name.";
    if(!form.email.includes("@")) next.email = "That email looks off.";
    if(form.message.trim().length<10) next.message = "A little more context would help us respond.";
    setErrors(next);
    return Object.keys(next).length===0;
  };
  const onSubmit = (e)=>{ e.preventDefault(); if(validate()) setSent(true); };

  const inputCls = "w-full bg-transparent border-b border-ink-900/30 px-1 py-2 font-display text-[18px] focus:outline-none focus:border-ink-900";

  return (
    <section className="spread relative pt-0">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 grid grid-cols-12 gap-8">
        {/* form — letter paper */}
        <div className="col-span-12 lg:col-span-7">
          <div className="relative bg-cream-50 border border-ink-900/15 p-8 md:p-10 -rotate-[0.3deg] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]"
               style={{backgroundImage:"repeating-linear-gradient(0deg, transparent 0 32px, rgba(31,31,31,0.06) 32px 33px)"}}>
            <span aria-hidden className="absolute -top-3 left-10 h-6 w-28 -rotate-[5deg]"
                  style={{background:"repeating-linear-gradient(135deg, #c6dceb 0 8px, #fbe9a5 8px 16px)",boxShadow:"0 2px 6px rgba(0,0,0,.08)"}}/>
            {sent ? (
              <div className="text-center py-6">
                <p className="hand text-[26px] text-brand-rust">Thanks, {form.name.split(" ")[0] || "friend"}!</p>
                <h2 className="display text-[clamp(1.8rem,3vw,2.4rem)] text-ink-900 mt-2">Your letter has been mailed.</h2>
                <p className="mt-4 max-w-md mx-auto text-[15px] text-ink-700">We&rsquo;ll write back within three workdays — usually much sooner.</p>
                <button onClick={()=>{setSent(false); setForm({name:"",email:"",topic:REASONS[0],message:""});}} className="btn-ghost mt-6">Send another</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="eyebrow text-brand-rust">A letter to StudyPuff</p>
                  <p className="hand text-[18px] text-ink-700">— Leiden, NL</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Your name" error={errors.name}>
                    <input className={inputCls} placeholder="Ada Lovelace" value={form.name} onChange={onChange("name")}/>
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input className={inputCls} placeholder="you@school.edu" value={form.email} onChange={onChange("email")}/>
                  </Field>
                </div>
                <Field label="What's this about?">
                  <select className={inputCls} value={form.topic} onChange={onChange("topic")}>
                    {REASONS.map(r=> <option key={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Message" error={errors.message}>
                  <textarea rows={6} className={inputCls + " resize-none leading-[1.7]"} placeholder="Tell us a bit about what you're working on…" value={form.message} onChange={onChange("message")}/>
                </Field>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-[12px] text-ink-700">By sending, you agree to our <a className="underline underline-offset-4" href="/coming-soon">privacy policy</a>.</p>
                  <button className="btn-ink">Send message <I.arrow/></button>
                </div>
              </form>
            )}
          </div>
          <p className="hand text-[16px] text-ink-700 mt-3 px-1">P.S. — for scholarship seats, please use the form on the workshops page. ✿</p>
        </div>

        {/* side */}
        <aside className="col-span-12 lg:col-span-5 space-y-5">
          <div className="bg-brand-butter p-7 -rotate-[1deg] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)] border border-ink-900/10">
            <p className="eyebrow text-brand-rust">Email us directly</p>
            <p className="font-display text-[26px] mt-2 text-ink-900">
              <a className="underline underline-offset-[6px] decoration-brand-rust hover:text-brand-rust" href="mailto:info@studypuff.com">info@studypuff.com</a>
            </p>
            <p className="text-[14px] text-ink-700 mt-3">We aim to reply within three workdays.</p>
          </div>

          <div className="bg-brand-sky p-7 rotate-[0.8deg] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)] border border-ink-900/10">
            <p className="eyebrow text-brand-rust">Find us elsewhere</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                ["YouTube","https://www.youtube.com/@StudyPuffAcademy",<I.yt/>,"text-red-600"],
                ["Twitch","https://www.twitch.tv/studypuffacademy",<I.twitch/>,"text-[#9146ff]"],
                ["Discord","https://discord.gg/hb8bKpbjEz",<I.discord/>,"text-indigo-700"],
                ["Instagram","https://www.instagram.com/studypuffacademy",<I.ig/>,"text-rose-700"]
              ].map(([n,h,ic,c])=>(
                <a key={n} href={h} target="_blank" rel="noreferrer" aria-label={n} title={n}
                   className={`h-12 w-12 rounded-full bg-cream-50 ${c} flex items-center justify-center transition hover:-translate-y-0.5`}>
                  {ic}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-brand-mint p-7 -rotate-[0.4deg] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.3)] border border-ink-900/10">
            <p className="eyebrow text-brand-rust">Office hours</p>
            <ul className="mt-3 text-[14px] text-ink-900 space-y-1.5 font-mono">
              <li className="flex justify-between"><span>Mon — Thu</span><span>09:00 – 18:00 CET</span></li>
              <li className="flex justify-between"><span>Friday</span><span>09:00 – 14:00 CET</span></li>
              <li className="flex justify-between"><span>Weekend</span><span>livestreams only</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ContactPage(){
  return (
    <div className="paper-grain relative">
      <Header/>
      <ContactHero/>
      <ContactForm/>
      <Closing/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ContactPage/>);
