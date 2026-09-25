export const STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد الانتظار",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغى",
};

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export function formatCurrency(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    n || 0
  )} ريال`;
}

export function formatQuantity(qty: number | string, unit = "كجم"): string {
  const n = typeof qty === "string" ? Number(qty) : qty;
  return `${new Intl.NumberFormat("en-US").format(n || 0)} ${unit}`;
}

export function formatDateAr(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

export function formatDateTimeAr(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function toDateInputValue(dateString?: string): string {
  if (!dateString) return "";
  return dateString.slice(0, 10);
}
