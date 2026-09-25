import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import SortSelect from "@/components/SortSelect";
import FilterSelect from "@/components/FilterSelect";
import {
  SlidersHorizontal,
  Search,
  X,
  Home,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import HeroBackground from "@/components/HeroBackground";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Property Listings | Luxury Estates",
  description: "Browse the full portfolio of luxury properties for sale.",
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const search = typeof sp.search === "string" ? sp.search : "";
  const type = typeof sp.type === "string" ? sp.type : "";
  const minPriceRaw = typeof sp.minPrice === "string" ? sp.minPrice : "";
  const maxPriceRaw = typeof sp.maxPrice === "string" ? sp.maxPrice : "";
  const bedsRaw = typeof sp.beds === "string" ? sp.beds : "";
  const bathsRaw = typeof sp.baths === "string" ? sp.baths : "";
  const sort = typeof sp.sort === "string" ? sp.sort : "featured";

  const minPrice = minPriceRaw ? parseInt(minPriceRaw, 10) : undefined;
  const maxPrice = maxPriceRaw ? parseInt(maxPriceRaw, 10) : undefined;
  const beds = bedsRaw ? parseInt(bedsRaw, 10) : undefined;
  const baths = bathsRaw ? parseInt(bathsRaw, 10) : undefined;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { state: { contains: search, mode: "insensitive" } },
      { zip: { contains: search } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type) {
    where.type = type;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined ? { gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
    };
  }

  if (beds !== undefined) {
    where.beds = { gte: beds };
  }

  if (baths !== undefined) {
    where.baths = { gte: baths };
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : sort === "newest"
          ? { createdAt: "desc" as const }
          : { views: "desc" as const };

  const [properties, typeRows] = await Promise.all([
    prisma.property.findMany({ where, orderBy }),
    prisma.property.findMany({
      select: { type: true },
      distinct: ["type"],
    }),
  ]);

  const activeFilters = [
    search,
    type,
    minPriceRaw,
    maxPriceRaw,
    bedsRaw,
    bathsRaw,
  ].filter(Boolean).length;

  const typeOptions = typeRows
    .map((row) => row.type)
    .filter(Boolean)
    .sort()
    .map((value) => ({
      value,
      label: value,
    }));

  // Reduced min-h to 10 for a more compact fit on small laptops
  const inputClass =
    "w-full min-h-10 rounded-xl border border-border bg-white px-4 text-sm text-text placeholder:text-text-light/55 outline-none transition-[border-color,box-shadow] focus:border-primary/70 focus:ring-2 focus:ring-primary/15";

  const labelClass =
    "mb-1.5 block text-[0.63rem] font-bold uppercase tracking-[0.14em] text-text-light";

  return (
    <>
     <JsonLd
      data={[
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Properties", path: "/listings" },
        ]),
        itemListSchema(properties),
      ]}
    />
      <section className="relative overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0 overflow-hidden">
          <HeroBackground src="/property2.webp" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/45 via-secondary/60 to-secondary/95" />

        <div className="relative z-10 mx-auto flex min-h-[430px] max-w-7xl flex-col justify-between px-5 py-8 sm:px-8 lg:px-10">
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
            <span className="text-white/80">Properties</span>
          </nav>

          <div className="max-w-4xl pb-10 pt-20">
            <span className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-primary">
              Curated collection
            </span>

            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-[0.97] tracking-tight md:text-6xl lg:text-[5.5rem]">
              Find a residence
              <br />
              <em className="font-normal text-primary">
                worth exploring.
              </em>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              Explore distinctive homes and refined residences by location,
              property type, budget, and the details that matter most.
            </p>
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 pt-5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/70">
            <SlidersHorizontal size={13} className="text-primary" />
            Refine the collection using the search panel below
          </div>
        </div>
      </section>

      <section className="bg-off-white">
        <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          {/* Changed grid breakpoint to lg to match the sticky behavior */}
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)]">

            {/* 
              lg:sticky lg:top-24 locks it to the screen. 
              h-fit ensures it doesn't stretch to the height of the properties container.
            */}
            <aside className="lg:sticky lg:top-24 h-fit rounded-[24px]">
              <details
                open
                className="group overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_12px_30px_rgba(23,23,23,0.045)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-border px-4 py-4 marker:hidden [&::-webkit-details-marker]:hidden lg:cursor-default">
                  <div>
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                      Search & refine
                    </p>
                    <h2 className="mt-1 font-serif text-xl font-bold text-secondary">
                      Find your fit
                    </h2>
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary-dark">
                    <SlidersHorizontal size={16} />
                  </span>
                </summary>

                {/* Compressed vertical spacing (space-y-4) to fit standard monitors */}
                <form
                  method="GET"
                  action="/listings"
                  className="space-y-4 p-4"
                >
                  <div>
                    <label htmlFor="listing-search" className={labelClass}>
                      Location
                    </label>

                    <div className="relative">
                      <Search
                        aria-hidden="true"
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-dark"
                      />

                      <input
                        id="listing-search"
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="City, ZIP..."
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <div>
                    <label className={labelClass}>Property type</label>
                    <FilterSelect
                      name="type"
                      defaultValue={type}
                      placeholder="Any"
                      options={typeOptions}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Price range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="minPrice"
                        defaultValue={minPriceRaw}
                        placeholder="Min"
                        aria-label="Minimum price"
                        className={inputClass}
                      />

                      <input
                        type="number"
                        name="maxPrice"
                        defaultValue={maxPriceRaw}
                        placeholder="Max"
                        aria-label="Maximum price"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Beds</label>
                      <FilterSelect
                        name="beds"
                        defaultValue={bedsRaw}
                        placeholder="Any"
                        options={[1, 2, 3, 4, 5, 6].map((n) => ({
                          value: String(n),
                          label: `${n}+`,
                        }))}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Baths</label>
                      <FilterSelect
                        name="baths"
                        defaultValue={bathsRaw}
                        placeholder="Any"
                        options={[1, 2, 3, 4, 5].map((n) => ({
                          value: String(n),
                          label: `${n}+`,
                        }))}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <button
                      type="submit"
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm font-bold text-white transition-colors hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-primary/45"
                    >
                      Apply Filters
                      <ArrowRight size={14} className="text-primary" />
                    </button>

                    <Link
                      href="/listings"
                      className="mt-2.5 inline-flex min-h-8 w-full items-center justify-center gap-1.5 text-xs font-semibold text-text-light transition-colors hover:text-primary-dark"
                    >
                      Clear filters
                      <X size={12} />
                    </Link>
                  </div>
                </form>
              </details>

              {activeFilters > 0 && (
                <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/7 px-4 py-4">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-primary-dark">
                    Search refined
                  </p>
                  <p className="mt-1 text-sm font-semibold text-secondary">
                    {activeFilters} active{" "}
                    {activeFilters === 1 ? "filter" : "filters"}
                  </p>
                </div>
              )}
            </aside>

            <div className="min-w-0">
              <div className="mb-8 flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                    The collection
                  </p>

                  <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-secondary md:text-4xl">
                    {properties.length}{" "}
                    <span className="font-normal text-secondary/65">
                      {properties.length === 1
                        ? "property"
                        : "properties"}
                    </span>
                  </h2>

                  {search ? (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-text-light">
                      <MapPin size={14} className="text-primary-dark" />
                      Results for{" "}
                      <span className="font-semibold text-secondary">
                        {search}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-text-light">
                      Browse the portfolio and choose what deserves a closer
                      look.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden text-[0.6rem] font-bold uppercase tracking-[0.16em] text-text-light sm:inline">
                    Sort by
                  </span>

                  <Suspense fallback={null}>
                    <SortSelect value={sort} />
                  </Suspense>
                </div>
              </div>

              {activeFilters > 0 && (
                <div className="mb-8 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-text-light">
                    Active
                  </span>

                  {search && (
                    <FilterChip
                      icon={<Search size={12} />}
                      label={`“${search}”`}
                    />
                  )}

                  {type && <FilterChip label={type} />}

                  {(minPriceRaw || maxPriceRaw) && (
                    <FilterChip
                      label={`${minPriceRaw
                          ? `$${Number(minPriceRaw).toLocaleString()}`
                          : "Any"
                        } — ${maxPriceRaw
                          ? `$${Number(maxPriceRaw).toLocaleString()}`
                          : "Any"
                        }`}
                    />
                  )}

                  {bedsRaw && (
                    <FilterChip label={`${bedsRaw}+ bedrooms`} />
                  )}

                  {bathsRaw && (
                    <FilterChip label={`${bathsRaw}+ bathrooms`} />
                  )}
                </div>
              )}

              {properties.length > 0 ? (
                <div
                  className="grid grid-cols-1 gap-x-6 gap-y-9 md:grid-cols-2 2xl:grid-cols-3"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(300px, 1fr))",
                  }}
                >
                  {properties.map((property) => (
                    <div key={property.id} className="min-w-0">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_12px_30px_rgba(23,23,23,0.04)]">
                  <div className="px-6 py-20 text-center md:px-10 md:py-24">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/8 text-primary-dark">
                      <Home size={26} />
                    </div>

                    <h3 className="mt-5 font-serif text-2xl font-bold text-secondary">
                      No residences match this search
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-light">
                      Try a broader location, a wider price range, or fewer
                      requirements to explore more of the collection.
                    </p>

                    <Link
                      href="/listings"
                      className="group mt-6 inline-flex items-center gap-2 border-b border-primary/40 pb-2 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary-dark"
                    >
                      Reset and explore all properties
                      <ArrowRight
                        size={15}
                        className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterChip({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/7 px-3 py-1.5 text-[0.64rem] font-semibold text-secondary">
      {icon ? <span className="text-primary-dark">{icon}</span> : null}
      {label}
    </span>
  );
}