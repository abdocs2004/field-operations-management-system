"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useActiveServices } from "@/hooks/useServices";
import { OperationFilters as Filters } from "@/hooks/useOperations";

export function OperationFiltersBar({
  filters,
  onApply,
}: {
  filters: Filters;
  onApply: (filters: Partial<Filters>) => void;
}) {
  const { services } = useActiveServices();
  const [local, setLocal] = useState({
    search: filters.search ?? "",
    dateFrom: filters.dateFrom ?? "",
    dateTo: filters.dateTo ?? "",
    serviceId: filters.serviceId ?? "",
    status: filters.status ?? "",
  });

  const handleSearch = () => onApply({ ...local, page: 1 });
  const handleClear = () => {
    const cleared = { search: "", dateFrom: "", dateTo: "", serviceId: "", status: "" };
    setLocal(cleared);
    onApply({ ...cleared, page: 1 });
  };

  return (
    <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-4 sm:grid-cols-2 lg:grid-cols-6">
      <Input
        placeholder="البحث (رقم السند، العميل...)"
        value={local.search}
        onChange={(e) => setLocal((s) => ({ ...s, search: e.target.value }))}
        className="lg:col-span-2"
      />
      <Input
        type="date"
        placeholder="من تاريخ"
        value={local.dateFrom}
        onChange={(e) => setLocal((s) => ({ ...s, dateFrom: e.target.value }))}
      />
      <Input
        type="date"
        placeholder="إلى تاريخ"
        value={local.dateTo}
        onChange={(e) => setLocal((s) => ({ ...s, dateTo: e.target.value }))}
      />
      <Select value={local.serviceId} onChange={(e) => setLocal((s) => ({ ...s, serviceId: e.target.value }))}>
        <option value="">كل الخدمات</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>
      <Select value={local.status} onChange={(e) => setLocal((s) => ({ ...s, status: e.target.value }))}>
        <option value="">كل الحالات</option>
        <option value="COMPLETED">مكتمل</option>
        <option value="PENDING">قيد الانتظار</option>
        <option value="CANCELLED">ملغى</option>
      </Select>
      <div className="flex gap-2 lg:col-span-6">
        <Button size="sm" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          بحث
        </Button>
        <Button size="sm" variant="outline" onClick={handleClear}>
          <X className="h-4 w-4" />
          مسح الفلاتر
        </Button>
      </div>
    </div>
  );
}
