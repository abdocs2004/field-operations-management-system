import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const serviceRepository = {
  findActive: () =>
    prisma.service.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),

  findAll: () => prisma.service.findMany({ orderBy: { createdAt: "desc" } }),

  findById: (id: string) => prisma.service.findUnique({ where: { id } }),

  create: (data: Prisma.ServiceCreateInput) => prisma.service.create({ data }),

  update: (id: string, data: Prisma.ServiceUpdateInput) =>
    prisma.service.update({ where: { id }, data }),

  countOperations: (id: string) => prisma.operation.count({ where: { serviceId: id } }),

  delete: (id: string) => prisma.service.delete({ where: { id } }),
};
