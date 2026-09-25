"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

function revalidateInbox() {
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

/** Toggle read ↔ unread — used by the inbox "Mark read / Unread" button */
export async function toggleInquiryRead(id: string, isRead: boolean) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  await prisma.inquiry.update({ where: { id }, data: { isRead } });
  revalidateInbox();
}

/** Convenience alias (mark as read) */
export async function markInquiryRead(id: string) {
  return toggleInquiryRead(id, true);
}

/** Delete an inquiry */
export async function deleteInquiry(id: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  await prisma.inquiry.delete({ where: { id } });
  revalidateInbox();
}