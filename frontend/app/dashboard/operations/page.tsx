"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Printer, ShieldCheck, Trash2, ClipboardX, FileSpreadsheet, FileText } from "lucide-react";
import { Card, Skeleton, EmptyState } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { OperationFiltersBar } from "@/features/operations/OperationFilters";
import { useOperations } from "@/hooks/useOperations";
import { formatCurrency, formatDateTimeAr, formatQuantity } from "@/lib/format";
import { apiClient, API_BASE_URL } from "@/lib/api-client";
import { useToast } from "@/lib/toast-context";
import { useAuth } from "@/lib/auth-context";

export default function DashboardOperationsPage() {
  const { items, pagination, loading, filters, setFilters, refetch } = useOperations();
  const { showToast } = useToast();
  const { role } = useAuth();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const buildExportUrl = (type: "excel" | "pdf") => {
    const params = new URLSearchParams(
      Object.entries(filters).reduce((acc, [k, v]) => {
        if (v !== undefined && v !== "" && k !== "page" && k !== "limit") acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>)
    );
    return `${API_BASE_URL}/reports/export/${type}?${params.toString()}`;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/operations/${deleteTarget}`);
      showToast("success", "تم حذف العملية بنجاح");
      refetch();
    } catch {
      showToast("error", "حدث خطأ أثناء حذف العملية");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">العمليات</h2>
          <p className="text-sm text-slate-500">إدارة ومتابعة جميع العمليات المسجلة</p>
        </div>
        <div className="flex gap-2">
          <a href={buildExportUrl("excel")} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4" />
              تصدير Excel
            </Button>
          </a>
          <a href={buildExportUrl("pdf")} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4" />
              تصدير PDF
            </Button>
          </a>
        </div>
      </div>

      <Card>
        <OperationFiltersBar filters={filters} onApply={(f) => setFilters((prev) => ({ ...prev, ...f }))} />

        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={ClipboardX} title="لا توجد عمليات" description="لا توجد عمليات مطابقة للفلاتر الحالية" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-right text-xs text-slate-400">
                  <th className="px-4 py-2.5 font-medium">رقم السند</th>
                  <th className="px-4 py-2.5 font-medium">التاريخ</th>
                  <th className="px-4 py-2.5 font-medium">العميل</th>
                  <th className="px-4 py-2.5 font-medium">الخدمة</th>
                  <th className="px-4 py-2.5 font-medium">الكمية</th>
                  <th className="px-4 py-2.5 font-medium">القيمة</th>
                  <th className="px-4 py-2.5 font-medium">المستفيد</th>
                  <th className="px-4 py-2.5 font-medium">المستخدم</th>
                  <th className="px-4 py-2.5 font-medium">الحالة</th>
                  <th className="px-4 py-2.5 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50">
                    <td className="ltr-nums px-4 py-3 font-medium text-navy-700">{op.receiptNumber}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTimeAr(op.createdAt)}</td>
                    <td className="px-4 py-3">{op.customerName}</td>
                    <td className="px-4 py-3">{op.service.name}</td>
                    <td className="px-4 py-3">{formatQuantity(op.quantity, op.unit)}</td>
                    <td className="px-4 py-3">{formatCurrency(op.amount)}</td>
                    <td className="px-4 py-3">{op.beneficiaryName}</td>
                    <td className="px-4 py-3 text-slate-500">{op.createdBy.name}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={op.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/operations/${op.id}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-700"
                          title="عرض"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <a
                          href={`${API_BASE_URL}/operations/${op.id}/receipt/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-700"
                          title="طباعة"
                        >
                          <Printer className="h-4 w-4" />
                        </a>
                        <Link
                          href={`/verify/${op.receiptNumber}`}
                          target="_blank"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-700"
                          title="تحقق"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </Link>
                        {role === "SUPER_ADMIN" && (
                          <button
                            onClick={() => setDeleteTarget(op.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && (
          <Pagination pagination={pagination} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="هل أنت متأكد من حذف هذه العملية؟"
        description="لا يمكن التراجع عن هذا الإجراء."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
