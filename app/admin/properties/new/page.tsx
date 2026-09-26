import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PropertyForm from "@/components/admin/PropertyForm";

export const metadata: Metadata = {
  title: "Add Property | Luxury Estates Admin",
  robots: { index: false, follow: false },
};

export default async function NewPropertyPage() {
  const agents = await prisma.agent.findMany({
    select: { id: true, name: true, title: true },
    orderBy: { name: "asc" },
  });

  /*
   * A listing must have a responsible agent.
   * If the roster is empty, guide the admin there first instead of
   * dropping them into a form with a dead-end dropdown.
   */
  if (agents.length === 0) {
    return (
      <section className="border border-border bg-secondary text-white">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10">
          <span
            className="mx-auto flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/10 text-primary-light"
            aria-hidden="true"
          >
            <Briefcase size={21} strokeWidth={1.7} />
          </span>
          <p className="mt-6 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-light">
            Prerequisite
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold">
            Add an advisor before creating a listing.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">
            Every property is represented by an agent. Create your first team
            member, then return here to publish the listing.
          </p>
          <Link
            href="/admin/agents/new"
            className="group mt-7 inline-flex min-h-11 items-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
          >
            <Plus size={16} aria-hidden="true" />
            Add First Agent
          </Link>
        </div>
      </section>
    );
  }

  /* PropertyForm renders its own header ("Create New Listing") + back button */
  return (
    <div className="max-w-4xl">
      <PropertyForm agents={agents} />
    </div>
  );
}