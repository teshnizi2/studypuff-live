// Framer-style motion utilities — tasteful additions that keep the cozy/paper feel.
// 1) Scroll-reveal via IntersectionObserver (.reveal class)
// 2) Magnetic hover on buttons (.btn-ink, .btn-ghost)
// 3) <CountUp/> for animated numerals
// 4) <SplitHeadline/> for word-by-word stagger on the hero

(function(){
  // ── 1) scroll reveal ─────────────────────────────────────────────
  function attachReveal(){
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(e=> io.observe(e));
  }

  // ── 2) magnetic buttons ──────────────────────────────────────────
  function attachMagnets(){
    const targets = document.querySelectorAll(".btn-ink, .btn-ghost");
    targets.forEach(el=>{
      if (el.__mag) return;
      el.__mag = true;
      el.style.willChange = "transform";
      const onMove = (e)=>{
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width/2);
        const y = e.clientY - (r.top  + r.height/2);
        el.style.transform = `translate(${x*0.18}px, ${y*0.22}px)`;
      };
      const onLeave = ()=> { el.style.transform = ""; };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    });
  }

  // Re-run on DOM mutations (React mounts)
  let raf = 0;
  const run = ()=> { cancelAnimationFrame(raf); raf = requestAnimationFrame(()=>{ attachReveal(); attachMagnets(); }); };
  const mo = new MutationObserver(run);
  mo.observe(document.documentElement, { childList:true, subtree:true });
  document.addEventListener("DOMContentLoaded", run);
  setTimeout(run, 400);
})();

// ── 3) <CountUp/> — eases a number from 0 → target when scrolled into view ─
function CountUp({ to=100, duration=1600, suffix="", className="" }){
  const ref = React.useRef(null);
  const [n,setN] = React.useState(0);
  const [started,setStarted] = React.useState(false);

  React.useEffect(()=>{
    if (!ref.current || started) return;
    const io = new IntersectionObserver((ents)=>{
      if (ents.some(e=>e.isIntersecting)) { setStarted(true); io.disconnect(); }
    }, { threshold: .35 });
    io.observe(ref.current);
    return ()=> io.disconnect();
  }, [started]);

  React.useEffect(()=>{
    if (!started) return;
    const t0 = performance.now();
    let raf;
    const tick = (t)=>{
      const p = Math.min(1, (t - t0) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(raf);
  }, [started, to, duration]);

  const fmt = new Intl.NumberFormat("en-US").format(n);
  return <span ref={ref} className={className}>{fmt}{suffix}</span>;
}
window.CountUp = CountUp;

// ── 4) <SplitHeadline/> — staggered word reveal on mount ─────────────
function SplitHeadline({ children, className="" }){
  // children is expected to be a string or array of strings/JSX runs
  const ref = React.useRef(null);
  React.useEffect(()=>{
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll(".sh-word");
    words.forEach((w,i)=>{
      w.style.transitionDelay = `${60 + i*55}ms`;
      requestAnimationFrame(()=> w.classList.add("is-in"));
    });
  },[]);
  // Walk children — if a text node, split by spaces and wrap each word
  const wrap = (node, key)=>{
    if (typeof node === "string") {
      return node.split(/(\s+)/).map((part,i)=>{
        if (/^\s+$/.test(part)) return part;
        return <span key={`${key}-${i}`} className="sh-word">{part}</span>;
      });
    }
    if (Array.isArray(node)) return node.map((c,i)=> wrap(c, `${key}-${i}`));
    if (React.isValidElement(node)) {
      return React.cloneElement(node, { key, children: wrap(node.props.children, key+"c") });
    }
    return node;
  };
  return <span ref={ref} className={className}>{wrap(children, "w")}</span>;
}
window.SplitHeadline = SplitHeadline;
