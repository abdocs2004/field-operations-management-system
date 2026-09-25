import { operationRepository, OperationScope } from "../repositories/operation.repository";
import { OperationQuery } from "../validators/operation.validator";
import { formatCurrencyAr, formatDateAr, statusLabelAr } from "../utils/format";
import { buildOperationsExcel } from "../utils/excel.util";
import { renderReportPdf } from "../utils/pdf.util";
import { serviceRepository } from "../repositories/service.repository";

function describeFilters(query: OperationQuery): string {
  const parts: string[] = [];
  if (query.dateFrom) parts.push(`من ${query.dateFrom}`);
  if (query.dateTo) parts.push(`إلى ${query.dateTo}`);
  if (query.status) parts.push(`الحالة: ${statusLabelAr(query.status)}`);
  if (query.customerName) parts.push(`العميل: ${query.customerName}`);
  if (query.receiptNumber) parts.push(`رقم السند: ${query.receiptNumber}`);
  return parts.length ? `الفلاتر المطبقة: ${parts.join(" — ")}` : "بدون فلاتر (كل العمليات)";
}

export const reportService = {
  async summaryReport(query: OperationQuery, scope: OperationScope) {
    const operations = await operationRepository.findAllForExport(query, scope);
    const totalAmount = operations.reduce((sum, op) => sum + Number(op.amount), 0);
    const totalQuantity = operations.reduce((sum, op) => sum + Number(op.quantity), 0);
    return {
      totalOperations: operations.length,
      totalAmount,
      totalAmountFormatted: formatCurrencyAr(totalAmount),
      totalQuantity,
      operations,
    };
  },

  async exportExcel(query: OperationQuery, scope: OperationScope) {
    const operations = await operationRepository.findAllForExport(query, scope);
    const rows = operations.map((op) => ({
      receiptNumber: op.receiptNumber,
      date: formatDateAr(op.createdAt),
      customerName: op.customerName,
      serviceName: op.service.name,
      quantity: Number(op.quantity),
      unit: op.unit,
      amount: Number(op.amount),
      beneficiaryName: op.beneficiaryName,
      statusLabel: statusLabelAr(op.status),
      createdByName: op.createdBy.name,
    }));
    return buildOperationsExcel(rows);
  },

  async exportPdf(query: OperationQuery, scope: OperationScope) {
    const operations = await operationRepository.findAllForExport(query, scope);
    const totalAmount = operations.reduce((sum, op) => sum + Number(op.amount), 0);
    const totalQuantity = operations.reduce((sum, op) => sum + Number(op.quantity), 0);

    return renderReportPdf({
      generatedAt: formatDateAr(new Date()),
      filtersDescription: describeFilters(query),
      totals: {
        totalOperations: operations.length,
        totalAmountFormatted: formatCurrencyAr(totalAmount),
        totalQuantity: `${totalQuantity.toLocaleString("en-US")} كجم`,
      },
      rows: operations.map((op) => ({
        receiptNumber: op.receiptNumber,
        date: formatDateAr(op.createdAt),
        customerName: op.customerName,
        serviceName: op.service.name,
        quantity: Number(op.quantity),
        unit: op.unit,
        amountFormatted: formatCurrencyAr(Number(op.amount)),
        beneficiaryName: op.beneficiaryName,
        statusLabel: statusLabelAr(op.status),
        status: op.status,
      })),
    });
  },

  listServicesForFilter: () => serviceRepository.findActive(),
};
