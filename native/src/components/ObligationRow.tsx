import { View, Text } from "react-native";
import { Home, CreditCard, Car, Shield, Receipt } from "lucide-react-native";
import { formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";

const typeIcons: Record<string, any> = {
  mortgage: Home,
  credit_card: CreditCard,
  loan: Car,
  insurance: Shield,
  bill: Receipt,
};

const typeColors: Record<string, { bg: string; text: string }> = {
  mortgage: { bg: "bg-accent-blue/10", text: colors.accentBlue },
  credit_card: { bg: "bg-accent-orange/10", text: colors.accentOrange },
  loan: { bg: "bg-accent-purple/10", text: colors.accentPurple },
  insurance: { bg: "bg-accent-teal/10", text: colors.accentTeal },
  bill: { bg: "bg-accent-yellow/10", text: colors.accentYellow },
};

interface ObligationRowProps {
  label: string;
  amount: number;
  dueDate: string;
  daysUntil: number;
  entity: string;
  type: string;
  autoPay: boolean;
  className?: string;
}

export default function ObligationRow({
  label,
  amount,
  dueDate,
  daysUntil,
  type,
  autoPay,
  className = "",
}: ObligationRowProps) {
  const Icon = typeIcons[type] || Receipt;
  const colorInfo = typeColors[type] || { bg: "bg-bg-input/80", text: colors.textSecondary };

  const urgencyClass =
    daysUntil <= 7
      ? "text-accent-red"
      : daysUntil <= 14
      ? "text-accent-yellow"
      : "text-text-muted";

  return (
    <View className={`flex-row items-center gap-3 py-3 px-4 ${className}`}>
      <View className={`w-9 h-9 rounded-lg items-center justify-center ${colorInfo.bg}`}>
        <Icon size={16} color={colorInfo.text} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-text-primary" numberOfLines={1}>
          {label}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className={`text-[10px] font-medium ${urgencyClass}`}>
            {daysUntil <= 1 ? "Due today" : `${daysUntil}d`}
          </Text>
          <Text className="text-[10px] text-text-muted">Due {dueDate}</Text>
          {autoPay && (
            <View className="bg-accent-green/10 px-1.5 py-0.5 rounded-full">
              <Text className="text-[10px] text-accent-green">Auto</Text>
            </View>
          )}
        </View>
      </View>
      <Text className="text-sm font-bold text-text-primary">
        {formatCurrency(amount)}
      </Text>
    </View>
  );
}
