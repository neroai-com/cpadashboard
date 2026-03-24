import { ReactNode } from "react";
import { View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type CardVariant = "default" | "hero" | "glass";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  variant = "default",
  onClick,
}: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    default: "bg-bg-card border border-border-primary",
    hero: "bg-bg-card border border-accent-green/20 relative overflow-hidden",
    glass: "bg-bg-card/80 border border-white/5",
  };

  const content = (
    <View className={`rounded-xl p-4 ${variantStyles[variant]} ${className}`}>
      {variant === "hero" && (
        <LinearGradient
          colors={["#22c55e", "#14b8a6", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2 }}
        />
      )}
      {children}
    </View>
  );

  if (onClick) {
    return (
      <Pressable onPress={onClick} style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
}
