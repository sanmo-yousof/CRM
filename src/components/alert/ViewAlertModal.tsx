"use client";

import React from "react";
import { Button } from "@/components/custom-ui/Button";
import { formatDate } from "@/lib/dateFormat";

type Props = {
  alert?: any;
  onClose: () => void;
};

const severityColors: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-700",
  acknowledged: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-red-100 text-red-700",
};

const ViewAlertModal = ({ alert, onClose }: Props) => {

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">

        <h2 className="bg-gray-200 py-5 text-center font-semibold text-lg">
          Alert Details
        </h2>

        <div className="p-6 space-y-5">

          {/* TITLE */}
          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="font-semibold">
              {alert?.title ?? "N/A"}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p>
              {alert?.description ?? "N/A"}
            </p>
          </div>

          {/* SEVERITY + STATUS */}
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-gray-500">Severity</p>
              <span
                className={`px-2 py-1 rounded-full text-xs ${severityColors?.[alert?.severity] ?? "bg-gray-100"}`}
              >
                {alert?.severity ?? "N/A"}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`px-2 py-1 rounded-full text-xs ${statusColors?.[alert?.status] ?? "bg-gray-100"}`}
              >
                {alert?.status ?? "N/A"}
              </span>
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p>
              {alert?.category ?? "N/A"}
            </p>
          </div>

          {/* ORG */}
          <div>
            <p className="text-sm text-gray-500">
              Organization ID
            </p>
            <p>
              {alert?.organizationId ?? "N/A"}
            </p>
          </div>

          {/* METADATA */}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Triggered Events
            </p>

            <div className="flex flex-wrap gap-2">
              {alert?.metadata?.eventIds?.length
                ? alert?.metadata?.eventIds?.map(
                    (id: number) => (
                      <span
                        key={id}
                        className="px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        Event #{id}
                      </span>
                    )
                  )
                : "N/A"}
            </div>

            <p className="text-xs mt-2 text-gray-500">
              Source:{" "}
              {alert?.metadata?.source ?? "N/A"}
            </p>
          </div>

          {/* LIFECYCLE */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Acknowledged By
              </p>
              <p>
                {alert?.acknowledgedBy ?? "Not yet acknowledged"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Acknowledged At
              </p>
              <p>
                {alert?.acknowledgedAt
                  ? formatDate(alert?.acknowledgedAt)
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Resolved At
              </p>
              <p>
                {alert?.resolvedAt
                  ? formatDate(alert?.resolvedAt)
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Created At
              </p>
              <p>
                {alert?.createdAt
                  ? formatDate(alert?.createdAt)
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewAlertModal;