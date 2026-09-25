"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Mail,
  Users,
  Menu,
  X,
  Briefcase,
} from "lucide-react";
import SignOutButton from "./SignOutButton";

export interface AdminCounts {
  unreadInquiries?: number;
  propertyCount?: number;
  subscriberCount?: number;
  agentCount?: number;
}

const navLinks: {
  href: string;
  icon: typeof Home;
  label: string;
  badge?: "properties" | "agents" | "inquiries" | "subscribers";
}[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/properties", icon: Home, label: "Properties", badge: "properties" },
  { href: "/admin/agents", icon: Briefcase, label: "Agents", badge: "agents" },
  { href: "/admin/inquiries", icon: Mail, label: "Inquiries", badge: "inquiries" },
  { href: "/admin/subscribers", icon: Users, label: "Subscribers", badge: "subscribers" },
];

export default function Sidebar({
  counts,
  adminEmail,
}: {
  counts?: AdminCounts;
  adminEmail?: string| null;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.removeProperty("overflow");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const badgeFor = (
    key?: "properties" | "agents" | "inquiries" | "subscribers",
  ) => {
    if (!key || !counts) return 0;
    switch (key) {
      case "properties":
        return counts.propertyCount ?? 0;
      case "agents":
        return counts.agentCount ?? 0;
      case "inquiries":
        return counts.unreadInquiries ?? 0;
      case "subscribers":
        return counts.subscriberCount ?? 0;
    }
  };

  const email = adminEmail ?? "admin@luxuryestates.com";
  const initials =
    email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "LE";

  const navContent = (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-white/[0.07] px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/admin"
            className="group min-w-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
          >
            <p className="font-serif text-[1.05rem] font-bold tracking-tight text-white transition-colors group-hover:text-primary-light">
              Luxury Estates
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <p className="text-[0.57rem] font-bold uppercase tracking-[0.22em] text-white/55">
                Admin Console
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-white/65 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-3 py-7"
        aria-label="Admin navigation"
      >
        <p className="mb-3 px-3 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/40">
          Workspace
        </p>

        <div className="space-y-1">
          {navLinks.map(({ href, icon: Icon, label, badge }) => {
            const active = isActive(href);
            const value = badgeFor(badge);
            const isAttention = badge === "inquiries" && value > 0;

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex min-h-11 items-center gap-3 border-l-2 px-3 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
                  active
                    ? "border-primary bg-white/[0.055] text-white"
                    : "border-transparent text-white/65 hover:bg-white/3 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center transition-colors ${
                    active ? "text-primary" : "text-white/55 group-hover:text-white/80"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1 truncate font-semibold">{label}</span>

                {value > 0 && (
                  <span
                    aria-label={`${value} ${
                      badge === "inquiries" ? "unread inquiries" : label.toLowerCase()
                    }`}
                    className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-1 text-[0.59rem] font-bold tabular-nums leading-none ${
                      active
                        ? "bg-primary text-secondary"
                        : isAttention
                          ? "border border-primary/30 bg-primary/10 text-primary-light"
                          : "bg-white/6 text-white/60"
                    }`}
                  >
                    {value}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="my-7 h-px bg-white/[0.07]" />

        <p className="mb-3 px-3 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/40">
          System
        </p>

        <div className="px-1">
          <SignOutButton />
        </div>
      </nav>

      <div className="border-t border-white/[0.07] px-3 py-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-secondary"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white/80">{email}</p>
            <p className="mt-0.5 text-[0.59rem] text-white/45">Property operations</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open admin navigation"
        aria-expanded={drawerOpen}
        aria-controls="admin-sidebar"
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center border border-white/10 bg-secondary text-white shadow-[0_8px_24px_rgba(23,23,23,0.14)] transition-colors hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
      >
        <Menu size={20} strokeWidth={1.9} aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-secondary/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="admin-sidebar"
        aria-label="Admin sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-68 shrink-0 flex-col border-r border-white/[0.07] bg-secondary text-white transition-transform duration-300 ease-out lg:static lg:z-30 lg:w-62 lg:translate-x-0 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
