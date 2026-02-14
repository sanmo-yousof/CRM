"use client";

import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import PrivateRoute from "@/routes/PrivateRoute";
import api from "@/lib/axios";
import { formatDate } from "@/lib/dateFormat";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ViewAuditModal from "@/components/audit/ViewAuditModal";

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-yellow-100 text-yellow-700",
  logout: "bg-gray-100 text-gray-700",
};


const AuditLogsPage = () => {
  const { user } = useAuth();
  const [viewAudit, setViewAudit] = useState<number | null>(null);

  const canFilter = user?.role === "super_admin" || user?.role === "org_admin";

  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const limit = 8;

  const { data = [], isLoading } = useQuery({
    queryKey: ["audit", action, userId, startDate, endDate],
    queryFn: async () => {
      const params: Record<string, any> = {};

      if (canFilter) {
        if (action) params.action = action;
        if (userId) params.userId = userId;
        if (startDate) params.startDate = new Date(startDate).toISOString();
        if (endDate) params.endDate = new Date(endDate).toISOString();
      }

      const res = await api.get("/api/audit", { params });
      return res.data ?? [];
    },
  });

  const totalPages = Math.max(1, Math.ceil(data.length / limit));

  const paginatedLogs = useMemo(() => {
    return data.slice((page - 1) * limit, page * limit);
  }, [data, page]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <PrivateRoute
      allowedRoles={["super_admin", "org_admin", "authority_user", "observer"]}
    >
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-gray-500">Platform Activity History</p>
        </div>

        {/* FILTER */}
        {canFilter && (
          <div className="flex flex-wrap gap-2">
            <select
              className="border px-3 py-2 rounded"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Action</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>

            <div>
              <Input
                placeholder="User ID"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Who</th>
                <th className="px-4 py-3">What</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Org</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                   <div className="flex justify-center">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                      </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                paginatedLogs.map((log: any) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-3">{log.userId}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          actionColors[log.action] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3">{log.organizationId}</td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        onClick={() => setViewAudit(log.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}

              {!isLoading && paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    No Logs Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
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
                variant={num === page ? "default" : "outline"}
                onClick={() => setPage(num)}
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

        {viewAudit && (
          <ViewAuditModal id={viewAudit} onClose={() => setViewAudit(null)} />
        )}
      </div>
    </PrivateRoute>
  );
};

export default AuditLogsPage;
