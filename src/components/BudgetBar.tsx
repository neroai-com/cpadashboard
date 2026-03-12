"use client";

import {
  Home,
  Car,
  Utensils,
  Zap,
  Shield,
  Repeat,
  ShoppingBag,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  car: Car,
  utensils: Utensils,
  zap: Zap,
  shield: Shield,
  repeat: Repeat,
  "shopping-bag": ShoppingBag,
  "credit-card": CreditCard,
};

interface BudgetBarProps {
  name: string;
  budgeted: number;
  actual: number;
  icon: string;
  color: string;
  className?: string;
}

export default function BudgetBar({
  name,
  budgeted,
  actual,
  icon,
  color,
  className = "",
}: BudgetBarProps) {
  const Icon = iconMap[icon] || CreditCard;
  const percent = Math.min(Math.round((actual / budgeted) * 100), 100);
  const remaining = budgeted - actual;
  const isOver = remaining < 0;

  return (
    <div className={`py-3 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-bg-input/80 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">{name}</span>
            <span
              className={`text-xs font-bold ${
                isOver ? "text-accent-red" : "text-text-primary"
              }`}
            >
              ${actual.toLocaleString()}
              <span className="text-text-muted font-normal">
                {" "}
                / ${budgeted.toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="ml-11">
        <div className="h-2 rounded-full bg-bg-input/50 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOver ? "bg-accent-red" : color
            }`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-text-muted">{percent}% used</span>
          <span
            className={`text-[10px] font-medium ${
              isOver ? "text-accent-red" : "text-text-muted"
            }`}
          >
            {isOver
              ? `$${Math.abs(remaining).toLocaleString()} over`
              : `$${remaining.toLocaleString()} left`}
          </span>
        </div>
      </div>
    </div>
  );
}
