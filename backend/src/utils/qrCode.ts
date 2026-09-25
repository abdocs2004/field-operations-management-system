import QRCode from "qrcode";
import { env } from "../config/env";

/**
 * Builds the public verification URL for a receipt. This is the ONLY
 * thing encoded in the QR code — never raw operation data — so a scanned
 * code can't leak anything the public verification endpoint wouldn't
 * already return.
 */
export function buildVerificationUrl(receiptNumber: string): string {
  return `${env.publicAppUrl}/verify/${encodeURIComponent(receiptNumber)}`;
}

/**
 * Returns a base64 data-URL PNG of the QR code, ready to embed directly
 * in <img src="..."> on the receipt view or PDF.
 */
export async function generateQrDataUrl(receiptNumber: string): Promise<string> {
  const url = buildVerificationUrl(receiptNumber);
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 300,
  });
}
