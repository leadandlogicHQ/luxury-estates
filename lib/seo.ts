/* lib/seo.ts — schema.org JSON-LD node builders (no @context; JsonLd wraps them) */

const site = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Local filenames → absolute URLs (JSON-LD requires absolute image URLs) */
export const abs = (src: string) =>
  !src
    ? ""
    : src.startsWith("http")
      ? src
      : `${site()}${src.startsWith("/") ? src : `/${src}`}`;

export interface SeoProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  type: string;
  built: number;
  image: string;
  images: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  features?: string[];
  createdAt?: Date;
}

export interface SeoAgent {
  name: string;
  title: string;
  email: string;
  phone: string;
  photo?: string;
}

const availabilityFor = (status: string) =>
  status === "Sold"
    ? "https://schema.org/SoldOut"
    : status === "Pending"
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/InStock";

/** Brand entity — RealEstateAgent implies LocalBusiness + Organization */
export function organizationSchema() {
  const s = site();
  return {
    "@type": "RealEstateAgent",
    "@id": `${s}/#organization`,
    name: "Luxury Estates",
    url: s,
    slogan: "Find a place worth coming home to.",
    foundingDate: "2005",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Rodeo Drive, Suite 500",
      addressLocality: "Beverly Hills",
      addressRegion: "CA",
      postalCode: "90210",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-310-555-0123",
      email: "info@luxuryestates.com",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.instagram.com",
      "https://www.facebook.com",
      "https://www.linkedin.com",
      "https://www.youtube.com",
    ],
  };
}

/** Sitewide entity + sitelinks search box eligibility */
export function webSiteSchema() {
  const s = site();
  return {
    "@type": "WebSite",
    "@id": `${s}/#website`,
    url: s,
    name: "Luxury Estates | Find Your Dream Home",
    inLanguage: "en",
    publisher: { "@id": `${s}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${s}/listings?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const s = site();
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${s}${t.path}`,
    })),
  };
}

/** Catalogue results as a crawlable list (caps at 50 nodes) */
export function itemListSchema(items: { id: string; title: string }[]) {
  const s = site();
  return {
    "@type": "ItemList",
    name: "Luxury Estates property listings",
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${s}/property/${p.id}`,
    })),
  };
}

/** Multi-type entity: listing semantics + valid Place/Accommodation properties */
export function propertySchema(p: SeoProperty) {
  const url = `${site()}/property/${p.id}`;
  const images = [p.image, ...p.images.filter((i) => i !== p.image)]
    .slice(0, 6)
    .map(abs)
    .filter(Boolean);

  return {
    "@type": ["RealEstateListing", "Residence"],
    "@id": url,
    name: p.title,
    description: p.description,
    url,
    image: images,
    ...(p.createdAt ? { datePosted: new Date(p.createdAt).toISOString() } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: p.address,
      addressLocality: p.city,
      addressRegion: p.state,
      postalCode: p.zip,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
    numberOfRooms: p.beds,
    floorSize: { "@type": "QuantitativeValue", value: p.sqft, unitCode: "FTK" },
    amenityFeature: (p.features ?? []).slice(0, 10).map((f) => ({
      "@type": "LocationFeatureSpecification",
      name: f,
      value: true,
    })),
    offers: {
      "@type": "Offer",
      url,
      price: p.price,
      priceCurrency: "USD",
      availability: availabilityFor(p.status),
      seller: { "@id": `${site()}/#organization` },
    },
    seller: { "@id": `${site()}/#organization` },
    mainEntityOfPage: { "@id": url },
  };
}

/** Listing agent as a Person entity, linked back to the brand */
export function agentSchema(a: SeoAgent) {
  return {
    "@type": "Person",
    name: a.name,
    jobTitle: a.title,
    email: `mailto:${a.email}`,
    telephone: a.phone,
    ...(a.photo ? { image: abs(a.photo) } : {}),
    worksFor: { "@id": `${site()}/#organization` },
  };
}

export function contactPageSchema() {
  const s = site();
  return {
    "@type": "ContactPage",
    "@id": `${s}/contact`,
    url: `${s}/contact`,
    name: "Contact Us | Luxury Estates",
    inLanguage: "en",
    mainEntity: { "@id": `${s}/#organization` },
  };
}

export function aboutSchema(agents: { name: string; title: string }[]) {
  const s = site();
  return [
    {
      "@type": "AboutPage",
      "@id": `${s}/about`,
      url: `${s}/about`,
      name: "About Us | Luxury Estates",
      description:
        "Two decades of exceptional luxury real estate service. Meet the team behind Luxury Estates and the values that guide us.",
      inLanguage: "en",
      isPartOf: { "@id": `${s}/#website` },
      mainEntity: { "@id": `${s}/#organization` },
    },
    {
      "@type": "RealEstateAgent",
      "@id": `${s}/#organization`,
      name: "Luxury Estates",
      url: s,
      foundingDate: "2005",
      slogan: "Find a place worth coming home to.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Rodeo Drive, Suite 500",
        addressLocality: "Beverly Hills",
        addressRegion: "CA",
        postalCode: "90210",
        addressCountry: "US",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-310-555-0123",
        email: "info@luxuryestates.com",
        contactType: "customer service",
        areaServed: "US",
        availableLanguage: "English",
      },
      sameAs: [
        "https://www.instagram.com",
        "https://www.facebook.com",
        "https://www.linkedin.com",
        "https://www.youtube.com",
      ],
      numberOfEmployees: { "@type": "QuantitativeValue", value: agents.length || 15 },
      employee: agents.map((a) => ({
        "@type": "Person",
        name: a.name,
        jobTitle: a.title,
        worksFor: { "@id": `${s}/#organization` },
      })),
    },
  ];
}

export function privacyPageSchema() {
  const s = site();
  return {
    "@type": "WebPage",
    "@id": `${s}/privacy`,
    url: `${s}/privacy`,
    name: "Privacy Policy | Luxury Estates",
    description:
      "How Luxury Estates collects, uses, and protects your personal information.",
    inLanguage: "en",
    isPartOf: { "@id": `${s}/#website` },
    about: { "@id": `${s}/#organization` },
  };
}

export function termsPageSchema() {
  const s = site();
  return {
    "@type": "WebPage",
    "@id": `${s}/terms`,
    url: `${s}/terms`,
    name: "Terms of Service | Luxury Estates",
    description:
      "The terms and conditions governing your use of the Luxury Estates website and property listings.",
    inLanguage: "en",
    isPartOf: { "@id": `${s}/#website` },
    about: { "@id": `${s}/#organization` },
  };
}