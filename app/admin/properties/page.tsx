import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  ExternalLink,
  MapPin,
  ArrowUpRight,
  Home,
  CircleDollarSign,
  Clock3,
  CheckCircle2,
  Search,
  X,
} from "lucide-react";
import { deleteProperty } from "./actions";
import { resolveImage } from "@/lib/image";
import { formatCurrency } from "@/lib/format";
import FilterSelect from "@/components/FilterSelect";

const statusStyles: Record<string, string> = {
  "For Sale": "bg-[#eef5ef] text-[#4b6a52] border-[#d9e6db]",
  Sold: "bg-[#f5ece9] text-[#8a5d52] border-[#ead8d3]",
  Pending: "bg-[#f5f0e5] text-[#8b703e] border-[#e8dcc1]",
};

export default async function AdminProperties({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "" } = await searchParams;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { agent: true },
  });

  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const forSale = properties.filter((p) => p.status === "For Sale").length;
  const pending = properties.filter((p) => p.status === "Pending").length;
  const sold = properties.filter((p) => p.status === "Sold").length;

  const metrics = [
    { label: "Total Listings", value: properties.length, note: "Portfolio", icon: Home },
    { label: "For Sale", value: forSale, note: "Active inventory", icon: CircleDollarSign },
    { label: "Pending", value: pending, note: "In progress", icon: Clock3 },
    { label: "Total Views", value: totalViews.toLocaleString(), note: "All listings", icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-primary-dark">
            <span className="h-px w-8 bg-primary" />
            Portfolio Management
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-secondary md:text-5xl">
            Properties
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-light md:text-[0.95rem]">
            Manage your luxury property portfolio, monitor listing performance,
            and keep every detail presentation-ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-secondary shadow-sm transition-all hover:border-primary/60 hover:text-primary-dark"
          >
            <ExternalLink size={16} />
            View Website
          </Link>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-secondary shadow-gold transition-all hover:bg-primary-dark hover:-translate-y-0.5"
          >
            <Plus size={17} />
            Add Property
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/[0.07] transition-transform duration-500 group-hover:scale-125" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary-dark">
                <metric.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-text-light/70 transition-colors group-hover:text-primary-dark" />
            </div>
            <div className="relative mt-5">
              <p className="font-serif text-3xl font-bold text-secondary">{metric.value}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">{metric.label}</p>
                <p className="text-[0.68rem] text-text-light">{metric.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="bg-secondary px-6 py-12 text-center text-white md:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              <MapPin size={24} />
            </div>
            <p className="mt-5 font-serif text-2xl font-bold">
              {q || status
                ? "No listings match your search."
                : "Your portfolio is ready for its first listing."}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/65">
              {q || status
                ? "Try a different keyword or clear the filters to see your full collection."
                : "Add a property to begin building the collection shown throughout your public website."}
            </p>
            {q || status ? (
              <Link
                href="/admin/properties"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-secondary transition-colors hover:bg-primary-dark"
              >
                <X size={16} /> Clear Filters
              </Link>
            ) : (
              <Link
                href="/admin/properties/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-secondary transition-colors hover:bg-primary-dark"
              >
                <Plus size={17} /> Add First Property
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <form
            method="GET"
            action="/admin/properties"
            className="flex flex-col gap-4 border-b border-border bg-off-white/60 p-5 md:flex-row md:items-center md:justify-between md:px-6"
          >
            <div>
              <p className="font-serif text-xl font-bold text-secondary">Property Portfolio</p>
              <p className="mt-1 text-xs text-text-light">
                {properties.length} curated listing{properties.length === 1 ? "" : "s"} · {sold} sold
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Search title, city, address…"
                  className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="w-full md:w-40">
                <FilterSelect
                  name="status"
                  defaultValue={status}
                  placeholder="All statuses"
                  options={[
                    { value: "For Sale", label: "For Sale" },
                    { value: "Pending", label: "Pending" },
                    { value: "Sold", label: "Sold" },
                  ]}
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary-light"
              >
                Apply
              </button>
            </div>
          </form>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-white">
                  <th className="px-6 py-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-light">Property</th>
                  <th className="px-4 py-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-light">Price</th>
                  <th className="px-4 py-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-light">Agent</th>
                  <th className="px-4 py-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-light">Status</th>
                  <th className="px-4 py-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-light">Views</th>
                  <th className="px-6 py-4 text-right text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-light">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="group border-b border-border/80 last:border-b-0 hover:bg-off-white/50">
                    <td className="px-6 py-5">
                      <div className="flex min-w-[320px] items-center gap-4">
                        <Link
                          href={`/property/${property.id}`}
                          className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-off-white"
                        >
                          <Image
                            src={resolveImage(property.image)}
                            alt={property.title}
                            fill
                            sizes="96px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/property/${property.id}`}
                            className="block max-w-[340px] truncate font-serif text-base font-bold text-secondary hover:text-primary-dark"
                          >
                            {property.title}
                          </Link>
                          <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-text-light">
                            <MapPin size={12} className="shrink-0 text-primary-dark" />
                            {property.city}, {property.state} · {property.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 align-middle">
                      <span className="font-serif text-base font-bold text-secondary">
                        {formatCurrency(property.price)}
                      </span>
                    </td>
                    <td className="px-4 py-5 align-middle">
                      {property.agent ? (
                        <div className="flex items-center gap-2.5">
                          {property.agent.photo ? (
                            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-primary/25">
                              <Image
                                src={resolveImage(property.agent.photo)}
                                alt={property.agent.name}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </span>
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[0.65rem] font-bold text-primary">
                              {property.agent.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-[140px] truncate text-sm font-semibold text-secondary">
                              {property.agent.name}
                            </p>
                            <p className="text-[0.68rem] text-text-light">Agent</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-text-light">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-5 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${
                          statusStyles[property.status] || "border-border bg-off-white text-text-light"
                        }`}
                      >
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-5 align-middle">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                        <Eye size={15} className="text-primary-dark" />
                        {property.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/property/${property.id}`}
                          title="View live page"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text-light shadow-sm transition-all hover:border-primary/60 hover:text-secondary"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          title="Edit property"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text-light shadow-sm transition-all hover:border-primary/60 hover:text-primary-dark"
                        >
                          <Edit size={16} />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteProperty(property.id);
                          }}
                        >
                          <button
                            type="submit"
                            title="Delete property"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#ead8d3] bg-white text-[#a66b60] shadow-sm transition-all hover:bg-[#f8efec]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 p-4 md:hidden">
            {properties.map((property) => (
              <div key={property.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="flex gap-4 p-4">
                  <Link
                    href={`/property/${property.id}`}
                    className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-off-white"
                  >
                    <Image
                      src={resolveImage(property.image)}
                      alt={property.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-base font-bold text-secondary">{property.title}</p>
                    <p className="mt-1 truncate text-xs text-text-light">
                      {property.city}, {property.state} · {property.type}
                    </p>
                    <p className="mt-2 font-serif text-base font-bold text-primary-dark">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 border-t border-border bg-off-white/60 text-xs">
                  <div className="p-3">
                    <p className="uppercase tracking-[0.1em] text-text-light">Status</p>
                    <span
                      className={`mt-1 inline-flex rounded-full border px-2 py-1 font-semibold ${
                        statusStyles[property.status] || "border-border bg-off-white text-text-light"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <div className="border-x border-border p-3">
                    <p className="uppercase tracking-[0.1em] text-text-light">Views</p>
                    <p className="mt-2 flex items-center gap-1.5 font-semibold text-secondary">
                      <Eye size={13} className="text-primary-dark" /> {property.views.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3">
                    <p className="uppercase tracking-[0.1em] text-text-light">Agent</p>
                    <p className="mt-2 truncate font-semibold text-secondary">
                      {property.agent?.name || "Unassigned"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-border p-3">
                  <Link
                    href={`/property/${property.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-secondary hover:border-primary/50"
                  >
                    <ExternalLink size={14} /> View
                  </Link>
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-secondary hover:border-primary/50 hover:text-primary-dark"
                  >
                    <Edit size={14} /> Edit
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteProperty(property.id);
                    }}
                  >
                    <button
                      type="submit"
                      aria-label="Delete property"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ead8d3] text-[#a66b60] hover:bg-[#f8efec]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-secondary px-6 py-4 text-white">
            <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
              <span className="text-white/55">Luxury Estates · Property operations</span>
              <span className="flex items-center gap-1.5 text-white/70">
                <CheckCircle2 size={13} className="text-primary" />
                Portfolio data synced
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}