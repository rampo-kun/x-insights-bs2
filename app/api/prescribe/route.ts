import { NextRequest, NextResponse } from "next/server";
import { Answers, ScoreResult, AiPrescription } from "@/lib/types";
import { SECTOR_BENCHMARKS } from "@/lib/personas";
import { QUESTIONS } from "@/lib/questions";
import { generateFallback } from "@/lib/fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RequestBody {
  answers: Answers;
  score: ScoreResult;
}

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";
const TIMEOUT_MS = 40000;

/**
 * Resolves question option values (like numeric scores 30, 15, 5)
 * into their human-readable labels and sublabels for the AI.
 */
function resolveAnswerText(key: string, value: any): string {
  if (value === undefined || value === null) return "Not specified";
  const question = QUESTIONS.find((q) => q.key === key);
  if (!question) return String(value);

  const option = question.options.find((opt) => opt.value === value);
  if (!option) return String(value);

  return option.sublabel
    ? `${option.label} (${option.sublabel})`
    : option.label;
}

function buildSystemPrompt(): string {
  return `You are "AI Business Doctor", a sharp, witty MSME growth strategist speaking at a live event stall.
You MUST respond with ONLY a single valid JSON object — no markdown, no code fences, no preamble, no commentary.
The JSON object must match exactly this schema:
{
  "executive_summary": string,   // 2 punchy sentences validating the user's business persona, using their score/percent
  "competitor_insight": string,  // 1-2 sentences on how top competitors in their sector leverage data, referencing the given industry CAGR
  "ai_prescription": string      // 2 actionable, highly tactical, numbered steps ("1) ... 2) ...") to fix their stated challenge within 30 days, plus one line tying it to their chosen AI-benefit area (if they selected "Not sure", prescribe the single highest-ROI AI area based on their stated challenge)
}
Consider both internal factors (their biggest challenge, and what consumes most of their management time) and external factors (the macro pressure they selected) when writing the executive_summary and competitor_insight.
Tone: confident, energetic, specific — never generic corporate fluff. No hedging language. Keep each field concise (under 65 words).`;
}

function buildUserPrompt(answers: Answers, score: ScoreResult): string {
  const sector = answers.q2_sector ?? "IT & Services";
  const benchmark =
    SECTOR_BENCHMARKS[sector] ?? SECTOR_BENCHMARKS["IT & Services"];

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
    sales_tracking_method: resolveAnswerText(
      "q4_sales_tracking",
      answers.q4_sales_tracking,
    ),
    inventory_method: resolveAnswerText("q5_inventory", answers.q5_inventory),
    retention_method: resolveAnswerText("q6_retention", answers.q6_retention),
    decision_method: resolveAnswerText(
      "q7_data_decisions",
      answers.q7_data_decisions,
    ),
    ai_adoption_level: resolveAnswerText(
      "q8_ai_adoption",
      answers.q8_ai_adoption,
    ),
  });
}

function safeParseJson(raw: string): Partial<AiPrescription> | null {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
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

function isValidPrescription(
  obj: Partial<AiPrescription> | null,
): obj is Omit<AiPrescription, "source"> {
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
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { answers, score } = body;
  if (!answers || !score) {
    return NextResponse.json(
      { error: "Missing answers or score" },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is missing. Serving fallback.");
    return NextResponse.json(generateFallback(answers, score));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt() }],
        },
        contents: [
          {
            parts: [{ text: buildUserPrompt(answers, score) }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Gemini API Error (${res.status}):`, errorText);
      return NextResponse.json(generateFallback(answers, score));
    }

    const data = await res.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("❌ Gemini returned an empty response.");
      return NextResponse.json(generateFallback(answers, score));
    }

    const parsed = safeParseJson(content);
    if (!isValidPrescription(parsed)) {
      console.error("❌ Gemini response failed schema validation:", content);
      return NextResponse.json(generateFallback(answers, score));
    }

    const result: AiPrescription = {
      executive_summary: parsed.executive_summary!,
      competitor_insight: parsed.competitor_insight!,
      ai_prescription: parsed.ai_prescription!,
      source: "gemini",
    };
    return NextResponse.json(result);
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === "AbortError") {
      console.error(`⏱️ Gemini API timed out after ${TIMEOUT_MS}ms.`);
    } else {
      console.error("💥 Unexpected Error during Gemini fetch:", error);
    }
    return NextResponse.json(generateFallback(answers, score));
  }
}
