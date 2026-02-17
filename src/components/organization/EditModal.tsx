"use client";

import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Org = {
  id: string;
  name: string;
  domain: string;
  status?: "active";
  metadata?: Record<string, string>;
};

type Props = {
  org: Org | null;
  onClose: () => void;
  onSuccess: () => void;
};

type FormValues = {
  name: string;
  domain: string;
  status?: "active";
  metadata: { key: string; value: string }[];
};

const EditOrganizationModal = ({ org, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      metadata: [{ key: "", value: "" }],
    },
  });

  const metadataValues = watch("metadata");

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "metadata",
  });

  
  useEffect(() => {
    if (!org) return;

    const metaArray =
      org.metadata && Object.keys(org.metadata).length > 0
        ? Object.entries(org.metadata).map(([key, value]) => ({
            key,
            value,
          }))
        : [{ key: "", value: "" }];

    reset({
      name: org.name,
      domain: org.domain,
      status: org.status,
      metadata: metaArray,
    });

    replace(metaArray);
  }, [org, reset, replace]);

  const metaKeyValidation = {
    pattern: {
      value: /^[a-z0-9_]+$/,
      message: "Lowercase only, no spaces.",
    },
    validate: (value: string) => {
      if (!value) return true;
      const keys = metadataValues.map((m) => m.key).filter(Boolean);
      if (keys.filter((k) => k === value).length > 1)
        return "Duplicate key not allowed";
      return true;
    },
  };

  const onSubmit = async (data: FormValues) => {
    const metaObject = data.metadata.reduce((acc, item) => {
      if (item.key && item.value) acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);

    const payload: any = {
      name: data.name,
      domain: data.domain,
    };

    if (data.status) payload.status = data.status;
    if (Object.keys(metaObject).length > 0) payload.metadata = metaObject;

    try {
      setLoading(true);
      await api.patch(`/api/organizations/${org?.id}`, payload);

      toast.success("Organization updated!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!org) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden border border-white/20 bg-primary rounded-2xl shadow-xl">
       <h2 className="text-center bg-[#141517] py-6 text-white font-semibold text-xl">
          Update Organization
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 p-6">

          <div>
            <Input
              label="Organization Name *"
              {...register("name", { required: "Required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              label="Domain *"
              {...register("domain", { required: "Required" })}
            />
            {errors.domain && (
              <p className="text-red-500 text-sm">{errors.domain.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-300 font-medium">Status</label>
            <select {...register("status")} className="w-full border text-white border-gray-400 rounded-lg px-3 py-2 mt-1">
              <option className="text-gray-400" value="">Select status</option>
              <option value="active" className="bg-zinc-900 text-white">
                      Active
                    </option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <h2 className="font-medium text-gray-300">Meta Data</h2>
              <Button type="button" variant="outline" onClick={() => append({ key: "", value: "" })}>
                + Add
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <Input {...register(`metadata.${index}.key`, metaKeyValidation)} placeholder="key" />
                <Input {...register(`metadata.${index}.value`)} placeholder="value" />
                <Button type="button" variant="outline" onClick={() => remove(index)}>X</Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" loading={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrganizationModal;
