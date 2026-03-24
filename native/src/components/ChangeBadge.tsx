import { View, Text } from "react-native";
import { TrendingDown, TrendingUp } from "lucide-react-native";
import { colors } from "../lib/theme";

interface ChangeBadgeProps {
  value: number;
  suffix?: string;
  invertColor?: boolean;
  className?: string;
}

export default function ChangeBadge({
  value,
  suffix = "",
  invertColor = false,
  className = "",
}: ChangeBadgeProps) {
  const isPositive = value >= 0;
  const isGood = invertColor ? !isPositive : isPositive;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  const bgClass = isGood ? "bg-accent-green/10" : "bg-accent-red/10";
  const textClass = isGood ? "text-accent-green" : "text-accent-red";
  const iconColor = isGood ? colors.accentGreen : colors.accentRed;

  const absValue = Math.abs(value);
  const displayValue =
    absValue >= 1000 ? absValue.toLocaleString("en-US") : `${absValue}`;

  return (
    <View className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${bgClass} ${className}`}>
      <Icon size={12} color={iconColor} />
      <Text className={`text-xs font-medium ${textClass}`}>
        {isPositive ? "+" : "−"}
        {displayValue}
        {suffix}
      </Text>
    </View>
  );
}
