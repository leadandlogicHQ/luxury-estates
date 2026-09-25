"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import ShortlistWidget from "./ShortlistDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const docHeight = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      docHeight.current = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };

    const update = () => {
      measure();

      cancelAnimationFrame(raf.current ?? 0);

      raf.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);

        const total = docHeight.current;
        const progress = total > 0 ? Math.min(window.scrollY / total, 1) : 0;

        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${progress})`;
        }
      });
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    return () => {
      cancelAnimationFrame(raf.current ?? 0);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.removeProperty("overflow");
    };
  }, [isOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Functional reading progress: quiet, 2px, compositor-friendly */}
      <div
        ref={barRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left scale-x-0 bg-primary will-change-transform"
      />

      <header className="sticky top-0 z-50">
        <nav
          aria-label="Main navigation"
          className={`border-b transition-[background-color,box-shadow,border-color] duration-300 ${
            scrolled
              ? "border-border/80 bg-white/95 shadow-[0_8px_28px_rgba(116,109,100,0.10)] backdrop-blur-md"
              : "border-border/60 bg-white"
          }`}
        >
          <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">
            {/* Brand */}
            <Link
              href="/"
              aria-label="Luxury Estates home"
              className="shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4"
            >
              <span className="font-serif text-[26px] font-bold tracking-[-0.02em] text-secondary sm:text-[29px]">
                Luxury Estates
              </span>
              <span
                aria-hidden="true"
                className="ml-1.5 inline-block h-2 w-2 rounded-full bg-primary align-middle"
              />
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-8 lg:flex xl:gap-10">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex min-h-10 items-center text-[12px] font-bold uppercase tracking-[0.17em] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 ${
                      active ? "text-secondary" : "text-text-light hover:text-secondary"
                    }`}
                  >
                    <span>{link.label}</span>

                    {/* Small active cue instead of a heavy underline */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-[2px] bg-primary transition-[width,opacity] duration-200 ${
                        active
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Utility + primary action */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <ShortlistWidget />

              <div className="hidden items-center gap-2.5 lg:flex">
                <Link
                  href="/admin/login"
                  className="inline-flex min-h-10 items-center justify-center border border-border bg-white px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-secondary transition-colors hover:border-secondary hover:bg-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Sign In
                </Link>

                <Link
                  href="/listings"
                  className="group inline-flex min-h-10 items-center justify-center gap-2 bg-primary px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Browse Properties
                  <ArrowRight
                    size={13}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className="inline-flex h-10 w-10 items-center justify-center text-secondary transition-colors hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 lg:hidden"
              >
                {isOpen ? (
                  <X size={22} aria-hidden="true" />
                ) : (
                  <Menu size={22} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          <div
            id="mobile-navigation"
            className={`overflow-hidden border-t border-border bg-white transition-[max-height,opacity] duration-300 lg:hidden ${
              isOpen
                ? "max-h-[520px] opacity-100"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="px-5 pb-6 pt-4 sm:px-7">
              <div className="divide-y divide-border border-y border-border">
                {navLinks.map((link) => {
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      className={`flex min-h-14 items-center justify-between text-sm font-bold uppercase tracking-[0.14em] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
                        active ? "text-secondary" : "text-text-light hover:text-secondary"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${
                          active ? "bg-primary" : "bg-transparent"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex min-h-12 items-center justify-center border border-border bg-white text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:border-secondary hover:bg-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Sign In
                </Link>

                <Link
                  href="/listings"
                  onClick={() => setIsOpen(false)}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 bg-primary text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Browse Properties
                  <ArrowRight
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}