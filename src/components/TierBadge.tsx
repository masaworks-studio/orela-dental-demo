import Link from "next/link";
import type { Tier } from "@/content/features";

const NAMES: Record<Tier, string> = { starter: "Starter", growth: "Growth", pro: "Pro" };

/**
 * Portfolio label: which pricing tier this feature belongs to. It is not part of the clinic site, so
 * it looks the same as the demo bar (yellow dotted line) and can be hidden from the demo bar.
 */
export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <Link className="tier-badge" href="/demo/pricing/" title={`Portfolio label: included from the ${NAMES[tier]} package`}>
      {NAMES[tier]}
    </Link>
  );
}
