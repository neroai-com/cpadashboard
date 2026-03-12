"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface MiniStatProps {
  label: string;
  value: string;
  trend?: "up" | "down";
  className?: string;
}

export default function MiniStat({
  label,
  value,
  trend,
  className = "",
}: MiniStatProps) {
  return (
    <div
      className={`bg-bg-input/50 rounded-lg p-2.5 border border-border-primary/50 ${className}`}
    >
      <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
        {label}
      </p>
      <div className="flex items-center gap-1">
        <p className="text-sm font-bold text-text-primary">{value}</p>
        {trend === "up" && (
          <TrendingUp size={12} className="text-accent-green" />
        )}
        {trend === "down" && (
          <TrendingDown size={12} className="text-accent-red" />
        )}
      </div>
    </div>
  );
}
