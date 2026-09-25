"use client";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const [pending, setPending] = useState(false);

  const handleSignOut = () => {
    if (pending) return;
    setPending(true);
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      aria-busy={pending}
      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-white/45 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
      <span>{pending ? "Signing out…" : "Sign Out"}</span>
    </button>
  );
}