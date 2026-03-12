"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { aiSparks } from "@/lib/ai-data";

interface AISparkProps {
  metricId: string;
  className?: string;
  size?: number;
}

export default function AISpark({
  metricId,
  className = "",
  size = 12,
}: AISparkProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const spark = aiSparks[metricId];
  if (!spark) return null;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center justify-center rounded-full hover:bg-accent-green/10 transition-colors p-0.5 group"
        aria-label={`AI insight for ${spark.title}`}
      >
        <Sparkles
          size={size}
          className="text-accent-green/60 group-hover:text-accent-green animate-spark-shimmer"
        />
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute bottom-full right-0 mb-2 w-64 z-[80] animate-scale-in"
          style={{ transformOrigin: "bottom right" }}
        >
          <div className="bg-bg-card border border-accent-green/20 rounded-xl shadow-xl overflow-hidden glow-ai">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border-primary/50">
              <div className="flex items-center gap-1.5">
                <Sparkles size={10} className="text-accent-green" />
                <span className="text-[10px] font-semibold text-accent-green uppercase tracking-wider">
                  AI Insight
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-0.5 rounded hover:bg-bg-input/50 transition-colors"
              >
                <X size={10} className="text-text-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="px-3 py-2.5">
              <p className="text-xs font-semibold text-text-primary mb-1">
                {spark.title}
              </p>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                {spark.insight}
              </p>
              {spark.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    router.push("/ai-advisor");
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-accent-green hover:text-accent-green-dark transition-colors"
                >
                  {spark.action}
                  <ChevronRight size={10} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
