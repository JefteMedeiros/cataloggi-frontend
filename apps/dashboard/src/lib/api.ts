import { clearToken, getToken } from "./auth";
import type { ErrorResponseDto, ValidationProblemDetails } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

type FetchInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  redirectOnUnauthorized?: boolean;
};

export class ApiError extends Error {
  status: number;
  details?: ErrorResponseDto | ValidationProblemDetails;

  constructor(status: number, message: string, details?: ErrorResponseDto | ValidationProblemDetails) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function readError(response: Response): Promise<ApiError> {
  const fallback = `${response.status} ${response.statusText}`;

  try {
    const data = (await response.json()) as ErrorResponseDto | ValidationProblemDetails;
    const message =
      "message" in data && data.message
        ? data.message
        : "detail" in data && data.detail
          ? data.detail
          : "title" in data && data.title
            ? data.title
            : fallback;

    return new ApiError(response.status, message, data);
  } catch {
    return new ApiError(response.status, fallback);
  }
}

export async function apiFetch<T>(path: string, init: FetchInit = {}): Promise<T> {
  const token = getToken();
  const { redirectOnUnauthorized = true, ...requestInit } = init;

  const headers: Record<string, string> = {
    ...requestInit.headers,
  };

  if (requestInit.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...requestInit,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    if (redirectOnUnauthorized) {
      window.location.replace("/login");
    }
    throw new ApiError(401, "Não autorizado");
  }

  if (!response.ok) {
    throw await readError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
