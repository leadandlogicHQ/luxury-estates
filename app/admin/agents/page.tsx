import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Edit,
  Mail,
  Phone,
  Plus,
  Users,
} from "lucide-react";
import { resolveImage } from "@/lib/image";
import DeleteAgentButton from "@/components/admin/DeleteAgentButton";

export default async function AdminAgentsPage() {
  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { properties: true } } },
  });

  const totalListings = agents.reduce(
    (sum, agent) => sum + agent._count.properties,
    0,
  );

  return (
    <div className="space-y-8 pb-8">
      <header className="border-b border-border pb-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
              <Briefcase size={13} aria-hidden="true" />
              Team management
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-[-0.03em] text-secondary sm:text-5xl">
              Agents
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-light sm:text-[0.95rem]">
              Manage the advisors who represent your listings and appear across
              the public Luxury Estates experience.
            </p>
          </div>

          <Link
            href="/admin/agents/new"
            className="group inline-flex min-h-11 w-fit items-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus size={16} aria-hidden="true" />
            Add Agent
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </header>

      <section
        aria-label="Agent overview"
        className="grid border-y border-border bg-white sm:grid-cols-3"
      >
        <Metric
          value={agents.length}
          label="Team members"
          detail="Public advisor profiles"
        />

        <Metric
          value={totalListings}
          label="Assigned listings"
          detail="Current representation"
          divided
        />

        <div className="px-5 py-5 sm:px-6">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-primary-dark">
            Operational role
          </p>
          <p className="mt-2 text-sm font-semibold text-secondary">
            Team directory
          </p>
          <p className="mt-1 text-xs leading-5 text-text-light">
            Profiles feed the About page and property agent selectors.
          </p>
        </div>
      </section>

      {agents.length === 0 ? (
        <EmptyAgentsState />
      ) : (
        <section aria-labelledby="agents-heading">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                Directory
              </p>
              <h2
                id="agents-heading"
                className="mt-1 font-serif text-2xl font-bold text-secondary"
              >
                Your advisors
              </h2>
            </div>

            <p className="text-xs text-text-light">
              Select a profile to edit details or manage representation.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {agents.map((agent) => (
              <article
                key={agent.id}
                className="group border border-border bg-white transition-[border-color] duration-200 hover:border-primary/50"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative h-[88px] w-[76px] shrink-0 overflow-hidden border border-border bg-off-white sm:h-[100px] sm:w-[86px]">
                      <img
                        src={resolveImage(agent.photo)}
                        alt={`${agent.name} portrait`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-xl font-bold leading-tight text-secondary sm:text-[1.35rem]">
                            {agent.name}
                          </h3>

                          <p className="mt-1 truncate text-[0.63rem] font-bold uppercase tracking-[0.13em] text-primary-dark">
                            {agent.title}
                          </p>
                        </div>

                        <div className="shrink-0 border-l border-border pl-3 text-right">
                          <p className="font-serif text-2xl font-bold leading-none text-secondary tabular-nums">
                            {agent._count.properties}
                          </p>
                          <p className="mt-1 text-[0.56rem] font-bold uppercase tracking-[0.13em] text-text-light">
                            Listings
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <a
                          href={`mailto:${agent.email}`}
                          className="flex min-w-0 items-center gap-2 text-xs text-text-light transition-colors hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          <Mail
                            size={13}
                            className="shrink-0 text-primary-dark"
                            aria-hidden="true"
                          />
                          <span className="truncate">{agent.email}</span>
                        </a>

                        <a
                          href={`tel:${agent.phone}`}
                          className="flex min-w-0 items-center gap-2 text-xs text-text-light transition-colors hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          <Phone
                            size={13}
                            className="shrink-0 text-primary-dark"
                            aria-hidden="true"
                          />
                          <span className="truncate">{agent.phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {agent.bio && (
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="line-clamp-2 text-sm leading-6 text-text-light">
                        {agent.bio}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-off-white px-5 py-3 sm:px-6">
                  <span className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-text-light">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    Representing {agent._count.properties} listing
                    {agent._count.properties === 1 ? "" : "s"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/agents/${agent.id}/edit`}
                      aria-label={`Edit ${agent.name}`}
                      title="Edit agent"
                      className="inline-flex h-9 w-9 items-center justify-center border border-border bg-white text-text-light transition-colors hover:border-primary hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <Edit size={15} aria-hidden="true" />
                    </Link>

                    <DeleteAgentButton id={agent.id} name={agent.name} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Metric({
  value,
  label,
  detail,
  divided,
}: {
  value: number;
  label: string;
  detail: string;
  divided?: boolean;
}) {
  return (
    <div
      className={`px-5 py-5 sm:px-6 ${
        divided
          ? "border-b border-border sm:border-b-0 sm:border-r"
          : "sm:border-r"
      }`}
    >
      <p className="font-serif text-3xl font-bold leading-none tabular-nums text-secondary">
        {value}
      </p>

      <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-secondary">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-text-light">{detail}</p>
    </div>
  );
}

function EmptyAgentsState() {
  return (
    <section className="border border-border bg-secondary text-white">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
        <span
          className="mx-auto flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/10 text-primary-light"
          aria-hidden="true"
        >
          <Users size={21} strokeWidth={1.7} />
        </span>

        <p className="mt-6 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-light">
          Team directory
        </p>

        <h2 className="mt-2 font-serif text-3xl font-bold">
          Your advisor roster is empty.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">
          Add the first advisor to start representing listings and introducing
          the team on the public site.
        </p>

        <Link
          href="/admin/agents/new"
          className="group mt-7 inline-flex min-h-11 items-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
        >
          <Plus size={16} aria-hidden="true" />
          Add First Agent
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
