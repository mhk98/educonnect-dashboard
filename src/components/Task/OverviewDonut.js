import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const DONUT_COLORS = {
  OPEN: "#2563eb",
  IN_PROGRESS: "#f97316",
  COMPLETED: "#059669",
  BLOCKED: "#dc2626",
};

export default function OverviewDonut({ overview, statuses }) {
  const data = statuses.map((s) => ({
    key: s.key,
    name: s.title,
    value: Number(overview?.[s.key] || 0),
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4">
      <div className="text-sm font-semibold text-slate-800">Task Overview</div>

      <div className="mt-3 flex justify-center">
        <PieChart width={240} height={220}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={62}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={DONUT_COLORS[entry.key]} />
            ))}
          </Pie>

          <text
            x={120}
            y={105}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="22"
          >
            {total}
          </text>
          <text
            x={120}
            y={130}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill="#64748b"
          >
            Tasks
          </text>
        </PieChart>
      </div>

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
