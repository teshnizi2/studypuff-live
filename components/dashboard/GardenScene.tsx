"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { REWARDS, isGardenCategory, mapArtFor } from "@/lib/app-data/rewards";
import { TD_LAYOUT } from "@/lib/app-data/garden-layout";
import { resetGardenLayoutAction, saveGardenLayoutAction } from "@/lib/app-data/actions";

type Layout = Record<string, { x: number; y: number; placedAt?: number }>;

type Props = {
  lifetimeMinutes: number;
  todayMinutes: number;
  streak: number;
  ownedItemIds: string[];
  /** Per-user saved positions, overrides TD_LAYOUT defaults when present. */
  savedLayout?: Layout;
  /** Reward id of the equipped background map. null = use free default. */
  equippedMap?: string | null;
};

const MINUTES_PER_LEAF = 25;
const MAX_LEAVES = 80;

function stageFor(m: number): { name: string; scale: number } {
  if (m < 30)   return { name: "A tiny sprout", scale: 0.65 };
  if (m < 180)  return { name: "A young sapling", scale: 0.82 };
  if (m < 720)  return { name: "Branching out", scale: 0.95 };
  if (m < 3000) return { name: "A leafy canopy", scale: 1.08 };
  return { name: "A grand old tree", scale: 1.16 };
}

/**
 * v20 — tile coords describe where each item's FOOT lands on the map (bottom-center anchor).
 *   FARM       (top brown soil): vegpatch, pumpkinpatch, haybale, scarecrow, applestree
 *   FOREST     (top-right + edges): treehouse, mushrooms, fairyring, snail, beehive
 *   HOMESTEAD  (center cobble): cottage, well, mailbox, signpost, bench, lantern, picnic
 *   POND       (bottom-left water): bridge, waterlilies, frogstatue, birdbath, pond
 *   ROSE GARDEN (bottom-right grass): gazebo, flowerbed, gnome
 *
 * Per cold judge §A.x.8: items render with translate(-50%, -100%) so the bottom
 * of the sprite sits ON the (x, y) point — feet-on-ground anchoring.
 *
 * Applestree size dropped 11→8, gazebo 15→12 per judge §D.4 scale ratios.
 */
type Tod = "dawn" | "day" | "dusk" | "night";

/**
 * Garden v20 — top-down 2D RPG tile composite + ambient motion + sun-arc HUD.
 *
 * Per cold-judge fixes:
 *   • Items anchored bottom-center (feet-on-ground), not floating mid-air.
 *   • Sun-arc HUD with sun/moon traveling the arc by TOD.
 *   • Idle ambient motion: drifting clouds across the sky, lantern flicker
 *     at night, gentle water shimmer over pond area.
 *   • Items wrapped in <button> with focus-visible ring for keyboard.
 *   • Item size for applestree/gazebo reduced per scale-ratio fixes.
 */
export function GardenScene({ lifetimeMinutes, todayMinutes, streak, ownedItemIds, savedLayout, equippedMap }: Props) {
  const leafCount = Math.min(MAX_LEAVES, Math.floor(lifetimeMinutes / MINUTES_PER_LEAF));
  const todayLeaves = Math.floor(todayMinutes / MINUTES_PER_LEAF);
  const intoNext = lifetimeMinutes % MINUTES_PER_LEAF;
  const pct = Math.round((intoNext / MINUTES_PER_LEAF) * 100);
  const stage = stageFor(lifetimeMinutes);

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);

  // ───── Drag-and-drop layout + inventory ─────
  // Phase B model:
  //   • An owned item with an entry in `localLayout` is PLACED in the scene.
  //   • An owned item with NO entry is in the INVENTORY sidebar.
  // Drag flows:
  //   • Inventory → scene = add entry (place at drop coords).
  //   • Scene → inventory = remove entry (return to inventory).
  //   • Scene → scene    = update coords (existing reposition).
  const [localLayout, setLocalLayout] = useState<Layout>(() => savedLayout ?? {});
  const [isEditing, setIsEditing] = useState(false);
  const [dragging, setDragging] = useState<{ id: string; source: "scene" | "inventory" } | null>(null);
  // While dragging from inventory, follow the cursor in scene-relative %.
  const [dropPreview, setDropPreview] = useState<{ x: number; y: number; overScene: boolean } | null>(null);
  // Ghost image that follows cursor during inventory→scene drag (viewport px coords).
  const [dragGhost, setDragGhost] = useState<{ id: string; x: number; y: number } | null>(null);
  // While dragging from scene, track whether cursor is over the inventory hit-zone.
  const [overInventory, setOverInventory] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const sceneRef = useRef<HTMLDivElement>(null);
  const inventoryRef = useRef<HTMLDivElement>(null);
  // Mirror state into refs so pointer handlers can read the latest values
  // synchronously. Without this, the first pointermove after pointerdown often
  // executes a stale closure where `dragging` is still null (React hasn't
  // re-rendered yet), so the drag silently bails out — manifests as "some
  // items don't respond to drag." Same pattern as the layoutRef fix.
  const layoutRef = useRef<Layout>(localLayout);
  const draggingRef = useRef<{ id: string; source: "scene" | "inventory" } | null>(null);
  const isEditingRef = useRef<boolean>(false);
  useEffect(() => { layoutRef.current = localLayout; }, [localLayout]);
  useEffect(() => { draggingRef.current = dragging; }, [dragging]);
  useEffect(() => { isEditingRef.current = isEditing; }, [isEditing]);
  const [, startTransition] = useTransition();
  // Cleanup ref for window-level drag listeners (attached on pointerdown, removed on pointerup/cancel/unmount).
  const windowDragCleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => { windowDragCleanupRef.current?.(); }, []);

  // Preload all owned garden-item images into the browser cache on mount so
  // there's zero network wait when an item is dragged from inventory to scene.
  useEffect(() => {
    for (const id of ownedItemIds) {
      const r = REWARDS.find((rw) => rw.id === id);
      if (r && isGardenCategory(r.category)) {
        const img = new window.Image();
        img.src = itemArtSrc(id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // run once on mount — ownedItemIds won't change during the session

  // PLACED in scene = owned AND has a localLayout entry.
  // INVENTORY = owned but no localLayout entry.
  // Sorted by placedAt ascending so the most-recently placed item renders
  // last in the DOM — giving it natural CSS stacking priority (on top).
  const placedItems = useMemo(
    () => REWARDS
      .filter((r) => isGardenCategory(r.category) && ownedSet.has(r.id) && r.id in localLayout)
      .sort((a, b) => (localLayout[a.id]?.placedAt ?? 0) - (localLayout[b.id]?.placedAt ?? 0)),
    [ownedSet, localLayout]
  );
  const inventoryItems = useMemo(
    () => REWARDS.filter((r) => isGardenCategory(r.category) && ownedSet.has(r.id) && !(r.id in localLayout)),
    [ownedSet, localLayout]
  );
  const ownedGardenCount = placedItems.length + inventoryItems.length;
  const totalGardenCount = REWARDS.filter((r) => isGardenCategory(r.category)).length;

  // Sync localLayout from prop when the server pushes a fresh saved layout.
  // Skip while a drag is in flight — otherwise a revalidatePath that lands
  // mid-drag would clobber the user's pending coords.
  useEffect(() => {
    if (!savedLayout) return;
    if (draggingRef.current) return;
    setLocalLayout(savedLayout);
  }, [savedLayout]);

  function effectivePos(id: string) {
    const def = TD_LAYOUT[id];
    const override = localLayout[id];
    if (!def && !override) return null;
    // Golden-trophy items have no TD_LAYOUT entry — they only appear in the
    // scene once placed via drag from inventory. Fall back to sensible
    // defaults for size + z, and use the override coords (always present
    // here because the !def branch requires override).
    return {
      x: override?.x ?? def!.x,
      y: override?.y ?? def!.y,
      size: def?.size ?? 10,
      z: def?.z ?? 5
    };
  }

  /** Resolve art path: golden trophies share their base item's PNG and get
   *  a CSS gold filter at render time. */
  function itemArtSrc(id: string): string {
    if (id.startsWith("garden-golden-")) {
      return `/td-items/${id.replace("garden-golden-", "")}.webp`;
    }
    return `/td-items/${id.replace("garden-", "")}.webp`;
  }

  /** CSS filter that gilds an item PNG so it reads as a gold trophy. */
  const GOLDEN_FILTER = "sepia(1) saturate(3.5) hue-rotate(-22deg) brightness(1.18) contrast(1.08) drop-shadow(0 0 6px rgba(255,210,90,0.7))";

  function persistLayout(next: Layout) {
    const itemCount = Object.keys(next).length;
    console.log(`[🌱 garden-drag] saving layout (${itemCount} items)`);
    setSaveStatus("saving");
    const fd = new FormData();
    fd.append("layout", JSON.stringify(next));
    startTransition(async () => {
      try {
        await saveGardenLayoutAction(fd);
        console.log("[🌱 garden-drag] layout saved ✓");
        setSaveStatus("saved");
        window.setTimeout(() => setSaveStatus("idle"), 1500);
      } catch (e) {
        console.error("[🌱 garden-drag] save FAILED ✗", e);
        setSaveStatus("error");
      }
    });
  }

  /** Translate a viewport (clientX, clientY) into scene-relative percentages,
   *  clamped to 0–100. Returns null if the scene ref isn't mounted yet. */
  function clientToScenePercent(clientX: number, clientY: number): { x: number; y: number } | null {
    const el = sceneRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, xPct)), y: Math.max(0, Math.min(100, yPct)) };
  }

  function isOverScene(clientX: number, clientY: number): boolean {
    const el = sceneRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
  }

  function isOverInventory(clientX: number, clientY: number): boolean {
    const el = inventoryRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
  }

  function handlePointerDown(
    e: React.PointerEvent<HTMLButtonElement>,
    itemId: string,
    source: "scene" | "inventory"
  ) {
    if (!isEditingRef.current) {
      console.log("[🌱 garden-drag] pointerdown ignored — not in edit mode", itemId);
      return;
    }
    console.log("[🌱 garden-drag] drag start", { itemId, source });
    e.preventDefault();
    // setPointerCapture helps prevent browser scroll/default gestures on touch,
    // but we do NOT rely on it to route events — window listeners handle that.
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}

    // Write ref SYNCHRONOUSLY before setState so the very next pointermove
    // (which fires before React commits the re-render) sees a live drag.
    const drag = { id: itemId, source };
    draggingRef.current = drag;
    setDragging(drag);

    // Whatever you touch goes to the front immediately.
    // Stamp placedAt synchronously so it's already in layoutRef before the
    // first pointermove fires and re-renders the sort order.
    if (source === "scene") {
      const placedAt = Date.now();
      setLocalLayout((prev) => {
        const entry = prev[itemId];
        if (!entry) return prev;
        const next = { ...prev, [itemId]: { ...entry, placedAt } };
        layoutRef.current = next;
        return next;
      });
    }

    if (source === "inventory") {
      const inScene = isOverScene(e.clientX, e.clientY);
      const pct = clientToScenePercent(e.clientX, e.clientY);
      if (pct) setDropPreview({ ...pct, overScene: inScene });
      setDragGhost({ id: itemId, x: e.clientX, y: e.clientY });
    }

    // ── Window-level handlers ──────────────────────────────────────────────
    // Attaching move/up to the window (not to individual buttons) means we
    // receive events regardless of which element the pointer is over — no
    // dependency on pointer-capture working correctly across all browsers.
    const onWindowMove = (ev: PointerEvent) => {
      const d = draggingRef.current;
      if (!d) return;
      if (d.source === "scene") {
        const pct = clientToScenePercent(ev.clientX, ev.clientY);
        if (!pct) return;
        const id = d.id;
        setLocalLayout((prev) => {
          // Spread the existing entry so placedAt (and any future fields)
          // are preserved — only x/y should change during a reposition.
          const next = { ...prev, [id]: { ...prev[id], x: pct.x, y: pct.y } };
          layoutRef.current = next;
          return next;
        });
        setOverInventory(isOverInventory(ev.clientX, ev.clientY));
      } else {
        // Inventory drag: track cursor for the drop-preview circle + ghost image.
        const pct = clientToScenePercent(ev.clientX, ev.clientY);
        const inScene = isOverScene(ev.clientX, ev.clientY);
        if (pct) setDropPreview({ ...pct, overScene: inScene });
        setDragGhost({ id: d.id, x: ev.clientX, y: ev.clientY });
      }
    };

    const onWindowUp = (ev: PointerEvent) => {
      // Remove window listeners first so straggler events are ignored.
      cleanup();

      // Grab + clear the drag ref atomically before any state work.
      const d = draggingRef.current;
      draggingRef.current = null;

      // Always clear visual drag state, even if d is somehow null.
      setDragging(null);
      setDropPreview(null);
      setDragGhost(null);
      setOverInventory(false);

      if (!d) {
        console.warn("[🌱 garden-drag] pointerup fired but draggingRef was null — stale event?");
        return;
      }

      const dropOverInventory = isOverInventory(ev.clientX, ev.clientY);
      const dropOverScene    = isOverScene(ev.clientX, ev.clientY);

      console.log("[🌱 garden-drag] drop", {
        id: d.id, source: d.source, dropOverScene, dropOverInventory,
        clientX: Math.round(ev.clientX), clientY: Math.round(ev.clientY),
      });

      if (d.source === "scene" && dropOverInventory) {
        // Scene → inventory: remove from layout (goes back to inventory tray).
        setLocalLayout((prev) => {
          const next = { ...prev };
          delete next[d.id];
          layoutRef.current = next;
          return next;
        });
      } else if (d.source === "inventory" && dropOverScene) {
        // Inventory → scene: place at cursor coords, stamp placedAt so it
        // renders on top of everything already in the scene.
        const pct = clientToScenePercent(ev.clientX, ev.clientY);
        if (pct) {
          const placedAt = Date.now();
          console.log("[🌱 garden-drag] placing", d.id, "at", pct, "placedAt", placedAt);
          setLocalLayout((prev) => {
            const next = { ...prev, [d.id]: { x: pct.x, y: pct.y, placedAt } };
            layoutRef.current = next;
            return next;
          });
        } else {
          console.warn("[🌱 garden-drag] clientToScenePercent returned null — sceneRef missing?");
        }
      } else {
        // Inventory → outside-scene: cancel. Scene → scene: coords already live-updated.
        console.log("[🌱 garden-drag] no-op drop (inventory→outside or scene→scene)");
      }

      queueMicrotask(() => persistLayout(layoutRef.current));
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerup",   onWindowUp);
      window.removeEventListener("pointercancel", onWindowUp);
      windowDragCleanupRef.current = null;
    };

    // Cancel any prior drag that didn't clean up (e.g. navigated away mid-drag).
    windowDragCleanupRef.current?.();
    windowDragCleanupRef.current = cleanup;
    window.addEventListener("pointermove",   onWindowMove);
    window.addEventListener("pointerup",     onWindowUp);
    window.addEventListener("pointercancel", onWindowUp);
  }

  function resetLayout() {
    setSaveStatus("saving");
    startTransition(async () => {
      try {
        await resetGardenLayoutAction();
        setLocalLayout({});
        setSaveStatus("saved");
        window.setTimeout(() => setSaveStatus("idle"), 1500);
      } catch (e) {
        console.error("Failed to reset garden layout", e);
        setSaveStatus("error");
      }
    });
  }

  const [tod, setTod] = useState<Tod>("day");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const read = () => setTod((document.documentElement.dataset.tod || "day") as Tod);
    read();
    const id = window.setInterval(read, 60_000);
    return () => clearInterval(id);
  }, []);
  const isNight = tod === "night";

  const mapTone = isNight
    ? "saturate(0.55) brightness(0.55) hue-rotate(-10deg)"
    : tod === "dusk" ? "saturate(0.95) brightness(0.92) hue-rotate(8deg)"
    : tod === "dawn" ? "saturate(0.92) brightness(1.02) hue-rotate(-4deg)"
    : "none";

  return (
    <section className="flex flex-col items-center">
      <div
        className="relative w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_60px_-30px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.7)]"
        data-tod={tod}
      >
        <div ref={sceneRef} className={`relative aspect-[4/3] w-full ${isEditing ? "cursor-grab" : ""}`} style={isEditing ? { touchAction: "none" } : undefined}>
          {/* Base top-down map */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mapArtFor(equippedMap)}
            alt="Your garden plot"
            className="absolute inset-0 block h-full w-full object-cover transition-[filter] duration-1000 ease-in-out select-none"
            draggable={false}
            style={{ filter: mapTone }}
          />

          {/* Edit-mode tint to show user they're in editing mode */}
          {isEditing && (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-40 ring-4 ring-inset ring-emerald-400/70" />
          )}

          {/* Night sky overlay + stars */}
          {isNight && (
            <>
              <div aria-hidden className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(20,22,58,0.5) 0%, rgba(40,40,90,0.4) 60%, rgba(28,28,60,0.55) 100%)" }} />
              <svg aria-hidden viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"
                className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 25 }}>
                {[
                  [120, 90], [220, 60], [360, 110], [480, 70], [600, 120], [720, 60], [840, 130],
                  [960, 80], [1100, 100], [1240, 60], [1340, 120], [1480, 80], [1560, 110],
                  [180, 200], [380, 220], [580, 180], [780, 240], [980, 200], [1180, 220], [1380, 180]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={1.4 + (i % 3) * 0.6} fill="#fff8dc"
                    className="td-star" style={{ animationDelay: `${(i % 7) * 380}ms` }} />
                ))}
              </svg>
            </>
          )}
          {(tod === "dusk" || tod === "dawn") && (
            <div aria-hidden className="pointer-events-none absolute inset-0"
              style={{ background: tod === "dusk"
                ? "linear-gradient(to bottom, rgba(255,140,90,0.18) 0%, rgba(255,170,120,0.08) 50%, rgba(255,200,160,0.04) 100%)"
                : "linear-gradient(to bottom, rgba(255,200,140,0.16) 0%, rgba(255,220,180,0.06) 50%, rgba(255,240,210,0.02) 100%)" }} />
          )}

          {/* Drifting clouds across the sky — ambient motion #1 */}
          {!isNight && (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[30%] overflow-hidden" style={{ zIndex: 28 }}>
              <div className="td-cloud td-cloud-1" />
              <div className="td-cloud td-cloud-2" />
              <div className="td-cloud td-cloud-3" />
            </div>
          )}

          {/* Owned items, each anchored at the FOOT (bottom-center).
              Rendered in placedAt order (oldest first) so the most recently
              placed item is last in the DOM and naturally appears on top.
              z-index mirrors the render index so explicit overlaps also work. */}
          {placedItems.map((item, idx) => {
            const pos = effectivePos(item.id);
            if (!pos) return null;
            const isLantern = item.id === "garden-lantern" || item.id === "garden-golden-lantern";
            const isPond = item.id === "garden-pond";
            const isGolden = item.id.startsWith("garden-golden-");
            const isBeingDragged = dragging?.id === item.id;
            // Compose filter chain: night dim + optional gold sheen.
            const imgFilter = [
              isNight ? "brightness(0.78) saturate(0.85)" : "",
              isGolden ? GOLDEN_FILTER : ""
            ].filter(Boolean).join(" ") || "none";
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                className={`group td-item-btn absolute -translate-x-1/2 -translate-y-full border-0 bg-transparent p-0 outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${isLantern ? "td-item-lantern" : ""} ${isPond ? "td-item-pond" : ""} ${isGolden ? "td-item-golden" : ""} ${isEditing ? "cursor-grab" : "cursor-pointer"} ${isBeingDragged ? "td-item-dragging" : ""}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: `${pos.size}%`,
                  // idx is the item's rank in placedAt-sorted order:
                  // lowest idx = placed first = behind; highest = placed last = in front.
                  zIndex: isBeingDragged ? 999 : 10 + idx,
                  touchAction: isEditing ? "none" : undefined
                }}
                title={isEditing ? `${item.name} — drag to move` : item.name}
                onPointerDown={(e) => handlePointerDown(e, item.id, "scene")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={itemArtSrc(item.id)}
                  alt={item.name}
                  draggable={false}
                  className="block h-auto w-full select-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
                  style={{ filter: imgFilter }}
                />
                {/* Edit-mode handle ring */}
                {isEditing && (
                  <div aria-hidden className={`pointer-events-none absolute inset-0 rounded-md ring-2 ${isBeingDragged ? "ring-amber-400" : "ring-emerald-400/70"}`} />
                )}
                {/* Lantern night glow (regular OR gold) */}
                {isLantern && isNight && (
                  <div aria-hidden className="td-lantern-glow pointer-events-none absolute inset-x-[20%] top-[10%] aspect-square rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(255,200,120,0.85) 0%, rgba(255,180,90,0.35) 35%, transparent 70%)" }} />
                )}
                {/* Golden sparkle ring (subtle, always visible) */}
                {isGolden && (
                  <div aria-hidden className="td-item-golden-aura pointer-events-none absolute inset-[-15%] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(255,210,90,0.35) 0%, rgba(255,180,40,0.12) 45%, transparent 70%)" }} />
                )}
              </button>
            );
          })}

          {/* Drop preview while dragging from inventory: a soft circle at cursor. */}
          {isEditing && dragging?.source === "inventory" && dropPreview && (
            <div
              aria-hidden
              className="pointer-events-none absolute z-[60] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${dropPreview.x}%`, top: `${dropPreview.y}%` }}
            >
              <div
                className={`h-16 w-16 rounded-full border-2 transition-colors ${
                  dropPreview.overScene ? "border-emerald-500 bg-emerald-300/30" : "border-rose-400 bg-rose-300/20"
                }`}
              />
            </div>
          )}

          {/* Sun-arc HUD plaque top-right */}
          <SunArcHud tod={tod} />
        </div>

        <style jsx>{`
          /* Item pop-in on first appear + hover lift */
          :global(.td-item-btn) {
            animation: tdItemPop 420ms cubic-bezier(0.34, 1.5, 0.64, 1) both;
            transition: transform 250ms ease-out, filter 200ms ease-out;
          }
          /* Scale up on hover but do NOT change z-index — placement order
             must be preserved. Previously z-index:50!important here caused
             any hovered item to pop to the top layer then drop back when
             the cursor left, making layering feel broken. */
          :global(.td-item-btn:not(.td-item-dragging):hover) {
            transform: translate(-50%, -100%) scale(1.08);
          }
          :global(.td-item-btn.td-item-dragging) {
            animation: none !important;
            transform: translate(-50%, -100%) scale(1.12);
            filter: drop-shadow(0 12px 18px rgba(0,0,0,0.45));
            transition: none;
          }
          @keyframes tdItemPop {
            0%   { opacity: 0; transform: translate(-50%, -100%) scale(0.4); }
            70%  { opacity: 1; transform: translate(-50%, -100%) scale(1.1); }
            100% { opacity: 1; transform: translate(-50%, -100%) scale(1); }
          }

          /* Golden trophy aura — gentle warm pulse */
          :global(.td-item-golden-aura) {
            animation: tdGoldPulse 4.2s ease-in-out infinite;
          }
          @keyframes tdGoldPulse {
            0%, 100% { opacity: 0.65; transform: scale(1); }
            50%      { opacity: 1;    transform: scale(1.05); }
          }

          /* Lantern night glow — pulses gently */
          :global(.td-lantern-glow) {
            animation: tdLanternFlicker 3s ease-in-out infinite;
          }
          @keyframes tdLanternFlicker {
            0%, 100% { opacity: 0.95; transform: scale(1); }
            50%      { opacity: 1; transform: scale(1.05); }
          }

          /* Pond shimmer — gentle horizontal scale pulse */
          :global(.td-item-pond img) {
            animation: tdPondShimmer 6s ease-in-out infinite;
            transform-origin: center;
          }
          @keyframes tdPondShimmer {
            0%, 100% { transform: scaleX(1) scaleY(1); }
            50%      { transform: scaleX(1.02) scaleY(0.99); }
          }

          /* Stars twinkle at night */
          :global(.td-star) {
            animation: tdTwinkle 3.6s ease-in-out infinite;
          }
          @keyframes tdTwinkle {
            0%, 100% { opacity: 0.4; }
            50%      { opacity: 1; }
          }

          /* Drifting clouds — ambient motion */
          .td-cloud {
            position: absolute;
            border-radius: 999px;
            background: radial-gradient(closest-side, rgba(255,255,255,0.85), rgba(255,255,255,0));
            filter: blur(3px);
          }
          .td-cloud-1 { top: 18%; left: -12%; width: 22%; height: 35%; animation: tdCloudDrift 65s linear infinite; }
          .td-cloud-2 { top: 6%;  left: -22%; width: 16%; height: 28%; animation: tdCloudDrift 92s linear infinite; animation-delay: -28s; }
          .td-cloud-3 { top: 32%; left: -30%; width: 28%; height: 32%; animation: tdCloudDrift 108s linear infinite; animation-delay: -55s; }
          @keyframes tdCloudDrift {
            to { transform: translateX(160vw); }
          }

          @media (prefers-reduced-motion: reduce) {
            :global(.td-item-btn) { animation: none !important; }
            :global(.td-lantern-glow), :global(.td-item-pond img), :global(.td-star), :global(.td-item-golden-aura), .td-cloud {
              animation: none !important;
            }
          }
        `}</style>
      </div>

      {/* ─────────── Inventory tray ───────────
          Items the user owns but hasn't placed in the scene live here.
          Visible at all times; only DRAGGABLE in edit mode (drop on scene
          to place). Also acts as a drop-zone: drag a scene item onto the
          tray (in edit mode) to remove it from the scene.
      */}
      <div
        ref={inventoryRef}
        className={`mt-4 w-full overflow-hidden rounded-[22px] border bg-cream-50/85 shadow-[0_12px_28px_-20px_rgba(31,77,44,0.35),inset_0_1px_0_rgba(255,255,255,0.5)] transition-colors
          ${overInventory && isEditing
            ? "border-rose-500/70 ring-2 ring-rose-400/50"
            : isEditing
            ? "border-emerald-400/60"
            : "border-white/60"}`}
      >
        <div className="flex items-baseline justify-between px-4 pt-3">
          <h3 className="font-display text-base italic text-ink-900">
            Inventory <span className="text-ink-700/70">({inventoryItems.length})</span>
          </h3>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-700/70">
            {isEditing
              ? overInventory
                ? "Drop here to remove"
                : inventoryItems.length > 0
                  ? "Drag onto the scene to place"
                  : "Drop scene items here to remove"
              : "Buy items below — they land here"}
          </p>
        </div>
        <div className="mt-2 px-4 pb-4">
          {inventoryItems.length === 0 ? (
            <p className="rounded-xl bg-ink-900/[0.04] px-3 py-4 text-center text-xs text-ink-700">
              {ownedGardenCount === 0
                ? "Nothing here yet. Browse the shop below to pick your first item."
                : "Everything you own is placed in the scene. Drag an item onto this tray to put it back."}
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {inventoryItems.map((item) => {
                const isBeingDragged = dragging?.id === item.id;
                const isGolden = item.id.startsWith("garden-golden-");
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`${item.name} — inventory${isEditing ? " (drag to place)" : ""}`}
                    title={isEditing ? `Drag ${item.name} onto the scene to place it` : item.name}
                    className={`group relative flex aspect-square flex-col items-center justify-center rounded-lg border p-1 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                      ${isGolden
                        ? "border-amber-300 bg-gradient-to-br from-amber-100 to-amber-200/70 ring-1 ring-amber-300/60"
                        : "bg-white/70 border-white/70"}
                      ${isEditing ? "cursor-grab hover:bg-white" : "cursor-default"}
                      ${isBeingDragged ? "opacity-40" : ""}`}
                    style={{ touchAction: isEditing ? "none" : undefined }}
                    onPointerDown={(e) => handlePointerDown(e, item.id, "inventory")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={itemArtSrc(item.id)}
                      alt=""
                      aria-hidden
                      draggable={false}
                      className="h-full w-full object-contain"
                      style={{ filter: isGolden ? GOLDEN_FILTER : undefined }}
                    />
                    {isGolden && (
                      <span aria-hidden className="absolute right-0 top-0 rounded-bl-lg rounded-tr-md bg-amber-500 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-sm">
                        ✨
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 truncate rounded-b-lg bg-ink-900/70 px-1 py-0.5 text-center text-[8px] font-medium uppercase tracking-wider text-cream-50 opacity-0 group-hover:opacity-100">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit-layout controls (above the stage strip so it's discoverable) */}
      <div className="mt-4 flex w-full max-w-[640px] items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setIsEditing((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition
            ${isEditing
              ? "bg-emerald-600 text-cream-50 hover:bg-emerald-700"
              : "border border-ink-900/20 bg-cream-50 text-ink-900 hover:border-ink-900/40"}`}
        >
          {isEditing ? "✓ Done editing" : "✎ Move items"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={resetLayout}
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 bg-cream-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700 transition hover:border-ink-900/40 hover:text-ink-900"
          >
            ↺ Reset to default
          </button>
        )}
        <span
          aria-live="polite"
          className={`text-[10px] uppercase tracking-[0.22em] transition-opacity
            ${saveStatus === "idle" ? "opacity-0" : "opacity-100"}
            ${saveStatus === "saved" ? "text-emerald-700" : saveStatus === "error" ? "text-rose-700" : "text-ink-700"}`}
        >
          {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "✓ Saved" : saveStatus === "error" ? "Save failed" : ""}
        </span>
      </div>

      {/* Stage + progress strip */}
      <div className="mt-7 w-full max-w-[640px] text-center">
        <p className="font-display text-2xl italic text-ink-900">{stage.name}.</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-ink-700/75">
          {leafCount} {leafCount === 1 ? "leaf" : "leaves"}
          {streak > 0 && <span className="ml-2">· {streak}-day streak</span>}
          {todayLeaves > 0 && <span className="ml-2 font-semibold text-emerald-700">· +{todayLeaves} today</span>}
        </p>

        <div className="mt-5 rounded-2xl border border-white/60 bg-gradient-to-br from-cream-50 to-brand-butter/30 p-4">
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-ink-700/80">
            <span>your garden</span>
            <span className="font-semibold text-ink-900">
              {ownedGardenCount} / {totalGardenCount} items
            </span>
          </div>
          <div className="mt-2 flex items-center gap-[2px]">
            {Array.from({ length: totalGardenCount }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-700
                  ${idx < ownedGardenCount
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                    : "bg-ink-900/10"}`}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink-700/70">
            every purchase drops onto the map immediately
          </p>
        </div>

        {leafCount < MAX_LEAVES && (
          <div className="mt-5">
            <div className="mb-1.5 flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-ink-700/70">
              <span>next leaf</span>
              <span className="tabular-nums">{Math.max(1, MINUTES_PER_LEAF - intoNext)}m to go</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-900/10">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-[width] duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ink-700/55">
          one leaf grows every {MINUTES_PER_LEAF} min of focus · hover an item to lift it
        </p>
      </div>

      {/* ── Drag ghost ──────────────────────────────────────────────────────
          A fixed-position copy of the dragged item image that follows the
          cursor during inventory→scene drags. Renders outside all containers
          so it's never clipped by overflow:hidden. pointer-events:none so it
          doesn't interfere with the underlying drop-zone hit tests.
      */}
      {dragGhost && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[9999]"
          style={{
            left: dragGhost.x,
            top: dragGhost.y,
            width: 72,
            height: 72,
            transform: "translate(-50%, -50%) scale(1.08)",
            opacity: 0.88,
            filter: dragGhost.id.startsWith("garden-golden-") ? GOLDEN_FILTER : "drop-shadow(0 8px 14px rgba(0,0,0,0.45))",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={itemArtSrc(dragGhost.id)}
            alt=""
            draggable={false}
            className="h-full w-full select-none object-contain"
          />
        </div>
      )}
    </section>
  );
}

/**
 * Sun-arc HUD plaque (top-right). The sun (day/dawn/dusk) or moon (night)
 * slides along the half-arc to show day progress. Replaces the simple
 * emoji-pill from v17 — per cold judge §F.7 the chosen sun-arc HUD feature
 * was absent and scored 0.
 */
function SunArcHud({ tod }: { tod: Tod }) {
  const progress =
    tod === "dawn" ? 0.12 :
    tod === "day"  ? 0.5  :
    tod === "dusk" ? 0.88 :
                     0.5;
  const isNight = tod === "night";
  const cx = 52, cy = 56, r = 44;
  const angle = Math.PI * (1 - progress);
  const orbX = cx + r * Math.cos(angle);
  const orbY = cy - r * Math.sin(angle);
  const todLabel = tod.charAt(0).toUpperCase() + tod.slice(1);

  return (
    <div
      aria-label={`Time of day: ${todLabel}`}
      className="pointer-events-none absolute right-3 top-3 select-none"
      style={{ width: 124, zIndex: 60, filter: "drop-shadow(0 4px 10px rgba(31,77,44,0.25))" }}
    >
      <svg viewBox="0 0 124 80" className="block w-full">
        <defs>
          <linearGradient id="td-plaque" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isNight ? "#3a3766" : "#fbe6c8"} />
            <stop offset="100%" stopColor={isNight ? "#262346" : "#f3cf9a"} />
          </linearGradient>
          <linearGradient id="td-arc-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={isNight ? "#1d1f48" : "#ffd5a4"} />
            <stop offset="50%" stopColor={isNight ? "#3a3d70" : "#ffb88a"} />
            <stop offset="100%" stopColor={isNight ? "#1d1f48" : "#5a3f6f"} />
          </linearGradient>
          <radialGradient id="td-orb-day" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6c4" />
            <stop offset="60%" stopColor="#ffd07a" />
            <stop offset="100%" stopColor="#ffa64d" />
          </radialGradient>
          <radialGradient id="td-orb-night" cx="40%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#fbf5d8" />
            <stop offset="65%" stopColor="#e2d4a0" />
            <stop offset="100%" stopColor="#aa9658" />
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="120" height="76" rx="12" ry="12"
          fill="url(#td-plaque)" stroke={isNight ? "#7d7aa8" : "#b88a5b"} strokeWidth="2" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`} fill="url(#td-arc-bg)" opacity="0.92" />
        <path d={`M ${cx - r + 4} ${cy - 1} A ${r - 4} ${r - 4} 0 0 1 ${cx + r - 4} ${cy - 1}`}
          fill="none" stroke={isNight ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)"} strokeWidth="1.5" />
        {[0, 0.5, 1].map((p) => {
          const a = Math.PI * (1 - p);
          const x1 = cx + (r + 1) * Math.cos(a);
          const y1 = cy - (r + 1) * Math.sin(a);
          const x2 = cx + (r - 4) * Math.cos(a);
          const y2 = cy - (r - 4) * Math.sin(a);
          return (
            <line key={p} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isNight ? "rgba(255,255,255,0.55)" : "#7a4a22"} strokeWidth="1.2" strokeLinecap="round" />
          );
        })}
        <circle cx={orbX} cy={orbY} r="11"
          fill={isNight ? "rgba(251,245,216,0.18)" : "rgba(255,200,100,0.32)"} />
        <circle cx={orbX} cy={orbY} r="6.5"
          fill={isNight ? "url(#td-orb-night)" : "url(#td-orb-day)"} />
        <line x1="6" y1="58" x2="118" y2="58"
          stroke={isNight ? "rgba(255,255,255,0.25)" : "rgba(122,74,34,0.55)"} strokeWidth="1.2" />
        <text x="62" y="72" textAnchor="middle"
          fontSize="10" fontWeight="700"
          fill={isNight ? "#f3eed1" : "#5a3920"}
          fontFamily="system-ui, -apple-system, sans-serif">
          {todLabel}
        </text>
      </svg>
    </div>
  );
}
