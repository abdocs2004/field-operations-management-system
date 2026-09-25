"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2 } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useActiveServices } from "@/hooks/useServices";
import { apiClient, NormalizedApiError, normalizeError } from "@/lib/api-client";
import { useToast } from "@/lib/toast-context";
import { Receipt } from "@/types";

const schema = z.object({
  customerName: z.string().min(2, "اسم العميل قصير جدًا"),
  serviceId: z.string().uuid("يرجى اختيار نوع الخدمة"),
  quantity: z.coerce.number({ invalid_type_error: "الكمية مطلوبة" }).positive("يجب أن تكون الكمية أكبر من صفر"),
  unit: z.string().min(1).default("كجم"),
  amount: z.coerce.number({ invalid_type_error: "القيمة مطلوبة" }).positive("يجب أن تكون القيمة أكبر من صفر"),
  beneficiaryName: z.string().min(2, "اسم المستفيد قصير جدًا"),
});
type FormValues = z.infer<typeof schema>;

export function OperationForm({ onCreated }: { onCreated: (receipt: Receipt) => void }) {
  const { services, loading: servicesLoading } = useActiveServices();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { unit: "كجم" },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await apiClient.post("/operations", values);
      showToast("success", "تم إنشاء العملية بنجاح");
      onCreated(res.data.data.receipt);
      reset({ customerName: "", serviceId: "", quantity: undefined, unit: "كجم", amount: undefined, beneficiaryName: "" } as any);
    } catch (err) {
      const normalized: NormalizedApiError = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="اسم المورد / العميل"
        placeholder="مثال: أحمد محمد"
        error={errors.customerName?.message}
        required
        {...register("customerName")}
      />

      <Select
        label="نوع الخدمة"
        error={errors.serviceId?.message}
        required
        disabled={servicesLoading}
        defaultValue=""
        {...register("serviceId")}
      >
        <option value="" disabled>
          {servicesLoading ? "جاري تحميل الخدمات..." : "اختر نوع الخدمة"}
        </option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="الكمية / الوزن"
          type="number"
          step="0.01"
          inputMode="decimal"
          placeholder="0.00"
          error={errors.quantity?.message}
          required
          {...register("quantity")}
        />
        <Input label="الوحدة" placeholder="كجم" defaultValue="كجم" {...register("unit")} />
      </div>

      <Input
        label="القيمة المالية (ريال سعودي)"
        type="number"
        step="0.01"
        inputMode="decimal"
        placeholder="0.00"
        error={errors.amount?.message}
        required
        {...register("amount")}
      />

      <Input
        label="اسم المستفيد"
        placeholder="مثال: شركة الوفاء"
        error={errors.beneficiaryName?.message}
        required
        {...register("beneficiaryName")}
      />

      <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full">
        {!submitting && <Save className="h-5 w-5" />}
        حفظ العملية
      </Button>
    </form>
  );
}
