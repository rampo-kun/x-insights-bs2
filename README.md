# AI Business Doctor — X-Insights

A 60-second MSME business health diagnostic built for a live event stall.
Visitors answer 6 questions, get a deterministic health score (0–120), a
witty business archetype/persona, an AI-generated strategic prescription
(via Groq, with an automatic offline fallback), and can download a branded
one-page PDF report on the spot.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Framer Motion** for step transitions
- **Recharts** for the score gauge + pillar radar chart
- **Lucide React** for icons
- **Groq API** (`llama-3.1-8b-instant`) for the AI prescription, called
  server-side from `app/api/prescribe/route.ts`, with a strict-JSON
  deterministic fallback in `lib/fallback.ts` so the stall never breaks
  without Wi-Fi or an API key
- **jsPDF + html2canvas** for fully client-side PDF export (no server round
  trip, works offline once the page has loaded)

## Getting started

```bash
npm install
cp .env.local.example .env.local
# paste a free key from https://console.groq.com/keys into GROQ_API_KEY
npm run dev
```

Open http://localhost:3000.

> If you skip the `GROQ_API_KEY`, the app still works end-to-end — the
> `/api/prescribe` route automatically returns high-quality templated copy
> instead of calling Groq. This is intentional: a stall with flaky venue
> Wi-Fi should never show a broken screen.

## The 10 questions

| # | Question | Type |
|---|---|---|
| Q1 | MSME size (Micro/Small/Medium) | Classification |
| Q2 | Sector (Agro/Manufacturing/IT & Services/Retail & Trade) | Classification, drives benchmark |
| Q3 | Employee count (range) | Classification |
| Q4 | Sales tracking method | **Scored** (30/15/5) |
| Q5 | Inventory management | **Scored** (30/15/5) |
| Q6 | Customer retention | **Scored** (30/15/5) |
| Q7 | Data & decisions | **Scored** (30/15/5) |
| Q8 | AI adoption level | **Scored** (30/20/12/6/0) |
| Q9 | Biggest challenge (last 2–3 yrs, 8 options) | Qualitative — drives prescription |
| Q10 | Which area could benefit most from AI (8 options) | Qualitative — drives prescription |

## How scoring works

- **Q1–Q3** are classification only — used for report context and sector
  benchmarking, not scored.
- **Q4–Q8** are the five scored pillars, each normalized to a 30-point
  scale, for a **max score of 150**.
- **Q9–Q10** are qualitative — they don't affect the score, but they're
  passed to the AI prescription layer so the copy targets the visitor's
  actual stated challenge and highest-leverage AI opportunity.
- The five pillar scores (Sales Tracking, Inventory Health, Customer
  Retention, Digital Readiness, AI Adoption) are each the corresponding
  question's raw points normalized to a 0–100 scale for the radar chart.
- The total score maps deterministically to one of six archetypes (see
  `lib/personas.ts`). Thresholds are rescaled from the original 0–120
  system to preserve the same percentage cutoffs on the new 0–150 scale:

  | Score range | Percent | Archetype |
  |---|---|---|
  | 130–150 | ≥87% | The Apex Blueprint |
  | 110–129 | ≥73% | The Data Grandmaster |
  | 85–109 | ≥57% | The Midfield Playmaker |
  | 60–84 | ≥40% | The Midnight Hustler |
  | 35–59 | ≥23% | The Vintage Artisan |
  | < 35 | <23% | The Lone Wolf |

All scoring and persona logic is pure and deterministic — the LLM is only
ever used to generate the narrative copy layered on top, and never touches
the score itself.

## Project structure

```
app/
  page.tsx                 # Orchestrates intro → intake → loading → results
  layout.tsx                # Root layout, fonts
  globals.css                # Tailwind + custom styling
  api/prescribe/route.ts     # Groq call + strict JSON parsing + fallback
components/
  Header.tsx, ProgressBar.tsx, QuestionCard.tsx, IntakeForm.tsx
  LoadingAnalysis.tsx
  ScoreGauge.tsx, PillarRadar.tsx, PersonaBadge.tsx
  ResultsView.tsx             # The one-page report (also the PDF capture target)
  DownloadPdfButton.tsx
lib/
  types.ts, questions.ts, personas.ts, scoring.ts, fallback.ts, pdf.ts
```

## Deployment

Deploy as-is to Vercel (`vercel deploy`) or any Node host that supports
Next.js API routes. Set `GROQ_API_KEY` as an environment variable in your
hosting dashboard — no other configuration is required.

## Notes on the PDF export

`ResultsView` renders the full report inside a single `div` (`captureRef`).
`DownloadPdfButton` passes that ref to `lib/pdf.ts`, which uses
`html2canvas` to snapshot it at 2x scale and `jsPDF` to place it on a single
A4 page. This runs entirely in the browser — nothing is uploaded to a
server, so it works even on venue Wi-Fi that only allows outbound calls to
the Groq API (or not at all, once the page and fonts are cached).
