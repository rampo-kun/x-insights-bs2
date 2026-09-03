"use client";

import { Archetype } from "@/lib/types";

const RISK_STYLES: Record<Archetype["riskLevel"], string> = {
  Low: "bg-good/15 text-good border-good/30",
  Moderate: "bg-accent2/15 text-accent2 border-accent2/30",
  Elevated: "bg-warn/15 text-warn border-warn/30",
  High: "bg-orange-400/15 text-orange-300 border-orange-400/30",
  Critical: "bg-bad/15 text-bad border-bad/30",
};

export default function PersonaBadge({ archetype }: { archetype: Archetype }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-full border ${RISK_STYLES[archetype.riskLevel]}`}
    >
      RISK: {archetype.riskLevel.toUpperCase()}
    </span>
  );
}
