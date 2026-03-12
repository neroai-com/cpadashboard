"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bot, X, Sparkles, MessageCircle, BarChart3, Shield, Lightbulb } from "lucide-react";

const quickActions = [
  { label: "AI Advisor", icon: Bot, path: "/ai-advisor", color: "text-accent-green" },
  { label: "Ask AI", icon: MessageCircle, path: "/ai-advisor?tab=chat", color: "text-accent-blue" },
  { label: "Risk Radar", icon: Shield, path: "/ai-advisor?tab=risks", color: "text-accent-orange" },
  { label: "Deep Dives", icon: BarChart3, path: "/ai-advisor?tab=dives", color: "text-accent-purple" },
];

export default function AIOrb() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewInsight, setHasNewInsight] = useState(true);

  // Dismiss the "new" dot after opening
  useEffect(() => {
    if (isOpen && hasNewInsight) setHasNewInsight(false);
  }, [isOpen, hasNewInsight]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Shift+I to open AI
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/30 animate-backdrop-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Action Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[95] w-56 animate-panel-slide-up">
          <div className="bg-bg-card border border-border-primary rounded-2xl shadow-xl overflow-hidden glow-ai">
            <div className="px-4 py-3 border-b border-border-primary/50">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-accent-green" />
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  AI Quick Actions
                </span>
              </div>
            </div>
            <div className="p-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(action.path);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-card-hover transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-bg-input/80 flex items-center justify-center ${action.color}`}>
                      <Icon size={15} />
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-border-primary/50 bg-bg-primary/50">
              <p className="text-[10px] text-text-muted text-center">
                Ctrl+Shift+I to toggle • Cmd+K to search
              </p>
            </div>
          </div>
        </div>
      )}

      {/* The Orb */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 z-[100] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-bg-card border border-border-primary rotate-90"
            : "gradient-ai-orb animate-orb-pulse"
        }`}
        aria-label={isOpen ? "Close AI menu" : "Open AI assistant"}
      >
        {/* Ripple ring */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full border border-accent-green/30 animate-orb-ripple" />
        )}

        {isOpen ? (
          <X size={18} className="text-text-primary" />
        ) : (
          <Sparkles size={18} className="text-white" />
        )}

        {/* New insight indicator */}
        {hasNewInsight && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent-orange rounded-full border-2 border-bg-primary animate-pulse" />
        )}
      </button>
    </>
  );
}
