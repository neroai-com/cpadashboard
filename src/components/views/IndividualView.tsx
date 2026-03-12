"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import DonutChart from "@/components/DonutChart";
import ProgressBar from "@/components/ProgressBar";
import SectionHeader from "@/components/SectionHeader";
import SparklineChart from "@/components/SparklineChart";
import { formatCurrency } from "@/lib/utils";
import {
  personalNetWorth,
  netWorthHistory,
  budgetTotalBudgeted,
  budgetTotalActual,
  subscriptions,
  subscriptionMonthlyTotal,
  subscriptionsByCategory,
  savingsGoals,
  totalGoalSaved,
  totalGoalTarget,
  familyMembers,
  spendingCategories,
  uncategorizedTransactions,
  taxEstimates,
  estimatedTaxOwed,
  effectiveTaxRate,
  personalHealthScores,
  monthlyCashflow,
  combinedInsights,
} from "@/lib/data";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  DollarSign,
  Plus,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Target,
  Receipt,
  FileText,
  CreditCard,
  Shield,
  Heart,
  Home,
  Car,
  Utensils,
  Zap,
  Repeat,
  ShoppingBag,
  Tv,
  Music,
  Cloud,
  Bot,
  PenTool,
  Dumbbell,
  Newspaper,
  ChefHat,
  Package,
  ShoppingCart,
  Plane,
  GraduationCap,
  Play,
  type LucideIcon,
} from "lucide-react";

type IndTab = "overview" | "spending" | "goals" | "family" | "tax";

const tabs: { id: IndTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "spending", label: "Spending" },
  { id: "goals", label: "Goals" },
  { id: "family", label: "Family" },
  { id: "tax", label: "Tax" },
];

const subIconMap: Record<string, LucideIcon> = {
  tv: Tv,
  music: Music,
  play: Play,
  cloud: Cloud,
  bot: Bot,
  "pen-tool": PenTool,
  dumbbell: Dumbbell,
  newspaper: Newspaper,
  "chef-hat": ChefHat,
  package: Package,
  "shopping-cart": ShoppingCart,
  home: Home,
  car: Car,
  utensils: Utensils,
  zap: Zap,
  shield: Shield,
  repeat: Repeat,
  "shopping-bag": ShoppingBag,
  "credit-card": CreditCard,
  plane: Plane,
  "graduation-cap": GraduationCap,
};

const catCycleLabels: Record<string, string> = {
  streaming: "Streaming",
  software: "Software",
  fitness: "Fitness",
  news: "News",
  food: "Meal delivery",
  cloud: "Cloud",
  other: "Other",
};

export default function IndividualView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<IndTab>("overview");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const budgetPercent = Math.round(
    (budgetTotalActual / budgetTotalBudgeted) * 100
  );
  const goalPercent = Math.round((totalGoalSaved / totalGoalTarget) * 100);
  const { overall } = personalHealthScores;

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <Logo size="sm" />
        <span className="text-xs text-text-secondary border border-border-secondary rounded-full px-3 py-1">
          Personal CFO
        </span>
      </div>

      {/* Tab bar */}
      <div
        role="tablist"
        className="flex border-b border-border-primary mb-5 animate-fade-in overflow-x-auto no-scrollbar"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedCategory(null);
              }}
              className={`flex-1 min-w-0 pb-3 text-sm font-medium text-center relative transition-colors focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none whitespace-nowrap px-2 ${
                isActive
                  ? "text-accent-green"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-accent-green rounded-full animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Overview Tab ───────────────── */}
      {activeTab === "overview" && (
        <div className="animate-fade-in-up">
          {/* Personal NW Hero */}
          <Card variant="hero" className="mb-4">
            <p className="text-xs text-text-muted mb-1">Personal Net Worth</p>
            <AnimatedNumber
              value={personalNetWorth}
              prefix="$"
              className="text-3xl font-bold text-glow-green"
            />
            <SparklineChart
              data={netWorthHistory}
              height={60}
              className="mt-2 text-accent-green"
            />
          </Card>

          {/* Health Score */}
          <Card className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                Financial Health
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-accent-green">{overall}</span>
                <span className="text-xs text-text-muted">/100</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {(
                [
                  { label: "Savings", score: personalHealthScores.savings, color: "bg-accent-green" },
                  { label: "Debt Mgmt", score: personalHealthScores.debt, color: "bg-accent-blue" },
                  { label: "Insurance", score: personalHealthScores.insurance, color: "bg-accent-teal" },
                  { label: "Investing", score: personalHealthScores.investing, color: "bg-accent-purple" },
                  { label: "Tax Plan", score: personalHealthScores.tax, color: "bg-accent-orange" },
                  { label: "Estate", score: personalHealthScores.estate, color: "bg-accent-yellow" },
                ] as const
              ).map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-[10px] text-text-muted w-16 flex-shrink-0">
                    {item.label}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-bg-input/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-text-primary w-8 text-right">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick KPIs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setActiveTab("spending")}
              className="bg-bg-card border border-border-primary rounded-xl p-3 text-left hover:bg-bg-card-hover transition-colors"
            >
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                Budget
              </p>
              <p className="text-lg font-bold">{budgetPercent}%</p>
              <p className="text-[10px] text-text-muted">used this mo</p>
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className="bg-bg-card border border-border-primary rounded-xl p-3 text-left hover:bg-bg-card-hover transition-colors"
            >
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                Goals
              </p>
              <p className="text-lg font-bold">{goalPercent}%</p>
              <p className="text-[10px] text-text-muted">on track</p>
            </button>
            <button
              onClick={() => setActiveTab("family")}
              className="bg-bg-card border border-border-primary rounded-xl p-3 text-left hover:bg-bg-card-hover transition-colors"
            >
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                Family
              </p>
              <p className="text-lg font-bold">{familyMembers.length}</p>
              <p className="text-[10px] text-text-muted">members</p>
            </button>
          </div>

          {/* Subscriptions snapshot */}
          <SectionHeader title="Subscriptions" total={`${subscriptions.length} active`} className="mb-2" />
          <Card className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xl font-bold">
                  {formatCurrency(Math.round(subscriptionMonthlyTotal))}
                  <span className="text-xs text-text-muted font-normal">/mo</span>
                </p>
                <p className="text-[10px] text-text-muted">
                  {formatCurrency(Math.round(subscriptionMonthlyTotal * 12))}/yr
                </p>
              </div>
              <DonutChart
                segments={Object.entries(subscriptionsByCategory).map(
                  ([cat, d], i) => ({
                    label: cat,
                    value: d.total,
                    percent: Math.round((d.total / subscriptionMonthlyTotal) * 100),
                    color: ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#14b8a6", "#eab308", "#ef4444"][i % 7],
                  })
                )}
                size={70}
                strokeWidth={10}
              />
            </div>
            <div className="space-y-2">
              {subscriptions.slice(0, 4).map((sub) => {
                const Icon = subIconMap[sub.icon] || Receipt;
                return (
                  <div key={sub.id} className="flex items-center gap-3 py-1">
                    <div className="w-7 h-7 rounded-lg bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-text-secondary" />
                    </div>
                    <span className="flex-1 text-xs font-medium">{sub.name}</span>
                    {sub.shared && (
                      <span className="text-[9px] bg-accent-blue/10 text-accent-blue px-1.5 py-0.5 rounded-full">
                        Shared
                      </span>
                    )}
                    <span className="text-xs font-bold">
                      ${sub.amount.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setActiveTab("spending")}
              className="w-full mt-3 pt-2.5 text-xs font-medium text-accent-green border-t border-border-primary/50 hover:text-accent-green-dark transition-colors"
            >
              View all {subscriptions.length} subscriptions
            </button>
          </Card>

          {/* Uncategorized */}
          {uncategorizedTransactions.length > 0 && (
            <>
              <SectionHeader
                title="Needs Review"
                total={`${uncategorizedTransactions.length} items`}
                className="mb-2"
              />
              <Card className="mb-4">
                <p className="text-xs text-text-muted mb-3">
                  Categorize these transactions for accurate tracking.
                </p>
                {uncategorizedTransactions.slice(0, 3).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 py-2.5 border-b border-border-primary/30 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {tx.description}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {tx.date} · {tx.account}
                      </p>
                    </div>
                    <p className="text-xs font-bold flex-shrink-0">
                      ${tx.amount.toFixed(2)}
                    </p>
                    <button className="px-2 py-1 rounded-md bg-accent-green/10 text-accent-green text-[10px] font-medium flex-shrink-0 hover:bg-accent-green/20 transition-colors">
                      {tx.suggestedCategory}
                    </button>
                  </div>
                ))}
                <button className="w-full mt-2 pt-2.5 text-xs font-medium text-accent-green border-t border-border-primary/50 hover:text-accent-green-dark transition-colors">
                  Review all {uncategorizedTransactions.length} transactions
                </button>
              </Card>
            </>
          )}

          {/* AI CFO */}
          <Card variant="hero" className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-accent-green" />
              <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                AI CFO
              </span>
            </div>
            <p className="text-sm font-semibold">
              You have $287 in subscriptions — $37 over budget.
            </p>
            <p className="text-xs text-text-muted mt-1">
              HelloFresh ($80/mo) and WSJ ($39/mo) are your top costs. Consider
              pausing one to stay within budget.
            </p>
          </Card>
        </div>
      )}

      {/* ─── Spending Tab ───────────────── */}
      {activeTab === "spending" && (
        <div className="animate-fade-in-up">
          {/* Donut */}
          <Card variant="hero" className="mb-4">
            <p className="text-xs text-text-muted mb-1">Monthly Spending</p>
            <AnimatedNumber
              value={monthlyCashflow.spending}
              prefix="$"
              className="text-3xl font-bold"
            />
            <div className="flex items-center gap-4 mt-3">
              <DonutChart
                segments={spendingCategories.map((c) => ({
                  label: c.name,
                  value: c.amount,
                  percent: c.percent,
                  color: c.color,
                }))}
                size={120}
                strokeWidth={14}
                centerValue={`${spendingCategories.length}`}
                centerLabel="categories"
              />
              <div className="flex-1 space-y-1.5">
                {spendingCategories.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-[10px] text-text-secondary flex-1 truncate">
                      {c.name}
                    </span>
                    <span className="text-[10px] font-medium">
                      {c.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Categories with drill-down */}
          <SectionHeader title="By Category" className="mb-2" />
          <Card className="mb-4 !p-0 overflow-hidden">
            {spendingCategories.map((cat) => {
              const Icon = subIconMap[cat.icon] || Receipt;
              const isExpanded = expandedCategory === cat.id;
              const TrendIcon =
                cat.trend === "up"
                  ? ArrowUpRight
                  : cat.trend === "down"
                  ? ArrowDownRight
                  : Minus;
              const trendColor =
                cat.trend === "up"
                  ? "text-accent-red"
                  : cat.trend === "down"
                  ? "text-accent-green"
                  : "text-text-muted";

              return (
                <div key={cat.id} className="border-b border-border-primary/30 last:border-0">
                  <button
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : cat.id)
                    }
                    className="w-full flex items-center gap-3 py-3.5 px-4 text-left hover:bg-bg-card-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cat.color + "18" }}
                    >
                      <Icon size={16} style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{cat.name}</p>
                      <div className="flex items-center gap-1">
                        <TrendIcon size={10} className={trendColor} />
                        <span className={`text-[10px] ${trendColor}`}>
                          {cat.trendValue}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 mr-1">
                      <p className="text-sm font-bold">
                        {formatCurrency(cat.amount)}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {cat.percent}%
                      </p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-text-muted transition-transform flex-shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Subcategory drill-down */}
                  {isExpanded && (
                    <div className="px-4 pb-3 animate-fade-in">
                      <div className="ml-12 space-y-2 pt-1">
                        {cat.subcategories.map((sub) => (
                          <div
                            key={sub.name}
                            className="flex items-center justify-between py-1.5 border-b border-border-primary/20 last:border-0"
                          >
                            <span className="text-xs text-text-secondary">
                              {sub.name}
                            </span>
                            <span className="text-xs font-medium">
                              {formatCurrency(sub.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>

          {/* All Subscriptions */}
          <SectionHeader
            title="Subscriptions"
            total={formatCurrency(Math.round(subscriptionMonthlyTotal)) + "/mo"}
            className="mb-2"
          />
          <Card className="mb-4 !p-0 overflow-hidden">
            {subscriptions.map((sub) => {
              const Icon = subIconMap[sub.icon] || Receipt;
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-3 py-3 px-4 border-b border-border-primary/30 last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{sub.name}</p>
                    <p className="text-[10px] text-text-muted">
                      {catCycleLabels[sub.category] || sub.category} ·{" "}
                      {sub.cycle === "yearly" ? "Annual" : "Monthly"} · Next{" "}
                      {sub.nextBill}
                    </p>
                  </div>
                  {sub.shared && (
                    <Users size={10} className="text-accent-blue flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold flex-shrink-0">
                    ${sub.amount.toFixed(2)}
                    <span className="text-[10px] text-text-muted font-normal">
                      /{sub.cycle === "yearly" ? "yr" : "mo"}
                    </span>
                  </span>
                </div>
              );
            })}
          </Card>

          {/* Uncategorized */}
          <SectionHeader
            title="Uncategorized"
            total={`${uncategorizedTransactions.length} pending`}
            className="mb-2"
          />
          <Card className="mb-6 !p-0 overflow-hidden">
            {uncategorizedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 py-3 px-4 border-b border-border-primary/30 last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-yellow/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={14} className="text-accent-yellow" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {tx.description}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {tx.date} · {tx.account}
                  </p>
                </div>
                <p className="text-xs font-bold flex-shrink-0 mr-1">
                  ${tx.amount.toFixed(2)}
                </p>
                <button className="px-2 py-1 rounded-md bg-accent-green/10 text-accent-green text-[10px] font-medium flex-shrink-0 hover:bg-accent-green/20 transition-colors">
                  {tx.suggestedCategory}
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ─── Goals Tab ──────────────────── */}
      {activeTab === "goals" && (
        <div className="animate-fade-in-up">
          {/* Summary */}
          <Card variant="hero" className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-text-muted mb-1">Total Saved</p>
                <AnimatedNumber
                  value={totalGoalSaved}
                  prefix="$"
                  className="text-3xl font-bold text-glow-green"
                />
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted mb-1">Target</p>
                <p className="text-xl font-bold text-text-muted">
                  {formatCurrency(totalGoalTarget, { compact: true })}
                </p>
              </div>
            </div>
            <ProgressBar
              percent={goalPercent}
              color="bg-accent-green"
              height={8}
              label={`${goalPercent}% of total target`}
              showPercent
            />
            <p className="text-[10px] text-text-muted mt-2">
              Auto-saving{" "}
              {formatCurrency(
                savingsGoals
                  .filter((g) => g.autoSave)
                  .reduce((s, g) => s + g.monthlyContribution, 0)
              )}
              /mo across {savingsGoals.filter((g) => g.autoSave).length} goals
            </p>
          </Card>

          {/* Goals */}
          {savingsGoals.map((goal) => {
            const Icon = subIconMap[goal.icon] || Target;
            const pct = Math.round(
              (goal.currentAmount / goal.targetAmount) * 100
            );
            const remaining = goal.targetAmount - goal.currentAmount;
            const monthsLeft = Math.ceil(
              remaining / goal.monthlyContribution
            );

            return (
              <Card key={goal.id} className="mb-3">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${goal.color}/10`}
                  >
                    <Icon size={18} className={`${goal.color.replace("bg-", "text-")}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{goal.name}</p>
                      {goal.autoSave && (
                        <span className="text-[9px] bg-accent-green/10 text-accent-green px-1.5 py-0.5 rounded-full">
                          Auto-save
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-text-muted">
                      Target by {goal.targetDate.slice(0, 7).replace("-", "/")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold">
                    {formatCurrency(goal.currentAmount, { compact: true })}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatCurrency(goal.targetAmount, { compact: true })}
                  </span>
                </div>
                <ProgressBar
                  percent={pct}
                  color={goal.color}
                  height={6}
                />

                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-text-muted">
                    {formatCurrency(goal.monthlyContribution)}/mo contribution
                  </span>
                  <span className="text-[10px] text-text-muted">
                    ~{monthsLeft > 12
                      ? `${Math.round(monthsLeft / 12)}yr ${monthsLeft % 12}mo`
                      : `${monthsLeft}mo`} left
                  </span>
                </div>
              </Card>
            );
          })}

          {/* Add goal */}
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border-secondary text-text-muted hover:text-text-secondary hover:border-border-primary transition-colors mb-6">
            <Plus size={16} />
            <span className="text-sm font-medium">Add Savings Goal</span>
          </button>

          {/* AI */}
          <Card variant="hero" className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-accent-green" />
              <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                AI CFO
              </span>
            </div>
            <p className="text-sm font-semibold">
              Emergency fund at 26% — boost contribution $200/mo.
            </p>
            <p className="text-xs text-text-muted mt-1">
              At current rate, you&apos;ll reach 6-month runway by 2032. Adding $200/mo
              moves that to mid-2029.
            </p>
          </Card>
        </div>
      )}

      {/* ─── Family Tab ─────────────────── */}
      {activeTab === "family" && (
        <div className="animate-fade-in-up">
          {/* Members */}
          <SectionHeader
            title="Family Members"
            total={`${familyMembers.length} members`}
            className="mb-2"
          />
          <Card className="mb-4 !p-0 overflow-hidden">
            {familyMembers.map((fm) => {
              const relLabel: Record<string, string> = {
                self: "Primary",
                spouse: "Spouse",
                child: "Child",
                dependent: "Dependent",
              };
              return (
                <div
                  key={fm.id}
                  className="flex items-center gap-3 py-3.5 px-4 border-b border-border-primary/30 last:border-0"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${fm.color}`}
                  >
                    <span className="text-xs font-bold text-bg-primary">
                      {fm.initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{fm.name}</p>
                    <p className="text-[10px] text-text-muted">
                      {relLabel[fm.relationship]} · Age {fm.age}
                      {fm.linkedAccounts > 0 &&
                        ` · ${fm.linkedAccounts} account${fm.linkedAccounts !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                  {fm.monthlyCost > 0 && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold">
                        {formatCurrency(fm.monthlyCost)}
                      </p>
                      <p className="text-[10px] text-text-muted">/mo</p>
                    </div>
                  )}
                  <ChevronRight size={14} className="text-text-muted flex-shrink-0" />
                </div>
              );
            })}
          </Card>

          {/* Shared expenses */}
          <SectionHeader title="Shared Subscriptions" className="mb-2" />
          <Card className="mb-4 !p-0 overflow-hidden">
            {subscriptions
              .filter((s) => s.shared)
              .map((sub) => {
                const Icon = subIconMap[sub.icon] || Receipt;
                return (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 py-3 px-4 border-b border-border-primary/30 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{sub.name}</p>
                      <p className="text-[10px] text-text-muted">
                        Shared with family
                      </p>
                    </div>
                    <span className="text-xs font-bold">
                      ${sub.amount.toFixed(2)}
                      <span className="text-[10px] text-text-muted font-normal">
                        /{sub.cycle === "yearly" ? "yr" : "mo"}
                      </span>
                    </span>
                  </div>
                );
              })}
          </Card>

          {/* Dependents cost summary */}
          <SectionHeader title="Dependent Costs" className="mb-2" />
          <Card className="mb-4">
            {familyMembers
              .filter((fm) => fm.monthlyCost > 0)
              .map((fm) => (
                <div
                  key={fm.id}
                  className="flex items-center justify-between py-2.5 border-b border-border-primary/30 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${fm.color}`}
                    >
                      <span className="text-[10px] font-bold text-bg-primary">
                        {fm.initials}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{fm.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {formatCurrency(fm.monthlyCost)}/mo
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {formatCurrency(fm.monthlyCost * 12)}/yr
                    </p>
                  </div>
                </div>
              ))}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-border-primary/50">
              <span className="text-xs font-bold text-text-muted">
                Total dependents
              </span>
              <span className="text-sm font-bold">
                {formatCurrency(
                  familyMembers
                    .filter((fm) => fm.monthlyCost > 0)
                    .reduce((s, fm) => s + fm.monthlyCost, 0)
                )}
                /mo
              </span>
            </div>
          </Card>

          {/* Estate planning */}
          <SectionHeader title="Estate Planning" className="mb-2" />
          <Card className="mb-6">
            <ProgressBar
              percent={personalHealthScores.estate}
              color="bg-accent-teal"
              label="Estate health"
              showPercent
              height={6}
              className="mb-3"
            />
            <div className="space-y-2">
              {[
                { label: "Will & Trust", done: true },
                { label: "Life Insurance", done: true },
                { label: "Beneficiary Review", done: false },
                { label: "Power of Attorney", done: false },
                { label: "Healthcare Directive", done: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2"
                >
                  {item.done ? (
                    <div className="w-5 h-5 rounded-full bg-accent-green/10 flex items-center justify-center">
                      <Check size={10} className="text-accent-green" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-bg-input/50 border border-border-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                    </div>
                  )}
                  <span
                    className={`text-xs ${
                      item.done ? "text-text-secondary" : "text-text-muted"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ─── Tax Tab ────────────────────── */}
      {activeTab === "tax" && (
        <div className="animate-fade-in-up">
          {/* Summary */}
          <Card variant="hero" className="mb-4">
            <p className="text-xs text-text-muted mb-1">
              Estimated 2026 Tax Liability
            </p>
            <AnimatedNumber
              value={Math.abs(estimatedTaxOwed)}
              prefix={estimatedTaxOwed < 0 ? "Refund $" : "$"}
              className="text-3xl font-bold text-glow-green"
            />
            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/[0.06]">
              <div>
                <p className="text-[10px] text-text-muted">Effective Rate</p>
                <p className="text-lg font-bold">{effectiveTaxRate}%</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted">TX State Tax</p>
                <p className="text-lg font-bold text-accent-green">$0</p>
              </div>
            </div>
          </Card>

          {/* Breakdown */}
          <SectionHeader title="Tax Breakdown" className="mb-2" />
          <Card className="mb-4 !p-0 overflow-hidden">
            {taxEstimates.map((item) => {
              const typeColors: Record<string, string> = {
                income: "text-accent-red",
                deduction: "text-accent-green",
                credit: "text-accent-blue",
                payment: "text-accent-purple",
              };
              const typeBg: Record<string, string> = {
                income: "bg-accent-red/10",
                deduction: "bg-accent-green/10",
                credit: "bg-accent-blue/10",
                payment: "bg-accent-purple/10",
              };
              const typeLabels: Record<string, string> = {
                income: "Tax",
                deduction: "Deduction",
                credit: "Credit",
                payment: "Payment",
              };
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3 px-4 border-b border-border-primary/30 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{item.label}</p>
                    <span
                      className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${typeBg[item.type]} ${typeColors[item.type]}`}
                    >
                      {typeLabels[item.type]}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-bold flex-shrink-0 ${
                      item.amount < 0 ? "text-accent-green" : "text-text-primary"
                    }`}
                  >
                    {item.amount < 0 ? "−" : ""}
                    {formatCurrency(Math.abs(item.amount))}
                  </p>
                </div>
              );
            })}
          </Card>

          {/* Quarterly schedule */}
          <SectionHeader title="Quarterly Payments" className="mb-2" />
          <Card className="mb-4">
            <div className="space-y-2.5">
              {[
                { q: "Q1 (Jan 15)", amount: 17100, status: "paid" },
                { q: "Q2 (Apr 15)", amount: 17100, status: "due" },
                { q: "Q3 (Jun 15)", amount: 17100, status: "upcoming" },
                { q: "Q4 (Sep 15)", amount: 17100, status: "upcoming" },
              ].map((qtr) => (
                <div
                  key={qtr.q}
                  className="flex items-center justify-between py-2 border-b border-border-primary/30 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {qtr.status === "paid" ? (
                      <div className="w-5 h-5 rounded-full bg-accent-green/10 flex items-center justify-center">
                        <Check size={10} className="text-accent-green" />
                      </div>
                    ) : qtr.status === "due" ? (
                      <div className="w-5 h-5 rounded-full bg-accent-yellow/10 flex items-center justify-center">
                        <AlertTriangle size={10} className="text-accent-yellow" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-bg-input/50 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                      </div>
                    )}
                    <span className="text-xs font-medium">{qtr.q}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">
                      {formatCurrency(qtr.amount)}
                    </span>
                    <span
                      className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                        qtr.status === "paid"
                          ? "bg-accent-green/10 text-accent-green"
                          : qtr.status === "due"
                          ? "bg-accent-yellow/10 text-accent-yellow"
                          : "bg-bg-input text-text-muted"
                      }`}
                    >
                      {qtr.status.charAt(0).toUpperCase() + qtr.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI tax */}
          <Card variant="hero" className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-accent-green" />
              <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                AI CFO — Tax Strategy
              </span>
            </div>
            <p className="text-sm font-semibold">
              Max out 401k to save ~$6,900 in taxes.
            </p>
            <p className="text-xs text-text-muted mt-1">
              You&apos;re contributing $23k/yr. Increasing to the $23.5k limit reduces
              taxable income. Also consider a backdoor Roth IRA conversion.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
