import { View } from "react-native";
import Pill from "./Pill";

interface TimeRangeSelectorProps {
  options?: string[];
  selected: string;
  onChange: (range: string) => void;
  className?: string;
}

const defaultOptions = ["1M", "3M", "6M", "1Y", "ALL"];

export default function TimeRangeSelector({
  options = defaultOptions,
  selected,
  onChange,
  className = "",
}: TimeRangeSelectorProps) {
  return (
    <View className={`flex-row gap-2 ${className}`}>
      {options.map((opt) => (
        <Pill
          key={opt}
          label={opt}
          active={selected === opt}
          onClick={() => onChange(opt)}
        />
      ))}
    </View>
  );
}
