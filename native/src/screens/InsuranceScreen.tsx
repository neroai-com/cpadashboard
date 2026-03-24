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
import PolicyCard from "../components/PolicyCard";
import { formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";
import {
  insurancePolicies,
  totalMonthlyPremiums,
  totalCoverage,
  insuranceInsights,
} from "../lib/data";
import { RootStackParamList } from "../navigation/types";
import {
  ArrowLeft,
  Sparkles,
  Shield,
  AlertTriangle,
  FileText,
  CheckCircle,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type InsuranceTab = "policies" | "coverage" | "claims";

const screenTabs: { id: InsuranceTab; label: string }[] = [
  { id: "policies", label: "Policies" },
  { id: "coverage", label: "Coverage" },
  { id: "claims", label: "Claims" },
];

const filterTypes = ["All", "Home", "Auto", "Life", "Health", "Umbrella"] as const;
type FilterType = (typeof filterTypes)[number];

// Coverage by type for donut chart
const coverageByType = (() => {
  const map: Record<string, { label: string; value: number; color: string }> =
    {};
  const typeColors: Record<string, string> = {
    life: "#a855f7",
    home: "#3b82f6",
    auto: "#f97316",
    health: "#22c55e",
    business: "#14b8a6",
    umbrella: "#eab308",
  };
  const typeLabels: Record<string, string> = {
    life: "Life",
    home: "Home",
    auto: "Auto",
    health: "Health",
    business: "Business",
    umbrella: "Umbrella",
  };

  for (const policy of insurancePolicies) {
    if (!map[policy.type]) {
      map[policy.type] = {
        label: typeLabels[policy.type] || policy.type,
        value: 0,
        color: typeColors[policy.type] || "#64748b",
      };
    }
    map[policy.type].value += policy.coverageAmount;
  }
  return Object.values(map);
})();

// Total coverage for percent calculation
const totalCoverageValue = coverageByType.reduce((s, c) => s + c.value, 0);

// Coverage gap analysis items
const coverageGaps = [
  {
    id: "gap-1",
    area: "Umbrella Liability",
    status: "missing" as const,
    recommendation:
      "With $2.85M net worth, add $1-2M umbrella policy (~$12-25/mo).",
  },
  {
    id: "gap-2",
    area: "Disability Insurance",
    status: "missing" as const,
    recommendation:
      "No disability coverage found. Consider long-term disability to protect income.",
  },
  {
    id: "gap-3",
    area: "Life Insurance",
    status: "adequate" as const,
    recommendation: "$1M term life covers ~2.5x annual household expenses.",
  },
  {
    id: "gap-4",
    area: "Home Insurance",
    status: "adequate" as const,
    recommendation:
      "Coverage matches estimated home value. Review annually.",
  },
  {
    id: "gap-5",
    area: "Auto Insurance",
    status: "expiring" as const,
    recommendation:
      "Both auto policies expire May 2026. Bundle with home to save ~$456/yr.",
  },
];

export default function InsuranceScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<InsuranceTab>("policies");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const totalAnnualPremium = totalMonthlyPremiums * 12;

  // Filter policies
  const filteredPolicies =
    activeFilter === "All"
      ? insurancePolicies
      : insurancePolicies.filter(
          (p) => p.type.toLowerCase() === activeFilter.toLowerCase()
        );

  // Count by status
  const activePolicies = insurancePolicies.filter(
    (p) => p.status === "active"
  ).length;
  const expiringPolicies = insurancePolicies.filter(
    (p) => p.status === "expiring"
  ).length;

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
            <Text className="text-xs text-text-secondary">Insurance</Text>
          </View>
        </View>

        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-b border-border-primary mb-5"
        >
          <View className="flex-row">
            {screenTabs.map((tab) => {
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

        {/* ─── Policies Tab ─── */}
        {activeTab === "policies" && (
          <View>
            {/* Premium Summary */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">
                Total Monthly Premiums
              </Text>
              <AnimatedNumber
                value={totalMonthlyPremiums}
                prefix="$"
                className="text-3xl font-bold text-text-primary"
              />
              <Text className="text-xs text-text-muted mt-1">
                {formatCurrency(totalAnnualPremium)}/yr across{" "}
                {insurancePolicies.length} policies
              </Text>
              <View className="flex-row gap-3 mt-3 pt-3 border-t border-white/5">
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">Active</Text>
                  <Text className="text-lg font-bold text-accent-green">
                    {activePolicies}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">Expiring</Text>
                  <Text className="text-lg font-bold text-accent-yellow">
                    {expiringPolicies}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] text-text-muted">
                    Total Coverage
                  </Text>
                  <Text className="text-lg font-bold text-text-primary">
                    {formatCurrency(totalCoverage, { compact: true })}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              <View className="flex-row gap-2">
                {filterTypes.map((type) => {
                  const isActive = activeFilter === type;
                  return (
                    <Pressable
                      key={type}
                      onPress={() => setActiveFilter(type)}
                      className={`px-3 py-1.5 rounded-full border ${
                        isActive
                          ? "bg-accent-green/10 border-accent-green/30"
                          : "border-border-secondary"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          isActive ? "text-accent-green" : "text-text-muted"
                        }`}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Policy Cards */}
            <SectionHeader
              title="Policies"
              total={`${filteredPolicies.length} shown`}
              className="mb-2"
            />
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                type={policy.type}
                name={policy.name}
                provider={policy.provider}
                premium={policy.premium}
                coverageAmount={policy.coverageAmount}
                deductible={policy.deductible}
                renewalDate={policy.renewalDate}
                status={policy.status}
                icon={policy.icon}
                className="mb-3"
              />
            ))}

            {/* Premium Breakdown */}
            <SectionHeader title="Premium Breakdown" className="mb-2 mt-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {insurancePolicies.map((policy, i) => (
                <View
                  key={policy.id}
                  className={`flex-row items-center gap-3 py-3 px-4 ${
                    i > 0 ? "border-t border-border-primary/30" : ""
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className="text-xs font-medium text-text-primary"
                      numberOfLines={1}
                    >
                      {policy.name}
                    </Text>
                    <Text className="text-[10px] text-text-muted">
                      {policy.provider}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs font-bold text-text-primary">
                      {formatCurrency(policy.premium)}/mo
                    </Text>
                    <Text className="text-[10px] text-text-muted">
                      {formatCurrency(policy.premium * 12)}/yr
                    </Text>
                  </View>
                </View>
              ))}
              {/* Total Row */}
              <View className="flex-row items-center justify-between py-3 px-4 bg-bg-input/20 border-t border-border-primary">
                <Text className="text-xs font-bold text-text-primary">
                  Total
                </Text>
                <View className="items-end">
                  <Text className="text-xs font-bold text-text-primary">
                    {formatCurrency(totalMonthlyPremiums)}/mo
                  </Text>
                  <Text className="text-[10px] text-text-muted">
                    {formatCurrency(totalAnnualPremium)}/yr
                  </Text>
                </View>
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
              {insuranceInsights.map((insight) => (
                <View key={insight.id} className="mt-2">
                  <Text className="text-sm font-semibold text-text-primary">
                    {insight.title}
                  </Text>
                  <Text className="text-xs text-text-muted mt-0.5">
                    {insight.description}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* ─── Coverage Tab ─── */}
        {activeTab === "coverage" && (
          <View>
            {/* Total Coverage Hero */}
            <Card variant="hero" className="mb-4">
              <Text className="text-xs text-text-muted mb-1">
                Total Coverage
              </Text>
              <AnimatedNumber
                value={totalCoverageValue}
                prefix="$"
                className="text-3xl font-bold text-accent-green"
              />
              <Text className="text-xs text-text-muted mt-1">
                Across {insurancePolicies.length} active policies
              </Text>
            </Card>

            {/* Coverage Donut */}
            <SectionHeader title="Coverage by Type" className="mb-2" />
            <Card className="mb-4">
              <View className="flex-row items-center gap-4">
                <DonutChart
                  segments={coverageByType.map((c) => ({
                    label: c.label,
                    value: c.value,
                    percent: Math.round((c.value / totalCoverageValue) * 100),
                    color: c.color,
                  }))}
                  size={140}
                  strokeWidth={16}
                  centerValue={formatCurrency(totalCoverageValue, {
                    compact: true,
                  })}
                  centerLabel="Total"
                />
                <View className="flex-1 gap-2">
                  {coverageByType.map((c) => (
                    <View key={c.label} className="flex-row items-center gap-2">
                      <View
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <Text
                        className="text-[10px] text-text-secondary flex-1"
                        numberOfLines={1}
                      >
                        {c.label}
                      </Text>
                      <Text className="text-[10px] font-medium text-text-primary">
                        {formatCurrency(c.value, { compact: true })}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>

            {/* Coverage Details */}
            <SectionHeader title="Coverage Details" className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {insurancePolicies.map((policy, i) => {
                const coveragePercent = Math.round(
                  (policy.coverageAmount / totalCoverageValue) * 100
                );
                return (
                  <View
                    key={policy.id}
                    className={`py-3.5 px-4 ${
                      i > 0 ? "border-t border-border-primary/30" : ""
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-1.5">
                      <Text className="text-sm font-medium text-text-primary">
                        {policy.name}
                      </Text>
                      <Text className="text-sm font-bold text-text-primary">
                        {formatCurrency(policy.coverageAmount, {
                          compact: true,
                        })}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <View className="flex-1 h-2 rounded-full bg-bg-input/50 overflow-hidden">
                        <View
                          className="h-2 rounded-full bg-accent-blue"
                          style={{ width: `${coveragePercent}%` }}
                        />
                      </View>
                      <Text className="text-[10px] text-text-muted w-8 text-right">
                        {coveragePercent}%
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-3 mt-1">
                      <Text className="text-[10px] text-text-muted">
                        Deductible:{" "}
                        {policy.deductible > 0
                          ? formatCurrency(policy.deductible)
                          : "N/A"}
                      </Text>
                      <Text className="text-[10px] text-text-muted">
                        Premium: {formatCurrency(policy.premium)}/mo
                      </Text>
                    </View>
                  </View>
                );
              })}
            </Card>

            {/* Coverage Gap Analysis */}
            <SectionHeader title="Coverage Gap Analysis" className="mb-2" />
            <Card className="mb-4 !p-0 overflow-hidden">
              {coverageGaps.map((gap, i) => {
                const statusConfig = {
                  missing: {
                    bg: "bg-accent-red/10",
                    text: "text-accent-red",
                    label: "Missing",
                    iconColor: colors.accentRed,
                  },
                  adequate: {
                    bg: "bg-accent-green/10",
                    text: "text-accent-green",
                    label: "Adequate",
                    iconColor: colors.accentGreen,
                  },
                  expiring: {
                    bg: "bg-accent-yellow/10",
                    text: "text-accent-yellow",
                    label: "Expiring",
                    iconColor: colors.accentYellow,
                  },
                };
                const config = statusConfig[gap.status];
                return (
                  <View
                    key={gap.id}
                    className={`flex-row items-start gap-3 py-3.5 px-4 ${
                      i > 0 ? "border-t border-border-primary/30" : ""
                    }`}
                  >
                    <View className="w-8 h-8 rounded-lg items-center justify-center mt-0.5"
                      style={{ backgroundColor: config.iconColor + "18" }}
                    >
                      {gap.status === "adequate" ? (
                        <CheckCircle size={14} color={config.iconColor} />
                      ) : gap.status === "expiring" ? (
                        <AlertTriangle size={14} color={config.iconColor} />
                      ) : (
                        <Shield size={14} color={config.iconColor} />
                      )}
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-0.5">
                        <Text className="text-sm font-medium text-text-primary">
                          {gap.area}
                        </Text>
                        <View className={`px-1.5 py-0.5 rounded-full ${config.bg}`}>
                          <Text
                            className={`text-[9px] font-medium ${config.text}`}
                          >
                            {config.label}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-text-muted">
                        {gap.recommendation}
                      </Text>
                    </View>
                  </View>
                );
              })}
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
                Two coverage gaps identified.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                You are missing umbrella liability and disability insurance. With
                a net worth of $2.85M and household income of{" "}
                {formatCurrency(42500 * 12, { compact: true })}/yr, these gaps
                represent significant risk. Adding both would cost approximately
                $45-65/mo for substantial protection.
              </Text>
            </Card>
          </View>
        )}

        {/* ─── Claims Tab ─── */}
        {activeTab === "claims" && (
          <View>
            {/* Empty State */}
            <Card className="mb-4 items-center py-12">
              <View className="w-16 h-16 rounded-full bg-bg-input/50 items-center justify-center mb-4">
                <FileText size={28} color={colors.textMuted} />
              </View>
              <Text className="text-lg font-semibold text-text-primary mb-1">
                No claims filed
              </Text>
              <Text className="text-sm text-text-muted text-center px-8">
                You have no insurance claims on record. Claims will appear here
                when filed.
              </Text>
            </Card>

            {/* Claims Info */}
            <SectionHeader title="Claims Information" className="mb-2" />
            <Card className="mb-4">
              <View className="gap-3">
                {[
                  {
                    label: "Active Policies",
                    value: `${insurancePolicies.length}`,
                    desc: "All eligible for claims",
                  },
                  {
                    label: "Claims This Year",
                    value: "0",
                    desc: "No claims filed in 2026",
                  },
                  {
                    label: "Claims History",
                    value: "Clean",
                    desc: "May qualify for claims-free discount",
                  },
                ].map((item) => (
                  <View
                    key={item.label}
                    className="flex-row items-center justify-between py-2.5 border-b border-border-primary/30"
                  >
                    <View>
                      <Text className="text-sm font-medium text-text-primary">
                        {item.label}
                      </Text>
                      <Text className="text-[10px] text-text-muted">
                        {item.desc}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-accent-green">
                      {item.value}
                    </Text>
                  </View>
                ))}
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
                Clean claims history is a valuable asset.
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Your claims-free record may qualify you for discounts when
                renewing policies. Ask your providers about claims-free
                discounts, which can save 5-15% on premiums.
              </Text>
            </Card>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
