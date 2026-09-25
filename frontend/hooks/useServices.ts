"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Service } from "@/types";

export function useActiveServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/services/active")
      .then((res) => setServices(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return { services, loading };
}
