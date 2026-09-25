import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AgentForm from "@/components/admin/AgentForm";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await prisma.agent.findUnique({ where: { id } });
  if (!agent) notFound();

  return (
    <div className="max-w-4xl">
      <AgentForm
        agentId={agent.id}
        initial={{
          name: agent.name,
          title: agent.title,
          email: agent.email,
          phone: agent.phone,
          photo: agent.photo,
          bio: agent.bio,
        }}
      />
    </div>
  );
}