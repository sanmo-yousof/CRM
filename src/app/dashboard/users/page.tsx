"use client";

import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import PrivateRoute from "@/routes/PrivateRoute";
import api from "@/lib/axios";
import { formatDate } from "@/lib/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import CreateUserModal from "@/components/users/CreateUserModal";
import ViewUserModal from "@/components/users/ViewUserModal";
import EditUserModal from "@/components/users/EditUserModal";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "super_admin" | "org_admin" | "authority_user" | "observer";
  isActive: boolean;
  createdAt: string;
  organizationId?: number | null;
  organization?: { name: string };
};

const roleColors: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  org_admin: "bg-blue-100 text-blue-700",
  authority_user: "bg-amber-100 text-amber-700",
  observer: "bg-gray-100 text-gray-600",
};

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [openView, setOpenView] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState<any>(null);
  const [vewDel, setViewDel] = useState<any>(null);
  const [openChangePass, setChangeOpenPass] = useState<any>(null);
  const [loadingPass, setLoadingPass] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roleFilter, setRoleFilter] = useState<
    "all" | "super_admin" | "org_admin" | "authority_user" | "observer"
  >("all");

  const { role, user } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 8;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ password: string }>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/api/users");
      return res.data;
    },
  });

  const users: User[] = Array.isArray(data) ? data : [];
  const usersWithoutMe = users.filter((u) => u.role !== user?.role);

  const filteredUsers = usersWithoutMe.filter((u) => {
    const matchesSearch = [
      u.firstName,
      u.lastName,
      u.email,
      String(u.organizationId ?? ""),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / limit));

  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleDelete = async (id:number) => {
    try {
      setDeleteLoading(true);
      const res = await api.delete(`/api/users/${id}`);
      toast.success("User Deleted Successfully!");
      setViewDel(null);
      refetch();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

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
    <PrivateRoute allowedRoles={["super_admin", "org_admin"]}>
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500">Manage platform users & roles</p>
        </div>

        {/* SEARCH + CREATE */}
        <div className="md:flex justify-between items-center">
          <div className="flex w-full gap-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as any);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            >
              {role === "super_admin" ? (
                <>
                  <option value="all">All</option>
                  <option value="org_admin">Org Admin</option>
                  <option value="authority_user">Authority User</option>
                  <option value="observer">Observer</option>
                </>
              ) : (
                <>
                  <option value="all">All</option>            
                  <option value="authority_user">Authority User</option>
                  <option value="observer">Observer</option>
                </>
              )}
            </select>

            <div className="relative max-w-lg w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                className="pl-10"
                placeholder={
                  role === "super_admin"
                    ? "Search by name or email or org id"
                    : "Search by name or email "
                }
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <Button
            onClick={() => setOpenCreate(true)}
            className="mt-4 text-nowrap md:mt-0"
            variant="outline"
          >
            <Plus size={16} /> Create User
          </Button>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1200px] bg-white rounded-xl border border-slate-200  overflow-hidden">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 border-b">
                <tr className="text-xs sm:text-sm lg:text-base">
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Org ID
                  </th>

                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Role
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Created
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-white border-b hover:bg-gray-50 transition text-xs sm:text-sm lg:text-base"
                    >
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {user.id}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {user.organizationId ?? "N/A"}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${roleColors[user.role]}`}
                        >
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button onClick={() => setOpenView(user)}>
                            View
                          </Button>
                          <Button
                            onClick={() => setOpenEdit(user)}
                            variant="outline"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => setChangeOpenPass(user)}
                            className="bg-blue-700 hover:bg-blue-600"
                          >
                            Change Password
                          </Button>
                          <Button
                            onClick={() => setViewDel(user)}
                            className="bg-red-600 hover:bg-red-500"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!isLoading && paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            {pageNumbers.map((num) => (
              <Button
                key={num}
                onClick={() => setPage(num)}
                variant={num === page ? "default" : "outline"}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {openChangePass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setChangeOpenPass(null)}
            />

            <div className="relative w-full max-w-lg bg-white overflow-hidden rounded-2xl shadow-2xl">
              <h2 className="text-center bg-gray-200 py-6 font-semibold text-xl">
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

        {vewDel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setViewDel(null)}
            />

            <div className="relative w-full max-w-lg bg-white overflow-hidden rounded-2xl shadow-2xl">
              <h2 className="text-center bg-gray-200 py-6 font-semibold text-xl">
                Delete User
              </h2>

              <div className="p-6 pt-8">
                <p className="text-sm text-gray-600 text-center">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{vewDel.email}</span>?
                </p>

                <div className="flex gap-2 mt-12 justify-end">
                  <Button
                    onClick={() => setViewDel(null)}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={() => handleDelete(vewDel.id)}
                    loading={deleteLoading}
                    className="bg-red-500 hover:bg-red-500/80"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {openCreate && (
          <CreateUserModal
            currentUserRole={role as "super_admin" | "org_admin"}
            onClose={() => setOpenCreate(false)}
            onSuccess={refetch}
          />
        )}
        {openView && (
          <ViewUserModal user={openView} onClose={() => setOpenView(null)} />
        )}
        {openEdit && (
          <EditUserModal
            user={openEdit}
            currentUserRole={role as "super_admin" | "org_admin"}
            onClose={() => setOpenEdit(null)}
            onSuccess={refetch}
          />
        )}
      </div>
    </PrivateRoute>
  );
};

export default UsersPage;
