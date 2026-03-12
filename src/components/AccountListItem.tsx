"use client";

import ProgressBar from "@/components/ProgressBar";
import { formatCurrency } from "@/lib/utils";
import {
  Landmark,
  PiggyBank,
  TrendingUp,
  Home,
  Car,
  CreditCard,
  GraduationCap,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  landmark: Landmark,
  "piggy-bank": PiggyBank,
  "trending-up": TrendingUp,
  home: Home,
  car: Car,
  "credit-card": CreditCard,
  "graduation-cap": GraduationCap,
};

interface AccountListItemProps {
  name: string;
  institution?: string;
  balance: number;
  icon: string;
  creditLimit?: number;
  showChevron?: boolean;
  className?: string;
}

function getUtilColor(percent: number): string {
  if (percent < 30) return "bg-accent-green";
  if (percent < 50) return "bg-accent-yellow";
  if (percent < 75) return "bg-accent-orange";
  return "bg-accent-red";
}

export default function AccountListItem({
  name,
  institution,
  balance,
  icon,
  creditLimit,
  showChevron = false,
  className = "",
}: AccountListItemProps) {
  const Icon = iconMap[icon] || CreditCard;
  const isNegative = balance < 0;
  const utilPercent = creditLimit ? Math.round((balance / creditLimit) * 100) : 0;

  return (
    <div
      className={`flex items-center gap-3 py-3.5 px-4 ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{name}</p>
        {institution && (
          <p className="text-xs text-text-muted">{institution}</p>
        )}
        {creditLimit != null && creditLimit > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <ProgressBar
              percent={utilPercent}
              color={getUtilColor(utilPercent)}
              height={5}
              className="flex-1"
            />
            <span className="text-[10px] text-text-muted whitespace-nowrap">
              {utilPercent}% Used
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <p
          className={`text-sm font-bold ${
            isNegative ? "text-accent-red" : "text-text-primary"
          }`}
        >
          {formatCurrency(balance)}
        </p>
        {showChevron && (
          <ChevronDown size={14} className="text-text-muted" />
        )}
      </div>
    </div>
  );
}
