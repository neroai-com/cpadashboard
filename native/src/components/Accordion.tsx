import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ChevronDown } from "lucide-react-native";
import { colors } from "../lib/theme";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

function AccordionRow({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const rotation = useSharedValue(isOpen ? 180 : 0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleToggle = () => {
    rotation.value = withTiming(isOpen ? 0 : 180, { duration: 200 });
    onToggle();
  };

  return (
    <View className="border-b border-border-primary/50 last:border-b-0">
      <Pressable onPress={handleToggle} className="flex-row items-center gap-3 py-3.5 px-1">
        <View className="w-7 h-7 rounded-full bg-bg-input items-center justify-center">
          <Text className="text-xs font-bold text-text-secondary">{index + 1}</Text>
        </View>
        <Text className="flex-1 text-sm font-medium text-text-primary">{item.title}</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={16} color={colors.textMuted} />
        </Animated.View>
      </Pressable>
      {isOpen && (
        <Text className="text-xs text-text-muted pb-3 pl-10 pr-2">
          {item.content}
        </Text>
      )}
    </View>
  );
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <View className={className}>
      {items.map((item, index) => (
        <AccordionRow
          key={item.id}
          item={item}
          index={index}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </View>
  );
}
