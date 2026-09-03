export interface UserProfile {
  name: string;
  email: string;
  companyName: string;
}

export type MsmeType = "Micro" | "Small" | "Medium";

export type Sector =
  | "Agro"
  | "Manufacturing"
  | "IT & Services"
  | "Retail & Trade";

export type EmployeeRange = "1-9" | "10-49" | "50-250" | "250+";

export type Challenge =
  | "Finance & working capital"
  | "Hiring and retaining skilled employees"
  | "Finding customers & increasing sales"
  | "Supply chain & raw-material issues"
  | "Technology & digital transformation"
  | "Government regulations & compliance"
  | "Operations & productivity"
  | "Competition & market changes";

export type AiBenefitArea =
  | "Sales & marketing"
  | "Customer service"
  | "Finance & accounting"
  | "HR & recruitment"
  | "Inventory & supply chain"
  | "Production/operations"
  | "Business forecasting"
  | "Not sure";

export type TimeConsumingArea =
  | "Employees & HR"
  | "Customers & sales"
  | "Finance & cash flow"
  | "Operations"
  | "Suppliers & procurement"
  | "Compliance"
  | "Technology";

export type ExternalFactor =
  | "Inflation and rising costs"
  | "Changes in customer demand"
  | "Increased competition"
  | "Government policies/regulations"
  | "Supply-chain disruptions"
  | "Economic slowdown/uncertainty"
  | "Technological disruption"
  | "Geopolitical/global events";

export interface Answers {
  q1_msme_type: MsmeType | null;
  q2_sector: Sector | null;
  q3_employees: EmployeeRange | null;
  q4_sales_tracking: number | null; // 30 | 15 | 5
  q5_inventory: number | null; // 30 | 15 | 5
  q6_retention: number | null; // 30 | 15 | 5
  q7_data_decisions: number | null; // 30 | 15 | 5
  q8_ai_adoption: number | null; // 30 | 20 | 12 | 6 | 0
  q9_challenge: Challenge | null;
  q10_ai_benefit_area: AiBenefitArea | null;
  q11_time_consuming: TimeConsumingArea | null; // internal factor
  q12_external_factor: ExternalFactor | null; // external factor
}

export interface PillarScores {
  salesTracking: number; // 0-100
  inventoryHealth: number; // 0-100
  customerRetention: number; // 0-100
  digitalReadiness: number; // 0-100
  aiAdoption: number; // 0-100
}

export interface ScoreResult {
  totalScore: number; // 0-150
  maxScore: number; // 150
  percent: number; // 0-100
  pillars: PillarScores;
  archetype: Archetype;
}

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  colorFrom: string;
  colorTo: string;
  riskLevel: "Low" | "Moderate" | "Elevated" | "High" | "Critical";
}

export interface AiPrescription {
  executive_summary: string;
  competitor_insight: string;
  ai_prescription: string;
  source: "gemini" | "groq" | "fallback";
}

export interface DiagnosisRequest {
  profile?: UserProfile;
  answers: Answers;
  score: ScoreResult;
}
