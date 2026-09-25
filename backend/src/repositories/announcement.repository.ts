import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const announcementRepository = {
  findActive: () =>
    prisma.announcement.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 10 }),
  findAll: () => prisma.announcement.findMany({ orderBy: { createdAt: "desc" } }),
  findById: (id: string) => prisma.announcement.findUnique({ where: { id } }),
  create: (data: Prisma.AnnouncementCreateInput) => prisma.announcement.create({ data }),
  update: (id: string, data: Prisma.AnnouncementUpdateInput) =>
    prisma.announcement.update({ where: { id }, data }),
  delete: (id: string) => prisma.announcement.delete({ where: { id } }),
};
