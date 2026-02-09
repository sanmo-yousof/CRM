"use client";

import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import EditOrganizationModal from "@/components/organization/EditModal";
import ViewOrganizationModal from "@/components/organization/ViewModal";
import api from "@/lib/axios";
import { formatDate } from "@/lib/dateFormat";
import PrivateRoute from "@/routes/PrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  domain: string;
  status?: "active";
  metadata: { key: string; value: string }[];
};

const Organization = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editOrg, setEditOrg] = useState<any>(null);
  const [viewOrg, setViewOrg] = useState<any>(null);
  const [vewDel, setViewDel] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 8;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const res = await api.get("/api/organizations");
      return res.data;
    },
  });

  const organizations = Array.isArray(data) ? data : [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      metadata: [{ key: "", value: "" }],
    },
  });

  const metadataValues = watch("metadata");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata",
  });

  const metaKeyValidation = (index: number) => ({
    pattern: {
      value: /^[a-z0-9_]+$/,
      message: "Lowercase only, no spaces. Use underscore.",
    },
    validate: (value: string) => {
      if (!value) return true; // optional field

      const keys = metadataValues.map((m) => m.key).filter(Boolean);
      const duplicates = keys.filter((k) => k === value);

      if (duplicates.length > 1) {
        return "Duplicate key not allowed";
      }
      return true;
    },
  });

  const onSubmit = async (data: FormValues) => {
    const metaObject = data.metadata.reduce(
      (acc, item) => {
        if (item.key && item.value) acc[item.key] = item.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const payload: any = {
      name: data.name,
      domain: data.domain,
    };

    if (data.status) payload.status = data.status;
    if (Object.keys(metaObject).length > 0) payload.metadata = metaObject;

    try {
      setLoading(true);

      await api.post("/api/organizations", payload);

      toast.success("Organization created successfully!");
      reset();
      refetch();
      setOpenCreateModal(false);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";

      // If duplicate name error → show under input
      if (err?.response?.status === 409) {
        setError("name", { type: "server", message });
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await api.delete(`/api/organizations/${id}`);
      console.log(res);
      toast.success("Deleted Successfully!");
      setViewDel(null);
      refetch();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter((org) =>
    [org.name, org.domain]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrganizations.length / limit),
  );

  const paginatedOrganizations = filteredOrganizations?.slice(
    (page - 1) * limit,
    page * limit,
  );

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PrivateRoute allowedRoles={["super_admin"]}>
      <div className="space-y-8">
        <div className="">
          <h1 className="md:text-2xl text-xl font-bold">
            Organization Management
          </h1>
          <p className="text-gray-500">
            Monitor and manage all system organizations .
          </p>
        </div>
        <div>
          <div className="md:flex justify-between items-center">
            <div className="relative h-full max-w-lg w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by org admin or name"
                className="pl-10"
              />
            </div>

            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => setOpenCreateModal(!openCreateModal)}
                variant="outline"
              >
                <Plus size={16} /> Create Organization
              </Button>
            </div>
          </div>
          <div className="w-full mt-6 overflow-x-auto">
            <div className="min-w-[1200px] bg-white rounded-xl border border-slate-200  overflow-hidden">
              <table className="w-full text-sm md:text-base text-left text-gray-700">
                <thead className="bg-gray-100 border-b">
                  <tr className="text-sm md:text-base">
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      ID
                    </th>
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Org Name
                    </th>
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Domain
                    </th>
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Created
                    </th>
                    <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                      Last Edited
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
                          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                        </div>
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    paginatedOrganizations.map((row) => (
                      <tr
                        key={row?.id}
                        className="bg-white border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                          {row?.id}
                        </td>
                        <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                          {row?.name}
                        </td>
                        <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                          {row?.domain}
                        </td>
                        <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                          <span
                            className={`py-1 px-2 text-sm rounded-full ${
                              row?.status === "active"
                                ? "text-green-600 bg-green-100"
                                : "bg-amber-100 text-amber-600"
                            } font-medium`}
                          >
                            {row?.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                          {formatDate(row?.createdAt)}
                        </td>
                        <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                          {formatDate(row?.updatedAt)}
                        </td>
                        <td className="px-4 py-3 md:py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button onClick={() => setViewOrg(row)}>
                              view
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditOrg(row)}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => setViewDel(row)}
                              className="bg-red-600 hover:bg-red-500"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!isLoading && paginatedOrganizations.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-10 text-gray-400"
                      >
                        No organizations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2 items-center">
              {/* Previous */}
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              {/* Page Numbers */}
              {pageNumbers.map((num) => (
                <Button
                  key={num}
                  onClick={() => setPage(num)}
                  variant={num === page ? "default" : "outline"}
                  className={`px-3 ${
                    num === page ? "bg-black text-white hover:bg-black/90" : ""
                  }`}
                >
                  {num}
                </Button>
              ))}

              {/* Next */}
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        {openCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-black/60 "
              onClick={() => setOpenCreateModal(!openCreateModal)}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg  bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
              {/* Header */}

              <h2 className="text-center py-6 bg-gray-200 font-semibold text-xl">
                Create a Organization{" "}
              </h2>

              {/* Body */}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 pt-8 p-6"
              >
                {/* ORG NAME */}
                <div>
                  <Input
                    label="Organization Name *"
                    placeholder="Enter org name"
                    {...register("name", {
                      required: "Organization name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* DOMAIN */}
                <div>
                  <Input
                    label="Domain *"
                    placeholder="example.com"
                    {...register("domain", {
                      required: "Domain is required",
                      pattern: {
                        value: /^[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: "Enter valid domain",
                      },
                    })}
                  />
                  {errors.domain && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.domain.message}
                    </p>
                  )}
                </div>

                {/* STATUS */}
                <div>
                  <label className="text-sm font-medium">
                    Status (Optional)
                  </label>
                  <select
                    {...register("status")}
                    defaultValue=""
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="" disabled hidden>
                      Select status
                    </option>
                    <option value="active">Active</option>
                  </select>
                </div>

                {/* METADATA */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base font-medium">
                      Meta Data (Optional)
                    </h2>
                    <Button
                      type="button"
                      variant="outline"
                      size="s"
                      onClick={() => append({ key: "", value: "" })}
                    >
                      + Add Meta Data
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 mb-2 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="key (lowercase, no spaces)"
                          {...register(
                            `metadata.${index}.key`,
                            metaKeyValidation(index),
                          )}
                        />
                        {errors.metadata?.[index]?.key && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.metadata[index]?.key?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1">
                        <Input
                          placeholder="value"
                          {...register(`metadata.${index}.value`)}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className=""
                        onClick={() => remove(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>

                {/* SUBMIT */}
                <div className="flex mt-8 justify-end">
                  <Button loading={loading} type="submit">
                    {" "}
                    {loading ? "Creating..." : "Create"}
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
                Delete Organization
              </h2>

              <div className="p-6 pt-8">
                <p className="text-sm text-gray-600 text-center">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{vewDel.name}</span>?
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

        {editOrg && (
          <EditOrganizationModal
            org={editOrg}
            onClose={() => setEditOrg(null)}
            onSuccess={refetch}
          />
        )}

        {viewOrg && (
          <ViewOrganizationModal
            org={viewOrg}
            onClose={() => setViewOrg(null)}
          />
        )}
      </div>
    </PrivateRoute>
  );
};

export default Organization;
