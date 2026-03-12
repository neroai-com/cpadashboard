"use client";

import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import SparklineChart from "@/components/SparklineChart";
import KPICard from "@/components/KPICard";
import SectionHeader from "@/components/SectionHeader";
import ObligationRow from "@/components/ObligationRow";
import type { Tab } from "@/lib/types";
import {
  combinedSpaces,
  combinedInsights,
  combinedNetWorthHistory,
  financialAccounts,
  combinedNetWorth,
  personalNetWorth,
  businessEquity,
  otherEstateValue,
  monthlyCashflow,
  dashboardKPIs,
  upcomingObligations,
} from "@/lib/data";
import { getGreeting, formatCurrency } from "@/lib/utils";
import {
  Briefcase,
  Home,
  Building2,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Landmark,
  CreditCard,
  Wallet,
  PiggyBank,
  BarChart3,
  Shield,
  Receipt,
  PieChart,
  type LucideIcon,
} from "lucide-react";

interface CombinedViewProps {
  onNavigate: (tab: Tab) => void;
}

const spaceNavMap: Record<string, Tab | null> = {
  business: "business",
  individual: "individual",
  assets: null,
};

const spaceIcons: Record<string, { icon: typeof Briefcase; colorClass: string; borderClass: string }> = {
  business: { icon: Briefcase, colorClass: "text-accent-green", borderClass: "border-l-green" },
  individual: { icon: Home, colorClass: "text-accent-blue", borderClass: "border-l-blue" },
  assets: { icon: Building2, colorClass: "text-accent-purple", borderClass: "border-l-purple" },
};

const insightSeverity: Record<string, { dot: string; icon: typeof TrendingUp }> = {
  "1": { dot: "bg-accent-yellow", icon: AlertTriangle },
  "2": { dot: "bg-accent-green", icon: DollarSign },
  "3": { dot: "bg-accent-green", icon: DollarSign },
};

// Aggregate account summaries for dashboard — computed from account data
const checkingTotal = financialAccounts
  .filter((a) => a.type === "checking")
  .reduce((s, a) => s + a.balance, 0);
const savingsTotal = financialAccounts
  .filter((a) => a.type === "savings")
  .reduce((s, a) => s + a.balance, 0);
const investTotal = financialAccounts
  .filter((a) => a.category === "investment")
  .reduce((s, a) => s + a.balance, 0);
const ccTotal = financialAccounts
  .filter((a) => a.category === "credit_card")
  .reduce((s, a) => s + a.balance, 0);
const netCash = checkingTotal + savingsTotal - ccTotal;

const accountSummary = [
  { label: "Checking", value: checkingTotal, icon: Landmark },
  { label: "Savings", value: savingsTotal, icon: PiggyBank },
  { label: "Investments", value: investTotal, icon: BarChart3 },
  { label: "Card Balance", value: ccTotal, icon: CreditCard },
  { label: "Net Cash", value: netCash, icon: Wallet },
];

// Combined 12-month change: last − first in history
const combined12moChange =
  combinedNetWorthHistory[combinedNetWorthHistory.length - 1].value -
  combinedNetWorthHistory[0].value;

// Quick-access pages
const quickPages: { label: string; path: string; icon: LucideIcon; color: string; description: string }[] = [
  { label: "Net Worth", path: "/networth", icon: BarChart3, color: "text-accent-green", description: "Assets, debt, trends" },
  { label: "Liabilities", path: "/liabilities", icon: CreditCard, color: "text-accent-orange", description: "Debt, mortgages, cards" },
  { label: "Cash Flow", path: "/cashflow", icon: Receipt, color: "text-accent-blue", description: "Budget, income, forecast" },
  { label: "Assets", path: "/assets", icon: PieChart, color: "text-accent-purple", description: "Portfolio, property" },
  { label: "Insurance", path: "/insurance", icon: Shield, color: "text-accent-teal", description: "Policies, coverage" },
];

export default function CombinedView({ onNavigate }: CombinedViewProps) {
  const router = useRouter();
  const greeting = getGreeting();

  const { income, spending, net, business, individual } = monthlyCashflow;
  const incomePercent = (income / (income + spending)) * 100;

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <Logo size="sm" />
        <span className="text-xs text-text-secondary border border-border-secondary rounded-full px-3 py-1">
          Combined view
        </span>
      </div>

      {/* Greeting */}
      <div className="animate-fade-in-up delay-1">
        <h1 className="text-2xl font-bold mb-1">{greeting}, Muhammad.</h1>
        <p className="text-text-secondary text-sm mb-5">
          Your single source of truth across personal, business, and family.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-2 mb-4 animate-fade-in-up delay-2">
        {dashboardKPIs.map((kpi) => (
          <KPICard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            subValue={kpi.subValue}
            trend={kpi.trend}
            trendValue={kpi.trendValue}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Hero Net Worth Card */}
      <Card variant="hero" className="mb-4 animate-fade-in-up delay-3">
        <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-3">
          Combined Overview
        </h2>

        <p className="text-xs text-text-muted">Total net worth</p>
        <div className="flex items-baseline gap-1">
          <AnimatedNumber
            value={combinedNetWorth}
            prefix="$"
            className="text-3xl font-bold text-glow-green"
          />
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <ArrowUpRight size={14} className="text-text-green" />
          <p className="text-xs text-text-green font-medium">
            + {formatCurrency(combined12moChange)} vs last 12 months
          </p>
        </div>

        {/* Sparkline chart — combined history */}
        <SparklineChart
          data={combinedNetWorthHistory}
          height={80}
          className="mt-3 text-accent-green"
        />

        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <p className="text-xs text-text-muted mb-2">Breakdown</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-text-muted">Personal</p>
              <p className="text-sm font-bold">
                {formatCurrency(personalNetWorth, { compact: true })}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Business</p>
              <p className="text-sm font-bold">
                {formatCurrency(businessEquity, { compact: true })}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Other</p>
              <p className="text-sm font-bold">
                {formatCurrency(otherEstateValue, { compact: true })}
              </p>
            </div>
          </div>
        </div>

        {/* View Net Worth link */}
        <button
          onClick={() => router.push("/networth")}
          className="w-full flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] text-left focus-visible:ring-2 focus-visible:ring-accent-green outline-none rounded"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-bg-input/80 flex items-center justify-center">
              <BarChart3 size={16} className="text-text-secondary" />
            </div>
            <span className="text-sm font-medium text-text-primary">
              View Net Worth
            </span>
          </div>
          <ChevronRight size={16} className="text-text-muted" />
        </button>
      </Card>

      {/* Upcoming Obligations */}
      <SectionHeader
        title="Upcoming Payments"
        total={`${upcomingObligations.length} due`}
        className="mb-2 animate-fade-in-up delay-4"
      />
      <Card className="mb-4 !p-0 overflow-hidden animate-fade-in-up delay-4">
        <div className="divide-y divide-border-primary/50">
          {upcomingObligations.slice(0, 3).map((obl) => (
            <ObligationRow
              key={obl.id}
              label={obl.label}
              amount={obl.amount}
              dueDate={obl.dueDate}
              daysUntil={obl.daysUntil}
              entity={obl.entity}
              type={obl.type}
              autoPay={obl.autoPay}
            />
          ))}
        </div>
        <button
          onClick={() => router.push("/liabilities")}
          className="w-full py-2.5 text-xs font-medium text-accent-green hover:bg-bg-card-hover transition-colors border-t border-border-primary/50"
        >
          View all obligations
        </button>
      </Card>

      {/* Cashflow This Month */}
      <Card variant="glass" className="mb-4 animate-fade-in-up delay-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
            Cashflow This Month
          </h2>
          <button
            onClick={() => router.push("/cashflow")}
            className="text-[10px] font-medium text-accent-green hover:text-accent-green-dark transition-colors flex items-center gap-0.5"
          >
            Details <ChevronRight size={10} />
          </button>
        </div>
        <p className="text-text-secondary text-xs mb-4">
          Where money is coming from and going.
        </p>

        <p className="text-xs text-text-muted">Combined</p>
        <AnimatedNumber
          value={net}
          prefix="+ $"
          className="text-2xl font-bold text-text-green"
        />

        {/* Income vs Spending bar */}
        <div className="mt-3 mb-1">
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>Income {formatCurrency(income)}</span>
            <span>Spending {formatCurrency(spending)}</span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden">
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

        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <p className="text-xs text-text-muted mb-2">By space</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-l-green pl-3">
              <p className="text-xs text-text-secondary">Business</p>
              <p className="text-xl font-bold">+ {formatCurrency(business)}</p>
              <p className="text-xs text-text-muted">
                Net income across entities
              </p>
            </div>
            <div className="border-l-blue pl-3">
              <p className="text-xs text-text-secondary">
                Individual / family
              </p>
              <p className="text-xl font-bold text-text-green">+ {formatCurrency(individual)}</p>
              <p className="text-xs text-text-muted">
                Household after expenses
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Accounts summary */}
      <SectionHeader
        title="Accounts"
        total="Add Account"
        className="mb-2 animate-fade-in-up delay-5"
      />
      <Card className="mb-4 !p-0 overflow-hidden animate-fade-in-up delay-5">
        <div className="divide-y divide-border-primary/50">
          {accountSummary.map((acct) => {
            const Icon = acct.icon;
            const isNeg = acct.value < 0;
            return (
              <div
                key={acct.label}
                className="flex items-center gap-3 py-3 px-4"
              >
                <div className="w-9 h-9 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-text-secondary" />
                </div>
                <span className="flex-1 text-sm font-medium">{acct.label}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm font-bold ${
                      isNeg ? "text-accent-red" : "text-text-primary"
                    }`}
                  >
                    {formatCurrency(acct.value)}
                  </span>
                  <ChevronRight size={14} className="text-text-muted" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Access — All Spaces/Pages */}
      <SectionHeader
        title="Explore"
        className="mb-2 animate-fade-in-up delay-6"
      />
      <Card className="mb-4 !p-0 overflow-hidden animate-fade-in-up delay-6">
        <div className="divide-y divide-border-primary/50">
          {quickPages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.path}
                onClick={() => router.push(page.path)}
                className="w-full flex items-center gap-3 py-3.5 px-4 text-left hover:bg-bg-card-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none"
              >
                <div className={`w-9 h-9 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0 ${page.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{page.label}</p>
                  <p className="text-[10px] text-text-muted">{page.description}</p>
                </div>
                <ChevronRight size={14} className="text-text-muted flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </Card>

      {/* Spaces */}
      <Card className="mb-4 animate-fade-in-up delay-6">
        <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-1">
          Spaces
        </h2>
        <p className="text-text-secondary text-xs mb-4">
          Jump into a specific area of your finances.
        </p>

        <div className="space-y-3">
          {combinedSpaces.map((space) => {
            const navTarget = spaceNavMap[space.id];
            const meta = spaceIcons[space.id];
            const Icon = meta?.icon;
            return (
              <button
                key={space.id}
                onClick={navTarget ? () => onNavigate(navTarget) : undefined}
                disabled={!navTarget}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border border-border-primary transition-all text-left focus-visible:ring-2 focus-visible:ring-accent-green outline-none ${
                  meta?.borderClass || ""
                } ${
                  navTarget
                    ? "hover:bg-bg-card-hover cursor-pointer"
                    : "opacity-70 cursor-default"
                }`}
              >
                {Icon && (
                  <div
                    className={`w-9 h-9 rounded-lg bg-bg-input/80 flex items-center justify-center flex-shrink-0 ${meta.colorClass}`}
                  >
                    <Icon size={18} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{space.name}</p>
                  <p className="text-xs text-text-muted">{space.description}</p>
                </div>
                <p className="font-bold text-sm flex-shrink-0">{space.value}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* AI CFO Insights */}
      <Card className="mb-6 animate-fade-in-up delay-7">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-accent-green" />
          <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
            AI CFO Insights
          </h2>
        </div>
        <p className="text-text-secondary text-xs mb-4">
          Top opportunities and risks across everything.
        </p>

        <p className="text-xs text-text-muted mb-3">
          Today&apos;s highlights
        </p>
        <div className="space-y-3">
          {combinedInsights.map((insight) => {
            const sev = insightSeverity[insight.id] || {
              dot: "bg-accent-yellow",
              icon: AlertTriangle,
            };
            const SevIcon = sev.icon;
            return (
              <div
                key={insight.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border-primary/50 hover:border-border-primary transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-bg-input/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SevIcon size={14} className="text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${sev.dot} flex-shrink-0`}
                    />
                    <p className="text-sm font-semibold">{insight.title}</p>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 ml-3.5">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
