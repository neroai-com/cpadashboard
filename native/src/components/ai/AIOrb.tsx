import { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { colors } from "../../lib/theme";
import { Bot, Brain, MessageSquare, AlertTriangle, BarChart3 } from "lucide-react-native";
import { useEffect } from "react";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const quickActions = [
  { id: "advisor", label: "AI Advisor", icon: Brain, screen: "AIAdvisor" as const },
  { id: "ask", label: "Ask AI", icon: MessageSquare, screen: "AIAdvisor" as const },
  { id: "risk", label: "Risk Radar", icon: AlertTriangle, screen: "AIAdvisor" as const },
  { id: "dives", label: "Deep Dives", icon: BarChart3, screen: "AIAdvisor" as const },
];

export default function AIOrb() {
  const navigation = useNavigation<Nav>();
  const [open, setOpen] = useState(false);

  // Pulse animation
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <>
      {/* Floating Orb */}
      <View style={{ position: "absolute", bottom: 90, right: 16, zIndex: 50 }}>
        <Pressable onPress={() => setOpen(true)}>
          <Animated.View style={pulseStyle}>
            <View className="w-14 h-14 rounded-full bg-accent-green items-center justify-center" style={{ shadowColor: colors.accentGreen, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 }}>
              <Bot size={24} color="#fff" />
            </View>
          </Animated.View>
          {/* Notification dot */}
          <View className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-red items-center justify-center border-2 border-bg-primary">
            <Text className="text-[8px] font-bold text-white">3</Text>
          </View>
        </Pressable>
      </View>

      {/* Quick Action Drawer */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-bg-card rounded-t-2xl p-4 pb-8">
            <View className="w-10 h-1 rounded-full bg-border-secondary self-center mb-4" />
            <View className="flex-row items-center gap-2 mb-4">
              <Bot size={18} color={colors.accentGreen} />
              <Text className="text-lg font-bold text-text-primary">AI Assistant</Text>
            </View>
            <View className="gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Pressable
                    key={action.id}
                    onPress={() => {
                      setOpen(false);
                      navigation.navigate(action.screen);
                    }}
                    className="flex-row items-center gap-3 p-3 rounded-lg border border-border-primary"
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <View className="w-9 h-9 rounded-lg bg-accent-green/10 items-center justify-center">
                      <Icon size={18} color={colors.accentGreen} />
                    </View>
                    <Text className="text-sm font-medium text-text-primary">{action.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
