"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/axios";

type Role = "super_admin" | "org_admin" | "authority_user" | "observer";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  organizationId?: number | null;
};

type AuthContextType = {
  logout: () => void;
  loading: boolean;
  user: User | null;
  role: Role | null;
  setUser: (user: User | null) => void;
  setRole: (role: Role | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
      setRole(res.data.role); // role comes from backend
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) fetchCurrentUser();
    else setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
