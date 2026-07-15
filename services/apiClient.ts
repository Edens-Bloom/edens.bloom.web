import type { RequestInit } from "next/dist/compiled/@edge-runtime/primitives";

const getAuthHeaders = (): HeadersInit => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("bloom_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseResponse = async (response: Response) => {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message || body?.error || response.statusText;
    throw new Error(message || "API request failed");
  }
  return body;
};

export const apiClient = {
  get: async (path: string) => {
    const response = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      cache: "no-store",
    });
    return parseResponse(response);
  },

  post: async (path: string, body: unknown) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(path, {
      method: "POST",
      headers: {
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...getAuthHeaders(),
      },
      body: isFormData ? body : JSON.stringify(body),
    });
    return parseResponse(response);
  },

  put: async (path: string, body: unknown) => {
    const isFormData = body instanceof FormData;
    const response = await fetch(path, {
      method: "PUT",
      headers: {
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...getAuthHeaders(),
      },
      body: isFormData ? body : JSON.stringify(body),
    });
    return parseResponse(response);
  },

  delete: async (path: string) => {
    const response = await fetch(path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return parseResponse(response);
  },
};
