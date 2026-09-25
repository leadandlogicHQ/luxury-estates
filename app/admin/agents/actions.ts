"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface AgentInput {
  name: string;
  title: string;
  email: string;
  phone: string;
  photo: string;
  bio: string;
}

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

/* Agents surface on /about, the dashboard, and every property selector */
function revalidateAgents() {
  revalidatePath("/admin/agents");
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath("/admin/properties/new");
  revalidatePath("/about");
}

export async function createAgent(
  input: AgentInput,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) return { success: false, error: "Unauthorized" };
  try {
    await prisma.agent.create({ data: { ...input } });
    revalidateAgents();
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Database error while creating agent." };
  }
}

export async function updateAgent(
  id: string,
  input: AgentInput,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) return { success: false, error: "Unauthorized" };
  try {
    await prisma.agent.update({ where: { id }, data: input });
    revalidateAgents();
    revalidatePath(`/admin/agents/${id}/edit`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Database error while updating agent." };
  }
}

/** Guard: never delete an agent who still owns listings */
export async function deleteAgent(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) return { success: false, error: "Unauthorized" };
  const owned = await prisma.property.count({ where: { agentId: id } });
  if (owned > 0) {
    return {
      success: false,
      error: `This agent still owns ${owned} listing${owned === 1 ? "" : "s"}. Reassign them before deleting.`,
    };
  }
  try {
    await prisma.agent.delete({ where: { id } });
    revalidateAgents();
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Database error while deleting agent." };
  }
}