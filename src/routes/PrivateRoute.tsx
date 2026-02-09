"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
  
};

export default function PrivateRoute({ children, allowedRoles }: Props) {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem("accessToken");

    // ❌ Not logged in → go login
    if (!token) {
      router.replace("/login");
      return;
    }

    // ❌ Logged in but role not allowed
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.replace("/dashboard");
      return;
    }
  }, [role, loading, router, allowedRoles]);

  // ⏳ Wait until auth check finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // 🚫 If role still missing after loading, don't render page
  if (!role) return null;

  return <>{children}</>;
}
