"use client";

import { RouteGuard } from "@/components/layout/RouteGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <Topbar />
        <main className="px-4 py-6 sm:px-6 lg:mr-64">{children}</main>
      </div>
    </RouteGuard>
  );
}
