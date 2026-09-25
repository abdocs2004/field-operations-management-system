import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { generateReceiptNumber } from "../utils/receiptNumber";
import { operationRepository, OperationScope } from "../repositories/operation.repository";
import { CreateOperationInput, OperationQuery } from "../validators/operation.validator";
import { serviceRepository } from "../repositories/service.repository";

export const operationService = {
  async paginate(query: OperationQuery, scope: OperationScope) {
    const { items, total } = await operationRepository.paginate(query, scope);
    return { items, total };
  },

  findAllForExport: (query: OperationQuery, scope: OperationScope) =>
    operationRepository.findAllForExport(query, scope),

  async findById(id: string, scope: OperationScope) {
    const operation = await operationRepository.findById(id);
    if (!operation) throw AppError.notFound("العملية غير موجودة");
    if (scope.role === "FIELD_USER" && operation.createdById !== scope.userId) {
      throw AppError.forbidden("لا يمكنك عرض عمليات مستخدمين آخرين");
    }
    return operation;
  },

  /**
   * Creates an operation, its unique receipt number, and its audit-log
   * entry atomically. If any step fails, everything rolls back — no
   * partial database state (operation without a receipt number, etc).
   */
  async create(input: CreateOperationInput, userId: string) {
    const service = await serviceRepository.findById(input.serviceId);
    if (!service || !service.isActive) {
      throw AppError.badRequest("نوع الخدمة المحدد غير متاح");
    }

    return prisma.$transaction(async (tx) => {
      const receiptNumber = await generateReceiptNumber(tx);

      const operation = await tx.operation.create({
        data: {
          receiptNumber,
          customerName: input.customerName,
          serviceId: input.serviceId,
          quantity: input.quantity,
          unit: input.unit ?? "كجم",
          amount: input.amount,
          beneficiaryName: input.beneficiaryName,
          status: input.status ?? "COMPLETED",
          createdById: userId,
        },
        include: { service: { select: { id: true, name: true } } },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "OPERATION_CREATED",
          entityType: "Operation",
          entityId: operation.id,
          operationId: operation.id,
          metadata: { receiptNumber },
        },
      });

      return operation;
    });
  },

  async update(id: string, data: Partial<CreateOperationInput>, userId: string, scope: OperationScope) {
    const existing = await operationRepository.findById(id);
    if (!existing) throw AppError.notFound("العملية غير موجودة");
    if (scope.role === "FIELD_USER" && existing.createdById !== scope.userId) {
      throw AppError.forbidden("لا يمكنك تعديل عمليات مستخدمين آخرين");
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.operation.update({
        where: { id },
        data: { ...data, updatedById: userId },
        include: { service: { select: { id: true, name: true } } },
      });
      await tx.auditLog.create({
        data: {
          userId,
          action: "OPERATION_UPDATED",
          entityType: "Operation",
          entityId: id,
          operationId: id,
          metadata: { changes: data },
        },
      });
      return updated;
    });
  },

  async remove(id: string, userId: string, scope: OperationScope) {
    const existing = await operationRepository.findById(id);
    if (!existing) throw AppError.notFound("العملية غير موجودة");
    // Only SUPER_ADMIN/ADMIN may delete (enforced again at route level);
    // FIELD_USER cannot delete arbitrary operations even their own, per spec.
    if (scope.role === "FIELD_USER") {
      throw AppError.forbidden("لا يمكنك حذف العمليات");
    }
    await prisma.$transaction(async (tx) => {
      await tx.auditLog.create({
        data: {
          userId,
          action: "OPERATION_DELETED",
          entityType: "Operation",
          entityId: id,
          metadata: { receiptNumber: existing.receiptNumber },
        },
      });
      await tx.operation.delete({ where: { id } });
    });
    return { success: true };
  },

  // ---- Dashboard aggregate passthroughs -------------------------------------
  summary: (scope: OperationScope) => operationRepository.summary(scope),
  operationsTrend: (scope: OperationScope, days: number) =>
    operationRepository.operationsTrend(scope, days),
  revenueTrend: (scope: OperationScope, days: number) => operationRepository.revenueTrend(scope, days),
  serviceDistribution: (scope: OperationScope) => operationRepository.serviceDistribution(scope),
  statusDistribution: (scope: OperationScope) => operationRepository.statusDistribution(scope),
};
