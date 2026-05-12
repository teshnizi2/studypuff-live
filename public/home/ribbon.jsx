// Two thin "ribbons" stacked: a live-now strip + the universities marquee, treated as a single rhythmic break.
function Ribbon() {
  return (
    <section aria-label="Live now and student community" className="relative">
      {/* live now ribbon — full bleed mint */}
      <div className="bg-brand-mint/70 border-y border-ink-900/15">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-3 flex flex-wrap items-center gap-x-8 gap-y-2 text-[13px]">
          <span className="inline-flex items-center gap-2 eyebrow text-brand-forest">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 pdot"></span> Live now
          </span>
          <span className="text-ink-900"><strong><StudyingNowCount/></strong> students focusing</span>
          <span className="hidden md:inline text-ink-700">·</span>
          <span className="hidden md:inline text-ink-900"><strong>1,284 hrs</strong> studied this week</span>
          <span className="hidden md:inline text-ink-700">·</span>
          <span className="hidden lg:inline text-ink-900"><strong>3</strong> livestreams scheduled</span>

          {/* eq bars */}
          <span className="ml-auto inline-flex items-end gap-[3px] h-4">
            {[1,2,3,4,5].map(i=> <span key={i} className="eqb w-[3px] bg-brand-forest" style={{height:"100%"}}></span>)}
          </span>
          <a href="#this-week" className="alink text-ink-900 underline-offset-4 underline">
            Join free <I.arrow className="ar"/>
          </a>
        </div>
      </div>

      {/* universities */}
      <div className="bg-cream-50/70 border-b border-ink-900/10 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-4 grid grid-cols-12 gap-6 items-center">
          <p className="col-span-12 md:col-span-2 eyebrow text-ink-700">Students join us from</p>
          <div className="col-span-12 md:col-span-10 relative overflow-hidden">
            <span className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-cream-50 to-transparent"></span>
            <span className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-cream-50 to-transparent"></span>
            <div className="mq-track gap-10">
              {[...UNIVERSITIES,...UNIVERSITIES].map((u,i)=>(
                <span key={i} className="whitespace-nowrap font-display italic text-[20px] text-ink-900/80 flex items-center gap-10">
                  {u}
                  <span className="inline-block h-1 w-1 rounded-full bg-ink-900/30"></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const UNIVERSITIES = [
  "Leiden University","TU Delft","The Hague University of Applied Sciences",
  "Erasmus University Rotterdam","KU Leuven","Indian Institute of Science",
  "Cambridge University","Stanford University","Maastricht University",
  "VU Amsterdam","University of Amsterdam"
];

// Deterministic studying-now counter — mirrors components/StudyingNow.tsx.
// Drifts between 17 and 55 with three sine waves so refreshes don't jump.
function studyingNowAt(t){
  const s = t/1000;
  const a = Math.sin(s/(60*17.3))*.5+.5;
  const b = Math.sin(s/(60*4.1)+.7)*.5+.5;
  const c = Math.sin(s/(60*1.7)+1.3)*.5+.5;
  const mix = a*.55 + b*.3 + c*.15;
  return Math.round(17 + mix*(55-17));
}
function StudyingNowCount(){
  const [n,setN] = React.useState(null);
  React.useEffect(()=>{
    setN(studyingNowAt(Date.now()));
    const id = setInterval(()=> setN(studyingNowAt(Date.now())), 15000);
    return ()=> clearInterval(id);
  },[]);
  if (n===null) return <span aria-hidden>—</span>;
  return <>{n}</>;
}
function StudyingNowLabel(){
  const [n,setN] = React.useState(null);
  React.useEffect(()=>{
    setN(studyingNowAt(Date.now()));
    const id = setInterval(()=> setN(studyingNowAt(Date.now())), 15000);
    return ()=> clearInterval(id);
  },[]);
  if (n===null) return <span aria-hidden>—</span>;
  return <span><strong>{n}</strong> studying now</span>;
}
window.Ribbon = Ribbon;
window.StudyingNowCount = StudyingNowCount;
window.StudyingNowLabel = StudyingNowLabel;
