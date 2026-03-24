import { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";
import SectionHeader from "../components/SectionHeader";
import BudgetBar from "../components/BudgetBar";
import BarChart from "../components/BarChart";
import { formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";
import {
  monthlyCashflow,
  budgetCategories,
  budgetTotalBudgeted,
  budgetTotalActual,
  cashFlowHistory,
  cashFlowProjection,
} from "../lib/data";
import { RootStackParamList } from "../navigation/types";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type CashTab = "overview" | "budget" | "forecast";

const tabs: { id: CashTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "budget", label: "Budget" },
  { id: "forecast", label: "Forecast" },
];

export default function CashFlowScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<CashTab>("overview");

  const budgetUsedPercent = Math.round(
    (budgetTotalActual / budgetTotalBudgeted) * 100
  );
  const budgetRemaining = budgetTotalBudgeted - budgetTotalActual;
  const overBudgetCategories = budgetCategories.filter(
    (c) => c.actual > c.budgeted
  );

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
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
          <View className="border border-border-secondary rounded-full px-3 py-1">
            <Text className="text-xs text-text-secondary">Cash Flow</Text>
          </View>
        </View>

        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-b border-border-primary mb-5"
        >
          <View className="flex-row">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className="px-4 pb-3"
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-accent-green" : "text-text-muted"
                    }`}
                  >
                    {tab.label}
                  </Text>
                  {isActive && (
                    <View className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-accent-green rounded-full" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* ─── Overview Tab ─── */}
        {activeTab === "overview" && (
          <View>
            {/* Net Cash Flow Hero */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">
                Net Cash Flow This Month
              </Text>
              <AnimatedNumber
                value={monthlyCashflow.net}
                prefix="+$"
                className="text-3xl font-bold text-accent-green"
              />
              <Text className="text-xs text-text-muted mt-1">
                Income minus spending for this period
              </Text>
            </Card>

            {/* Income vs Spending */}
            <Card className="mb-4">
              <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-3">
                Income vs Spending
              </Text>
              <View className="gap-3">
                {/* Income bar */}
                <View>
                  <View className="flex-row items-center justify-between mb-1.5">
                    <View className="flex-row items-center gap-2">
                      <ArrowUpRight size={14} color={colors.accentGreen} />
                      <Text className="text-sm font-medium text-text-primary">
                        Income
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-accent-green">
                      {formatCurrency(monthlyCashflow.income)}
                    </Text>
                  </View>
                  <View className="h-3 rounded-full bg-bg-input/50 overflow-hidden">
                    <View
                      className="h-3 rounded-full bg-accent-green"
                      style={{ width: "100%" }}
                    />
                  </View>
                </View>
                {/* Spending bar */}
                <View>
                  <View className="flex-row items-center justify-between mb-1.5">
                    <View className="flex-row items-center gap-2">
                      <ArrowDownRight size={14} color={colors.accentOrange} />
                      <Text className="text-sm font-medium text-text-primary">
                        Spending
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-accent-orange">
                      {formatCurrency(monthlyCashflow.spending)}
                    </Text>
                  </View>
                  <View className="h-3 rounded-full bg-bg-input/50 overflow-hidden">
                    <View
                      className="h-3 rounded-full bg-accent-orange"
                      style={{
                        width: `${Math.round(
                          (monthlyCashflow.spending / monthlyCashflow.income) *
                            100
                        )}%`,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-border-primary/50">
                <Text className="text-xs text-text-muted">Savings rate</Text>
                <Text className="text-sm font-bold text-accent-green">
                  {Math.round(
                    (monthlyCashflow.net / monthlyCashflow.income) * 100
                  )}
                  %
                </Text>
              </View>
            </Card>

            {/* Cash Flow Breakdown */}
            <View className="flex-row gap-2 mb-4">
              <View className="flex-1 bg-bg-card border border-border-primary rounded-xl p-3">
                <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Business
                </Text>
                <Text className="text-lg font-bold text-accent-blue">
                  +{formatCurrency(monthlyCashflow.business)}
                </Text>
                <Text className="text-[10px] text-text-muted">
                  contribution
                </Text>
              </View>
              <View className="flex-1 bg-bg-card border border-border-primary rounded-xl p-3">
                <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  Personal
                </Text>
                <Text className="text-lg font-bold text-accent-purple">
                  +{formatCurrency(monthlyCashflow.individual)}
                </Text>
                <Text className="text-[10px] text-text-muted">
                  contribution
                </Text>
              </View>
            </View>

            {/* 6-Month Trend */}
            <SectionHeader title="6-Month Trend" className="mb-2" />
            <Card className="mb-4">
              <BarChart
                data={cashFlowHistory.map((m) => ({
                  label: m.month,
                  value: m.income,
                  secondValue: m.expenses,
                }))}
                height={140}
                barColor="bg-accent-green"
                secondBarColor="bg-accent-orange/70"
                showValues
              />
              <View className="flex-row items-center justify-center gap-4 mt-3 pt-3 border-t border-border-primary/50">
                <View className="flex-row items-center gap-1.5">
                  <View className="w-2.5 h-2.5 rounded-sm bg-accent-green" />
                  <Text className="text-[10px] text-text-muted">Income</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <View className="w-2.5 h-2.5 rounded-sm bg-accent-orange/70" />
                  <Text className="text-[10px] text-text-muted">Expenses</Text>
                </View>
              </View>
            </Card>

            {/* AI CFO Insight */}
            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO
                </Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                {overBudgetCategories.length > 0
                  ? `${overBudgetCategories.length} categor${
                      overBudgetCategories.length === 1 ? "y is" : "ies are"
                    } over budget this month.`
                  : "All categories are within budget this month."}
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                {overBudgetCategories.length > 0
                  ? `${overBudgetCategories
                      .map(
                        (c) =>
                          `${c.name} ($${(c.actual - c.budgeted).toLocaleString()} over)`
                      )
                      .join(
                        ", "
                      )}. Consider reducing discretionary spending to stay within your ${formatCurrency(budgetTotalBudgeted)} monthly budget.`
                  : `Great job keeping your spending at ${formatCurrency(budgetTotalActual)} within the ${formatCurrency(budgetTotalBudgeted)} budget.`}
              </Text>
            </Card>
          </View>
        )}

        {/* ─── Budget Tab ─── */}
        {activeTab === "budget" && (
          <View>
            {/* Budget Summary */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">
                Monthly Budget
              </Text>
              <View className="flex-row items-end gap-2">
                <AnimatedNumber
                  value={budgetTotalActual}
                  prefix="$"
                  className="text-3xl font-bold text-text-primary"
                />
                <Text className="text-sm text-text-muted mb-1">
                  / {formatCurrency(budgetTotalBudgeted)}
                </Text>
              </View>
              <View className="mt-3">
                <View className="h-3 rounded-full bg-bg-input/50 overflow-hidden">
                  <View
                    className={`h-3 rounded-full ${
                      budgetUsedPercent > 100
                        ? "bg-accent-red"
                        : "bg-accent-green"
                    }`}
                    style={{
                      width: `${Math.min(budgetUsedPercent, 100)}%`,
                    }}
                  />
                </View>
                <View className="flex-row items-center justify-between mt-1.5">
                  <Text className="text-[10px] text-text-muted">
                    {budgetUsedPercent}% used
                  </Text>
                  <Text
                    className={`text-[10px] font-medium ${
                      budgetRemaining < 0
                        ? "text-accent-red"
                        : "text-accent-green"
                    }`}
                  >
                    {budgetRemaining < 0
                      ? `$${Math.abs(budgetRemaining).toLocaleString()} over`
                      : `$${budgetRemaining.toLocaleString()} remaining`}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Budget Categories */}
            <SectionHeader
              title="By Category"
              total={`${budgetCategories.length} categories`}
              className="mb-2"
            />
            <Card className="mb-4">
              {budgetCategories.map((cat, i) => (
                <View
                  key={cat.id}
                  className={
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }
                >
                  <BudgetBar
                    name={cat.name}
                    budgeted={cat.budgeted}
                    actual={cat.actual}
                    icon={cat.icon}
                    color={cat.color}
                  />
                </View>
              ))}
            </Card>

            {/* Over Budget Alert */}
            {overBudgetCategories.length > 0 && (
              <>
                <SectionHeader
                  title="Over Budget"
                  total={`${overBudgetCategories.length} categories`}
                  className="mb-2"
                />
                <Card className="mb-4">
                  {overBudgetCategories.map((cat) => (
                    <View
                      key={cat.id}
                      className="flex-row items-center justify-between py-2.5 border-b border-border-primary/30"
                    >
                      <Text className="text-sm font-medium text-text-primary">
                        {cat.name}
                      </Text>
                      <View className="items-end">
                        <Text className="text-sm font-bold text-accent-red">
                          +{formatCurrency(cat.actual - cat.budgeted)}
                        </Text>
                        <Text className="text-[10px] text-text-muted">
                          over budget
                        </Text>
                      </View>
                    </View>
                  ))}
                </Card>
              </>
            )}

            {/* AI CFO */}
            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO
                </Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                Food & Dining is $220 over budget this month.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Restaurants ($480) and meal delivery ($180) are driving the
                overage. Consider meal prepping or reducing restaurant visits to
                stay within the $1,400 target.
              </Text>
            </Card>
          </View>
        )}

        {/* ─── Forecast Tab ─── */}
        {activeTab === "forecast" && (
          <View>
            {/* Projection Summary */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">
                12-Month Projected Net Cash Flow
              </Text>
              <AnimatedNumber
                value={cashFlowProjection.reduce((s, m) => s + m.net, 0)}
                prefix="+$"
                className="text-3xl font-bold text-accent-green"
              />
              <Text className="text-xs text-text-muted mt-1">
                Total projected surplus over next 12 months
              </Text>
            </Card>

            {/* Forecast Chart */}
            <SectionHeader title="Monthly Forecast" className="mb-2" />
            <Card className="mb-4">
              <BarChart
                data={cashFlowProjection.map((m) => ({
                  label: m.month,
                  value: m.net,
                }))}
                height={120}
                barColor="bg-accent-green"
                showValues
              />
            </Card>

            {/* Forecast Table */}
            <SectionHeader title="Detailed Projection" className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {/* Table Header */}
              <View className="flex-row items-center py-2.5 px-4 bg-bg-input/30 border-b border-border-primary">
                <Text className="flex-1 text-[10px] font-semibold text-text-muted uppercase">
                  Month
                </Text>
                <Text className="w-20 text-right text-[10px] font-semibold text-text-muted uppercase">
                  Income
                </Text>
                <Text className="w-20 text-right text-[10px] font-semibold text-text-muted uppercase">
                  Expenses
                </Text>
                <Text className="w-20 text-right text-[10px] font-semibold text-text-muted uppercase">
                  Net
                </Text>
              </View>
              {/* Table Rows */}
              {cashFlowProjection.map((m, i) => (
                <View
                  key={m.month}
                  className={`flex-row items-center py-3 px-4 ${
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }`}
                >
                  <Text className="flex-1 text-xs font-medium text-text-primary">
                    {m.month}
                  </Text>
                  <Text className="w-20 text-right text-xs text-text-secondary">
                    {formatCurrency(m.income, { compact: true })}
                  </Text>
                  <Text className="w-20 text-right text-xs text-text-secondary">
                    {formatCurrency(m.expenses, { compact: true })}
                  </Text>
                  <Text className="w-20 text-right text-xs font-bold text-accent-green">
                    +{formatCurrency(m.net, { compact: true })}
                  </Text>
                </View>
              ))}
              {/* Total Row */}
              <View className="flex-row items-center py-3 px-4 bg-bg-input/20 border-t border-border-primary">
                <Text className="flex-1 text-xs font-bold text-text-primary">
                  Total
                </Text>
                <Text className="w-20 text-right text-xs font-bold text-text-primary">
                  {formatCurrency(
                    cashFlowProjection.reduce((s, m) => s + m.income, 0),
                    { compact: true }
                  )}
                </Text>
                <Text className="w-20 text-right text-xs font-bold text-text-primary">
                  {formatCurrency(
                    cashFlowProjection.reduce((s, m) => s + m.expenses, 0),
                    { compact: true }
                  )}
                </Text>
                <Text className="w-20 text-right text-xs font-bold text-accent-green">
                  +
                  {formatCurrency(
                    cashFlowProjection.reduce((s, m) => s + m.net, 0),
                    { compact: true }
                  )}
                </Text>
              </View>
            </Card>

            {/* AI CFO */}
            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI CFO
                </Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                December may be tight with $39.2k projected expenses.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Holiday spending typically spikes 12-15%. Consider setting aside
                an extra $2,000 in November to cover the December surplus dip.
                Your projected annual savings of{" "}
                {formatCurrency(
                  cashFlowProjection.reduce((s, m) => s + m.net, 0),
                  { compact: true }
                )}{" "}
                remains strong.
              </Text>
            </Card>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
