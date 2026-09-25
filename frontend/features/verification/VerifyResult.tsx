import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Receipt } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function VerifySuccess({ receipt }: { receipt: Receipt }) {
  if (receipt.status === "CANCELLED") {
    return (
      <div className="rounded-xl2 border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
        <h3 className="text-lg font-bold text-amber-800">هذا السند ملغى</h3>
        <p className="mt-1 text-sm text-amber-700">رقم السند: {receipt.receiptNumber}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl2 border border-green-200 bg-white shadow-card">
      <div className="flex flex-col items-center gap-2 border-b border-green-100 bg-green-50 p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
        <h3 className="text-lg font-bold text-green-800">سند موثق</h3>
      </div>
      <dl className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <Field label="رقم السند" value={receipt.receiptNumber} mono />
        <Field label="التاريخ" value={`${receipt.date} — ${receipt.time}`} />
        <Field label="العميل" value={receipt.customerName} />
        <Field label="الخدمة" value={receipt.serviceName} />
        <Field label="الكمية" value={`${receipt.quantity} ${receipt.unit}`} />
        <Field label="القيمة" value={receipt.amountFormatted} />
        <Field label="المستفيد" value={receipt.beneficiaryName} />
        <div>
          <dt className="text-xs font-medium text-slate-400">الحالة</dt>
          <dd className="mt-1">
            <StatusBadge status={receipt.status} />
          </dd>
        </div>
      </dl>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-400">{label}</dt>
      <dd className={`mt-1 font-medium text-slate-800 ${mono ? "ltr-nums" : ""}`}>{value}</dd>
    </div>
  );
}

export function VerifyNotFound() {
  return (
    <div className="rounded-xl2 border border-red-200 bg-red-50 p-6 text-center">
      <XCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
      <h3 className="text-lg font-bold text-red-800">لم يتم العثور على السند</h3>
      <p className="mt-1 text-sm text-red-600">يرجى التأكد من رقم السند والمحاولة مرة أخرى</p>
    </div>
  );
}
