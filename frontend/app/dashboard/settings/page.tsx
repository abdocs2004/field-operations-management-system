"use client";

import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "مدير عام",
  ADMIN: "مشرف",
  FIELD_USER: "موظف ميداني",
};

export default function SettingsPage() {
  const { currentUser, role } = useAuth();

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">الإعدادات</h2>
        <p className="text-sm text-slate-500">بيانات الحساب الحالي</p>
      </div>

      <Card className="max-w-lg p-6">
        <dl className="flex flex-col gap-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">الاسم</dt>
            <dd className="font-medium text-slate-800">{currentUser?.name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">البريد الإلكتروني</dt>
            <dd className="ltr-nums font-medium text-slate-800">{currentUser?.email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">الصلاحية</dt>
            <dd className="font-medium text-slate-800">{role && ROLE_LABELS[role]}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-slate-400">
          لتغيير كلمة المرور، يرجى التواصل مع مدير النظام لإعادة تعيينها من صفحة إدارة المستخدمين.
        </p>
      </Card>
    </div>
  );
}
