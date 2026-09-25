import { LucideIcon } from "lucide-react";
import { Card, Skeleton } from "@/components/ui/Card";

export function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  accent = "navy",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  loading?: boolean;
  accent?: "navy" | "green" | "amber" | "slate";
}) {
  const accentClasses: Record<string, string> = {
    navy: "bg-navy-50 text-navy-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl2 ${accentClasses[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        {loading ? (
          <Skeleton className="mt-1.5 h-6 w-24" />
        ) : (
          <p className="ltr-nums truncate text-xl font-bold text-slate-900">{value}</p>
        )}
      </div>
    </Card>
  );
}
