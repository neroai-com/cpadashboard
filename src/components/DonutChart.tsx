"use client";

import { useId } from "react";

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
  const id = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-bg-input/50"
        />
        {/* Segments */}
        {segments.map((seg) => {
          const dashLength = (seg.percent / 100) * circumference;
          const dashOffset = circumference - (cumulative / 100) * circumference;
          cumulative += seg.percent;
          return (
            <circle
              key={`${id}-${seg.label}`}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          );
        })}
      </svg>
      {/* Center text */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <p className="text-lg font-bold text-text-primary">{centerValue}</p>
          )}
          {centerLabel && (
            <p className="text-[10px] text-text-muted">{centerLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
