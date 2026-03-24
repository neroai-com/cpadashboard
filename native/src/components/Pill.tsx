import { Pressable, Text } from "react-native";

interface PillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function Pill({ label, active = false, onClick }: PillProps) {
  return (
    <Pressable
      onPress={onClick}
      className={`px-4 py-1.5 rounded-full border ${
        active
          ? "bg-accent-green/15 border-accent-green"
          : "bg-transparent border-border-secondary"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          active ? "text-accent-green" : "text-text-secondary"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
