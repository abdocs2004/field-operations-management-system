import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, buildPagination } from "../utils/apiResponse";
import { operationService } from "../services/operation.service";
import { buildReceiptPayload } from "../services/receipt.service";
import { renderReceiptPdf } from "../utils/pdf.util";
import {
  createOperationSchema,
  updateOperationSchema,
  operationQuerySchema,
} from "../validators/operation.validator";
import { OperationScope } from "../repositories/operation.repository";

function scopeOf(req: Request): OperationScope {
  return { userId: req.user!.id, role: req.user!.role };
}

export const operationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = operationQuerySchema.parse(req.query);
    const { items, total } = await operationService.paginate(query, scopeOf(req));
    return sendSuccess(
      res,
      "تم جلب العمليات",
      items,
      200,
      buildPagination(query.page, query.limit, total)
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const operation = await operationService.findById(req.params.id, scopeOf(req));
    return sendSuccess(res, "تم جلب بيانات العملية", operation);
  }),

  getReceipt: asyncHandler(async (req: Request, res: Response) => {
    const operation = await operationService.findById(req.params.id, scopeOf(req));
    const receipt = await buildReceiptPayload(operation);
    return sendSuccess(res, "تم جلب السند", receipt);
  }),

  getReceiptPdf: asyncHandler(async (req: Request, res: Response) => {
    const operation = await operationService.findById(req.params.id, scopeOf(req));
    const receipt = await buildReceiptPayload(operation);
    const buffer = await renderReceiptPdf(receipt);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${receipt.receiptNumber}.pdf"`);
    res.send(buffer);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = createOperationSchema.parse(req.body);
    const operation = await operationService.create(input, req.user!.id);
    const receipt = await buildReceiptPayload(operation);
    return sendSuccess(res, "تم إنشاء العملية بنجاح", { operation, receipt }, 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const input = updateOperationSchema.parse(req.body);
    const operation = await operationService.update(req.params.id, input, req.user!.id, scopeOf(req));
    return sendSuccess(res, "تم تحديث العملية بنجاح", operation);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await operationService.remove(req.params.id, req.user!.id, scopeOf(req));
    return sendSuccess(res, "تم حذف العملية بنجاح", null);
  }),
};
