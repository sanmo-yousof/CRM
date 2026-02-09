"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import api from "@/lib/axios";
import toast from "react-hot-toast";

type Props = {
  user: any;
  currentUserRole: "super_admin" | "org_admin";
  onClose: () => void;
  onSuccess: () => void;
};

type FormValues = {
  firstName: string;
  lastName: string;
  role: string;
  isActive: string;
  organizationId?: number;
};

const EditUserModal = ({ user, currentUserRole, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive ? "true" : "false",
      organizationId: user.organizationId,
    },
  });

  // Role options based on editor role
  const roleOptions =
    currentUserRole === "super_admin"
      ? ["org_admin", "authority_user", "observer"]
      : ["authority_user", "observer"];

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const payload: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isActive: data.isActive === "true",
      };

      // Only super admin can move users across orgs
      if (currentUserRole === "super_admin" && data.organizationId) {
        payload.organizationId = Number(data.organizationId);
      }

      await api.patch(`/api/users/${user.id}`, payload);

      toast.success("User updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-xl font-semibold py-6 bg-gray-200 text-center">
          Update User Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 p-6">
          <div className="md:grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register("firstName", { required: "Required" })}
            />
            <Input
              label="Last Name"
              {...register("lastName", { required: "Required" })}
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              {...register("role", { required: "Role required" })}
              className="w-full border-gray-400 border rounded-md px-3 py-2 mt-1"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
            
              {...register("isActive")}
              className="w-full border-gray-400 border rounded-md px-3 py-2 mt-1"
            >
              <option value="true">Active</option>
            </select>
          </div>

          {/* ORG CHANGE (Super Admin Only) */}
          {currentUserRole === "super_admin" && (
            <Input
              type="number"
              label="Organization ID"
              {...register("organizationId")}
            />
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" disabled={loading} variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={loading} type="submit">
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
