import { View, Text } from "react-native";

interface ProgressBarProps {
  percent: number;
  color?: string;
  bgColor?: string;
  height?: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export default function ProgressBar({
  percent,
  color = "bg-accent-green",
  bgColor = "bg-bg-input",
  height = 6,
  label,
  showPercent = false,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View className={className}>
      {(label || showPercent) && (
        <View className="flex-row justify-between items-center mb-1.5">
          {label && <Text className="text-xs text-text-secondary">{label}</Text>}
          {showPercent && (
            <Text className="text-xs font-medium text-text-secondary">
              {Math.round(clamped)}%
            </Text>
          )}
        </View>
      )}
      <View className={`w-full rounded-full overflow-hidden ${bgColor}`} style={{ height }}>
        <View
          className={`rounded-full ${color}`}
          style={{ height, width: `${clamped}%` }}
        />
      </View>
    </View>
  );
}
