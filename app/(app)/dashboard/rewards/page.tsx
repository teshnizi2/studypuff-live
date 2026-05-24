import { redirect } from "next/navigation";

// The shop has merged into the new full-page Garden — same coins, same
// purchase flow, plus garden items that appear in your scene above.
export default function LegacyRewardsRedirect() {
  redirect("/dashboard/garden");
}
