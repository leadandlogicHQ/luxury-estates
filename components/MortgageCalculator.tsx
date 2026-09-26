"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const digitsOnly = (v: string) => v.replace(/[^0-9]/g, "");
const money = (n: number) => n.toLocaleString("en-US");

export default function MortgageCalculator({ price }: { price: number }) {
  /* "Home Price" (not "Loan Amount") — principal = price − down payment */
  const [homePrice, setHomePrice] = useState(price);
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const monthly = useMemo(() => {
    const safePrice = Number.isFinite(homePrice) ? homePrice : 0;
    const safeDown = Number.isFinite(downPayment) ? downPayment : 0;
    const principal = Math.max(safePrice - safeDown, 0);
    const mr = rate / 100 / 12;
    const np = Math.round(years * 12);
    if (principal <= 0 || np <= 0) return 0;
    if (mr === 0) return principal / np;
    return (principal * mr * Math.pow(1 + mr, np)) / (Math.pow(1 + mr, np) - 1);
  }, [homePrice, downPayment, rate, years]);

  const safePrice = Number.isFinite(homePrice) ? homePrice : 0;
  const safeDown = Number.isFinite(downPayment) ? downPayment : 0;
  const financed = Math.max(safePrice - safeDown, 0);
  const downPct =
    safePrice > 0 ? Math.min(Math.round((safeDown / safePrice) * 100), 100) : 0;

  const inputClass =
    "w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-text tabular-nums outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary";
  const labelClass = "mb-1.5 block text-sm font-bold text-text";
  const adornment =
    "pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm font-semibold text-primary";

  return (
    <div className="rounded-xl border border-border bg-off-white p-5 shadow-sm sm:p-6">
      <h3 className="font-serif text-2xl font-bold text-secondary">
        Mortgage Calculator
      </h3>
      <p className="mt-1 text-sm text-text-light">
        Estimate your monthly payment — updates live
      </p>

      {/* 1-col on narrow phones, 2-col once there's room — rows always align */}
      <div className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
        {/* Home Price */}
        <div>
          <label htmlFor="mc-price" className={labelClass}>
            Home Price
          </label>
          <div className="relative">
            <span className={`${adornment} left-3`} aria-hidden="true">
              $
            </span>
            <input
              id="mc-price"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0"
              className={`${inputClass} pl-7`}
              value={safePrice ? money(safePrice) : ""}
              onChange={(e) => setHomePrice(Number(digitsOnly(e.target.value)) || 0)}
            />
          </div>
        </div>

        {/* Down Payment — pct readout lives on the label row, never wraps below */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label htmlFor="mc-down" className="text-sm font-bold text-text">
              Down Payment
            </label>
            <span className="shrink-0 text-[0.65rem] font-semibold text-text-light">
              {downPct}% of price
            </span>
          </div>
          <div className="relative">
            <span className={`${adornment} left-3`} aria-hidden="true">
              $
            </span>
            <input
              id="mc-down"
              inputMode="numeric"
              autoComplete="off"
              placeholder="0"
              className={`${inputClass} pl-7`}
              value={safeDown ? money(safeDown) : ""}
              onChange={(e) => setDownPayment(Number(digitsOnly(e.target.value)) || 0)}
            />
          </div>
          {/* One-tap presets — far faster than typing on a phone */}
          <div className="mt-2 flex gap-1.5">
            {[10, 20, 30].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() =>
                  setDownPayment(Math.round(safePrice * (pct / 100)))
                }
                aria-pressed={downPct === pct}
                className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-bold transition-colors ${downPct === pct
                    ? "border-primary bg-primary text-secondary"
                    : "border-border bg-white text-text-light hover:border-primary/50 hover:text-secondary"
                  }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label htmlFor="mc-rate" className={labelClass}>
            Interest Rate
          </label>
          <div className="relative">
            <input
              id="mc-rate"
              type="number"
              step="0.1"
              min="0"
              max="20"
              className={`${inputClass} pr-8`}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-light"
              aria-hidden="true"
            >
              %
            </span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label htmlFor="mc-term" className={labelClass}>
            Loan Term
          </label>
          <div className="relative">
            <input
              id="mc-term"
              type="number"
              min="1"
              max="50"
              className={`${inputClass} pr-10`}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-light"
              aria-hidden="true"
            >
              yrs
            </span>
          </div>
        </div>
      </div>

      {/* Live result — no dead "Calculate" button */}
      <div className="mt-6 rounded-lg border border-primary/25 bg-primary/10 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
          <Calculator size={14} aria-hidden="true" /> Estimated monthly payment
        </p>
        <p className="mt-1 font-serif text-[1.9rem] font-bold leading-tight tabular-nums text-secondary sm:text-3xl">
          {monthly > 0
            ? `$${monthly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : "$0.00"}
        </p>
        <p className="mt-1 text-[0.68rem] leading-5 text-text-light">
          Principal & interest only · {formatCurrency(financed)} financed
        </p>
      </div>
    </div>
  );
}