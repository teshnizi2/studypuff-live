import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function AdminShell({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <main className="min-h-screen bg-[#181512] text-cream-50">
      <header className="border-b border-white/10 bg-[#181512]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <Link href="/admin" className="font-display text-3xl">
            StudyPuff Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/admin" className="nav-link text-cream-100">
              Overview
            </Link>
            <Link href="/admin/users" className="nav-link text-cream-100">
              Users
            </Link>
            <Link href="/dashboard" className="nav-link text-cream-100">
              User dashboard
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-butter">
          Operations
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-cream-200">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
