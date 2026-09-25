"use client";

import { useEffect, useId, useRef, useState } from "react";
import type {
  ComponentType,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Map,
  MapPin,
  Ruler,
  Save,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import ImageUpload from "./ImageUpload";
import { resolveImage } from "@/lib/image";
import {
  createProperty,
  updateProperty,
  type PropertyInput,
} from "@/app/admin/properties/actions";

interface AgentOption {
  id: string;
  name: string;
  title: string;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface PropertyFormValues {
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  built: number;
  description: string;
  features: string[];
  image: string;
  images: string[];
  agentId: string;
  lat: number;
  lng: number;
  status?: string;
}

const STATUSES = ["For Sale", "Pending", "Sold"];

export default function PropertyForm({
  agents,
  initial,
  propertyId,
}: {
  agents: AgentOption[];
  initial?: PropertyFormValues;
  propertyId?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(initial?.image ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    address: initial?.address ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    zip: initial?.zip ?? "",
    price: initial ? String(initial.price) : "",
    beds: initial ? String(initial.beds) : "",
    baths: initial ? String(initial.baths) : "",
    sqft: initial ? String(initial.sqft) : "",
    type: initial?.type ?? "",
    built: initial ? String(initial.built) : "",
    status: initial?.status ?? "For Sale",
    description: initial?.description ?? "",
    features: (initial?.features ?? []).join(", "),
    agentId: initial?.agentId ?? "",
    lat: initial ? String(initial.lat) : "",
    lng: initial ? String(initial.lng) : "",
  });

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image || !image.trim()) {
      toast.error("Please upload a primary image.");
      return;
    }
    if (!form.agentId) {
      toast.error("Please select an agent.");
      return;
    }
    setSaving(true);
    const payload: PropertyInput = {
      title: form.title.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip: form.zip.trim(),
      price: Number(form.price),
      beds: Number(form.beds),
      baths: Number(form.baths),
      sqft: Number(form.sqft),
      type: form.type.trim(),
      built: Number(form.built),
      status: form.status,
      description: form.description.trim(),
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      image: image.trim(),
      images: images.length ? images : [image],
      agentId: form.agentId,
      lat: Number(form.lat) || 0,
      lng: Number(form.lng) || 0,
    };
    const res = propertyId
      ? await updateProperty(propertyId, payload)
      : await createProperty(payload);
    setSaving(false);
    if (res.success) {
      toast.success(
        propertyId
          ? "Property updated successfully!"
          : "Property created successfully!",
      );
      router.push("/admin/properties");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save property.");
    }
  };

  const input =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-secondary outline-none transition-all placeholder:text-text-light/60 focus:border-primary focus:ring-4 focus:ring-primary/10";
  const label =
    "mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-light";

  const selectedAgent = agents.find((agent) => agent.id === form.agentId);
  const featureCount = form.features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean).length;

  return (
    <div className="space-y-8 pb-6">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles size={13} />
            Luxury Estates · Portfolio
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-secondary md:text-4xl">
            {propertyId ? "Refine Property Listing" : "Create New Listing"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-light">
            Build a polished property profile with the details, imagery,
            location, and presentation your luxury portfolio deserves.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-secondary transition-all hover:border-primary hover:text-primary-dark"
        >
          <ArrowLeft size={16} />
          Back to Properties
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"
      >
        <div className="space-y-6">
          {/* Identity */}
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_40px_rgba(23,23,23,0.05)]">
            <div className="border-b border-border bg-off-white/70 px-6 py-5 md:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Building2 size={18} />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold text-secondary">
                    Property Identity
                  </h2>
                  <p className="mt-0.5 text-xs text-text-light">
                    The information buyers see first.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-5 p-6 md:grid-cols-2 md:p-7">
              <div className="md:col-span-2">
                <label className={label}>Property Title *</label>
                <input
                  className={`${input} text-base md:text-lg`}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Oceanfront Contemporary Estate"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Street Address *</label>
                <div className="relative">
                  <MapPin
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={17}
                  />
                  <input
                    className={`${input} pl-11`}
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="123 Ocean Drive"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={label}>City *</label>
                <input
                  className={input}
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Malibu"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>State *</label>
                  <input
                    className={input}
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    placeholder="CA"
                    required
                  />
                </div>
                <div>
                  <label className={label}>ZIP *</label>
                  <input
                    className={input}
                    value={form.zip}
                    onChange={(e) => set("zip", e.target.value)}
                    placeholder="90265"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Details + status — NO overflow-hidden so the Status dropdown can escape */}
          <section className="rounded-2xl border border-border bg-white shadow-[0_10px_40px_rgba(23,23,23,0.05)]">
            <div className="border-b border-border px-6 py-5 md:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-dark">
                  <Ruler size={18} />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold text-secondary">
                    Property Details
                  </h2>
                  <p className="mt-0.5 text-xs text-text-light">
                    Core specifications, valuation, and market status.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 md:p-7">
              <div>
                <label className={label}>Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary">
                    $
                  </span>
                  <input
                    type="number"
                    className={`${input} pl-9`}
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="2500000"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={label}>Property Type *</label>
                <input
                  className={input}
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                  placeholder="Villa / Penthouse"
                  required
                />
              </div>
              <div>
                {/* CUSTOM DROPDOWN — Status */}
                <label className={label} htmlFor="property-status">
                  Status
                </label>
                <LuxurySelect
                  id="property-status"
                  icon={Tag}
                  value={form.status}
                  onChange={(v) => set("status", v)}
                  placeholder="Select status"
                  options={STATUSES.map((s) => ({ value: s, label: s }))}
                />
              </div>
              <div>
                <label className={label}>Year Built *</label>
                <div className="relative">
                  <CalendarDays
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={16}
                  />
                  <input
                    type="number"
                    className={`${input} pl-11`}
                    value={form.built}
                    onChange={(e) => set("built", e.target.value)}
                    placeholder="2024"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={label}>Bedrooms *</label>
                <div className="relative">
                  <BedDouble
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={17}
                  />
                  <input
                    type="number"
                    className={`${input} pl-11`}
                    value={form.beds}
                    onChange={(e) => set("beds", e.target.value)}
                    placeholder="4"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={label}>Bathrooms *</label>
                <div className="relative">
                  <Bath
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    size={17}
                  />
                  <input
                    type="number"
                    step="0.5"
                    className={`${input} pl-11`}
                    value={form.baths}
                    onChange={(e) => set("baths", e.target.value)}
                    placeholder="3.5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={label}>Interior Sq Ft *</label>
                <div className="relative">
                  <Ruler className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={17} />
                  <input
                    type="number"
                    className={`${input} pl-11`}
                    value={form.sqft}
                    onChange={(e) => set("sqft", e.target.value)}
                    placeholder="3200"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Location & agent — NO overflow-hidden so the Agent dropdown can escape */}
          <section className="rounded-2xl border border-border bg-white shadow-[0_10px_40px_rgba(23,23,23,0.05)]">
            <div className="border-b border-border px-6 py-5 md:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Map size={18} />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold text-secondary">
                    Location & Representation
                  </h2>
                  <p className="mt-0.5 text-xs text-text-light">
                    Map placement and the responsible agent.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-5 p-6 sm:grid-cols-2 md:p-7">
              <div>
                <label className={label}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={form.lat}
                  onChange={(e) => set("lat", e.target.value)}
                  placeholder="34.0259"
                />
              </div>
              <div>
                <label className={label}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={form.lng}
                  onChange={(e) => set("lng", e.target.value)}
                  placeholder="-118.7798"
                />
              </div>
              <div className="sm:col-span-2">
                {/* CUSTOM DROPDOWN — Listing Agent */}
                <label className={label} htmlFor="property-agent">
                  Listing Agent *
                </label>
                <LuxurySelect
                  id="property-agent"
                  icon={Users}
                  value={form.agentId}
                  onChange={(v) => set("agentId", v)}
                  placeholder="Select Agent"
                  options={agents.map((a) => ({
                    value: a.id,
                    label: `${a.name} — ${a.title}`,
                  }))}
                />
                {selectedAgent && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {selectedAgent.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary">
                        {selectedAgent.name}
                      </p>
                      <p className="text-xs text-text-light">
                        {selectedAgent.title}
                      </p>
                    </div>
                    <CheckCircle2 className="ml-auto text-primary" size={17} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Story */}
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_40px_rgba(23,23,23,0.05)]">
            <div className="border-b border-border px-6 py-5 md:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-dark">
                  <Sparkles size={17} />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold text-secondary">
                    Property Story
                  </h2>
                  <p className="mt-0.5 text-xs text-text-light">
                    Describe what makes the residence exceptional.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-5 p-6 md:p-7">
              <div>
                <label className={label}>Description *</label>
                <textarea
                  rows={7}
                  className={`${input} resize-y leading-7`}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Present the residence in an editorial, buyer-focused style. Highlight architecture, views, craftsmanship, amenities, privacy, and lifestyle."
                  required
                />
              </div>
              <div>
                <div className="flex items-end justify-between gap-4">
                  <label className={`${label} mb-0`}>Signature Features</label>
                  <span className="text-[0.68rem] font-semibold text-text-light">
                    {featureCount} {featureCount === 1 ? "feature" : "features"}
                  </span>
                </div>
                <input
                  className={input}
                  value={form.features}
                  onChange={(e) => set("features", e.target.value)}
                  placeholder="Infinity pool, Ocean view, Smart home"
                />
                <p className="mt-2 text-xs text-text-light">
                  Separate each feature with a comma.
                </p>
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_40px_rgba(23,23,23,0.05)]">
            <div className="border-b border-border px-6 py-5 md:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  ◎
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold text-secondary">
                    Property Media
                  </h2>
                  <p className="mt-0.5 text-xs text-text-light">
                    Use photography that feels editorial and immersive.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-7 p-6 md:p-7">
              <div>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <label className={`${label} mb-1`}>Primary Image *</label>
                    <p className="text-xs text-text-light">
                      This image anchors cards, search results, and featured
                      placements.
                    </p>
                  </div>
                  <span className="rounded-full border border-primary/25 bg-primary/5 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-primary-dark">
                    Cover
                  </span>
                </div>
                <ImageUpload value={image} onChange={(v) => setImage(v as string)} />
              </div>
              <div className="border-t border-border pt-7">
                <div className="mb-3">
                  <label className={`${label} mb-1`}>Gallery Images</label>
                  <p className="text-xs text-text-light">
                    Add supporting angles, interiors, amenities, and lifestyle
                    imagery.
                  </p>
                </div>
                <ImageUpload
                  value={images}
                  onChange={(v) => setImages(v as string[])}
                  multiple
                />
              </div>
            </div>
          </section>
        </div>

        {/* Preview / action rail */}
        <aside className="xl:sticky xl:top-24 xl:h-fit xl:self-start">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-secondary/10 bg-secondary text-white shadow-[0_20px_60px_rgba(23,23,23,0.14)]">
              <div className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary">
                      Listing Preview
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold">
                      How it will feel
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white/65">
                    Live
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/10">
                    {image ? (
                      /* resolveImage handles local filenames like "villa-exterior.webp" */
                      <img
                        src={resolveImage(image)}
                        alt="Property preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/35">
                        <Building2 size={38} />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent p-4 pt-12">
                      <p className="font-serif text-lg font-bold text-white">
                        {form.title || "Untitled Residence"}
                      </p>
                      <p className="mt-1 text-xs text-white/65">
                        {form.city || "City"}
                        {form.state ? `, ${form.state}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
                    <div className="p-3 text-center">
                      <p className="font-serif text-base font-bold text-primary">
                        {form.beds || "—"}
                      </p>
                      <p className="mt-0.5 text-[0.58rem] uppercase tracking-wider text-white/50">
                        Beds
                      </p>
                    </div>
                    <div className="p-3 text-center">
                      <p className="font-serif text-base font-bold text-primary">
                        {form.baths || "—"}
                      </p>
                      <p className="mt-0.5 text-[0.58rem] uppercase tracking-wider text-white/50">
                        Baths
                      </p>
                    </div>
                    <div className="p-3 text-center">
                      <p className="font-serif text-base font-bold text-primary">
                        {form.sqft ? Number(form.sqft).toLocaleString() : "—"}
                      </p>
                      <p className="mt-0.5 text-[0.58rem] uppercase tracking-wider text-white/50">
                        Sq Ft
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.16em] text-white/45">
                      Asking Price
                    </p>
                    <p className="mt-1 font-serif text-2xl font-bold text-primary">
                      {form.price
                        ? `$${Number(form.price).toLocaleString()}`
                        : "$—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.6rem] uppercase tracking-[0.16em] text-white/45">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {form.status}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/75">
                  <CheckCircle2 size={15} className="text-primary" />
                  Listing readiness
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Primary image</span>
                    <span className={image ? "text-primary" : "text-white/30"}>
                      {image ? "Ready" : "Missing"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Agent assigned</span>
                    <span
                      className={form.agentId ? "text-primary" : "text-white/30"}
                    >
                      {form.agentId ? "Ready" : "Missing"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Gallery</span>
                    <span className="text-white/60">{images.length} added</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                Editorial standard
              </p>
              <p className="mt-2 text-sm leading-6 text-secondary/80">
                Lead with the strongest image, use a specific property title,
                and keep the description focused on architecture, lifestyle,
                and distinctive details.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-light">
                <MapPin size={14} className="text-primary" />
                Location Preview
              </div>
              <div className="rounded-xl border border-border bg-off-white p-4">
                <p className="text-sm font-semibold text-secondary">
                  {form.address || "Address not yet set"}
                </p>
                <p className="mt-1 text-xs text-text-light">
                  {form.city || "City"}
                  {form.state ? `, ${form.state}` : ""}
                  {form.zip ? ` ${form.zip}` : ""}
                </p>
                <p className="mt-3 text-[0.68rem] text-text-light">
                  {form.lat && form.lng
                    ? `${form.lat}, ${form.lng}`
                    : "Coordinates will default to 0, 0"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-secondary shadow-[0_12px_30px_rgba(200,164,93,0.26)] transition-all hover:bg-primary-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {saving
                  ? "Saving Listing…"
                  : propertyId
                    ? "Save Property Changes"
                    : "Publish Property"}
              </button>
              <p className="mt-3 text-center text-[0.68rem] leading-5 text-text-light">
                Your changes will be saved to the Luxury Estates portfolio
                immediately.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Custom dropdown (combobox) — replaces native <select>
──────────────────────────────────────────────────────────── */
interface LuxurySelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

function LuxurySelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}: LuxurySelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const optionId = (i: number) => `${generatedId}-option-${i}`;
  const selectedIndex = options.findIndex((o) => o.value === value);
  const current = selectedIndex >= 0 ? options[selectedIndex] : null;

  /* Close on outside click / Escape */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const openList = () => {
    setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((c) => Math.min(c + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((c) => Math.max(c - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        e.preventDefault();
        setHighlighted(options.length - 1);
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const opt = options[highlighted];
        if (opt) select(opt.value);
        break;
      }
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={open ? optionId(highlighted) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={`relative w-full rounded-xl border border-border bg-white pl-11 pr-10 py-3 text-left text-sm text-secondary outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 ${open ? "border-primary" : "hover:border-primary/50"
          }`}
      >
        <Icon
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
        />
        <span
          className={`block truncate ${current ? "text-secondary font-medium" : "text-text-light/60"
            }`}
        >
          {current ? current.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary-dark transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>
      <div
        id={listboxId}
        role="listbox"
        className={`absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-64 origin-top overflow-y-auto rounded-xl border border-border bg-white p-1.5 shadow-[0_18px_45px_rgba(23,23,23,0.12)] transition-all duration-150 ${open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
          }`}
      >
        {options.map((opt, i) => {
          const selected = opt.value === value;
          const active = i === highlighted;
          return (
            <button
              key={opt.value}
              id={optionId(i)}
              type="button"
              role="option"
              aria-selected={selected}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => select(opt.value)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active ? "bg-off-white" : ""
                } ${selected ? "font-semibold text-primary-dark" : "text-text"}`}
            >
              <span className="truncate">{opt.label}</span>
              {selected && (
                <Check size={14} className="shrink-0 text-primary-dark" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}