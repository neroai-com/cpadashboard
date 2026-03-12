"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import AnimatedNumber from "@/components/AnimatedNumber";
import DonutChart from "@/components/DonutChart";
import PolicyCard from "@/components/PolicyCard";
import SectionHeader from "@/components/SectionHeader";
import { formatCurrency } from "@/lib/utils";
import {
  insurancePolicies,
  totalMonthlyPremiums,
  totalCoverage,
  insuranceInsights,
  combinedNetWorth,
} from "@/lib/data";
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Sparkles,
  DollarSign,
  Filter,
} from "lucide-react";

type InsTab = "policies" | "coverage" | "claims";

const tabs: { id: InsTab; label: string }[] = [
  { id: "policies", label: "Policies" },
  { id: "coverage", label: "Coverage" },
  { id: "claims", label: "Claims" },
];

const typeFilters = ["All", "Life", "Home", "Auto", "Health", "Business"];

export default function InsurancePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InsTab>("policies");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? insurancePolicies
        : insurancePolicies.filter(
            (p) => p.type.toLowerCase() === activeFilter.toLowerCase()
          ),
    [activeFilter]
  );

  const activeCount = insurancePolicies.filter(
    (p) => p.status === "active"
  ).length;
  const expiringCount = insurancePolicies.filter(
    (p) => p.status === "expiring"
  ).length;

  // Coverage by type for donut
  const coverageByType = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of insurancePolicies) {
      map[p.type] = (map[p.type] || 0) + p.coverageAmount;
    }
    const colors: Record<string, string> = {
      life: "#22c55e",
      home: "#3b82f6",
      auto: "#a855f7",
      health: "#14b8a6",
      business: "#f97316",
      umbrella: "#eab308",
    };
    const total = Object.values(map).reduce((s, v) => s + v, 0);
    return Object.entries(map).map(([type, val]) => ({
      id: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: val,
      percent: Math.round((val / total) * 100),
      color: colors[type] || "#64748b",
    }));
  }, []);

  // Coverage gap analysis
  const netWorthCoverageRatio = Math.round(
    (totalCoverage / combinedNetWorth) * 100
  );

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
          Insurance
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

        {/* ─── Policies Tab ─────────────────── */}
        {activeTab === "policies" && (
          <div className="animate-fade-in-up">
            {/* KPI Row */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-bg-card border border-border-primary rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Policies
                </p>
                <p className="text-lg font-bold">
                  {insurancePolicies.length}
                </p>
              </div>
              <div className="bg-bg-card border border-border-primary rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Monthly
                </p>
                <p className="text-lg font-bold">
                  ${totalMonthlyPremiums.toLocaleString()}
                </p>
              </div>
              <div className="bg-bg-card border border-border-primary rounded-xl p-3 text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Annual
                </p>
                <p className="text-lg font-bold">
                  ${(totalMonthlyPremiums * 12).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Expiring warning */}
            {expiringCount > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent-yellow/5 border border-accent-yellow/20 mb-4">
                <AlertTriangle size={16} className="text-accent-yellow flex-shrink-0" />
                <p className="text-xs text-text-secondary">
                  <span className="font-medium">{expiringCount} polic{expiringCount !== 1 ? "ies" : "y"}</span> expiring soon — review and renew.
                </p>
              </div>
            )}

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Policy type filter">
              {typeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === f
                      ? "bg-accent-green/10 text-accent-green border border-accent-green/30"
                      : "bg-bg-input text-text-muted border border-border-primary/50 hover:text-text-secondary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Policy cards */}
            <div className="space-y-3">
              {filtered.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  type={policy.type}
                  name={policy.name}
                  provider={policy.provider}
                  premium={policy.premium}
                  coverageAmount={policy.coverageAmount}
                  deductible={policy.deductible}
                  renewalDate={policy.renewalDate}
                  status={policy.status}
                  icon={policy.icon}
                />
              ))}
            </div>

            {/* AI */}
            <Card variant="hero" className="mt-6 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-green" />
                <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO
                </span>
              </div>
              {insuranceInsights.map((tip) => (
                <div key={tip.id} className="mt-2">
                  <p className="text-sm font-semibold">{tip.title}</p>
                  <p className="text-xs text-text-muted">{tip.description}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ─── Coverage Tab ─────────────────── */}
        {activeTab === "coverage" && (
          <div className="animate-fade-in-up">
            <Card variant="hero" className="mb-6">
              <p className="text-xs text-text-muted mb-1">Total Coverage</p>
              <AnimatedNumber
                value={totalCoverage}
                prefix="$"
                className="text-3xl font-bold text-glow-green"
              />
              <p className="text-xs text-text-muted mt-1">
                Across {insurancePolicies.length} policies
              </p>
            </Card>

            {/* Coverage donut */}
            <SectionHeader title="Coverage by Type" className="mb-3" />
            <Card className="mb-6">
              <div className="flex items-center gap-4">
                <DonutChart
                  segments={coverageByType}
                  size={140}
                  strokeWidth={16}
                  centerValue={formatCurrency(totalCoverage, { compact: true })}
                  centerLabel="Total"
                />
                <div className="flex-1 space-y-2">
                  {coverageByType.map((seg) => (
                    <div key={seg.id} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-xs text-text-secondary flex-1">
                        {seg.label}
                      </span>
                      <span className="text-xs font-medium text-text-primary">
                        {formatCurrency(seg.value, { compact: true })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Coverage gap analysis */}
            <SectionHeader title="Coverage Gap Analysis" className="mb-3" />
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium">Coverage-to-Net-Worth Ratio</p>
                  <p className="text-xs text-text-muted">
                    Total coverage vs combined net worth
                  </p>
                </div>
                <p className="text-xl font-bold text-accent-green">
                  {netWorthCoverageRatio}%
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-green/5 border border-accent-green/20">
                  <Shield size={14} className="text-accent-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Life insurance</p>
                    <p className="text-xs text-text-muted">
                      $1M coverage — adequate for current net worth.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent-yellow/5 border border-accent-yellow/20">
                  <AlertTriangle size={14} className="text-accent-yellow mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">No umbrella policy</p>
                    <p className="text-xs text-text-muted">
                      With $2.85M net worth, consider $1M umbrella (~$12/mo).
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-4 w-full py-2.5 bg-accent-green/10 text-accent-green text-sm font-medium rounded-lg hover:bg-accent-green/20 transition-colors">
                Shop Better Rates
              </button>
            </Card>
          </div>
        )}

        {/* ─── Claims Tab ───────────────────── */}
        {activeTab === "claims" && (
          <div className="animate-fade-in-up">
            <Card className="mb-6">
              <div className="flex flex-col items-center py-8 text-text-muted">
                <Shield size={40} strokeWidth={1.5} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">No claims filed</p>
                <p className="text-xs mt-1">
                  Claims history will appear here when available.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border-primary safe-bottom"
          aria-label="Insurance navigation"
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
