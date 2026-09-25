import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(AppError.notFound(`المسار غير موجود: ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors -> 400 with per-field Arabic messages
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "بيانات غير صالحة، يرجى مراجعة الحقول المدخلة",
      errors: err.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
  }

  // Known Prisma errors -> friendly Arabic messages, never raw SQL/stack
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "القيمة مستخدمة بالفعل (سجل مكرر)",
        errors: [],
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "العنصر المطلوب غير موجود",
        errors: [],
      });
    }
    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "لا يمكن تنفيذ العملية لوجود بيانات مرتبطة",
        errors: [],
      });
    }
  }

  // Our own operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Unknown / programmer errors — never leak stack traces or internals
  if (!env.isProduction) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(500).json({
    success: false,
    message: "حدث خطأ غير متوقع في الخادم",
    errors: [],
  });
}
