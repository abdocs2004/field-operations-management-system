import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { signAccessToken } from "../utils/jwt";
import { LoginInput } from "../validators/auth.validator";

export const authService = {
  async login({ email, password }: LoginInput) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw AppError.unauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
    if (!user.isActive) {
      throw AppError.forbidden("تم إيقاف هذا الحساب، يرجى التواصل مع الإدارة");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw AppError.unauthorized("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    const token = signAccessToken({ sub: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  },
};
