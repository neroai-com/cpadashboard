"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

interface ChangeBadgeProps {
  /** The change value — negative means decrease, positive means increase */
  value: number;
  suffix?: string;
  /** Override: treat negative as "good" (green) — e.g. debt decreasing */
  invertColor?: boolean;
  className?: string;
}

export default function ChangeBadge({
  value,
  suffix = "",
  invertColor = false,
  className = "",
}: ChangeBadgeProps) {
  const isPositive = value >= 0;
  const isGood = invertColor ? !isPositive : isPositive;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  const colorClasses = isGood
    ? "bg-accent-green/10 text-accent-green"
    : "bg-accent-red/10 text-accent-red";

  const absValue = Math.abs(value);
  const displayValue = absValue >= 1000 ? absValue.toLocaleString("en-US") : `${absValue}`;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}
    >
      <Icon size={12} />
      <span>
        {isPositive ? "+" : "−"}
        {displayValue}
        {suffix}
      </span>
    </span>
  );
}
