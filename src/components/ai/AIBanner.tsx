"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ChevronRight,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { aiBannerInsights } from "@/lib/ai-data";

export default function AIBanner() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const insight = aiBannerInsights[currentIndex];

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (isCollapsed || isDismissed) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aiBannerInsights.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isCollapsed, isDismissed]);

  const nextInsight = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % aiBannerInsights.length);
  }, []);

  const prevInsight = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + aiBannerInsights.length) % aiBannerInsights.length
    );
  }, []);

  if (isDismissed) return null;

  const severityColor =
    insight.severity === "high"
      ? "text-accent-green"
      : insight.severity === "medium"
      ? "text-accent-yellow"
      : "text-text-secondary";

  const typeIcon =
    insight.type === "opportunity"
      ? "💡"
      : insight.type === "risk"
      ? "⚠️"
      : insight.type === "action"
      ? "🎯"
      : "ℹ️";

  return (
    <div className="animate-banner-slide">
      <div className="gradient-ai-banner rounded-xl border border-accent-green/10 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-accent-green" />
            <span className="text-[10px] font-semibold text-accent-green uppercase tracking-wider">
              AI Insight
            </span>
            <span className="text-[10px] text-text-muted">
              {currentIndex + 1}/{aiBannerInsights.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevInsight}
              className="p-1 rounded hover:bg-bg-input/50 transition-colors"
              aria-label="Previous insight"
            >
              <ChevronUp size={12} className="text-text-muted" />
            </button>
            <button
              onClick={nextInsight}
              className="p-1 rounded hover:bg-bg-input/50 transition-colors"
              aria-label="Next insight"
            >
              <ChevronDown size={12} className="text-text-muted" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-bg-input/50 transition-colors text-[10px] text-text-muted"
            >
              {isCollapsed ? "Show" : "Hide"}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded hover:bg-bg-input/50 transition-colors"
              aria-label="Dismiss banner"
            >
              <X size={12} className="text-text-muted" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="px-3 pb-3 animate-fade-in" key={insight.id}>
            <div className="flex items-start gap-2">
              <span className="text-sm flex-shrink-0 mt-0.5">{typeIcon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${severityColor}`}>
                  {insight.title}
                </p>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                  {insight.summary}
                </p>
                {insight.action && (
                  <button
                    onClick={() => router.push("/ai-advisor")}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-accent-green hover:text-accent-green-dark transition-colors"
                  >
                    {insight.action}
                    <ChevronRight size={10} />
                  </button>
                )}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {aiBannerInsights.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all ${
                    i === currentIndex
                      ? "w-4 h-1.5 bg-accent-green"
                      : "w-1.5 h-1.5 bg-border-secondary"
                  }`}
                  aria-label={`Go to insight ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
