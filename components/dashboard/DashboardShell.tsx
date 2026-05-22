import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { HeaderAvatarButton } from "@/components/dashboard/HeaderAvatarButton";
import { Greeting } from "@/components/dashboard/Greeting";
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
  bg?: "cream" | "green" | "scene";
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

  const layoutBase = "lg:flex lg:h-screen lg:min-h-0 lg:flex-col lg:overflow-hidden";
  const mainBg =
    bg === "scene"
      ? `min-h-screen bg-transparent ${layoutBase}`
      : bg === "green"
        ? `min-h-screen bg-gradient-to-b from-[#dfead2] via-[#cfe0c2] to-[#bbd3ad] ${layoutBase}`
        : `min-h-screen bg-cream-100 ${layoutBase}`;
  const headerBg =
    bg === "scene"
      ? "border-b border-white/40 bg-cream-50/55 backdrop-blur-md lg:flex-shrink-0"
      : bg === "green"
        ? "border-b border-ink-900/10 bg-[#dfead2]/85 backdrop-blur lg:flex-shrink-0"
        : "border-b border-ink-900/10 bg-cream-50/90 backdrop-blur lg:flex-shrink-0";

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
              className="group hidden items-center gap-1.5 rounded-full border border-amber-300/60 bg-gradient-to-b from-brand-butter to-[#f1d585] px-3.5 py-1.5 text-sm font-semibold text-ink-900 shadow-[0_6px_16px_-8px_rgba(176,134,38,0.65),inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_11px_22px_-8px_rgba(176,134,38,0.8),inset_0_1px_0_rgba(255,255,255,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 sm:inline-flex"
              aria-label={`${coins} coins — open rewards`}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[18deg]"
              >
                <circle cx="12" cy="12" r="10" fill="#e9b84a" stroke="#c79126" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="6.5" fill="none" stroke="#f4d685" strokeWidth="1.5" />
                <path d="M12 8.2v7.6M9.6 9.6c0-1 1-1.6 2.4-1.6s2.4.6 2.4 1.6-1 1.4-2.4 1.4-2.4.5-2.4 1.5 1 1.6 2.4 1.6 2.4-.6 2.4-1.6" fill="none" stroke="#8a5e12" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span className="tabular-nums">{coins}</span>
            </Link>
          </div>
          {/* Center column — a quiet, time-aware greeting. The dashboard's
              panels are reached from the slim FocusRail on the left edge. */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <Greeting name={profile?.display_name ?? null} />
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
            ? "w-full lg:flex-1 lg:min-h-0 lg:overflow-hidden"
            : "mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-10 2xl:px-14 lg:flex-1 lg:min-h-0 lg:overflow-y-auto"
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
