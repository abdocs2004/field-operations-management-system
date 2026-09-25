import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <FileQuestion className="h-16 w-16 text-slate-300" />
      <h1 className="text-2xl font-bold text-slate-900">الصفحة غير موجودة</h1>
      <p className="max-w-sm text-sm text-slate-500">عذرًا، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.</p>
      <Link href="/" className="mt-2 rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}
