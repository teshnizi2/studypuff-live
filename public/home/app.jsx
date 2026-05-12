// Root — wires sections + Tweaks panel
const { useEffect } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "default",
  "palette": "warm",
  "showRibbon": true,
  "showManifesto": true,
  "showVoices": true,
  "showSchedule": true,
  "heroVariant": "almanac",
  "mascotEverywhere": true
}/*EDITMODE-END*/;

const PALETTES = {
  warm:  { pink:"#f3c6c2", peach:"#f6d4b7", butter:"#fbe9a5", mint:"#c7e2c7", sky:"#c6dceb", lilac:"#d9cdea", rust:"#c97f72" },
  earth: { pink:"#e9b9a7", peach:"#d9b48a", butter:"#e9d28a", mint:"#aac9a4", sky:"#a8c0d3", lilac:"#bdaecf", rust:"#9a5a4d" },
  pastel:{ pink:"#fbd7d3", peach:"#fde2c8", butter:"#fef0b8", mint:"#d8eed8", sky:"#d8eaf3", lilac:"#e6dcf2", rust:"#d68b7e" },
  mono:  { pink:"#e7e2d8", peach:"#e7e2d8", butter:"#efe9da", mint:"#dadfd6", sky:"#dbe1e6", lilac:"#dfdde3", rust:"#7d6a64" }
};

function App(){
  const [t, setTweak] = useTweaks(DEFAULTS);

  // density on body
  useEffect(()=>{
    document.body.setAttribute("data-density", t.density);
  }, [t.density]);

  // palette swap via CSS vars
  useEffect(()=>{
    const p = PALETTES[t.palette] || PALETTES.warm;
    const css = `
      .bg-brand-pink{background:${p.pink}!important}
      .bg-brand-peach{background:${p.peach}!important}
      .bg-brand-butter{background:${p.butter}!important}
      .bg-brand-mint{background:${p.mint}!important}
      .bg-brand-sky{background:${p.sky}!important}
      .bg-brand-lilac{background:${p.lilac}!important}
      .text-brand-rust{color:${p.rust}!important}
      .decoration-brand-rust{text-decoration-color:${p.rust}!important}
    `;
    let s = document.getElementById("__palette");
    if (!s) { s = document.createElement("style"); s.id = "__palette"; document.head.appendChild(s); }
    s.textContent = css;
  }, [t.palette]);

  return (
    <div className="paper-grain relative">
      <Header/>
      <Hero/>
      {t.showRibbon    && <Ribbon/>}
      {t.showSchedule  && <ThisWeek/>}
      <InsideApp/>
      {t.showManifesto && <Manifesto/>}
      {t.showVoices    && <Voices/>}
      <Closing/>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Look & feel">
          <TweakSelect label="Palette" value={t.palette} onChange={v=>setTweak("palette", v)}
            options={[
              {value:"warm",  label:"Warm pastels (default)"},
              {value:"earth", label:"Earthy"},
              {value:"pastel",label:"Lighter pastels"},
              {value:"mono",  label:"Quiet / mono"}
            ]}/>
          <TweakRadio label="Density" value={t.density} onChange={v=>setTweak("density", v)}
            options={[{value:"compact",label:"Compact"},{value:"default",label:"Default"},{value:"airy",label:"Airy"}]}/>
        </TweakSection>
        <TweakSection label="Sections">
          <TweakToggle label="Live ribbon"       value={t.showRibbon}    onChange={v=>setTweak("showRibbon", v)}/>
          <TweakToggle label="This week spread"  value={t.showSchedule}  onChange={v=>setTweak("showSchedule", v)}/>
          <TweakToggle label="Manifesto"         value={t.showManifesto} onChange={v=>setTweak("showManifesto", v)}/>
          <TweakToggle label="Letters / voices"  value={t.showVoices}    onChange={v=>setTweak("showVoices", v)}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
