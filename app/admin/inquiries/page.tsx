import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Mail,
  Search,
  Inbox,
  Sparkles,
  Clock3,
  ArrowUpRight,
  X,
} from "lucide-react";
import { deleteInquiry, toggleInquiryRead } from "./actions";

function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  /* Server-side filter — same pattern as /admin/properties */
  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { message: { contains: q, mode: "insensitive" } },
    ];
  }

  /* Hero stats stay global; only the list is filtered */
  const [inquiries, totalCount, unreadCount] = await Promise.all([
    prisma.inquiry.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { isRead: false } }),
  ]);

  const readCount = totalCount - unreadCount;

  return (
    <div className="min-h-full space-y-8">
      {/* Page header */}
      <section className="relative overflow-hidden rounded-[28px] border border-border bg-secondary px-7 py-8 text-white shadow-[0_20px_55px_rgba(23,23,23,0.12)] md:px-9">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-primary/20" />
        <div className="absolute -right-5 -bottom-24 h-64 w-64 rounded-full bg-primary/8 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles size={13} />
              Client communications
            </div>
            <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
              Inquiries
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/65 md:text-base">
              Stay on top of every buyer conversation, follow-up request, and
              property lead from one refined workspace.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[390px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Inbox size={16} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                  Total
                </span>
              </div>
              <p className="mt-4 font-serif text-2xl font-bold">{totalCount}</p>
              <p className="mt-1 text-xs text-white/45">Conversations</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Clock3 size={16} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                  New
                </span>
              </div>
              <p className="mt-4 font-serif text-2xl font-bold">{unreadCount}</p>
              <p className="mt-1 text-xs text-white/45">Need attention</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:col-span-1">
              <div className="flex items-center justify-between">
                <CheckCircle2 size={16} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                  Resolved
                </span>
              </div>
              <p className="mt-4 font-serif text-2xl font-bold">{readCount}</p>
              <p className="mt-1 text-xs text-white/45">Marked as read</p>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-[0_12px_32px_rgba(23,23,23,0.04)] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/8 px-3.5 py-2 text-xs font-semibold text-secondary">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(200,164,93,0.12)]" />
            {unreadCount} unread
          </div>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <p className="text-sm text-text-light">
            {q
              ? `${inquiries.length} match${inquiries.length === 1 ? "" : "es"} for "${q}"`
              : `Showing ${totalCount} conversation${totalCount === 1 ? "" : "s"}`}
          </p>
        </div>

        {/* Real search — submits as ?q= and filters server-side */}
        <form
          method="GET"
          action="/admin/inquiries"
          className="flex items-center gap-2 rounded-xl border border-border bg-off-white px-3.5 py-2.5 transition-colors focus-within:border-primary/60 focus-within:bg-white"
        >
          <Search size={16} className="shrink-0 text-text-light" aria-hidden="true" />
          <label htmlFor="inquiry-search" className="sr-only">
            Search inquiries by name, email, or message
          </label>
          <input
            id="inquiry-search"
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search name, email, message…"
            className="w-44 bg-transparent text-sm text-text outline-none placeholder:text-text-light/60 sm:w-64"
          />
          {q && (
            <Link
              href="/admin/inquiries"
              aria-label="Clear search"
              className="shrink-0 text-text-light transition-colors hover:text-secondary"
            >
              <X size={14} />
            </Link>
          )}
        </form>
      </div>

      {inquiries.length === 0 ? (
        q ? (
          /* No matches for the current search */
          <div className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_45px_rgba(23,23,23,0.05)]">
            <div className="px-6 py-20 text-center md:py-28">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/8">
                <Search className="text-primary" size={30} />
              </div>
              <p className="mt-6 font-serif text-2xl font-bold text-secondary">
                No inquiries match "{q}"
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-light">
                Try a different name, email, or keyword — or clear the search
                to see the full inbox.
              </p>
              <Link
                href="/admin/inquiries"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-secondary transition-colors hover:border-primary/50 hover:text-primary-dark"
              >
                <X size={16} /> Clear search
              </Link>
            </div>
          </div>
        ) : (
          /* Empty inbox */
          <div className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_16px_45px_rgba(23,23,23,0.05)]">
            <div className="px-6 py-20 text-center md:py-28">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/8">
                <Mail className="text-primary" size={30} />
              </div>
              <p className="mt-6 font-serif text-2xl font-bold text-secondary">
                Your inbox is quiet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-light">
                New buyer and seller inquiries will appear here as soon as they
                are submitted.
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const isUnread = !inq.isRead;
            return (
              <article
                key={inq.id}
                className={`group overflow-hidden rounded-[22px] border bg-white transition-all duration-300 ${
                  isUnread
                    ? "border-primary/35 shadow-[0_14px_38px_rgba(200,164,93,0.10)]"
                    : "border-border shadow-[0_10px_28px_rgba(23,23,23,0.04)]"
                }`}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Identity / visual rail */}
                  <div
                    className={`flex items-center gap-4 px-5 py-5 lg:w-[230px] lg:flex-col lg:items-start lg:justify-between lg:px-6 ${
                      isUnread ? "bg-primary/8" : "bg-off-white/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-semibold ${
                          isUnread
                            ? "bg-secondary text-primary"
                            : "bg-white text-secondary border border-border"
                        }`}
                      >
                        {initials(inq.firstName, inq.lastName)}
                      </div>
                      <div className="min-w-0 lg:hidden">
                        <p className="truncate font-semibold text-secondary">
                          {inq.firstName} {inq.lastName}
                        </p>
                        <p className="truncate text-xs text-text-light">
                          {inq.email}
                        </p>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-text-light">
                        Received
                      </p>
                      <p className="mt-1 text-sm font-semibold text-secondary">
                        {timeAgo(inq.createdAt)}
                      </p>
                    </div>
                  </div>
                  {/* Inquiry body */}
                  <div className="min-w-0 flex-1 p-5 md:p-6 lg:p-7">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-serif text-xl font-bold text-secondary md:text-2xl">
                            {inq.firstName} {inq.lastName}
                          </h3>
                          {isUnread ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-secondary">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              New inquiry
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-off-white px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-text-light">
                              Read
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-light">
                          <span>{inq.email}</span>
                          {inq.phone && (
                            <>
                              <span className="hidden text-border sm:inline">•</span>
                              <span>{inq.phone}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-6 rounded-2xl border border-border bg-off-white/70 p-5 md:p-6">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-text-light">
                              Message
                            </p>
                            <span className="text-xs text-text-light">
                              {new Date(inq.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-sm leading-7 text-text md:text-[0.95rem]">
                            {inq.message}
                          </p>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex shrink-0 flex-row gap-2 xl:pt-1">
                        <form
                          action={toggleInquiryRead.bind(null, inq.id, isUnread)}
                        >
                          <button
                            type="submit"
                            title={isUnread ? "Mark as read" : "Mark as unread"}
                            className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition-all ${
                              isUnread
                                ? "border-primary/30 bg-primary/10 text-secondary hover:bg-primary hover:text-secondary"
                                : "border-border bg-white text-text-light hover:border-primary/40 hover:text-secondary"
                            }`}
                          >
                            {isUnread ? (
                              <CheckCircle2 size={17} />
                            ) : (
                              <Circle size={17} />
                            )}
                            <span className="hidden sm:inline">
                              {isUnread ? "Mark read" : "Unread"}
                            </span>
                          </button>
                        </form>
                        <form action={deleteInquiry.bind(null, inq.id)}>
                          <button
                            type="submit"
                            title="Delete inquiry"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text-light transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        </form>
                        <div className="hidden h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text-light xl:flex">
                          <ArrowUpRight size={17} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-text-light lg:hidden">
                      <Clock3 size={13} />
                      Received {timeAgo(inq.createdAt)}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}