"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Users,
  LogOutIcon,
  Building2,
  ShieldCheck,
  BellRing,
  CalendarDays,
  History,
  LayoutDashboard,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { Button } from "@/components/custom-ui/Button";
import Link from "next/link";
import PrivateRoute from "@/routes/PrivateRoute";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const routes = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "org_admin", "authority_user", "observer"],
  },
  {
    name: "Organizations",
    href: "/dashboard/organizations",
    icon: Building2,
    roles: ["super_admin"],
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["super_admin", "org_admin"],
  },
  {
    name: "Executives",
    href: "/dashboard/executives",
    icon: ShieldCheck,
    roles: ["super_admin", "org_admin"],
  },
  {
    name: "Events",
    href: "/dashboard/events",
    icon: CalendarDays,
    roles: ["super_admin", "org_admin", "authority_user", "observer"],
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: BellRing,
    roles: ["super_admin", "org_admin", "authority_user", "observer"],
  },
  {
    name: "Audit Logs",
    href: "/dashboard/audit-logs",
    icon: History,
    roles: ["super_admin", "org_admin"],
  },
];

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuth();
  const router = useRouter();

  const currentRoute =
    routes.find((r) =>
      r.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(r.href),
    )?.name ?? "Dashboard";

  const handleLogout = () => {
    console.log("click log out");
    logout();
    router.push("/login");
  };

  return (
    <PrivateRoute
      allowedRoles={["super_admin", "org_admin", "authority_user", "observer"]}
    >
      <div className="flex h-dvh bg-background">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
    fixed inset-y-0 left-0 z-50
    bg-primary text-primary-foreground
    border-r transition-all duration-300
  lg:static lg:z-0
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    ${collapsed ? "w-18" : "w-64"}
  `}
        >
          {/* Sidebar header */}
          <div
            className={`
    flex items-center h-16 px-3 border-b border-white/20
    ${collapsed ? "lg:justify-center" : "lg:justify-start"}
    justify-between
  `}
          >
            {/* Left side: Logo + Text */}
            <div className="flex items-center gap-2">
              {/* Logo */}
              <h2 className="text-l bg-blue-500 rounded-md flex items-center justify-center h-8 w-8">
                L
              </h2>

              {/* Logo text (hidden when collapsed on desktop only) */}
              {!collapsed && (
                <span className="text-lg font-bold whitespace-nowrap">
                  MyApp
                </span>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex flex-col justify-between h-[calc(100dvh-4rem)] px-3 py-4">
            {/* Routes */}
            <nav className="space-y-1">
              {routes
                .filter((route) => role && route.roles.includes(role))
                .map((route) => {
                  const Icon = route.icon;
                  const active =
                    route.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(route.href);

                  return (
                    <Link
                      key={route.name}
                      href={route.href}
                      className={`
              flex items-center gap-2 px-3 py-3 text-gray-400 rounded text-sm font-medium
              transition-colors
              ${active ? "bg-white text-primary" : "hover:bg-white/10 hover:text-white"}
              ${collapsed && "justify-center"}
            `}
                    >
                      <Icon size={18} />
                      {!collapsed && <span>{route.name}</span>}
                    </Link>
                  );
                })}
            </nav>

            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="
        w-full border-white/40 text-base text-gray-300
        hover:bg-white hover:text-primary
      "
            >
              <LogOutIcon size={20} className="mr-2" />
              {!collapsed && "Log out"}
            </Button>
          </div>
        </aside>

        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-16 border-b bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded hover:bg-muted"
              >
                <Menu size={20} />
              </button>

              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex cursor-pointer p-2 rounded hover:bg-gray-200 text-primary "
              >
                {collapsed ? (
                  <PanelLeftOpen size={22} />
                ) : (
                  <PanelLeftClose size={22} />
                )}
              </button>

              <h1 className="text-lg font-semibold">{currentRoute}</h1>
            </div>

            {/* Right actions */}

            <div className="flex items-center gap-2">
              <div>
                <h3 className="font-medium text-base">
                  {user?.firstName} {user?.lastName}
                </h3>
                <h3 className="font-medium text-sm text-gray-600">{role}</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {user?.firstName[0]}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-4 md:p-8 min-w-0">
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default DashboardLayout;
