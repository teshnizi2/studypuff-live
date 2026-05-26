export type RewardCategory =
  | "sound"
  | "theme"
  | "accessory"
  | "garden-map"
  | "garden-structures"
  | "garden-plants"
  | "garden-critters"
  | "garden-golden";

/** True for PLACEABLE garden categories (items that drop into the scene).
 *  `garden-map` is intentionally excluded because maps are *equipped* like
 *  sounds / themes, not placed. Use everywhere in shop / scene logic so the
 *  set of placeable sub-categories is the single source of truth. */
export function isGardenCategory(c: RewardCategory): boolean {
  return c.startsWith("garden-") && c !== "garden-map";
}

/** Default map id when a user has no `equipped_map` set. Free starter. */
export const DEFAULT_GARDEN_MAP_ID = "garden-map-forest-river";

/** Resolve a (possibly null) equipped_map id to its art path, falling back
 *  to the free default. Centralizes "what background to render" for the
 *  garden scene + the shop preview thumbnails. */
export function mapArtFor(equippedMap: string | null | undefined): string {
  const id = equippedMap ?? DEFAULT_GARDEN_MAP_ID;
  const reward = REWARDS.find((r) => r.id === id && r.category === "garden-map");
  return reward?.art ?? "/garden-maps/forest-river.webp";
}

export type Reward = {
  id: string;
  name: string;
  category: RewardCategory;
  price: number;
  /** For garden-golden trophies: total lifetime_focus_minutes required to unlock.
   *  When set, the item is "claimed" for free (price ignored) once the user
   *  meets the threshold. */
  unlocks_at_minutes?: number;
  emoji: string;
  description: string;
  /** Bespoke art asset path (for garden items rendered in the scene). */
  art?: string;
  /** For garden items: where the item sits on the garden scene, as a
   *  percentage of the scene's width / height (0–100). Larger values move
   *  toward the right / bottom. Optional `scale` tweaks the rendered size.
   *  `layer` controls vertical depth ordering: lower numbers render behind. */
  placement?: { x: number; y: number; scale?: number; layer?: number };
};

export const REWARDS: Reward[] = [
  // ───────────────────── GARDEN — MAPS (backgrounds) ─────────────────────
  // Maps are *equipped* like sounds/themes, not placed in the scene.
  // The free Forest-River starter has price=0 — it never appears in shop UI
  // as a buyable card, just as the implicit default in the picker.
  { id: "garden-map-forest-river", name: "Forest River", category: "garden-map", price: 0, emoji: "🏞️", description: "Cozy painterly meadow with two winding rivers. Your starting world.", art: "/garden-maps/forest-river.webp" },
  { id: "garden-map-beach", name: "Beach Cove", category: "garden-map", price: 220, emoji: "🏖️", description: "Pale sand with palm framing and ocean lapping the bottom edge.", art: "/garden-maps/beach.webp" },
  { id: "garden-map-snowy", name: "Snowy Meadow", category: "garden-map", price: 240, emoji: "❄️", description: "Untouched snow, evergreen border, a frozen S-curve stream.", art: "/garden-maps/snowy.webp" },
  { id: "garden-map-desert", name: "Desert Oasis", category: "garden-map", price: 260, emoji: "🌵", description: "Warm sand, a turquoise oasis, distant mesas at the horizon.", art: "/garden-maps/desert.webp" },
  { id: "garden-map-lavender", name: "Lavender Twilight", category: "garden-map", price: 320, emoji: "💜", description: "Magical purple field, glowing wisps, dreamy twilight path.", art: "/garden-maps/lavender.webp" },
  { id: "garden-map-night", name: "Moonlit Forest", category: "garden-map", price: 300, emoji: "🌙", description: "Deep-blue moonlit grass, winding river, painted fireflies.", art: "/garden-maps/night.webp" },

  // Ambient sounds
  { id: "sound-rain", name: "Soft rain", category: "sound", price: 30, emoji: "🌧️", description: "A gentle drizzle to wash distractions away." },
  { id: "sound-library", name: "Quiet library", category: "sound", price: 30, emoji: "📚", description: "Page turns and the distant hum of a study hall." },
  { id: "sound-forest", name: "Forest morning", category: "sound", price: 50, emoji: "🌲", description: "Birdsong and rustling leaves." },
  { id: "sound-cafe", name: "Cosy café", category: "sound", price: 60, emoji: "☕", description: "Espresso machines and friendly chatter." },
  { id: "sound-fire", name: "Fireplace", category: "sound", price: 80, emoji: "🔥", description: "Crackles to keep you warm during late-night sessions." },
  { id: "sound-ocean", name: "Ocean waves", category: "sound", price: 90, emoji: "🌊", description: "Steady breath of the tide." },

  // Themes
  { id: "theme-night", name: "Night theme", category: "theme", price: 120, emoji: "🌙", description: "Cooler tones for evening sessions." },
  { id: "theme-pastel", name: "Pastel pop", category: "theme", price: 100, emoji: "🎀", description: "Soft pinks and butter yellows everywhere." },
  { id: "theme-forest", name: "Forest theme", category: "theme", price: 140, emoji: "🌳", description: "Deeper greens for the calm-stream aesthetic." },

  // Sheep accessories
  { id: "sheep-glasses", name: "Sheep glasses", category: "accessory", price: 75, emoji: "🤓", description: "Studious vibe upgrade for the mascot." },
  { id: "sheep-cap", name: "Graduation cap", category: "accessory", price: 200, emoji: "🎓", description: "For when you finally finish that paper." },
  { id: "sheep-scarf", name: "Cozy scarf", category: "accessory", price: 90, emoji: "🧣", description: "Winter-ready sheep, ready for late-evening study." },
  { id: "sheep-mug", name: "Floating tea mug", category: "accessory", price: 60, emoji: "🍵", description: "A small mug of tea that follows the sheep around." },

  // ───────────────────── GARDEN — STRUCTURES (9 items) ─────────────────────
  // The big, build-up-the-village pieces. Higher prices, larger footprints.
  //
  // LAYOUT INTENT (for ALL 25 items, all categories):
  //   - 4 depth bands by y%:
  //     · TOP   (y≈44):    hanging items (beehive)
  //     · BACK  (y≈67-76): big anchors (cottage, treehouse, applestree, gazebo)
  //     · MID   (y≈80-87): medium structures (well, signpost, scarecrow, bench, bridge)
  //     · FRONT (y≈88-92): mid-small (mailbox, lantern, picnic, birdbath, pond)
  //     · FLOOR (y≈93-97): tiny + plant tiles (flowerbed, vegpatch, gnome, snail, etc.)
  //   - Sheep+tree zone: tree spans x≈27-73 / y≈42-78; sheep at x≈53-63 / y≈70-78.
  //     Items in that zone go to LAYER ≥4 (drawn in front of nothing crucial).
  //   - Min horizontal spacing within a row: ~6% so neighbours don't visually clip.
  // v14 — items land on the v2 backdrop's PAINTED PLOTS specifically.
  // The new courtyard has visible plot anchors:
  //   - LEFT-TOP   round dirt plot: x≈25, y≈55-62   (vegpatch, flowerbed)
  //   - LEFT-BOTTOM round dirt plot: x≈28, y≈75-85  (pumpkinpatch, well)
  //   - RIGHT-TOP  wooden raised bed: x≈75, y≈55-65 (treehouse)
  //   - RIGHT-BOTTOM stone clearing:  x≈82, y≈75-85 (gazebo, pond)
  //   - CENTRAL    dirt path:        x≈45-55, y≈55-100 (bridge, hero tree)
  // Framing trees at x≈0-15 and x≈85-100 — keep items in x=16-84.
  // Sheep clear zone x=51-65 preserved at front rows.
  { id: "garden-cottage", name: "Cozy cottage", category: "garden-structures", price: 240, emoji: "🏡", description: "A little wooden cottage at the edge of your garden.", art: "/garden/item-cottage.webp", placement: { x: 25, y: 78, scale: 0.85, layer: 2 } },
  { id: "garden-treehouse", name: "Treehouse", category: "garden-structures", price: 320, emoji: "🌳", description: "A tiny house perched in a leafy old tree.", art: "/garden/item-treehouse.webp", placement: { x: 75, y: 62, scale: 0.8, layer: 2 } },
  { id: "garden-gazebo", name: "Rose gazebo", category: "garden-structures", price: 290, emoji: "🌹", description: "A white gazebo with pink roses climbing the roof.", art: "/garden/item-gazebo.webp", placement: { x: 82, y: 80, scale: 0.75, layer: 3 } },
  { id: "garden-well", name: "Wishing well", category: "garden-structures", price: 170, emoji: "🪣", description: "A stone well with a wooden roof and bucket.", art: "/garden/item-well.webp", placement: { x: 24, y: 60, scale: 0.7, layer: 3 } },
  { id: "garden-bridge", name: "Red bridge", category: "garden-structures", price: 140, emoji: "🌉", description: "A small arched footbridge over a little stream.", art: "/garden/item-bridge.webp", placement: { x: 50, y: 93, scale: 0.5, layer: 4 } },
  { id: "garden-bench", name: "Stone bench", category: "garden-structures", price: 90, emoji: "🪑", description: "A quiet bench to sit at after a focus session.", art: "/garden/item-bench.webp", placement: { x: 66, y: 84, scale: 0.55, layer: 4 } },
  { id: "garden-lantern", name: "Lantern path", category: "garden-structures", price: 130, emoji: "🏮", description: "Soft paper lanterns lighting a little path. Glow brightens at night.", art: "/garden/item-lantern.webp", placement: { x: 38, y: 88, scale: 0.5, layer: 5 } },
  { id: "garden-mailbox", name: "Red mailbox", category: "garden-structures", price: 60, emoji: "📮", description: "A friendly red mailbox at the edge of the path.", art: "/garden/item-mailbox.webp", placement: { x: 18, y: 85, scale: 0.4, layer: 5 } },
  { id: "garden-signpost", name: "Wooden signpost", category: "garden-structures", price: 50, emoji: "🪧", description: "Carved wooden arrows pointing the way.", art: "/garden/item-signpost.webp", placement: { x: 42, y: 84, scale: 0.45, layer: 4 } },

  // ───────────────────── GARDEN — PLANTS & BOUNTY (8 items) ─────────────────────
  { id: "garden-applestree", name: "Apple tree", category: "garden-plants", price: 180, emoji: "🍎", description: "A small tree heavy with bright red apples.", art: "/garden/item-applestree.webp", placement: { x: 18, y: 92, scale: 0.55, layer: 3 } },
  { id: "garden-pond", name: "Wishing pond", category: "garden-plants", price: 180, emoji: "💧", description: "A small clear pond with a lily pad or two. Ripples subtly.", art: "/garden/item-pond.webp", placement: { x: 82, y: 85, scale: 0.5, layer: 5 } },
  { id: "garden-pumpkinpatch", name: "Pumpkin patch", category: "garden-plants", price: 130, emoji: "🎃", description: "Three plump orange pumpkins on a vine.", art: "/garden/item-pumpkinpatch.webp", placement: { x: 28, y: 82, scale: 0.5, layer: 6 } },
  { id: "garden-vegpatch", name: "Vegetable patch", category: "garden-plants", price: 110, emoji: "🥕", description: "Carrots and greens growing in neat rows.", art: "/garden/item-vegpatch.webp", placement: { x: 27, y: 58, scale: 0.55, layer: 4 } },
  { id: "garden-flowerbed", name: "Wildflower bed", category: "garden-plants", price: 100, emoji: "🌷", description: "Pink, yellow and purple wildflowers in soft soil.", art: "/garden/item-flowerbed.webp", placement: { x: 32, y: 92, scale: 0.45, layer: 6 } },
  { id: "garden-haybale", name: "Hay bale", category: "garden-plants", price: 80, emoji: "🌾", description: "A round golden bale with a red ribbon tied on top.", art: "/garden/item-haybale.webp", placement: { x: 72, y: 92, scale: 0.45, layer: 6 } },
  { id: "garden-mushrooms", name: "Mushroom cluster", category: "garden-plants", price: 70, emoji: "🍄", description: "A patch of red-capped mushrooms tucked in the grass.", art: "/garden/item-mushrooms.webp", placement: { x: 22, y: 93, scale: 0.4, layer: 6 } },
  { id: "garden-waterlilies", name: "Water lilies", category: "garden-plants", price: 90, emoji: "🪷", description: "Two pink lotus flowers floating on lily pads.", art: "/garden/item-waterlilies.webp", placement: { x: 88, y: 91, scale: 0.4, layer: 7 } },

  // ───────────────────── GARDEN — CRITTERS & WHIMSY (8 items) ─────────────────────
  { id: "garden-scarecrow", name: "Cheery scarecrow", category: "garden-critters", price: 160, emoji: "🧑‍🌾", description: "A smiling scarecrow with a straw hat and overalls.", art: "/garden/item-scarecrow.webp", placement: { x: 44, y: 90, scale: 0.55, layer: 4 } },
  { id: "garden-gnome", name: "Garden gnome", category: "garden-critters", price: 280, emoji: "🧙", description: "A friendly gnome watching over your tree.", art: "/garden/item-gnome.webp", placement: { x: 36, y: 95, scale: 0.38, layer: 7 } },
  { id: "garden-birdbath", name: "Bird bath", category: "garden-critters", price: 150, emoji: "🪺", description: "A stone bowl where little birds come to splash.", art: "/garden/item-birdbath.webp", placement: { x: 76, y: 76, scale: 0.45, layer: 4 } },
  { id: "garden-frogstatue", name: "Lily-pad frog", category: "garden-critters", price: 130, emoji: "🐸", description: "A round stone frog statue with a lotus on its head.", art: "/garden/item-frogstatue.webp", placement: { x: 88, y: 96, scale: 0.32, layer: 6 } },
  { id: "garden-snail", name: "Stripey snail", category: "garden-critters", price: 70, emoji: "🐌", description: "A friendly snail with a candy-striped shell.", art: "/garden/item-snail.webp", placement: { x: 53, y: 97, scale: 0.28, layer: 7 } },
  { id: "garden-beehive", name: "Honey hive", category: "garden-critters", price: 200, emoji: "🐝", description: "A striped beehive hanging from a tree branch.", art: "/garden/item-beehive.webp", placement: { x: 10, y: 22, scale: 0.36, layer: 1 } },
  { id: "garden-picnic", name: "Picnic basket", category: "garden-critters", price: 80, emoji: "🧺", description: "A wicker basket with a baguette and apple, set on a checkered cloth.", art: "/garden/item-picnic.webp", placement: { x: 70, y: 96, scale: 0.42, layer: 5 } },
  { id: "garden-fairyring", name: "Fairy ring", category: "garden-critters", price: 110, emoji: "✨", description: "A circle of toadstools with a magical sparkle.", art: "/garden/item-fairyring.webp", placement: { x: 56, y: 95, scale: 0.32, layer: 7 } },

  // ───────────────────── GARDEN — GOLDEN TROPHIES (6 items) ─────────────────────
  // These are NOT bought with coins. They unlock based on lifetime focus
  // minutes and are claimed for free once unlocked. Visually they share the
  // base item's PNG art but get a CSS gold filter at render time. Lands in
  // inventory (no TD_LAYOUT entry) on claim, then drag-to-place like any
  // other inventory item.
  { id: "garden-golden-lantern",   name: "Golden lantern",   category: "garden-golden", price: 0, unlocks_at_minutes: 300,   emoji: "🏮", description: "A glowing brass lantern. Unlocks after 5 focused hours.",   art: "/td-items/lantern.webp" },
  { id: "garden-golden-gnome",     name: "Golden gnome",     category: "garden-golden", price: 0, unlocks_at_minutes: 900,   emoji: "🧙", description: "A gilded gnome that smiles knowingly. Unlocks at 15 hours.", art: "/td-items/gnome.webp" },
  { id: "garden-golden-cottage",   name: "Golden cottage",   category: "garden-golden", price: 0, unlocks_at_minutes: 1800,  emoji: "🏡", description: "A grand cottage with a golden roof. Unlocks at 30 hours.",   art: "/td-items/cottage.webp" },
  { id: "garden-golden-applestree",name: "Golden tree",      category: "garden-golden", price: 0, unlocks_at_minutes: 3600,  emoji: "🌳", description: "An apple tree heavy with golden fruit. Unlocks at 60 hours.", art: "/td-items/applestree.webp" },
  { id: "garden-golden-gazebo",    name: "Golden gazebo",    category: "garden-golden", price: 0, unlocks_at_minutes: 7200,  emoji: "🌹", description: "Ornate gold gazebo, climbing roses, the works. Unlocks at 120 hours.", art: "/td-items/gazebo.webp" },
  { id: "garden-golden-fairyring", name: "Golden fairy ring",category: "garden-golden", price: 0, unlocks_at_minutes: 14400, emoji: "✨", description: "A trophy ring of luminous gold mushrooms. Unlocks at 240 hours.", art: "/td-items/fairyring.webp" }
];

export function rewardById(id: string) {
  return REWARDS.find((r) => r.id === id);
}
