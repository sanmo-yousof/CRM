"use client";

import { Bell, Activity, ShieldCheck } from "lucide-react";
import React from "react";

const stats = [
  {
    label: "Total Alerts",
    value: 21,
    icon: Bell,
  },
  {
    label: "Resolved Alerts",
    value: 14,
    icon: ShieldCheck,
  },
  {
    label: "Events Logged",
    value: 1045,
    icon: Activity,
  },
];

const ObserverDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Observer Dashboard</h1>
        <p className="text-gray-500">
          Read-only system monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

export default ObserverDashboard;