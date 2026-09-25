import { generateQrDataUrl, buildVerificationUrl } from "../utils/qrCode";
import { formatCurrencyAr, formatDateAr, formatTimeAr, statusLabelAr } from "../utils/format";

interface OperationLike {
  receiptNumber: string;
  customerName: string;
  beneficiaryName: string;
  quantity: unknown;
  unit: string;
  amount: unknown;
  status: string;
  createdAt: Date;
  service: { name: string };
}

/**
 * Builds the receipt payload shown on-screen/printed to authenticated
 * users, and reused (public-safe subset) by the verification endpoint.
 * NEVER include internal DB ids, user emails, or system metadata here —
 * this shape is what a QR-scanning stranger ultimately sees.
 */
export async function buildReceiptPayload(operation: OperationLike) {
  const qrCodeDataUrl = await generateQrDataUrl(operation.receiptNumber);
  return {
    receiptNumber: operation.receiptNumber,
    date: formatDateAr(operation.createdAt),
    time: formatTimeAr(operation.createdAt),
    customerName: operation.customerName,
    serviceName: operation.service.name,
    quantity: Number(operation.quantity),
    unit: operation.unit,
    amount: Number(operation.amount),
    amountFormatted: formatCurrencyAr(Number(operation.amount)),
    beneficiaryName: operation.beneficiaryName,
    status: operation.status,
    statusLabel: statusLabelAr(operation.status),
    verificationUrl: buildVerificationUrl(operation.receiptNumber),
    qrCodeDataUrl,
  };
}
