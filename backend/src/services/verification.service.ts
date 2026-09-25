import { prisma } from "../config/prisma";
import { operationRepository } from "../repositories/operation.repository";
import { buildReceiptPayload } from "./receipt.service";

interface VerifyContext {
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Public verification lookup. Always logs the attempt (found or not) to
 * `verification_logs` for audit purposes, but returns ONLY the public-safe
 * receipt subset — never internal ids, user accounts, or notes.
 */
export const verificationService = {
  async verify(receiptNumber: string, ctx: VerifyContext) {
    const operation = await operationRepository.findByReceiptNumber(receiptNumber.trim());

    await prisma.verificationLog.create({
      data: {
        receiptNumber: receiptNumber.trim(),
        operationId: operation?.id,
        found: Boolean(operation),
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
      },
    });

    if (!operation) {
      return { found: false as const };
    }

    const receipt = await buildReceiptPayload(operation);
    return { found: true as const, receipt };
  },
};
