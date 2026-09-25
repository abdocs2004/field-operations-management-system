import { prisma } from "../config/prisma";
import { Prisma, OperationStatus, Role } from "@prisma/client";
import { OperationQuery } from "../validators/operation.validator";

export interface OperationScope {
  userId: string;
  role: Role;
}

/**
 * FIELD_USER accounts may only ever see their own operations — enforced
 * here at the query-building layer, not just hidden in the UI.
 */
function buildWhere(query: OperationQuery, scope: OperationScope): Prisma.OperationWhereInput {
  const where: Prisma.OperationWhereInput = {};

  if (scope.role === "FIELD_USER") {
    where.createdById = scope.userId;
  } else if (query.createdById) {
    where.createdById = query.createdById;
  }

  if (query.serviceId) where.serviceId = query.serviceId;
  if (query.status) where.status = query.status;
  if (query.receiptNumber) {
    where.receiptNumber = { contains: query.receiptNumber, mode: "insensitive" };
  }
  if (query.customerName) {
    where.customerName = { contains: query.customerName, mode: "insensitive" };
  }
  if (query.search) {
    where.OR = [
      { receiptNumber: { contains: query.search, mode: "insensitive" } },
      { customerName: { contains: query.search, mode: "insensitive" } },
      { beneficiaryName: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.dateFrom || query.dateTo) {
    where.createdAt = {};
    if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
    if (query.dateTo) {
      const end = new Date(query.dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  return where;
}

const listInclude = {
  service: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.OperationInclude;

export const operationRepository = {
  async paginate(query: OperationQuery, scope: OperationScope) {
    const where = buildWhere(query, scope);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await prisma.$transaction([
      prisma.operation.findMany({
        where,
        include: listInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take: query.limit,
      }),
      prisma.operation.count({ where }),
    ]);

    return { items, total };
  },

  // Same filtering, no pagination — used by Excel/PDF export and reports.
  async findAllForExport(query: OperationQuery, scope: OperationScope) {
    const where = buildWhere(query, scope);
    return prisma.operation.findMany({
      where,
      include: listInclude,
      orderBy: { createdAt: "desc" },
      take: 10000, // sane hard cap
    });
  },

  findById: (id: string) =>
    prisma.operation.findUnique({
      where: { id },
      include: {
        service: true,
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    }),

  findByReceiptNumber: (receiptNumber: string) =>
    prisma.operation.findUnique({
      where: { receiptNumber },
      include: { service: { select: { name: true } } },
    }),

  update: (id: string, data: Prisma.OperationUpdateInput) =>
    prisma.operation.update({ where: { id }, data, include: listInclude }),

  delete: (id: string) => prisma.operation.delete({ where: { id } }),

  // ---- Dashboard aggregates -------------------------------------------------
  async summary(scope: OperationScope) {
    const where: Prisma.OperationWhereInput =
      scope.role === "FIELD_USER" ? { createdById: scope.userId } : {};

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totals, todayCount] = await Promise.all([
      prisma.operation.aggregate({
        where,
        _sum: { amount: true, quantity: true },
        _count: true,
      }),
      prisma.operation.count({ where: { ...where, createdAt: { gte: startOfToday } } }),
    ]);

    return {
      totalAmount: totals._sum.amount ?? 0,
      totalQuantity: totals._sum.quantity ?? 0,
      totalOperations: totals._count,
      todayOperations: todayCount,
    };
  },

  async operationsTrend(scope: OperationScope, days: number) {
    const where: Prisma.OperationWhereInput =
      scope.role === "FIELD_USER" ? { createdById: scope.userId } : {};
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day, COUNT(*)::bigint AS count
      FROM operations
      WHERE "createdAt" >= ${since}
      ${scope.role === "FIELD_USER" ? Prisma.sql`AND "createdById" = ${scope.userId}` : Prisma.empty}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    return rows.map((r) => ({ date: r.day, count: Number(r.count) }));
  },

  async revenueTrend(scope: OperationScope, days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await prisma.$queryRaw<{ day: string; total: string }[]>`
      SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day, COALESCE(SUM(amount), 0)::text AS total
      FROM operations
      WHERE "createdAt" >= ${since}
      ${scope.role === "FIELD_USER" ? Prisma.sql`AND "createdById" = ${scope.userId}` : Prisma.empty}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    return rows.map((r) => ({ date: r.day, total: Number(r.total) }));
  },

  async serviceDistribution(scope: OperationScope) {
    const where: Prisma.OperationWhereInput =
      scope.role === "FIELD_USER" ? { createdById: scope.userId } : {};

    const rows = await prisma.operation.groupBy({
      by: ["serviceId"],
      where,
      _count: true,
      _sum: { amount: true },
    });

    const services = await prisma.service.findMany({
      where: { id: { in: rows.map((r) => r.serviceId) } },
      select: { id: true, name: true },
    });
    const nameById = new Map(services.map((s) => [s.id, s.name]));

    return rows.map((r) => ({
      serviceId: r.serviceId,
      serviceName: nameById.get(r.serviceId) ?? "غير معروف",
      count: r._count,
      totalAmount: Number(r._sum.amount ?? 0),
    }));
  },

  async statusDistribution(scope: OperationScope) {
    const where: Prisma.OperationWhereInput =
      scope.role === "FIELD_USER" ? { createdById: scope.userId } : {};
    const rows = await prisma.operation.groupBy({ by: ["status"], where, _count: true });
    return rows.map((r) => ({ status: r.status as OperationStatus, count: r._count }));
  },
};
