"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { DashboardSummary } from "@/types";

export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/dashboard/summary")
      .then((res) => setSummary(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return { summary, loading };
}

export function useDashboardTrends(period: "daily" | "weekly" | "monthly") {
  const [operationsTrend, setOperationsTrend] = useState<{ date: string; count: number }[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<{ date: string; total: number }[]>([]);
  const [serviceDistribution, setServiceDistribution] = useState<
    { serviceName: string; count: number }[]
  >([]);
  const [statusDistribution, setStatusDistribution] = useState<
    { status: string; count: number; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const STATUS_LABELS: Record<string, string> = {
      PENDING: "قيد الانتظار",
      COMPLETED: "مكتمل",
      CANCELLED: "ملغى",
    };
    Promise.all([
      apiClient.get("/dashboard/operations-trend", { params: { period } }),
      apiClient.get("/dashboard/revenue-trend", { params: { period } }),
      apiClient.get("/dashboard/service-distribution"),
      apiClient.get("/dashboard/status-distribution"),
    ])
      .then(([opsRes, revRes, svcRes, statusRes]) => {
        setOperationsTrend(opsRes.data.data);
        setRevenueTrend(revRes.data.data);
        setServiceDistribution(svcRes.data.data);
        setStatusDistribution(
          statusRes.data.data.map((s: any) => ({ ...s, label: STATUS_LABELS[s.status] ?? s.status }))
        );
      })
      .finally(() => setLoading(false));
  }, [period]);

  return { operationsTrend, revenueTrend, serviceDistribution, statusDistribution, loading };
}
