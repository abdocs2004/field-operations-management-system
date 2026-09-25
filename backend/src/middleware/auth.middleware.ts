import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { Role } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }
  const cookieToken = req.cookies?.[env.jwtCookieName];
  return cookieToken ?? null;
}

/**
 * Requires a valid, non-expired JWT. Attaches the authenticated user
 * (freshly loaded from the DB, so a disabled account is rejected even with
 * a still-valid token) to `req.user`. Always the final authority — the
 * frontend's own role-based UI is a convenience only.
 */
export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw AppError.unauthorized("يجب تسجيل الدخول للوصول إلى هذا المورد");
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err: any) {
      if (err?.name === "TokenExpiredError") {
        throw AppError.unauthorized("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
      }
      throw AppError.unauthorized("رمز الدخول غير صالح");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw AppError.unauthorized("الحساب غير موجود أو تم إيقافه");
    }

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Role gate. Must run after `requireAuth`. Backend is always the final
 * authority for authorization — this is enforced independently of
 * whatever the frontend chose to render.
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden("ليس لديك صلاحية للوصول إلى هذا المورد"));
    }
    next();
  };
