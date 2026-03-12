"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/auth";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import DonutChart from "@/components/DonutChart";
import SparklineChart from "@/components/SparklineChart";
import SectionHeader from "@/components/SectionHeader";
import AccountListItem from "@/components/AccountListItem";
import { formatCurrency } from "@/lib/utils";
import {
  financialAccounts,
  portfolioAllocations,
  totalPortfolio,
  portfolioPerformance,
  netWorthHistory,
} from "@/lib/data";
import {
  ArrowLeft,
  BarChart3,
  Home,
  Car,
  PiggyBank,
  TrendingUp,
  Sparkles,
  Plus,
  ChevronRight,
} from "lucide-react";

type AssetTab = "portfolio" | "accounts" | "real-estate";

const tabs: { id: AssetTab; label: string }[] = [
  { id: "portfolio", label: "Portfolio" },
  { id: "accounts", label: "Accounts" },
  { id: "real-estate", label: "Property" },
];

export default function AssetsPage() {
  const authed = useAuthGuard();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AssetTab>("portfolio");

  const cashAccounts = useMemo(
    () => financialAccounts.filter((a) => a.category === "cash"),
    []
  );
  const investAccounts = useMemo(
    () => financialAccounts.filter((a) => a.category === "investment"),
    []
  );
  const properties = useMemo(
    () => financialAccounts.filter((a) => a.type === "property"),
    []
  );
  const vehicles = useMemo(
    () => financialAccounts.filter((a) => a.type === "vehicle"),
    []
  );

  const cashTotal = cashAccounts.reduce((s, a) => s + a.balance, 0);
  const investTotal = investAccounts.reduce((s, a) => s + a.balance, 0);
  const propTotal = properties.reduce((s, a) => s + a.balance, 0);
  const vehicleTotal = vehicles.reduce((s, a) => s + a.balance, 0);

  // 12-month portfolio change
  const perfChange =
    portfolioPerformance[portfolioPerformance.length - 1].portfolio -
    portfolioPerformance[0].portfolio;
  const perfPercent = (
    (perfChange / portfolioPerformance[0].portfolio) *
    100
  ).toFixed(1);

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
          <button
            className="w-8 h-8 rounded-full bg-bg-input border border-border-secondary flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Add asset"
          >
            <Plus size={16} />
          </button>
        </div>

        <h1 className="text-lg font-bold text-center mb-4 animate-fade-in">
          Assets & Investments
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

        {/* ─── Portfolio Tab ─────────────────── */}
        {activeTab === "portfolio" && (
          <div className="animate-fade-in-up">
            {/* Hero */}
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Total Assets</p>
              <AnimatedNumber
                value={totalPortfolio}
                prefix="$"
                className="text-3xl font-bold text-glow-green"
              />
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp size={12} className="text-accent-green" />
                <span className="text-xs text-text-green font-medium">
                  +{formatCurrency(perfChange)} (+{perfPercent}%) 12mo
                </span>
              </div>

              {/* Performance sparkline */}
              <SparklineChart
                data={portfolioPerformance.map((p) => ({
                  value: p.portfolio,
                }))}
                height={80}
                className="mt-3 text-accent-green"
              />
            </Card>

            {/* Allocation donut */}
            <SectionHeader title="Allocation" className="mb-3" />
            <Card className="mb-6">
              <div className="flex items-center gap-4">
                <DonutChart
                  segments={portfolioAllocations}
                  size={140}
                  strokeWidth={16}
                  centerValue={formatCurrency(totalPortfolio, { compact: true })}
                  centerLabel="Total"
                />
                <div className="flex-1 space-y-2">
                  {portfolioAllocations.map((seg) => (
                    <div key={seg.id} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-xs text-text-secondary flex-1">
                        {seg.label}
                      </span>
                      <span className="text-xs font-medium text-text-primary">
                        {seg.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Performance vs benchmark */}
            <SectionHeader title="Performance vs S&P 500" className="mb-3" />
            <Card className="mb-6">
              <div className="relative h-[100px]">
                {/* Portfolio line */}
                <SparklineChart
                  data={portfolioPerformance.map((p) => ({
                    value: p.portfolio,
                  }))}
                  height={100}
                  className="text-accent-green absolute inset-0"
                />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
                  <span className="text-[10px] text-text-muted">
                    Your Portfolio
                  </span>
                </div>
              </div>
            </Card>

            {/* AI */}
            <Card variant="hero" className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-green" />
                <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO
                </span>
              </div>
              <p className="text-sm font-semibold">
                Portfolio is 26% real estate — consider rebalancing.
              </p>
              <p className="text-xs text-text-muted mt-1">
                With home equity at $401k, your real estate exposure is above
                target. Consider shifting future contributions to equities.
              </p>
            </Card>
          </div>
        )}

        {/* ─── Accounts Tab ─────────────────── */}
        {activeTab === "accounts" && (
          <div className="animate-fade-in-up">
            {/* Cash */}
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

            {/* Investments */}
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

            {/* Vehicles */}
            <SectionHeader
              title="Vehicles"
              total={formatCurrency(vehicleTotal)}
              className="mb-3"
            />
            <Card className="mb-6 !p-0 overflow-hidden">
              <div className="divide-y divide-border-primary/50">
                {vehicles.map((acct) => (
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
          </div>
        )}

        {/* ─── Real Estate Tab ──────────────── */}
        {activeTab === "real-estate" && (
          <div className="animate-fade-in-up">
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Property Portfolio</p>
              <AnimatedNumber
                value={propTotal}
                prefix="$"
                className="text-3xl font-bold text-glow-green"
              />
              <p className="text-xs text-text-muted mt-1">
                {properties.length} propert{properties.length !== 1 ? "ies" : "y"}
              </p>
            </Card>

            {properties.map((prop) => {
              const mortgage = financialAccounts.find(
                (a) => a.type === "mortgage"
              );
              const mortgageBalance = mortgage?.balance || 0;
              const equity = prop.balance - mortgageBalance;
              const equityPercent = Math.round(
                (equity / prop.balance) * 100
              );

              return (
                <Card key={prop.id} className="mb-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                      <Home size={18} className="text-text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{prop.name}</p>
                      <p className="text-xs text-text-muted">Primary Residence</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-text-muted">Value</p>
                      <p className="text-sm font-bold">
                        {formatCurrency(prop.balance, { compact: true })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Mortgage</p>
                      <p className="text-sm font-bold text-accent-red">
                        {formatCurrency(mortgageBalance, { compact: true })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Equity</p>
                      <p className="text-sm font-bold text-accent-green">
                        {formatCurrency(equity, { compact: true })}
                      </p>
                    </div>
                  </div>

                  {/* Equity bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-text-muted mb-1">
                      <span>Equity position</span>
                      <span>{equityPercent}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-bg-input/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent-green transition-all duration-700"
                        style={{ width: `${equityPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border-primary/50">
                    <button className="flex items-center gap-1 text-xs font-medium text-accent-green hover:text-accent-green-dark transition-colors">
                      View Mortgage Details
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </Card>
              );
            })}

            {/* AI */}
            <Card variant="hero" className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-green" />
                <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO
                </span>
              </div>
              <p className="text-sm font-semibold">
                Home may be over-assessed by ~$28k.
              </p>
              <p className="text-xs text-text-muted mt-1">
                Filing a protest could save ~$3,200/yr in property tax.
              </p>
            </Card>
          </div>
        )}

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border-primary safe-bottom"
          aria-label="Assets navigation"
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
