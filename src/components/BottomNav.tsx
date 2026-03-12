"use client";

import type { Tab } from "@/lib/types";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "combined", label: "Combined", icon: LayoutDashboard },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "individual", label: "Family", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border-primary safe-bottom"
      aria-label="Main navigation"
    >
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 min-h-[48px] pt-2 pb-1.5 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none relative ${
                isActive
                  ? "text-accent-green"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.8}
                className="transition-all duration-200"
              />
              <span>{tab.label}</span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-green animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
