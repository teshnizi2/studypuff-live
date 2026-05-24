export type RewardCategory = "sound" | "theme" | "accessory" | "garden";

export type Reward = {
  id: string;
  name: string;
  category: RewardCategory;
  price: number;
  emoji: string;
  description: string;
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
  { id: "garden-mushrooms", name: "Mushroom cluster", category: "garden", price: 70, emoji: "🍄", description: "A patch of red-capped mushrooms tucked in the grass.", placement: { x: 22, y: 78, scale: 1 } },
  { id: "garden-bench", name: "Stone bench", category: "garden", price: 90, emoji: "🪑", description: "A quiet bench to sit at after a focus session.", placement: { x: 78, y: 76, scale: 1.1 } },
  { id: "garden-vegpatch", name: "Vegetable patch", category: "garden", price: 110, emoji: "🥕", description: "Carrots and greens growing in neat rows.", placement: { x: 34, y: 84, scale: 1.05 } },
  { id: "garden-lantern", name: "Lantern path", category: "garden", price: 130, emoji: "🏮", description: "Soft paper lanterns lighting a little path.", placement: { x: 48, y: 86, scale: 0.95 } },
  { id: "garden-birdbath", name: "Bird bath", category: "garden", price: 150, emoji: "🪺", description: "A stone bowl where little birds come to splash.", placement: { x: 62, y: 82, scale: 1 } },
  { id: "garden-pond", name: "Wishing pond", category: "garden", price: 180, emoji: "💧", description: "A small clear pond with a lily pad or two.", placement: { x: 84, y: 84, scale: 1.4 } },
  { id: "garden-cottage", name: "Cozy cottage", category: "garden", price: 240, emoji: "🏡", description: "A little wooden cottage at the edge of your garden.", placement: { x: 12, y: 70, scale: 1.6 } },
  { id: "garden-gnome", name: "Garden gnome", category: "garden", price: 280, emoji: "🧙", description: "A friendly gnome watching over your tree.", placement: { x: 38, y: 88, scale: 0.9 } }
];

export function rewardById(id: string) {
  return REWARDS.find((r) => r.id === id);
}
