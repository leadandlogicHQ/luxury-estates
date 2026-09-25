"use client";

import { FormEvent, useId, useState } from "react";
import { ArrowRight, Check, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import Reveal from "./Reveal";

const BENEFITS = [
  "New & exclusive listings",
  "Selected market insights",
  "Useful property updates",
  "Unsubscribe anytime",
] as const;

export default function Newsletter() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Honeypot field for low-friction bot protection.
  const [botTrap, setBotTrap] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    // Fake success for bots without revealing the protection mechanism.
    if (botTrap.trim() !== "") {
      toast.success("Successfully subscribed!");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website: botTrap }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Something went wrong. Please try again.",
        );
      }

      toast.success(data?.message || "Successfully subscribed!");
      setEmail("");
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-border bg-off-white" aria-labelledby="newsletter-title">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <Reveal>
          <div className="grid overflow-hidden border border-border bg-white lg:grid-cols-[1.08fr_0.92fr]">
            {/* Editorial message: desire + value before commitment */}
            <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="max-w-xl">
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className="h-px w-10 bg-primary" />
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-primary-dark">
                    Market intelligence
                  </span>
                </div>

                <h2
                  id="newsletter-title"
                  className="mt-5 max-w-2xl font-serif text-4xl font-bold leading-[1.04] tracking-[-0.025em] text-secondary sm:text-5xl lg:text-[3.25rem]"
                >
                  The right property rarely waits for a perfect moment.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-text-light sm:text-base">
                  Stay close to what matters: new residences, notable listings,
                  and selective market insight—delivered without filling your
                  inbox with noise.
                </p>

                <div className="mt-8 border-t border-border pt-6">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-text-light">
                    What you&apos;ll receive
                  </p>

                  <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {BENEFITS.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary-dark"
                          aria-hidden="true"
                        >
                          <Check size={12} strokeWidth={2.4} />
                        </span>
                        <span className="text-xs font-semibold leading-5 text-secondary">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion panel: clarity + action + feedback */}
            <div className="border-t border-border bg-secondary px-6 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:px-11 lg:py-14">
              {submitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex h-full min-h-[310px] flex-col justify-center"
                >
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center bg-primary text-secondary"
                    aria-hidden="true"
                  >
                    <Check size={21} strokeWidth={2.2} />
                  </span>

                  <p className="mt-7 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-light">
                    Subscription confirmed
                  </p>

                  <h3 className="mt-2 max-w-md font-serif text-3xl font-bold leading-tight text-white">
                    You&apos;re on the list.
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                    We&apos;ll send the next relevant property or market update
                    to your inbox. Nothing else is required.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="group mt-7 inline-flex w-fit items-center gap-2 border-b border-primary/50 pb-1 text-xs font-bold uppercase tracking-[0.11em] text-white transition-colors hover:border-primary hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary"
                  >
                    Subscribe another email
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="text-primary transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex h-full min-h-[310px] flex-col justify-center">
                  <div className="flex items-center gap-2 text-primary-light">
                    <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em]">
                      Private property updates
                    </p>
                  </div>

                  <h3 className="mt-4 font-serif text-3xl font-bold leading-tight text-white sm:text-[2.15rem]">
                    Curated, not crowded.
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                    One email address is all you need. We&apos;ll keep the signal
                    high and the frequency considered.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8" noValidate={false}>
                    {/* Honeypot field */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      value={botTrap}
                      onChange={(e) => setBotTrap(e.target.value)}
                      className="absolute -left-[9999px] -top-[9999px] h-0 w-0 opacity-0"
                    />

                    <label
                      htmlFor={emailId}
                      className="mb-2 block text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/65"
                    >
                      Email address
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        id={emailId}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="min-h-12 min-w-0 flex-1 border border-white/15 bg-white px-4 text-sm text-text outline-none placeholder:text-text-light/55 transition-[border-color,box-shadow] focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Send
                          size={14}
                          aria-hidden="true"
                          className={loading ? "animate-pulse" : ""}
                        />
                        {loading ? "Joining..." : "Join the List"}
                      </button>
                    </div>

                    <p className="mt-4 max-w-md text-[0.68rem] leading-5 text-white/50">
                      By subscribing, you&apos;ll receive relevant property and
                      market updates. You can unsubscribe at any time.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}