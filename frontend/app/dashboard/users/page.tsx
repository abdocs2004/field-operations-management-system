"use client";

import { useEffect, useState } from "react";
import { Plus, KeyRound, Power, Users as UsersIcon } from "lucide-react";
import { Card, EmptyState, Skeleton, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/lib/toast-context";
import { User, Role } from "@/types";

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "مدير عام",
  ADMIN: "مشرف",
  FIELD_USER: "موظف ميداني",
};

export default function UsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<User | null>(null);

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "FIELD_USER" as Role });
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    apiClient
      .get("/users")
      .then((res) => setUsers(res.data.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await apiClient.post("/users", form);
      showToast("success", "تم إنشاء المستخدم بنجاح");
      setCreateOpen(false);
      setForm({ name: "", email: "", password: "", role: "FIELD_USER" });
      load();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message ?? "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user: User) => {
    try {
      await apiClient.put(`/users/${user.id}`, { isActive: !user.isActive });
      showToast("success", user.isActive ? "تم إيقاف الحساب" : "تم تفعيل الحساب");
      load();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message ?? "حدث خطأ");
    }
  };

  const changeRole = async (user: User, role: Role) => {
    try {
      await apiClient.put(`/users/${user.id}`, { role });
      showToast("success", "تم تحديث الصلاحية بنجاح");
      load();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message ?? "حدث خطأ");
    }
  };

  const handleResetPassword = async () => {
    if (!resetTarget) return;
    setSaving(true);
    try {
      await apiClient.post(`/users/${resetTarget.id}/reset-password`, { password: newPassword });
      showToast("success", "تم إعادة تعيين كلمة المرور بنجاح");
      setResetTarget(null);
      setNewPassword("");
    } catch (err: any) {
      showToast("error", err?.response?.data?.message ?? "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">المستخدمون</h2>
          <p className="text-sm text-slate-500">إدارة حسابات المستخدمين وصلاحياتهم</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          إضافة مستخدم
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState icon={UsersIcon} title="لا يوجد مستخدمون" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-right text-xs text-slate-400">
                  <th className="px-4 py-2.5 font-medium">الاسم</th>
                  <th className="px-4 py-2.5 font-medium">البريد الإلكتروني</th>
                  <th className="px-4 py-2.5 font-medium">الصلاحية</th>
                  <th className="px-4 py-2.5 font-medium">عدد العمليات</th>
                  <th className="px-4 py-2.5 font-medium">الحالة</th>
                  <th className="px-4 py-2.5 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                    <td className="ltr-nums px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.role === "SUPER_ADMIN" ? (
                        <Badge className="border-navy-200 bg-navy-50 text-navy-700">{ROLE_LABELS[u.role]}</Badge>
                      ) : (
                        <Select
                          value={u.role}
                          onChange={(e) => changeRole(u, e.target.value as Role)}
                          className="!h-9 w-40 text-sm"
                        >
                          <option value="ADMIN">مشرف</option>
                          <option value="FIELD_USER">موظف ميداني</option>
                        </Select>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u._count?.operations ?? 0}</td>
                    <td className="px-4 py-3">
                      <Badge className={u.isActive ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}>
                        {u.isActive ? "مفعّل" : "موقوف"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setResetTarget(u)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                          title="إعادة تعيين كلمة المرور"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        {u.role !== "SUPER_ADMIN" && (
                          <button
                            onClick={() => toggleActive(u)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                            title="تفعيل / إيقاف"
                          >
                            <Power className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="إضافة مستخدم جديد">
        <div className="flex flex-col gap-4">
          <Input label="الاسم" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
          <Select label="الصلاحية" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}>
            <option value="FIELD_USER">موظف ميداني</option>
            <option value="ADMIN">مشرف</option>
            <option value="SUPER_ADMIN">مدير عام</option>
          </Select>
          <Button onClick={handleCreate} loading={saving} className="mt-2 w-full">
            إنشاء المستخدم
          </Button>
        </div>
      </Modal>

      <Modal open={Boolean(resetTarget)} onClose={() => setResetTarget(null)} title="إعادة تعيين كلمة المرور">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">
            إعادة تعيين كلمة مرور المستخدم: <span className="font-medium text-slate-700">{resetTarget?.name}</span>
          </p>
          <Input label="كلمة المرور الجديدة" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <Button onClick={handleResetPassword} loading={saving} className="mt-2 w-full">
            حفظ كلمة المرور الجديدة
          </Button>
        </div>
      </Modal>
    </div>
  );
}
