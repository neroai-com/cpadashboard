import { View, Text } from "react-native";

interface BarItem {
  label: string;
  value: number;
  secondValue?: number;
}

interface BarChartProps {
  data: BarItem[];
  height?: number;
  barColor?: string;
  secondBarColor?: string;
  showValues?: boolean;
  className?: string;
}

export default function BarChart({
  data,
  height = 120,
  barColor = "bg-accent-green",
  secondBarColor = "bg-accent-orange/70",
  showValues = false,
  className = "",
}: BarChartProps) {
  const allValues = data.flatMap((d) =>
    d.secondValue != null ? [d.value, d.secondValue] : [d.value]
  );
  const max = Math.max(...allValues, 1);

  return (
    <View className={className}>
      <View className="flex-row items-end gap-1.5" style={{ height }}>
        {data.map((item) => {
          const h1 = (item.value / max) * 100;
          const h2 = item.secondValue != null ? (item.secondValue / max) * 100 : 0;
          const hasSecond = item.secondValue != null;

          return (
            <View key={item.label} className="flex-1 flex-row items-end gap-0.5" style={{ height }}>
              <View
                className={`flex-1 rounded-t-sm ${barColor}`}
                style={{ height: `${h1}%` }}
              />
              {hasSecond && (
                <View
                  className={`flex-1 rounded-t-sm ${secondBarColor}`}
                  style={{ height: `${h2}%` }}
                />
              )}
            </View>
          );
        })}
      </View>
      <View className="flex-row gap-1.5 mt-1.5">
        {data.map((item) => (
          <View key={item.label} className="flex-1 items-center">
            <Text className="text-[9px] text-text-muted" numberOfLines={1}>
              {item.label}
            </Text>
            {showValues && (
              <Text className="text-[9px] text-text-secondary font-medium">
                ${Math.round(item.value / 1000)}k
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
