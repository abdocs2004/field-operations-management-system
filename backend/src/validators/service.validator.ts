import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string({ required_error: "اسم الخدمة مطلوب" }).trim().min(2, "اسم الخدمة قصير جدًا"),
  description: z.string().trim().max(500).optional(),
});

export const updateServiceSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().max(500).optional(),
  isActive: z.boolean().optional(),
});
