import { useState } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import Card from "../components/Card";
import AnimatedNumber from "../components/AnimatedNumber";
import DonutChart from "../components/DonutChart";
import SectionHeader from "../components/SectionHeader";
import ProgressBar from "../components/ProgressBar";
import AccountListItem from "../components/AccountListItem";
import { formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";
import {
  totalPortfolio,
  portfolioAllocations,
  portfolioPerformance,
  financialAccounts,
} from "../lib/data";
import { RootStackParamList } from "../navigation/types";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Home,
  Car,
  Building,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type AssetTab = "portfolio" | "accounts" | "property";

const tabs: { id: AssetTab; label: string }[] = [
  { id: "portfolio", label: "Portfolio" },
  { id: "accounts", label: "Accounts" },
  { id: "property", label: "Property" },
];

// Group accounts by category
const cashAccounts = financialAccounts.filter((a) => a.category === "cash");
const investmentAccounts = financialAccounts.filter(
  (a) => a.category === "investment"
);
const otherAssetAccounts = financialAccounts.filter(
  (a) => a.category === "other_asset"
);
const creditCardAccounts = financialAccounts.filter(
  (a) => a.category === "credit_card"
);
const loanAccounts = financialAccounts.filter((a) => a.category === "loan");

// Real estate properties from financial accounts
const propertyAccounts = financialAccounts.filter(
  (a) => a.type === "property"
);

// Real estate enriched data
const realEstateProperties = [
  {
    id: "prop-1",
    name: "451 2nd Street",
    type: "Primary Residence",
    estimatedValue: 685000,
    mortgageBalance: 284000,
    equity: 401000,
    equityPercent: 59,
    icon: "home",
  },
];

export default function AssetsScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<AssetTab>("portfolio");

  // Performance calculation
  const startValue = portfolioPerformance[0]?.portfolio ?? 0;
  const endValue =
    portfolioPerformance[portfolioPerformance.length - 1]?.portfolio ?? 0;
  const performanceChange = endValue - startValue;
  const performancePercent =
    startValue > 0 ? ((performanceChange / startValue) * 100).toFixed(1) : "0";

  const benchmarkStart = portfolioPerformance[0]?.benchmark ?? 0;
  const benchmarkEnd =
    portfolioPerformance[portfolioPerformance.length - 1]?.benchmark ?? 0;
  const benchmarkChange = benchmarkEnd - benchmarkStart;
  const benchmarkPercent =
    benchmarkStart > 0
      ? ((benchmarkChange / benchmarkStart) * 100).toFixed(1)
      : "0";

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
            <Text className="text-xs text-text-secondary">Assets</Text>
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

        {/* ─── Portfolio Tab ─── */}
        {activeTab === "portfolio" && (
          <View>
            {/* Total Assets Hero */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">
                Total Assets
              </Text>
              <AnimatedNumber
                value={totalPortfolio}
                prefix="$"
                className="text-3xl font-bold text-accent-green"
              />
              <View className="flex-row items-center gap-1 mt-1">
                <TrendingUp size={12} color={colors.accentGreen} />
                <Text className="text-xs text-accent-green">
                  +{formatCurrency(performanceChange, { compact: true })} (
                  {performancePercent}%) 12mo
                </Text>
              </View>
            </Card>

            {/* Allocation Donut */}
            <SectionHeader title="Asset Allocation" className="mb-2" />
            <Card className="mb-4">
              <View className="flex-row items-center gap-4">
                <DonutChart
                  segments={portfolioAllocations.map((a) => ({
                    label: a.label,
                    value: a.value,
                    percent: a.percent,
                    color: a.color,
                  }))}
                  size={140}
                  strokeWidth={16}
                  centerValue={formatCurrency(totalPortfolio, { compact: true })}
                  centerLabel="Total"
                />
                <View className="flex-1 gap-2">
                  {portfolioAllocations.map((a) => (
                    <View key={a.id} className="flex-row items-center gap-2">
                      <View
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: a.color }}
                      />
                      <Text
                        className="text-[10px] text-text-secondary flex-1"
                        numberOfLines={1}
                      >
                        {a.label}
                      </Text>
                      <Text className="text-[10px] font-medium text-text-primary">
                        {a.percent}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

            {/* Allocation Breakdown */}
            <SectionHeader title="By Value" className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {portfolioAllocations.map((a, i) => (
                <View
                  key={a.id}
                  className={`flex-row items-center gap-3 py-3.5 px-4 ${
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }`}
                >
                  <View
                    className="w-3 h-8 rounded-sm"
                    style={{ backgroundColor: a.color }}
                  />
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-text-primary">
                      {a.label}
                    </Text>
                    <Text className="text-[10px] text-text-muted">
                      {a.percent}% of portfolio
                    </Text>
                  </View>
                  <Text className="text-sm font-bold text-text-primary">
                    {formatCurrency(a.value, { compact: true })}
                  </Text>
                </View>
              ))}
            </Card>

            {/* Performance Comparison */}
            <SectionHeader title="Performance (12 months)" className="mb-2" />
            <Card className="mb-4">
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-bg-input/30 rounded-lg p-3">
                  <Text className="text-[10px] text-text-muted mb-0.5">
                    Your Portfolio
                  </Text>
                  <Text className="text-lg font-bold text-accent-green">
                    +{performancePercent}%
                  </Text>
                  <Text className="text-[10px] text-text-muted">
                    +{formatCurrency(performanceChange, { compact: true })}
                  </Text>
                </View>
                <View className="flex-1 bg-bg-input/30 rounded-lg p-3">
                  <Text className="text-[10px] text-text-muted mb-0.5">
                    Benchmark (S&P)
                  </Text>
                  <Text className="text-lg font-bold text-text-secondary">
                    +{benchmarkPercent}%
                  </Text>
                  <Text className="text-[10px] text-text-muted">
                    +{formatCurrency(benchmarkChange, { compact: true })}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1.5 justify-center">
                {Number(performancePercent) >= Number(benchmarkPercent) ? (
                  <TrendingUp size={12} color={colors.accentGreen} />
                ) : (
                  <TrendingDown size={12} color={colors.accentRed} />
                )}
                <Text
                  className={`text-xs font-medium ${
                    Number(performancePercent) >= Number(benchmarkPercent)
                      ? "text-accent-green"
                      : "text-accent-red"
                  }`}
                >
                  {Number(performancePercent) >= Number(benchmarkPercent)
                    ? "Outperforming"
                    : "Underperforming"}{" "}
                  benchmark by{" "}
                  {Math.abs(
                    Number(performancePercent) - Number(benchmarkPercent)
                  ).toFixed(1)}
                  %
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
                Consider rebalancing: Real estate is 26% of your portfolio.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Your real estate allocation is above the recommended 15-20% for
                diversified portfolios. Consider shifting $50-75k into index
                funds or bonds to reduce concentration risk and improve
                liquidity.
              </Text>
            </Card>
          </View>
        )}

        {/* ─── Accounts Tab ─── */}
        {activeTab === "accounts" && (
          <View>
            {/* Cash Accounts */}
            <SectionHeader
              title="Cash Accounts"
              total={formatCurrency(
                cashAccounts.reduce((s, a) => s + a.balance, 0),
                { compact: true }
              )}
              className="mb-2"
            />
            <Card className="mb-4 !p-0 overflow-hidden">
              {cashAccounts.map((account, i) => (
                <View
                  key={account.id}
                  className={
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }
                >
                  <AccountListItem
                    name={account.name}
                    institution={account.institution}
                    balance={account.balance}
                    icon={account.icon}
                  />
                </View>
              ))}
            </Card>

            {/* Investment Accounts */}
            <SectionHeader
              title="Investments"
              total={formatCurrency(
                investmentAccounts.reduce((s, a) => s + a.balance, 0),
                { compact: true }
              )}
              className="mb-2"
            />
            <Card className="mb-4 !p-0 overflow-hidden">
              {investmentAccounts.map((account, i) => (
                <View
                  key={account.id}
                  className={
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }
                >
                  <AccountListItem
                    name={account.name}
                    institution={account.institution}
                    balance={account.balance}
                    icon={account.icon}
                  />
                </View>
              ))}
            </Card>

            {/* Other Assets */}
            <SectionHeader
              title="Other Assets"
              total={formatCurrency(
                otherAssetAccounts.reduce((s, a) => s + a.balance, 0),
                { compact: true }
              )}
              className="mb-2"
            />
            <Card className="mb-4 !p-0 overflow-hidden">
              {otherAssetAccounts.map((account, i) => (
                <View
                  key={account.id}
                  className={
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }
                >
                  <AccountListItem
                    name={account.name}
                    institution={
                      account.institution || account.type.replace("_", " ")
                    }
                    balance={account.balance}
                    icon={account.icon}
                  />
                </View>
              ))}
            </Card>

            {/* Credit Cards */}
            <SectionHeader
              title="Credit Cards"
              total={formatCurrency(
                creditCardAccounts.reduce((s, a) => s + a.balance, 0)
              )}
              className="mb-2"
            />
            <Card className="mb-4 !p-0 overflow-hidden">
              {creditCardAccounts.map((account, i) => (
                <View
                  key={account.id}
                  className={
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }
                >
                  <AccountListItem
                    name={account.name}
                    institution={account.institution}
                    balance={account.balance}
                    icon={account.icon}
                    creditLimit={account.creditLimit}
                  />
                </View>
              ))}
            </Card>

            {/* Loans */}
            <SectionHeader
              title="Loans"
              total={formatCurrency(
                loanAccounts.reduce((s, a) => s + a.balance, 0),
                { compact: true }
              )}
              className="mb-2"
            />
            <Card className="mb-6 !p-0 overflow-hidden">
              {loanAccounts.map((account, i) => (
                <View
                  key={account.id}
                  className={
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }
                >
                  <AccountListItem
                    name={account.name}
                    institution={account.institution}
                    balance={account.balance}
                    icon={account.icon}
                  />
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* ─── Property Tab ─── */}
        {activeTab === "property" && (
          <View>
            {/* Property Summary */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">
                Total Real Estate Value
              </Text>
              <AnimatedNumber
                value={realEstateProperties.reduce(
                  (s, p) => s + p.estimatedValue,
                  0
                )}
                prefix="$"
                className="text-3xl font-bold text-accent-green"
              />
              <View className="flex-row gap-4 mt-3 pt-3 border-t border-white/5">
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">
                    Total Equity
                  </Text>
                  <Text className="text-lg font-bold text-accent-green">
                    {formatCurrency(
                      realEstateProperties.reduce((s, p) => s + p.equity, 0),
                      { compact: true }
                    )}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">
                    Mortgage Balance
                  </Text>
                  <Text className="text-lg font-bold text-text-primary">
                    {formatCurrency(
                      realEstateProperties.reduce(
                        (s, p) => s + p.mortgageBalance,
                        0
                      ),
                      { compact: true }
                    )}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Property Cards */}
            <SectionHeader
              title="Properties"
              total={`${realEstateProperties.length} propert${
                realEstateProperties.length === 1 ? "y" : "ies"
              }`}
              className="mb-2"
            />
            {realEstateProperties.map((prop) => (
              <Card key={prop.id} className="mb-3">
                <View className="flex-row items-start gap-3 mb-3">
                  <View className="w-10 h-10 rounded-xl bg-bg-input/80 items-center justify-center">
                    <Home size={18} color={colors.accentBlue} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary">
                      {prop.name}
                    </Text>
                    <Text className="text-xs text-text-muted">{prop.type}</Text>
                  </View>
                </View>

                <View className="flex-row gap-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-[10px] text-text-muted">Value</Text>
                    <Text className="text-sm font-bold text-text-primary">
                      {formatCurrency(prop.estimatedValue, { compact: true })}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] text-text-muted">
                      Mortgage
                    </Text>
                    <Text className="text-sm font-bold text-text-primary">
                      {formatCurrency(prop.mortgageBalance, { compact: true })}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] text-text-muted">Equity</Text>
                    <Text className="text-sm font-bold text-accent-green">
                      {formatCurrency(prop.equity, { compact: true })}
                    </Text>
                  </View>
                </View>

                {/* Equity Bar */}
                <View>
                  <View className="flex-row items-center justify-between mb-1.5">
                    <Text className="text-xs text-text-secondary">
                      Equity Position
                    </Text>
                    <Text className="text-xs font-medium text-accent-green">
                      {prop.equityPercent}%
                    </Text>
                  </View>
                  <View className="h-3 rounded-full bg-bg-input/50 overflow-hidden">
                    <View
                      className="h-3 rounded-full bg-accent-green"
                      style={{ width: `${prop.equityPercent}%` }}
                    />
                  </View>
                  <View className="flex-row items-center justify-between mt-1.5">
                    <Text className="text-[10px] text-text-muted">
                      Owed:{" "}
                      {formatCurrency(prop.mortgageBalance, { compact: true })}
                    </Text>
                    <Text className="text-[10px] text-text-muted">
                      Value:{" "}
                      {formatCurrency(prop.estimatedValue, { compact: true })}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}

            {/* Vehicles */}
            <SectionHeader title="Vehicles" className="mb-2 mt-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {financialAccounts
                .filter((a) => a.type === "vehicle")
                .map((vehicle, i) => (
                  <View
                    key={vehicle.id}
                    className={`flex-row items-center gap-3 py-3.5 px-4 ${
                      i > 0 ? "border-t border-border-primary/30" : ""
                    }`}
                  >
                    <View className="w-10 h-10 rounded-xl bg-bg-input/80 items-center justify-center">
                      <Car size={18} color={colors.accentPurple} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-text-primary">
                        {vehicle.name}
                      </Text>
                      <Text className="text-xs text-text-muted">
                        Estimated value
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-text-primary">
                      {formatCurrency(vehicle.balance, { compact: true })}
                    </Text>
                  </View>
                ))}
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
                Home may be over-assessed by ~$28k.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Filing a property tax protest could save ~$3,200/yr. Your 59%
                equity position is strong — consider a HELOC for investment
                diversification if needed.
              </Text>
            </Card>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
