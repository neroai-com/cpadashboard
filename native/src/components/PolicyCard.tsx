import { View, Text, Pressable } from "react-native";
import { Shield, Home, Car, Heart, Briefcase, Umbrella } from "lucide-react-native";
import { formatCurrency } from "../lib/utils";
import { colors } from "../lib/theme";

const iconMap: Record<string, any> = {
  shield: Shield,
  home: Home,
  car: Car,
  heart: Heart,
  briefcase: Briefcase,
  umbrella: Umbrella,
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-accent-green/10", text: "text-accent-green" },
  expiring: { bg: "bg-accent-yellow/10", text: "text-accent-yellow" },
  lapsed: { bg: "bg-accent-red/10", text: "text-accent-red" },
};

interface PolicyCardProps {
  type: string;
  name: string;
  provider: string;
  premium: number;
  coverageAmount: number;
  deductible: number;
  renewalDate: string;
  status: "active" | "expiring" | "lapsed";
  icon: string;
  className?: string;
}

export default function PolicyCard({
  name,
  provider,
  premium,
  coverageAmount,
  deductible,
  renewalDate,
  status,
  icon,
  className = "",
}: PolicyCardProps) {
  const Icon = iconMap[icon] || Shield;
  const sStyle = statusStyles[status] || statusStyles.active;

  return (
    <View className={`bg-bg-card border border-border-primary rounded-xl p-4 ${className}`}>
      <View className="flex-row items-start gap-3 mb-3">
        <View className="w-10 h-10 rounded-xl bg-bg-input/80 items-center justify-center">
          <Icon size={18} color={colors.textSecondary} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-text-primary">{name}</Text>
          <Text className="text-xs text-text-muted">{provider}</Text>
        </View>
        <View className={`px-2 py-0.5 rounded-full ${sStyle.bg}`}>
          <Text className={`text-[10px] font-medium ${sStyle.text}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="text-[10px] text-text-muted">Premium</Text>
          <Text className="text-sm font-bold text-text-primary">{formatCurrency(premium)}/mo</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[10px] text-text-muted">Coverage</Text>
          <Text className="text-sm font-bold text-text-primary">
            {formatCurrency(coverageAmount, { compact: true })}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-[10px] text-text-muted">Deductible</Text>
          <Text className="text-sm font-bold text-text-primary">
            {deductible > 0 ? formatCurrency(deductible) : "N/A"}
          </Text>
        </View>
      </View>

      <View className="mt-3 pt-3 border-t border-border-primary/50 flex-row items-center justify-between">
        <Text className="text-[10px] text-text-muted">Renews {renewalDate}</Text>
        <Pressable>
          <Text className="text-[10px] font-medium text-accent-green">View Details</Text>
        </Pressable>
      </View>
    </View>
  );
}
