// Tiny inline icon set — only what the home uses. Keeps weight off lucide.
const I = {
  arrow: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  ),
  arrowDR: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 7l10 10M9 17h8V9"/>
    </svg>
  ),
  yt: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}>
      <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.4 12 31 31 0 0 0 23 7.5zM10 15V9l5 3z"/>
    </svg>
  ),
  twitch: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}>
      <path d="M4 2L2 6v14h6v3h3l3-3h4l5-5V2H4zm17 11l-3 3h-5l-3 3v-3H6V4h15v9zm-5-7h-2v6h2V6zm-5 0H9v6h2V6z"/>
    </svg>
  ),
  discord: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}>
      <path d="M20 4.5a17 17 0 0 0-4.2-1.3l-.2.4a15 15 0 0 0-4.6 0l-.2-.4A17 17 0 0 0 6.6 4.5C3.5 9 2.7 13.4 3.1 17.8a17 17 0 0 0 5.2 2.6l1.1-1.6a11 11 0 0 1-1.8-.9l.4-.3a12 12 0 0 0 10.4 0l.4.3a11 11 0 0 1-1.8.9l1.1 1.6a17 17 0 0 0 5.2-2.6c.4-5.3-.7-9.7-3.3-13.3zM9.5 14.8c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2zm5 0c-1 0-1.9-1-1.9-2.2s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.2-1.9 2.2z"/>
    </svg>
  ),
  ig: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  plus: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  pin: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/>
    </svg>
  ),
  clock: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...p}>
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  star: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}>
      <path d="M12 2l2.6 6.5L21 9.6l-5 4.5L17.4 21 12 17.6 6.6 21 8 14.1l-5-4.5 6.4-1.1z"/>
    </svg>
  ),
  asterisk: (p={}) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...p}>
      <path d="M12 3v18M4 7l16 10M4 17l16-10"/>
    </svg>
  )
};
window.I = I;
