import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const DONUT_COLORS = {
  OPEN: "#2563eb",
  IN_PROGRESS: "#f97316",
  COMPLETED: "#059669",
  BLOCKED: "#dc2626",
};

export default function TaskOverviewDonut({ overview, statuses }) {
  const data = statuses.map((s) => ({
    key: s.key,
    name: s.title,
    value: Number(overview?.[s.key] || 0),
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-xl ring-1 ring-slate-200 p-4">
      {/* <div className="text-sm font-semibold text-slate-800 mt-6">
        Task Overview
      </div> */}

      <div className="mt-3 flex justify-center"></div>

      <div className="mt-2 space-y-2 text-sm">
        {statuses.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between text-slate-700"
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: DONUT_COLORS[s.key] }}
              />
              <span>{s.title}</span>
            </div>
            <span className="font-semibold">{overview?.[s.key] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
