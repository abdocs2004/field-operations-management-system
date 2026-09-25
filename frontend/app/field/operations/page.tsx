"use client";

import Link from "next/link";
import { ClipboardList, Eye } from "lucide-react";
import { Card, Skeleton, EmptyState } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useOperations } from "@/hooks/useOperations";
import { formatCurrency, formatDateTimeAr, formatQuantity } from "@/lib/format";

export default function FieldOperationsPage() {
  const { items, pagination, loading, filters, setFilters } = useOperations();

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-slate-900">عملياتي</h2>
      <p className="mb-5 text-sm text-slate-500">قائمة العمليات التي قمت بتسجيلها</p>

      <Card>
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={ClipboardList} title="لا توجد عمليات" description="لم تقم بتسجيل أي عمليات بعد" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((op) => (
              <li key={op.id}>
                <Link href={`/field/operations/${op.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50">
                  <div>
                    <p className="ltr-nums text-sm font-semibold text-navy-700">{op.receiptNumber}</p>
                    <p className="text-sm text-slate-700">{op.customerName}</p>
                    <p className="text-xs text-slate-400">
                      {op.service.name} — {formatQuantity(op.quantity, op.unit)} — {formatCurrency(op.amount)}
                    </p>
                    <p className="text-xs text-slate-300">{formatDateTimeAr(op.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={op.status} />
                    <Eye className="h-4 w-4 text-slate-300" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {pagination && (
          <Pagination pagination={pagination} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
        )}
      </Card>
    </div>
  );
}
