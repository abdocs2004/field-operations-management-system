"use client";

import { Printer, Download, ShieldCheck } from "lucide-react";
import { Receipt } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL } from "@/lib/api-client";

export function ReceiptView({
  receipt,
  operationId,
  showActions = true,
}: {
  receipt: Receipt;
  operationId?: string;
  showActions?: boolean;
}) {
  const handlePrint = () => window.print();

  const pdfUrl = operationId ? `${API_BASE_URL}/operations/${operationId}/receipt/pdf` : undefined;

  return (
    <div>
      {showActions && (
        <div className="no-print mb-4 flex justify-end gap-2">
          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                تحميل PDF
              </Button>
            </a>
          )}
          <Button size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            طباعة السند
          </Button>
        </div>
      )}

      <div id="receipt-print-area" className="mx-auto max-w-md rounded-xl2 border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <div className="mb-5 flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl2 bg-navy-700">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs text-slate-400">منصّة توثيق العمليات الميدانية</p>
          <h2 className="text-xl font-bold text-slate-900">إيصال إلكتروني</h2>
        </div>

        <div className="mb-5 border-y border-dashed border-slate-200 py-4">
          <p className="text-center text-xs text-slate-400">رقم السند</p>
          <p className="ltr-nums text-center text-lg font-bold tracking-wide text-navy-700">{receipt.receiptNumber}</p>
        </div>

        <dl className="flex flex-col gap-3 text-sm">
          <Row label="التاريخ" value={receipt.date} />
          <Row label="الوقت" value={receipt.time} mono />
          <Row label="اسم العميل / المورد" value={receipt.customerName} />
          <Row label="نوع الخدمة" value={receipt.serviceName} />
          <Row label="الكمية / الوزن" value={`${receipt.quantity} ${receipt.unit}`} />
          <Row label="القيمة المالية" value={receipt.amountFormatted} />
          <Row label="اسم المستفيد" value={receipt.beneficiaryName} />
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">حالة السند</dt>
            <dd>
              <StatusBadge status={receipt.status} />
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-dashed border-slate-200 pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={receipt.qrCodeDataUrl} alt="QR Code" className="h-32 w-32" />
          <p className="text-xs text-slate-400">امسح رمز QR للتحقق من صحة السند</p>
          <p className="ltr-nums text-[10px] text-slate-300">{receipt.verificationUrl}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="shrink-0 text-slate-400">{label}</dt>
      <dd className={`font-medium text-slate-800 ${mono ? "ltr-nums" : ""}`}>{value}</dd>
    </div>
  );
}
