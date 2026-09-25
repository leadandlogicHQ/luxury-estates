"use client";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Mounts children once the browser is idle, keeping them out of the
 * critical hydration path (cuts TBT without touching SSR for SEO).
 */
export default function Deferred({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let id: number;
    if (typeof w.requestIdleCallback === "function") {
      id = w.requestIdleCallback(() => setShow(true), { timeout: 1200 });
    } else {
      id = window.setTimeout(() => setShow(true), 600);
    }
    return () => {
      if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  if (!show) return null;
  return <>{children}</>;
}