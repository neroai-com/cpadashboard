import { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";
import SparklineChart from "../components/SparklineChart";
import ChangeBadge from "../components/ChangeBadge";
import ProgressBar from "../components/ProgressBar";
import SectionHeader from "../components/SectionHeader";
import Accordion from "../components/Accordion";
import AccountListItem from "../components/AccountListItem";
import { formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";
import { RootStackParamList } from "../navigation/types";
import {
  combinedNetWorth,
  combinedNetWorthHistory,
  financialAccounts,
  personalNetWorth,
  businessEquity,
  otherEstateValue,
  netWorthSummary,
  netWorthFAQs,
  debtHistory,
  mortgages,
  creditCardDetails,
  loanDetails,
} from "../lib/data";
import {
  ArrowLeft,
  Landmark,
  PiggyBank,
  TrendingUp,
  Home,
  Car,
  CreditCard,
  GraduationCap,
  Briefcase,
  Package,
  Sparkles,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type NWTab = "summary" | "assets" | "debt";

const tabs: { id: NWTab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "assets", label: "Assets" },
  { id: "debt", label: "Debt" },
];

/* ── Asset category grouping ── */
interface AssetCategory {
  id: string;
  label: string;
  icon: any;
  iconColor: string;
  filter: (a: (typeof financialAccounts)[0]) => boolean;
}

const assetCategories: AssetCategory[] = [
  {
    id: "checking",
    label: "Cash & Checking",
    icon: Landmark,
    iconColor: colors.accentBlue,
    filter: (a) => a.type === "checking",
  },
  {
    id: "savings",
    label: "Savings",
    icon: PiggyBank,
    iconColor: colors.accentGreen,
    filter: (a) => a.type === "savings",
  },
  {
    id: "investments",
    label: "Investments",
    icon: TrendingUp,
    iconColor: colors.accentPurple,
    filter: (a) => a.type === "investment",
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: Home,
    iconColor: colors.accentOrange,
    filter: (a) => a.type === "property",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    icon: Car,
    iconColor: colors.accentTeal,
    filter: (a) => a.type === "vehicle",
  },
  {
    id: "other",
    label: "Other (Estate, Insurance CV)",
    icon: Package,
    iconColor: colors.accentYellow,
    filter: () => false, // handled manually
  },
];

/* ── Debt items ── */
interface DebtItem {
  id: string;
  label: string;
  icon: any;
  iconColor: string;
  balance: number;
  originalAmount: number;
  rate: number;
  monthlyPayment: number;
}

const debtItems: DebtItem[] = [
  ...creditCardDetails.map((cc) => ({
    id: cc.id,
    label: cc.name,
    icon: CreditCard,
    iconColor: colors.accentOrange,
    balance: cc.balance,
    originalAmount: cc.creditLimit,
    rate: cc.apr,
    monthlyPayment: cc.minPayment,
  })),
  ...loanDetails.map((loan) => ({
    id: loan.id,
    label: loan.name,
    icon: loan.icon === "home" ? Home : Car,
    iconColor: loan.icon === "home" ? colors.accentBlue : colors.accentPurple,
    balance: loan.currentBalance,
    originalAmount: loan.originalAmount,
    rate: loan.interestRate,
    monthlyPayment: loan.monthlyPayment,
  })),
];

export default function NetWorthScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<NWTab>("summary");

  const { totalAssets, totalDebt } = netWorthSummary;
  const twelveMonthChange =
    combinedNetWorthHistory[combinedNetWorthHistory.length - 1].value -
    combinedNetWorthHistory[0].value;

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
            <Text className="text-xs text-text-secondary">Net Worth</Text>
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

        {/* ══════════ SUMMARY TAB ══════════ */}
        {activeTab === "summary" && (
          <View>
            {/* Hero card */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Combined Net Worth</Text>
              <AnimatedNumber value={combinedNetWorth} prefix="$" className="text-3xl font-bold text-accent-green" />
              <SparklineChart data={combinedNetWorthHistory} height={80} className="mt-3" />
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-white/5">
                <Text className="text-xs text-text-muted">12-month change</Text>
                <ChangeBadge value={twelveMonthChange} />
              </View>
            </Card>

            {/* Breakdown: Assets vs Debt */}
            <SectionHeader title="Breakdown" className="mb-2" />
            <Card className="mb-4">
              <View className="gap-3">
                {/* Total Assets */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="w-3 h-3 rounded-full bg-accent-green" />
                    <Text className="text-sm text-text-primary">Total Assets</Text>
                  </View>
                  <Text className="text-sm font-bold text-accent-green">{formatCurrency(totalAssets)}</Text>
                </View>
                <ProgressBar percent={100} color="bg-accent-green" height={6} />

                {/* Total Debt */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="w-3 h-3 rounded-full bg-accent-red" />
                    <Text className="text-sm text-text-primary">Total Debt</Text>
                  </View>
                  <Text className="text-sm font-bold text-accent-red">{formatCurrency(totalDebt)}</Text>
                </View>
                <ProgressBar percent={Math.round((totalDebt / totalAssets) * 100)} color="bg-accent-red" height={6} />

                {/* Divider and Net */}
                <View className="border-t border-border-primary/50 pt-3 flex-row items-center justify-between">
                  <Text className="text-xs font-semibold text-text-secondary">Personal Net Worth</Text>
                  <Text className="text-lg font-bold text-text-primary">{formatCurrency(personalNetWorth)}</Text>
                </View>
              </View>
            </Card>

            {/* Composition */}
            <SectionHeader title="Net Worth Composition" className="mb-2" />
            <Card className="mb-4">
              <View className="gap-3">
                {[
                  { label: "Personal (Assets − Debt)", value: personalNetWorth, color: "bg-accent-green" },
                  { label: "Business Equity", value: businessEquity, color: "bg-accent-blue" },
                  { label: "Other (Estate, Insurance)", value: otherEstateValue, color: "bg-accent-purple" },
                ].map((item) => {
                  const pct = Math.round((item.value / combinedNetWorth) * 100);
                  return (
                    <View key={item.label}>
                      <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center gap-2">
                          <View className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          <Text className="text-xs text-text-secondary">{item.label}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-xs font-bold text-text-primary">{formatCurrency(item.value)}</Text>
                          <Text className="text-[10px] text-text-muted">{pct}%</Text>
                        </View>
                      </View>
                      <ProgressBar percent={pct} color={item.color} height={4} />
                    </View>
                  );
                })}
              </View>
            </Card>

            {/* FAQ */}
            <SectionHeader title="Common Questions" className="mb-2" />
            <Card className="mb-4">
              <Accordion
                items={netWorthFAQs.map((faq) => ({
                  id: faq.id,
                  title: faq.question,
                  content: faq.answer,
                }))}
              />
            </Card>

            {/* AI insight */}
            <Card variant="hero" className="mb-6">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                Your net worth grew {formatCurrency(twelveMonthChange)} in the past 12 months.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Business equity is the largest contributor. Consider diversifying into index funds to reduce concentration risk.
              </Text>
            </Card>
          </View>
        )}

        {/* ══════════ ASSETS TAB ══════════ */}
        {activeTab === "assets" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Total Assets</Text>
              <AnimatedNumber value={totalAssets} prefix="$" className="text-3xl font-bold text-accent-green" />
              <Text className="text-xs text-text-muted mt-1">Across all personal accounts and property</Text>
            </Card>

            {assetCategories.map((cat) => {
              const accounts = cat.id === "other"
                ? [] // "Other" is a standalone value, not from accounts
                : financialAccounts.filter(cat.filter);
              const catTotal = cat.id === "other"
                ? otherEstateValue
                : accounts.reduce((s, a) => s + a.balance, 0);

              if (catTotal === 0) return null;

              const Icon = cat.icon;

              return (
                <View key={cat.id} className="mb-4">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center"
                      style={{ backgroundColor: cat.iconColor + "18" }}
                    >
                      <Icon size={16} color={cat.iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary">{cat.label}</Text>
                    </View>
                    <Text className="text-sm font-bold text-text-primary">{formatCurrency(catTotal)}</Text>
                  </View>

                  {accounts.length > 0 ? (
                    <Card className="!p-0 overflow-hidden">
                      {accounts.map((acct, i) => (
                        <AccountListItem
                          key={acct.id}
                          name={acct.name}
                          institution={acct.institution || undefined}
                          balance={acct.balance}
                          icon={acct.icon}
                          className={i > 0 ? "border-t border-border-primary/30" : ""}
                        />
                      ))}
                    </Card>
                  ) : (
                    <Card>
                      <Text className="text-xs text-text-muted">
                        Includes life insurance cash value, crypto, and collectibles.
                      </Text>
                    </Card>
                  )}
                </View>
              );
            })}

            {/* Business equity note */}
            <SectionHeader title="Business Equity" className="mb-2" />
            <Card className="mb-6">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl items-center justify-center bg-accent-blue/10">
                  <Briefcase size={18} color={colors.accentBlue} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-text-primary">Combined Entity Equity</Text>
                  <Text className="text-xs text-text-muted">Johnson Realty, BlueLake, Riverbend</Text>
                </View>
                <Text className="text-lg font-bold text-accent-blue">{formatCurrency(businessEquity)}</Text>
              </View>
              <Text className="text-[10px] text-text-muted mt-2">
                Business equity is included in combined net worth but tracked separately from personal assets.
              </Text>
            </Card>
          </View>
        )}

        {/* ══════════ DEBT TAB ══════════ */}
        {activeTab === "debt" && (
          <View>
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">Total Debt</Text>
              <AnimatedNumber value={totalDebt} prefix="$" className="text-3xl font-bold text-accent-red" />
              <SparklineChart
                data={debtHistory}
                height={60}
                color={colors.accentRed}
                className="mt-2"
              />
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-white/5">
                <Text className="text-xs text-text-muted">Month-over-month</Text>
                <ChangeBadge value={netWorthSummary.debtChange} invertColor />
              </View>
            </Card>

            <SectionHeader title="All Debts" total={`${debtItems.length} accounts`} className="mb-2" />

            {debtItems.map((debt) => {
              const paidOff = debt.originalAmount - debt.balance;
              const payoffPercent = Math.round((paidOff / debt.originalAmount) * 100);
              const Icon = debt.icon;

              return (
                <Card key={debt.id} className="mb-3">
                  <View className="flex-row items-center gap-3 mb-3">
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center"
                      style={{ backgroundColor: debt.iconColor + "18" }}
                    >
                      <Icon size={18} color={debt.iconColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary">{debt.label}</Text>
                      <Text className="text-[10px] text-text-muted">
                        {debt.rate}% APR  {"\u00B7"}  {formatCurrency(debt.monthlyPayment)}/mo
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-sm font-bold text-text-primary">{formatCurrency(debt.balance)}</Text>
                      <Text className="text-[10px] text-text-muted">remaining</Text>
                    </View>
                  </View>
                  <ProgressBar
                    percent={payoffPercent}
                    color="bg-accent-green"
                    height={6}
                    label="Payoff progress"
                    showPercent
                  />
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-[10px] text-text-muted">
                      {formatCurrency(paidOff)} paid of {formatCurrency(debt.originalAmount)}
                    </Text>
                  </View>
                </Card>
              );
            })}

            {/* AI insight */}
            <Card variant="hero" className="mb-6 mt-2">
              <View className="flex-row items-center gap-2 mb-1">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">AI CFO</Text>
              </View>
              <Text className="text-sm font-semibold text-text-primary">
                Debt reduced by {formatCurrency(Math.abs(netWorthSummary.debtChange))} this month.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Pay an extra $200/mo toward your highest-rate credit card to save ~$480 in interest this year.
              </Text>
            </Card>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
