import { useState, useRef, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import Card from "../components/Card";
import SectionHeader from "../components/SectionHeader";
import SparklineChart from "../components/SparklineChart";
import { colors } from "../lib/theme";
import { RootStackParamList } from "../navigation/types";
import {
  todaysBriefing,
  aiDeepDives,
  aiScenarios,
  aiRisks,
  aiReportTemplates,
  sampleChatMessages,
  aiWatchlist,
  type AIChatMessage,
} from "../lib/ai-data";
import {
  ArrowLeft,
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
  ChevronDown,
  ChevronUp,
  Send,
  Bot,
  Sparkles,
  Eye,
  Clock,
  CheckCircle2,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const tabs = [
  { id: "briefing", label: "Briefing", Icon: Sun },
  { id: "dives", label: "Deep Dives", Icon: BarChart3 },
  { id: "scenarios", label: "Scenarios", Icon: GitBranch },
  { id: "risks", label: "Risk Radar", Icon: Radar },
  { id: "reports", label: "Reports", Icon: FileBarChart },
  { id: "chat", label: "Ask AI", Icon: MessageCircle },
];

const priorityColors: Record<string, { bg: string; text: string; dot: string }> = {
  urgent: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500" },
  important: { bg: "bg-yellow-500/10", text: "text-yellow-400", dot: "bg-yellow-500" },
  fyi: { bg: "bg-green-500/10", text: "text-green-400", dot: "bg-green-500" },
};

const riskColors: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-red-500/15", text: "text-red-400" },
  high: { bg: "bg-orange-500/15", text: "text-orange-400" },
  medium: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  low: { bg: "bg-green-500/15", text: "text-green-400" },
};

const watchlistStatusColors: Record<string, string> = {
  alert: "bg-red-500",
  warning: "bg-yellow-500",
  normal: "bg-green-500",
};

const directionIcon = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const directionColor = {
  up: colors.accentGreen,
  down: colors.accentRed,
  flat: colors.textMuted,
};

const suggestedQuestions = [
  "How do I save more money?",
  "Should I refinance?",
  "Am I on track for retirement?",
  "What are my biggest risks?",
];

export default function AIAdvisorScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const initialTab = route.params?.tab || "briefing";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(sampleChatMessages);
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  function handleSendChat() {
    if (!chatInput.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    const input = chatInput.toLowerCase();
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        default:
          "Based on your financial data, I'd recommend focusing on three priorities: (1) Build your emergency fund to 6 months coverage, (2) Pay down the Chase Freedom card to below 30% utilization, and (3) Start comparing auto insurance quotes before your May renewal.",
        save: "Looking at your spending data, I see three quick wins: (1) Consolidate streaming services to save ~$17/mo, (2) Meal planning could recover $220 over budget in food, (3) Refinancing your mortgage saves $186/mo. Combined potential: ~$423/mo.",
        retire:
          "Your Roth IRA ($128.4k) and 529 ($69.6k) are growing well. At current contribution rates, target retirement age is ~67. Maxing 401k and adding backdoor Roth could move that to age 62.",
        refinance:
          "Refinancing looks favorable. Current rate 6.25% vs market 5.1%. Monthly savings: $186/mo. Break-even: ~8 months. Over remaining 18 years, total savings: ~$35,700.",
      };

      let responseText = responses.default;
      if (input.includes("save") || input.includes("money")) responseText = responses.save;
      else if (input.includes("retire")) responseText = responses.retire;
      else if (input.includes("refinance")) responseText = responses.refinance;

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  }

  /* ───── Tab content renderers ───── */

  function renderBriefing() {
    return (
      <View className="gap-4">
        {/* Priority Briefing */}
        <SectionHeader title="Today's Briefing" total={`${todaysBriefing.length} items`} />
        {todaysBriefing.map((item) => {
          const p = priorityColors[item.priority] || priorityColors.fyi;
          return (
            <Card key={item.id}>
              <View className="flex-row items-start gap-3">
                <View className={`w-2 h-2 rounded-full mt-1.5 ${p.dot}`} />
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-sm font-semibold text-text-primary flex-1">
                      {item.title}
                    </Text>
                    <View className={`px-2 py-0.5 rounded-full ${p.bg}`}>
                      <Text className={`text-[10px] font-semibold uppercase ${p.text}`}>
                        {item.priority}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-text-muted leading-5">{item.body}</Text>
                  {item.actionLabel && (
                    <Pressable className="mt-2 self-start px-3 py-1.5 rounded-lg bg-accent-green/10">
                      <Text className="text-xs font-medium text-accent-green">
                        {item.actionLabel}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </Card>
          );
        })}

        {/* Watchlist */}
        <View className="mt-2" />
        <SectionHeader title="AI Watchlist" total={`${aiWatchlist.length} metrics`} />
        <Card>
          {aiWatchlist.map((item, i) => (
            <View
              key={item.id}
              className={`flex-row items-center justify-between py-3 ${
                i > 0 ? "border-t border-border-primary/50" : ""
              }`}
            >
              <View className="flex-row items-center gap-2 flex-1">
                <View
                  className={`w-2 h-2 rounded-full ${
                    watchlistStatusColors[item.status] || "bg-gray-500"
                  }`}
                />
                <Text className="text-sm text-text-primary">{item.label}</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-semibold text-text-primary">
                  {item.currentValue}
                </Text>
                <Text className="text-[10px] text-text-muted">
                  Threshold: {item.threshold}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </View>
    );
  }

  function renderDeepDives() {
    return (
      <View className="gap-4">
        <SectionHeader title="Metric Deep Dives" total={`${aiDeepDives.length} metrics`} />
        {aiDeepDives.map((dive) => {
          const DirIcon = directionIcon[dive.changeDirection];
          const dirColor = directionColor[dive.changeDirection];
          const sparkData = dive.sparkData.map((v) => ({ value: v }));
          return (
            <Card key={dive.id}>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs font-semibold tracking-wider text-text-muted uppercase">
                  {dive.category}
                </Text>
                <View className="flex-row items-center gap-1">
                  <DirIcon size={12} color={dirColor} />
                  <Text style={{ color: dirColor }} className="text-xs font-semibold">
                    {dive.change}
                  </Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-text-primary mb-0.5">
                {dive.metric}
              </Text>
              <Text className="text-2xl font-bold text-accent-green mb-3">
                {dive.currentValue}
              </Text>
              <SparklineChart
                data={sparkData}
                height={80}
                color={dirColor}
                className="mb-3"
              />
              <View className="p-3 rounded-lg bg-bg-input/50 mb-2">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <Eye size={12} color={colors.textMuted} />
                  <Text className="text-[10px] font-semibold text-text-muted uppercase">
                    Analysis
                  </Text>
                </View>
                <Text className="text-xs text-text-secondary leading-5">
                  {dive.analysis}
                </Text>
              </View>
              <View className="p-3 rounded-lg bg-accent-green/5 border border-accent-green/10">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <Sparkles size={12} color={colors.accentGreen} />
                  <Text className="text-[10px] font-semibold text-accent-green uppercase">
                    Recommendation
                  </Text>
                </View>
                <Text className="text-xs text-text-secondary leading-5">
                  {dive.recommendation}
                </Text>
              </View>
            </Card>
          );
        })}
      </View>
    );
  }

  function renderScenarios() {
    return (
      <View className="gap-4">
        <SectionHeader title="What-If Scenarios" total={`${aiScenarios.length} scenarios`} />
        {aiScenarios.map((scenario) => {
          const isExpanded = expandedScenario === scenario.id;
          const impactColor =
            scenario.impactType === "positive"
              ? "text-green-400"
              : scenario.impactType === "negative"
              ? "text-red-400"
              : "text-text-secondary";
          const impactBg =
            scenario.impactType === "positive"
              ? "bg-green-500/10"
              : scenario.impactType === "negative"
              ? "bg-red-500/10"
              : "bg-bg-input";

          return (
            <Card key={scenario.id}>
              <Pressable
                onPress={() =>
                  setExpandedScenario(isExpanded ? null : scenario.id)
                }
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 mr-3">
                    <Text className="text-sm font-semibold text-text-primary">
                      {scenario.title}
                    </Text>
                    <Text className="text-xs text-text-muted mt-0.5">
                      {scenario.description}
                    </Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={16} color={colors.textMuted} />
                  ) : (
                    <ChevronDown size={16} color={colors.textMuted} />
                  )}
                </View>
                <View className="flex-row items-center gap-2">
                  <View className={`px-2.5 py-1 rounded-full ${impactBg}`}>
                    <Text className={`text-xs font-semibold ${impactColor}`}>
                      {scenario.impact}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Clock size={10} color={colors.textMuted} />
                    <Text className="text-[10px] text-text-muted">
                      {scenario.timeframe}
                    </Text>
                  </View>
                </View>
              </Pressable>

              {isExpanded && (
                <View className="mt-3 pt-3 border-t border-border-primary/50">
                  {/* Variables table */}
                  <View className="rounded-lg bg-bg-input/50 overflow-hidden mb-3">
                    {/* Header row */}
                    <View className="flex-row px-3 py-2 border-b border-border-primary/50">
                      <Text className="flex-1 text-[10px] font-semibold text-text-muted uppercase">
                        Variable
                      </Text>
                      <Text className="w-24 text-[10px] font-semibold text-text-muted uppercase text-right">
                        Current
                      </Text>
                      <Text className="w-24 text-[10px] font-semibold text-accent-green uppercase text-right">
                        Proposed
                      </Text>
                    </View>
                    {scenario.variables.map((v, i) => (
                      <View
                        key={v.label}
                        className={`flex-row items-center px-3 py-2.5 ${
                          i > 0 ? "border-t border-border-primary/30" : ""
                        }`}
                      >
                        <Text className="flex-1 text-xs text-text-secondary">
                          {v.label}
                        </Text>
                        <Text className="w-24 text-xs text-text-muted text-right">
                          {v.current}
                        </Text>
                        <Text className="w-24 text-xs font-medium text-accent-green text-right">
                          {v.proposed}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Outcome */}
                  <View className="p-3 rounded-lg bg-accent-green/5 border border-accent-green/10">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <Sparkles size={12} color={colors.accentGreen} />
                      <Text className="text-[10px] font-semibold text-accent-green uppercase">
                        Projected Outcome
                      </Text>
                    </View>
                    <Text className="text-xs text-text-secondary leading-5">
                      {scenario.outcome}
                    </Text>
                  </View>
                </View>
              )}
            </Card>
          );
        })}
      </View>
    );
  }

  function renderRisks() {
    return (
      <View className="gap-4">
        <SectionHeader title="Risk & Opportunity Radar" total={`${aiRisks.length} items`} />
        {aiRisks.map((risk) => {
          const rc = riskColors[risk.riskLevel] || riskColors.medium;
          return (
            <Card key={risk.id}>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-text-primary flex-1 mr-2">
                  {risk.title}
                </Text>
                <View className={`px-2 py-0.5 rounded-full ${rc.bg}`}>
                  <Text className={`text-[10px] font-bold uppercase ${rc.text}`}>
                    {risk.riskLevel}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-text-muted mb-3 leading-5">
                {risk.description}
              </Text>

              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 p-2 rounded-lg bg-bg-input/50">
                  <Text className="text-[10px] text-text-muted mb-0.5">Probability</Text>
                  <Text className="text-sm font-bold text-text-primary">
                    {risk.probability}%
                  </Text>
                </View>
                <View className="flex-1 p-2 rounded-lg bg-bg-input/50">
                  <Text className="text-[10px] text-text-muted mb-0.5">Category</Text>
                  <Text className="text-sm font-bold text-text-primary">
                    {risk.category}
                  </Text>
                </View>
              </View>

              <View className="p-3 rounded-lg bg-bg-input/50 mb-2">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <AlertTriangle size={12} color={colors.accentYellow} />
                  <Text className="text-[10px] font-semibold text-text-muted uppercase">
                    Impact
                  </Text>
                </View>
                <Text className="text-xs text-text-secondary leading-5">
                  {risk.impact}
                </Text>
              </View>

              <View className="p-3 rounded-lg bg-accent-green/5 border border-accent-green/10">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <Shield size={12} color={colors.accentGreen} />
                  <Text className="text-[10px] font-semibold text-accent-green uppercase">
                    Mitigation
                  </Text>
                </View>
                <Text className="text-xs text-text-secondary leading-5">
                  {risk.mitigation}
                </Text>
              </View>
            </Card>
          );
        })}
      </View>
    );
  }

  function renderReports() {
    return (
      <View className="gap-4">
        <SectionHeader
          title="Report Templates"
          total={`${aiReportTemplates.length} reports`}
        />
        {aiReportTemplates.map((report) => (
          <Card key={report.id}>
            <View className="flex-row items-start gap-3">
              <View className="w-10 h-10 rounded-lg bg-accent-blue/10 items-center justify-center">
                <FileBarChart size={18} color={colors.accentBlue} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-text-primary">
                  {report.title}
                </Text>
                <Text className="text-xs text-text-muted mt-0.5 mb-2">
                  {report.description}
                </Text>
                <View className="flex-row flex-wrap gap-1.5 mb-3">
                  {report.sections.map((section) => (
                    <View
                      key={section}
                      className="px-2 py-0.5 rounded-full bg-bg-input border border-border-primary/50"
                    >
                      <Text className="text-[10px] text-text-muted">{section}</Text>
                    </View>
                  ))}
                </View>
                <View className="flex-row items-center justify-between">
                  {report.lastGenerated ? (
                    <View className="flex-row items-center gap-1">
                      <Clock size={10} color={colors.textMuted} />
                      <Text className="text-[10px] text-text-muted">
                        Last: {report.lastGenerated}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-[10px] text-text-muted">Never generated</Text>
                  )}
                  <Pressable className="px-3 py-1.5 rounded-lg bg-accent-green">
                    <Text className="text-xs font-semibold text-white">Generate</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>
    );
  }

  function renderChat() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <View className="flex-1">
          {/* Chat messages */}
          <View className="gap-3 mb-4">
            {chatMessages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <View
                  key={msg.id}
                  className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <View
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      isUser
                        ? "bg-accent-green rounded-br-md"
                        : "bg-bg-card border border-border-primary rounded-bl-md"
                    }`}
                  >
                    {!isUser && (
                      <View className="flex-row items-center gap-1.5 mb-1.5">
                        <Bot size={10} color={colors.accentGreen} />
                        <Text className="text-[10px] font-semibold text-accent-green">
                          AI CFO
                        </Text>
                      </View>
                    )}
                    <Text
                      className={`text-sm leading-5 ${
                        isUser ? "text-white" : "text-text-secondary"
                      }`}
                    >
                      {msg.content}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Suggested questions */}
          {chatMessages.length <= 1 && (
            <View className="mb-4">
              <Text className="text-[10px] text-text-muted mb-2 uppercase tracking-wider">
                Suggested questions
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <Pressable
                    key={q}
                    onPress={() => setChatInput(q)}
                    className="px-3 py-1.5 rounded-full border border-accent-green/20"
                  >
                    <Text className="text-[11px] text-accent-green">{q}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Input */}
          <View className="bg-bg-card border border-border-primary rounded-xl flex-row items-center gap-2 px-3 py-2">
            <TextInput
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendChat}
              placeholder="Ask your AI CFO anything..."
              placeholderTextColor={colors.textMuted}
              className="flex-1 text-sm text-text-primary"
              returnKeyType="send"
            />
            <Pressable
              onPress={handleSendChat}
              disabled={!chatInput.trim()}
              className="w-8 h-8 rounded-lg bg-accent-green items-center justify-center"
              style={{ opacity: chatInput.trim() ? 1 : 0.4 }}
            >
              <Send size={14} color="#ffffff" />
            </Pressable>
          </View>
          <Text className="text-[9px] text-text-muted text-center mt-1.5">
            AI responses are generated from your financial data. Not financial advice.
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const tabContent: Record<string, () => JSX.Element> = {
    briefing: renderBriefing,
    dives: renderDeepDives,
    scenarios: renderScenarios,
    risks: renderRisks,
    reports: renderReports,
    chat: renderChat,
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex-row items-center gap-2"
          >
            <ArrowLeft size={20} color={colors.textSecondary} />
            <Logo size="sm" />
          </Pressable>
          <View className="flex-row items-center gap-1.5 border border-accent-green/30 rounded-full px-3 py-1">
            <Sparkles size={10} color={colors.accentGreen} />
            <Text className="text-xs text-accent-green font-medium">AI Advisor</Text>
          </View>
        </View>

        {/* Title */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-text-primary mb-1">
            AI Advisor
          </Text>
          <Text className="text-text-secondary text-sm">
            Your personal AI CFO. Briefings, deep dives, scenarios, and more.
          </Text>
        </View>

        {/* Horizontal Tab Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5"
          contentContainerStyle={{ gap: 6 }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-accent-green/15 border-accent-green"
                    : "bg-transparent border-border-secondary"
                }`}
              >
                <tab.Icon
                  size={14}
                  color={isActive ? colors.accentGreen : colors.textMuted}
                />
                <Text
                  className={`text-sm font-medium ${
                    isActive ? "text-accent-green" : "text-text-secondary"
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Tab Content */}
        {tabContent[activeTab]?.()}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
