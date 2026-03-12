/* ══════════════════════════════════════════════════════
   AI INTELLIGENCE LAYER — MOCK DATA
   Pre-generated insights, briefings, scenarios, risks,
   and contextual AI sparks for every surface.
   ══════════════════════════════════════════════════════ */

export interface AIInsight {
  id: string;
  type: "opportunity" | "risk" | "action" | "info";
  severity: "high" | "medium" | "low";
  title: string;
  summary: string;
  detail: string;
  metric?: string;
  metricValue?: string;
  action?: string;
  category: "net-worth" | "cashflow" | "debt" | "tax" | "insurance" | "investment" | "business" | "savings";
  timestamp: string;
}

export interface AIBriefingItem {
  id: string;
  icon: string;
  title: string;
  body: string;
  priority: "urgent" | "important" | "fyi";
  actionLabel?: string;
  link?: string;
}

export interface AIDeepDive {
  id: string;
  metric: string;
  currentValue: string;
  change: string;
  changeDirection: "up" | "down" | "flat";
  analysis: string;
  recommendation: string;
  sparkData: number[];
  category: string;
}

export interface AIScenario {
  id: string;
  title: string;
  description: string;
  impact: string;
  impactType: "positive" | "negative" | "neutral";
  timeframe: string;
  variables: { label: string; current: string; proposed: string }[];
  outcome: string;
}

export interface AIRiskItem {
  id: string;
  title: string;
  description: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  probability: number; // 0-100
  impact: string;
  mitigation: string;
  category: string;
}

export interface AIWatchlistItem {
  id: string;
  label: string;
  currentValue: string;
  threshold: string;
  status: "normal" | "warning" | "alert";
  lastChecked: string;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AICommandOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: "navigate" | "analyze" | "action" | "ask";
  keywords: string[];
}

/* ── Rotating AI Insight Banners ──────────────────── */

export const aiBannerInsights: AIInsight[] = [
  {
    id: "banner-1",
    type: "opportunity",
    severity: "high",
    title: "Refinance could save $186/mo",
    summary: "Current mortgage rate 6.25% → market at 5.1%. Save $2,232/yr.",
    detail: "Your Wells Fargo mortgage at 6.25% is above current market rates. Refinancing to 5.1% on your $284k balance would reduce monthly payment from $2,956 to $2,770 — saving $186/month or $2,232 annually. Break-even on closing costs in ~8 months.",
    metric: "Mortgage Rate",
    metricValue: "6.25%",
    action: "Explore refinance options",
    category: "debt",
    timestamp: "2026-03-12T08:00:00Z",
  },
  {
    id: "banner-2",
    type: "risk",
    severity: "medium",
    title: "Emergency fund at 38 days coverage",
    summary: "Target is 6 months. You're at 2.5 months. Increase by $500/mo.",
    detail: "Your emergency fund ($13,200) covers approximately 38 days of expenses based on your current $34.7k monthly burn rate. Financial best practice recommends 3-6 months coverage ($104k-$208k). At your current $500/mo contribution, you'll reach 3-month coverage in ~14 months.",
    metric: "Emergency Coverage",
    metricValue: "38 days",
    action: "Boost emergency savings",
    category: "savings",
    timestamp: "2026-03-12T08:00:00Z",
  },
  {
    id: "banner-3",
    type: "opportunity",
    severity: "medium",
    title: "Tax-loss harvesting opportunity: $3.2k",
    summary: "2 positions in your brokerage are showing harvestable losses.",
    detail: "Your Fidelity brokerage has 2 positions with unrealized losses totaling ~$3,200. Harvesting these before March 31 could offset capital gains and reduce your 2026 tax bill by approximately $960 (at 30% marginal rate).",
    metric: "Harvestable Losses",
    metricValue: "$3,200",
    action: "Review positions",
    category: "tax",
    timestamp: "2026-03-12T08:00:00Z",
  },
  {
    id: "banner-4",
    type: "action",
    severity: "low",
    title: "Auto insurance renewal in 65 days",
    summary: "Bundle with home for ~$456/yr savings. Both Geico policies expire May 15.",
    detail: "Your two Geico auto policies ($98 + $86/mo) expire May 15. Bundling with your State Farm home policy or shopping for a combined package could save approximately $38/mo ($456/yr). Start comparing 30 days before renewal for best rates.",
    metric: "Annual Savings",
    metricValue: "$456",
    action: "Compare insurance quotes",
    category: "insurance",
    timestamp: "2026-03-12T08:00:00Z",
  },
  {
    id: "banner-5",
    type: "info",
    severity: "low",
    title: "Net worth grew $4,500 this month",
    summary: "On track for +$54k annually. Assets up $2.4k, debt down $2.1k.",
    detail: "Your personal net worth increased from $1,025,500 to $1,030,000 in the past month — a $4,500 gain driven by asset appreciation ($2,400) and debt reduction ($2,100). At this pace, you're on track for approximately $54,000 in net worth growth over the next 12 months.",
    metric: "Monthly Growth",
    metricValue: "+$4,500",
    category: "net-worth",
    timestamp: "2026-03-12T08:00:00Z",
  },
];

/* ── Today's Briefing ─────────────────────────────── */

export const todaysBriefing: AIBriefingItem[] = [
  {
    id: "brief-1",
    icon: "trending-up",
    title: "Net worth hit $2.85M — new all-time high",
    body: "Combined net worth crossed $2.85M for the first time. Personal assets grew $4.5k this month while business equity held steady. You're on pace for $3M by Q3 2027.",
    priority: "fyi",
    link: "/networth",
  },
  {
    id: "brief-2",
    icon: "alert-triangle",
    title: "Q2 estimated tax payment due Apr 15",
    body: "Your Q2 federal estimated payment of $17,100 is due in 34 days. Ensure sufficient funds in your Chase checking account. Current balance: $24,920.",
    priority: "urgent",
    actionLabel: "Review tax plan",
  },
  {
    id: "brief-3",
    icon: "credit-card",
    title: "Chase Freedom at 31.7% utilization",
    body: "Your Chase Freedom Unlimited balance ($4,760 / $15k limit) is above the 30% utilization threshold that can impact credit score. Consider paying down $260 to get below 30%.",
    priority: "important",
    actionLabel: "Pay down card",
    link: "/liabilities",
  },
  {
    id: "brief-4",
    icon: "piggy-bank",
    title: "Italy vacation fund: 40% funded",
    body: "At $600/mo contributions, you'll reach your $12k goal by January 2027 — 2 months ahead of your March 2027 target date. Great progress!",
    priority: "fyi",
  },
  {
    id: "brief-5",
    icon: "building-2",
    title: "Johnson Realty: 3 invoices past due",
    body: "~$19.5k in receivables are 30+ days overdue at Johnson Realty Group. Consider sending follow-up reminders or implementing late fees to improve collections.",
    priority: "important",
    actionLabel: "View AR aging",
  },
  {
    id: "brief-6",
    icon: "shield",
    title: "Umbrella policy recommendation",
    body: "With $2.85M in net worth and growing, an umbrella policy (~$12/mo) would add $1M extra liability protection. This is a high-value, low-cost safeguard.",
    priority: "fyi",
    actionLabel: "Learn more",
    link: "/insurance",
  },
];

/* ── Metric Deep Dives ────────────────────────────── */

export const aiDeepDives: AIDeepDive[] = [
  {
    id: "dd-1",
    metric: "Net Worth",
    currentValue: "$2.85M",
    change: "+$72.4k",
    changeDirection: "up",
    analysis: "Combined net worth has grown steadily over 12 months, with the strongest gains from investment appreciation and debt reduction. Business equity ($1.57M) remains the largest component. Personal net worth crossed $1M in January 2026.",
    recommendation: "Continue current trajectory. Consider rebalancing portfolio allocation — real estate is 26.1% vs target 20%. Redirect excess to bonds or international funds for better diversification.",
    sparkData: [2777600, 2784200, 2791400, 2799800, 2807600, 2814200, 2810800, 2820400, 2828600, 2835400, 2842800, 2850000],
    category: "net-worth",
  },
  {
    id: "dd-2",
    metric: "Monthly Cash Flow",
    currentValue: "+$7,800",
    change: "-$800",
    changeDirection: "down",
    analysis: "Net cash flow decreased from $8,600 in February to $7,800 in March, primarily due to a $220 increase in food spending and seasonal utility adjustments. Income remained stable at $42.5k.",
    recommendation: "Food & Dining is $220 over budget — largely driven by restaurant spending ($480). Consider a weekly dining-out budget of $100 to stay on track. Overall cash flow is healthy at 18.4% savings rate.",
    sparkData: [6800, 6600, 5600, 7400, 8600, 7800],
    category: "cashflow",
  },
  {
    id: "dd-3",
    metric: "Debt-to-Income",
    currentValue: "9%",
    change: "-4%",
    changeDirection: "down",
    analysis: "DTI ratio improved from 13% to 9% over 6 months as credit card balances decreased and income grew. Your ratio is well below the recommended 36% threshold for financial health.",
    recommendation: "Excellent debt management. Consider accelerating auto loan payoff — at $645/mo with 42 months remaining, an extra $200/mo would pay it off 10 months early and save ~$1,840 in interest.",
    sparkData: [13, 12.5, 12, 11, 10.2, 9.8, 9.5, 9.3, 9.1, 9],
    category: "debt",
  },
  {
    id: "dd-4",
    metric: "Investment Returns",
    currentValue: "4.67% YTD",
    change: "+0.8%",
    changeDirection: "up",
    analysis: "Portfolio returned 4.67% YTD vs S&P 500 benchmark of 5.3%. Underperformance primarily from overweight in real estate and bonds relative to equities during a risk-on market.",
    recommendation: "Consider trimming real estate allocation from 26.1% to 20% and increasing equity exposure. Your 529 fund is performing well at 8.2% YTD — maintain current allocation there.",
    sparkData: [1284200, 1291400, 1298600, 1304800, 1312200, 1318400, 1314800, 1324600, 1330800, 1334200, 1338800, 1344100],
    category: "investment",
  },
  {
    id: "dd-5",
    metric: "Insurance Coverage",
    currentValue: "$5.89M",
    change: "Adequate",
    changeDirection: "flat",
    analysis: "Total insurance coverage across 6 policies is $5.89M at $1,751/mo premium. Coverage-to-net-worth ratio is 2.07x, which is within the recommended 2-3x range. Two auto policies expiring in May need attention.",
    recommendation: "Auto policy renewal is the top priority. Bundle home + auto for ~$456/yr savings. Also consider adding an umbrella policy ($1M extra coverage for ~$12/mo) given your net worth level.",
    sparkData: [1720, 1720, 1751, 1751, 1751, 1751],
    category: "insurance",
  },
];

/* ── Scenario Planner ─────────────────────────────── */

export const aiScenarios: AIScenario[] = [
  {
    id: "scenario-1",
    title: "Refinance Home Mortgage",
    description: "Refinance from 6.25% to 5.1% on the remaining $284k balance with $4,500 closing costs.",
    impact: "Save $2,232/yr ($186/mo)",
    impactType: "positive",
    timeframe: "30-year fixed",
    variables: [
      { label: "Current Rate", current: "6.25%", proposed: "5.10%" },
      { label: "Monthly Payment", current: "$2,956", proposed: "$2,770" },
      { label: "Closing Costs", current: "$0", proposed: "$4,500" },
      { label: "Break-even", current: "—", proposed: "8 months" },
    ],
    outcome: "Net savings of $2,232/yr after break-even. Over remaining 18 years, total savings of ~$35,700. Freed cash flow can boost emergency fund to 6-month target faster.",
  },
  {
    id: "scenario-2",
    title: "Accelerate Auto Loan Payoff",
    description: "Add $200/mo extra to the Toyota Highlander auto loan ($22.5k at 4.9%).",
    impact: "Pay off 10 months early, save $1,840",
    impactType: "positive",
    timeframe: "32 months vs 42 months",
    variables: [
      { label: "Current Payment", current: "$645/mo", proposed: "$845/mo" },
      { label: "Payoff Date", current: "Sep 2029", proposed: "Nov 2028" },
      { label: "Total Interest", current: "$4,680", proposed: "$2,840" },
      { label: "Interest Saved", current: "—", proposed: "$1,840" },
    ],
    outcome: "Saves $1,840 in interest and frees up $845/mo 10 months earlier. Post-payoff, redirect that $845/mo to emergency fund — reaching 6-month target in ~7 months.",
  },
  {
    id: "scenario-3",
    title: "Max Out 401k + Backdoor Roth",
    description: "Increase 401k contribution to $23,500 max and add $7,000 backdoor Roth IRA.",
    impact: "Reduce tax bill by ~$8,200, grow retirement faster",
    impactType: "positive",
    timeframe: "Annual",
    variables: [
      { label: "401k Contribution", current: "$19,500/yr", proposed: "$23,500/yr" },
      { label: "Roth IRA", current: "$0", proposed: "$7,000/yr" },
      { label: "Tax Savings", current: "—", proposed: "~$8,200" },
      { label: "Monthly Impact", current: "—", proposed: "-$917 cash flow" },
    ],
    outcome: "Reduces taxable income by $23,500 saving ~$8,200 in federal taxes. Roth contributions grow tax-free. Monthly cash flow decreases by $917 but remains positive at $6,883.",
  },
  {
    id: "scenario-4",
    title: "What if the Market Drops 20%?",
    description: "Stress test: S&P 500 drops 20% impacting your equity and fund holdings.",
    impact: "Net worth decreases ~$105k temporarily",
    impactType: "negative",
    timeframe: "6-12 month recovery",
    variables: [
      { label: "Brokerage", current: "$312k", proposed: "$249.6k" },
      { label: "Roth IRA", current: "$128.4k", proposed: "$102.7k" },
      { label: "529 Fund", current: "$69.6k", proposed: "$55.7k" },
      { label: "Net Worth Impact", current: "$2.85M", proposed: "$2.745M" },
    ],
    outcome: "A 20% market correction would reduce investment portfolio by ~$105k. However, your diversification into real estate ($748k) and cash ($86k) provides a buffer. With 2.5 months runway and stable income, you're positioned to weather and even buy the dip.",
  },
];

/* ── Risk & Opportunity Radar ─────────────────────── */

export const aiRisks: AIRiskItem[] = [
  {
    id: "risk-1",
    title: "Emergency fund critically low",
    description: "Only 2.5 months of expenses covered. Target is 6 months ($208k).",
    riskLevel: "high",
    probability: 100,
    impact: "Vulnerable to unexpected expenses or income disruption.",
    mitigation: "Increase monthly savings from $500 to $1,000. Consider a high-yield savings account for better returns on emergency funds.",
    category: "Savings",
  },
  {
    id: "risk-2",
    title: "Credit card utilization above 30%",
    description: "Chase Freedom at 31.7% ($4,760/$15k). Impacts credit score.",
    riskLevel: "medium",
    probability: 100,
    impact: "Could reduce credit score by 20-50 points.",
    mitigation: "Pay down $260 this month to get below 30% threshold. Set up auto-pay for statement balance.",
    category: "Credit",
  },
  {
    id: "risk-3",
    title: "High concentration in single property",
    description: "451 2nd Street ($685k) represents 51% of total assets.",
    riskLevel: "medium",
    probability: 30,
    impact: "Significant net worth exposure to local real estate market.",
    mitigation: "Diversify by increasing liquid investment allocation. Consider REITs for real estate exposure without concentration risk.",
    category: "Investment",
  },
  {
    id: "risk-4",
    title: "No umbrella liability policy",
    description: "Net worth of $2.85M with no excess liability coverage.",
    riskLevel: "high",
    probability: 15,
    impact: "A major lawsuit could exceed underlying policy limits.",
    mitigation: "Add $1M umbrella policy (~$12/mo). Covers gaps between auto/home liability limits and actual exposure.",
    category: "Insurance",
  },
  {
    id: "risk-5",
    title: "Business AR aging: $19.5k past 30 days",
    description: "Johnson Realty has 3 invoices totaling $19.5k overdue 30+ days.",
    riskLevel: "medium",
    probability: 60,
    impact: "Cash flow strain on business entity. Potential bad debt write-off.",
    mitigation: "Send automated reminders. Implement 1.5% late fee policy. Escalate after 60 days to collections.",
    category: "Business",
  },
  {
    id: "risk-6",
    title: "Mortgage rate above market",
    description: "Current 6.25% vs available 5.1%. Paying ~$186/mo more than needed.",
    riskLevel: "low",
    probability: 100,
    impact: "$2,232/yr in excess interest payments.",
    mitigation: "Begin refinance process. Lock rate when below 5.5%. Break-even on closing costs in ~8 months.",
    category: "Debt",
  },
];

/* ── AI Watchlist ──────────────────────────────────── */

export const aiWatchlist: AIWatchlistItem[] = [
  { id: "watch-1", label: "Emergency Fund Coverage", currentValue: "2.5 mo", threshold: "< 3 months", status: "alert", lastChecked: "Just now" },
  { id: "watch-2", label: "Credit Utilization", currentValue: "31.7%", threshold: "> 30%", status: "warning", lastChecked: "Just now" },
  { id: "watch-3", label: "Monthly Burn Rate", currentValue: "$34.7k", threshold: "> $38k", status: "normal", lastChecked: "Just now" },
  { id: "watch-4", label: "Debt-to-Income", currentValue: "9%", threshold: "> 20%", status: "normal", lastChecked: "Just now" },
  { id: "watch-5", label: "Portfolio Deviation", currentValue: "1.2%", threshold: "> 5%", status: "normal", lastChecked: "Just now" },
  { id: "watch-6", label: "Insurance Coverage Ratio", currentValue: "2.07x", threshold: "< 1.5x", status: "normal", lastChecked: "Just now" },
];

/* ── Contextual AI Sparks ─────────────────────────── */
// Maps KPI/metric IDs to quick AI insights shown on hover/click

export const aiSparks: Record<string, { title: string; insight: string; action?: string }> = {
  "net-worth": {
    title: "Net Worth Trend",
    insight: "Growing at $6k/mo average over 12 months. At this pace, you'll hit $3M by Q3 2027. Business equity ($1.57M) is the largest driver.",
    action: "View detailed breakdown",
  },
  "liquid-cash": {
    title: "Liquidity Analysis",
    insight: "2.5 months runway is below the 6-month recommendation. Prioritize building emergency reserves before increasing investments.",
    action: "See savings plan",
  },
  "burn-rate": {
    title: "Spending Trend",
    insight: "Burn rate decreased 2.1% vs prior period. Food & Dining ($1,620) is the main area over budget (+$220). Consider meal planning to optimize.",
    action: "View budget breakdown",
  },
  "dti": {
    title: "Debt Health",
    insight: "9% DTI is excellent (target < 36%). Mortgage accounts for 78% of debt. Accelerating auto loan payoff would save $1,840 in interest.",
    action: "Explore payoff strategies",
  },
  "cashflow-income": {
    title: "Income Sources",
    insight: "Business contributes 59% of total income ($25.1k), personal salary 41% ($17.4k). Diversifying income sources reduces risk.",
  },
  "cashflow-spending": {
    title: "Spending Optimization",
    insight: "3 subscriptions overlap in functionality (Netflix + YouTube Premium + Spotify). Consider consolidating to save ~$17/mo ($204/yr).",
    action: "Review subscriptions",
  },
  "portfolio-return": {
    title: "Investment Performance",
    insight: "4.67% YTD vs 5.3% benchmark. Underperformance from overweight in real estate (26% vs 20% target). Consider rebalancing Q2.",
    action: "View portfolio",
  },
  "insurance-coverage": {
    title: "Coverage Assessment",
    insight: "2.07x coverage-to-NW ratio is adequate but declining as net worth grows. Auto policies renewing in May — good time to bundle and save ~$456/yr.",
    action: "Compare quotes",
  },
  "tax-estimate": {
    title: "Tax Optimization",
    insight: "Effective rate at 13.4%. Tax-loss harvesting opportunity of $3.2k available. Q2 estimated payment of $17.1k due Apr 15.",
    action: "Review tax plan",
  },
  "savings-goals": {
    title: "Goal Progress",
    insight: "34% average progress across 4 goals. Italy vacation is ahead of schedule (+2 months). Emergency fund needs acceleration — only 26% funded.",
    action: "Adjust contributions",
  },
};

/* ── AI Command Palette Options ───────────────────── */

export const aiCommands: AICommandOption[] = [
  // Navigate
  { id: "cmd-1", label: "Go to Net Worth", description: "View combined net worth breakdown", icon: "trending-up", category: "navigate", keywords: ["net worth", "assets", "wealth"] },
  { id: "cmd-2", label: "Go to Liabilities", description: "Manage debts and obligations", icon: "credit-card", category: "navigate", keywords: ["debt", "loans", "credit", "mortgage"] },
  { id: "cmd-3", label: "Go to Cash Flow", description: "Income, budget, and projections", icon: "receipt", category: "navigate", keywords: ["cashflow", "budget", "income", "spending"] },
  { id: "cmd-4", label: "Go to Insurance", description: "Policies, coverage, and claims", icon: "shield", category: "navigate", keywords: ["insurance", "policies", "coverage"] },
  { id: "cmd-5", label: "Go to Assets", description: "Portfolio and investments", icon: "pie-chart", category: "navigate", keywords: ["assets", "investments", "portfolio", "stocks"] },
  { id: "cmd-6", label: "Go to AI Advisor", description: "Your personal AI CFO", icon: "bot", category: "navigate", keywords: ["ai", "advisor", "cfo", "assistant"] },
  // Analyze
  { id: "cmd-7", label: "Analyze my spending", description: "Deep dive into this month's expenses", icon: "search", category: "analyze", keywords: ["spending", "expenses", "budget", "analyze"] },
  { id: "cmd-8", label: "Review debt strategy", description: "Snowball vs avalanche comparison", icon: "calculator", category: "analyze", keywords: ["debt", "payoff", "strategy", "snowball"] },
  { id: "cmd-9", label: "Tax optimization scan", description: "Find deductions and credits", icon: "file-text", category: "analyze", keywords: ["tax", "deductions", "optimize", "save"] },
  { id: "cmd-10", label: "Portfolio health check", description: "Review allocation and risk", icon: "bar-chart-3", category: "analyze", keywords: ["portfolio", "rebalance", "risk", "allocation"] },
  // Actions
  { id: "cmd-11", label: "Run scenario planner", description: "What-if analysis for financial decisions", icon: "git-branch", category: "action", keywords: ["scenario", "what if", "plan", "simulate"] },
  { id: "cmd-12", label: "Generate monthly report", description: "Comprehensive financial summary", icon: "file-bar-chart", category: "action", keywords: ["report", "summary", "monthly", "export"] },
  { id: "cmd-13", label: "Check risk radar", description: "Threats and opportunities scan", icon: "radar", category: "action", keywords: ["risk", "threat", "opportunity", "radar"] },
  // Ask
  { id: "cmd-14", label: "Ask: How do I save more?", description: "Personalized savings advice", icon: "message-circle", category: "ask", keywords: ["save", "more", "money", "tips"] },
  { id: "cmd-15", label: "Ask: Should I refinance?", description: "Mortgage refinance analysis", icon: "message-circle", category: "ask", keywords: ["refinance", "mortgage", "rate", "should"] },
  { id: "cmd-16", label: "Ask: Am I on track for retirement?", description: "Retirement readiness assessment", icon: "message-circle", category: "ask", keywords: ["retire", "retirement", "track", "ready"] },
];

/* ── Sample Chat Messages (Ask Anything tab) ──────── */

export const sampleChatMessages: AIChatMessage[] = [
  {
    id: "chat-1",
    role: "assistant",
    content: "Welcome back, Muhammad! I'm your AI CFO. I've analyzed your latest financial data and have a few recommendations ready. What would you like to explore today?",
    timestamp: "2026-03-12T08:00:00Z",
  },
];

/* ── AI Report Templates ──────────────────────────── */

export interface AIReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  sections: string[];
  lastGenerated?: string;
}

export const aiReportTemplates: AIReportTemplate[] = [
  {
    id: "rpt-1",
    title: "Monthly Financial Summary",
    description: "Complete overview of income, expenses, net worth changes, and key metrics.",
    icon: "file-bar-chart",
    sections: ["Net Worth", "Cash Flow", "Budget vs Actual", "Debt Progress", "Investment Returns"],
    lastGenerated: "Feb 28, 2026",
  },
  {
    id: "rpt-2",
    title: "Tax Planning Report",
    description: "Year-to-date tax liability, deductions, and estimated payments.",
    icon: "file-text",
    sections: ["Income Summary", "Deductions", "Credits", "Estimated Payments", "Optimization Tips"],
    lastGenerated: "Mar 1, 2026",
  },
  {
    id: "rpt-3",
    title: "Business Entity Roll-up",
    description: "Aggregated P&L, balance sheet highlights, and cash positions across all entities.",
    icon: "building-2",
    sections: ["Revenue", "Expenses", "Net Income", "Cash Position", "AR/AP Aging"],
  },
  {
    id: "rpt-4",
    title: "Insurance Coverage Audit",
    description: "Policy review, coverage gaps, and cost optimization recommendations.",
    icon: "shield",
    sections: ["Active Policies", "Coverage Gaps", "Premium Analysis", "Renewal Timeline", "Recommendations"],
  },
  {
    id: "rpt-5",
    title: "Retirement Readiness",
    description: "Projected retirement date, savings rate analysis, and contribution optimization.",
    icon: "sunset",
    sections: ["Current Balances", "Contribution Analysis", "Growth Projections", "Gap Analysis", "Action Plan"],
  },
];
