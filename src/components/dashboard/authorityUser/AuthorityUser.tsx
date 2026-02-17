"use client";

import { Button } from "@/components/custom-ui/Button";
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
      {/* HEADER */}
      <div>
        <h1 className="text-2xl text-white font-bold">Security Overview</h1>
        <p className="text-gray-400">Your personal activity risk & alerts</p>
      </div>

      {/* RISK INDICATORS */}
      <div className="bg-primary border border-white/20 rounded-xl p-6">
        <h2 className="text-lg text-white font-semibold mb-4">
          Personal Risk Indicators
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#363739] border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-400">Risk Score</p>
            <p className="text-xl text-red-400 font-semibold mt-1">Medium</p>
          </div>

          <div className="bg-[#363739] border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-400">Failed Logins</p>
            <p className="text-xl text-white font-semibold mt-1">3 Attempts</p>
          </div>

          <div className="bg-[#363739] border border-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-400">Unknown IP Login</p>
            <p className="text-xl text-yellow-400 font-semibold mt-1">
              Detected
            </p>
          </div>
        </div>
      </div>

      <div className="lg:grid gap-8 grid-cols-3">
        {/* SUSPICIOUS SIGNALS */}
        <div className="bg-primary col-span-2 border border-white/20 rounded-xl p-6">
          <h2 className="text-lg text-white font-semibold mb-4">
            Key Suspicious Signals
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Login anomaly detected",
              "Inbox rule modified",
              "Unusual payment approval",
              "Permission escalation",
            ].map((signal, i) => (
              <div
                key={i}
                className="bg-[#363739] border border-white/10 rounded-lg p-4"
              >
                <p className="text-sm text-gray-300">{signal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTS */}
        <div className="bg-primary mt-8 lg:mt-0 col-span-1 border border-white/20 rounded-xl p-6">
          <h2 className="text-lg text-white font-semibold mb-4">
            Alerts Involving You
          </h2>

          <div className="space-y-3">
            {[
              "Login from new device detected",
              "Mailbox forwarding rule enabled",
              "Suspicious approval attempt",
              "Multiple failed login attempts",
            ].map((alert, i) => (
              <div
                key={i}
                className="bg-[#363739] border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
              >
                <p className="text-sm text-gray-300">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      {/* <div className="bg-primary border border-white/20 rounded-xl p-6">
        <h2 className="text-lg text-white font-semibold mb-4">
          Recommended Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline">Verify Activity</Button>
          <Button variant="outline">Reset Password</Button>
          <Button variant="outline">Report Suspicious Behavior</Button>
          <Button variant="outline">Enable MFA</Button>
        </div>
      </div> */}
    </div>
  );
};

export default AuthorityDashboard;
