import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: 32, md: 40, lg: 56 }[size];
  const textSize = { sm: "text-sm", md: "text-base", lg: "text-xl" }[size];

  return (
    <View className="flex-row items-center gap-2">
      <Svg width={dims} height={dims} viewBox="0 0 48 48" fill="none">
        <Circle cx={20} cy={16} r={12} fill="#22c55e" />
        <Circle cx={28} cy={16} r={12} fill="#16a34a" />
        <Circle cx={24} cy={26} r={12} fill="#15803d" />
      </Svg>
      <View>
        <Text className={`font-bold ${textSize} text-white`}>
          my <Text className="text-accent-green">CPA</Text>
        </Text>
        <Text className="text-[8px] tracking-widest text-text-secondary uppercase">
          Dashboard
        </Text>
      </View>
    </View>
  );
}
