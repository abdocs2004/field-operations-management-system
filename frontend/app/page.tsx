import Link from "next/link";
import { ShieldCheck, QrCode, FileCheck2, ClipboardCheck, ArrowLeft } from "lucide-react";
import { AnnouncementBar } from "@/features/announcements/AnnouncementBar";

const STEPS = [
  { icon: ClipboardCheck, title: "تسجيل العملية", desc: "يقوم الموظف الميداني بتسجيل بيانات العملية عبر الجوال أو الجهاز اللوحي." },
  { icon: FileCheck2, title: "إصدار السند", desc: "يُصدر النظام سندًا إلكترونيًا فريدًا موثقًا بقاعدة البيانات." },
  { icon: QrCode, title: "إنشاء رمز QR", desc: "يتم إرفاق رمز QR بالسند لإتاحة التحقق السريع من صحته." },
  { icon: ShieldCheck, title: "التحقق من السند", desc: "يمكن لأي شخص التحقق من صحة السند عبر مسح الرمز أو إدخال رقمه." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-700">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">منصة توثيق العمليات</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/verify"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            التحقق من سند
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
          >
            تسجيل الدخول
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="text-3xl font-extrabold leading-snug text-slate-900 sm:text-4xl md:text-5xl">
          منصة موثوقة لإدارة وتوثيق العمليات الميدانية
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 sm:text-lg">
          تسجيل العمليات الميدانية، إصدار سندات إلكترونية موثقة برمز QR، ومتابعة الأداء عبر لوحة تحكم تفاعلية —
          كل ذلك في نظام واحد آمن وسريع.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/verify"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-700 px-6 py-3.5 text-sm font-semibold text-white hover:bg-navy-800 sm:w-auto"
          >
            التحقق من سند
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="w-full rounded-lg border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            تسجيل الدخول
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">كيف تعمل المنصة؟</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="rounded-xl2 border border-slate-200 bg-white p-6 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mb-1 text-xs font-semibold text-navy-500">الخطوة {i + 1}</p>
                <h3 className="mb-2 font-semibold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-400 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} منصة توثيق العمليات الميدانية. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="/verify" className="hover:text-navy-700">التحقق من سند</Link>
            <Link href="/login" className="hover:text-navy-700">تسجيل الدخول</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
