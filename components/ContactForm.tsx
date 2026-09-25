"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  ComponentType,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Home,
  Loader2,
  MapPin,
  Tag,
  TrendingUp,
  Wallet,
} from "lucide-react";

const INTENTS = [
  {
    value: "Buy a Home",
    icon: Home,
    blurb: "Find a residence that fits your life.",
  },
  {
    value: "Sell a Property",
    icon: Tag,
    blurb: "Position your property with expert guidance.",
  },
  {
    value: "Private Tour",
    icon: CalendarCheck2,
    blurb: "Arrange a private viewing of a listing.",
  },
  {
    value: "Investment",
    icon: TrendingUp,
    blurb: "Explore opportunities with a clear strategy.",
  },
] as const;

const BUDGETS = [
  "Under $1M",
  "$1M – $3M",
  "$3M – $5M",
  "$5M – $10M",
  "$10M+",
  "Not sure yet",
] as const;

const TIMINGS = [
  "As soon as possible",
  "1 – 3 months",
  "3 – 6 months",
  "Just exploring",
] as const;

const STEPS = ["Intent", "Details", "Contact"] as const;
const MAX_MESSAGE_LENGTH = 900;

type IntentValue = (typeof INTENTS)[number]["value"];

export default function ContactForm({ propertyId }: { propertyId?: string }) {
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<IntentValue | "">("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [timing, setTiming] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [botTrap, setBotTrap] = useState("");

  const isSell = intent === "Sell a Property";
  const isTour = intent === "Private Tour";
  const isInvestment = intent === "Investment";
  const listingLabel = propertyId ? propertyId.slice(-6).toUpperCase() : "";

  const detailsCopy = useMemo(() => {
    if (isSell) {
      return {
        title: "Tell us about your property",
        description:
          "Share only what you already know. We can refine the rest together.",
        locationLabel: "Property location",
        locationPlaceholder: "City, neighborhood, or address",
        budgetLabel: "Expected price",
      };
    }

    if (isTour) {
      return {
        title: "Plan your private viewing",
        description: "Tell us where and when you would like to explore.",
        locationLabel: "Property or location",
        locationPlaceholder: propertyId
          ? "Add a location if helpful."
          : "Property name, neighborhood, or city",
        budgetLabel: "Budget",
      };
    }

    if (isInvestment) {
      return {
        title: "Shape your investment brief",
        description:
          "A little context helps us prepare a more focused conversation.",
        locationLabel: "Preferred market",
        locationPlaceholder: "City, neighborhood, or market",
        budgetLabel: "Investment range",
      };
    }

    return {
      title: "What are you looking for?",
      description: "A few details help us prepare before we speak.",
      locationLabel: "Preferred location",
      locationPlaceholder: "City, neighborhood, or market",
      budgetLabel: "Budget",
    };
  }, [isInvestment, isSell, isTour, propertyId]);

  const contactIntro = useMemo(() => {
    switch (intent) {
      case "Buy a Home":
        return "Tell us how to reach you and we’ll take the next step with you.";
      case "Sell a Property":
        return "Share your details and our advisory team will follow up personally.";
      case "Private Tour":
        return "Give us the best way to reach you and we’ll coordinate the viewing.";
      case "Investment":
        return "Leave your details and we’ll follow up with a focused conversation.";
      default:
        return "We respond within 2 hours during office hours.";
    }
  }, [intent]);

  const reset = () => {
    setDone(false);
    setStep(0);
    setIntent("");
    setLocation("");
    setBudget("");
    setTiming("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setBotTrap("");
  };

  const goNext = () => {
    if (step === 0 && !intent) {
      toast.error("Choose an enquiry type to continue.");
      return;
    }

    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    // Honeypot: quietly absorb obvious bot submissions.
    if (botTrap.trim() !== "") {
      setDone(true);
      setLoading(false);
      return;
    }

    setLoading(true);

    const context = [
      `Intent: ${intent}`,
      location.trim() &&
        `${isSell ? "Property location" : isInvestment ? "Preferred market" : "Location"}: ${location.trim()}`,
      budget &&
        `${isSell ? "Expected price" : isInvestment ? "Investment range" : "Budget"}: ${budget}`,
      timing && `Timing: ${timing}`,
      propertyId && `Listing ID: ${listingLabel}`,
    ]
      .filter(Boolean)
      .join(" · ");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: `[${intent}] ${context}\n\n${message.trim() || "No additional notes."}`,
          propertyId,
          website: botTrap,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Something went wrong. Please try again.",
        );
      }

      setDone(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border-b border-border bg-transparent px-0 py-3 text-sm text-secondary placeholder:text-text-light/55 outline-none transition-colors duration-200 focus:border-primary";

  const labelClass =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-text-light";

  if (done) {
    return (
      <section
        aria-live="polite"
        className="border-t border-border bg-white px-1 py-12 sm:px-2 sm:py-14"
      >
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary-dark">
            <CheckCircle2 size={27} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.19em] text-primary-dark">
            Request received
          </p>

          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-secondary sm:text-4xl">
            We have everything we need.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-text-light">
            Thank you{firstName ? `, ${firstName}` : ""}. Our team will
            contact you within 2 hours during office hours.
          </p>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-1 border-y border-border text-left sm:grid-cols-2">
            <SummaryRow label="Enquiry" value={intent || "General enquiry"} />

            {location && (
              <SummaryRow
                label={
                  isSell
                    ? "Property location"
                    : isInvestment
                      ? "Preferred market"
                      : "Location"
                }
                value={location}
              />
            )}

            {budget && (
              <SummaryRow
                label={
                  isSell
                    ? "Expected price"
                    : isInvestment
                      ? "Investment range"
                      : "Budget"
                }
                value={budget}
              />
            )}

            {timing && <SummaryRow label="Timing" value={timing} />}

            {propertyId && (
              <SummaryRow label="Listing" value={`#${listingLabel}`} />
            )}
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-8 text-sm font-semibold text-primary-dark underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Send another request
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl"
      aria-label="Contact enquiry form"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] -top-[9999px] h-0 w-0 opacity-0"
        value={botTrap}
        onChange={(event) => setBotTrap(event.target.value)}
        aria-hidden="true"
      />

      {/* Listing context */}
      {propertyId && (
        <div className="mb-8 border-l-2 border-primary px-4 py-1">
          <p className="text-xs leading-5 text-text-light">
            You are enquiring about listing{" "}
            <strong className="font-semibold text-secondary">
              #{listingLabel}
            </strong>
            . We&apos;ll attach this request automatically.
          </p>
        </div>
      )}

      {/* Progress — a useful orientation cue, not decoration */}
      <div
        className="mb-10"
        aria-label={`Step ${step + 1} of ${STEPS.length}`}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-light">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </p>

          <p className="text-[10px] font-medium tabular-nums text-text-light">
            {Math.round(((step + 1) / STEPS.length) * 100)}%
          </p>
        </div>

        <div className="h-px bg-border" aria-hidden="true">
          <div
            className="h-px bg-primary transition-[width] duration-[400ms] ease-out"
            style={{
              width: `${((step + 1) / STEPS.length) * 100}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (index <= step) setStep(index);
              }}
              disabled={index > step}
              aria-label={`Go to ${label} step`}
              className={`text-[9px] font-bold uppercase tracking-[0.14em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                index === step
                  ? "text-secondary"
                  : index < step
                    ? "text-primary-dark"
                    : "cursor-default text-text-light/45"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div key={step} className="animate-step">
        {/* STEP 1 */}
        {step === 0 && (
          <fieldset>
            <legend className="font-serif text-2xl font-semibold tracking-[-0.02em] text-secondary sm:text-[29px]">
              What brings you here?
            </legend>

            <p className="mt-2 max-w-lg text-sm leading-6 text-text-light">
              Choose the closest match. We&apos;ll keep the next step relevant
              to you.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {INTENTS.map(({ value, icon: Icon, blurb }) => {
                const active = intent === value;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setIntent(value)}
                    className={`group min-h-[118px] border px-4 py-4 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                      active
                        ? "border-primary/70 bg-primary/[0.07]"
                        : "border-border bg-white hover:border-primary/45 hover:bg-off-white/60"
                    }`}
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${
                          active
                            ? "border-primary/40 bg-primary/10 text-primary-dark"
                            : "border-border bg-off-white text-text-light group-hover:border-primary/30 group-hover:text-primary-dark"
                        }`}
                        aria-hidden="true"
                      >
                        <Icon size={17} strokeWidth={1.8} />
                      </span>

                      {active && (
                        <Check
                          size={16}
                          className="mt-1 shrink-0 text-primary-dark"
                          aria-hidden="true"
                        />
                      )}
                    </span>

                    <span className="mt-5 block text-sm font-semibold text-secondary">
                      {value}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-text-light">
                      {blurb}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <section aria-labelledby="details-heading">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark">
              Relevant context
            </p>

            <h2
              id="details-heading"
              className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-secondary sm:text-[29px]"
            >
              {detailsCopy.title}
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-text-light">
              {detailsCopy.description}
            </p>

            <div className="mt-8 space-y-8">
              <div>
                <label htmlFor="location" className={labelClass}>
                  {detailsCopy.locationLabel}
                </label>

                <div className="relative">
                  <input
                    id="location"
                    name="location"
                    autoComplete="address-level2"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder={detailsCopy.locationPlaceholder}
                    className={`${inputClass} pr-8`}
                  />

                  <MapPin
                    size={15}
                    className="pointer-events-none absolute right-0 top-3.5 text-primary-dark"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                {!isTour && (
                  <LuxuryDropdown
                    id="budget"
                    label={detailsCopy.budgetLabel}
                    value={budget}
                    options={BUDGETS}
                    placeholder="Select a range"
                    icon={Wallet}
                    onChange={setBudget}
                  />
                )}

                <div className={isTour ? "sm:col-span-2" : ""}>
                  <LuxuryDropdown
                    id="timing"
                    label="Preferred timing"
                    value={timing}
                    options={TIMINGS}
                    placeholder="Select timing"
                    icon={Clock3}
                    onChange={setTiming}
                  />
                </div>
              </div>

              <p className="text-xs leading-5 text-text-light">
                These details are optional. They simply help us prepare a more
                relevant first conversation.
              </p>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <section aria-labelledby="contact-heading">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark">
              Almost there
            </p>

            <h2
              id="contact-heading"
              className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-secondary sm:text-[29px]"
            >
              How should we reach you?
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-text-light">
              {contactIntro}
            </p>

            <div className="mt-8 space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelClass}>
                    First name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Your first name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className={labelClass}>
                    Last name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Your last name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  required
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone number{" "}
                  <span className="font-medium normal-case tracking-normal">
                    (optional)
                  </span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Your preferred number"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-4">
                  <label
                    htmlFor="message"
                    className={`${labelClass} mb-0`}
                  >
                    Additional notes{" "}
                    <span className="font-medium normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>

                  <span
                    className="text-[10px] tabular-nums text-text-light"
                    aria-live="polite"
                  >
                    {message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>

                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell us anything that would help us prepare."
                  className={`${inputClass} resize-none leading-6`}
                />
              </div>

              <p className="text-xs leading-5 text-text-light">
                By submitting this form, you&apos;re asking our team to contact
                you regarding your enquiry.
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 px-0 py-2 text-sm font-semibold text-text-light transition-colors hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </button>
        ) : (
          <span aria-hidden="true" />
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={step === 0 && !intent}
            className="inline-flex min-h-11 items-center gap-2 border border-primary bg-primary px-6 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-primary-dark hover:text-white disabled:cursor-not-allowed disabled:border-border disabled:bg-border disabled:text-text-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Continue
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={
              loading ||
              !firstName.trim() ||
              !lastName.trim() ||
              !email.trim()
            }
            className="inline-flex min-h-11 items-center gap-2 border border-primary bg-primary px-6 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-primary-dark hover:text-white disabled:cursor-not-allowed disabled:border-border disabled:bg-border disabled:text-text-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {loading ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                  aria-hidden="true"
                />
                Sending…
              </>
            ) : (
              <>
                {isTour
                  ? "Request private tour"
                  : isSell
                    ? "Discuss selling"
                    : isInvestment
                      ? "Discuss investment"
                      : "Start my search"}
                <ArrowRight size={15} aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

type LuxuryDropdownProps = {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  onChange: (value: string) => void;
};

function LuxuryDropdown({
  id,
  label,
  value,
  options,
  placeholder,
  icon: Icon,
  onChange,
}: LuxuryDropdownProps) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const optionId = (index: number) => `${generatedId}-option-${index}`;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(
    Math.max(0, options.indexOf(value)),
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    const selectedIndex = options.indexOf(value);

    if (selectedIndex >= 0) {
      setHighlighted(selectedIndex);
    }
  }, [options, value]);

  const selectOption = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        setOpen(true);

        const selectedIndex = options.indexOf(value);
        setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
      }

      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlighted((current) =>
          Math.min(current + 1, options.length - 1),
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        setHighlighted((current) => Math.max(current - 1, 0));
        break;

      case "Home":
        event.preventDefault();
        setHighlighted(0);
        break;

      case "End":
        event.preventDefault();
        setHighlighted(options.length - 1);
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        selectOption(options[highlighted]);
        break;

      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
    }
  };

  const selectedIndex = options.indexOf(value);
  const activeId =
    open && highlighted >= 0 ? optionId(highlighted) : undefined;

  return (
    <div ref={wrapperRef} className="relative">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-text-light"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={activeId}
        onClick={() => {
          setOpen((current) => !current);

          if (!open) {
            setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
          }
        }}
        onKeyDown={handleKeyDown}
        className={`group flex min-h-12 w-full items-center gap-3 border-b bg-transparent px-0 py-3 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${
          open ? "border-primary" : "border-border hover:border-primary/50"
        }`}
      >
        <Icon
          size={15}
          strokeWidth={1.8}
          className={`shrink-0 transition-colors ${
            open || value ? "text-primary-dark" : "text-text-light"
          }`}
          aria-hidden="true"
        />

        <span
          className={`min-w-0 flex-1 truncate ${
            value ? "text-secondary" : "text-text-light/65"
          }`}
        >
          {value || placeholder}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={1.8}
          className={`shrink-0 text-text-light transition-transform duration-200 ${
            open
              ? "rotate-180 text-primary-dark"
              : "group-hover:text-secondary"
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        id={listboxId}
        role="listbox"
        aria-label={label}
        className={`absolute left-0 right-0 top-[calc(100%+8px)] z-30 origin-top overflow-hidden border border-border bg-white shadow-[0_18px_45px_rgba(116,109,100,0.14)] transition-all duration-150 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        <div className="border-b border-border px-4 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-light">
            {label}
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto p-1.5">
          {options.map((option, index) => {
            const selected = value === option;
            const highlightedOption = highlighted === index;

            return (
              <button
                key={option}
                id={optionId(index)}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => selectOption(option)}
                className={`relative flex min-h-11 w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                  highlightedOption ? "bg-off-white" : "bg-white"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 ${
                    selected ? "bg-primary" : "bg-transparent"
                  }`}
                  aria-hidden="true"
                />

                <span
                  className={`min-w-0 flex-1 truncate ${
                    selected
                      ? "font-semibold text-secondary"
                      : "font-medium text-text"
                  }`}
                >
                  {option}
                </span>

                {selected && (
                  <Check
                    size={15}
                    className="shrink-0 text-primary-dark"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-border px-0 py-4 last:border-b-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-light">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-secondary">{value}</p>
    </div>
  );
}
