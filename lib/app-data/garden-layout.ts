/**
 * Default position + size + z-layer for each placeable garden item.
 *
 * `x` / `y` are percentages (0–100) of the scene canvas. `size` is a
 * rendered tile size (1–20-ish). `z` is paint order: lower = behind.
 *
 * Used in two places:
 *  - Server (garden page): seeds `user_settings.garden_layout` for existing
 *    users on first load of the inventory flow, so their pre-existing
 *    auto-placed scene doesn't suddenly empty.
 *  - Client (GardenScene): resolves rendered size / z and provides a sensible
 *    default position when the user has no saved coords for an item.
 *
 * This module MUST stay free of "use client" code so it can be imported
 * from both server components and client components.
 */
export type TileDefault = { x: number; y: number; size: number; z: number };

export const TD_LAYOUT: Record<string, TileDefault> = {
  // FARM zone (top-left brown rectangle)
  "garden-vegpatch":     { x: 10, y: 22, size: 9,  z: 5 },
  "garden-pumpkinpatch": { x: 22, y: 22, size: 10, z: 5 },
  "garden-haybale":      { x: 32, y: 32, size: 9,  z: 6 },
  "garden-applestree":   { x: 16, y: 32, size: 8,  z: 4 },
  "garden-scarecrow":    { x: 28, y: 12, size: 9,  z: 5 },

  // TOP-RIGHT POND zone
  "garden-waterlilies":  { x: 75, y: 20, size: 8,  z: 8 },
  "garden-frogstatue":   { x: 65, y: 22, size: 6,  z: 9 },
  "garden-birdbath":     { x: 88, y: 22, size: 8,  z: 7 },

  // BOTTOM-LEFT POND zone
  "garden-pond":         { x: 18, y: 75, size: 12, z: 5 },
  "garden-bridge":       { x: 38, y: 60, size: 11, z: 8 },

  // BOTTOM-RIGHT ROSE GARDEN zone
  "garden-gazebo":       { x: 72, y: 78, size: 12, z: 5 },
  "garden-flowerbed":    { x: 62, y: 72, size: 9,  z: 8 },
  "garden-gnome":        { x: 88, y: 78, size: 7,  z: 9 },
  "garden-mushrooms":    { x: 78, y: 65, size: 7,  z: 7 },
  "garden-fairyring":    { x: 70, y: 85, size: 8,  z: 7 },
  "garden-snail":        { x: 86, y: 70, size: 5,  z: 9 },

  // CENTER homestead
  "garden-cottage":      { x: 50, y: 50, size: 14, z: 5 },
  "garden-well":         { x: 40, y: 42, size: 9,  z: 6 },
  "garden-picnic":       { x: 38, y: 60, size: 8,  z: 6 },
  "garden-lantern":      { x: 50, y: 38, size: 7,  z: 7 },
  "garden-mailbox":      { x: 60, y: 60, size: 7,  z: 6 },
  "garden-signpost":     { x: 42, y: 30, size: 7,  z: 7 },
  "garden-bench":        { x: 60, y: 42, size: 9,  z: 6 },

  // EDGES
  "garden-treehouse":    { x: 50, y: 12, size: 12, z: 4 },
  "garden-beehive":      { x: 90, y: 50, size: 7,  z: 3 }
};

/** Reward-id prefix used to identify placeable garden items
 *  (excludes garden-map-, which is equipped not placed). */
export function isPlaceableGardenId(id: string): boolean {
  return id.startsWith("garden-") && !id.startsWith("garden-map-");
}
