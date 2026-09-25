"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Megaphone, Power } from "lucide-react";
import { Card, EmptyState, Skeleton, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/lib/toast-context";
import { Announcement } from "@/types";
import { formatDateTimeAr } from "@/lib/format";

export default function AnnouncementsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    apiClient
      .get("/announcements")
      .then((res) => setItems(res.data.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setContent("");
    setModalOpen(true);
  };
  const openEdit = (a: Announcement) => {
    setEditing(a);
    setTitle(a.title);
    setContent(a.content);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiClient.put(`/announcements/${editing.id}`, { title, content });
        showToast("success", "تم تحديث الإعلان بنجاح");
      } else {
        await apiClient.post("/announcements", { title, content });
        showToast("success", "تم إنشاء الإعلان بنجاح");
      }
      setModalOpen(false);
      load();
    } catch {
      showToast("error", "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (a: Announcement) => {
    try {
      await apiClient.put(`/announcements/${a.id}`, { isActive: !a.isActive });
      load();
    } catch {
      showToast("error", "حدث خطأ");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/announcements/${deleteTarget.id}`);
      showToast("success", "تم حذف الإعلان بنجاح");
      load();
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">الإعلانات</h2>
          <p className="text-sm text-slate-500">إدارة شريط الإعلانات الظاهر في الصفحة الرئيسية</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          إضافة إعلان
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={Megaphone} title="لا توجد إعلانات" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800">{a.title}</p>
                    <Badge className={a.isActive ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 bg-slate-100 text-slate-500"}>
                      {a.isActive ? "مفعّل" : "معطّل"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{a.content}</p>
                  <p className="mt-1 text-xs text-slate-300">{formatDateTimeAr(a.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => toggleActive(a)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" title="تفعيل / تعطيل">
                    <Power className="h-4 w-4" />
                  </button>
                  <button onClick={() => openEdit(a)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" title="تعديل">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(a)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" title="حذف">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "تعديل الإعلان" : "إضافة إعلان"}>
        <div className="flex flex-col gap-4">
          <Input label="العنوان" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea label="المحتوى" value={content} onChange={(e) => setContent(e.target.value)} required />
          <Button onClick={handleSave} loading={saving} className="mt-2 w-full">
            حفظ
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="هل أنت متأكد من حذف هذا الإعلان؟"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
