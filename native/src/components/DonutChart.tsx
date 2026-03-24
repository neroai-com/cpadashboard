import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../lib/theme";

interface Segment {
  label: string;
  value: number;
  percent: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

export default function DonutChart({
  segments,
  size = 160,
  strokeWidth = 18,
  centerLabel,
  centerValue,
  className = "",
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;

  return (
    <View className={`items-center justify-center ${className}`}>
      <View style={{ width: size, height: size }}>
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          {/* Background ring */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.bgInput}
            strokeWidth={strokeWidth}
            strokeOpacity={0.5}
          />
          {/* Segments */}
          {segments.map((seg) => {
            const dashLength = (seg.percent / 100) * circumference;
            const dashOffset = circumference - (cumulative / 100) * circumference;
            cumulative += seg.percent;
            return (
              <Circle
                key={seg.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
        {/* Center text */}
        {(centerLabel || centerValue) && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {centerValue && (
              <Text className="text-lg font-bold text-text-primary">{centerValue}</Text>
            )}
            {centerLabel && (
              <Text className="text-[10px] text-text-muted">{centerLabel}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
