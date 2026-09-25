"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Mail,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useShortlist } from "./ShortlistProvider";
import { resolveImage } from "@/lib/image";
import { formatCurrency } from "@/lib/format";

export default function ShortlistWidget() {
  const { items, count, remove, clear, ready } = useShortlist();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [botTrap, setBotTrap] = useState("");

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    previousActiveElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.removeProperty("overflow");

      requestAnimationFrame(() => {
        previousActiveElement.current?.focus();
      });
    };
  }, [open]);

  const closeDrawer = () => setOpen(false);

  const handleRemove = (id: string) => {
    remove(id);

    if (items.length === 1) {
      setSent(false);
      setEmail("");
    }
  };

  const handleClear = () => {
    clear();
    setSent(false);
    setEmail("");
    setBotTrap("");
  };

  const sendShortlist = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!items.length || sending) return;

    // Honeypot: do not reveal that the submission was filtered.
    if (botTrap.trim() !== "") {
      setSent(true);
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          items: items.map(({ id, title, price }) => ({
            id,
            title,
            price,
          })),
          website: botTrap,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to send your shortlist. Please try again.",
        );
      }

      setSent(true);
      toast.success(
        data?.message || "Shortlist request received.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send your shortlist. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const drawerTitle =
    count > 0
      ? `${count} ${count === 1 ? "property" : "properties"} saved`
      : "Properties you want to revisit";

  return (
    <>
      {/* Header trigger: utility control, kept visually secondary */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open shortlist (${count} saved)`}
        aria-expanded={open}
        aria-controls="shortlist-drawer"
        className="relative inline-flex h-10 w-10 items-center justify-center border border-border bg-white text-secondary transition-colors duration-200 hover:border-primary/60 hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <Heart
          size={16}
          strokeWidth={1.8}
          fill={count > 0 ? "currentColor" : "none"}
          className={count > 0 ? "text-primary-dark" : undefined}
          aria-hidden="true"
        />

        {ready && count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[0.58rem] font-bold leading-none tabular-nums text-secondary"
          >
            {count}
          </span>
        )}
      </button>

      {mounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close shortlist"
              onClick={closeDrawer}
              tabIndex={open ? 0 : -1}
              className={`fixed inset-0 z-[70] w-full cursor-default border-0 bg-secondary/40 p-0 backdrop-blur-[2px] transition-opacity duration-300 ${
                open
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            />

            {/* Drawer */}
            <aside
              id="shortlist-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="shortlist-title"
              className={`fixed inset-y-0 right-0 z-[80] flex w-full max-w-[470px] flex-col border-l border-border bg-white shadow-[-20px_0_55px_rgba(116,109,100,0.14)] transition-transform duration-300 ease-out ${
                open
                  ? "translate-x-0"
                  : "pointer-events-none translate-x-full"
              }`}
            >
              {/* Header */}
              <header className="shrink-0 border-b border-border bg-white">
                <div className="flex items-start justify-between gap-5 px-6 py-5 sm:px-7">
                  <div className="min-w-0">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
                      Your collection
                    </p>

                    <h2
                      id="shortlist-title"
                      className="mt-1 font-serif text-2xl font-bold leading-tight tracking-[-0.02em] text-secondary"
                    >
                      Shortlist
                    </h2>

                    <p className="mt-1.5 text-xs leading-5 text-text-light">
                      {drawerTitle}
                    </p>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeDrawer}
                    aria-label="Close shortlist"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-white text-text-light transition-colors hover:border-primary/60 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <X size={17} aria-hidden="true" />
                  </button>
                </div>

                {items.length > 0 && (
                  <div
                    className="h-px bg-border"
                    aria-hidden="true"
                  >
                    <div className="h-px w-1/3 bg-primary" />
                  </div>
                )}
              </header>

              {/* Content */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <EmptyShortlist
                    onBrowse={() => closeDrawer()}
                  />
                ) : (
                  <div className="px-6 py-1 sm:px-7">
                    <ul className="divide-y divide-border">
                      {items.map((item) => (
                        <li key={item.id} className="py-5">
                          <div className="flex gap-4">
                            {/* Property recognition */}
                            <Link
                              href={`/property/${item.id}`}
                              onClick={closeDrawer}
                              className="group relative h-[88px] w-[116px] shrink-0 overflow-hidden border border-border bg-off-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              aria-label={`View ${item.title}`}
                            >
                              <Image
                                src={resolveImage(item.image)}
                                alt={item.title}
                                fill
                                sizes="116px"
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                            </Link>

                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/property/${item.id}`}
                                onClick={closeDrawer}
                                className="block truncate font-serif text-[1.05rem] font-bold leading-5 text-secondary transition-colors hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              >
                                {item.title}
                              </Link>

                              <p className="mt-1 truncate text-xs leading-5 text-text-light">
                                {item.location}
                              </p>

                              <p className="mt-2 font-serif text-base font-bold text-secondary">
                                {formatCurrency(item.price)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              aria-label={`Remove ${item.title} from shortlist`}
                              title="Remove from shortlist"
                              className="inline-flex h-9 w-9 shrink-0 self-start items-center justify-center border border-border text-text-light transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                              <Trash2
                                size={15}
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Conversion area */}
              {items.length > 0 && (
                <footer className="shrink-0 border-t border-border bg-off-white">
                  <div className="px-6 py-5 sm:px-7">
                    {sent ? (
                      <SuccessState
                        email={email}
                        onAnother={() => {
                          setSent(false);
                          setEmail("");
                          setBotTrap("");
                        }}
                      />
                    ) : (
                      <form onSubmit={sendShortlist}>
                        {/* Honeypot */}
                        <input
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={botTrap}
                          onChange={(event) =>
                            setBotTrap(event.target.value)
                          }
                          aria-hidden="true"
                          className="absolute -left-[9999px] h-0 w-0 opacity-0"
                        />

                        <div className="flex items-start justify-between gap-5">
                          <div>
                            <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                              Keep your shortlist
                            </p>

                            <h3 className="mt-1 font-serif text-lg font-bold leading-tight text-secondary">
                              Send it to your inbox.
                            </h3>
                          </div>

                          <span className="shrink-0 text-xs font-semibold text-text-light">
                            {count} saved
                          </span>
                        </div>

                        <p className="mt-2 max-w-md text-xs leading-5 text-text-light">
                          No account or password required. We&apos;ll use your
                          email only to deliver these saved properties.
                        </p>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <label
                            htmlFor="shortlist-email"
                            className="sr-only"
                          >
                            Your email address
                          </label>

                          <input
                            id="shortlist-email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(event) =>
                              setEmail(event.target.value)
                            }
                            placeholder="you@example.com"
                            autoComplete="email"
                            className="min-h-11 min-w-0 flex-1 border border-border bg-white px-4 text-sm text-text placeholder:text-text-light/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
                          />

                          <button
                            type="submit"
                            disabled={sending}
                            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-secondary px-5 text-xs font-bold uppercase tracking-[0.09em] text-white transition-colors hover:bg-secondary-light disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          >
                            {sending ? (
                              <>
                                <span
                                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-primary"
                                  aria-hidden="true"
                                />
                                Sending
                              </>
                            ) : (
                              <>
                                <Mail size={15} aria-hidden="true" />
                                Send
                              </>
                            )}
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <p className="text-[0.66rem] leading-5 text-text-light">
                            Saved properties remain available on this device.
                          </p>

                          <button
                            type="button"
                            onClick={handleClear}
                            className="shrink-0 text-[0.66rem] font-semibold text-text-light transition-colors hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
                          >
                            Clear all
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </footer>
              )}
            </aside>
          </>,
          document.body,
        )}
    </>
  );
}

function EmptyShortlist({
  onBrowse,
}: {
  onBrowse: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col justify-center px-7 py-14">
      <div className="max-w-sm">
        <span
          className="inline-flex h-12 w-12 items-center justify-center border border-primary/25 bg-primary/10 text-primary-dark"
          aria-hidden="true"
        >
          <Heart size={21} strokeWidth={1.7} />
        </span>

        <p className="mt-6 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
          Start building
        </p>

        <h3 className="mt-2 font-serif text-3xl font-bold leading-tight tracking-[-0.02em] text-secondary">
          Nothing saved yet.
        </h3>

        <p className="mt-4 text-sm leading-7 text-text-light">
          Save properties as you explore them. Your shortlist stays here so you
          can compare, revisit, and decide at your own pace — no account
          required.
        </p>

        <Link
          href="/listings"
          onClick={onBrowse}
          className="group mt-7 inline-flex min-h-11 items-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Browse Properties
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}

function SuccessState({
  email,
  onAnother,
}: {
  email: string;
  onAnother: () => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary/15 text-primary-dark"
          aria-hidden="true"
        >
          <CheckCircle2 size={18} />
        </span>

        <div>
          <p className="text-sm font-bold text-secondary">
            Shortlist request received
          </p>

          <p className="mt-1 text-xs leading-5 text-text-light">
            We&apos;ll send your saved properties to{" "}
            <strong className="text-secondary">{email}</strong>.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAnother}
        className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-primary-dark underline decoration-primary/40 underline-offset-4 transition-colors hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Email another address
      </button>
    </div>
  );
}