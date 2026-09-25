"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ImageIcon,
  Loader2,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import ImageUpload from "./ImageUpload";
import {
  createAgent,
  updateAgent,
  type AgentInput,
} from "@/app/admin/agents/actions";

export interface AgentFormValues {
  name: string;
  title: string;
  email: string;
  phone: string;
  photo: string;
  bio: string;
}

const STEPS = [
  {
    number: "01",
    label: "Identity",
    description: "Name and professional role",
  },
  {
    number: "02",
    label: "Contact",
    description: "Direct contact details",
  },
  {
    number: "03",
    label: "Profile",
    description: "Portrait and public bio",
  },
];

export default function AgentForm({
  initial,
  agentId,
}: {
  initial?: AgentFormValues;
  agentId?: string;
}) {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    title: initial?.title ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    bio: initial?.bio ?? "",
  });

  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const completion = useMemo(
    () => ({
      identity: Boolean(form.name.trim() && form.title.trim()),
      contact: Boolean(form.email.trim() && form.phone.trim()),
      profile: Boolean(photo),
    }),
    [form, photo]
  );

  const completedCount = Object.values(completion).filter(Boolean).length;
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  const next = () => {
    if (step === 0 && (!form.name.trim() || !form.title.trim())) {
      toast.error("Add the agent's name and professional title first.");
      return;
    }

    if (step === 1 && (!form.email.trim() || !form.phone.trim())) {
      toast.error("Add the agent's email and phone number first.");
      return;
    }

    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.title.trim()) {
      setStep(0);
      toast.error("Please complete the agent identity.");
      return;
    }

    if (!form.email.trim() || !form.phone.trim()) {
      setStep(1);
      toast.error("Please complete the contact details.");
      return;
    }

    if (!photo) {
      setStep(2);
      toast.error("Please upload a portrait photo.");
      return;
    }

    setSaving(true);

    const payload: AgentInput = {
      name: form.name.trim(),
      title: form.title.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      bio: form.bio.trim(),
      photo,
    };

    try {
      const response = agentId
        ? await updateAgent(agentId, payload)
        : await createAgent(payload);

      if (!response.success) {
        throw new Error(response.error || "Failed to save agent.");
      }

      toast.success(
        agentId
          ? "Agent updated successfully."
          : "Agent added to the team."
      );

      router.push("/admin/agents");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the agent."
      );
    } finally {
      setSaving(false);
    }
  };

  const input =
    "w-full min-h-12 border border-border bg-white px-4 text-sm text-secondary outline-none transition-all placeholder:text-text-light/55 focus:border-primary focus:ring-2 focus:ring-primary/15";

  const label =
    "mb-2 block text-[0.66rem] font-bold uppercase tracking-[0.16em] text-text-light";

  return (
    <div className="pb-8">
      {/* Page header */}
      <div className="border-b border-border pb-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.2em] text-primary-dark">
              <UserRound size={13} aria-hidden="true" />
              Team management
            </div>

            <h1 className="font-serif text-3xl font-bold tracking-[-0.02em] text-secondary md:text-4xl">
              {agentId ? "Refine team member" : "Add team member"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-light">
              Build the public-facing advisor profile once, then reuse it
              across the About page, property assignments, and contact flows.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/agents")}
            className="inline-flex min-h-11 w-fit items-center gap-2 border border-border bg-white px-4 text-sm font-semibold text-secondary transition-colors hover:border-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Agents
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="py-7">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-text-light">
              Step {step + 1} of {STEPS.length}
            </p>
            <p className="mt-1 text-sm font-semibold text-secondary">
              {STEPS[step].label}
              <span className="ml-2 font-normal text-text-light">
                {STEPS[step].description}
              </span>
            </p>
          </div>

          <p className="text-xs font-semibold tabular-nums text-primary-dark">
            {progress}%
          </p>
        </div>

        <div
          className="grid grid-cols-3 gap-2"
          role="list"
          aria-label="Agent form progress"
        >
          {STEPS.map((item, index) => {
            const isCurrent = index === step;
            const isComplete =
              index === 0
                ? completion.identity
                : index === 1
                  ? completion.contact
                  : completion.profile;

            return (
              <button
                key={item.number}
                type="button"
                onClick={() => setStep(index)}
                role="listitem"
                className="text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-current={isCurrent ? "step" : undefined}
              >
                <div
                  className={`mb-2 h-1 transition-colors ${
                    isCurrent || isComplete ? "bg-primary" : "bg-border"
                  }`}
                />

                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center text-[0.63rem] font-bold ${
                      isComplete
                        ? "bg-primary text-secondary"
                        : isCurrent
                          ? "bg-secondary text-white"
                          : "border border-border bg-white text-text-light"
                    }`}
                  >
                    {isComplete ? <Check size={13} /> : item.number}
                  </span>

                  <span
                    className={`hidden text-xs font-semibold sm:block ${
                      isCurrent ? "text-secondary" : "text-text-light"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]"
      >
        <section className="min-w-0">
          <div key={step} className="animate-step">
            {/* Step 1 */}
            {step === 0 && (
              <div>
                <div className="mb-7">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                    Public identity
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold text-secondary sm:text-3xl">
                    Who is this advisor?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-text-light">
                    Use the name and title visitors should recognize on the
                    public site.
                  </p>
                </div>

                <div className="space-y-6 border-y border-border py-7">
                  <div>
                    <label htmlFor="agent-name" className={label}>
                      Full name <span className="text-primary-dark">*</span>
                    </label>

                    <input
                      id="agent-name"
                      name="name"
                      value={form.name}
                      onChange={(event) => set("name", event.target.value)}
                      placeholder="Alexandra Reed"
                      autoComplete="name"
                      required
                      className={input}
                    />
                  </div>

                  <div>
                    <label htmlFor="agent-title" className={label}>
                      Professional title{" "}
                      <span className="text-primary-dark">*</span>
                    </label>

                    <input
                      id="agent-title"
                      name="title"
                      value={form.title}
                      onChange={(event) => set("title", event.target.value)}
                      placeholder="Senior Luxury Advisor"
                      autoComplete="organization-title"
                      required
                      className={input}
                    />

                    <p className="mt-2 text-xs leading-5 text-text-light">
                      Example: Senior Luxury Advisor · Malibu Coast
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div>
                <div className="mb-7">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                    Direct contact
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold text-secondary sm:text-3xl">
                    How should clients reach them?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-text-light">
                    These details may appear on listings and advisor contact
                    surfaces, so accuracy matters.
                  </p>
                </div>

                <div className="space-y-6 border-y border-border py-7">
                  <div>
                    <label htmlFor="agent-email" className={label}>
                      Email address{" "}
                      <span className="text-primary-dark">*</span>
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark"
                        aria-hidden="true"
                      />

                      <input
                        id="agent-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => set("email", event.target.value)}
                        placeholder="alexandra@luxuryestates.com"
                        autoComplete="email"
                        required
                        className={`${input} pl-11`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="agent-phone" className={label}>
                      Phone number{" "}
                      <span className="text-primary-dark">*</span>
                    </label>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark"
                        aria-hidden="true"
                      />

                      <input
                        id="agent-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(event) => set("phone", event.target.value)}
                        placeholder="(310) 555-0142"
                        autoComplete="tel"
                        required
                        className={`${input} pl-11`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div>
                <div className="mb-7">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                    Public profile
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-bold text-secondary sm:text-3xl">
                    Give the advisor a human presence.
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-text-light">
                    A strong portrait and concise specialty statement help
                    visitors recognize who they are dealing with.
                  </p>
                </div>

                <div className="space-y-8 border-y border-border py-7">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <ImageIcon
                        size={15}
                        className="text-primary-dark"
                        aria-hidden="true"
                      />

                      <label
                        htmlFor="agent-photo"
                        className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-text-light"
                      >
                        Portrait photo{" "}
                        <span className="text-primary-dark">*</span>
                      </label>
                    </div>

                    <div id="agent-photo">
                      <ImageUpload
                        value={photo}
                        onChange={(value) => setPhoto(value as string)}
                      />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-text-light">
                      Use a clear square or portrait crop. This image appears
                      on the public About grid and advisor surfaces.
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <label htmlFor="agent-bio" className={label}>
                        Short bio
                      </label>

                      <span className="text-[0.65rem] tabular-nums text-text-light">
                        {form.bio.length}/240
                      </span>
                    </div>

                    <textarea
                      id="agent-bio"
                      name="bio"
                      rows={6}
                      maxLength={240}
                      value={form.bio}
                      onChange={(event) => set("bio", event.target.value)}
                      placeholder="Specialist in oceanfront estates and cliffside architecture."
                      className={`${input} resize-y py-3 leading-7`}
                    />

                    <p className="mt-2 text-xs leading-5 text-text-light">
                      Keep it focused on specialty, market knowledge, or the
                      kind of properties this advisor represents.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-7 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="inline-flex min-h-11 items-center gap-2 border border-border bg-white px-4 text-sm font-semibold text-secondary transition-colors hover:border-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                Back
              </button>
            ) : (
              <span />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="group inline-flex min-h-11 items-center gap-2 bg-secondary px-5 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-secondary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Continue
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="text-primary-light transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                className="group inline-flex min-h-11 items-center gap-2 bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Saving
                  </>
                ) : (
                  <>
                    <Save size={16} aria-hidden="true" />
                    {agentId ? "Save Changes" : "Add to Team"}
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Completion / context rail */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="border border-border bg-white">
            <div className="border-b border-border px-5 py-4">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary-dark">
                Profile readiness
              </p>

              <p className="mt-1 font-serif text-xl font-bold text-secondary">
                {completedCount} of 3 complete
              </p>
            </div>

            <div className="divide-y divide-border">
              <CompletionRow
                label="Professional identity"
                complete={completion.identity}
              />
              <CompletionRow
                label="Contact details"
                complete={completion.contact}
              />
              <CompletionRow
                label="Portrait"
                complete={completion.profile}
              />
            </div>

            <div className="border-t border-border bg-off-white px-5 py-5">
              <p className="text-xs font-semibold text-secondary">
                Where this profile is used
              </p>

              <p className="mt-2 text-xs leading-5 text-text-light">
                About page, property agent selectors, listing detail pages, and
                advisor contact surfaces.
              </p>
            </div>
          </div>

          <div className="mt-4 border border-border bg-secondary p-5 text-white">
            <div className="flex items-start gap-3">
              <BadgeCheck
                size={16}
                className="mt-0.5 shrink-0 text-primary-light"
                aria-hidden="true"
              />

              <div>
                <p className="text-sm font-semibold">Before publishing</p>

                <p className="mt-1 text-xs leading-5 text-white/60">
                  Check the portrait, title, contact details, and bio from a
                  visitor&apos;s perspective.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function CompletionRow({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <span className="text-xs font-semibold text-secondary">{label}</span>

      <span
        className={`flex h-6 w-6 items-center justify-center ${
          complete
            ? "bg-primary text-secondary"
            : "border border-border bg-off-white text-text-light"
        }`}
        aria-label={complete ? `${label} complete` : `${label} incomplete`}
      >
        {complete ? <Check size={13} aria-hidden="true" /> : null}
      </span>
    </div>
  );
}
