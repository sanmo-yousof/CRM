"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

type Props = {
  currentUserRole: "super_admin" | "org_admin" ;
  onClose: () => void;
  onSuccess: () => void;
};

type FormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: string;
  organizationId?: number;
};

const CreateExecutive = ({ currentUserRole, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { isActive: "true" },
  });



  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      let url = "/api/executives";

      if (currentUserRole === "super_admin" && data.organizationId) {
        url += `?organizationId=${Number(data.organizationId)}`;
      }
      

      const { organizationId, isActive, ...rest } = data;
      const payload = {
        ...rest,
        isActive:isActive === 'true'
      }

      await api.post(url, payload);

      toast.success("Executive created successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-[700px] bg-white rounded-2xl shadow-xl overflow-hidden">
        <h2 className="text-xl font-semibold py-6 bg-gray-200 text-center ">
          Create a Executive
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-8 p-6">
          <div className="md:grid grid-cols-2 gap-4 space-y-4 md:space-y-0">
            <div>
              <Input
                label="First Name"
                placeholder="Enter your first name"
                {...register("firstName", { required: "First name required" })}
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
                placeholder="Enter your last name"
                {...register("lastName", { required: "Last name required" })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {currentUserRole === "super_admin" && (
              <div>
                <Input
                  type="number"
                  label="Organization Id"
                  placeholder="Enter org id"
                  {...register("organizationId", {
                    required: "Organization id required",
                  })}
                />
                {errors.organizationId && (
                  <p className="text-red-500 text-xs">
                    {errors.organizationId.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                      message:
                        "Min 8 chars, uppercase, lowercase, number & special char",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExecutive;
