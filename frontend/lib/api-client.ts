"use client";

import axios, { AxiosError } from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const savedToken = window.localStorage.getItem("fieldops_token");
    if (savedToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${savedToken}`;
    }
  }
  return config;
});

export interface NormalizedApiError {
  message: string;
  errors: { path?: string; message: string }[];
  status?: number;
}

export function normalizeError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string; errors?: any[] }>;
    return {
      message: err.response?.data?.message ?? "حدث خطأ أثناء تنفيذ العملية",
      errors: err.response?.data?.errors ?? [],
      status: err.response?.status,
    };
  }
  return { message: "حدث خطأ غير متوقع", errors: [] };
}

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window !== "undefined" && axios.isAxiosError(error) && error.response?.status === 401) {
      window.localStorage.removeItem("fieldops_token");
    }
    return Promise.reject(error);
  }
);
