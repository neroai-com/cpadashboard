"use client";

import { Info } from "lucide-react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  showInfo?: boolean;
  className?: string;
}

export default function ToggleSwitch({
  label,
  checked,
  onChange,
  showInfo = false,
  className = "",
}: ToggleSwitchProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-text-secondary">{label}</span>
        {showInfo && (
          <Info size={14} className="text-text-muted" />
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary outline-none ${
          checked ? "bg-accent-green" : "bg-bg-input border border-border-secondary"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
