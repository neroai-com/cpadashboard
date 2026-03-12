"use client";

interface BarItem {
  label: string;
  value: number;
  secondValue?: number;
}

interface BarChartProps {
  data: BarItem[];
  height?: number;
  barColor?: string;
  secondBarColor?: string;
  showValues?: boolean;
  className?: string;
}

export default function BarChart({
  data,
  height = 120,
  barColor = "bg-accent-green",
  secondBarColor = "bg-accent-orange/70",
  showValues = false,
  className = "",
}: BarChartProps) {
  const allValues = data.flatMap((d) =>
    d.secondValue != null ? [d.value, d.secondValue] : [d.value]
  );
  const max = Math.max(...allValues, 1);

  return (
    <div className={className}>
      <div
        className="flex items-end gap-1.5"
        style={{ height }}
        role="img"
        aria-label="Bar chart"
      >
        {data.map((item) => {
          const h1 = (item.value / max) * 100;
          const h2 = item.secondValue != null ? (item.secondValue / max) * 100 : 0;
          const hasSecond = item.secondValue != null;

          return (
            <div key={item.label} className="flex-1 flex items-end gap-0.5 h-full">
              <div
                className={`flex-1 rounded-t-sm transition-all duration-700 ${barColor}`}
                style={{ height: `${h1}%` }}
              />
              {hasSecond && (
                <div
                  className={`flex-1 rounded-t-sm transition-all duration-700 ${secondBarColor}`}
                  style={{ height: `${h2}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex gap-1.5 mt-1.5">
        {data.map((item) => (
          <div key={item.label} className="flex-1 text-center">
            <p className="text-[9px] text-text-muted truncate">{item.label}</p>
            {showValues && (
              <p className="text-[9px] text-text-secondary font-medium">
                ${Math.round(item.value / 1000)}k
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
