import PrivateRoute from "@/routes/PrivateRoute";
import React from "react";

const page = () => {
  return (
    <PrivateRoute
      allowedRoles={["super_admin", "org_admin", "authority_user", "observer"]}
    >
      <div>alerts page</div>
    </PrivateRoute>
  );
};

export default page;
