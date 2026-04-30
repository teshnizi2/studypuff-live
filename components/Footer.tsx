import Link from "next/link";

const SOCIAL = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@StudyPuffAcademy",
    d: "M17.8 3.4c0-1.6-1.1-2.8-2.5-2.8C13.3.5 11.4.4 9.4.4H8.8C6.8.4 4.8.5 2.9.6c-1.4 0-2.5 1.2-2.5 2.8C.3 4.6.3 5.9.3 7.1c0 1.2 0 2.5.1 3.7 0 1.6 1.1 2.8 2.6 2.8 2 .1 4 .1 6.1.1 2.1 0 4.2 0 6.2-.1 1.4 0 2.5-1.2 2.5-2.8.1-1.2.1-2.5.1-3.7 0-1.3 0-2.5-.1-3.7ZM7.3 10.3V3.8l4.8 3.3-4.8 3.2Z"
  },
  {
    label: "Twitch",
    href: "https://www.twitch.tv/studypuffacademy",
    d: "M2 0L0 4v14h6v3h3l3-3h5l5-5V0H2zm17 12l-3 3h-5l-3 3v-3H4V2h15v10zM15 5h-2v6h2V5zm-5 0H8v6h2V5z"
  },
  {
    label: "Discord",
    href: "https://discord.gg/hb8bKpbjEz",
    d: "M15.95 1.46A14.4 14.4 0 0 0 12.4.36a.05.05 0 0 0-.06.03c-.15.27-.32.62-.43.9a13.3 13.3 0 0 0-3.97 0 9.6 9.6 0 0 0-.44-.9.05.05 0 0 0-.05-.03 14.3 14.3 0 0 0-3.55 1.1.05.05 0 0 0-.03.02C1.55 4.8.93 8.04 1.23 11.25c0 .02.01.03.03.04a14.5 14.5 0 0 0 4.36 2.2.05.05 0 0 0 .06-.02c.34-.46.64-.95.9-1.46a.05.05 0 0 0-.03-.07 9.5 9.5 0 0 1-1.36-.65.05.05 0 0 1-.01-.08l.27-.21a.05.05 0 0 1 .05-.01 10.4 10.4 0 0 0 8.84 0 .05.05 0 0 1 .05.01l.27.21a.05.05 0 0 1-.01.08c-.43.25-.89.47-1.36.65a.05.05 0 0 0-.03.07c.27.51.57 1 .91 1.46a.05.05 0 0 0 .06.02 14.5 14.5 0 0 0 4.37-2.2.05.05 0 0 0 .02-.04c.36-3.66-.62-6.86-2.6-9.77a.04.04 0 0 0-.02-.02zM6.68 9.31c-.86 0-1.57-.79-1.57-1.76 0-.96.69-1.75 1.57-1.75.88 0 1.59.8 1.57 1.75 0 .97-.69 1.76-1.57 1.76zm5.81 0c-.86 0-1.57-.79-1.57-1.76 0-.96.69-1.75 1.57-1.75.88 0 1.59.8 1.57 1.75 0 .97-.69 1.76-1.57 1.76z"
  }
];

const COLUMNS = [
  {
    title: "Learn",
    items: [
      { label: "Study with us", href: "/study" },
      { label: "StudyPuff App", href: "/dashboard" },
      { label: "Workshops", href: "/workshops" },
      { label: "Free Resources", href: "/resources" },
      { label: "Store", href: "/store" }
    ]
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" }
    ]
  },
  {
    title: "Policies",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" }
    ]
  }
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-900/10 bg-cream-100">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-2xl text-ink-900">
              StudyPuff
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-700">
              Science-based study workshops, free livestreams, and a kinder way to do
              school.
            </p>
            <ul className="mt-6 flex gap-3">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`StudyPuffAcademy on ${s.label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-50 text-ink-900 transition hover:-translate-y-0.5 hover:bg-brand-butter"
                  >
                    <svg width="18" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d={s.d} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-lg text-ink-900">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.items.map((i) => (
                  <li key={i.label}>
                    <Link
                      href={i.href}
                      className="nav-link text-sm text-ink-700 hover:text-ink-900"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-ink-900/10 pt-6 text-sm text-ink-700 sm:flex-row sm:items-center">
          <p>© {year}, StudyPuff Academy</p>
          <p>Made with care · Leiden</p>
        </div>
      </div>
    </footer>
  );
}
