export type Role = "SUPER_ADMIN" | "ADMIN" | "FIELD_USER";
export type OperationStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
  createdAt?: string;
  _count?: { operations: number };
}

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface OperationListItem {
  id: string;
  receiptNumber: string;
  customerName: string;
  serviceId: string;
  service: { id: string; name: string };
  quantity: string | number;
  unit: string;
  amount: string | number;
  beneficiaryName: string;
  status: OperationStatus;
  createdBy: { id: string; name: string };
  createdAt: string;
}

export interface OperationDetail extends Omit<OperationListItem, "createdBy"> {
  createdBy: { id: string; name: string; email: string };
  updatedBy?: { id: string; name: string } | null;
  updatedAt: string;
}

export interface Receipt {
  receiptNumber: string;
  date: string;
  time: string;
  customerName: string;
  serviceName: string;
  quantity: number;
  unit: string;
  amount: number;
  amountFormatted: string;
  beneficiaryName: string;
  status: OperationStatus;
  statusLabel: string;
  verificationUrl: string;
  qrCodeDataUrl: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalAmount: number | string;
  totalQuantity: number | string;
  totalOperations: number;
  todayOperations: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface ApiError {
  success: false;
  message: string;
  errors: { path?: string; message: string }[];
}
