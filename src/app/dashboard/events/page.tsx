"use client";

import React, { useState } from "react";
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
  const { user , loading} = useAuth()

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

  return (
    <PrivateRoute
      allowedRoles={["super_admin", "org_admin", "authority_user", "observer"]}
    >
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Event Management</h1>
          <p className="text-gray-500">System activity & security logs</p>
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
          <div className="min-w-[1200px] bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 border-b">
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
                  filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b hover:bg-gray-50 transition"
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

                {!isLoading && filteredEvents.length === 0 && (
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

        {/* EVENT VIEW MODAL */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSelectedEvent(null)}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
              <h2 className="text-xl font-semibold py-5 bg-gray-200 text-center">
                Event Details
              </h2>

              <div className="p-6 space-y-4 text-sm">
                <p><strong>Event Type:</strong> {selectedEvent.eventType}</p>
                <p><strong>Source:</strong> {selectedEvent.source}</p>
                <p><strong>Organization ID:</strong> {selectedEvent.organizationId ?? "N/A"}</p>
                <p><strong>Event Time:</strong> {formatDate(selectedEvent.eventTimestamp)}</p>
                <p><strong>Logged At:</strong> {formatDate(selectedEvent.createdAt)}</p>

                <div>
                  <p className="font-semibold mb-2">Event Data</p>
                  <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(selectedEvent.data, null, 2)}
                  </pre>
                </div>

                <div className="flex justify-end">
                  <Button  onClick={() => setSelectedEvent(null)}>
                    Close
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

export default EventPage;
