import { View, Text } from "react-native";
import {
  Home,
  Car,
  Utensils,
  Zap,
  Shield,
  Repeat,
  ShoppingBag,
  CreditCard,
} from "lucide-react-native";
import { colors } from "../lib/theme";

const iconMap: Record<string, any> = {
  home: Home,
  car: Car,
  utensils: Utensils,
  zap: Zap,
  shield: Shield,
  repeat: Repeat,
  "shopping-bag": ShoppingBag,
  "credit-card": CreditCard,
};

interface BudgetBarProps {
  name: string;
  budgeted: number;
  actual: number;
  icon: string;
  color: string;
  className?: string;
}

// Map web Tailwind color classes to RN-compatible ones
const colorMap: Record<string, string> = {
  "bg-accent-green": "bg-accent-green",
  "bg-accent-blue": "bg-accent-blue",
  "bg-accent-orange": "bg-accent-orange",
  "bg-accent-purple": "bg-accent-purple",
  "bg-accent-teal": "bg-accent-teal",
  "bg-accent-yellow": "bg-accent-yellow",
  "bg-accent-red": "bg-accent-red",
};

export default function BudgetBar({
  name,
  budgeted,
  actual,
  icon,
  color,
  className = "",
}: BudgetBarProps) {
  const Icon = iconMap[icon] || CreditCard;
  const percent = Math.min(Math.round((actual / budgeted) * 100), 100);
  const remaining = budgeted - actual;
  const isOver = remaining < 0;
  const barColor = isOver ? "bg-accent-red" : (colorMap[color] || "bg-accent-green");

  return (
    <View className={`py-3 ${className}`}>
      <View className="flex-row items-center gap-3 mb-2">
        <View className="w-8 h-8 rounded-lg bg-bg-input/80 items-center justify-center">
          <Icon size={14} color={colors.textSecondary} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-text-primary">{name}</Text>
            <Text className={`text-xs font-bold ${isOver ? "text-accent-red" : "text-text-primary"}`}>
              ${actual.toLocaleString()}
              <Text className="text-text-muted font-normal"> / ${budgeted.toLocaleString()}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View className="ml-11">
        <View className="h-2 rounded-full bg-bg-input/50 overflow-hidden">
          <View
            className={`h-2 rounded-full ${barColor}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-[10px] text-text-muted">{percent}% used</Text>
          <Text className={`text-[10px] font-medium ${isOver ? "text-accent-red" : "text-text-muted"}`}>
            {isOver
              ? `$${Math.abs(remaining).toLocaleString()} over`
              : `$${remaining.toLocaleString()} left`}
          </Text>
        </View>
      </View>
    </View>
  );
}
