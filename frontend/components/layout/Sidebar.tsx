"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Users,
  Megaphone,
  FileBarChart,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN"] },
  {
    href: "/dashboard/operations",
    label: "العمليات",
    icon: ClipboardList,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  { href: "/dashboard/services", label: "الخدمات", icon: Wrench, roles: ["SUPER_ADMIN"] },
  { href: "/dashboard/users", label: "المستخدمون", icon: Users, roles: ["SUPER_ADMIN"] },
  {
    href: "/dashboard/announcements",
    label: "الإعلانات",
    icon: Megaphone,
    roles: ["SUPER_ADMIN"],
  },
  {
    href: "/dashboard/reports",
    label: "التقارير",
    icon: FileBarChart,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN"] },
];

export function SidebarContent() {
  const pathname = usePathname();
  const { role } = useAuth();
  const items = NAV_ITEMS.filter((item) => !role || item.roles.includes(role));

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-800/60 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-500">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">منصة العمليات</p>
          <p className="text-xs text-slate-400">لوحة الإدارة</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-navy-700 text-white" : "text-slate-300 hover:bg-navy-800/70 hover:text-white"
              }`}
            >
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 right-0 hidden w-64 bg-navy-900 lg:block">
      <SidebarContent />
    </aside>
  );
}
