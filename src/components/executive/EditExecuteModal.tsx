"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Executive } from "@/types/executive";


type Props = {
  user: Executive;
  currentUserRole: "super_admin" | "org_admin";
  onClose: () => void;
  onSuccess: () => void;
};

type FormValues = {
  firstName: string;
  lastName: string;
  isActive: string;
};

const EditExecutiveModal = ({ user, currentUserRole, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive ? "true" : "false",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        isActive: data.isActive === "true",
      };

      await api.patch(`/api/executives/${user.id}`, payload);

      toast.success("Executive updated successfully");
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

      <div className="relative w-full max-w-xl bg-primary border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-xl font-semibold bg-[#141517] text-white py-6  text-center">
          Update Executive Details
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 p-6">
          <div className="md:grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              {...register("firstName", { required: true })}
            />
            <Input
              label="Last Name"
              {...register("lastName", { required: true })}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 font-medium">Status</label>
            <select
              {...register("isActive")}
              className="w-full border-gray-400 border text-white rounded-md px-3 py-2 mt-1"
            >
              <option className="bg-zinc-900 text-white" value="true">Active</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
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

export default EditExecutiveModal;
