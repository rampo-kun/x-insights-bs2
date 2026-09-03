import { Answers, ScoreResult, AiPrescription } from "./types";
import { SECTOR_BENCHMARKS } from "./personas";

const CHALLENGE_PLAYS: Record<string, string[]> = {
  "Finance & working capital": [
    "Build a rolling 13-week cash-flow tracker (even in a spreadsheet) so you can see a shortfall 3 months out instead of 3 days out.",
    "Apply for one government MSME credit scheme (CGTMSE / MUDRA) this quarter to build a formal credit trail for cheaper future capital.",
  ],
  "Hiring and retaining skilled employees": [
    "Document your 3 most critical workflows so a new hire can be productive in days, not months — this alone cuts your retention risk in half.",
    "Introduce one low-cost retention lever this quarter — a skill-linked bonus or flexible shift — and track its effect on your next 90 days of attrition.",
  ],
  "Finding customers & increasing sales": [
    "Set up a single daily sales log reviewed every morning so you can spot dips within 24 hours, not 24 days.",
    "Run a 2-week test of one demand lever — a bundle, a slow-hour discount, or a referral incentive — and measure it against your baseline.",
  ],
  "Supply chain & raw-material issues": [
    "Identify your top 3 revenue-driving SKUs and set a manual reorder trigger (e.g. reorder at 20% stock left) so you never run out of what sells.",
    "Line up a second backup supplier for your single highest-risk input within 30 days to remove your biggest point of failure.",
  ],
  "Technology & digital transformation": [
    "Pick one manual process eating the most hours weekly and digitize just that one — a single POS, sheet, or app beats a full overhaul.",
    "Set a 90-day goal to move your top 2 workflows off paper, with one named owner per workflow.",
  ],
  "Government regulations & compliance": [
    "Build a compliance calendar with every filing deadline in one place — most penalties come from missed dates, not missing knowledge.",
    "Register on the Udyam portal (if not already) to unlock MSME-specific compliance relaxations and scheme eligibility.",
  ],
  "Operations & productivity": [
    "Map your single slowest step end-to-end this week and cut just one handoff or approval from it.",
    "Set 3 measurable weekly output targets for your core process and review them every Friday for a month.",
  ],
  "Competition & market changes": [
    "Spend 30 minutes this week studying your top 2 competitors' pricing and offers — most MSMEs never do this systematically.",
    "Pick one clear differentiator (speed, quality, service) and put it in every customer touchpoint for the next 30 days.",
  ],
};

const AI_BENEFIT_LINES: Record<string, string> = {
  "Sales & marketing": "AI-driven lead scoring or WhatsApp-based campaign tools",
  "Customer service": "an AI chatbot handling routine queries so your team focuses on complex ones",
  "Finance & accounting": "AI-assisted bookkeeping and cash-flow forecasting tools",
  "HR & recruitment": "AI resume screening and onboarding checklists to cut hiring time",
  "Inventory & supply chain": "AI-based demand forecasting to reduce both stockouts and dead stock",
  "Production/operations": "AI-driven quality checks or predictive maintenance",
  "Business forecasting": "AI-powered sales and demand forecasting from your existing sales data",
  "Not sure": "a lightweight AI dashboard summarizing your key numbers weekly",
};

const INTERNAL_FACTOR_LINES: Record<string, string> = {
  "Employees & HR": "too much of your week going into people-management rather than growth",
  "Customers & sales": "sales and customer handling eating your bandwidth",
  "Finance & cash flow": "cash-flow firefighting pulling focus from strategy",
  "Operations": "day-to-day operations consuming time that should go into planning",
  "Suppliers & procurement": "supplier coordination taking up disproportionate attention",
  "Compliance": "compliance admin quietly draining hours each week",
  "Technology": "technology headaches slowing down everything else",
};

const EXTERNAL_FACTOR_LINES: Record<string, string> = {
  "Inflation and rising costs": "rising input costs are squeezing margins sector-wide",
  "Changes in customer demand": "shifting customer demand is rewarding businesses that can sense it fastest",
  "Increased competition": "intensifying competition is raising the bar on customer experience",
  "Government policies/regulations": "regulatory shifts are rewarding businesses with tighter compliance systems",
  "Supply-chain disruptions": "ongoing supply-chain disruption is favoring businesses with backup suppliers",
  "Economic slowdown/uncertainty": "economic uncertainty is rewarding lean, cash-disciplined operators",
  "Technological disruption": "technological disruption is widening the gap between digital and manual operators",
  "Geopolitical/global events": "global volatility is rewarding businesses with diversified supply and demand",
};

export function generateFallback(answers: Answers, score: ScoreResult): AiPrescription {
  const sector = answers.q2_sector ?? "IT & Services";
  const challenge = answers.q9_challenge ?? "Technology & digital transformation";
  const benefitArea = answers.q10_ai_benefit_area ?? "Not sure";
  const timeConsuming = answers.q11_time_consuming ?? "Operations";
  const externalFactor = answers.q12_external_factor ?? "Increased competition";
  const benchmark = SECTOR_BENCHMARKS[sector] ?? SECTOR_BENCHMARKS["IT & Services"];
  const persona = score.archetype;
  const msmeType = answers.q1_msme_type ?? "Small";

  const internalLine = INTERNAL_FACTOR_LINES[timeConsuming] ?? INTERNAL_FACTOR_LINES["Operations"];
  const externalLine = EXTERNAL_FACTOR_LINES[externalFactor] ?? EXTERNAL_FACTOR_LINES["Increased competition"];

  const executive_summary = `As a ${msmeType} enterprise, you're operating as ${persona.name} — ${persona.tagline.toLowerCase()} With a score of ${score.totalScore}/${score.maxScore} and ${internalLine}, your instincts are ${
    score.percent >= 60 ? "already outperforming most peers in the room" : "solid, but your systems haven't caught up to your ambition yet"
  }.`;

  const competitor_insight = `Top-performing ${sector} businesses are growing at roughly ${benchmark.cagr} annually. Right now, ${externalLine} — and ${benchmark.note.charAt(0).toLowerCase() + benchmark.note.slice(1)}`;

  const plays = CHALLENGE_PLAYS[challenge] ?? CHALLENGE_PLAYS["Technology & digital transformation"];
  const benefitLine = AI_BENEFIT_LINES[benefitArea] ?? AI_BENEFIT_LINES["Not sure"];
  const ai_prescription = `1) ${plays[0]} 2) ${plays[1]} Longer-term, ${benefitLine} is your highest-leverage AI entry point.`;

  return {
    executive_summary,
    competitor_insight,
    ai_prescription,
    source: "fallback",
  };
}
