import { prisma } from "../config/prisma";
import { Prisma, Role } from "@prisma/client";

export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findById: (id: string) => prisma.user.findUnique({ where: { id } }),

  create: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),

  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({ where: { id }, data }),

  list: () =>
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { operations: true } },
      },
      orderBy: { createdAt: "desc" },
    }),

  countByRole: (role: Role) => prisma.user.count({ where: { role } }),
};
