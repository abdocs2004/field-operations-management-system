import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <ShieldAlert className="h-16 w-16 text-amber-400" />
      <h1 className="text-2xl font-bold text-slate-900">ليس لديك صلاحية للوصول إلى هذه الصفحة</h1>
      <p className="max-w-sm text-sm text-slate-500">هذه الصفحة مخصصة لمستخدمين بصلاحيات مختلفة عن حسابك الحالي.</p>
      <Link href="/" className="mt-2 rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}
