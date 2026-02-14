"use client";

import React from "react";
import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

type FormData = {
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  source: string;
};

const CreateAlertModal = ({ onClose, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const submit = async (data: FormData) => {
    try {
      await api.post("/api/alerts", {
        ...data,
        status: "new",
      });

      toast.success("Alert Created Successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to create alert"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <h2 className="bg-gray-200 py-5 text-center font-semibold text-lg">
          Create Alert
        </h2>

        <form
          onSubmit={handleSubmit(submit)}
          className="p-6 space-y-4"
        >
          <Input
            label="Title"
            {...register("title", {
              required: "Title required",
            })}
          />
          {errors.title && (
            <p className="text-xs text-red-500">
              {errors.title.message}
            </p>
          )}

          <Input
            label="Source"
            {...register("source", {
              required: "Source required",
            })}
          />

          <textarea
            placeholder="Description"
            className="border p-2 w-full rounded-lg"
            {...register("description")}
          />

          <select
            className="border p-2 w-full rounded-lg"
            {...register("severity")}
          >
            <option value="low">Low</option>
            <option value="medium">
              Medium
            </option>
            <option value="high">High</option>
            <option value="critical">
              Critical
            </option>
          </select>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlertModal;