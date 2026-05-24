import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GardenScene } from "@/components/dashboard/GardenScene";
import { GardenShop } from "@/components/dashboard/GardenShop";
import { requireUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function GardenPage() {
  const { user, profile } = await requireUser();
  const supabase = createSupabaseServerClient();

  const today = new Date();
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 13);

  const [{ data: settings }, { data: purchases }, { data: sessions }] = await Promise.all([
    supabase
      .from("user_settings")
      .select("coins, lifetime_focus_minutes, equipped_sound, equipped_theme, equipped_accessory")
      .eq("user_id", user.id)
      .single(),
    supabase.from("user_purchases").select("item_id").eq("user_id", user.id),
    supabase
      .from("study_sessions")
      .select("minutes, mode, studied_on")
      .eq("user_id", user.id)
      .eq("mode", "focus")
      .gte("studied_on", isoDate(fourteenDaysAgo))
  ]);

  const lifetimeMinutes = settings?.lifetime_focus_minutes ?? 0;
  const todayIso = isoDate(today);
  const todayMinutes = (sessions || [])
    .filter((s) => s.studied_on === todayIso)
    .reduce((a, s) => a + s.minutes, 0);

  // 14-day streak: walk back from today, stop at the first day with zero focus.
  let streak = 0;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const has = (sessions || []).some((s) => s.studied_on === iso && s.minutes > 0);
    if (has) streak++;
    else if (i === 0) continue;
    else break;
  }

  const ownedItemIds = (purchases || []).map((p) => p.item_id);

  return (
    <DashboardShell profile={profile} bg="scene" fullBleed>
      <div className="mx-auto w-full max-w-[1100px] px-6 pb-16 pt-2 lg:px-10">
        <header className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-ink-700/80">Your garden</p>
          <h1 className="mt-1 font-display text-3xl italic text-ink-900 md:text-4xl">Tend it with every focused minute.</h1>
          <p className="mt-1 text-sm text-ink-700">
            Your tree grows a leaf every 25 minutes of focus. Spend coins below to add cottages, ponds, lanterns and more — they appear in your scene right away.
          </p>
        </header>

        <GardenScene
          lifetimeMinutes={lifetimeMinutes}
          todayMinutes={todayMinutes}
          streak={streak}
          ownedItemIds={ownedItemIds}
        />

        <div className="mt-10">
          <GardenShop
            coins={settings?.coins ?? 0}
            lifetimeMinutes={lifetimeMinutes}
            ownedItemIds={ownedItemIds}
            equippedSound={settings?.equipped_sound ?? null}
            equippedTheme={settings?.equipped_theme ?? null}
            equippedAccessory={settings?.equipped_accessory ?? null}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
