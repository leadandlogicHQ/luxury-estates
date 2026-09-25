"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InquiryActivityChart({ data }: { data: { month: string; count: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ece7dd" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#746d64" }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#746d64" }} />
          <Tooltip
            cursor={{ fill: "rgba(200,164,93,0.08)" }}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5ded2", fontSize: 12, boxShadow: "0 8px 30px rgba(23,23,23,0.08)" }}
          />
          <Bar dataKey="count" name="Inquiries" fill="#c8a45d" radius={[6, 6, 0, 0]} maxBarSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}