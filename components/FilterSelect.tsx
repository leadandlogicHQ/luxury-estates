"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option { value: string; label: string; }
interface FilterSelectProps { name: string; defaultValue?: string; options: Option[]; placeholder?: string; }

export default function FilterSelect({ name, defaultValue = "", options, placeholder = "Any" }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setSelected(defaultValue), [defaultValue]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = options.find((o) => o.value === selected);
  const label = current ? current.label : placeholder;

  const select = (v: string) => {
    setSelected(v);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const optionClass = (active: boolean) =>
    `flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer ${
      active ? "bg-primary/15 text-primary-dark font-semibold" : "text-text hover:bg-off-white hover:text-secondary"
    }`;

  return (
    <div ref={containerRef} className="relative w-full select-none">
      <input type="hidden" name={name} value={selected} />
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-md text-sm font-medium transition-all focus:outline-none ${
          isOpen ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/60"
        }`}
      >
        <span className={selected ? "text-secondary font-semibold" : "text-text-light"}>{label}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-text-light"}`} />
      </button>

      <div
        role="listbox"
        className={`absolute left-0 right-0 top-full mt-2 z-50 max-h-60 overflow-y-auto rounded-lg border border-border bg-white p-1.5 shadow-md origin-top transition-all duration-200 ease-out ${
          isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <button type="button" onClick={() => select("")} className={optionClass(selected === "")}>
          <span>{placeholder}</span>
          {selected === "" && <Check size={15} className="text-primary-dark shrink-0" />}
        </button>
        {options.map((opt) => (
          <button key={opt.value} type="button" onClick={() => select(opt.value)} className={optionClass(selected === opt.value)}>
            <span>{opt.label}</span>
            {selected === opt.value && <Check size={15} className="text-primary-dark shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
}