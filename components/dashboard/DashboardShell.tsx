import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Trimmed to 4 top-level tabs. Sub-pages (Timer, Tasks, Rooms, Profile)
// are still reachable by deep link or from inside the tabs they belong to.
const dashboardLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Stats", href: "/dashboard/stats" },
  { label: "Shop", href: "/dashboard/rewards" },
  { label: "Settings", href: "/dashboard/settings" }
];

export async function DashboardShell({
  children,
  title,
  subtitle,
  profile: profileProp,
  bg = "cream"
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  profile?: Profile | null;
  bg?: "cream" | "green";
}) {
  // Resolve profile + coins server-side so every dashboard page shows the live balance
  const session = await requireUser();
  const profile = profileProp ?? session.profile;
  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase
    .from("user_settings")
    .select("coins")
    .eq("user_id", session.user.id)
    .single();
  const coins = settings?.coins ?? 0;

  const isAdmin = profile?.role === "admin";
  const initial = (profile?.display_name || profile?.email || "?").charAt(0).toUpperCase();

  const mainBg =
    bg === "green"
      ? "min-h-screen bg-gradient-to-b from-[#dfead2] via-[#cfe0c2] to-[#bbd3ad]"
      : "min-h-screen bg-cream-100";
  const headerBg =
    bg === "green"
      ? "border-b border-ink-900/10 bg-[#dfead2]/85 backdrop-blur"
      : "border-b border-ink-900/10 bg-cream-50/90 backdrop-blur";

  return (
    <main className={mainBg}>
      <header className={headerBg}>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className="inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-700 hover:text-ink-900"
              >
                <span aria-hidden>←</span> Back to site
              </Link>
              <Link href="/dashboard" className="font-display text-2xl text-ink-900">
                StudyPuff
              </Link>
            </div>
            <Link
              href="/dashboard/rewards"
              className="hidden items-center gap-2 rounded-full border border-ink-900/10 bg-brand-butter px-3 py-1.5 text-sm font-semibold text-ink-900 shadow-soft transition hover:-translate-y-0.5 sm:inline-flex"
              aria-label={`${coins} coins — open rewards`}
            >
              <span aria-hidden>🪙</span>
              {coins}
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-ink-700 hover:text-ink-900"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="nav-link text-ink-700">
                Admin
              </Link>
            )}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-cream-50 py-1 pl-1 pr-3 hover:bg-cream-100"
            >
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-brand-butter text-xs font-semibold text-ink-900">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </span>
              <span className="text-ink-900">{profile?.display_name || profile?.email}</span>
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
        {title || subtitle ? (
          <div className="mb-8">
            {title && (
              <h1 className="font-display text-3xl text-ink-900 md:text-4xl">{title}</h1>
            )}
            {subtitle && <p className="mt-2 max-w-2xl text-ink-700">{subtitle}</p>}
          </div>
        ) : null}
        {children}
      </section>
    </main>
  );
}
