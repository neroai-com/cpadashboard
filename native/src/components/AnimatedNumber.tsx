import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";

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
  const startTimeRef = useRef<number>(-1);
  const rafRef = useRef<ReturnType<typeof requestAnimationFrame>>(0);

  useEffect(() => {
    startTimeRef.current = -1;

    function tick(now: number) {
      if (startTimeRef.current < 0) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
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
    <Text className={className}>
      {prefix}
      {display}
      {suffix}
    </Text>
  );
}
