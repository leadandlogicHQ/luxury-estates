import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Eye,
  Mail,
  Users,
  Plus,
  ExternalLink,
  ArrowUpRight,
  BedDouble,
  Bath,
  Square,
  MessageSquare,
  Clock3,
  ChevronRight,
  Inbox,
  Building2,
  CheckCircle2,
} from "lucide-react";
import PropertyTypeChart from "@/components/admin/PropertyTypeChart";
import InquiryActivityChart from "@/components/admin/InquiryActivityChart";
import { formatCurrency } from "@/lib/format";
import { resolveImage } from "@/lib/image";

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const initials = (first: string, last: string) =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  /* Chart window: first day of the month, five months back */
  const chartStart = new Date(monthStart);
  chartStart.setMonth(chartStart.getMonth() - 5);

  /*
   * Aggregate-first data layer:
   * - Totals via count() / aggregate() / groupBy() — no full-row transfers.
   * - Row fetches capped with `take` to exactly what the UI renders.
   */
  const [
    topListings,
    propertyCount,
    viewsAgg,
    typeGroups,
    agentCount,
    inquiryCount,
    unread,
    inquiriesThisMonth,
    recentInquiries,
    priorityInquiries,
    inquiryDates,
    subscriberCount,
    propertiesThisMonth,
    subscribersThisMonth,
  ] = await Promise.all([
    /* Featured card + top-5 table (already sorted by views) */
    prisma.property.findMany({ orderBy: { views: "desc" }, take: 5 }),
    prisma.property.count(),
    prisma.property.aggregate({ _sum: { views: true } }),
    prisma.property.groupBy({ by: ["type"], _count: { _all: true } }),
    prisma.agent.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { isRead: false } }),
    prisma.inquiry.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.inquiry.findMany({
      where: { isRead: false },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    /* Timestamps only — enough to bucket the six-month chart */
    prisma.inquiry.findMany({
      where: { createdAt: { gte: chartStart } },
      select: { createdAt: true },
    }),
    prisma.subscriber.count(),
    prisma.property.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.subscriber.count({ where: { subscribedAt: { gte: monthStart } } }),
  ]);

  const totalViews = viewsAgg._sum.views ?? 0;

  const chartData = typeGroups.map((g) => ({
    name: g.type,
    value: g._count._all,
  }));

  const months = Array.from({ length: 6 }, (_, index) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - index));
    return d;
  });
  const activity = months.map((d) => ({
    month: d.toLocaleString("en-US", { month: "short" }),
    count: inquiryDates.filter(
      (i) =>
        i.createdAt.getMonth() === d.getMonth() &&
        i.createdAt.getFullYear() === d.getFullYear(),
    ).length,
  }));

  const featured = topListings[0];

  const adminName =
    session?.user?.email?.split("@")[0]?.replace(/[._-]/g, " ") ?? "Admin";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stats = [
    {
      label: "Total Properties",
      value: String(propertyCount),
      meta:
        propertiesThisMonth > 0
          ? `+${propertiesThisMonth} added this month`
          : "No additions this month",
      icon: Home,
    },
    {
      label: "Portfolio Views",
      value: totalViews.toLocaleString(),
      meta: "All-time property views",
      icon: Eye,
    },
    {
      label: "Inquiries",
      value: String(inquiryCount),
      meta:
        inquiriesThisMonth > 0
          ? `+${inquiriesThisMonth} this month`
          : "No new inquiries this month",
      icon: Mail,
    },
    {
      label: "Subscribers",
      value: String(subscriberCount),
      meta:
        subscribersThisMonth > 0
          ? `+${subscribersThisMonth} this month`
          : "No new subscribers this month",
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1580px] space-y-8">
      {/* AWARENESS — surface only what needs attention */}
      <section
        className={`rounded-[22px] border bg-white shadow-[0_10px_28px_rgba(23,23,23,0.04)] ${
          unread > 0 ? "border-primary/30" : "border-border"
        }`}
      >
        <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                unread > 0
                  ? "bg-primary/12 text-primary-dark"
                  : "bg-off-white text-text-light"
              }`}
            >
              {unread > 0 ? <Inbox size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                Attention
              </p>
              <p className="mt-1 font-serif text-lg font-bold text-secondary">
                {unread > 0
                  ? `${unread} new ${unread === 1 ? "inquiry" : "inquiries"} waiting for review`
                  : "No urgent inquiries right now"}
              </p>
              <p className="mt-1 text-xs leading-5 text-text-light">
                {unread > 0
                  ? "Start with the newest conversations before moving to routine portfolio tasks."
                  : "Your workspace is currently clear. Continue managing inventory or reviewing performance."}
              </p>
            </div>
          </div>
          <Link
            href="/admin/inquiries"
            className="inline-flex w-fit shrink-0 items-center gap-1.5 border-b border-primary/40 pb-1 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary-dark"
          >
            Open inquiry desk
            <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      {/* HEADER — awareness / orientation */}
      <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-sm text-text-light">{today}</p>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-secondary sm:text-5xl">
            Welcome back,
            <span className="ml-2 text-primary-dark capitalize">
              {adminName}
            </span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-light">
            A focused view of your inventory, client conversations, audience,
            and listing performance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-secondary-light"
          >
            <Plus size={17} className="text-primary" />
            Add Property
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-secondary transition-colors hover:border-primary/50 hover:text-primary-dark"
          >
            <ExternalLink size={16} className="text-primary-dark" />
            View Site
          </Link>
        </div>
      </header>

      {/* AWARENESS — KPIs with restrained hierarchy */}
      <section className="grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-border bg-border shadow-[0_10px_28px_rgba(23,23,23,0.04)] sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group bg-white p-5 transition-colors hover:bg-off-white/45 sm:p-6"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary-dark">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-text-light/55">
                  Overview
                </span>
              </div>
              <p className="mt-6 font-serif text-3xl font-bold tracking-tight text-secondary sm:text-[36px]">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-text-light">
                {stat.label}
              </p>
              <p className="mt-3 text-xs leading-5 text-text-light/80">
                {stat.meta}
              </p>
            </div>
          );
        })}
      </section>

      {/* PRIORITY — property + inquiry queue */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_0.85fr]">
        {/* Featured property */}
        <article className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_14px_36px_rgba(23,23,23,0.05)]">
          <div className="border-b border-border px-6 py-5 sm:px-7">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
              Priority inventory
            </p>
            <div className="mt-1 flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl font-bold text-secondary">
                Featured residence
              </h2>
              {featured && (
                <Link
                  href="/admin/properties"
                  className="text-xs font-bold text-primary-dark hover:underline"
                >
                  Manage inventory
                </Link>
              )}
            </div>
          </div>
          {featured ? (
            <div className="relative min-h-[410px] overflow-hidden">
              <Image
                src={resolveImage(featured.image)}
                alt={featured.title}
                fill
                sizes="(max-width: 1280px) 100vw, 64vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/25 to-transparent" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                <span className="rounded-full bg-primary px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-secondary">
                  Most viewed
                </span>
                <span className="rounded-full border border-white/15 bg-secondary/35 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {featured.status}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-light">
                      <Building2 size={13} />
                      {featured.type}
                    </p>
                    <h2 className="mt-2 max-w-2xl font-serif text-2xl font-bold text-white sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-white/65">
                      {featured.address}
                    </p>
                  </div>
                  <div className="flex items-end justify-between gap-6 lg:justify-end">
                    <div>
                      <p className="font-serif text-2xl font-bold text-primary-light">
                        {formatCurrency(featured.price)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/68">
                        <span className="inline-flex items-center gap-1.5">
                          <BedDouble size={13} />
                          {featured.beds}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Bath size={13} />
                          {featured.baths}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Square size={13} />
                          {featured.sqft.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Eye size={13} />
                          {featured.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/properties/${featured.id}/edit`}
                      aria-label={`Edit ${featured.title}`}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary hover:text-secondary"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[410px] items-center justify-center p-8 text-center">
              <div className="max-w-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/8 text-primary-dark">
                  <Home size={22} />
                </div>
                <p className="mt-5 font-serif text-xl font-bold text-secondary">
                  Your portfolio is empty
                </p>
                <p className="mt-2 text-sm leading-6 text-text-light">
                  Add your first residence to start building the portfolio.
                </p>
                <Link
                  href="/admin/properties/new"
                  className="mt-5 inline-flex items-center gap-2 border-b border-primary/40 pb-1 text-sm font-bold text-secondary hover:border-primary hover:text-primary-dark"
                >
                  Add first property
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </article>

        {/* Priority queue */}
        <article className="rounded-[24px] border border-border bg-white shadow-[0_14px_36px_rgba(23,23,23,0.05)]">
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Next actions
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-secondary">
                  Priority inquiries
                </h2>
              </div>
              <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary-dark">
                {unread}
              </span>
            </div>
          </div>
          {priorityInquiries.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center px-7 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-off-white text-primary-dark">
                <CheckCircle2 size={20} />
              </div>
              <p className="mt-4 font-serif text-lg font-bold text-secondary">
                All caught up
              </p>
              <p className="mt-1 max-w-xs text-sm leading-6 text-text-light">
                There are no unread inquiries waiting for action.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {priorityInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href="/admin/inquiries"
                  className="group block px-6 py-5 transition-colors hover:bg-off-white/45"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/8 text-xs font-bold text-primary-dark">
                      {initials(inquiry.firstName, inquiry.lastName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-secondary">
                          {inquiry.firstName} {inquiry.lastName}
                        </p>
                        <span className="shrink-0 text-[0.62rem] text-text-light">
                          {timeAgo(inquiry.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-text-light">
                        {inquiry.message}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-primary-dark">
                        Review inquiry
                        <ArrowUpRight
                          size={12}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="border-t border-border px-6 py-4">
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary-dark"
            >
              Open complete inquiry desk
              <ChevronRight size={14} />
            </Link>
          </div>
        </article>
      </section>

      {/* FEEDBACK — analytics in a single clear section */}
      <section className="rounded-[24px] border border-border bg-white shadow-[0_12px_32px_rgba(23,23,23,0.04)]">
        <div className="border-b border-border px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                Feedback
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-secondary">
                Portfolio performance
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-text-light">
                Understand what is happening before deciding what to change.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-off-white px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-text-light">
              <Clock3 size={13} className="text-primary-dark" />
              Last 6 months
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-border xl:grid-cols-[0.8fr_1.2fr] xl:divide-x xl:divide-y-0">
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-xl font-bold text-secondary">
                Property mix
              </h3>
              <span className="text-xs text-text-light">
                {propertyCount} total
              </span>
            </div>
            <div className="mt-4">
              <PropertyTypeChart data={chartData} />
            </div>
          </div>
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-xl font-bold text-secondary">
                Inquiry activity
              </h3>
              <span className="text-xs text-text-light">
                {inquiriesThisMonth} this month
              </span>
            </div>
            <div className="mt-4">
              <InquiryActivityChart data={activity} />
            </div>
          </div>
        </div>
      </section>

      {/* CONTROL — inventory and communication */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <article className="rounded-[24px] border border-border bg-white shadow-[0_12px_32px_rgba(23,23,23,0.04)]">
          <div className="border-b border-border px-6 py-5 sm:px-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Control
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-secondary">
                  Top listings
                </h2>
              </div>
              <Link
                href="/admin/properties"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline"
              >
                View all
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
          {topListings.length === 0 ? (
            <div className="px-6 py-14 text-center text-sm text-text-light">
              No listings available.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {topListings.map((property, index) => (
                <Link
                  key={property.id}
                  href={`/admin/properties/${property.id}/edit`}
                  className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-off-white/45 sm:px-7"
                >
                  <span className="w-5 shrink-0 text-center font-serif text-sm font-bold text-text-light/60">
                    0{index + 1}
                  </span>
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-off-white sm:h-16 sm:w-24">
                    <Image
                      src={resolveImage(property.image)}
                      alt={property.title}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-secondary">
                      {property.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-text-light">
                      {property.address}
                    </p>
                    <p className="mt-1.5 font-serif text-sm font-bold text-primary-dark">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-light">
                      <Eye size={13} className="text-primary-dark" />
                      {property.views.toLocaleString()}
                    </p>
                    <p className="mt-1 text-[0.58rem] uppercase tracking-[0.12em] text-text-light/65">
                      views
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-text-light/55 transition-colors group-hover:text-primary-dark"
                  />
                </Link>
              ))}
            </div>
          )}
        </article>
        <article className="rounded-[24px] border border-border bg-white shadow-[0_12px_32px_rgba(23,23,23,0.04)]">
          <div className="border-b border-border px-6 py-5 sm:px-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                  Communication
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-secondary">
                  Recent inquiries
                </h2>
              </div>
              <Link
                href="/admin/inquiries"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary-dark hover:underline"
              >
                View all
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-off-white text-primary-dark">
                <MessageSquare size={20} />
              </div>
              <p className="mt-4 font-serif text-lg font-bold text-secondary">
                Your inbox is quiet
              </p>
              <p className="mt-1 max-w-xs text-sm leading-6 text-text-light">
                New website inquiries will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href="/admin/inquiries"
                  className="group flex items-start gap-3.5 px-6 py-4 transition-colors hover:bg-off-white/45 sm:px-7"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/8 text-xs font-bold text-primary-dark">
                    {initials(inquiry.firstName, inquiry.lastName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-secondary">
                        {inquiry.firstName} {inquiry.lastName}
                      </p>
                      <span className="shrink-0 text-[0.62rem] text-text-light">
                        {timeAgo(inquiry.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-light">
                      {inquiry.message}
                    </p>
                  </div>
                  {!inquiry.isRead && (
                    <span
                      aria-label="Unread inquiry"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>

      {/* CONTROL — quick operational state */}
      <section className="overflow-hidden rounded-[24px] border border-white/10 bg-secondary text-white shadow-[0_18px_45px_rgba(23,23,23,0.12)]">
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <div className="absolute right-[-80px] top-[-100px] h-64 w-64 rounded-full border border-primary/10" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary-light">
                Portfolio control
              </p>
              <h2 className="mt-1 font-serif text-3xl font-bold">
                {agentCount} Agents
              </h2>
              <p className="mt-1 text-sm text-white/50">
                Managing {propertyCount} listed properties across your
                portfolio.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/properties"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-secondary transition-colors hover:bg-primary-dark"
              >
                Manage Properties
                <ArrowUpRight size={15} />
              </Link>
              <Link
                href="/admin/inquiries"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-primary/30 hover:bg-white/10"
              >
                Open Inquiry Desk
                <Mail size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}