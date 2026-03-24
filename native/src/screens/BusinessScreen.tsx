import { useState, useMemo } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import Card from "../components/Card";
import Pill from "../components/Pill";
import MiniStat from "../components/MiniStat";
import { entities, Entity, businessStats } from "../lib/data";
import { colors } from "../lib/theme";
import { RootStackParamList } from "../navigation/types";
import { Sparkles, Search } from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const filterOptions = ["All", "Operating", "Holding / SPV", "Real Estate", "Archived"];

const entityTypeDot: Record<string, string> = {
  Operating: "bg-accent-green",
  "Holding / SPV": "bg-accent-blue",
  "Real Estate": "bg-accent-orange",
};

export default function BusinessScreen() {
  const navigation = useNavigation<Nav>();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(
    () => activeFilter === "All" ? entities : entities.filter((e) => e.type === activeFilter),
    [activeFilter]
  );

  const entityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of entities) {
      const key = e.type.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, []);

  const summary = Object.entries(entityCounts)
    .map(([type, count]) => `${count} ${type}`)
    .join(" \u00B7 ");

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Logo size="sm" />
          <View className="border border-border-secondary rounded-full px-3 py-1">
            <Text className="text-xs text-text-secondary">Business portfolio</Text>
          </View>
        </View>

        {/* Summary */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-text-primary mb-1">
            {entities.length} business{entities.length !== 1 ? "es" : ""}
          </Text>
          <Text className="text-text-secondary text-sm">{summary}</Text>
        </View>

        {/* Monthly Summary */}
        <Card variant="glass" className="mb-6">
          <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-3">
            This month
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="w-[31%]"><MiniStat label="Revenue" value={businessStats.revenue} trend="up" /></View>
            <View className="w-[31%]"><MiniStat label="Net Profit" value={businessStats.netProfit} trend="up" /></View>
            <View className="w-[31%]"><MiniStat label="Cash" value={businessStats.cash} /></View>
            <View className="w-[31%]"><MiniStat label="AR" value={businessStats.ar} /></View>
            <View className="w-[31%]"><MiniStat label="AP" value={businessStats.ap} /></View>
            <View className="w-[31%]"><MiniStat label="Margin" value={businessStats.margin} trend="up" /></View>
          </View>
        </Card>

        {/* Entities */}
        <Card className="mb-6">
          <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-2">
            Entities
          </Text>
          <Text className="text-text-secondary text-xs mb-4">
            Filter and tap to go to a specific entity.
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {filterOptions.map((f) => (
              <Pill
                key={f}
                label={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </View>

          {filtered.length === 0 && (
            <View className="items-center py-8">
              <Search size={32} color={colors.textMuted} strokeWidth={1.5} />
              <Text className="text-sm font-medium text-text-muted mt-2">No entities match this filter.</Text>
              <Text className="text-xs text-text-muted mt-1">Try selecting a different category.</Text>
            </View>
          )}

          <View className="gap-3">
            {filtered.map((entity) => (
              <Pressable
                key={entity.id}
                onPress={() => navigation.navigate("EntityDetail", { id: entity.id })}
                className="flex-row items-center justify-between p-3 rounded-lg border border-border-primary"
              >
                <View>
                  <Text className="font-semibold text-sm text-text-primary">{entity.name}</Text>
                  <View className="flex-row items-center gap-1.5 mt-0.5">
                    <View className={`w-1.5 h-1.5 rounded-full ${entityTypeDot[entity.type] || "bg-text-muted"}`} />
                    <Text className="text-xs text-text-muted">{entity.type}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-sm text-text-primary">{entity.equity}</Text>
                  <Text className="text-xs text-text-muted">Equity</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Text className="text-xs text-text-muted mt-4">
            Use search &amp; filters to manage portfolios with tens or hundreds of LLCs.
          </Text>
        </Card>

        {/* AI CFO */}
        <Card variant="hero" className="mb-6">
          <View className="flex-row items-center gap-2 mb-1">
            <Sparkles size={14} color={colors.accentGreen} />
            <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
              AI CFO · Entities
            </Text>
          </View>
          <Text className="text-text-secondary text-xs mb-3">
            Cross-entity structure, risk, and savings opportunities.
          </Text>
          <View className="p-3 rounded-lg border border-border-primary/50">
            <Text className="text-sm font-semibold text-text-primary">
              Consolidate 2 overlapping holding companies.
            </Text>
            <Text className="text-xs text-text-muted">
              Potential annual savings ~$12k in entity maintenance.
            </Text>
          </View>
        </Card>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
