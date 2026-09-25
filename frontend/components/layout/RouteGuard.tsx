"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/types";
import { Loader2 } from "lucide-react";

export function RouteGuard({
  allowedRoles,
  children,
}: {
  allowedRoles?: Role[];
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.replace("/403");
    }
  }, [loading, isAuthenticated, role, allowedRoles, router]);

  if (loading || !isAuthenticated || (allowedRoles && role && !allowedRoles.includes(role))) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-navy-500" />
      </div>
    );
  }

  return <>{children}</>;
}
