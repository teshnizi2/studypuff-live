function Header() {
  const [open,setOpen] = React.useState(false);
  const NAV = [
    { label:"Home",            href:"/" },
    { label:"Study with us",   href:"/study" },
    { label:"StudyPuff App",   href:"/dashboard" },
    { label:"Workshops",       href:"/workshops" },
    { label:"Free Resources",  href:"/resources" },
    { label:"Store",           href:"/store" },
    { label:"About",           href:"/about" },
    { label:"FAQ",             href:"/faq" },
    { label:"Contact",         href:"/contact" }
  ];
  const path = (typeof location !== "undefined" ? location.pathname : "/") || "/";
  const isActive = (href) => {
    const h = href.split("#")[0];
    if (h === "/") return path === "/";
    return path === h || path.startsWith(h + "/");
  };
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-[rgba(239,236,236,0.88)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-6 py-3 lg:px-12">
        <a href="/" className="flex shrink-0 items-center" aria-label="StudyPuff Academy">
          <img src="/studypuff-logo-sm.png" alt="StudyPuff Academy"
               className="h-14 w-auto object-contain lg:h-16"/>
        </a>

        {/* desktop nav */}
        <nav className="hidden flex-1 justify-center gap-6 text-[14px] xl:gap-7 lg:flex">
          {NAV.map((n,i) => (
            <a
              key={n.label}
              href={n.href}
              data-active={isActive(n.href) ? "true" : "false"}
              className={`nav-link transition ${isActive(n.href) ? "font-semibold text-ink-900" : "text-ink-900/80 hover:text-ink-900"}`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* auth */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a href="/coming-soon"    className="text-[14px] text-ink-700 hover:text-ink-900">Sign in</a>
          <a href="/coming-soon" className="btn-ink !py-2 !px-4 !text-[13px]">Get started <I.arrow/></a>
        </div>

        <button className="ml-auto lg:hidden" onClick={()=>setOpen(o=>!o)} aria-label="Menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
          </svg>
        </button>
      </div>

      {/* mobile */}
      {open && (
        <div className="border-t border-ink-900/10 px-6 py-5 lg:hidden bg-cream-100">
          <div className="mb-4 flex gap-2">
            <a href="/coming-soon"    className="btn-ghost flex-1 !py-2">Sign in</a>
            <a href="/coming-soon" className="btn-ink flex-1 !py-2">Get started</a>
          </div>
          <ul className="divide-y divide-ink-900/10 border-y border-ink-900/10">
            {NAV.map(n=> (
              <li key={n.label}>
                <a href={n.href} className="block py-3 text-[15px] text-ink-900">{n.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
window.Header = Header;
