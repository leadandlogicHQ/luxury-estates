import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { resolveImage } from "@/lib/image";
import {
  ShieldCheck,
  Award,
  Users,
  Lightbulb,
  ArrowRight,
  Check,
  Quote,
} from "lucide-react";
import type { Metadata } from "next";
import HeroBackground from "@/components/HeroBackground";
import JsonLd from "@/components/JsonLd";
import { aboutSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us | Luxury Estates",
  description:
    "Two decades of exceptional luxury real estate service. Meet the team behind Luxury Estates and the values that guide us.",
};

export const dynamic = "force-dynamic";

const stats: {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}[] = [
    { end: 500, suffix: "+", label: "Properties Sold" },
    { end: 2.5, prefix: "$", decimals: 1, suffix: "B", label: "Sales Volume" },
    { end: 15, label: "Expert Advisors" },
    { end: 20, suffix: "+", label: "Years of Experience" },
  ];

const values = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Integrity",
    desc: "Honest, transparent dealings in every transaction. Your trust is our most valuable asset.",
  },
  {
    icon: Award,
    number: "02",
    title: "Excellence",
    desc: "We settle for nothing less than extraordinary results for every client, every time.",
  },
  {
    icon: Users,
    number: "03",
    title: "Client First",
    desc: "Your goals are our goals. We work tirelessly to exceed your expectations at every step.",
  },
  {
    icon: Lightbulb,
    number: "04",
    title: "Innovation",
    desc: "Leveraging the latest technology and market insights to give you a competitive advantage.",
  },
];

const approach = [
  {
    index: "01",
    title: "Discover",
    desc: "We listen first—understanding your goals, lifestyle, timing, and what matters most.",
  },
  {
    index: "02",
    title: "Curate",
    desc: "We narrow the market into a considered collection of properties that genuinely fit.",
  },
  {
    index: "03",
    title: "Advise",
    desc: "We bring local intelligence, negotiation expertise, and transparent guidance to every decision.",
  },
  {
    index: "04",
    title: "Deliver",
    desc: "From first viewing to closing, we make the experience composed, responsive, and personal.",
  },
];

const InstagramIcon = ({ size = 14 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default async function AboutPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <JsonLd
        data={[
          ...aboutSchema(agents.map((a) => ({ name: a.name, title: a.title }))),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      {/* HERO — editorial introduction */}
      <section className="relative min-h-[72vh] overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0 overflow-hidden">
          <HeroBackground src="/property3.webp" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/45 via-secondary/55 to-secondary/90" />

        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-between px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-white/75">
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2 text-white/25">/</span>
              <span className="text-white/80">About</span>
            </p>

            <span className="hidden items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/70 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Since 2005
            </span>
          </div>

          <div className="max-w-4xl pb-10 pt-24">
            <Reveal direction="up">
              <span className="mb-5 inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-primary">
                Our Story
              </span>
            </Reveal>

            <Reveal direction="up" delay={0.08}>
              <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.8rem]">
                A legacy built
                <br />
                <em className="font-normal text-primary">around trust.</em>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.16}>
              <div className="mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                <p className="max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                  Two decades of exceptional real estate service, built around
                  local expertise, thoughtful guidance, and a deeply personal
                  approach to every move.
                </p>

                <Link
                  href="#story"
                  className="inline-flex w-fit shrink-0 items-center gap-2 border-b border-primary/60 pb-2 text-sm font-semibold text-white transition-colors hover:text-primary"
                >
                  Explore our story
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 pt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/70">
            <span className="h-px w-10 bg-primary/70" />
            Scroll to discover
            <span className="text-primary">↓</span>
          </div>
        </div>
      </section>

      {/* STORY — strong content hierarchy */}
      <section id="story" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal direction="left">
              <div className="lg:sticky lg:top-28">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary-dark">
                  The Foundation
                </span>

                <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">
                  Property is more than a transaction.
                </h2>

                <div className="mt-7 h-px w-20 bg-primary" />

                <p className="mt-7 max-w-md text-sm leading-7 text-text-light">
                  It is a decision about where life happens next. Our role is
                  to make that decision clearer, more informed, and more
                  considered.
                </p>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="space-y-7 text-[0.98rem] leading-8 text-text-light">
                <p className="font-serif text-2xl leading-relaxed text-secondary md:text-[1.8rem]">
                  Founded in 2005, Luxury Estates began with a simple mission:
                  to provide an unparalleled real estate experience for
                  discerning clients.
                </p>

                <p>
                  What started as a boutique agency in Beverly Hills has grown
                  into a premier luxury real estate firm with offices across the
                  country. We believe buying or selling a home is more than a
                  transaction—it&apos;s a life-changing experience.
                </p>

                <p>
                  Our team combines deep local market knowledge with global
                  reach, ensuring every client receives a high level of service
                  and results. We bring calm to complex decisions and clarity to
                  moments where every detail matters.
                </p>

                <p>
                  Today, Luxury Estates represents some of the most prestigious
                  properties in the nation—from Malibu cliffside villas to
                  Manhattan penthouses to historic Boston estates.
                </p>

                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 border-b border-secondary/20 pb-2 pt-2 text-sm font-bold uppercase tracking-[0.12em] text-secondary transition-colors hover:border-primary hover:text-primary-dark"
                >
                  Start a conversation
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* IMAGE STORY */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal direction="left">
              <div className="relative">
                <div className="absolute -bottom-5 -left-5 h-24 w-24 border-l border-b border-primary/60" />

                <div className="relative overflow-hidden bg-secondary">
                  <Image
                    src="/property5.webp"
                    alt="Luxury Estates signature cliffside property"
                    width={1000}
                    height={750}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.015]"
                  />
                </div>

                <div className="absolute bottom-5 right-5 max-w-[190px] border border-white/15 bg-secondary/88 px-5 py-4 text-white backdrop-blur-sm">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-primary">
                    Our Perspective
                  </p>
                  <p className="mt-2 font-serif text-lg leading-tight">
                    Exceptional homes deserve exceptional presentation.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary-dark">
                  How We Work
                </span>

                <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">
                  Calm guidance.
                  <br />
                  <em className="font-normal">Considered decisions.</em>
                </h2>

                <div className="mt-7 space-y-0 border-t border-border">
                  {approach.map((item, index) => (
                    <Reveal key={item.index} delay={index * 0.06}>
                      <div className="group grid grid-cols-[44px_1fr] gap-4 border-b border-border py-5">
                        <span className="pt-1 text-[0.62rem] font-bold tracking-[0.14em] text-primary-dark">
                          {item.index}
                        </span>

                        <div>
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-serif text-xl font-bold text-secondary">
                              {item.title}
                            </h3>
                            <ArrowRight
                              size={15}
                              className="shrink-0 text-text-light transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary-dark"
                            />
                          </div>

                          <p className="mt-1.5 max-w-xl text-sm leading-6 text-text-light">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS — context, not decoration */}
      <section className="bg-secondary text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary">
                Experience in Numbers
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
                A track record measured over time.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-white/70">
              The scale of our work gives context to the depth of our
              experience.
            </p>
          </div>

          <div className="grid grid-cols-2 border-y border-white/10 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.06}>
                <div
                  className={`px-5 py-8 sm:px-7 lg:py-10 ${index > 0 ? "border-l border-white/10" : ""
                    }`}
                >
                  <p className="font-serif text-4xl font-bold tracking-tight text-primary md:text-5xl">
                    <CountUp
                      end={stat.end}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </p>
                  <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/70">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary-dark">
                The People
              </span>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">
                Meet the advisors behind the experience.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-text-light">
                Local intelligence, market knowledge, and a personal standard
                of service at every stage of your journey.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent, index) => (
              <Reveal key={agent.id} delay={index * 0.08}>
                {/* 
                  FIX: Added `flex flex-col` to the article container 
                  so inner elements can utilize flexbox distribution. 
                */}
                <article className="group flex h-full flex-col overflow-hidden border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_18px_45px_rgba(23,23,23,0.08)]">
                  <div className="relative aspect-[4/4.65] shrink-0 overflow-hidden bg-off-white">
                    <Image
                      src={resolveImage(agent.photo)}
                      alt={agent.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/75 via-secondary/15 to-transparent p-5 pt-16">
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-primary">
                        Luxury Estates
                      </p>
                    </div>
                  </div>

                  {/* FIX: Replaced `h-full` with `flex-1` to grow dynamically */}
                  <div className="flex flex-1 flex-col p-5">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-secondary">
                        {agent.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary-dark">
                        {agent.title}
                      </p>

                      <p className="mt-4 text-sm leading-6 text-text-light">
                        {agent.bio}
                      </p>
                    </div>

                    {/* FIX: Replaced `mt-5` with `mt-auto` to anchor footers bottom */}
                    <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
                      <a
                        href="https://www.instagram.com"
                        aria-label={`${agent.name} on Instagram`}
                        className="flex h-9 w-9 items-center justify-center border border-border text-text-light transition-colors hover:border-primary hover:bg-primary/8 hover:text-primary-dark"
                      >
                        <InstagramIcon />
                      </a>

                      <a
                        href="https://www.linkedin.com"
                        aria-label={`${agent.name} on LinkedIn`}
                        className="flex h-9 w-9 items-center justify-center border border-border text-text-light transition-colors hover:border-primary hover:bg-primary/8 hover:text-primary-dark"
                      >
                        <LinkedinIcon />
                      </a>

                      <span className="ml-auto inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-text-light">
                        <Check size={12} className="text-primary-dark" />
                        Advisor
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES — grouped and scannable */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary-dark">
                  What We Stand For
                </span>
                <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">
                  Principles that shape every decision.
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-7 text-text-light lg:justify-self-end">
                These principles guide every recommendation, negotiation, and
                relationship—so the experience stays as considered as the
                properties we represent.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.07}>
                <div
                  className={`group border-b border-border px-6 py-7 sm:px-7 lg:border-b-0 ${index > 0 ? "lg:border-l lg:border-border" : ""
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[0.6rem] font-bold tracking-[0.18em] text-primary-dark">
                      {value.number}
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/8 text-primary-dark transition-colors group-hover:bg-primary/15">
                      <value.icon size={18} strokeWidth={1.8} />
                    </span>
                  </div>

                  <h3 className="mt-8 font-serif text-2xl font-bold text-secondary">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-light">
                    {value.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING QUOTE */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-28">
          <Reveal>
            <Quote
              size={34}
              className="mx-auto mb-6 text-primary/60"
              strokeWidth={1.5}
            />

            <blockquote className="font-serif text-3xl leading-[1.25] text-secondary md:text-5xl">
              We believe exceptional real estate service should feel
              <em className="font-normal"> personal, calm, and precise.</em>
            </blockquote>

            <div className="mx-auto mt-7 h-px w-16 bg-primary" />
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA — single primary direction */}
      <section className="relative overflow-hidden bg-secondary text-white">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-primary/5" />
        <div className="absolute right-10 top-10 h-44 w-44 rounded-full border border-primary/10" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-24">
          <Reveal>
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary">
              Begin the Conversation
            </span>

            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-5xl">
              Ready for your next move?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
              Whether you are buying, selling, or simply exploring what is
              possible, our advisors are ready to guide you.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-dark"
              >
                Explore Properties
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:border-primary/50 hover:text-primary"
              >
                Contact Our Team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}