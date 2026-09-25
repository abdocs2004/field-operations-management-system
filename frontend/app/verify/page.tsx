"use client";

import { useState } from "react";
import { ShieldCheck, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Receipt } from "@/types";
import { VerifySuccess, VerifyNotFound } from "@/features/verification/VerifyResult";

export default function VerifyPage() {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: boolean; receipt?: Receipt } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptNumber.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await apiClient.get(`/verification/${encodeURIComponent(receiptNumber.trim())}`);
      setResult(res.data.data);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-navy-700">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">التحقق من السند</h1>
          <p className="text-sm text-slate-500">أدخل رقم السند الموجود على الإيصال الإلكتروني للتحقق من صحته</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 rounded-xl2 border border-slate-200 bg-white p-5 shadow-card sm:flex-row">
          <input
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            placeholder="RCP-2026-000001"
            className="ltr-nums h-12 flex-1 rounded-lg border border-slate-300 px-4 text-center text-[15px] focus:outline-none focus:ring-2 focus:ring-navy-200"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-navy-700 px-6 font-medium text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            تحقق
          </button>
        </form>

        {result && (result.found && result.receipt ? <VerifySuccess receipt={result.receipt} /> : <VerifyNotFound />)}

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-navy-700">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
