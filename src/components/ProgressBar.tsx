"use client";

interface ProgressBarProps {
  /** 0–100 */
  percent: number;
  color?: string;
  bgColor?: string;
  height?: number;
  label?: string;
  showPercent?: boolean;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  percent,
  color = "bg-accent-green",
  bgColor = "bg-bg-input",
  height = 6,
  label,
  showPercent = false,
  animated = true,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs text-text-secondary">{label}</span>
          )}
          {showPercent && (
            <span className="text-xs font-medium text-text-secondary">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${bgColor}`}
        style={{ height }}
      >
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{
            width: `${clamped}%`,
            animation: animated ? "growWidth 0.8s ease-out" : undefined,
          }}
        />
      </div>
    </div>
  );
}
