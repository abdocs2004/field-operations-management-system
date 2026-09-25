import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { userService } from "../services/user.service";
import { createUserSchema, updateUserSchema, resetPasswordSchema } from "../validators/user.validator";

export const userController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const users = await userService.list();
    return sendSuccess(res, "تم جلب المستخدمين", users);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const input = createUserSchema.parse(req.body);
    const user = await userService.create(input);
    return sendSuccess(res, "تم إنشاء المستخدم بنجاح", user, 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const input = updateUserSchema.parse(req.body);
    const user = await userService.update(req.params.id, input, req.user!.id);
    return sendSuccess(res, "تم تحديث المستخدم بنجاح", user);
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const { password } = resetPasswordSchema.parse(req.body);
    await userService.resetPassword(req.params.id, password);
    return sendSuccess(res, "تم إعادة تعيين كلمة المرور بنجاح", null);
  }),
};
