import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();

  const agents = await prisma.agent.findMany({
    select: { id: true, name: true, title: true },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-secondary mb-8">
        Edit Property
      </h1>
      <PropertyForm
        agents={agents}
        propertyId={property.id}
        initial={{
          title: property.title,
          address: property.address,
          city: property.city,
          state: property.state,
          zip: property.zip,
          price: property.price,
          beds: property.beds,
          baths: property.baths,
          sqft: property.sqft,
          type: property.type,
          built: property.built,
          description: property.description,
          features: property.features,
          image: property.image,
          images: property.images,
          agentId: property.agentId,
          lat: property.lat,
          lng: property.lng,
          status: property.status,
        }}
      />
    </div>
  );
}