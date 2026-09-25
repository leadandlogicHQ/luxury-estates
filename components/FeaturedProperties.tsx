import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function FeaturedProperties() {
  // DB query is now isolated and streams independently
  const properties = await prisma.property.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary-dark">
                Curated collection
              </p>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-secondary md:text-5xl">
                Properties worth
                <br />
                taking your time with.
              </h2>
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <p className="text-sm leading-7 text-text-light">
                A small selection from our portfolio. Explore the details,
                compare what matters, and save the residences you want to
                revisit.
              </p>
              <Link
                href="/listings"
                className="group mt-5 inline-flex items-center gap-2 border-b border-primary/40 pb-2 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary-dark"
              >
                Explore the full collection
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
        
        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <Reveal key={property.id} delay={index * 0.08}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedPropertiesSkeleton() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="h-4 w-32 bg-border rounded animate-pulse" />
            <div className="mt-4 h-16 w-64 bg-border rounded animate-pulse" />
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <div className="h-12 w-full bg-border rounded animate-pulse" />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[480px] w-full bg-off-white border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}