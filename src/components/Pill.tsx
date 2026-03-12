"use client";

interface PillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Pill({ label, active = false, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary outline-none ${
        active
          ? "bg-accent-green/15 text-accent-green border-accent-green"
          : "bg-transparent text-text-secondary border-border-secondary hover:border-text-muted"
      }`}
    >
      {label}
    </button>
  );
}
