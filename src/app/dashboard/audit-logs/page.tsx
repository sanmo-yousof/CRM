import PrivateRoute from "@/routes/PrivateRoute";
import React from "react";

const page = () => {
  return (
    <PrivateRoute
      allowedRoles={["super_admin", "org_admin",]}
    >
      <div>this is audit logs page</div>
    </PrivateRoute>
  );
};

export default page;
