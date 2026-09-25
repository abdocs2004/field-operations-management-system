import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { announcementRepository } from "../repositories/announcement.repository";
import { AppError } from "../utils/AppError";
import { createAnnouncementSchema, updateAnnouncementSchema } from "../validators/announcement.validator";

export const announcementController = {
  listActivePublic: asyncHandler(async (_req: Request, res: Response) => {
    const items = await announcementRepository.findActive();
    return sendSuccess(res, "تم جلب الإعلانات", items);
  }),

  listAll: asyncHandler(async (_req: Request, res: Response) => {
    const items = await announcementRepository.findAll();
    return sendSuccess(res, "تم جلب الإعلانات", items);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = createAnnouncementSchema.parse(req.body);
    const item = await announcementRepository.create(input);
    return sendSuccess(res, "تم إنشاء الإعلان بنجاح", item, 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const existing = await announcementRepository.findById(req.params.id);
    if (!existing) throw AppError.notFound("الإعلان غير موجود");
    const input = updateAnnouncementSchema.parse(req.body);
    const item = await announcementRepository.update(req.params.id, input);
    return sendSuccess(res, "تم تحديث الإعلان بنجاح", item);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const existing = await announcementRepository.findById(req.params.id);
    if (!existing) throw AppError.notFound("الإعلان غير موجود");
    await announcementRepository.delete(req.params.id);
    return sendSuccess(res, "تم حذف الإعلان بنجاح", null);
  }),
};
