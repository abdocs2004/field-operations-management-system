"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Wrench, Power } from "lucide-react";
import { Card, EmptyState, Skeleton } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/lib/toast-context";
import { Service } from "@/types";

export default function ServicesPage() {
  const { showToast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    apiClient
      .get("/services")
      .then((res) => setServices(res.data.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setModalOpen(true);
  };
  const openEdit = (service: Service) => {
    setEditing(service);
    setName(service.name);
    setDescription(service.description ?? "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiClient.put(`/services/${editing.id}`, { name, description });
        showToast("success", "تم تحديث الخدمة بنجاح");
      } else {
        await apiClient.post("/services", { name, description });
        showToast("success", "تم إضافة الخدمة بنجاح");
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message ?? "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await apiClient.put(`/services/${service.id}`, { isActive: !service.isActive });
      showToast("success", service.isActive ? "تم تعطيل الخدمة" : "تم تفعيل الخدمة");
      load();
    } catch {
      showToast("error", "حدث خطأ");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/services/${deleteTarget.id}`);
      showToast("success", "تم حذف الخدمة بنجاح");
      load();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message ?? "تعذر حذف الخدمة");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الخدمات</h2>
          <p className="text-sm text-slate-500">إدارة أنواع الخدمات المتاحة في نموذج الإدخال الميداني</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          إضافة خدمة
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState icon={Wrench} title="لا توجد خدمات مضافة بعد" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {services.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-slate-800">{s.name}</p>
                  {s.description && <p className="text-sm text-slate-400">{s.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={s.isActive ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 bg-slate-100 text-slate-500"}>
                    {s.isActive ? "مفعّلة" : "معطّلة"}
                  </Badge>
                  <button onClick={() => toggleActive(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" title="تفعيل / تعطيل">
                    <Power className="h-4 w-4" />
                  </button>
                  <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" title="تعديل">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" title="حذف">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "تعديل الخدمة" : "إضافة خدمة"}>
        <div className="flex flex-col gap-4">
          <Input label="اسم الخدمة" value={name} onChange={(e) => setName(e.target.value)} required />
          <Textarea label="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button onClick={handleSave} loading={saving} className="mt-2 w-full">
            حفظ
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="هل أنت متأكد من حذف هذه الخدمة؟"
        description="إذا كانت الخدمة مرتبطة بعمليات مسجلة، يمكنك تعطيلها بدلاً من الحذف."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
