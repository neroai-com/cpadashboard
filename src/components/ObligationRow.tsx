"use client";

import {
  Home,
  CreditCard,
  Car,
  Shield,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const typeIcons: Record<string, LucideIcon> = {
  mortgage: Home,
  credit_card: CreditCard,
  loan: Car,
  insurance: Shield,
  bill: Receipt,
};

const typeColors: Record<string, string> = {
  mortgage: "bg-accent-blue/10 text-accent-blue",
  credit_card: "bg-accent-orange/10 text-accent-orange",
  loan: "bg-accent-purple/10 text-accent-purple",
  insurance: "bg-accent-teal/10 text-accent-teal",
  bill: "bg-accent-yellow/10 text-accent-yellow",
};

interface ObligationRowProps {
  label: string;
  amount: number;
  dueDate: string;
  daysUntil: number;
  entity: string;
  type: string;
  autoPay: boolean;
  className?: string;
}

export default function ObligationRow({
  label,
  amount,
  dueDate,
  daysUntil,
  type,
  autoPay,
  className = "",
}: ObligationRowProps) {
  const Icon = typeIcons[type] || Receipt;
  const colorClass = typeColors[type] || "bg-bg-input/80 text-text-secondary";

  const urgency =
    daysUntil <= 7
      ? "text-accent-red"
      : daysUntil <= 14
      ? "text-accent-yellow"
      : "text-text-muted";

  return (
    <div className={`flex items-center gap-3 py-3 px-4 ${className}`}>
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{label}</p>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium ${urgency}`}>
            {daysUntil <= 1 ? "Due today" : `${daysUntil}d`}
          </span>
          <span className="text-[10px] text-text-muted">Due {dueDate}</span>
          {autoPay && (
            <span className="text-[10px] bg-accent-green/10 text-accent-green px-1.5 py-0.5 rounded-full">
              Auto
            </span>
          )}
        </div>
      </div>
      <p className="text-sm font-bold text-text-primary flex-shrink-0">
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
