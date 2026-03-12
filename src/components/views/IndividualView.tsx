"use client";

import Logo from "@/components/Logo";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { individualSpaces, combinedInsights } from "@/lib/data";
import {
  Wallet,
  Briefcase,
  Building,
  Shield,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

const spaceIcons: Record<string, { icon: typeof Wallet; colorClass: string; borderClass: string }> = {
  "personal-cfo": { icon: Wallet, colorClass: "text-accent-green", borderClass: "border-l-green" },
  "business-cfo": { icon: Briefcase, colorClass: "text-accent-blue", borderClass: "border-l-blue" },
  "assets-ind": { icon: Building, colorClass: "text-accent-purple", borderClass: "border-l-purple" },
  estate: { icon: Shield, colorClass: "text-accent-teal", borderClass: "border-l-teal" },
};

const insightSeverity: Record<string, { color: string; icon: typeof AlertTriangle }> = {
  "1": { color: "border-l-yellow", icon: AlertTriangle },
  "2": { color: "border-l-green", icon: DollarSign },
  "3": { color: "border-l-green", icon: DollarSign },
};

export default function IndividualView() {
  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <Logo size="sm" />
        <span className="text-xs text-text-secondary border border-border-secondary rounded-full px-3 py-1">
          Individual / Family
        </span>
      </div>

      {/* Spaces */}
      <Card className="mb-6 animate-fade-in-up delay-1">
        <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-1">
          Spaces
        </h2>
        <p className="text-text-secondary text-xs mb-4">
          Tap to go deeper into each area.
        </p>

        <div className="space-y-3">
          {individualSpaces.map((space) => {
            const meta = spaceIcons[space.id];
            const Icon = meta?.icon;
            const isEstate = space.id === "estate";

            return (
              <div
                key={space.id}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border border-border-primary text-left ${
                  meta?.borderClass || ""
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
                  {/* Estate health progress ring */}
                  {isEstate && (
                    <ProgressBar
                      percent={64}
                      color="bg-accent-teal"
                      label="Estate health"
                      showPercent
                      height={5}
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm">{space.value}</p>
                  {space.valueSub && !isEstate && (
                    <p className="text-xs text-text-muted">{space.valueSub}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Opportunities & Risks */}
      <Card className="mb-6 animate-fade-in-up delay-2">
        <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-1">
          Opportunities &amp; Risks
        </h2>
        <div className="space-y-3 mt-4">
          {combinedInsights.map((insight) => {
            const sev = insightSeverity[insight.id] || {
              color: "border-l-yellow",
              icon: AlertTriangle,
            };
            const SevIcon = sev.icon;
            return (
              <div
                key={insight.id}
                className={`flex items-start gap-3 p-3 rounded-lg border border-border-primary ${sev.color}`}
              >
                <div className="w-7 h-7 rounded-md bg-bg-input/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SevIcon size={14} className="text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <p className="text-xs text-text-muted mt-1">
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
