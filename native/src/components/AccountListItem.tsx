import { View, Text } from "react-native";
import ProgressBar from "./ProgressBar";
import { formatCurrency } from "../lib/utils";
import {
  Landmark,
  PiggyBank,
  TrendingUp,
  Home,
  Car,
  CreditCard,
  GraduationCap,
  ChevronDown,
} from "lucide-react-native";
import { colors } from "../lib/theme";

const iconMap: Record<string, any> = {
  landmark: Landmark,
  "piggy-bank": PiggyBank,
  "trending-up": TrendingUp,
  home: Home,
  car: Car,
  "credit-card": CreditCard,
  "graduation-cap": GraduationCap,
};

interface AccountListItemProps {
  name: string;
  institution?: string;
  balance: number;
  icon: string;
  creditLimit?: number;
  showChevron?: boolean;
  className?: string;
}

function getUtilColor(percent: number): string {
  if (percent < 30) return "bg-accent-green";
  if (percent < 50) return "bg-accent-yellow";
  if (percent < 75) return "bg-accent-orange";
  return "bg-accent-red";
}

export default function AccountListItem({
  name,
  institution,
  balance,
  icon,
  creditLimit,
  showChevron = false,
  className = "",
}: AccountListItemProps) {
  const Icon = iconMap[icon] || CreditCard;
  const isNegative = balance < 0;
  const utilPercent = creditLimit ? Math.round((balance / creditLimit) * 100) : 0;

  return (
    <View className={`flex-row items-center gap-3 py-3.5 px-4 ${className}`}>
      <View className="w-10 h-10 rounded-xl bg-bg-input/80 items-center justify-center">
        <Icon size={18} color={colors.textSecondary} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-text-primary">{name}</Text>
        {institution && (
          <Text className="text-xs text-text-muted">{institution}</Text>
        )}
        {creditLimit != null && creditLimit > 0 && (
          <View className="mt-1.5 flex-row items-center gap-2">
            <ProgressBar
              percent={utilPercent}
              color={getUtilColor(utilPercent)}
              height={5}
              className="flex-1"
            />
            <Text className="text-[10px] text-text-muted">{utilPercent}% Used</Text>
          </View>
        )}
      </View>
      <View className="flex-row items-center gap-1.5">
        <Text
          className={`text-sm font-bold ${
            isNegative ? "text-accent-red" : "text-text-primary"
          }`}
        >
          {formatCurrency(balance)}
        </Text>
        {showChevron && <ChevronDown size={14} color={colors.textMuted} />}
      </View>
    </View>
  );
}
