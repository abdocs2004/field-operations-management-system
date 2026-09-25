"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Receipt, OperationStatus } from "@/types";
import { ReceiptView } from "@/features/operations/ReceiptView";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/toast-context";
import { useAuth } from "@/lib/auth-context";

export default function OperationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { role } = useAuth();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OperationStatus>("COMPLETED");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    apiClient
      .get(`/operations/${params.id}/receipt`)
      .then((res) => {
        setReceipt(res.data.data);
        setStatus(res.data.data.status);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [params.id]);

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/operations/${params.id}`, { status });
      showToast("success", "تم تحديث حالة العملية بنجاح");
      load();
    } catch {
      showToast("error", "حدث خطأ أثناء تحديث العملية");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-navy-500" />
      </div>
    );
  }

  if (!receipt) {
    return <p className="py-16 text-center text-slate-400">تعذر العثور على العملية</p>;
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="no-print mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700"
      >
        <ArrowRight className="h-4 w-4" />
        رجوع
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReceiptView receipt={receipt} operationId={params.id} />
        </div>

        {(role === "SUPER_ADMIN" || role === "ADMIN") && (
          <Card className="no-print h-fit p-5">
            <h3 className="mb-4 font-semibold text-slate-800">تحديث حالة السند</h3>
            <Select label="الحالة" value={status} onChange={(e) => setStatus(e.target.value as OperationStatus)}>
              <option value="COMPLETED">مكتمل</option>
              <option value="PENDING">قيد الانتظار</option>
              <option value="CANCELLED">ملغى</option>
            </Select>
            <Button className="mt-4 w-full" onClick={handleStatusUpdate} loading={saving}>
              حفظ التغييرات
            </Button>
            <Link
              href={`/verify/${receipt.receiptNumber}`}
              target="_blank"
              className="mt-3 block text-center text-sm text-navy-600 hover:underline"
            >
              عرض صفحة التحقق العامة
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
