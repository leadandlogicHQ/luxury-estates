// app/admin/properties/new/page.tsx
import { prisma } from "@/lib/prisma";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function NewPropertyPage() {
  const agents = await prisma.agent.findMany({
    select: { id: true, name: true, title: true },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-secondary mb-8">Add New Property</h1>
      <PropertyForm agents={agents} />
    </div>
  );
}