"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };
  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className={`fixed bottom-0 left-0 right-0 z-[95] flex flex-col items-start justify-between gap-4 bg-secondary/95 px-6 py-4 backdrop-blur-xl transition-transform duration-500 ease-out sm:flex-row sm:items-center ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <p className="text-sm text-white/70">
        We use cookies to enhance your experience.{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex shrink-0 gap-3">
        <button
          onClick={accept}
          className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          Accept All
        </button>
        <button
          onClick={decline}
          className="rounded-md border border-white/15 px-5 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Decline
        </button>
      </div>
    </div>
  );
}