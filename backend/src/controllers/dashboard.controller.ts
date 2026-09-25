import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { operationService } from "../services/operation.service";
import { OperationScope } from "../repositories/operation.repository";

function scopeOf(req: Request): OperationScope {
  return { userId: req.user!.id, role: req.user!.role };
}

export const dashboardController = {
  summary: asyncHandler(async (req: Request, res: Response) => {
    const summary = await operationService.summary(scopeOf(req));
    return sendSuccess(res, "تم جلب ملخص لوحة التحكم", summary);
  }),

  operationsTrend: asyncHandler(async (req: Request, res: Response) => {
    const period = String(req.query.period ?? "monthly");
    const days = period === "daily" ? 14 : period === "weekly" ? 56 : 180;
    const data = await operationService.operationsTrend(scopeOf(req), days);
    return sendSuccess(res, "تم جلب حركة العمليات", data);
  }),

  revenueTrend: asyncHandler(async (req: Request, res: Response) => {
    const period = String(req.query.period ?? "monthly");
    const days = period === "daily" ? 14 : period === "weekly" ? 56 : 180;
    const data = await operationService.revenueTrend(scopeOf(req), days);
    return sendSuccess(res, "تم جلب حركة القيمة المالية", data);
  }),

  serviceDistribution: asyncHandler(async (req: Request, res: Response) => {
    const data = await operationService.serviceDistribution(scopeOf(req));
    return sendSuccess(res, "تم جلب توزيع الخدمات", data);
  }),

  statusDistribution: asyncHandler(async (req: Request, res: Response) => {
    const data = await operationService.statusDistribution(scopeOf(req));
    return sendSuccess(res, "تم جلب توزيع الحالات", data);
  }),
};
