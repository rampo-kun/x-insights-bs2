import { Archetype } from "./types";

export const ARCHETYPES: Archetype[] = [
  {
    id: "apex-blueprint",
    name: "The Apex Blueprint",
    tagline: "Hyper-optimized. Data — and AI — are your native language.",
    description:
      "You run a scalable, systems-driven operation. Your data infrastructure is already doing the heavy lifting — the next unlock is compounding it with predictive AI, not fixing broken basics.",
    emoji: "🏆",
    colorFrom: "#22D3EE",
    colorTo: "#7C5CFF",
    riskLevel: "Low",
  },
  {
    id: "data-grandmaster",
    name: "The Data Grandmaster",
    tagline: "Calculated, strategic, a few blind spots.",
    description:
      "You think several moves ahead and most of your operation is instrumented. A handful of manual gaps are quietly capping your ceiling — close them and you're playing an entirely different game.",
    emoji: "♟️",
    colorFrom: "#7C5CFF",
    colorTo: "#22D3EE",
    riskLevel: "Low",
  },
  {
    id: "midfield-playmaker",
    name: "The Midfield Playmaker",
    tagline: "Solid vision and hustle, manual bottlenecks.",
    description:
      "You've got real business instincts and momentum, but too much still runs through spreadsheets and memory. You're one system upgrade away from unlocking serious scale.",
    emoji: "⚡",
    colorFrom: "#34D399",
    colorTo: "#22D3EE",
    riskLevel: "Moderate",
  },
  {
    id: "midnight-hustler",
    name: "The Midnight Hustler",
    tagline: "Grit-fueled, spreadsheet overload, burnout risk.",
    description:
      "You're keeping the whole business alive through sheer effort — but you're the single point of failure. Spreadsheet sprawl and late nights are a warning sign, not a badge of honor.",
    emoji: "🌙",
    colorFrom: "#FBBF24",
    colorTo: "#FB7185",
    riskLevel: "Elevated",
  },
  {
    id: "vintage-artisan",
    name: "The Vintage Artisan",
    tagline: "Old-school charm, high ledger risk.",
    description:
      "Your craft and customer relationships are genuine assets, but the business runs almost entirely on paper and memory. That charm is fragile the moment volume or turnover increases.",
    emoji: "📜",
    colorFrom: "#FB923C",
    colorTo: "#FBBF24",
    riskLevel: "High",
  },
  {
    id: "lone-wolf",
    name: "The Lone Wolf",
    tagline: "One-person army. Urgent digitization needed.",
    description:
      "You're carrying the entire business on instinct alone with almost no digital safety net. This is the highest-leverage moment to install even basic systems — the upside from here is enormous.",
    emoji: "🐺",
    colorFrom: "#FB7185",
    colorTo: "#F43F5E",
    riskLevel: "Critical",
  },
];

/**
 * Thresholds rescaled from the original 0-120 scale to the current
 * 0-150 scale (5 scored questions x 30 pts), preserving the original
 * percentage cutoffs: 87.5% / 75% / 58.3% / 41.7% / 25%.
 */
export function getArchetype(score: number): Archetype {
  if (score >= 130) return ARCHETYPES[0];
  if (score >= 110) return ARCHETYPES[1];
  if (score >= 85) return ARCHETYPES[2];
  if (score >= 60) return ARCHETYPES[3];
  if (score >= 35) return ARCHETYPES[4];
  return ARCHETYPES[5];
}

export const SECTOR_BENCHMARKS: Record<string, { cagr: string; note: string }> = {
  Agro: {
    cagr: "~8%",
    note: "Leading agri-businesses use demand forecasting and cold-chain tracking to cut post-harvest losses sharply.",
  },
  Manufacturing: {
    cagr: "~9%",
    note: "Leading manufacturers use predictive maintenance and demand forecasting to cut downtime and waste.",
  },
  "IT & Services": {
    cagr: "~12%",
    note: "Top service firms use CRM-driven retention loops and AI-assisted delivery to lower cost-to-serve over time.",
  },
  "Retail & Trade": {
    cagr: "~11%",
    note: "Digitally-native retailers use dynamic pricing and loyalty data to compound repeat revenue.",
  },
};
