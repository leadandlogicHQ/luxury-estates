"use client";
import { useEffect, useState } from "react";

export default function PageLoader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    let done = false;
    const hide = () => {
      if (done) return;
      done = true;
      setHidden(true);
      document.body.style.overflow = "";
      setTimeout(() => setRemoved(true), 500);
    };

    /* Hide on window load… */
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });

    /* …or after 600ms no matter what (failsafe — never a blank screen, but doesn't block perceived speed) */
    const failsafe = setTimeout(hide, 600);

    return () => {
      window.removeEventListener("load", hide);
      clearTimeout(failsafe);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-off-white transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="font-serif text-2xl font-bold text-secondary">
          Luxury Estates <span className="text-primary">•</span>
        </span>
        <span className="h-px w-24 overflow-hidden rounded-full bg-border">
          <span className="block h-full w-1/2 animate-pulse bg-primary" />
        </span>
      </div>
    </div>
  );
}