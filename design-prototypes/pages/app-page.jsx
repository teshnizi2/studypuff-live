// StudyPuff Dashboard — interactive prototype recreation of /dashboard.
// Real countdown timer, checkable tasks, mode switching, growing tree,
// open-able sound dock, animated sheep — all driven by React state.
// Tweaks: theme variant, sheep accessory, lifetime minutes, daily goal, demo speed.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "moss",
  "accessory": "rain-hat",
  "lifetimeMinutes": 1240,
  "dailyGoal": 90,
  "demoSpeed": 60,
  "sidebarOpen": true,
  "showLeavesAccent": true
}/*EDITMODE-END*/;

const THEMES = {
  moss:  { from:"#dfead2", mid:"#cfe0c2", to:"#bbd3ad", ink:"#1f4d2c", ringInk:"#1f4d2c" },
  dusk:  { from:"#e7d9f0", mid:"#d6c1e5", to:"#c4a8d6", ink:"#3d2a55", ringInk:"#3d2a55" },
  paper: { from:"#f8f3ea", mid:"#efe6d4", to:"#e4d6bb", ink:"#1f1f1f", ringInk:"#1f1f1f" },
  sunset:{ from:"#fbe9d7", mid:"#f5d2b8", to:"#eab39a", ink:"#7a3a1f", ringInk:"#7a3a1f" }
};

const ACCESSORIES = {
  "none":      null,
  "rain-hat":  { kind:"hat",     color:"#3a5a8a" },
  "scarf":     { kind:"scarf",   color:"#c97f5e" },
  "glasses":   { kind:"glasses", color:"#1f1f1f" },
  "daisy":     { kind:"flower",  color:"#f3a4b8" }
};

// =================================================================
// SAMPLE DATA (mutable via state)
// =================================================================
const INITIAL_TOPICS = [
  { id:"t1", name:"Cognitive Psych",   color:"#3a8a4c" },
  { id:"t2", name:"Thesis",            color:"#c97f5e" },
  { id:"t3", name:"Statistics",        color:"#1f4d2c" },
];
const INITIAL_TASKS = [
  { id:"a1", topic:"t1", text:"Read Ch. 4 — Memory systems",          done:true,  priority:"high",   minutes:75 },
  { id:"a2", topic:"t1", text:"Lecture notes — encoding vs. retrieval", done:false, priority:"normal", minutes:30 },
  { id:"a3", topic:"t1", text:"Anki · 30 cards",                       done:false, priority:"low",    minutes:15 },
  { id:"a4", topic:"t2", text:"Draft methods section",                  done:false, priority:"high",   minutes:120 },
  { id:"a5", topic:"t2", text:"Email supervisor re: ethics form",       done:true,  priority:"normal", minutes:5 },
  { id:"a6", topic:"t3", text:"Problem set 6",                          done:false, priority:"high",   minutes:60 },
];

const SOUND_OPTIONS = [
  { id:"sound-rain",    label:"Soft rain",       tag:"ambient", glyph:"🌧" },
  { id:"sound-ocean",   label:"Ocean waves",     tag:"ambient", glyph:"🌊" },
  { id:"sound-forest",  label:"Forest morning",  tag:"ambient", glyph:"🌲" },
  { id:"sound-cafe",    label:"Cosy café",       tag:"ambient", glyph:"☕" },
  { id:"sound-fire",    label:"Fireplace",       tag:"ambient", glyph:"🔥" },
  { id:"sound-library", label:"Quiet library",   tag:"ambient", glyph:"📚" },
  { id:"sound-brown",   label:"Brown noise",     tag:"noise",   glyph:"⋯" },
  { id:"sound-pink",    label:"Pink noise",      tag:"noise",   glyph:"⋯" },
  { id:"sound-white",   label:"White noise",     tag:"noise",   glyph:"⋯" },
];

const MODE_MINUTES = { focus:25, short:5, long:20 };
const MODE_LABEL = { focus:"Focus", short:"Short break", long:"Long break" };

// =================================================================
// GROWTH TREE — animated
// =================================================================
function GrowthTree({ lifetimeMinutes, todayMinutes, streak, tasksDone, theme }){
  const MIN_PER_LEAF = 25;
  const MAX = 80;
  const leafCount = Math.min(MAX, Math.floor(lifetimeMinutes / MIN_PER_LEAF));
  const todayLeafCount = Math.min(leafCount, Math.floor(todayMinutes / MIN_PER_LEAF));
  const stage =
    lifetimeMinutes < 30 ? "A tiny sprout." :
    lifetimeMinutes < 180 ? "A young sapling." :
    lifetimeMinutes < 720 ? "Branching out." :
    lifetimeMinutes < 3000 ? "A leafy canopy." :
    "A grand old tree.";
  const branchLevel = lifetimeMinutes < 30 ? 0 : lifetimeMinutes < 180 ? 1 : lifetimeMinutes < 720 ? 2 : 3;

  const leaves = React.useMemo(()=>{
    const out = [];
    let s = 7;
    const r = () => { s = (s * 1664525 + 1013904223) | 0; return ((s >>> 0) % 10000) / 10000; };
    for(let i=0;i<leafCount;i++){
      const angle = r()*Math.PI*2;
      const rad = 18 + r()*50;
      const x = 100 + Math.cos(angle)*rad;
      const y = 78 + Math.sin(angle)*rad*0.7 - 14;
      const size = 4.2 + r()*2.4;
      const rot = (r()-0.5)*60;
      out.push({x,y,size,rot,delayIdx:i%7,fresh: i >= leafCount - todayLeafCount});
    }
    return out;
  },[leafCount, todayLeafCount]);

  const nextLeaf = Math.max(1, MIN_PER_LEAF - (lifetimeMinutes % MIN_PER_LEAF));

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em]" style={{color:theme.ink, opacity:.7}}>Your garden</p>

      <svg viewBox="0 0 200 240" className="h-[260px] w-full max-w-[260px]" style={{filter:`drop-shadow(0 12px 28px ${theme.ink}30)`}}>
        <defs>
          <radialGradient id="ch2" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(110,168,102,0.35)"/>
            <stop offset="60%" stopColor="rgba(110,168,102,0.08)"/>
            <stop offset="100%" stopColor="rgba(110,168,102,0)"/>
          </radialGradient>
          <linearGradient id="tg2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7a5235"/><stop offset="100%" stopColor="#54371d"/>
          </linearGradient>
          <linearGradient id="lg2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7fb472"/><stop offset="100%" stopColor="#3a8a4c"/>
          </linearGradient>
          <linearGradient id="lf2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a9d68e"/><stop offset="100%" stopColor="#5fa05a"/>
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="78" rx="86" ry="70" fill="url(#ch2)"/>
        <ellipse cx="100" cy="222" rx="70" ry="6" fill="rgba(60,40,20,0.18)"/>
        <path d="M 100 220 C 96 196, 96 170, 99 140 C 100 124, 102 108, 100 88" stroke="url(#tg2)" strokeWidth="9" strokeLinecap="round" fill="none"/>
        {branchLevel >= 1 && (<>
          <path d="M 100 152 C 88 142, 76 132, 64 124" stroke="url(#tg2)" strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path d="M 100 138 C 112 128, 124 118, 140 112" stroke="url(#tg2)" strokeWidth="4" strokeLinecap="round" fill="none"/>
        </>)}
        {branchLevel >= 2 && (<>
          <path d="M 100 116 C 90 104, 80 96, 68 92" stroke="url(#tg2)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M 100 102 C 110 92, 122 84, 134 80" stroke="url(#tg2)" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </>)}
        {branchLevel >= 3 && (<>
          <path d="M 75 124 C 66 118, 56 116, 48 118" stroke="url(#tg2)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M 130 110 C 142 104, 154 102, 162 104" stroke="url(#tg2)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </>)}
        {[80,90,110,120].map(x=>(
          <path key={x} d={`M ${x} 222 Q ${x+2} 215 ${x+4} 222`} stroke="#3a8a4c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        ))}
        {leaves.map((l,i)=>(
          <g key={i} transform={`translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.rot.toFixed(1)})`}
             className={l.fresh ? "leaf-grow" : "leaf-sway"}
             style={l.fresh ? { animationDelay:`${(i%6)*80}ms` } : { animationDelay:`${l.delayIdx*350}ms` }}>
            <path
              d={`M 0 ${-l.size} C ${l.size*0.9} ${-l.size*0.6}, ${l.size*0.9} ${l.size*0.6}, 0 ${l.size} C ${-l.size*0.9} ${l.size*0.6}, ${-l.size*0.9} ${-l.size*0.6}, 0 ${-l.size} Z`}
              fill={l.fresh ? "url(#lf2)" : "url(#lg2)"}
              opacity={l.fresh ? 0.95 : 0.85}
            />
            <line x1="0" y1={-l.size*0.85} x2="0" y2={l.size*0.85} stroke="rgba(20,50,30,0.25)" strokeWidth="0.4"/>
          </g>
        ))}
        {tasksDone > 0 && [{x:74,y:60},{x:130,y:54},{x:108,y:90},{x:90,y:42}].slice(0,Math.min(tasksDone,4)).map((p,i)=>(
          <circle key={i} cx={p.x} cy={p.y} r="2.4" fill="#f3a4b8" stroke="#e07c95" strokeWidth="0.5" opacity="0.9" className="blossom"/>
        ))}
      </svg>

      <div className="text-center">
        <p className="font-display italic text-[14px]" style={{color:theme.ink}}>{stage}</p>
        <p className="text-[10px] uppercase tracking-[0.28em] mt-0.5" style={{color:theme.ink, opacity:.65}}>
          {leafCount} leaves · {streak}-day streak
        </p>
        <p className="mt-2 text-[10px] italic" style={{color:theme.ink, opacity:.65}}>next leaf in {nextLeaf}m</p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.24em]" style={{color:theme.ink, opacity:.5}}>1 leaf per {MIN_PER_LEAF} min focus</p>
      </div>
    </div>
  );
}

// =================================================================
// SHEEP — SVG with optional accessory + bob animation
// =================================================================
function Sheep({ accessory, running, mode, size=56 }){
  const acc = ACCESSORIES[accessory];
  return (
    <div className={`relative ${running ? 'sheep-bob' : ''}`} style={{width:size,height:size}}>
      <svg viewBox="0 0 80 80" width={size} height={size}>
        {/* body cloud */}
        <ellipse cx="40" cy="48" rx="26" ry="20" fill="#fdfbf7"/>
        <circle cx="22" cy="44" r="9" fill="#fdfbf7"/>
        <circle cx="58" cy="44" r="9" fill="#fdfbf7"/>
        <circle cx="30" cy="36" r="9" fill="#fdfbf7"/>
        <circle cx="50" cy="36" r="9" fill="#fdfbf7"/>
        {/* legs */}
        <rect x="28" y="62" width="4" height="8" rx="1.5" fill="#1f1f1f"/>
        <rect x="48" y="62" width="4" height="8" rx="1.5" fill="#1f1f1f"/>
        {/* face */}
        <ellipse cx="40" cy="42" rx="11" ry="10" fill="#1f1f1f"/>
        <ellipse cx="40" cy="44" rx="8" ry="7" fill="#f6d4b7"/>
        <circle cx="36" cy="43" r="1.2" fill="#1f1f1f"/>
        <circle cx="44" cy="43" r="1.2" fill="#1f1f1f"/>
        {/* tiny smile */}
        <path d={mode==='focus' ? "M 38 47 Q 40 48.5 42 47" : "M 38 48 Q 40 46.5 42 48"} stroke="#1f1f1f" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
        {/* ears */}
        <ellipse cx="30" cy="30" rx="3" ry="5" fill="#1f1f1f" transform="rotate(-20 30 30)"/>
        <ellipse cx="50" cy="30" rx="3" ry="5" fill="#1f1f1f" transform="rotate(20 50 30)"/>

        {/* accessories */}
        {acc && acc.kind === "hat" && (
          <g>
            <ellipse cx="40" cy="28" rx="14" ry="2.5" fill={acc.color}/>
            <path d="M 30 28 Q 30 18 40 17 Q 50 18 50 28 Z" fill={acc.color}/>
            <rect x="32" y="25" width="16" height="2" fill="#1f1f1f" opacity="0.4"/>
          </g>
        )}
        {acc && acc.kind === "scarf" && (
          <g>
            <path d="M 28 50 Q 40 52 52 50 Q 51 56 40 56 Q 29 56 28 50 Z" fill={acc.color}/>
            <path d="M 50 50 L 55 62 L 49 60 Z" fill={acc.color}/>
          </g>
        )}
        {acc && acc.kind === "glasses" && (
          <g stroke={acc.color} strokeWidth="0.8" fill="none">
            <circle cx="36" cy="43" r="2.6"/>
            <circle cx="44" cy="43" r="2.6"/>
            <line x1="38.6" y1="43" x2="41.4" y2="43"/>
          </g>
        )}
        {acc && acc.kind === "flower" && (
          <g>
            {[0,72,144,216,288].map(d=>(
              <circle key={d} cx={40 + 5*Math.cos(d*Math.PI/180)} cy={26 + 5*Math.sin(d*Math.PI/180)} r="2.2" fill={acc.color}/>
            ))}
            <circle cx="40" cy="26" r="1.6" fill="#fbe9a5"/>
          </g>
        )}
      </svg>
    </div>
  );
}

// =================================================================
// TIMER — real countdown
// =================================================================
function TimerCircle({
  mode, setMode, running, setRunning,
  secondsLeft, totalSeconds, accessory, currentTaskLabel,
  todayMinutes, dailyGoal, weekly, theme, onReset, onSkip
}){
  const radius = 100;
  const circ = 2 * Math.PI * radius;
  const progress = 1 - (secondsLeft / totalSeconds);
  const mins = Math.floor(secondsLeft/60);
  const secs = secondsLeft%60;

  const goalPct = Math.min(100, Math.round((todayMinutes/dailyGoal)*100));

  return (
    <div className="flex flex-col items-center journal-rise">
      {/* mode tabs */}
      <div className="flex items-center gap-1 rounded-full bg-cream-50/70 p-1 ring-1 ring-ink-900/10 shadow-soft mb-7">
        {Object.keys(MODE_LABEL).map(m=>(
          <button key={m} onClick={()=>setMode(m)} className={`rounded-full px-3.5 py-1.5 text-sm font-display italic transition-all ${m===mode?'bg-ink-900 text-cream-50 shadow-md':'text-ink-700 hover:text-ink-900'}`}>
            {MODE_LABEL[m]}
          </button>
        ))}
      </div>

      {/* ring + sheep */}
      <div className="relative">
        <svg viewBox="0 0 240 240" className="w-[300px] h-[300px]" style={{filter:`drop-shadow(0 18px 40px ${theme.ringInk}40)`}}>
          <circle cx="120" cy="120" r={radius} fill="#fdfbf7" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="14"/>
          <circle cx="120" cy="120" r={radius} fill="none"
                  stroke={theme.ringInk} strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${circ}`}
                  strokeDashoffset={circ*(1-progress)}
                  transform="rotate(-90 120 120)"
                  style={{transition:"stroke-dashoffset 0.9s ease-out"}}/>
          {/* tiny tick marks */}
          {Array.from({length:60}).map((_,i)=>{
            const a = (i/60)*Math.PI*2 - Math.PI/2;
            const r1 = 86, r2 = i%5===0 ? 80 : 83;
            return <line key={i} x1={120+Math.cos(a)*r1} y1={120+Math.sin(a)*r1} x2={120+Math.cos(a)*r2} y2={120+Math.sin(a)*r2} stroke={theme.ringInk} strokeOpacity={i%5===0?0.25:0.1} strokeWidth="1"/>;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Sheep accessory={accessory} running={running} mode={mode} size={56}/>
          <p className="font-display text-[58px] leading-none tabular-nums mt-1" style={{color:theme.ringInk}}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </p>
          <p className="hand text-[14px] mt-1" style={{color:theme.ringInk, opacity:.7}}>round 2 of 4 · {MODE_LABEL[mode].toLowerCase()}</p>
        </div>
        {running && (
          <div aria-hidden className="absolute inset-0 -z-10 rounded-full timer-pulse" style={{boxShadow:`0 0 60px ${theme.ringInk}40`}}/>
        )}
      </div>

      {/* current task pill */}
      <div className="mt-5 flex items-center gap-2 bg-cream-50/85 rounded-full px-3.5 py-1.5 ring-1 ring-ink-900/10 shadow-soft max-w-[420px]">
        <span className="h-1.5 w-1.5 rounded-full" style={{background:"#3a8a4c"}}/>
        <p className="text-[12.5px] text-ink-900 font-display italic truncate">{currentTaskLabel}</p>
      </div>

      {/* controls */}
      <div className="mt-5 flex items-center gap-2">
        <button onClick={()=>setRunning(r=>!r)} className="rounded-full bg-ink-900 text-cream-50 px-6 py-2.5 text-[12px] font-mono uppercase tracking-widest hover:bg-ink-700 transition-all shadow-md active:scale-95">
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={onReset} className="rounded-full border border-ink-900/30 bg-cream-50/80 text-ink-900 px-5 py-2.5 text-[12px] font-mono uppercase tracking-widest hover:bg-cream-50 active:scale-95">Reset</button>
        <button onClick={onSkip} className="rounded-full border border-ink-900/30 bg-cream-50/80 text-ink-900 px-5 py-2.5 text-[12px] font-mono uppercase tracking-widest hover:bg-cream-50 active:scale-95">Skip</button>
      </div>

      {/* today goal + weekly */}
      <div className="mt-7 w-full max-w-[440px] bg-cream-50/70 rounded-2xl ring-1 ring-ink-900/10 p-4 shadow-soft">
        <div className="flex items-baseline justify-between mb-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-700">Today</p>
          <p className="font-mono text-[11px] text-ink-700 tabular-nums">{todayMinutes} / {dailyGoal} min · {goalPct}%</p>
        </div>
        <div className="h-2 rounded-full bg-ink-900/10 overflow-hidden">
          <div className="h-full rounded-full bg-ink-900 transition-all duration-700" style={{width:`${goalPct}%`}}/>
        </div>
        <div className="mt-4 grid grid-cols-7 items-end gap-2 h-[52px]">
          {weekly.map((m,i)=>{
            const h = Math.max(4, Math.round((m/Math.max(...weekly,dailyGoal))*48));
            const today = i===weekly.length-1;
            const d = new Date(); d.setDate(d.getDate() - (weekly.length-1-i));
            const label = d.toLocaleDateString(undefined,{weekday:'narrow'});
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-full rounded-sm ${today?'bg-ink-900':'bg-ink-900/30'}`} style={{height:`${h}px`}} title={`${m}m`}/>
                <span className="text-[9px] font-mono text-ink-700">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =================================================================
// TASK PANEL — checkable
// =================================================================
function TaskPanel({ topics, tasks, currentTaskId, onSelectTask, onToggleTask, onHide, theme }){
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em]" style={{color:theme.ink, opacity:.7}}>Tasks</p>
        <button onClick={onHide} className="text-[11px] font-display italic text-ink-700 hover:text-ink-900">hide</button>
      </div>

      {topics.map(top=>{
        const items = tasks.filter(t=>t.topic===top.id);
        const total = items.reduce((a,t)=>a+t.minutes,0);
        return (
          <div key={top.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full" style={{background:top.color}}/>
              <p className="font-display text-[15px] text-ink-900 flex-1">{top.name}</p>
              <p className="font-mono text-[10px] text-ink-700 tabular-nums">{total}m</p>
            </div>
            <ul className="space-y-1.5">
              {items.map(t=>{
                const selected = t.id===currentTaskId;
                return (
                  <li key={t.id} className={`group flex items-center gap-2.5 rounded-lg px-1.5 py-1 cursor-pointer transition ${selected?'bg-cream-50/90 ring-1 ring-ink-900/20 shadow-soft':'hover:bg-cream-50/50'}`}
                      onClick={()=>onSelectTask(t.id)}>
                    <button onClick={(e)=>{e.stopPropagation();onToggleTask(t.id);}}
                            className={`h-4 w-4 rounded border ${t.done?'bg-ink-900 border-ink-900':'border-ink-900/40 bg-cream-50/60 hover:border-ink-900'} flex items-center justify-center shrink-0 transition`}>
                      {t.done && <svg viewBox="0 0 12 12" className="w-2.5 h-2.5"><path d="M2 6 L5 9 L10 3" stroke="#fdfbf7" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
                    </button>
                    <span className={`text-[13px] leading-tight ${t.done?'line-through text-ink-500':'text-ink-900'} flex-1`}>{t.text}</span>
                    {t.priority==='high' && !t.done && <span className="text-[8px] font-mono uppercase tracking-widest px-1 py-0.5 rounded bg-brand-pink/60 text-ink-900">!</span>}
                    <span className="font-mono text-[10px] text-ink-700 tabular-nums">{t.minutes}m</span>
                  </li>
                );
              })}
            </ul>
            <button className="mt-2 text-[11px] font-display italic text-ink-700 hover:text-ink-900">+ add task</button>
          </div>
        );
      })}

      <button className="w-full mt-3 rounded-2xl border border-dashed border-ink-900/25 bg-cream-50/40 py-2 text-[12px] font-display italic text-ink-700 hover:text-ink-900 hover:bg-cream-50/70 transition">+ new topic</button>
    </div>
  );
}

// =================================================================
// SOUND DOCK — opens dropdown
// =================================================================
function SoundDock({ soundId, playing, onTogglePlay, onSelect }){
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(()=>{
    if(!open) return;
    const h = (e)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return ()=>document.removeEventListener("mousedown", h);
  },[open]);

  const current = soundId === null
    ? { id:null, label:"Off" }
    : SOUND_OPTIONS.find(s=>s.id===soundId) || { id:null, label:"Off" };

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-40 select-none">
      <div className="relative flex items-center gap-3 rounded-full bg-cream-50/85 px-3 py-2 pr-4 shadow-[0_18px_50px_-15px_rgba(31,77,44,0.35)] backdrop-blur-md ring-1 ring-ink-900/10">
        <button onClick={onTogglePlay} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-cream-50 hover:bg-ink-700 transition active:scale-95" aria-label={playing?"Pause":"Play"}>
          {playing ? (
            <svg viewBox="0 0 12 12" className="w-3 h-3"><rect x="2.5" y="2" width="2.5" height="8" rx="0.4" fill="currentColor"/><rect x="7" y="2" width="2.5" height="8" rx="0.4" fill="currentColor"/></svg>
          ) : (
            <svg viewBox="0 0 12 12" className="w-3 h-3 ml-0.5"><path d="M3 2 L10 6 L3 10 Z" fill="currentColor"/></svg>
          )}
        </button>
        <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-2 text-left">
          <span className="flex h-3 w-4 items-end gap-[2px]">
            {playing && soundId ? (
              [8,12,9,11].map((h,j)=>(
                <span key={j} className="eq-bar w-[2px] flex-1 rounded-full bg-emerald-700" style={{height:`${h}px`,animationDelay:`${j*80}ms`}}/>
              ))
            ) : (
              <svg viewBox="0 0 16 16" className="w-4 h-4 text-ink-900/60"><path d="M9 2 L9 12 M9 2 L13 4 L13 6 M5 8 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0" stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round"/></svg>
            )}
          </span>
          <span className="font-display italic text-sm text-ink-900">{current.label}</span>
          <svg viewBox="0 0 12 12" className={`w-3 h-3 text-ink-900/60 transition-transform ${open?'rotate-0':'rotate-180'}`}><path d="M3 5 L6 8 L9 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </button>
      </div>

      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-72 max-h-[26rem] overflow-hidden rounded-3xl bg-cream-50 shadow-[0_30px_80px_-20px_rgba(31,77,44,0.45)] ring-1 ring-ink-900/10 dock-in">
          <div className="max-h-80 overflow-y-auto">
            <div className="px-2 pb-1 pt-2">
              <button onClick={()=>{onSelect(null); setOpen(false);}}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${soundId===null?'bg-ink-900 text-cream-50':'text-ink-900 hover:bg-cream-100'}`}>
                <span className="font-display italic">Off (silence)</span>
              </button>
            </div>
            {[{title:"Ambient",tag:"ambient"},{title:"Noise",tag:"noise"}].map(g=>{
              const items = SOUND_OPTIONS.filter(s=>s.tag===g.tag);
              return (
                <div key={g.tag} className="px-2 py-2">
                  <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-700">{g.title}</p>
                  {items.map(s=>{
                    const selected = soundId===s.id;
                    return (
                      <button key={s.id} onClick={()=>{onSelect(s.id); setOpen(false);}}
                              className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${selected?'bg-ink-900 text-cream-50':'text-ink-900 hover:bg-cream-100'}`}>
                        <span className="flex items-center gap-2 font-display italic"><span aria-hidden>{s.glyph}</span>{s.label}</span>
                        {selected && playing && (
                          <span className="flex h-3 w-4 items-end gap-[2px]">
                            {[8,12,9,11].map((h,j)=>(
                              <span key={j} className="eq-bar w-[2px] flex-1 rounded-full bg-cream-50" style={{height:`${h}px`,animationDelay:`${j*80}ms`}}/>
                            ))}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// =================================================================
// HEADER
// =================================================================
function DashHeader({ coins, theme }){
  return (
    <header className="border-b border-ink-900/10 backdrop-blur" style={{background:`${theme.from}d9`}}>
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-5 px-6 py-5 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-10">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <a href="index.html" className="inline-flex w-fit items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700 hover:text-ink-900">
              <span aria-hidden>←</span> Back to site
            </a>
            <a href="#" className="font-display text-2xl text-ink-900 leading-none">StudyPuff</a>
          </div>
          <button className="hidden items-center gap-2 rounded-full border border-ink-900/10 bg-brand-butter px-3 py-1.5 text-sm font-semibold text-ink-900 shadow-soft hover:-translate-y-0.5 transition sm:inline-flex">
            <span aria-hidden>🪙</span> {coins}
          </button>
        </div>
        <div className="hidden justify-self-center lg:flex">
          <div className="flex items-center gap-1 rounded-full bg-cream-50/70 p-1 ring-1 ring-ink-900/10 shadow-soft">
            {["Rooms","Stats","Settings"].map(l=>(
              <button key={l} className="rounded-full px-3.5 py-1.5 text-sm font-display italic text-ink-900 hover:bg-cream-50 transition">{l}</button>
            ))}
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-self-end gap-3 text-sm">
          <button className="h-9 w-9 rounded-full bg-brand-butter/70 ring-1 ring-ink-900/10 font-display text-ink-900 hover:scale-105 transition">M</button>
          <button className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-700 hover:text-ink-900">Log out</button>
        </nav>
      </div>
    </header>
  );
}

// =================================================================
// LEAVES ACCENT
// =================================================================
function LeavesAccent(){
  return (
    <>
      <svg aria-hidden className="absolute top-6 left-8 opacity-30 leaf-drift" width="100" height="100" viewBox="0 0 80 80">
        <path d="M40 10 C 25 20, 22 40, 30 55 C 38 50, 50 35, 40 10 Z" fill="#7fb472"/>
        <path d="M40 10 L 35 55" stroke="#3a8a4c" strokeWidth="0.8" fill="none"/>
      </svg>
      <svg aria-hidden className="absolute top-12 right-12 opacity-25 leaf-drift-r" width="72" height="72" viewBox="0 0 80 80" style={{animationDelay:"-2s"}}>
        <path d="M40 10 C 25 20, 22 40, 30 55 C 38 50, 50 35, 40 10 Z" fill="#7fb472" transform="rotate(45 40 40)"/>
      </svg>
      <svg aria-hidden className="absolute bottom-10 left-1/3 opacity-20 leaf-drift" width="60" height="60" viewBox="0 0 80 80" style={{animationDelay:"-4s"}}>
        <path d="M40 10 C 25 20, 22 40, 30 55 C 38 50, 50 35, 40 10 Z" fill="#5fa05a" transform="rotate(-30 40 40)"/>
      </svg>
    </>
  );
}

// =================================================================
// TOAST — pretty session-complete notice
// =================================================================
function Toast({ message, theme }){
  if(!message) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 toast-in">
      <div className="flex items-center gap-3 rounded-full bg-cream-50 px-5 py-3 shadow-[0_30px_80px_-20px_rgba(31,77,44,0.45)] ring-1 ring-ink-900/10">
        <span className="text-[20px]">🌱</span>
        <p className="font-display italic text-[15px] text-ink-900">{message}</p>
      </div>
    </div>
  );
}

// =================================================================
// PAGE
// =================================================================
function AppPage(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = THEMES[t.theme] || THEMES.moss;

  // Tasks state
  const [tasks, setTasks] = React.useState(INITIAL_TASKS);
  const [currentTaskId, setCurrentTaskId] = React.useState("a2");

  // Timer state
  const [mode, setMode] = React.useState("focus");
  const [running, setRunning] = React.useState(false);
  const totalSeconds = MODE_MINUTES[mode] * 60;
  const [secondsLeft, setSecondsLeft] = React.useState(totalSeconds);

  // Sound state
  const [soundId, setSoundId] = React.useState("sound-rain");
  const [soundPlaying, setSoundPlaying] = React.useState(false);

  // Stats / live numbers
  const [coins, setCoins] = React.useState(428);
  const [todayMinutes, setTodayMinutes] = React.useState(75);
  const [lifetimeMinutes, setLifetimeMinutes] = React.useState(t.lifetimeMinutes);
  const [weekly] = React.useState([22,48,31,65,12,55,75]);

  // UI state
  const [sidebarHidden, setSidebarHidden] = React.useState(!t.sidebarOpen);
  const [toast, setToast] = React.useState(null);

  // Reset countdown when mode changes
  React.useEffect(()=>{ setSecondsLeft(MODE_MINUTES[mode]*60); },[mode]);

  // Auto-play sound when timer running
  React.useEffect(()=>{ if(running) setSoundPlaying(true); else setSoundPlaying(false); },[running]);

  // Countdown loop — scaled by demoSpeed for visible progress
  React.useEffect(()=>{
    if(!running) return;
    const interval = Math.max(20, Math.floor(1000 / t.demoSpeed));
    const id = setInterval(()=>{
      setSecondsLeft(s=>{
        if(s <= 1){
          // session done
          if(mode === "focus"){
            setCoins(c=>c+MODE_MINUTES.focus);
            setTodayMinutes(m=>m+MODE_MINUTES.focus);
            setLifetimeMinutes(l=>l+MODE_MINUTES.focus);
            setToast("Session complete — +25 coins · new leaf 🌿");
            setTimeout(()=>setToast(null), 2800);
            setMode("short");
          } else {
            setMode("focus");
          }
          setRunning(false);
          return MODE_MINUTES[mode]*60;
        }
        return s-1;
      });
    }, interval);
    return ()=>clearInterval(id);
  },[running, mode, t.demoSpeed]);

  // sync sidebar tweak <-> state
  React.useEffect(()=>{ setSidebarHidden(!t.sidebarOpen); },[t.sidebarOpen]);
  React.useEffect(()=>{ setLifetimeMinutes(t.lifetimeMinutes); },[t.lifetimeMinutes]);

  const toggleTask = (id) => setTasks(prev => {
    const next = prev.map(x => x.id===id ? {...x, done:!x.done} : x);
    const flipped = next.find(x=>x.id===id);
    if(flipped && flipped.done) {
      setCoins(c=>c+5);
      setToast(`"${flipped.text}" — done. +5 bonus coins ✿`);
      setTimeout(()=>setToast(null), 2200);
    }
    return next;
  });

  const currentTask = tasks.find(x=>x.id===currentTaskId);
  const currentTopic = currentTask ? INITIAL_TOPICS.find(t=>t.id===currentTask.topic) : null;
  const currentTaskLabel = currentTask ? `${currentTopic?.name || ""} · ${currentTask.text}` : "Pick a task to focus on";
  const tasksDoneCount = tasks.filter(x=>x.done).length;

  const mainBg = {background:`linear-gradient(180deg, ${theme.from} 0%, ${theme.mid} 55%, ${theme.to} 100%)`};

  return (
    <main className="min-h-screen relative" style={mainBg}>
      <DashHeader coins={coins} theme={theme}/>

      <div className="relative min-h-[calc(100vh-100px)] pb-28">
        {t.showLeavesAccent && <LeavesAccent/>}

        {/* Sidebar — left (desktop) */}
        <aside aria-label="Topics & tasks"
               className={`fixed left-0 top-[100px] z-20 hidden h-[calc(100vh-120px)] w-[300px] overflow-y-auto px-5 pb-10 pt-2 transition-transform duration-300 ease-out lg:block ${sidebarHidden?'-translate-x-full':'translate-x-0'}`}>
          <TaskPanel
            topics={INITIAL_TOPICS}
            tasks={tasks}
            currentTaskId={currentTaskId}
            onSelectTask={setCurrentTaskId}
            onToggleTask={toggleTask}
            onHide={()=>{ setSidebarHidden(true); setTweak('sidebarOpen', false); }}
            theme={theme}
          />
        </aside>

        {/* Garden — right (desktop) */}
        <aside aria-label="Garden" className="fixed right-0 top-[100px] z-20 hidden h-[calc(100vh-120px)] w-[300px] overflow-y-auto px-4 pb-10 pt-4 lg:block">
          <GrowthTree
            lifetimeMinutes={lifetimeMinutes}
            todayMinutes={todayMinutes}
            streak={12}
            tasksDone={tasksDoneCount}
            theme={theme}
          />
        </aside>

        {/* Mobile sidebar stack */}
        <div className="flex flex-col gap-10 px-4 pt-6 lg:hidden">
          <TaskPanel
            topics={INITIAL_TOPICS}
            tasks={tasks}
            currentTaskId={currentTaskId}
            onSelectTask={setCurrentTaskId}
            onToggleTask={toggleTask}
            onHide={()=>{}}
            theme={theme}
          />
        </div>

        {/* Timer */}
        <div className="flex justify-center pt-8 lg:pt-14">
          <TimerCircle
            mode={mode}
            setMode={setMode}
            running={running}
            setRunning={setRunning}
            secondsLeft={secondsLeft}
            totalSeconds={totalSeconds}
            accessory={t.accessory}
            currentTaskLabel={currentTaskLabel}
            todayMinutes={todayMinutes}
            dailyGoal={t.dailyGoal}
            weekly={weekly}
            theme={theme}
            onReset={()=>setSecondsLeft(MODE_MINUTES[mode]*60)}
            onSkip={()=>{ setRunning(false); setSecondsLeft(0); setTimeout(()=>setMode(mode==='focus'?'short':'focus'),20); }}
          />
        </div>

        {/* Mobile garden */}
        <div className="flex justify-center px-4 pt-10 lg:hidden">
          <GrowthTree
            lifetimeMinutes={lifetimeMinutes}
            todayMinutes={todayMinutes}
            streak={12}
            tasksDone={tasksDoneCount}
            theme={theme}
          />
        </div>
      </div>

      {/* Show tasks tab when hidden */}
      {sidebarHidden && (
        <button onClick={()=>{ setSidebarHidden(false); setTweak('sidebarOpen', true); }}
                className="fixed left-4 top-32 z-30 flex items-center gap-2 rounded-full bg-cream-50/85 px-3 py-2 text-xs font-display italic text-ink-900 shadow-soft ring-1 ring-ink-900/10 backdrop-blur-md hover:-translate-y-0.5 transition">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5"><path d="M2 3 L14 3 M2 8 L10 8 M2 13 L14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Tasks
        </button>
      )}

      <SoundDock
        soundId={soundId}
        playing={soundPlaying && !!soundId}
        onTogglePlay={()=>setSoundPlaying(p=>!p)}
        onSelect={setSoundId}
      />

      <Toast message={toast} theme={theme}/>

      {/* TWEAKS */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme"/>
        <TweakRadio label="Palette" value={t.theme} options={["moss","dusk","paper","sunset"]} onChange={(v)=>setTweak('theme', v)}/>

        <TweakSection label="Sheep buddy"/>
        <TweakSelect label="Accessory" value={t.accessory} options={["none","rain-hat","scarf","glasses","daisy"]} onChange={(v)=>setTweak('accessory', v)}/>

        <TweakSection label="State"/>
        <TweakSlider label="Lifetime min" value={t.lifetimeMinutes} min={0} max={3500} step={20} unit="m" onChange={(v)=>setTweak('lifetimeMinutes', v)}/>
        <TweakSlider label="Daily goal"   value={t.dailyGoal}       min={15} max={300} step={5}  unit="m" onChange={(v)=>setTweak('dailyGoal', v)}/>

        <TweakSection label="Demo"/>
        <TweakSlider label="Timer speed" value={t.demoSpeed} min={1} max={120} step={1} unit="×" onChange={(v)=>setTweak('demoSpeed', v)}/>
        <TweakToggle label="Sidebar"        value={t.sidebarOpen}       onChange={(v)=>setTweak('sidebarOpen', v)}/>
        <TweakToggle label="Drifting leaves" value={t.showLeavesAccent} onChange={(v)=>setTweak('showLeavesAccent', v)}/>
      </TweaksPanel>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppPage/>);
