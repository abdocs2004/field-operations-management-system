import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { serviceService } from "../services/service.service";
import { createServiceSchema, updateServiceSchema } from "../validators/service.validator";

export const serviceController = {
  listActive: asyncHandler(async (_req: Request, res: Response) => {
    const services = await serviceService.listActive();
    return sendSuccess(res, "تم جلب الخدمات", services);
  }),

  listAll: asyncHandler(async (_req: Request, res: Response) => {
    const services = await serviceService.listAll();
    return sendSuccess(res, "تم جلب الخدمات", services);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = createServiceSchema.parse(req.body);
    const service = await serviceService.create(input);
    return sendSuccess(res, "تم إضافة الخدمة بنجاح", service, 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const input = updateServiceSchema.parse(req.body);
    const service = await serviceService.update(req.params.id, input);
    return sendSuccess(res, "تم تحديث الخدمة بنجاح", service);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await serviceService.remove(req.params.id);
    return sendSuccess(res, "تم حذف الخدمة بنجاح", null);
  }),
};
