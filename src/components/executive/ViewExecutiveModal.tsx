"use client";

import { Button } from "@/components/custom-ui/Button";
import { formatDate } from "@/lib/dateFormat";
import React from "react";

type user = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role:string;
  organizationId?: number | null;
  isActive:boolean;
  lastLoginAt:string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  user: user | null;
  onClose: () => void;
};

const ViewExecutiveModal = ({ user, onClose }: Props) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-primary border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-xl font-semibold py-6 text-white bg-[#141517] text-center mb-6">
          Executive Details
        </h2>

        <div className="space-y-4 text-sm md:text-base pt-8 p-6">

          <Detail label="ID" value={user.id} />
          <Detail label="First Name" value={user.firstName} />
          <Detail label="Last Name" value={user.lastName} />
          <Detail label="Email" value={user.email} />
          <Detail label="Role" value={user.role} />
          <Detail label="Organization Id" value={user.organizationId ? user.organizationId : "N/A"} />
          <Detail label="Is Active" value={user.isActive ? "Active":"Not Active"} />
          <Detail label="Last Login " value={user.lastLoginAt?formatDate(user.lastLoginAt):"_"} />
          <Detail label="Created " value={formatDate(user.createdAt)} />
          <Detail label="Last Updated" value={formatDate(user.updatedAt)} />

          
        </div>

        <div className="flex justify-end pr-6 pb-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between border-b border-white/20 pb-2">
    <span className="text-gray-300">{label}</span>
    <span className="font-medium text-white text-right max-w-[60%] break-words">
      {value}
    </span>
  </div>
);

export default ViewExecutiveModal;
