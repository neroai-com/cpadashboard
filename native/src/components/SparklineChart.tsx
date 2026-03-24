import { View } from "react-native";
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors } from "../lib/theme";
import { computeSparklinePath } from "../lib/utils";

interface SparklineChartProps {
  data: { value: number }[];
  width?: number;
  height?: number;
  fillOpacity?: number;
  showEndDot?: boolean;
  color?: string;
  className?: string;
}

export default function SparklineChart({
  data,
  width = 320,
  height = 120,
  fillOpacity = 0.15,
  showEndDot = true,
  color = colors.accentGreen,
  className = "",
}: SparklineChartProps) {
  const values = data.map((d) => d.value);
  if (values.length < 2) return null;

  const { linePath, areaPath } = computeSparklinePath(values, width, height);

  // Compute end dot position
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 8;
  const lastVal = values[values.length - 1];
  const dotX = padding + ((values.length - 1) / (values.length - 1)) * (width - padding * 2);
  const dotY = padding + (height - padding * 2) - ((lastVal - min) / range) * (height - padding * 2);

  // Reference dashed lines
  const refLines = [0.25, 0.5, 0.75].map((pct) => {
    const y = padding + (height - padding * 2) * (1 - pct);
    return y;
  });

  return (
    <View className={className}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {refLines.map((y, i) => (
          <Line
            key={i}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke={color}
            strokeOpacity={0.08}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}

        <Path d={areaPath} fill="url(#sparkfill)" />

        <Path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {showEndDot && (
          <>
            <Circle cx={dotX} cy={dotY} r={5} fill={color} opacity={0.2} />
            <Circle cx={dotX} cy={dotY} r={3} fill={color} />
          </>
        )}
      </Svg>
    </View>
  );
}
