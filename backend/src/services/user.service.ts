import { userRepository } from "../repositories/user.repository";
import { authService } from "./auth.service";
import { AppError } from "../utils/AppError";
import { Role } from "@prisma/client";

export const userService = {
  list: () => userRepository.list(),

  async create(input: { name: string; email: string; password: string; role: Role }) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw AppError.conflict("البريد الإلكتروني مستخدم بالفعل");

    const passwordHash = await authService.hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },

  async update(id: string, data: { name?: string; role?: Role; isActive?: boolean }, actingUserId: string) {
    const target = await userRepository.findById(id);
    if (!target) throw AppError.notFound("المستخدم غير موجود");

    // A SUPER_ADMIN cannot demote/disable themselves accidentally via this endpoint
    if (target.id === actingUserId && (data.role || data.isActive === false)) {
      throw AppError.badRequest("لا يمكنك تعديل صلاحياتك أو إيقاف حسابك بنفسك");
    }
    if (target.role === "SUPER_ADMIN" && target.id !== actingUserId) {
      throw AppError.forbidden("لا يمكن تعديل حساب مدير عام آخر");
    }

    return userRepository.update(id, data);
  },

  async resetPassword(id: string, newPassword: string) {
    const target = await userRepository.findById(id);
    if (!target) throw AppError.notFound("المستخدم غير موجود");
    const passwordHash = await authService.hashPassword(newPassword);
    await userRepository.update(id, { passwordHash });
    return { success: true };
  },
};
