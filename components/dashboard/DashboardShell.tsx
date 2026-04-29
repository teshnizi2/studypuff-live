import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

const dashboardLinks = [
  { label: "Overview", href: "/dashboard" },
  { label: "Timer", href: "/dashboard/timer" },
  { label: "Tasks", href: "/dashboard/tasks" },
  { label: "Settings", href: "/dashboard/settings" }
];

export function DashboardShell({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <main className="min-h-screen bg-cream-100">
      <header className="border-b border-ink-900/10 bg-cream-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <Link href="/" className="font-display text-3xl text-ink-900">
            StudyPuff
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            {dashboardLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link text-ink-700">
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="nav-link text-ink-700">
              Admin
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
            Study workspace
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink-900 md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-ink-700">{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
