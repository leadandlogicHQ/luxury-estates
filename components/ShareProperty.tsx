"use client";

import { useEffect, useState } from "react";
import { Link2, Check, Share2, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ShareProperty({ title }: { title: string }) {
  const [href, setHref] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setHref(window.location.href);
    setCanShare(!!navigator.share);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy the link.");
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url: href });
    } catch {
      /* user cancelled — no error state needed */
    }
  };

  const btn =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-text-light shadow-sm transition hover:border-primary/60 hover:text-primary-dark";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-text-light">Share</span>
      <button type="button" onClick={copy} aria-label="Copy link" className={btn}>
        {copied ? <Check size={15} className="text-primary-dark" /> : <Link2 size={15} />}
      </button>
      {canShare && (
        <button type="button" onClick={share} aria-label="Share this property" className={btn}>
          <Share2 size={15} />
        </button>
      )}
      {href && (
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(href)}`}
          aria-label="Share by email"
          className={btn}
        >
          <Mail size={15} />
        </a>
      )}
    </div>
  );
}