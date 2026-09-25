"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

/* Champagne palette derived from brand tokens */
const COLORS = ["#c8a45d", "#171717", "#e5d2a6", "#a9843d", "#292929", "#8a6d3f"];

export default function PropertyTypeChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div>
      <div className="h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={86}
              paddingAngle={4}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            {/* Recharts v3 types formatter params contextually */}
            <Tooltip
              formatter={(value, name) => [
                `${Number(value)} listing${Number(value) === 1 ? "" : "s"}`,
                String(name),
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5ded2",
                fontSize: 12,
                boxShadow: "0 8px 30px rgba(23,23,23,0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="font-serif text-3xl font-bold text-secondary">{total}</p>
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-text-light font-semibold">
            Listings
          </p>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((d, i) => (
          <span key={d.name} className="flex items-center gap-1.5 text-xs text-text-light">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}