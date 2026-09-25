import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string({ required_error: "عنوان الإعلان مطلوب" }).trim().min(2),
  content: z.string({ required_error: "محتوى الإعلان مطلوب" }).trim().min(2),
  isActive: z.boolean().optional().default(true),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();
