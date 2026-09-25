const STATUS_LABELS_AR: Record<string, string> = {
  PENDING: "قيد الانتظار",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
};

export function statusLabelAr(status: string): string {
  return STATUS_LABELS_AR[status] ?? status;
}

export function formatDateAr(date: Date): string {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatTimeAr(date: Date): string {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function formatCurrencyAr(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    n
  )} ريال`;
}
