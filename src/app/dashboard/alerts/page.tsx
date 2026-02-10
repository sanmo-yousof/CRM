import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import PrivateRoute from "@/routes/PrivateRoute";
import { Plus, Search } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <PrivateRoute
      allowedRoles={["super_admin", "org_admin", "authority_user", "observer"]}
    >
      <div className="space-y-8">
        <div>
          <h1 className="md:text-2xl text-xl font-bold">Alert Center</h1>
          <p className="text-gray-500">
            Detected suspicious activity that may impact your environment.
          </p>
        </div>

        {/* SEARCH + CREATE */}
        <div className="md:flex justify-between items-center">
          <div className="flex w-full gap-2">
            <select
              // value={roleFilter}
              // onChange={(e) => {
              //   setRoleFilter(e.target.value as any);
              //   setPage(1);
              // }}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
            >
              <option value="all">All</option>
              <option value="org_admin">Org Admin</option>
              <option value="authority_user">Authority User</option>
              <option value="observer">Observer</option>

              <option value="all">All</option>
              <option value="authority_user">Authority User</option>
              <option value="observer">Observer</option>
            </select>

            <div className="relative max-w-lg w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                className="pl-10"
                // placeholder={
                //   role === "super_admin"
                //     ? "Search by name or email or org id"
                //     : "Search by name or email "
                // }
                // value={search}
                // onChange={(e) => {
                //   setSearch(e.target.value);
                //   setPage(1);
                // }}
              />
            </div>
          </div>
          <Button
            // onClick={() => setOpenCreate(true)}
            className="mt-4 text-nowrap md:mt-0"
            variant="outline"
          >
            <Plus size={16} /> Create Alert
          </Button>
        </div>
        <div className="w-full mt-6 overflow-x-auto">
          <div className="min-w-[1200px] bg-white rounded-xl border border-slate-200  overflow-hidden">
            <table className="w-full text-sm md:text-base text-left text-gray-700">
              <thead className="bg-gray-100 border-b">
                <tr className="text-sm md:text-base">
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Severity 
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Status 
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Title 
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Handled By
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Created
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Category 
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Source 
                  </th>
                  <th className="px-6 py-3 lg:py-4 whitespace-nowrap font-semibold">
                    Actions 
                  </th>
                </tr>
              </thead>

              {/* <tbody>
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
                </tbody> */}
            </table>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default page;
