"use client";

import { ReactNode, KeyboardEvent } from "react";

type CardVariant = "default" | "hero" | "glass";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  onClick?: () => void;
  ariaLabel?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-bg-card border border-border-primary",
  hero: "bg-bg-card border border-accent-green/20 glow-green-sm relative overflow-hidden",
  glass:
    "gradient-glass border border-white/[0.06] shadow-lg shadow-black/20",
};

export default function Card({
  children,
  className = "",
  variant = "default",
  onClick,
  ariaLabel,
}: CardProps) {
  function handleKeyDown(e: KeyboardEvent) {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? ariaLabel : undefined}
      className={`rounded-xl p-4 ${variantStyles[variant]} ${
        onClick
          ? "cursor-pointer hover:bg-bg-card-hover active:scale-[0.99] transition-all focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary outline-none"
          : ""
      } ${className}`}
    >
      {/* Hero variant top gradient accent line */}
      {variant === "hero" && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-green via-accent-teal to-accent-green/0" />
      )}
      {children}
    </div>
  );
}
