import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  /* Unauthenticated → render bare (login page; middleware protects the rest) */
  if (!session) {
    return <div className="min-h-screen bg-off-white">{children}</div>;
  }

  /* Fetch all counts in a single batch for consistency */
  const [unreadInquiries, propertyCount, subscriberCount, agentCount] =
    await Promise.all([
      prisma.inquiry.count({ where: { isRead: false } }),
      prisma.property.count(),
      prisma.subscriber.count(),
      prisma.agent.count(),
    ]);

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar
        counts={{
          unreadInquiries,
          propertyCount,
          subscriberCount,
          agentCount,
        }}
        adminEmail={session.user?.email}
      />
      <main className="min-w-0 flex-1 p-5 pt-8 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}