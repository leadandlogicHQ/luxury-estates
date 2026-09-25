"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface PropertyInput {
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
  image: string;
  images: string[];
  description: string;
  features: string[];
  agentId: string;
  lat: number;
  lng: number;
  status?: string;
}

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function createProperty(
  input: PropertyInput,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) return { success: false, error: "Unauthorized" };
  try {
    await prisma.property.create({
      data: { ...input, status: input.status ?? "For Sale", views: 0 },
    });
    revalidatePath("/admin/properties");
    revalidatePath("/listings");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Database error while creating property." };
  }
}

export async function updateProperty(
  id: string,
  input: PropertyInput,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) return { success: false, error: "Unauthorized" };
  try {
    /* Undefined keys (e.g. omitted status) are ignored by Prisma */
    await prisma.property.update({ where: { id }, data: input });
    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${id}/edit`);
    revalidatePath(`/property/${id}`);
    revalidatePath("/listings");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Database error while updating property." };
  }
}

export async function deleteProperty(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  await prisma.property.delete({ where: { id } });
  revalidatePath("/admin/properties");
  revalidatePath("/listings");
  revalidatePath("/");
}