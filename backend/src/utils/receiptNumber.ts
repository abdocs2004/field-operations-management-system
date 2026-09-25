import { Prisma, PrismaClient } from "@prisma/client";

/**
 * Generates the next receipt number, e.g. "RCP-2026-000001".
 *
 * Concurrency safety: this MUST be called with a Prisma transaction client
 * (`tx`) so the `SELECT ... FOR UPDATE` row lock on `receipt_sequences` is
 * held for the lifetime of the operation-creation transaction. That closes
 * the race window that a naive `COUNT(*) + 1` approach would leave open
 * under concurrent requests — two field users submitting at the same
 * millisecond can never receive the same number, because the second
 * transaction blocks on the row lock until the first commits or rolls back.
 *
 * The `receipt_sequences` table is seeded lazily (upsert) per calendar year,
 * so the numbering resets to 000001 at the start of each year while still
 * being globally unique thanks to the year prefix.
 */
export async function generateReceiptNumber(
  tx: Prisma.TransactionClient | PrismaClient
): Promise<string> {
  const year = new Date().getFullYear();

  // Ensure a row exists for this year, then lock it for update.
  await tx.$executeRaw`
    INSERT INTO receipt_sequences (year, "lastNumber")
    VALUES (${year}, 0)
    ON CONFLICT (year) DO NOTHING
  `;

  const rows = await tx.$queryRaw<{ lastNumber: number }[]>`
    SELECT "lastNumber" FROM receipt_sequences WHERE year = ${year} FOR UPDATE
  `;

  const current = rows[0]?.lastNumber ?? 0;
  const next = current + 1;

  await tx.$executeRaw`
    UPDATE receipt_sequences SET "lastNumber" = ${next} WHERE year = ${year}
  `;

  const padded = String(next).padStart(6, "0");
  return `RCP-${year}-${padded}`;
}
