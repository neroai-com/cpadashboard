import { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Sparkles, X } from "lucide-react-native";
import { aiSparks } from "../../lib/ai-data";
import { colors } from "../../lib/theme";

interface AISparkProps {
  metricId: string;
  size?: number;
}

export default function AISpark({ metricId, size = 11 }: AISparkProps) {
  const [open, setOpen] = useState(false);
  const insight = aiSparks[metricId];

  if (!insight) return null;

  return (
    <>
      <Pressable onPress={() => setOpen(true)} className="p-1">
        <Sparkles size={size} color={colors.accentGreen} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-bg-card border border-border-primary rounded-xl p-4 w-full max-w-sm">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Sparkles size={14} color={colors.accentGreen} />
                <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  AI Insight
                </Text>
              </View>
              <Pressable onPress={() => setOpen(false)} className="p-1">
                <X size={14} color={colors.textMuted} />
              </Pressable>
            </View>
            <Text className="text-sm font-semibold text-text-primary mb-1">
              {insight.title}
            </Text>
            <Text className="text-xs text-text-muted">
              {insight.insight}
            </Text>
            {insight.action && (
              <Pressable className="mt-3 py-2 rounded-lg bg-accent-green/10 items-center">
                <Text className="text-xs font-medium text-accent-green">
                  {insight.action}
                </Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
