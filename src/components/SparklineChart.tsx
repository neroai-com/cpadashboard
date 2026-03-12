"use client";

import { useId } from "react";
import { computeSparklinePath } from "@/lib/utils";

interface SparklineChartProps {
  data: { value: number }[];
  width?: number;
  height?: number;
  fillOpacity?: number;
  showEndDot?: boolean;
  animated?: boolean;
  className?: string;
}

export default function SparklineChart({
  data,
  width = 320,
  height = 120,
  fillOpacity = 0.15,
  showEndDot = true,
  animated = true,
  className = "",
}: SparklineChartProps) {
  const id = useId();
  const values = data.map((d) => d.value);
  const { linePath, areaPath } = computeSparklinePath(values, width, height);

  if (values.length < 2) return null;

  // Compute end dot position
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 8;
  const lastVal = values[values.length - 1];
  const dotX = padding + ((values.length - 1) / (values.length - 1)) * (width - padding * 2);
  const dotY = padding + (height - padding * 2) - ((lastVal - min) / range) * (height - padding * 2);

  // Dashed horizontal reference lines
  const refLines = [0.25, 0.5, 0.75].map((pct) => {
    const y = padding + (height - padding * 2) * (1 - pct);
    return y;
  });

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: `${height}px` }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`sparkfill-${id}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="currentColor"
              stopOpacity={fillOpacity}
            />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Reference dashed lines */}
        {refLines.map((y, i) => (
          <line
            key={i}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#sparkfill-${id})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "animate-draw-line" : ""}
        />

        {/* End dot */}
        {showEndDot && (
          <>
            <circle cx={dotX} cy={dotY} r={5} fill="currentColor" opacity={0.2} />
            <circle cx={dotX} cy={dotY} r={3} fill="currentColor" />
          </>
        )}
      </svg>
    </div>
  );
}
