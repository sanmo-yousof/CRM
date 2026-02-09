import UserRoleDonutChart from "@/components/charts/UserRoleChart";
import {
  Activity,
  Bell,
  Building2,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  Users,
} from "lucide-react";
import React, { useMemo } from "react";

type Alert = {
  id: number;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status?: string;
  organizationId: number;
  createdAt: string;
};

const stats = [
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
  {
    label: "Total Alerts",
    value: 48,
    icon: Bell,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    label: "Total Events",
    value: "154k",
    icon: Activity,
    color: "text-green-600",
    bg: "bg-green-100",
  },
];

const alertsData: Alert[] = [
  {
    id: 1,
    title: "Multiple Failed Login Attempts",
    severity: "high",
    status: "new",
    organizationId: 1,
    createdAt: "2026-02-03T06:31:07.089Z",
  },
  {
    id: 2,
    title: "Unusual Data Export",
    severity: "critical",
    status: "new",
    organizationId: 2,
    createdAt: "2026-02-03T07:15:00.000Z",
  },
  {
    id: 3,
    title: "API Rate Limit Near",
    severity: "medium",
    status: "acknowledged",
    organizationId: 1,
    createdAt: "2026-02-03T05:20:00.000Z",
  },
  {
    id: 4,
    title: "Disk Space Low",
    severity: "low",
    status: "resolved",
    organizationId: 3,
    createdAt: "2026-02-02T12:00:00.000Z",
  },
  {
    id: 5,
    title: "Expired SSL Certificate",
    severity: "critical",
    status: "new",
    organizationId: 5,
    createdAt: "2026-02-03T08:45:00.000Z",
  },
];

const eventsData = [
  {
    id: 1,
    eventType: "login_attempt",
    source: "auth_service",
    data: { userId: 123, ipAddress: "192.168.1.1" },
    organizationId: 1,
    eventTimestamp: "2026-01-07T10:00:00.000Z",
    createdAt: "2026-01-07T10:00:00.000Z",
  },
  {
    id: 2,
    eventType: "file_upload",
    source: "storage_svc",
    organizationId: 2,
    eventTimestamp: "2026-02-03T11:30:00.000Z",
  },
  {
    id: 3,
    eventType: "user_created",
    source: "admin_portal",
    organizationId: 1,
    eventTimestamp: "2026-02-03T11:45:00.000Z",
  },
  {
    id: 4,
    eventType: "db_backup",
    source: "cron_job",
    organizationId: 4,
    eventTimestamp: "2026-02-03T12:00:00.000Z",
  },
  {
    id: 5,
    eventType: "policy_updated",
    source: "security_mgr",
    organizationId: 3,
    eventTimestamp: "2026-02-03T12:15:00.000Z",
  },
];

const roleData = [
  { name: "Super Admin", value: 1 },
  { name: "Org Admin", value: 4 },
  { name: "Executive", value: 8 },
  { name: "Observer", value: 12 },
];

const SuperAdminDashboard = () => {
  const severityCounts = useMemo(() => {
    const counts: Record<Alert["severity"], number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    alertsData.forEach((a) => counts[a.severity]++);
    return counts;
  }, []);

  const getSeverityStyles = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

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
                <p className="text-sm md:text-lg  text-slate-600 mb-2">{s.label}</p>
                <s.icon size={36} className="text-slate-600" />
              </div>
              <div className="">
                
                <p className="text-xl md:text-2xl mt-4 md:mt-6 font-bold text-slate-900">{s.value}</p>
                
              </div>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            Recent Events (Top 5)
          </h2>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px] bg-white rounded-xl border border-slate-200  overflow-hidden">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 border-b">
                  <tr className="text-xs sm:text-sm lg:text-base">
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Event Type
                    </th>
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Source
                    </th>
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Org Id
                    </th>
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {eventsData.slice(0, 5).map((row, indx) => (
                    <tr
                      key={row.id}
                      className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
                    >
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {row.eventType}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {row.source}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {row.organizationId}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {formatDate(row.eventTimestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className=" max-w-md w-full ">
          {/* <h2 className="font-bold mb-4 flex items-center gap-2">
            Alerts Severity Breakdown
          </h2>
          <div className="bg-white  rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between mb-4 text-gray-700 text-xs font-bold">
              <p> TYPE </p>
              <p> COUNT</p>
            </div>
            {Object.entries(severityCounts).map(([sev, count]) => (
              <div
                key={sev}
                className="flex justify-between py-3 border-slate-200 border-b"
              >
                <span
                  className={`px-2 py-1 text-xs rounded border ${getSeverityStyles(sev as Alert["severity"])}`}
                >
                  {sev.toUpperCase()}
                </span>
                <span className="font-mono font-bold">{count}</span>
              </div>
            ))}
            <div className="flex items-center mt-2 justify-between mb-4 text-gray-700 text-xs font-bold">
                <p> TOTAL </p>
              <p className="font-bold text-xl"> 5</p>
            </div>
          </div> */}
          <h2 className="font-bold mb-4 flex items-center gap-2">
            Users (by role)
          </h2>
          <UserRoleDonutChart data={roleData} />
        </div>
      </div>
      <div className="w-full">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          Recent Alerts (Top 5)
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px] bg-white rounded-xl border border-slate-200  overflow-hidden">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 border-b">
                <tr className="text-xs sm:text-sm lg:text-base">
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Org Id
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Severity
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {alertsData.slice(0, 5).map((row, indx) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
                  >
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row.title}
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row.organizationId}
                    </td>
                    <td className={`px-4 py-3 md:py-4 whitespace-nowrap `}>
                      <span
                        className={`py-1  px-2 rounded-full text-xs font-medium ${getSeverityStyles(row.severity)}`}
                      >
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {row.status}
                    </td>
                    <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
