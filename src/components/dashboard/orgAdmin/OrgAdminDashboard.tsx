"use client";

import EventTrendChart from "@/components/charts/EventTrendChart";
import UserRoleDonutChart from "@/components/charts/UserRoleChart";
import { Button } from "@/components/custom-ui/Button";
import { formatDate } from "@/lib/dateFormat";
import {
  Users,
  Bell,
  Activity,
  ShieldCheck,
  TriangleAlert,
  Building2,
  Info,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type Alert = {
  id: number;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: string;
  organizationId?: number | null;
  createdAt: string;
  category: string;
};

const stats = [
  {
    label: "Total Alerts",
    value: 48,
    icon: Bell,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    label: "Organization Risk Score",
    value: "154",
    icon: TriangleAlert,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  // {
  //   label: "Total Organizations",
  //   value: 12,
  //   icon: Building2,
  //   color: "text-blue-600",
  //   bg: "bg-blue-100",
  // },
  {
    label: "My Org Users",
    value: "1,248 +",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

const alertsData: Alert[] = [
  {
    id: 14,
    title: "Multiple Failed Login Attempts",
    severity: "critical",
    status: "resolved",
    category: "authentication",
    organizationId: 7,
    createdAt: "2026-02-14T00:56:24.168Z",
  },
  {
    id: 13,
    title: "Multiple Failed Login Attempts",
    severity: "critical",
    status: "investigating",
    category: "login_anomaly",
    organizationId: null,
    createdAt: "2026-02-14T00:25:59.641Z",
  },
  {
    id: 11,
    title: "Multiple Failed Login Attempts",
    severity: "critical",
    status: "new",
    category: "authentication",
    organizationId: null,
    createdAt: "2026-02-14T00:25:52.904Z",
  },
  {
    id: 8,
    title: "Multiple Failed Login Attempts",
    severity: "critical",
    status: "new",
    category: "geo_impossible_login",
    organizationId: null,
    createdAt: "2026-02-14T00:25:39.908Z",
  },
  {
    id: 5,
    title: "Multiple Failed Login Attempts",
    severity: "medium",
    status: "acknowledged",
    category: "mailbox_rule",
    organizationId: null,
    createdAt: "2026-02-13T22:36:11.274Z",
  },
];

const roleData = [
  { name: "Low", value: 1 },
  { name: "Medium", value: 4 },
  { name: "High", value: 8 },
  { name: "Critical", value: 12 },
];

const eventTrendData = [
  { date: "Feb 10", events: 320 },
  { date: "Feb 11", events: 140 },
  { date: "Feb 12", events: 290 },
  { date: "Feb 13", events: 410 },
  { date: "Feb 14", events: 250 },
  { date: "Feb 15", events: 390 },
  { date: "Feb 16", events: 410 },
  { date: "Feb 17", events: 150 },
];

const statusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-700",
  acknowledged: "bg-yellow-100 text-yellow-700",
  investigating: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-red-100 text-red-700",
};

const OrgAdminDashboard = () => {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-2xl font-bold">Welcome Org Admin</h1>
        <p className="text-gray-400">Organization level monitoring & control</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-primary p-6 rounded-xl flex flex-col justify-between h-full "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm md:text-lg  text-gray-400 mb-2">
                {s.label}
              </p>
              <s.icon size={36} className="text-gray-400" />
            </div>
            <div className="">
              <p className="text-xl md:text-2xl mt-4 md:mt-6 font-bold text-white">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="w-full">
          <EventTrendChart data={eventTrendData} />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full flex flex-col md:flex-row gap-6">
          {/* SEVERITY CHART */}
          <div className="w-full md:w-1/2">
            <UserRoleDonutChart data={roleData} />
          </div>

          {/* SUSPICIOUS TABLE */}
          <div className="w-full  md:w-1/2">
            <div className="bg-primary rounded-xl p-6  h-full overflow-hidden">
              <h2 className="font-bold mb-4">Suspicious Activities</h2>
              <div className="flex flex-col space-y-2">
                <div className="p-4 flex items-center justify-between text-base text-gray-400 font-medium rounded-md bg-[#363739]">
                  <h3 className="text-base ">Login Anomaly</h3>
                  <Info className="text-red-500" />
                </div>
                <div className="p-4 flex items-center justify-between text-base text-gray-400 font-medium rounded-md bg-[#363739]">
                  <h3 className="text-base ">Mailbox Rule</h3>
                  <Info className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-end justify-between">
          <h2 className="font-bold ">Recent Alerts</h2>
          <div>
            <Link href={"/dashboard/alerts"}>
              <Button>view all</Button>
            </Link>
          </div>
        </div>

        <div className="w-full mt-6 overflow-x-auto">
          <div className="min-w-[1200px] bg-primary rounded-xl border border-white/10  overflow-hidden">
            <table className="w-full text-sm md:text-base text-left text-gray-300">
              <thead className="bg-primary border-white/30 text-gray-200 border-b">
                <tr className="text-sm md:text-base">
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Severity
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Created
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Category
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* {isLoading && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <div className="flex justify-center">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                )} */}

                {/* {!isLoading && */}
                {alertsData.map((row) => (
                  <tr
                    key={row?.id}
                    className="bg-primary border-b border-white/30 hover:bg-white/10 transition"
                  >
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row?.title}
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row?.severity}
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium
            ${statusColors?.[row?.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {row?.status ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {formatDate(row?.createdAt)}
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row?.category ? row.category : "N/A"}
                    </td>
                  </tr>
                ))}

                {/* {!isLoading && alertsData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      No Alerts found
                    </td>
                  </tr>
                )} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgAdminDashboard;
