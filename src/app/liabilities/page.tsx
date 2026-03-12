"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/auth";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import SparklineChart from "@/components/SparklineChart";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SectionHeader from "@/components/SectionHeader";
import AccountListItem from "@/components/AccountListItem";
import ChangeBadge from "@/components/ChangeBadge";
import ObligationRow from "@/components/ObligationRow";
import ProgressBar from "@/components/ProgressBar";
import { formatCurrency } from "@/lib/utils";
import {
  netWorthSummary,
  financialAccounts,
  debtHistory,
  mortgages,
  creditCardDetails,
  loanDetails,
  upcomingObligations,
  weightedAvgRate,
  snowballOrder,
  avalancheOrder,
} from "@/lib/data";
import {
  ArrowLeft,
  CreditCard as CreditCardIcon,
  Home,
  Landmark,
  TrendingDown,
  Calendar,
  Calculator,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";

type LiabTab = "overview" | "mortgages" | "cards" | "loans" | "payoff";

const tabs: { id: LiabTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "mortgages", label: "Mortgages" },
  { id: "cards", label: "Cards" },
  { id: "loans", label: "Loans" },
  { id: "payoff", label: "Payoff" },
];

export default function LiabilitiesPage() {
  const authed = useAuthGuard();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LiabTab>("overview");
  const [timeRange, setTimeRange] = useState("1M");
  const [payoffStrategy, setPayoffStrategy] = useState<"snowball" | "avalanche">(
    "avalanche"
  );

  const { totalDebt } = netWorthSummary;
  const debtChange = netWorthSummary.debtChange;

  const creditCards = useMemo(
    () => financialAccounts.filter((a) => a.category === "credit_card"),
    []
  );
  const loans = useMemo(
    () => financialAccounts.filter((a) => a.category === "loan"),
    []
  );

  const ccTotal = creditCards.reduce((s, a) => s + a.balance, 0);
  const loanTotal = loans.reduce((s, a) => s + a.balance, 0);

  // Payoff timeline estimate (simple: total / monthly payments)
  const monthlyPayments = 2956 + 645 + 68 + 95; // all mins
  const payoffMonths = Math.ceil(totalDebt / monthlyPayments);

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
          Liabilities Hub
        </h1>

        {/* Tab bar */}
        <div
          role="tablist"
          className="flex border-b border-border-primary mb-6 animate-fade-in overflow-x-auto no-scrollbar"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
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

        {/* ─── Overview Tab ─────────────────── */}
        {activeTab === "overview" && (
          <div className="animate-fade-in-up">
            {/* Hero */}
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Total Debt</p>
              <div className="flex items-start justify-between">
                <AnimatedNumber
                  value={totalDebt}
                  prefix="$"
                  className="text-3xl font-bold"
                />
                <div className="flex items-center gap-1.5 mt-1">
                  <ChangeBadge value={debtChange} suffix="" invertColor />
                  <span className="text-xs text-text-muted">this month</span>
                </div>
              </div>

              <SparklineChart
                data={debtHistory}
                height={100}
                className="mt-3 text-accent-orange"
              />
              <TimeRangeSelector
                selected={timeRange}
                onChange={setTimeRange}
                className="mt-4"
              />
            </Card>

            {/* KPI Row */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-bg-card border border-border-primary rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Avg Rate
                </p>
                <p className="text-lg font-bold">{weightedAvgRate}%</p>
              </div>
              <div className="bg-bg-card border border-border-primary rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Monthly
                </p>
                <p className="text-lg font-bold">
                  ${monthlyPayments.toLocaleString()}
                </p>
              </div>
              <div className="bg-bg-card border border-border-primary rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Payoff
                </p>
                <p className="text-lg font-bold">
                  ~{Math.round(payoffMonths / 12)}yr
                </p>
              </div>
            </div>

            {/* Consolidated Debt List */}
            <SectionHeader title="All Debts" className="mb-3" />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50">
                {[...creditCards, ...loans].map((acct) => (
                  <AccountListItem
                    key={acct.id}
                    name={acct.name}
                    institution={acct.institution}
                    balance={acct.balance}
                    icon={acct.icon}
                    creditLimit={acct.creditLimit}
                  />
                ))}
              </div>
            </Card>

            {/* Upcoming Obligations */}
            <SectionHeader title="Upcoming Payments" className="mb-3" />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50">
                {upcomingObligations.slice(0, 4).map((obl) => (
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
            </Card>

            {/* AI Insight */}
            <Card variant="hero" className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-green" />
                <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO
                </h2>
              </div>
              <p className="text-sm font-semibold">
                Pay off Discover card first — saves $187 in interest.
              </p>
              <p className="text-xs text-text-muted mt-1">
                Redirect $200/mo extra to smallest balance for fastest wins.
              </p>
            </Card>
          </div>
        )}

        {/* ─── Mortgages Tab ─────────────────── */}
        {activeTab === "mortgages" && (
          <div className="animate-fade-in-up">
            {mortgages.map((m) => {
              const equityPercent = Math.round(
                ((m.homeValue - m.currentBalance) / m.homeValue) * 100
              );
              const paidPercent = Math.round(
                ((m.originalAmount - m.currentBalance) / m.originalAmount) * 100
              );
              const equity = m.homeValue - m.currentBalance;
              return (
                <div key={m.id}>
                  <Card variant="hero" className="mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                        <Home size={18} className="text-text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{m.property}</p>
                        <p className="text-xs text-text-muted">{m.lender}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] text-text-muted">Balance</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(m.currentBalance, { compact: true })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted">Home Value</p>
                        <p className="text-xl font-bold">
                          {formatCurrency(m.homeValue, { compact: true })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <p className="text-[10px] text-text-muted">Rate</p>
                        <p className="text-sm font-bold">{m.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted">Payment</p>
                        <p className="text-sm font-bold">
                          {formatCurrency(m.monthlyPayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted">Remaining</p>
                        <p className="text-sm font-bold">
                          {Math.round(m.remainingTerm / 12)}yr{" "}
                          {m.remainingTerm % 12}mo
                        </p>
                      </div>
                    </div>

                    {/* Equity gauge */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] text-text-muted mb-1">
                        <span>Equity build-up</span>
                        <span>
                          {formatCurrency(equity, { compact: true })} ({equityPercent}
                          %)
                        </span>
                      </div>
                      <ProgressBar
                        percent={equityPercent}
                        color="bg-accent-green"
                        height={8}
                      />
                    </div>

                    {/* Payoff progress */}
                    <div>
                      <div className="flex justify-between text-[10px] text-text-muted mb-1">
                        <span>Payoff progress</span>
                        <span>{paidPercent}% paid</span>
                      </div>
                      <ProgressBar
                        percent={paidPercent}
                        color="bg-accent-blue"
                        height={8}
                      />
                    </div>
                  </Card>

                  {/* Refinance insight */}
                  <Card className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-accent-green" />
                      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Refinance Opportunity
                      </span>
                    </div>
                    <p className="text-sm font-semibold">
                      Rates at 5.1% — projected savings $41k over life of loan.
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      New payment: ~$2,734/mo (saves $222/mo)
                    </p>
                    <button className="mt-3 w-full py-2.5 bg-accent-green/10 text-accent-green text-sm font-medium rounded-lg hover:bg-accent-green/20 transition-colors">
                      Explore Refinance Options
                    </button>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Credit Cards Tab ─────────────── */}
        {activeTab === "cards" && (
          <div className="animate-fade-in-up">
            {/* Total */}
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Total Card Balance</p>
              <AnimatedNumber
                value={ccTotal}
                prefix="$"
                className="text-3xl font-bold"
              />
              <p className="text-xs text-text-muted mt-1">
                Across {creditCardDetails.length} cards
              </p>
            </Card>

            {/* Card tiles */}
            {creditCardDetails.map((card) => {
              const utilPercent = Math.round(
                (card.balance / card.creditLimit) * 100
              );
              const utilColor =
                utilPercent < 30
                  ? "bg-accent-green"
                  : utilPercent < 50
                  ? "bg-accent-yellow"
                  : utilPercent < 75
                  ? "bg-accent-orange"
                  : "bg-accent-red";
              const utilWarn = utilPercent > 25;

              return (
                <Card key={card.id} className="mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                      <CreditCardIcon
                        size={18}
                        className="text-text-secondary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{card.name}</p>
                      <p className="text-xs text-text-muted">
                        {card.issuer} ····{card.lastFour}
                      </p>
                    </div>
                    <p className="text-sm font-bold">
                      {formatCurrency(card.balance)}
                    </p>
                  </div>

                  {/* Utilization */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-text-muted mb-1">
                      <span>
                        Utilization ({utilPercent}%)
                      </span>
                      <span>
                        Limit {formatCurrency(card.creditLimit)}
                      </span>
                    </div>
                    <ProgressBar
                      percent={utilPercent}
                      color={utilColor}
                      height={6}
                    />
                    {utilWarn && (
                      <p className="text-[10px] text-accent-yellow mt-1 flex items-center gap-1">
                        <Info size={10} />
                        Keep below 30% for best credit score impact
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-[10px] text-text-muted">APR</p>
                      <p className="text-sm font-bold">{card.apr}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Min Due</p>
                      <p className="text-sm font-bold">
                        {formatCurrency(card.minPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Rewards</p>
                      <p className="text-xs font-bold">{card.rewardsBalance}</p>
                    </div>
                  </div>

                  {/* Spending trend sparkline */}
                  <div className="pt-3 border-t border-border-primary/50">
                    <p className="text-[10px] text-text-muted mb-1">
                      6-month spending trend
                    </p>
                    <SparklineChart
                      data={card.spendingHistory.map((v) => ({ value: v }))}
                      height={40}
                      className="text-accent-orange"
                    />
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-2 bg-accent-green/10 text-accent-green text-xs font-medium rounded-lg hover:bg-accent-green/20 transition-colors">
                      Pay in Full
                    </button>
                    <button className="flex-1 py-2 bg-bg-input text-text-secondary text-xs font-medium rounded-lg hover:bg-bg-card-hover transition-colors">
                      Min Payment
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ─── Loans Tab ────────────────────── */}
        {activeTab === "loans" && (
          <div className="animate-fade-in-up">
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Total Loans</p>
              <AnimatedNumber
                value={loanTotal}
                prefix="$"
                className="text-3xl font-bold"
              />
              <p className="text-xs text-text-muted mt-1">
                Across {loanDetails.length} loans
              </p>
            </Card>

            {loanDetails.map((loan) => {
              const paidPercent = Math.round(
                ((loan.originalAmount - loan.currentBalance) /
                  loan.originalAmount) *
                  100
              );
              const typeBadge: Record<string, string> = {
                student: "bg-accent-blue/10 text-accent-blue",
                auto: "bg-accent-purple/10 text-accent-purple",
                personal: "bg-accent-green/10 text-accent-green",
                business: "bg-accent-orange/10 text-accent-orange",
              };

              return (
                <Card key={loan.id} className="mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                      <Landmark size={18} className="text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{loan.name}</p>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                            typeBadge[loan.type] || ""
                          }`}
                        >
                          {loan.type.charAt(0).toUpperCase() +
                            loan.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">{loan.lender}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-[10px] text-text-muted">Balance</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(loan.currentBalance, { compact: true })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Original</p>
                      <p className="text-xl font-bold text-text-muted">
                        {formatCurrency(loan.originalAmount, { compact: true })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-[10px] text-text-muted">Rate</p>
                      <p className="text-sm font-bold">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Payment</p>
                      <p className="text-sm font-bold">
                        {formatCurrency(loan.monthlyPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Remaining</p>
                      <p className="text-sm font-bold">
                        {Math.round(loan.remainingTerm / 12)}yr{" "}
                        {loan.remainingTerm % 12}mo
                      </p>
                    </div>
                  </div>

                  {/* Payoff progress */}
                  <div>
                    <div className="flex justify-between text-[10px] text-text-muted mb-1">
                      <span>Payoff progress</span>
                      <span>{paidPercent}% paid</span>
                    </div>
                    <ProgressBar
                      percent={paidPercent}
                      color="bg-accent-green"
                      height={6}
                    />
                  </div>

                  <p className="text-[10px] text-text-muted mt-2">
                    Next payment {loan.nextPayment}
                  </p>
                </Card>
              );
            })}
          </div>
        )}

        {/* ─── Payoff Simulator Tab ──────────── */}
        {activeTab === "payoff" && (
          <div className="animate-fade-in-up">
            <Card variant="hero" className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Calculator size={16} className="text-accent-green" />
                <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  Payoff Simulator
                </h2>
              </div>
              <p className="text-text-secondary text-xs mb-4">
                Compare strategies to pay off your debt faster.
              </p>

              {/* Strategy toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setPayoffStrategy("snowball")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    payoffStrategy === "snowball"
                      ? "bg-accent-green text-bg-primary"
                      : "bg-bg-input text-text-secondary"
                  }`}
                >
                  Snowball
                </button>
                <button
                  onClick={() => setPayoffStrategy("avalanche")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    payoffStrategy === "avalanche"
                      ? "bg-accent-green text-bg-primary"
                      : "bg-bg-input text-text-secondary"
                  }`}
                >
                  Avalanche
                </button>
              </div>

              <p className="text-xs text-text-muted mb-4">
                {payoffStrategy === "snowball"
                  ? "Pay smallest balance first for quick psychological wins."
                  : "Pay highest interest rate first to minimize total interest paid."}
              </p>

              {/* Payoff order */}
              <div className="space-y-2">
                {(payoffStrategy === "snowball"
                  ? snowballOrder
                  : avalancheOrder
                ).map((id, i) => {
                  const acct = financialAccounts.find((a) => a.id === id);
                  const loanIdMap: Record<string, string> = { "mortgage-1": "loan-1", "auto-loan-1": "loan-2" };
                  const loan = loanDetails.find((l) => l.id === (loanIdMap[id] || id));
                  const cc = creditCardDetails.find((c) => c.id === id);
                  const name = acct?.name || loan?.name || "Unknown";
                  const balance = acct?.balance || loan?.currentBalance || 0;
                  const rate = cc?.apr || loan?.interestRate || 0;

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-bg-input/50 border border-border-primary/50"
                    >
                      <div className="w-7 h-7 rounded-full bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-accent-green">
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{name}</p>
                        <p className="text-[10px] text-text-muted">
                          {rate}% APR
                        </p>
                      </div>
                      <p className="text-sm font-bold">
                        {formatCurrency(balance)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Scenario comparison */}
            <Card className="mb-6">
              <h3 className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-3">
                Scenario Comparison
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-bg-input/50 border border-border-primary/50">
                  <p className="text-[10px] text-text-muted">Snowball</p>
                  <p className="text-lg font-bold">7yr 2mo</p>
                  <p className="text-xs text-text-muted">Total interest: $142k</p>
                </div>
                <div className="p-3 rounded-lg bg-bg-input/50 border border-accent-green/30">
                  <p className="text-[10px] text-accent-green font-medium">
                    Avalanche (Best)
                  </p>
                  <p className="text-lg font-bold">6yr 10mo</p>
                  <p className="text-xs text-text-muted">Total interest: $138k</p>
                  <p className="text-[10px] text-accent-green font-medium mt-1">
                    Saves $4,200
                  </p>
                </div>
              </div>
            </Card>

            {/* Extra payment slider concept */}
            <Card className="mb-6">
              <h3 className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-2">
                Extra Payment Impact
              </h3>
              <p className="text-xs text-text-muted mb-3">
                Adding $200/mo extra to your chosen strategy:
              </p>
              <div className="p-3 rounded-lg bg-accent-green/5 border border-accent-green/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">New payoff date</span>
                  <span className="text-sm font-bold text-accent-green">
                    5yr 8mo
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Interest saved</span>
                  <span className="text-sm font-bold text-accent-green">
                    $28,400
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border-primary safe-bottom"
          aria-label="Liabilities navigation"
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
