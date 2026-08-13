/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config/env-config";
import { getToken } from "./get-token";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const isRedirectError = (err: any): boolean => {
  return (
    err &&
    typeof err === "object" &&
    "digest" in err &&
    typeof err.digest === "string" &&
    err.digest.startsWith("NEXT_REDIRECT")
  );
};

export interface FetchResponse {
  success: boolean;
  message?: string;
  data?: any;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  meta?: any;
  error?: string | null;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  tags?: string[];
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export const myFetch = async (
  url: string,
  {
    method = "GET",
    body,
    tags,
    token,
    headers = {},
    cache = "force-cache",
  }: FetchOptions = {}
): Promise<FetchResponse> => {
  const accessToken = token || (await getToken());

  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}`, accessToken: accessToken } : {}),
  };

  const pathWithoutQuery = url.split("?")[0];
  const urlSegments = pathWithoutQuery.split("/").filter(Boolean);
  const resource = urlSegments[0];

  const finalTags = tags || (resource ? [resource] : []);

  const fetchOptions: RequestInit = {
    method,
    headers: reqHeaders,
    ...(hasBody && { body: isFormData ? body : JSON.stringify(body) }),
    ...(method === "GET"
      ? {
          cache: cache === "no-store" ? "no-store" : "force-cache",
          next: { tags: finalTags },
        }
      : { cache: "no-store" }),
  };

  try {
    const fullUrl = url.startsWith("http") ? url : `${config.baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
    const response = await fetch(fullUrl, fetchOptions);

    if (response.status === 401 && !url.includes("/auth/admin-login") && !url.includes("/auth/login")) {
      const cookieStore = await cookies();
      cookieStore.delete("accessToken");
      cookieStore.delete("token");
      cookieStore.delete("user");
      redirect("/login");
    }

    const data = await response.json();

    if (response.ok) {
      if (method !== "GET" && resource) {
        try {
          (revalidateTag as any)(resource);
        } catch (revalError) {
          console.error(`[myFetch] Error revalidating tag: "${resource}"`, revalError);
        }
      }

      return {
        success: data?.success ?? true,
        message: data?.message,
        data: data?.data ?? data,
        pagination: data?.pagination || data?.meta,
        meta: data?.meta || data?.pagination,
        error: null,
      };
    }

    const firstErrorMessage =
      Array.isArray(data?.errorMessages) && data.errorMessages.length > 0
        ? typeof data.errorMessages[0] === "string"
          ? data.errorMessages[0]
          : data.errorMessages[0]?.message
        : null;

    const errMsg = data?.message || firstErrorMessage || data?.errorMessage || "Request failed";

    return {
      success: false,
      message: errMsg,
      data: null,
      error: errMsg,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    const netMsg =
      error instanceof Error && error.message === "Failed to fetch"
        ? "Unable to connect to backend server. Please check backend API status."
        : error instanceof Error
        ? error.message
        : "Unknown network error";

    return {
      success: false,
      data: null,
      message: netMsg,
      error: netMsg,
    };
  }
};
