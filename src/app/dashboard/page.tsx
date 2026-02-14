"use client";

import AuthorityDashboard from "@/components/dashboard/authorityUser/AuthorityUser";
import ObserverDashboard from "@/components/dashboard/observerUser/ObserverDashboard";
import OrgAdminDashboard from "@/components/dashboard/orgAdmin/OrgAdminDashboard";
import SuperAdminDashboard from "@/components/dashboard/SuperAdmin/SuperAdminDashboard";

import { useAuth } from "@/hooks/useAuth";
import React from "react";

const DashboardPage = () => {
  const { role, loading } = useAuth();

  if (loading) return <p className="text-center">Loading...</p>;
  if (!role) return null;

  if (role === "super_admin") return <SuperAdminDashboard />;
  if (role === "org_admin") return <OrgAdminDashboard />;
  if (role === "authority_user") return <AuthorityDashboard />;
  if (role === "observer") return <ObserverDashboard />;

  return null;
};

export default DashboardPage;