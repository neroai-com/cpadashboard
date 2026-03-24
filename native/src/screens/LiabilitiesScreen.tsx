import { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";
import ProgressBar from "../components/ProgressBar";
import SectionHeader from "../components/SectionHeader";
import KPICard from "../components/KPICard";
import ObligationRow from "../components/ObligationRow";
import SparklineChart from "../components/SparklineChart";
import { formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";
import { RootStackParamList } from "../navigation/types";
import {
  netWorthSummary,
  financialAccounts,
  upcomingObligations,
  mortgages,
  creditCardDetails,
  loanDetails,
  weightedAvgRate,
  debtHistory,
  monthlyCashflow,
  snowballOrder,
  avalancheOrder,
} from "../lib/data";
import {
  ArrowLeft,
  Home,
  CreditCard,
  Car,
  Sparkles,
  BarChart3,
  CheckCircle,
  Zap,
  Snowflake,
  TrendingDown,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type LiabTab = "overview" | "mortgages" | "cards" | "loans" | "payoff";

const tabs: { id: LiabTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "mortgages", label: "Mortgages" },
  { id: "cards", label: "Cards" },
  { id: "loans", label: "Loans" },
  { id: "payoff", label: "Payoff" },
];

/* ── Derived totals ── */
const totalDebt = netWorthSummary.totalDebt;
const monthlyDebtPayments =
  mortgages.reduce((s, m) => s + m.monthlyPayment, 0) +
  creditCardDetails.reduce((s, c) => s + c.minPayment, 0) +
  loanDetails
    .filter((l) => l.type !== "personal") // exclude mortgage duplicate
    .reduce((s, l) => s + l.monthlyPayment, 0);
const dti = Math.round((monthlyDebtPayments / monthlyCashflow.income) * 100);

/* ── Debt payoff helpers ── */
interface PayoffDebt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

const allDebts: PayoffDebt[] = [
  ...creditCardDetails.map((c) => ({ id: c.id, name: c.name, balance: c.balance, rate: c.apr, minPayment: c.minPayment })),
  ...loanDetails.map((l) => ({ id: l.id, name: l.name, balance: l.currentBalance, rate: l.interestRate, minPayment: l.monthlyPayment })),
];

function getDebtByOrder(order: string[]): PayoffDebt[] {
  return order.map((id) => allDebts.find((d) => d.id === id)).filter(Boolean) as PayoffDebt[];
}

const snowballDebts = getDebtByOrder(snowballOrder);
const avalancheDebts = getDebtByOrder(avalancheOrder);

function getUtilColor(percent: number): string {
  if (percent < 30) return "bg-accent-green";
  if (percent < 50) return "bg-accent-yellow";
  if (percent < 75) return "bg-accent-orange";
  return "bg-accent-red";
}

function getUtilTextColor(percent: number): string {
  if (percent < 30) return "text-accent-green";
  if (percent < 50) return "text-accent-yellow";
  if (percent < 75) return "text-accent-orange";
  return "text-accent-red";
}

export default function LiabilitiesScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const initialTab = (route.params as any)?.tab as LiabTab | undefined;
  const [activeTab, setActiveTab] = useState<LiabTab>(initialTab || "overview");
  const [payoffStrategy, setPayoffStrategy] = useState<"snowball" | "avalanche">("avalanche");

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => navigation.goBack()} className="flex-row items-center gap-2">
            <ArrowLeft size={20} color={colors.textSecondary} />
            <Logo size="sm" />
          </Pressable>
          <View className="border border-border-secondary rounded-full px-3 py-1">
            <Text className="text-xs text-text-secondary">Liabilities</Text>
          </View>
        </View>

        {/* ── Tab Bar ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-b border-border-primary mb-5">
          <View className="flex-row">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)} className="px-4 pb-3">
                  <Text className={`text-sm font-medium ${isActive ? "text-accent-green" : "text-text-muted"}`}>
                    {tab.label}
                  </Text>
                  {isActive && <View className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-accent-green rounded-full" />}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* ══════════ OVERVIEW TAB ══════════ */}
        {activeTab === "overview" && (
          <View>
            {/* Hero */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Total Debt</Text>
              <AnimatedNumber value={totalDebt} prefix="$" className="text-3xl font-bold text-accent-red" />
              <SparklineChart data={debtHistory} height={60} color={colors.accentRed} className="mt-2" />
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-white/5">
                <Text className="text-xs text-text-muted">Trend (12mo)</Text>
                <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-accent-green/10">
                  <TrendingDown size={12} color={colors.accentGreen} />
                  <Text className="text-xs font-medium text-accent-green">Decreasing</Text>
                </View>
              </View>
            </Card>

            {/* KPI Row */}
            <View className="flex-row gap-2 mb-4">
              <KPICard
                label="Monthly Payments"
                value={formatCurrency(monthlyDebtPayments)}
                subValue="Across all debts"
                trend="down"
                trendValue="-$36 this mo"
                icon="wallet"
                className="flex-1"
              />
              <KPICard
                label="Avg APR"
                value={`${weightedAvgRate}%`}
                subValue="Weighted average"
                trend="neutral"
                trendValue="Stable"
                icon="percent"
                className="flex-1"
              />
            </View>

            <View className="flex-row gap-2 mb-4">
              <KPICard
                label="Debt-to-Income"
                value={`${dti}%`}
                subValue="Below 36% threshold"
                trend="down"
                trendValue="-4% this mo"
                icon="percent"
                className="flex-1"
              />
              <View className="flex-1 bg-bg-card border border-border-primary rounded-xl p-3">
                <View className="flex-row items-center gap-2 mb-2">
                  <View className="w-7 h-7 rounded-lg bg-bg-input/80 items-center justify-center">
                    <BarChart3 size={14} color={colors.textSecondary} />
                  </View>
                  <Text className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Accounts</Text>
                </View>
                <Text className="text-xl font-bold text-text-primary mb-0.5">
                  {creditCardDetails.length + loanDetails.length}
                </Text>
                <Text className="text-[10px] text-text-muted mt-1">
                  {creditCardDetails.length} cards, {loanDetails.length} loans
                </Text>
              </View>
            </View>

            {/* Upcoming Payments */}
            <SectionHeader title="Upcoming Payments" total={`${upcomingObligations.length} due`} className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {upcomingObligations.slice(0, 3).map((obl, i) => (
                <ObligationRow
                  key={obl.id}
                  label={obl.label}
                  amount={obl.amount}
                  dueDate={obl.dueDate}
                  daysUntil={obl.daysUntil}
                  entity={obl.entity}
                  type={obl.type}
                  autoPay={obl.autoPay}
                  className={i > 0 ? "border-t border-border-primary/30" : ""}
                />
              ))}
              {upcomingObligations.length > 3 && (
                <Pressable className="py-3 border-t border-border-primary/30">
                  <Text className="text-xs font-medium text-accent-green text-center">
                    View all {upcomingObligations.length} obligations
                  </Text>
                </Pressable>
              )}
            </Card>

            {/* Debt by type summary */}
            <SectionHeader title="Debt by Type" className="mb-2" />
            <Card className="mb-4">
              <View className="gap-3">
                {[
                  {
                    label: "Mortgages",
                    value: mortgages.reduce((s, m) => s + m.currentBalance, 0),
                    color: "bg-accent-blue",
                    pct: Math.round(
                      (mortgages.reduce((s, m) => s + m.currentBalance, 0) / totalDebt) * 100
                    ),
                  },
                  {
                    label: "Credit Cards",
                    value: creditCardDetails.reduce((s, c) => s + c.balance, 0),
                    color: "bg-accent-orange",
                    pct: Math.round(
                      (creditCardDetails.reduce((s, c) => s + c.balance, 0) / totalDebt) * 100
                    ),
                  },
                  {
                    label: "Loans",
                    value: loanDetails
                      .filter((l) => l.type !== "personal")
                      .reduce((s, l) => s + l.currentBalance, 0),
                    color: "bg-accent-purple",
                    pct: Math.round(
                      (loanDetails.filter((l) => l.type !== "personal").reduce((s, l) => s + l.currentBalance, 0) / totalDebt) * 100
                    ),
                  },
                ].map((item) => (
                  <View key={item.label}>
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center gap-2">
                        <View className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <Text className="text-xs text-text-secondary">{item.label}</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xs font-bold text-text-primary">{formatCurrency(item.value)}</Text>
                        <Text className="text-[10px] text-text-muted">{item.pct}%</Text>
                      </View>
                    </View>
                    <ProgressBar percent={item.pct} color={item.color} height={4} />
                  </View>
                ))}
              </View>
            </Card>

            {/* AI CFO Insight */}
            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                Your DTI is {dti}% -- well within the healthy range.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Paying an extra $200/mo on the Discover card (22.99% APR) would save ~$480 in interest this year and eliminate it 8 months faster.
              </Text>
            </Card>
          </View>
        )}

        {/* ══════════ MORTGAGES TAB ══════════ */}
        {activeTab === "mortgages" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Total Mortgage Debt</Text>
              <AnimatedNumber
                value={mortgages.reduce((s, m) => s + m.currentBalance, 0)}
                prefix="$"
                className="text-3xl font-bold text-text-primary"
              />
              <Text className="text-xs text-text-muted mt-1">
                {mortgages.length} mortgage{mortgages.length !== 1 ? "s" : ""}
              </Text>
            </Card>

            {mortgages.map((mort) => {
              const equityAmount = mort.homeValue - mort.currentBalance;
              const equityPercent = Math.round((equityAmount / mort.homeValue) * 100);
              const principalPaid = mort.originalAmount - mort.currentBalance;
              const principalPercent = Math.round((principalPaid / mort.originalAmount) * 100);

              return (
                <Card key={mort.id} className="mb-4">
                  <View className="flex-row items-center gap-3 mb-4">
                    <View className="w-11 h-11 rounded-xl items-center justify-center bg-accent-blue/10">
                      <Home size={20} color={colors.accentBlue} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-text-primary">{mort.property}</Text>
                      <Text className="text-xs text-text-muted">{mort.lender} {"\u00B7"} {mort.interestRate}% Fixed</Text>
                    </View>
                  </View>

                  {/* Key stats */}
                  <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-3">
                      <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Balance</Text>
                      <Text className="text-lg font-bold text-text-primary">{formatCurrency(mort.currentBalance)}</Text>
                    </View>
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-3">
                      <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Home Value</Text>
                      <Text className="text-lg font-bold text-text-primary">{formatCurrency(mort.homeValue)}</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-3">
                      <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Monthly</Text>
                      <Text className="text-lg font-bold text-text-primary">{formatCurrency(mort.monthlyPayment)}</Text>
                    </View>
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-3">
                      <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Remaining</Text>
                      <Text className="text-lg font-bold text-text-primary">{Math.round(mort.remainingTerm / 12)}yr {mort.remainingTerm % 12}mo</Text>
                    </View>
                  </View>

                  {/* Equity bar */}
                  <ProgressBar
                    percent={equityPercent}
                    color="bg-accent-green"
                    height={8}
                    label="Home Equity"
                    showPercent
                    className="mb-2"
                  />
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-[10px] text-text-muted">Equity: {formatCurrency(equityAmount)}</Text>
                    <Text className="text-[10px] text-text-muted">Owed: {formatCurrency(mort.currentBalance)}</Text>
                  </View>

                  {/* Payoff progress */}
                  <ProgressBar
                    percent={principalPercent}
                    color="bg-accent-blue"
                    height={6}
                    label="Principal Payoff"
                    showPercent
                  />
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-[10px] text-text-muted">
                      {formatCurrency(principalPaid)} of {formatCurrency(mort.originalAmount)} paid
                    </Text>
                    <Text className="text-[10px] text-text-muted">Next payment: {mort.nextPayment}</Text>
                  </View>
                </Card>
              );
            })}

            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                Refinance could save ~$186/mo at current rates.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Your 6.25% rate is above market. A 5.5% refi on {formatCurrency(mortgages[0]?.currentBalance || 0)} saves {formatCurrency(186)}/mo over the remaining term.
              </Text>
            </Card>
          </View>
        )}

        {/* ══════════ CARDS TAB ══════════ */}
        {activeTab === "cards" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Total Card Balances</Text>
              <AnimatedNumber
                value={creditCardDetails.reduce((s, c) => s + c.balance, 0)}
                prefix="$"
                className="text-3xl font-bold text-accent-orange"
              />
              <View className="flex-row gap-4 mt-3 pt-3 border-t border-white/5">
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">Total Limit</Text>
                  <Text className="text-lg font-bold text-text-primary">
                    {formatCurrency(creditCardDetails.reduce((s, c) => s + c.creditLimit, 0))}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">Overall Utilization</Text>
                  <Text className="text-lg font-bold text-accent-yellow">
                    {Math.round(
                      (creditCardDetails.reduce((s, c) => s + c.balance, 0) /
                        creditCardDetails.reduce((s, c) => s + c.creditLimit, 0)) *
                        100
                    )}%
                  </Text>
                </View>
              </View>
            </Card>

            {creditCardDetails.map((card) => {
              const utilPercent = Math.round((card.balance / card.creditLimit) * 100);
              const utilColor = getUtilColor(utilPercent);
              const utilTextColor = getUtilTextColor(utilPercent);

              return (
                <Card key={card.id} className="mb-3">
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-accent-orange/10">
                      <CreditCard size={18} color={colors.accentOrange} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-text-primary">{card.name}</Text>
                      <Text className="text-xs text-text-muted">{card.issuer} {"\u00B7"} ****{card.lastFour}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-sm font-bold text-text-primary">{formatCurrency(card.balance)}</Text>
                      <Text className="text-[10px] text-text-muted">{card.apr}% APR</Text>
                    </View>
                  </View>

                  {/* Utilization bar */}
                  <ProgressBar
                    percent={utilPercent}
                    color={utilColor}
                    height={8}
                    className="mb-1.5"
                  />
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className={`text-[10px] font-medium ${utilTextColor}`}>{utilPercent}% utilization</Text>
                    <Text className="text-[10px] text-text-muted">Limit: {formatCurrency(card.creditLimit)}</Text>
                  </View>

                  {/* Detail row */}
                  <View className="flex-row gap-3">
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-2.5">
                      <Text className="text-[10px] text-text-muted">Min Payment</Text>
                      <Text className="text-sm font-bold text-text-primary">{formatCurrency(card.minPayment)}</Text>
                    </View>
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-2.5">
                      <Text className="text-[10px] text-text-muted">Due Date</Text>
                      <Text className="text-sm font-bold text-text-primary">{card.nextDue.slice(5).replace("-", "/")}</Text>
                    </View>
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-2.5">
                      <Text className="text-[10px] text-text-muted">Rewards</Text>
                      <Text className="text-xs font-bold text-accent-green" numberOfLines={1}>{card.rewardsBalance}</Text>
                    </View>
                  </View>

                  {/* Spending mini-chart */}
                  <View className="mt-3 pt-3 border-t border-border-primary/30">
                    <Text className="text-[10px] text-text-muted mb-1">6-Month Spending Trend</Text>
                    <SparklineChart
                      data={card.spendingHistory.map((v) => ({ value: v }))}
                      height={40}
                      color={colors.accentOrange}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* ══════════ LOANS TAB ══════════ */}
        {activeTab === "loans" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Total Loan Balances</Text>
              <AnimatedNumber
                value={loanDetails.reduce((s, l) => s + l.currentBalance, 0)}
                prefix="$"
                className="text-3xl font-bold text-accent-purple"
              />
              <Text className="text-xs text-text-muted mt-1">
                {loanDetails.length} active loan{loanDetails.length !== 1 ? "s" : ""}
              </Text>
            </Card>

            {loanDetails.map((loan) => {
              const paidOff = loan.originalAmount - loan.currentBalance;
              const payoffPercent = Math.round((paidOff / loan.originalAmount) * 100);
              const Icon = loan.icon === "home" ? Home : Car;
              const iconColor = loan.icon === "home" ? colors.accentBlue : colors.accentPurple;
              const iconBg = loan.icon === "home" ? "bg-accent-blue/10" : "bg-accent-purple/10";

              return (
                <Card key={loan.id} className="mb-3">
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className={`w-10 h-10 rounded-xl items-center justify-center ${iconBg}`}>
                      <Icon size={18} color={iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-text-primary">{loan.name}</Text>
                      <Text className="text-xs text-text-muted">
                        {loan.lender} {"\u00B7"} {loan.interestRate}% {"\u00B7"} {Math.round(loan.remainingTerm / 12)}yr {loan.remainingTerm % 12}mo left
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-3 mb-3">
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-2.5">
                      <Text className="text-[10px] text-text-muted">Balance</Text>
                      <Text className="text-base font-bold text-text-primary">{formatCurrency(loan.currentBalance)}</Text>
                    </View>
                    <View className="flex-1 bg-bg-input/50 rounded-lg p-2.5">
                      <Text className="text-[10px] text-text-muted">Monthly</Text>
                      <Text className="text-base font-bold text-text-primary">{formatCurrency(loan.monthlyPayment)}</Text>
                    </View>
                  </View>

                  <ProgressBar
                    percent={payoffPercent}
                    color="bg-accent-green"
                    height={6}
                    label="Payoff Progress"
                    showPercent
                  />
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-[10px] text-text-muted">
                      {formatCurrency(paidOff)} of {formatCurrency(loan.originalAmount)} paid
                    </Text>
                    <Text className="text-[10px] text-text-muted">Next: {loan.nextPayment}</Text>
                  </View>
                </Card>
              );
            })}

            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                Auto loan at 4.9% is competitive -- no refi needed.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Focus extra payments on higher-rate credit cards instead. Once cards are paid off, redirect that cashflow here.
              </Text>
            </Card>
          </View>
        )}

        {/* ══════════ PAYOFF TAB ══════════ */}
        {activeTab === "payoff" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Debt Payoff Strategy</Text>
              <Text className="text-2xl font-bold text-text-primary mb-1">Choose your approach</Text>
              <Text className="text-xs text-text-muted">Compare snowball vs avalanche methods to find the best fit for your goals.</Text>
            </Card>

            {/* Strategy toggle */}
            <View className="flex-row gap-2 mb-4">
              <Pressable
                onPress={() => setPayoffStrategy("avalanche")}
                className={`flex-1 rounded-xl p-4 border ${
                  payoffStrategy === "avalanche"
                    ? "border-accent-green bg-accent-green/5"
                    : "border-border-primary bg-bg-card"
                }`}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View className={`w-9 h-9 rounded-lg items-center justify-center ${payoffStrategy === "avalanche" ? "bg-accent-green/15" : "bg-bg-input/80"}`}>
                    <Zap size={18} color={payoffStrategy === "avalanche" ? colors.accentGreen : colors.textSecondary} />
                  </View>
                  <Text className={`text-sm font-bold ${payoffStrategy === "avalanche" ? "text-accent-green" : "text-text-primary"}`}>
                    Avalanche
                  </Text>
                </View>
                <Text className="text-[10px] text-text-muted">Highest rate first. Saves the most money on interest.</Text>
                {payoffStrategy === "avalanche" && (
                  <View className="flex-row items-center gap-1 mt-2">
                    <CheckCircle size={12} color={colors.accentGreen} />
                    <Text className="text-[10px] font-medium text-accent-green">Recommended</Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => setPayoffStrategy("snowball")}
                className={`flex-1 rounded-xl p-4 border ${
                  payoffStrategy === "snowball"
                    ? "border-accent-blue bg-accent-blue/5"
                    : "border-border-primary bg-bg-card"
                }`}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <View className={`w-9 h-9 rounded-lg items-center justify-center ${payoffStrategy === "snowball" ? "bg-accent-blue/15" : "bg-bg-input/80"}`}>
                    <Snowflake size={18} color={payoffStrategy === "snowball" ? colors.accentBlue : colors.textSecondary} />
                  </View>
                  <Text className={`text-sm font-bold ${payoffStrategy === "snowball" ? "text-accent-blue" : "text-text-primary"}`}>
                    Snowball
                  </Text>
                </View>
                <Text className="text-[10px] text-text-muted">Smallest balance first. Quick wins build momentum.</Text>
                {payoffStrategy === "snowball" && (
                  <View className="flex-row items-center gap-1 mt-2">
                    <CheckCircle size={12} color={colors.accentBlue} />
                    <Text className="text-[10px] font-medium text-accent-blue">Selected</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* Payoff order */}
            <SectionHeader
              title={`${payoffStrategy === "avalanche" ? "Avalanche" : "Snowball"} Order`}
              total={`${payoffStrategy === "avalanche" ? "Highest rate" : "Smallest balance"} first`}
              className="mb-2"
            />

            {(payoffStrategy === "avalanche" ? avalancheDebts : snowballDebts).map((debt, idx) => {
              const payoffPct = Math.round(
                ((debt.balance > 0 ? 1 - debt.balance / (debt.balance + debt.minPayment * 12) : 0) * 100)
              );
              const isFirst = idx === 0;

              return (
                <Card key={debt.id} className={`mb-3 ${isFirst ? "border-accent-green/30" : ""}`}>
                  <View className="flex-row items-center gap-3 mb-2">
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isFirst ? "bg-accent-green/15" : "bg-bg-input/80"}`}>
                      <Text className={`text-sm font-bold ${isFirst ? "text-accent-green" : "text-text-secondary"}`}>
                        {idx + 1}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary">{debt.name}</Text>
                      <Text className="text-[10px] text-text-muted">
                        {debt.rate}% APR {"\u00B7"} Min {formatCurrency(debt.minPayment)}/mo
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-sm font-bold text-text-primary">{formatCurrency(debt.balance)}</Text>
                      {isFirst && (
                        <View className="bg-accent-green/10 px-1.5 py-0.5 rounded-full mt-0.5">
                          <Text className="text-[9px] font-medium text-accent-green">Pay first</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {isFirst && (
                    <View className="bg-accent-green/5 rounded-lg p-2.5 mt-1">
                      <Text className="text-[10px] text-accent-green">
                        {payoffStrategy === "avalanche"
                          ? "Focus extra payments here to minimize total interest paid."
                          : "Eliminate this balance first for a quick psychological win."}
                      </Text>
                    </View>
                  )}
                </Card>
              );
            })}

            {/* Strategy comparison */}
            <SectionHeader title="Strategy Comparison" className="mb-2 mt-2" />
            <Card className="mb-4">
              <View className="gap-3">
                <View className="flex-row items-center justify-between py-2 border-b border-border-primary/30">
                  <Text className="text-xs text-text-secondary">Method</Text>
                  <View className="flex-row gap-6">
                    <Text className="text-xs font-bold text-accent-green w-20 text-right">Avalanche</Text>
                    <Text className="text-xs font-bold text-accent-blue w-20 text-right">Snowball</Text>
                  </View>
                </View>
                {[
                  { metric: "Order", avalanche: "Highest APR", snowball: "Lowest bal." },
                  { metric: "Total Interest", avalanche: "~$18,200", snowball: "~$19,400" },
                  { metric: "Interest Saved", avalanche: "$1,200 more", snowball: "Baseline" },
                  { metric: "First Payoff", avalanche: "~8 months", snowball: "~6 months" },
                  { metric: "Debt-Free In", avalanche: "~18 years", snowball: "~18 years" },
                  { metric: "Best For", avalanche: "Savers", snowball: "Motivation" },
                ].map((row) => (
                  <View key={row.metric} className="flex-row items-center justify-between py-2 border-b border-border-primary/20">
                    <Text className="text-xs text-text-muted">{row.metric}</Text>
                    <View className="flex-row gap-6">
                      <Text className="text-xs font-medium text-text-primary w-20 text-right">{row.avalanche}</Text>
                      <Text className="text-xs font-medium text-text-primary w-20 text-right">{row.snowball}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                Avalanche method saves ~$1,200 more in interest.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Your credit cards have 21-23% APR. Targeting those first with the avalanche method is mathematically optimal. Add an extra $200/mo to accelerate payoff by 3 months.
              </Text>
            </Card>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
