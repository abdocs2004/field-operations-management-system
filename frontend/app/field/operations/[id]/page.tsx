"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Receipt } from "@/types";
import { ReceiptView } from "@/features/operations/ReceiptView";

export default function FieldOperationDetailPage() {
  const params = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/operations/${params.id}/receipt`)
      .then((res) => setReceipt(res.data.data))
      .finally(() => setLoading(false));
  }, [params.id]);

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

  return <ReceiptView receipt={receipt} operationId={params.id} />;
}
