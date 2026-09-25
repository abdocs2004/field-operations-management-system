"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { OperationListItem, Pagination } from "@/types";

export interface OperationFilters {
  page: number;
  limit: number;
  search?: string;
  serviceId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  receiptNumber?: string;
}

export function useOperations(initialFilters: Partial<OperationFilters> = {}) {
  const [filters, setFilters] = useState<OperationFilters>({ page: 1, limit: 20, ...initialFilters });
  const [items, setItems] = useState<OperationListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
      );
      const res = await apiClient.get("/operations", { params });
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, reloadKey]);

  const refetch = () => setReloadKey((k) => k + 1);

  return { items, pagination, loading, filters, setFilters, refetch };
}
