"use client";

import {
  Shield,
  Home,
  Car,
  Heart,
  Briefcase,
  Umbrella,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  home: Home,
  car: Car,
  heart: Heart,
  briefcase: Briefcase,
  umbrella: Umbrella,
};

const statusStyles: Record<string, string> = {
  active: "bg-accent-green/10 text-accent-green",
  expiring: "bg-accent-yellow/10 text-accent-yellow",
  lapsed: "bg-accent-red/10 text-accent-red",
};

interface PolicyCardProps {
  type: string;
  name: string;
  provider: string;
  premium: number;
  coverageAmount: number;
  deductible: number;
  renewalDate: string;
  status: "active" | "expiring" | "lapsed";
  icon: string;
  className?: string;
}

export default function PolicyCard({
  name,
  provider,
  premium,
  coverageAmount,
  deductible,
  renewalDate,
  status,
  icon,
  className = "",
}: PolicyCardProps) {
  const Icon = iconMap[icon] || Shield;

  return (
    <div
      className={`bg-bg-card border border-border-primary rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary">{name}</p>
          <p className="text-xs text-text-muted">{provider}</p>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-text-muted">Premium</p>
          <p className="text-sm font-bold">{formatCurrency(premium)}/mo</p>
        </div>
        <div>
          <p className="text-[10px] text-text-muted">Coverage</p>
          <p className="text-sm font-bold">
            {formatCurrency(coverageAmount, { compact: true })}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-text-muted">Deductible</p>
          <p className="text-sm font-bold">
            {deductible > 0 ? formatCurrency(deductible) : "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border-primary/50 flex items-center justify-between">
        <span className="text-[10px] text-text-muted">
          Renews {renewalDate}
        </span>
        <button className="text-[10px] font-medium text-accent-green hover:text-accent-green-dark transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
