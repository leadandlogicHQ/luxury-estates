"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { resolveImage } from "@/lib/image";
import ShortlistButton from "./ShortlistButton";
import type { ShortlistItem } from "./ShortlistProvider";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  property?: ShortlistItem;
}

export default function PropertyGallery({ images, title, property }: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const count = images.length;
  const go = useCallback(
    (dir: 1 | -1) => setActive((cur) => (cur + dir + count) % count),
    [count]
  );

  /* Lightbox: keyboard nav, scroll lock, focus management */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [lightbox, go]);

  if (count === 0) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <div className="space-y-3">
        {/* Main image with protected controls */}
        <div className="group relative h-[320px] overflow-hidden rounded-2xl border border-border shadow-sm md:h-[520px]">
          <Image
            src={resolveImage(images[active])}
            alt={`${title} — photo ${active + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md tabular-nums">
            {pad(active + 1)} / {pad(count)}
          </span>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-secondary"
          >
            <Expand size={14} /> View photos
          </button>

          {/* Shortlist heart — contrast-protected overlay */}
          {property && <ShortlistButton property={property} />}

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary opacity-0 shadow-sm transition hover:bg-primary hover:text-secondary focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary opacity-0 shadow-sm transition hover:bg-primary hover:text-secondary focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail rail */}
        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`relative h-16 overflow-hidden rounded-lg border-2 transition md:h-20 ${
                i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={resolveImage(img)} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
          {count > 8 && (
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="flex h-16 items-center justify-center rounded-lg bg-secondary/80 text-xs font-bold text-white transition hover:bg-secondary md:h-20"
            >
              +{count - 8}
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="fixed inset-0 z-[100] flex flex-col bg-secondary/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 tabular-nums">
              {pad(active + 1)} / {pad(count)}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close gallery"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-primary hover:bg-primary hover:text-secondary"
            >
              <X size={18} />
            </button>
          </div>
          <div className="relative flex-1 px-4 pb-6 md:px-20">
            <div className="relative h-full w-full">
              <Image
                src={resolveImage(images[active])}
                alt={`${title} — photo ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-primary hover:text-secondary"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-primary hover:text-secondary"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}