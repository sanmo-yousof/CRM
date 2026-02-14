"use client";

import { Users, Bell, Activity, ShieldCheck } from "lucide-react";
import React from "react";

const stats = [
  {
    label: "Organization Users",
    value: 86,
    icon: Users,
  },
  {
    label: "Executives",
    value: 12,
    icon: ShieldCheck,
  },
  {
    label: "Active Alerts",
    value: 7,
    icon: Bell,
  },
  {
    label: "Total Events",
    value: 1540,
    icon: Activity,
  },
];

const OrgAdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome Org Admin</h1>
        <p className="text-gray-500">
          Organization level monitoring & control
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white p-6 rounded-xl border flex justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-xl font-bold mt-2">{s.value}</p>
            </div>
            <s.icon className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrgAdminDashboard;