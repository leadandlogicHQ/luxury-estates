import { Suspense, Fragment } from "react";
import HeroSearch from "@/components/HeroSearch";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import FeaturedProperties, { FeaturedPropertiesSkeleton } from "@/components/FeaturedProperties";
import HeroBackground from "@/components/HeroBackground";
import {
  Award,
  ShieldCheck,
  Star,
  Handshake,
  CalendarCheck,
  Search,
  CalendarCheck2,
  Key,
  ArrowRight,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Deferred from "@/components/Deferred";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, webSiteSchema } from "@/lib/seo";

const heroStats: {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}[] = [
    { end: 500, suffix: "+", label: "Properties Sold" },
    { end: 2.5, prefix: "$", decimals: 1, suffix: "B", label: "Sales Volume" },
    { end: 15, label: "Expert Advisors" },
    { end: 20, suffix: "+", label: "Years Experience" },
  ];

const trustItems: { icon: LucideIcon; label: string }[] = [
  { icon: Star, label: "4.9 / 5 · 500+ Reviews" },
  { icon: ShieldCheck, label: "Licensed & Insured" },
  { icon: Award, label: "Top Luxury Broker 2025" },
  { icon: Handshake, label: "Free Consultation" },
  { icon: CalendarCheck, label: "Same-Week Showings" },
];

const marqueeItems = [
  "Oceanfront Villas",
  "Manhattan Penthouses",
  "Malibu Estates",
  "Aspen Retreats",
  "Waterfront Homes",
  "Historic Mansions",
  "Luxury Condos",
  "Private Compounds",
];

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Discover",
    desc: "Search a considered collection of exceptional residences in the locations and price ranges that matter to you.",
  },
  {
    icon: CalendarCheck2,
    number: "02",
    title: "Experience",
    desc: "Shortlist your favorites, then arrange private in-person or virtual viewings around your schedule.",
  },
  {
    icon: Handshake,
    number: "03",
    title: "Advise",
    desc: "Your advisor brings market context, negotiation expertise, and calm guidance to every decision.",
  },
  {
    icon: Key,
    number: "04",
    title: "Move Forward",
    desc: "From offer through closing, every detail is coordinated so the experience stays composed and clear.",
  },
];

/* Render on request — the shell streams instantly, data flows in via Suspense */
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
    <JsonLd data={[organizationSchema(), webSiteSchema()]} />
      {/* HERO — preloaded via next/image for instant LCP */}
      <section className="relative min-h-[88vh] overflow-hidden bg-secondary text-white lg:min-h-[820px]">
        <div className="absolute inset-0 overflow-hidden">
          <HeroBackground src="/property6.webp" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/45 via-secondary/50 to-secondary/90" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary/30 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-5 pb-5 pt-7 sm:px-8 lg:min-h-[820px] lg:px-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-white/75">
              <Award size={14} className="text-primary" />
              Award-Winning Real Estate
            </div>
            <span className="hidden items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/70 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Curated residences
            </span>
          </div>
          <div className="mx-auto w-full max-w-6xl pb-10 pt-20">
            <Reveal direction="up">
              <p className="mb-5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-white/75">
                Exceptional properties · Exceptional guidance
              </p>
            </Reveal>
            <Reveal direction="up" delay={0.08}>
              <h1 className="max-w-5xl font-serif text-5xl font-bold leading-[0.96] tracking-tight md:text-7xl lg:text-[6.5rem]">
                Find a place
                <br />
                <em className="font-normal text-primary">worth coming home to.</em>
              </h1>
            </Reveal>
            <Reveal direction="up" delay={0.16}>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                Discover distinctive residences in the world&apos;s most
                desirable locations, with an advisor-led experience designed
                around clarity, discretion, and trust.
              </p>
            </Reveal>
            <Reveal direction="up" delay={0.24}>
              <div className="mt-9">
                <HeroSearch />
              </div>
            </Reveal>
          </div>
          <div className="flex flex-col gap-5 border-t border-white/10 pt-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/70">
              <span className="h-px w-10 bg-primary/70" />
              Scroll to explore
              <span className="text-primary">↓</span>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="min-w-[110px] bg-secondary/60 px-5 py-4 backdrop-blur-sm">
                  <strong className="block font-serif text-2xl font-bold text-white">
                    <CountUp
                      end={stat.end}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </strong>
                  <span className="mt-1 block text-[0.58rem] font-bold uppercase tracking-[0.15em] text-white/70">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-4 px-5 py-5 sm:px-8 lg:justify-between lg:px-10">
          {trustItems.map((item, index) => (
            <Fragment key={item.label}>
              {index > 0 && (
                <div aria-hidden="true" className="hidden h-5 w-px bg-border lg:block" />
              )}
              <div className="flex items-center gap-2.5 text-[0.68rem] font-semibold text-text-light">
                <item.icon size={15} className="text-primary-dark" />
                <span>{item.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <section aria-label="Featured property categories" className="overflow-hidden bg-secondary">
        <div className="flex w-max animate-marquee py-3">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-7 whitespace-nowrap px-8 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/70"
            >
              {item}
              <span aria-hidden="true" className="text-primary">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* FEATURED — streams in behind Suspense, never blocks the hero */}
      <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <FeaturedProperties />
      </Suspense>

      {/* STORY IMAGE */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <Reveal direction="left">
              <div className="relative">
                <div className="absolute -bottom-5 -left-5 h-28 w-28 border-b border-l border-primary/60" />
                <div className="relative overflow-hidden bg-secondary">
                  <Image
                    src="/Emp.webp"
                    alt="Luxury Estates advisor"
                    width={900}
                    height={720}
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="aspect-[5/4] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
                <div className="absolute bottom-5 left-5 border border-white/15 bg-secondary/90 px-5 py-4 text-white backdrop-blur-md">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-primary">
                    The Luxury Estates approach
                  </p>
                  <p className="mt-1.5 font-serif text-lg leading-tight">
                    Calm guidance for important decisions.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary-dark">
                  Why Luxury Estates
                </p>
                <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">
                  Local expertise.
                  <br />
                  <em className="font-normal">Thoughtful service.</em>
                </h2>
                <div className="mt-6 space-y-5 text-sm leading-7 text-text-light">
                  <p>Buying or selling a home is more than a transaction. It is a decision about where life happens next.</p>
                  <p>Our advisors combine deep local knowledge with careful market context so every viewing, conversation, and negotiation feels purposeful.</p>
                  <p>From the first conversation to closing day, we stay close to the details without making the experience feel complicated.</p>
                </div>
                <div className="mt-8 grid grid-cols-3 border-y border-border">
                  <div className="py-5">
                    <p className="font-serif text-2xl font-bold text-primary-dark">
                      <CountUp end={500} suffix="+" />
                    </p>
                    <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-text-light">Properties Sold</p>
                  </div>
                  <div className="border-l border-border px-4 py-5">
                    <p className="font-serif text-2xl font-bold text-primary-dark">
                      <CountUp end={2.5} prefix="$" decimals={1} suffix="B" />
                    </p>
                    <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-text-light">Sales Volume</p>
                  </div>
                  <div className="border-l border-border px-4 py-5">
                    <p className="font-serif text-2xl font-bold text-primary-dark">
                      <CountUp end={20} suffix="+" />
                    </p>
                    <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-text-light">Years</p>
                  </div>
                </div>
                <Link
                  href="/about"
                  className="group mt-7 inline-flex items-center gap-2 bg-secondary px-6 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-secondary-light"
                >
                  Our story
                  <ArrowRight size={15} className="text-primary transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary-dark">The experience</p>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">A simpler way to move forward.</h2>
              <p className="mt-4 text-sm leading-7 text-text-light">From first search to final signature, every step is designed to reduce uncertainty and keep the next decision clear.</p>
            </div>
          </Reveal>
          <div className="relative mt-12">
            <div className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-border lg:block" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <Reveal key={step.number} delay={index * 0.08}>
                  <div className="group relative">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-primary/35 bg-white font-serif text-sm font-bold text-primary-dark transition-colors group-hover:bg-primary group-hover:text-secondary">
                      {step.number}
                    </div>
                    <div className="mt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <step.icon size={17} className="text-primary-dark" strokeWidth={1.8} />
                        <h3 className="font-serif text-xl font-bold text-secondary">{step.title}</h3>
                      </div>
                      <p className="max-w-[260px] text-sm leading-6 text-text-light">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION PROMISE — links match listings' ?search= param */}
      <section className="bg-secondary text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <Reveal direction="left">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary">Where we work</p>
                <h2 className="mt-3 font-serif text-4xl font-bold leading-tight md:text-5xl">
                  Distinctive homes.
                  <br />
                  <em className="font-normal">Desirable places.</em>
                </h2>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="grid grid-cols-1 border-y border-white/10 sm:grid-cols-2 lg:grid-cols-4">
                {["Malibu", "Manhattan", "Aspen", "Boston"].map((location) => (
                  <Link
                    key={location}
                    href={`/listings?search=${encodeURIComponent(location)}`}
                    className="group flex items-center justify-between border-b border-white/10 px-4 py-5 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold text-white/75">
                      <MapPin size={15} className="text-primary" />
                      {location}
                    </span>
                    <ArrowRight size={15} className="text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Deferred>
        <Testimonials />
        <Newsletter />
      </Deferred>
    </>
  );
}