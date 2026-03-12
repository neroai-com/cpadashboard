"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export default function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 800,
  className = "",
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(-1);

  useEffect(() => {
    startRef.current = -1;

    function tick(now: number) {
      if (startRef.current < 0) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      setDisplay(formatNumber(eased * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
