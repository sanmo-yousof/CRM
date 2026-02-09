"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type RoleData = {
  name: string;
  value: number;
};

const COLORS = [
  "#fe8043", // Super Admin
  "#2563eb", // Org Admin
  "#ffbb28", // Executive
  "#00c4a0", // Observer
];

export default function UserRoleDonutChart({ data }: { data: RoleData[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 h-[340px]">
     

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
