import { View, Text, Switch } from "react-native";
import { Info } from "lucide-react-native";
import { colors } from "../lib/theme";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  showInfo?: boolean;
  className?: string;
}

export default function ToggleSwitch({
  label,
  checked,
  onChange,
  showInfo = false,
  className = "",
}: ToggleSwitchProps) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <View className="flex-row items-center gap-1.5">
        <Text className="text-sm text-text-secondary">{label}</Text>
        {showInfo && <Info size={14} color={colors.textMuted} />}
      </View>
      <Switch
        value={checked}
        onValueChange={onChange}
        trackColor={{ false: colors.bgInput, true: colors.accentGreen }}
        thumbColor="#ffffff"
      />
    </View>
  );
}
