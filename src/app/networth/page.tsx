"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import SparklineChart from "@/components/SparklineChart";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import SectionHeader from "@/components/SectionHeader";
import AccountListItem from "@/components/AccountListItem";
import ChangeBadge from "@/components/ChangeBadge";
import ToggleSwitch from "@/components/ToggleSwitch";
import Accordion from "@/components/Accordion";
import { formatCurrency } from "@/lib/utils";
import {
  netWorthSummary,
  financialAccounts,
  netWorthFAQs,
  debtHistory,
} from "@/lib/data";
import {
  ArrowLeft,
  Settings,
  Plus,
  Banknote,
  CreditCard as CreditCardIcon,
  Info,
  ChevronRight,
} from "lucide-react";

type NWTab = "summary" | "assets" | "debt";

const tabs: { id: NWTab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "assets", label: "Assets" },
  { id: "debt", label: "Debt" },
];

export default function NetWorthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NWTab>("summary");
  const [timeRange, setTimeRange] = useState("1M");
  const [includeHomes, setIncludeHomes] = useState(true);

  const {
    totalAssets,
    totalDebt,
    netWorth,
    changeAmount,
    assetChange,
    debtChange,
    debtChangePercent,
    history,
  } = netWorthSummary;

  const cashAccounts = useMemo(
    () => financialAccounts.filter((a) => a.category === "cash"),
    []
  );
  const investAccounts = useMemo(
    () => financialAccounts.filter((a) => a.category === "investment"),
    []
  );
  const otherAssets = useMemo(
    () => financialAccounts.filter((a) => a.category === "other_asset"),
    []
  );
  const creditCards = useMemo(
    () => financialAccounts.filter((a) => a.category === "credit_card"),
    []
  );
  const loanAccounts = useMemo(
    () => financialAccounts.filter((a) => a.category === "loan"),
    []
  );

  const cashTotal = cashAccounts.reduce((s, a) => s + a.balance, 0);
  const investTotal = investAccounts.reduce((s, a) => s + a.balance, 0);
  const otherTotal = otherAssets.reduce((s, a) => s + a.balance, 0);
  const ccTotal = creditCards.reduce((s, a) => s + a.balance, 0);
  const loanTotal = loanAccounts.reduce((s, a) => s + a.balance, 0);

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
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-full bg-bg-input border border-border-secondary flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              className="w-8 h-8 rounded-full bg-bg-input border border-border-secondary flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Add account"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Page title */}
        <h1 className="text-lg font-bold text-center mb-4 animate-fade-in">
          Net Worth
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
                  isActive ? "text-accent-green" : "text-text-muted hover:text-text-secondary"
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

        {/* ─── Summary Tab ─────────────────── */}
        {activeTab === "summary" && (
          <div className="animate-fade-in-up">
            {/* Chart card */}
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Net Worth</p>
              <div className="flex items-start justify-between">
                <AnimatedNumber
                  value={netWorth}
                  prefix="$"
                  className="text-3xl font-bold text-glow-green"
                />
                <div className="flex items-center gap-1.5 mt-1">
                  <ChangeBadge value={changeAmount} suffix="" />
                  <span className="text-xs text-text-muted">this month</span>
                </div>
              </div>

              <SparklineChart
                data={history}
                height={100}
                className="mt-3 text-accent-green"
              />

              <TimeRangeSelector
                selected={timeRange}
                onChange={setTimeRange}
                className="mt-4"
              />
            </Card>

            {/* Summary breakdown */}
            <SectionHeader title="Summary" className="mb-3" />

            <Card className="mb-6 !p-0 overflow-hidden">
              {/* Assets row */}
              <div className="flex items-center gap-3 py-3.5 px-4 border-b border-border-primary/50">
                <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                  <Banknote size={18} className="text-text-secondary" />
                </div>
                <span className="flex-1 text-sm font-medium">Assets</span>
                <span className="text-sm font-bold">
                  {formatCurrency(totalAssets, { compact: true })}
                </span>
              </div>
              {/* Debt row */}
              <div className="flex items-center gap-3 py-3.5 px-4 border-b border-border-primary/50">
                <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                  <CreditCardIcon size={18} className="text-text-secondary" />
                </div>
                <span className="flex-1 text-sm font-medium">Debt</span>
                <div className="flex items-center gap-2">
                  <ChangeBadge
                    value={debtChangePercent}
                    suffix="%"
                    invertColor
                  />
                  <span className="text-sm font-bold">
                    {formatCurrency(totalDebt, { compact: true })}
                  </span>
                </div>
              </div>
              {/* Net Worth row */}
              <div className="flex items-center gap-3 py-3.5 px-4">
                <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                  <Banknote size={18} className="text-accent-green" />
                </div>
                <span className="flex-1 text-sm font-medium">Net Worth</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-text-green">
                    {formatCurrency(netWorth, { compact: true })}
                  </span>
                  <Info size={14} className="text-text-muted" />
                </div>
              </div>
            </Card>

            {/* Include homes toggle */}
            <ToggleSwitch
              label="Include homes in Net Worth"
              checked={includeHomes}
              onChange={setIncludeHomes}
              showInfo
              className="mb-6"
            />
          </div>
        )}

        {/* ─── Assets Tab ──────────────────── */}
        {activeTab === "assets" && (
          <div className="animate-fade-in-up">
            {/* Chart card */}
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Total Assets</p>
              <div className="flex items-start justify-between">
                <AnimatedNumber
                  value={totalAssets}
                  prefix="$"
                  className="text-3xl font-bold text-glow-green"
                />
                <div className="flex items-center gap-1.5 mt-1">
                  <ChangeBadge value={assetChange} suffix="" />
                  <span className="text-xs text-text-muted">this month</span>
                </div>
              </div>

              <SparklineChart
                data={history.map((h, i) => ({
                  value: h.value + debtHistory[i].value,
                }))}
                height={100}
                className="mt-3 text-accent-green"
              />

              <TimeRangeSelector
                selected={timeRange}
                onChange={setTimeRange}
                className="mt-4"
              />
            </Card>

            {/* Cash section */}
            <SectionHeader
              title="Cash"
              total={formatCurrency(cashTotal)}
              className="mb-3"
            />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50">
                {cashAccounts.map((acct) => (
                  <AccountListItem
                    key={acct.id}
                    name={acct.name}
                    institution={acct.institution}
                    balance={acct.balance}
                    icon={acct.icon}
                    showChevron
                  />
                ))}
              </div>
            </Card>

            {/* Investments section */}
            <SectionHeader
              title="Investments"
              total={formatCurrency(investTotal)}
              className="mb-3"
            />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50">
                {investAccounts.map((acct) => (
                  <AccountListItem
                    key={acct.id}
                    name={acct.name}
                    institution={acct.institution}
                    balance={acct.balance}
                    icon={acct.icon}
                    showChevron
                  />
                ))}
              </div>
            </Card>

            {/* Other assets section */}
            <SectionHeader
              title="Other Assets"
              total={formatCurrency(otherTotal)}
              className="mb-3"
            />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50">
                {otherAssets.map((acct) => (
                  <AccountListItem
                    key={acct.id}
                    name={acct.name}
                    institution={acct.institution || undefined}
                    balance={acct.balance}
                    icon={acct.icon}
                  />
                ))}
              </div>
            </Card>

            {/* FAQ */}
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="flex items-center gap-3 py-3.5 px-4 border-b border-border-primary/50">
                <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                  <Info size={18} className="text-text-secondary" />
                </div>
                <span className="text-sm font-medium">
                  Frequently Asked Questions
                </span>
              </div>
              <div className="px-3">
                <Accordion
                  items={netWorthFAQs.map((f) => ({
                    id: f.id,
                    title: f.question,
                    content: f.answer,
                  }))}
                />
              </div>
            </Card>
          </div>
        )}

        {/* ─── Debt Tab ────────────────────── */}
        {activeTab === "debt" && (
          <div className="animate-fade-in-up">
            {/* Chart card */}
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

            {/* Credit cards section */}
            <SectionHeader
              title="Credit Cards"
              total={formatCurrency(ccTotal)}
              className="mb-3"
            />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50">
                {creditCards.map((acct) => (
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

            {/* Loans section */}
            <SectionHeader
              title="Loans"
              total={formatCurrency(loanTotal)}
              className="mb-3"
            />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50">
                {loanAccounts.map((acct) => (
                  <AccountListItem
                    key={acct.id}
                    name={acct.name}
                    institution={acct.institution}
                    balance={acct.balance}
                    icon={acct.icon}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border-primary safe-bottom"
          aria-label="Net worth navigation"
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
