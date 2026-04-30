export type RewardCategory = "sound" | "theme" | "accessory";

export type Reward = {
  id: string;
  name: string;
  category: RewardCategory;
  price: number;
  emoji: string;
  description: string;
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
  { id: "sheep-mug", name: "Floating tea mug", category: "accessory", price: 60, emoji: "🍵", description: "A small mug of tea that follows the sheep around." }
];

export function rewardById(id: string) {
  return REWARDS.find((r) => r.id === id);
}
