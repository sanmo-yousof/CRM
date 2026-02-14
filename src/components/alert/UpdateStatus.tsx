"use client";

import React, { useState } from "react";
import { Button } from "@/components/custom-ui/Button";
import api from "@/lib/axios";
import toast from "react-hot-toast";

type Props = {
  alert: any;
  onClose: () => void;
  onSuccess: () => void;
};

const UpdateStatus = ({
  alert,
  onClose,
  onSuccess,
}: Props) => {
  const [status, setStatus] = useState(alert.status);
  const [loading, setLoading] = useState(false);

  const isChanged = status !== alert.status;

  const submit = async () => {
    try {
      setLoading(true);

      await api.patch(`/api/alerts/${alert.id}`, {
        status,
      });

      toast.success("Status Updated");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-white overflow-hidden rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="bg-gray-200 py-5 text-center font-semibold text-lg">
          Update Alert Status
        </h2>

        <div className="p-6 space-y-4">

          {/* ONLY STATUS */}
          <select
            className="border p-2 w-full rounded-lg"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="new">New</option>
            <option value="acknowledged">
              Acknowledged
            </option>
            <option value="investigating">
              Investigating
            </option>
            <option value="resolved">
              Resolved
            </option>
            <option value="dismissed">
              Dismissed
            </option>
          </select>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>

            {/* ENABLE ONLY IF CHANGED */}
            <Button
              onClick={submit}
              disabled={!isChanged}
              loading={loading}
            >
              {loading
                ? "Updating..."
                : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;