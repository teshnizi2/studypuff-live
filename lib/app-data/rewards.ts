export type RewardCategory =
  | "sound"
  | "theme"
  | "accessory"
  | "garden-map"
  | "garden-structures"
  | "garden-plants"
  | "garden-critters"
  | "garden-golden";

/** Collection rarity tiers. Drives the price ladder + a coloured badge in the
 *  shop so the catalogue reads like a collection game, not a flat price list.
 *  Ordered cheap → aspirational. */
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITY_ORDER: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

/** Presentation metadata for each tier — label + colour tokens. `chip` is the
 *  badge background, `dot` a hex for inline dots/rings. */
export const RARITY_META: Record<Rarity, { label: string; chip: string; text: string; dot: string }> = {
  common:    { label: "Common",    chip: "bg-stone-200/90",   text: "text-stone-600",   dot: "#a8a29e" },
  uncommon:  { label: "Uncommon",  chip: "bg-emerald-200/90", text: "text-emerald-700", dot: "#34d399" },
  rare:      { label: "Rare",      chip: "bg-sky-200/90",     text: "text-sky-700",     dot: "#38bdf8" },
  epic:      { label: "Epic",      chip: "bg-violet-200/90",  text: "text-violet-700",  dot: "#a78bfa" },
  legendary: { label: "Legendary", chip: "bg-amber-200/90",   text: "text-amber-700",   dot: "#fbbf24" }
};

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
  /** Collection tier. Optional only for the free starter map. */
  rarity?: Rarity;
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

// ─────────────────────────────────────────────────────────────────────────
// ECONOMY (rebalanced).
//   Earn rate: 1 coin / focused minute (see lib/app-data/actions.ts).
//   Anchor: a 6 h/day learner buys the WHOLE catalogue in ~3 months
//           → 6*60*90 ≈ 32,400 coins. Catalogue total is tuned to that.
//   Curve is deliberately skewed (long right tail):
//     · Common    60–180   — day-one impulse buys, instant dopamine.
//     · Uncommon  190–340  — ~a day of focus each.
//     · Rare      420–720  — a couple of days; the bulk of the collection.
//     · Epic      700–1300 — multi-day goals, the showpieces of a corner.
//     · Legendary 1300–2600 — aspirational flagships; anchor the value scale.
//   The 6 golden trophies are NOT bought — they unlock on lifetime focus time.
// ─────────────────────────────────────────────────────────────────────────
export const REWARDS: Reward[] = [
  // ───────────────────── GARDEN — MAPS (backgrounds) ─────────────────────
  // Maps are *equipped* like sounds/themes, not placed in the scene.
  // The free Forest-River starter has price=0 — it never appears in shop UI
  // as a buyable card, just as the implicit default in the picker.
  { id: "garden-map-forest-river", name: "Forest River", category: "garden-map", price: 0, emoji: "🏞️", description: "Cozy painterly meadow with two winding rivers. Your starting world.", art: "/garden-maps/forest-river.webp" },
  { id: "garden-map-beach", name: "Beach Cove", category: "garden-map", price: 420, rarity: "rare", emoji: "🏖️", description: "Pale sand with palm framing and ocean lapping the bottom edge.", art: "/garden-maps/beach.webp" },
  { id: "garden-map-autumn", name: "Autumn Meadow", category: "garden-map", price: 450, rarity: "rare", emoji: "🍂", description: "Golden maples line a winding dirt path. Fallen leaves dot the warm earth.", art: "/garden-maps/autumn.webp" },
  { id: "garden-map-snowy", name: "Snowy Meadow", category: "garden-map", price: 480, rarity: "rare", emoji: "❄️", description: "Untouched snow, evergreen border, a frozen S-curve stream.", art: "/garden-maps/snowy.webp" },
  { id: "garden-map-desert", name: "Desert Oasis", category: "garden-map", price: 520, rarity: "rare", emoji: "🌵", description: "Warm sand, a turquoise oasis, distant mesas at the horizon.", art: "/garden-maps/desert.webp" },
  { id: "garden-map-english-cottage", name: "Cottage Garden", category: "garden-map", price: 700, rarity: "epic", emoji: "🌹", description: "Cobblestone paths wind through rose hedges. A crisp English afternoon.", art: "/garden-maps/english-cottage.webp" },
  { id: "garden-map-night", name: "Moonlit Forest", category: "garden-map", price: 780, rarity: "epic", emoji: "🌙", description: "Deep-blue moonlit grass, winding river, painted fireflies.", art: "/garden-maps/night.webp" },
  { id: "garden-map-cherry-blossom", name: "Cherry Blossom", category: "garden-map", price: 850, rarity: "epic", emoji: "🌸", description: "Delicate pink cherry trees frame a stone path and a quiet koi pool.", art: "/garden-maps/cherry-blossom.webp" },
  { id: "garden-map-enchanted", name: "Enchanted Grove", category: "garden-map", price: 950, rarity: "epic", emoji: "🍄", description: "Giant mushrooms, glowing fairy circles, teal grass. A garden visible only at twilight.", art: "/garden-maps/enchanted.webp" },
  { id: "garden-map-lavender", name: "Lavender Twilight", category: "garden-map", price: 1000, rarity: "epic", emoji: "💜", description: "Magical purple field, glowing wisps, dreamy twilight path.", art: "/garden-maps/lavender.webp" },
  { id: "garden-map-zen", name: "Zen Garden", category: "garden-map", price: 1300, rarity: "legendary", emoji: "☯️", description: "Raked sand, granite boulders, bamboo. Every ripple is a thought let go.", art: "/garden-maps/zen.webp" },
  { id: "garden-map-marble-terrace", name: "Marble Terrace", category: "garden-map", price: 1900, rarity: "legendary", emoji: "🏛️", description: "Gleaming marble tiles, sculpted hedges, long afternoon shadows. Pure elegance.", art: "/garden-maps/marble-terrace.webp" },

  // Ambient sounds — cheap utility, the first thing a new learner can afford.
  { id: "sound-rain", name: "Soft rain", category: "sound", price: 60, rarity: "common", emoji: "🌧️", description: "A gentle drizzle to wash distractions away." },
  { id: "sound-library", name: "Quiet library", category: "sound", price: 60, rarity: "common", emoji: "📚", description: "Page turns and the distant hum of a study hall." },
  { id: "sound-forest", name: "Forest morning", category: "sound", price: 110, rarity: "common", emoji: "🌲", description: "Birdsong and rustling leaves." },
  { id: "sound-cafe", name: "Cosy café", category: "sound", price: 130, rarity: "uncommon", emoji: "☕", description: "Espresso machines and friendly chatter." },
  { id: "sound-fire", name: "Fireplace", category: "sound", price: 160, rarity: "uncommon", emoji: "🔥", description: "Crackles to keep you warm during late-night sessions." },
  { id: "sound-ocean", name: "Ocean waves", category: "sound", price: 190, rarity: "uncommon", emoji: "🌊", description: "Steady breath of the tide." },

  // Themes
  { id: "theme-pastel", name: "Pastel pop", category: "theme", price: 240, rarity: "uncommon", emoji: "🎀", description: "Soft pinks and butter yellows everywhere." },
  { id: "theme-night", name: "Night theme", category: "theme", price: 300, rarity: "uncommon", emoji: "🌙", description: "Cooler tones for evening sessions." },
  { id: "theme-forest", name: "Forest theme", category: "theme", price: 340, rarity: "uncommon", emoji: "🌳", description: "Deeper greens for the calm-stream aesthetic." },

  // Sheep accessories
  { id: "sheep-mug", name: "Floating tea mug", category: "accessory", price: 120, rarity: "common", emoji: "🍵", description: "A small mug of tea that follows the sheep around." },
  { id: "sheep-glasses", name: "Sheep glasses", category: "accessory", price: 180, rarity: "uncommon", emoji: "🤓", description: "Studious vibe upgrade for the mascot." },
  { id: "sheep-scarf", name: "Cozy scarf", category: "accessory", price: 220, rarity: "uncommon", emoji: "🧣", description: "Winter-ready sheep, ready for late-evening study." },
  { id: "sheep-cap", name: "Graduation cap", category: "accessory", price: 480, rarity: "rare", emoji: "🎓", description: "For when you finally finish that paper." },

  // ───────────────────── GARDEN — STRUCTURES ─────────────────────
  // The big, build-up-the-village pieces. Higher prices, larger footprints.
  //
  // LAYOUT INTENT (for ALL items, all categories):
  //   - 4 depth bands by y%:
  //     · TOP   (y≈44):    hanging items (beehive)
  //     · BACK  (y≈67-76): big anchors (cottage, treehouse, applestree, gazebo)
  //     · MID   (y≈80-87): medium structures (well, signpost, scarecrow, bench, bridge)
  //     · FRONT (y≈88-92): mid-small (mailbox, lantern, picnic, birdbath, pond)
  //     · FLOOR (y≈93-97): tiny + plant tiles (flowerbed, vegpatch, gnome, snail, etc.)
  //   - Sheep+tree zone: tree spans x≈27-73 / y≈42-78; sheep at x≈53-63 / y≈70-78.
  //   - Min horizontal spacing within a row: ~6% so neighbours don't visually clip.
  { id: "garden-cottage", name: "Cozy cottage", category: "garden-structures", price: 1000, rarity: "epic", emoji: "🏡", description: "A little wooden cottage at the edge of your garden.", art: "/garden/item-cottage.webp", placement: { x: 25, y: 78, scale: 0.85, layer: 2 } },
  { id: "garden-treehouse", name: "Treehouse", category: "garden-structures", price: 1300, rarity: "epic", emoji: "🌳", description: "A tiny house perched in a leafy old tree.", art: "/garden/item-treehouse.webp", placement: { x: 75, y: 62, scale: 0.8, layer: 2 } },
  { id: "garden-gazebo", name: "Rose gazebo", category: "garden-structures", price: 950, rarity: "epic", emoji: "🌹", description: "A white gazebo with pink roses climbing the roof.", art: "/garden/item-gazebo.webp", placement: { x: 82, y: 80, scale: 0.75, layer: 3 } },
  { id: "garden-well", name: "Wishing well", category: "garden-structures", price: 420, rarity: "rare", emoji: "🪣", description: "A stone well with a wooden roof and bucket.", art: "/garden/item-well.webp", placement: { x: 24, y: 60, scale: 0.7, layer: 3 } },
  { id: "garden-bridge", name: "Red bridge", category: "garden-structures", price: 320, rarity: "uncommon", emoji: "🌉", description: "A small arched footbridge over a little stream.", art: "/garden/item-bridge.webp", placement: { x: 50, y: 93, scale: 0.5, layer: 4 } },
  { id: "garden-bench", name: "Stone bench", category: "garden-structures", price: 180, rarity: "common", emoji: "🪑", description: "A quiet bench to sit at after a focus session.", art: "/garden/item-bench.webp", placement: { x: 66, y: 84, scale: 0.55, layer: 4 } },
  { id: "garden-lantern", name: "Lantern path", category: "garden-structures", price: 280, rarity: "uncommon", emoji: "🏮", description: "Soft paper lanterns lighting a little path. Glow brightens at night.", art: "/garden/item-lantern.webp", placement: { x: 38, y: 88, scale: 0.5, layer: 5 } },
  { id: "garden-mailbox", name: "Red mailbox", category: "garden-structures", price: 90, rarity: "common", emoji: "📮", description: "A friendly red mailbox at the edge of the path.", art: "/garden/item-mailbox.webp", placement: { x: 18, y: 85, scale: 0.4, layer: 5 } },
  { id: "garden-signpost", name: "Wooden signpost", category: "garden-structures", price: 110, rarity: "common", emoji: "🪧", description: "Carved wooden arrows pointing the way.", art: "/garden/item-signpost.webp", placement: { x: 42, y: 84, scale: 0.45, layer: 4 } },

  // ───────────────────── GARDEN — PLANTS & BOUNTY ─────────────────────
  { id: "garden-applestree", name: "Apple tree", category: "garden-plants", price: 560, rarity: "rare", emoji: "🍎", description: "A small tree heavy with bright red apples.", art: "/garden/item-applestree.webp", placement: { x: 18, y: 92, scale: 0.55, layer: 3 } },
  { id: "garden-pond", name: "Wishing pond", category: "garden-plants", price: 420, rarity: "rare", emoji: "💧", description: "A small clear pond with a lily pad or two. Ripples subtly.", art: "/garden/item-pond.webp", placement: { x: 82, y: 85, scale: 0.5, layer: 5 } },
  { id: "garden-pumpkinpatch", name: "Pumpkin patch", category: "garden-plants", price: 220, rarity: "uncommon", emoji: "🎃", description: "Three plump orange pumpkins on a vine.", art: "/garden/item-pumpkinpatch.webp", placement: { x: 28, y: 82, scale: 0.5, layer: 6 } },
  { id: "garden-vegpatch", name: "Vegetable patch", category: "garden-plants", price: 190, rarity: "uncommon", emoji: "🥕", description: "Carrots and greens growing in neat rows.", art: "/garden/item-vegpatch.webp", placement: { x: 27, y: 58, scale: 0.55, layer: 4 } },
  { id: "garden-flowerbed", name: "Wildflower bed", category: "garden-plants", price: 130, rarity: "common", emoji: "🌷", description: "Pink, yellow and purple wildflowers in soft soil.", art: "/garden/item-flowerbed.webp", placement: { x: 32, y: 92, scale: 0.45, layer: 6 } },
  { id: "garden-haybale", name: "Hay bale", category: "garden-plants", price: 90, rarity: "common", emoji: "🌾", description: "A round golden bale with a red ribbon tied on top.", art: "/garden/item-haybale.webp", placement: { x: 72, y: 92, scale: 0.45, layer: 6 } },
  { id: "garden-mushrooms", name: "Mushroom cluster", category: "garden-plants", price: 75, rarity: "common", emoji: "🍄", description: "A patch of red-capped mushrooms tucked in the grass.", art: "/garden/item-mushrooms.webp", placement: { x: 22, y: 93, scale: 0.4, layer: 6 } },
  { id: "garden-waterlilies", name: "Water lilies", category: "garden-plants", price: 160, rarity: "uncommon", emoji: "🪷", description: "Two pink lotus flowers floating on lily pads.", art: "/garden/item-waterlilies.webp", placement: { x: 88, y: 91, scale: 0.4, layer: 7 } },

  // ───────────────────── GARDEN — CRITTERS & WHIMSY ─────────────────────
  { id: "garden-scarecrow", name: "Cheery scarecrow", category: "garden-critters", price: 420, rarity: "rare", emoji: "🧑‍🌾", description: "A smiling scarecrow with a straw hat and overalls.", art: "/garden/item-scarecrow.webp", placement: { x: 44, y: 90, scale: 0.55, layer: 4 } },
  { id: "garden-gnome", name: "Garden gnome", category: "garden-critters", price: 720, rarity: "rare", emoji: "🧙", description: "A friendly gnome watching over your tree.", art: "/garden/item-gnome.webp", placement: { x: 36, y: 95, scale: 0.38, layer: 7 } },
  { id: "garden-birdbath", name: "Bird bath", category: "garden-critters", price: 240, rarity: "uncommon", emoji: "🪺", description: "A stone bowl where little birds come to splash.", art: "/garden/item-birdbath.webp", placement: { x: 76, y: 76, scale: 0.45, layer: 4 } },
  { id: "garden-frogstatue", name: "Lily-pad frog", category: "garden-critters", price: 190, rarity: "uncommon", emoji: "🐸", description: "A round stone frog statue with a lotus on its head.", art: "/garden/item-frogstatue.webp", placement: { x: 88, y: 96, scale: 0.32, layer: 6 } },
  { id: "garden-snail", name: "Stripey snail", category: "garden-critters", price: 75, rarity: "common", emoji: "🐌", description: "A friendly snail with a candy-striped shell.", art: "/garden/item-snail.webp", placement: { x: 53, y: 97, scale: 0.28, layer: 7 } },
  { id: "garden-beehive", name: "Honey hive", category: "garden-critters", price: 340, rarity: "uncommon", emoji: "🐝", description: "A striped beehive hanging from a tree branch.", art: "/garden/item-beehive.webp", placement: { x: 10, y: 22, scale: 0.36, layer: 1 } },
  { id: "garden-picnic", name: "Picnic basket", category: "garden-critters", price: 110, rarity: "common", emoji: "🧺", description: "A wicker basket with a baguette and apple, set on a checkered cloth.", art: "/garden/item-picnic.webp", placement: { x: 70, y: 96, scale: 0.42, layer: 5 } },
  { id: "garden-fairyring", name: "Fairy ring", category: "garden-critters", price: 160, rarity: "uncommon", emoji: "✨", description: "A circle of toadstools with a magical sparkle.", art: "/garden/item-fairyring.webp", placement: { x: 56, y: 95, scale: 0.32, layer: 7 } },

  // ───────────────────── GARDEN — JAPANESE / CHERRY-BLOSSOM ─────────────────────
  { id: "garden-cherry-tree",    name: "Cherry blossom tree", category: "garden-plants",    price: 620,  rarity: "rare", emoji: "🌸", description: "A full canopy of soft pink blooms. Petals drift when the wind blows." },
  { id: "garden-torii",          name: "Torii gate",           category: "garden-structures", price: 800,  rarity: "epic", emoji: "⛩️", description: "A bold vermillion arch — every step through it feels like a new beginning." },
  { id: "garden-stone-lantern",  name: "Stone lantern",        category: "garden-structures", price: 240,  rarity: "uncommon", emoji: "🪔", description: "A mossy granite lantern that glows warm amber at dusk." },
  { id: "garden-koi-pond",       name: "Koi pond",             category: "garden-plants",    price: 480,  rarity: "rare", emoji: "🐟", description: "Orange and white koi circle under lily pads in clear turquoise water." },
  { id: "garden-tea-house",      name: "Tea house",            category: "garden-structures", price: 1000, rarity: "epic", emoji: "🫖", description: "A pagoda-roofed tea house with paper screens and a wooden porch." },

  // ───────────────────── GARDEN — AUTUMN / HARVEST ─────────────────────
  { id: "garden-maple-tree",     name: "Maple tree",           category: "garden-plants",    price: 560, rarity: "rare", emoji: "🍁", description: "Blazing red and orange leaves. A riot of warm color every session." },
  { id: "garden-harvest-cart",   name: "Harvest cart",         category: "garden-critters",  price: 280, rarity: "uncommon", emoji: "🛒", description: "A weathered wooden cart overflowing with pumpkins and apples." },
  { id: "garden-pumpkin-stack",  name: "Pumpkin stack",        category: "garden-plants",    price: 130, rarity: "common", emoji: "🎃", description: "Three cheerfully carved jack-o-lanterns stacked for maximum autumn energy." },
  { id: "garden-leaf-pile",      name: "Leaf pile",            category: "garden-critters",  price: 90,  rarity: "common", emoji: "🍂", description: "A golden heap of autumn leaves with a rake leaning on the side." },

  // ───────────────────── GARDEN — ELEGANT ─────────────────────
  { id: "garden-marble-fountain",name: "Marble fountain",      category: "garden-structures", price: 1600, rarity: "legendary", emoji: "⛲", description: "A three-tiered marble fountain with flowing turquoise water." },
  { id: "garden-topiary",        name: "Topiary sphere",       category: "garden-plants",    price: 280,  rarity: "uncommon", emoji: "🌿", description: "A perfectly spherical emerald topiary on a stone pedestal." },
  { id: "garden-rose-arch",      name: "Rose arch",            category: "garden-structures", price: 720,  rarity: "rare", emoji: "🌹", description: "A stone arch draped with red roses and cascading ivy." },
  { id: "garden-sundial",        name: "Sundial",              category: "garden-structures", price: 240,  rarity: "uncommon", emoji: "🕐", description: "A classical stone sundial. Time passes more gently here." },

  // ───────────────────── GARDEN — ZEN & MAGICAL ─────────────────────
  { id: "garden-pagoda",         name: "Pagoda",               category: "garden-structures", price: 1450, rarity: "legendary", emoji: "🏯", description: "A three-tier red-and-gold pagoda with upturned eaves and stone steps." },
  { id: "garden-bamboo",         name: "Bamboo grove",         category: "garden-plants",    price: 280,  rarity: "uncommon", emoji: "🎋", description: "A tight cluster of vibrant green bamboo stalks whispering in the breeze." },
  { id: "garden-crystal-tree",   name: "Crystal tree",         category: "garden-plants",    price: 2600, rarity: "legendary", emoji: "💎", description: "A magical tree bearing glowing crystal fruits. Lights up purple at night." },
  { id: "garden-mushroom-house", name: "Mushroom house",       category: "garden-structures", price: 800,  rarity: "epic", emoji: "🍄", description: "A whimsical fairy-tale home carved inside a giant red-capped mushroom." },

  // ───────────────────── GARDEN — GOLDEN TROPHIES ─────────────────────
  // NOT bought with coins. They unlock based on lifetime focus minutes and are
  // claimed for free once unlocked. Visually they share the base item's art but
  // get a CSS gold filter at render time. Tagged legendary for the badge.
  { id: "garden-golden-lantern",   name: "Golden lantern",   category: "garden-golden", price: 0, rarity: "legendary", unlocks_at_minutes: 300,   emoji: "🏮", description: "A glowing brass lantern. Unlocks after 5 focused hours.",   art: "/td-items/lantern.webp" },
  { id: "garden-golden-gnome",     name: "Golden gnome",     category: "garden-golden", price: 0, rarity: "legendary", unlocks_at_minutes: 900,   emoji: "🧙", description: "A gilded gnome that smiles knowingly. Unlocks at 15 hours.", art: "/td-items/gnome.webp" },
  { id: "garden-golden-cottage",   name: "Golden cottage",   category: "garden-golden", price: 0, rarity: "legendary", unlocks_at_minutes: 1800,  emoji: "🏡", description: "A grand cottage with a golden roof. Unlocks at 30 hours.",   art: "/td-items/cottage.webp" },
  { id: "garden-golden-applestree",name: "Golden tree",      category: "garden-golden", price: 0, rarity: "legendary", unlocks_at_minutes: 3600,  emoji: "🌳", description: "An apple tree heavy with golden fruit. Unlocks at 60 hours.", art: "/td-items/applestree.webp" },
  { id: "garden-golden-gazebo",    name: "Golden gazebo",    category: "garden-golden", price: 0, rarity: "legendary", unlocks_at_minutes: 7200,  emoji: "🌹", description: "Ornate gold gazebo, climbing roses, the works. Unlocks at 120 hours.", art: "/td-items/gazebo.webp" },
  { id: "garden-golden-fairyring", name: "Golden fairy ring",category: "garden-golden", price: 0, rarity: "legendary", unlocks_at_minutes: 14400, emoji: "✨", description: "A trophy ring of luminous gold mushrooms. Unlocks at 240 hours.", art: "/td-items/fairyring.webp" }
];

export function rewardById(id: string) {
  return REWARDS.find((r) => r.id === id);
}
