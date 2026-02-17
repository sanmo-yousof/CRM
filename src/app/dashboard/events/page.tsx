"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import PrivateRoute from "@/routes/PrivateRoute";
import api from "@/lib/axios";
import { formatDate } from "@/lib/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Event = {
  id: number;
  eventType: string;
  source: string;
  eventTimestamp: string;
  createdAt: string;
  organizationId: number | null;
  data: {
    userId?: number;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    [key: string]: any;
  };
};

const EventPage = () => {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get("/api/events");
      return res.data;
    },
  });

  const events: Event[] = Array.isArray(data) ? data : [];

  const filteredEvents = events
    .filter((event) => {
      if (user?.role !== "super_admin") {
        return event.organizationId === user?.organizationId;
      }
      return true;
    })
    .filter((event) => {
      // SEARCH FILTER
      return [event.eventType, event.source, String(event.data?.userId ?? "")]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / limit));
  const paginatedEvents = filteredEvents.slice(
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
        {/* HEADER */}
        <div>
          <h1 className="text-2xl text-white font-bold">Event Management</h1>
          <p className="text-gray-400">System activity & security logs</p>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-lg w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            className="pl-10"
            placeholder="Search by event type, source, or user ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1400px] bg-primary border-white/20  rounded-xl border overflow-hidden">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="bg-primary text-gray-200 border-b border-white/40">
                <tr className="text-xs sm:text-sm lg:text-base">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Event Type</th>
                  <th className="px-6 py-3 font-semibold">Source</th>
                  <th className="px-6 py-3 font-semibold">User ID</th>
                  <th className="px-6 py-3 font-semibold">IP Address</th>
                  <th className="px-6 py-3 font-semibold">Org ID</th>
                  <th className="px-6 py-3 font-semibold">Created</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  paginatedEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="bg-primary border-b border-white/20 hover:bg-white/10 transition text-xs sm:text-sm lg:text-base"
                    >
                      <td className="px-4 py-3">{event.id}</td>
                      <td className="px-4 py-3">{event.eventType}</td>
                      <td className="px-4 py-3">{event.source}</td>
                      <td className="px-4 py-3">
                        {event.data?.userId ?? "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {event.data?.ipAddress || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {event.organizationId ?? "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(event.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Button onClick={() => setSelectedEvent(event)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}

                {!isLoading && paginatedEvents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      No events found
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

        {/* EVENT VIEW MODAL */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSelectedEvent(null)}
            />
            <div className="relative w-full max-w-2xl bg-primary border border-white/20 rounded-2xl shadow-xl overflow-hidden">
              <h2 className="text-xl font-semibold py-5  bg-[#141517] text-white text-center">
                Event Details
              </h2>

              <div className="p-6 space-y-4 text-gray-300 text-sm">
                <p>
                  <strong>Event Type :</strong> {selectedEvent.eventType}
                </p>
                <p>
                  <strong>Source :</strong> {selectedEvent.source}
                </p>
                <p>
                  <strong>Organization ID :</strong>{" "}
                  {selectedEvent.organizationId ?? "N/A"}
                </p>
                <p>
                  <strong>Event Time :</strong>{" "}
                  {formatDate(selectedEvent.eventTimestamp)}
                </p>
                <p>
                  <strong>Logged At :</strong>{" "}
                  {formatDate(selectedEvent.createdAt)}
                </p>

                <div>
                  <p className="font-semibold mb-2">Event Data</p>
                  <pre className="bg-[#363739] p-3 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(selectedEvent.data, null, 2)}
                  </pre>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setSelectedEvent(null)}>Close</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

export default EventPage;
