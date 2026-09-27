import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Square,
  CalendarDays,
  Tag,
  Phone,
  Mail,
  Check,
  MapPin,
  Eye,
  Hash,
  Building2,
  TrendingUp,
  CalendarCheck2,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { resolveImage } from "@/lib/image";
import ViewTracker from "@/components/ViewTracker";
import MortgageCalculator from "@/components/MortgageCalculator";
import PropertyMap from "@/components/PropertyMap";
import PropertyCard from "@/components/PropertyCard";
import PropertyGallery from "@/components/PropertyGallery";
import ShareProperty from "@/components/ShareProperty";
import type { Metadata } from "next";
import { agentSchema, breadcrumbSchema, propertySchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

type PageParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.title} | Luxury Estates`,
    description: `${property.title} — ${formatCurrency(property.price)}. ${property.beds} bed, ${property.baths} bath luxury ${property.type.toLowerCase()} in ${property.city}, ${property.state}.`,
  };
}

export default async function PropertyPage({ params }: PageParams) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { agent: true },
  });
  if (!property) notFound();

  let similar = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      OR: [{ city: property.city }, { type: property.type }],
    },
    take: 3,
  });
  if (similar.length === 0) {
    similar = await prisma.property.findMany({
      where: { id: { not: property.id } },
      take: 3,
    });
  }

  const overview = [
    { icon: CalendarDays, label: "Year Built", value: String(property.built) },
    { icon: Building2, label: "Property Type", value: property.type },
    { icon: Tag, label: "Status", value: property.status },
    {
      icon: TrendingUp,
      label: "Price per Sq Ft",
      value: `$${Math.round(property.price / property.sqft).toLocaleString()}`,
    },
    { icon: Eye, label: "Total Views", value: String(property.views) },
    { icon: Hash, label: "Listing ID", value: property.id.slice(-6).toUpperCase() },
  ];

  /* De-duplicated gallery: primary image first */
  const gallery = [
    property.image,
    ...property.images.filter((img) => img !== property.image),
  ];

  return (
    /* pb-28 on mobile keeps content clear of the sticky CTA */
    <>
      <JsonLd
        data={[
          propertySchema(property),
          ...(property.agent ? [agentSchema(property.agent)] : []),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Listings", path: "/listings" },
            { name: property.title, path: `/property/${property.id}` },
          ]),
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 py-10 pb-28 md:pb-10">
        <ViewTracker id={property.id} />

        {/* Breadcrumb */}
        <nav className="text-sm text-text-light mb-8">
          <Link href="/" className="text-primary-dark hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/listings" className="text-primary-dark hover:underline">Listings</Link>
          <span className="mx-2">/</span>
          <span className="text-secondary font-medium">{property.title}</span>
        </nav>

        {/* Full gallery — thumbnails, lightbox, working shortlist heart */}
        <div className="mb-10">
          <PropertyGallery
            images={gallery}
            title={property.title}
            property={{
              id: property.id,
              title: property.title,
              price: property.price,
              image: property.image,
              location: `${property.city}, ${property.state}`,
            }}
          />
        </div>

        {/* IDENTITY BLOCK — status, title, location, price + share */}
        <div className="space-y-3 mb-10">
          <span className="inline-block bg-primary/15 text-primary-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {property.status}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-secondary leading-tight">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-text-light">
            <MapPin size={16} className="text-primary-dark" />
            <span className="text-sm">
              {property.address}, {property.city}, {property.state} {property.zip}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <p className="font-serif text-3xl md:text-4xl font-bold text-primary-dark">
              {formatCurrency(property.price)}
            </p>
            <ShareProperty title={property.title} />
          </div>
        </div>

        {/* Core facts */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3 bg-white rounded-xl px-7 py-5 mb-12 text-[0.95rem] text-text-light shadow-sm border border-border">
          <span className="flex items-center gap-2.5">
            <BedDouble className="text-primary-dark" size={18} /> {property.beds} Beds
          </span>
          <span className="flex items-center gap-2.5">
            <Bath className="text-primary-dark" size={18} /> {property.baths} Baths
          </span>
          <span className="flex items-center gap-2.5">
            <Square className="text-primary-dark" size={18} /> {property.sqft.toLocaleString()} sqft
          </span>
          <span className="flex items-center gap-2.5">
            <CalendarDays className="text-primary-dark" size={18} /> Built: {property.built}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-14">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary mb-4">About This Property</h2>
              <p className="text-text-light leading-[1.9]">{property.description}</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary mb-4">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {property.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[0.95rem] text-text-light py-2.5 border-b border-border">
                    <Check className="text-primary-dark shrink-0" size={16} /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {overview.map((o) => (
                  <div key={o.label} className="bg-white border border-border rounded-xl p-4 shadow-sm hover:border-primary/40 transition-colors">
                    <o.icon className="text-primary-dark mb-2" size={18} />
                    <p className="text-[0.7rem] uppercase tracking-wider text-text-light font-semibold">{o.label}</p>
                    <p className="font-bold text-secondary mt-0.5 truncate">{o.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary mb-4">Location</h2>
              <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                <PropertyMap lat={property.lat} lng={property.lng} title={property.title} />
              </div>
              <p className="flex items-center gap-2 text-sm text-text-light mt-3">
                <MapPin size={15} className="text-primary-dark shrink-0" />
                {property.address} {property.zip}
              </p>
            </div>
            <div className="bg-secondary text-white rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
              <div>
                <h3 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                  <CalendarCheck2 className="text-primary" size={20} /> Want to see this home in person?
                </h3>
                <p className="text-white/70 text-sm">Schedule a private tour — our agents typically respond within 2 hours.</p>
              </div>
              <Link
                href={`/contact?propertyId=${property.id}`}
                className="bg-primary text-secondary px-6 py-3 rounded-md font-bold whitespace-nowrap hover:bg-primary-dark transition-colors shadow-gold"
              >
                Schedule a Tour
              </Link>
            </div>
          </div>

          {/* Sidebar — sticky, recognition-first agent card */}
          <div className="space-y-8 lg:sticky lg:top-24 h-fit">
            {property.agent && (
              <div className="bg-white border border-border rounded-xl p-6 sm:p-8 text-center shadow-sm">
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-[3px] border-primary shadow-sm">
                  <Image
                    src={resolveImage(property.agent.photo)}
                    alt={property.agent.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold text-secondary">{property.agent.name}</h3>
                <p className="text-primary-dark font-semibold text-sm mt-1 mb-6">{property.agent.title}</p>
                <div className="text-left space-y-3 text-sm text-text-light mb-6 border-t border-b border-border py-4">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-3 hover:text-primary-dark transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <Phone className="text-primary-dark group-hover:text-secondary" size={15} />
                    </div>
                    <span className="font-medium truncate">{property.agent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-3 hover:text-primary-dark transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                      <Mail className="text-primary-dark group-hover:text-secondary" size={15} />
                    </div>
                    <span className="font-medium break-all">{property.agent.email}</span>
                  </a>
                </div>
                <Link
                  href={`/contact?propertyId=${property.id}`}
                  className="w-full bg-primary text-secondary font-bold py-3 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-gold"
                >
                  <Mail size={16} /> Contact Agent
                </Link>
              </div>
            )}
            <MortgageCalculator price={property.price} />
          </div>
        </div>

        {/* Similar Properties */}
        <section className="mt-20">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-secondary inline-block border-b-2 border-primary pb-3 mb-10">
            Similar Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>

        {/* STICKY MOBILE CTA */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-border p-4 flex items-center justify-between gap-4 z-40 shadow-[0_-4px_16px_rgba(47,43,39,0.06)]">
          <div>
            <p className="text-[10px] text-text-light font-bold uppercase tracking-wider">Price</p>
            <p className="font-serif text-xl font-bold text-secondary leading-none">
              {formatCurrency(property.price)}
            </p>
          </div>
          <div className="flex gap-2">
            {property.agent && (
              <a
                href={`tel:${property.agent.phone}`}
                aria-label="Call agent"
                className="px-4 py-2.5 border border-border rounded-md font-semibold text-secondary text-sm shadow-sm"
              >
                <Phone size={16} />
              </a>
            )}
            <Link
              href={`/contact?propertyId=${property.id}`}
              className="px-5 py-2.5 bg-primary text-secondary rounded-md font-bold text-sm shadow-gold"
            >
              Schedule Tour
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}