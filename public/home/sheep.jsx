// Sheep mascot — original simple illustration (no copyrighted character).
// A puffy cloud body, two ears, soft face, and a sleep-cap detail.
function Sheep({ size=160, tone="#fdfbf7", earTone="#1f1f1f", className="", style={} }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} style={style} aria-hidden>
      {/* cap */}
      <path d="M70 64 C 84 24, 130 26, 138 60 L 138 70 L 70 70 Z" fill="#c97f72"/>
      <circle cx="138" cy="56" r="8" fill="#fdfbf7"/>
      {/* puffy body */}
      <g fill={tone} stroke="#1f1f1f" strokeWidth="2.4">
        <circle cx="62" cy="92" r="22"/>
        <circle cx="138" cy="92" r="22"/>
        <circle cx="46" cy="118" r="22"/>
        <circle cx="154" cy="118" r="22"/>
        <circle cx="74" cy="140" r="22"/>
        <circle cx="126" cy="140" r="22"/>
        <circle cx="100" cy="148" r="24"/>
        <circle cx="100" cy="112" r="32"/>
      </g>
      {/* ears */}
      <ellipse cx="74" cy="90" rx="9" ry="14" transform="rotate(-22 74 90)" fill={earTone}/>
      <ellipse cx="126" cy="90" rx="9" ry="14" transform="rotate(22 126 90)" fill={earTone}/>
      {/* face — under cap brim */}
      <g fill="#1f1f1f">
        <circle cx="88" cy="112" r="3.2"/>
        <circle cx="112" cy="112" r="3.2"/>
        {/* blush */}
      </g>
      <ellipse cx="84" cy="122" rx="6" ry="3" fill="#f3c6c2" opacity=".75"/>
      <ellipse cx="116" cy="122" rx="6" ry="3" fill="#f3c6c2" opacity=".75"/>
      {/* tiny smile */}
      <path d="M94 124 Q 100 130 106 124" fill="none" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/>
      {/* feet */}
      <rect x="84" y="172" width="10" height="14" rx="3" fill="#1f1f1f"/>
      <rect x="106" y="172" width="10" height="14" rx="3" fill="#1f1f1f"/>
    </svg>
  );
}

// Tiny "peeking" sheep — head only, for margins
function SheepPeek({ size=72, className="", style={} }) {
  return (
    <svg viewBox="0 0 120 100" width={size} height={size*0.83} className={className} style={style} aria-hidden>
      <g fill="#fdfbf7" stroke="#1f1f1f" strokeWidth="2.4">
        <circle cx="60" cy="60" r="38"/>
        <circle cx="30" cy="58" r="14"/>
        <circle cx="90" cy="58" r="14"/>
        <circle cx="60" cy="34" r="14"/>
      </g>
      <ellipse cx="42" cy="48" rx="5" ry="8" transform="rotate(-22 42 48)" fill="#1f1f1f"/>
      <ellipse cx="78" cy="48" rx="5" ry="8" transform="rotate(22 78 48)" fill="#1f1f1f"/>
      <circle cx="50" cy="64" r="2.4" fill="#1f1f1f"/>
      <circle cx="70" cy="64" r="2.4" fill="#1f1f1f"/>
      <ellipse cx="46" cy="72" rx="4" ry="2" fill="#f3c6c2" opacity=".8"/>
      <ellipse cx="74" cy="72" rx="4" ry="2" fill="#f3c6c2" opacity=".8"/>
      <path d="M54 74 Q 60 79 66 74" fill="none" stroke="#1f1f1f" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

window.Sheep = Sheep;
window.SheepPeek = SheepPeek;
