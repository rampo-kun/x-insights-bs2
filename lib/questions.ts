export interface Option {
  label: string;
  sublabel?: string;
  value: string | number;
}

export interface Question {
  key: string;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name, resolved in component
  options: Option[];
}

export const QUESTIONS: Question[] = [
  {
    key: "q1_msme_type",
    title: "What size is your business?",
    subtitle: "Official MSME classification, so we can benchmark you fairly.",
    icon: "Factory",
    options: [
      { label: "Micro", sublabel: "Smallest scale of investment/turnover", value: "Micro" },
      { label: "Small", sublabel: "Mid-scale operation", value: "Small" },
      { label: "Medium", sublabel: "Larger, more structured operation", value: "Medium" },
    ],
  },
  {
    key: "q2_sector",
    title: "Which sector are you in?",
    subtitle: "We'll benchmark you against sector-specific growth data.",
    icon: "Globe2",
    options: [
      { label: "Agro", sublabel: "Agriculture & agri-processing", value: "Agro" },
      { label: "Manufacturing", value: "Manufacturing" },
      { label: "IT & Services", value: "IT & Services" },
      { label: "Retail & Trade", value: "Retail & Trade" },
    ],
  },
  {
    key: "q3_employees",
    title: "How many employees do you have?",
    subtitle: "Team size shapes what kind of systems will actually help.",
    icon: "Users2",
    options: [
      { label: "1–9", sublabel: "Micro team", value: "1-9" },
      { label: "10–49", sublabel: "Small team", value: "10-49" },
      { label: "50–250", sublabel: "Medium team", value: "50-250" },
      { label: "250+", sublabel: "Large team", value: "250+" },
    ],
  },
  {
    key: "q4_sales_tracking",
    title: "How do you track daily sales?",
    subtitle: "This tells us how visible your revenue really is.",
    icon: "LineChart",
    options: [
      { label: "Automated POS / Dashboard", sublabel: "Real-time, system generated", value: 30 },
      { label: "Spreadsheets", sublabel: "Manually updated, end of day", value: 15 },
      { label: "Pen & Paper / Memory", sublabel: "No formal record", value: 5 },
    ],
  },
  {
    key: "q5_inventory",
    title: "How healthy is your inventory management?",
    subtitle: "Stockouts and dead stock quietly kill margins.",
    icon: "Boxes",
    options: [
      { label: "Rarely stockouts or dead stock", sublabel: "Tight, predictable control", value: 30 },
      { label: "Seasonal issues", sublabel: "Struggles during peak periods", value: 15 },
      { label: "Frequent headache", sublabel: "Constant firefighting", value: 5 },
    ],
  },
  {
    key: "q6_retention",
    title: "How do you manage customer retention?",
    subtitle: "Repeat customers are your cheapest growth channel.",
    icon: "Users",
    options: [
      { label: "Digital CRM / Loyalty program", sublabel: "Systematic, data-backed", value: 30 },
      { label: "Visual recognition / Memory", sublabel: "\"I know my regulars\"", value: 15 },
      { label: "Don't track", sublabel: "No retention strategy", value: 5 },
    ],
  },
  {
    key: "q7_data_decisions",
    title: "How do you make key business decisions?",
    subtitle: "Data maturity predicts scalability.",
    icon: "BrainCircuit",
    options: [
      { label: "Analytics & structured data", sublabel: "Dashboards, reports, KPIs", value: 30 },
      { label: "Past trends / basic software", sublabel: "Some structure, mostly reactive", value: 15 },
      { label: "Gut feeling / manual", sublabel: "Instinct-driven calls", value: 5 },
    ],
  },
  {
    key: "q8_ai_adoption",
    title: "How is AI currently being used in your business?",
    subtitle: "Where you stand today shapes the fastest next step.",
    icon: "Cpu",
    options: [
      { label: "Used extensively across multiple functions", value: 30 },
      { label: "Used in a few specific areas", value: 20 },
      { label: "Experimenting with it", value: 12 },
      { label: "Planning to adopt", value: 6 },
      { label: "Not using AI at all", value: 0 },
    ],
  },
  {
    key: "q9_challenge",
    title: "What's been your biggest challenge in the last 2–3 years?",
    subtitle: "We'll build your AI prescription around fixing this first.",
    icon: "AlertTriangle",
    options: [
      { label: "💰 Finance & working capital", value: "Finance & working capital" },
      { label: "👥 Hiring and retaining skilled employees", value: "Hiring and retaining skilled employees" },
      { label: "📈 Finding customers & increasing sales", value: "Finding customers & increasing sales" },
      { label: "🚚 Supply chain & raw-material issues", value: "Supply chain & raw-material issues" },
      { label: "💻 Technology & digital transformation", value: "Technology & digital transformation" },
      { label: "⚖️ Government regulations & compliance", value: "Government regulations & compliance" },
      { label: "🏭 Operations & productivity", value: "Operations & productivity" },
      { label: "🌍 Competition & market changes", value: "Competition & market changes" },
    ],
  },
  {
    key: "q10_ai_benefit_area",
    title: "Which area could benefit MOST from AI?",
    subtitle: "This is where we'll aim your prescription's sharpest tip.",
    icon: "Sparkles",
    options: [
      { label: "Sales & marketing", value: "Sales & marketing" },
      { label: "Customer service", value: "Customer service" },
      { label: "Finance & accounting", value: "Finance & accounting" },
      { label: "HR & recruitment", value: "HR & recruitment" },
      { label: "Inventory & supply chain", value: "Inventory & supply chain" },
      { label: "Production/operations", value: "Production/operations" },
      { label: "Business forecasting", value: "Business forecasting" },
      { label: "Not sure", value: "Not sure" },
    ],
  },
  {
    key: "q11_time_consuming",
    title: "Which area consumes the most of your management time?",
    subtitle: "Where your attention goes is often where the risk hides.",
    icon: "Clock",
    options: [
      { label: "Employees & HR", value: "Employees & HR" },
      { label: "Customers & sales", value: "Customers & sales" },
      { label: "Finance & cash flow", value: "Finance & cash flow" },
      { label: "Operations", value: "Operations" },
      { label: "Suppliers & procurement", value: "Suppliers & procurement" },
      { label: "Compliance", value: "Compliance" },
      { label: "Technology", value: "Technology" },
    ],
  },
  {
    key: "q12_external_factor",
    title: "Which external factor has hit your business hardest?",
    subtitle: "Forces outside your control still need a response plan.",
    icon: "Globe",
    options: [
      { label: "Inflation and rising costs", value: "Inflation and rising costs" },
      { label: "Changes in customer demand", value: "Changes in customer demand" },
      { label: "Increased competition", value: "Increased competition" },
      { label: "Government policies/regulations", value: "Government policies/regulations" },
      { label: "Supply-chain disruptions", value: "Supply-chain disruptions" },
      { label: "Economic slowdown/uncertainty", value: "Economic slowdown/uncertainty" },
      { label: "Technological disruption", value: "Technological disruption" },
      { label: "Geopolitical/global events", value: "Geopolitical/global events" },
    ],
  },
];
