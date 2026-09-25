"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAgent } from "@/app/admin/agents/actions";

export default function DeleteAgentButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handle = async () => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setPending(true);
    const res = await deleteAgent(id);
    setPending(false);
    if (res.success) {
      toast.success("Agent removed from the team.");
      router.refresh();
    } else {
      toast.error(res.error || "Could not delete agent.");
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      title="Delete agent"
      aria-label={`Delete ${name}`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#ead8d3] bg-white text-[#a66b60] shadow-sm transition-all hover:bg-[#f8efec] disabled:opacity-50"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}