"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw, Search, ShieldAlert } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-off-white">
      <section className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Primary recovery experience */}
        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" aria-hidden="true" />
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-primary-dark">
                Unexpected interruption
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-text-light">
              <ShieldAlert
                size={16}
                className="text-primary-dark"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Error 500
              </span>
            </div>

            <h1 className="mt-5 max-w-xl font-serif text-4xl font-bold leading-[1.02] tracking-[-0.02em] text-secondary sm:text-5xl xl:text-[4.25rem]">
              We&apos;ve hit an unexpected interruption.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-text-light sm:text-base">
              The page could not finish loading. Try the action below to continue,
              or return to the property collection while we set things right.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="group inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-6 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-off-white"
              >
                <RefreshCw
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:rotate-90"
                />
                Try Again
              </button>

              <Link
                href="/listings"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-border bg-white px-6 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:border-primary/60 hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-off-white"
              >
                <Search size={16} aria-hidden="true" />
                Browse Properties
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            {/* Contextual support */}
            <div className="mt-10 border-t border-border pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-secondary">
                    Still having trouble?
                  </p>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-text-light">
                    Contact our team and mention the reference below so we can
                    trace the interruption quickly.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-primary-dark underline decoration-primary/40 underline-offset-4 transition-colors hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Contact the team
                </Link>
              </div>

              {error.digest && (
                <div className="mt-4 inline-flex max-w-full items-center gap-2 border border-border bg-white px-3 py-2">
                  <span className="text-[0.63rem] font-bold uppercase tracking-[0.14em] text-text-light">
                    Reference
                  </span>
                  <code className="truncate text-xs font-medium text-secondary">
                    {error.digest}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property image as a visual anchor */}
        <div className="relative min-h-[360px] overflow-hidden bg-secondary lg:min-h-full">
          <img
            src="/property3.webp"
            alt="Luxury property exterior"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-secondary/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-12">
            <div className="max-w-sm border-l border-primary/80 pl-5">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary-light">
                Luxury Estates
              </p>

              <p className="mt-2 font-serif text-2xl leading-tight text-white sm:text-3xl">
                The destination is still worth returning to.
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Return home
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
