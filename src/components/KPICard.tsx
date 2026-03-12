"use client";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Flame,
  Percent,
  Minus,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  wallet: Wallet,
  flame: Flame,
  percent: Percent,
};

interface KPICardProps {
  label: string;
  value: string;
  subValue: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: string;
  className?: string;
}

export default function KPICard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon,
  className = "",
}: KPICardProps) {
  const Icon = iconMap[icon] || TrendingUp;
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-accent-green"
      : trend === "down"
      ? "text-accent-green" // down debt-to-income is good
      : "text-text-muted";

  return (
    <div
      className={`bg-bg-card border border-border-primary rounded-xl p-3 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-bg-input/80 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-text-secondary" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
          {label}
        </span>
      </div>
      <p className="text-xl font-bold text-text-primary mb-0.5">{value}</p>
      <div className="flex items-center gap-1">
        <TrendIcon size={10} className={trendColor} />
        <span className={`text-[10px] font-medium ${trendColor}`}>
          {trendValue}
        </span>
      </div>
      <p className="text-[10px] text-text-muted mt-1">{subValue}</p>
    </div>
  );
}
