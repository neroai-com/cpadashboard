import { View, Text } from "react-native";

interface SectionHeaderProps {
  title: string;
  total?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  total,
  className = "",
}: SectionHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <Text className="text-xs font-semibold tracking-wider text-text-muted uppercase">
        {title}
      </Text>
      {total && (
        <Text className="text-xs font-semibold text-text-secondary">{total}</Text>
      )}
    </View>
  );
}
