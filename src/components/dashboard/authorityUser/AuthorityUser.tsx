"use client";

import { Bell, ShieldAlert, Activity, Clock } from "lucide-react";
import React from "react";

const stats = [
  {
    label: "Critical Alerts",
    value: 3,
    icon: ShieldAlert,
  },
  {
    label: "New Alerts",
    value: 5,
    icon: Bell,
  },
  {
    label: "Events Logged",
    value: 312,
    icon: Activity,
  },
  {
    label: "Investigating",
    value: 2,
    icon: Clock,
  },
];

const AuthorityDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Authority Dashboard</h1>
        <p className="text-gray-500">
          Monitor alerts & security activity
        </p>
      </div>

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

export default AuthorityDashboard;