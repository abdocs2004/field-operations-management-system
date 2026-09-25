"use client";

import { useEffect } from "react";
import { ServerCrash } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center font-sans">
          <ServerCrash className="h-16 w-16 text-red-400" />
          <h1 className="text-2xl font-bold text-slate-900">حدث خطأ غير متوقع في الخادم</h1>
          <p className="max-w-sm text-sm text-slate-500">نعتذر عن هذا الخلل، يرجى المحاولة مرة أخرى.</p>
          <button
            onClick={reset}
            className="mt-2 rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
