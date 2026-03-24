export function toggleArray(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export function formatCurrency(
  value: number,
  opts?: { compact?: boolean }
): string {
  if (opts?.compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `$${Math.round(value / 1_000)}k`;
    }
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function computeSparklinePath(
  values: number[],
  width: number,
  height: number,
  padding = 8
): { linePath: string; areaPath: string } {
  if (values.length < 2) return { linePath: "", areaPath: "" };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const w = width - padding * 2;
  const h = height - padding * 2;

  const points = values.map((v, i) => ({
    x: padding + (i / (values.length - 1)) * w,
    y: padding + h - ((v - min) / range) * h,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  return { linePath, areaPath };
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
