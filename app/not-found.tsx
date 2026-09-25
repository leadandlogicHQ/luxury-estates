import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-off-white">
      <section className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Editorial content: clear hierarchy, one obvious next step */}
        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" aria-hidden="true" />
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-primary-dark">
                Error 404
              </p>
            </div>

            <p
              aria-hidden="true"
              className="mt-7 font-serif text-[clamp(5rem,13vw,9rem)] leading-[0.78] tracking-[-0.05em] text-secondary"
            >
              404
            </p>

            <h1 className="mt-8 max-w-lg font-serif text-4xl font-bold leading-[1.02] tracking-[-0.02em] text-secondary sm:text-5xl">
              The address you&apos;re looking for isn&apos;t available.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-text-light sm:text-base">
              The page may have moved, or the address may no longer be active.
              Let&apos;s take you back to the places and properties that are still
              available.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/listings"
                className="group inline-flex min-h-12 items-center justify-center gap-2 bg-primary px-6 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-off-white"
              >
                <Search size={16} aria-hidden="true" />
                Browse Properties
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-border bg-white px-6 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:border-primary/60 hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-off-white"
              >
                <Home size={16} aria-hidden="true" />
                Back Home
              </Link>
            </div>

            <div className="mt-10 border-t border-border pt-5">
              <p className="text-xs leading-6 text-text-light">
                Looking for something specific?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-primary-dark underline decoration-primary/40 underline-offset-4 transition-colors hover:text-secondary"
                >
                  Speak with our team
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Visual anchor: one restrained property image, no decorative clutter */}
        <div className="relative min-h-[360px] overflow-hidden bg-secondary lg:min-h-full">
          <img
            src="/property6.webp"
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
                There&apos;s still a place worth finding.
              </p>
              <Link
                href="/listings"
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
              >
                Explore the collection
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
