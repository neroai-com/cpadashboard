export interface Entity {
  id: string;
  name: string;
  type: "Operating" | "Holding / SPV" | "Real Estate";
  equity: string;
  equityValue: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  rightLabel?: string;
  rightSub?: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  value: string;
  valueSub?: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
}

/* ── Entities ────────────────────────────────────── */

export const entities: Entity[] = [
  { id: "jrg", name: "Johnson Realty Group", type: "Operating", equityValue: 625000, equity: "$625k" },
  { id: "blh", name: "BlueLake Holdings LLC", type: "Holding / SPV", equityValue: 580000, equity: "$580k" },
  { id: "rbp", name: "Riverbend Properties LLC", type: "Real Estate", equityValue: 365000, equity: "$365k" },
];

// Computed: total business equity across all entities
export const businessEquity = entities.reduce((s, e) => s + e.equityValue, 0);
// → $1,570,000

/* ── Business Services (per-entity detail page) ──── */

export const businessServices: Service[] = [
  {
    id: "ap",
    name: "Bills & payables (AP)",
    description: "Vendor bills, approvals, and payment runs.",
    rightLabel: "12 open",
    rightSub: "$41k due",
  },
  {
    id: "ar",
    name: "Invoices & receivables (AR)",
    description: "Customer invoices, collections, and aging.",
    rightLabel: "18 open",
    rightSub: "$84k",
  },
  {
    id: "accounting",
    name: "Accounting & reports",
    description: "P&L, balance sheet, and cashflow for this entity.",
    rightLabel: "View Reports",
  },
  {
    id: "payroll",
    name: "Payroll & HR",
    description: "Employees, contractors, and payroll runs.",
    rightLabel: "Next run",
    rightSub: "Apr 30",
  },
  {
    id: "banking",
    name: "Banking & cash",
    description: "Operating, reserve, and escrow accounts.",
    rightLabel: "$312k",
    rightSub: "Cash",
  },
  {
    id: "insurance",
    name: "Business insurance",
    description: "Policies, coverage, and renewals.",
    rightLabel: "3 policies",
    rightSub: "1 review",
  },
  {
    id: "property-tax",
    name: "Property tax & protests",
    description: "Tax bills, assessments, and protest tracking.",
    rightLabel: "2 flags",
    rightSub: "~$3.2k/yr",
  },
  {
    id: "loans",
    name: "Loans & refinance",
    description: "Mortgages, notes, and refi opportunities.",
    rightLabel: "3 loans",
    rightSub: "1 refi",
  },
  {
    id: "documents",
    name: "Documents & compliance",
    description: "Operating agreements, leases, filings, and more.",
    rightLabel: "Docs View",
  },
  {
    id: "cfo",
    name: "CFO advisory",
    description: "Runway, scenarios, and strategic guidance.",
    rightLabel: "AI + human",
    rightSub: "Insights",
  },
  {
    id: "settings",
    name: "Settings",
    description: "Manage Admin, Managers and users",
  },
];

/* ── Spaces ──────────────────────────────────────── */

export const combinedSpaces: Space[] = [
  {
    id: "business",
    name: "Business",
    description: "All entities, AP/AR, and banking.",
    value: "$1.57M",
  },
  {
    id: "individual",
    name: "Individual / family",
    description: "Household cash, budget, and goals.",
    value: "$1.03M",
  },
  {
    id: "assets",
    name: "Assets & estate",
    description: "Properties, autos, investments, and estate.",
    value: "$4.82M",
  },
];

export const individualSpaces: Space[] = [
  {
    id: "personal-cfo",
    name: "Personal CFO",
    description: "Cash, budget, debt, subscriptions.",
    value: "$1.03M",
    valueSub: "Net worth",
  },
  {
    id: "business-cfo",
    name: "Business CFO",
    description: "Johnson Realty, BlueLake, and others.",
    value: "$1.57M",
    valueSub: "Entity equity",
  },
  {
    id: "assets-ind",
    name: "Assets",
    description: "Properties, autos, investments.",
    value: "$1.34M",
  },
  {
    id: "estate",
    name: "Estate & family",
    description: "Estate value, beneficiaries, and plans.",
    value: "$4.82M",
    valueSub: "Estate health 64%",
  },
];

/* ── Insights ────────────────────────────────────── */

export const combinedInsights: Insight[] = [
  {
    id: "1",
    title: "Home may be over-assessed by ~$28k.",
    description: "Filing a protest could save ~$3,200/yr in property tax.",
  },
  {
    id: "2",
    title: "Refinance home mortgage for lower rate.",
    description: "Estimated savings ~$186/mo at current market rates.",
  },
  {
    id: "3",
    title: "Home & auto insurance above market.",
    description: "Potential savings ~$1,190/yr by switching carriers.",
  },
];

export const entityInsights: Insight[] = [
  {
    id: "1",
    title: "3 invoices over 30 days late (~$19.5k).",
    description: "Consider follow-ups or late fees on AR.",
  },
  {
    id: "2",
    title: "Refinance Riverbend mortgage.",
    description: "Estimated savings ~$255/mo at current rates.",
  },
];

/* ── Net Worth ─────────────────────────────────── */

export interface NetWorthSnapshot {
  date: string;
  value: number;
}

export interface FinancialAccount {
  id: string;
  name: string;
  institution: string;
  type: "checking" | "savings" | "credit_card" | "investment" | "property" | "vehicle" | "mortgage" | "auto_loan";
  category: "cash" | "investment" | "other_asset" | "credit_card" | "loan";
  balance: number;
  icon: string;
  creditLimit?: number;
}

export interface NetWorthSummary {
  totalAssets: number;
  totalDebt: number;
  netWorth: number;
  changeAmount: number;
  assetChange: number;
  debtChange: number;
  debtChangePercent: number;
  history: NetWorthSnapshot[];
}

export interface NetWorthFAQ {
  id: string;
  question: string;
  answer: string;
}

/* ── Financial Accounts ──────────────────────────── */
// All numbers computed from this single source of truth

export const financialAccounts: FinancialAccount[] = [
  // Cash
  { id: "checking-1", name: "Personal Checking", institution: "Chase", type: "checking", category: "cash", balance: 12480, icon: "landmark" },
  { id: "checking-2", name: "Joint Checking", institution: "Chase", type: "checking", category: "cash", balance: 24920, icon: "landmark" },
  { id: "savings-1", name: "High-Yield Savings", institution: "Marcus", type: "savings", category: "cash", balance: 35600, icon: "piggy-bank" },
  { id: "savings-2", name: "Emergency Fund", institution: "Ally", type: "savings", category: "cash", balance: 13200, icon: "piggy-bank" },
  // Investments
  { id: "invest-1", name: "Brokerage", institution: "Fidelity", type: "investment", category: "investment", balance: 312000, icon: "trending-up" },
  { id: "invest-2", name: "Roth IRA", institution: "Vanguard", type: "investment", category: "investment", balance: 128400, icon: "trending-up" },
  { id: "invest-3", name: "529 College Fund", institution: "Fidelity", type: "investment", category: "investment", balance: 69600, icon: "graduation-cap" },
  // Other Assets
  { id: "property-1", name: "451 2nd Street", institution: "", type: "property", category: "other_asset", balance: 685000, icon: "home" },
  { id: "vehicle-1", name: "2022 Honda Accord", institution: "", type: "vehicle", category: "other_asset", balance: 24500, icon: "car" },
  { id: "vehicle-2", name: "2023 Toyota Highlander", institution: "", type: "vehicle", category: "other_asset", balance: 38400, icon: "car" },
  // Credit Cards
  { id: "cc-1", name: "Discover it Chrome", institution: "Discover", type: "credit_card", category: "credit_card", balance: 2840, creditLimit: 8000, icon: "credit-card" },
  { id: "cc-2", name: "Chase Freedom Unlimited", institution: "Chase", type: "credit_card", category: "credit_card", balance: 4760, creditLimit: 15000, icon: "credit-card" },
  // Loans
  { id: "mortgage-1", name: "Home Mortgage", institution: "Wells Fargo", type: "mortgage", category: "loan", balance: 284000, icon: "home" },
  { id: "auto-loan-1", name: "Auto Loan — Highlander", institution: "Toyota Financial", type: "auto_loan", category: "loan", balance: 22500, icon: "car" },
];

/* ── Computed account totals (single source of truth) ── */

const _cashTotal = financialAccounts
  .filter((a) => a.category === "cash")
  .reduce((s, a) => s + a.balance, 0);
// → $86,200

const _investTotal = financialAccounts
  .filter((a) => a.category === "investment")
  .reduce((s, a) => s + a.balance, 0);
// → $510,000

const _otherAssetTotal = financialAccounts
  .filter((a) => a.category === "other_asset")
  .reduce((s, a) => s + a.balance, 0);
// → $747,900

const _ccTotal = financialAccounts
  .filter((a) => a.category === "credit_card")
  .reduce((s, a) => s + a.balance, 0);
// → $7,600

const _loanTotal = financialAccounts
  .filter((a) => a.category === "loan")
  .reduce((s, a) => s + a.balance, 0);
// → $306,500

const _totalAssets = _cashTotal + _investTotal + _otherAssetTotal;
// → $1,344,100

const _totalDebt = _ccTotal + _loanTotal;
// → $314,100

const _personalNetWorth = _totalAssets - _totalDebt;
// → $1,030,000

export const personalNetWorth = _personalNetWorth;

// "Other" includes life insurance cash value, crypto, collectibles
// not tracked in individual accounts
export const otherEstateValue = 250000;

// Combined = personal + business equity + other
export const combinedNetWorth = _personalNetWorth + businessEquity + otherEstateValue;
// → $2,850,000

/* ── Net Worth History (personal, 12 months) ─────── */

export const netWorthHistory: NetWorthSnapshot[] = [
  { date: "2025-04", value: 985400 },
  { date: "2025-05", value: 990200 },
  { date: "2025-06", value: 996800 },
  { date: "2025-07", value: 1001400 },
  { date: "2025-08", value: 1006200 },
  { date: "2025-09", value: 1011800 },
  { date: "2025-10", value: 1009400 },
  { date: "2025-11", value: 1015600 },
  { date: "2025-12", value: 1019800 },
  { date: "2026-01", value: 1023200 },
  { date: "2026-02", value: 1025500 },
  { date: "2026-03", value: 1030000 },
];
// Last value matches personalNetWorth ($1,030,000)

/* ── Combined Net Worth History (12 months) ──────── */

export const combinedNetWorthHistory: NetWorthSnapshot[] = [
  { date: "2025-04", value: 2777600 },
  { date: "2025-05", value: 2784200 },
  { date: "2025-06", value: 2791400 },
  { date: "2025-07", value: 2799800 },
  { date: "2025-08", value: 2807600 },
  { date: "2025-09", value: 2814200 },
  { date: "2025-10", value: 2810800 },
  { date: "2025-11", value: 2820400 },
  { date: "2025-12", value: 2828600 },
  { date: "2026-01", value: 2835400 },
  { date: "2026-02", value: 2842800 },
  { date: "2026-03", value: 2850000 },
];
// Last value matches combinedNetWorth ($2,850,000)
// 12-month change: $2,850,000 − $2,777,600 = +$72,400

/* ── Debt History (12 months) ────────────────────── */

export const debtHistory: NetWorthSnapshot[] = [
  { date: "2025-04", value: 328400 },
  { date: "2025-05", value: 327000 },
  { date: "2025-06", value: 325400 },
  { date: "2025-07", value: 323800 },
  { date: "2025-08", value: 322400 },
  { date: "2025-09", value: 320800 },
  { date: "2025-10", value: 319400 },
  { date: "2025-11", value: 318200 },
  { date: "2025-12", value: 317000 },
  { date: "2026-01", value: 315800 },
  { date: "2026-02", value: 316200 },
  { date: "2026-03", value: 314100 },
];
// Last value matches _totalDebt ($314,100)
// Month-over-month: $316,200 → $314,100 = −$2,100

/* ── Net Worth Summary ───────────────────────────── */
// All values computed from account data above

export const netWorthSummary: NetWorthSummary = {
  totalAssets: _totalAssets,         // $1,344,100
  totalDebt: _totalDebt,             // $314,100
  netWorth: _personalNetWorth,       // $1,030,000
  changeAmount: 4500,                // this-month NW change ($1,025,500 → $1,030,000)
  assetChange: 2400,                 // this-month asset change
  debtChange: -2100,                 // this-month debt change ($316,200 → $314,100)
  debtChangePercent: -1,             // debt decreased ~1% this month
  history: netWorthHistory,
};

/* ── Net Worth FAQs ──────────────────────────────── */

export const netWorthFAQs: NetWorthFAQ[] = [
  { id: "1", question: "How is my net worth calculated?", answer: "We add up all your connected accounts, properties, vehicles, and investments, then subtract all outstanding debts including credit cards, mortgages, and loans." },
  { id: "2", question: "What is included in my assets?", answer: "Assets include checking and savings accounts, investment portfolios, real estate properties, vehicles, and any other items of value you have added." },
  { id: "3", question: "What is included in my debt?", answer: "Debt includes all credit card balances, mortgages, auto loans, personal loans, and any other outstanding liabilities." },
  { id: "4", question: "Why does my graph have a gray line on it?", answer: "The dashed gray line represents a reference threshold or average. It helps you visualize how your net worth compares over time." },
  { id: "5", question: "What if I'm missing an account in the Net Worth tab?", answer: "You can add manual accounts by tapping the + button. Connected accounts sync automatically from your linked banks." },
  { id: "6", question: "How do I update the balance of an asset or loan?", answer: "Tap the account in your Assets or Debt tab, then select Edit. Connected accounts update automatically each day." },
];

/* ── Business Aggregate Stats (across all entities) ── */

export const businessStats = {
  revenue: "$115k",
  netProfit: "$26.4k",
  cash: "$486k",
  ar: "$127k",
  ap: "$68k",
  margin: "23.0%",
};

/* ── Cashflow This Month ─────────────────────────── */

export const monthlyCashflow = {
  income: 42500,
  spending: 34700,
  net: 7800, // 42500 - 34700
  business: 4600,     // business contribution
  individual: 3200,   // personal contribution
  // 4600 + 3200 = 7800 ✓
};

/* ── Chart of Accounts ────────────────────────────── */

export const chartOfAccountsData: Record<string, string[]> = {
  Assets: [
    "Furniture & Fixtures",
    "Inventory",
    "Land",
    "Loaner Vehicles",
    "Money Market Account",
    "Prepaid Expenses",
    "Security Deposits",
  ],
  Liabilities: [
    "Accounts Payable",
    "Accrued Expenses",
    "Accrued Salaries & Wages",
    "Bonds Payable",
    "Contingent Liabilities",
    "Credit Card Payable",
    "Short-term Loans Payable",
    "Trade-in Allowance Payable",
    "Unearned Revenue",
    "Vehicle Inventory Financing",
    "Warranty Obligations",
    "Warranty Reserve",
  ],
  Equity: [
    "Partner Distributions",
    "Preferred Stock",
    "Retained Earnings",
    "Retained Earnings - Dealership",
    "Stock Options & Warrants",
    "Treasury Stock",
  ],
  Income: [
    "Body Shop Revenue",
    "Commission Income",
    "Consulting Fees",
    "Service Revenue",
    "Subscription Revenue",
    "Tire Sales",
    "Used Vehicle Sales",
    "Vehicle Detailing Services",
    "Warranty Repair Income",
  ],
  Expense: [
    "Telecommunications",
    "Travel Expenses",
    "Utilities",
    "Vehicle Expenses",
    "Vehicle Inventory Purchases",
    "Vehicle Preparation Costs",
  ],
};

/* ══════════════════════════════════════════════════════
   LIABILITIES HUB DATA
   ══════════════════════════════════════════════════════ */

export interface MortgageDetail {
  id: string;
  property: string;
  address: string;
  lender: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  originalTerm: number; // months
  remainingTerm: number; // months
  startDate: string;
  nextPayment: string;
  homeValue: number; // estimated
  icon: string;
}

export interface CreditCardDetail {
  id: string;
  name: string;
  issuer: string;
  lastFour: string;
  balance: number;
  creditLimit: number;
  apr: number;
  minPayment: number;
  nextDue: string;
  rewardsBalance: string;
  icon: string;
  spendingHistory: number[]; // last 6 months
}

export interface LoanDetail {
  id: string;
  name: string;
  lender: string;
  type: "student" | "auto" | "personal" | "business";
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  remainingTerm: number; // months
  nextPayment: string;
  icon: string;
}

export interface UpcomingObligation {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  daysUntil: number;
  entity: string;
  type: "mortgage" | "credit_card" | "loan" | "insurance" | "bill";
  autoPay: boolean;
}

export const mortgages: MortgageDetail[] = [
  {
    id: "mort-1",
    property: "451 2nd Street",
    address: "451 2nd Street, Austin TX 78701",
    lender: "Wells Fargo",
    originalAmount: 480000,
    currentBalance: 284000,
    interestRate: 6.25,
    monthlyPayment: 2956,
    originalTerm: 360,
    remainingTerm: 216,
    startDate: "2018-04-01",
    nextPayment: "2026-04-01",
    homeValue: 685000,
    icon: "home",
  },
];

export const creditCardDetails: CreditCardDetail[] = [
  {
    id: "cc-1",
    name: "Discover it Chrome",
    issuer: "Discover",
    lastFour: "4821",
    balance: 2840,
    creditLimit: 8000,
    apr: 22.99,
    minPayment: 68,
    nextDue: "2026-03-25",
    rewardsBalance: "12,450 pts",
    icon: "credit-card",
    spendingHistory: [1450, 1820, 2100, 1680, 2340, 2840],
  },
  {
    id: "cc-2",
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    lastFour: "9037",
    balance: 4760,
    creditLimit: 15000,
    apr: 21.49,
    minPayment: 95,
    nextDue: "2026-03-28",
    rewardsBalance: "$84.20 cashback",
    icon: "credit-card",
    spendingHistory: [3200, 3800, 4100, 3540, 4200, 4760],
  },
];

export const loanDetails: LoanDetail[] = [
  {
    id: "loan-1",
    name: "Home Mortgage",
    lender: "Wells Fargo",
    type: "personal", // categorized here as primary residence
    originalAmount: 480000,
    currentBalance: 284000,
    interestRate: 6.25,
    monthlyPayment: 2956,
    remainingTerm: 216,
    nextPayment: "2026-04-01",
    icon: "home",
  },
  {
    id: "loan-2",
    name: "Auto Loan — Highlander",
    lender: "Toyota Financial",
    type: "auto",
    originalAmount: 38500,
    currentBalance: 22500,
    interestRate: 4.9,
    monthlyPayment: 645,
    remainingTerm: 42,
    nextPayment: "2026-03-20",
    icon: "car",
  },
];

// Weighted average interest rate across all debts
export const weightedAvgRate = (() => {
  const allDebts = [
    { balance: 284000, rate: 6.25 },
    { balance: 22500, rate: 4.9 },
    { balance: 2840, rate: 22.99 },
    { balance: 4760, rate: 21.49 },
  ];
  const totalBal = allDebts.reduce((s, d) => s + d.balance, 0);
  const weightedSum = allDebts.reduce((s, d) => s + d.balance * d.rate, 0);
  return +(weightedSum / totalBal).toFixed(2);
})();
// → ~6.64%

export const upcomingObligations: UpcomingObligation[] = [
  { id: "obl-1", label: "Auto Loan — Highlander", amount: 645, dueDate: "Mar 20", daysUntil: 8, entity: "Personal", type: "loan", autoPay: true },
  { id: "obl-2", label: "Discover it Chrome", amount: 68, dueDate: "Mar 25", daysUntil: 13, entity: "Personal", type: "credit_card", autoPay: false },
  { id: "obl-3", label: "Chase Freedom Unlimited", amount: 95, dueDate: "Mar 28", daysUntil: 16, entity: "Personal", type: "credit_card", autoPay: false },
  { id: "obl-4", label: "Home Mortgage", amount: 2956, dueDate: "Apr 1", daysUntil: 20, entity: "Personal", type: "mortgage", autoPay: true },
  { id: "obl-5", label: "Auto Insurance", amount: 184, dueDate: "Apr 5", daysUntil: 24, entity: "Personal", type: "insurance", autoPay: true },
  { id: "obl-6", label: "Home Insurance", amount: 215, dueDate: "Apr 10", daysUntil: 29, entity: "Personal", type: "insurance", autoPay: true },
];

// Snowball payoff order (smallest balance first)
export const snowballOrder = ["cc-1", "cc-2", "loan-2", "loan-1"];
// Avalanche payoff order (highest rate first)
export const avalancheOrder = ["cc-1", "cc-2", "loan-1", "loan-2"];

/* ══════════════════════════════════════════════════════
   INSURANCE DATA
   ══════════════════════════════════════════════════════ */

export interface InsurancePolicy {
  id: string;
  type: "life" | "home" | "auto" | "health" | "business" | "umbrella";
  name: string;
  provider: string;
  premium: number; // monthly
  coverageAmount: number;
  deductible: number;
  renewalDate: string;
  status: "active" | "expiring" | "lapsed";
  policyNumber: string;
  icon: string;
}

export const insurancePolicies: InsurancePolicy[] = [
  {
    id: "ins-1",
    type: "life",
    name: "Term Life — 20yr",
    provider: "Northwestern Mutual",
    premium: 142,
    coverageAmount: 1000000,
    deductible: 0,
    renewalDate: "2038-06-15",
    status: "active",
    policyNumber: "NWM-4821-7790",
    icon: "shield",
  },
  {
    id: "ins-2",
    type: "home",
    name: "Homeowner's — 451 2nd St",
    provider: "State Farm",
    premium: 215,
    coverageAmount: 685000,
    deductible: 2500,
    renewalDate: "2026-08-01",
    status: "active",
    policyNumber: "SF-HO-88341",
    icon: "home",
  },
  {
    id: "ins-3",
    type: "auto",
    name: "Auto — Honda Accord",
    provider: "Geico",
    premium: 98,
    coverageAmount: 100000,
    deductible: 500,
    renewalDate: "2026-05-15",
    status: "expiring",
    policyNumber: "GK-AU-55012",
    icon: "car",
  },
  {
    id: "ins-4",
    type: "auto",
    name: "Auto — Toyota Highlander",
    provider: "Geico",
    premium: 86,
    coverageAmount: 100000,
    deductible: 500,
    renewalDate: "2026-05-15",
    status: "expiring",
    policyNumber: "GK-AU-55013",
    icon: "car",
  },
  {
    id: "ins-5",
    type: "health",
    name: "Family Health PPO",
    provider: "Blue Cross Blue Shield",
    premium: 890,
    coverageAmount: 2000000,
    deductible: 3000,
    renewalDate: "2027-01-01",
    status: "active",
    policyNumber: "BCBS-FP-22187",
    icon: "heart",
  },
  {
    id: "ins-6",
    type: "business",
    name: "General Liability — JRG",
    provider: "Hartford",
    premium: 320,
    coverageAmount: 2000000,
    deductible: 5000,
    renewalDate: "2026-09-01",
    status: "active",
    policyNumber: "HT-GL-90234",
    icon: "briefcase",
  },
];

export const totalMonthlyPremiums = insurancePolicies.reduce(
  (s, p) => s + p.premium,
  0
);
// → $1,751/mo

export const totalCoverage = insurancePolicies.reduce(
  (s, p) => s + p.coverageAmount,
  0
);

export const insuranceInsights = [
  {
    id: "ins-tip-1",
    title: "Auto policies expiring in 2 months",
    description: "Bundle home + auto to save ~$38/mo ($456/yr).",
  },
  {
    id: "ins-tip-2",
    title: "Consider umbrella policy",
    description: "With $2.85M net worth, an umbrella policy ($12/mo) adds $1M extra liability protection.",
  },
];

/* ══════════════════════════════════════════════════════
   CASH FLOW & BUDGET DATA
   ══════════════════════════════════════════════════════ */

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
  icon: string;
  color: string;
}

export interface CashFlowMonth {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export const budgetCategories: BudgetCategory[] = [
  { id: "housing", name: "Housing", budgeted: 3200, actual: 2956, icon: "home", color: "bg-accent-blue" },
  { id: "transport", name: "Transportation", budgeted: 1200, actual: 1085, icon: "car", color: "bg-accent-purple" },
  { id: "food", name: "Food & Dining", budgeted: 1400, actual: 1620, icon: "utensils", color: "bg-accent-orange" },
  { id: "utilities", name: "Utilities", budgeted: 450, actual: 380, icon: "zap", color: "bg-accent-yellow" },
  { id: "insurance-budget", name: "Insurance", budgeted: 1800, actual: 1751, icon: "shield", color: "bg-accent-teal" },
  { id: "subscriptions", name: "Subscriptions", budgeted: 250, actual: 287, icon: "repeat", color: "bg-accent-red" },
  { id: "shopping", name: "Shopping", budgeted: 800, actual: 640, icon: "shopping-bag", color: "bg-accent-green" },
  { id: "debt-payments", name: "Debt Payments", budgeted: 3800, actual: 3764, icon: "credit-card", color: "bg-accent-blue" },
];

export const budgetTotalBudgeted = budgetCategories.reduce(
  (s, c) => s + c.budgeted,
  0
);
export const budgetTotalActual = budgetCategories.reduce(
  (s, c) => s + c.actual,
  0
);

export const cashFlowHistory: CashFlowMonth[] = [
  { month: "Oct", income: 40200, expenses: 33400, net: 6800 },
  { month: "Nov", income: 41800, expenses: 35200, net: 6600 },
  { month: "Dec", income: 44500, expenses: 38900, net: 5600 },
  { month: "Jan", income: 41200, expenses: 33800, net: 7400 },
  { month: "Feb", income: 43100, expenses: 34500, net: 8600 },
  { month: "Mar", income: 42500, expenses: 34700, net: 7800 },
];

// 12-month cashflow projection
export const cashFlowProjection: CashFlowMonth[] = [
  { month: "Apr", income: 42800, expenses: 34200, net: 8600 },
  { month: "May", income: 43200, expenses: 34800, net: 8400 },
  { month: "Jun", income: 43800, expenses: 35100, net: 8700 },
  { month: "Jul", income: 42600, expenses: 35400, net: 7200 },
  { month: "Aug", income: 43400, expenses: 35000, net: 8400 },
  { month: "Sep", income: 44200, expenses: 34600, net: 9600 },
  { month: "Oct", income: 43800, expenses: 35200, net: 8600 },
  { month: "Nov", income: 44600, expenses: 36100, net: 8500 },
  { month: "Dec", income: 46200, expenses: 39200, net: 7000 },
  { month: "Jan '27", income: 44800, expenses: 35400, net: 9400 },
  { month: "Feb '27", income: 45200, expenses: 35600, net: 9600 },
  { month: "Mar '27", income: 45800, expenses: 35200, net: 10600 },
];

/* ══════════════════════════════════════════════════════
   ASSETS & INVESTMENTS DATA
   ══════════════════════════════════════════════════════ */

export interface PortfolioAllocation {
  id: string;
  label: string;
  value: number;
  percent: number;
  color: string;
}

export interface AssetPerformance {
  month: string;
  portfolio: number;
  benchmark: number;
}

export const portfolioAllocations: PortfolioAllocation[] = [
  { id: "stocks", label: "Stocks", value: 218400, percent: 42.8, color: "#22c55e" },
  { id: "bonds", label: "Bonds", value: 93600, percent: 18.4, color: "#3b82f6" },
  { id: "real-estate", label: "Real Estate", value: 747900, percent: 26.1, color: "#f97316" },
  { id: "retirement", label: "Retirement", value: 198000, percent: 13.8, color: "#a855f7" },
  { id: "education", label: "Education", value: 69600, percent: 4.8, color: "#14b8a6" },
  { id: "cash-equiv", label: "Cash & Equiv.", value: 86200, percent: 6.0, color: "#eab308" },
];

// Total investment portfolio = all personal assets
export const totalPortfolio = _totalAssets;
// → $1,344,100

export const portfolioPerformance: AssetPerformance[] = [
  { month: "Apr '25", portfolio: 1284200, benchmark: 1280000 },
  { month: "May", portfolio: 1291400, benchmark: 1288000 },
  { month: "Jun", portfolio: 1298600, benchmark: 1296000 },
  { month: "Jul", portfolio: 1304800, benchmark: 1308000 },
  { month: "Aug", portfolio: 1312200, benchmark: 1316000 },
  { month: "Sep", portfolio: 1318400, benchmark: 1320000 },
  { month: "Oct", portfolio: 1314800, benchmark: 1324000 },
  { month: "Nov", portfolio: 1324600, benchmark: 1332000 },
  { month: "Dec", portfolio: 1330800, benchmark: 1336000 },
  { month: "Jan '26", portfolio: 1334200, benchmark: 1340000 },
  { month: "Feb", portfolio: 1338800, benchmark: 1344000 },
  { month: "Mar", portfolio: 1344100, benchmark: 1348000 },
];

/* ══════════════════════════════════════════════════════
   DASHBOARD KPI DATA
   ══════════════════════════════════════════════════════ */

export interface DashboardKPI {
  id: string;
  label: string;
  value: string;
  subValue: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: string;
}

// Liquid cash = checking + savings
const _liquidCash = _cashTotal;
// Runway = liquid cash / monthly spending
const _runwayMonths = Math.round(_liquidCash / monthlyCashflow.spending);

// Debt-to-income = (monthly debt payments) / (monthly income) × 100
const _monthlyDebtPayments = 2956 + 645 + 68 + 95; // mortgage + auto + cc mins
const _debtToIncome = Math.round((_monthlyDebtPayments / monthlyCashflow.income) * 100);

export const dashboardKPIs: DashboardKPI[] = [
  {
    id: "net-worth",
    label: "Net Worth",
    value: "$2.85M",
    subValue: "Combined personal + business",
    trend: "up",
    trendValue: "+$72.4k (12mo)",
    icon: "trending-up",
  },
  {
    id: "liquid-cash",
    label: "Liquid Cash",
    value: `$${Math.round(_liquidCash / 1000)}k`,
    subValue: `${_runwayMonths} months runway`,
    trend: _runwayMonths >= 6 ? "up" : "down",
    trendValue: `${_runwayMonths}mo runway`,
    icon: "wallet",
  },
  {
    id: "burn-rate",
    label: "Monthly Burn",
    value: `$${(monthlyCashflow.spending / 1000).toFixed(1)}k`,
    subValue: "Last 6-month average",
    trend: "neutral",
    trendValue: "-2.1% vs prior",
    icon: "flame",
  },
  {
    id: "dti",
    label: "Debt-to-Income",
    value: `${_debtToIncome}%`,
    subValue: "Improved 4% this month",
    trend: "down",
    trendValue: "-4% this month",
    icon: "percent",
  },
];
