import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { authService } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validator";
import { env } from "../config/env";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? ("none" as const) : ("lax" as const),
  maxAge: 8 * 60 * 60 * 1000, // 8h, mirrors JWT_EXPIRES_IN default
};

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body);
    const { token, user } = await authService.login(input);

    // httpOnly cookie for browser clients (safer than localStorage against XSS)
    res.cookie(env.jwtCookieName, token, COOKIE_OPTIONS);

    // Token is also returned in the body so non-browser / mobile clients
    // can use the Authorization: Bearer header instead.
    return sendSuccess(res, "تم تسجيل الدخول بنجاح", { token, user });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie(env.jwtCookieName, { ...COOKIE_OPTIONS, maxAge: 0 });
    return sendSuccess(res, "تم تسجيل الخروج بنجاح", null);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await userRepository.findById(req.user!.id);
    if (!user) throw AppError.notFound("المستخدم غير موجود");
    return sendSuccess(res, "تم جلب بيانات المستخدم", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }),
};
