import axios from "axios";

export type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_PETTOPIA_API_URL || "http://localhost:3000/api/v1";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { token, Authorization: `Bearer ${token}` } : {};
}

export const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.set("token", token, false);
    config.headers.set("Authorization", `Bearer ${token}`, false);
  }
  return config;
});

export const publicApiClient = axios.create({ baseURL: API_BASE_URL });

export const isApiError = axios.isAxiosError;

export function getErrorMessage(error: unknown, fallback = "Đã có lỗi xảy ra"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown } | undefined;
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
