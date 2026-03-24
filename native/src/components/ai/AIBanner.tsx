import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { aiBannerInsights as bannerInsights } from "../../lib/ai-data";
import { colors } from "../../lib/theme";
import { X, ChevronRight } from "lucide-react-native";

const typeEmoji: Record<string, string> = {
  opportunity: "💡",
  risk: "⚠️",
  action: "🎯",
  info: "ℹ️",
};

export default function AIBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerInsights.length);
    }, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (dismissed) return null;

  const insight = bannerInsights[currentIndex];

  return (
    <View className="bg-bg-card border border-accent-green/20 rounded-xl p-3 overflow-hidden">
      <View className="flex-row items-start gap-2">
        <Text className="text-sm mt-0.5">{typeEmoji[insight.type] || "💡"}</Text>
        <View className="flex-1">
          <Text className="text-xs font-semibold text-text-primary" numberOfLines={1}>
            {insight.title}
          </Text>
          <Text className="text-[10px] text-text-muted mt-0.5" numberOfLines={2}>
            {insight.summary}
          </Text>
        </View>
        <Pressable onPress={() => setDismissed(true)} className="p-1">
          <X size={12} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Progress dots */}
      <View className="flex-row items-center justify-center gap-1.5 mt-2">
        {bannerInsights.map((_, i) => (
          <View
            key={i}
            className={`rounded-full ${i === currentIndex ? "w-4 h-1 bg-accent-green" : "w-1 h-1 bg-text-muted/30"}`}
          />
        ))}
      </View>
    </View>
  );
}
