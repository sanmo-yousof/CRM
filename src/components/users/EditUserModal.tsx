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
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative w-full max-w-[700px] border border-white/20 bg-primary rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-xl bg-[#141517] text-white font-semibold py-6 text-center">
          Update User Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 p-6">
          <div className="md:grid grid-cols-2 gap-4 space-y-4 md:space-y-0">
            <div>
              <Input
                label="First Name"
                {...register("firstName", { required: "Required" })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Last Name"
                {...register("lastName", { required: "Required" })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300 font-medium">Role</label>
              <select
                {...register("role", { required: "Role required" })}
                className="w-full focus:ring-gray-900 text-white border-gray-400 border rounded-md px-3 py-2 mt-1"
              >
                {roleOptions.map((r) => (
                  <option className="bg-zinc-900 text-white" key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-300 font-medium">Status</label>
              <select
                {...register("isActive")}
                className="w-full border-gray-400 text-white border rounded-md px-3 py-2 mt-1"
              >
                <option className="bg-zinc-900 text-white" value="true">
                  Active
                </option>
              </select>
            </div>

            {currentUserRole === "super_admin" && (
              <div>
                <Input
                  type="number"
                  label="Organization ID"
                  {...register("organizationId")}
                />
                {errors.organizationId && (
                  <p className="text-red-500 text-xs">
                    {errors.organizationId.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              disabled={loading}
              variant="outline"
              onClick={onClose}
            >
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