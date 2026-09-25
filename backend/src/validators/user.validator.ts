import { z } from "zod";
import { Role } from "@prisma/client";

export const createUserSchema = z.object({
  name: z.string({ required_error: "الاسم مطلوب" }).trim().min(2, "الاسم قصير جدًا"),
  email: z.string({ required_error: "البريد الإلكتروني مطلوب" }).email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z.string({ required_error: "كلمة المرور مطلوبة" }).min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
  role: z.nativeEnum(Role).default("FIELD_USER"),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  password: z.string({ required_error: "كلمة المرور مطلوبة" }).min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});
