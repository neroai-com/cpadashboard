import { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";
import DonutChart from "../components/DonutChart";
import ProgressBar from "../components/ProgressBar";
import SectionHeader from "../components/SectionHeader";
import SparklineChart from "../components/SparklineChart";
import { formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";
import {
  personalNetWorth,
  netWorthHistory,
  budgetTotalBudgeted,
  budgetTotalActual,
  subscriptions,
  subscriptionMonthlyTotal,
  subscriptionsByCategory,
  savingsGoals,
  totalGoalSaved,
  totalGoalTarget,
  familyMembers,
  spendingCategories,
  uncategorizedTransactions,
  taxEstimates,
  estimatedTaxOwed,
  effectiveTaxRate,
  personalHealthScores,
  monthlyCashflow,
} from "../lib/data";
import {
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Plus,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Target,
  Receipt,
  Tv,
  Music,
  Cloud,
  Bot,
  PenTool,
  Dumbbell,
  Newspaper,
  ChefHat,
  Package,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Zap,
  Shield,
  Repeat,
  ShoppingBag,
  CreditCard,
  Plane,
  GraduationCap,
  Play,
} from "lucide-react-native";

type IndTab = "overview" | "spending" | "goals" | "family" | "tax";

const tabs: { id: IndTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "spending", label: "Spending" },
  { id: "goals", label: "Goals" },
  { id: "family", label: "Family" },
  { id: "tax", label: "Tax" },
];

const subIconMap: Record<string, any> = {
  tv: Tv, music: Music, play: Play, cloud: Cloud, bot: Bot,
  "pen-tool": PenTool, dumbbell: Dumbbell, newspaper: Newspaper,
  "chef-hat": ChefHat, package: Package, "shopping-cart": ShoppingCart,
  home: Home, car: Car, utensils: Utensils, zap: Zap, shield: Shield,
  repeat: Repeat, "shopping-bag": ShoppingBag, "credit-card": CreditCard,
  plane: Plane, "graduation-cap": GraduationCap,
};

export default function IndividualScreen() {
  const [activeTab, setActiveTab] = useState<IndTab>("overview");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const budgetPercent = Math.round((budgetTotalActual / budgetTotalBudgeted) * 100);
  const goalPercent = Math.round((totalGoalSaved / totalGoalTarget) * 100);
  const { overall } = personalHealthScores;

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Logo size="sm" />
          <View className="border border-border-secondary rounded-full px-3 py-1">
            <Text className="text-xs text-text-secondary">Personal CFO</Text>
          </View>
        </View>

        {/* Tab bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-b border-border-primary mb-5">
          <View className="flex-row">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => { setActiveTab(tab.id); setExpandedCategory(null); }}
                  className="px-4 pb-3"
                >
                  <Text className={`text-sm font-medium ${isActive ? "text-accent-green" : "text-text-muted"}`}>
                    {tab.label}
                  </Text>
                  {isActive && <View className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-accent-green rounded-full" />}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* ─── Overview Tab ─── */}
        {activeTab === "overview" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Personal Net Worth</Text>
              <AnimatedNumber value={personalNetWorth} prefix="$" className="text-3xl font-bold text-accent-green" />
              <SparklineChart data={netWorthHistory} height={60} className="mt-2" />
            </Card>

            <Card className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">Financial Health</Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-2xl font-bold text-accent-green">{overall}</Text>
                  <Text className="text-xs text-text-muted">/100</Text>
                </View>
              </View>
              <View className="gap-2.5">
                {([
                  { label: "Savings", score: personalHealthScores.savings, color: "bg-accent-green" },
                  { label: "Debt Mgmt", score: personalHealthScores.debt, color: "bg-accent-blue" },
                  { label: "Insurance", score: personalHealthScores.insurance, color: "bg-accent-teal" },
                  { label: "Investing", score: personalHealthScores.investing, color: "bg-accent-purple" },
                  { label: "Tax Plan", score: personalHealthScores.tax, color: "bg-accent-orange" },
                  { label: "Estate", score: personalHealthScores.estate, color: "bg-accent-yellow" },
                ] as const).map((item) => (
                  <View key={item.label} className="flex-row items-center gap-3">
                    <Text className="text-[10px] text-text-muted w-16">{item.label}</Text>
                    <View className="flex-1 h-2 rounded-full bg-bg-input/50 overflow-hidden">
                      <View className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                    </View>
                    <Text className="text-xs font-bold text-text-primary w-8 text-right">{item.score}</Text>
                  </View>
                ))}
              </View>
            </Card>

            <View className="flex-row gap-2 mb-4">
              {[
                { label: "Budget", val: `${budgetPercent}%`, sub: "used this mo", tab: "spending" as IndTab },
                { label: "Goals", val: `${goalPercent}%`, sub: "on track", tab: "goals" as IndTab },
                { label: "Family", val: `${familyMembers.length}`, sub: "members", tab: "family" as IndTab },
              ].map((item) => (
                <Pressable key={item.label} onPress={() => setActiveTab(item.tab)} className="flex-1 bg-bg-card border border-border-primary rounded-xl p-3">
                  <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{item.label}</Text>
                  <Text className="text-lg font-bold text-text-primary">{item.val}</Text>
                  <Text className="text-[10px] text-text-muted">{item.sub}</Text>
                </Pressable>
              ))}
            </View>

            <SectionHeader title="Subscriptions" total={`${subscriptions.length} active`} className="mb-2" />
            <Card className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="text-xl font-bold text-text-primary">
                    {formatCurrency(Math.round(subscriptionMonthlyTotal))}
                    <Text className="text-xs text-text-muted font-normal">/mo</Text>
                  </Text>
                  <Text className="text-[10px] text-text-muted">{formatCurrency(Math.round(subscriptionMonthlyTotal * 12))}/yr</Text>
                </View>
                <DonutChart
                  segments={Object.entries(subscriptionsByCategory).map(([cat, d], i) => ({
                    label: cat, value: d.total,
                    percent: Math.round((d.total / subscriptionMonthlyTotal) * 100),
                    color: ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#14b8a6", "#eab308", "#ef4444"][i % 7],
                  }))}
                  size={70} strokeWidth={10}
                />
              </View>
              {subscriptions.slice(0, 4).map((sub) => {
                const Icon = subIconMap[sub.icon] || Receipt;
                return (
                  <View key={sub.id} className="flex-row items-center gap-3 py-1">
                    <View className="w-7 h-7 rounded-lg bg-bg-input/80 items-center justify-center">
                      <Icon size={13} color={colors.textSecondary} />
                    </View>
                    <Text className="flex-1 text-xs font-medium text-text-primary">{sub.name}</Text>
                    {sub.shared && (
                      <View className="bg-accent-blue/10 px-1.5 py-0.5 rounded-full">
                        <Text className="text-[9px] text-accent-blue">Shared</Text>
                      </View>
                    )}
                    <Text className="text-xs font-bold text-text-primary">${sub.amount.toFixed(2)}</Text>
                  </View>
                );
              })}
              <Pressable onPress={() => setActiveTab("spending")} className="mt-3 pt-2.5 border-t border-border-primary/50">
                <Text className="text-xs font-medium text-accent-green text-center">View all {subscriptions.length} subscriptions</Text>
              </Pressable>
            </Card>

            {uncategorizedTransactions.length > 0 && (
              <>
                <SectionHeader title="Needs Review" total={`${uncategorizedTransactions.length} items`} className="mb-2" />
                <Card className="mb-4">
                  <Text className="text-xs text-text-muted mb-3">Categorize these transactions for accurate tracking.</Text>
                  {uncategorizedTransactions.slice(0, 3).map((tx) => (
                    <View key={tx.id} className="flex-row items-center gap-3 py-2.5 border-b border-border-primary/30">
                      <View className="flex-1">
                        <Text className="text-xs font-medium text-text-primary" numberOfLines={1}>{tx.description}</Text>
                        <Text className="text-[10px] text-text-muted">{tx.date} · {tx.account}</Text>
                      </View>
                      <Text className="text-xs font-bold text-text-primary">${tx.amount.toFixed(2)}</Text>
                      <View className="px-2 py-1 rounded-md bg-accent-green/10">
                        <Text className="text-accent-green text-[10px] font-medium">{tx.suggestedCategory}</Text>
                      </View>
                    </View>
                  ))}
                </Card>
              </>
            )}

            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">You have $287 in subscriptions — $37 over budget.</Text>
              <Text className="text-xs text-text-muted mt-1">HelloFresh ($80/mo) and WSJ ($39/mo) are your top costs. Consider pausing one to stay within budget.</Text>
            </Card>
          </View>
        )}

        {/* ─── Spending Tab ─── */}
        {activeTab === "spending" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Monthly Spending</Text>
              <AnimatedNumber value={monthlyCashflow.spending} prefix="$" className="text-3xl font-bold text-text-primary" />
              <View className="flex-row items-center gap-4 mt-3">
                <DonutChart
                  segments={spendingCategories.map((c) => ({ label: c.name, value: c.amount, percent: c.percent, color: c.color }))}
                  size={120} strokeWidth={14} centerValue={`${spendingCategories.length}`} centerLabel="categories"
                />
                <View className="flex-1 gap-1.5">
                  {spendingCategories.slice(0, 5).map((c) => (
                    <View key={c.id} className="flex-row items-center gap-2">
                      <View className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <Text className="text-[10px] text-text-secondary flex-1" numberOfLines={1}>{c.name}</Text>
                      <Text className="text-[10px] font-medium text-text-primary">{c.percent}%</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

            <SectionHeader title="By Category" className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {spendingCategories.map((cat) => {
                const Icon = subIconMap[cat.icon] || Receipt;
                const isExpanded = expandedCategory === cat.id;
                const TrendIcon = cat.trend === "up" ? ArrowUpRight : cat.trend === "down" ? ArrowDownRight : Minus;
                const trendColor = cat.trend === "up" ? colors.accentRed : cat.trend === "down" ? colors.accentGreen : colors.textMuted;
                const trendClass = cat.trend === "up" ? "text-accent-red" : cat.trend === "down" ? "text-accent-green" : "text-text-muted";
                return (
                  <View key={cat.id} className="border-b border-border-primary/30">
                    <Pressable onPress={() => setExpandedCategory(isExpanded ? null : cat.id)} className="flex-row items-center gap-3 py-3.5 px-4">
                      <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: cat.color + "18" }}>
                        <Icon size={16} color={cat.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-text-primary">{cat.name}</Text>
                        <View className="flex-row items-center gap-1">
                          <TrendIcon size={10} color={trendColor} />
                          <Text className={`text-[10px] ${trendClass}`}>{cat.trendValue}</Text>
                        </View>
                      </View>
                      <View className="items-end mr-1">
                        <Text className="text-sm font-bold text-text-primary">{formatCurrency(cat.amount)}</Text>
                        <Text className="text-[10px] text-text-muted">{cat.percent}%</Text>
                      </View>
                      <ChevronDown size={14} color={colors.textMuted} style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }} />
                    </Pressable>
                    {isExpanded && (
                      <View className="px-4 pb-3">
                        <View className="ml-12 gap-2 pt-1">
                          {cat.subcategories.map((sub) => (
                            <View key={sub.name} className="flex-row items-center justify-between py-1.5 border-b border-border-primary/20">
                              <Text className="text-xs text-text-secondary">{sub.name}</Text>
                              <Text className="text-xs font-medium text-text-primary">{formatCurrency(sub.amount)}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </Card>

            <SectionHeader title="Subscriptions" total={formatCurrency(Math.round(subscriptionMonthlyTotal)) + "/mo"} className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {subscriptions.map((sub, i) => {
                const Icon = subIconMap[sub.icon] || Receipt;
                return (
                  <View key={sub.id} className={`flex-row items-center gap-3 py-3 px-4 ${i > 0 ? "border-t border-border-primary/30" : ""}`}>
                    <View className="w-8 h-8 rounded-lg bg-bg-input/80 items-center justify-center">
                      <Icon size={14} color={colors.textSecondary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-text-primary">{sub.name}</Text>
                      <Text className="text-[10px] text-text-muted">{sub.cycle === "yearly" ? "Annual" : "Monthly"} · Next {sub.nextBill}</Text>
                    </View>
                    {sub.shared && <Users size={10} color={colors.accentBlue} />}
                    <Text className="text-xs font-bold text-text-primary">${sub.amount.toFixed(2)}<Text className="text-[10px] text-text-muted font-normal">/{sub.cycle === "yearly" ? "yr" : "mo"}</Text></Text>
                  </View>
                );
              })}
            </Card>

            <SectionHeader title="Uncategorized" total={`${uncategorizedTransactions.length} pending`} className="mb-2" />
            <Card className="mb-6 !p-0 overflow-hidden">
              {uncategorizedTransactions.map((tx, i) => (
                <View key={tx.id} className={`flex-row items-center gap-3 py-3 px-4 ${i > 0 ? "border-t border-border-primary/30" : ""}`}>
                  <View className="w-8 h-8 rounded-lg bg-accent-yellow/10 items-center justify-center">
                    <AlertTriangle size={14} color={colors.accentYellow} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-medium text-text-primary" numberOfLines={1}>{tx.description}</Text>
                    <Text className="text-[10px] text-text-muted">{tx.date} · {tx.account}</Text>
                  </View>
                  <Text className="text-xs font-bold text-text-primary mr-1">${tx.amount.toFixed(2)}</Text>
                  <View className="px-2 py-1 rounded-md bg-accent-green/10">
                    <Text className="text-accent-green text-[10px] font-medium">{tx.suggestedCategory}</Text>
                  </View>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* ─── Goals Tab ─── */}
        {activeTab === "goals" && (
          <View>
            <Card variant="hero" className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="text-xs text-text-muted mb-1">Total Saved</Text>
                  <AnimatedNumber value={totalGoalSaved} prefix="$" className="text-3xl font-bold text-accent-green" />
                </View>
                <View className="items-end">
                  <Text className="text-xs text-text-muted mb-1">Target</Text>
                  <Text className="text-xl font-bold text-text-muted">{formatCurrency(totalGoalTarget, { compact: true })}</Text>
                </View>
              </View>
              <ProgressBar percent={goalPercent} color="bg-accent-green" height={8} label={`${goalPercent}% of total target`} showPercent />
              <Text className="text-[10px] text-text-muted mt-2">
                Auto-saving {formatCurrency(savingsGoals.filter((g) => g.autoSave).reduce((s, g) => s + g.monthlyContribution, 0))}/mo across {savingsGoals.filter((g) => g.autoSave).length} goals
              </Text>
            </Card>

            {savingsGoals.map((goal) => {
              const Icon = subIconMap[goal.icon] || Target;
              const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
              const remaining = goal.targetAmount - goal.currentAmount;
              const monthsLeft = Math.ceil(remaining / goal.monthlyContribution);
              return (
                <Card key={goal.id} className="mb-3">
                  <View className="flex-row items-start gap-3 mb-3">
                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-bg-input/80">
                      <Icon size={18} color={colors.accentGreen} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-semibold text-text-primary">{goal.name}</Text>
                        {goal.autoSave && (
                          <View className="bg-accent-green/10 px-1.5 py-0.5 rounded-full">
                            <Text className="text-[9px] text-accent-green">Auto-save</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-[10px] text-text-muted">Target by {goal.targetDate.slice(0, 7).replace("-", "/")}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between mb-1.5">
                    <Text className="text-xs font-bold text-text-primary">{formatCurrency(goal.currentAmount, { compact: true })}</Text>
                    <Text className="text-xs text-text-muted">{formatCurrency(goal.targetAmount, { compact: true })}</Text>
                  </View>
                  <ProgressBar percent={pct} color={goal.color} height={6} />
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-[10px] text-text-muted">{formatCurrency(goal.monthlyContribution)}/mo contribution</Text>
                    <Text className="text-[10px] text-text-muted">~{monthsLeft > 12 ? `${Math.round(monthsLeft / 12)}yr ${monthsLeft % 12}mo` : `${monthsLeft}mo`} left</Text>
                  </View>
                </Card>
              );
            })}

            <Pressable className="flex-row items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border-secondary mb-6">
              <Plus size={16} color={colors.textMuted} />
              <Text className="text-sm font-medium text-text-muted">Add Savings Goal</Text>
            </Pressable>

            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">Emergency fund at 26% — boost contribution $200/mo.</Text>
              <Text className="text-xs text-text-muted mt-1">At current rate, you'll reach 6-month runway by 2032. Adding $200/mo moves that to mid-2029.</Text>
            </Card>
          </View>
        )}

        {/* ─── Family Tab ─── */}
        {activeTab === "family" && (
          <View>
            <SectionHeader title="Family Members" total={`${familyMembers.length} members`} className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {familyMembers.map((fm, i) => {
                const relLabel: Record<string, string> = { self: "Primary", spouse: "Spouse", child: "Child", dependent: "Dependent" };
                return (
                  <View key={fm.id} className={`flex-row items-center gap-3 py-3.5 px-4 ${i > 0 ? "border-t border-border-primary/30" : ""}`}>
                    <View className={`w-10 h-10 rounded-full items-center justify-center ${fm.color}`}>
                      <Text className="text-xs font-bold text-bg-primary">{fm.initials}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-text-primary">{fm.name}</Text>
                      <Text className="text-[10px] text-text-muted">
                        {relLabel[fm.relationship]} · Age {fm.age}{fm.linkedAccounts > 0 && ` · ${fm.linkedAccounts} account${fm.linkedAccounts !== 1 ? "s" : ""}`}
                      </Text>
                    </View>
                    {fm.monthlyCost > 0 && (
                      <View className="items-end">
                        <Text className="text-xs font-bold text-text-primary">{formatCurrency(fm.monthlyCost)}</Text>
                        <Text className="text-[10px] text-text-muted">/mo</Text>
                      </View>
                    )}
                    <ChevronRight size={14} color={colors.textMuted} />
                  </View>
                );
              })}
            </Card>

            <SectionHeader title="Shared Subscriptions" className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {subscriptions.filter((s) => s.shared).map((sub, i) => {
                const Icon = subIconMap[sub.icon] || Receipt;
                return (
                  <View key={sub.id} className={`flex-row items-center gap-3 py-3 px-4 ${i > 0 ? "border-t border-border-primary/30" : ""}`}>
                    <View className="w-8 h-8 rounded-lg bg-bg-input/80 items-center justify-center">
                      <Icon size={14} color={colors.textSecondary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-text-primary">{sub.name}</Text>
                      <Text className="text-[10px] text-text-muted">Shared with family</Text>
                    </View>
                    <Text className="text-xs font-bold text-text-primary">${sub.amount.toFixed(2)}<Text className="text-[10px] text-text-muted font-normal">/{sub.cycle === "yearly" ? "yr" : "mo"}</Text></Text>
                  </View>
                );
              })}
            </Card>

            <SectionHeader title="Dependent Costs" className="mb-2" />
            <Card className="mb-4">
              {familyMembers.filter((fm) => fm.monthlyCost > 0).map((fm) => (
                <View key={fm.id} className="flex-row items-center justify-between py-2.5 border-b border-border-primary/30">
                  <View className="flex-row items-center gap-2">
                    <View className={`w-7 h-7 rounded-full items-center justify-center ${fm.color}`}>
                      <Text className="text-[10px] font-bold text-bg-primary">{fm.initials}</Text>
                    </View>
                    <Text className="text-sm font-medium text-text-primary">{fm.name}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-bold text-text-primary">{formatCurrency(fm.monthlyCost)}/mo</Text>
                    <Text className="text-[10px] text-text-muted">{formatCurrency(fm.monthlyCost * 12)}/yr</Text>
                  </View>
                </View>
              ))}
              <View className="flex-row items-center justify-between pt-3 mt-1 border-t border-border-primary/50">
                <Text className="text-xs font-bold text-text-muted">Total dependents</Text>
                <Text className="text-sm font-bold text-text-primary">{formatCurrency(familyMembers.filter((fm) => fm.monthlyCost > 0).reduce((s, fm) => s + fm.monthlyCost, 0))}/mo</Text>
              </View>
            </Card>

            <SectionHeader title="Estate Planning" className="mb-2" />
            <Card className="mb-6">
              <ProgressBar percent={personalHealthScores.estate} color="bg-accent-teal" label="Estate health" showPercent height={6} className="mb-3" />
              <View className="gap-2">
                {[
                  { label: "Will & Trust", done: true },
                  { label: "Life Insurance", done: true },
                  { label: "Beneficiary Review", done: false },
                  { label: "Power of Attorney", done: false },
                  { label: "Healthcare Directive", done: false },
                ].map((item) => (
                  <View key={item.label} className="flex-row items-center gap-2">
                    {item.done ? (
                      <View className="w-5 h-5 rounded-full bg-accent-green/10 items-center justify-center">
                        <Check size={10} color={colors.accentGreen} />
                      </View>
                    ) : (
                      <View className="w-5 h-5 rounded-full bg-bg-input/50 border border-border-primary items-center justify-center">
                        <View className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                      </View>
                    )}
                    <Text className={`text-xs ${item.done ? "text-text-secondary" : "text-text-muted"}`}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}

        {/* ─── Tax Tab ─── */}
        {activeTab === "tax" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Estimated 2026 Tax Liability</Text>
              <AnimatedNumber value={Math.abs(estimatedTaxOwed)} prefix={estimatedTaxOwed < 0 ? "Refund $" : "$"} className="text-3xl font-bold text-accent-green" />
              <View className="flex-row gap-4 mt-3 pt-3 border-t border-white/5">
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">Effective Rate</Text>
                  <Text className="text-lg font-bold text-text-primary">{effectiveTaxRate}%</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">TX State Tax</Text>
                  <Text className="text-lg font-bold text-accent-green">$0</Text>
                </View>
              </View>
            </Card>

            <SectionHeader title="Tax Breakdown" className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {taxEstimates.map((item, i) => {
                const tc: Record<string, string> = { income: "text-accent-red", deduction: "text-accent-green", credit: "text-accent-blue", payment: "text-accent-purple" };
                const tb: Record<string, string> = { income: "bg-accent-red/10", deduction: "bg-accent-green/10", credit: "bg-accent-blue/10", payment: "bg-accent-purple/10" };
                const tl: Record<string, string> = { income: "Tax", deduction: "Deduction", credit: "Credit", payment: "Payment" };
                return (
                  <View key={item.id} className={`flex-row items-center gap-3 py-3 px-4 ${i > 0 ? "border-t border-border-primary/30" : ""}`}>
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-text-primary">{item.label}</Text>
                      <View className={`self-start px-1.5 py-0.5 rounded-full mt-0.5 ${tb[item.type]}`}>
                        <Text className={`text-[9px] font-medium ${tc[item.type]}`}>{tl[item.type]}</Text>
                      </View>
                    </View>
                    <Text className={`text-sm font-bold ${item.amount < 0 ? "text-accent-green" : "text-text-primary"}`}>
                      {item.amount < 0 ? "−" : ""}{formatCurrency(Math.abs(item.amount))}
                    </Text>
                  </View>
                );
              })}
            </Card>

            <SectionHeader title="Quarterly Payments" className="mb-2" />
            <Card className="mb-4">
              <View className="gap-2.5">
                {[
                  { q: "Q1 (Jan 15)", amount: 17100, status: "paid" },
                  { q: "Q2 (Apr 15)", amount: 17100, status: "due" },
                  { q: "Q3 (Jun 15)", amount: 17100, status: "upcoming" },
                  { q: "Q4 (Sep 15)", amount: 17100, status: "upcoming" },
                ].map((qtr) => (
                  <View key={qtr.q} className="flex-row items-center justify-between py-2 border-b border-border-primary/30">
                    <View className="flex-row items-center gap-2">
                      {qtr.status === "paid" ? (
                        <View className="w-5 h-5 rounded-full bg-accent-green/10 items-center justify-center">
                          <Check size={10} color={colors.accentGreen} />
                        </View>
                      ) : qtr.status === "due" ? (
                        <View className="w-5 h-5 rounded-full bg-accent-yellow/10 items-center justify-center">
                          <AlertTriangle size={10} color={colors.accentYellow} />
                        </View>
                      ) : (
                        <View className="w-5 h-5 rounded-full bg-bg-input/50 items-center justify-center">
                          <View className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                        </View>
                      )}
                      <Text className="text-xs font-medium text-text-primary">{qtr.q}</Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs font-bold text-text-primary">{formatCurrency(qtr.amount)}</Text>
                      <View className={`px-1.5 py-0.5 rounded-full ${qtr.status === "paid" ? "bg-accent-green/10" : qtr.status === "due" ? "bg-accent-yellow/10" : "bg-bg-input"}`}>
                        <Text className={`text-[9px] font-medium ${qtr.status === "paid" ? "text-accent-green" : qtr.status === "due" ? "text-accent-yellow" : "text-text-muted"}`}>
                          {qtr.status.charAt(0).toUpperCase() + qtr.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO — Tax Strategy</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">Max out 401k to save ~$6,900 in taxes.</Text>
              <Text className="text-xs text-text-muted mt-1">You're contributing $23k/yr. Increasing to the $23.5k limit reduces taxable income. Also consider a backdoor Roth IRA conversion.</Text>
            </Card>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
