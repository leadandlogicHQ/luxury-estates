import Link from "next/link";
import type { ReactNode } from "react";
import HeroBackground from "./HeroBackground";

interface PageHeroProps {
  crumb: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  image: string;
  children?: ReactNode;
}

export default function PageHero({
  crumb,
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-secondary text-white">
      {/*
        FIX 1: CSS background-image → next/image via HeroBackground.
        A CSS background is invisible to the preload scanner (LCP request
        discovery penalty); HeroBackground streams an optimized, preloaded
        <img> with the HTML payload instead.
      */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroBackground src={image} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/45 via-secondary/60 to-secondary/95" />

      <div className="relative z-10 mx-auto flex min-h-[430px] max-w-7xl flex-col justify-between px-5 py-8 sm:px-8 lg:px-10">
        {/* FIX 2: breadcrumb contrast raised to WCAG-safe opacities */}
        <nav
          aria-label="Breadcrumb"
          className="text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-white/70"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <span className="mx-2 text-white/40" aria-hidden="true">
            /
          </span>
          <span className="text-white/90">{crumb}</span>
        </nav>

        <div className="max-w-4xl pb-10 pt-20">
          {eyebrow && (
            <span className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-5 font-serif text-5xl font-bold leading-[0.97] tracking-tight md:text-6xl lg:text-[5.2rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              {subtitle}
            </p>
          )}
          {children}
        </div>

        {/* FIX 3: footer cue contrast raised; decorative rule hidden from AT */}
        <div className="flex items-center gap-3 border-t border-white/10 pt-5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/70">
          <span className="h-px w-10 bg-primary/70" aria-hidden="true" />
          Luxury Estates · Est. 2005
        </div>
      </div>
    </section>
  );
}