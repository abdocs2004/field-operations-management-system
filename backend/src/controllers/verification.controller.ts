import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { verificationService } from "../services/verification.service";
import { AppError } from "../utils/AppError";

export const verificationController = {
  verify: asyncHandler(async (req: Request, res: Response) => {
    const receiptNumber = String(req.params.receiptNumber ?? "").trim();
    if (!receiptNumber) {
      throw AppError.badRequest("يرجى إدخال رقم السند");
    }

    const result = await verificationService.verify(receiptNumber, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    if (!result.found) {
      // A "not found" lookup is a valid, successful response — not a server
      // error — so it still returns 200 with found:false in the payload.
      return sendSuccess(res, "لم يتم العثور على السند", { found: false });
    }

    return sendSuccess(res, "تم العثور على السند", { found: true, receipt: result.receipt });
  }),
};
