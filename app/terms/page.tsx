import PageHero from "@/components/PageHero";
import Link from "next/link";
import { ArrowUpRight, Check, Scale } from "lucide-react";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, termsPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service | Luxury Estates",
  description:
    "The terms and conditions governing your use of the Luxury Estates website and property listings.",
};

const sections = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "listings", label: "Property Listings & Availability" },
  { id: "agency", label: "No Agency Relationship" },
  { id: "property", label: "Intellectual Property" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "external", label: "External Links" },
  { id: "changes", label: "Changes to These Terms" },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[
          termsPageSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: "/terms" },
          ]),
        ]}
      />
      <PageHero
        crumb="Terms of Service"
        eyebrow="Legal"
        title={
          <>
            Clear terms,{" "}
            <em className="font-normal text-primary">considered service.</em>
          </>
        }
        subtitle="The guidelines that govern your use of our platform, property listings, and advisory services."
        image="/property5.webp"
      />

      <div className="bg-off-white">
        {/* Orientation before detail */}
        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Terms at a glance
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-secondary sm:text-3xl">
                  The important points, clearly structured.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-text-light">
                  This page is organized around the areas most relevant to using
                  the Luxury Estates website, viewing listings, and contacting
                  our advisors.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 border border-border bg-off-white px-4 py-3">
                <span
                  className="h-2 w-2 rounded-full bg-primary"
                  aria-hidden="true"
                />
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

            <nav className="mt-4" aria-label="Terms sections">
              <div className="border-l border-border">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group block border-l border-transparent px-4 py-2.5 text-sm leading-5 text-text-light transition-colors hover:border-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <span className="inline-flex items-start gap-2">
                      <span
                        className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary/60 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      {section.label}
                    </span>
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          {/* Legal document */}
          <article className="max-w-3xl">
            <div className="space-y-16">
              <section id="acceptance" className="scroll-mt-28">
                <SectionHeading number="01" title="Acceptance of Terms" />
                <p className="mt-4 text-base leading-7 text-text-light">
                  By accessing and using the Luxury Estates website, you agree
                  to be bound by these Terms of Service. If you do not agree
                  with any part of these terms, please discontinue use of our
                  site.
                </p>
              </section>

              <section id="listings" className="scroll-mt-28">
                <SectionHeading
                  number="02"
                  title="Property Listings & Availability"
                />

                <p className="mt-4 text-base leading-7 text-text-light">
                  The properties, pricing, and availability displayed on this
                  site are provided for informational purposes only and are
                  subject to change without notice.
                </p>

                <div className="mt-8 divide-y divide-border border-y border-border">
                  <TermPoint>
                    Listings may be withdrawn, sold, or leased prior to your
                    inquiry.
                  </TermPoint>
                  <TermPoint>
                    Pricing is subject to adjustment based on market conditions
                    or seller directives.
                  </TermPoint>
                  <TermPoint>
                    While we strive for absolute accuracy, Luxury Estates does
                    not warrant that all property details (e.g., square
                    footage, lot size, zoning) are entirely error-free. We
                    encourage independent verification during private viewings.
                  </TermPoint>
                </div>
              </section>

              <section id="agency" className="scroll-mt-28">
                <SectionHeading number="03" title="No Agency Relationship" />

                <div className="mt-5 border-l-2 border-primary bg-white px-5 py-5">
                  <p className="text-sm leading-7 text-secondary">
                    Browsing our website, saving properties to your shortlist,
                    or subscribing to our newsletter does{" "}
                    <strong className="font-bold">not</strong> create a formal
                    client-agent, fiduciary, or contractual relationship.
                  </p>
                </div>

                <p className="mt-5 text-base leading-7 text-text-light">
                  An agency relationship is only established when a formal
                  representation agreement is signed directly with one of our
                  licensed advisors.
                </p>
              </section>

              <section id="property" className="scroll-mt-28">
                <SectionHeading number="04" title="Intellectual Property" />

                <p className="mt-4 text-base leading-7 text-text-light">
                  All content on this site—including editorial descriptions,
                  architectural photography, branding, and design layouts—is
                  the exclusive property of Luxury Estates or its licensors. You
                  may not reproduce, distribute, or commercially exploit any
                  part of this site without express written permission.
                </p>
              </section>

              <section id="liability" className="scroll-mt-28">
                <SectionHeading number="05" title="Limitation of Liability" />

                <p className="mt-4 text-base leading-7 text-text-light">
                  Luxury Estates provides this platform on an &quot;as is&quot;
                  basis. We are not liable for any direct, indirect, or
                  consequential damages arising from your use of the site,
                  reliance on listing information, or inability to access the
                  platform due to technical interruptions.
                </p>

                <div className="mt-7 flex items-start gap-3 border border-border bg-white px-5 py-4">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-primary/15 text-primary-dark"
                    aria-hidden="true"
                  >
                    <Check size={13} />
                  </span>
                  <p className="text-sm leading-6 text-text-light">
                    Real estate transactions involve inherent risks; always
                    consult with legal and financial professionals before
                    executing contracts.
                  </p>
                </div>
              </section>

              <section id="external" className="scroll-mt-28">
                <SectionHeading number="06" title="External Links" />

                <p className="mt-4 text-base leading-7 text-text-light">
                  Our site may contain links to third-party services (e.g.,
                  Google Maps, social media platforms). We are not responsible
                  for the privacy practices, content, or terms of these external
                  sites.
                </p>
              </section>

              <section id="changes" className="scroll-mt-28">
                <SectionHeading number="07" title="Changes to These Terms" />

                <p className="mt-4 text-base leading-7 text-text-light">
                  We may periodically update these terms to reflect changes in
                  our services or legal requirements. Continued use of the site
                  following any updates constitutes acceptance of the revised
                  terms.
                </p>

                {/* Support action */}
                <div className="mt-10 border border-border bg-secondary p-6 text-white sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Scale
                          size={15}
                          className="text-primary-light"
                          aria-hidden="true"
                        />
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-light">
                          Questions regarding our terms?
                        </p>
                      </div>

                      <h3 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                        Need clarification?
                      </h3>

                      <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                        Our advisory team is available to clarify any
                        operational guidelines.
                      </p>
                    </div>

                    <Link
                      href="/contact"
                      className="group inline-flex shrink-0 items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
                    >
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

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <>
      <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
        {number}
      </p>
      <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-secondary sm:text-4xl">
        {title}
      </h2>
    </>
  );
}

function TermPoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-5">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-primary/15 text-primary-dark"
        aria-hidden="true"
      >
        <Check size={13} />
      </span>
      <p className="text-sm leading-6 text-text-light">{children}</p>
    </div>
  );
}
