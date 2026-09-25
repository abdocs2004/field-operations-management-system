"use client";

import { useState } from "react";
import { Menu, LogOut, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SidebarContent } from "./Sidebar";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "مدير عام",
  ADMIN: "مشرف",
  FIELD_USER: "موظف ميداني",
};

export function Topbar({ title }: { title?: string }) {
  const { currentUser, role, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6 lg:mr-64">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="فتح القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && <h1 className="text-base font-semibold text-slate-800 sm:text-lg">{title}</h1>}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-slate-800">{currentUser?.name}</p>
            <p className="text-xs text-slate-400">{role && ROLE_LABELS[role]}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-sm font-semibold text-navy-700">
            {currentUser?.name?.charAt(0) ?? "?"}
          </div>
          <button
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-500"
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-64 bg-navy-900 shadow-xl">
            <button
              className="absolute left-3 top-4 rounded-lg p-1.5 text-slate-300 hover:bg-navy-800"
              onClick={() => setDrawerOpen(false)}
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
