"use client";
import { useRouter } from "next/navigation";
import { Search, DollarSign, BedDouble, ChevronDown, Check } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType } from "react";

interface SelectOption {
  value: string;
  label: string;
}

export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    /* Guard: never send min > max — swap instead of showing empty results */
    let min = minPrice;
    let max = maxPrice;
    if (min && max && Number(min) > Number(max)) [min, max] = [max, min];
    if (min) params.set("minPrice", min);
    if (max) params.set("maxPrice", max);
    if (beds) params.set("beds", beds);
    router.push(`/listings?${params.toString()}`);
  };

  const fieldClass =
    "w-full pl-10 pr-9 py-3 bg-white border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm text-text";

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-gold max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {/* Text query */}
        <div className="md:col-span-2 relative">
          <label htmlFor="hero-search" className="sr-only">
            Search by city, address, or ZIP
          </label>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark"
            size={18}
            aria-hidden="true"
          />
          <input
            id="hero-search"
            type="text"
            placeholder="City, address, or ZIP code"
            className={`${fieldClass} cursor-text`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Custom dropdowns */}
        <LuxurySelect
          id="hero-min-price"
          ariaLabel="Minimum price"
          icon={DollarSign}
          placeholder="Min Price"
          value={minPrice}
          onChange={setMinPrice}
          options={[
            { value: "500000", label: "$500,000" },
            { value: "1000000", label: "$1,000,000" },
            { value: "2000000", label: "$2,000,000" },
            { value: "5000000", label: "$5,000,000" },
          ]}
        />
        <LuxurySelect
          id="hero-max-price"
          ariaLabel="Maximum price"
          icon={DollarSign}
          placeholder="Max Price"
          value={maxPrice}
          onChange={setMaxPrice}
          options={[
            { value: "2000000", label: "$2,000,000" },
            { value: "5000000", label: "$5,000,000" },
            { value: "10000000", label: "$10,000,000+" },
          ]}
        />
        <LuxurySelect
          id="hero-beds"
          ariaLabel="Minimum bedrooms"
          icon={BedDouble}
          placeholder="Beds"
          value={beds}
          onChange={setBeds}
          options={[
            { value: "1", label: "1+" },
            { value: "2", label: "2+" },
            { value: "3", label: "3+" },
            { value: "4", label: "4+" },
          ]}
        />

        <button
          type="submit"
          className="bg-primary text-secondary font-bold rounded-md hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2 px-6 py-3"
        >
          <Search size={18} aria-hidden="true" /> Search
        </button>
      </div>
    </form>
  );
}

/* ────────────────────────────────────────────────────────────
   Custom dropdown (combobox) — replaces native <select>
   ──────────────────────────────────────────────────────────── */
interface LuxurySelectProps {
  id: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

function LuxurySelect({
  id,
  ariaLabel,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
}: LuxurySelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const optionId = (i: number) => `${generatedId}-option-${i}`;

  const selectedIndex = options.findIndex((o) => o.value === value);
  const current = selectedIndex >= 0 ? options[selectedIndex] : null;

  /* Close on outside click / Escape */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const openList = () => {
    setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((c) => Math.min(c + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((c) => Math.max(c - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        e.preventDefault();
        setHighlighted(options.length - 1);
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const opt = options[highlighted];
        if (opt) select(opt.value);
        break;
      }
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={open ? optionId(highlighted) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={`relative w-full pl-10 pr-9 py-3 bg-white border border-border rounded-md text-left text-sm text-text transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
          open ? "border-primary ring-1 ring-primary" : "hover:border-primary/60"
        }`}
      >
        <Icon
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark"
        />
        <span className={`block truncate ${current ? "text-text" : "text-text-light/70"}`}>
          {current ? current.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary-dark transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        className={`absolute left-0 right-0 top-[calc(100%+6px)] z-40 origin-top overflow-hidden rounded-md border border-border bg-white p-1.5 shadow-[0_18px_45px_rgba(23,23,23,0.12)] transition-all duration-150 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        {options.map((opt, i) => {
          const selected = opt.value === value;
          const active = i === highlighted;
          return (
            <button
              key={opt.value}
              id={optionId(i)}
              type="button"
              role="option"
              aria-selected={selected}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => select(opt.value)}
              className={`flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-left text-sm transition-colors ${
                active ? "bg-off-white" : ""
              } ${selected ? "font-semibold text-primary-dark" : "text-text"}`}
            >
              <span className="truncate">{opt.label}</span>
              {selected && <Check size={14} className="shrink-0 text-primary-dark" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}