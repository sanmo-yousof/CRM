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

const COLORS = ["#fe8043", "#2563eb", "#ffbb28", "#00c4a0"];

export default function UserRoleDonutChart({ data }: { data: RoleData[] }) {
  return (
    <div className="bg-primary rounded-xl  p-8 h-[400px]">
      <h2 className="font-bold">
        Alerts by severity
      </h2>
      <ResponsiveContainer width="100%" height="90%">
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
