import { prisma } from "@/lib/prisma";
import {
  Mail,
  Users,
  CalendarDays,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function timeAgo(date: Date) {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000),
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return formatDate(date);
}

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const newThisMonth = subscribers.filter(
    (subscriber) => subscriber.subscribedAt >= monthStart,
  ).length;

  const latestSubscriber = subscribers[0];

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Header / orientation */}
      <section className="relative overflow-hidden rounded-[24px] border border-border bg-secondary text-white shadow-[0_18px_45px_rgba(23,23,23,0.10)]">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-primary/10"
        />
        <div
          aria-hidden="true"
          className="absolute -right-8 bottom-[-120px] h-56 w-56 rounded-full bg-primary/7 blur-3xl"
        />

        <div className="relative z-10 flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-9">
          <div className="max-w-2xl">
            <p className="mb-3 text-[0.63rem] font-bold uppercase tracking-[0.22em] text-primary">
              Audience & contacts
            </p>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Subscribers
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              A clear view of the people who chose to hear about new
              residences and selected market updates.
            </p>
          </div>

          <div className="grid grid-cols-2 overflow-hidden border border-white/10 bg-white/[0.03] sm:grid-cols-3">
            <div className="min-w-[125px] border-r border-white/10 px-5 py-4">
              <div className="flex items-center gap-2 text-primary">
                <Users size={16} />
                <span className="text-[0.57rem] font-bold uppercase tracking-[0.16em] text-white/35">
                  Total
                </span>
              </div>
              <p className="mt-3 font-serif text-2xl font-bold">
                {subscribers.length}
              </p>
              <p className="mt-1 text-xs text-white/35">Subscribers</p>
            </div>

            <div className="min-w-[125px] px-5 py-4 sm:border-r sm:border-white/10">
              <div className="flex items-center gap-2 text-primary">
                <CalendarDays size={16} />
                <span className="text-[0.57rem] font-bold uppercase tracking-[0.16em] text-white/35">
                  New
                </span>
              </div>
              <p className="mt-3 font-serif text-2xl font-bold">
                {newThisMonth}
              </p>
              <p className="mt-1 text-xs text-white/35">This month</p>
            </div>

            <div className="col-span-2 min-w-[125px] border-t border-white/10 px-5 py-4 sm:col-span-1 sm:border-t-0">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 size={16} />
                <span className="text-[0.57rem] font-bold uppercase tracking-[0.16em] text-white/35">
                  Latest
                </span>
              </div>
              <p className="mt-3 truncate font-serif text-lg font-bold">
                {latestSubscriber ? timeAgo(latestSubscriber.subscribedAt) : "—"}
              </p>
              <p className="mt-1 text-xs text-white/35">Most recent signup</p>
            </div>
          </div>
        </div>
      </section>

      {/* Context / action row */}
      <section className="flex flex-col gap-4 rounded-[20px] border border-border bg-white px-5 py-4 shadow-[0_10px_28px_rgba(23,23,23,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
            Audience list
          </p>
          <p className="mt-1 text-sm text-text-light">
            {subscribers.length}{" "}
            {subscribers.length === 1 ? "person has" : "people have"} chosen to
            receive property updates.
          </p>
        </div>

        <Link
          href="/admin"
          className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-secondary transition-colors hover:text-primary-dark"
        >
          Back to overview
          <ChevronRight size={14} />
        </Link>
      </section>

      {subscribers.length === 0 ? (
        /* Empty state — contextual, not generic */
        <section className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_14px_36px_rgba(23,23,23,0.05)]">
          <div className="px-6 py-20 text-center sm:px-10 sm:py-24">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/8 text-primary-dark">
              <Mail size={26} />
            </div>

            <h2 className="mt-5 font-serif text-2xl font-bold text-secondary">
              Your audience list is quiet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-light">
              New subscribers will appear here after visitors choose to receive
              relevant property and market updates.
            </p>

            <Link
              href="/"
              className="group mt-6 inline-flex items-center gap-2 border-b border-primary/40 pb-2 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary-dark"
            >
              View the public site
              <ArrowUpRight
                size={15}
                className="text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </section>
      ) : (
        /* Subscriber list — recognition over recall */
        <section className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_14px_36px_rgba(23,23,23,0.05)]">
          <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                Recent signups
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-secondary">
                Subscriber directory
              </h2>
            </div>

            <p className="text-xs text-text-light">
              Newest subscribers appear first
            </p>
          </div>

          <div className="hidden grid-cols-[72px_minmax(0,1fr)_180px_110px] gap-4 border-b border-border bg-off-white/60 px-5 py-3 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-text-light sm:grid sm:px-7">
            <span>#</span>
            <span>Email</span>
            <span>Subscribed</span>
            <span className="text-right">Status</span>
          </div>

          <div className="divide-y divide-border">
            {subscribers.map((subscriber, index) => (
              <div
                key={subscriber.id}
                className="group px-5 py-5 transition-colors hover:bg-off-white/45 sm:grid sm:grid-cols-[72px_minmax(0,1fr)_180px_110px] sm:items-center sm:gap-4 sm:px-7"
              >
                <div className="hidden text-sm font-serif font-bold text-text-light sm:block">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/8 text-primary-dark">
                      <Mail size={15} />
                    </span>

                    <div className="min-w-0">
                      <a
                        href={`mailto:${subscriber.email}`}
                        className="block truncate text-sm font-semibold text-secondary transition-colors hover:text-primary-dark"
                      >
                        {subscriber.email}
                      </a>

                      <p className="mt-1 text-xs text-text-light sm:hidden">
                        Subscribed {formatDate(subscriber.subscribedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 hidden text-sm text-text-light sm:mt-0 sm:block">
                  <p>{formatDate(subscriber.subscribedAt)}</p>
                  <p className="mt-1 text-xs text-text-light/70">
                    {timeAgo(subscriber.subscribedAt)}
                  </p>
                </div>

                <div className="mt-4 sm:mt-0 sm:text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.13em] text-primary-dark">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Subscribed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}