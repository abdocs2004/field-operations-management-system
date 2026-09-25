import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { reportService } from "../services/report.service";
import { operationQuerySchema } from "../validators/operation.validator";
import { OperationScope } from "../repositories/operation.repository";

function scopeOf(req: Request): OperationScope {
  return { userId: req.user!.id, role: req.user!.role };
}

// Reports/exports operate on the full filtered set (no pagination limits)
const reportQuerySchema = operationQuerySchema.omit({ page: true, limit: true });

export const reportController = {
  summary: asyncHandler(async (req: Request, res: Response) => {
    const query = { ...reportQuerySchema.parse(req.query), page: 1, limit: 10000 };
    const result = await reportService.summaryReport(query as any, scopeOf(req));
    return sendSuccess(res, "تم إنشاء التقرير", result);
  }),

  exportExcel: asyncHandler(async (req: Request, res: Response) => {
    const query = { ...reportQuerySchema.parse(req.query), page: 1, limit: 10000 };
    const buffer = await reportService.exportExcel(query as any, scopeOf(req));
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="operations-report.xlsx"`);
    res.send(buffer);
  }),

  exportPdf: asyncHandler(async (req: Request, res: Response) => {
    const query = { ...reportQuerySchema.parse(req.query), page: 1, limit: 10000 };
    const buffer = await reportService.exportPdf(query as any, scopeOf(req));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="operations-report.pdf"`);
    res.send(buffer);
  }),
};
