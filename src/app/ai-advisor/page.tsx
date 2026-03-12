"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthGuard } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import SparklineChart from "@/components/SparklineChart";
import ProgressBar from "@/components/ProgressBar";
import {
  ArrowLeft,
  Sparkles,
  Sun,
  BarChart3,
  GitBranch,
  Radar,
  FileBarChart,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Shield,
  ChevronRight,
  ChevronDown,
  Send,
  Lightbulb,
  Clock,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import {
  todaysBriefing,
  aiDeepDives,
  aiScenarios,
  aiRisks,
  aiReportTemplates,
  sampleChatMessages,
  aiWatchlist,
  type AIChatMessage,
} from "@/lib/ai-data";

const tabs = [
  { id: "briefing", label: "Briefing", icon: Sun },
  { id: "dives", label: "Deep Dives", icon: BarChart3 },
  { id: "scenarios", label: "Scenarios", icon: GitBranch },
  { id: "risks", label: "Risk Radar", icon: Radar },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "chat", label: "Ask AI", icon: MessageCircle },
];

function AIAdvisorContent() {
  const authed = useAuthGuard();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "briefing";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(sampleChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function handleSendChat() {
    if (!chatInput.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        default:
          "Based on your financial data, I'd recommend focusing on three priorities: (1) Build your emergency fund to 6 months coverage — you're at 2.5 months, (2) Pay down the Chase Freedom card to below 30% utilization ($260 payment), and (3) Start comparing auto insurance quotes before your May renewal. Would you like me to dive deeper into any of these?",
        save: "Great question! Looking at your spending data, I see three quick wins: (1) Consolidate streaming services — you have Netflix, YouTube Premium, and Spotify, which overlap. Cutting one saves ~$17/mo. (2) Your food & dining is $220 over budget — meal planning could recover that. (3) Refinancing your mortgage from 6.25% to 5.1% saves $186/mo. Combined potential: ~$423/mo or $5,076/yr.",
        retire:
          "Based on your current trajectory: your Roth IRA ($128.4k) and 529 ($69.6k) are growing well. However, at your current contribution rate, you'd need to work until approximately age 67 to maintain your current lifestyle in retirement. Maxing your 401k ($23.5k) and adding a backdoor Roth ($7k) could move that target to age 62. Shall I model this out?",
        refinance:
          "Yes, refinancing looks favorable. Your current rate (6.25%) is 1.15% above market (5.1%) on a $284k balance. Monthly savings: $186/mo. Closing costs estimate: $4,500. Break-even: ~8 months. Over the remaining 18 years, total savings: ~$35,700. I'd recommend locking a rate soon — the Fed signaled potential rate adjustments in Q3.",
      };

      const input = chatInput.toLowerCase();
      let responseText = responses.default;
      if (input.includes("save") || input.includes("money") || input.includes("cut"))
        responseText = responses.save;
      else if (input.includes("retire") || input.includes("retirement"))
        responseText = responses.retire;
      else if (input.includes("refinance") || input.includes("mortgage"))
        responseText = responses.refinance;

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  }

  if (!authed) {
    return (
      <div className="min-h-dvh bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const priorityColors = {
    urgent: "bg-accent-red/10 border-accent-red/30 text-accent-red",
    important: "bg-accent-orange/10 border-accent-orange/30 text-accent-orange",
    fyi: "bg-accent-green/10 border-accent-green/30 text-accent-green",
  };

  const riskColors = {
    critical: { bg: "bg-accent-red/10", border: "border-accent-red/30", text: "text-accent-red", dot: "bg-accent-red" },
    high: { bg: "bg-accent-orange/10", border: "border-accent-orange/30", text: "text-accent-orange", dot: "bg-accent-orange" },
    medium: { bg: "bg-accent-yellow/10", border: "border-accent-yellow/30", text: "text-accent-yellow", dot: "bg-accent-yellow" },
    low: { bg: "bg-accent-green/10", border: "border-accent-green/30", text: "text-accent-green", dot: "bg-accent-green" },
  };

  const watchlistStatusColors = {
    alert: "text-accent-red",
    warning: "text-accent-orange",
    normal: "text-accent-green",
  };

  return (
    <div className="min-h-dvh bg-bg-primary">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-accent-green" />
            <span className="text-xs text-text-secondary border border-accent-green/20 rounded-full px-3 py-1 bg-accent-green/5">
              AI Advisor
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up delay-1 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg gradient-ai-orb flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI CFO Advisor</h1>
              <p className="text-[10px] text-text-muted">
                Powered by AI • Updated just now
              </p>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar mb-4 animate-fade-in-up delay-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                    : "text-text-muted hover:text-text-secondary hover:bg-bg-input/50 border border-transparent"
                }`}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ═══ TAB: Today's Briefing ═══ */}
        {activeTab === "briefing" && (
          <div className="space-y-3 animate-fade-in-up">
            {/* Summary bar */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-green/5 border border-accent-green/10">
              <Sun size={16} className="text-accent-green flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Good morning, Muhammad
                </p>
                <p className="text-[10px] text-text-muted">
                  6 items need your attention today • Net worth at all-time high
                </p>
              </div>
            </div>

            {/* Briefing items */}
            {todaysBriefing.map((item) => (
              <Card key={item.id} className="!p-3">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      priorityColors[item.priority]
                    }`}
                  >
                    {item.priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">
                      {item.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      {item.body}
                    </p>
                    {item.actionLabel && (
                      <button
                        onClick={() =>
                          item.link ? router.push(item.link) : undefined
                        }
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-accent-green hover:text-accent-green-dark transition-colors"
                      >
                        {item.actionLabel}
                        <ChevronRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {/* AI Watchlist */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={12} className="text-text-muted" />
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Watchlist
                </span>
              </div>
              <Card className="!p-0 overflow-hidden">
                <div className="divide-y divide-border-primary/50">
                  {aiWatchlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "alert"
                              ? "bg-accent-red"
                              : item.status === "warning"
                              ? "bg-accent-orange"
                              : "bg-accent-green"
                          }`}
                        />
                        <span className="text-xs text-text-primary">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          watchlistStatusColors[item.status]
                        }`}
                      >
                        {item.currentValue}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ═══ TAB: Deep Dives ═══ */}
        {activeTab === "dives" && (
          <div className="space-y-4 animate-fade-in-up">
            <p className="text-xs text-text-muted">
              Deep analysis of your key financial metrics with AI-powered
              recommendations.
            </p>
            {aiDeepDives.map((dive) => (
              <Card key={dive.id} className="!p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {dive.metric}
                  </p>
                  <div className="flex items-center gap-1">
                    {dive.changeDirection === "up" ? (
                      <ArrowUpRight size={12} className="text-accent-green" />
                    ) : dive.changeDirection === "down" ? (
                      <ArrowDownRight size={12} className="text-accent-red" />
                    ) : (
                      <Minus size={12} className="text-text-muted" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        dive.changeDirection === "up"
                          ? "text-accent-green"
                          : dive.changeDirection === "down"
                          ? "text-accent-red"
                          : "text-text-muted"
                      }`}
                    >
                      {dive.change}
                    </span>
                  </div>
                </div>

                <p className="text-2xl font-bold text-text-primary mb-2">
                  {dive.currentValue}
                </p>

                {/* Mini sparkline */}
                <SparklineChart
                  data={dive.sparkData.map((v, i) => ({ date: `${i}`, value: v }))}
                  height={50}
                  className={`mb-3 ${
                    dive.changeDirection === "down" && dive.metric.includes("Debt")
                      ? "text-accent-green"
                      : dive.changeDirection === "up"
                      ? "text-accent-green"
                      : "text-accent-blue"
                  }`}
                />

                <div className="space-y-2 pt-2 border-t border-border-primary/50">
                  <div className="flex items-start gap-2">
                    <BarChart3 size={12} className="text-accent-blue flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {dive.analysis}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb size={12} className="text-accent-green flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-primary leading-relaxed font-medium">
                      {dive.recommendation}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ═══ TAB: Scenario Planner ═══ */}
        {activeTab === "scenarios" && (
          <div className="space-y-3 animate-fade-in-up">
            <p className="text-xs text-text-muted mb-2">
              What-if analysis for major financial decisions. Tap to expand.
            </p>
            {aiScenarios.map((scenario) => {
              const isExpanded = expandedScenario === scenario.id;
              return (
                <Card key={scenario.id} className="!p-0 overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedScenario(isExpanded ? null : scenario.id)
                    }
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-card-hover transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">
                        {scenario.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {scenario.description}
                      </p>
                      <span
                        className={`mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          scenario.impactType === "positive"
                            ? "bg-accent-green/10 text-accent-green"
                            : scenario.impactType === "negative"
                            ? "bg-accent-red/10 text-accent-red"
                            : "bg-bg-input text-text-secondary"
                        }`}
                      >
                        {scenario.impact}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-text-muted flex-shrink-0 ml-2 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border-primary/50 animate-fade-in">
                      {/* Variables table */}
                      <div className="mt-3 space-y-2">
                        {scenario.variables.map((v) => (
                          <div
                            key={v.label}
                            className="flex items-center justify-between"
                          >
                            <span className="text-xs text-text-muted">
                              {v.label}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-text-secondary">
                                {v.current}
                              </span>
                              <ChevronRight size={10} className="text-text-muted" />
                              <span className="text-xs font-bold text-accent-green">
                                {v.proposed}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Outcome */}
                      <div className="mt-3 p-3 rounded-lg bg-accent-green/5 border border-accent-green/10">
                        <div className="flex items-start gap-2">
                          <Lightbulb size={12} className="text-accent-green flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {scenario.outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ═══ TAB: Risk Radar ═══ */}
        {activeTab === "risks" && (
          <div className="space-y-3 animate-fade-in-up">
            <p className="text-xs text-text-muted mb-2">
              Active risks and opportunities detected across your finances.
            </p>

            {/* Risk summary */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {(["critical", "high", "medium", "low"] as const).map((level) => {
                const count = aiRisks.filter(
                  (r) => r.riskLevel === level
                ).length;
                const colors = riskColors[level];
                return (
                  <div
                    key={level}
                    className={`${colors.bg} border ${colors.border} rounded-lg p-2 text-center`}
                  >
                    <p className={`text-lg font-bold ${colors.text}`}>
                      {count}
                    </p>
                    <p className="text-[9px] text-text-muted uppercase tracking-wider">
                      {level}
                    </p>
                  </div>
                );
              })}
            </div>

            {aiRisks.map((risk) => {
              const colors = riskColors[risk.riskLevel];
              return (
                <Card key={risk.id} className="!p-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${colors.dot}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-text-primary">
                          {risk.title}
                        </p>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${colors.bg} border ${colors.border} ${colors.text}`}
                        >
                          {risk.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {risk.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] text-text-muted">
                          Impact:
                        </span>
                        <span className="text-[10px] text-text-secondary">
                          {risk.impact}
                        </span>
                      </div>

                      <div className="mt-2 p-2 rounded-lg bg-bg-input/50 border border-border-primary/30">
                        <div className="flex items-start gap-1.5">
                          <Shield size={10} className="text-accent-green flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-accent-green leading-relaxed">
                            {risk.mitigation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ═══ TAB: Reports ═══ */}
        {activeTab === "reports" && (
          <div className="space-y-3 animate-fade-in-up">
            <p className="text-xs text-text-muted mb-2">
              Generate personalized financial reports with AI analysis.
            </p>
            {aiReportTemplates.map((rpt) => (
              <Card key={rpt.id} className="!p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                    <FileBarChart size={18} className="text-accent-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">
                      {rpt.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {rpt.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rpt.sections.map((sec) => (
                        <span
                          key={sec}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-bg-input border border-border-secondary text-text-muted"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      {rpt.lastGenerated && (
                        <div className="flex items-center gap-1">
                          <Clock size={10} className="text-text-muted" />
                          <span className="text-[10px] text-text-muted">
                            Last: {rpt.lastGenerated}
                          </span>
                        </div>
                      )}
                      <button className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-green hover:text-accent-green-dark transition-colors">
                        Generate Report
                        <ChevronRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ═══ TAB: Ask AI (Chat) ═══ */}
        {activeTab === "chat" && (
          <div className="animate-fade-in-up">
            {/* Chat messages */}
            <div className="space-y-3 mb-4 min-h-[40vh]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                      msg.role === "user"
                        ? "bg-accent-green text-white rounded-br-md"
                        : "bg-bg-card border border-border-primary rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Bot size={10} className="text-accent-green" />
                        <span className="text-[9px] font-semibold text-accent-green uppercase tracking-wider">
                          AI CFO
                        </span>
                      </div>
                    )}
                    <p
                      className={`text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "text-white"
                          : "text-text-secondary"
                      }`}
                    >
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-bg-card border border-border-primary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Bot size={10} className="text-accent-green" />
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green/60 animate-thinking-dot-1" />
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green/60 animate-thinking-dot-2" />
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green/60 animate-thinking-dot-3" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick suggestions */}
            {chatMessages.length <= 1 && (
              <div className="mb-4">
                <p className="text-[10px] text-text-muted mb-2 uppercase tracking-wider">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "How do I save more money?",
                    "Should I refinance?",
                    "Am I on track for retirement?",
                    "What are my biggest risks?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setChatInput(q);
                      }}
                      className="text-[11px] px-3 py-1.5 rounded-full border border-accent-green/20 text-accent-green hover:bg-accent-green/5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="sticky bottom-0 bg-bg-primary pt-2 pb-4">
              <div className="flex items-center gap-2 bg-bg-card border border-border-primary rounded-xl px-3 py-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="Ask your AI CFO anything..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim() || isTyping}
                  className="w-8 h-8 rounded-lg bg-accent-green flex items-center justify-center hover:bg-accent-green-dark transition-colors disabled:opacity-40"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
              <p className="text-[9px] text-text-muted text-center mt-1.5">
                AI responses are generated from your financial data. Not
                financial advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIAdvisorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AIAdvisorContent />
    </Suspense>
  );
}
