import EventTrendChart from "@/components/charts/EventTrendChart";
import UserRoleDonutChart from "@/components/charts/UserRoleChart";
import { Button } from "@/components/custom-ui/Button";
import {
  Activity,
  Bell,
  Building2,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  TriangleAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

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
  {
    label: "Total Organizations",
    value: 12,
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Total Users",
    value: "1,248 +",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

const statusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-700",
  acknowledged: "bg-yellow-100 text-yellow-700",
  investigating: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-red-100 text-red-700",
};

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
  { date: "Feb 10", events: 120 },
  { date: "Feb 11", events: 240 },
  { date: "Feb 12", events: 190 },
  { date: "Feb 13", events: 310 },
  { date: "Feb 14", events: 150 },
  { date: "Feb 15", events: 190 },
  { date: "Feb 16", events: 310 },
  { date: "Feb 17", events: 150 },
];

const SuperAdminDashboard = () => {
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  const suspiciousActivities = useMemo(() => {
    const map: Record<string, number> = {
      login_anomaly: 0,
      mailbox_rule: 0,
      geo_impossible_login: 0,
    };

    alertsData.forEach((a) => {
      if (map[a.category] !== undefined) {
        map[a.category]++;
      }
    });

    return map;
  }, []);

  return (
    <div className="space-y-8">
      <div className="">
        <h1 className="md:text-2xl text-xl font-bold">
          Welcome back, Super Admin
        </h1>
        <p className="text-gray-500">You have platform-wide visibility.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between h-full "
          >
            <div className="flex items-center justify-between">
              <p className="text-sm md:text-lg  text-slate-600 mb-2">
                {s.label}
              </p>
              <s.icon size={36} className="text-slate-600" />
            </div>
            <div className="">
              <p className="text-xl md:text-2xl mt-4 md:mt-6 font-bold text-slate-900">
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

      <div className="bg-white rounded-xl p-6 border h-full border-slate-200 overflow-hidden">
        <h2 className="font-bold mb-4">Suspicious Activities</h2>
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">
                Activity Type
              </th>
              <th className="px-4 py-3 font-semibold">
                Count
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                Login Anomalies
              </td>
              <td className="px-4 py-3">
                {suspiciousActivities.login_anomaly}
              </td>
            </tr>

            <tr className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                Inbox Rule Creation
              </td>
              <td className="px-4 py-3">
                {suspiciousActivities.mailbox_rule}
              </td>
            </tr>

            <tr className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                Impossible Travel Login
              </td>
              <td className="px-4 py-3">
                {suspiciousActivities.geo_impossible_login}
              </td>
            </tr>
          </tbody>
        </table>
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
          <div className="min-w-[1200px] bg-white rounded-xl border border-slate-200  overflow-hidden">
            <table className="w-full text-sm md:text-base text-left text-gray-700">
              <thead className="bg-gray-100 border-b">
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
                    Org Id
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
                    className="bg-white border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row?.title}
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row?.severity}
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
            ${statusColors?.[row?.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {row?.status ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row?.organizationId ? row.organizationId : "N/A"}
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

export default SuperAdminDashboard;
