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
      {/* HEADER */}
      <div>
        <h1 className="text-2xl text-white font-bold">Monitoring Overview</h1>
        <p className="text-gray-400">
          Organization alerts & security activity (Read-only)
        </p>
      </div>

      {/* ALERT SUMMARY */}
      <div className="bg-primary border border-white/20 rounded-xl p-6">
        <h2 className="text-lg text-white font-semibold mb-4">Alert Summary</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#363739] border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-400">Total Alerts</p>
            <p className="text-xl text-white font-semibold mt-1">12</p>
          </div>

          <div className="bg-[#363739] border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-400">Login Anomalies</p>
            <p className="text-xl text-yellow-400 font-semibold mt-1">4</p>
          </div>

          <div className="bg-[#363739] border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-400">Suspicious Activities</p>
            <p className="text-xl text-red-400 font-semibold mt-1">2</p>
          </div>
        </div>
      </div>

      

      {/* NOTE */}
      <div className="bg-primary border border-white/20 rounded-xl p-6">
        <p className="text-sm text-gray-400">
          You are viewing this data in read-only mode. Administrative actions
          are restricted for observer role.
        </p>
      </div>
    </div>
  );
};

export default ObserverDashboard;
