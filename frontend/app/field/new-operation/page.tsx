"use client";

import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OperationForm } from "@/features/operations/OperationForm";
import { ReceiptView } from "@/features/operations/ReceiptView";
import { Receipt } from "@/types";

export default function NewOperationPage() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  if (receipt) {
    return (
      <div>
        <div className="no-print mb-5 flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
          <h2 className="text-lg font-bold text-slate-900">تم إنشاء العملية بنجاح</h2>
          <p className="text-sm text-slate-500">يمكنك الآن طباعة السند أو مشاركته مع العميل</p>
        </div>
        <ReceiptView receipt={receipt} />
        <Button variant="outline" className="no-print mt-5 w-full" onClick={() => setReceipt(null)}>
          <Plus className="h-4 w-4" />
          تسجيل عملية جديدة
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-slate-900">تسجيل عملية جديدة</h2>
      <p className="mb-5 text-sm text-slate-500">أدخل بيانات العملية بدقة، سيتم إصدار السند تلقائيًا بعد الحفظ</p>
      <Card className="p-5">
        <OperationForm onCreated={setReceipt} />
      </Card>
    </div>
  );
}
