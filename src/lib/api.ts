import { getCookie, deleteCookie } from "cookies-next";
import { BASE_URL } from "@/config/env-config";

export const API_BASE_URL = BASE_URL;

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function fetchApi<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers: customHeaders, body, ...customOptions } = options;

  const baseUrlClean = (process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || API_BASE_URL || "").replace(/\/$/, "");
  const endpointClean = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  let url = endpoint.startsWith("http") ? endpoint : `${baseUrlClean}${endpointClean}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = typeof window !== "undefined"
    ? (getCookie("token") as string) || localStorage.getItem("token")
    : undefined;

  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}`, accessToken: token } : {}),
    ...(customHeaders as Record<string, string>),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...customOptions,
      headers,
      body: isFormData ? body : typeof body === "object" ? JSON.stringify(body) : body,
    });
  } catch (netErr: any) {
    console.error("API Network Fetch Error:", netErr);
    const msg =
      netErr?.message === "Failed to fetch"
        ? "Unable to connect to backend server. Please check backend API status."
        : netErr?.message || "Network request failed.";
    throw new Error(msg);
  }

  let data: any = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      deleteCookie("accessToken");
      deleteCookie("token");
      deleteCookie("user");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const firstErrorMessage =
      Array.isArray(data?.errorMessages) && data.errorMessages.length > 0
        ? typeof data.errorMessages[0] === "string"
          ? data.errorMessages[0]
          : data.errorMessages[0]?.message
        : null;

    const errorMessage =
      data?.message ||
      firstErrorMessage ||
      data?.errorMessage ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, any>, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { method: "GET", params, ...options }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { method: "POST", body, ...options }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { method: "PATCH", body, ...options }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { method: "PUT", body, ...options }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { method: "DELETE", ...options }),
};
