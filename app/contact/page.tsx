import ContactForm from "@/components/ContactForm";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import type { Metadata } from "next";
import HeroBackground from "@/components/HeroBackground";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, contactPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us | Luxury Estates",
  description:
    "Get in touch with Luxury Estates — schedule a tour or ask about our listings.",
};

type InfoLine = {
  text?: string;
  link?: { href: string; label: string };
};

type InfoItem = {
  icon: LucideIcon;
  title: string;
  lines: InfoLine[];
};

const infoItems: InfoItem[] = [
  {
    icon: MapPin,
    title: "Head Office",
    lines: [
      { text: "123 Rodeo Drive, Suite 500" },
      { text: "Beverly Hills, CA 90210" },
    ],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: [
      {
        text: "Main: ",
        link: { href: "tel:+13105550123", label: "(310) 555-0123" },
      },
      {
        text: "Toll-Free: ",
        link: { href: "tel:+18005550199", label: "(800) 555-0199" },
      },
    ],
  },
  {
    icon: Mail,
    title: "Email",
    lines: [
      {
        link: {
          href: "mailto:info@luxuryestates.com",
          label: "info@luxuryestates.com",
        },
      },
      {
        link: {
          href: "mailto:support@luxuryestates.com",
          label: "support@luxuryestates.com",
        },
      },
    ],
  },
];

const officeHours = [
  { icon: Clock, text: "Monday – Friday: 9:00 AM – 6:00 PM" },
  { icon: Clock, text: "Saturday: 10:00 AM – 4:00 PM" },
  { icon: CalendarDays, text: "Sunday: By Appointment Only" },
];

const responsePoints = [
  "Private property viewings",
  "Buying and selling guidance",
  "Market and listing questions",
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ propertyId?: string }>;
}) {
  const { propertyId } = await searchParams;

  return (
    <>
      <JsonLd
        data={[
          contactPageSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      {/* =========================================================
          HERO — orient the user before asking for anything
         ========================================================= */}
      <section className="relative overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0 overflow-hidden">
          <HeroBackground src="/property4.webp" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-secondary/60 to-secondary/95" />

        <div className="relative z-10 mx-auto flex min-h-[460px] sm:min-h-[520px] max-w-7xl flex-col justify-between px-5 py-8 sm:px-8 lg:px-10">
          <nav
            aria-label="Breadcrumb"
            className="text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-white/70"
          >
            <Link
              href="/"
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>
            <span aria-hidden="true" className="mx-2 text-white/20">/</span>
            <span className="text-white/80">Contact</span>
          </nav>

          <div className="max-w-4xl pb-9 pt-20">
            <Reveal direction="up">
              <span className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-primary">
                Private consultation
              </span>
            </Reveal>

            <Reveal direction="up" delay={0.08}>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-[0.97] tracking-tight md:text-6xl lg:text-[5.4rem]">
                Let&apos;s make the
                <br />
                <em className="font-normal text-primary">
                  next move clear.
                </em>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.16}>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                Tell us what you&apos;re looking for. Whether you&apos;re
                exploring a purchase, preparing to sell, or arranging a private
                viewing, our team is ready to guide the next step.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.24}>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-white/70">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  Personal guidance
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  Clear next steps
                </span>
              </div>
            </Reveal>
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 pt-5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/70">
            <ArrowRight size={13} className="text-primary" />
            Complete the form below to begin
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT WORKSPACE — context → information → action
         ========================================================= */}
      <section className="bg-off-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            {/* INFORMATION */}
            <Reveal direction="left">
              <div className="lg:sticky lg:top-24">
                <div>
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-primary-dark">
                    Reach out
                  </p>

                  <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">
                    A real person,
                    <br />
                    <em className="font-normal">not a handoff.</em>
                  </h2>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-text-light">
                    We keep the first conversation simple. Share what you need
                    and an advisor can help you understand the relevant options
                    and next steps.
                  </p>
                </div>

                {propertyId && (
                  <div className="mt-7 border-l-2 border-primary bg-white px-5 py-4">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                      Property inquiry
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-text-light">
                      Your message is connected to a specific property request.
                      Include any viewing or question details in the form.
                    </p>
                  </div>
                )}

                <div className="mt-8 border-y border-border">
                  {infoItems.map((item) => (
                    <div
                      key={item.title}
                      className="grid grid-cols-[42px_1fr] gap-4 border-b border-border py-5 last:border-b-0"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/8 text-primary-dark">
                        <item.icon size={17} strokeWidth={1.8} />
                      </span>

                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-bold text-secondary">
                          {item.title}
                        </h3>

                        <div className="mt-1.5 space-y-1 text-sm leading-6 text-text-light">
                          {item.lines.map((line, index) => (
                            <p key={index}>
                              {line.text}
                              {line.link && (
                                <a
                                  href={line.link.href}
                                  className="break-all font-medium text-primary-dark transition-colors hover:text-secondary"
                                >
                                  {line.link.label}
                                </a>
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                    Office hours
                  </p>

                  <ul className="mt-3 space-y-2.5 text-sm text-text-light">
                    {officeHours.map((hour) => (
                      <li
                        key={hour.text}
                        className="flex items-center gap-2.5"
                      >
                        <hour.icon
                          size={15}
                          className="shrink-0 text-primary-dark"
                        />
                        <span>{hour.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 grid grid-cols-2 border-y border-border">
                  <div className="py-5">
                    <p className="font-serif text-2xl font-bold text-secondary">
                      &lt; 2hr
                    </p>
                    <p className="mt-1 text-[0.61rem] font-bold uppercase tracking-[0.13em] text-text-light">
                      Response target
                    </p>
                  </div>

                  <div className="border-l border-border px-5 py-5">
                    <p className="font-serif text-2xl font-bold text-secondary">
                      24/7
                    </p>
                    <p className="mt-1 text-[0.61rem] font-bold uppercase tracking-[0.13em] text-text-light">
                      Online availability
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* FORM */}
            <Reveal direction="right">
              <div className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_16px_42px_rgba(23,23,23,0.06)]">
                <div className="border-b border-border px-6 py-6 md:px-8 md:py-7">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                    Your request
                  </p>

                  <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-secondary md:text-4xl">
                    Tell us what you need.
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-text-light">
                    A few details help us route your request to the right
                    person and make the follow-up more useful.
                  </p>
                </div>

                <div className="px-6 py-6 md:px-8 md:py-8">
                  <div className="mb-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {responsePoints.map((point, index) => (
                      <div
                        key={point}
                        className="border border-border bg-off-white/65 px-3.5 py-3"
                      >
                        <span className="text-[0.58rem] font-bold tracking-[0.14em] text-primary-dark">
                          0{index + 1}
                        </span>
                        <p className="mt-1.5 text-xs font-semibold leading-5 text-secondary">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>

                  <ContactForm propertyId={propertyId} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing reassurance — no extra conversion loop */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-20">
          <Reveal>
            <span className="text-[0.64rem] font-bold uppercase tracking-[0.22em] text-primary-dark">
              The next step
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-secondary md:text-4xl">
              Clear advice starts with a clear conversation.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-text-light">
              You do not need to have everything figured out before reaching
              out. Start with the questions you already have.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}