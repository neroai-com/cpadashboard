"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  ArrowRight,
  Navigation,
  BarChart3,
  Zap,
  MessageCircle,
} from "lucide-react";
import { aiCommands } from "@/lib/ai-data";

const categoryIcons: Record<string, typeof Navigation> = {
  navigate: Navigation,
  analyze: BarChart3,
  action: Zap,
  ask: MessageCircle,
};

const categoryLabels: Record<string, string> = {
  navigate: "Navigate",
  analyze: "Analyze",
  action: "Actions",
  ask: "Ask AI",
};

const routeMap: Record<string, string> = {
  "cmd-1": "/networth",
  "cmd-2": "/liabilities",
  "cmd-3": "/cashflow",
  "cmd-4": "/insurance",
  "cmd-5": "/assets",
  "cmd-6": "/ai-advisor",
  "cmd-7": "/ai-advisor?tab=dives",
  "cmd-8": "/liabilities?tab=payoff",
  "cmd-9": "/ai-advisor?tab=reports",
  "cmd-10": "/assets",
  "cmd-11": "/ai-advisor?tab=scenarios",
  "cmd-12": "/ai-advisor?tab=reports",
  "cmd-13": "/ai-advisor?tab=risks",
  "cmd-14": "/ai-advisor?tab=chat",
  "cmd-15": "/ai-advisor?tab=chat",
  "cmd-16": "/ai-advisor?tab=chat",
};

export default function AICommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return aiCommands;
    const q = query.toLowerCase();
    return aiCommands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q) ||
        cmd.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const cmd of filtered) {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    }
    return groups;
  }, [filtered]);

  const flatList = useMemo(() => filtered, [filtered]);

  const openPalette = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const executeCommand = useCallback(
    (cmdId: string) => {
      const route = routeMap[cmdId];
      if (route) {
        closePalette();
        router.push(route);
      }
    },
    [router, closePalette]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) closePalette();
        else openPalette();
      }

      if (!isOpen) return;

      // Escape to close
      if (e.key === "Escape") {
        e.preventDefault();
        closePalette();
      }

      // Arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatList.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      // Enter to execute
      if (e.key === "Enter" && flatList[selectedIndex]) {
        e.preventDefault();
        executeCommand(flatList[selectedIndex].id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openPalette, closePalette, flatList, selectedIndex, executeCommand]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-backdrop-in"
        onClick={closePalette}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md mx-4 animate-panel-slide-up">
        <div className="bg-bg-card border border-border-primary rounded-2xl shadow-2xl overflow-hidden glow-ai">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-primary/50">
            <Sparkles size={16} className="text-accent-green flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands, navigate, or ask AI..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-text-muted border border-border-secondary rounded bg-bg-input/50">
              esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto no-scrollbar p-2">
            {Object.entries(grouped).length === 0 ? (
              <div className="py-8 text-center">
                <Search size={24} className="text-text-muted mx-auto mb-2" />
                <p className="text-sm text-text-muted">No results found</p>
                <p className="text-xs text-text-muted mt-1">
                  Try different keywords
                </p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, commands]) => {
                const CatIcon = categoryIcons[category] || Zap;
                return (
                  <div key={category} className="mb-2">
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <CatIcon size={10} className="text-text-muted" />
                      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                        {categoryLabels[category] || category}
                      </span>
                    </div>
                    {commands.map((cmd) => {
                      const globalIdx = flatList.findIndex(
                        (c) => c.id === cmd.id
                      );
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => executeCommand(cmd.id)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                            isSelected
                              ? "bg-accent-green/10 border border-accent-green/20"
                              : "hover:bg-bg-card-hover border border-transparent"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary">
                              {cmd.label}
                            </p>
                            <p className="text-[11px] text-text-muted">
                              {cmd.description}
                            </p>
                          </div>
                          {isSelected && (
                            <ArrowRight
                              size={14}
                              className="text-accent-green flex-shrink-0"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border-primary/50 flex items-center justify-between bg-bg-primary/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 text-[9px] text-text-muted border border-border-secondary rounded bg-bg-input/50">
                  ↑↓
                </kbd>
                <span className="text-[9px] text-text-muted">navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 text-[9px] text-text-muted border border-border-secondary rounded bg-bg-input/50">
                  ↵
                </kbd>
                <span className="text-[9px] text-text-muted">select</span>
              </div>
            </div>
            <span className="text-[9px] text-text-muted">
              {flatList.length} command{flatList.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
