"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Search, Wallet, Scale, ClipboardList } from "lucide-react";
import { Card, EmptyState, Skeleton } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { StatCard } from "@/features/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiClient, API_BASE_URL } from "@/lib/api-client";
import { useActiveServices } from "@/hooks/useServices";
import { formatCurrency, formatDateTimeAr, formatQuantity } from "@/lib/format";
import { OperationListItem } from "@/types";
import { ClipboardX } from "lucide-react";

interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  serviceId: string;
  status: string;
}

export default function ReportsPage() {
  const { services } = useActiveServices();
  const [filters, setFilters] = useState<ReportFilters>({ dateFrom: "", dateTo: "", serviceId: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    totalOperations: number;
    totalAmountFormatted: string;
    totalQuantity: number;
    operations: OperationListItem[];
  } | null>(null);

  const runReport = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await apiClient.get("/reports/summary", { params });
      setResult(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const buildExportUrl = (type: "excel" | "pdf") => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][]);
    return `${API_BASE_URL}/reports/export/${type}?${params.toString()}`;
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">التقارير</h2>
        <p className="text-sm text-slate-500">إنشاء تقارير مخصصة حسب الفترة والفلاتر المطلوبة</p>
      </div>

      <Card className="mb-6 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          type="date"
          placeholder="من تاريخ"
          value={filters.dateFrom}
          onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
        />
        <Input
          type="date"
          placeholder="إلى تاريخ"
          value={filters.dateTo}
          onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
        />
        <Select value={filters.serviceId} onChange={(e) => setFilters((f) => ({ ...f, serviceId: e.target.value }))}>
          <option value="">كل الخدمات</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <Select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">كل الحالات</option>
          <option value="COMPLETED">مكتمل</option>
          <option value="PENDING">قيد الانتظار</option>
          <option value="CANCELLED">ملغى</option>
        </Select>
        <Button onClick={runReport} loading={loading}>
          <Search className="h-4 w-4" />
          إنشاء التقرير
        </Button>
      </Card>

      {result && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={ClipboardList} label="إجمالي العمليات" value={String(result.totalOperations)} accent="navy" />
            <StatCard icon={Wallet} label="إجمالي القيمة" value={result.totalAmountFormatted} accent="green" />
            <StatCard icon={Scale} label="إجمالي الكمية" value={formatQuantity(result.totalQuantity)} accent="amber" />
          </div>

          <div className="mb-4 flex justify-end gap-2">
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

          <Card>
            {result.operations.length === 0 ? (
              <EmptyState icon={ClipboardX} title="لا توجد عمليات مطابقة للفلاتر الحالية" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-right text-xs text-slate-400">
                      <th className="px-4 py-2.5 font-medium">رقم السند</th>
                      <th className="px-4 py-2.5 font-medium">التاريخ</th>
                      <th className="px-4 py-2.5 font-medium">العميل</th>
                      <th className="px-4 py-2.5 font-medium">الخدمة</th>
                      <th className="px-4 py-2.5 font-medium">القيمة</th>
                      <th className="px-4 py-2.5 font-medium">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.operations.map((op) => (
                      <tr key={op.id}>
                        <td className="ltr-nums px-4 py-3 font-medium text-navy-700">{op.receiptNumber}</td>
                        <td className="px-4 py-3 text-slate-500">{formatDateTimeAr(op.createdAt)}</td>
                        <td className="px-4 py-3">{op.customerName}</td>
                        <td className="px-4 py-3">{op.service.name}</td>
                        <td className="px-4 py-3">{formatCurrency(op.amount)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={op.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {!result && !loading && (
        <Card>
          <EmptyState icon={FileText} title="لم يتم إنشاء تقرير بعد" description="اختر الفلاتر ثم اضغط على إنشاء التقرير" />
        </Card>
      )}
      {loading && <Skeleton className="h-64 w-full" />}
    </div>
  );
}
