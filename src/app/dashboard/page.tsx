"use client";

import { useState, useEffect } from "react";
import type { Tab } from "@/lib/types";
import { useAuthGuard } from "@/lib/auth";
import BottomNav from "@/components/BottomNav";
import CombinedView from "@/components/views/CombinedView";
import BusinessView from "@/components/views/BusinessView";
import IndividualView from "@/components/views/IndividualView";
import SettingsView from "@/components/views/SettingsView";
import AIOrb from "@/components/ai/AIOrb";
import AICommandPalette from "@/components/ai/AICommandPalette";

export default function DashboardPage() {
  const authed = useAuthGuard();
  const [activeTab, setActiveTab] = useState<Tab>("combined");

  // Scroll to top on tab switch
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  if (!authed) {
    return (
      <div className="min-h-dvh bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg-primary">
      <div className="max-w-lg mx-auto pb-20">
        {/* Keep all views mounted, hide inactive with CSS to preserve state */}
        <div className={activeTab === "combined" ? "" : "hidden"}>
          <CombinedView onNavigate={setActiveTab} />
        </div>
        <div className={activeTab === "business" ? "" : "hidden"}>
          <BusinessView />
        </div>
        <div className={activeTab === "individual" ? "" : "hidden"}>
          <IndividualView />
        </div>
        <div className={activeTab === "settings" ? "" : "hidden"}>
          <SettingsView />
        </div>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <AIOrb />
      <AICommandPalette />
    </div>
  );
}
