import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { HeaderAvatarButton } from "@/components/dashboard/HeaderAvatarButton";
import { HeaderActions } from "@/components/dashboard/HeaderActions";
import { requireUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Top nav tabs are intentionally minimal: the StudyPuff wordmark links
// home, the coin pill opens the Shop, and the in-timer chart icon opens
// the Stats overlay — so we don't double-up with redundant tabs.

export async function DashboardShell({
  children,
  title,
  subtitle,
  profile: profileProp,
  bg = "cream",
  fullBleed = false
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  profile?: Profile | null;
  bg?: "cream" | "green";
  /** When true, content area takes the full viewport width with no max-w cap.
      The dashboard home uses this so the side rails can stick to the edges. */
  fullBleed?: boolean;
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
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-5 px-6 py-5 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-10 2xl:px-14">
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
          {/* Center column — Rooms / Stats / Settings entries.
              Only on the dashboard background (green); the cream sub-pages
              skip them to keep their headers calm. */}
          <div className="hidden justify-self-center lg:flex">
            {bg === "green" && <HeaderActions />}
          </div>
          <nav className="flex flex-wrap items-center justify-self-end gap-3 text-sm">
            {isAdmin && (
              <Link href="/admin" className="nav-link text-ink-700">
                Admin
              </Link>
            )}
            <HeaderAvatarButton
              displayName={profile?.display_name ?? null}
              email={profile?.email ?? ""}
              avatarUrl={profile?.avatar_url ?? null}
              initial={initial}
            />
            <LogoutButton />
          </nav>
        </div>
      </header>

      <section
        className={
          fullBleed
            ? "w-full"
            : "mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-10 2xl:px-14"
        }
      >
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
