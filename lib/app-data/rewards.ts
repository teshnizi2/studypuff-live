export type RewardCategory = "sound" | "theme" | "accessory" | "garden";

export type Reward = {
  id: string;
  name: string;
  category: RewardCategory;
  price: number;
  emoji: string;
  description: string;
  /** Bespoke art asset path (for garden items rendered in the scene). */
  art?: string;
  /** For garden items: where the item sits on the garden scene, as a
   *  percentage of the scene's width / height (0–100). Larger values move
   *  toward the right / bottom. Optional `scale` tweaks the rendered size. */
  placement?: { x: number; y: number; scale?: number };
};

export const REWARDS: Reward[] = [
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

  // Garden items — auto-placed in the garden scene when owned.
  // Bespoke flat-illustration art (fal.ai-generated), webp-optimized.
  // Placement is in % of the scene; scale tweaks rendered size.
  { id: "garden-mushrooms", name: "Mushroom cluster", category: "garden", price: 70, emoji: "🍄", description: "A patch of red-capped mushrooms tucked in the grass.", art: "/garden/item-mushrooms.webp", placement: { x: 22, y: 78, scale: 0.9 } },
  { id: "garden-bench", name: "Stone bench", category: "garden", price: 90, emoji: "🪑", description: "A quiet bench to sit at after a focus session.", art: "/garden/item-bench.webp", placement: { x: 78, y: 78, scale: 1.0 } },
  { id: "garden-vegpatch", name: "Vegetable patch", category: "garden", price: 110, emoji: "🥕", description: "Carrots and greens growing in neat rows.", art: "/garden/item-vegpatch.webp", placement: { x: 34, y: 86, scale: 1.0 } },
  { id: "garden-lantern", name: "Lantern path", category: "garden", price: 130, emoji: "🏮", description: "Soft paper lanterns lighting a little path.", art: "/garden/item-lantern.webp", placement: { x: 50, y: 82, scale: 1.0 } },
  { id: "garden-birdbath", name: "Bird bath", category: "garden", price: 150, emoji: "🪺", description: "A stone bowl where little birds come to splash.", art: "/garden/item-birdbath.webp", placement: { x: 64, y: 80, scale: 1.0 } },
  { id: "garden-pond", name: "Wishing pond", category: "garden", price: 180, emoji: "💧", description: "A small clear pond with a lily pad or two.", art: "/garden/item-pond.webp", placement: { x: 86, y: 88, scale: 1.35 } },
  { id: "garden-cottage", name: "Cozy cottage", category: "garden", price: 240, emoji: "🏡", description: "A little wooden cottage at the edge of your garden.", art: "/garden/item-cottage.webp", placement: { x: 14, y: 70, scale: 1.45 } },
  { id: "garden-gnome", name: "Garden gnome", category: "garden", price: 280, emoji: "🧙", description: "A friendly gnome watching over your tree.", art: "/garden/item-gnome.webp", placement: { x: 40, y: 90, scale: 0.85 } }
];

export function rewardById(id: string) {
  return REWARDS.find((r) => r.id === id);
}
