import PDFDocument from "pdfkit";
import path from "path";
import { PassThrough } from "stream";

const FONT_PATH = path.join(__dirname, "..", "assets", "fonts", "Cairo-Regular.ttf");
const PAGE_MARGIN = 40;
const PAGE_WIDTH = 595.28; // A4 pt
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

/**
 * Arabic text shaping note: pdfkit (via its bundled `fontkit`) performs
 * genuine OpenType complex-script shaping (Arabic letter joining) and
 * bidirectional reordering automatically for embedded TTF/OTF fonts, as
 * long as the font's own GSUB tables support it — which the bundled Cairo
 * font does. We deliberately avoid composing a single "label: value"
 * string when the value mixes scripts (e.g. "التاريخ: 24 سبتمبر 2026"):
 * at an RTL/LTR boundary, the space glued to a following western-digit run
 * can visually collapse. Drawing the Arabic label and the value as two
 * separate right-aligned text calls sidesteps that and gives predictable,
 * professional column alignment — the approach used throughout this file.
 */
function newDoc(): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN, bufferPages: true });
  doc.registerFont("Cairo", FONT_PATH);
  doc.font("Cairo");
  return doc;
}

function collectToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
    doc.pipe(stream);
    doc.end();
  });
}

function rightText(
  doc: PDFKit.PDFDocument,
  text: string,
  y: number,
  opts: { size?: number; color?: string; x?: number; width?: number } = {}
) {
  const x = opts.x ?? PAGE_MARGIN;
  const width = opts.width ?? CONTENT_WIDTH;
  doc
    .fontSize(opts.size ?? 11)
    .fillColor(opts.color ?? "#1e293b")
    .text(text, x, y, { width, align: "right" });
}

function drawDivider(doc: PDFKit.PDFDocument, y: number) {
  doc.moveTo(PAGE_MARGIN, y).lineTo(PAGE_WIDTH - PAGE_MARGIN, y).strokeColor("#e2e8f0").lineWidth(1).stroke();
}

const NAVY = "#0f2c46";
const MUTED = "#64748b";
const SUCCESS = "#15803d";
const WARNING = "#b45309";
const DANGER = "#b91c1c";

function statusColor(status: string): string {
  if (status === "COMPLETED") return SUCCESS;
  if (status === "PENDING") return WARNING;
  return DANGER;
}

interface ReceiptData {
  receiptNumber: string;
  date: string;
  time: string;
  customerName: string;
  serviceName: string;
  quantity: number;
  unit: string;
  amountFormatted: string;
  beneficiaryName: string;
  statusLabel: string;
  status: string;
  verificationUrl: string;
  qrCodeDataUrl: string; // data:image/png;base64,...
}

/** Renders a single professional, print-ready Arabic receipt as a PDF buffer. */
export async function renderReceiptPdf(receipt: ReceiptData): Promise<Buffer> {
  const doc = newDoc();
  let y = PAGE_MARGIN;

  rightText(doc, "منصّة توثيق العمليات الميدانية", y, { size: 12, color: MUTED });
  y += 20;
  rightText(doc, "إيصال إلكتروني", y, { size: 22, color: NAVY });
  y += 34;
  drawDivider(doc, y);
  y += 24;

  rightText(doc, "رقم السند", y, { size: 10, color: MUTED });
  rightText(doc, receipt.receiptNumber, y, { size: 10, color: MUTED, x: PAGE_MARGIN, width: 250 });
  y += 22;

  const rows: [string, string][] = [
    ["التاريخ", receipt.date],
    ["الوقت", receipt.time],
    ["اسم العميل / المورد", receipt.customerName],
    ["نوع الخدمة", receipt.serviceName],
    ["الكمية / الوزن", `${receipt.quantity} ${receipt.unit}`],
    ["القيمة المالية", receipt.amountFormatted],
    ["اسم المستفيد", receipt.beneficiaryName],
  ];

  for (const [label, value] of rows) {
    rightText(doc, label, y, { size: 10, color: MUTED, x: PAGE_MARGIN + 300, width: 195 });
    rightText(doc, value, y, { size: 12, color: NAVY, x: PAGE_MARGIN, width: 280 });
    y += 26;
  }

  y += 6;
  rightText(doc, "حالة السند", y, { size: 10, color: MUTED, x: PAGE_MARGIN + 300, width: 195 });
  rightText(doc, receipt.statusLabel, y, { size: 12, color: statusColor(receipt.status), x: PAGE_MARGIN, width: 280 });
  y += 40;

  drawDivider(doc, y);
  y += 24;

  // QR code
  const qrBuffer = Buffer.from(receipt.qrCodeDataUrl.split(",")[1], "base64");
  const qrSize = 130;
  const qrX = PAGE_WIDTH / 2 - qrSize / 2;
  doc.image(qrBuffer, qrX, y, { width: qrSize, height: qrSize });
  y += qrSize + 12;

  doc.fontSize(10).fillColor(MUTED).text("امسح رمز QR للتحقق من صحة السند", PAGE_MARGIN, y, {
    width: CONTENT_WIDTH,
    align: "center",
  });
  y += 16;
  doc.fontSize(9).fillColor("#94a3b8").text(receipt.verificationUrl, PAGE_MARGIN, y, {
    width: CONTENT_WIDTH,
    align: "center",
  });

  return collectToBuffer(doc);
}

// ----------------------------------------------------------------------------
// Report PDF
// ----------------------------------------------------------------------------
interface ReportOperationRow {
  receiptNumber: string;
  date: string;
  customerName: string;
  serviceName: string;
  quantity: number;
  unit: string;
  amountFormatted: string;
  beneficiaryName: string;
  statusLabel: string;
  status: string;
}

interface ReportData {
  generatedAt: string;
  filtersDescription: string;
  totals: { totalOperations: number; totalAmountFormatted: string; totalQuantity: string };
  rows: ReportOperationRow[];
}

const COLS = [
  { key: "receiptNumber", label: "رقم السند", width: 90 },
  { key: "date", label: "التاريخ", width: 65 },
  { key: "customerName", label: "العميل", width: 80 },
  { key: "serviceName", label: "الخدمة", width: 65 },
  { key: "quantity", label: "الكمية", width: 55 },
  { key: "amountFormatted", label: "القيمة", width: 70 },
  { key: "statusLabel", label: "الحالة", width: 60 },
] as const;

export async function renderReportPdf(report: ReportData): Promise<Buffer> {
  const doc = newDoc();
  let y = PAGE_MARGIN;

  rightText(doc, "تقرير العمليات", y, { size: 20, color: NAVY });
  y += 26;
  rightText(doc, report.filtersDescription, y, { size: 10, color: MUTED });
  y += 16;
  rightText(doc, `تاريخ الإصدار: ${report.generatedAt}`, y, { size: 9, color: "#94a3b8" });
  y += 24;

  // Summary cards
  const summary: [string, string][] = [
    ["إجمالي العمليات", String(report.totals.totalOperations)],
    ["إجمالي القيمة", report.totals.totalAmountFormatted],
    ["إجمالي الكمية", report.totals.totalQuantity],
  ];
  const cardWidth = CONTENT_WIDTH / 3 - 8;
  summary.forEach(([label, value], i) => {
    const x = PAGE_MARGIN + i * (cardWidth + 12);
    doc.roundedRect(x, y, cardWidth, 50, 6).fillAndStroke("#f8fafc", "#e2e8f0");
    doc.fontSize(9).fillColor(MUTED).text(label, x, y + 8, { width: cardWidth, align: "center" });
    doc.fontSize(14).fillColor(NAVY).text(value, x, y + 24, { width: cardWidth, align: "center" });
  });
  y += 66;
  drawDivider(doc, y);
  y += 16;

  // Table header (RTL: first column starts at the right margin)
  function drawHeader() {
    let x = PAGE_WIDTH - PAGE_MARGIN;
    doc.fontSize(9).fillColor("#ffffff");
    doc.rect(PAGE_MARGIN, y, CONTENT_WIDTH, 22).fill(NAVY);
    for (const col of COLS) {
      x -= col.width;
      doc.fillColor("#ffffff").text(col.label, x, y + 6, { width: col.width, align: "center" });
    }
    y += 22;
  }

  drawHeader();

  let rowIndex = 0;
  for (const row of report.rows) {
    if (y > 780) {
      doc.addPage();
      y = PAGE_MARGIN;
      drawHeader();
    }
    const rowHeight = 20;
    if (rowIndex % 2 === 1) {
      doc.rect(PAGE_MARGIN, y, CONTENT_WIDTH, rowHeight).fill("#f8fafc");
    }
    let x = PAGE_WIDTH - PAGE_MARGIN;
    for (const col of COLS) {
      x -= col.width;
      const raw = (row as any)[col.key];
      const text = col.key === "quantity" ? `${raw} ${row.unit}` : String(raw);
      const color = col.key === "statusLabel" ? statusColor(row.status) : "#1e293b";
      doc.fontSize(8.5).fillColor(color).text(text, x, y + 5, { width: col.width, align: "center" });
    }
    y += rowHeight;
    rowIndex++;
  }

  if (report.rows.length === 0) {
    doc.fontSize(11).fillColor(MUTED).text("لا توجد عمليات مطابقة للفلاتر الحالية", PAGE_MARGIN, y + 20, {
      width: CONTENT_WIDTH,
      align: "center",
    });
  }

  return collectToBuffer(doc);
}
