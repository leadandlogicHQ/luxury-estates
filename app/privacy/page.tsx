import PageHero from "@/components/PageHero";
import Link from "next/link";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Luxury Estates",
  description:
    "Learn how Luxury Estates collects, uses, and protects your personal information.",
};

const sections = [
  { id: "information", label: "Information We Collect" },
  { id: "use", label: "How We Use Your Information" },
  { id: "services", label: "Third-Party Services" },
  { id: "rights", label: "Your Rights & Choices" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumb="Privacy Policy"
        eyebrow="Legal"
        title={
          <>
            Your privacy, <em className="font-normal text-primary">respected.</em>
          </>
        }
        subtitle="We believe exceptional service begins with trust. This policy explains how we handle your information when you visit our site, inquire about properties, or join our audience list."
        image="/property4.webp"
      />

      <div className="bg-off-white">
        {/* Document orientation */}
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Privacy at a glance
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-secondary sm:text-3xl">
                  Clear information. Clear choices.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-text-light">
                  This page is structured so you can quickly understand what
                  information we collect, why we use it, and the choices
                  available to you.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 border border-border bg-off-white px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                <div>
                  <p className="text-[0.61rem] font-bold uppercase tracking-[0.16em] text-text-light">
                    Last updated
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-secondary">
                    October 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 lg:px-10">
          {/* Section navigation */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-text-light">
              On this page
            </p>

            <nav className="mt-4" aria-label="Privacy policy sections">
              <div className="border-l border-border">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group relative block border-l border-transparent px-4 py-2.5 text-sm leading-5 text-text-light transition-colors hover:border-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <span className="inline-flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary/60 opacity-0 transition-opacity group-hover:opacity-100" />
                      {section.label}
                    </span>
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          {/* Policy document */}
          <article className="max-w-3xl">
            <div className="space-y-16">
              <section id="information" className="scroll-mt-28">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                  01
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-secondary sm:text-4xl">
                  Information We Collect
                </h2>
                <p className="mt-4 text-base leading-7 text-text-light">
                  We only collect information you choose to share with us, or
                  information necessary to provide a secure browsing experience:
                </p>

                <div className="mt-8 divide-y divide-border border-y border-border">
                  <div className="py-6">
                    <h3 className="text-sm font-bold text-secondary">
                      Inquiries &amp; Tours
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-text-light">
                      When you submit a contact form, we collect your name,
                      email, phone number, and the details of your request to
                      route your inquiry to the appropriate advisor.
                    </p>
                  </div>

                  <div className="py-6">
                    <h3 className="text-sm font-bold text-secondary">
                      Newsletter &amp; Audience List
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-text-light">
                      If you subscribe to property updates, we collect your
                      email address to send relevant market insights and new
                      listings.
                    </p>
                  </div>

                  <div className="py-6">
                    <h3 className="text-sm font-bold text-secondary">
                      Shortlist Emails
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-text-light">
                      If you choose to email your saved properties to yourself,
                      we collect your email address to deliver the summary and
                      add you to our audience list.
                    </p>
                  </div>

                  <div className="py-6">
                    <h3 className="text-sm font-bold text-secondary">
                      Cookies &amp; Local Storage
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-text-light">
                      We use local storage to remember your saved properties
                      (shortlist) and cookie preferences. We do not use invasive
                      cross-site tracking cookies.
                    </p>
                  </div>
                </div>
              </section>

              <section id="use" className="scroll-mt-28">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                  02
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-secondary sm:text-4xl">
                  How We Use Your Information
                </h2>
                <p className="mt-4 text-base leading-7 text-text-light">
                  Your information is used strictly to facilitate your real
                  estate journey:
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    "To respond to your property inquiries and arrange private viewings.",
                    "To send curated property updates and market insights you explicitly opted into.",
                    "To improve the performance, security, and editorial quality of our website.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 border border-border bg-white px-4 py-4"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-primary/15 text-primary-dark"
                        aria-hidden="true"
                      >
                        <Check size={13} />
                      </span>
                      <p className="text-sm leading-6 text-text-light">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-l-2 border-primary bg-white px-5 py-4">
                  <p className="text-sm leading-7 text-secondary">
                    We <strong className="font-bold">never</strong> sell, rent,
                    or trade your personal information to third-party marketers
                    or data brokers.
                  </p>
                </div>
              </section>

              <section id="services" className="scroll-mt-28">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                  03
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-secondary sm:text-4xl">
                  Third-Party Services
                </h2>
                <p className="mt-4 text-base leading-7 text-text-light">
                  To deliver a high-quality experience, we rely on a minimal set
                  of trusted infrastructure partners:
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="border border-border bg-white p-5">
                    <h3 className="text-sm font-bold text-secondary">Cloudinary</h3>
                    <p className="mt-2 text-sm leading-6 text-text-light">
                      Used to optimize and deliver high-resolution property
                      photography.
                    </p>
                  </div>

                  <div className="border border-border bg-white p-5">
                    <h3 className="text-sm font-bold text-secondary">Google Maps</h3>
                    <p className="mt-2 text-sm leading-6 text-text-light">
                      Embedded to display property locations. Google may collect
                      standard telemetry when the map iframe loads.
                    </p>
                  </div>

                  <div className="border border-border bg-white p-5 sm:col-span-2">
                    <h3 className="text-sm font-bold text-secondary">Vercel / Neon</h3>
                    <p className="mt-2 text-sm leading-6 text-text-light">
                      Our hosting and database providers, which maintain strict
                      enterprise-grade security and encryption standards.
                    </p>
                  </div>
                </div>
              </section>

              <section id="rights" className="scroll-mt-28">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                  04
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-secondary sm:text-4xl">
                  Your Rights &amp; Choices
                </h2>
                <p className="mt-4 text-base leading-7 text-text-light">
                  You maintain full control over your data:
                </p>

                <div className="mt-8 divide-y divide-border border-y border-border">
                  <div className="py-6">
                    <h3 className="text-sm font-bold text-secondary">Unsubscribe</h3>
                    <p className="mt-2 text-sm leading-7 text-text-light">
                      Every newsletter email includes a clear link to unsubscribe
                      from future updates.
                    </p>
                  </div>

                  <div className="py-6">
                    <h3 className="text-sm font-bold text-secondary">Local Data</h3>
                    <p className="mt-2 text-sm leading-7 text-text-light">
                      You can clear your saved shortlist at any time directly
                      from the shortlist drawer on our site.
                    </p>
                  </div>

                  <div className="py-6">
                    <h3 className="text-sm font-bold text-secondary">Data Deletion</h3>
                    <p className="mt-2 text-sm leading-7 text-text-light">
                      You may request the deletion of your inquiry history or
                      subscriber record at any time by contacting us.
                    </p>
                  </div>
                </div>
              </section>

              <section id="contact" className="scroll-mt-28">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                  05
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-secondary sm:text-4xl">
                  Contact Us
                </h2>
                <p className="mt-4 text-base leading-7 text-text-light">
                  If you have questions about this policy or wish to exercise
                  your data rights, our team is ready to assist.
                </p>

                <div className="mt-8 border border-border bg-secondary p-6 text-white sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-light">
                        Privacy inquiries
                      </p>
                      <h3 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                        Need clarification?
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                        We typically respond within one business day.
                      </p>
                    </div>

                    <Link
                      href="/contact"
                      className="group inline-flex shrink-0 items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
                    >
                      <Mail size={16} aria-hidden="true" />
                      Contact Our Team
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </section>
      </div>
    </>
  );
}