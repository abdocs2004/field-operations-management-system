"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, LogOut, ClipboardPlus, ListChecks } from "lucide-react";
import { RouteGuard } from "@/components/layout/RouteGuard";
import { useAuth } from "@/lib/auth-context";

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <FieldShell>{children}</FieldShell>
    </RouteGuard>
  );
}

function FieldShell({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-700">
              <ShieldCheck className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">الإدخال الميداني</p>
              <p className="text-xs text-slate-400">{currentUser?.name}</p>
            </div>
          </div>
          <button onClick={logout} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500" aria-label="تسجيل الخروج">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex border-t border-slate-100">
          <Link
            href="/field/new-operation"
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium ${
              pathname === "/field/new-operation" ? "border-b-2 border-navy-700 text-navy-700" : "text-slate-500"
            }`}
          >
            <ClipboardPlus className="h-4 w-4" />
            عملية جديدة
          </Link>
          <Link
            href="/field/operations"
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium ${
              pathname?.startsWith("/field/operations") ? "border-b-2 border-navy-700 text-navy-700" : "text-slate-500"
            }`}
          >
            <ListChecks className="h-4 w-4" />
            عملياتي
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
    </div>
  );
}
