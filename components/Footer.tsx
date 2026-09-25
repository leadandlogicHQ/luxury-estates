"use client";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  ArrowUp,
} from "lucide-react";

const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const Facebook = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const Linkedin = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const Youtube = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const quickLinks = [
  { href: "/listings", label: "Explore Properties" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Private Consultation" },
];
const exploreLinks = [
  { href: "/listings?type=Villa", label: "Villas" },
  { href: "/listings?type=Penthouse", label: "Penthouses" },
  { href: "/listings?type=Condo", label: "Luxury Condos" },
];
const socials = [
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com" },
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com" },
  { Icon: Youtube, label: "YouTube", href: "https://www.youtube.com" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-secondary text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent"
      />
      <div className="absolute -right-32 top-16 h-72 w-72 rounded-full border border-white/4.5" />
      <div className="absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-primary/[0.035] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pb-5 pt-16 sm:px-8 lg:px-10 lg:pt-20">
        {/* Primary CTA */}
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[0.64rem] font-bold uppercase tracking-[0.22em] text-primary">
              Begin the conversation
            </span>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-[1.05] md:text-5xl">
              Looking for a place
              <br />
              <em className="font-normal text-primary">worth coming home to?</em>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
              Explore our collection or speak with an advisor about your next
              move. We keep the process clear, personal, and considered.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Link
              href="/contact"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-dark sm:w-auto"
            >
              Private Consultation
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Information architecture */}
        <div className="grid gap-12 py-12 md:grid-cols-2 xl:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-end gap-2" aria-label="Luxury Estates home">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Luxury Estates
              </span>
              <span className="mb-1 h-1.5 w-1.5 rounded-full bg-primary" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
              Distinctive residences, local expertise, and an advisor-led
              experience designed around important property decisions.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-primary/50 hover:bg-primary/8 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">Explore</p>
            <nav aria-label="Explore">
              <ul className="space-y-3.5">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-primary transition-all duration-200 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">Company</p>
            <nav aria-label="Company">
              <ul className="space-y-3.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-primary transition-all duration-200 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
              Visit & contact
            </p>
            <div className="space-y-4 text-sm text-white/70">
              {/* Address is information */}
              <p className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  123 Rodeo Drive,
                  <br />
                  Beverly Hills, CA
                </span>
              </p>
              <a
                href="tel:+13105550123"
                className="group flex items-center gap-3 transition-colors hover:text-white"
              >
                <Phone size={16} className="shrink-0 text-primary" />
                <span>(310) 555-0123</span>
              </a>
              <a
                href="mailto:info@luxuryestates.com"
                className="group flex items-center gap-3 break-all transition-colors hover:text-white"
              >
                <Mail size={16} className="shrink-0 text-primary" />
                <span>info@luxuryestates.com</span>
              </a>
            </div>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/60">Office hours</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Mon–Fri: 9am–6pm
                <br />
                Sat: 10am–4pm · Sun: By Appointment
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 pt-6 text-[0.68rem] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Luxury Estates. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-white/15">/</span>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Back to top"
              className="group ml-1 inline-flex items-center gap-1.5 border-l border-white/10 pl-5 font-semibold uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white"
            >
              Top
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 transition-colors group-hover:border-primary/40">
                <ArrowUp size={13} className="group-hover:text-primary" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}