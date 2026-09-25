"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ArrowUpDown, Check } from "lucide-react";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price Low → High" },
  { value: "price-desc", label: "Price High → Low" },
];

export default function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left select-none">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex min-w-[220px] items-center justify-between gap-3 bg-white border rounded-md px-4 py-2.5 text-sm font-medium transition-all focus:outline-none ${
          isOpen ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/60"
        }`}
      >
        <span className="flex items-center gap-2">
          <ArrowUpDown size={15} className="text-primary-dark shrink-0" />
          <span>Sort by: <strong className="font-semibold">{selectedOption.label}</strong></span>
        </span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-text-light"}`} />
      </button>

      <div
        role="listbox"
        className={`absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-white p-1.5 shadow-md z-50 origin-top transition-all duration-200 ease-out ${
          isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-text-light/70">Sort Options</div>
        {SORT_OPTIONS.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer ${
                isSelected ? "bg-primary/15 text-primary-dark font-semibold" : "text-text hover:bg-off-white hover:text-secondary"
              }`}
            >
              <span>{option.label}</span>
              {isSelected && <Check size={15} className="text-primary-dark shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}