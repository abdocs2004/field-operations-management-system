"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, Scale, ClipboardList, CalendarClock, ArrowLeft } from "lucide-react";
import { StatCard } from "@/features/dashboard/StatCard";
import { useDashboardSummary, useDashboardTrends } from "@/hooks/useDashboard";
import { useOperations } from "@/hooks/useOperations";
import { formatCurrency, formatQuantity, formatDateTimeAr } from "@/lib/format";
import {
  OperationsTrendChart,
  RevenueTrendChart,
  ServiceDistributionChart,
  StatusDistributionChart,
} from "@/components/charts/ChartCards";
import { Card, Skeleton, EmptyState } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ClipboardX } from "lucide-react";

const PERIODS = [
  { key: "daily", label: "يومي" },
  { key: "weekly", label: "أسبوعي" },
  { key: "monthly", label: "شهري" },
] as const;

export default function DashboardPage() {
  const { summary, loading: summaryLoading } = useDashboardSummary();
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const trends = useDashboardTrends(period);
  const { items: recentOps, loading: opsLoading } = useOperations({ limit: 8 });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="إجمالي قيمة العمليات"
          value={summary ? formatCurrency(summary.totalAmount) : "—"}
          loading={summaryLoading}
          accent="navy"
        />
        <StatCard
          icon={Scale}
          label="إجمالي الكميات"
          value={summary ? formatQuantity(summary.totalQuantity) : "—"}
          loading={summaryLoading}
          accent="green"
        />
        <StatCard
          icon={ClipboardList}
          label="عدد العمليات"
          value={summary ? String(summary.totalOperations) : "—"}
          loading={summaryLoading}
          accent="amber"
        />
        <StatCard
          icon={CalendarClock}
          label="عمليات اليوم"
          value={summary ? String(summary.todayOperations) : "—"}
          loading={summaryLoading}
          accent="slate"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p.key ? "bg-navy-700 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <OperationsTrendChart data={trends.operationsTrend} />
        <RevenueTrendChart data={trends.revenueTrend} />
        <ServiceDistributionChart data={trends.serviceDistribution} />
        <StatusDistributionChart data={trends.statusDistribution} />
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h3 className="font-semibold text-slate-800">أحدث العمليات</h3>
          <Link href="/dashboard/operations" className="flex items-center gap-1 text-sm text-navy-600 hover:underline">
            عرض الكل
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
        {opsLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : recentOps.length === 0 ? (
          <EmptyState icon={ClipboardX} title="لا توجد عمليات" description="لم يتم تسجيل أي عمليات حتى الآن" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-right text-xs text-slate-400">
                  <th className="px-4 py-2.5 font-medium">رقم السند</th>
                  <th className="px-4 py-2.5 font-medium">العميل</th>
                  <th className="px-4 py-2.5 font-medium">الخدمة</th>
                  <th className="px-4 py-2.5 font-medium">القيمة</th>
                  <th className="px-4 py-2.5 font-medium">الحالة</th>
                  <th className="px-4 py-2.5 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOps.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50">
                    <td className="ltr-nums px-4 py-3 font-medium text-navy-700">
                      <Link href={`/dashboard/operations/${op.id}`}>{op.receiptNumber}</Link>
                    </td>
                    <td className="px-4 py-3">{op.customerName}</td>
                    <td className="px-4 py-3">{op.service.name}</td>
                    <td className="px-4 py-3">{formatCurrency(op.amount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={op.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-400">{formatDateTimeAr(op.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
