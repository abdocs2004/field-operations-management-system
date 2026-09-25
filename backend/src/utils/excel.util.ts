import ExcelJS from "exceljs";

interface OperationExportRow {
  receiptNumber: string;
  date: string;
  customerName: string;
  serviceName: string;
  quantity: number;
  unit: string;
  amount: number;
  beneficiaryName: string;
  statusLabel: string;
  createdByName: string;
}

export async function buildOperationsExcel(rows: OperationExportRow[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "منصة توثيق العمليات الميدانية";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("العمليات", {
    views: [{ rightToLeft: true }],
  });

  sheet.columns = [
    { header: "رقم السند", key: "receiptNumber", width: 20 },
    { header: "التاريخ", key: "date", width: 16 },
    { header: "العميل", key: "customerName", width: 22 },
    { header: "الخدمة", key: "serviceName", width: 18 },
    { header: "الكمية", key: "quantity", width: 12 },
    { header: "الوحدة", key: "unit", width: 10 },
    { header: "القيمة (ريال)", key: "amount", width: 16 },
    { header: "المستفيد", key: "beneficiaryName", width: 22 },
    { header: "الحالة", key: "statusLabel", width: 14 },
    { header: "المستخدم", key: "createdByName", width: 18 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F2C46" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
  sheet.getRow(1).height = 22;

  rows.forEach((row, i) => {
    const excelRow = sheet.addRow(row);
    excelRow.alignment = { horizontal: "center", vertical: "middle" };
    if (i % 2 === 1) {
      excelRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
      });
    }
  });

  sheet.getColumn("amount").numFmt = "#,##0.00";

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
