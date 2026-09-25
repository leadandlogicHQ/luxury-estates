"use client";
import { useEffect, useRef } from "react";

interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number; // seconds
  className?: string;
}

export default function CountUp({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const format = (v: number) =>
    `${prefix}${v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = format(0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(end);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = format(end * eased); // native DOM write — React never re-renders
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, decimals, duration, prefix, suffix]);

  return <span ref={ref} className={className} />;
}