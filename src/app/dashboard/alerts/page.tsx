"use client";

import UpdateStatus from "@/components/alert/UpdateStatus";
import ViewAlertModal from "@/components/alert/ViewAlertModal";
import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { formatDate } from "@/lib/dateFormat";
import PrivateRoute from "@/routes/PrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-700",
  acknowledged: "bg-yellow-100 text-yellow-700",
  investigating: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-red-100 text-red-700",
};

const AlertsPage = () => {
  const [updateStatus, setUpdateStatus] = useState<any>(null);
  const [viewAlert, setViewAlert] = useState<any>(null);
  const [vewDel, setViewDel] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [severityFilter, setSeverityFilter] = useState<
    "all" | "low" | "medium" | "high" | "critical"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "acknowledged" | "investigating" | "resolved" | "dismissed"
  >("all");

  const [page, setPage] = useState(1);
  const limit = 8;

  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await api.get("/api/alerts");
      return res.data;
    },
  });

  const alerts = Array.isArray(data) ? data : [];

  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(true);
      const res = await api.delete(`/api/alerts/${id}`);
      toast.success("Alert Deleted Successfully!");
      setViewDel(null);
      refetch();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch = a?.title
      ?.toLowerCase()
      ?.includes(search.toLowerCase());

    const matchesSeverity =
      severityFilter === "all" ? true : a?.severity === severityFilter;

    const matchesStatus =
      statusFilter === "all" ? true : a?.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / limit));

  const paginatedAlerts = filteredAlerts.slice(
    (page - 1) * limit,
    page * limit,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PrivateRoute
      allowedRoles={["super_admin", "org_admin", "authority_user", "observer"]}
    >
      <div className="space-y-8">
        <div>
          <h1 className="md:text-2xl text-white text-xl font-bold">Alert Center</h1>
          <p className="text-gray-400">
            Detected suspicious activity that may impact your environment.
          </p>
        </div>

        <div className="md:flex justify-between items-center gap-2 flex-wrap">
          <div className="flex w-full gap-2 flex-wrap">
            {/* SEVERITY FILTER */}
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value as any);
                setPage(1);
              }}
              className="border text-white border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option className="bg-zinc-900 text-white" value="all">All Severity</option>
              <option className="bg-zinc-900 text-white" value="low">Low</option>
              <option className="bg-zinc-900 text-white" value="medium">Medium</option>
              <option className="bg-zinc-900 text-white" value="high">High</option>
              <option className="bg-zinc-900 text-white" value="critical">Critical</option>
            </select>

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option className="bg-zinc-900 text-white" value="all">All Status</option>
              <option className="bg-zinc-900 text-white" value="new">New</option>
              <option className="bg-zinc-900 text-white" value="acknowledged">Acknowledged</option>
              <option className="bg-zinc-900 text-white" value="investigating">Investigating</option>
              <option className="bg-zinc-900 text-white" value="resolved">Resolved</option>
              <option className="bg-zinc-900 text-white" value="dismissed">Dismissed</option>
            </select>

            {/* SEARCH BY TITLE */}
            <div className="relative max-w-lg w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                className="pl-10"
                placeholder="Search by alert title..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>
        <div className="w-full mt-6 overflow-x-auto">
          <div className="min-w-[1400px] bg-primary rounded-xl border border-white/20 overflow-hidden">
            <table className="w-full text-sm md:text-base text-left text-gray-300">
              <thead className="bg-primary text-gray-200 border-b border-white/40">
                <tr className="text-sm md:text-base">
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

                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <div className="flex justify-center">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  paginatedAlerts.map((row) => (
                    <tr
                      key={row?.id}
                      className="bg-primary border-b  border-white/20 hover:bg-white/10 transition"
                    >
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
                        {formatDate(row?.createdAt)}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {row?.category ? row.category : "N/A"}
                      </td>

                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button onClick={() => setViewAlert(row)}>
                            View
                          </Button>
                          {(user?.role === "super_admin" ||
                            user?.role === "org_admin") && (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => setUpdateStatus(row)}
                              >
                                Update Status
                              </Button>
                              <Button
                                onClick={() => setViewDel(row)}
                                className="bg-red-600 hover:bg-red-500"
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                {!isLoading && paginatedAlerts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      No Alerts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* PAGINATION */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            {pageNumbers.map((num) => (
              <Button
                key={num}
                onClick={() => setPage(num)}
                variant={num === page ? "default" : "outline"}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {updateStatus && (
          <UpdateStatus
            alert={updateStatus}
            onClose={() => setUpdateStatus(null)}
            onSuccess={refetch}
          />
        )}
        {viewAlert && (
          <ViewAlertModal
            alert={viewAlert}
            onClose={() => setViewAlert(null)}
          />
        )}
        {vewDel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setViewDel(null)}
            />

            <div className="relative w-full max-w-lg border border-white/20 bg-primary overflow-hidden rounded-2xl shadow-2xl">
              <h2 className="text-center bg-[#141517] text-white  py-6 font-semibold text-xl">
                Delete Alert
              </h2>

              <div className="p-6 pt-8">
                <p className=" text-gray-400 text-center">
                  Are you sure you want to delete?
                </p>

                <div className="flex gap-2 mt-12 justify-end">
                  <Button
                    onClick={() => setViewDel(null)}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={() => handleDelete(vewDel.id)}
                    loading={deleteLoading}
                    className="bg-red-500 hover:bg-red-500/80"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default AlertsPage;
