"use client";
import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/format";

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

  const downPct =
    homePrice > 0 ? Math.min(Math.round((downPayment / homePrice) * 100), 100) : 0;

  const inputClass =
    "w-full px-3 py-2.5 bg-white border border-border rounded-md focus:outline-none focus:border-primary text-sm text-text";
  const labelClass = "block text-sm font-bold text-text mb-1.5";

  return (
    <div className="border border-border bg-off-white rounded-xl p-6 shadow-sm">
      <h3 className="font-serif text-2xl font-bold text-secondary mb-1">Mortgage Calculator</h3>
      <p className="text-text-light text-sm mb-6">Estimate your monthly payment — updates live</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className={labelClass}>Home Price ($)</label>
          <input
            type="number"
            className={inputClass}
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Down Payment ($)</label>
          <input
            type="number"
            className={inputClass}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
          />
          <p className="mt-1 text-[0.68rem] text-text-light">{downPct}% of price</p>
        </div>
        <div>
          <label className={labelClass}>Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            className={inputClass}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelClass}>Loan Term (yrs)</label>
          <input
            type="number"
            className={inputClass}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </div>
      </div>
      {/* Live result — no dead "Calculate" button */}
      <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">
          <Calculator size={14} /> Estimated monthly payment
        </p>
        <p className="mt-1 font-serif text-2xl font-bold text-secondary">
          {monthly > 0
            ? `$${monthly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : "$0.00"}
        </p>
        <p className="mt-1 text-[0.68rem] text-text-light">
          Principal & interest only · {formatCurrency(Math.max((Number.isFinite(homePrice) ? homePrice : 0) - (Number.isFinite(downPayment) ? downPayment : 0), 0))} financed
        </p>
      </div>
    </div>
  );
}