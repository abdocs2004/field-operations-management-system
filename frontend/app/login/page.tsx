import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-navy-700">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">تسجيل الدخول إلى المنصة</h1>
          <p className="text-sm text-slate-500">أدخل بيانات حسابك للوصول إلى لوحة التحكم أو واجهة الإدخال الميداني</p>
        </div>
        <div className="rounded-xl2 border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <LoginForm />
        </div>
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-navy-700"
        >
          العودة إلى الصفحة الرئيسية
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
