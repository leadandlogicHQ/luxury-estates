"use client";

import { Heart } from "lucide-react";
import { useShortlist, type ShortlistItem } from "./ShortlistProvider";

interface ShortlistButtonProps {
  property: ShortlistItem;
  variant?: "overlay" | "bare";
}

export default function ShortlistButton({ property, variant = "overlay" }: ShortlistButtonProps) {
  const { has, toggle, ready } = useShortlist();
  const saved = ready && has(property.id);
  const label = saved
    ? `Remove ${property.title} from shortlist`
    : `Save ${property.title} to shortlist`;

  if (variant === "bare") {
    return (
      <button
        type="button"
        onClick={() => toggle(property)}
        aria-pressed={saved}
        aria-label={label}
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
          saved
            ? "border-primary bg-primary text-secondary"
            : "border-border bg-white text-text-light hover:border-primary/60 hover:text-primary-dark"
        }`}
      >
        <Heart size={15} fill={saved ? "currentColor" : "none"} />
      </button>
    );
  }

  /* overlay — sits on top of property imagery with contrast protection */
  return (
    <button
      type="button"
      onClick={() => toggle(property)}
      aria-pressed={saved}
      aria-label={label}
      className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-all duration-200 ${
        saved ? "bg-primary text-secondary" : "bg-white/90 text-secondary hover:bg-primary hover:text-secondary"
      }`}
    >
      <Heart size={17} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}