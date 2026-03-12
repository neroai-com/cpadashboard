"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/auth";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import BarChart from "@/components/BarChart";
import BudgetBar from "@/components/BudgetBar";
import SectionHeader from "@/components/SectionHeader";
import { formatCurrency } from "@/lib/utils";
import {
  monthlyCashflow,
  budgetCategories,
  budgetTotalBudgeted,
  budgetTotalActual,
  cashFlowHistory,
  cashFlowProjection,
} from "@/lib/data";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  Calendar,
  ChevronRight,
} from "lucide-react";

type CFTab = "overview" | "budget" | "forecast";

const tabs: { id: CFTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "budget", label: "Budget" },
  { id: "forecast", label: "Forecast" },
];

export default function CashFlowPage() {
  const authed = useAuthGuard();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CFTab>("overview");

  const { income, spending, net, business, individual } = monthlyCashflow;
  const incomePercent = Math.round((income / (income + spending)) * 100);
  const budgetRemaining = budgetTotalBudgeted - budgetTotalActual;
  const budgetPercent = Math.round(
    (budgetTotalActual / budgetTotalBudgeted) * 100
  );

  // Overbudget categories
  const overBudget = budgetCategories.filter((c) => c.actual > c.budgeted);

  if (!authed) {
    return (
      <div className="min-h-dvh bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg-primary">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent-green rounded-lg outline-none p-1"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} className="text-text-secondary" />
            <Logo size="sm" />
          </button>
        </div>

        <h1 className="text-lg font-bold text-center mb-4 animate-fade-in">
          Cash Flow & Budgets
        </h1>

        {/* Tab bar */}
        <div
          role="tablist"
          className="flex border-b border-border-primary mb-6 animate-fade-in"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 pb-3 text-sm font-medium text-center relative transition-colors focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none ${
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

        {/* ─── Overview Tab ─────────────────── */}
        {activeTab === "overview" && (
          <div className="animate-fade-in-up">
            {/* Hero */}
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Net Cash Flow</p>
              <div className="flex items-baseline gap-2">
                <AnimatedNumber
                  value={net}
                  prefix="+ $"
                  className="text-3xl font-bold text-text-green"
                />
                <span className="text-xs text-text-muted">this month</span>
              </div>

              {/* Income vs Spending bar */}
              <div className="mt-4 mb-1">
                <div className="flex justify-between text-[10px] text-text-muted mb-1">
                  <span className="flex items-center gap-1">
                    <ArrowUpRight size={10} className="text-accent-green" />
                    Income {formatCurrency(income)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowDownRight size={10} className="text-accent-orange" />
                    Spending {formatCurrency(spending)}
                  </span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-accent-green rounded-l-full transition-all duration-700"
                    style={{ width: `${incomePercent}%` }}
                  />
                  <div
                    className="bg-accent-orange/70 rounded-r-full transition-all duration-700"
                    style={{ width: `${100 - incomePercent}%` }}
                  />
                </div>
              </div>

              {/* By space */}
              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <p className="text-xs text-text-muted mb-2">By source</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l-green pl-3">
                    <p className="text-xs text-text-secondary">Business</p>
                    <p className="text-xl font-bold">
                      + {formatCurrency(business)}
                    </p>
                  </div>
                  <div className="border-l-blue pl-3">
                    <p className="text-xs text-text-secondary">Individual</p>
                    <p className="text-xl font-bold text-text-green">
                      + {formatCurrency(individual)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 6-month history chart */}
            <SectionHeader title="6-Month Trend" className="mb-3" />
            <Card className="mb-6">
              <BarChart
                data={cashFlowHistory.map((m) => ({
                  label: m.month,
                  value: m.income,
                  secondValue: m.expenses,
                }))}
                height={120}
                barColor="bg-accent-green"
                secondBarColor="bg-accent-orange/70"
              />
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-accent-green" />
                  <span className="text-[10px] text-text-muted">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-accent-orange/70" />
                  <span className="text-[10px] text-text-muted">Expenses</span>
                </div>
              </div>
            </Card>

            {/* Budget summary */}
            <SectionHeader
              title="Budget This Month"
              total={`${budgetPercent}% used`}
              className="mb-3"
            />
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xl font-bold">
                    {formatCurrency(budgetTotalActual)}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    of {formatCurrency(budgetTotalBudgeted)} budgeted
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      budgetRemaining >= 0
                        ? "text-accent-green"
                        : "text-accent-red"
                    }`}
                  >
                    {formatCurrency(Math.abs(budgetRemaining))}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {budgetRemaining >= 0 ? "remaining" : "over budget"}
                  </p>
                </div>
              </div>
              <div className="h-3 rounded-full bg-bg-input/50 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    budgetPercent > 100 ? "bg-accent-red" : "bg-accent-green"
                  }`}
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>

              {overBudget.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border-primary/50">
                  <p className="text-[10px] text-accent-orange mb-1">
                    Over budget this month:
                  </p>
                  {overBudget.map((c) => (
                    <p key={c.id} className="text-xs text-text-muted">
                      {c.name}: ${(c.actual - c.budgeted).toLocaleString()} over
                    </p>
                  ))}
                </div>
              )}
            </Card>

            {/* AI Insight */}
            <Card variant="hero" className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-green" />
                <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO
                </span>
              </div>
              <p className="text-sm font-semibold">
                Food & Dining is $220 over budget.
              </p>
              <p className="text-xs text-text-muted mt-1">
                Last 3 months trending +14%. Consider meal planning or reducing
                dining out by 2 meals/week to save ~$180/mo.
              </p>
            </Card>
          </div>
        )}

        {/* ─── Budget Tab ───────────────────── */}
        {activeTab === "budget" && (
          <div className="animate-fade-in-up">
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Monthly Budget</p>
              <AnimatedNumber
                value={budgetTotalBudgeted}
                prefix="$"
                className="text-3xl font-bold"
              />
              <p className="text-xs text-text-muted mt-1">
                {formatCurrency(budgetTotalActual)} spent ({budgetPercent}%)
              </p>
              <div className="h-3 rounded-full bg-bg-input/50 overflow-hidden mt-3">
                <div
                  className="h-full rounded-full bg-accent-green transition-all duration-700"
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>
            </Card>

            <SectionHeader title="Categories" className="mb-3" />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50 px-4">
                {budgetCategories.map((cat) => (
                  <BudgetBar
                    key={cat.id}
                    name={cat.name}
                    budgeted={cat.budgeted}
                    actual={cat.actual}
                    icon={cat.icon}
                    color={cat.color}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ─── Forecast Tab ─────────────────── */}
        {activeTab === "forecast" && (
          <div className="animate-fade-in-up">
            <Card variant="hero" className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-accent-green" />
                <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  12-Month Projection
                </span>
              </div>
              <p className="text-text-secondary text-xs mb-4">
                Projected cash flow based on current trends.
              </p>

              <BarChart
                data={cashFlowProjection.map((m) => ({
                  label: m.month,
                  value: m.net,
                }))}
                height={140}
                barColor="bg-accent-green"
                showValues
              />
            </Card>

            {/* Projection table */}
            <SectionHeader title="Monthly Breakdown" className="mb-3" />
            <Card className="mb-6 !p-0 overflow-hidden">
              {/* Table header */}
              <div className="flex px-4 py-2 border-b border-border-primary/50 bg-bg-input/30">
                <span className="flex-1 text-[10px] font-medium text-text-muted uppercase tracking-wider">
                  Month
                </span>
                <span className="w-20 text-right text-[10px] font-medium text-text-muted uppercase tracking-wider">
                  Income
                </span>
                <span className="w-20 text-right text-[10px] font-medium text-text-muted uppercase tracking-wider">
                  Expenses
                </span>
                <span className="w-20 text-right text-[10px] font-medium text-text-muted uppercase tracking-wider">
                  Net
                </span>
              </div>
              <div className="divide-y divide-border-primary/50">
                {cashFlowProjection.map((m) => (
                  <div key={m.month} className="flex items-center px-4 py-2.5">
                    <span className="flex-1 text-xs font-medium text-text-primary">
                      {m.month}
                    </span>
                    <span className="w-20 text-right text-xs text-text-secondary">
                      ${Math.round(m.income / 1000)}k
                    </span>
                    <span className="w-20 text-right text-xs text-text-secondary">
                      ${Math.round(m.expenses / 1000)}k
                    </span>
                    <span
                      className={`w-20 text-right text-xs font-bold ${
                        m.net >= 0 ? "text-accent-green" : "text-accent-red"
                      }`}
                    >
                      +${(m.net / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals row */}
              <div className="flex items-center px-4 py-3 bg-bg-input/30 border-t border-border-primary/50">
                <span className="flex-1 text-xs font-bold text-text-primary">
                  12-Month Total
                </span>
                <span className="w-20 text-right text-xs font-bold">
                  $
                  {Math.round(
                    cashFlowProjection.reduce((s, m) => s + m.income, 0) / 1000
                  )}
                  k
                </span>
                <span className="w-20 text-right text-xs font-bold">
                  $
                  {Math.round(
                    cashFlowProjection.reduce((s, m) => s + m.expenses, 0) /
                      1000
                  )}
                  k
                </span>
                <span className="w-20 text-right text-xs font-bold text-accent-green">
                  +$
                  {(
                    cashFlowProjection.reduce((s, m) => s + m.net, 0) / 1000
                  ).toFixed(1)}
                  k
                </span>
              </div>
            </Card>

            {/* AI */}
            <Card variant="hero" className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-green" />
                <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO Forecast
                </span>
              </div>
              <p className="text-sm font-semibold">
                Projected 12-month surplus: $104k
              </p>
              <p className="text-xs text-text-muted mt-1">
                Redirect $3k/mo to investments to accelerate wealth growth by
                ~$42k (including market returns).
              </p>
            </Card>
          </div>
        )}

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border-primary safe-bottom"
          aria-label="Cash flow navigation"
        >
          <div className="max-w-lg mx-auto flex">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 min-h-[48px] py-3 flex items-center justify-center gap-2 text-xs font-medium text-accent-green focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
