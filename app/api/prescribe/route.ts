import { NextRequest, NextResponse } from "next/server";
import { Answers, ScoreResult, AiPrescription } from "@/lib/types";
import { SECTOR_BENCHMARKS } from "@/lib/personas";
import { generateFallback } from "@/lib/fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RequestBody {
  answers: Answers;
  score: ScoreResult;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";
const TIMEOUT_MS = 8000;

function buildSystemPrompt(): string {
  return `You are "AI Business Doctor", a sharp, witty MSME growth strategist speaking at a live event stall.
You MUST respond with ONLY a single valid JSON object — no markdown, no code fences, no preamble, no commentary.
The JSON object must match exactly this schema:
{
  "executive_summary": string,   // 2 punchy sentences validating the user's business persona, using their score/percent
  "competitor_insight": string,  // 1-2 sentences on how top competitors in their sector leverage data, referencing the given industry CAGR
  "ai_prescription": string      // 2 actionable, highly tactical, numbered steps ("1) ... 2) ...") to fix their stated challenge within 30 days, plus one line tying it to their chosen AI-benefit area
}
Consider both internal factors (their biggest challenge, and what consumes most of their management time) and external factors (the macro pressure they selected) when writing the executive_summary and competitor_insight — a strong answer acknowledges both what's happening inside the business and outside it.
Tone: confident, energetic, specific — never generic corporate fluff. No hedging language. Keep each field concise (under 65 words).`;
}

function buildUserPrompt(answers: Answers, score: ScoreResult): string {
  const sector = answers.q2_sector ?? "IT & Services";
  const benchmark = SECTOR_BENCHMARKS[sector] ?? SECTOR_BENCHMARKS["IT & Services"];

  return JSON.stringify({
    persona: score.archetype.name,
    persona_tagline: score.archetype.tagline,
    total_score: score.totalScore,
    max_score: score.maxScore,
    percent: score.percent,
    pillars: score.pillars,
    msme_type: answers.q1_msme_type,
    sector,
    employee_count: answers.q3_employees,
    sector_benchmark_cagr: benchmark.cagr,
    sector_benchmark_note: benchmark.note,
    primary_challenge: answers.q9_challenge,
    ai_benefit_area: answers.q10_ai_benefit_area,
    time_consuming_area: answers.q11_time_consuming,
    external_factor: answers.q12_external_factor,
    sales_tracking_method: answers.q4_sales_tracking,
    inventory_method: answers.q5_inventory,
    retention_method: answers.q6_retention,
    decision_method: answers.q7_data_decisions,
    ai_adoption_level: answers.q8_ai_adoption,
  });
}

function safeParseJson(raw: string): Partial<AiPrescription> | null {
  // Strip markdown code fences if the model added them despite instructions.
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    // Attempt to salvage a JSON object substring.
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

function isValidPrescription(obj: Partial<AiPrescription> | null): obj is Omit<AiPrescription, "source"> {
  return (
    !!obj &&
    typeof obj.executive_summary === "string" &&
    obj.executive_summary.trim().length > 0 &&
    typeof obj.competitor_insight === "string" &&
    obj.competitor_insight.trim().length > 0 &&
    typeof obj.ai_prescription === "string" &&
    obj.ai_prescription.trim().length > 0
  );
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { answers, score } = body;
  if (!answers || !score) {
    return NextResponse.json({ error: "Missing answers or score" }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;

  // No key configured -> deterministic fallback immediately.
  if (!apiKey) {
    return NextResponse.json(generateFallback(answers, score));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(answers, score) },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(generateFallback(answers, score));
    }

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(generateFallback(answers, score));
    }

    const parsed = safeParseJson(content);
    if (!isValidPrescription(parsed)) {
      return NextResponse.json(generateFallback(answers, score));
    }

    const result: AiPrescription = {
      executive_summary: parsed.executive_summary!,
      competitor_insight: parsed.competitor_insight!,
      ai_prescription: parsed.ai_prescription!,
      source: "groq",
    };
    return NextResponse.json(result);
  } catch {
    clearTimeout(timeout);
    return NextResponse.json(generateFallback(answers, score));
  }
}
