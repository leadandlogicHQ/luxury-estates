"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import Link from "next/link";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Seller, Malibu, CA",
    initial: "S",
    text: "The team at Luxury Estates made selling our Malibu home a seamless experience. Their marketing expertise and negotiation skills got us $200K above asking price — in two weeks.",
  },
  {
    name: "James Hartley",
    role: "Buyer, New York, NY",
    initial: "J",
    text: "I relocated from London and needed to find a Manhattan apartment fast. Luxury Estates found us the perfect penthouse in just 10 days. Truly exceptional service.",
  },
  {
    name: "Maria Chen",
    role: "Buyer, Miami, FL",
    initial: "M",
    text: "As a first-time luxury buyer, I was nervous about the process. John and his team held my hand the entire way. I now live in my dream waterfront home in Miami.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const prev = () =>
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  /* Autoplay: only when not hovered/focused and motion is allowed */
  useEffect(() => {
    if (paused || reduceMotion.current) return;
    const timer = window.setInterval(() => {
      setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      className="overflow-hidden bg-secondary text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-primary">
                Client Stories
              </span>
              <h2 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-tight md:text-5xl">
                The experience,
                <br />
                <em className="font-normal text-primary">in their words.</em>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/70 lg:justify-self-end">
              Real perspectives from buyers and sellers we have guided through
              important property decisions.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 lg:mt-16">
          <div className="relative overflow-hidden border-y border-white/10">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${current * 100}%)` }}
              aria-live="polite"
            >
              {testimonials.map((testimonial, index) => (
                <article
                  key={testimonial.name}
                  className="w-full shrink-0"
                  aria-hidden={index !== current}
                >
                  <div className="grid min-h-[390px] grid-cols-1 lg:grid-cols-[0.7fr_1.3fr]">
                    <div className="flex flex-col justify-between border-b border-white/10 bg-white/[0.025] px-6 py-7 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
                      <div>
                        <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/60">
                          Client
                        </span>
                        <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-primary/8 font-serif text-xl font-bold text-primary">
                          {testimonial.initial}
                        </div>
                        <h3 className="mt-5 font-serif text-2xl font-bold text-white">
                          {testimonial.name}
                        </h3>
                        <p className="mt-1 text-sm text-white/70">{testimonial.role}</p>
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/60">
                        <span className="h-px w-8 bg-primary/60" />
                        Client story
                      </div>
                    </div>
                    <div className="relative flex flex-col justify-between px-6 py-8 sm:px-8 lg:px-14 lg:py-12">
                      <Quote aria-hidden="true" size={44} strokeWidth={1.2} className="text-primary/35" />
                      <blockquote className="mt-8 max-w-3xl font-serif text-2xl leading-[1.35] text-white sm:text-3xl lg:text-[2.65rem]">
                        &ldquo;{testimonial.text}&rdquo;
                      </blockquote>
                      <div className="mt-10 flex items-center justify-between gap-5 border-t border-white/10 pt-5">
                        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/60">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(testimonials.length).padStart(2, "0")}
                        </span>
                        <span className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/70">
                          Experience matters
                          <ArrowRight size={14} className="text-primary" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2" aria-label="Testimonial slides">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Show testimonial ${index + 1}: ${testimonial.name}`}
                  aria-current={index === current ? "true" : undefined}
                  className={[
                    "h-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    index === current
                      ? "w-10 bg-primary"
                      : "w-5 bg-white/18 hover:bg-white/35",
                  ].join(" ")}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-primary/60 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-primary/60 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <Reveal>
          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-sm leading-6 text-white/70">
              Looking for a more considered property experience? Explore the
              collection or speak with an advisor.
            </p>
            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:text-primary"
            >
              Speak with an advisor
              <ArrowRight
                size={15}
                className="text-primary transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}