"use client";

import PrivateRoute from "@/routes/PrivateRoute";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/dateFormat";
import { Button } from "@/components/custom-ui/Button";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Input } from "@/components/custom-ui/Input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/axios";
// import ChangePasswordModal from "@/components/account/ChangePasswordModal";

const MyAccountPage = () => {
  const { user, role } = useAuth();
  const [openPass, setOpenPass] = useState(false);
  const [loadingPass, setLoadingPass] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openChangePass, setChangeOpenPass] = useState<any>(null);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<{ password: string }>();


    const handlePasswordChange = async (data: { password: string }) => {
    try {
      setLoadingPass(true);

      await api.patch(`/api/users/${openChangePass.id}/password`, {
        password: data.password,
      });

      toast.success("Password updated successfully");
      reset();
      setChangeOpenPass(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <PrivateRoute
      allowedRoles={["super_admin", "org_admin", "authority_user", "observer"]}
    >
      <div className="w-full max-w-5xl space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Account</h1>

          <Button onClick={() => setChangeOpenPass(user)}>Change Password</Button>
        </div>

        {/* PROFILE GRID */}
        <div className="bg-primary p-6 rounded-lg border border-white/20 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
            <ProfileItem label="User ID" value={user?.id} />
            <ProfileItem label="Email" value={user?.email} />
            <ProfileItem label="First Name" value={user?.firstName} />
            <ProfileItem label="Last Name" value={user?.lastName} />
            <ProfileItem label="Role" value={role} />
            <ProfileItem
              label="Organization ID"
              value={user?.organizationId ?? "N/A"}
            />
            <ProfileItem
              label="Active Status"
              value={user?.isActive ? "Active" : "Inactive"}
            />
            <ProfileItem
              label="Last Login"
              value={user?.lastLoginAt ? formatDate(user?.lastLoginAt) : "N/A"}
            />
            <ProfileItem
              label="Created At"
              value={user?.createdAt ? formatDate(user?.createdAt) : "N/A"}
            />
            <ProfileItem
              label="Updated At"
              value={user?.updatedAt ? formatDate(user?.updatedAt) : "N/A"}
            />
          </div>
        </div>
      </div>

      {openChangePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setChangeOpenPass(null)}
          />

          <div className="relative w-full max-w-lg bg-primary border border-white/20  overflow-hidden rounded-2xl shadow-2xl">
            <h2 className="text-center bg-[#141517] text-white   py-6 font-semibold text-xl">
              Change Password
            </h2>

            <form
              onSubmit={handleSubmit(handlePasswordChange)}
              className="p-6 pt-8 space-y-4"
            >
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
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
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}

              <div className="flex gap-2 mt-8 justify-end">
                <Button
                  type="button"
                  onClick={() => setChangeOpenPass(null)}
                  disabled={loadingPass}
                  variant="outline"
                >
                  Cancel
                </Button>

                <Button loading={loadingPass} type="submit">
                  {loadingPass ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
};

export default MyAccountPage;

const ProfileItem = ({ label, value }: { label: string; value?: any }) => {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-medium text-white break-words">{value ?? "N/A"}</p>
    </div>
  );
};
