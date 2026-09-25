import { z } from "zod";
import { OperationStatus } from "@prisma/client";

export const createOperationSchema = z.object({
  customerName: z.string({ required_error: "اسم المورد/العميل مطلوب" }).trim().min(2, "اسم العميل قصير جدًا"),
  serviceId: z.string({ required_error: "نوع الخدمة مطلوب" }).uuid("نوع الخدمة غير صالح"),
  quantity: z.coerce.number({ required_error: "الكمية مطلوبة" }).positive("يجب أن تكون الكمية أكبر من صفر"),
  unit: z.string().trim().min(1).max(20).optional().default("كجم"),
  amount: z.coerce.number({ required_error: "القيمة المالية مطلوبة" }).positive("يجب أن تكون القيمة أكبر من صفر"),
  beneficiaryName: z.string({ required_error: "اسم المستفيد مطلوب" }).trim().min(2, "اسم المستفيد قصير جدًا"),
  status: z.nativeEnum(OperationStatus).optional().default("COMPLETED"),
});

export const updateOperationSchema = createOperationSchema.partial();

export const operationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  receiptNumber: z.string().trim().optional(),
  serviceId: z.string().uuid().optional(),
  status: z.nativeEnum(OperationStatus).optional(),
  createdById: z.string().uuid().optional(),
  customerName: z.string().trim().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type CreateOperationInput = z.infer<typeof createOperationSchema>;
export type OperationQuery = z.infer<typeof operationQuerySchema>;
