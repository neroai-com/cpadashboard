"use client";

import Pill from "@/components/Pill";

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
    <div
      className={`flex gap-2 ${className}`}
      role="group"
      aria-label="Time range selector"
    >
      {options.map((opt) => (
        <Pill
          key={opt}
          label={opt}
          active={selected === opt}
          onClick={() => onChange(opt)}
        />
      ))}
    </div>
  );
}
