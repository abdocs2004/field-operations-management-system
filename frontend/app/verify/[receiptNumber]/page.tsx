"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Receipt } from "@/types";
import { VerifySuccess, VerifyNotFound } from "@/features/verification/VerifyResult";

export default function VerifyByReceiptPage() {
  const params = useParams<{ receiptNumber: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ found: boolean; receipt?: Receipt } | null>(null);

  useEffect(() => {
    const receiptNumber = decodeURIComponent(params.receiptNumber);
    apiClient
      .get(`/verification/${encodeURIComponent(receiptNumber)}`)
      .then((res) => setResult(res.data.data))
      .catch(() => setResult({ found: false }))
      .finally(() => setLoading(false));
  }, [params.receiptNumber]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-navy-700">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">نتيجة التحقق من السند</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-navy-500" />
          </div>
        ) : result?.found && result.receipt ? (
          <VerifySuccess receipt={result.receipt} />
        ) : (
          <VerifyNotFound />
        )}

        <div className="mt-8 text-center">
          <Link href="/verify" className="text-sm text-slate-400 hover:text-navy-700">
            التحقق من سند آخر
          </Link>
        </div>
      </div>
    </div>
  );
}
