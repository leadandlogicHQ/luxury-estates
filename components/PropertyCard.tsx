import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { resolveImage } from "@/lib/image";
import ShortlistButton from "./ShortlistButton";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: string;
}

export default function PropertyCard({
  property,
}: {
  property: PropertyCardProps;
}) {
  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-72 overflow-hidden shrink-0">
        <Image
          src={resolveImage(property.image)}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status badge */}
        <span className="absolute top-4 left-4 bg-primary text-secondary text-xs font-bold px-4 py-1.5 rounded-full">
          {property.status}
        </span>

        {/* Shortlist heart — shared context, survives refresh & return visits */}
        <ShortlistButton
          property={{
            id: property.id,
            title: property.title,
            price: property.price,
            image: property.image,
            location: `${property.city}, ${property.state}`,
          }}
        />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <p className="font-serif text-2xl font-bold text-secondary mb-2">
          {formatCurrency(property.price)}
        </p>

        <div className="flex items-center gap-1.5 text-text-light text-sm mb-4">
          <MapPin
            size={14}
            className="text-primary fill-primary shrink-0"
          />
          <span className="truncate">{property.address}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-sm text-text-light">
          <span className="flex items-center gap-1.5">
            <Bed size={16} className="text-primary" />
            {property.beds} Beds
          </span>

          <span className="flex items-center gap-1.5">
            <Bath size={16} className="text-primary" />
            {property.baths} Baths
          </span>

          <span className="flex items-center gap-1.5">
            <Square size={16} className="text-primary" />
            {property.sqft.toLocaleString()} sqft
          </span>
        </div>

        <Link
          href={`/property/${property.id}`}
          className="block w-full text-center border border-secondary text-secondary font-semibold py-2.5 rounded-md hover:bg-secondary hover:text-white transition-colors mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}