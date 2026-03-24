import { View, Text } from "react-native";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Flame,
  Percent,
  Minus,
} from "lucide-react-native";
import { colors } from "../lib/theme";

const iconMap: Record<string, any> = {
  "trending-up": TrendingUp,
  wallet: Wallet,
  flame: Flame,
  percent: Percent,
};

interface KPICardProps {
  label: string;
  value: string;
  subValue: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: string;
  className?: string;
}

export default function KPICard({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon,
  className = "",
}: KPICardProps) {
  const Icon = iconMap[icon] || TrendingUp;
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "neutral" ? colors.textMuted : colors.accentGreen;
  const trendClass = trend === "neutral" ? "text-text-muted" : "text-accent-green";

  return (
    <View className={`bg-bg-card border border-border-primary rounded-xl p-3 ${className}`}>
      <View className="flex-row items-center gap-2 mb-2">
        <View className="w-7 h-7 rounded-lg bg-bg-input/80 items-center justify-center">
          <Icon size={14} color={colors.textSecondary} />
        </View>
        <Text className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
          {label}
        </Text>
      </View>
      <Text className="text-xl font-bold text-text-primary mb-0.5">{value}</Text>
      <View className="flex-row items-center gap-1">
        <TrendIcon size={10} color={trendColor} />
        <Text className={`text-[10px] font-medium ${trendClass}`}>{trendValue}</Text>
      </View>
      <Text className="text-[10px] text-text-muted mt-1">{subValue}</Text>
    </View>
  );
}
