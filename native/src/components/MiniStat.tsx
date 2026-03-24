import { View, Text } from "react-native";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import { colors } from "../lib/theme";

interface MiniStatProps {
  label: string;
  value: string;
  trend?: "up" | "down";
  className?: string;
}

export default function MiniStat({
  label,
  value,
  trend,
  className = "",
}: MiniStatProps) {
  return (
    <View className={`bg-bg-input/50 rounded-lg p-2.5 border border-border-primary/50 ${className}`}>
      <Text className="text-[10px] uppercase tracking-wider text-text-muted mb-1">
        {label}
      </Text>
      <View className="flex-row items-center gap-1">
        <Text className="text-sm font-bold text-text-primary">{value}</Text>
        {trend === "up" && <TrendingUp size={12} color={colors.accentGreen} />}
        {trend === "down" && <TrendingDown size={12} color={colors.accentRed} />}
      </View>
    </View>
  );
}
