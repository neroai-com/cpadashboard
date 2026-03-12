"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import Pill from "@/components/Pill";
import MiniStat from "@/components/MiniStat";
import { entities, Entity, businessStats } from "@/lib/data";
import { Sparkles, SearchX } from "lucide-react";

const filterOptions = [
  "All",
  "Operating",
  "Holding / SPV",
  "Real Estate",
  "Archived",
];

const entityTypeBorder: Record<string, string> = {
  Operating: "border-l-green",
  "Holding / SPV": "border-l-blue",
  "Real Estate": "border-l-orange",
};

const entityTypeDot: Record<string, string> = {
  Operating: "bg-accent-green",
  "Holding / SPV": "bg-accent-blue",
  "Real Estate": "bg-accent-orange",
};

export default function BusinessView() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? entities
        : entities.filter((e) => e.type === activeFilter),
    [activeFilter]
  );

  const entityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of entities) {
      const key = e.type.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, []);

  const summary = Object.entries(entityCounts)
    .map(([type, count]) => `${count} ${type}`)
    .join(" \u00B7 ");

  function handleEntityClick(entity: Entity) {
    router.push(`/entity/${entity.id}`);
  }

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <Logo size="sm" />
        <span className="text-xs text-text-secondary border border-border-secondary rounded-full px-3 py-1">
          Business portfolio
        </span>
      </div>

      {/* Summary */}
      <div className="animate-fade-in-up delay-1">
        <h1 className="text-2xl font-bold mb-1">
          {entities.length} business{entities.length !== 1 ? "es" : ""}
        </h1>
        <p className="text-text-secondary text-sm mb-4">{summary}</p>
      </div>

      {/* Monthly Summary — Mini Stats Grid */}
      <Card variant="glass" className="mb-6 animate-fade-in-up delay-2">
        <p className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-3">
          This month
        </p>
        <div className="grid grid-cols-3 gap-2">
          <MiniStat label="Revenue" value={businessStats.revenue} trend="up" />
          <MiniStat label="Net Profit" value={businessStats.netProfit} trend="up" />
          <MiniStat label="Cash" value={businessStats.cash} />
          <MiniStat label="AR" value={businessStats.ar} />
          <MiniStat label="AP" value={businessStats.ap} />
          <MiniStat label="Margin" value={businessStats.margin} trend="up" />
        </div>
      </Card>

      {/* Entities */}
      <Card className="mb-6 animate-fade-in-up delay-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
            Entities
          </h2>
          <button
            aria-label="Expand entities view"
            className="text-text-muted hover:text-text-secondary transition-colors p-1"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h6v6" />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
          </button>
        </div>
        <p className="text-text-secondary text-xs mb-4">
          Filter and tap to go to a specific entity.
        </p>

        {/* Filter pills */}
        <div
          className="flex flex-wrap gap-2 mb-4"
          role="group"
          aria-label="Entity type filter"
        >
          {filterOptions.map((f) => (
            <Pill
              key={f}
              label={f}
              active={activeFilter === f}
              onClick={() => setActiveFilter(f)}
            />
          ))}
        </div>

        {/* Entity list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-8 text-text-muted">
              <SearchX size={32} strokeWidth={1.5} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">No entities match this filter.</p>
              <p className="text-xs mt-1">Try selecting a different category.</p>
            </div>
          )}
          {filtered.map((entity) => (
            <button
              key={entity.id}
              onClick={() => handleEntityClick(entity)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border border-border-primary hover:bg-bg-card-hover transition-all text-left focus-visible:ring-2 focus-visible:ring-accent-green outline-none ${
                entityTypeBorder[entity.type] || ""
              }`}
            >
              <div>
                <p className="font-semibold text-sm">{entity.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      entityTypeDot[entity.type] || "bg-text-muted"
                    }`}
                  />
                  <p className="text-xs text-text-muted">{entity.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{entity.equity}</p>
                <p className="text-xs text-text-muted">Equity</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-text-muted mt-4">
          Use search &amp; filters (in app) to manage portfolios with tens or
          hundreds of LLCs.
        </p>
      </Card>

      {/* AI CFO Entities */}
      <Card variant="hero" className="mb-6 animate-fade-in-up delay-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-accent-green" />
          <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
            AI CFO &middot; Entities
          </h2>
        </div>
        <p className="text-text-secondary text-xs mb-3">
          Cross-entity structure, risk, and savings opportunities.
        </p>
        <div className="p-3 rounded-lg border border-border-primary/50">
          <p className="text-sm font-semibold">
            Consolidate 2 overlapping holding companies.
          </p>
          <p className="text-xs text-text-muted">
            Potential annual savings ~$12k in entity maintenance.
          </p>
        </div>
      </Card>
    </div>
  );
}
