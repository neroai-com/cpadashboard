import { ScrollView, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";
import SparklineChart from "../components/SparklineChart";
import KPICard from "../components/KPICard";
import SectionHeader from "../components/SectionHeader";
import ObligationRow from "../components/ObligationRow";
import { RootStackParamList } from "../navigation/types";
import {
  combinedSpaces,
  combinedInsights,
  combinedNetWorthHistory,
  financialAccounts,
  combinedNetWorth,
  personalNetWorth,
  businessEquity,
  otherEstateValue,
  monthlyCashflow,
  dashboardKPIs,
  upcomingObligations,
} from "../lib/data";
import { getGreeting, formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";
import {
  Briefcase,
  Home,
  Building2,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Landmark,
  CreditCard,
  Wallet,
  PiggyBank,
  BarChart3,
  Shield,
  Receipt,
  PieChart,
  Bot,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const checkingTotal = financialAccounts
  .filter((a) => a.type === "checking")
  .reduce((s, a) => s + a.balance, 0);
const savingsTotal = financialAccounts
  .filter((a) => a.type === "savings")
  .reduce((s, a) => s + a.balance, 0);
const investTotal = financialAccounts
  .filter((a) => a.category === "investment")
  .reduce((s, a) => s + a.balance, 0);
const ccTotal = financialAccounts
  .filter((a) => a.category === "credit_card")
  .reduce((s, a) => s + a.balance, 0);
const netCash = checkingTotal + savingsTotal - ccTotal;

const accountSummary = [
  { label: "Checking", value: checkingTotal, icon: Landmark },
  { label: "Savings", value: savingsTotal, icon: PiggyBank },
  { label: "Investments", value: investTotal, icon: BarChart3 },
  { label: "Card Balance", value: ccTotal, icon: CreditCard },
  { label: "Net Cash", value: netCash, icon: Wallet },
];

const combined12moChange =
  combinedNetWorthHistory[combinedNetWorthHistory.length - 1].value -
  combinedNetWorthHistory[0].value;

const quickPages = [
  { label: "AI Advisor", screen: "AIAdvisor" as const, icon: Bot, color: colors.accentGreen, description: "AI CFO, insights, scenarios" },
  { label: "Net Worth", screen: "NetWorth" as const, icon: BarChart3, color: colors.accentGreen, description: "Assets, debt, trends" },
  { label: "Liabilities", screen: "Liabilities" as const, icon: CreditCard, color: colors.accentOrange, description: "Debt, mortgages, cards" },
  { label: "Cash Flow", screen: "CashFlow" as const, icon: Receipt, color: colors.accentBlue, description: "Budget, income, forecast" },
  { label: "Assets", screen: "Assets" as const, icon: PieChart, color: colors.accentPurple, description: "Portfolio, property" },
  { label: "Insurance", screen: "Insurance" as const, icon: Shield, color: colors.accentTeal, description: "Policies, coverage" },
];

const insightSeverity: Record<string, { dot: string; icon: any }> = {
  "1": { dot: "bg-accent-yellow", icon: AlertTriangle },
  "2": { dot: "bg-accent-green", icon: DollarSign },
  "3": { dot: "bg-accent-green", icon: DollarSign },
};

export default function CombinedScreen() {
  const navigation = useNavigation<Nav>();
  const greeting = getGreeting();
  const { income, spending, net, business, individual } = monthlyCashflow;
  const incomePercent = (income / (income + spending)) * 100;

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Logo size="sm" />
          <View className="border border-border-secondary rounded-full px-3 py-1">
            <Text className="text-xs text-text-secondary">Combined view</Text>
          </View>
        </View>

        {/* Greeting */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-text-primary mb-1">{greeting}, Muhammad.</Text>
          <Text className="text-text-secondary text-sm">
            Your single source of truth across personal, business, and family.
          </Text>
        </View>

        {/* KPI Row */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {dashboardKPIs.map((kpi) => (
            <View key={kpi.id} className="w-[48%]">
              <KPICard
                label={kpi.label}
                value={kpi.value}
                subValue={kpi.subValue}
                trend={kpi.trend}
                trendValue={kpi.trendValue}
                icon={kpi.icon}
              />
            </View>
          ))}
        </View>

        {/* Hero Net Worth Card */}
        <Card variant="hero" className="mb-4">
          <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-3">
            Combined Overview
          </Text>
          <Text className="text-xs text-text-muted">Total net worth</Text>
          <AnimatedNumber
            value={combinedNetWorth}
            prefix="$"
            className="text-3xl font-bold text-accent-green"
          />
          <View className="flex-row items-center gap-1.5 mt-1">
            <ArrowUpRight size={14} color={colors.accentGreen} />
            <Text className="text-xs text-accent-green font-medium">
              + {formatCurrency(combined12moChange)} vs last 12 months
            </Text>
          </View>

          <SparklineChart data={combinedNetWorthHistory} height={80} className="mt-3" />

          <View className="mt-4 pt-3 border-t border-white/5">
            <Text className="text-xs text-text-muted mb-2">Breakdown</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs text-text-muted">Personal</Text>
                <Text className="text-sm font-bold text-text-primary">
                  {formatCurrency(personalNetWorth, { compact: true })}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-text-muted">Business</Text>
                <Text className="text-sm font-bold text-text-primary">
                  {formatCurrency(businessEquity, { compact: true })}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-text-muted">Other</Text>
                <Text className="text-sm font-bold text-text-primary">
                  {formatCurrency(otherEstateValue, { compact: true })}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => navigation.navigate("NetWorth")}
            className="flex-row items-center justify-between mt-4 pt-3 border-t border-white/5"
          >
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-lg bg-bg-input/80 items-center justify-center">
                <BarChart3 size={16} color={colors.textSecondary} />
              </View>
              <Text className="text-sm font-medium text-text-primary">View Net Worth</Text>
            </View>
            <ChevronRight size={16} color={colors.textMuted} />
          </Pressable>
        </Card>

        {/* Upcoming Obligations */}
        <SectionHeader title="Upcoming Payments" total={`${upcomingObligations.length} due`} className="mb-2" />
        <Card className="mb-4 !p-0 overflow-hidden">
          {upcomingObligations.slice(0, 3).map((obl, i) => (
            <View key={obl.id} className={i > 0 ? "border-t border-border-primary/50" : ""}>
              <ObligationRow
                label={obl.label}
                amount={obl.amount}
                dueDate={obl.dueDate}
                daysUntil={obl.daysUntil}
                entity={obl.entity}
                type={obl.type}
                autoPay={obl.autoPay}
              />
            </View>
          ))}
          <Pressable
            onPress={() => navigation.navigate("Liabilities")}
            className="py-2.5 border-t border-border-primary/50"
          >
            <Text className="text-xs font-medium text-accent-green text-center">
              View all obligations
            </Text>
          </Pressable>
        </Card>

        {/* Cashflow This Month */}
        <Card variant="glass" className="mb-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
              Cashflow This Month
            </Text>
            <Pressable onPress={() => navigation.navigate("CashFlow")} className="flex-row items-center gap-0.5">
              <Text className="text-[10px] font-medium text-accent-green">Details</Text>
              <ChevronRight size={10} color={colors.accentGreen} />
            </Pressable>
          </View>
          <Text className="text-text-secondary text-xs mb-4">Where money is coming from and going.</Text>

          <Text className="text-xs text-text-muted">Combined</Text>
          <AnimatedNumber value={net} prefix="+ $" className="text-2xl font-bold text-accent-green" />

          <View className="mt-3 mb-1">
            <View className="flex-row justify-between mb-1">
              <Text className="text-[10px] text-text-muted">Income {formatCurrency(income)}</Text>
              <Text className="text-[10px] text-text-muted">Spending {formatCurrency(spending)}</Text>
            </View>
            <View className="flex-row h-2 rounded-full overflow-hidden">
              <View className="bg-accent-green rounded-l-full" style={{ width: `${incomePercent}%` }} />
              <View className="bg-accent-orange/70 rounded-r-full" style={{ width: `${100 - incomePercent}%` }} />
            </View>
          </View>

          <View className="mt-4 pt-3 border-t border-white/5">
            <Text className="text-xs text-text-muted mb-2">By space</Text>
            <View className="flex-row gap-4">
              <View className="flex-1 border-l-2 border-accent-green pl-3">
                <Text className="text-xs text-text-secondary">Business</Text>
                <Text className="text-xl font-bold text-text-primary">+ {formatCurrency(business)}</Text>
                <Text className="text-xs text-text-muted">Net income across entities</Text>
              </View>
              <View className="flex-1 border-l-2 border-accent-blue pl-3">
                <Text className="text-xs text-text-secondary">Individual / family</Text>
                <Text className="text-xl font-bold text-accent-green">+ {formatCurrency(individual)}</Text>
                <Text className="text-xs text-text-muted">Household after expenses</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Accounts summary */}
        <SectionHeader title="Accounts" total="Add Account" className="mb-2" />
        <Card className="mb-4 !p-0 overflow-hidden">
          {accountSummary.map((acct, i) => {
            const Icon = acct.icon;
            const isNeg = acct.value < 0;
            return (
              <View key={acct.label} className={`flex-row items-center gap-3 py-3 px-4 ${i > 0 ? "border-t border-border-primary/50" : ""}`}>
                <View className="w-9 h-9 rounded-xl bg-bg-input/80 items-center justify-center">
                  <Icon size={16} color={colors.textSecondary} />
                </View>
                <Text className="flex-1 text-sm font-medium text-text-primary">{acct.label}</Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className={`text-sm font-bold ${isNeg ? "text-accent-red" : "text-text-primary"}`}>
                    {formatCurrency(acct.value)}
                  </Text>
                  <ChevronRight size={14} color={colors.textMuted} />
                </View>
              </View>
            );
          })}
        </Card>

        {/* Quick Access */}
        <SectionHeader title="Explore" className="mb-2" />
        <Card className="mb-4 !p-0 overflow-hidden">
          {quickPages.map((page, i) => {
            const Icon = page.icon;
            return (
              <Pressable
                key={page.screen}
                onPress={() => navigation.navigate(page.screen as any)}
                className={`flex-row items-center gap-3 py-3.5 px-4 ${i > 0 ? "border-t border-border-primary/50" : ""}`}
              >
                <View className="w-9 h-9 rounded-xl bg-bg-input/80 items-center justify-center">
                  <Icon size={16} color={page.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text-primary">{page.label}</Text>
                  <Text className="text-[10px] text-text-muted">{page.description}</Text>
                </View>
                <ChevronRight size={14} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </Card>

        {/* Spaces */}
        <Card className="mb-4">
          <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-1">
            Spaces
          </Text>
          <Text className="text-text-secondary text-xs mb-4">
            Jump into a specific area of your finances.
          </Text>
          <View className="gap-3">
            {combinedSpaces.map((space) => {
              const icons: Record<string, { icon: any; color: string }> = {
                business: { icon: Briefcase, color: colors.accentGreen },
                individual: { icon: Home, color: colors.accentBlue },
                assets: { icon: Building2, color: colors.accentPurple },
              };
              const meta = icons[space.id];
              const Icon = meta?.icon;
              return (
                <View
                  key={space.id}
                  className="flex-row items-center gap-3 p-3 rounded-lg border border-border-primary"
                >
                  {Icon && (
                    <View className="w-9 h-9 rounded-lg bg-bg-input/80 items-center justify-center">
                      <Icon size={18} color={meta.color} />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="font-semibold text-sm text-text-primary">{space.name}</Text>
                    <Text className="text-xs text-text-muted">{space.description}</Text>
                  </View>
                  <Text className="font-bold text-sm text-text-primary">{space.value}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* AI CFO Insights */}
        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center gap-2">
              <Sparkles size={14} color={colors.accentGreen} />
              <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                AI CFO Insights
              </Text>
            </View>
            <Pressable onPress={() => navigation.navigate("AIAdvisor")} className="flex-row items-center gap-0.5">
              <Text className="text-[10px] font-medium text-accent-green">AI Advisor</Text>
              <ChevronRight size={10} color={colors.accentGreen} />
            </Pressable>
          </View>
          <Text className="text-text-secondary text-xs mb-4">
            Top opportunities and risks across everything.
          </Text>
          <Text className="text-xs text-text-muted mb-3">Today&apos;s highlights</Text>
          <View className="gap-3">
            {combinedInsights.map((insight) => {
              const sev = insightSeverity[insight.id] || { dot: "bg-accent-yellow", icon: AlertTriangle };
              const SevIcon = sev.icon;
              return (
                <View key={insight.id} className="flex-row items-start gap-3 p-3 rounded-lg border border-border-primary/50">
                  <View className="w-7 h-7 rounded-md bg-bg-input/80 items-center justify-center mt-0.5">
                    <SevIcon size={14} color={colors.textSecondary} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <View className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                      <Text className="text-sm font-semibold text-text-primary">{insight.title}</Text>
                    </View>
                    <Text className="text-xs text-text-muted mt-0.5 ml-3.5">{insight.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
