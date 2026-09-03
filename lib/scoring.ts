import { Answers, PillarScores, ScoreResult } from "./types";
import { getArchetype } from "./personas";

const MAX_SCORE = 150; // 5 scored questions x 30 pts each

/** Normalize a raw point value (0-30 scale) to a 0-100 pillar score. */
function normalize(points: number | null): number {
  if (points === null) return 0;
  return Math.round((points / 30) * 100);
}

export function computeScore(answers: Answers): ScoreResult {
  const q4 = answers.q4_sales_tracking ?? 0;
  const q5 = answers.q5_inventory ?? 0;
  const q6 = answers.q6_retention ?? 0;
  const q7 = answers.q7_data_decisions ?? 0;
  const q8 = answers.q8_ai_adoption ?? 0;

  const totalScore = q4 + q5 + q6 + q7 + q8;
  const percent = Math.round((totalScore / MAX_SCORE) * 100);

  const pillars: PillarScores = {
    salesTracking: normalize(answers.q4_sales_tracking),
    inventoryHealth: normalize(answers.q5_inventory),
    customerRetention: normalize(answers.q6_retention),
    digitalReadiness: normalize(answers.q7_data_decisions),
    aiAdoption: normalize(answers.q8_ai_adoption),
  };

  const archetype = getArchetype(totalScore);

  return {
    totalScore,
    maxScore: MAX_SCORE,
    percent,
    pillars,
    archetype,
  };
}

export function isComplete(answers: Answers): boolean {
  return (
    answers.q1_msme_type !== null &&
    answers.q2_sector !== null &&
    answers.q3_employees !== null &&
    answers.q4_sales_tracking !== null &&
    answers.q5_inventory !== null &&
    answers.q6_retention !== null &&
    answers.q7_data_decisions !== null &&
    answers.q8_ai_adoption !== null &&
    answers.q9_challenge !== null &&
    answers.q10_ai_benefit_area !== null &&
    answers.q11_time_consuming !== null &&
    answers.q12_external_factor !== null
  );
}

export const INITIAL_ANSWERS: Answers = {
  q1_msme_type: null,
  q2_sector: null,
  q3_employees: null,
  q4_sales_tracking: null,
  q5_inventory: null,
  q6_retention: null,
  q7_data_decisions: null,
  q8_ai_adoption: null,
  q9_challenge: null,
  q10_ai_benefit_area: null,
  q11_time_consuming: null,
  q12_external_factor: null,
};
