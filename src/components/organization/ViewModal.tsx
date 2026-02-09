"use client";

import { Button } from "@/components/custom-ui/Button";
import { formatDate } from "@/lib/dateFormat";
import React from "react";

type Org = {
  id: string;
  name: string;
  domain: string;
  status?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  org: Org | null;
  onClose: () => void;
};

const ViewOrganizationModal = ({ org, onClose }: Props) => {
  if (!org) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-xl font-semibold py-6 bg-gray-200 text-center mb-6">
          Organization Details
        </h2>

        <div className="space-y-4 text-sm md:text-base pt-8 p-6">

          <Detail label="ID" value={org.id} />
          <Detail label="Organization Name" value={org.name} />
          <Detail label="Domain" value={org.domain} />
          <Detail label="Status" value={org.status || "—"} />
          <Detail label="Created" value={formatDate(org.createdAt)} />
          <Detail label="Last Updated" value={formatDate(org.updatedAt)} />

          {/* Metadata */}
          <div>
            <p className="font-medium mb-2">Meta Data</p>
            {org.metadata && Object.keys(org.metadata).length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                {Object.entries(org.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No metadata</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pr-6 pb-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-right max-w-[60%] break-words">
      {value}
    </span>
  </div>
);

export default ViewOrganizationModal;
